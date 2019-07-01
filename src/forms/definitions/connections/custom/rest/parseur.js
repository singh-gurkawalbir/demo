export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({ name: 'Content-Type', value: 'application/json' });
    headers.push({
      name: 'Authorization',
      value: 'Token {{{connection.rest.encrypted.apiKey}}}',
    });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'parseur',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api.parseur.com`,
      '/rest/pingRelativeURI': '/parser',
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      inputType: 'password',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'API Token Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
