export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'orangehrm',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/unencrypted/subdomain']}.orangehrm.com`,
    '/http/ping/relativeURI': '/api/employees',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/useIClientFields': false,
    '/http/auth/oauth/tokenURI': `https://${formValues['/http/unencrypted/subdomain']}.orangehrm.com/oauth/issueToken`,
    '/http/auth/oauth/clientCredentialsLocation': 'body',
    '/http/auth/oauth/grantType': 'clientcredentials',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/accessTokenBody': '{"grant_type": "client_credentials","username":"{{{http.unencrypted.username}}}", "password":"{{{http.encrypted.password}}}","client_id":"{{{clientId}}}","client_secret":"{{{clientSecret}}}"}',
    '/http/auth/oauth/accessTokenHeaders': [
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.subdomain': {
      fieldId: 'http.unencrypted.subdomain',
      startAdornment: 'https://',
      endAdornment: '.orangehrm.com',
      type: 'text',
      label: 'Subdomain',
      helpKey: 'orangehrm.connection.http.unencrypted.subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpKey: 'orangehrm.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'orangehrm.connection.http.encrypted.password',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
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
        fields: [
          'http.unencrypted.subdomain',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

