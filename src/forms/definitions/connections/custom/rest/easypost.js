export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'easypost',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/addresses',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://api.easypost.com/v2`,
      '/rest/basicAuth/password': '',
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
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
