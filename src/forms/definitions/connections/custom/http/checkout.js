export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'checkout',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/event-types',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.${
      formValues['/environment'] === 'sandbox' ? 'sandbox' : ''
    }.checkout.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Account type',
      helpKey: 'checkout.connection.environment',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
      helpKey: 'checkout.connection.http.auth.token.token',
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
        fields: ['environment', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
