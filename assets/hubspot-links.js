/*
 * HubSpot destinations for the link builder. `path` is the in-app URL with
 * {portalId} where the account number goes. The generic version (no ID) is
 * https://app.hubspot.com/l + path without "/{portalId}", which HubSpot routes
 * to the reader's default portal (or a portal picker if they have several).
 * Every path was opened in a live portal on 2026-10-02.
 */
window.HS_LINKS = [
  { group: 'CRM records', items: [
    { label: 'Contacts', path: '/contacts/{portalId}/objects/0-1/views/all/list' },
    { label: 'Companies', path: '/contacts/{portalId}/objects/0-2/views/all/list' },
    { label: 'Deals', path: '/contacts/{portalId}/objects/0-3/views/all/list' },
    { label: 'Tickets', path: '/contacts/{portalId}/objects/0-5/views/all/list' },
    { label: 'Segments (lists)', path: '/contacts/{portalId}/objectLists/views/all' },
    { label: 'Imports (Data integration)', path: '/import/{portalId}' },
    { label: 'Data quality', path: '/data-quality/{portalId}' }
  ]},
  { group: 'Automation', items: [
    { label: 'Workflows', path: '/workflows/{portalId}' },
    { label: 'Sequences', path: '/sequences/{portalId}' },
    { label: 'Chatflows', path: '/chatflows/{portalId}' }
  ]},
  { group: 'Marketing', items: [
    { label: 'Marketing email', path: '/email/{portalId}/manage/state/all' },
    { label: 'Forms', path: '/forms/{portalId}' },
    { label: 'Campaigns', path: '/campaigns/{portalId}' },
    { label: 'Social', path: '/social/{portalId}' },
    { label: 'Ads', path: '/ads/{portalId}' }
  ]},
  { group: 'Content', items: [
    { label: 'Landing pages', path: '/website/{portalId}/pages/landing' },
    { label: 'Website pages', path: '/website/{portalId}/pages/site' },
    { label: 'Design Manager', path: '/design-manager/{portalId}' },
    { label: 'Files', path: '/files/{portalId}' }
  ]},
  { group: 'Sales and service', items: [
    { label: 'Meetings scheduler', path: '/meetings/{portalId}' },
    { label: 'Message templates', path: '/templates/{portalId}' },
    { label: 'Snippets', path: '/snippets/{portalId}' },
    { label: 'Inbox', path: '/live-messages/{portalId}' },
    { label: 'Knowledge base', path: '/knowledge/{portalId}' }
  ]},
  { group: 'Reporting', items: [
    { label: 'Reports', path: '/reports-list/{portalId}' },
    { label: 'Dashboards', path: '/reports-dashboard/{portalId}' }
  ]},
  { group: 'Settings', items: [
    { label: 'Contact properties', path: '/property-settings/{portalId}/properties?type=0-1' },
    { label: 'Company properties', path: '/property-settings/{portalId}/properties?type=0-2' },
    { label: 'Deal properties', path: '/property-settings/{portalId}/properties?type=0-3' },
    { label: 'Users and teams', path: '/settings/{portalId}/users' },
    { label: 'Tracking code', path: '/settings/{portalId}/analytics-and-tracking' },
    { label: 'Domains and URLs', path: '/settings/{portalId}/domains' },
    { label: 'Private apps', path: '/private-apps/{portalId}' }
  ]}
];
