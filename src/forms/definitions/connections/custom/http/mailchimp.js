export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailchimp',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/mailchimpDataCenter']
    }.api.mailchimp.com`,
    '/http/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://login.mailchimp.com/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://login.mailchimp.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.mailchimpDataCenter',
      type: 'text',
      label: 'Data Center:',
      helpText:
        'The Data Center name provided by Mailchimp. Click Save & Authorize to open up the Mailchimp login screen where you can enter your username and password to establish the connection with your Mailchimp account.',
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
            baseUri.indexOf('.api.mailchimp.com')
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
