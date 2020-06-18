export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipwire',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v3/orders',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '.beta' : ''
    }.shipwire.com/api`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      required: true,
      helpKey: 'shipwire.connection.environment',
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
          if (baseUri.indexOf('beta') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'shipwire.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'shipwire.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
