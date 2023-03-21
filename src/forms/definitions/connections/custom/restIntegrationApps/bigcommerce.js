export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/rest/authType'] === 'token') {
      retValues['/rest/tokenLocation'] = 'header';
      retValues['/rest/authHeader'] = 'X-Auth-Token';
      retValues['/rest/authScheme'] = ' ';
      retValues['/rest/headers'] = [
        {
          name: 'X-Auth-Client',
          value: retValues['/rest/unencrypted/clientId'],
        },
      ];
    } else {
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
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
      removeWhen: [{field: 'rest.authType', is: ['token']}],
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      visibleWhen: [{ field: 'rest.authType', is: ['basic'] }],
      removeWhen: [{field: 'rest.authType', is: ['token']}],
    },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      defaultValue: '',
      label: 'Access token',
      required: true,
      visibleWhen: [{ field: 'rest.authType', is: ['token'] }],
      removeWhen: [{field: 'rest.authType', isNot: ['token']}],
    },
    'rest.unencrypted.clientId': {
      id: 'rest.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID',
      visibleWhen: [{ field: 'rest.authType', is: ['token'] }],
    },
    storeHash: {
      id: 'storeHash',
      required: true,
      type: 'text',
      label: 'Store hash',
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
      { collapsed: true, label: 'Advanced', fields: ['restAdvanced'] },
    ],
  },
};
