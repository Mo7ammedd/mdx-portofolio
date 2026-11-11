# Backend CV revision and confirmation notes

> Historical editorial review. Superseded by the [repository ownership audit](repository-ownership-report.md) and [final CV review](cv-final-review.md) dated 2026-11-11. The 84-point assessment and selected projects below describe the earlier revision, not the current PDF. The repository-level evidence supports a stronger engineering-level assessment than that earlier review.

Reviewed on 2026-11-11. The edited source is `public/resume.tex`; the distributed document is `public/resume.pdf`. The supplied reference in `public/CVs` is unchanged.

## Independent reassessment

This is an editorial and hiring-screening estimate, not an ATS-system result or a prediction of interview success.

| Category                             | Maximum | Before |  After | Basis for the revised score                                                                                                                         |
| ------------------------------------ | ------: | -----: | -----: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technical skills and relevance       |      20 |     17 |     18 | TypeScript and Go are explicit; Rust is marked as project work. Backend runtimes, data access, stores, infrastructure, and messaging are separated. |
| Work experience and impact           |      20 |     14 |     15 | Component-level contributions and booking-price and subscription-access constraints are clearer. Verified operational outcomes are still limited.   |
| Projects and technical depth         |      15 |     12 |     12 | Three projects demonstrate storage, networking, and application-backend work. No new test or performance evidence was added.                        |
| Writing quality and clarity          |      15 |     10 |     13 | Shorter descriptions, fewer overlapping bullets, and no blanket stability, concurrency, or compliance claims.                                       |
| ATS compatibility, informed estimate |      10 |      8 |      9 | Standard headings, a single text column, plain contacts, searchable words without ligature substitutions, and visible project URLs.                 |
| Formatting and visual hierarchy      |      10 |      6 |      9 | Experience first, wider margins, consistent employer spacing, and an 11-point body over two pages.                                                  |
| Professional credibility             |      10 |      7 |      8 | Unconfirmed numbers are withheld; experimental and academic projects are labeled; product-wide ownership claims are narrowed to implementations.    |
| **Total**                            | **100** | **74** | **84** | Presentation improved; the evidence does not yet justify a 90-point assessment.                                                                     |

The current material supports junior and early mid-level backend interviews. It still does not establish senior-level operational ownership or organizational influence.

## Important before-and-after changes

| Before                                                             | After                                                                         | Reason                                                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Education before experience                                        | Professional Experience, Selected Projects, Technical Skills, Education       | Makes the professional work the first substantive content.                                                      |
| Generic Software Engineer headline                                 | Backend Software Engineer headline                                            | Matches the application focus; actual employment titles remain unchanged.                                       |
| Seven Oblien bullets, including three overlapping Reflx bullets    | Five bullets, with one Reflx description covering ingestion and conversations | Retains the named products and implementation scope.                                                            |
| CarLink backend description plus abstract module-boundary language | Authentication, search, bookings, and retaining booking-time invoice prices   | Uses the existing portfolio's concrete business constraint.                                                     |
| Generic Medica Academy backend maintenance                         | Paymob payments and VdoCipher video access                                    | Uses the existing portfolio's specific integration work.                                                        |
| Separate Rewaaq feature list and generic messaging/caching bullet  | One Rewaaq description with subscription access and supporting infrastructure | Keeps tenant boundaries and the technology choices visible.                                                     |
| ONVO migration, undefined scale, stability, and concurrency claims | Migration, Q&A features, caching, pagination, messaging, and protections      | Describes implemented work without inventing a benchmark or capacity result.                                    |
| Five projects and thirteen project bullets                         | Three projects and six bullets                                                | Retains LSMSharp, AeroUDP, and Aura Decor with their links.                                                     |
| Mixed languages/frameworks and a broad inventory                   | Categorized backend skills with data-access tools                             | Entity Framework Core is supported by local Rewaaq service code; Prisma was already in the CarLink description. |
| Font Awesome contact icons                                         | Plain text contacts and separators                                            | Removes the observed private-font glyph extraction problem.                                                     |
| Ligature substitutions in extracted words                          | Common font ligatures disabled for the XeTeX build                            | Keeps Reflx, workflows, profiles, and filters searchable as ordinary text.                                      |

## Removed or consolidated material

