# Anonymous Q&A

The public page is `/ask`. The private inbox is `/ask/inbox`. The same Next.js
project also serves `ask.modev.me/` and `ask.modev.me/inbox` through host-based
rewrites. Main portfolio links return to `www.modev.me` on the subdomain.

Visitors send a question without an account, name, or email. New questions use
the General topic; the inbox owner can choose a topic while publishing an answer.
Questions stay private until an inbox owner publishes an answer. Answers can be
edited, unpublished into the archive, and restored to the inbox. Public visitors
can search, filter by topic, expand answers, and copy a link to a specific answer.
Search and topic filters open from the answer list’s Search button.
Published answers can also be imported from Onvo; there are no simulated submissions.

The portfolio homepage previews the most recently published answer and links to
its full question on Ask. It reads the same public API after the static homepage
loads, and refreshes when the visitor returns to the tab. If there are no answers
or Ask is unavailable, it keeps an invitation to ask a question. Drafts and
archived questions are excluded by the public API. The homepage does not depend
on the question database during its build or initial response.

Shared answer links include `?question=<id>` as well as the scroll anchor, so
social crawlers receive that question's title, answer excerpt, and a dedicated
Open Graph image at `/og/ask/<id>`. The main Ask page uses its own invitation
card for both Open Graph and Twitter. Old anchor-only links still open answers
in the browser, but crawlers cannot see anchors; copy a fresh link to share a
question-specific preview. Preview images only read published answers and are
not cached by the app, so archiving removes access to the image. Social sites
may retain previews they have already fetched.

## Local development

```sh
node scripts/setup-ask.mjs --email you@example.com
npm run dev
```

The setup command adds `ASK_ADMIN_EMAIL` and a randomly generated
`ASK_ADMIN_PASSWORD` to the ignored `.env.local` file, preserving existing
credentials. Sign in at `http://localhost:3000/ask/inbox` with those values.
The inbox accepts only the configured admin email and password. Email matching
ignores capitalization and surrounding spaces; passwords are matched exactly.
To use your own password, set `ASK_ADMIN_PASSWORD` in `.env.local` to a value
between 10 and 256 characters, then restart the development server.

When Supabase is not configured, development saves questions in the ignored
`.data/ask.json` file. Writes are serialized in the development server and saved
with an atomic rename. This fallback is only for one local development server;
it is disabled in production and on Vercel. Questions and rate limits survive
local restarts. Local question files are also excluded from deployment bundles.
A Supabase connection takes precedence when both credentials are
set. Partially configured connections fail closed instead of using a local file.

For a local subdomain preview, open `http://ask.localhost:3000` and
`http://ask.localhost:3000/inbox` in a browser that resolves `.localhost` names.

## Supabase and Vercel

1. Create or select a Supabase project. Run the SQL files in
   [`supabase/migrations`](../supabase/migrations) in timestamp order using its
   SQL editor, or apply them with the Supabase CLI.
2. Set these **server-only** Vercel environment variables:

   | Variable              | Value                                                             |
   | --------------------- | ----------------------------------------------------------------- |
   | `SUPABASE_URL`        | The project URL, e.g. `https://your-project.supabase.co`          |
   | `SUPABASE_SECRET_KEY` | A secret key beginning with `sb_secret_` from Settings → API Keys |
   | `ASK_ADMIN_EMAIL`     | The email address allowed to sign in to the private inbox         |
   | `ASK_ADMIN_PASSWORD`  | A unique password, between 10 and 256 characters                 |

3. Deploy this Next.js project. Vercel's Node.js runtime handles all database
   requests; there is no separate backend to deploy.
4. Add `ask.modev.me` to **Vercel → Project → Settings → Domains** and create the
   DNS record shown by Vercel. The host rewrites are already in `next.config.mjs`.
5. Open `https://ask.modev.me/inbox`, sign in, and publish an answer to a question
   you submit through the public form.

The existing `NEXT_PUBLIC_SUPABASE_URL` variable is also accepted for the URL.
The server supports a legacy `SUPABASE_SERVICE_ROLE_KEY` as an alternative to
`SUPABASE_SECRET_KEY`. A publishable key is not used for inbox access: the
question tables are private, and all access goes through the Next.js server.

Use a separate Supabase project for preview deployments if you do not want
preview questions mixed into the live inbox. Keep the secret key and inbox
credentials out of `NEXT_PUBLIC_*` variables and source control. Changing the
admin email or password invalidates all existing sessions. When upgrading from
the password-only inbox, add `ASK_ADMIN_EMAIL` and keep the existing password;
sign in again with both fields after deployment. Local questions are development data; they
are not automatically migrated into Supabase.

Without a working database, production returns an unavailable state and never
reports a successful submission. The form also stays closed until an inbox
email and password have been configured.

## Import published Onvo answers

