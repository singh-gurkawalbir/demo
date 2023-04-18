export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'cookie') {
      retValues['/http/baseURI'] = `https://${formValues['/instanceURI']}/entity/${
        formValues['/http/unencrypted/endpointName']
      }/${formValues['/http/unencrypted/endpointVersion']}`;
      retValues['/http/auth/cookie/method'] = 'POST';
      retValues['/http/auth/cookie/successStatusCode'] = 204;
      retValues['/http/ping/method'] = 'GET';
      retValues['/http/ping/relativeURI'] = '/FinancialPeriod';
      retValues['/http/auth/cookie/uri'] = `https://${
        formValues['/instanceURI']
      }/entity/auth/login`;
      retValues['/http/auth/cookie/body'] = `{"name": "${
        formValues['/http/unencrypted/username']
      }","password": "${formValues['/http/encrypted/password']}","company": "${
        formValues['/http/unencrypted/company']
      }"}`;
      retValues['/http/encrypted/cookieString'] = '';
      retValues['/http/auth/token/token'] = '';
      delete retValues['/http/auth/oauth/authURI'];
      delete retValues['/http/auth/oauth/tokenURI'];
      delete retValues['/http/auth/oauth/scopeDelimiter'];
      delete retValues['/http/auth/oauth/callbackURL'];
      delete retValues['/http/_iClientId'];
      retValues['/http/auth/oauth'] = undefined;
    } else {
      retValues['/http/baseURI'] = `https://${
        formValues['/oauth/instanceURI']
      }/entity/${formValues['/http/unencrypted/endpointName']}/${
        formValues['/http/unencrypted/endpointVersion']
      }`;
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] = `https://${
        formValues['/oauth/instanceURI']
      }/identity/connect/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `https://${
        formValues['/oauth/instanceURI']
      }/identity/connect/token`;
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      delete retValues['/http/auth/cookie/method'];
      delete retValues['/http/auth/cookie/successStatusCode'];
      delete retValues['/http/auth/cookie/uri'];
      delete retValues['/http/auth/cookie/body'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/http/unencrypted/password'];
      delete retValues['/http/encrypted/cookieString'];
      retValues['/http/auth/cookie'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'myobadvanced',
      '/http/mediaType': 'json',
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
      helpKey: 'myobadvanced.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Cookie', value: 'cookie' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    instanceURI: {
      id: 'instanceURI',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'myobadvanced.connection.instanceURI',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('/entity')
          );

        return subdomain;
      },
      deleteWhen: [{ field: 'http.auth.type', isNot: ['cookie'] }],
    },
    'oauth.instanceURI': {
      id: 'oauth.instanceURI',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      helpKey: 'myobadvanced.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('/entity')
          );

        return subdomain;
      },
    },
    'http.unencrypted.endpointName': {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      helpKey: 'myobadvanced.connection.http.unencrypted.endpointName',
      label: 'Endpoint name',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointName) ||
        'Default',
    },
    'http.unencrypted.endpointVersion': {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      helpKey: 'myobadvanced.connection.http.unencrypted.endpointVersion',
      label: 'Endpoint version',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointVersion) ||
        '18.200.001',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'myobadvanced.connection.http.unencrypted.username',
      deleteWhen: [{ field: 'http.auth.type', isNot: ['cookie'] }],
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'myobadvanced.connection.http.encrypted.password',
    },
    'http.unencrypted.company': {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      defaultValue: '',
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'myobadvanced.connection.http.unencrypted.company',
      deleteWhen: [{ field: 'http.auth.type', isNot: ['cookie'] }],
    },
    'http.unencrypted.locale': {
      id: 'http.unencrypted.locale',
      type: 'text',
      label: 'Locale',
      helpKey: 'myobadvanced.connection.http.unencrypted.locale',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['api', 'offline_access', 'api:concurrent_access'],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
    },
    genericOauthConnector: {
      formId: 'genericOauthConnector',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.auth.type',
          'instanceURI',
          'oauth.instanceURI',
          'http.unencrypted.endpointName',
          'http.unencrypted.endpointVersion',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.unencrypted.company',
          'http.unencrypted.locale',
          'http.auth.oauth.scope',
          'genericOauthConnector'] },
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
          is: ['cookie'],
        },
      ],
    },
  ],
};
