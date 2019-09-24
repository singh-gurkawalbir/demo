export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'namely',
    '/http/auth/type': 'token',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/namelyCompanyName']
    }.namely.com`,
    '/http/ping/relativeURI': '/api/v1/profiles/me.json',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Accept',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.namelyCompanyName': {
      id: 'http.namelyCompanyName',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.namely.com',
      label: 'Company Name',
      helpText: 'Your subdomain. For example, https://mysubdomain.namely.com',
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
            baseUri.indexOf('.namely.com')
          );

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Personal Access Token',
      required: true,
      helpText:
        'The personal access token of your account on namely. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Personal Access Token safe. This can be obtained from the Settings section and Personal Access Token subsection.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.namelyCompanyName', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
