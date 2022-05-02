/**
 * Zendesk SSO is enabled for production only and the user must have an integrator.io/eu.integrator.io
 * account to access help center. So redirect user to integrator.io when he try to access help center from
 * the non-production domains.
 */
export const HELP_CENTER_BASE_URL = `${['integrator.io', 'eu.integrator.io'].includes(window.document.location.hostname.replace('www.', '')) ? '' : 'https://integrator.io'}/zendesk/sso?return_to=https://docs.celigo.com`;
export const SUBMIT_TICKET_URL =
   `${HELP_CENTER_BASE_URL}/hc/en-us/requests/new?preview_as_role=end_user`;
export const WHATS_NEW_URL =
   `${HELP_CENTER_BASE_URL}/hc/en-us/categories/360002687611`;
export const COMMUNITY_URL = 'https://docs.celigo.com/hc/en-us/community/topics';
export const FLOW_EVENT_REPORTS_DOC_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/4402565285389`;
export const ERROR_MANAGEMENT_DOC_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/360048814732`;
export const SORT_GROUP_CONTENT_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/4405373029019-Sort-and-group-content-for-all-file-providers`;

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
