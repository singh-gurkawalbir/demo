export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'postmark',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.postmarkapp.com/`,
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
      label: 'Server Token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.accountToken': {
      id: 'http.encrypted.accountToken',
      label: 'Account Token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.encrypted.serverToken',
      'http.encrypted.accountToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
