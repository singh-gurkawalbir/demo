export default {
  preSave: formValues => {
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.refreshTokenBody.user': {
      id: 'http.refreshTokenBody.user',
      type: 'text',
      helpKey: 'jet.connection.http.refreshTokenBody.user',
      label: 'API user',
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
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'jet.connection.http.encrypted.password',
      label: 'Secret key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
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
        fields: ['http.refreshTokenBody.user', 'http.encrypted.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
