export default {
  preSave: formValues => {
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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.refreshTokenBody.user': {
      id: 'rest.refreshTokenBody.user',
      type: 'text',
      helpText:
        'API User Key available from Jet under API Section-> Get API Keys',
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
    'rest.encrypted.password': {
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
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.refreshTokenBody.user', 'rest.encrypted.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
