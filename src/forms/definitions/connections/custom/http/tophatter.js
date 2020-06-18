export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tophatter',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/products.json',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://tophatter.com/merchant_api/v1',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'access_token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Access token',
      defaultValue: '',
      required: true,
      helpKey: 'tophatter.connection.http.auth.token.token',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
