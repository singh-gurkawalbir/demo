export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'orderful',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.orderful.com',
    '/http/ping/relativeURI': `${formValues['/http/unencrypted/version'] === 'v2' ? '/v2/transactions' : '/v3/organizations/me'
    }`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'orderful-api-key',
    '/http/auth/token/scheme': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.version': {
      id: 'http.unencrypted.version',
      required: true,
      type: 'select',
      label: 'Version',
      helpKey: 'orderful.connection.http.unencrypted.version',
      options: [
        {
          items: [
            { label: 'V2', value: 'v2' },
            { label: 'V3', value: 'v3' },
          ],
        },
      ],
      defaultValue: r => {
        const relativeUri = r && r.http && r.http.ping && r.http.ping.relativeURI;

        if (relativeUri) {
          if (relativeUri.indexOf('/v3') === -1) {
            return 'v2';
          }

          return 'v3';
        }
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'orderful.connection.http.auth.token.token',
      label: 'API Key',
      required: true,
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
        fields: ['http.unencrypted.version', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
