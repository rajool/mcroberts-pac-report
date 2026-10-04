# McRoberts PAC report: working rules

Public static site (GitHub Pages serves `main`) and the PDF printed from it. No build step.

## Before publishing

- A push to `main` publishes the site, and any pushed branch is public in this repo. The draft contains figures the Treasurer has not approved. `.claude/settings.json` asks before every push and merge.
- Do not push a version for families until the PAC Treasurer and the PAC executive have approved it. Set `meta.mode` to `"public"` for that version.
- `meta.mode` only hides the draft strip, the documents list and the source chips in `index.html`; `data.js` still ships them and `print.html` ignores the mode. Check the page, the PDF text and `data.js` before calling a version public.
- The e-Transfer address (`appeal.howToGive`) stays unconfirmed until the Treasurer confirms it takes donations. While its status is `pending`, `index.html` and `print.html` show a "coming soon" line and not the address or the Copy button (the address is still in `data.js`).
- After any figure change, re-print the PDF from the repo root (steps in `README.md`) and run the grep check there for numbers written outside `data.js`.

## Privacy

- The naming, contact and money-figure rules of the PAC website apply here too: section 5 of [COMPONENTS.md in mcroberts-pac](https://github.com/rajool/mcroberts-pac/blob/main/COMPONENTS.md#5-writing-rules). A person is named, in `data.js` or anywhere else, only after they have agreed to be named; until then the role stands in.
- Review notes, questions about the treasurers' figures and anything from private correspondence stay in the private working record (see `README.md`), never in this repo.
- No secrets, third-party scripts or third-party fonts.

## Conventions

- Figures live in `data.js`. Status vocabulary: confirmed, reported, derived, pending. Never change a real-world value without a source.
- Commit with your GitHub noreply address, never a personal email.
- English only. Conventional Commits.
