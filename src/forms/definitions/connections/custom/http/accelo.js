export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'accelo',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com`,
    '/http/auth/oauth/authURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/acceloSubdomain']
    }.api.accelo.com/oauth2/v0/token`,
    '/http/auth/oauth/scopeDelimiter': ',',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.acceloSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api.accelo.com',
      label: 'Subdomain',
      helpText:
        'Please enter your subdomain here which you configured in Deployment Information page while signing up for your new Accelo account.',
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
            baseUri.indexOf('.api.accelo.com')
          );

        return subdomain;
      },
    },
    {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['read(all)', 'write(all)'],
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
