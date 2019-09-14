export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'myobessentials',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.myob.com/au/essentials`,
    '/http/auth/oauth/authURI':
      'https://secure.myob.com/oauth2/account/authorize',
    '/http/auth/oauth/tokenURI': 'https://secure.myob.com/oauth2/v1/authorize',
    '/http/auth/oauth/scope': ['la.global'],
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/headers': [{ name: 'x-myobapi-version', value: 'v0' }],
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
