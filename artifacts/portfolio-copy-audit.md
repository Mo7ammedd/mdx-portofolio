# Portfolio copy audit

Reviewed on September 25, 2026 against local commit `2fa9c9c` and the public Q&A response available during the review.

**Implementation update — September 25, 2026:** Applied all 36 non-résumé finding groups: H01–H03, H07–H18, P01–P06, and P11–P25. The changes cover 24 source files and 8 image assets. H04–H06 and P07–P10 were excluded as requested; `public/resume.tex` and `public/resume.pdf` retain their original SHA-256 checksums. Text classified as natural, including the README and portfolio documentation, remains unchanged. The factual questions in section 5 remain flagged.

Four public answers were updated and twelve exact `test`/`testt` replies were archived. The archive now contains 531 published answers. Archived records retain their content, and original question text, topics, and publication dates were preserved. All other public answers were checked and remain unchanged. The rollback snapshot and operation journal are saved locally in the ignored `.data/portfolio-copy-qa-backup.json` and `.data/portfolio-copy-qa-applied.json` files. These Q&A changes are live; the website source and image changes are saved locally.

**Validation:** Lint, all 95 tests, and the production build pass. All 159 fenced code examples across seven articles are unchanged. Browser checks covered desktop and 390px mobile layouts, all six project pages and seven articles, 518 article fragment links, all five old section destinations and their new links, revised metadata and RSS, and nine generated 1200×630 social cards. There were no application runtime errors or browser warnings. Vercel’s hosted Speed Insights script returned the expected 404 on the local server, so that hosted integration was not validated locally.

The quotations and line numbers below preserve the original audit state at `2fa9c9c`.

The homepage and most project details already sound like a developer describing real work. The biggest style issues are in the SEO biographies, a few résumé bullets, and the introductions and conclusions of longer articles. The project does not need a wholesale rewrite.

This is an editorial assessment, not an AI detector or a determination of authorship. “High-risk” means likely to feel generic, templated, inflated, repetitive, or unfinished to a reader. It does not mean proven AI-generated.

The report contains **18 high-risk groups** and **25 optional or copy-cleanup groups**, covering **112 quoted passages or labels** before counting identical copies on other surfaces. Section 4 gives the exact current text, locations, reasons, and suggested alternatives for every group. Shared copies are listed together so they do not become separate, inconsistent rewrite tasks.

**Scope:** homepage/hero and its short about paragraph; all five experience entries; all six project cards and case studies; all seven MDX articles and their descriptions/titles; reading paths, glossary, exercises, interactive demos, navigation, forms, buttons, error states, accessibility labels, footer, SEO/JSON-LD, manifest, generated-card text, RSS, README and all four documentation files; both résumé source and the two-page PDF; retained text assets; and all 543 answers returned by the public Q&A API. Content/social images were screened with OCR, with visual confirmation of the image labels cited below. Visitor questions are not treated as your authored portfolio copy.

No standalone About, Services, Testimonials, or Skills page exists in the current route tree. About content is in the hero, skills are in the résumé and technology lists, and contact content is on the homepage. An unused service-schema helper is explicitly marked below.

**During the initial audit, no source copy, images, résumé files, or public answers were edited.** This report was the only repository file added at that stage. Suggested alternatives retain named companies, technologies, roles, features, and recorded metrics. Where a technical assertion needs clarification, the report identifies that separately instead of inventing a fact or an achievement. Quotations remove source-code wrappers and normalize formatting where needed; the wording is preserved.

## 1. High-risk AI-sounding text

Start with the active entries here. H18 is retained code, not a live Services section.

