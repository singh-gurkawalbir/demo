export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    let baseURI = '';

    if (retValues['/integrator/region'] === 'europe') {
      baseURI = 'https://api.eu.integrator.io';
      retValues['/integrator/environment'] = undefined;
    } else if (retValues['/integrator/environment'] === 'staging') {
      baseURI = 'https://api.staging.integrator.io';
    } else if (retValues['/integrator/environment'] === 'production') {
      baseURI = 'https://api.integrator.io';
    }

    retValues['/http/headers'] = [
      {
        name: 'Authorization',
        value: `Bearer ${formValues['/integrator/token']}`,
      },
      { name: 'Content-Type', value: 'application/json' },
    ];
    delete retValues['/integrator/environment'];
    delete retValues['/integrator/region'];
    delete retValues['/integrator/token'];

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'integratorio',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'json',
      '/http/ping/method': 'GET',
      '/http/baseURI': baseURI,
      '/http/ping/relativeURI': '/v1/connections',
    };
  },
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
      visibleWhen: [
        {
          field: 'integrator.region',
          is: ['north_america'],
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

        return '';
      },
    },
    'integrator.region': {
      id: 'integrator.region',
      type: 'select',
      label: 'Region',
      helpText:
        'Please select your region here. Select North America if the account is created on https://api.integrator.io. Select Europe if the account is created on https://api.eu.integrator.io.',
      required: true,
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('eu') !== -1) {
            return 'europe';
          }

          return 'north_america';
        }
      },
      options: [
        {
          items: [
            {
              value: 'north_america',
              label: 'North America',
            },
            {
              value: 'europe',
              label: 'Europe',
            },
          ],
        },
      ],
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
    fields: [
      'name',
      'integrator.region',
      'integrator.environment',
      'integrator.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
