import actionTypes from '../actions/types';

export default function getRequestOptions(
  action,
  { resourceId, integrationId } = {}
) {
  switch (action) {
    case actionTypes.USER_CREATE:
      return { path: '/invite', opts: { method: 'POST' } };
    case actionTypes.USER_UPDATE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'PUT' } };
    case actionTypes.USER_DELETE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'DELETE' } };
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
    case actionTypes.JOB.REQUEST_COLLECTION:
      return {
        path: '/jobs',
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.REQUEST_FAMILY:
      return {
        path: `/jobs/${resourceId}/family`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.REQUEST:
      return {
        path: `/jobs/${resourceId}`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL:
      return {
        path: `/jobs/${resourceId}/diagnostics`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.CANCEL:
      return {
        path: `/jobs/${resourceId}/cancel`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RESOLVE_COMMIT:
      return {
        path: resourceId ? `/jobs/${resourceId}/resolve` : `/jobs/resolve`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT:
      return {
        path: `/flows/${resourceId}/jobs/resolve`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT:
      return {
        path: `/integrations/${resourceId}/jobs/resolve`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RETRY_COMMIT:
      return {
        path: resourceId ? `/jobs/${resourceId}/retry` : `/jobs/retry`,
        opts: { method: resourceId ? 'POST' : 'PUT' },
      };
    case actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT:
      return {
        path: `/flows/${resourceId}/jobs/retry`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RETRY_ALL_IN_INTEGRATION_COMMIT:
      return {
        path: `/integrations/${resourceId}/jobs/retry`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION:
      return {
        path: `/retries?_jobId=${resourceId}`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.REQUEST_ERROR_FILE_URL:
      return {
        path: `/jobs/${resourceId}/errorFile/signedURL`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.ERROR.REQUEST_COLLECTION:
      return {
        path: `/jobs/${resourceId}/joberrors`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.ERROR.RESOLVE_SELECTED:
      return {
        path: `/jobs/${resourceId}/joberrors/resolve`,
        opts: { method: 'PUT' },
      };
    case actionTypes.FLOW.RUN:
      return {
        path: `/flows/${resourceId}/run`,
        opts: { method: 'POST' },
      };
    default:
      return {};
  }
}
