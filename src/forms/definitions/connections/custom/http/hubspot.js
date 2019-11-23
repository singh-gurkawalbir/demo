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
      label: 'Authentication Type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      helpText: 'Please select Authentication Type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'HAPI Key',
      required: true,
      helpText: 'Please enter API Key of your Hubspot Account.',
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.token.token',
      'http.auth.oauth.scope',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'oauth',
      label: 'Save & Authorize',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
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
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
