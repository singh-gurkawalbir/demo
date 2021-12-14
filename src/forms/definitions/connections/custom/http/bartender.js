export default {
  preSave: formValues => {
    const newValues = { ...formValues};

    if (newValues['/mode'] === 'cloud') {
      newValues['/_agentId'] = undefined;
    }

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'bartender',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/baseURI': `${formValues['/http/unencrypted/printPortalBaseURL']}/BarTender/api/v1`,
      '/http/auth/token/location': 'header',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/headerName': 'Authorization',
      '/http/ping/method': 'GET',
      '/http/ping/relativeURI': '/libraries',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'json',
      '/http/auth/token/refreshRelativeURI': `${formValues['/http/unencrypted/printPortalBaseURL']}/BarTender/api/v1/Authenticate`,
      '/http/auth/token/refreshBody': '{ "userName": "{{{connection.http.unencrypted.userName}}}", "password": "{{{connection.http.encrypted.password}}}" }',
      '/http/auth/token/refreshTokenPath': 'token',

    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    _agentId: {
      fieldId: '_agentId',
      required: true,
    },
    'http.unencrypted.printPortalBaseURL': {
      fieldId: 'http.unencrypted.printPortalBaseURL',
      type: 'text',
      label: 'Print portal Base URL',
      required: true,
      endAdornment: '/BarTender/api',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Base URL should not contain spaces.',
        },
      },
      helpKey: 'bartender.connection.http.unencrypted.printPortalBaseURL',
    },
    'http.unencrypted.userName': {
      id: 'http.unencrypted.userName',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'bartender.connection.http.unencrypted.userName',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      required: true,
      helpKey: 'bartender.connection.http.encrypted.password',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.printPortalBaseURL', is: [''] },
        { field: 'http.unencrypted.userName', is: [''] },
        { field: 'http.encrypted.password', is: [''] },

      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      defaultValue: '',
      required: true,
      helpKey: 'bartender.connection.http.auth.token.token',

    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', '_agentId'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.unencrypted.printPortalBaseURL',
          'http.unencrypted.userName',
          'http.encrypted.password',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

