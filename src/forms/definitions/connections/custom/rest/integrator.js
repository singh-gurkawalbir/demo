export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'Authorization',
      value: `Bearer ${formValues['/integrator/token']}`,
    });
    headers.push({ name: 'Content-Type', value: 'application/json' });

    const fixedValues = {
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
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'integrator.environment',
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
      fieldId: 'integrator.token',
    },
  ],
};
