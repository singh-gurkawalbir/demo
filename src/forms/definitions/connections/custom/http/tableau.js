export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tableau',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/myServer']}.online.tableau.com/api/${formValues['/http/unencrypted/version']}/sites/${formValues['/http/unencrypted/siteId']}`,
    '/http/auth/token/location': 'header',
    '/http/ping/relativeURI': '/groups',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshRelativeURI': `https://${
      formValues['/http/myServer']}.online.tableau.com/api/2.7/auth/signin`,
    '/http/auth/token/refreshBody': '{"credentials": {"name":"{{{connection.http.auth.basic.username}}}", "password": "{{{connection.http.auth.basic.password}}}", "site": {"contentUrl": "{{{connection.http.unencrypted.contentUrl}}}"}} }',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshTokenPath': 'credentials.token',
    '/http/headers': [
      {
        name: 'X-Tableau-Auth',
        value: '{{{connection.http.auth.token.token}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      {
        name: 'accept',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.myServer': {
      id: 'http.myServer',
      startAdornment: 'https://',
      endAdornment: '.online.tableau.com/api',
      type: 'text',
      label: 'My server',
      helpKey: 'tableau.connection.http.myServer',
      required: true,
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.online.tableau.com/api')
          );

        return subdomain;
      },
    },
    'http.unencrypted.version': {
      id: 'http.unencrypted.version',
      type: 'text',
      label: 'API version',
      required: true,
      helpKey: 'tableau.connection.http.unencrypted.version',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        const versions =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('api/') + 4,
            baseUri.indexOf('/sites')
          );

        return versions || '3.10';
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'tableau.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'tableau.connection.http.auth.basic.password',
      defaultValue: '',
    },
    'http.unencrypted.contentUrl': {
      id: 'http.unencrypted.contentUrl',
      helpKey: 'tableau.connection.http.unencrypted.contentUrl',
      required: true,
      type: 'text',
      label: 'Content URL',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      helpKey: 'tableau.connection.http.auth.token.token',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.userName', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      defaultValue: '',
    },
    'http.unencrypted.siteId': {
      id: 'http.unencrypted.siteId',
      type: 'text',
      label: 'Site ID',
      defaultValue: '',
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
        fields: ['http.myServer',
          'http.unencrypted.version',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.unencrypted.contentUrl',
        ],
        type: 'indent',
        containers: [
          {
            fields: [
              'http.auth.token.token',
              'http.unencrypted.siteId'],
          },
        ] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
