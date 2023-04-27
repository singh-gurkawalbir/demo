import { CONNECTORS_TO_IGNORE } from '../../../constants';
import { applicationsList } from '../../../constants/applications';
import { updateIclientMetadataWithHttpFramework } from '../../../sagas/utils';
import { isNewId } from '../../../utils/resource';

export default {
  // init: (fieldMeta, resource, flow, httpConnectorData) => updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, false),
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
      return updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, false);
    }
    if (app?._httpConnectorId || resource?._httpConnectorId) {
      return updateIclientMetadataWithHttpFramework(fieldMeta, resource, flow, httpConnectorData, false);
    }

    return fieldMeta;
  },
  preSave: (formValues, resource) => {
    const newValues = { ...formValues };
    const applications = applicationsList();

    const app = applications.find(a => a.id === (resource?.application || resource?.assistant)) || {};

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
    application: {
      fieldId: 'application',
      isLoggable: true,
      type: 'iclientSelect',
      label: 'Application',
      options: [],
      visible: false,
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
    'oauth2.grantType': { fieldId: 'oauth2.grantType', visible: false},
    'oauth2.clientCredentialsLocation': { fieldId: 'oauth2.clientCredentialsLocation', visible: false },
    'oauth2.auth.uri': { fieldId: 'oauth2.auth.uri', visible: false },
    'oauth2.callbackURL': { fieldId: 'oauth2.callbackURL', visible: false },
    'oauth2.token.uri': { fieldId: 'oauth2.token.uri', visible: false },
    'oauth2.revoke.uri': { fieldId: 'oauth2.revoke.uri', visible: false },
    'oauth2.validDomainNames': { fieldId: 'oauth2.validDomainNames', visible: false },
    'oauth2.clientId': { fieldId: 'oauth2.clientId' },
    'oauth2.clientSecret': { fieldId: 'oauth2.clientSecret' },
    'amazonmws.accessKeyId': { fieldId: 'amazonmws.accessKeyId', visible: false },
    'amazonmws.secretKey': { fieldId: 'amazonmws.secretKey', visible: false },
    'oauth2.scopeDelimiter': {
      fieldId: 'oauth2.scopeDelimiter',
      visible: false,
    },
    'oauth2.token.headers': {
      fieldId: 'oauth2.token.headers',
      visible: false,
    },
    'oauth2.token.body': {
      fieldId: 'oauth2.token.body',
      visible: false,
    },
    'oauth2.refresh.headers': {
      fieldId: 'oauth2.refresh.headers',
      visible: false,
    },
    'oauth2.refresh.body': {
      fieldId: 'oauth2.refresh.body',
      visible: false,
    },
    'oauth2.revoke.headers': {
      fieldId: 'oauth2.revoke.headers',
      visible: false,
    },
    'oauth2.revoke.body': {
      fieldId: 'oauth2.revoke.body',
      visible: false,
    },
    'oauth2.accessTokenLocation': {
      fieldId: 'oauth2.accessTokenLocation',
      visible: false,
    },
    'oauth2.accessTokenHeaderName': {
      fieldId: 'oauth2.accessTokenHeaderName',
      visible: false,
    },
    'oauth2.scheme': {
      fieldId: 'oauth2.scheme',
      visible: false,
    },
    'oauth2.customAuthScheme': {
      id: 'oauth2.customAuthScheme',
      type: 'text',
      label: 'Custom auth scheme',
      visible: false,
      required: true,
      defaultValue: r => {
        if (!r?.oauth2?.scheme) return '';
        // custom auth scheme gets saved in 'scheme' field
        if (['Bearer', 'MAC', ' '].includes(r.oauth2.scheme)) return '';

        return r.oauth2.scheme;
      },
    },
    'oauth2.accessTokenParamName': {
      fieldId: 'oauth2.accessTokenParamName',
      visible: false,
    },
    'oauth2.failStatusCode': { fieldId: 'oauth2.failStatusCode', visible: false },
    'oauth2.failPath': { fieldId: 'oauth2.failPath', visible: false },
    'oauth2.failValues': { fieldId: 'oauth2.failValues', visible: false },
  },
  layout: {
    type: 'boxWrapper',
    containers: [
      {
        fields: [
          'name',
          'oauth2.clientId',
          'oauth2.clientSecret',
          'provider',
          'application',
          'amazonmws.accessKeyId',
          'amazonmws.secretKey',
          'oauth2.grantType',
          'oauth2.clientCredentialsLocation',
          'oauth2.auth.uri',
          'oauth2.callbackURL',
          'oauth2.token.uri',
          'oauth2.revoke.uri',
          'oauth2.validDomainNames',
          'oauth2.scopeDelimiter',
          'oauth2.token.headers',
          'oauth2.token.body',
          'oauth2.refresh.headers',
          'oauth2.refresh.body',
          'oauth2.revoke.headers',
          'oauth2.revoke.body',
          'oauth2.accessTokenLocation',
          'oauth2.accessTokenHeaderName',
          'oauth2.scheme',
          'oauth2.customAuthScheme',
          'oauth2.accessTokenParamName',
          'oauth2.failStatusCode',
          'oauth2.failPath',
          'oauth2.failValues',
        ],
      },
    ],
  },
};

