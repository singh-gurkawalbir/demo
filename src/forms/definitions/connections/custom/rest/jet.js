export default {
  preSubmit: formValues => {
    const refreshTokenBody = {};

    refreshTokenBody.pass = '{{{connection.rest.encrypted.password}}}';
    refreshTokenBody.user = formValues['rest.refreshTokenBody.user'];

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'jet',
      '/rest/authType': 'token',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/orders/created',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://merchant-api.jet.com/api`,
      '/rest/refreshTokenPath': `id_token`,
      '/rest/refreshTokenMethod': `POST`,
      '/rest/refreshTokenURI': `https://merchant-api.jet.com/api/token`,
      '/rest/refreshTokenMediaType': `json`,
      '/rest/refreshTokenBody': JSON.stringify(refreshTokenBody),
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.refreshTokenBody.user',
      type: 'text',
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
      type: 'text',
      inputType: 'password',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'Secret Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
