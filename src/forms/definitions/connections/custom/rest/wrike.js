export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.scope': {
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
