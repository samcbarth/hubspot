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
  {
    slug: 'workflow-wont-re-enroll',
    title: "Contact won't re-enroll in a HubSpot workflow? Check these 6 things",
    excerpt: 'HubSpot enrolls a record once by default. Why re-enrollment fails, how to turn it on, and the triggers that can never re-enroll.',
    type: 'guide',
    problem: 'Fix it',
    hubs: ['Marketing Hub', 'Sales Hub', 'Service Hub', 'Data Hub'],
    features: ['Workflows'],
    tier: 'Professional or Enterprise',
    permissions: 'Super Admin or Workflows',
    verified: '2026-10-02',
    published: '2026-10-02',
    minutes: 10,
    difficulty: 'Intermediate',
    keywords: ['re-enroll', 'reenroll', 're-enrollment', 'enrollment trigger', 'workflow not triggering', 'automation']
  }
];

if (typeof module !== 'undefined') module.exports = ARTICLES;
if (typeof window !== 'undefined') window.ARTICLES = ARTICLES;
