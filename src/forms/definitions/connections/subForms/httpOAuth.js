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
    'http.auth.oauth.grantType': {
      fieldId: 'http.auth.oauth.grantType',
      required: true,
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.authURI': {
      fieldId: 'http.auth.oauth.authURI',
      required: true,
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.scope': {
      id: 'http.auth.oauth.scope',
      type: 'text',
      label: 'Scope',
      delimiter: ',',
      helpKey: 'connection.generic.http.auth.oauth.scope',
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.tokenURI': {
      fieldId: 'http.auth.oauth.tokenURI',
      required: true,
    },
    'http.auth.oauth.clientCredentialsLocation': {
      fieldId: 'http.auth.oauth.clientCredentialsLocation',
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['clientcredentials'] },
      ],
      required: true,
    },
    'http.auth.token.revoke.uri': {
      fieldId: 'http.auth.token.revoke.uri',
    },
  },
  layout: {
    fields: [
      'http._iClientId',
      'http.auth.oauth.grantType',
      'http.auth.oauth.clientCredentialsLocation',
      'http.auth.oauth.authURI',
      'http.auth.oauth.callbackURL',
      'http.auth.oauth.scope',
      'http.auth.oauth.tokenURI',
      'http.auth.token.revoke.uri',
    ],
  },
};

