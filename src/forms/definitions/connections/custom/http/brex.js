export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'brex',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://platform.${formValues['/http/unencrypted/accountType'] === 'staging' ? 'staging.brexapps' : 'brexapis'
    }.com`,
    '/http/ping/relativeURI': '/v2/users',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.accountType': {
      id: 'http.unencrypted.accountType',
      type: 'select',
      label: 'Account Type',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
          ],
        },
      ],
      helpKey: 'brex.connection.http.unencrypted.accountType',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API token',
      required: true,
      helpKey: 'brex.connection.http.auth.token.token',
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
      {
        collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.accountType', 'http.auth.token.token'],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
