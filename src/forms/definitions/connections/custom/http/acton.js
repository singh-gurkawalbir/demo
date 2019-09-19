export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'acton',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://restapi.actonsoftware.com`,
    '/http/auth/oauth/authURI': `https://restapi.actonsoftware.com/authorize`,
    '/http/auth/oauth/tokenURI': `https://restapi.actonsoftware.com/token`,
    '/http/auth/token/scheme': 'Bearer',
    '/http/headers': [{ name: 'Accept', value: 'application/json' }],
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/scope': ['PRODUCTION'],
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
