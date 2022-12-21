export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'acton',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://restapi.actonsoftware.com',
    '/http/auth/oauth/authURI': 'https://restapi.actonsoftware.com/authorize',
    '/http/auth/oauth/tokenURI': 'https://restapi.actonsoftware.com/token',
    '/http/auth/token/scheme': 'Bearer',
    '/http/headers': [{ name: 'Accept', value: 'application/json' }],
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/scope': ['PRODUCTION'],
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
