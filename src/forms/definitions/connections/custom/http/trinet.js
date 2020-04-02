export default {
  preSave: formValues => ({
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
      required: true,
      type: 'text',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
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
