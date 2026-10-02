# HubSpot Field Notes - working rules

Public site: https://hubspot.samcbarth.com (GitHub Pages from `main`, root folder, custom domain via `CNAME`).

## Voice
- Sam Barth's direct, practical voice. Answer first, then the steps.
- No em dashes. No emojis. No hype, filler, or generic AI phrasing.
- Never invent client stories, opinions, quotes, or experience. Sam supplies those.
- Every factual claim about HubSpot behavior links to the HubSpot Knowledge Base or developer docs in the Sources section.

## Article checklist
1. Copy `article-template.html` to `articles/<slug>/index.html`; fill every ALL_CAPS token.
2. Add the entry to `articles.js` with `draft: true`.
3. Capture screenshots in a real portal (20693956, a test account, or another portal with blurring). Raw PNGs go in `shots/<slug>/` (gitignored). Describe crops, blur, boxes, arrows, and step badges in `shots/<slug>/annotations.json`, then run `python tools/annotate.py <slug>`. Blur every email, name, portal ID, and customer record that is not Sam's own.
4. HubSpot app links use `class="hs-link" data-hs="/path/{portalId}/..."` with the generic `https://app.hubspot.com/l/...` href. Verify each one opens the right screen.
5. Fill "Last verified" with the date the steps were walked through.
6. `python tools/og.py <slug>` then `node tools/build.js`.
7. Show Sam the draft. Only after his OK: set `draft: false`, rebuild, commit, push `main`, verify the live URL.

## Structure
- `articles.js` is the index (home cards, search, filters, related, sitemap, feed, llms.txt).
- `partials/` holds head, header, footer. `node tools/build.js` syncs them into every page between `<!--#name-->` markers. Never edit inside those markers by hand.
- `assets/site.js` CONFIG holds the HubSpot portal, form IDs, meetings link, GA4 slot, and vote endpoint.
- `assets/hubspot-links.js` is the link builder library.
- Portal IDs typed by readers stay in the page. Never store or send them.

## Safety
- Never commit tokens, raw screenshots, or unblurred customer data.
