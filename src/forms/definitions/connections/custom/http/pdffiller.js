export default {
  preSave: formValues => ({
    ...formValues,
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/type': 'http',
    '/assistant': 'pdffiller',
    '/http/baseURI': 'https://api.pdffiller.com/v2',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
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
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
