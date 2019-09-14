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
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'The Account Sid of your Twilio account.',
      label: 'Account Sid',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The token of your Twilio account.',
      label: 'Auth Token',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
