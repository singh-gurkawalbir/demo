export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'precisely',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.precisely.com',
    '/http/ping/relativeURI': '/geocode/v1/basic/geocode',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/tokenURI': 'https://api.precisely.com/oauth/token',
    '/http/auth/oauth/clientCredentialsLocation': 'basicauthheader',
    '/http/auth/oauth/grantType': 'clientcredentials',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/accessTokenHeaders': [
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
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
      helpKey: 'precisely.http._iClientId',
      ignoreEnvironmentFilter: true,
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
      {
        collapsed: true,
        label: 'Configure your client id and secret',
        fields: ['http._iClientId'],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

