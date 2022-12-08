export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/provider'] = newValues['/oauth2/clientId']
      ? 'custom_oauth2'
      : 'amazonmws';
    if (newValues['/oauth2/scheme'] === 'Custom') {
      newValues['/oauth2/scheme'] = newValues['/oauth2/customAuthScheme'];
    }
    if (!newValues['/oauth2/failPath']) {
      newValues['/oauth2/failValues'] = undefined;
    }

    delete newValues['/oauth2/customAuthScheme'];
    delete newValues['/oauth2/callbackURL'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    provider: { fieldId: 'provider' },
    'oauth2.grantType': { fieldId: 'oauth2.grantType' },
    'oauth2.clientCredentialsLocation': { fieldId: 'oauth2.clientCredentialsLocation' },
    'oauth2.auth.uri': { fieldId: 'oauth2.auth.uri' },
    'oauth2.callbackURL': { fieldId: 'oauth2.callbackURL' },
    'oauth2.token.uri': { fieldId: 'oauth2.token.uri' },
    'oauth2.revoke.uri': { fieldId: 'oauth2.revoke.uri' },
    'oauth2.clientId': { fieldId: 'oauth2.clientId' },
    'oauth2.clientSecret': { fieldId: 'oauth2.clientSecret' },
    'amazonmws.accessKeyId': { fieldId: 'amazonmws.accessKeyId' },
    'amazonmws.secretKey': { fieldId: 'amazonmws.secretKey' },
    oauthOverrides: {
      formId: 'oauthOverrides',
    },
    oauthToken: {
      formId: 'oauthToken',
    },
    'oauth2.failStatusCode': { fieldId: 'oauth2.failStatusCode' },
    'oauth2.failPath': { fieldId: 'oauth2.failPath' },
    'oauth2.failValues': { fieldId: 'oauth2.failValues' },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'provider',
        ],
      },
      {
        collapsed: true,
        label: 'Configure OAuth 2.0',
        fields: [
          'oauth2.clientId',
          'oauth2.clientSecret',
          'amazonmws.accessKeyId',
          'amazonmws.secretKey',
          'oauth2.grantType',
          'oauth2.clientCredentialsLocation',
          'oauth2.auth.uri',
          'oauth2.callbackURL',
          'oauth2.token.uri',
          'oauth2.revoke.uri',
        ],
      },
      {
        collapsed: true,
        label: 'OAuth 2.0 overrides',
        fields: [
          'oauthOverrides',
        ],
      },
      {
        collapsed: true,
        label: 'Configure token auth',
        fields: [
          'oauthToken',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: [
          'oauth2.failStatusCode',
          'oauth2.failPath',
          'oauth2.failValues',
        ],
      },
    ],
  },
};

