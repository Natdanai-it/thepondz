# Pond Natdanai

Portfolio and public course catalogue for IT Support, Web Systems and Private IT Training.

## Main pages

- `index.html` — eight-section homepage preserving the original Main design and pricing
- `projects.html` — evidence-based case studies and 17-item project archive
- `courses.html` — 15 searchable private course tracks
- `about.html` — profile and capabilities
- `articles.html` — searchable library of 18 practical IT articles across IT Support, Network, Windows & Data, Security, IT Procurement and Web Systems
- `private-access.html` — after-class video, slides and file access policy

## Private course security

The full IT Procurement and Jayler course pages are stored as AES-256-GCM encrypted payloads under `assets/private/`. The public HTML pages contain only the password form and decrypt the lesson locally after a valid password is entered.

Large lesson images are removed from the HTML and stored in separate encrypted media bundles under `assets/private-media/`. The unlock flow decrypts those bundles in memory and restores each image with a temporary Blob URL, so the private teaching images are not published as readable static files.

The course shell fetches lesson HTML and media in parallel, derives the PBKDF2 key once per unlock, and creates private image Blob URLs only when images approach the viewport. Large PNG lesson captures were converted to encrypted WebP data, reducing the Day 1 and Day 2 media payloads by roughly 92% and 88% while keeping the assets encrypted. Public images include intrinsic dimensions and native lazy-loading attributes to reduce layout shift and unnecessary downloads.

- Passwords are distributed separately and must never be committed to this repository.
- IT Procurement Day 1–4, Presentation and Toolkit share one course-group password.
- Jayler Digital Power User uses a separate password.
- Video replays and customer-specific files should remain in a private storage service with individual permissions.

Because GitHub Pages is static hosting, it cannot provide individual accounts, expiry, revocation or an access log. Use an authentication service if those controls are required.

For a GitHub Pages project site, `robots.txt` under the project path cannot control the account-level host root. Private course shells therefore also use `noindex, nofollow`; if the account owns a separate root Pages repository, copy the crawler rules to that repository's root as well.

## UX and performance updates

- Typography is restored to the original visual system: `Sora` for Latin/display text, `Noto Sans Thai` for Thai text, and `JetBrains Mono` for technical labels. Font connections are preconnected and loaded once per page.
- The full-page gradient and review background canvases are static. Only the hero network canvas animates on larger screens, with a capped pixel ratio to reduce repaint and GPU load.
- The hero uses a denser mouse-reactive network with varied blue/cyan nodes and no circular cursor spotlight. Reviews advance one card every 2.2 seconds, pause briefly after touch/drag/wheel input, stop off-screen and include an explicit play/pause control.
- The original pricing section is restored with IT Support, Web/System and 1:1 Workshop guidance plus a direct Fastwork call-to-action.
- Article headers are compact, decorative duplicate badges and repeated heading cards are removed, and the article body now starts close to the hero instead of inheriting the generic section gap.
- The table of contents remains sticky on desktop and collapses behind an explicit button on smaller screens, so section labels are not repeated above the article unless the reader asks to see the index.
- Literal duplicate review cards were removed from the homepage; the review row is now a unique, horizontally scrollable list.
- Search and filter controls run only on pages that actually contain those controls, so the homepage never shows a false empty-search state.
- The course catalogue count is aligned with the 15 published course cards.
- Current-page navigation, protected-course badges and a lightweight reading-progress bar improve orientation without distracting continuous animation.
- The network canvas pauses outside the viewport or in a background tab, and becomes a static illustration on small screens or when reduced motion is requested.
- Images load lazily where appropriate, the chat invitation appears only once per session, and search supports `/` to focus plus `Esc` to clear.
- Project archives now use system-style visual previews; all articles use category-specific diagrams instead of text-only cards.
- Duplicate stylesheet loads, an obsolete enhancement script and unused evidence images were removed.
- Mobile pages use one bottom action bar instead of overlapping floating contact buttons, and all 18 article pages share the same table of contents and related-reading layout.

## Accessibility, SEO and analytics

- Every page includes a skip link and one `<main id="main-content">` landmark.
- Search filters expose `aria-pressed`; show-more controls expose `aria-expanded` and `aria-controls`.
- Articles include visible publish/update dates, author information, Breadcrumb schema, six category-specific 1200×630 PNG share images, a single downloadable pack containing all 18 checklists, and FAQ schema only where a real FAQ is shown.
- Article structured data includes `image` and `publisher`. Search/filter state is preserved in the URL for sharing or returning to the same result.
- Production CSS is consolidated into `assets/css/site.css` to reduce GitHub file count and HTTP requests. Privacy-friendly analytics is integrated into the existing public and course scripts, so no extra analytics file is required.
- The analytics code integrated into `core.js` and `course-lock.js` sends no data by default. To activate owner analytics, follow `ANALYTICS-SETUP.md`. It never sends the raw search phrase, and Do Not Track plus Global Privacy Control are respected.
- The private lesson payloads also include skip links, a main landmark, reduced-motion support and lazy image attributes after decryption.
- A secure per-customer login is not emulated in front-end JavaScript. The migration plan is documented in `AUTH-MIGRATION.md`.

## GitHub upload

This package contains no development-only scripts or obsolete source assets and stays below GitHub's 100-file web-upload limit. Extract the ZIP, then upload everything inside the extracted folder to the repository root.
