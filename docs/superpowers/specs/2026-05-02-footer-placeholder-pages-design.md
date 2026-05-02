# Footer Placeholder Pages Design

Date: 2026-05-02
Project: Keystone landing
Status: Approved for implementation planning

## Goal

Replace the placeholder footer links with real, static pages that make the Keystone landing site feel complete and truthful without changing the underlying static-site architecture.

This first pass covers only the footer links that currently point to `#`:

- Documentation
- Blog
- Security
- Releases
- About
- Privacy
- Terms

The existing in-page Platform links, including Overview, Benchmarks, Schemes, Reports, Contact, and the primary landing-page anchors, stay as section anchors unless a later pass explicitly expands them.

## Context

The project is a plain static HTML/Babel site. The true page composition currently lives in:

- `index.html` for global CSS, script loading, and the root element
- `src/src/app.jsx` for landing-page section order
- `src/src/parts.jsx` for shared primitives, navigation, and footer
- `src/src/sections.jsx` for landing-page content
- `src/src/icons.jsx` for inline icon primitives

The footer currently lists placeholder resource and company links. The thesis in `tmp-folder/Bachelor_Thesis.md` provides credible source material for the non-legal pages: product requirements, use cases, architecture, validation methodology, limitations, and future development directions.

## Recommended Approach

Create one real static route per placeholder footer link:

- `/docs/`
- `/blog/`
- `/security/`
- `/releases/`
- `/about/`
- `/privacy/`
- `/terms/`

Each route should be a folder with an `index.html` file so Vercel and local static serving resolve cleanly without client-side routing.

Do not introduce a framework, router, CMS, package migration, or build step. This keeps the implementation aligned with the current repo and reduces deployment risk.

## Page Architecture

The implementation should define a reusable inner-page pattern instead of seven unrelated pages.

The preferred structure is:

- Keep landing-page React files focused on the homepage.
- Add a lightweight shared static-page CSS layer in each page or via a small shared stylesheet if that is simpler in implementation.
- Reuse the same Keystone visual language: dark nav/footer, hidden-K wordmark, blue accent, compact technical cards, restrained typography, and responsive containers.
- Include a consistent page header with eyebrow, title, short lede, and a back/home affordance.
- Include a consistent footer or footer-lite section linking back to the landing page and the other footer pages.

If implementation finds that extracting CSS from `index.html` would create too much churn, duplicate only the minimal page-shell CSS needed for these inner pages. The first pass values finished, truthful pages over a larger design-system refactor.

## Page Content

### Documentation

Purpose: Product documentation overview, not a full docs portal.

Content should introduce Keystone's four core workflows from the thesis:

- Cryptographic benchmarking
- Quantum resource analysis
- Hybrid cryptographic system
- Metrics and reporting

It should also summarize the system model: interface layer, application layer, domain layer, infrastructure layer, and external integrations such as liboqs, OpenSSL, IBM Quantum, and Qiskit.

Avoid claiming complete public API documentation or exhaustive user guides unless those assets exist.

### Blog

Purpose: Research-notes index rather than a generic corporate blog.

Recommended label in page content: `Research Notes`.

First-pass notes can be thesis-derived cards or short summaries:

- Why post-quantum benchmarking needs repeatable measurement
- Benchmark methodology and validation
- Quantum resource estimation with Shor and Grover
- Hybrid encryption using ML-KEM, AES-GCM, and ML-DSA

This page does not need article routing in the first pass.

### Security

Purpose: Security and methodology page.

Content should cover:

- Repeatability and controlled benchmarking
- Input validation and parameter constraints
- Secure handling of API credentials for quantum services
- Careful handling of cryptographic material
- Native adapter isolation for high-performance cryptographic operations
- Known limitations around cloud backend availability, quantum noise, and lack of aggressive mitigation in the thesis runs

Avoid overclaiming that Keystone certifies security, compliance, or production readiness.

### Releases

Purpose: Project status and thesis-build release notes.

Content should be truthful to the prototype/research context:

- Keystone thesis build
- Benchmarking workflows
- Quantum execution integration
- Hybrid encryption demonstration
- Research export and reporting
- Future directions: Linux timing improvements, additional quantum backends, provider adapters, and expanded comparison tooling

Avoid fake commercial version history.

### About

Purpose: Explain Keystone and its thesis context.

Content should state that Keystone is a post-quantum cryptography benchmarking platform developed from a bachelor thesis on cryptographic schemes applicable to post-quantum cryptography.

Target audiences:

- Cryptographic researchers
- Security analysts
- Students
- Educators

The tone should be direct, research-first, and credible.

### Privacy

Purpose: Minimal, truthful static-site privacy page.

Content should say the public landing site does not provide accounts, payment processing, or an application backend in this first pass. If the newsletter form remains nonfunctional, the page should not imply that subscriptions are processed.

Implementation should either:

- Disable or clearly neutralize the newsletter form behavior, or
- Add explicit static-site copy that no backend submission is wired yet.

Do not invent analytics, data processors, or retention policies unless they are present in the repo or deployment config.

### Terms

Purpose: Simple research/prototype terms page.

Content should clarify:

- Keystone content is provided for research, education, and evaluation.
- The site does not provide legal, compliance, or security certification advice.
- Benchmark figures and methodology should be interpreted in context.
- Users are responsible for validating results before operational security decisions.

Keep it readable and restrained. Avoid dense fake legal boilerplate.

## Footer Rewiring

Update the footer links in `src/src/parts.jsx`:

- `Documentation` -> `/docs/`
- `Blog` -> `/blog/`
- `Security` -> `/security/`
- `Releases` -> `/releases/`
- `About` -> `/about/`
- `Privacy` -> `/privacy/`
- `Terms` -> `/terms/`

The existing footer column labels can stay. If the Blog page is branded as Research Notes, the footer label can remain `Blog` for familiarity or become `Research Notes` if the page design benefits from a more precise label. Prefer changing the visible label to `Research Notes` only if it does not make the footer feel crowded.

## Error Handling And Edge Cases

Because this is a static site, the primary failure modes are missing routes, broken relative assets, and layout overflow.

Implementation should account for:

- Root-relative URLs for assets and navigation where possible.
- Each inner page working when loaded directly, not only through homepage navigation.
- The hidden-K logo rendering on inner pages.
- Footer links remaining reachable from every inner page.
- No horizontal overflow on mobile, tablet, and desktop.
- Forms not implying a working backend if none exists.

## Testing And Verification

Extend or add Playwright coverage for:

- Each footer placeholder link resolves to a real page with a 200 response.
- Each created page has the expected heading and a link back to the Keystone home page.
- The landing page footer no longer contains placeholder `href="#"` links for the seven target links.
- Existing responsive tests still pass.
- Mobile/tablet/desktop pages do not horizontally overflow.

Manual verification should include starting the static preview server and opening at least the homepage, docs page, privacy page, and terms page.

## Scope Boundaries

In scope:

- Static page creation for the seven placeholder footer links
- Footer link rewiring
- Shared inner-page styling/pattern
- Thesis-grounded page copy
- Focused Playwright verification

Out of scope:

- Dedicated pages for landing-section anchors such as Benchmarks, Schemes, Reports, or Contact
- CMS or markdown content pipeline
- Blog article routing
- Download backend
- Newsletter backend
- Authentication, accounts, or payment flows
- Legal review

## Approval Notes

The selected approach is option 1 from brainstorming: one lightweight static page per placeholder footer link. The user confirmed that this first pass should cover placeholder links only and approved the architecture and page/content split.