- Reflx's three bullets became one. Ingestion, structured profiles, messaging, sessions, and stateful conversations are retained.
- CarLink's two introductory/backend bullets became one specific implementation bullet. Authentication, the NestJS/TypeScript/Prisma/PostgreSQL stack, search, and bookings are retained.
- Rewaaq's platform bullet and the generic RabbitMQ/Redis/Firebase bullet became one.
- ONVO's migration and scale bullets became one implementation description. The security bullet now also includes messaging details already present in the portfolio.
- Undefined system-stability and high-concurrency assertions were removed.
- The 20%, 150,000+, and 10,000+ figures were withheld pending the confirmations below. This was deliberate, not an accidental loss of achievements.
- HungerStation Microservices was omitted from the selected three because its service/integration scope overlaps with stronger professional examples. It remains on the portfolio. Its existing case study describes unfinished consumer behavior in a particular linked revision.
- SimuKernel's four educational bullets were omitted from the selected three. It remains on the portfolio; LSMSharp and AeroUDP provide more distinctive depth for this backend CV.
- Aura Decor's three bullets became two; the academic label, search, authentication, Stripe, admin interface, RabbitMQ, and Docker are retained.
- Skills not tied to the focus of this version were de-emphasized: C++, Hono, React Native, Next.js, MongoDB, Memcached, OpenResty, gRPC, and the generic CQRS/DDD/SOLID/design-pattern inventory. This is a focused selection, not a finding that the candidate lacks those skills.
- The broad AWS service inventory in Skills was replaced with AWS plus the actual telemetry pipeline components in Experience. IoT Core, Kinesis, Lambda, Timestream, DynamoDB, and SNS/FCM remain visible.
- The Reflx hyperlink was removed after an HTTPS certificate-expiry failure. The product and contribution remain in the CV.

## Claims requiring confirmation

| Original claim or open question                  | Current treatment                                                                      | Confirmation needed                                                                                                                         |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| ONVO load times improved by 20%                  | Number excluded                                                                        | What was measured, which endpoints or pages, the before/after baseline, workload, environment, and measurement source?                      |
| ONVO served 150,000+ users                       | Number excluded                                                                        | Registered accounts, active users, or another population? On what date or over what period? This is not a concurrency measurement.          |
| Airwave reached 10,000+ users in its first week  | Number excluded                                                                        | Registered or active users, launch dates, and the source of the count.                                                                      |
| Led the launch of Airwave                        | Preserved from the original CV                                                         | Clarify the technical and coordination responsibilities personally owned; no new backend ownership was inferred.                            |
| Production rollout of the OBD2 pipeline          | Described as designed, matching the original claim                                     | Confirm which components were deployed and operated before adding production operation or reliability claims.                               |
| Exact ownership boundaries on the named products | Described as feature/runtime/integration implementation, without sole-architect claims | Confirm which components were owned individually and which were shared team work before adding stronger ownership language.                 |
| LSMSharp correctness status                      | Marked experimental; no durability guarantee or benchmark claim                        | The portfolio mentions a recorded compaction integrity failure. A current correctness run is needed before claiming that issue is resolved. |

No coverage percentage, latency result, throughput number, availability figure, test pass count, or production reliability result was invented. Existing testing tools are retained as skills, without assuming professional use or adding test-results claims.

## Validation

- Compiler: Tectonic 0.17.0, using its XeTeX engine.
- Two US Letter pages; 11-point body; 0.6-inch side margins and 0.55-inch top/bottom margins.
- Both final pages rendered and visually inspected.
- No LaTeX font-substitution or overfull-box warnings.
- Default and layout-preserving PDF text extraction checked for reading order, contacts, titles, dates, project names, and skills.
- No private-use characters, replacement characters, or non-ASCII ligature substitutions in the extracted text.
- All PDF text bounding boxes fit inside the page margins.
- All 18 PDF link annotations match their source targets: 16 HTTPS links, one email link, and one telephone link.
- All 16 retained HTTPS targets returned HTTP 200 during the link check; the three selected GitHub repositories are public.
- The excluded Reflx target failed HTTPS certificate verification because its certificate had expired; it was not marked as a working link.
- Titles, employment dates, working arrangements, education dates, the Excellent graduation-project grade, and GDG mentoring were preserved.

Build using Tectonic from the repository root, directing intermediate files outside the source tree:

```sh
mkdir -p /tmp/resume-build
tectonic --keep-logs --outdir /tmp/resume-build public/resume.tex
pdftotext -layout /tmp/resume-build/resume.pdf -
```

The PDFTeX font configuration is retained as an alternative source path, but this revision was built and validated with Tectonic/XeTeX.

## Remaining weaknesses

- Clearer writing cannot substitute for defined, supported engineering-impact measurements.
- The CV still has limited evidence of incident handling, production monitoring, testing ownership, and release/recovery responsibility.
- Airwave's technical ownership and the production status of designed infrastructure need clarification.
- Experimental projects demonstrate mechanisms and learning; their presence is not a production-readiness or correctness guarantee.
