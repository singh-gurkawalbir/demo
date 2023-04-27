import { isJsonString, safeParse } from '../../../utils/string';
import {
  updateWebhookFinalMetadataWithHttpFramework,
} from '../../../sagas/utils';

export default {
  init: (fieldMeta, resource, flow, httpConnector) => updateWebhookFinalMetadataWithHttpFramework(fieldMeta, httpConnector, resource),

  validationHandler: field => {
    // Used to validate sampleData field
    // Incase of invalid json throws error to be shown on the field
    if (field && field.id === 'sampleData') {
      if (
        field.value &&
        typeof field.value === 'string' &&
        !isJsonString(field.value)
      ) return 'Sample Data must be a valid JSON';
    }
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId !== 'webhook.successBody') {
      return null;
    }

    const successMediaTypeField = fields.find(field => field.fieldId === 'webhook.successMediaType');

    return {
      contentType: successMediaTypeField.value || 'json',
    };
  },
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (retValues['/webhook/verify'] === 'token') {
      retValues['/webhook/token'] = retValues['/webhook/generateToken'];
    }

    if (retValues['/webhook/provider'] === 'integratorio') {
      retValues['/webhook/provider'] = 'integrator-extension';
    }

    if (resource && resource.webhook && resource.webhook.provider === 'slack') {
      retValues['/webhook/key'] = retValues['/webhook/slackKey'];
    }

    delete retValues['/webhook/generateToken'];
    delete retValues['/webhook/slackKey'];
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    // 'webhook.provider': { fieldId: 'webhook.provider' },
    'webhook.verify': { fieldId: 'webhook.verify' },
    'webhook.algorithm': { fieldId: 'webhook.algorithm' },
    'webhook.encoding': { fieldId: 'webhook.encoding' },
    'webhook.key': { fieldId: 'webhook.key' },
    'webhook.header': { fieldId: 'webhook.header' },
    'webhook.token': {
      fieldId: 'webhook.token',
      refreshOptionsOnChangesTo: ['webhook.provider'],
    },
    'webhook.generateToken': {
      fieldId: 'webhook.generateToken',
    },
    'webhook.slackKey': {
      fieldId: 'webhook.slackKey',
    },
    'webhook.url': {
      fieldId: 'webhook.url',
      refreshOptionsOnChangesTo: ['webhook.provider', 'webhook.token'],
    },
    'webhook.path': { fieldId: 'webhook.path' },
    'webhook.username': { fieldId: 'webhook.username' },
    'webhook.password': { fieldId: 'webhook.password' },
    'webhook.sampledata': {
      fieldId: 'webhook.sampledata',
      sampleData: r => r && r.sampleData,
    },
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
    skipRetries: { fieldId: 'skipRetries' },
    traceKeyTemplate: {
      fieldId: 'traceKeyTemplate',
    },
    'webhook.successStatusCode': {
      fieldId: 'webhook.successStatusCode',
    },
    'webhook.successMediaType': {
      fieldId: 'webhook.successMediaType',
    },
    'webhook.successBody': {
      fieldId: 'webhook.successBody',
    },
    mockOutput: {fieldId: 'mockOutput'},
    'webhook._httpConnectorId': {
      id: 'webhook._httpConnectorId',
      type: 'text',
      visible: false,
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common'],
      },
      {
        collapsed: true,
        label: 'Secure the listener',
        fields: [
          'webhook.verify',
          'webhook.algorithm',
          'webhook.encoding',
          'webhook.key',
          'webhook.slackKey',
          'webhook.header',
          'webhook.token',
          'webhook.generateToken',
          'webhook.path',
          'webhook.username',
          'webhook.password',
          'webhook._httpConnectorId',
        ],
      },
      {
        collapsed: true,
        label: 'Generate URL & sample data',
        fields: ['webhook.url', 'webhook.sampledata'],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'webhook.successStatusCode',
          'webhook.successMediaType',
          'webhook.successBody',
          'pageSize',
          'dataURITemplate',
          'skipRetries',
          'traceKeyTemplate',
        ],
      },
    ],
  },
};
