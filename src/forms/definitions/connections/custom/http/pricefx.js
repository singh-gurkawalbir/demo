export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pricefx',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/unencrypted/baseurl']}/pricefx/${formValues['/http/unencrypted/partition']}`,
    '/http/ping/relativeURI': '/ping',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Authorization',
        value:
          "Basic {{{base64Encode  (join ':' (join '/' connection.http.unencrypted.partition connection.http.unencrypted.username) connection.http.encrypted.password)}}}",
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.baseurl': {
      id: 'http.unencrypted.baseurl',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/pricefx',
      label: 'Base URL',
      required: true,
      helpKey: 'pricefx.connection.http.unencrypted.baseurl',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const baseurl =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('/pricefx')
          );

        return baseurl;
      },
    },
    'http.unencrypted.partition': {
      fieldId: 'http.unencrypted.partition',
      type: 'text',
      label: 'Partition',
      required: true,
      helpKey: 'pricefx.connection.http.unencrypted.partition',
    },
    'http.unencrypted.username': {
      fieldId: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'pricefx.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      fieldId: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      required: true,
      helpKey: 'pricefx.connection.http.encrypted.password',
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
        fields: [
          'http.unencrypted.baseurl',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.unencrypted.partition'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

