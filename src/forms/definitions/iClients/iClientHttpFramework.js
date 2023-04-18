import { applicationsList } from '../../../constants/applications';
import { updateIclientMetadataWithHttpFramework } from '../../../sagas/utils';

export default {
  init: (fieldMeta, resource, flow, httpConnectorData) => updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, false),
  preSave: (formValues, resource) => {
    const newValues = { ...formValues };
    const applications = applicationsList();
    const app = applications.find(a => a.id === resource?.application) || {};

    newValues['/provider'] = 'custom_oauth2';
    if (newValues['/oauth2/scheme'] === 'Custom') {
      newValues['/oauth2/scheme'] = newValues['/oauth2/customAuthScheme'];
    }
    if (!newValues['/oauth2/failPath']) {
      newValues['/oauth2/failValues'] = undefined;
    }

    delete newValues['/oauth2/customAuthScheme'];
    delete newValues['/oauth2/callbackURL'];
    if (app?._httpConnectorId) {
      newValues['/_httpConnectorId'] = app._httpConnectorId;
    } else if (resource?._httpConnectorId) {
      newValues['/_httpConnectorId'] = resource._httpConnectorId;
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    provider: { fieldId: 'provider', visible: false },
    iclientFormView: {
      isLoggable: true,
      id: 'iclientFormView',
      type: 'iclientFormView',
      label: 'Form view',
      required: true,
      visible: true,
      resourceType: 'iclients',
      defaultValue: r => {
        if (!r) return 'false';
        if (!r.assistant) return 'false';
        if (!r.formType) return 'false';

        return r?.formType === 'assistant' ? 'false' : 'true';
      },
      helpKey: 'formView',
    },
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
    'oauth2.failValues': { fieldId: 'oauth2.failValues' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: [
          'name',
          'provider',
          'oauth2.clientId',
          'oauth2.clientSecret',
        ],
      },
    ],
  },
};

