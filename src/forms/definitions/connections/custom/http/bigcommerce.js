export default {
  preSubmit: formValues => {
    const retValues = { ...formValues };

    if (retValues['/authType'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'X-Auth-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/headers'] = [
        {
          name: 'X-Auth-Client',
          value: retValues['/http/unencrypted/clientId'],
        },
      ];
    } else {
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
      '/http/auth/type': `${formValues['/authType']}`,
      '/http/baseURI': `https://api.bigcommerce.com/stores/${
        formValues['/storeHash']
      }`,
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/store',
      '/http/ping/method': 'GET',
      '/http/ping/successPath': 'id',
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'authType',
      required: true,
      type: 'select',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      label: 'Authentication Type:',
      helpText: 'Please select Authentication Type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'Client ID will be the Username.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'Access Token will be the Password.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'http.auth.token.token',
      required: true,
      defaultValue: '',
      type: 'text',
      label: 'Access Token:',
      helpText: 'This Access Token works in tandem with the Client ID.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID:',
      helpText:
        'This Client ID works together with the Access Token to grant authorization.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'storeHash',
      required: true,
      type: 'text',
      label: 'Store HASH:',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token', 'basic'],
        },
      ],
      defaultValue: r => {
        let value = '';

        if (
          r &&
          r.http &&
          r.http.baseURI &&
          r.http.baseURI.indexOf('https://api.bigcommerce.com/stores/') > -1
        ) {
          value = r.http.baseURI;
          value = value.replace('https://api.bigcommerce.com/stores/', '');
        }

        return value;
      },
      helpText:
        'The base api path will look something like this: https://api.bigcommerce.com/stores/123456/. In the base path, the store hash is the 123456.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
