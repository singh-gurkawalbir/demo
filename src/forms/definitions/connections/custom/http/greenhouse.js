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
