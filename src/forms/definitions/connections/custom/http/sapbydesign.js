export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sapbydesign',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/sap/byd/odata',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/unencrypted/tenantHostname']}`,
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
    'http.unencrypted.tenantHostname': {
      id: 'http.unencrypted.tenantHostname',
      startAdornment: 'https://',
      type: 'text',
      label: 'Tenant hostname',
      helpKey: 'sapbydesign.connection.http.unencrypted.tenantHostname',
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
          baseUri.substring(baseUri.indexOf('https://') + 8);

        return subdomain;
      },
    },
    application: {
      fieldId: 'application',
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
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'sapbydesign.connection.http.encrypted.password',
    },
    'http.unencrypted.apiType': {
      id: 'http.unencrypted.apiType',
      type: 'radiogroup',
      label: 'Mode',
      helpKey: 'sapbydesign.connection.http.unencrypted.apiType',
      required: true,
      options: [
        {
          items: [
            { label: 'SOAP API', value: 'soap' },
            { label: 'OData', value: 'odata' },
          ],
        },
      ],
      defaultValue: r => (r?.http?.unencrypted?.apiType) || 'odata',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.tenantHostname',
          'http.unencrypted.username',
          'http.encrypted.password', 'http.unencrypted.apiType'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
