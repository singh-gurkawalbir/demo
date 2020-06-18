export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'surveymonkey',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.surveymonkey.com',
    '/http/auth/oauth/authURI': 'https://api.surveymonkey.com/oauth/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.surveymonkey.com/oauth/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    genericOauthConnector: {
      formId: 'genericOauthConnector',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'genericOauthConnector'],
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
