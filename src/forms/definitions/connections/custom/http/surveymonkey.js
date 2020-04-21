export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'surveymonkey',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.surveymonkey.com',
    '/http/auth/oauth/authURI': 'https://api.surveymonkey.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.surveymonkey.com/oauth/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'surveys_read',
        'surveys_write',
        'collectors_read',
        'collectors_write',
        'contacts_read',
        'contacts_write',
        'responses_read',
        'webhooks_read',
        'webhooks_write',
        'users_read',
        'library_read',
      ],
    },
    genericOauth: {
      id: 'genericOauth',
      label: 'Configure your client id and secret',
      type: 'checkbox',
      required: true,
      defaultValue: r => !!(r && r.http && r.http._iClientId),
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.oauth.scope',
      'genericOauth',
      'http._iClientId',
      'http.auth.oauth.callbackURL',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
