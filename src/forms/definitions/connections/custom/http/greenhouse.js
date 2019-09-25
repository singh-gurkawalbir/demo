export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'greenhouse',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/candidates',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://harvest.greenhouse.io/v1`,
    '/http/headers': [
      {
        name: 'On-Behalf-Of',
        value: '{{{connection.http.unencrypted.userID}}}',
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
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText:
        'Please enter your API token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe. You can go to Configure >> Dev Center >> API Credential Management and from there, you can create a Harvest API key and choose which endpoints it may access.',
      inputType: 'password',
      defaultValue: '',
      label: 'API Token',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    'http.unencrypted.userID': {
      type: 'text',
      id: 'http.unencrypted.userID',
      label: 'User ID',
      helpText:
        'Please enter the Greenhouse user id used for integration here. This is required by Greenhouse for auditing purposes for all write requests and can be obtained by using List Users API.',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.username', 'http.unencrypted.userID'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
