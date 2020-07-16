export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'solidcommerce',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'urlencoded',
    '/http/successMediaType': 'xml',
    '/http/ping/relativeURI': '/GetAllCompanyLists',
    '/http/ping/method': 'POST',
    '/http/baseURI': 'https://upsprodwebservices.upsefulfillment.com/ws.asmx',
    '/http/ping/successPath': '/LiquidateDirect/GetAllCompanyLists/DateTime',
    '/http/ping/errorPath': '/LiquidateDirect/Error/ErrorText',
    '/http/ping/body': '{"xslUri":"","appKey":"{{{connection.http.encrypted.appKey}}}","securityKey":"{{{connection.http.encrypted.securityKey}}}","includeWarehouses":"True"}',
    '/http/headers': [
      { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
    ],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/token/refreshHeaders': [
      { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.securityKey': {
      id: 'http.encrypted.securityKey',
      label: 'Security key',
      type: 'text',
      helpKey: 'solidcommerce.connection.http.encrypted.securityKey',
      inputType: 'password',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.appKey': {
      id: 'http.encrypted.appKey',
      label: 'Application key',
      type: 'text',
      inputType: 'password',
      required: true,
      helpKey: 'solidcommerce.connection.http.encrypted.appKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
        fields: ['http.encrypted.securityKey', 'http.encrypted.appKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
