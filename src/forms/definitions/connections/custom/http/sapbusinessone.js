export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sapbusinessone',
    '/http/auth/type': 'cookie',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/unencrypted/serverNameOrIP']}:${formValues['/http/unencrypted/port']}/b1s/v1/`,
    '/http/ping/relativeURI': '/BusinessPartners',
    '/http/auth/cookie/method': 'POST',
    '/http/auth/cookie/uri': `https://${formValues['/http/unencrypted/serverNameOrIP']}:${formValues['/http/unencrypted/port']}/b1s/v1/Login`,
    '/http/ping/method': 'GET',
    '/http/auth/cookie/body': '{"CompanyDB": "{{{connection.http.unencrypted.companyDataBase}}}", "UserName": "{{{connection.http.unencrypted.userName}}}","Password": "{{{connection.http.encrypted.password}}}" }',

  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.serverNameOrIP': {
      id: 'http.unencrypted.serverNameOrIP',
      type: 'text',
      label: 'Server name/IP',
      required: true,
      helpKey: 'sapbusinessone.connection.http.unencrypted.serverNameOrIP',
    },
    'http.unencrypted.port': {
      id: 'http.unencrypted.port',
      type: 'text',
      label: 'Port',
      required: true,
      helpKey: 'sapbusinessone.connection.http.unencrypted.port',
    },
    'http.unencrypted.companyDataBase': {
      id: 'http.unencrypted.companyDataBase',
      type: 'text',
      label: 'Company DataBase',
      required: true,
      helpKey: 'sapbusinessone.connection.http.unencrypted.companyDataBase',
    },
    'http.unencrypted.userName': {
      id: 'http.unencrypted.userName',
      type: 'text',
      label: 'User Name',
      required: true,
      helpKey: 'sapbusinessone.connection.http.unencrypted.userName',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      label: 'Password',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'sapbusinessone.connection.http.encrypted.password',
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
        fields: [
          'http.unencrypted.serverNameOrIP',
          'http.unencrypted.port',
          'http.unencrypted.companyDataBase',
          'http.unencrypted.userName',
          'http.encrypted.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

