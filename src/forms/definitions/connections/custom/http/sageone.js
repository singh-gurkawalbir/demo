export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sageone',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
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
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
