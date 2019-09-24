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
      helpText:
        'The subdomain of your chargify account. For example, https://mysubdomain.chargify.com.',
      endAdornment: '.chargify.com',
      label: 'Enter subdomain into the base uri',
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
      label: 'API Key',
      inputType: 'password',
      helpText: 'The API key of your Chargify account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.chargifySubdomain', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
