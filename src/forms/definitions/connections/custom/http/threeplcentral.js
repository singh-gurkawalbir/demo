export default {
  preSave: formValues => {
    let accessTokenBody = '';

    if (formValues['/http/unencrypted/tpl'] === 'true') {
      accessTokenBody = `{"grant_type": "client_credentials","tpl":"{${
        formValues['/http/unencrypted/tpl']
      }}", "user_login_id":"${formValues['/http/unencrypted/userLoginId']}"}`;
    } else {
      accessTokenBody = `{"grant_type": "client_credentials","user_login_id":"${formValues['/http/unencrypted/userLoginId']}"}`;
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': '3plcentral',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/baseURI': `${
        formValues['/environment'] === 'sandbox'
          ? 'https://box.secure-wms.com/'
          : 'https://secure-wms.com/'
      }`,
      '/http/ping/relativeURI': 'orders',
      '/http/ping/method': 'GET',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/auth/oauth/useIClientFields': false,
      '/http/auth/oauth/grantType': 'clientcredentials',
      '/http/auth/oauth/clientCredentialsLocation': 'basicauthheader',
      '/http/auth/oauth/tokenURI': `${
        formValues['/environment'] === 'sandbox'
          ? 'https://box.secure-wms.com/AuthServer/api/Token'
          : 'https://secure-wms.com/AuthServer/api/Token'
      }`,
      '/http/auth/oauth/accessTokenBody': accessTokenBody,
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      required: true,
      helpKey: '3plcentral.connection.environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.includes('box')) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.unencrypted.tpl': {
      id: 'http.unencrypted.tpl',
      type: 'text',
      label: '3PL GUID',
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
        fields: ['environment',
          'http.unencrypted.tpl',
          'http.unencrypted.userLoginId',
          'http._iClientId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
