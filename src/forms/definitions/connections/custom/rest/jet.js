export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'insightly',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/v2.1/Contacts',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.insight.ly`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.refreshTokenBody.user',
      helpText:
        'API User Key available from Jet under API Section-> Get API Keys', // Secret Key available from Jet under API Section-> Get API Keys
      label: 'API User:',
      required: true,
      defaultValue: r => {
        let toReturn = '';

        try {
          toReturn = JSON.parse(r.rest.refreshTokenBody);
          toReturn = toReturn.user;
        } catch (e) {
          toReturn = '';
        }

        return toReturn;
      },
    },
    {
      id: 'rest.encrypted.password',
      inputType: 'password',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'Secret Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
