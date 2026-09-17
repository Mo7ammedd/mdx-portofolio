# Anonymous Q&A

The public page is `/ask`. The private inbox is `/ask/inbox`. The same Next.js
project also serves `ask.modev.me/` and `ask.modev.me/inbox` through host-based
rewrites. Main portfolio links return to `www.modev.me` on the subdomain.

Visitors choose a topic and send a question without an account, name, or email.
Questions stay private until an inbox owner publishes an answer. Answers can be
edited, unpublished into the archive, and restored to the inbox. Public visitors
can search, filter by topic, expand answers, and copy a link to a specific answer.
There are no seeded questions or simulated submissions.

## Local development

```sh
node scripts/setup-ask.mjs
npm run dev
```

The setup command adds a randomly generated `ASK_ADMIN_PASSWORD` to the ignored
`.env.local` file, without overwriting existing values. Copy the password from
that file to sign in at `http://localhost:3000/ask/inbox`.

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

1. Create or select a Supabase project. Run
   [`supabase/migrations/202609170001_ask.sql`](../supabase/migrations/202609170001_ask.sql)
   in its SQL editor, or apply it with the Supabase CLI.
2. Set these **server-only** Vercel environment variables:

   | Variable              | Value                                                             |
   | --------------------- | ----------------------------------------------------------------- |
   | `SUPABASE_URL`        | The project URL, e.g. `https://your-project.supabase.co`          |
   | `SUPABASE_SECRET_KEY` | A secret key beginning with `sb_secret_` from Settings → API Keys |
   | `ASK_ADMIN_PASSWORD`  | A unique random password, at least 16 characters                  |

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
password out of `NEXT_PUBLIC_*` variables and source control. Changing the inbox password
invalidates all existing sessions. Local questions are development data; they
are not automatically migrated into Supabase.

Without a working database, production returns an unavailable state and never
reports a successful submission. The form also stays closed until an inbox
password has been configured.

## Storage and access

`lib/ask/storage.ts` provides the file and Supabase REST adapters. The migration
creates `ask_questions`, `ask_rate_limits`, and the atomic
`ask_consume_rate_limit` function. RLS is enabled and access is revoked from
Supabase's anonymous and authenticated roles. Only the server's service role can
access records. Public clients call the Next.js API, which projects only
published question text, topic, answer, publication date, and an opaque ID.

All inbox reads and changes require a signed, eight-hour, HttpOnly session.
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
