import { getReplaceConnectionExpression, getParentResourceContext, getFilterExpressionForAssistant, getConstantContactVersion, getAssistantFromConnection, getConnectionApi } from './index';

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
              $or: [
                {
                  type: 'rest',
                },
                {
                  type: 'http',
                },
              ],
            },
            {
              isHTTP: {
                $ne: false,
              },
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
    test('should return correct expression if connection type is rdbms and rdbmsSubtype is mysql', () => {
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

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'rdbms', rdbms: { type: 'mysql' }}, true, 'childId', 'int-123', null, true)).toEqual(output);
    });
    test('should return correct expression if connection type is jdbc and jdbcSubtype is mysql', () => {
      const output = {
        appType: 'netsuitejdbc',
        filter: {
          $and: [
            { _id: {$ne: 'conn123'} },
            {
              'jdbc.type': 'netsuitejdbc',
            },
            {
              _connectorId: {
                $exists: false,
              },
            },
          ],
        },
      };

      expect(getReplaceConnectionExpression({_id: 'conn123', type: 'jdbc', jdbc: { type: 'netsuitejdbc' }}, true, 'childId', 'int-123', null, true)).toEqual(output);
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
    test('should correctly return the parent params if passed url contains parent context for iClients', () => {
      const url1 = '/iClients/edit/iClients/i-123';

      expect(getParentResourceContext(url1, 'iClients')).toEqual({});

      const url2 = '/connections/edit/connections/999/edit/iClients/i-123';

      expect(getParentResourceContext(url2, 'iClients')).toEqual({
        0: 'connections',
        1: '',
        connId: '999',
        operation: 'edit',
        iClientId: 'i-123',
      });

      const url3 = '/integrations/123/connections/sections/777/edit/connections/999/edit/iClients/i-123';

      expect(getParentResourceContext(url3, 'iClients')).toEqual({
        0: 'integrations/123/connections/sections/777',
        1: '',
        connId: '999',
        operation: 'edit',
        iClientId: 'i-123',
      });

      const url4 = '/integrations/123/flows/sections/777/flowBuilder/456/edit/connections/999/edit/iClients/i-123';

      expect(getParentResourceContext(url4, 'iClients')).toEqual({
        0: 'integrations/123/flows/sections/777/flowBuilder/456',
        1: '',
        connId: '999',
        operation: 'edit',
        iClientId: 'i-123',
      });

      const url5 = '/integrations/123/flowBuilder/456/edit/imports/789/edit/connections/999/edit/iClients/i-123';

      expect(getParentResourceContext(url5, 'iClients')).toEqual({
        0: 'integrations/123/flowBuilder/456',
        1: '',
        connId: '999',
        operation: 'edit',
        parentId: '789',
        parentType: 'imports',
        iClientId: 'i-123',
      });

      const url6 = '/clone/flows/flowId/setup/configure/connections/connId/edit/iClients/iClientId';

      expect(getParentResourceContext(url6, 'iClients')).toEqual({
        0: 'clone/flows/flowId/setup',
        1: '',
        connId: 'connId',
        operation: 'edit',
        iClientId: 'iClientId',
      });
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
      expect(getConstantContactVersion()).toBe('constantcontactv2');
    });
    test('should return constantcontactv3 if base uri is of constantcontactv3', () => {
      const connection = {
        http: {
          baseURI: 'https://api.cc.email/',
        },
      };

      expect(getConstantContactVersion(connection)).toBe('constantcontactv3');
    });
  });
  describe('getAssistantFromConnection test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(getAssistantFromConnection()).toBeUndefined();
    });
    test('should return the same assistant if it is not multiple auth type', () => {
      expect(getAssistantFromConnection('square')).toBe('square');
      expect(getAssistantFromConnection('hubspot', {id: 123})).toBe('hubspot');
      expect(getAssistantFromConnection('zoom', {id: 234})).toBe('zoom');
    });
    test('should return correct constant contact version based on connection', () => {
      const connection = {
        http: {
          baseURI: 'https://api.cc.email/',
        },
      };

      expect(getAssistantFromConnection('constantcontact', connection)).toBe('constantcontactv3');
    });
    test('should return correct constant contact version based on connection1', () => {
      const connection = {
        http: {
          baseURI: 'https://api.constantcontact.com/',
        },
      };

      expect(getAssistantFromConnection('constantcontact', connection)).toBe('constantcontactv2');
    });
    test('should return amazonmws if assistant is amazonmws', () => {
      expect(getAssistantFromConnection('amazonmws')).toBe('amazonmws');
    });
    test('should return zoom if assistant is zoom', () => {
      expect(getAssistantFromConnection('zoom')).toBe('zoom');
    });
  });

  describe('getConnectionApi test cases', () => {
    const restConn = {type: 'rest', rest: {baseURI: 'https://{{{connection.settings.storeName}}}.com'}, settings: {storeName: 'store'}};
    const httpConn = {type: 'http', http: {baseURI: 'https://{{{connection.settings.storeName}}}.com'}, settings: {storeName: 'store'}};
    const restConnWithoutSettings = {type: 'rest', rest: {baseURI: 'https://{{{connection.settings.storeName}}}.com' }};
    const httpConnWithoutSettings = {type: 'http', http: {baseURI: 'https://{{{connection.settings.storeName}}}.com'}};
    const restConnwithMultipleHandlebars = {type: 'rest', rest: {baseURI: 'https://{{{connection.settings.storeName}}}{{{connection.settings.storeName2}}}.com'}, settings: {storeName: 'store', storeName2: 'store1'}};
    const httpConnwithMultipleHandlebars = {type: 'http', http: {baseURI: 'https://{{{connection.settings.storeName}}}{{{connection.settings.storeName2}}}.com'}, settings: {storeName: 'store', storeName2: 'store1'}};
    const NSConn = {type: 'netsuite', baseURI: 'https://{{{connection.settings.storeName}}}.com', settings: {storeName: 'store'}};

    test('should not throw error for invalid arguments', () => {
      expect(getConnectionApi()).toBeNull();
    });
    test('should return the evaluated uri', () => {
      expect(getConnectionApi(restConn)).toBe('https://store.com');
      expect(getConnectionApi(httpConn)).toBe('https://store.com');
      expect(getConnectionApi(restConnWithoutSettings)).toBe('https://{{{connection.settings.storeName}}}.com');
      expect(getConnectionApi(httpConnWithoutSettings)).toBe('https://{{{connection.settings.storeName}}}.com');

      expect(getConnectionApi(restConnwithMultipleHandlebars)).toBe('https://storestore1.com');

      expect(getConnectionApi(httpConnwithMultipleHandlebars)).toBe('https://storestore1.com');

      expect(getConnectionApi(NSConn, {id: 234})).toBeNull();
    });
  });
});
