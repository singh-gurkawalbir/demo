export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'trinet',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': `v1/manage-company/${
      formValues['/http/unencrypted/companyId']
    }/org-details`,
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.trinet.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'apikey',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.companyId': {
      id: 'http.unencrypted.companyId',
      label: 'Company ID',
      type: 'text',
      helpText: 'Please reach out to TriNet support team for company Id.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
      helpText:
        'Please reach out to TriNet support team for API key. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.unencrypted.companyId', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
