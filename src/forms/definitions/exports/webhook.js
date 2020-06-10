export default {
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
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: ['common'],
    type: 'collapse',
    containers: [
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
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
