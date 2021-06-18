export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'paylocity',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? 'apisandbox' : 'api'
    }.paylocity.com/api/v2/companies/${
      formValues['/http/unencrypted/companyId']}`,
    '/http/ping/relativeURI': '/employees',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/grantType': 'clientcredentials',
    '/http/auth/oauth/clientCredentialsLocation': 'basicauthheader',
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/unencrypted/environment'] === 'sandbox' ? 'apisandbox' : 'api'
    }.paylocity.com/IdentityServer/connect/token`,
    '/http/auth/oauth/accessTokenBody': '{"grant_type": "client_credentials","scope":"WebLinkAPI"}',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.environment': {
      id: 'http.unencrypted.environment',
      type: 'select',
      label: 'Environment',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpKey: 'paylocity.connection.http.unencrypted.environment',
    },
    'http.unencrypted.companyId': {
      id: 'http.unencrypted.companyId',
      type: 'text',
      label: 'Company ID',
      required: true,
      helpKey: 'paylocity.connection.http.unencrypted.companyId',
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
        fields: ['http.unencrypted.environment',
          'http.unencrypted.companyId',
          'http._iClientId',
          'http.auth.oauth.callbackURL'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
