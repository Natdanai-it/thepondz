# Pond Natdanai

Portfolio and public course catalogue for IT Support, Web Systems and Private IT Training.

## Main pages

- `index.html` — seven-section homepage preserving the original Main design
- `projects.html` — evidence-based case studies and 17-item project archive
- `courses.html` — 15 searchable private course tracks
- `about.html` — profile and capabilities
- `articles.html` — practical IT articles
- `private-access.html` — after-class video, slides and file access policy

## Private course security

The full IT Procurement and Jayler course pages are stored as AES-256-GCM encrypted payloads under `assets/private/`. The public HTML pages contain only the password form and decrypt the lesson locally after a valid password is entered.

- Passwords are distributed separately and must never be committed to this repository.
- IT Procurement Day 1–4, Presentation and Toolkit share one course-group password.
- Jayler Digital Power User uses a separate password.
- Video replays and customer-specific files should remain in a private storage service with individual permissions.

Because GitHub Pages is static hosting, it cannot provide individual accounts, expiry, revocation or an access log. Use an authentication service if those controls are required.
