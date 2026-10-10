# McRoberts PAC 2025–26 financial report (draft)

A draft for review by the PAC Treasurer and the PAC executive. Not yet approved, and not yet for sharing with parents.

Live: https://rajool.github.io/mcroberts-pac-report/

This repository and its GitHub Pages site are public: whatever is pushed to `main` is published. Read `CLAUDE.md` before changing or pushing anything.

## Source of truth and approval

`data.js` is the source of the report's figures and of each figure's status. The private working record, `community/mcroberts-pac/2025-26-financial-report.md` in the Co-Treasurer's private `dastyar` repo, holds only what cannot be public: the private sources, the correspondence with the treasurers, and the open questions for the Treasurer. It links here for the figures. Approval is described in `CLAUDE.md` (Before publishing). Because this report ships as `data.js` plus a PDF printed from `print.html`, it is the one deliverable that has no separate Markdown copy.

## Files

- `data.js`: the report's figures. Every main figure has a status (confirmed, reported, derived, pending); sources are given for the main figures and for most of the others, not for every one. `meta.mode` is `"draft"` (shows the draft strip, the documents still awaited and the source chips) or `"public"` (hides them in `index.html`). Hiding is not removal: `data.js` still sends everything to the browser, and `print.html` does not read `meta.mode`.
- `index.html` + `charts.js` + `scrolly.js` + `give-explorer.js`: the interactive report.
- `print.html`: the Letter-size print version. It reads the same `data.js` and always prints the draft edition.
- `2025-26-financial-report-draft.pdf`: printed from `print.html`.
- `fonts/`: Archivo, IBM Plex Mono and Public Sans (latin subset), self-hosted under the SIL Open Font License; the licence texts are `fonts/OFL-*.txt`. The pages make no third-party requests.

Figures in the page copy come from `data.js`: `charts.js` fills each `data-fmt` element (`PACViz.fillCopy`), and the rates (`rates`), the 2024–25 cheque number and date, and the shared facts (grant, wish list, Dry After Grad, scholarships) are written once there; `derive()` at the end of `data.js` works out where the year's gaming money went and logs an error if either account does not add up. Status labels, PDF marks and descriptions come from `meta.statuses`, and the PDF cover and signature (preparer, reviewer, edition, period, basis) come from `meta`. Check for stray figures after any change:

```
grep -nE '\$[0-9]' index.html print.html scrolly.js give-explorer.js charts.js
```

## Update

1. Edit the figures in `data.js`, then run the grep above to find any stray copy.
2. From the repo root, print the PDF (Letter, no headers or footers):

   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=4000 --print-to-pdf=2025-26-financial-report-draft.pdf print.html
   ```

   Read the PDF's text with macOS's own PDFKit, and confirm the figures and the cover text are there:

   ```
   osascript -l JavaScript -e 'ObjC.import("PDFKit"); $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath("2025-26-financial-report-draft.pdf")).string.js'
   ```

3. Commit and push. GitHub Pages serves the `main` branch root.
