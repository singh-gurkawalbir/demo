/* global describe, test, expect */
import { call, put, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../actions';
import { apiCallWithRetry, apiCallWithPaging } from '../index';
import { selectors } from '../../reducers';
import {
  requestConnectors,
  requestTemplates,
  installConnector,
  contactSales,
} from '.';

describe('requestConnectors saga', () => {
  const testConnectors = [{ _id: '123' }, { _id: '456' }];
  const path = '/published';

  test('should succeed on successful api call', () => {
    const saga = requestConnectors();

    expect(saga.next().value).toEqual(
      call(apiCallWithPaging, {
        path,
        message: 'Requesting integration apps',
      })
    );
    expect(saga.next(testConnectors).value).toEqual(
      put(
        actions.marketplace.receivedConnectors({ connectors: testConnectors })
      )
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = requestConnectors();

    expect(saga.next().value).toEqual(
      call(apiCallWithPaging, {
        path,
        message: 'Requesting integration apps',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});
describe('requestTemplates saga', () => {
  const testTemplates = [{ _id: '123' }, { _id: '456' }];
  const path = '/templates/published';

  test('should succeed on successful api call', () => {
    const saga = requestTemplates();

    expect(saga.next().value).toEqual(
      call(apiCallWithPaging, {
        path,
        message: 'Requesting Templates',
      })
    );
    expect(saga.next(testTemplates).value).toEqual(
      put(actions.marketplace.receivedTemplates({ templates: testTemplates }))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = requestTemplates();

    expect(saga.next().value).toEqual(
      call(apiCallWithPaging, {
        path,
        message: 'Requesting Templates',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

describe('installConnector saga', () => {
  const connectorId = '123';
  const sandbox = true;
  const path = `/integrations/${connectorId}/install`;
  const connectorResource = { _id: connectorId };

  test('should succeed on successful api call', () => {
    const saga = installConnector({ connectorId, sandbox });

    expect(saga.next(connectorResource).value).toEqual(
      select(selectors.integrationAppList)
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { sandbox, newTemplateInstaller: false,
          },
        },
      })
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('integrations'))
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('tiles'))
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('connections'))
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('licenses'))
    );

    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = installConnector({ connectorId, sandbox });

    expect(saga.next(connectorResource).value).toEqual(
      select(selectors.integrationAppList)
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { sandbox, newTemplateInstaller: false,
          },
        },
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
  test('should request collections of integrations, tiles, connections and licenses, if api call is successful and connector is of framework twoDotZero', () => {
    const tag = 'something';
    const integrationAppList = [
      {
        _id: connectorId,
        framework: 'twoDotZero',
      },
      {
        _id: 'c2',
      },
    ];
    const path = `/connectors/${connectorId}/install`;
    const args = {
      path,
      opts: {
        method: 'POST',
        body: { sandbox, tag, newTemplateInstaller: true },
      },
    };

    return expectSaga(installConnector, { connectorId, sandbox, tag })
      .provide([
        [select(selectors.integrationAppList), integrationAppList],
        [call(apiCallWithRetry, args)],
      ])
      .call(apiCallWithRetry, args)
      .put(actions.resource.requestCollection('integrations'))
      .put(actions.resource.requestCollection('tiles'))
      .put(actions.resource.requestCollection('connections'))
      .put(actions.resource.requestCollection('licenses'))
      .run();
  });
});

describe('contactSales saga', () => {
  const _connectorId = '123';
  const connectorName = 'some connector';
  const path = '/licenses/request';

  test('should succeed on successful api call', () => {
    const saga = contactSales({ connectorName, _connectorId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { connectorName, _connectorId },
        },
      })
    );

    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = contactSales({ connectorName, _connectorId });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { connectorName, _connectorId },
        },
      })
    );

    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});
