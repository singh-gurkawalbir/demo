export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'greenhouse',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/candidates',
    '/rest/baseURI': `https://harvest.greenhouse.io/v1`,
    '/rest/headers': [
      {
        name: 'On-Behalf-Of',
        value: '{{{connection.rest.unencrypted.userID}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      { name: 'Accept', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText:
        'Please enter your API token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe. You can go to Configure >> Dev Center >> API Credential Management and from there, you can create a Harvest API key and choose which endpoints it may access.',
      inputType: 'password',
      label: 'API Token',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    'rest.unencrypted.userID': {
      type: 'text',
      id: 'rest.unencrypted.userID',
      label: 'User ID:',
      helpText:
        'Please enter the Greenhouse user id used for integration here. This is required by Greenhouse for auditing purposes for all write requests and can be obtained by using List Users API.',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.basicAuth.username', 'rest.unencrypted.userID'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
