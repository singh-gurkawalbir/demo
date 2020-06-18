export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'joor',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v2/style?count=100',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? 'sandbox' : ''
    }.jooraccess.com/`,
    '/http/headers': [
      {
        name: 'Authorization',
        value: 'OAuth2 {{{base64Encode connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpKey: 'joor.connection.environment',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API token',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'joor.connection.http.encrypted.apiKey',
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
        fields: ['environment', 'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
