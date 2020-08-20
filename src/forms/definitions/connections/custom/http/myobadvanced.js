export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'myobadvanced',
    '/http/auth/type': 'cookie',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/instanceURI']}/entity/${
      formValues['/http/unencrypted/endpointName']
    }/${formValues['/http/unencrypted/endpointVersion']}`,
    '/http/ping/method': 'GET',
    '/http/auth/cookie/method': 'POST',
    '/http/auth/cookie/successStatusCode': '204',
    '/http/ping/relativeURI': '/Customer',
    '/http/auth/cookie/uri': `https://${
      formValues['/instanceURI']
    }/entity/auth/login`,
    '/http/auth/cookie/body': `{"name": "${
      formValues['/http/unencrypted/username']
    }","password": "${formValues['/http/encrypted/password']}","company": "${
      formValues['/http/unencrypted/company']
    }","locale":"${
      formValues['/http/unencrypted/locale']
    }"}`,
    '/http/encrypted/cookieString': '',
    '/http/auth/token/token': '',
    '/http/headers': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    instanceURI: {
      id: 'instanceURI',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/entity',
      label: 'Instance URI',
      required: true,
      helpKey: 'myobadvanced.connection.instanceURI',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('/entity')
          );

        return subdomain;
      },
    },
    'http.unencrypted.endpointName': {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      helpKey: 'myobadvanced.connection.http.unencrypted.endpointName',
      label: 'Endpoint name',
      required: true,
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointName) ||
        'Default',
    },
    'http.unencrypted.endpointVersion': {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      helpKey: 'myobadvanced.connection.http.unencrypted.endpointVersion',
      label: 'Endpoint version',
      required: true,
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointVersion) ||
        '18.200.001',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'myobadvanced.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      helpKey: 'myobadvanced.connection.http.encrypted.password',
    },
    'http.unencrypted.company': {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      defaultValue: '',
      helpKey: 'myobadvanced.connection.http.unencrypted.company',
    },
    'http.unencrypted.locale': {
      id: 'http.unencrypted.locale',
      type: 'text',
      label: 'Locale',
      helpKey: 'myobadvanced.connection.http.unencrypted.locale',
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
          'instanceURI',
          'http.unencrypted.endpointName',
          'http.unencrypted.endpointVersion',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.unencrypted.company',
          'http.unencrypted.locale'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
