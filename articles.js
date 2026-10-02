/*
 * articles.js - index of every article. Source of truth for the homepage,
 * search, filters, related articles, sitemap, RSS, and llms.txt.
 *
 * Each entry needs a matching hand-written page at articles/<slug>/index.html
 * (copy article-template.html). Run `node tools/build.js` after editing.
 *
 * type:       'tip' (short) or 'guide' (step by step)
 * problem:    'Fix it' | 'How to' | 'Hidden trick' | 'Gotcha'
 * hubs:       'Marketing Hub' | 'Sales Hub' | 'Service Hub' | 'Content Hub' | 'Data Hub' | 'Commerce Hub' | 'Smart CRM'
 * draft:      true keeps it out of every list, sitemap, feed, and llms.txt
 */
var ARTICLES = [
];

if (typeof module !== 'undefined') module.exports = ARTICLES;
if (typeof window !== 'undefined') window.ARTICLES = ARTICLES;
