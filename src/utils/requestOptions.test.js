import getRequestOptions, { pingConnectionParentContext } from './requestOptions';
import actionTypes from '../actions/types';

describe('Testsuite for RequestOptions', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2023-02-02T12:00:00Z').getTime());
  });
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //     jest.clearAllTimers();
  //     jest.useRealTimers();
  //   });
  test('should test the request option when the action is user create', () => {
    const result = getRequestOptions(
      actionTypes.USER.CREATE,
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/invite'});
  });
  test('should test the request option when the action is user update', () => {
    const result = getRequestOptions(
      actionTypes.USER.UPDATE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/ashares/12345'});
  });
  test('should test the request option when the action is user delete', () => {
    const result = getRequestOptions(
      actionTypes.USER.DELETE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'DELETE'}, path: '/ashares/12345'});
  });
  test('should test the request option when the action is agent token display', () => {
    const result = getRequestOptions(
      actionTypes.AGENT.TOKEN_DISPLAY,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/agents/12345/display-token'});
  });
  test('should test the request option when the action is agent token change', () => {
    const result = getRequestOptions(
      actionTypes.AGENT.TOKEN_CHANGE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/agents/12345/change-token'});
  });
  test('should test the request option when the action is agent download installer', () => {
    const result = getRequestOptions(
      actionTypes.AGENT.DOWNLOAD_INSTALLER,
      {
        resourceId: '12345',
        osType: 'testOsType',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/agents/12345/installer/signedURL?os=testOsType'});
  });
  test('should test the request option when the action is user disable', () => {
    const result = getRequestOptions(
      actionTypes.USER.DISABLE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/ashares/12345/disable'});
  });
  test('should test the request option when the action is user reinvite', () => {
    const result = getRequestOptions(
      actionTypes.USER.REINVITE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/ashares/12345/reinvite'});
  });
  test('should test the request option when the action is user make owner', () => {
    const result = getRequestOptions(
      actionTypes.USER.MAKE_OWNER,
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/transfers/invite'});
  });
  test('should test the request option when the action is license trial request', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.TRIAL_REQUEST,
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/licenses/startTrial'});
  });
  test('should test the request option when the action is license upgrade request', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPGRADE_REQUEST,
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/licenses/upgradeRequest'});
  });
  test('should test the request option when the action is license update request when action type is trial', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'trial',
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'POST'}, path: '/licenses/startTrial'});
  });
  test('should test the request option when the action is license update request when action type is reTrial', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'reTrial',
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'POST'}, path: '/licenses/retrialRequest'});
  });
  test('should test the request option when the action is license update request when action type is connectorRenewal', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'connectorRenewal',
        connectorId: 'connectorId',
        licenseId: 'licenseId',
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'POST'}, path: '/connectors/connectorId/licenses/licenseId/renewRequest'});
  });
  test('should test the request option when the action is license update request when action type is ioRenewal', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'ioRenewal',
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'POST'}, path: '/licenses/renewRequest'});
  });
  test('should test the request option when the action is license update request when action type is ioResume', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'ioResume',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/resume'});
  });
  test('should test the request option when the action is access token display', () => {
    const result = getRequestOptions(
      actionTypes.ACCESSTOKEN.DISPLAY,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/accesstokens/12345/display'});
  });
  test('should test the request option when the action is access token generator', () => {
    const result = getRequestOptions(
      actionTypes.ACCESSTOKEN.GENERATE,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/accesstokens/12345/generate'});
  });
  test('should test the request option when the action is job request family', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_FAMILY,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs/12345/family'});
  });
  test('should test the request option when the action is job request', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs/12345'});
  });
  test('should test the request option when the action is job request diagnostics file url', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs/12345/diagnostics'});
  });
  test('should test the request option when the action is job request download file url', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/jobs/12345/files/signedURL'});
  });
  test('should test the request option when the action is job cancel', () => {
    const result = getRequestOptions(
      actionTypes.JOB.CANCEL,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/jobs/12345/cancel'});
  });
  test('should test the request option when the action is job resolve commit when there is resource id', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RESOLVE_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/jobs/12345/resolve'});
  });
  test('should test the request option when the action is job resolve commit when there is no resource id', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RESOLVE_COMMIT,
      {
        resourceId: undefined,
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/jobs/resolve'});
  });
  test('should test the request option when the action is job resolve all in flow commit', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {body: '12345', method: 'PUT'}, path: '/flows/jobs/resolve'});
  });
  test('should test the request option when the action is job resolve all in integration commit', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/integrations/12345/jobs/resolve'});
  });
  test('should test the request option when the action is job retry commit when there is resource id', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RETRY_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/jobs/12345/retry'});
  });
  test('should test the request option when the action is job retry commit when there is no resource id', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RETRY_COMMIT,
      {
        resourceId: undefined,
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/jobs/retry'});
  });
  test('should test the request option when the action is job retry all in flow commit', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {body: '12345', method: 'PUT'}, path: '/flows/jobs/retry'});
  });
  test('should test the request option when the action is job retry all in integration commit', () => {
    const result = getRequestOptions(
      actionTypes.JOB.RETRY_ALL_IN_INTEGRATION_COMMIT,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/integrations/12345/jobs/retry'});
  });
  test('should test the request option when the action is job request retry object collection', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/retries?_jobId=12345'});
  });
  test('should test the request option when the action is job request error file url', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_ERROR_FILE_URL,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs/12345/errorFile/signedURL'});
  });
  test('should test the request option when the action is job error request collection', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.REQUEST_COLLECTION,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs/12345/joberrors'});
  });
  test('should test the request option when the action is job error resolve selected', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.RESOLVE_SELECTED,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/jobs/12345/joberrors/resolve'});
  });
  test('should test the request option when the action is job error retry selected', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.RETRY_SELECTED,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/jobs/12345/retries/retry'});
  });
  test('should test the request option when the action is job error request retry data', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.REQUEST_RETRY_DATA,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/retries/12345/data'});
  });
  test('should test the request option when the action is job error update retry data', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.UPDATE_RETRY_DATA,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'PUT'}, path: '/retries/12345/data'});
  });
  test('should test the request option when the action is job error download retry data', () => {
    const result = getRequestOptions(
      actionTypes.JOB.ERROR.DOWNLOAD_RETRY_DATA,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/retries/12345/signedURL'});
  });
  test('should test the request option when the action is job purge request', () => {
    const result = getRequestOptions(
      actionTypes.JOB.PURGE.REQUEST,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'DELETE'}, path: '/jobs/12345/files'});
  });
  test('should test the request option when the action is flow run', () => {
    const result = getRequestOptions(
      actionTypes.FLOW.RUN,
      {
        resourceId: '12345',
      }
    );

    expect(result).toEqual({opts: {method: 'POST'}, path: '/flows/12345/run'});
  });
  test('should test the request option when the action is resource download file when resourceType is flows', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_FILE,
      {
        resourceId: '12345',
        resourceType: 'flows',
      }
    );

    expect(result).toEqual({path: '/flows/12345/template'});
  });
  test('should test the request option when the action is resource download file when resourceType is templates', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_FILE,
      {
        resourceId: '12345',
        resourceType: 'templates',
      }
    );

    expect(result).toEqual({path: '/templates/12345/download/signedURL'});
  });
  test('should test the request option when the action is metadata assistant request', () => {
    const result = getRequestOptions(
      actionTypes.METADATA.ASSISTANT_REQUEST,
      {
        resourceId: '12345',
        adaptorType: 'http',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/ui/assistants/http/12345'});
  });
  test('should test the request option when the action is metadata assistant request and adaptor is not equal to http', () => {
    const result = getRequestOptions(
      actionTypes.METADATA.ASSISTANT_REQUEST,
      {
        resourceId: '12345',
        adaptorType: 'rest',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/ui/assistants/12345'});
  });
  test('should test the request option when the action is license num enabled flows request', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.NUM_ENABLED_FLOWS_REQUEST,
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/licenseEntitlementUsage'});
  });
  test('should test the request option when the action is license entitlement usage request', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.ENTITLEMENT_USAGE_REQUEST,
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/licenseEntitlementUsage'});
  });
  test('should test the request option when the action is job request collection when filters has flowIds', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_COLLECTION,
      {
        filters: {
          flowIds: ['123'],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_flowId_in[0]=123&type_in[0]=flow&type_in[1]=bulk_retry'});
  });
  test('should test the request option when the action is job request collection when filters has dateRange', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_COLLECTION,
      {
        filters: {
          dateRange: [
            {
              startDate: 'startDate',
              endDate: 'endDate',
            },
          ],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?createdAt_gte=startDate&createdAt_lte=endDate&type_in[0]=flow&type_in[1]=bulk_retry'});
  });
  test('should test the request option when the action is job request collection when filters has dateRange andf has empty values', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_COLLECTION,
      {
        filters: {
          dateRange: [
          ],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?type_in[0]=flow&type_in[1]=bulk_retry'});
  });
  test('should test the request option when the action is job request collection when filters has no values', () => {
    const result = getRequestOptions(
      actionTypes.JOB.REQUEST_COLLECTION,
      {
        filters: {
          integrationId: '12345',
          flowId: '67890',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=12345&_flowId=67890&type_in[0]=flow&type_in[1]=bulk_retry'});
  });
  test('should test the request option when the action is suitescript job request collection', () => {
    const result = getRequestOptions(
      actionTypes.SUITESCRIPT.JOB.REQUEST_COLLECTION,
      {
        filters: {
          ssLinkedConnectionId: 'ssLinkedConnectionId',
          integrationId: '12345',
          flowId: '67890',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/suitescript/connections/ssLinkedConnectionId/integrations/12345/jobs?flowId=67890'});
  });
  test('should test the request option when the action is error manager flow error detail download when isResolved is set to true', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
      {
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: true,
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          flowJobId: 'flow_job_id',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/resolved/signedURL?resolvedAt_gte=from_date&resolvedAt_lte=to_date&_flowJobId=flow_job_id'});
  });
  test('should test the request option when the action is error manager flow error detail download when isResolved is set to false', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.DOWNLOAD.REQUEST,
      {
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: false,
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          flowJobId: 'flow_job_id',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/errors/signedURL?occurredAt_gte=from_date&occurredAt_lte=to_date&_flowJobId=flow_job_id'});
  });
  test('should test the request option when the action is license update request when action type is upgrade and has feature', () => {
    const result = getRequestOptions(
      actionTypes.LICENSE.UPDATE_REQUEST,
      {
        actionType: 'upgrade',
        feature: {a: '123'},
      }
    );

    expect(result).toEqual({opts: {body: {feature: {a: '123'}}, method: 'POST'}, path: '/licenses/upgradeRequest'});
  });
  test('should test the request option when the action is resource download audit logs when there is resource type and child id', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        resourceType: 'connections',
        childId: 'child_id',
        flowIds: ['12345'],
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({opts: {body: {_byUserId: 'user-1', _resourceId: '12345', _resourceIds: ['12345'], action: 'event', from: 'from_date', resourceType: 'connections', source: '12345', to: 'to_date'}, method: 'POST'}, path: '/flows/audit/signedURL?'});
  });
  test('should test the request option when the action is resource download audit logs when there is no filter', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        resourceType: 'connections',
        childId: 'child_id',
        flowIds: ['12345'],
      }
    );

    expect(result).toEqual({opts: {body: {_byUserId: undefined, _resourceId: undefined, _resourceIds: ['12345'], action: undefined, resourceType: undefined, source: undefined}, method: 'POST'}, path: '/flows/audit/signedURL?'});
  });
  test('should test the request option when the action is resource download audit logs when there is resource type and no child id', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        resourceType: 'connections',
        flowIds: ['12345'],
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({opts: {body: {_byUserId: 'user-1', _resourceId: '12345', _resourceIds: ['12345'], action: 'event', from: 'from_date', resourceType: 'connections', source: '12345', to: 'to_date'}, method: 'POST'}, path: '/connections/audit/signedURL?'});
  });
  test('should test the request option when the action is resource download audit logs when there is no resource type and has fromData and toDate in filters', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        flowIds: ['12345'],
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'GET'}, path: '/audit/signedURL?from=from_date&to=to_date&_byUserId=user-1&resourceType=connections&_resourceId=12345&source=12345&action=event'});
  });
  test('should test the request option when the action is resource download audit logs when there is no resource type and has fromData and no toDate in filters', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        flowIds: ['12345'],
        filters: {
          fromDate: 'from_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'GET'}, path: '/audit/signedURL?from=from_date&_byUserId=user-1&resourceType=connections&_resourceId=12345&source=12345&action=event'});
  });
  test('should test the request option when the action is resource download audit logs when there is no resource type and has no fromData and has toDate in filters and filters are not set to all', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        flowIds: ['12345'],
        filters: {
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({opts: {body: undefined, method: 'GET'}, path: '/audit/signedURL?to=to_date&_byUserId=user-1&resourceType=connections&_resourceId=12345&source=12345&action=event'});
  });
  test('should test the request option when the action is resource download audit logs when there is no resource type and has no fromData and has toDate in filters and filters are set to all', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.DOWNLOAD_AUDIT_LOGS,
      {
        flowIds: ['12345'],
        resourceType: 'connections',
        filters: {
          toDate: 'to_date',
          byUser: 'all',
          source: 'all',
          event: 'all',
          _resourceId: 'all',
          resourceType: 'all',
        },
      }
    );

    expect(result).toEqual({opts: {body: {_resourceIds: ['12345'], to: 'to_date'}, method: 'POST'}, path: '/connections/audit/signedURL?'});
  });
  test('should test the request option when the action is request audit logs', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.REQUEST_AUDIT_LOGS,
      {
        resourceType: 'connections',
        nextPagePath: '/nextPagePath',
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({path: '/nextPagePath'});
  });
  test('should test the request option when the action is request audit logs when the filters set to all and no nextPagePath', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.REQUEST_AUDIT_LOGS,
      {
        resourceType: 'connections',
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'all',
          source: 'all',
          event: 'all',
          _resourceId: 'all',
          resourceType: 'all',
        },
      }
    );

    expect(result).toEqual({path: '/connections?'});
  });
  test('should test the request option when the action is request audit logs when the filters is not set to all and no nextPagePath', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.REQUEST_AUDIT_LOGS,
      {
        resourceType: 'connections',
        filters: {
          fromDate: 'from_date',
          toDate: 'to_date',
          byUser: 'user-1',
          source: '12345',
          event: 'event',
          _resourceId: '12345',
          resourceType: 'connections',
        },
      }
    );

    expect(result).toEqual({path: '/connections?&_byUserId=user-1&resourceType=connections&_resourceId=12345&source=12345&action=event'});
  });
  test('should test the request option when the action is request audit logs when there are no filters', () => {
    const result = getRequestOptions(
      actionTypes.RESOURCE.REQUEST_AUDIT_LOGS,
      {
        resourceType: 'connections',
      }
    );

    expect(result).toEqual({path: '/connections?'});
  });
  test('should test the request option when the action is error manager flow error details request', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
      {
        resourceType: 'connections',
        nextPageURL: '/api/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: true,
        filters: {
          occuredAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          resolvedAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          flowJobId: 'flowJobId',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/nextPageURL&occurredAt_gte=2023-02-02T12:00:00.000Z&occurredAt_lte=2023-02-02T12:00:00.000Z&resolvedAt_gte=2023-02-02T12:00:00.000Z&resolvedAt_lte=2023-02-02T12:00:00.000Z&_flowJobId=flowJobId'});
  });
  test('should test the request option when the action is error manager flow error details request when isresolved is set to true', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
      {
        resourceType: 'connections',
        nextPageURL: '/api/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: true,
        filters: {
          occuredAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          resolvedAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          flowJobId: 'flowJobId',
          sources: ['sources'],
          classifications: ['classifications'],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/nextPageURL&source=sources&classification=classifications&occurredAt_gte=2023-02-02T12:00:00.000Z&occurredAt_lte=2023-02-02T12:00:00.000Z&resolvedAt_gte=2023-02-02T12:00:00.000Z&resolvedAt_lte=2023-02-02T12:00:00.000Z&_flowJobId=flowJobId'});
  });
  test('should test the request option when the action is error manager flow error details request when isresolved is set to true and filters set to all', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
      {
        resourceType: 'connections',
        nextPageURL: '/api/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: true,
        filters: {
          sources: ['all'],
          classifications: ['all'],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/nextPageURL&'});
  });
  test('should test the request option when the action is error manager flow error details request when source and classification includes all and no next page url', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
      {
        resourceType: 'connections',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        isResolved: false,
        filters: {
          occuredAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          resolvedAt: {
            startDate: new Date(),
            endDate: new Date(),
          },
          flowJobId: 'flowJobId',
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/errors?occurredAt_gte=2023-02-02T12:00:00.000Z&occurredAt_lte=2023-02-02T12:00:00.000Z&resolvedAt_gte=2023-02-02T12:00:00.000Z&resolvedAt_lte=2023-02-02T12:00:00.000Z&_flowJobId=flowJobId'});
  });
  test('should test the request option when the action is error manager run history request', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&status=completed&status=canceled&status=failed'});
  });
  test('should test the request option when the action is error manager run history request when the filter has status equals to all', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
        filters: {
          status: 'all',
          range: {
            startDate: new Date(),
            endDate: new Date(),
          },
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&status=completed&status=canceled&status=failed&createdAt_gte=2023-02-02T12:00:00.000Z&createdAt_lte=2023-02-02T12:00:00.000Z'});
  });
  test('should test the request option when the action is error manager run history request when the filter has status equals to error', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
        filters: {
          status: 'error',
          range: {
            startDate: new Date(),
            endDate: new Date(),
          },
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&numError_gte=1&createdAt_gte=2023-02-02T12:00:00.000Z&createdAt_lte=2023-02-02T12:00:00.000Z'});
  });
  test('should test the request option when the action is error manager run history request when the filter has status equals to completed', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
        filters: {
          status: 'completed',
          range: {
            startDate: new Date(),
            endDate: new Date(),
          },
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&status=completed&createdAt_gte=2023-02-02T12:00:00.000Z&createdAt_lte=2023-02-02T12:00:00.000Z'});
  });
  test('should test the request option when the action is error manager run history request when the filter has status equals to completed and when hide empty is set to true', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
        filters: {
          status: 'completed',
          range: {
            startDate: new Date(),
            endDate: new Date(),
          },
          hideEmpty: true,
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&status=completed&hideEmpty=true&createdAt_gte=2023-02-02T12:00:00.000Z&createdAt_lte=2023-02-02T12:00:00.000Z'});
  });
  test('should test the request option when the action is error manager run history request when the filter has status equals to completed and when hide empty is set to true and no start and end date in filters', () => {
    const result = getRequestOptions(
      actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST,
      {
        integrationId: 'integration_id',
        flowId: 'flow_id',
        filters: {
          status: 'completed',
          hideEmpty: true,
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/jobs?_integrationId=integration_id&_flowId=flow_id&type_in[0]=flow&status=completed&hideEmpty=true'});
  });
  test('should test the request option when the action is logs flowstep request', () => {
    const result = getRequestOptions(
      actionTypes.LOGS.FLOWSTEP.REQUEST,
      {
        loadMore: true,
        nextPageURL: '/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        filters: {
          codes: [],
          time: {
            startDate: new Date(),
            endDate: new Date(),
          },
          stage: [],
          method: [],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/nextPageURL'});
  });
  test('should test the request option when the action is logs flowstep request and loadMore is set to false', () => {
    const result = getRequestOptions(
      actionTypes.LOGS.FLOWSTEP.REQUEST,
      {
        loadMore: false,
        nextPageURL: '/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        filters: {
          codes: [],
          time: {
            startDate: new Date(),
            endDate: new Date(),
          },
          stage: [],
          method: [],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/requests?time_gt=1675339200000&time_lte=1675339200000'});
  });
  test('should test the request option when the action is logs flowstep request and loadMore is set to false and code, stage, method has values', () => {
    const result = getRequestOptions(
      actionTypes.LOGS.FLOWSTEP.REQUEST,
      {
        loadMore: false,
        nextPageURL: '/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        filters: {
          codes: ['completed'],
          time: {
            startDate: new Date(),
            endDate: new Date(),
          },
          stage: ['completed'],
          method: ['method'],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/requests?statusCode=completed&stage=completed&method=method&time_gt=1675339200000&time_lte=1675339200000'});
  });
  test('should test the request option when the action is logs flowstep request and loadMore is set to false and code, stage, method has values as all', () => {
    const result = getRequestOptions(
      actionTypes.LOGS.FLOWSTEP.REQUEST,
      {
        loadMore: false,
        nextPageURL: '/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        filters: {
          codes: ['all'],
          stage: ['all'],
          method: ['all'],
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/requests'});
  });
  test('should test the request option when the action is logs flowstep request and loadMore is set to false and has time filter', () => {
    const result = getRequestOptions(
      actionTypes.LOGS.FLOWSTEP.REQUEST,
      {
        loadMore: false,
        nextPageURL: '/nextPageURL',
        flowId: 'flow_id',
        resourceId: 'resource_id',
        filters: {
          time: {
            startDate: new Date(),
            endDate: new Date(),
          },
        },
      }
    );

    expect(result).toEqual({opts: {method: 'GET'}, path: '/flows/flow_id/resource_id/requests?time_gt=1675339200000&time_lte=1675339200000'});
  });
  test('should test the request option when there is no action', () => {
    const result = getRequestOptions('');

    expect(result).toEqual({});
  });
  test('should test the ping connection parent context', () => {
    const result = pingConnectionParentContext();

    expect(result).toEqual({});
  });
  test('should test the ping connection parent context when there are values parentType is exports and have parentId', () => {
    const result = pingConnectionParentContext({
      flowId: 'flow_id',
      integrationId: 'integration_id',
      parentType: 'exports',
      parentId: 'export_id',
    });

    expect(result).toEqual({_exportId: 'export_id', _flowId: 'flow_id', _integrationId: 'integration_id'});
  });
  test('should test the ping connection parent context when there are values parentType is imports and have parentId', () => {
    const result = pingConnectionParentContext({
      flowId: 'flow_id',
      integrationId: 'integration_id',
      parentType: 'imports',
      parentId: 'import_id',
    });

    expect(result).toEqual({_flowId: 'flow_id', _importId: 'import_id', _integrationId: 'integration_id'});
  });
  test('should test the ping connection parent context when there are values parentType is imports and have parentId and have new flowId and integrationId', () => {
    const result = pingConnectionParentContext({
      flowId: 'new-flow_id',
      integrationId: 'new-integration_id',
      parentType: 'imports',
      parentId: 'import_id',
    });

    expect(result).toEqual({_flowId: undefined, _importId: 'import_id', _integrationId: undefined});
  });
  test('should test the ping connection parent context when there are no parentType and parentId', () => {
    const result = pingConnectionParentContext({
      flowId: 'flow_id',
      integrationId: 'integration_id',
    });

    expect(result).toEqual({_flowId: 'flow_id', _integrationId: 'integration_id'});
  });
  test('should test the ping connection parent context when there are parentType of type connections and parentId', () => {
    const result = pingConnectionParentContext({
      flowId: 'flow_id',
      integrationId: 'integration_id',
      parentType: 'connections',
      parentId: 'connection_id',
    });

    expect(result).toEqual({_flowId: 'flow_id', _integrationId: 'integration_id'});
  });
});
