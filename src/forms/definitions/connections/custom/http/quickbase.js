export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'quickbase',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.quickbase.com/v1',
    '/http/ping/relativeURI': `/apps/${formValues['/http/unencrypted/appId']}`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'QB-USER-TOKEN',
    '/http/auth/token/headerName': 'Authorization',
    '/http/headers': [
      {
        name: 'QB-Realm-Hostname',
        value: '{{connection.http.unencrypted.hostname}}',
      },
    ],
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.hostname': {
      id: 'http.unencrypted.hostname',
      type: 'text',
      label: 'QB-Realm-Hostname',
      required: true,
      helpKey: 'quickbase.connection.http.unencrypted.hostname',
    },
    'http.unencrypted.appId': {
      id: 'http.unencrypted.appId',
      type: 'text',
      label: 'App ID',
      required: true,
      helpKey: 'quickbase.connection.http.unencrypted.appId',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'QB-USER-TOKEN',
      required: true,
      helpKey: 'quickbase.connection.http.auth.token.token',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.unencrypted.hostname',
          'http.auth.token.token',
          'http.unencrypted.appId',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['httpAdvanced'],
      },
    ],
  },
};
