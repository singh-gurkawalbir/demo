export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'shipstation',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': 'carriers',
      '/rest/baseURI': `https://ssapi.shipstation.com`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key',
      defaultValue: r =>
        r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      type: 'text',
      inputType: 'password',
      label: 'API Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
