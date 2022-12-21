export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftdynamics365finance',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/unencrypted/subdomain']}.dynamics.com`,
    '/http/ping/relativeURI': '/data/CustomerGroups',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI':
          `https://login.microsoftonline.com/common/oauth2/authorize?prompt=consent&resource=https://${formValues['/http/unencrypted/subdomain']}.dynamics.com`,
    '/http/auth/oauth/tokenURI':
          'https://login.microsoftonline.com/common/oauth2/token',
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
      helpKey: 'microsoftdynamics365finance.connection.http.unencrypted.subdomain',
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
        fields: ['http.unencrypted.subdomain'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

