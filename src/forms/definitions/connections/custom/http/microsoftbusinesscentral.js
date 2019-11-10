export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftbusinesscentral',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.businesscentral.dynamics.com',
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/failStatusCode': 500,
    '/http/auth/failPath': 'error.message',
    '/http/auth/failValues': [
      'The SAML2 token is not valid because its validity period has ended.',
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
