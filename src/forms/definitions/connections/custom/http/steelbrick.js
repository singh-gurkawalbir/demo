export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'steelbrick',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://login.salesforce.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI':
      'https://login.salesforce.com/services/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.salesforce.com/services/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
