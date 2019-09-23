export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'freshbooks',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.freshbooks.com/',
    '/rest/authURI': 'https://my.freshbooks.com/service/auth/oauth/authorize',
    '/rest/oauthTokenURI': 'https://api.freshbooks.com/auth/oauth/token',
    '/rest/headers': [
      { name: 'Api-Version', value: 'alpha' },
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/rest/refreshTokenHeaders': [
      { name: 'Api-Version', value: 'alpha' },
      { name: 'Content-Type', value: 'application/json' },
    ],
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
