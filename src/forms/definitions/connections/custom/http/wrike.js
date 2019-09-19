export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'wrike',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://www.wrike.com/api',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://www.wrike.com/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://www.wrike.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ',',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'Default',
        'wsReadOnly',
        'wsReadWrite',
        'amReadOnlyUser',
        'amReadWriteUser',
        'amReadOnlyGroup',
        'amReadWriteGroup',
        'amReadOnlyInvitation',
        'amReadWriteInvitation',
        'amReadOnlyWorkflow',
        'amReadWriteWorkflow',
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
