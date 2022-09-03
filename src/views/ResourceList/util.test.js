/* global describe, test, expect */
import { connectorFilter } from './util';

describe('connectorFilter test cases', () => {
  test('Should pass the connectorFilter with exports resource type', () => {
    const response = connectorFilter('exports');

    expect(response).toEqual({
      _connectorId: { $exists: false },
    });
  });

  test('Should pass the connectorFilter with imports resource type', () => {
    const response = connectorFilter('imports');

    expect(response).toEqual({
      _connectorId: { $exists: false },
    });
  });

  test('Should pass the connectorFilter with connections resource type', () => {
    const response = connectorFilter('connections');

    expect(response).toBeNull();
  });
});