Apply [`202609230001_onvo_imports.sql`](../supabase/migrations/202609230001_onvo_imports.sql)
before importing. It adds a unique source identifier and allows short historical
questions only when marked as imports. New portfolio submissions still require
at least 15 characters.

```sh
node --env-file=.env.local scripts/import-onvo-posts.mjs
node --env-file=.env.local scripts/import-onvo-posts.mjs --input /path/from-preview.json --apply --allow-skipped
```

The first command starts at `https://api.onvo.me/v3/users/mo/posts?limit=20`
and follows every `next_cursor` until `has_more` is false; 20 is the page size.
It handles rate limits and rejects broken or repeated cursors. When legacy
profile pages repeat records because their date order differs from their ID
order, it checks the older feed using its stable ID cursor. Every recovered
candidate must also be available from its public thread. Full threads restore
question text omitted by the profile response, including legacy Q&A pairs
without parent IDs.

The preview prints counts and skipped entries, then saves a source snapshot
under the ignored `.data/ask-imports/` directory. Pass that printed path to
`--input` to import the same reviewed data without fetching it again. No Onvo
bearer token is needed. An input file with more pages remaining cannot be
applied. `--allow-skipped` acknowledges entries that cannot be represented as
text Q&A, such as media questions, standalone posts, and other users' reposts.

Imports preserve the original text and question/answer dates. They exclude
sender identities and report unsupported content instead of truncating it or
inventing a replacement. Repeating an import skips existing source records,
preserving any edits or archive actions made in the inbox. A receipt is saved
under the ignored `.data/ask-imports/` directory. Direct database imports do not
send new-question notification emails.

## New-question emails

Notifications use Resend’s HTTP API and require no additional runtime service
or SMTP connection. Set these variables in **Vercel → Production**:

| Variable                  | Value                                            |
| ------------------------- | ------------------------------------------------ |
| `RESEND_API_KEY`          | An API key allowed to send email through Resend  |
| `ASK_EMAIL_NOTIFICATIONS` | `true` to enable notifications                   |
| `ASK_EMAIL_FROM`          | A sending address on a domain verified in Resend |

Notifications go only to `ASK_ADMIN_EMAIL`. For testing with the email registered
on your Resend account, `ASK_EMAIL_FROM` can be `onboarding@resend.dev` (the default).
Use a verified sending domain for other recipients. Redeploy after changing these
environment variables. The old `EMAIL_USER`/`EMAIL_PASS` variables are not used.

A question is saved before Next.js schedules its email with `after()`, which keeps
the Vercel function alive after returning the submission response. Email failures
do not discard a question or report a failed submission. A transient failure gets
one retry with a stable idempotency key, preventing duplicate messages if the
first request times out after sending. Final failures are recorded in server logs;
there is no persistent retry queue. The private inbox remains the source of truth.

Emails contain the question, its topic, and a link that opens the corresponding
question and answer editor after sign-in. They never contain the admin password,
API credentials, or visitor IP addresses. Question text is escaped in the HTML
email and also included in a plain-text version.

Notifications are off unless explicitly enabled. Vercel preview deployments never
send them, even if credentials are present. Leave `ASK_EMAIL_NOTIFICATIONS=false`
when using local fixtures or testing the UI.

## Storage and access

`lib/ask/storage.ts` provides the file and Supabase REST adapters. The migration
creates `ask_questions`, `ask_rate_limits`, and the atomic
`ask_consume_rate_limit` function. RLS is enabled and access is revoked from
Supabase's anonymous and authenticated roles. Only the server's service role can
access records. Public clients call the Next.js API, which projects only
published question text, topic, answer, publication date, and an opaque ID.

Next.js validates the configured admin email and password on the server.
Supabase stores questions and rate limits. All inbox reads and changes require
a signed, eight-hour, HttpOnly session bound to that admin configuration.
Cookies use SameSite=Strict and Secure in production. API responses are never
cached. Mutations check the request origin, bound the request body, and validate
content again on the server. An unanswered or archived question is never included
in public API responses or public page data.

Submissions and sign-in attempts each allow five requests per 15 minutes.
Supabase enforces limits atomically across Vercel instances. The limiter HMACs
the Vercel-provided client IP with the private inbox password; raw addresses are
not saved in the question database. Non-Vercel hosts share a conservative rate
bucket because arbitrary forwarding headers are not trusted. A hidden field
also catches basic form bots. This does not replace a CAPTCHA for sustained
distributed abuse.

Q&A and inbox pages do not load Google Analytics or Clarity. Q&A navigation uses
full page loads so portfolio session-replay scripts cannot carry into the form.
Inputs are additionally marked for Clarity masking. Hosting providers can still
maintain their own request logs; anonymity here means no visitor account or
identity fields, not anonymity from the hosting infrastructure.

The inbox is excluded from search indexing. That exclusion is supplementary;
authentication and database permissions enforce privacy.
