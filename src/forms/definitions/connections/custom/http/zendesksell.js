export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zendesksell',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.getbase.com',
    '/http/ping/relativeURI': '/v2/contacts',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/authURI': 'https://api.getbase.com/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.getbase.com/oauth2/token',
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/oauth/clientCredentialsLocation': 'basicauthheader',
    '/http/auth/oauth/accessTokenBody':
      '{"redirect_uri": "https://staging.integrator.io/connection/oauth2callback","grant_type": "authorization_code","code": "{{{query.code}}}"}',
    '/http/headers': [{ name: 'User-agent', value: '*' }],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http._iClientId'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
