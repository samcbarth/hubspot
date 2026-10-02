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
  },
  {
    slug: 'duplicates-after-import',
    title: 'HubSpot import created duplicate contacts? Why it happens and how to fix it',
    excerpt: 'HubSpot only matches imported rows by a unique identifier. Spot an import that duplicated records, clean it up, and stop it next time.',
    type: 'guide',
    problem: 'Fix it',
    hubs: ['Smart CRM', 'Data Hub', 'Marketing Hub', 'Sales Hub'],
    features: ['Imports', 'Data quality'],
    tier: 'Any tier (merging needs Professional)',
    permissions: 'Import access; Data quality tools to merge',
    verified: '2026-10-02',
    published: '2026-10-02',
    minutes: 15,
    difficulty: 'Intermediate',
    keywords: ['duplicate', 'duplicates', 'dedupe', 'deduplicate', 'merge', 'import', 'record id', 'email', 'company domain'],
    related: ['find-hubspot-portal-id']
  },
  {
    slug: 'coded-template-missing-from-picker',
    title: 'Your coded HubSpot template is missing from the template picker? Look under Other',
    excerpt: 'The page template picker opens on your active theme. Templates that are not part of a theme only appear under Other.',
    type: 'tip',
    problem: 'Gotcha',
    hubs: ['Content Hub'],
    features: ['Pages', 'Design Manager'],
    tier: 'Any tier with pages',
    permissions: 'Website or landing page access',
    verified: '2026-10-02',
    published: '2026-10-02',
    minutes: 3,
    difficulty: 'Beginner',
    keywords: ['template', 'coded template', 'template picker', 'select a template', 'theme', 'design manager', 'hubl', 'landing page', 'extends']
  },
  {
    slug: 'find-hubspot-portal-id',
    title: 'How to find your HubSpot portal ID (Hub ID)',
    excerpt: 'Your portal ID, also called Hub ID or account ID, is in the account menu and in every HubSpot URL.',
    type: 'tip',
    problem: 'How to',
    hubs: ['Smart CRM'],
    features: ['Settings'],
    tier: 'All tiers, including free',
    permissions: 'Any user',
    verified: '2026-10-02',
    published: '2026-10-02',
    minutes: 1,
    difficulty: 'Beginner',
    keywords: ['portal id', 'hub id', 'account id', 'portalid', 'hubid', 'account number', 'url']
  }
];

if (typeof module !== 'undefined') module.exports = ARTICLES;
if (typeof window !== 'undefined') window.ARTICLES = ARTICLES;
