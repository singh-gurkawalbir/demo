export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'coupa',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/accounts',
    '/rest/baseURI': `https://${
      formValues['/rest/coupaSubdomain']
    }.coupacloud.com/api`,
    '/rest/pingMethod': 'GET',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'X-COUPA-API-KEY',
    '/rest/authScheme': ' ',
    '/rest/headers': [
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
      id: 'rest.coupaSubdomain',
      startAdornment: 'https://',
      helpText:
        'Please enter the subdomain of your account here which can be obtained from the login url.',
      endAdornment: '.coupacloud.com',
      label: 'Subdomain',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
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
      label: 'API Key',
      helpText: 'Please enter API Key of your Coupa account',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
