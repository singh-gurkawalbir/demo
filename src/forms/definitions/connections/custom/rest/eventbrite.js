export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'eventbrite',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/rest/baseURI': 'https://www.eventbriteapi.com',
    '/rest/authURI': 'https://www.eventbrite.com/oauth/authorize',
    '/rest/oauthTokenURI': 'https://www.eventbrite.com/oauth/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/tokenLocation': 'header',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
