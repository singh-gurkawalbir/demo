export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'mailgun',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'urlencoded',
      '/rest/pingRelativeURI': '/domains',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://api.mailgun.net/v3`,
      '/rest/basicAuth/username': 'api',
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'apiKey',
      name: '/rest/basicAuth/password',
      type: 'text',
      inputType: 'password',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
