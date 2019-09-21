/* global describe, test, expect */
import { call, put } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import {
  requestConnectors,
  requestTemplates,
  installConnector,
  contactSales,
} from './';

describe('requestConnectors saga', () => {
  const testConnectors = [{ _id: '123' }, { _id: '456' }];
  const path = '/published';

  test('should succeed on successful api call', () => {
    const saga = requestConnectors();

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Requesting Connectors',
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
      call(apiCallWithRetry, {
        path,
        message: 'Requesting Connectors',
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
      call(apiCallWithRetry, {
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
      call(apiCallWithRetry, {
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

  test('should succeed on successful api call', () => {
    const saga = installConnector({ connectorId, sandbox });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { sandbox },
        },
      })
    );
    expect(saga.next().value).toEqual(
      put(actions.resource.requestCollection('integrations'))
    );

    expect(saga.next().done).toEqual(true);
  });
  test('should handle if api call fails', () => {
    const saga = installConnector({ connectorId, sandbox });

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'POST',
          body: { sandbox },
        },
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
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
