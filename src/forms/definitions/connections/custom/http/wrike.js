export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.oauth.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
