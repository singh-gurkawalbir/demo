export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'intercom',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.intercom.io/`,
    '/http/auth/oauth/authURI': 'https://app.intercom.io/oauth',
    '/http/auth/oauth/tokenURI': 'https://api.intercom.io/auth/eagle/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
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
