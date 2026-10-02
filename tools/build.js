#!/usr/bin/env node
/*
 * HubSpot Field Notes build. No dependencies. Run: node tools/build.js
 *
 * - Syncs partials/head|header|footer.html into every page between
 *   <!--#name--> and <!--/name--> markers (pages stay hand-written HTML).
 * - Writes static article cards into index.html for crawlers.
 * - Generates sitemap.xml, feed.xml, llms.txt from articles.js.
 * - Fails on broken article wiring (missing page, image, field, or slug mismatch).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://hubspot.samcbarth.com';
const ARTICLES = require(path.join(ROOT, 'articles.js'));
const published = ARTICLES.filter(a => !a.draft).sort((a, b) => b.published.localeCompare(a.published));
const errors = [];
const warnings = [];

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- validate articles.js ---------- */
const REQUIRED = ['slug', 'title', 'excerpt', 'type', 'problem', 'hubs', 'features', 'tier', 'permissions', 'verified', 'published', 'minutes', 'difficulty'];
const seen = new Set();
for (const a of ARTICLES) {
  for (const k of REQUIRED) if (a[k] == null || a[k] === '' || (Array.isArray(a[k]) && !a[k].length)) errors.push(`${a.slug || '?'}: missing ${k}`);
  if (seen.has(a.slug)) errors.push(`duplicate slug ${a.slug}`);
  seen.add(a.slug);
  if (!/^[a-z0-9-]+$/.test(a.slug || '')) errors.push(`${a.slug}: slug must be lowercase-dashes`);
  if (!['tip', 'guide'].includes(a.type)) errors.push(`${a.slug}: type must be tip or guide`);
  if (!['Fix it', 'How to', 'Hidden trick', 'Gotcha'].includes(a.problem)) errors.push(`${a.slug}: bad problem "${a.problem}"`);
  for (const d of ['verified', 'published']) if (!/^\d{4}-\d{2}-\d{2}$/.test(a[d] || '')) errors.push(`${a.slug}: ${d} must be YYYY-MM-DD`);
  const page = `articles/${a.slug}/index.html`;
  if (!fs.existsSync(path.join(ROOT, page))) { errors.push(`${a.slug}: missing ${page}`); continue; }
  const html = read(page);
  if (!html.includes(`data-slug="${a.slug}"`)) errors.push(`${page}: body data-slug does not match`);
  if (!html.includes(`/articles/${a.slug}/"`)) errors.push(`${page}: canonical does not match slug`);
  if (/\b(TITLE|EXCERPT|SLUG|VERIFIED_ISO|ANSWER_FIRST_SUMMARY)\b/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) errors.push(`${page}: template placeholders left in`);
  if (/[—]/.test(html)) errors.push(`${page}: contains an em dash`);
  const files = new Set([...html.matchAll(/(?:src|href)="([^"#?:]+\.(?:webp|png|jpe?g|gif|svg|csv|json|zip))"/g)].map(m => m[1]));
  for (const f of files) {
    if (!fs.existsSync(path.join(ROOT, 'articles', a.slug, f))) (a.draft ? warnings : errors).push(`${page}: missing file ${f}`);
  }
  if (!a.draft && !fs.existsSync(path.join(ROOT, 'articles', a.slug, 'og.png'))) warnings.push(`${a.slug}: no og.png (run python tools/og.py)`);
}

/* ---------- partials ---------- */
const partials = {
  head: read('partials/head.html'),
  header: read('partials/header.html'),
  footer: read('partials/footer.html'),
};

function pages() {
  const out = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const dir = path.join(ROOT, 'articles');
  if (fs.existsSync(dir)) for (const s of fs.readdirSync(dir)) {
    const p = `articles/${s}/index.html`;
    if (fs.existsSync(path.join(ROOT, p))) out.push(p);
  }
  return out;
}

function cardHTML(a, base) {
  const hubs = (a.hubs || []).slice(0, 2).map(h => `<span class="badge">${esc(h)}</span>`).join('');
  return `<a class="card" href="${base}articles/${esc(a.slug)}/">` +
    `<div class="badges"><span class="badge badge-type">${a.type === 'tip' ? 'Quick tip' : 'Guide'}</span>` +
    `<span class="badge badge-problem">${esc(a.problem)}</span>${hubs}</div>` +
    `<h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>` +
    `<div class="card-meta"><span>${esc(a.minutes)} min</span><span>${esc(a.difficulty)}</span><span>Verified ${esc(a.verified)}</span></div></a>`;
}

function replaceBlock(html, name, content, file) {
  const re = new RegExp(`(<!--#${name}-->)[\\s\\S]*?(<!--/${name}-->)`);
  if (!re.test(html)) return html;
  return html.replace(re, `$1\n${content.trim()}\n$2`);
}

for (const file of pages()) {
  const depth = file.split('/').length - 1;
  const base = file === '404.html' ? '/' : (depth ? '../'.repeat(depth) : './');
  let html = read(file);
  const slug = (html.match(/data-slug="([^"]+)"/) || [])[1];
  const art = slug && ARTICLES.find(a => a.slug === slug);
  const isDraft = file.startsWith('articles/') && (!art || art.draft);
  const robots = isDraft || file === 'article-template.html' ? '<meta name="robots" content="noindex">\n' : '<meta name="robots" content="index, follow, max-image-preview:large">\n';
  html = html.replace(/<html lang="en" data-base="[^"]*">/, `<html lang="en" data-base="${base}">`);
  html = replaceBlock(html, 'head', robots + partials.head.replace(/\{\{base\}\}/g, base), file);
  html = replaceBlock(html, 'header', partials.header.replace(/\{\{base\}\}/g, base), file);
  html = replaceBlock(html, 'footer', partials.footer.replace(/\{\{base\}\}/g, base), file);
  if (file === 'index.html') {
    const cards = published.length ? published.map(a => cardHTML(a, '')).join('\n') : '<p class="empty">The first field notes are publishing now.</p>';
    html = replaceBlock(html, 'cards', cards, file);
  }
  write(file, html);
}

/* ---------- sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, lastmod: published[0] ? published.map(a => a.verified).sort().pop() : today },
  { loc: `${SITE}/link-builder.html`, lastmod: today },
  { loc: `${SITE}/request-a-fix.html`, lastmod: today },
  { loc: `${SITE}/about.html`, lastmod: today },
  ...published.map(a => ({ loc: `${SITE}/articles/${a.slug}/`, lastmod: a.verified })),
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);

/* ---------- RSS ---------- */
const rfc = d => new Date(d + 'T12:00:00Z').toUTCString();
write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>HubSpot Field Notes</title>
  <link>${SITE}/</link>
  <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
  <description>HubSpot fixes, how-tos, and hidden tricks with real screenshots, by Sam Barth.</description>
  <language>en-us</language>
${published.map(a => `  <item>
    <title>${esc(a.title)}</title>
    <link>${SITE}/articles/${a.slug}/</link>
    <guid>${SITE}/articles/${a.slug}/</guid>
    <pubDate>${rfc(a.published)}</pubDate>
    <description>${esc(a.excerpt)}</description>
${(a.hubs || []).concat(a.features || []).map(c => `    <category>${esc(c)}</category>`).join('\n')}
  </item>`).join('\n')}
</channel>
</rss>
`);

/* ---------- llms.txt ---------- */
const byHub = {};
for (const a of published) for (const h of a.hubs) (byHub[h] = byHub[h] || []).push(a);
write('llms.txt', `# HubSpot Field Notes

> Step-by-step HubSpot fixes, how-tos, and gotchas by Sam Barth, a HubSpot-certified practitioner. Each article lists the subscription tier and permissions required and the date the steps were last verified in a live HubSpot portal. Independent resource, not an official HubSpot publication.

- Link builder for direct links into any HubSpot portal: ${SITE}/link-builder.html
- Request a fix: ${SITE}/request-a-fix.html

${Object.keys(byHub).sort().map(h => `## ${h}\n\n${byHub[h].map(a => `- [${a.title}](${SITE}/articles/${a.slug}/): ${a.excerpt} (Requires ${a.tier}; verified ${a.verified})`).join('\n')}`).join('\n\n')}
`);

/* ---------- report ---------- */
for (const w of warnings) console.warn('warn:', w);
if (errors.length) {
  for (const e of errors) console.error('error:', e);
  console.error(`\nBuild failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`Built ${pages().length} pages, ${published.length} published article(s), ${ARTICLES.length - published.length} draft(s).`);
