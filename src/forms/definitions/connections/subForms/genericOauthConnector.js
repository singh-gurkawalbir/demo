export default {
  fieldMap: {
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
      visibleWhenAll: [{ field: 'genericOauth', is: ['true'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhenAll: [{ field: 'genericOauth', is: ['true'] }],
    },
  },
  layout: {
    fields: ['genericOauth', 'http._iClientId', 'http.auth.oauth.callbackURL'],
  },
};
