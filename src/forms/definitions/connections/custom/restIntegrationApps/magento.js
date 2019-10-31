export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'magento',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `${formValues['/rest/baseURI']}/`,
    '/rest/tokenLocation': 'header',
    '/rest/authScheme': 'Bearer',
    '/rest/authHeader': 'Authorization',
    '/rest/pingMethod': 'GET',
    '/rest/pingRelativeURI': '/V1/modules',
    '/rest/refreshTokenURI': `${
      formValues['/rest/baseURI']
    }/V1/integration/admin/token`,
    '/rest/refreshTokenBody':
      '{"username":"{{{connection.http.auth.basic.username}}}", "password":"{{{connection.http.auth.basic.password}}}"}',
    '/rest/refreshTokenMethod': 'POST',
    '/rest/refreshTokenMediaType': 'json',
    '/rest/refreshTokenHeaders': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.baseURI': {
      fieldId: 'rest.baseURI',
      helpText: 'The Base URI of Magento.',
    },
    'rest.unencrypted.username': {
      id: 'rest.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    'rest.encrypted.password': {
      id: 'rest.encrypted.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe.',
      required: true,
    },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'rest.unencrypted.username', is: [''] },
        { field: 'rest.encrypted.password', is: [''] },
        { field: 'rest.baseURI', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
      required: true,
      helpText: 'The access token of your Magento account.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.baseURI',
      'rest.unencrypted.username',
      'rest.encrypted.password',
      'rest.bearerToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
