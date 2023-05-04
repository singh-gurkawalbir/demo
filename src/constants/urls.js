/**
 * Zendesk SSO is enabled for production only and the user must have an integrator.io/eu.integrator.io
 * account to access help center. So redirect user to integrator.io when he try to access help center from
 * the non-production domains.
 * we need to this Signin otherwise all the account will point to NA by default and EU users can't access the submit tickets
 */
export const HELP_CENTER_BASE_URL = 'https://docs.celigo.com';
export const HELP_CENTER_BASE_URL_WITH_SIGN_IN = `${['integrator.io', 'eu.integrator.io'].includes(window.document.location.hostname.replace('www.', '')) ? '' : 'https://integrator.io'}/zendesk/sso?return_to=https://docs.celigo.com`;
export const SUBMIT_TICKET_URL =
   `${HELP_CENTER_BASE_URL_WITH_SIGN_IN}/hc/en-us/requests/new?preview_as_role=end_user`;
export const WHATS_NEW_URL =
   `${HELP_CENTER_BASE_URL_WITH_SIGN_IN}/hc/en-us/categories/360002687611`;
export const COMMUNITY_URL = 'https://docs.celigo.com/hc/en-us/community/topics';
export const FLOW_EVENT_REPORTS_DOC_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/4402565285389`;
export const ERROR_MANAGEMENT_DOC_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/360048814732`;
export const SORT_GROUP_CONTENT_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers`;
export const MFA_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-your-account`;
export const REVISIONS_GUIDE_URL = 'https://docs.celigo.com/hc/en-us/sections/5918596617883-Manage-integration-revisions';
// Intentaionally skipping _ and - characters as we use them as delmiters in some urls. Do not add those characters
export const URL_SAFE_CHARACTERS = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
export const AMPERSAND_ROUTES = [
  '/flows/create',
  '/orchestrations/create',
  '/flow-builder/v1_5/create',
  '/integrations/create',
  '/:resourceType/create',
  '/:resourceType/:resourceId/edit',
  '/data-loader',
  '/integrations/:integrationId/data-loader',
  '/integrations/:integrationId/data-loader/:flowId/edit',
  '/integrations/:integrationId/flow-builder/v1_5/:flowId/create',
  '/integrations/:integrationId/flows/:flowId/edit',
  '/integrations/:integrationId/flow-builder/v1_5/:flowId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/exports/create',
  '/integrations/:integrationId/orchestrations/:flowId/:resourceType/:resourceId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/:resourceType/create',
  '/integrations/:integrationId/flows/create',
  '/integrations/:_integrationId/orchestrations/create',
  '/integrations/:integrationId/flow-builder/v1_5/create',
  '/connectors/:connectorId/licenses',
  '/connectors/:connectorId/licenses/create',
  '/connectors/:connectorId/licenses/:licenseId/edit',
  '/clone/integrations/:_integrationId/:resourceType/:resourceId/preview',
  '/clone/integrations/:_integrationId/:resourceType/:resourceId/setup',
  '/my-account/audit-log',
  '/my-account',
  '/my-account/:section',
  '/connectors/:integrationId/add-new-store-for-connector',
  '/connectors/:integrationId/settings',
  '/connectors/:integrationId/settings/tokens/:accessTokenId/:accessTokenAction',
  '/connectors/:integrationId/flows/:flowId/mapping',
  '/getting-started',
  '/licensing/flowLimitReached',
  '/licensing/orchestration',
  '/licensing/orchestrationLimitReached',
  '/licensing/needSandboxAddon',
  '/licensing/start',
  '/releasenotes/list',
  '/retry/edit',
];

export const SHOPIFY_STORE_NAME_FOR_BASIC_AUTH_HELP_LINK = 'https://docs.celigo.com/hc/en-us/articles/360038373892-Set-up-a-basic-auth-connection-to-Shopify#storename';
export const SHOPIFY_STORE_NAME_FOR_OAUTH_HELP_LINK = 'https://docs.celigo.com/hc/en-us/articles/360038755451-Set-up-an-OAuth-2-0-connection-to-Shopify#storename';
export const SHOPIFY_STORE_NAME_FOR_TOKEN_HELP_LINK = 'https://docs.celigo.com/hc/en-us/articles/9251883344667-Set-up-a-token-connection-to-Shopify';

export const SHOPIFY_BASIC_AUTH_USERNAME_HELP_LINK = 'https://docs.celigo.com/hc/en-us/articles/360038373892-Set-up-a-basic-auth-connection-to-Shopify#username';
export const SHOPIFY_BASIC_AUTH_PASSWORD_HELP_LINK = 'https://docs.celigo.com/hc/en-us/articles/360038373892-Set-up-a-basic-auth-connection-to-Shopify#password';

export const SHOPIFY_OAUTH_CONNECTION_VIEW_INSTRUCTIONS_LINK = 'https://docs.celigo.com/hc/en-us/articles/360038755451';

// Shopify store listing urls
export const SHOPIFY_APP_STORE_LINKS = {
  NETSUITE_IA_APP: 'https://apps.shopify.com/celigo-netsuite-smartconnector',
  DIY_APP: 'https://apps.shopify.com',

  // in future when these apps are published, change the URLs
  // MICROSOFT_BUSINESS_IA_APP: 'https://apps.shopify.com/IA/Microsoft',
  // SAP_BUSINESS_IA_APP: 'https://apps.shopify.com/IA/SAP',
};

export const MOCK_OUTPUT_CANONICAL_FORMAT_LINK = 'https://docs.celigo.com/hc/en-us/articles/4473437451163-integrator-io-canonical-format-for-mock-data';
export const MOCK_RESPONSE_CANONICAL_FORMAT_LINK = 'https://docs.celigo.com/hc/en-us/articles/4473437451163';

export const BUNDLE_DEPRICATION_URL = 'https://docs.celigo.com/hc/en-us/articles/360050643132';
// This needs to be updated once integrator app is published in shopify marketplace.
export const SHOPIFY_APP_URL = 'https://apps.shopify.com';

export const HTTP_IMPORT_CREATE_FEED_RELATIVE_URI = '/feeds/2021-06-30/documents';
