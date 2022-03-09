export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'segment',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.segment.io/v1',
    '/http/ping/relativeURI': '/identify',
    '/http/ping/method': 'POST',
    '/http/ping/body': '{"userId": "TestCeligoUser","traits": {"name": "Test celigo user","industry": "Technology"},"context": {"ip": "24.5.68.47"},"timestamp": "{{{dateFormat \'YYYY-MM-DDTHH:mm:ssZ\'}}}"}',
    '/http/headers': [
      {
        name: 'Authorization',
        value: 'Basic {{{base64Encode (join ":" connection.http.encrypted.writeKey "")}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.writeKey': {
      id: 'http.encrypted.writeKey',
      required: true,
      type: 'text',
      label: 'Write key',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'segment.connection.http.encrypted.writeKey',
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
        fields: ['http.encrypted.writeKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

