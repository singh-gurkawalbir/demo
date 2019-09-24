export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'doubleclick',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://www.googleapis.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://accounts.google.com/o/oauth2/auth`,
    '/http/auth/oauth/tokenURI': `https://accounts.google.com/o/oauth2/token`,
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.scope': {
      fieldId: 'rest.scope',
      scopes: [
        'https://www.googleapis.com/auth/dfatrafficking',
        'https://www.googleapis.com/auth/dfareporting',
        'https://www.googleapis.com/auth/ddmconversions',
      ],
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
