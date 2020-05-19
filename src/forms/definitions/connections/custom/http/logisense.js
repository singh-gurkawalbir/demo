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
      '/http/auth/type': 'token',
      '/http/mediaType': 'urlencoded',
      '/http/baseURI': `https://${formValues['/storeURL']}`,
      '/http/ping/relativeURI': '/ResourceServer/api/v1/Account',
      '/http/ping/method': 'GET',
      '/http/disableStrictSSL': `${formValues['/environment']}` === 'sandbox',
      '/http/auth/token/location': 'header',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/headerName': 'Authorization',
      '/http/headers': [{ name: 'Accept', value: 'application/json' }],
      '/http/auth/token/refreshRelativeURI': `https://${
        formValues['/storeURL']
      }/AuthorizationServer/Access/Login`,
      '/http/auth/token/refreshBody': JSON.stringify(pingData),
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Account type',
      helpKey: 'logisense.connection.environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const disableStrictSSL = r && r.http && r.http.disableStrictSSL;

        if (disableStrictSSL) {
          if (disableStrictSSL === true) {
            return 'sandbox';
          }

          return 'production';
        }
      },
    },
    storeURL: {
      id: 'storeURL',
      startAdornment: 'https://',
      type: 'text',
      label: 'Store URL',
      required: true,
      helpKey: 'logisense.connection.storeURL',
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
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
        { field: 'http.encrypted.clientId', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'storeURL',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.encrypted.clientId',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
