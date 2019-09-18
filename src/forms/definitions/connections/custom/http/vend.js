export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'vend',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://'${formValues['http/subdomain']}.vendhq.com`,
    '/http/auth/oauth/authURI': 'https://secure.vendhq.com/connect',
    '/http/auth/oauth/tokenURI': `https://'${
      formValues['http/subdomain']
    }.vendhq.com/api/1.0/token`,
    '/http/auth/oauth/accessTokenPath': 'access_token',
  }),

  fields: [
    { fieldId: 'name' },
    {
      id: 'http.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.vendhq.com',
      label: 'Subdomain:',
      helpText:
        "Please enter your SharePoint subdomain. For example, in https://temp-portal.sharepoint.com 'temp-portal' is the subdomain.",
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
            baseUri.indexOf('.vendhq.com')
          );

        return subdomain;
      },
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
