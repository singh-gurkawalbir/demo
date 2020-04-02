export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tableau',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/myServer']
    }.online.tableau.com/api/2.7/sites/${
      formValues['/http/unencrypted/siteId']
    }`,
    '/http/auth/token/location': 'header',
    '/http/ping/relativeURI': '/groups',
    '/http/ping/method': 'GET',
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
      label: 'My Server',
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
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      defaultValue: '',
    },
    'http.unencrypted.contentUrl': {
      id: 'http.unencrypted.contentUrl',
      required: true,
      type: 'text',
      label: 'Content URL',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.userName', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
    },
    'http.unencrypted.siteId': {
      id: 'http.unencrypted.siteId',
      type: 'text',
      label: 'Site ID',
      defaultValue: '',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.myServer',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.unencrypted.contentUrl',
      'http.auth.token.token',
      'http.unencrypted.siteId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
