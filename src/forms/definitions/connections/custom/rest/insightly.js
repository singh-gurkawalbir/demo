export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'insightly',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'urlencoded',
      '/rest/pingRelativeURI': '/v2.1/Contacts',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://api.insight.ly`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'apiKey',
      name: '/rest/basicAuth/username',
      type: 'text',
      inputType: 'password',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
