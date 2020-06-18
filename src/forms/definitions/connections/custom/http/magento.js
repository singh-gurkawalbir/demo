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
      helpKey: 'magento.connection.http.baseURI',
      required: true,
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      helpKey: 'magento.connection.http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      helpKey: 'magento.connection.http.encrypted.password',
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
      label: 'Generate token',
      defaultValue: '',
      required: true,
      helpKey: 'magento.connection.http.auth.token.token',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.baseURI',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
