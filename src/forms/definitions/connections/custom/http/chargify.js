export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'chargify',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'customers.json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${
      formValues['/http/chargifySubdomain']
    }.chargify.com`,
    '/http/headers': [
      {
        name: 'Authorization',
        value:
          'Basic {{{base64Encode (join ":" connection.http.encrypted.apiKey "x")}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.chargifySubdomain': {
      type: 'text',
      id: 'http.chargifySubdomain',
      startAdornment: 'https://',
      endAdornment: '.chargify.com',
      label: 'Subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.chargify.com')
          );

        return subdomain;
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      defaultValue: '',
      type: 'text',
      label: 'API key',
      inputType: 'password',
      helpKey: 'chargify.connection.http.encrypted.apiKey',
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
        fields: ['http.chargifySubdomain', 'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
