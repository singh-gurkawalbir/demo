export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'AnaplanAuthToken';
      retValues['/http/auth/token/refreshRelativeURI'] =
  'https://auth.anaplan.com/token/refresh';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/basic/username'] = undefined;
      retValues['/http/auth/basic/password'] = undefined;
      retValues['/http/auth/token/refreshTokenPath'] = 'tokenInfo.tokenValue';
      retValues['/http/auth/token/refreshHeaders'] = [
        {
          name: 'authorization',
          value: 'AnaplanAuthToken {{{connection.http.auth.token.token}}}',
        },
      ];
    } else {
      retValues['/http/auth/token/location'] = undefined;
      retValues['/http/auth/token/headerName'] = undefined;
      retValues['/http/auth/token/scheme'] = undefined;
      retValues['/http/auth/token/refreshRelativeURI'] = undefined;
      retValues['/http/auth/token/refreshMethod'] = undefined;
      retValues['/http/auth/token/refreshMediaType'] = undefined;
      retValues['/http/auth/token/refreshTokenPath'] = undefined;
      retValues['/http/auth/token/refreshHeaders'] = undefined;
      retValues['/http/unencrypted/username'] = undefined;
      retValues['/http/encrypted/password'] = undefined;
      retValues['/http/auth/token/token'] = undefined;
      delete ['/http/auth/token/token'];
    }
    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'anaplan',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/workspaces',
      '/http/ping/method': 'GET',
      '/http/baseURI': `https://api.anaplan.com${
        formValues['/http/auth/type'] === 'token' ? '/2/0' : '/1/3'
      }`,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      label: 'Authentication type',
      helpKey: 'anaplan.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'anaplan.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'anaplan.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.unencrypted.username': {
      fieldId: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'anaplan.connection.http.unencrypted.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.encrypted.password': {
      fieldId: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      defaultValue: '',
      required: true,
      helpKey: 'anaplan.connection.http.encrypted.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      label: 'Generate token',
      defaultValue: '',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.basic.username',
      'http.auth.basic.password',
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
