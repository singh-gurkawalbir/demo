/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {
  requestSuiteScriptMetadata,
  commitStagedChanges,
  featureCheck,
  resourcesReceived,
} from '.';
import { selectors } from '../../../reducers/index';

describe('Suitescript resources testcases', () => {
  describe('commitStagedChanges saga tests', () => {
    const ssLinkedConnectionId = 'connId';
    const resourceType = 'exports';
    const id = '123';
    const scope = 'value';
    const integrationId = 'intId';
    const patch = [{ path: '/name', value: 'updating name' }];

    test('should exit if there is no patch object in state', () => {
      const merged = {
        name: 'updating exporting from NS',
      };

      return expectSaga(commitStagedChanges, { ssLinkedConnectionId, resourceType, id, integrationId, scope })
        .provide([[
          select(selectors.suiteScriptResourceData, {
            resourceType,
            id,
            scope,
            ssLinkedConnectionId,
            integrationId,
          }), {
            master: {
              name: 'exporting from NS',
            },
            merged,
          },
        ]])
        .not.call(apiCallWithRetry, {
          path: `/suitescript/connections/${ssLinkedConnectionId}/flows/${id}`,
          opts: {
            method: 'put',
            body: merged,
          },
        })
        .run();
    });

    test('should commit patches for connections resourceType', () => {
      const master = {
        name: 'NS conn 1',
      };
      const merged = {
        id: '1',
        name: 'updating name',
      };

      const resourceType = 'connections';
      const path = `/suitescript/connections/${ssLinkedConnectionId}/connections/1`;

      return expectSaga(commitStagedChanges, { ssLinkedConnectionId, resourceType, id, integrationId, scope })
        .provide([[
          select(selectors.suiteScriptResourceData, {
            resourceType,
            id,
            scope,
            ssLinkedConnectionId,
            integrationId,
          }), {
            master,
            patch,
            merged,
          },
        ],
        [
          call(apiCallWithRetry, {
            path,
            opts: {
              method: 'put',
              body: merged,
            },
          }), merged,
        ]])
        .call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
          },
        })
        .put(
          actions.suiteScript.resource.received(
            ssLinkedConnectionId,
            integrationId,
            resourceType,
            merged,
          ))
        .put(actions.suiteScript.resource.updated(
          ssLinkedConnectionId,
          integrationId,
          resourceType,
          merged._id,
          master,
          patch,
        ))
        .not.put(actions.flow.isOnOffActionInprogress(false, id))
        .put(
          actions.suiteScript.resource.clearStaged(
            ssLinkedConnectionId,
            resourceType,
            id,
            scope,
          )
        )
        .run();
    });

    test('should commit patches for exports resourceType', () => {
      const master = {
        name: 'NS conn 1',
      };
      const merged = {
        id: '1',
        name: 'updating name',
      };

      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/123`;

      return expectSaga(commitStagedChanges, { ssLinkedConnectionId, resourceType: 'exports', id: 're123', integrationId, scope })
        .provide([[
          select(selectors.suiteScriptResourceData, {
            resourceType,
            id: `re${id}`,
            scope,
            ssLinkedConnectionId,
            integrationId,
          }), {
            master,
            patch,
            merged,
          },
        ],
        [
          call(apiCallWithRetry, {
            path,
            opts: {
              method: 'put',
              body: merged,
            },
          }), merged,
        ]])
        .call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
          },
        })
        .put(
          actions.suiteScript.resource.received(
            ssLinkedConnectionId,
            integrationId,
            resourceType,
            merged,
          ))
        .put(actions.suiteScript.resource.updated(
          ssLinkedConnectionId,
          integrationId,
          resourceType,
          merged._id,
          master,
          patch,
        ))
        .not.put(actions.flow.isOnOffActionInprogress(false, 're123'))
        .put(
          actions.suiteScript.resource.clearStaged(
            ssLinkedConnectionId,
            resourceType,
            `re${id}`,
            scope,
          )
        )
        .run();
    });

    test('should call isOnOffActionInProgress if options contains flowEnableDisable', () => {
      const master = {
        name: 'NS conn 1',
      };
      const merged = {
        id: '1',
        name: 'updating name',
      };

      const options = {
        action: 'flowEnableDisable',
      };

      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows/123`;

      return expectSaga(commitStagedChanges, { ssLinkedConnectionId, resourceType: 'exports', id: 're123', integrationId, scope, options })
        .provide([[
          select(selectors.suiteScriptResourceData, {
            resourceType,
            id: `re${id}`,
            scope,
            ssLinkedConnectionId,
            integrationId,
          }), {
            master,
            patch,
            merged,
          },
        ],
        [
          call(apiCallWithRetry, {
            path,
            opts: {
              method: 'put',
              body: merged,
            },
          }), merged,
        ]])
        .call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
          },
        })
        .put(
          actions.suiteScript.resource.received(
            ssLinkedConnectionId,
            integrationId,
            resourceType,
            merged,
          ))
        .put(actions.suiteScript.resource.updated(
          ssLinkedConnectionId,
          integrationId,
          resourceType,
          merged._id,
          master,
          patch,
        ))
        .put(actions.flow.isOnOffActionInprogress(false, `re${id}`))
        .put(
          actions.suiteScript.resource.clearStaged(
            ssLinkedConnectionId,
            resourceType,
            `re${id}`,
            scope,
          )
        )
        .run();
    });

    test('should return error in case api call returned error', () => {
      const master = {
        name: 'NS conn 1',
      };
      const merged = {
        id: '1',
        name: 'updating name',
      };

      const path = `/suitescript/connections/${ssLinkedConnectionId}/connections/1`;
      const error = { code: 422, message: 'error occured' };

      return expectSaga(commitStagedChanges, { ssLinkedConnectionId, resourceType: 'connections', id, integrationId, scope })
        .provide([[
          select(selectors.suiteScriptResourceData, {
            resourceType: 'connections',
            id,
            scope,
            ssLinkedConnectionId,
            integrationId,
          }), {
            master,
            patch,
            merged,
          },
        ],
        [
          call(apiCallWithRetry, {
            path,
            opts: {
              method: 'put',
              body: merged,
            },
          }), throwError(error),
        ]])
        .call(apiCallWithRetry, {
          path,
          opts: {
            method: 'put',
            body: merged,
          },
        })
        .returns({
          error,
        })
        .run();
    });
  });
  describe('requestSuiteScriptMetadata saga tests', () => {
    const ssLinkedConnectionId = 'connId';
    const integrationId = 'intId';
    const resourceType = 'exports';
    const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/${resourceType}`;
    const opts = {method: 'GET'};

    test('should return false if api call returns error', () => {
      const error = { code: 422, message: 'error occured' };

      return expectSaga(requestSuiteScriptMetadata, { ssLinkedConnectionId, resourceType, integrationId})
        .provide([[
          call(apiCallWithRetry,
            {
              path,
              opts,
              hidden: false,
            }),
          throwError(error),
        ]])
        .call(apiCallWithRetry,
          {
            path,
            opts,
            hidden: false,
          })
        .put(actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, resourceType, error.message))
        .returns(false)
        .run();
    });

    test('should return true if api call succeeds', () => {
      const resp = {
        success: true,
        data: {
          name: 'a',
        },
      };

      return expectSaga(requestSuiteScriptMetadata, { ssLinkedConnectionId, resourceType, integrationId})
        .provide([[
          call(apiCallWithRetry,
            {
              path,
              opts,
              hidden: false,
            }),
          resp,
        ]])
        .call(apiCallWithRetry,
          {
            path,
            opts,
            hidden: false,
          })
        .put(actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, resourceType, resp))
        .returns(true)
        .run();
    });
  });

  describe('resourcesReceived saga tests', () => {
    const resourceType = 'suitescript/connections/connId/tiles';
    const integrationId = 'intId';
    const collection = [{
      name: 'Salesforce Connector',
      isConnector: true,
      _integrationId: integrationId,
    }];

    const ssLinkedConnectionId = 'connId';

    test('should request settings on resourcesReceived action if settings are n\'t loaded', () =>
      expectSaga(resourcesReceived, { resourceType, collection})
        .provide([[
          select(selectors.hasSuiteScriptData, {
            ssLinkedConnectionId: 'connId',
            integrationId,
            resourceType: 'settings',
          }), false,
        ]])
        .put(actions.suiteScript.resource.request('settings', 'connId', integrationId))
        .run());

    test('should not request settings on resourcesReceived action if settings are already loaded', () =>
      expectSaga(resourcesReceived, { resourceType, collection})
        .provide([[
          select(selectors.hasSuiteScriptData, {
            ssLinkedConnectionId,
            integrationId,
            resourceType: 'settings',
          }), true,
        ]])
        .not.put(actions.suiteScript.resource.request('settings', ssLinkedConnectionId, integrationId))
        .run());
    test('should not request settings on resourcesReceived action if resourceType is not tiles', () => expectSaga(resourcesReceived, { resourceType: 'suitescript/connections/connId/exports', collection})
      .provide([[
        select(selectors.hasSuiteScriptData, {
          ssLinkedConnectionId,
          integrationId,
          resourceType: 'settings',
        }), true,
      ]])
      .not.put(actions.suiteScript.resource.request('settings', ssLinkedConnectionId, integrationId))
      .run());
  });

  describe('featureCheck saga tests', () => {
    const ssLinkedConnectionId = 'connId';
    const integrationId = 'intId';
    const featureName = 'suitebilling';
    const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings/featureCheck?featureCheckConfig={"featureName":"${featureName}"}`;
    const opts = {method: 'GET'};

    test('should exit if feature check api call throws error', () => {
      const error = { code: 422, message: 'error occured' };

      return expectSaga(featureCheck, { ssLinkedConnectionId, featureName, integrationId})
        .provide([[
          call(apiCallWithRetry,
            {
              path,
              opts,
            }),
          throwError(error),
        ]])
        .call(apiCallWithRetry,
          {
            path,
            opts,
          })
        .not.put(actions.suiteScript.featureCheck.successful(
          ssLinkedConnectionId,
          integrationId,
          featureName
        ))
        .not.put(actions.suiteScript.featureCheck.failed(ssLinkedConnectionId,
          integrationId,
          featureName, error))
        .run();
    });

    test('should call featureCheckSuccessful action if api call returns success true', () => {
      const resp = {
        success: true,
      };

      return expectSaga(featureCheck, { ssLinkedConnectionId, featureName, integrationId})
        .provide([[
          call(apiCallWithRetry,
            {
              path,
              opts,
            }),
          resp,
        ]])
        .call(apiCallWithRetry,
          {
            path,
            opts,
          })
        .put(actions.suiteScript.featureCheck.successful(ssLinkedConnectionId,
          integrationId,
          featureName))
        .run();
    });

    test('should call featureCheckFailed action if api call returns success false', () => {
      const resp = {
        success: false,
        errors: [
          {
            message: 'feature unavailable',
          },
        ],
      };

      return expectSaga(featureCheck, { ssLinkedConnectionId, featureName, integrationId})
        .provide([[
          call(apiCallWithRetry,
            {
              path,
              opts,
            }),
          resp,
        ]])
        .call(apiCallWithRetry,
          {
            path,
            opts,
          })
        .put(actions.suiteScript.featureCheck.failed(ssLinkedConnectionId,
          integrationId,
          featureName,
          resp.errors[0].message))
        .run();
    });
  });
});
