export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'nimble',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.nimble.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.nimble.com/oauth/authorize',
    '/rest/oauthTokenURI': 'https://api.nimble.com/oauth/token',
    '/rest/scopeDelimiter': ',',
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
