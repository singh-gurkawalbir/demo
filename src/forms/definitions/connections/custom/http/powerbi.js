export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'powerbi',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.powerbi.com`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.adminUser': {
      id: 'http.unencrypted.adminUser',
      label: 'Admin User:',
      type: 'checkbox',
      helpText:
        'Please check this if you are The Power BI Service Administrator. The Power BI Service Administrator role can be assigned to users who should have access to the Power BI Admin Portal without also granting them other Office 365 administrative access.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.unencrypted.adminUser'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
