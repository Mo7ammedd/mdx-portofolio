import { randomBytes } from 'node:crypto'
import { readFile, writeFile, chmod } from 'node:fs/promises'
import { resolve } from 'node:path'

const path = resolve('.env.local')
let existing = ''
try {
  existing = await readFile(path, 'utf8')
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

if (/^\s*ASK_ADMIN_PASSWORD\s*=/m.test(existing)) {
  console.log('ASK_ADMIN_PASSWORD already exists in .env.local; left unchanged.')
} else {
  const password = randomBytes(24).toString('base64url')
  await writeFile(path, `${existing}${existing.endsWith('\n') || !existing ? '' : '\n'}\n# Private Q&A inbox. Never commit this file.\nASK_ADMIN_PASSWORD=${password}\n`, { mode: 0o600 })
  await chmod(path, 0o600)
  console.log('Added a generated inbox password to .env.local. Copy it from that file to sign in at /ask/inbox.')
}
