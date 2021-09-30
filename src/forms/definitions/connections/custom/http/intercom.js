export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'intercom',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.intercom.io/',
    '/http/ping/relativeURI': '/contacts',
    '/http/auth/oauth/authURI': 'https://app.intercom.io/oauth',
    '/http/auth/oauth/tokenURI': 'https://api.intercom.io/auth/eagle/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/grantType': 'authorizecode',
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
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
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
        fields: ['http.auth.oauth.callbackURL', 'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
