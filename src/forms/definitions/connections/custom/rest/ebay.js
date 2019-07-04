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
      id: 'rest.sandbox',
      type: 'select',
      label: 'Account Type:',
      options: [
        {
          items: [
            { label: 'Production', value: 'false' },
            { label: 'Sandbox', value: 'true' },
          ],
        },
      ],
      helpText:
        'Select either Production or Sandbox and then click Configure Scopes to select the API endpoints that you might require while creating dataflows. After you have configured the scopes, click Save & Authorize that opens up the eBay window to enter email/username and password to establish the connection with eBay.',
      defaultValue: r => {
        const authUri = r.rest.authURI;

        if (authUri) {
          if (authUri.indexOf('sandbox') !== -1) {
            return 'true';
          }
        }

        return 'false';
      },
    },
    {
      fieldId: 'rest.scope',
      scopes: [
        'https://www.googleapis.com/auth/dfatrafficking',
        'https://www.googleapis.com/auth/dfareporting',
        'https://www.googleapis.com/auth/ddmconversions',
      ],
    },
  ],
};
