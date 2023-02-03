import connectionmetadata from '.';

describe('Testsuite for connection metadata', () => {
  test('should test connection metadata when isIA is set to true and useNew is set to true', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: true,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data).toMatchSnapshot();
  });
  test('should test connection metadata when isIA is set to true and useNew is set to false', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data).toMatchSnapshot();
  });
  test('should test connection metadata when isIA is set to false and useNew is set to false', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: false,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data).toMatchSnapshot();
  });
  test('should test connection metadata when isIA is set to false and useNew is set to true', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: false,
        url: '/test',
        useNew: true,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data).toMatchSnapshot();
  });
  test('should test getItemInfo function within fieldmap resource', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.fieldMap.resourceId.getItemInfo({
      http: {
        baseURI: 'https://mock-store.myshopify.com',
      },
    })).toBe('mock-store');
  });
  test('should test patchSet function within fieldmeta when isIA and useNew set to true', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: true,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.patchSet()).toEqual([{op: 'add', path: '/adaptorType', value: {}}, {op: 'replace', path: '/adaptorType', value: 'RESTConnection'}, {op: 'add', path: '/application', value: {}}, {op: 'replace', path: '/application', value: 'Shopify'}, {op: 'add', path: '/assistant', value: {}}, {op: 'replace', path: '/assistant', value: 'shopify'}, {op: 'add', path: '/type', value: {}}, {op: 'replace', path: '/type', value: 'rest'}, {op: 'add', path: '/newIA', value: true}]);
  });
  test('should test patchSet function within fieldmeta when isIA is set to true and useNew set to false', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.patchSet()).toEqual([{op: 'add', path: '/adaptorType', value: {}}, {op: 'replace', path: '/adaptorType', value: 'RESTConnection'}, {op: 'add', path: '/application', value: {}}, {op: 'replace', path: '/application', value: 'Shopify'}, {op: 'add', path: '/assistant', value: {}}, {op: 'replace', path: '/assistant', value: 'shopify'}, {op: 'add', path: '/type', value: {}}, {op: 'replace', path: '/type', value: 'rest'}]);
  });
  test('should test patchSet function within fieldmeta when isIA is set to false and useNew set to false', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: false,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.patchSet()).toEqual([{op: 'add', path: '/adaptorType', value: {}}, {op: 'replace', path: '/adaptorType', value: 'RESTConnection'}, {op: 'add', path: '/application', value: {}}, {op: 'replace', path: '/application', value: 'Shopify'}, {op: 'add', path: '/assistant', value: {}}, {op: 'replace', path: '/assistant', value: 'shopify'}, {op: 'add', path: '/type', value: {}}, {op: 'replace', path: '/type', value: 'rest'}]);
  });
  test('should test optionsHandler function within fieldmeta when fieldId is http.auth.oauth.scope', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('http.auth.oauth.scope', [
      {
        id: 'resourceId',
        value: 'someValue',
      },
    ])).toEqual({resourceId: 'someValue', resourceType: 'connections'});
  });
  test('should test optionsHandler function within fieldmeta when fieldId is resourceId', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('resourceId', [
      {
        id: '_integrationId',
        value: 'someValue',
      },
    ])).toEqual(
      {
        appType: 'shopify',
        filter: {
          $and: [
            {
              _integrationId: 'someValue',
            },
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
              _connectorId: {
                $exists: true,
              },
            },
            {
              assistant: 'shopify',
            },
          ],
        },
      }
    );
  });
  test('should test optionsHandler function within fieldmeta when fieldId is resourceId and when there is no field values', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('resourceId', [
      {
        id: 'resourceId',
      },
    ])).toBeNull();
  });
  test('should test optionsHandler function within fieldmeta when fieldId is _integrationId', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('_integrationId', [
      {
        id: 'resourceId',
        value: 'someValue',
      },
    ])).toEqual({connectionId: 'someValue', useNew: false});
  });
  test('should test optionsHandler function within fieldmeta when fieldId is _integrationId and when there is no field value', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('_integrationId', [
      {
        id: 'resourceId',
      },
    ])).toBeNull();
  });
  test('should test optionsHandler function within fieldmeta when fieldId is something', () => {
    const data =
      connectionmetadata.getMetaData({
        isIA: true,
        url: '/test',
        useNew: false,
        clientId: 'clientid',
        connId: 'connid',
      });

    expect(data.optionsHandler('something', [
      {
        id: 'resourceId',
        value: 'somevalue',
      },
    ])).toBeNull();
  });
});
