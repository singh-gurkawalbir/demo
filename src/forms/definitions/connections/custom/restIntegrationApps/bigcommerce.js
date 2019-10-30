export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/rest/authType'] === 'token') {
      retValues['/rest/tokenLocation'] = 'header';
      retValues['/rest/authHeader'] = 'X-Auth-Token';
      retValues['/rest/authScheme'] = ' ';
      retValues['/rest/basicAuth/password'] = undefined;
      retValues['/rest/basicAuth/username'] = undefined;
      retValues['/rest/headers'] = [
        {
          name: 'X-Auth-Client',
          value: retValues['/rest/unencrypted/clientId'],
        },
      ];
    } else {
      retValues['/rest/bearerToken'] = undefined;
      retValues['/rest/headers'] = [
        {
          name: 'X-Auth-Token',
          value: retValues['/rest/basicAuth/password'],
        },
        {
          name: 'X-Auth-Client',
          value: retValues['/rest/basicAuth/username'],
        },
      ];
    }

    return {
      ...retValues,
      '/type': 'rest',
      '/assistant': 'bigcommerce',
      '/rest/baseURI': `https://api.bigcommerce.com/stores/${
        formValues['/storeHash']
      }`,
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/v2/store',
      '/rest/pingMethod': 'GET',
      '/rest/pingSuccessPath': 'id',
    };
  },

  fieldMap: {
    name: { fieldId: 'name' },
    'rest.authType': {
      fieldId: 'rest.authType',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText: 'Client ID will be the Username.',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'Access Token will be the Password.',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      defaultValue: '',
      label: 'Access Token',
      required: true,
      helpText: 'This Access Token works in tandem with the Client ID.',
      visibleWhen: [{ field: 'rest.authType', is: ['token'] }],
    },
    'rest.unencrypted.clientId': {
      id: 'rest.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID',
      helpText:
        'This Client ID works together with the Access Token to grant authorization.',
      visibleWhen: [{ field: 'rest.authType', is: ['token'] }],
    },
    storeHash: {
      id: 'storeHash',
      required: true,
      type: 'text',
      label: 'Store HASH',
      visibleWhen: [{ field: 'rest.authType', is: ['token', 'basic'] }],
      defaultValue: r => {
        let value = '';

        if (
          r &&
          r.rest &&
          r.rest.baseURI &&
          r.rest.baseURI.indexOf('https://api.bigcommerce.com/stores/') > -1
        ) {
          value = r.rest.baseURI.replace(
            'https://api.bigcommerce.com/stores/',
            ''
          );
        }

        return value;
      },
      helpText:
        'The base api path will look something like this: https://api.bigcommerce.com/stores/123456/. In the base path, the store hash is the 123456.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.authType',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
      'rest.bearerToken',
      'rest.unencrypted.clientId',
      'storeHash',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
