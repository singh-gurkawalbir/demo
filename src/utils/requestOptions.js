import moment from 'moment';
import actionTypes from '../actions/types';
import { JOB_TYPES, JOB_STATUS, STANDALONE_INTEGRATION } from './constants';
import { getStaticCodesList } from './listenerLogs';
import { getSelectedRange } from './flowMetrics';

let path;

export default function getRequestOptions(
  action,
  {
    resourceId,
    resourceType,
    integrationId,
    osType,
    filters = {},
    adaptorType,
    actionType,
    connectorId,
    licenseId,
    flowId,
    exportId,
    isResolved,
    nextPageURL,
    loadMore,
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
    case actionTypes.USER_REINVITE:
      return {
        path: `/ashares/${resourceId}/reinvite`,
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
    case actionTypes.LICENSE_UPDATE_REQUEST:
      if (actionType === 'trial') {
        path = '/licenses/startTrial';
      } else if (actionType === 'reTrial') {
        path = '/licenses/retrialRequest';
      } else if (actionType === 'upgrade') {
        path = '/licenses/upgradeRequest';
      } else if (actionType === 'connectorRenewal') {
        path = `/connectors/${connectorId}/licenses/${licenseId}/renewRequest`;
      } else if (actionType === 'ioRenewal') {
        path = '/licenses/renewRequest';
      } else if (actionType === 'ioResume') {
        return {path: '/resume', opts: {method: 'PUT'}};
      }

      return {
        path,
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
          if (k === 'flowIds') {
            if (filters[k].length > 0) {
              filters[k].forEach((flowId, index) => {
                qs.push(`_flowId_in[${index}]=${encodeURIComponent(flowId)}`);
              });
            }
          } else if (k === 'dateRange') {
            const {startDate, endDate} = filters[k]?.[0] || {};

            if (startDate && endDate) {
              qs.push(`createdAt_gte=${startDate.valueOf()}`);
              qs.push(`createdAt_lte=${endDate.valueOf()}`);
            }
          } else {
            qs.push(
              `${
                ['integrationId', 'flowId'].includes(k) ? '_' : ''
              }${k}=${encodeURIComponent(filters[k])}`
            );
          }
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
        // hidden: true,
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
        opts: { method: 'POST' },
      };
    case actionTypes.JOB.CANCEL:
      return {
        path: `/jobs/${resourceId}/cancel`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RESOLVE_COMMIT:
      return {
        path: resourceId ? `/jobs/${resourceId}/resolve` : '/jobs/resolve',
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT:
      return {
        path: '/flows/jobs/resolve',
        opts: { method: 'PUT', body: resourceId },
      };
    case actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT:
      return {
        path: `/integrations/${resourceId}/jobs/resolve`,
        opts: { method: 'PUT' },
      };
    case actionTypes.JOB.RETRY_COMMIT:
      return {
        path: resourceId ? `/jobs/${resourceId}/retry` : '/jobs/retry',
        opts: { method: resourceId ? 'POST' : 'PUT' },
      };
    case actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT:
      return {
        path: '/flows/jobs/retry',
        opts: { method: 'PUT', body: resourceId },
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
    case actionTypes.JOB.ERROR.DOWNLOAD_RETRY_DATA:
      return {
        path: `/retries/${resourceId}/signedURL`,
        opts: { method: 'GET' },
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
    case actionTypes.LICENSE_NUM_ENABLED_FLOWS_REQUEST:
      return {
        path: '/numEnabledFlows',
        opts: { method: 'GET' },
      };
    case actionTypes.LICENSE_ENTITLEMENT_USAGE_REQUEST:
      return {
        path: '/licenseEntitlementUsage',
        opts: { method: 'GET' },
      };

    case actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION: {
      const qs = [];
      const {
        ssLinkedConnectionId,
        integrationId,
        ...restOfTheFilters
      } = filters;

      Object.keys(restOfTheFilters).forEach(k => {
        if (filters[k]) {
          qs.push(`${k}=${encodeURIComponent(filters[k])}`);
        }
      });

      return {
        path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs?${qs.join(
          '&'
        )}`,
        opts: { method: 'GET' },
      };
    }

    case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST: {
      let path = `/flows/${flowId}/${resourceId}/${isResolved ? 'resolved' : 'errors'}/signedURL`;
      const { fromDate, toDate } = filters || {};
      const fromKey = isResolved ? 'resolvedAt_gte' : 'occurredAt_gte';
      const toKey = isResolved ? 'resolvedAt_lte' : 'occurredAt_lte';

      if (fromDate && toDate) {
        path += `?${fromKey}=${fromDate}&${toKey}=${toDate}`;
      } else if (fromDate) {
        path += `?${fromKey}=${fromDate}`;
      } else if (toDate) {
        path += `?${toKey}=${toDate}`;
      }

      return {
        path,
        opts: { method: 'GET'},
      };
    }

    case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST: {
      let path = nextPageURL
        ? nextPageURL.replace('/api', '')
        : `/flows/${flowId}/${resourceId}/${isResolved ? 'resolved' : 'errors'}`;
      const queryParams = [];

      const { sources = [], classifications = [], occuredAt, resolvedAt } = filters;

      if (!sources.includes('all')) {
        sources.forEach(source => queryParams.push(`source=${source}`));
      }
      if (!classifications.includes('all')) {
        classifications.forEach(classification => queryParams.push(`classification=${classification}`));
      }
      if (occuredAt?.startDate && occuredAt?.endDate) {
        queryParams.push(`occurredAt_gte=${moment(occuredAt.startDate).toISOString()}`);
        queryParams.push(`occurredAt_lte=${moment(occuredAt.endDate).toISOString()}`);
      }
      if (resolvedAt?.startDate && resolvedAt?.endDate) {
        queryParams.push(`resolvedAt_gte=${new Date(resolvedAt.startDate).toISOString()}`);
        queryParams.push(`resolvedAt_lte=${new Date(resolvedAt.endDate).toISOString()}`);
      }
      path += (nextPageURL ? `&${queryParams.join('&')}` : `?${queryParams.join('&')}`);

      return {
        path,
        opts: { method: 'GET'},
      };
    }

    case actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST: {
      let path = `/jobs?_integrationId=${integrationId}&_flowId=${flowId}&type_in[0]=flow`;
      const { range, status } = filters || {};
      const queryParams = [];
      const statusFilter = status?.length ? status : [JOB_STATUS.COMPLETED, JOB_STATUS.CANCELED, JOB_STATUS.FAILED];
      const {startDate, endDate} = getSelectedRange(range) || {};

      statusFilter.forEach(status => queryParams.push(`status=${status}`));

      if (startDate && endDate) {
        queryParams.push(`createdAt_gte=${moment(startDate).toISOString()}`);
        queryParams.push(`createdAt_lte=${moment(endDate).toISOString()}`);
      }
      path += `&${queryParams.join('&')}`;

      return {
        path,
        opts: { method: 'GET'},
      };
    }

    case actionTypes.LOGS.LISTENER.REQUEST: {
      let path;

      if (loadMore && nextPageURL) {
        path = nextPageURL.replace('/api', '');
      } else {
        path = `/flows/${flowId}/${exportId}/requests`;
        const queryParams = [];
        const { codes = [], time } = filters;

        const codesList = getStaticCodesList(codes);

        if (!codesList.includes('all')) {
          codesList.forEach(c => queryParams.push(`statusCode=${c}`));
        }
        if (time?.startDate) {
          queryParams.push(`time_gt=${time.startDate.getTime()}`);
        }
        if (time?.endDate) {
          queryParams.push(`time_lte=${time.endDate.getTime()}`);
        }

        if (queryParams.length !== 0) {
          path += `?${queryParams.join('&')}`;
        }
      }

      return {
        path,
        opts: { method: 'GET'},
      };
    }

    default:
      return {};
  }
}

export const pingConnectionParentContext = values => {
  if (!values) return {};

  const { flowId, integrationId, parentType, parentId } = values;
  const context = {
    _flowId: flowId,
    _integrationId: integrationId === STANDALONE_INTEGRATION.id ? undefined : integrationId,
  };

  if (parentType) {
    context[parentType === 'exports' ? '_exportId' : '_importId'] = parentId;
  }

  return context;
};
