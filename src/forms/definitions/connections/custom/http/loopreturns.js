export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'loopreturns',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.loopreturns.com/api/${formValues['/http/unencrypted/version'] === 'v1' ? 'v1' : 'v2'}`,
    '/http/ping/relativeURI': `${formValues['/http/unencrypted/version'] === 'v1' ? '/blacklists' : '/returns'}`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Authorization',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.version': {
      id: 'http.unencrypted.version',
      helpKey: 'loopreturns.connection.http.unencrypted.version',
      required: true,
      type: 'select',
      label: 'API version',
      options: [
        {
          items: [
            { label: 'v1', value: 'v1'},
            { label: 'v2', value: 'v2'},
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('/v2') === -1) {
            return 'v1';
          }

          return 'v2';
        }
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'loopreturns.connection.http.auth.token.token',
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
