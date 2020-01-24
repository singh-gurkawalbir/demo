export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'constantcontactv3',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.cc.email/v3/`,
    '/http/auth/oauth/authURI': 'https://api.cc.email/v3/idfed',
    '/http/auth/oauth/tokenURI':
      'https://idfed.constantcontact.com/as/token.oauth2',
    '/http/auth/oauth/scopeDelimiter': '',
    '/http/auth/oauth/scope': ['contact_data'],
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
