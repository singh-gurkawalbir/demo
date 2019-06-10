export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': 'https://api.twilio.com',
    '/rest/pingRelativeURI': '/2010-04-01/Accounts',
    '/type': 'rest',
    '/assistant': 'twilio',
    '/rest/pingMethod': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The Account Sid of your Twilio account.',
      label: 'Account Sid:',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The token of your Twilio account.',
      label: 'Auth Token:',
    },
  ],
};
