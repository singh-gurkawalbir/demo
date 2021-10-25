/* global describe, test, expect */
import { getReplaceConnectionExpression, getParentResourceContext, getFilterExpressionForAssistant, getConstantContactVersion, getAssistantFromConnection } from './index';

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
          $and: [{
            'http.formType': {
              $ne: 'rest',
            },
          }, {
            type: 'http',
          }, {
            _connectorId: {
              $exists: false,
            },
          }],
        },
      };

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'http'}, true, 'childId', 'int-123')).toEqual(output);
    });
    test('should return correct expression if connectorId is present and resource is assistant type', () => {
      const output = {
        appType: 'shopify',
        filter: {
          $and: [{
            $or: [{
              'http.formType': 'rest',
            }, {
              type: 'rest',
            }],
          }, {
            _connectorId: 'connectorId',
          }, {
            $or: [{
              _integrationId: 'int-123',
            }, {
              _integrationId: 'childId',
            }],
          }, {
            assistant: 'shopify',
          }],
        },
      };

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
      expect(getParentResourceContext()).toEqual({});
      expect(getParentResourceContext(null)).toEqual({});
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
  describe('getFilterExpressionForAssistant test cases', () => {
    test('should return correct filter expression if assistant is not constant contact', () => {
      expect(getFilterExpressionForAssistant('square', [])).toEqual({
        $and: [{assistant: 'square'}],
      });
      expect(getFilterExpressionForAssistant('hubspot', [{rule: 123}])).toEqual({
        $and: [{rule: 123}, {assistant: 'hubspot'}],
      });
      expect(getFilterExpressionForAssistant('zoom', [{type: 'http'}])).toEqual({
        $and: [{type: 'http'}, {assistant: 'zoom'}],
      });
    });
    test('should not throw error but return empty object for invalid arguments', () => {
      expect(getFilterExpressionForAssistant()).toEqual({});
    });
    test('should return correct filter expression if assistant is constantcontact', () => {
      expect(getFilterExpressionForAssistant('constantcontact', [{type: 'http'}])).toEqual({
        $or: [
          {
            $and: [{type: 'http'}, {assistant: 'constantcontactv2'}],
          },
          {
            $and: [{type: 'http'}, {assistant: 'constantcontactv3'}],
          },
        ],
      });
    });
  });
  describe('getConstantContactVersion test cases', () => {
    test('should return constantcontactv2 if base uri is not of constantcontactv3', () => {
      expect(getConstantContactVersion()).toEqual('constantcontactv2');
    });
    test('should return constantcontactv3 if base uri is of constantcontactv3', () => {
      const connection = {
        http: {
          baseURI: 'https://api.cc.email/',
        },
      };

      expect(getConstantContactVersion(connection)).toEqual('constantcontactv3');
    });
  });
  describe('getAssistantFromConnection test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(getAssistantFromConnection()).toBeUndefined();
    });
    test('should return the same assistant if it is not multiple auth type', () => {
      expect(getAssistantFromConnection('square')).toEqual('square');
      expect(getAssistantFromConnection('hubspot', {id: 123})).toEqual('hubspot');
      expect(getAssistantFromConnection('zoom', {id: 234})).toEqual('zoom');
    });
    test('should return correct constant contact version based on connection', () => {
      const connection = {
        http: {
          baseURI: 'https://api.cc.email/',
        },
      };

      expect(getAssistantFromConnection('constantcontact', connection)).toEqual('constantcontactv3');
    });
    test('should return correct constant contact version based on connection', () => {
      const connection = {
        http: {
          baseURI: 'https://api.constantcontact.com/',
        },
      };

      expect(getAssistantFromConnection('constantcontact', connection)).toEqual('constantcontactv2');
    });
    test('should return amazonmws if assistant is amazonmws', () => {
      expect(getAssistantFromConnection('amazonmws')).toEqual('amazonmws');
    });
    test('should return zoom if assistant is zoom', () => {
      expect(getAssistantFromConnection('zoom')).toEqual('zoom');
    });
  });
});
