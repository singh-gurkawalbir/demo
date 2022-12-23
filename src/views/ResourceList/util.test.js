/* global describe, test, expect */
import { additionalFilter } from './util';

describe('additionalFilter test cases', () => {
  test('Should pass the additionalFilter with exports resource type', () => {
    const response = additionalFilter('exports');

    expect(response).toEqual({
      _connectorId: { $exists: false },
    });
  });

  test('Should pass the additionalFilter with imports resource type', () => {
    const response = additionalFilter('imports');

    expect(response).toEqual({
      _connectorId: { $exists: false },
    });
  });

  test('Should pass the additionalFilter with connections resource type', () => {
    const response = additionalFilter('connections');

    expect(response).toEqual({
      _connectorId: { $exists: false },
    });
  });

  test('Should pass the additionalFilter with iClients resource type', () => {
    const response = additionalFilter('iClients');

    expect(response).toEqual({ provider: 'custom_oauth2' });
  });
});
