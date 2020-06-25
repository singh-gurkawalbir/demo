export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': '3plcentral',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://secure-wms.com/',
    '/http/ping/relativeURI': 'orders',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/oauth/grantType': 'clientcredentials',
    '/http/auth/oauth/clientCredentialsLocation': 'basicauthheader',
    '/http/auth/oauth/tokenURI': 'https://secure-wms.com/AuthServer/api/Token',
    '/http/auth/oauth/accessTokenBody': `{"grant_type": "client_credentials","tpl":"{${
      formValues['/http/unencrypted/tpl']
    }}", "user_login_id":"${formValues['/http/unencrypted/userLoginId']}"}`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.tpl': {
      id: 'http.unencrypted.tpl',
      type: 'text',
      label: '3PL GUID',
      required: true,
      helpKey: '3plcentral.connection.http.unencrypted.tpl',
      defaultValue: '',
    },
    'http.unencrypted.userLoginId': {
      id: 'http.unencrypted.userLoginId',
      type: 'text',
      label: 'UserLogin id',
      helpKey: '3plcentral.connection.http.unencrypted.userLoginId',
      required: true,
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
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
        fields: ['http.unencrypted.tpl',
          'http.unencrypted.userLoginId',
          'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
