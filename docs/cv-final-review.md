# Final backend/platform CV assessment

Reviewed 11 November 2026. Final source: [resume.tex](../public/resume.tex). Final document: [resume.pdf](../public/resume.pdf).

**Latest follow-up:** LSMSharp now replaces GhostyKey following your request and a local concurrency fix. See [the fix record](lsmsharp-fix.md) for the patch, passing bounded checks, historical failures, and remaining limits. The score stays 89/100; this selection change does not establish production storage maturity.

## Independent rating: 89/100

**89/100 for competitive strong mid-level backend/platform positions.** This is a professional assessment, not an actual ATS result, statistical hiring prediction, or proof of seniority. The original review was 74; the editorial pass was 84; the preceding repository-audit document scored 88. You described the starting CV as approximately 89. This pass improves specificity and corroboration, but it does not justify automatically assigning 90+ because more work was done.

The assessment uses your explicit instruction that work spans Mo7ammedd and Hydralerne, with account-linked lifecycle evidence. It does not independently establish that every change through those accounts was personally yours. Unmapped root authors, imported snapshots, shared implementation, and formal accountability remain qualified in the [ownership report](repository-ownership-report.md).

| Category | Weight | Score | Evidence and limit |
| --- | ---: | ---: | --- |
| Technical skills and relevance | 20 | 18 | Substantial .NET/TypeScript/Go backend, runtime, database, infrastructure, and messaging implementation. Specific mechanisms support breadth; paid expertise in every listed technology is not assumed. Rust/Python remain project work. |
| Work experience and impact | 20 | 18 | Complete products and substantial subsystems are now visible through control-plane, recovery, transaction, integration, and maintenance responsibilities. Historical ONVO/Airwave and Medica Academy code now corroborate previously weak areas. Production scale, business outcomes, and sustained operating accountability remain insufficiently verified. |
| Projects and technical depth | 15 | 13 | Accounting/recovery, experimental storage-engine internals, and networking are complementary and inspectable. LSMSharp now passes targeted local concurrency/functional checks after a documented patch; AeroUDP has fresh bounded tests. No verified production operations; LLMProxy's local SDK block and AeroUDP's fault-matrix limits prevent stronger claims. |
| Writing quality and clarity | 15 | 14 | Direct verbs, mechanism plus purpose, no generic enthusiasm or inflated leadership. Important bullets explain why the implementation matters. The first page still has several product names and dense technical content. |
| ATS compatibility, informed estimate | 10 | 9 | Standard headings, single text column, searchable Unicode text, embedded fonts, consistent roles/dates, and visible project URLs. Reading order and link annotations were checked. No actual ATS engine was used. |
| Formatting and visual hierarchy | 10 | 9 | Two pages at 11 pt, consistent employer spacing, plain contacts, readable project hierarchy, no clipping. All experience fits page one; page two intentionally has more white space. |
| Professional credibility | 10 | 8 | Actual titles/dates retained; no invented metrics, senior title, exclusive authorship, production guarantees, or uncommitted Shopify credit. Formal accountability, alias mapping, self-reported migration chronology, and production outcomes remain limitations. |
| **Total** | **100** | **89** | A strong application document; remaining evidence gaps matter more than further adjective changes or technology additions. |

The one-point difference from the documented 88 reflects recovered period-correct professional source and more precise implementation outcomes, not a change in official seniority. A one-point estimate should not be treated as a precise measurement.

## Assessment against the requested engineering dimensions

| Dimension | Assessment |
| --- | --- |
| Technical depth | Strong. Real storage/network experiments and professional recovery, metering, authorization, runtime, and transactional mechanisms go beyond routine CRUD. LSMSharp’s historical failures and targeted local fixes are explicit; remaining durability/manifest/compaction limits are not concealed. |
| Engineering ownership | Strong mid-level, with broad product/subsystem scope. Openship/Mindwire lifecycle evidence supports full-product technical ownership with collaborative implementation; CarLink supports backend implementation ownership. BytesMap, CareLinker, and Rewaaq have shared boundaries. Formal decision rights are not inferred solely from commits. |
| Architecture | Senior-track technical signals: shared control-plane behavior, external-operation admission/recovery, durable accepted work, bounded resource access, accounting finalization, and authority checks during state changes. This is stronger evidence than service counts or framework labels. |
| Production impact | Mechanisms and deployment/release configurations are substantial. Independently verified traffic, availability, costs, incidents, adoption, and personal on-call responsibility remain weak. Repository-recorded operational checks were found, but they are not promoted to live-production metrics. |
| Project selection | Strong and complementary: LLMProxy, LSMSharp, AeroUDP. LSMSharp was selected after the reproduced defects were fixed locally and targeted checks passed; it remains experimental and the original audit snapshot is unpatched, while the fix is published as e70fe08. GhostyKey is a security-focused alternate; Disk-Mesh is a distributed-storage alternate. |
| Credibility | Wording stays inside the implementation evidence and your supplied account attribution. Test results, CI, self-reported role facts, and production claims are separated. Source security/reliability findings prevent universal guarantees. |
| ATS compatibility | Good informed estimate. Extracted text is selectable, ordered, and free of missing Unicode mappings; dates/headings/contacts are legible. No promise about every commercial parser. |
| Readability | Strong headline and first bullets reveal backend/platform scope quickly. Mechanism plus purpose is clearer than feature inventories. Page one remains busy; removing verified products solely for extra white space would weaken this broad version. |

