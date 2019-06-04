export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'snapfulfil',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': 'api/Receipts',
      '/rest/baseURI': `https://${
        formValues['/rest/subdomain']
      }.snapfulfil.net/`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'subDomain',
      type: 'text',
      name: '/rest/subdomain',
      startAdornment: 'https://',
      endAdornment: '.snapfulfil.net/',
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
          baseUri.indexOf('.snapfulfil.net/')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
      defaultValue: r =>
        r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
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
