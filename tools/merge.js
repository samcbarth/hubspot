#!/usr/bin/env node
/*
 * Fold member articles into a topic guide.
 * Usage: node tools/merge.js <host-slug> <member-slug> [member-slug ...]
 *
 * For each member:
 *  - articles/<member>/index.html becomes a redirect stub (meta refresh 0 +
 *    canonical to the host), so old links and rankings pass to the guide.
 *  - articles.js gets draft: true and mergedInto: '<host>' on that entry,
 *    which keeps it out of the homepage, sitemap, feed and llms.txt.
 * Write the member's content into the host guide BEFORE running this.
 * Then run: node tools/build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const [host, ...members] = process.argv.slice(2);
if (!host || !members.length) { console.error('usage: node tools/merge.js <host> <member...>'); process.exit(1); }

const ARTICLES = require(path.join(ROOT, 'articles.js'));
const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]));
const H = bySlug[host];
if (!H || H.draft) { console.error(`host ${host} is not a published article`); process.exit(1); }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let src = fs.readFileSync(path.join(ROOT, 'articles.js'), 'utf8');
const nl = src.includes('\r\n') ? '\r\n' : '\n';
for (const m of members) {
  if (!bySlug[m]) { console.error(`skip ${m}: not in articles.js`); continue; }
  if (m === host) continue;
  const url = `https://hubspot.samcbarth.com/articles/${host}/`;
  const stub = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Moved: ${esc(H.title)} - HubSpot Field Notes</title>
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=../${host}/">
</head>
<body data-slug="${m}" data-merged-into="${host}">
<p>This note is now part of <a href="../${host}/">${esc(H.title)}</a>.</p>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'articles', m, 'index.html'), stub);
  const re = new RegExp(`^([ \\t]*)slug: ['"]${m}['"],\\r?\\n`, 'm');
  const match = src.match(re);
  if (!match) { console.error(`could not find entry for ${m}`); continue; }
  const ind = match[1];
  // Drop any earlier draft/pruned/mergedInto lines right after the slug, then add ours.
  const after = src.slice(match.index + match[0].length).replace(/^([ \t]*(draft|pruned|mergedInto): [^\n]*\n)+/, '');
  src = src.slice(0, match.index) + match[0] + `${ind}draft: true,${nl}${ind}mergedInto: '${host}',${nl}` + after;
  console.log(`merged ${m} -> ${host}`);
}
fs.writeFileSync(path.join(ROOT, 'articles.js'), src);

// Point internal links at the host instead of the stub.
const dir = path.join(ROOT, 'articles');
let rewired = 0;
for (const s of fs.readdirSync(dir)) {
  if (members.includes(s)) continue;
  const p = path.join(dir, s, 'index.html');
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  let changed = false;
  for (const m of members) {
    const re = new RegExp(`href="\\.\\./${m}/"`, 'g');
    if (re.test(html)) { html = html.replace(re, s === host ? 'href="#"' : `href="../${host}/"`); changed = true; }
  }
  if (changed) { fs.writeFileSync(p, html); rewired++; }
}
console.log(`rewired links in ${rewired} article(s)`);
