export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'cookie') {
      retValues['/http/baseURI'] = `${formValues['/instanceURI']}/entity/${
        formValues['/http/unencrypted/endpointName']
      }/${formValues['/http/unencrypted/endpointVersion']}`;
      retValues['/http/auth/cookie/method'] = 'POST';
      retValues['/http/auth/cookie/successStatusCode'] = 204;
      retValues['/http/auth/cookie/uri'] = `${
        formValues['/instanceURI']
      }/entity/auth/login`;
      retValues['/http/auth/cookie/body'] = `{"name": "${
        formValues[`/http/unencrypted/username`]
      }","password": "${formValues[`/http/encrypted/password`]}","company": "${
        formValues[`/http/unencrypted/company`]
      }"}`;
      retValues['/http/encrypted/cookieString'] = '';
      retValues['/http/auth/token/token'] = '';
      delete retValues['/http/auth/oauth/authURI'];
      delete retValues['/http/auth/oauth/tokenURI'];
      delete retValues['/http/auth/oauth/scopeDelimiter'];
      delete retValues['/http/auth/oauth/scope'];
      delete retValues['/http/auth/oauth/callbackURL'];
      delete retValues['/http/_iClientId'];
      retValues['/http/auth/oauth'] = undefined;
    } else {
      retValues['/http/baseURI'] = `${
        formValues['/oauth/instanceURI']
      }/entity/${formValues['/http/unencrypted/endpointName']}/${
        formValues['/http/unencrypted/endpointVersion']
      }`;
      retValues['/http/auth/oauth/authURI'] = `${
        formValues['/oauth/instanceURI']
      }/AcumaticaERP/identity/connect/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `${
        formValues['/oauth/instanceURI']
      }/AcumaticaERP/identity/connect/token`;
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      delete retValues['/http/auth/cookie/method'];
      delete retValues['/http/auth/cookie/successStatusCode'];
      delete retValues['/http/auth/cookie/uri'];
      delete retValues['/http/auth/cookie/body'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/instanceURI'];
      delete retValues['/http/unencrypted/username'];
      delete retValues['/http/unencrypted/password'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/http/unencrypted/company'];
      retValues['/http/auth/cookie'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'acumatica',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
      '/http/ping/relativeURI': '/FinancialPeriod',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      helpKey: 'acumatica.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Cookie', value: 'cookie' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    instanceURI: {
      id: 'instanceURI',
      type: 'text',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/entity'));

        return subdomain;
      },
    },
    'oauth.instanceURI': {
      id: 'oauth.instanceURI',
      type: 'text',
      endAdornment: '/AcumaticaERP',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      helpKey: 'acumatica.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(0, baseUri.indexOf('/AcumaticaERP'));

        return subdomain;
      },
    },
    'http.unencrypted.endpointName': {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      helpKey: 'acumatica.connection.http.unencrypted.endpointName',
      label: 'Endpoint name',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointName) ||
        'Default',
    },
    'http.unencrypted.endpointVersion': {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      helpKey: 'acumatica.connection.http.unencrypted.endpointVersion',
      label: 'Endpoint version',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          r.http.unencrypted.endpointVersion) ||
        '18.200.001',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      defaultValue: r =>
        r && r.http && r.http.unencrypted && r.http.unencrypted.username,
      helpKey: 'acumatica.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.http.encrypted.password',
    },
    'http.unencrypted.company': {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      defaultValue: '',
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.http.unencrypted.company',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['api', 'offline_access', 'api:concurrent_access'],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    genericOauthConnector: {
      formId: 'genericOauthConnector',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'mode',
      'http.auth.type',
      '_agentId',
      'instanceURI',
      'oauth.instanceURI',
      'http.unencrypted.endpointName',
      'http.unencrypted.endpointVersion',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.unencrypted.company',
      'http.auth.oauth.scope',
      'genericOauthConnector',
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
      label: 'Save & authorize',
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
          is: ['cookie'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['cookie'],
        },
      ],
    },
  ],
};
