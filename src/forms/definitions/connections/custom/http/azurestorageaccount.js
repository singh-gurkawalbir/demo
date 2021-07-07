export default {
  preSave: formValues => {
    const retValues = {...formValues};

    return ({
      ...retValues,
      '/type': 'http',
      '/assistant': 'azurestorageaccount',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/http/unencrypted/storageAccount']}.blob.core.windows.net/`,
      '/http/auth/type': 'oauth',
      '/http/auth/failStatusCode': 403,
      '/http/auth/oauth/authURI': `https://login.microsoftonline.com/${formValues['/http/unencrypted/tenantId']}/oauth2/v2.0/authorize`,
      '/http/auth/oauth/tokenURI': `https://login.microsoftonline.com/${formValues['/http/unencrypted/tenantId']}/oauth2/v2.0/token`,
      '/http/auth/oauth/scope': [
        `https://${formValues['/http/unencrypted/storageAccount']}.blob.core.windows.net/user_impersonation`,
        'offline_access',
      ],
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/auth/oauth/accessTokenPath': 'access_token',
      '/http/auth/oauth/grantType': 'authorizecode',
      '/http/auth/oauth/accessTokenHeaders': [
        {
          name: 'Content-Type',
          value: 'application/x-www-form-urlencoded',
        },
      ],
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
    });
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.storageAccount': {
      id: 'http.unencrypted.storageAccount',
      type: 'text',
      label: 'Storage Account Name',
      required: true,
    },
    'http.unencrypted.tenantId': {
      id: 'http.unencrypted.tenantId',
      type: 'text',
      label: 'Tenant ID',
      required: true,
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
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.storageAccount', 'http.unencrypted.tenantId', 'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
