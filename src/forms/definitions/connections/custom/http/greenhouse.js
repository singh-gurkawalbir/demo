export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'greenhouse',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/candidates',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://harvest.greenhouse.io/v1',
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
      helpKey: 'greenhouse.connection.http.auth.basic.username',
      inputType: 'password',
      defaultValue: '',
      label: 'API token',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    'http.unencrypted.userID': {
      type: 'text',
      id: 'http.unencrypted.userID',
      label: 'User ID',
      helpKey: 'greenhouse.connection.http.unencrypted.userID',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.basic.username', 'http.unencrypted.userID'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
