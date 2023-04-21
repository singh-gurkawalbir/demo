export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'oauth') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/oauth/tokenURI'] = `https://${formValues['/instanceName']}.service-now.com/oauth_token.do`;
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/oauth/grantType'] = 'clientcredentials';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/clientCredentialsLocation'] = 'body';
      retValues['/http/auth/oauth/refreshTokenPath'] = 'refresh_token';
      retValues['/http/auth/oauth/accessTokenPath'] = 'access_token';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/oauth/accessTokenHeaders'] = [
        {
          name: 'Content-type',
          value: 'application/x-www-form-urlencoded',
        },
      ];
      retValues['/http/auth/oauth/accessTokenBody'] = '{"grant_type":"password","client_id":"{{{clientId}}}","client_secret":"{{{clientSecret}}}","username":"{{{connection.http.unencrypted.username}}}","password":"{{{connection.http.encrypted.password}}}"}';
      retValues['/http/auth/token/refreshBody'] = '{"grant_type":"refresh_token","client_id":"{{{clientId}}}","client_secret":"{{{clientSecret}}}","username":"{{{connection.http.unencrypted.username}}}","password":"{{{connection.http.encrypted.password}}}"}';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/basic'] = undefined;
    } else {
      retValues['/http/auth/basic/username'] = `${
        formValues['/http/auth/basic/username']
      }`;
      retValues['/http/auth/basic/password'] = `${
        formValues['/http/auth/basic/password']
      }`;
      retValues['/http/auth/token/headerName'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/token/scheme'] = undefined;
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/token/refreshToken'] = undefined;
      retValues['/http/auth/oauth/grantType'] = undefined;
      retValues['/http/auth/oauth/refreshTokenPath'] = undefined;
      retValues['/http/auth/oauth/accessTokenPath'] = undefined;
      retValues['/http/auth/oauth/clientCredentialsLocation'] = undefined;
      retValues['/http/auth/token/refreshMethod'] = undefined;
      retValues['/http/auth/token/location'] = undefined;
      retValues['/http/auth/token/refreshMediaType'] = undefined;
      retValues['/http/auth/token/refreshBody'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'servicenow',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/instanceName']}.service-now.com`,
      '/http/ping/relativeURI': '/api/now/pa/scorecards',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      fieldId: 'http.auth.type',
      type: 'select',
      label: 'Authentication type',
      isLoggable: true,
      helpKey: 'servicenow.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'OAuth 2.0', value: 'oauth' },
            { label: 'Basic', value: 'basic' },
          ],
        },
      ],
      defaultValue: r => {
        const authType = r && r.http && r.http.auth && r.http.auth.type;

        if (authType === 'oauth') {
          return 'oauth';
        }

        return 'basic';
      },
    },
    instanceName: {
      type: 'text',
      id: 'instanceName',
      startAdornment: 'https://',
      endAdornment: '.service-now.com',
      label: 'Subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.service-now.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'servicenow.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'servicenow.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      helpKey: 'servicenow.connection.http.auth.basic.username',
      label: 'Username',
      required: true,
      type: 'text',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      helpKey: 'servicenow.connection.http.auth.basic.password',
      label: 'Password',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'servicenow.connection.http._iClientId',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
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
          'instanceName',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
        ] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
