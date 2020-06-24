export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftbusinesscentral',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.businesscentral.dynamics.com/v2.0/${
      formValues['/http/unencrypted/environmentName']
    }/api/v1.0`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/failStatusCode': 500,
    '/http/auth/failPath': 'error.message',
    '/http/auth/failValues': [
      'The SAML2 token is not valid because its validity period has ended.',
    ],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.environmentName': {
      type: 'text',
      id: 'http.unencrypted.environmentName',
      helpText:
        "Enter your Microsoft Dynamics 365 Business Central's enviornment.",
      label: 'Environment Name',
      required: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'http.unencrypted.environmentName'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
