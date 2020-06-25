export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'avalara',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v2/companies',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${
      formValues['/accType'] === 'sandbox' ? 'sandbox-' : ''
    }rest.avatax.com/api/`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    accType: {
      id: 'accType',
      type: 'select',
      label: 'Account type',
      required: true,
      helpKey: 'avalara.connection.accType',
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
            return 'production';
          }

          return 'sandbox';
        }

        return 'production';
      },
    },
    'http.auth.basic.username': { fieldId: 'http.auth.basic.username' },
    'http.auth.basic.password': { fieldId: 'http.auth.basic.password' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['accType',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
