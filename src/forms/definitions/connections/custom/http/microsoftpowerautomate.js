export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftpowerautomate',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/unencrypted/subdomain']}.dynamics.com/api/data/v9.1`,
    '/http/ping/relativeURI': '/workflows',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/oauth/useIClientFields': false,
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/oauth/authURI': `https://login.microsoftonline.com/${formValues['/http/unencrypted/tenantId']}/oauth2/authorize?resource=https://${formValues['/http/unencrypted/subdomain']}.dynamics.com`,
    '/http/auth/oauth/tokenURI': `https://login.microsoftonline.com/${formValues['/http/unencrypted/tenantId']}/oauth2/token`,
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.subdomain': {
      id: 'http.unencrypted.subdomain',
      type: 'text',
      label: 'Subdomain',
      startAdornment: 'https://',
      endAdornment: '.dynamics.com',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      helpKey: 'microsoftpowerautomate.connection.http.unencrypted.subdomain',
    },
    'http.unencrypted.tenantId': {
      id: 'http.unencrypted.tenantId',
      type: 'text',
      label: 'Tenant ID',
      required: true,
      helpKey: 'microsoftpowerautomate.connection.http.unencrypted.tenantId',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'microsoftpowerautomate.connection.http._iClientId',
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
          'http.unencrypted.tenantId',
          'http._iClientId',
          'http.auth.oauth.callbackURL'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
