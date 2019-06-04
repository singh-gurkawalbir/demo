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
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'greenhouse',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/candidates',
      '/rest/baseURI': `https://harvest.greenhouse.io/v1`,
      '/rest/headers': headers,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'apiToken',
      name: '/rest/basicAuth/username',
      type: 'text',
      inputType: 'password',
      label: 'API Token',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    {
      id: 'userId',
      type: 'text',
      name: '/rest/unencrypted/userID',
      label: 'Only numbers are allowed.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\d]+$',
          message: 'Only numbers allowed',
        },
      },
      defaultValue: r =>
        r && r.rest && r.rest.unencrypted && r.rest.unencrypted.userID,
    },
  ],
};
