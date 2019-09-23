export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'twilio',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://api.twilio.com',
    '/http/ping/relativeURI': '/2010-04-01/Accounts',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'The Account Sid of your Twilio account.',
      label: 'Account Sid',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The token of your Twilio account.',
      label: 'Auth Token',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.username', 'http.auth.basic.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
