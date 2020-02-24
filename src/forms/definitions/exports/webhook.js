export default {
  preSave: formValues => ({ ...formValues, '/type': 'webhook' }),
  optionsHandler: (fieldId, fields) => {
    const webHookProviderField =
      fields.find(field => field.id === 'webhook.provider') || {};

    if (fieldId === 'sampleData') {
      const webHookUrlField = fields.find(field => field.id === 'webhook.url');

      return {
        webHookUrl: webHookUrlField.value,
        webHookProvider: webHookProviderField.value,
      };
    }

    if (fieldId === 'webhook.url') {
      const webHookTokenField = fields.find(
        field => field.id === 'webhook.token'
      );

      return {
        webHookToken: webHookTokenField.value,
        webHookProvider: webHookProviderField.value,
      };
    }

    if (fieldId === 'webhook.token') {
      return { webHookProvider: webHookProviderField.value };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    security: { fieldId: 'security', type: 'labeltitle', label: 'Security' },
    publicURL: {
      fieldId: 'publicURL',
      type: 'labeltitle',
      label: 'Public URL & Sample Data',
    },
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
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'security',
      // 'webhook.provider',
      'webhook.verify',
      'webhook.algorithm',
      'webhook.encoding',
      'webhook.key',
      'webhook.header',
      'webhook.token',
      'webhook.path',
      'webhook.username',
      'webhook.password',
      'publicURL',
      'webhook.url',
      'webhook.sampledata',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
