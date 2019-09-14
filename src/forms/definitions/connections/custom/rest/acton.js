export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'acton',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://restapi.actonsoftware.com`,
    '/rest/authURI': `https://restapi.actonsoftware.com/authorize`,
    '/rest/oauthTokenURI': `https://restapi.actonsoftware.com/token`,
    '/rest/authScheme': 'Bearer',
    '/rest/headers': [{ name: 'Accept', value: 'application/json' }],
    '/rest/scopeDelimiter': ' ',
    '/rest/scope': ['PRODUCTION'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
