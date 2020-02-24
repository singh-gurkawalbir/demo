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
      formValues[`/http/unencrypted/tpl`]
    }}", "user_login_id":"${formValues[`/http/unencrypted/userLoginId`]}"}`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.tpl': {
      id: 'http.unencrypted.tpl',
      type: 'text',
      label: 'tpl guid',
      required: true,
      defaultValue: '',
      helpText:
        'Contact the 3PL Central Warehouse you are working with for this project and have them submit a request for REST API access to their 3PL Central Customer Success Manager.',
    },
    'http.unencrypted.userLoginId': {
      id: 'http.unencrypted.userLoginId',
      type: 'text',
      label: 'UserLogin ID',
      required: true,
      helpText:
        'Contact the 3PL Central Warehouse you are working with for this project and have them submit a request for REST API access to their 3PL Central Customer Success Manager.',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.tpl',
      'http.unencrypted.userLoginId',
      'http._iClientId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
