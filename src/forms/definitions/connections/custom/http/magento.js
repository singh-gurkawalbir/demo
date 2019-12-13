export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'magento',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `${formValues['/http/baseURI']}`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/V1/modules',
    '/http/auth/token/refreshRelativeURI': `${
      formValues['/http/baseURI']
    }/V1/integration/admin/token`,
    '/http/auth/token/refreshBody':
      '{"username":"{{{connection.http.auth.basic.username}}}", "password":"{{{connection.http.auth.basic.password}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      helpText: 'The Base URI of Magento 2.',
      required: true,
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe.',
      required: true,
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
        { field: 'http.baseURI', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
      required: true,
      helpText: 'The access token of your Magento 2 account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.baseURI',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
