export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'clio',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://app.clio.com/',
    '/http/auth/oauth/authURI': 'https://app.clio.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://app.clio.com/oauth/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
