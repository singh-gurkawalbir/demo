export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'On-Behalf-Of',
      value: '{{{connection.rest.unencrypted.userID}}}',
    });
    headers.push({
      name: 'Content-Type',
      value: 'application/json',
    });
    headers.push({ name: 'Accept', value: 'application/json' });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'greenhouse',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/candidates',
      '/rest/baseURI': `https://harvest.greenhouse.io/v1`,
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      helpKey: 'greenhouse.apiToken',
      inputType: 'password',
      label: 'API Token',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    {
      type: 'text',
      name: '/rest/unencrypted/userID',
      label: 'User ID:',
      helpKey: 'greenhouse.userId',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\d]+$',
          message: 'Only numbers allowed',
        },
      },
    },
  ],
};
