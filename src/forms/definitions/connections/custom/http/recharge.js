export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'recharge',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'customers',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.rechargeapps.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Recharge-Access-Token',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'recharge.connection.http.auth.token.token',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
