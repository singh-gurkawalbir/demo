export default {
  preSubmit: formValues => ({
    ...formValues,
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/type': 'http',
    '/assistant': 'pdffiller',
    '/http/baseURI': 'https://api.pdffiller.com/v2',
    '/http/auth/oauth/authURI': 'https://developers.pdffiller.com/api_access',
    '/http/auth/oauth/tokenURI': 'https://api.pdffiller.com/v2/oauth/token',
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
