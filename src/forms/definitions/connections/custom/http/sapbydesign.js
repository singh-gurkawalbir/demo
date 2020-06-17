export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sapbydesign',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/sap/byd/odata/cust/v1/vmumaterial',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/storeURL']}.sapbydesign.com`,
    '/http/headers': [
      {
        name: 'Authorization',
        value:
          "Basic {{{base64Encode  (join ':' connection.http.unencrypted.username connection.http.encrypted.password)}}}",
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    storeURL: {
      id: 'storeURL',
      startAdornment: 'https://',
      endAdornment: '.sapbydesign.com',
      type: 'text',
      label: 'Store URL',
      helpKey: 'sapbydesign.connection.storeURL',
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
            baseUri.indexOf('.sapbydesign.com')
          );

        return subdomain;
      },
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpKey: 'sapbydesign.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      helpKey: 'sapbydesign.connection.http.encrypted.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'storeURL',
      'http.unencrypted.username',
      'http.encrypted.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
