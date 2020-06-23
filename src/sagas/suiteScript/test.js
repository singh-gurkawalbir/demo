/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { getPackageURLs, verifySSConnection, verifyConnectorBundle, checkNetSuiteDABundle, verifyPackage, isConnectionOnline } from './installer';

describe('suiteScript sagas', () => {
  describe('installer saga', () => {
    const ssLinkedConnectionId = '123';
    const connectorId = 'sf-ns';
    const error = { code: 422, message: 'unprocessable entity' };

    describe('getPackageURLs generator', () => {
      test('should do nothing if there is an error', () => expectSaga(getPackageURLs, { ssLinkedConnectionId, connectorId })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put.actionType('SUITESCRIPT_INSTALLER_UPDATE_PACKAGE')
        .run());
      test('should dispatch update package action according to package type', () => {
        const expectedOut = {
          success: true,
          data: {
            integratorPackageURL: 'http://someurl'
          },
        };

        return expectSaga(getPackageURLs, { ssLinkedConnectionId, connectorId })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updatePackage(
              connectorId,
              'verifyIntegratorPackage',
              expectedOut.data.integratorPackageURL
            )
          )
          .not.put(
            actions.suiteScript.installer.updatePackage(
              connectorId,
              'verifyConnectorPackage',
              expectedOut.data.connectorPackageURL
            )
          )
          .run();
      });
    });

    describe('verifySSConnection generator', () => {
      test('should dispatch reset step action in case of error', () => expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'reset'
          )
        )
        .run());
      test('should dispatch reset step action when response doesnt contain netsuite or salesforce connection', () => {
        const expectedOut = [{type: 'netsuite', id: 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION'}];

        return expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'reset'
            )
          )
          .run();
      });
      test('should dispatch update SS connection action when response contains the salesforce connection', () => {
        const expectedOut = [{_id: 1, type: 'salesforce', id: 'SALESFORCE_CONNECTION'}];

        return expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateSSConnection(
              connectorId,
              'SALESFORCE_CONNECTION',
              expectedOut[0],
            )
          )
          .run();
      });
      test('should dispatch update SS connection actions when response contains both salesforce and netsuite connections', () => {
        const expectedOut = [{_id: 1, type: 'salesforce', id: 'SALESFORCE_CONNECTION'},
          {_id: 2, type: 'netsuite', id: 'NETSUITE_CONNECTION'}];

        return expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateSSConnection(
              connectorId,
              'SALESFORCE_CONNECTION',
              expectedOut[0],
            )
          )
          .put(
            actions.suiteScript.installer.updateSSConnection(
              connectorId,
              'NETSUITE_CONNECTION',
              expectedOut[1],
            )
          )
          .run();
      });
      test('should dispatch compeleted step action when netsuite connection is online', () => {
        const expectedOut = [{_id: 1, type: 'salesforce', id: 'SALESFORCE_CONNECTION'},
          {_id: 2, type: 'netsuite', id: 'NETSUITE_CONNECTION'}];

        return expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .provide([[call(apiCallWithRetry, {path: '/suitescript/connections/123/connections/NETSUITE_CONNECTION/ping', opts: {method: 'GET'}, message: undefined }), {code: 200}],
            [call(apiCallWithRetry, {path: '/suitescript/connections/123/connections', opts: {method: 'GET'}, message: undefined }), expectedOut],
          ])
          .call.fn(apiCallWithRetry)
          .call.fn(isConnectionOnline)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .run();
      });
      test('should call getPackageURLs and dispatch completed step action when salesforce connection is online', () => {
        const expectedOut = [{_id: 1, type: 'salesforce', id: 'SALESFORCE_CONNECTION'},
          {_id: 2, type: 'netsuite', id: 'NETSUITE_CONNECTION'}];

        return expectSaga(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .provide([[call(apiCallWithRetry, {path: '/suitescript/connections/123/connections/NETSUITE_CONNECTION/ping', opts: {method: 'GET'}, message: undefined }), {code: 200}],
            [call(apiCallWithRetry, {path: '/suitescript/connections/123/connections/SALESFORCE_CONNECTION/ping', opts: {method: 'GET'}, message: undefined }), {code: 200}],
            [call(apiCallWithRetry, {path: '/suitescript/connections/123/connections', opts: {method: 'GET'}, message: undefined }), expectedOut],
          ])
          .call.fn(apiCallWithRetry)
          .call.fn(isConnectionOnline)
          .call.fn(getPackageURLs)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .not.put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'reset'
            )
          )
          .run();
      });
    });

    describe('verifyConnectorBundle generator', () => {
      test('should dispatch reset step action in case of error', () => expectSaga(verifyConnectorBundle, { ssLinkedConnectionId, connectorId })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'reset'
          )
        )
        .run());
      test('should dispatch reset step action when response doesnt contain the required connector', () => {
        const expectedOut = [{isConnector: true, name: 'dummy'}];

        return expectSaga(verifyConnectorBundle, { ssLinkedConnectionId, connectorId, ssName: 'Salesforce' })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'reset'
            )
          )
          .returns(undefined)
          .run();
      });
      test('should dispatch completed step action and call next generator when response contains the connector', () => {
        const expectedOut = [{_integrationId: '111', isConnector: true, name: 'Salesforce'}];

        return expectSaga(verifyConnectorBundle, { ssLinkedConnectionId, connectorId, ssName: 'Salesforce' })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .put(actions.suiteScript.installer.updateSSIntegrationId(connectorId, expectedOut[0]._integrationId))
          .call(verifySSConnection, { ssLinkedConnectionId, connectorId })
          .run();
      });
    });

    describe('checkNetSuiteDABundle generator', () => {
      test('should dispatch reset step action in case of error', () => expectSaga(checkNetSuiteDABundle, { ssLinkedConnectionId, connectorId })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.suiteScript.installer.updateStep(
            connectorId,
            'reset'
          )
        )
        .run());
      test('should dispatch completed step action when response is a success', () => {
        const expectedOut = { success: true};

        return expectSaga(checkNetSuiteDABundle, { ssLinkedConnectionId, connectorId })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .not.put(actions.suiteScript.installer.updateStep(
            connectorId,
            'verify'
          ))
          .run();
      });
      test('should call verify connector bundle when response is a success and continue is true', () => {
        const expectedOut = { success: true};

        return expectSaga(checkNetSuiteDABundle, { ssLinkedConnectionId, connectorId, shouldContinue: true, ssName: 'sfns' })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .put(actions.suiteScript.installer.updateStep(
            connectorId,
            'verify'
          ))
          .call(verifyConnectorBundle, { ssLinkedConnectionId, connectorId, ssName: 'sfns' })
          .run();
      });
    });

    describe('verifyPackage generator', () => {
      test('should dispatch failed action in case of error', () => expectSaga(verifyPackage, { ssLinkedConnectionId, connectorId, installerFunction: 'somefunc' })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.suiteScript.installer.failed(
            connectorId,
            error
          )
        )
        .run());
      test('should dispatch completed step action when response is a success', () => {
        const expectedOut = { success: true};

        return expectSaga(verifyPackage, { ssLinkedConnectionId, connectorId, installerFunction: 'somefunc' })
          .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
          .call.fn(apiCallWithRetry)
          .put(
            actions.suiteScript.installer.updateStep(
              connectorId,
              'completed'
            )
          )
          .run();
      });
    });
  });
});
