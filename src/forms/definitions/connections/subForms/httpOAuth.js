export default {
  fieldMap: {
    'http._iClientId': {
      fieldId: 'http._iClientId',
      label: 'OAuth 2.0 client',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'http.auth.oauth.scope': {
      id: 'http.auth.oauth.scope',
      type: 'text',
      label: 'Scope',
      delimiter: ',',
      helpKey: 'connection.generic.http.auth.oauth.scope',
    },
  },
  layout: {
    fields: [
      'http._iClientId',
      'http.auth.oauth.scope',
    ],
  },
};

