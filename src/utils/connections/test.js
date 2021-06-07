/* global describe, test, expect */
import { getReplaceConnectionExpression } from './index';

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
});

