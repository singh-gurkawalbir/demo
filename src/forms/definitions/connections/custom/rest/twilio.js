export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'twilio',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': 'https://api.twilio.com',
    '/rest/pingRelativeURI': '/2010-04-01/Accounts',
    '/rest/pingMethod': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The Account Sid of your Twilio account.',
      label: 'Account Sid:',
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The token of your Twilio account.',
      label: 'Auth Token:',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.basicAuth.username', 'rest.basicAuth.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
