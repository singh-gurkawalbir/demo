export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'urlencoded',
      '/rest/baseURI': 'https://api.twilio.com',
      '/rest/pingRelativeURI': '/2010-04-01/Accounts',
      '/type': 'rest',
      '/assistant': 'twilio',
      '/rest/pingMethod': 'GET',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    { fieldId: 'name' },
    {
      id: 'Username',
      name: '/rest/basicAuth/username',
      helpKey: 'connection.rest.basicAuth.username',
      type: 'text',
      label: 'Account Sid:',
      defaultValue: r =>
        r && r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
      required: true,
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      type: 'text',
      inputType: 'password',
      label: 'Auth Token:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
