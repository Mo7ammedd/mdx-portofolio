import { randomBytes } from 'node:crypto'
import { readFile, writeFile, chmod } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'

const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--email')) {
  throw new Error('Usage: node scripts/setup-ask.mjs --email you@example.com')
}
const email = args[1]?.trim().toLowerCase()
if (
  email !== undefined &&
  (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
) {
  throw new Error('Enter a valid admin email address.')
}

const path = resolve('.env.local')
let existing = ''
try {
  existing = await readFile(path, 'utf8')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const configured = parseEnv(existing)
const updates = {}
if (!configured.ASK_ADMIN_PASSWORD)
  updates.ASK_ADMIN_PASSWORD = randomBytes(24).toString('base64url')
if (!configured.ASK_ADMIN_EMAIL && email) updates.ASK_ADMIN_EMAIL = email

for (const [key, value] of Object.entries(updates)) {
  const line = `${key}=${JSON.stringify(value)}`
  const expression = new RegExp(`^\\s*${key}\\s*=.*$`, 'm')
  existing = expression.test(existing)
    ? existing.replace(expression, () => line)
    : `${existing}${existing.endsWith('\n') || !existing ? '' : '\n'}${line}\n`
}

if (Object.keys(updates).length) {
  await writeFile(path, existing, { mode: 0o600 })
  await chmod(path, 0o600)
  console.log(
    `Added ${Object.keys(updates).join(', ')} to .env.local. Existing credentials were preserved.`,
  )
}
if (!configured.ASK_ADMIN_EMAIL && !email) {
  console.log(
    'Add ASK_ADMIN_EMAIL to .env.local, or rerun with --email you@example.com.',
  )
}
if (
  configured.ASK_ADMIN_PASSWORD &&
  configured.ASK_ADMIN_PASSWORD.length < 10
) {
  console.log(
    'The existing local password is shorter than 10 characters; it was preserved but cannot be used to sign in locally.',
  )
}
