export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pulseway',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/systems',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'pulseway.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'pulseway.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.baseURI',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
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
