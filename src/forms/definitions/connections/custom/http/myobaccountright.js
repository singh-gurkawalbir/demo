export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'myobaccountright',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://ar1.api.myob.com/accountright/',
    '/http/auth/oauth/authURI':
      'https://secure.myob.com/oauth2/account/authorize',
    '/http/auth/oauth/tokenURI': 'https://secure.myob.com/oauth2/v1/authorize',
    '/http/auth/oauth/scopeDelimiter': '',
    '/http/auth/oauth/scope': ['CompanyFile'],
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/headers': [
      { name: 'x-myobapi-version', value: 'v2' },
      {
        name: 'x-myobapi-cftoken',
        value: window.btoa('Administrator:'),
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
