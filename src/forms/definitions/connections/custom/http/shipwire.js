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
      helpText:
        'Please select your environment here. Select Sandbox if the account is created on https://beta.shipwire.com. Select Production if the account is created on https://www.shipwire.com.',
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
          if (baseUri.indexOf('beta') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your Shipwire account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your Shipwire account.',
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
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
