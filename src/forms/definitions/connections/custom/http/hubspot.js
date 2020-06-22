export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'url';
      retValues['/http/auth/token/paramName'] = 'hapikey';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] =
        'https://app.hubspot.com/oauth/authorize';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] =
        'https://api.hubapi.com/oauth/v1/token';
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'hubspot',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.hubapi.com/',
      '/http/ping/relativeURI': '/contacts/v1/lists/all/contacts/all',
      '/http/ping/method': 'GET',
      '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      helpKey: 'hubspot.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'HAPI key',
      required: true,
      helpKey: 'hubspot.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'contacts',
        'content',
        'reports',
        'social',
        'automation',
        'forms',
        'files',
        'tickets',
        'hubdb',
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.type',
          'http.auth.token.token',
          'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'cancel',
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
