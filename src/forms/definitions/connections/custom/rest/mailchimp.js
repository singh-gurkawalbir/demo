export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'mailchimp',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${
      formValues['/toReturn.rest.mailchimpDataCenter']
    }.api.mailchimp.com`,
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://login.mailchimp.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://login.mailchimp.com/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.mailchimpDataCenter',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api.mailchimp.com',
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
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.api.mailchimp.com')
        );

        return subdomain;
      },
    },
  ],
};
