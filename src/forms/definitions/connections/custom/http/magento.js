export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'magento',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `${formValues['/http/baseURI']}/`,
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
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.baseURI',
      helpText: 'The Base URI of Magento.',
    },
    {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    {
      id: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.username',
          is: [''],
        },
        {
          field: 'http.encrypted.password',
          is: [''],
        },
        {
          field: 'http.baseURI',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Magento account.',
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
