export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'recurly',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'xml',
    '/http/ping/relativeURI': '/v2/accounts',
    '/http/auth/basic/password': '',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/recurly/subdomain']}.recurly.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'recurly.subdomain': {
      fieldId: 'recurly.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.recurly.com',
      label: 'Enter subdomain into the base uri',
      required: true,
      helpText:
        'Please enter your subdomain here which you configured while activating your new Recurly account.',
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
            baseUri.indexOf('.recurly.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      defaultValue: '',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. You can go to Integrations >> API Credentials to find it.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'recurly.subdomain', 'http.auth.basic.username'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
