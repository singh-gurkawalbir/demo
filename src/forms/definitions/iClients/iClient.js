import { applicationsList } from '../../../constants/applications';
import { CONNECTORS_TO_IGNORE } from '../../../constants';
import customCloneDeep from '../../../utils/customCloneDeep';
import { updateIclientMetadataWithHttpFramework } from '../../../sagas/utils';
import { isNewId } from '../../../utils/resource';

export default {
  init: (fieldMeta, resource, flow, httpConnectorData) => {
    const applications = applicationsList().filter(app => !CONNECTORS_TO_IGNORE.includes(app.id));
    let app;

    if (resource?.assistant) {
      // create new iclient for connection where resourceId is missing also for http1.0
      app = applications.find(a => a.id === resource.assistant) || {};
    } else if (httpConnectorData?._id && resource?._id && !isNewId(resource?._id) && resource?._httpConnectorId) {
      // edit iclient for connection
      app = applications.find(a => a._httpConnectorId === resource?._httpConnectorId) || {};
    } else if ((isNewId(resource?._id) && !resource?.assistant) || (resource?._id && resource?.application) || (resource?._id && !resource?.assistant && !resource?._httpConnectorId)) {
      // recource-> iclient create and edit case
      return updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, true);
    }
    if (app?.assistant && !app?._httpConnectorId) {
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
    if (app?._httpConnectorId || resource?._httpConnectorId) {
      return updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, true);
    }

    return fieldMeta;
  },
  preSave: (formValues, resource, options) => {
    let newValues = { ...formValues };
    const applications = applicationsList();
    const app = applications.find(a => (a.id === resource?.application || a.name?.toLowerCase().replace(/\.|\s/g, '') === resource?.application)) || {};

    if (newValues['/oauth2/scheme'] === 'Custom') {
      newValues['/oauth2/scheme'] = newValues['/oauth2/customAuthScheme'];
    }
    if (!newValues['/oauth2/failPath']) {
      newValues['/oauth2/failValues'] = undefined;
    }

    delete newValues['/oauth2/customAuthScheme'];
    delete newValues['/oauth2/callbackURL'];
    if (resource?._httpConnectorId || resource?.http?._httpConnectorId) {
      newValues = updateIclientMetadataWithHttpFramework(newValues, resource, options?.httpConnector);
    }
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
    application: {
      fieldId: 'application',
      isLoggable: true,
      type: 'iclientSelect',
      label: 'Application',
      options: [],
    },
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
    'oauth2.grantType': { fieldId: 'oauth2.grantType'},
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
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'provider',
          'application',
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

