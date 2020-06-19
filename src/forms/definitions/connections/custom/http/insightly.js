export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'insightly',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v2.1/Contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.insight.ly',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'insightly.connection.http.auth.basic.username',
      inputType: 'password',
      defaultValue: '',
      label: 'API key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
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
        fields: ['http.auth.basic.username'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
