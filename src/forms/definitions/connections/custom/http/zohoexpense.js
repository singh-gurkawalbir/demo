export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zohoexpense',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://expense.zoho.com/api/v1',
    '/http/ping/relativeURI': '/projects',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/oauth/grantType': 'authorizecode',
    '/http/auth/token/scheme': 'Zoho-oauthtoken',
    '/http/auth/oauth/authURI': 'https://accounts.zoho.com/oauth/v2/auth?access_type=offline&prompt=consent',
    '/http/auth/oauth/tokenURI': 'https://accounts.zoho.com/oauth/v2/token',
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/headers': [
      {
        name: 'X-com-zoho-expense-organizationid',
        value: '{{{connection.http.unencrypted.organizationID}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.organizationID': {
      id: 'http.unencrypted.organizationID',
      label: 'Organization ID',
      required: true,
      helpKey: 'zohoexpense.connection.http.unencrypted.organizationId',
      type: 'text',
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'zohoexpense.connection.http._iClientId',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'ZohoExpense.fullaccess.ALL',
        'ZohoExpense.expensereport.UPDATE',
        'ZohoExpense.expensereport.READ',
        'ZohoExpense.expensereport.CREATE',
        'ZohoExpense.expensereport.DELETE',
        'ZohoExpense.approval.CREATE',
        'ZohoExpense.reimbursement.CREATE',
        'ZohoExpense.advance.UPDATE',
        'ZohoExpense.advance.CREATE',
        'ZohoExpense.advance.DELETE',
        'ZohoExpense.users.UPDATE',
        'ZohoExpense.users.CREATE',
        'ZohoExpense.users.DELETE',
        'ZohoExpense.users.READ',
        'ZohoExpense.orgsettings.UPDATE',
        'ZohoExpense.orgsettings.CREATE',
        'ZohoExpense.orgsettings.DELETE',
        'ZohoExpense.orgsettings.READ',
      ],
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
        fields: ['http.unencrypted.organizationID',
          'http._iClientId',
          'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

