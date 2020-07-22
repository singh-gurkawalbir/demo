export default {
  preSave: formValues => ({
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
      helpKey: 'tsheets.connection.http.auth.basic.username',
      label: 'Account sid',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Auth token',
      helpKey: 'tsheets.connection.http.auth.basic.password',
      defaultValue: '',
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
        fields: ['http.auth.basic.username', 'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
