/*
 * topics.js - topic guides. Each topic has a host article (the URL that becomes the full guide)
 * and member articles that get merged into it. Drives the homepage topic list.
 * Plan: plans/guide-clusters-2026-11-14.md
 */
var TOPICS = [
 {
  "section": "Marketing email",
  "title": "Marketing email deliverability and engagement",
  "host": "resend-email-to-unengaged",
  "members": [
   "email-deliverability-spam-checklist",
   "bot-email-opens-clicks",
   "quarantined-contacts",
   "unengaged-contacts-graymail",
   "resend-email-to-unengaged",
   "resend-bounced-contacts",
   "bounced-contacts-still-marketing",
   "marketing-email-send-stopped",
   "click-rate-vs-click-through-rate"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Build and send marketing emails",
  "host": "transactional-email-add-on",
  "members": [
   "marketing-email-footer-address",
   "cancel-scheduled-email",
   "send-test-email-preview",
   "custom-fonts-in-email",
   "personalized-links-in-emails",
   "marketing-email-approval",
   "exclude-lists-marketing-email",
   "rss-email",
   "ctas-in-emails",
   "programmable-emails",
   "replies-to-marketing-emails",
   "email-ab-test",
   "marketing-email-automation",
   "transactional-email-add-on"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Subscriptions, opt-outs and marketing contacts",
  "host": "remove-email-opt-out",
  "members": [
   "double-opt-in-marketing-email",
   "email-subscription-types",
   "remove-email-opt-out",
   "resubscribe-contacts",
   "opt-out-contact-all-email",
   "unsubscribe-links-one-to-one-emails",
   "import-opted-out-contacts",
   "sync-contacts-as-non-marketing"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Campaigns and attribution",
  "host": "campaign-influenced-contacts",
  "members": [
   "campaign-influenced-contacts",
   "marketing-studio-campaigns",
   "campaign-zero-sessions",
   "revenue-attribution-deal-requirements"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Ads lead syncing and audiences",
  "host": "facebook-lead-ads-sync",
  "members": [
   "facebook-lead-ads-sync",
   "ads-audiences-and-lookalikes",
   "linkedin-ads-audiences",
   "connect-reddit-ads"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Social",
  "host": "instagram-carousel-posts",
  "members": [
   "instagram-carousel-posts",
   "social-link-shortening"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Tracking URL builder",
  "host": "tracking-url-builder",
  "members": [
   "tracking-url-builder"
  ]
 },
 {
  "section": "Marketing email",
  "title": "Surveys",
  "host": "surveymonkey-integration",
  "members": [
   "surveymonkey-integration",
   "nps-surveys"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Connect your inbox and log sales emails",
  "host": "never-log-list",
  "members": [
   "never-log-list",
   "log-replies-only-vs-log-all-emails",
   "connect-inbox-alias-signature",
   "email-tracking-consent-review",
   "limit-logged-email-access",
   "one-to-one-email-drafts",
   "schedule-one-to-one-email",
   "sales-email-send-limits",
   "hubspot-snippets-shortcuts"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Office 365 and Outlook with HubSpot",
  "host": "office-365-add-in-troubleshoot",
  "members": [
   "office-365-admin-consent",
   "office-365-gcc-high",
   "office-365-add-in-troubleshoot",
   "office-365-add-in-sales-tools"
  ]
 },
 {
  "section": "Sales tools",
  "title": "HubSpot Sales Chrome extension",
  "host": "hubspot-sales-extension",
  "members": [
   "hubspot-sales-extension",
   "chrome-extension-troubleshoot"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Sequences",
  "host": "enroll-list-in-sequence",
  "members": [
   "sequence-settings-and-unenrollment",
   "enroll-list-in-sequence",
   "sequences-out-of-office-replies",
   "dynamic-sequences",
   "enroll-in-sequence-workflow"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Meeting scheduling links",
  "host": "video-conferencing-meetings",
  "members": [
   "hubspot-meetings-link",
   "meetings-multiple-calendars",
   "meeting-rotations-round-robin",
   "video-conferencing-meetings",
   "hubspot-calendar-view"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Meeting logging and outcomes",
  "host": "meeting-outcomes-and-call-types",
  "members": [
   "meeting-outcomes-and-call-types",
   "recurring-meetings-not-logging"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Calling setup",
  "host": "receive-inbound-calls",
  "members": [
   "receive-inbound-calls",
   "calling-supported-countries",
   "calling-microphone",
   "teams-click-to-call-logging",
   "teams-phone-recordings-to-hubspot"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Call recording, transcripts and notetaker",
  "host": "call-recording-consent",
  "members": [
   "call-recording-consent",
   "call-transcripts-quality",
   "hubspot-notetaker-settings"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Tasks and the sales workspace",
  "host": "follow-up-task-prompt",
  "members": [
   "follow-up-task-prompt",
   "sales-workspace",
   "task-queues"
  ]
 },
 {
  "section": "Sales tools",
  "title": "Sales forecast",
  "host": "sales-forecast-tool",
  "members": [
   "sales-forecast-tool"
  ]
 },
 {
  "section": "Sales tools",
  "title": "HubSpot mobile app",
  "host": "mobile-app-offline",
  "members": [
   "mobile-app-offline",
   "mobile-business-card-scanner"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Deal pipelines and stages",
  "host": "deal-pipeline-rules",
  "members": [
   "deal-pipeline-rules",
   "deal-progression",
   "deal-stage-probability",
   "delete-pipeline",
   "board-view-redesigned",
   "hubspot-deal-tags",
   "close-stale-deals",
   "move-deal-stage-automatically"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Deal properties, amounts and splits",
  "host": "deal-default-amount-and-close-date",
  "members": [
   "deal-default-amount-and-close-date",
   "deal-revenue-properties",
   "deal-line-items",
   "deal-splits",
   "deal-collaborators",
   "deal-score"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Quotes, products and payments",
  "host": "price-books",
  "members": [
   "hubspot-quotes-basics",
   "price-books",
   "tiered-product-pricing",
   "payment-links",
   "invoice-credit-notes",
   "create-commerce-subscriptions"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Leads and lead scoring",
  "host": "lead-scoring-setup",
  "members": [
   "lead-scoring-setup",
   "hubspot-leads-object"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Buyer intent",
  "host": "intent-signals",
  "members": [
   "intent-signals"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Lifecycle stages",
  "host": "default-lifecycle-and-deal-stages",
  "members": [
   "default-lifecycle-and-deal-stages",
   "customize-lifecycle-stages",
   "lifecycle-stage-automation-deals",
   "audit-company-lifecycle-stages"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Tickets",
  "host": "ticket-pipeline-statuses",
  "members": [
   "ticket-pipeline-statuses",
   "ticket-notifications"
  ]
 },
 {
  "section": "Deals, leads and commerce",
  "title": "Inbox channels and chat",
  "host": "inbox-channels-and-fallback-email",
  "members": [
   "inbox-channels-and-fallback-email",
   "hosted-email-inbox",
   "inbox-allow-and-deny-list",
   "facebook-messenger-inbox",
   "visitor-identification-api"
  ]
 },
 {
  "section": "CRM data",
  "title": "Imports",
  "host": "import-to-static-segment",
  "members": [
   "duplicates-after-import",
   "import-to-static-segment",
   "find-records-from-an-import",
   "bulk-assign-owners-from-sheet",
   "import-contacts-and-companies-together",
   "marketing-event-participants-import"
  ]
 },
 {
  "section": "CRM data",
  "title": "Exports",
  "host": "export-records-from-a-view",
  "members": [
   "export-records-from-a-view",
   "export-activities",
   "export-segments",
   "export-reports"
  ]
 },
 {
  "section": "CRM data",
  "title": "Duplicates and merging",
  "host": "manage-duplicates-tool",
  "members": [
   "manage-duplicates-tool",
   "merge-two-records",
   "unmerge-records",
   "phone-format-duplicates",
   "callrail-duplicate-contacts",
   "multiple-companies-same-domain"
  ]
 },
 {
  "section": "CRM data",
  "title": "Restore deleted data",
  "host": "restore-deleted-activity",
  "members": [
   "restore-deleted-activity",
   "restore-crm-changes"
  ]
 },
 {
  "section": "CRM data",
  "title": "Records, views and filters",
  "host": "hubspot-saved-views-and-filters",
  "members": [
   "clone-records",
   "hubspot-saved-views-and-filters"
  ]
 },
 {
  "section": "CRM data",
  "title": "Segments",
  "host": "active-vs-static-segments",
  "members": [
   "active-vs-static-segments",
   "change-segment-type",
   "list-add-remove-contacts",
   "random-split-segment"
  ]
 },
 {
  "section": "CRM data",
  "title": "Property types and setup",
  "host": "dropdown-vs-multiple-checkboxes",
  "members": [
   "dropdown-vs-multiple-checkboxes",
   "dropdown-option-labels-vs-internal-names",
   "unique-value-properties",
   "url-property-clickable-link",
   "industry-property-options",
   "contact-local-time-zone"
  ]
 },
 {
  "section": "CRM data",
  "title": "Calculated and rollup properties",
  "host": "stage-calculated-properties-off-by-default",
  "members": [
   "rollup-properties",
   "calculation-properties",
   "stage-calculated-properties-off-by-default"
  ]
 },
 {
  "section": "CRM data",
  "title": "Source and conversion properties",
  "host": "offline-sources-explained",
  "members": [
   "offline-sources-explained",
   "first-and-recent-conversion-properties",
   "first-and-last-page-seen",
   "traffic-source-properties",
   "ai-referrals-traffic-source"
  ]
 },
 {
  "section": "CRM data",
  "title": "Property history",
  "host": "property-history-api",
  "members": [
   "property-history-api",
   "export-property-history"
  ]
 },
 {
  "section": "CRM data",
  "title": "Associations and association labels",
  "host": "data-model-builder",
  "members": [
   "associations-v4-api-labels",
   "filter-by-association-labels",
   "association-history",
   "data-model-builder"
  ]
 },
 {
  "section": "CRM data",
  "title": "Data enrichment",
  "host": "hubspot-data-enrichment-settings",
  "members": [
   "hubspot-data-enrichment-settings"
  ]
 },
 {
  "section": "CRM data",
  "title": "HubSpot Markets",
  "host": "hubspot-markets-beta",
  "members": [
   "hubspot-markets-beta"
  ]
 },
 {
  "section": "Automation",
  "title": "Workflow enrollment and re-enrollment",
  "host": "workflow-wont-re-enroll",
  "members": [
   "workflow-wont-re-enroll",
   "workflow-enrollment-triggers-explained"
  ]
 },
 {
  "section": "Automation",
  "title": "Workflow actions",
  "host": "workflow-custom-code-action",
  "members": [
   "workflow-custom-code-action",
   "google-sheets-workflow-action",
   "workflow-internal-email-notification",
   "rotate-record-to-owner",
   "contact-owner-changed-automatically"
  ]
 },
 {
  "section": "Automation",
  "title": "Export and restore workflows",
  "host": "export-and-restore-workflows",
  "members": [
   "export-and-restore-workflows"
  ]
 },
 {
  "section": "Forms and tracking",
  "title": "Forms API and embedding",
  "host": "embed-form-in-react",
  "members": [
   "forms-submission-api",
   "get-form-submissions-api",
   "embed-form-in-react",
   "embed-hubspot-form-external-site",
   "form-guid",
   "non-hubspot-forms-collected"
  ]
 },
 {
  "section": "Forms and tracking",
  "title": "Form settings and spam control",
  "host": "form-file-upload-field",
  "members": [
   "form-submissions-marked-spam",
   "form-captcha-settings",
   "blocked-email-domains-list",
   "form-file-upload-field",
   "form-conditional-logic",
   "form-redirect-with-url-parameters",
   "form-email-response",
   "manage-forms",
   "unpublish-form"
  ]
 },
 {
  "section": "Forms and tracking",
  "title": "Install the tracking code",
  "host": "install-tracking-code-wix",
  "members": [
   "install-tracking-code-wix",
   "detect-hubspot-tracking-code",
   "add-google-tag-manager",
   "install-ad-pixels"
  ]
 },
 {
  "section": "Forms and tracking",
  "title": "Cookies and the consent banner",
  "host": "google-consent-mode",
  "members": [
   "cookie-consent-analytics",
   "hubspot-cookies",
   "hubspot-cookie-consent-banner",
   "google-consent-mode",
   "global-privacy-control"
  ]
 },
 {
  "section": "Forms and tracking",
  "title": "GDPR settings and deleting contacts",
  "host": "gdpr-data-privacy-settings",
  "members": [
   "gdpr-data-privacy-settings",
   "gdpr-delete-contacts-api",
   "delete-inactive-contacts-automatically",
   "bulk-delete-contacts"
  ]
 },
 {
  "section": "Reporting",
  "title": "Custom report builder",
  "host": "customer-journey-analytics",
  "members": [
   "custom-report-builder",
   "which-reports-hubspot-can-build",
   "reports-list-and-analytics-suites",
   "funnel-reports",
   "form-reports-custom-builder",
   "customer-journey-analytics",
   "recurring-report-email"
  ]
 },
 {
  "section": "Reporting",
  "title": "Dashboards",
  "host": "set-default-dashboard",
  "members": [
   "set-default-dashboard",
   "dashboard-filters",
   "dashboard-settings-access-refresh-caching"
  ]
 },
 {
  "section": "Reporting",
  "title": "Custom events",
  "host": "analyze-custom-behavioral-events",
  "members": [
   "custom-events-api",
   "analyze-custom-behavioral-events"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Domains and SSL",
  "host": "replace-brand-domain",
  "members": [
   "replace-brand-domain",
   "reverse-proxy-hubspot-cms",
   "ssl-certificate-provisioning",
   "custom-ssl-certificate"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Site settings (sitemap, favicon, brand kit, schema)",
  "host": "favicon-setup",
  "members": [
   "hubspot-sitemap-settings",
   "favicon-setup",
   "brand-kit-setup",
   "add-schema-markup"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Blog setup",
  "host": "blog-publish-date",
  "members": [
   "blog-authors-and-tags",
   "blog-publish-date",
   "blog-featured-image",
   "related-blog-posts"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Multi-language content",
  "host": "auto-translate-content",
  "members": [
   "multi-language-pages",
   "auto-translate-content",
   "multi-language-blog"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Restrict page access",
  "host": "memberships-access-groups",
  "members": [
   "memberships-access-groups",
   "password-protect-a-page"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "Building pages",
  "host": "embed-code-content",
  "members": [
   "embed-code-content",
   "clone-landing-page-per-location",
   "starter-page-limit",
   "replace-file-keep-url"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "CMS developer notes",
  "host": "claude-code-hubspot-themes-templates",
  "members": [
   "cms-serverless-functions",
   "hubdb-tables",
   "hubl-set-inside-for-loop",
   "module-font-controls-override-theme",
   "claude-code-hubspot-themes-templates",
   "theme-upload-validation-errors",
   "rss-feed-on-page"
  ]
 },
 {
  "section": "Website and CMS",
  "title": "AEO in HubSpot",
  "host": "aeo-prompts-and-outreach-recommendations",
  "members": [
   "aeo-prompts-and-outreach-recommendations"
  ]
 },
 {
  "section": "Developers and API",
  "title": "HubSpot API rate limits",
  "host": "hubspot-api-rate-limits",
  "members": [
   "hubspot-api-rate-limits",
   "crm-search-api-limits"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Service keys and legacy private apps",
  "host": "private-apps-moved-to-legacy-apps",
  "members": [
   "private-apps-moved-to-legacy-apps",
   "hubspot-service-keys",
   "create-a-hubspot-service-key",
   "private-app-api-key"
  ]
 },
 {
  "section": "Developers and API",
  "title": "OAuth for HubSpot apps",
  "host": "oauth-client-id-secret",
  "members": [
   "oauth-client-id-secret",
   "oauth-refresh-token"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Developer projects, CLI and test accounts",
  "host": "developer-test-accounts-and-sandboxes",
  "members": [
   "hs-project-upload-cli",
   "hubspot-agent-cli-setup",
   "ui-extension-card-sync-button",
   "developer-test-accounts-and-sandboxes"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Upsert and dedupe records through the API",
  "host": "api-scripts-create-duplicates",
  "members": [
   "api-scripts-create-duplicates",
   "batch-upsert-api",
   "search-companies-by-name-api"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Owner IDs and the owners API",
  "host": "owners-api-owner-id",
  "members": [
   "owners-api-owner-id"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Attach files and log activities through the API",
  "host": "attach-file-to-record-api",
  "members": [
   "attach-file-to-record-api",
   "log-sms-to-contact-timeline-api"
  ]
 },
 {
  "section": "Developers and API",
  "title": "Webhooks",
  "host": "webhooks-api-subscriptions",
  "members": [
   "webhooks-api-subscriptions"
  ]
 },
 {
  "section": "Developers and API",
  "title": "HubSQL API",
  "host": "hubsql-beta-api",
  "members": [
   "hubsql-beta-api"
  ]
 },
 {
  "section": "Integrations",
  "title": "Salesforce and Dynamics sync",
  "host": "dynamics-365-integration",
  "members": [
   "salesforce-sync-errors-resync",
   "sync-salesforce-leads",
   "salesforce-sandbox-connect",
   "dynamics-365-integration"
  ]
 },
 {
  "section": "Integrations",
  "title": "Google Workspace integrations",
  "host": "google-contacts-sync",
  "members": [
   "google-contacts-sync",
   "google-drive-integration"
  ]
 },
 {
  "section": "Integrations",
  "title": "Microsoft Teams and SharePoint",
  "host": "teams-integration-user-permissions",
  "members": [
   "teams-integration-user-permissions",
   "sharepoint-onedrive-files"
  ]
 },
 {
  "section": "Integrations",
  "title": "Slack integration",
  "host": "slack-integration",
  "members": [
   "slack-integration"
  ]
 },
 {
  "section": "Integrations",
  "title": "Zapier",
  "host": "zapier-hubspot",
  "members": [
   "zapier-hubspot"
  ]
 },
 {
  "section": "Integrations",
  "title": "Shopify integration",
  "host": "shopify-integration",
  "members": [
   "shopify-integration"
  ]
 },
 {
  "section": "Integrations",
  "title": "WordPress plugin",
  "host": "hubspot-wordpress-plugin",
  "members": [
   "hubspot-wordpress-plugin"
  ]
 },
 {
  "section": "Integrations",
  "title": "DocuSign integration",
  "host": "docusign-integration",
  "members": [
   "docusign-integration"
  ]
 },
 {
  "section": "Integrations",
  "title": "GoToWebinar integration",
  "host": "gotowebinar-integration",
  "members": [
   "gotowebinar-integration"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "Users, seats and permissions",
  "host": "user-properties-preferences",
  "members": [
   "permission-sets-and-seats",
   "change-super-admin",
   "login-as-user",
   "delete-your-own-user",
   "user-properties-preferences",
   "scim-user-provisioning"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "Account security and login",
  "host": "locked-out-two-factor-reset",
  "members": [
   "locked-out-two-factor-reset",
   "user-login-sessions",
   "hubspot-user-connection-audit",
   "hubspot-audit-log"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "Account settings",
  "host": "join-hubspot-beta-product-updates",
  "members": [
   "account-defaults-time-zone-fiscal-year",
   "join-hubspot-beta-product-updates",
   "multi-account-management",
   "cancel-or-delete-hubspot-account",
   "hubspot-notification-preferences"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "Find your HubSpot portal ID",
  "host": "find-hubspot-portal-id",
  "members": [
   "find-hubspot-portal-id"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "HubSpot credits",
  "host": "nurture-agent-credits",
  "members": [
   "hubspot-credits-usage-limits",
   "nurture-agent-credits"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "HubSpot AI settings and agents",
  "host": "hubspot-ai-access-settings",
  "members": [
   "hubspot-ai-access-settings",
   "customer-agent-ai",
   "agent-hub-context"
  ]
 },
 {
  "section": "Account, users and AI",
  "title": "HubSpot with AI assistants (MCP and Claude)",
  "host": "hubspot-mcp-connectors",
  "members": [
   "hubspot-mcp-connectors",
   "claude-connector",
   "claude-design-landing-page-to-hubspot"
  ]
 }
];
if (typeof module !== "undefined") module.exports = TOPICS;
