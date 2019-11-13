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
      helpText:
        'Please enter your server name here which you configured while signing up for a new Tableau account.',
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
      helpText: 'Please enter the User Id/Email of your Tableau Account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      defaultValue: '',
      helpText:
        'Please enter password of your Tableau Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },
    'http.unencrypted.contentUrl': {
      id: 'http.unencrypted.contentUrl',
      required: true,
      type: 'text',
      label: 'Content URL',
      helpText:
        'The content URL is the value that in the server environment is referred to as the Site ID.',
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
      helpText: 'The access token of your Tableau account.',
    },
    'http.unencrypted.siteId': {
      id: 'http.unencrypted.siteId',
      type: 'text',
      label: 'Site ID',
      defaultValue: '',
      helpText: 'The Site ID of your Tableau account.',
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
