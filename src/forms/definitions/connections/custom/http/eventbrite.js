export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'eventbrite',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/listings/active',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://www.eventbriteapi.com',
    '/http/auth/oauth/authURI': 'https://www.eventbrite.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://www.eventbrite.com/oauth/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/location': 'header',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
