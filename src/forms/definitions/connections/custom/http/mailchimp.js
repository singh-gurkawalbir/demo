export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailchimp',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/mailchimpDataCenter']
    }.api.mailchimp.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://login.mailchimp.com/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://login.mailchimp.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.mailchimpDataCenter': {
      id: 'http.mailchimpDataCenter',
      type: 'text',
      label: 'Data Center',
      required: true,
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.mailchimpDataCenter'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
