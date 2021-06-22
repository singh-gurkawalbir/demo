/* global describe, test, expect */
import { makeExportResource } from './index';

describe('exportData utils test cases', () => {
  describe('makeExportResource util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(makeExportResource()).toEqual({});
      expect(makeExportResource(null)).toEqual({});
      expect(makeExportResource({})).toEqual({});
    });
    test('should return empty object if resource kind is not virtual', () => {
      expect(makeExportResource({kind: 'user defined'})).toEqual({});
    });
    test('should return virtual export resource with a key and kind prop', () => {
      const resource = {
        _id: '123',
        kind: 'virtual',
        virtual: {
          type: 'search',
          config: 'something',
          _connectionId: 'conn123',
        },
      };
      const output = {
        kind: 'virtual',
        key: expect.any(String),
        exportResource: {
          type: 'search',
          config: 'something',
          _connectionId: 'conn123',
          _connectorId: 'connector-abc',
        },
      };

      expect(makeExportResource(resource, 'conn-456', 'connector-abc')).toEqual(output);
    });
  });
});

