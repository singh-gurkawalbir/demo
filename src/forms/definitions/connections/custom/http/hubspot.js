export default {
  preSubmit: formValues => {
    const retValues = { ...formValues };

    if (retValues['/authType'] === 'token') {
      retValues['/http/auth/token/location'] = 'url';
      retValues['/http/auth/token/paramName'] = 'hapikey';
      retValues['/http/auth/oauth'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] =
        'https://app.hubspot.com/oauth/authorize';
      retValues['/http/auth/oauth/tokenURI'] =
        'https://api.hubapi.com/oauth/v1/token';
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      retValues['/http/auth/token'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'hubspot',
      '/http/auth/type': `${formValues['/authType']}`,
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.hubapi.com/',
      '/http/ping/relativeURI': '/contacts/v1/lists/all/contacts/all',
      '/http/ping/method': 'GET',
      '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'authType',
      required: true,
      type: 'select',
      label: 'Authentication Type:',
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
    {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'HAPI Key:',
      helpText: 'Please enter API Key of your Hubspot Account.',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
    {
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
      visibleWhen: [
        {
          field: 'authType',
          is: ['oauth'],
        },
      ],
    },
  ],

  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
  actions: [
    {
      id: 'oauth',
      label: 'Save & Authorize',
      visibleWhen: [
        {
          field: 'authType',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'authType',
          is: ['token'],
        },
      ],
    },
  ],
};
