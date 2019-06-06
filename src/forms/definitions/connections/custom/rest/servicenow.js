export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'servicenow',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/api/now/pa/scorecards',
      '/rest/baseURI': `https://${formValues['/instanceName']}.service-now.com`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'instanceName',
      type: 'text',
      name: '/instanceName',
      startAdornment: 'https://',
      endAdornment: '.service-now.com',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[a-zA-Z0-9]*$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.service-now.com')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
