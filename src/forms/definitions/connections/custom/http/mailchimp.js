export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailchimp',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
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
    '/http/ping/relativeURI': '/3.0/campaigns',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.mailchimpDataCenter': {
      id: 'http.mailchimpDataCenter',
      type: 'text',
      label: 'Data center',
      required: true,
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
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.mailchimpDataCenter'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
