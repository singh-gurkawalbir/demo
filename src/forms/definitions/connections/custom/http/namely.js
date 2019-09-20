export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },
    {
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
    {
      fieldId: 'http.auth.token.token',
      label: 'Personal Access Token',
      required: true,
      helpText: 'The personal access token of your account on namely.',
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
