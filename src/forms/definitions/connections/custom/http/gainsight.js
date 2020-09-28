export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'gainsight',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/gainsightinstanceurl']
    }.com`,
    '/http/ping/relativeURI': '/v1.0/api/people',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Accesskey',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.gainsightinstanceurl': {
      id: 'http.gainsightinstanceurl',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.com',
      label: 'Instance URI',
      required: true,
      helpKey: 'gainsight.connection.http.gainsightinstanceurl',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
            baseUri &&
            baseUri.substring(
              baseUri.indexOf('https://') + 8,
              baseUri.indexOf('.com')
            );

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'gainsight.connection.http.auth.token.token',
      label: 'API key',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Application details', fields: ['http.gainsightinstanceurl', 'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

