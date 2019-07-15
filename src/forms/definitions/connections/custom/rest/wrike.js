export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'wrike',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': 'https://www.wrike.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.wrike.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://www.wrike.com/oauth2/token',
    '/rest/scopeDelimiter': ',',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
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
};
