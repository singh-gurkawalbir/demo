export default {
  preSave: formValues => ({
    ...formValues,
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/type': 'http',
    '/assistant': 'pdffiller',
    '/http/baseURI': 'https://api.pdffiller.com/v2',
    '/http/auth/oauth/authURI': 'https://developers.pdffiller.com/api_access',
    '/http/auth/oauth/tokenURI': 'https://api.pdffiller.com/v2/oauth/token',
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
