export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'solidcommerce',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'xml',
    '/http/ping/relativeURI': `/GetAllCompanyLists?appKey=${
      formValues['/http/encrypted/appKey']
    }&xslUri=&securityKey=${
      formValues['/http/encrypted/securityKey']
    }&includeWarehouses=True`,
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://upsprodwebservices.upsefulfillment.com/ws.asmx`,
    '/http/encrypted/securityKey': encodeURIComponent(
      formValues['/http/encrypted/securityKey']
    ),
    '/http/auth/ping/successPath':
      '/LiquidateDirect/GetAllCompanyLists/DateTime',
    '/http/auth/ping/errorPath': '/LiquidateDirect/Error/ErrorText',
    '/http/headers': [
      { name: 'Content-Type', value: 'application/x-www-form-urlencoded' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.securityKey': {
      id: 'http.encrypted.securityKey',
      label: 'Security Key',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText: 'Enter your Solid Commerce Developer Key or Security Key here.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.appKey': {
      id: 'http.encrypted.appKey',
      label: 'Application Key',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Application Key is generated at https://www.upsefulfillment.com, under Marketplaces --> Marketplaces Setup --> Web Services.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.securityKey', 'http.encrypted.appKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
