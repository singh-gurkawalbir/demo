export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/_iClientId'] = undefined;
      delete retValues['/http/auth/token/paramName'];
      retValues['/http/auth/token/paramName'] = undefined;
    } else {
      const scopes = retValues['/http/auth/oauth/scope'] ? retValues['/http/auth/oauth/scope'].filter(s => s !== 'oauth') : [];

      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] =
        `https://app.hubspot.com/oauth/authorize?optional_scope=${encodeURIComponent(scopes.join(' '))}`;
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/oauth/tokenURI'] =
        'https://api.hubapi.com/oauth/v1/token';
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      retValues['/http/auth/oauth/scope'] = ['oauth'];
      retValues['/http/auth/token/location'] = undefined;
      retValues['/http/auth/token/paramName'] = undefined;
      if (
        resource &&
        !resource._connectorId &&
        resource.http &&
        resource.http._iClientId
      ) {
        retValues['/http/_iClientId'] = undefined;
      }
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
      isLoggable: true,
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
      label: 'Access token',
      required: true,
      helpKey: 'hubspot.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['token'] }],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        {
          subHeader: 'Required',
          scopes: [
            'oauth',
          ],
        },
        {
          subHeader: 'Optional',
          scopes: [
            'automation',
            'business-intelligence',
            'content',
            'crm.import',
            'e-commerce',
            'files',
            'forms',
            'forms-uploaded-files',
            'hubdb',
            'integration-sync',
            'sales-email-read',
            'social',
            'tickets',
            'timeline',
            'transactional-email',
            'crm.lists.read',
            'crm.lists.write',
            'crm.objects.companies.read',
            'crm.objects.companies.write',
            'crm.objects.contacts.read',
            'crm.objects.contacts.write',
            'crm.objects.deals.read',
            'crm.objects.deals.write',
            'crm.objects.owners.read',
            'crm.schemas.companies.read',
            'crm.schemas.companies.write',
            'crm.schemas.contacts.read',
            'crm.schemas.contacts.write',
            'crm.schemas.deals.read',
            'crm.schemas.deals.write',
            'crm.schemas.quotes.read',
            'crm.objects.quotes.read',
            'crm.objects.quotes.write',
          ],
        },
      ],
      defaultValue: r => {
        const authUri = r?.http?.auth?.oauth?.authURI;
        const selectedScopes = r?.http?.auth?.oauth?.scope || [];

        if (authUri && authUri.indexOf('optional_scope')) {
          const encodedScopes = authUri && authUri.split('optional_scope=')[1];
          const scopes = encodedScopes && decodeURIComponent(encodedScopes).split(' ');

          if (!scopes || !scopes.length) {
            return selectedScopes;
          }

          return [...selectedScopes, ...scopes];
        }
      },
      visible: r => !(r?._connectorId),
      visibleWhenAll: r => {
        if (r?._connectorId) {
          return [];
        }
        if (r?.http?._iClientId) {
          return [{ field: 'http.auth.type', isNot: ['oauth'] },
            { field: 'http.auth.type', isNot: ['token'] }];
        }
        if (!(r?._connectorId)) {
          return [{ field: 'http.auth.type', is: ['oauth'] }];
        }
      },
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
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'oauthandcancel',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'testandsavegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