## Recruiter and senior-engineer screening

**Ten-second impression:** Backend and Platform Software Engineer with deployment/control-plane architecture, Go agent runtime, transactional business backends, and personal systems depth. Official roles and concurrent part-time/full-time work are explicit. The strongest immediate signal is the recovery/coordination work, followed by CarLink backend scope. The main missing signal is independently measured production responsibility and outcomes.

**Hiring recommendation: Yes for strong mid-level backend/platform interviews.** The evidence supports substantial independent delivery, maintaining real code across a product lifecycle, and selected senior-level technical execution. Appropriate targets include Backend Engineer (.NET/TypeScript), Backend and Platform Engineer, Control-Plane/Deployment Engineer, Developer Tools Engineer, and Agent Runtime Engineer.

**Senior-track competitiveness:** credible for a hands-on architecture/implementation interview. A full senior hiring decision remains conditional on production accountability, architectural decision rights, incident reasoning, collaboration, and influence beyond one's own implementation. Code depth is not the same as organizational leadership; no Senior/Lead title was added.

A senior screener should explore live-owner versus orphan detection, uncertain external effects, restart reconciliation, permission revocation, payment/enrollment transaction boundaries, booking races, quota finalization, and protocol failure behavior. The report identifies real limitations to discuss rather than inventing guarantees.

**Strongest section:** Professional Experience, particularly Openship/Oblien platform mechanisms and CarLink backend implementation scope. **Weakest evidence area:** measured production impact and formal technical accountability. ONVO/Airwave is now source-corroborated, but its sparse history and test maturity remain weaker than the newer platforms.

## Most important changes

All 20 original and final bullets, with individual reasons, are in [the before/after comparison](cv-before-after.md). Examples:

| Before | After | Improvement |
| --- | --- | --- |
| “Implemented cross-process deployment locks, durable execution receipts, interrupted-build recovery, and rollback from saved release configurations.” | “Engineered deployment coordination and recovery using PostgreSQL advisory locks, durable execution receipts, and release snapshots to serialize host operations and recover interrupted builds without reclaiming live workers' resources.” | States the responsibility and recovery problem, not just the mechanism inventory. Release gates remain in the full bullet. |
| “Built Firecracker VM lifecycle management, restart policies, state reconciliation, and network access controls...” | VM lifecycle/network policies plus billing-aware recovery with quota rechecks and stop tokens to avoid restarting manually stopped workspaces. | Makes an inspectable operational requirement visible without claiming uptime or fleet scale. |
| “Integrated Paymob payments and VdoCipher video access for Medica Academy.” | Checkout/webhooks connected to enrollment/playback, transactional enrollment creation, and lesson-access checks before credentials. | Newly recovered source supports concrete integration and consistency work; no atomic whole-payment-flow guarantee. |
| “Led the launch of Airwave, a podcast and music streaming app.” | “Built Airwave's Node.js backend for music/podcast playback, with playlists and WebSocket listening rooms that synchronize playback state across connected clients.” | Replaces unverified app-wide leadership with historical backend implementation. |
| GhostyKey secret-sharing and SQL lifecycle bullets. | LSMSharp WAL/skip-list/SSTable/compaction implementation, prefix encoding/GZip/block caching, replay, and bounded concurrency/reopen tests. | Adds complementary storage-engine depth after fixing the reproduced local failures. Experimental classification and the distinction between the original snapshot and published correction remain explicit. |

## Removed, narrowed, and consolidated material

- Reflx remains one product-level bullet. Uncommitted Shopify work still receives no CV credit.
- Mindwire pairing/stream details, BytesMap SSH query access, and additional platform lifecycle mechanisms remain in the report but are consolidated in the CV to prioritize the hardest ownership and recovery problems.
- ONVO's generic feed-caching/cursor wording is narrowed to capped followed-user queries, timestamp pagination, and Redis session/context lookups. Broad DoS/XSS protection becomes the controls actually present.
- Rewaaq's ambiguous attempt snapshots become persisted question selection; the source does not freeze mutable question text.
- Airwave launch leadership is replaced with verified backend scope. Official title/dates are unchanged.
- The generic Engineering concepts skill row is removed because the experience demonstrates those concepts. Infrastructure and CI/CD are combined; NUnit/Postman/FCM are removed from the skills inventory, while push work remains in Experience. Important supported backend languages/frameworks/databases remain.
- At your subsequent request, GhostyKey was replaced by LSMSharp after the local concurrency fixes and targeted validation. [The project ranking](project-ranking.md) reflects that change; the original published failure record is preserved. Aura Decor remains omitted.
- Unsupported 20%, 150,000+, and 10,000+ figures, AWS telemetry deployment claims, blanket compliance, and production-grade experimental-system claims remain withheld. They are not declared false; they need supporting evidence.
- No employment title/date, work arrangement, contact, education date, graduation grade, mentoring statement, or working link was changed. All named professional products remain represented.

