import { updatePGPFormValues } from '../../../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updatePGPFormValues(formValues);

    return {
      ...newValues,
      '/type': 'http',
      '/assistant': 'dropbox',
      '/http/auth/type': 'oauth',
      '/http/auth/failStatusCode': 403,
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.dropboxapi.com/2/',
      '/http/auth/oauth/useIClientFields': false,
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/revoke/uri': 'https://api.dropboxapi.com/2/auth/token/revoke',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/auth/oauth/grantType': 'authorizecode',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/auth/oauth/authURI': 'https://www.dropbox.com/oauth2/authorize',
      '/http/auth/oauth/tokenURI': 'https://api.dropboxapi.com/oauth2/token',
      '/http/auth/oauth/clientCredentialsLocation': 'body',
      '/http/auth/oauth/accessTokenPath': 'access_token',
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
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'account_info.read', 'files.metadata.read', 'files.metadata.write', 'files.content.write', 'files.content.read', 'file_requests.write', 'file_requests.read',
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
        fields: ['http._iClientId', 'http.auth.oauth.scope'],
      },
      { collapsed: true, label: 'Advanced', fields: ['fileAdvanced', 'httpAdvanced'] },
    ],
  },
};
