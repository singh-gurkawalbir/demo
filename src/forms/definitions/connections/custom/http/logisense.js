export default {
  preSave: formValues => {
    const pingData = {
      username: formValues['/http/unencrypted/username'],
      password: formValues['/http/encrypted/password'],
      grant_type: 'password',
      client_id: formValues['/http/encrypted/clientId'],
    };

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'logisense',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'urlencoded',
      '/http/baseURI': `http://${formValues['/storeURL']}`,
      '/http/ping/relativeURI': '/ResourceServer/api/v1/Account',
      '/http/ping/method': 'POST',
      '/http/ping/body': JSON.stringify(pingData),
      '/http/headers': [{ name: 'Accept', value: 'application/json' }],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    storeURL: {
      id: 'storeURL',
      startAdornment: 'https://',
      type: 'text',
      label: 'Store URL',
      required: true,
      helpKey: 'logisense.connection.http.storeURL',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri && baseUri.substring(baseUri.indexOf('https://') + 8);

        return subdomain;
      },
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'logisense.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'logisense.connection.http.encrypted.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.clientId': {
      id: 'http.encrypted.clientId',
      type: 'text',
      label: 'Client ID',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'logisense.connection.http.encrypted.clientId',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'storeURL',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.encrypted.clientId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