## Remaining gaps and confirmations

**Critical for external ownership claims:** confirm personal responsibility boundaries for architecture/release/runtime/ingestion work across the two supplied accounts, and identify any root/imported authors that truly represent you. The report uses your attribution instruction but cannot independently establish personal accountability for every source change.

**High impact for senior-track applications:** document which services you personally deploy, monitor, support, and recover; attach bounded workload/cost/incident outcomes and design decisions where available. Recorded quota/deployment checks are now documented, but they do not establish sustained production responsibility. Actual formal architecture/release decision rights and workplace review/mentoring influence would improve senior-level confidence.

**Technical limits:** The original LSMSharp snapshot failed two integrity runs. The documented local patch now passes the functional suite and strict regression checks; per-write fsync, crash-safe manifests, arbitrary concurrent flush/compaction, and production operation remain unproven. CareLinker's OTP response behavior, CarLink refresh-rotation concurrency, Medica Academy's separate payment/enrollment transactions, HMAC bypass flag, and source-embedded provider credential prevent broad security/reliability guarantees. No fixes were made to those professional applications; the user-authorized LSMSharp local patch is documented separately. LLMProxy's fresh local test run remains environment-blocked despite observed successful pinned-head CI; GhostyKey's browser E2E was not rerun.

**Optional refinement:** choose Disk-Mesh for a storage-specific application or cbox/apigo for a targeted systems/tooling role, using the explicit ranking. Do not add another generic technology inventory or shrink the body text. LSMSharp is now selected after targeted correction; the published patch supports external verification; broader durability validation would strengthen it further. It is not described as production-ready.

## Five highest-impact improvements delivered

1. Turned coordination/recovery inventories into ownership statements with the failure condition and intended result.
2. Recovered historical ONVO/Airwave and Medica Academy source, replacing weakly supported descriptions with implementation evidence.
3. Made business consistency and current-access checks explicit across CarLink, Rewaaq, CareLinker, and Medica Academy.
4. Revalidated project selection using source and bounded tests, then added storage-engine depth after locally correcting and documenting the reproduced failures.
5. Kept a clear backend/platform headline, actual roles, concise skills, two pages, and readable 11-point text without invented metrics or seniority.

## Final document validation

The final PDF was rebuilt with Tectonic 0.17.0/XeTeX. Both rendered pages were visually inspected after the final source revision. The checks actually run are recorded in [cv-validation.json](cv-validation.json):

- Exactly two letter-size pages; 11-point body text; 681 extracted words.
- No LaTeX overflow/font warnings, clipped text, missing glyph mappings, or orphaned skill-list line. Host Fontconfig emitted configuration warnings; all three Latin Modern faces are embedded with Unicode mappings in the PDF.
- Plain and layout text extraction checked: header, Professional Experience, Selected Projects, Technical Skills, Education, in that order. All three employers remain on page one; all three projects are on page two.
- Titles, dates, arrangements, contacts, and education compared with the pre-pass source and preserved.
- All 18 PDF link annotations match the source URI set. All 16 HTTPS destinations returned 200; The LSMSharp destination was checked after substitution; the earlier AeroUDP check required one retry after a connection reset. Email and phone links were checked for correct URI values, not contacted.
- The final LSMSharp follow-up built its engine/demo and ran isolated correctness checks; no website/application deployment was performed. Project execution states are separately recorded in [repository-test-results.json](repository-test-results.json); local tests, observed CI, recorded results, failures, and environment blocks are not conflated.
- Task-owned PostgreSQL/Redis containers and the dedicated Docker network were removed after testing. Existing unrelated edits were preserved. LSMSharp’s authorized code changes and untouched pre-existing mode changes are documented separately.

## Deliverables

- [Final PDF](../public/resume.pdf) and [updated LaTeX source](../public/resume.tex).
- [Repository ownership / engineering-level report](repository-ownership-report.md).
- [Inventory with explicit investigation depth](repository-inventory.json): 126 requested-owner repositories plus 48 separately marked related-owner discovery records.
- [Personal-project ranking and selection rationale](project-ranking.md).
- [All 20 before/after bullet comparisons](cv-before-after.md).
- [Exact test states](repository-test-results.json) and [document validation](cv-validation.json).
