/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, select } from 'redux-saga/effects';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { checkHasIntegrations} from '.';
import { selectors } from '../../../reducers';

const connectionId = 'c1';
const connection = {
  _id: 'c1',
  type: 'netsuite',
  name: 'name',
  debugDate: '2020-06-22T05:53:35.962Z',
  netsuite: {
    account: 'ACCOUNT1',
    roleId: '3',
    accountName: 'test',
    roleName: 'Administrator',
    wsdlVersion: 'current',
    concurrencyLevel: 3,
    suiteAppInstalled: false,
    authType: 'basic',
  },
};
const error = new Error('error');

const hasIntegrationsResponse = {
  success: true,
  version: '2020.2',
  hasIntegrations: true,
  hasMappingAssistantSuitelet: true,
};

describe('checkHasIntegrations saga', () => {
  const requestOptions = {
    path: '/suitescript/connections/c1',
    opts: {
      method: 'GET',
    },
    hidden: true,
  };

  test('should dispatch received hasIntegrations action when hasIntegrationsResponse call is successful', () => expectSaga(checkHasIntegrations, { connectionId })
    .provide([[select(selectors.resource, 'connections', connectionId), connection],
      [call(apiCallWithRetry, requestOptions), hasIntegrationsResponse]])
    .put(
      actions.suiteScript.account.receivedHasIntegrations(
        connection.netsuite.account,
        hasIntegrationsResponse.hasIntegrations
      )
    )
    .run()
  );

  test('should not dispatch received hasIntegrations action when hasIntegrationsResponse call is successful with no response', () => expectSaga(checkHasIntegrations, { connectionId })
    .provide([[select(selectors.resource, 'connections', connectionId), connection],
      [call(apiCallWithRetry, requestOptions), null]])
    .not.put(
      actions.suiteScript.account.receivedHasIntegrations(
        connection.netsuite.account,
        hasIntegrationsResponse.hasIntegrations
      )
    )
    .run()
  );

  test('should not dispatch received hasIntegrations action when hasIntegrationsResponse call fails', () => expectSaga(checkHasIntegrations, { connectionId })
    .provide([[select(selectors.resource, 'connections', connectionId), connection],
      [call(apiCallWithRetry, requestOptions), throwError(error)]])
    .not.put(
      actions.suiteScript.account.receivedHasIntegrations(
        connection.netsuite.account,
        hasIntegrationsResponse.hasIntegrations
      )
    )
    .run()
  );
});
