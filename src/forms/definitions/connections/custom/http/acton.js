export default {
  preSave: formValues => ({
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
