export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sageone',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.accounting.sage.com/v3.1',
    '/http/auth/oauth/authURI':
      'https://www.sageone.com/oauth2/auth/central?filter=apiv3.1',
    '/http/auth/oauth/tokenURI': 'https://oauth.accounting.sage.com/token',
    '/http/auth/oauth/scope': ['full_access'],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
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
