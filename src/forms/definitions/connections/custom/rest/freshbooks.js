export default {
  preSubmit: formValues => ({
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

  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
