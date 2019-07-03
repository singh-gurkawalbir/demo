export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'mailchimp',
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
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
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
