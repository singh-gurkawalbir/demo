export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'eventbrite',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v3/users/me/',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/baseURI': 'https://www.eventbriteapi.com',
    '/http/auth/oauth/authURI': 'https://www.eventbrite.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://www.eventbrite.com/oauth/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/location': 'header',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
