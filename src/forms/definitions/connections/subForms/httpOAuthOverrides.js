export default {
  fieldMap: {
    'http.auth.oauth.scopeDelimiter': {
      fieldId: 'http.auth.oauth.scopeDelimiter',
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.accessTokenHeaders': {
      fieldId: 'http.auth.oauth.accessTokenHeaders',
    },
    'http.auth.oauth.accessTokenBody': {
      fieldId: 'http.auth.oauth.accessTokenBody',
    },
    'http.auth.oauth.refreshHeaders': {
      id: 'http.auth.oauth.refreshHeaders',
      type: 'keyvalue',
      keyName: 'name',
      valueName: 'value',
      valueType: 'keyvalue',
      helpKey: 'connection.http.auth.token.refreshHeaders',
      label: 'Override refresh token HTTP headers',
      defaultValue: r => r?.http?.auth?.token?.refreshHeaders,
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.refreshBody': {
      id: 'http.auth.oauth.refreshBody',
      type: 'httprequestbody',
      contentType: 'json',
      label: 'Override refresh token HTTP request body',
      defaultValue: r => r?.http?.auth?.token?.refreshBody,
      visibleWhenAll: [
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.token.revoke.headers': {
      fieldId: 'http.auth.token.revoke.headers',
    },
    'http.auth.token.revoke.body': {
      fieldId: 'http.auth.token.revoke.body',
    },
  },
  layout: {
    fields: [
      'http.auth.oauth.scopeDelimiter',
      'http.auth.oauth.accessTokenHeaders',
      'http.auth.oauth.accessTokenBody',
      'http.auth.oauth.refreshHeaders',
      'http.auth.oauth.refreshBody',
      'http.auth.token.revoke.headers',
      'http.auth.token.revoke.body',
    ],
  },
};

