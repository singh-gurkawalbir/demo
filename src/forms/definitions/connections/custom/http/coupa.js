export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'coupa',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/accounts',
    '/http/baseURI': `https://${
      formValues['/http/coupaSubdomain']
    }.coupacloud.com/api`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-COUPA-API-KEY',
    '/http/auth/token/scheme': ' ',
    '/http/headers': [
      {
        name: 'ACCEPT',
        value: 'application/json',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      id: 'http.coupaSubdomain',
      startAdornment: 'https://',
      helpText:
        'Please enter the subdomain of your account here which can be obtained from the login url.',
      endAdornment: '.coupacloud.com',
      label: 'Subdomain:',
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
            baseUri.indexOf('.coupacloud.com')
          );

        return subdomain;
      },
    },
    {
      fieldId: 'http.auth.token.token',
      label: 'API Key:',
      helpText: 'Please enter API Key of your Coupa account',
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
