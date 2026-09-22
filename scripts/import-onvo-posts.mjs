import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  fetchOnvoPosts,
  insertOnvoQuestions,
  ONVO_POSTS_URL,
  prepareOnvoImport,
  recoverOnvoHistory,
} from '../lib/ask/onvo-import.mjs'

const { values } = parseArgs({
  options: {
    input: { type: 'string' },
    apply: { type: 'boolean', default: false },
    'allow-skipped': { type: 'boolean', default: false },
  },
})

async function sourcePosts() {
  if (values.input) return JSON.parse(await readFile(values.input, 'utf8'))
  const options = {
    onProgress(progress) {
      if (progress.phase !== 'threads' || progress.fetched % 20 === 0) {
        console.log(JSON.stringify(progress))
      }
    },
  }
  const payload = await recoverOnvoHistory(
    await fetchOnvoPosts(options),
    options,
  )
  const directory = join(process.cwd(), '.data', 'ask-imports')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const path = join(directory, `onvo-source-${Date.now()}.json`)
  await writeFile(path, JSON.stringify(payload, null, 2) + '\n', {
    mode: 0o600,
  })
  console.log(`Source snapshot: ${path}`)
  return payload
}

async function main() {
  const source = await sourcePosts()
  const plan = prepareOnvoImport(source)
  console.log(
    JSON.stringify(
      {
        source: ONVO_POSTS_URL,
        fetched: plan.total,
        unique: plan.unique,
        duplicates: plan.duplicates,
        ready: plan.rows.length,
        shortQuestions: plan.shortQuestions,
        skipped: plan.skipped,
        moreAvailable: plan.hasMore,
        pagination: source.pagination,
        recovery: source.recovery,
      },
      null,
      2,
    ),
  )
  if (!values.apply) {
    console.log('Preview only. Add --apply to import these published answers.')
    return
  }
  if (plan.hasMore) {
    throw new Error(
      'The source still has more pages. Fetch the full history before applying it.',
    )
  }
  if (plan.skipped.length && !values['allow-skipped']) {
    throw new Error(
      'Review the skipped source posts, then use --allow-skipped to import the supported answers.',
    )
  }
  const inserted = await insertOnvoQuestions(plan.rows, {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    key:
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
  const directory = join(process.cwd(), '.data', 'ask-imports')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const receipt = {
    source: ONVO_POSTS_URL,
    importedAt: new Date().toISOString(),
    inserted,
    alreadyPresent: plan.rows.length - inserted.length,
    uniqueSourcePosts: plan.unique,
    duplicates: plan.duplicates,
    skipped: plan.skipped,
    pagination: source.pagination,
    recovery: source.recovery,
  }
  const path = join(directory, `onvo-${Date.now()}.json`)
  await writeFile(path, JSON.stringify(receipt, null, 2) + '\n', {
    mode: 0o600,
  })
  console.log(
    `Imported ${inserted.length} answers; ${receipt.alreadyPresent} were already present. Receipt: ${path}`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
