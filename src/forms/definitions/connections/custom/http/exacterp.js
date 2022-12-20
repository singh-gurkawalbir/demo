export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'exacterp',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/v1/current/Me',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://start.exactonline.com',
    '/http/auth/oauth/authURI': 'https://start.exactonline.com/api/oauth2/auth',
    '/http/auth/oauth/tokenURI':
      'https://start.exactonline.com/api/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/location': 'header',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
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
