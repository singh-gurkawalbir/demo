import actionTypes from '../actions/types';
import { JOB_TYPES } from './constants';

export default function getRequestOptions(
  action,
  {
    resourceId,
    resourceType,
    integrationId,
    osType,
    filters = {},
    adaptorType,
  } = {}
) {
  switch (action) {
    case actionTypes.USER_CREATE:
      return { path: '/invite', opts: { method: 'POST' } };
    case actionTypes.USER_UPDATE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'PUT' } };
    case actionTypes.USER_DELETE:
      return { path: `/ashares/${resourceId}`, opts: { method: 'DELETE' } };
    case actionTypes.AGENT.TOKEN_DISPLAY:
      return {
        path: `/agents/${resourceId}/display-token`,
        opts: { method: 'GET' },
      };
    case actionTypes.AGENT.TOKEN_CHANGE:
      return {
        path: `/agents/${resourceId}/change-token`,
        opts: { method: 'PUT' },
      };
    case actionTypes.AGENT.DOWNLOAD_INSTALLER:
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
    case actionTypes.JOB.REQUEST_COLLECTION: {
      const qs = [];

      Object.keys(filters).forEach(k => {
        if (filters[k]) {
          qs.push(
            `${
              ['integrationId', 'flowId'].includes(k) ? '_' : ''
            }${k}=${encodeURIComponent(filters[k])}`
          );
        }
      });

      [JOB_TYPES.FLOW, JOB_TYPES.BULK_RETRY].forEach((val, idx) => {
        qs.push(`type_in[${idx}]=${encodeURIComponent(val)}`);
      });

      return {
        path: `/jobs?${qs.join('&')}`,
        opts: { method: 'GET' },
      };
    }

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
    case actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL:
      return {
        path: `/jobs/${resourceId}/files/signedURL`,
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
    case actionTypes.JOB.ERROR.RETRY_SELECTED:
      return {
        path: `/jobs/${resourceId}/retries/retry`,
        opts: { method: 'POST' },
      };
    case actionTypes.JOB.ERROR.REQUEST_RETRY_DATA:
      return {
        path: `/retries/${resourceId}/data`,
        opts: { method: 'GET' },
      };
    case actionTypes.JOB.ERROR.UPDATE_RETRY_DATA:
      return {
        path: `/retries/${resourceId}/data`,
        opts: { method: 'PUT' },
      };
    case actionTypes.FLOW.RUN:
      return {
        path: `/flows/${resourceId}/run`,
        opts: { method: 'POST' },
      };
    case actionTypes.RESOURCE.DOWNLOAD_FILE:
      if (resourceType === 'flows') {
        return {
          path: `/${resourceType}/${resourceId}/template`,
        };
      }

      if (resourceType === 'templates') {
        return {
          path: `/templates/${resourceId}/download/signedURL`,
        };
      }

      break;
    case actionTypes.METADATA.ASSISTANT_REQUEST:
      return {
        path:
          adaptorType === 'http'
            ? `/ui/assistants/http/${resourceId}`
            : `/ui/assistants/${resourceId}`,
        opts: { method: 'GET' },
      };
    default:
      return {};
  }
}
