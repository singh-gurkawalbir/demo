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
      helpKey: 'twilio.accountSid',
      label: 'Account Sid:',
    },
    {
      fieldId: '/rest/basicAuth/password',
      helpKey: 'twilio.authToken',
      inputType: 'password',
      label: 'Auth Token:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
