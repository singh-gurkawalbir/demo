export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'confluencecloud',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/unencrypted/instanceURL']}/wiki/rest/api`,
    '/http/ping/relativeURI': '/content',
    '/http/ping/method': 'GET',

  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.instanceURL': {
      id: 'http.unencrypted.instanceURL',
      type: 'text',
      label: 'Instance URL',
      startAdornment: 'https://',
      endAdornment: '/wiki',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      required: true,
      helpKey: 'confluencecloud.connection.http.unencrypted.instanceURL',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'confluencecloud.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API token',
      helpKey: 'confluencecloud.connection.http.auth.basic.password',
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
          'http.unencrypted.instanceURL',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
