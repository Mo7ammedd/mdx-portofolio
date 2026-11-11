# CV before/after comparison

Comparison with the delivered CV at the start of this optimization pass, reviewed 11 November 2026. These are the actual original and final bullets, not invented examples. Employer titles/dates, work arrangements, contact details, education, and the three-project limit are preserved.

## 1. Openship control plane

**Original:** Designed and evolved Openship's TypeScript/Hono control plane, sharing deployment operations across API, SDK, CLI, and desktop clients for local, SSH, and cloud targets.

**Improved:** Designed and maintained Openship's TypeScript/Hono control plane, giving API, SDK, CLI, and desktop clients shared authorization and deployment behavior across local, SSH, and cloud targets.

**Reason:** Makes shared authorization/deployment behavior across clients explicit and uses a direct maintenance verb. Full lifecycle evidence supports product-level scope; formal accountability remains qualified in the report.

## 2. Openship deployment recovery

**Original:** Implemented cross-process deployment locks, durable execution receipts, interrupted-build recovery, and rollback from saved release configurations. Added release gates with unit and Docker integration tests.

**Improved:** Engineered deployment coordination and recovery using PostgreSQL advisory locks, durable execution receipts, and release snapshots to serialize host operations and recover interrupted builds without reclaiming live workers' resources. Added release gates with Docker integration tests.

**Reason:** Names the lock mechanism and the recovery problem: distinguish a live owner from interrupted work. Durable receipts and release snapshots describe recovery without promising distributed ACID or zero downtime.

## 3. Mindwire runtime

**Original:** Built Mindwire's Go agent runtime and TypeScript SDK: session orchestration, streamed events, retry-safe turn requests, restart reconciliation, and device pairing across local, SSH, and Docker execution.

**Improved:** Built Mindwire's Go runtime and TypeScript SDK for local, SSH, and Docker agents; persisted turn receipts before execution to deduplicate retries and reconciled unfinished runs after daemon restarts.

**Reason:** Replaces a session-feature list with persisted turn identity, duplicate suppression, and restart reconciliation. Pairing and streaming remain source-supported details in the report, consolidated to keep one readable runtime bullet.

## 4. BytesMap backend and ingestion

**Original:** Developed BytesMap's bounded database queries, SSH access, encrypted credentials, and scheduled reports with transactional worker claims. Built Go event ingestion using NATS JetStream and ClickHouse.

**Improved:** Developed BytesMap's query/reporting backend with connection leases, row/byte/time limits, encrypted credentials, and transactional report claims. Built Go ingestion that acknowledges events after durable JetStream publication and indexes them in ClickHouse.

**Reason:** Explains resource bounds, encrypted access, worker admission, and the durable ingestion boundary. JetStream acceptance is deliberately distinguished from ClickHouse indexing.

## 5. Firecracker / cloud recovery

**Original:** Built Firecracker VM lifecycle management, restart policies, state reconciliation, and network access controls for Oblien's execution infrastructure.

**Improved:** Built Firecracker VM lifecycle and network policies; implemented billing-aware capacity recovery with quota rechecks and stop tokens to avoid restarting manually stopped workspaces.

**Reason:** Adds a concrete recovery requirement: funding restoration must not undo a manual stop. VM lifecycle/network policy stays visible; fleet scale and isolation certification are not implied.

## 6. Reflx backend

**Original:** Implemented Reflx's Express/Prisma backend for profile ingestion and streamed conversations, with persisted session history and WhatsApp integration.

**Improved:** Developed Reflx's Express/Prisma backend from profile ingestion through agent conversations and WhatsApp integration, retaining guest/member session state and conversation history across requests.

**Reason:** Keeps one coherent product-level statement and explains persistent guest/member conversation state. Uncommitted Shopify work still receives no CV credit.

## 7. CarLink backend scope

**Original:** Owned CarLink's NestJS/Prisma/PostgreSQL backend implementation, from authentication and vehicle integrations to booking and workshop workflows. Used conditional state updates and booking-time price snapshots to preserve business rules.

**Improved:** Owned CarLink's NestJS/Prisma/PostgreSQL backend implementation across authentication, vehicle integrations, bookings, and workshop operations. Used conditional status updates to enforce booking transitions and retained quoted prices for invoicing.

