import { applicationsList } from '../../../constants/applications';
import { CONNECTORS_TO_IGNORE } from '../../../constants';
import customCloneDeep from '../../../utils/customCloneDeep';

export default {
  init: (fieldMeta, resource, flow, httpConnectorData, application) => {
    const applications = applicationsList().filter(app => !CONNECTORS_TO_IGNORE.includes(app.id));
    const app = applications.find(a => a.name === application) || {};

    if (app.assistant && !app._httpConnectorId) {
      // pure assistant without http2.0
      // should use old iClient form
      const finalFieldMeta = {
        fieldMap: {},
      };

      Object.keys(fieldMeta.fieldMap).forEach(key => {
        if (key === 'name' ||
          key === 'oauth2.clientId' ||
          key === 'oauth2.clientSecret' ||
          key === 'amazonmws.accessKeyId' ||
          key === 'amazonmws.secretKey') {
          finalFieldMeta.fieldMap[key] = customCloneDeep(fieldMeta.fieldMap[key]);
        }
      });

      finalFieldMeta.layout = {
        type: 'box',
        containers: [
          {
            fields: [
              'name',
              'oauth2.clientId',
              'oauth2.clientSecret',
              'amazonmws.accessKeyId',
              'amazonmws.secretKey',
            ],
          },
        ],
      };

      return finalFieldMeta;
    }

    return fieldMeta;
  },
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/provider'] = newValues['/oauth2/clientId']
      ? 'custom_oauth2'
      : 'amazonmws';
    if (newValues['/oauth2/scheme'] === 'Custom') {
      newValues['/oauth2/scheme'] = newValues['/oauth2/customAuthScheme'];
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
    'oauth2.validDomainNames': { fieldId: 'oauth2.validDomainNames' },
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
    'oauth2.failValues': {
      fieldId: 'oauth2.failValues',
      removeWhen: [{ field: 'oauth2.failPath', is: [false] }],
    },
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
          'oauth2.validDomainNames',
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

