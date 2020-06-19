export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'constantcontactv2',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.constantcontact.com/v2/',
    '/http/auth/oauth/authURI':
      'https://oauth2.constantcontact.com/oauth2/oauth/siteowner/authorize',
    '/http/auth/oauth/tokenURI':
      'https://oauth2.constantcontact.com/oauth2/oauth/token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
