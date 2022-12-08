export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'docebo',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/poweruser/v1/powerusers',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI': `${formValues['/http/baseURI']}/oauth2/authorize`,
    '/http/auth/oauth/tokenURI': `${formValues['/http/baseURI']}/oauth2/token`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/clientCredentialsLocation': 'body',
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      label: 'Base URI',
      helpKey: 'docebo.connection.http.baseURI',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Base URL should not contain spaces.',
        },
      },
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
        fields: ['http.baseURI',
          'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