**Reason:** Retains backend ownership while spelling out two business consistency mechanisms: conditional booking transitions and quoted prices used in invoicing. CTO scaffold/larger product responsibility stays distinct in the report.

## 8. CarLink privacy/audit

**Original:** Implemented CarLink consent and deletion workflows, append-only audit records, and log retention; maintained schema migrations and PostgreSQL-backed CI tests.

**Improved:** Implemented CarLink consent/deletion workflows, append-only audit ledgers, and retention controls to keep administrative and privacy actions traceable; maintained migrations and PostgreSQL-backed CI tests.

**Reason:** Connects audit and retention mechanisms to traceability while retaining migrations and real PostgreSQL-backed CI. No blanket compliance claim is added.

## 9. Rewaaq quizzes and deployment

**Original:** Developed Rewaaq's .NET 10 course and quiz APIs with subscription-scoped access, attempt snapshots, timed submission, and grading. Built GitLab deployment pipelines with health checks and rollback for its authentication and application APIs.

**Improved:** Developed Rewaaq's .NET 10 course/quiz APIs with subscription-scoped access, persisted question selection, grading, and server-enforced attempt deadlines. Built GitLab deployment pipelines with health checks and rollback for authentication and application services.

**Reason:** Corrects ambiguous attempt snapshots to persisted question selection. Selection/order is stored, but mutable question content is not frozen. Health-check/rollback deployment responsibility remains visible.

## 10. CareLinker subsystems

**Original:** Built CareLinker patient/case and messaging subsystems in NestJS/PostgreSQL, with record-level authorization, transactional updates, encrypted document storage, and REST/Socket.IO conversation history.

**Improved:** Built CareLinker patient/case and messaging subsystems with record-level authorization, transactions, and encrypted uploads; persisted conversation history and rechecked case access for REST/Socket.IO messaging.

**Reason:** Shows the access boundary being rechecked for REST and Socket.IO work rather than only listing chat features. NestJS/PostgreSQL remain supported in the report/skills, without repeating the stack in every bullet.

## 11. Medica Academy integrations

**Original:** Integrated Paymob payments and VdoCipher video access for Medica Academy.

**Improved:** Connected Medica Academy's Paymob checkout/webhooks to course enrollment and VdoCipher playback, with transactional enrollment creation and lesson-access checks before issuing video credentials.

**Reason:** Historical source now corroborates payment, transactional enrollment creation, and video-access checks. The wording does not imply one atomic payment-to-enrollment transaction or guaranteed callback reconciliation.

## 12. ONVO migration/feed

**Original:** Reworked ONVO's Q&A backend from PHP to Express.js. Implemented anonymous questions, threaded replies, and personalized feeds with Redis caching and cursor pagination.

**Improved:** Reworked ONVO's PHP backend in Express.js, including anonymous Q&A, threaded replies, and followed-user feeds with capped queries and timestamp-based pagination.

**Reason:** Historical source supports capped followed-user queries and timestamp pagination. It does not justify generic feed caching, stable composite cursors, or backdating newer Hono implementation.

## 13. ONVO messaging/middleware

**Original:** Added direct messaging with replies and media attachments, mobile push notifications, and backend protections against DoS and XSS attacks.

**Improved:** Implemented messaging permissions, replies/media, and push notifications; used Redis session/context lookups and rate limits, request-size limits, and XSS middleware around backend endpoints.

**Reason:** Replaces an unbounded DoS/XSS protection claim with actual permissions, Redis context/rate limits, request-size limits, and middleware. Controls are not represented as proof of attack immunity.

## 14. Airwave backend

**Original:** Led the launch of Airwave, a podcast and music streaming app.

**Improved:** Built Airwave's Node.js backend for music/podcast playback, with playlists and WebSocket listening rooms that synchronize playback state across connected clients.

**Reason:** Replaces unsupported launch leadership with period-correct backend implementation: playlists and state synchronization in WebSocket rooms. No adoption metric or management responsibility is invented.

## 15. LLMProxy admission

**Original:** Built a multi-provider LLM gateway with atomic Redis rate limits and SQL token/spend reservations; made usage finalization idempotent under concurrent requests.

