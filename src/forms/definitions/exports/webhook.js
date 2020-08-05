import { isJsonString } from '../../../utils/string';

export default {
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
    if (fieldId === 'sampleData') {
      const webHookUrlField = fields.find(field => field.id === 'webhook.url');

      return {
        webHookUrl: webHookUrlField.value,
      };
    }

    if (fieldId === 'webhook.url') {
      const webHookTokenField = fields.find(
        field => field.id === 'webhook.token'
      );

      return {
        webHookToken: webHookTokenField.value,
      };
    }

    return null;
  },
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (retValues['/webhook/verify'] === 'token') {
      retValues['/webhook/token'] = retValues['/webhook/generateToken'];
    }

    if (resource && resource.webhook && resource.webhook.provider === 'slack') {
      retValues['/webhook/key'] = retValues['/webhook/slackKey'];
    }

    delete retValues['/webhook/generateToken'];
    delete retValues['/webhook/slackKey'];

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
      refreshOptionsOnChangesTo: ['webhook.url', 'webhook.provider'],
    },
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
    skipRetries: { fieldId: 'skipRetries' },
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
        ],
      },
      {
        collapsed: true,
        label: 'Generate URL & sample data',
        fields: ['webhook.url', 'webhook.sampledata'],
      },
      { collapsed: true, label: 'Advanced', fields: ['pageSize', 'dataURITemplate', 'skipRetries'] },
    ],
  },
};
