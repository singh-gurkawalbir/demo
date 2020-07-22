export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'postmark',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.postmarkapp.com/',
    '/http/ping/relativeURI': '/servers?count=1&offset=0',
    '/http/headers': [
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'X-Postmark-Account-Token',
        value: '{{{connection.http.encrypted.accountToken}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.serverToken': {
      id: 'http.encrypted.serverToken',
      label: 'Server token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.accountToken': {
      id: 'http.encrypted.accountToken',
      label: 'Account token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.encrypted.serverToken',
          'http.encrypted.accountToken'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
