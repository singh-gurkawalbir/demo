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
    '/http/auth/oauth/useIClientFields': false,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    genericOauthConnector: {
      formId: 'genericOauthConnector',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['genericOauthConnector'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
