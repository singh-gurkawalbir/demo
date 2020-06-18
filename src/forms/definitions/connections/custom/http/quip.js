export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'quip',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://platform.quip.com',
    '/http/ping/relativeURI': '/1/threads/recent',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API access token',
      helpKey: 'quip.connection.http.auth.token.token',
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
