export default {
  preSave: formValues => ({ ...formValues, '/type': 'webhook' }),
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'sampleData') {
      const webHookUrlField = fields.find(field => field.id === 'webhook.url');
      const webHookProviderField = fields.find(
        field => field.id === 'webhook.provider'
      );

      return {
        url: webHookUrlField.value,
        provider: webHookProviderField.value,
      };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    security: { fieldId: 'security', type: 'labeltitle', label: 'Security' },
    'webhook.provider': { fieldId: 'webhook.provider' },
    'webhook.verify': { fieldId: 'webhook.verify' },
    'webhook.algorithm': { fieldId: 'webhook.algorithm' },
    'webhook.encoding': { fieldId: 'webhook.encoding' },
    'webhook.key': { fieldId: 'webhook.key' },
    'webhook.header': { fieldId: 'webhook.header' },
    'webhook.token': { fieldId: 'webhook.token' },
    'webhook.url': { fieldId: 'webhook.url' },
    'webhook.path': { fieldId: 'webhook.path' },
    'webhook.username': { fieldId: 'webhook.username' },
    'webhook.password': { fieldId: 'webhook.password' },
    'webhook.sampledata': {
      fieldId: 'webhook.sampledata',
      refreshOptionsOnChangesTo: ['webhook.url'],
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'security',
      'webhook.provider',
      'webhook.verify',
      'webhook.algorithm',
      'webhook.encoding',
      'webhook.key',
      'webhook.header',
      'webhook.token',
      'webhook.url',
      'webhook.path',
      'webhook.username',
      'webhook.password',
      'webhook.sampledata',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
