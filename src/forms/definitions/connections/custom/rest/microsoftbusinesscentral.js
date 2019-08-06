export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'microsoftbusinesscentral',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.businesscentral.dynamics.com',
    '/rest/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/rest/oauthTokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
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
