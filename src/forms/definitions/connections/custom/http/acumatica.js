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
      delete retValues['/http/auth/oauth/callbackURL'];
      retValues['/http/auth/oauth'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] = `${
        formValues['/oauth/instanceURI']
      }/identity/connect/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `${
        formValues['/oauth/instanceURI']
      }/identity/connect/token`;
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      delete retValues['/http/auth/cookie/method'];
      delete retValues['/http/auth/cookie/successStatusCode'];
      delete retValues['/http/auth/cookie/uri'];
      delete retValues['/http/auth/cookie/body'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/instanceURI'];
      delete retValues['/http/unencrypted/endpointName'];
      delete retValues['/http/unencrypted/username'];
      delete retValues['/http/unencrypted/password'];
      delete retValues['/http/encrypted/cookieString'];

      retValues['/http/auth/cookie'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'acumatica',
      '/http/mediaType': 'json',
      '/isHTTP': false,
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
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
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
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
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
    genericOauth: {
      id: 'genericOauth',
      label: 'Configure your client id and secret',
      type: 'checkbox',
      required: true,
      defaultValue: r => !!(r && r.http && r.http._iClientId),
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
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
      'http.unencrypted.endpointName',
      'http.unencrypted.endpointVersion',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.unencrypted.company',
      'oauth.instanceURI',
      'http.auth.oauth.scope',
      'genericOauth',
      'http._iClientId',
      'http.auth.oauth.callbackURL',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
