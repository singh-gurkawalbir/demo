export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'X-Auth-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/auth/basic/username'] = undefined;
      retValues['/http/auth/basic/password'] = undefined;
      retValues['/http/headers'] = [
        {
          name: 'X-Auth-Client',
          value: retValues['/http/unencrypted/clientId'],
        },
      ];
    } else {
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/headers'] = [
        {
          name: 'X-Auth-Token',
          value: retValues['/http/auth/basic/password'],
        },
        {
          name: 'X-Auth-Client',
          value: retValues['/http/auth/basic/username'],
        },
      ];
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'bigcommerce',
      '/http/baseURI': `https://api.bigcommerce.com/stores/${
        formValues['/storeHash']
      }`,
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/store',
      '/http/ping/method': 'GET',
      '/http/ping/successPath': 'id',
    };
  },

  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      label: 'Authentication type',
      helpKey: 'bigcommerce.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'bigcommerce.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'bigcommerce.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'Access token',
      required: true,
      helpKey: 'bigcommerce.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client id',
      helpKey: 'bigcommerce.connection.http.unencrypted.clientId',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    storeHash: {
      id: 'storeHash',
      required: true,
      type: 'text',
      label: 'Store hash',
      visibleWhen: [{ field: 'http.auth.type', is: ['token', 'basic'] }],
      defaultValue: r => {
        let value = '';

        if (
          r &&
          r.http &&
          r.http.baseURI &&
          r.http.baseURI.indexOf('https://api.bigcommerce.com/stores/') !== -1
        ) {
          value = r.http.baseURI.replace(
            'https://api.bigcommerce.com/stores/',
            ''
          );
        }

        return value;
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.auth.token.token',
      'http.unencrypted.clientId',
      'storeHash',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
