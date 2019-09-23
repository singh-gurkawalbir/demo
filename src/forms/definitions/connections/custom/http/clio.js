export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'clio',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://app.clio.com/`,
    '/http/auth/oauth/authURI': 'https://app.clio.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://app.clio.com/oauth/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
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
