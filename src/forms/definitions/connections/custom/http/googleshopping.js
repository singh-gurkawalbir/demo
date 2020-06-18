export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'googleshopping',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://www.googleapis.com/',
    '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/scope': ['https://www.googleapis.com/auth/content'],
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