**Improved:** Designed a gateway with 10 provider adapters, atomic Redis rate limits, and SQL token/spend reservations to enforce shared allowances under concurrent requests.

**Reason:** Adds the verified registry count and clarifies concurrent shared allowance enforcement. Ten adapters are not ten live provider accounts tested.

## 16. LLMProxy accounting/recovery

**Original:** Implemented provider failover before stream delivery, conservative recovery of abandoned reservations, and PostgreSQL/Redis integration tests with CI recovery drills.

**Improved:** Made usage finalization idempotent and recovered abandoned reservations conservatively; limited failover to before the first stream event to avoid replaying partial responses. Added PostgreSQL/Redis integration tests and CI recovery drills.

**Reason:** States why failover stops after stream delivery and how accounting recovery works. CI/integration implementation and observed CI remain distinct from the blocked fresh local test attempt.

## 17. GhostyKey crypto boundary

**Original:** Built encrypted secret sharing with browser-side AES-GCM and decryption keys in URL fragments. Stored ciphertext and hashed access/deletion tokens on the server.

**Improved:** Built browser-encrypted secret sharing with AES-GCM and fragment-only decryption keys; the server stores ciphertext and hashed read/deletion capabilities.

**Reason:** Names the server/client capability boundary in direct language. The implementation does not amount to a comprehensive security certification.

## 18. GhostyKey SQL lifecycle

**Original:** Enforced expiration and view limits in a PostgreSQL transaction; added tests for concurrent consumers, expiry after lock waits, and separate deletion permissions.

**Improved:** Serialized consumption, expiry checks, and deletion in PostgreSQL transactions. Verified single-use consumption with 20 concurrent readers and expiry after lock waits in database tests.

**Reason:** Adds the fresh, bounded concurrency result: 20 readers of a single-use secret and expiry after lock waits. It does not turn a database test into production throughput.

## 19. AeroUDP protocol

**Original:** Built ordered delivery over UDP with sequence numbers, acknowledgements, retransmission, and sliding windows.

**Improved:** Implemented experimental ordered UDP transport with sequence-numbered packets, acknowledgements, sliding windows, retransmission, and out-of-order buffering.

**Reason:** Keeps the protocol experimental and retains concrete sequence, acknowledgement, window, retransmission, and buffering mechanisms.

## 20. AeroUDP recovery/verification

**Original:** Implemented TCP-inspired congestion control and RTT-based retransmission timeouts, with separate limits for network congestion and receiver capacity.

**Improved:** Added TCP-inspired congestion recovery, RTT-based timeouts, and separate receiver/congestion windows; verified codec properties, connection handshakes, and loopback transfers with Rust tests.

**Reason:** Preserves networking depth, separates receiver/congestion windows, and names the test paths actually exercised. No TCP-equivalence, WAN benchmark, or universal fault-recovery guarantee is implied.

## Consolidation and omissions

- Removed the broad Engineering concepts skill row; the CV demonstrates those concepts through actual mechanisms instead. Combined infrastructure and CI/CD into one concise category. Languages, backend, databases/caching, and data access remain distinct.
- Removed low-value NUnit/Postman/FCM skill-list entries from this version. Push notification work remains in Experience. Rust and Python remain explicitly project work; no paid production expertise is inferred from a skills label.
- Device pairing, streamed progress, SSH query access, and restart/reconciliation details remain in the evidence report but are consolidated rather than individually enumerated in the CV. No important whole product was removed.
- Replaced “Led the launch” for Airwave with verified backend scope. Replaced broad security outcomes with concrete controls. Narrowed Rewaaq snapshot wording to what is actually persisted.
- No additional project was dropped in this pass. LLMProxy, GhostyKey, and AeroUDP were reselected after fresh comparison; [the ranking](project-ranking.md) explains the alternatives, including LSMSharp’s reproduced integrity failure.
- Historical unsupported percentages/user counts, AWS telemetry deployment claims, universal compliance claims, and uncommitted Reflx Shopify attribution remain withheld. They are not declared false; they need evidence before external use.

Architecture/ownership support and limitations are in the [ownership report](repository-ownership-report.md). Exact execution states are in the [test record](repository-test-results.json).