| Finding | Area | Why review it |
| --- | --- | --- |
| [H01](#h01) | Homepage SEO and social descriptions | The biography stacks credentials, stock quality claims, and a promotional closing instead of simply saying what the site contains. |
| [H02](#h02) | SEO keywords that read like self-awarded titles | A run of seniority and expertise labels reads like search-engine promotion rather than a developer describing their work. |
| [H03](#h03) | Manara internship summary | This reads like a sentence generated from the job title: it describes almost any backend internship. |
| [H04](#h04) | Overlapping Firecracker résumé bullets | Two bullets describe the same platform with the same isolation and provisioning claims, using longer variations of the wording. |
| [H05](#h05) | ONVO security résumé bullet | The sentence ends by congratulating the work in general terms instead of adding information. |
| [H06](#h06) | AuraDecor résumé description | The product description uses promotional qualifiers around an otherwise concrete feature list. |
| [H07](#h07) | Expanded solidarity statement in the footer | The personal statement shifts into a broad institutional mission statement. |
| [H08](#h08) | Middleware article: repeated definition and importance statements | The article repeatedly introduces or praises the topic after it has already explained it. |
| [H09](#h09) | Boxing article conclusion | The ending instructs the reader how seriously to take the topic instead of giving them a concrete next step. |
| [H10](#h10) | Indexing article metadata and visible introduction | The sentence resembles an unfinished SEO template. |
| [H11](#h11) | Indexing article slogans | The same “not X / it is Y” and “critical for…” patterns appear elsewhere in the blog, giving the articles a shared template voice. |
| [H12](#h12) | Pagination article opening | The opening spends more effort raising the stakes than describing the comparison. |
| [H13](#h13) | Pagination article: theatrical performance warnings | The narration uses escalating warnings where the row counts already make the point. |
| [H14](#h14) | “Production-grade” labels on example code | The labels imply a level of operational validation that the phrase itself does not establish. |
| [H15](#h15) | Nginx conclusion and promotional takeaways | The conclusion reads like a product endorsement after a detailed configuration article. |
| [H16](#h16) | Incomplete or unnatural text embedded in pagination images | These labels read like unfinished copy in otherwise polished diagrams. |
| [H17](#h17) | One public Q&A reply with a counseling-template voice | This reply has a noticeably more formal register than the short, conversational replies around it. |
| [H18](#h18) | Unused service-schema marketing descriptions | These read like generic agency offerings and lack the specificity found in the actual project pages. |


## 2. Potentially AI-sounding text

These are optional edits. Many passages are acceptable as they stand, especially the hero and Ask teaser. P23–P25 are explicitly **formatting or leftover-content issues**, not evidence of an AI writing style.

| Finding | Area | Why review it |
| --- | --- | --- |
| [P01](#p01) | Hero sentence and matching portfolio images | The sentence is credible and restrained, but its final clause is a familiar developer-bio formula. |
| [P02](#p02) | Contact invitation | This is ordinary website copy, but it could appear on almost any portfolio. |
| [P03](#p03) | Generic biographies in structured data and the manifest | These use the same formal personal-brand register as the main SEO bio, although they are less exaggerated. |
| [P04](#p04) | Projects page introduction | The subject matter is specific, but the invitation sounds like a tour of a presentation rather than a simple introduction to your work. |
| [P05](#p05) | Abstract framing in project problem statements | Several project introductions use the same pattern: a general challenge, an abstract explanation, then a statement that the project makes the challenge visible. |
| [P06](#p06) | Case-study evidence written in an outside-reviewer voice | The technical detail is valuable. The phrasing sometimes sounds like a report about someone else’s repository. |
| [P07](#p07) | Reflx résumé bullets | The work is specific, but the phrasing uses a repeated “systems/pipelines enabling/powering/transformed” pattern. |
| [P08](#p08) | CarLink résumé introduction | This is mostly a strong, specific bullet. Its length and promotional product adjective make it a little harder to read. |
| [P09](#p09) | ONVO scale résumé bullet | The number is useful and should stay. The surrounding description contains redundant sizing language. |
| [P10](#p10) | LSMSharp résumé performance adjective | The implementation details are concrete, but the opening rates the work before explaining it. |
| [P11](#p11) | Writing page description and metadata | The wording is acceptable but less concrete than the subjects of the articles. |
| [P12](#p12) | Repeated article-description formulas | Several article introductions use “A practical guide to…” or repeat the title with an added adjective. |
| [P13](#p13) | Generic or inflated article headings | The headings sometimes advertise depth or importance instead of naming the subject. |
| [P14](#p14) | Middleware recommendations repeated as universal judgments | Recommendations are useful, but several passages repeat that one approach is preferred or ideal without adding a new reason. |
| [P15](#p15) | Pagination article’s staged transitions | A few conversational lines feel written to manufacture momentum rather than help the explanation. |
| [P16](#p16) | Nginx introductory filler and feature praise | These passages are readable, but the repeated praise and statements of importance resemble a general-purpose technical article template. |
| [P17](#p17) | AeroUDP article introduction | The introduction is substantive, but it uses a polished reference-implementation pitch before the mechanisms are explained. |
| [P18](#p18) | AeroUDP observability maxim | The first sentence is an absolute maxim where the next sentence already provides useful implementation detail. |
| [P19](#p19) | SimuKernel article opening | The introduction describes the existence and detail of the article rather than immediately naming what it covers. |
| [P20](#p20) | Ask page teaser | This is distinctive copy and could be intentional personal voice. It also has the feel of a polished advertising teaser. |
| [P21](#p21) | Two familiar caption-style public replies | These are understandable answers, but their wording sounds like a reusable social caption. |
| [P22](#p22) | Unused blog summaries and matching older social images | These summaries read like glossary definitions instead of introductions to the particular articles. |
| [P23](#p23) | Repeated word in older social-image reading times — formatting issue | The duplicate word makes the assets look unfinished. It is not a useful AI-authorship signal. |
| [P24](#p24) | Literal HTML entities in a public answer — formatting issue | Visible entity syntax interrupts otherwise natural wording. This is an encoding problem, not evidence of an AI writing style. |
| [P25](#p25) | Twelve public placeholder replies — content issue | These look like leftover test content and make the archive feel unfinished; they do not sound like AI prose. |


## 3. Natural text

Keep the following wording and patterns. Plain language, ordinary labels, technical terminology, and consistent documentation structure are not problems by themselves.

| Location | Current text or scope | Why it should stay |
| --- | --- | --- |
| [app/personal-client.tsx:56](/home/mohammed/mohammed/projects/mdx-portofolio/app/personal-client.tsx:56) | “Software engineer · Egypt” | Short, factual, and appropriate for the hero. |
| [app/personal-client.tsx:66](/home/mohammed/mohammed/projects/mdx-portofolio/app/personal-client.tsx:66) | “Currently building at Oblien and Medica Scope. CS graduate from Suez Canal University.” | Names current employers and education without a pitch. The brief fragment sounds natural. |
| [app/data.tsx:71](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:71) | “An LSM-tree storage engine in C# with write-ahead logging, Bloom filters, and background compaction.” | Concrete mechanisms and language; no decorative claim is needed. |
| [app/data.tsx:86](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:86) | “A Java distributed file system with checksummed chunks, chained replication, and heartbeat-driven replica repair.” | Specific enough to distinguish the project. |
| [app/data.tsx:115](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:115) | “Experimental reliable transport over UDP in async Rust, with ordered delivery and congestion control.” | The experimental scope is clear. “Reliable transport” is a technical property, not a generic adjective here. |
| [app/data.tsx:145](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:145) | “Go runtime and TypeScript SDK for agent sessions, streamed events, and execution across local hosts, SSH, Docker, and cloud workspaces.” | A concrete description of MindWire; keep the actual platform and execution targets. |
| [app/data.tsx:183](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:183) | “Python services for course questions and quiz generation, with source citations and retrieval scoped to each tenant.” | Explains the service and an important implementation boundary. |
| [app/data.tsx:196](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:196) | “Scaled a Q&A platform to 150k+ users and cut load times by 20%.” | Concise and specific. Keep the existing numbers; stylistic authenticity is not independent metric verification. |
| [app/data.tsx:219](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:219) | “Mentored students in backend development through a structured .NET learning path.” | Supported immediately by the SQL and .NET curriculum highlights; no need to replace it with a motivational statement. |
| [lib/project-case-studies.ts:142](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:142) | “Cumulative ACKs simplify bookkeeping but cannot identify every packet received beyond a gap. Selective acknowledgements are omitted. CRC32 detects accidental corruption; it does not provide authentication or encryption.” | The specific limitations are useful and credible. Preserve them. |
| [lib/project-case-studies.ts:54](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:54) | The WAL paragraph specifying a 100-entry threshold, a 100 ms timer, and SetAsync completing before persistence. | It explains an actual tradeoff. Do not turn it into an unsupported durability boast. |
| [public/resume.tex:88](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:88); [public/resume.tex:89](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:89) | The OBD2 telemetry stack and the specific Saudi PDPL implementation list. | Dense but concrete responsibilities. Density alone is not an AI-writing signal. |
| [public/resume.tex:102](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:102) | “Led the launch of Airwave, a platform for streaming podcasts and music, which attracted more than 10,000 users in the first week.” | A specific existing achievement. No need to inflate it, change the number, or add a growth narrative. |
| [public/resume.tex:146](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:146); [public/resume.tex:167](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:167) | AeroUDP implementation bullets and the Languages, Databases, Cloud, API, Testing, and Core Concepts skill lists. | Technical names and concise feature lists are appropriate. Preserve the skills; do not add proficiency levels. |
| [app/personal-client.tsx:92](/home/mohammed/mohammed/projects/mdx-portofolio/app/personal-client.tsx:92); [components/project-card.tsx:141](/home/mohammed/mohammed/projects/mdx-portofolio/components/project-card.tsx:141) | “Get in touch,” “Résumé,” “View all projects,” “Try demo,” “Read case study,” “GitHub,” and “Read walkthrough.” | Conventional labels help readers act. They do not need novelty or personality added to every button. |
| [components/ask/ask-page.tsx:259](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:259); [components/ask/ask-page.tsx:381](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:381) | “It’s in my inbox. If I publish an answer, you’ll find it below.” / “Questions stay private until I publish an answer.” | Direct first-person copy that explains what happens next without promising a reply. |
| [components/ask/client.ts:34](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/client.ts:34) | “Couldn’t connect. Your text is still here; please try again.” | Useful, calm, and concrete error guidance. |
| [components/scheduler-demo.tsx:193](/home/mohammed/mohammed/projects/mdx-portofolio/components/scheduler-demo.tsx:193); [components/replication-demo.tsx:80](/home/mohammed/mohammed/projects/mdx-portofolio/components/replication-demo.tsx:80) | Scheduling and recovery controls, instructions, event labels, and model assumptions. | These explain actions and limits rather than selling the demos. |
| [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:485](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:485) | The explanation that a cursor records a position and does not preserve a database snapshot. | A precise distinction with clear consequences; leave the paragraph and its surrounding examples intact. |
| [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:144](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:144) | The instruction to register OnStarting before next and the distinction between header timing and full completion. | Concrete guidance tied to the example. |
| [lib/blog-glossary.mjs:20](/home/mohammed/mohammed/projects/mdx-portofolio/lib/blog-glossary.mjs:20); [lib/blog-exercises.mjs:7](/home/mohammed/mohammed/projects/mdx-portofolio/lib/blog-exercises.mjs:7); [lib/reading-paths.ts:12](/home/mohammed/mohammed/projects/mdx-portofolio/lib/reading-paths.ts:12) | Glossary definitions, exercise questions/explanations, prerequisites, and reading-path outcomes. | Consistent educational structure is helpful. Standard terminology is not filler. |
| [README.md:3](/home/mohammed/mohammed/projects/mdx-portofolio/README.md:3); [README.md:8](/home/mohammed/mohammed/projects/mdx-portofolio/README.md:8) | “Backend engineer working on APIs, infrastructure, and distributed systems.” / “Built with Next.js, TypeScript, Tailwind CSS, and MDX. Deployed on Vercel.” | Plain descriptions of the person and repository. Leave the README unchanged. |
| [docs/maintenance.md:1](/home/mohammed/mohammed/projects/mdx-portofolio/docs/maintenance.md:1); [docs/blog-authoring.md:1](/home/mohammed/mohammed/projects/mdx-portofolio/docs/blog-authoring.md:1); [docs/ask-setup.md:1](/home/mohammed/mohammed/projects/mdx-portofolio/docs/ask-setup.md:1); [docs/verification/2026-09-16.md:1](/home/mohammed/mohammed/projects/mdx-portofolio/docs/verification/2026-09-16.md:1) | The maintenance, authoring, Q&A setup, and verification documents. | Implementation instructions and verification scope are direct documentation, not personal-brand marketing. No style rewrite recommended. |
| [components/palestine-solidarity.tsx:7](/home/mohammed/mohammed/projects/mdx-portofolio/components/palestine-solidarity.tsx:7); [components/palestine-solidarity.tsx:15](/home/mohammed/mohammed/projects/mdx-portofolio/components/palestine-solidarity.tsx:15) | “Standing with Palestine 🇵🇸” / “From the river to the sea. We remember Gaza.” | Brief and personal. The generic follow-up paragraph, not these statements, is the issue in H07. |


The public Q&A also provides a useful example of your conversational voice. In [this programming-resource answer](https://ask.modev.me/?question=85e4d0f5-83a8-4a6d-844e-f938b1f0625a#question-85e4d0f5-83a8-4a6d-844e-f938b1f0625a), you wrote:

> الdocs كافيه ووافيه بس ممكن تشوف فيديوهات عصام عبدالنبي او ماتيريال ال iti

Keep that concise Arabic/English mix, casual phrasing, and ordinary uncertainty in the archive. There is no reason to turn these replies into corporate English or to give every professional paragraph the same tone. The specific English reply in H17 stands out because of its formulaic phrasing; that is a local observation, not a judgment about the whole archive.

## 4. Recommended rewrites

Each entry below includes the original wording and an alternative. “Omit” or “merge” is used when adding another sentence would preserve the padding. Optional edits are not instructions to rewrite every listed passage.


<a id="h01"></a>

### H01. Homepage SEO and social descriptions

**Why it may feel AI-written or templated:** The biography stacks credentials, stock quality claims, and a promotional closing instead of simply saying what the site contains.

**What is generic, repetitive, or unnatural:** “Specializing in” plus “scalable microservices” is familiar portfolio-template wording. Using the same description in several metadata fields is normal; the wording is the issue.

**Location:** [components/siteConfig.tsx:10](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:10)

**Current:**

> Mohammed Mostafa - Backend Software Engineer from Egypt specializing in ASP.NET Core, Node.js, and TypeScript. 5+ years building scalable microservices, REST APIs, and distributed systems. View projects and technical blog.

**Suggested alternative:**

> Mohammed Mostafa, backend software engineer in Egypt. 5+ years building microservices, REST APIs, and distributed systems with ASP.NET Core, Node.js, and TypeScript. Projects and technical articles.

**Location:** [components/siteConfig.tsx:95](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:95)

**Current:**

> Backend Software Engineer from Egypt specializing in ASP.NET Core, Node.js, and TypeScript. 5+ years building scalable microservices and distributed systems.

**Suggested alternative:**

> Backend software engineer in Egypt with 5+ years building microservices and distributed systems using ASP.NET Core, Node.js, and TypeScript.

**Location:** [components/siteConfig.tsx:106](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:106)

**Current:**

> Backend Software Engineer specializing in ASP.NET Core, Node.js, and TypeScript. 5+ years building scalable microservices and distributed systems.

**Suggested alternative:**

> Backend software engineer with 5+ years building microservices and distributed systems using ASP.NET Core, Node.js, and TypeScript.

**Preserve/context:** These alternatives retain the existing 5+ years claim. Its basis needs checking against the visible employment history; see section 5. Do not substitute a different number without that check.

<a id="h02"></a>

### H02. SEO keywords that read like self-awarded titles

**Why it may feel AI-written or templated:** A run of seniority and expertise labels reads like search-engine promotion rather than a developer describing their work.

**What is generic, repetitive, or unnatural:** “Expert,” “Senior,” “Architect,” and “DBA” assert a level or role without explaining it in this keyword list.

**Location:** [components/siteConfig.tsx:25](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:25)

**Current:**

> C# Senior Developer

**Suggested alternative:**

> C# development

**Location:** [components/siteConfig.tsx:27](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:27)

**Current:**

> Microservices Architect

**Suggested alternative:**

> Microservices architecture

**Location:** [components/siteConfig.tsx:42](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:42)

**Current:**

> SQL Server DBA

**Suggested alternative:**

> SQL Server

**Location:** [components/siteConfig.tsx:43](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:43)

**Current:**

> Redis Cache Expert

**Suggested alternative:**

> Redis caching

**Location:** [components/siteConfig.tsx:46](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:46)

**Current:**

> Database Design Expert

**Suggested alternative:**

> Database design

**Location:** [components/siteConfig.tsx:64](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:64)

**Current:**

> Senior Backend Developer

**Suggested alternative:**

> Backend development

**Preserve/context:** These are proposed topic keywords, not replacements for your actual job titles. Retain any verified seniority or specialist role where it belongs in the experience section.

<a id="h03"></a>

### H03. Manara internship summary

**Why it may feel AI-written or templated:** This reads like a sentence generated from the job title: it describes almost any backend internship.

**What is generic, repetitive, or unnatural:** “Practical development,” “problem-solving,” and “fundamentals” are broad categories, with no example distinguishing the work.

**Location:** [app/data.tsx:242](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:242)

**Current:**

> Backend engineering internship focused on practical development, problem-solving, and software engineering fundamentals.

**Suggested alternative:**

> At Manara, I worked on backend development, problem-solving, and software engineering fundamentals.

**Preserve/context:** The alternative only makes the sentence more direct. A genuinely specific version would need an actual task or example from you; none has been invented here.

<a id="h04"></a>

### H04. Overlapping Firecracker résumé bullets

**Why it may feel AI-written or templated:** Two bullets describe the same platform with the same isolation and provisioning claims, using longer variations of the wording.

**What is generic, repetitive, or unnatural:** The repeated “building/built,” “Firecracker microVMs,” “secure,” and “rapid provisioning” make this feel padded.

**Location:** [public/resume.tex:68](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:68); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 1, Oblien, bullets 1 and 4

**Current:**

> Founding engineer at Oblien, building a programmable infrastructure layer for autonomous agents using Firecracker microVMs for secure, isolated code execution and rapid environment provisioning.

**Suggested alternative:**

> Founding engineer at Oblien, building programmable infrastructure for autonomous agents. Built a sandboxed platform with Firecracker microVMs to deploy agent-generated applications, run code securely across tenants, and provision isolated environments quickly.

**Location:** [public/resume.tex:71](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:71)

**Current:**

> Built a sandboxed execution platform using Firecracker microVMs to deploy and isolate agent-generated applications, ensuring secure multi-tenant execution and rapid provisioning.

**Suggested alternative:**

> Merge this into the revised bullet above; its distinct application-deployment and multi-tenant details are retained there.

**Preserve/context:** This is a consolidation, not the removal of a responsibility. It preserves the platform, Firecracker, agent-generated applications, tenant isolation, secure execution, and provisioning claims.

<a id="h05"></a>

### H05. ONVO security résumé bullet

**Why it may feel AI-written or templated:** The sentence ends by congratulating the work in general terms instead of adding information.

**What is generic, repetitive, or unnatural:** “Ensuring a more resilient and secure application” repeats “Secured the backend” and does not identify a further control or result.

**Location:** [public/resume.tex:103](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:103); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 1, Onvo, final bullet

**Current:**

> Secured the backend to prevent DoS and XSS attacks, ensuring a more resilient and secure application.

**Suggested alternative:**

> Secured the backend against DoS and XSS attacks.

**Preserve/context:** No new security mechanism or guarantee has been added. The kinds of attacks remain unchanged.

<a id="h06"></a>

### H06. AuraDecor résumé description

**Why it may feel AI-written or templated:** The product description uses promotional qualifiers around an otherwise concrete feature list.

**What is generic, repetitive, or unnatural:** “Modern” and “advanced” do not explain a capability. The three sentences also repeat “system / it / the system.”

**Location:** [public/resume.tex:118](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:118); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 2, Aura Decor, three description bullets

**Current:**

> AuraDecor is a modern furniture management system built with ASP.NET Core 8.0 using a clean architecture.

**Suggested alternative:**

> AuraDecor is a furniture management system built with ASP.NET Core 8.0 and Clean Architecture.

**Location:** [public/resume.tex:119](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:119)

**Current:**

> It offers AI-powered text and image search, secure JWT authentication, and integrated Stripe processing.

**Suggested alternative:**

> It includes AI-powered text and image search, JWT authentication, and Stripe payment processing.

**Location:** [public/resume.tex:120](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:120)

**Current:**

> The system includes an advanced admin panel, RabbitMQ-based notifications, and Docker-ready deployment.

**Suggested alternative:**

> There is also an admin panel, RabbitMQ notifications, and support for Docker deployment.

**Preserve/context:** Keep the project name, graduation-project context, stack, and features. “AI-powered” describes an actual feature here; it is not being treated as evidence of AI-written copy.

<a id="h07"></a>

### H07. Expanded solidarity statement in the footer

**Why it may feel AI-written or templated:** The personal statement shifts into a broad institutional mission statement.

**What is generic, repetitive, or unnatural:** “Empower communities” and “promote peace worldwide” are abstract slogans. They sound less personal than the two short lines immediately above them.

**Location:** [components/palestine-solidarity.tsx:18](/home/mohammed/mohammed/projects/mdx-portofolio/components/palestine-solidarity.tsx:18) (through line 19)

**Current:**

> Supporting justice, human rights, and the dignity of all people.
> Technology should empower communities and promote peace worldwide.

**Suggested alternative:**

> I support justice, human rights, and dignity for everyone. I believe technology should help communities and support peace.

**Preserve/context:** Leave “Standing with Palestine 🇵🇸” and “From the river to the sea. We remember Gaza.” unchanged. This suggestion concerns the wording, not the position being expressed; it adds no claim of donations or activism.

<a id="h08"></a>

### H08. Middleware article: repeated definition and importance statements

**Why it may feel AI-written or templated:** The article repeatedly introduces or praises the topic after it has already explained it.

**What is generic, repetitive, or unnatural:** “Fundamental mechanism,” “critical,” “powerful,” “backbone,” and the closing list of desirable outcomes form a generic tutorial wrapper.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:19](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:19)

**Current:**

> In ASP.NET Core, middleware is the fundamental mechanism that processes every HTTP request and response. Every request that enters the application and every response that leaves it flows through the middleware pipeline.

**Suggested alternative:**

> In ASP.NET Core, middleware processes HTTP requests and responses through a pipeline.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:38](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:38)

**Current:**

> Understanding how to design and implement middleware correctly is critical for building maintainable and high-performance ASP.NET Core applications.

**Suggested alternative:**

> Middleware runs on every request, so its design affects maintainability and performance.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:53](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:53)

**Current:**

> This enables powerful cross-cutting behavior.

**Suggested alternative:**

> Omit this sentence. The preceding “before next / after next” bullets already explain the behavior.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:445](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:445)

**Current:**

> Middleware is the backbone of ASP.NET Core request processing.

**Suggested alternative:**

> Omit this sentence. Start the summary with its useful list of middleware choices and ordering rules.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:455](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:455)

**Current:**

> Well-designed middleware leads to cleaner controllers, consistent cross-cutting behavior, and scalable applications.

**Suggested alternative:**

> Shared request logic belongs in one place. Middleware can keep that logic out of controllers and apply it consistently across requests.

**Preserve/context:** Keep the examples, registration methods, lifetime discussion, and verification details. These suggestions remove the promotional wrapper, not the technical explanation.

<a id="h09"></a>

### H09. Boxing article conclusion

**Why it may feel AI-written or templated:** The ending instructs the reader how seriously to take the topic instead of giving them a concrete next step.

**What is generic, repetitive, or unnatural:** “Not optional,” “core part,” and “efficient, scalable” are emphatic but unspecific.

**Location:** [app/blog/boxing-and-unboxing-in-csharp/page.mdx:441](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/boxing-and-unboxing-in-csharp/page.mdx:441)

**Current:**

> Understanding boxing is not optional for performance-critical .NET development. It is a core part of writing efficient, scalable C# code.

**Suggested alternative:**

> Check for boxing in performance-sensitive C# code. It adds allocations and copying that can affect memory use and execution time.

<a id="h10"></a>

### H10. Indexing article metadata and visible introduction

**Why it may feel AI-written or templated:** The sentence resembles an unfinished SEO template.

**What is generic, repetitive, or unnatural:** “Database indexing with comprehensive guide” is grammatically incomplete, and “comprehensive” praises the article without describing its scope.

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:5](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:5)

**Current:**

> Database indexing with comprehensive guide on clustered and non-clustered indexes. Learn B-Tree architecture.

**Suggested alternative:**

> How clustered and non-clustered indexes store data, how B-trees work, and what that means for reads and writes.

**Preserve/context:** Article metadata descriptions are also used as visible introductions, so this is not only a search-snippet issue.

<a id="h11"></a>

### H11. Indexing article slogans

**Why it may feel AI-written or templated:** The same “not X / it is Y” and “critical for…” patterns appear elsewhere in the blog, giving the articles a shared template voice.

**What is generic, repetitive, or unnatural:** They turn useful advice about query patterns into broad declarations about good engineering.

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:33](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:33)

**Current:**

> Creating the right index is not about indexing everything. It is about indexing access patterns.

**Suggested alternative:**

> Choose indexes around the queries your application runs.

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:46](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:46)

**Current:**

> Understanding how each option affects storage, reads, and writes is critical for designing scalable schemas.

**Suggested alternative:**

> The choice affects how the database stores, reads, and writes rows as the schema grows.

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:477](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:477)

**Current:**

> Indexes are not optional optimizations. They are a core part of database design.

**Suggested alternative:**

> Plan indexes alongside the schema and the queries it needs to support.

<a id="h12"></a>

### H12. Pagination article opening

**Why it may feel AI-written or templated:** The opening spends more effort raising the stakes than describing the comparison.

**What is generic, repetitive, or unnatural:** “Deceptively simple,” “enormous implications,” and “tears into” create a dramatic voice that differs from the concrete SQL explanation.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:14](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:14)

**Current:**

> Pagination is one of the most deceptively simple problems in backend engineering. Every application that lists data needs it. Yet the choice between **offset-based** and **cursor-based** pagination carries enormous implications for query performance, data consistency, scalability, and API design: implications that only become visible under production load.

**Suggested alternative:**

> Applications that list data need a way to paginate it. OFFSET and cursor pagination differ in query performance, consistency, scalability, and API design. Those differences become clearer under production load.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:16](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:16)

**Current:**

> This post tears into both strategies at the database internals level. We'll look at how each approach interacts with B-tree indexes, what query plans they produce, where their O-complexity comes from, and how to implement each one correctly.

**Suggested alternative:**

> This post compares their B-tree access patterns, query plans, time complexity, and implementations.

<a id="h13"></a>

### H13. Pagination article: theatrical performance warnings

**Why it may feel AI-written or templated:** The narration uses escalating warnings where the row counts already make the point.

**What is generic, repetitive, or unnatural:** “Things get uncomfortable,” “no magical shortcut,” “pure waste,” and “catastrophic” add drama without a workload-specific explanation.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:69](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:69)

**Current:**

> This is where things get uncomfortable. The SQL standard and every major RDBMS implement OFFSET by **materialising and discarding** the skipped rows. There is no magical shortcut.

**Suggested alternative:**

> OFFSET still has to process the rows it skips. The PostgreSQL plan below shows that work.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:79](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:79)

**Current:**

> Step 4 is pure waste. You are paying the full I/O and CPU cost for rows you immediately throw away.

**Suggested alternative:**

> The query spends I/O and CPU time on rows it does not return.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:117](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:117)

**Current:**

> This "performance cliff" is often invisible in development (small datasets) and during early production (few users reaching deep pages). It becomes catastrophic as data grows and users or crawlers navigate deep into result sets.

**Suggested alternative:**

> This cost is easy to miss with small development datasets or few users reaching deep pages. It grows as the dataset expands and users or crawlers request later pages.

**Preserve/context:** The replacement for line 69 describes the existing PostgreSQL example. It avoids turning a tone edit into a new universal claim about the SQL standard or every database implementation.

<a id="h14"></a>

### H14. “Production-grade” labels on example code

**Why it may feel AI-written or templated:** The labels imply a level of operational validation that the phrase itself does not establish.

**What is generic, repetitive, or unnatural:** “Production-grade” is a broad endorsement. The code’s language and included settings are more useful descriptions.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:296](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:296)

**Current:**

> Here is a production-grade cursor pagination implementation in TypeScript with PostgreSQL:

**Suggested alternative:**

> Here is a cursor pagination example in TypeScript with PostgreSQL:

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:380](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:380)

**Current:**

> Production-Grade Proxy Config

**Suggested alternative:**

> Proxy configuration with forwarded headers, timeouts, and buffering

**Preserve/context:** This does not assert that the code is unsuitable for production. It removes an unqualified label; deployments still depend on their actual configuration and requirements.

<a id="h15"></a>

### H15. Nginx conclusion and promotional takeaways

**Why it may feel AI-written or templated:** The conclusion reads like a product endorsement after a detailed configuration article.

**What is generic, repetitive, or unnatural:** “One of the most reliable,” “massive,” “most misunderstood,” and “dramatic” are rankings or intensifiers without a defined comparison.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1192](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1192)

**Current:**

> Nginx is a high-performance traffic control layer that, when properly configured, becomes one of the most reliable components in your infrastructure.

**Suggested alternative:**

> Nginx handles routing, proxying, caching, and TLS. Its configuration determines how it handles traffic.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1196](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1196)

**Current:**

> 1. **Architecture matters** - Event-driven design enables massive concurrency

**Suggested alternative:**

> **Architecture** — Event-driven workers handle many concurrent connections.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1198](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1198)

**Current:**

> 3. **Location matching** - Most misunderstood feature, most important to get right

**Suggested alternative:**

> **Location matching** — Check which block handles each request.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1201](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:1201)

**Current:**

> 6. **Caching** - Dramatic performance gains for read-heavy workloads

**Suggested alternative:**

> **Caching** — Reduce backend requests for read-heavy workloads.

<a id="h16"></a>

### H16. Incomplete or unnatural text embedded in pagination images

**Why it may feel AI-written or templated:** These labels read like unfinished copy in otherwise polished diagrams.

**What is generic, repetitive, or unnatural:** “Causes … to Landing” is ungrammatical, and “B-tree in” is an incomplete label. Neither issue establishes how the images were made.

**Location:** [public/blog/pagination-strategies/offset-phantom-records.webp](/home/mohammed/mohammed/projects/mdx-portofolio/public/blog/pagination-strategies/offset-phantom-records.webp) — Bottom-left warning; [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:126](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:126) — Image reference

**Current:**

> Data Shifting Causes Offset to Landing on Unexpected Rows

**Suggested alternative:**

> When rows shift, the same offset can point to different records.

**Location:** [public/blog/pagination-strategies/cursor-pagination-mechanics.webp](/home/mohammed/mohammed/projects/mdx-portofolio/public/blog/pagination-strategies/cursor-pagination-mechanics.webp) — Center of the tree diagram; [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:173](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:173) — Image reference

**Current:**

> B-tree in

**Suggested alternative:**

> B-tree index

**Preserve/context:** These strings are baked into raster images; editing MDX captions will not change them. Separate correctness concerns in the diagrams are listed in section 5.

<a id="h17"></a>

### H17. One public Q&A reply with a counseling-template voice

**Why it may feel AI-written or templated:** This reply has a noticeably more formal register than the short, conversational replies around it.

**What is generic, repetitive, or unnatural:** “It’s understandable that you might feel,” “expressing your need,” and “navigating this situation” are stock reassurance phrases.

**Location:** [Published answer 4389be0e-9bba-4688-b343-18a39245861e; answered 2024-01-14](https://ask.modev.me/?question=4389be0e-9bba-4688-b343-18a39245861e#question-4389be0e-9bba-4688-b343-18a39245861e); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> It&amp;#039;s understandable that you might feel uncomfortable with your best friend getting close to your ex shortly after the breakup. Communicate your feelings honestly and calmly, expressing your need for understanding and support in navigating this situation

**Suggested alternative:**

> I get why this feels uncomfortable, especially so soon after the breakup. Tell your friend how you feel and what support you need.

**Preserve/context:** This is public database content, not a string to edit in the React component. The literal HTML entity in the original is preserved in the quotation and is a separate formatting issue.

<a id="h18"></a>

### H18. Unused service-schema marketing descriptions

**Why it may feel AI-written or templated:** These read like generic agency offerings and lack the specificity found in the actual project pages.

**What is generic, repetitive, or unnatural:** “Professional,” “complete,” “modern frameworks,” and “cloud solutions” describe almost any software-services website.

**Location:** [lib/schema.ts:112](/home/mohammed/mohammed/projects/mdx-portofolio/lib/schema.ts:112)

**Current:**

> Professional software development services specializing in ASP.NET Core, Node.js, and full-stack development

**Suggested alternative:**

> Software development with ASP.NET Core and Node.js, including full-stack web applications.

**Location:** [lib/schema.ts:150](/home/mohammed/mohammed/projects/mdx-portofolio/lib/schema.ts:150)

**Current:**

> Complete web application development with modern frameworks

**Suggested alternative:**

> Web application development across the frontend and backend.

**Location:** [lib/schema.ts:158](/home/mohammed/mohammed/projects/mdx-portofolio/lib/schema.ts:158)

**Current:**

> Azure cloud solutions and microservices architecture

**Suggested alternative:**

> Cloud architecture on Azure, including microservices.

**Preserve/context:** Not emitted by the current app: generateProfessionalServiceSchema has no call sites. No live Services section was found. These are low-priority retained strings unless this helper is used later.

<a id="p01"></a>

### P01. Hero sentence and matching portfolio images

**Why it may feel AI-written or templated:** The sentence is credible and restrained, but its final clause is a familiar developer-bio formula.

**What is generic, repetitive, or unnatural:** “With a focus on performance and reliability” states broad priorities without showing a particular example. This is an optional edit, not a problem with the experience claim.

**Location:** [app/personal-client.tsx:62](/home/mohammed/mohammed/projects/mdx-portofolio/app/personal-client.tsx:62) (through line 63); [app/opengraph-image.tsx:14](/home/mohammed/mohammed/projects/mdx-portofolio/app/opengraph-image.tsx:14) — Same wording in the current portfolio social card; [public/og-image.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og-image.png) — Retained static image, central description

**Current:**

> I build backend systems, databases, and cloud infrastructure with a
> focus on performance and reliability.

**Suggested alternative:**

> I build backend systems, databases, and cloud infrastructure. Performance and reliability are a big part of that work.

**Preserve/context:** Keeping the current sentence is also reasonable. The specific work immediately below it gives the broad introduction context.

<a id="p02"></a>

### P02. Contact invitation

**Why it may feel AI-written or templated:** This is ordinary website copy, but it could appear on almost any portfolio.

**What is generic, repetitive, or unnatural:** “Have something in mind?” and “Reach out” say little beyond inviting an email.

**Location:** [app/personal-client.tsx:273](/home/mohammed/mohammed/projects/mdx-portofolio/app/personal-client.tsx:273) (through line 277)

**Current:**

> Have something in mind? Reach out at MohammedMostafaNazih@gmail.com.

**Suggested alternative:**

> You can reach me at MohammedMostafaNazih@gmail.com.

**Preserve/context:** “Get in touch,” “Résumé,” and the social-link labels are already clear; leave them alone.

<a id="p03"></a>

### P03. Generic biographies in structured data and the manifest

**Why it may feel AI-written or templated:** These use the same formal personal-brand register as the main SEO bio, although they are less exaggerated.

**What is generic, repetitive, or unnatural:** “Experienced,” “Professional,” and “specializing in” fill space around an otherwise useful list of technologies.

**Location:** [app/layout.tsx:52](/home/mohammed/mohammed/projects/mdx-portofolio/app/layout.tsx:52)

**Current:**

> Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Available for new opportunities.

**Suggested alternative:**

> Software engineer with experience in ASP.NET Core, Node.js, Express.js, and TypeScript. Open to new opportunities.

**Location:** [app/layout.tsx:86](/home/mohammed/mohammed/projects/mdx-portofolio/app/layout.tsx:86)

**Current:**

> Professional Software Engineer Mohammed specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. View portfolio, projects, and contact information.

**Suggested alternative:**

> Mohammed Mostafa’s portfolio: projects, contact details, and work with ASP.NET Core, Node.js, Express.js, and TypeScript.

**Location:** [public/site.webmanifest:4](/home/mohammed/mohammed/projects/mdx-portofolio/public/site.webmanifest:4)

**Current:**

> Mohammed Mostafa - Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript

**Suggested alternative:**

> Mohammed Mostafa’s software engineering portfolio, with work in ASP.NET Core, Node.js, Express.js, and TypeScript.

**Location:** [components/blog-post-layout.tsx:41](/home/mohammed/mohammed/projects/mdx-portofolio/components/blog-post-layout.tsx:41)

**Current:**

> Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.

**Suggested alternative:**

> Software engineer working with ASP.NET Core, Node.js, Express.js, and TypeScript.

**Scope/note:** Retained author.description field. generateBlogPostSchema does not serialize this field, so this sentence is not currently shown in article structured data.

**Location:** [lib/schema.ts:175](/home/mohammed/mohammed/projects/mdx-portofolio/lib/schema.ts:175)

**Current:**

> Professional portfolio website of Mohammed Mostafa, Software Engineer

**Suggested alternative:**

> Mohammed Mostafa’s software engineering portfolio.

**Scope/note:** Unused generateOrganizationSchema helper; no current call sites.

**Preserve/context:** The first rewrite retains the existing availability statement. Confirm that it still describes your preference; do not silently change it to a different employment status.

<a id="p04"></a>

### P04. Projects page introduction

**Why it may feel AI-written or templated:** The subject matter is specific, but the invitation sounds like a tour of a presentation rather than a simple introduction to your work.

**What is generic, repetitive, or unnatural:** The sequence “Explore … inspect … try …” and especially “inspect the evidence” adds a formal sales or review tone.

**Location:** [app/projects/page.tsx:22](/home/mohammed/mohammed/projects/mdx-portofolio/app/projects/page.tsx:22) (through line 24)

**Current:**

> Storage engines, transport protocols, and backend services. Explore the
> architecture, inspect the evidence, or try the scheduling and replica
> recovery demos.

**Suggested alternative:**

> Storage engines, transport protocols, and backend services. Each project has architecture notes and source links. You can also try the scheduling and replica recovery demos.

**Location:** [app/projects/page.tsx:8](/home/mohammed/mohammed/projects/mdx-portofolio/app/projects/page.tsx:8)

**Current:**

> Storage engines, transport protocols, and backend services by Mohammed Mostafa. Explore the architecture, tradeoffs, and interactive demos.

**Suggested alternative:**

> Storage engines, transport protocols, and backend services by Mohammed Mostafa, with architecture notes, tradeoffs, and interactive demos.

<a id="p05"></a>

### P05. Abstract framing in project problem statements

**Why it may feel AI-written or templated:** Several project introductions use the same pattern: a general challenge, an abstract explanation, then a statement that the project makes the challenge visible.

**What is generic, repetitive, or unnatural:** “Makes … explicit,” “explores the machinery,” “only the beginning,” and “follows those boundaries” distance the prose from what the code actually does.

**Location:** [lib/project-case-studies.ts:29](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:29)

**Current:**

> LSMSharp makes those competing jobs explicit: collect writes in memory, preserve a recovery log, then reorganize sorted files in the background.

**Suggested alternative:**

> LSMSharp collects writes in memory, keeps a recovery log, and reorganizes sorted files in the background.

**Location:** [lib/project-case-studies.ts:107](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:107)

**Current:**

> AeroUDP explores the machinery needed to expose reliable, ordered delivery while adapting to a slow receiver and a congested network.

**Suggested alternative:**

> AeroUDP adds reliable, ordered delivery and adjusts sending to the receiver’s capacity and network conditions.

**Location:** [lib/additional-project-case-studies.ts:13](/home/mohammed/mohammed/projects/mdx-portofolio/lib/additional-project-case-studies.ts:13)

**Current:**

> Copying a file to several machines is only the beginning. A client also needs to locate its chunks, detect damaged bytes, and keep reading when a storage node disappears. Disk-Mesh makes these responsibilities visible through a metadata master, storage nodes, and a client that verifies the data it receives.

**Suggested alternative:**

> A distributed file system needs to locate chunks, detect corruption, and keep reads working when a storage node disappears. Disk-Mesh uses a metadata master, storage nodes, and a client that checks the data it receives.

**Location:** [lib/additional-project-case-studies.ts:101](/home/mohammed/mohammed/projects/mdx-portofolio/lib/additional-project-case-studies.ts:101)

**Current:**

> A checkout combines product prices, discounts, payment state, and work that can happen afterward. Splitting these responsibilities into services makes the boundaries explicit, but also creates places where one step can succeed while another fails. This project follows those boundaries from a cart request to an order and its reward message.

**Suggested alternative:**

> Checkout combines product prices, discounts, payment state, and follow-up work. This project splits those steps across services, from the cart request to the order and rewards message. One step can succeed while the next fails.

**Preserve/context:** These changes stay in the descriptive voice. They do not invent a personal origin story, production incident, reason for choosing a technology, or claim of sole ownership.

<a id="p06"></a>

### P06. Case-study evidence written in an outside-reviewer voice

**Why it may feel AI-written or templated:** The technical detail is valuable. The phrasing sometimes sounds like a report about someone else’s repository.

**What is generic, repetitive, or unnatural:** “Repository-reported sample,” “inspected test definitions,” and “no … claim” are bureaucratic ways to express reasonable limits.

**Location:** [lib/project-case-studies.ts:69](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:69)

**Current:**

> The published sequential-write example reports 5,000 operations in 207 ms, or about 24,155 operations per second. It is a repository-reported sample: the timer covers write submission and excludes the final flush. Hardware details were not recorded, so this is not a durable-commit benchmark or a cross-machine comparison.

**Suggested alternative:**

> The README reports 5,000 sequential writes in 207 ms, about 24,155 operations per second. The timer covers write submission and excludes the final flush. Hardware details were not recorded, so the sample cannot establish durable-commit speed or support comparisons across machines.

**Location:** [lib/additional-project-case-studies.ts:55](/home/mohammed/mohammed/projects/mdx-portofolio/lib/additional-project-case-studies.ts:55)

**Current:**

> The repository defines nine integration scenarios, including byte-for-byte round trips, concurrent transfers, corrupt-replica handling, node loss, and garbage collection. These are inspected test definitions; no fresh execution results are claimed here.

**Suggested alternative:**

> The nine integration scenarios include byte-for-byte round trips, concurrent transfers, corrupt-replica handling, node loss, and garbage collection. The links show the test definitions; this page does not include results from a new run.

**Location:** [lib/additional-project-case-studies.ts:141](/home/mohammed/mohammed/projects/mdx-portofolio/lib/additional-project-case-studies.ts:141)

**Current:**

> The linked source traces cart composition, Stripe status validation, message publication, and reward handling. The inspected revision contains no automated test project or reproducible benchmark workload, so this case study makes no measured latency or end-to-end reliability claim.

**Suggested alternative:**

> The source shows cart composition, Stripe status validation, message publication, and reward handling. The linked revision has no automated test project or reproducible benchmark. This page does not report measured latency or end-to-end reliability.

**Location:** [lib/additional-project-case-studies.ts:230](/home/mohammed/mohammed/projects/mdx-portofolio/lib/additional-project-case-studies.ts:230)

**Current:**

> These references document the inspected test definitions. Provider calls use deterministic fakes or mock endpoints. PostgreSQL and Redis checks require configured test services and are skipped when their environment variables are absent.

**Suggested alternative:**

> The linked tests use deterministic fakes or mock endpoints for provider calls. PostgreSQL and Redis checks need configured test services and are skipped when their environment variables are missing. The links document the test definitions.

**Preserve/context:** Preserve every boundary between test definitions and executed results, and between write submission and durable persistence. Avoid changing these to “I tested…” or “I measured…” without evidence.

<a id="p07"></a>

### P07. Reflx résumé bullets

**Why it may feel AI-written or templated:** The work is specific, but the phrasing uses a repeated “systems/pipelines enabling/powering/transformed” pattern.

**What is generic, repetitive, or unnatural:** “Backend systems powering” and “interaction systems enabling users to communicate” are longer than the actions they describe.

**Location:** [public/resume.tex:73](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:73); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 1, Oblien, Reflx and the following two bullets

**Current:**

> Designed and implemented backend systems powering Reflx, a platform that creates AI-based digital clones from users' public presence.

**Suggested alternative:**

> Designed and built the backend for Reflx, which creates AI-based digital clones from users’ public presence.

**Location:** [public/resume.tex:75](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:75)

**Current:**

> Developed ingestion pipelines that processed user public data and transformed it into structured profiles used by AI agents.

**Suggested alternative:**

> Built ingestion pipelines that turned users’ public data into structured profiles for AI agents.

**Location:** [public/resume.tex:77](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:77)

**Current:**

> Implemented real-time interaction systems enabling users to communicate with their clones, including low-latency messaging, session handling, and stateful conversations.

**Suggested alternative:**

> Added real-time conversations with clones, including low-latency messaging, session handling, and conversation state.

<a id="p08"></a>

### P08. CarLink résumé introduction

**Why it may feel AI-written or templated:** This is mostly a strong, specific bullet. Its length and promotional product adjective make it a little harder to read.

**What is generic, repetitive, or unnatural:** “Smart vehicle maintenance platform” is less informative than the sentence’s actual description of owners and service centers.

**Location:** [public/resume.tex:86](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:86); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 1, Medica Scope, first bullet

**Current:**

> Architected and developed backend services for CarLink, a smart vehicle maintenance platform connecting vehicle owners with oil-change and brake service centers across Saudi Arabia, using NestJS, TypeScript, Prisma, and PostgreSQL.

**Suggested alternative:**

> Designed and developed CarLink’s backend services using NestJS, TypeScript, Prisma, and PostgreSQL. The platform connects vehicle owners in Saudi Arabia with oil-change and brake service centers.

**Preserve/context:** “Architected” is not inherently an AI tell. This alternative preserves the design responsibility while making the sentence easier to follow.

<a id="p09"></a>

### P09. ONVO scale résumé bullet

**Why it may feel AI-written or templated:** The number is useful and should stay. The surrounding description contains redundant sizing language.

**What is generic, repetitive, or unnatural:** “Large” repeats what 150,000+ already conveys, and “high concurrency support” is a noun-heavy ending.

**Location:** [public/resume.tex:101](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:101); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 1, Onvo, second bullet

**Current:**

> Built and scaled a large Q/A platform serving 150,000+ users with real-time interactions and high concurrency support.

**Suggested alternative:**

> Built and scaled a Q&amp;A platform serving 150,000+ users, with real-time interactions and support for many concurrent users.

**Preserve/context:** Retain 150,000+ exactly. This audit has not independently verified the user count, and it does not replace it with a different metric.

<a id="p10"></a>

### P10. LSMSharp résumé performance adjective

**Why it may feel AI-written or templated:** The implementation details are concrete, but the opening rates the work before explaining it.

**What is generic, repetitive, or unnatural:** “High-performance” has no defined comparison in this bullet. The more serious issue is that its ACID and crash-safety wording needs reconciliation with the case study.

**Location:** [public/resume.tex:128](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:128); [public/resume.pdf](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.pdf) — Page 2, LSMSharp, first bullet

**Current:**

> Developed a high-performance LSM-Tree storage engine in C# with ACID guarantees, leveled compaction, and crash-safe WAL.

**Suggested alternative:**

> Built a C# LSM-tree storage engine with ACID guarantees, leveled compaction, and a crash-safe WAL.

**Preserve/context:** This is a style-only candidate, not a fact-checked final version. ACID and crash-safe WAL are deliberately retained because changing those technical claims requires checking their scope; see section 5. The concrete Bloom-filter/skip-list bullet at line 129 can stay.

<a id="p11"></a>

### P11. Writing page description and metadata

**Why it may feel AI-written or templated:** The wording is acceptable but less concrete than the subjects of the articles.

**What is generic, repetitive, or unnatural:** “The details behind reliable software” is a broad brand phrase; “and more” is filler.

**Location:** [components/ui/blog-list.tsx:98](/home/mohammed/mohammed/projects/mdx-portofolio/components/ui/blog-list.tsx:98) (through line 99)

**Current:**

> Notes on backend engineering, systems, and the details behind reliable
> software.

**Suggested alternative:**

> I write about backend engineering, databases, networking, and operating systems.

**Location:** [app/blog/page.tsx:8](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/page.tsx:8)

**Current:**

> Articles on backend engineering, .NET, Node.js, system design, and more.

**Suggested alternative:**

> Articles on backend engineering, .NET, Node.js, and system design.

<a id="p12"></a>

### P12. Repeated article-description formulas

**Why it may feel AI-written or templated:** Several article introductions use “A practical guide to…” or repeat the title with an added adjective.

**What is generic, repetitive, or unnatural:** The shared formula makes otherwise different subjects sound packaged in the same way. The pagination description is also a list fragment.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:5](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:5)

**Current:**

> Three practical ways to build custom middleware in ASP.NET Core.

**Suggested alternative:**

> Inline delegates, convention-based middleware, and IMiddleware, with examples and dependency lifetime notes.

**Location:** [app/blog/boxing-and-unboxing-in-csharp/page.mdx:5](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/boxing-and-unboxing-in-csharp/page.mdx:5)

**Current:**

> A practical guide to boxing and unboxing in C# and their performance impact.

**Suggested alternative:**

> What boxing and unboxing do in C#, where allocations happen, and how typed collections avoid boxing.

**Location:** [app/blog/aeroudp-networking-concepts/page.mdx:6](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/aeroudp-networking-concepts/page.mdx:6)

**Current:**

> A practical guide to reliable transport, congestion control, flow control, and connection management, using AeroUDP, a TCP-like protocol built on top of UDP in async Rust.

**Suggested alternative:**

> Reliable transport, congestion control, flow control, and connection management in AeroUDP, a TCP-like protocol built over UDP in async Rust.

**Location:** [app/blog/simukernel-operating-system-concepts/page.mdx:6](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/simukernel-operating-system-concepts/page.mdx:6)

**Current:**

> A practical guide to CPU scheduling, memory management, and process control using SimuKernel an educational operating system simulator.

**Suggested alternative:**

> CPU scheduling, memory management, and process control in SimuKernel, an educational operating system simulator.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:5](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:5)

**Current:**

> OFFSET and cursor based pagination strategies: covering database internals, B-tree traversal, performance characteristics, data consistency problems.

**Suggested alternative:**

> How OFFSET and cursor pagination use B-tree indexes, how their performance differs, and what happens when data changes between pages.

**Preserve/context:** These descriptions feed article introductions, article lists, metadata, generated social cards, and RSS. One source edit can affect several surfaces; avoid writing inconsistent replacements for each consumer.

<a id="p13"></a>

### P13. Generic or inflated article headings

**Why it may feel AI-written or templated:** The headings sometimes advertise depth or importance instead of naming the subject.

**What is generic, repetitive, or unnatural:** “Deep Dive,” “Most Critical,” and “Smart” are interchangeable tutorial labels. “Implementations” also omits what is being implemented.

**Location:** [app/blog/boxing-and-unboxing-in-csharp/page.mdx:15](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/boxing-and-unboxing-in-csharp/page.mdx:15)

**Current:**

> Deep Dive into C# Boxing and Unboxing

**Suggested alternative:**

> Boxing and unboxing in C#: allocations and runtime behavior

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:87](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:87)

**Current:**

> Event-Driven Architecture Deep Dive

**Suggested alternative:**

> Nginx’s event loop and non-blocking I/O

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:245](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:245)

**Current:**

> Location Matching: The Most Critical Concept

**Suggested alternative:**

> How Nginx matches location blocks

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:13](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:13)

**Current:**

> Clustered and Non-Clustered Implementations

**Suggested alternative:**

> Clustered and non-clustered indexes

**Location:** [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:330](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:330)

**Current:**

> Smart Maintenance Script

**Suggested alternative:**

> Index maintenance script

**Preserve/context:** The page titles “Projects,” “Writing,” and the specific technical SEO titles are already useful. Changing article headings later can change their generated fragment links.

<a id="p14"></a>

### P14. Middleware recommendations repeated as universal judgments

**Why it may feel AI-written or templated:** Recommendations are useful, but several passages repeat that one approach is preferred or ideal without adding a new reason.

**What is generic, repetitive, or unnatural:** “Most commonly recommended,” “preferred,” “ideal,” and “enterprise systems” sound generic when separated from the actual dependency and testing needs.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:159](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:159)

**Current:**

> This is the most commonly recommended approach for production code.

**Suggested alternative:**

> Omit this sentence; keep the recommendation at the end of the example instead.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:225](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:225)

**Current:**

> This is the preferred approach for most custom middleware.

**Suggested alternative:**

> Use convention-based middleware as the default for most custom middleware.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:286](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:286)

**Current:**

> This approach is ideal for complex middleware with many dependencies or when strict test isolation is required.

**Suggested alternative:**

> IMiddleware suits components with many dependencies or strict test-isolation requirements.

**Location:** [app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:436](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/3-ways-to-build-custom-middleware-in-aspnet-core/page.mdx:436)

**Current:**

> Complex logic, enterprise systems

**Suggested alternative:**

> Many dependencies or strict test-isolation needs

**Preserve/context:** The last quotation is the comparison-table cell, not a whole paragraph. These are wording changes to the existing recommendations, not a new judgment about middleware lifetimes.

<a id="p15"></a>

### P15. Pagination article’s staged transitions

**Why it may feel AI-written or templated:** A few conversational lines feel written to manufacture momentum rather than help the explanation.

**What is generic, repetitive, or unnatural:** “Really?”, “Before diving,” a dramatic single-question transition, and the clipped “Clean. Predictable.” repeat familiar tutorial devices.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:24](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:24)

**Current:**

> What Is Pagination, Really?

**Suggested alternative:**

> What is pagination?

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:26](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:26)

**Current:**

> Before diving into strategies, let's be precise. Pagination is the technique of breaking a large result set into smaller, sequential chunks called **pages**. The database still holds the full dataset; the client receives one slice at a time.

**Suggested alternative:**

> Pagination splits a large result set into smaller, sequential pages. The database holds the full dataset; the client receives one page at a time.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:30](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:30)

**Current:**

> That single question leads to two fundamentally different answers.

**Suggested alternative:**

> OFFSET identifies the starting position by count; a cursor identifies it by value.

**Location:** [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:59](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:59)

**Current:**

> Page number translates directly to `OFFSET = (page - 1) * pageSize`. Clean. Predictable.

**Suggested alternative:**

> Page number translates directly to `OFFSET = (page - 1) * pageSize`.

<a id="p16"></a>

### P16. Nginx introductory filler and feature praise

**Why it may feel AI-written or templated:** These passages are readable, but the repeated praise and statements of importance resemble a general-purpose technical article template.

**What is generic, repetitive, or unnatural:** “Maximum performance,” “crucial,” “excels,” “most intelligent,” “dramatically,” and “sophisticated” substitute evaluation for explanation.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:16](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:16)

**Current:**

> Nginx is one of the most widely used web servers and reverse proxies in production systems. It powers high-traffic websites, APIs, microservices platforms, and edge gateways worldwide. Companies like Netflix, Dropbox, and WordPress.com rely on Nginx to handle millions of concurrent connections.

**Suggested alternative:**

> Nginx is widely used for high-traffic websites, APIs, microservices platforms, and edge gateways. Netflix, Dropbox, and WordPress.com use it to handle millions of concurrent connections.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:30](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:30)

**Current:**

> To use Nginx effectively in production, you must understand **how requests flow through its processing pipeline**, **how configuration directives are evaluated**, and **how architectural decisions affect performance characteristics**.

**Suggested alternative:**

> The rest of this article follows request processing, configuration rules, and their effects on performance.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:89](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:89)

**Current:**

> Nginx workers use an event loop similar to Node.js, but implemented in C for maximum performance.

**Suggested alternative:**

> Nginx workers use an event loop implemented in C, similar to the model used by Node.js.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:137](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:137)

**Current:**

> Understanding Nginx's request processing phases is crucial for correct configuration.

**Suggested alternative:**

> The request phases determine when each part of the configuration runs.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:368](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:368)

**Current:**

> Nginx excels as a reverse proxy, sitting between clients and application servers.

**Suggested alternative:**

> As a reverse proxy, Nginx sits between clients and application servers.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:378](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:378)

**Current:**

> This works, but is suboptimal for production.

**Suggested alternative:**

> This example only sets the upstream. The next one adds forwarded headers, timeouts, and buffering settings.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:558](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:558)

**Current:**

> * Most intelligent algorithm, adapts to backend performance

**Suggested alternative:**

> Adapts to backend response times

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:752](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:752)

**Current:**

> Nginx can cache proxy responses, dramatically reducing backend load.

**Suggested alternative:**

> Nginx can cache proxy responses, reducing the requests sent to the backend.

**Location:** [app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:841](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:841)

**Current:**

> Nginx provides sophisticated rate limiting to protect backends and enforce quotas.

**Suggested alternative:**

> Nginx rate limits protect backends and enforce quotas.

**Preserve/context:** The company names and “millions of concurrent connections” remain in the first alternative because they are existing claims, not newly researched facts. Verify their source before treating that sentence as evidence.

<a id="p17"></a>

### P17. AeroUDP article introduction

**Why it may feel AI-written or templated:** The introduction is substantive, but it uses a polished reference-implementation pitch before the mechanisms are explained.

**What is generic, repetitive, or unnatural:** “Concrete reference implementation,” “essentially a stripped-down hybrid,” and “idiomatic asynchronous Rust” make the sentence dense and self-evaluative.

**Location:** [app/blog/aeroudp-networking-concepts/page.mdx:15](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/aeroudp-networking-concepts/page.mdx:15)

**Current:**

> This article explains the core networking concepts that make a reliable transport protocol work, using AeroUDP as a concrete reference implementation. AeroUDP is a reliable, ordered, congestion-controlled transport protocol layered on top of unreliable UDP, essentially a stripped-down hybrid of TCP and QUIC written in idiomatic asynchronous Rust.

**Suggested alternative:**

> AeroUDP combines simplified TCP and QUIC ideas in an async Rust transport protocol. It adds reliable, ordered delivery and congestion control over UDP. This article explains those mechanisms using the implementation.

**Preserve/context:** This retains the existing TCP/QUIC comparison; it does not establish protocol compatibility. If “hybrid” was only intended as a loose analogy, clarify that separately rather than silently changing the technical claim.

<a id="p18"></a>

### P18. AeroUDP observability maxim

**Why it may feel AI-written or templated:** The first sentence is an absolute maxim where the next sentence already provides useful implementation detail.

**What is generic, repetitive, or unnatural:** “A protocol you cannot measure is a protocol you cannot debug or tune” sounds polished and quotable, but overstates the point.

**Location:** [app/blog/aeroudp-networking-concepts/page.mdx:376](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/aeroudp-networking-concepts/page.mdx:376)

**Current:**

> A protocol you cannot measure is a protocol you cannot debug or tune. AeroUDP exposes a `ConnectionMetrics` snapshot backed by atomic counters:

**Suggested alternative:**

> For debugging and tuning, AeroUDP exposes a ConnectionMetrics snapshot backed by atomic counters.

<a id="p19"></a>

### P19. SimuKernel article opening

**Why it may feel AI-written or templated:** The introduction describes the existence and detail of the article rather than immediately naming what it covers.

**What is generic, repetitive, or unnatural:** “This article provides detailed explanations” is a generic opening that can introduce almost any tutorial.

**Location:** [app/blog/simukernel-operating-system-concepts/page.mdx:15](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/simukernel-operating-system-concepts/page.mdx:15)

**Current:**

> This article provides detailed explanations of the operating system concepts implemented in SimuKernel.

**Suggested alternative:**

> SimuKernel models CPU scheduling, paging, and process management. Here’s how those parts work.

**Preserve/context:** The short notes and algorithm comparisons throughout the rest of this article do not need to be converted into polished essay prose.

<a id="p20"></a>

### P20. Ask page teaser

**Why it may feel AI-written or templated:** This is distinctive copy and could be intentional personal voice. It also has the feel of a polished advertising teaser.

**What is generic, repetitive, or unnatural:** “The thing you almost didn’t” leaves the action unstated and repeats the emotional invitation already present in “Ask me anything.”

**Location:** [components/ask/ask-page.tsx:239](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:239)

**Current:**

> Especially the thing you almost didn’t.

**Suggested alternative:**

> Ask anonymously. No name needed.

**Location:** [app/ask/opengraph-image.tsx:14](/home/mohammed/mohammed/projects/mdx-portofolio/app/ask/opengraph-image.tsx:14)

**Current:**

> Especially the thing you almost didn’t. Ask anonymously. No name needed.

**Suggested alternative:**

> Ask a question anonymously. You don’t need to leave your name.

**Preserve/context:** Low priority. If you wrote and like this line, keep it. The form’s privacy explanation and ordinary buttons already sound natural.

<a id="p21"></a>

### P21. Two familiar caption-style public replies

**Why it may feel AI-written or templated:** These are understandable answers, but their wording sounds like a reusable social caption.

**What is generic, repetitive, or unnatural:** “One moment at a time” and “life’s too short” are stock phrases rather than details of your own experience.

**Location:** [Published answer 1f6299e5-101c-41ac-84bc-04c5929b41bd; answered 2025-01-02](https://ask.modev.me/?question=1f6299e5-101c-41ac-84bc-04c5929b41bd#question-1f6299e5-101c-41ac-84bc-04c5929b41bd); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> still living it, one moment at a time.

**Suggested alternative:**

> I’m still living it.

**Location:** [Published answer 050c0bdb-ee65-4ba5-b630-35bdaa38a7ec; answered 2025-01-02](https://ask.modev.me/?question=050c0bdb-ee65-4ba5-b630-35bdaa38a7ec#question-050c0bdb-ee65-4ba5-b630-35bdaa38a7ec); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> relive my best memory، life’s too short not to feel that joy again.

**Suggested alternative:**

> I’d relive my best memory. I’d like to feel that happy again.

**Preserve/context:** Very optional. No specific memory has been invented, and these short replies do not establish AI authorship.

<a id="p22"></a>

### P22. Unused blog summaries and matching older social images

**Why it may feel AI-written or templated:** These summaries read like glossary definitions instead of introductions to the particular articles.

**What is generic, repetitive, or unnatural:** The phrasing is textbook-like; “this value type” is especially stiff. The SimuKernel description is broad compared with the actual simulator features.

**Location:** [app/data.tsx:255](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:255); [public/og/difference-between-cluster-and-non-cluster-index.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/difference-between-cluster-and-non-cluster-index.png) — Older image, description below the title

**Current:**

> An index is a disk-based structure linked to a table or view that speeds up the retrieval of rows.

**Suggested alternative:**

> How clustered and non-clustered indexes help the database find rows.

**Location:** [app/data.tsx:262](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:262); [public/og/3-ways-to-build-custom-middleware-in-aspnet-core.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/3-ways-to-build-custom-middleware-in-aspnet-core.png) — Older image, description below the title

**Current:**

> Middleware is software that is assembled into an app pipeline to handle requests and responses.

**Suggested alternative:**

> Three ways to write ASP.NET Core middleware and how each fits into the request pipeline.

**Location:** [app/data.tsx:269](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:269); [public/og/boxing-and-unboxing-in-csharp.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/boxing-and-unboxing-in-csharp.png) — Older image, description below the title

**Current:**

> Boxing is the process of converting a value type to the type object or to any interface type implemented by this value type.

**Suggested alternative:**

> How C# boxes value types as object or interface references, and what happens during unboxing.

**Location:** [app/data.tsx:276](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:276); [public/og/simukernel-operating-system-concepts.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/simukernel-operating-system-concepts.png) — Older image, description below the title; [public/og/simukernel-os-concepts-explained.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/simukernel-os-concepts-explained.png) — Second retained SimuKernel image, same description

**Current:**

> SimuKernel is a kernel simulator that allows you to explore the internals of an operating system.

**Suggested alternative:**

> CPU scheduling, paging, and process management in the SimuKernel simulator.

**Preserve/context:** BLOG_POSTS has no current consumers; the app discovers metadata from MDX instead. These static images are not selected by the current generated /og/<slug> routes. Do not prioritize these ahead of active copy, or edit app/data.tsx expecting the live article descriptions to change.

<a id="p23"></a>

### P23. Repeated word in older social-image reading times — formatting issue

**Why it may feel AI-written or templated:** The duplicate word makes the assets look unfinished. It is not a useful AI-authorship signal.

**What is generic, repetitive, or unnatural:** The label appends “read” to a value that already includes “min read.”

**Location:** [public/og/3-ways-to-build-custom-middleware-in-aspnet-core.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/3-ways-to-build-custom-middleware-in-aspnet-core.png) — Lower author/reading-time badge; [public/og/boxing-and-unboxing-in-csharp.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/boxing-and-unboxing-in-csharp.png) — Same duplicate label; [public/og/difference-between-cluster-and-non-cluster-index.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/difference-between-cluster-and-non-cluster-index.png) — Same duplicate label

**Current:**

> 2 min read read

**Suggested alternative:**

> 2 min read

**Location:** [public/og/simukernel-operating-system-concepts.png](/home/mohammed/mohammed/projects/mdx-portofolio/public/og/simukernel-operating-system-concepts.png) — Lower author/reading-time badge

**Current:**

> 7 min read read

**Suggested alternative:**

> 7 min read

**Preserve/context:** Retained public assets, not the current generated cards. The suggested labels preserve the existing numbers; if the images are reused, generate reading times from current article metadata rather than assuming these old values are still correct.

<a id="p24"></a>

### P24. Literal HTML entities in a public answer — formatting issue

**Why it may feel AI-written or templated:** Visible entity syntax interrupts otherwise natural wording. This is an encoding problem, not evidence of an AI writing style.

**What is generic, repetitive, or unnatural:** The stored answer contains &quot; and &#039; as text. The React renderer inserts question.answer as plain text.

**Location:** [Published answer 265e64e0-4670-4a5b-b55b-d2eda0e41b6f; answered 2024-09-07](https://ask.modev.me/?question=265e64e0-4670-4a5b-b55b-d2eda0e41b6f#question-265e64e0-4670-4a5b-b55b-d2eda0e41b6f); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> It was great until the &amp;quot;It&amp;#039;s not your fault&amp;quot; scene

**Suggested alternative:**

> It was great until the "It's not your fault" scene

**Preserve/context:** The second affected answer is H17. Decode the affected imported text as text if fixing it later; no prose rewrite is needed for this answer.

<a id="p25"></a>

### P25. Twelve public placeholder replies — content issue

**Why it may feel AI-written or templated:** These look like leftover test content and make the archive feel unfinished; they do not sound like AI prose.

**What is generic, repetitive, or unnatural:** Ten answers contain only “test” and two contain only “testt.” Rewriting them into plausible answers would invent content.

**Location:** [Published answer cb585b73-4775-4e71-a97f-d22acaccc5ec; answered 2024-12-20](https://ask.modev.me/?question=cb585b73-4775-4e71-a97f-d22acaccc5ec#question-cb585b73-4775-4e71-a97f-d22acaccc5ec); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> test

**Suggested alternative:**

> No invented replacement. If this was only a test reply, archive that Q&amp;A record; otherwise restore the actual intended answer.

**Scope/note:** 10 published answers contain exactly “test”. Other matching records: [befb8b10-f7e8-496f-b356-dec03f416ef9](https://ask.modev.me/?question=befb8b10-f7e8-496f-b356-dec03f416ef9#question-befb8b10-f7e8-496f-b356-dec03f416ef9), [b94ccf7e-0e14-47ba-a938-e4875330cf2a](https://ask.modev.me/?question=b94ccf7e-0e14-47ba-a938-e4875330cf2a#question-b94ccf7e-0e14-47ba-a938-e4875330cf2a), [fbf72e78-9ac8-4c91-baef-970a8a1e1426](https://ask.modev.me/?question=fbf72e78-9ac8-4c91-baef-970a8a1e1426#question-fbf72e78-9ac8-4c91-baef-970a8a1e1426), [e133745d-09b4-4e3b-801c-3da1fed76731](https://ask.modev.me/?question=e133745d-09b4-4e3b-801c-3da1fed76731#question-e133745d-09b4-4e3b-801c-3da1fed76731), [50e6e052-6073-4d6d-8a17-9aa5a9f6f4d1](https://ask.modev.me/?question=50e6e052-6073-4d6d-8a17-9aa5a9f6f4d1#question-50e6e052-6073-4d6d-8a17-9aa5a9f6f4d1), [f565ad38-4d27-4138-b0b3-c35417d27635](https://ask.modev.me/?question=f565ad38-4d27-4138-b0b3-c35417d27635#question-f565ad38-4d27-4138-b0b3-c35417d27635), [0e3fa4bc-ce8a-4362-9a90-f4eb026a2621](https://ask.modev.me/?question=0e3fa4bc-ce8a-4362-9a90-f4eb026a2621#question-0e3fa4bc-ce8a-4362-9a90-f4eb026a2621), [1d57954d-73ef-492a-b1ac-e61e36b450bd](https://ask.modev.me/?question=1d57954d-73ef-492a-b1ac-e61e36b450bd#question-1d57954d-73ef-492a-b1ac-e61e36b450bd), [84e911b9-5260-450a-88e1-deac0ed6e742](https://ask.modev.me/?question=84e911b9-5260-450a-88e1-deac0ed6e742#question-84e911b9-5260-450a-88e1-deac0ed6e742).

**Location:** [Published answer d6d704b2-dd59-414d-9a33-92592c48f50b; answered 2024-12-19](https://ask.modev.me/?question=d6d704b2-dd59-414d-9a33-92592c48f50b#question-d6d704b2-dd59-414d-9a33-92592c48f50b); [components/ask/ask-page.tsx:99](/home/mohammed/mohammed/projects/mdx-portofolio/components/ask/ask-page.tsx:99) — Renderer only; the answer is stored outside the repository

**Current:**

> testt

**Suggested alternative:**

> No invented replacement. If this was only a test reply, archive that Q&amp;A record; otherwise restore the actual intended answer.

**Scope/note:** 2 published answers contain exactly “testt”. Other matching records: [2872a97d-2f44-4846-9dc9-df460f192a43](https://ask.modev.me/?question=2872a97d-2f44-4846-9dc9-df460f192a43#question-2872a97d-2f44-4846-9dc9-df460f192a43).

**Preserve/context:** This is an optional archive-cleanup recommendation only. No answers were changed, archived, or published during the audit.


## 5. Overall assessment

The main portfolio is already fairly natural. The strongest passages name the systems you worked on, list specific capabilities, and state limitations plainly. Most project summaries, experience highlights, skill lists, and controls should stay. The README is particularly direct.

The weaker passages share a few patterns: adjective-heavy biographies, repeated résumé accomplishments, broad statements about why a topic is “critical,” unqualified endorsements such as “production-grade,” and conclusions that summarize good engineering in slogans. Some project case-study framing reads like an outside evaluator’s write-up; that is a smaller issue than the generic blog introductions and metadata.

This uneven register can make parts of the portfolio feel assisted or templated. It cannot determine whether AI was used, which passages were generated, or who wrote them. Technical precision, grammatical polish, repeated documentation structure, and the word “AI” in a project description are not evidence of authorship.

**Factual consistency to resolve separately from tone:**

- **Years of experience.** [components/siteConfig.tsx:10](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:10), its keywords at [components/siteConfig.tsx:63](/home/mohammed/mohammed/projects/mdx-portofolio/components/siteConfig.tsx:63), the two social descriptions, and [public/humans.txt:41](/home/mohammed/mohammed/projects/mdx-portofolio/public/humans.txt:41) say “5+ years” or “5 years.” The displayed work history begins with the Manara internship in March 2024 ([app/data.tsx:243](/home/mohammed/mohammed/projects/mdx-portofolio/app/data.tsx:243)). Earlier programming experience could explain the number; the repository does not explain its basis. The proposed bio preserves 5+ years rather than inventing a replacement.
- **LSMSharp guarantees.** The résumé says “ACID guarantees” and “crash-safe WAL” at [public/resume.tex:128](/home/mohammed/mohammed/projects/mdx-portofolio/public/resume.tex:128). The case study says SetAsync can complete before persistence ([lib/project-case-studies.ts:54](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:54)), records a post-compaction integrity failure ([lib/project-case-studies.ts:68](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:68)), and describes transactions/snapshot isolation as separate design work ([lib/project-case-studies.ts:70](/home/mohammed/mohammed/projects/mdx-portofolio/lib/project-case-studies.ts:70)). Check the revision and scope before adopting final résumé wording. A synonym cannot reconcile those statements.
- **Performance numbers need their original context.** The indexing table at [app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:361](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/difference-between-cluster-and-non-cluster-index/page.mdx:361) gives timings for 10 million rows. The pagination plans at [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:91](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:91) and [app/blog/pagination-strategies-offset-vs-cursor/page.mdx:447](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:447) give exact times and buffer counts. The chart [public/blog/pagination-strategies/offset-vs-cursor-performance.webp](/home/mohammed/mohammed/projects/mdx-portofolio/public/blog/pagination-strategies/offset-vs-cursor-performance.webp) says “Tested on 10M rows, PostgreSQL 15.” The checked-in verification record covers a 103-row PostgreSQL 18.6 correctness fixture, not these benchmarks ([docs/verification/2026-09-16.md:8](/home/mohammed/mohammed/projects/mdx-portofolio/docs/verification/2026-09-16.md:8)). These could be separate legitimate examples, but their benchmark provenance is not supplied by that verification. Do not invent hardware, a test run, or a source, and do not relabel them as “illustrative” without checking.
- **Absolute technical labels are not just style.** The pagination comparison says “Scales indefinitely” ([app/blog/pagination-strategies-offset-vs-cursor/page.mdx:690](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/pagination-strategies-offset-vs-cursor/page.mdx:690)). Its chart says “O(log n) - constant time,” and the cursor diagram says “No rows skipped/scanned.” Those need a clear distinction between dataset size, pagination depth, index seek work, and reading the returned page. The insert diagram also says the original row 6 is skipped even though insertion before an offset explains a duplicated boundary row. These have not been silently rewritten as different technical claims in this audit.
- **Other unqualified capacity claims.** The Nginx article includes “100,000+ concurrent connections on modest hardware” ([app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:83](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:83)), a roughly 90% CPU reduction ([app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:714](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:714)), and roughly 0.1 ms cache-hit response times ([app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:825](/home/mohammed/mohammed/projects/mdx-portofolio/app/blog/nginx-deep-dive-architecture-configuration-production-patterns/page.mdx:825)). Their conditions matter more than replacing an adjective. This review does not certify or replace those figures.

**Recommended order:** fix active metadata, consolidate the repeated Firecracker résumé content, remove the generic blog framing, and correct the unfinished image labels. Then consider the optional case-study and contact edits. Keep the concrete technical content and ordinary UI labels. Retained schema helpers and old social cards can wait unless they are going to be used again.

**Review limits and verification:** this was a content review, not a new benchmark run, employment verification, technical correctness audit, or application behavior test. Source locations were checked against the local files, the résumé PDF was read separately, and flagged raster labels were visually checked. The public-answer findings refer to the snapshot returned by the public API during this review; no private inbox access was used. Application tests were not needed for adding this report, and no source or remote content was changed.
