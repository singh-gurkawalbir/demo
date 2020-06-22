export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'wrike',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://www.wrike.com/api/v4',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://www.wrike.com/oauth2/authorize/v4',
    '/http/auth/oauth/tokenURI': 'https://www.wrike.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
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
        'amReadOnlyTimelogCategory',
        'amReadWriteTimelogCategory',
        'dataExportFull',
        'amReadOnlyAuditLog',
      ],
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
