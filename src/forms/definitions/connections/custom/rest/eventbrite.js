export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/type': 'rest',
    '/assistant': 'eventbrite',
    '/rest/baseURI': 'https://www.eventbriteapi.com',
    '/rest/authURI': 'https://www.eventbrite.com/oauth/authorize',
    '/rest/oauthTokenURI': 'https://www.eventbrite.com/oauth/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/tokenLocation': 'header',
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'API Key:',
    },
  ],
};
