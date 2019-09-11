export default {
  preSubmit: formValues => {
    const refreshTokenBody = {};

    refreshTokenBody.pass = '{{{connection.http.encrypted.password}}}';
    refreshTokenBody.user = formValues['/http/refreshTokenBody/user'];

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'jet',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/orders/created',
      '/http/ping/method': 'GET',
      '/http/baseURI': 'https://merchant-api.jet.com/api',
      '/http/auth/token/refreshTokenPath': 'id_token',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshRelativeURI':
        'https://merchant-api.jet.com/api/token',
      '/http/auth/token/refreshMediaType': 'json',
      '/http/auth/token/refreshBody': JSON.stringify(refreshTokenBody),
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.refreshTokenBody.user',
      type: 'text',
      helpText:
        'API User Key available from Jet under API Section-> Get API Keys', // Secret Key available from Jet under API Section-> Get API Keys
      label: 'API User:',
      required: true,
      defaultValue: r => {
        let toReturn = '';

        try {
          toReturn = JSON.parse(r.http.refreshTokenBody);
          toReturn = toReturn.user;
        } catch (e) {
          toReturn = '';
        }

        return toReturn;
      },
    },
    {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'Secret Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
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
