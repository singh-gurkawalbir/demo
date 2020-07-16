export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'target',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/accType'] === 'sandbox' ? 'stage-' : ''
    }api.target.com`,
    '/http/ping/relativeURI': `sellers/v1/sellers/${
      formValues['/http/unencrypted/x-seller-id']
    }/distribution_centers`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'x-seller-token',
    '/http/auth/token/scheme': '',
    '/http/headers': [
      {
        name: 'x-seller-id',
        value: '{{{connection.http.unencrypted.x-seller-id}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accType: {
      id: 'accType',
      type: 'select',
      label: 'Account type',
      required: true,
      helpKey: 'target.connection.accType',
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
          if (baseUri.indexOf('sandbox') === -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.auth.token.token': {
      id: 'http.auth.token.token',
      type: 'text',
      label: 'X-SELLER-TOKEN',
      helpKey: 'target.connection.http.auth.token.token',
      required: true,
      inputType: 'password',
    },
    'http.unencrypted.x-seller-id': {
      id: 'http.unencrypted.x-seller-id',
      type: 'text',
      label: 'X-SELLER-ID',
      helpKey: 'target.connection.http.unencrypted.x-seller-id',
      required: true,
    },
    application: {
      fieldId: 'application'
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['accType',
          'http.unencrypted.x-seller-id',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
