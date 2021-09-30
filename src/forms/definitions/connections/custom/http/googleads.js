export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'googleads',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://googleads.googleapis.com/',
    '/http/ping/relativeURI': `/v7/customers/${formValues['/http/unencrypted/customerId']}`,
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth?prompt=consent&access_type=offline',
    '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/scope': ['https://www.googleapis.com/auth/adwords'],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/clientCredentialsLocation': 'body',
    '/http/headers': [
      { name: 'developer-token', value: '{{{connection.http.encrypted.developerToken}}}' },
      { name: 'login-customer-id', value: '{{{connection.http.unencrypted.loginCustomerId}}}' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.encrypted.developerToken': {
      id: 'http.encrypted.developerToken',
      type: 'text',
      label: 'Developer token',
      inputType: 'password',
      defaultValue: '',
      required: true,
      helpKey: 'googleads.connection.http.encrypted.developerToken',
    },
    'http.unencrypted.customerId': {
      id: 'http.unencrypted.customerId',
      type: 'text',
      label: 'Customer ID',
      required: true,
      helpKey: 'googleads.connection.http.unencrypted.customerId',
    },
    'http.unencrypted.loginCustomerId': {
      id: 'http.unencrypted.loginCustomerId',
      type: 'text',
      label: 'Login customer ID',
      required: true,
      helpKey: 'googleads.connection.http.unencrypted.loginCustomerId',
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
          'http.encrypted.developerToken',
          'http.unencrypted.customerId',
          'http.unencrypted.loginCustomerId',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
