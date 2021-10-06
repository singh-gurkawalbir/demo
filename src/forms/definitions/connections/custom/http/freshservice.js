export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'freshservice',
    '/http/auth/type': 'Basic',
    '/http/baseURI': `https://${
      formValues['/http/unencrypted/subdomain']}.freshservice.com/api/v2`,
    '/http/ping/relativeURI': '/tickets',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
    '/http/auth/basic/password': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.subdomain': {
      fieldId: 'http.unencrypted.subdomain',
      startAdornment: 'https://',
      endAdornment: '.freshservice.com',
      type: 'text',
      label: 'Subdomain',
      helpKey: 'freshservice.connection.http.unencrypted.subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'freshservice.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Password',
      visible: false,
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
          'http.unencrypted.subdomain',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
