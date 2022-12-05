
export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };
    const apiType = formValues['/http/unencrypted/apiType'];

    if (apiType === 'api') {
      retValues['/http/baseURI'] = `https://api.businesscentral.dynamics.com/v2.0/${
        formValues['/http/unencrypted/environmentName']
      }/api`;
      retValues['/http/ping/relativeURI'] = '/v1.0/companies';
    } else {
      retValues['/http/baseURI'] = 'https://api.businesscentral.dynamics.com';
      retValues['/http/ping/relativeURI'] = `/v2.0/${formValues['/http/unencrypted/environmentName']}/api/v1.0/companies`;
    }
    if (
      resource &&
      !resource._connectorId &&
      resource.http &&
      resource.http._iClientId
    ) {
      retValues['/http/_iClientId'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'microsoftbusinesscentral',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
      '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
      '/http/auth/failStatusCode': 500,
      '/http/auth/failPath': 'error.message',
      '/http/auth/failValues': [
        'The SAML2 token is not valid because its validity period has ended.',
      ],
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.apiType': {
      id: 'http.unencrypted.apiType',
      type: 'select',
      label: 'Web services',
      helpKey: 'microsoftbusinesscentral.connection.http.unencrypted.apiType',
      required: true,
      options: [
        {
          items: [
            { label: 'API', value: 'api' },
            { label: 'OData', value: 'odata' },
          ],
        },
      ],
      defaultValue: r => {
        if (r?.http?.unencrypted?.apiType) {
          return r.http.unencrypted.apiType;
        }
        const baseUri = r?.http?.baseURI;

        if (baseUri && !baseUri.endsWith('/api')) {
          return 'odata';
        }

        return 'api';
      },
    },
    'http.unencrypted.environmentName': {
      type: 'text',
      id: 'http.unencrypted.environmentName',
      helpKey: 'microsoftbuisnesscentral.connection.http.unencrypted.environmentName',
      label: 'Environment name',
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
        fields: ['http.unencrypted.apiType', 'http.unencrypted.environmentName'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
