export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'integratorio',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api${
      formValues['/integrator/environment'] === 'staging' ? '.staging' : ''
    }.integrator.io`,
    '/http/ping/relativeURI': '/v1/connections',
    '/http/headers': [
      {
        name: 'Authorization',
        value: `Bearer ${formValues['/integrator/token']}`,
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'integrator.environment': {
      id: 'integrator.environment',
      type: 'select',
      label: 'Environment',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
          ],
        },
      ],
      helpText:
        'Please select your environment here. Select Sandbox if the account is created on https://staging.integrator.io. Select Production if the account is created on https://integrator.io.',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('staging') !== -1) {
            return 'staging';
          }

          return 'production';
        }

        return 'production';
      },
    },
    'integrator.token': {
      id: 'integrator.token',
      type: 'text',
      label: 'Token',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'integrator.environment', 'integrator.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
