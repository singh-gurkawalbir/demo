import actionTypes from '../actions/types';

export default function getRequestOptions(
  action,
  { resourceId, integrationId, osType } = {}
) {
  switch (action) {
    case actionTypes.USER_CREATE:
      return { path: '/invite', opts: { method: 'POST' } };
    case actionTypes.USER_UPDATE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'PUT' } };
    case actionTypes.USER_DELETE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'DELETE' } };
    case actionTypes.AGENT_TOKEN_DISPLAY:
      return {
        path: `/agents/${resourceId}/display-token`,
        opts: { method: 'GET' },
      };
    case actionTypes.AGENT_TOKEN_CHANGE:
      return {
        path: `/agents/${resourceId}/change-token`,
        opts: { method: 'PUT' },
      };
    case actionTypes.AGENT_DOWNLOAD_INSTALLER:
      return {
        path: `/agents/${resourceId}/installer/signedURL?os=${osType}`,
        opts: { method: 'GET' },
      };
    case actionTypes.USER_DISABLE:
      return {
        path: `/ashares/${resourceId}/disable`,
        opts: { method: 'PUT' },
      };
    case actionTypes.USER_MAKE_OWNER:
      return { path: '/transfers/invite', opts: { method: 'POST' } };
    case actionTypes.LICENSE_TRIAL_REQUEST:
      return {
        path: '/licenses/startTrial',
        opts: { method: 'POST' },
      };
    case actionTypes.LICENSE_UPGRADE_REQUEST:
      return {
        path: '/licenses/upgradeRequest',
        opts: { method: 'POST' },
      };
    case actionTypes.ACCESSTOKEN_CREATE:
      return {
        path: integrationId
          ? `/integrations/${integrationId}/accesstokens`
          : '/accesstokens',
        opts: { method: 'POST' },
      };
    case actionTypes.ACCESSTOKEN_UPDATE:
    case actionTypes.ACCESSTOKEN_REVOKE:
    case actionTypes.ACCESSTOKEN_ACTIVATE:
      return {
        path: `/accesstokens/${resourceId}`,
        opts: { method: 'PUT' },
      };
    case actionTypes.ACCESSTOKEN_DELETE:
      return {
        path: `/accesstokens/${resourceId}`,
        opts: { method: 'DELETE' },
      };
    case actionTypes.ACCESSTOKEN_TOKEN_DISPLAY:
      return {
        path: `/accesstokens/${resourceId}/display`,
        opts: { method: 'GET' },
      };
    case actionTypes.ACCESSTOKEN_TOKEN_GENERATE:
      return {
        path: `/accesstokens/${resourceId}/generate`,
        opts: { method: 'POST' },
      };
    default:
      return {};
  }
}
