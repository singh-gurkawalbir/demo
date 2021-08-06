/* global describe, test, expect */
import { getReplaceConnectionExpression, getParentResourceContext } from './index';

describe('connections utils test cases', () => {
  describe('getReplaceConnectionExpression util', () => {
    test('should not throw exception for invalid arguments', () => {
      const output = {
        appType: undefined,
        filter: {
          $and: [
            {
              type: undefined,
            },
            {
              _connectorId: {
                $exists: false,
              },
            },
          ],
        },
      };

      expect(getReplaceConnectionExpression()).toEqual(output);
      expect(getReplaceConnectionExpression(null)).toEqual(output);
      expect(getReplaceConnectionExpression({})).toEqual(output);
    });
    test('should return correct expression if connectorId is not present and resource is not of assistant type', () => {
      const output = {
        appType: 'http',
        filter: {
          $and: [
            {
              type: 'http',
            },
            {
              _connectorId: {
                $exists: false,
              },
            },
          ],
        },
      };

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'http'}, true, 'childId', 'int-123')).toEqual(output);
    });
    test('should return correct expression if connectorId is present and resource is assistant type', () => {
      const output = {
        appType: 'shopify',
        filter: {
          $and: [
            {type: 'rest'},
            {_connectorId: 'connectorId'},
            {$or: [{_integrationId: 'int-123'}, {_integrationId: 'childId'}]},
            {assistant: 'shopify'},
          ],
        }};

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'rest', assistant: 'shopify'}, true, 'childId', 'int-123', 'connectorId')).toEqual(output);
    });
    test('should return correct expression if connection type is mysql', () => {
      const output = {
        appType: 'mysql',
        filter: {
          $and: [
            { _id: {$ne: 'conn123'} },
            {
              'rdbms.type': 'mysql',
            },
            {
              _connectorId: {
                $exists: false,
              },
            },
          ],
        },
      };

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'mysql'}, true, 'childId', 'int-123', null, true)).toEqual(output);
    });
  });

  describe('getParentResourceContext util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getParentResourceContext()).toBeUndefined();
      expect(getParentResourceContext(null)).toBeUndefined();
    });
    test('should not return parent params if url does not match the provided path', () => {
      const url1 = '/connections/edit/connections/999';
      const url2 = 'integrations/123/connections/edit/connections/999';
      const url3 = '/integrations/123/connections/sections/1/edit/connections/999';
      const url4 = '/integrations/123/flowBuilder/456/edit/connections/999';

      expect(getParentResourceContext(url1)).toEqual({});
      expect(getParentResourceContext(url2)).toEqual({});
      expect(getParentResourceContext(url3)).toEqual({});
      expect(getParentResourceContext(url4)).toEqual({});
    });
    test('should correctly return the parent params if passed url contains parent context', () => {
      const url = '/integrations/123/flowBuilder/456/edit/imports/789/edit/connections/999';
      const returnValue = {
        0: 'integrations/123/flowBuilder/456',
        1: '',
        connId: '999',
        operation: 'edit',
        parentId: '789',
        parentType: 'imports',
      };

      expect(getParentResourceContext(url)).toEqual(returnValue);
    });
  });
});

