import { updatePGPFormValues } from '../../../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updatePGPFormValues(formValues);

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'box',
      '/http/auth/type': 'oauth',
      '/http/auth/failStatusCode': 403,
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.box.com/2.0/',
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/oauth/authURI': 'https://account.box.com/api/oauth2/authorize',
      '/http/auth/oauth/tokenURI': 'https://api.box.com/oauth2/token',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/auth/token/refreshRelativeURI': 'https://api.box.com/oauth2/token',
      '/http/auth/oauth/grantType': 'authorizecode',
      '/http/auth/oauth/clientCredentialsLocation': 'body',
      '/http/auth/oauth/accessTokenPath': 'access_token',
      '/http/auth/oauth/useIClientFields': false,
      '/http/auth/oauth/accessTokenHeaders': [
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded',
        },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'root_readwrite',
        'root_readonly',
        'manage_managed_users',
        'manage_app_users',
        'manage_groups',
        'manage_webhook',
        'manage_enterprise_properties',
        'manage_data_retention',
        'sign_requests.readwrite',
      ],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    fileAdvanced: {formId: 'fileAdvanced'},
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      {
        collapsed: true,
        label: 'Configure your client id and secret',
        fields: ['http.auth.oauth.callbackURL', 'http._iClientId', 'http.auth.oauth.scope'],
      },
      { collapsed: true, label: 'Advanced', fields: ['fileAdvanced', 'httpAdvanced'] },
    ],
  },
};
