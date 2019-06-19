export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'Authorization',
      value: `Bearer ${formValues['/integrator/token']}`,
    });
    headers.push({ name: 'Content-Type', value: 'application/json' });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'integratorio',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api${
        formValues['/integrator/environment'] === 'staging' ? '.staging' : ''
      }.integrator.io`,
      '/rest/pingRelativeURI': '/v1/connections',
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'integrator.environment',
      type: 'select',
      label: 'Environment:',
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
        const baseUri = r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('staging') !== -1) {
            return 'staging';
          }

          return 'production';
        }

        return 'production';
      },
    },
    {
      id: 'integrator.token',
      type: 'text',
      label: 'Token:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
