export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'pdffiller',
    '/rest/baseURI': 'https://api.pdffiller.com/v2',
    '/rest/authURI': 'https://developers.pdffiller.com/api_access',
    '/rest/oauthTokenURI': 'https://api.pdffiller.com/v2/oauth/token',
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
