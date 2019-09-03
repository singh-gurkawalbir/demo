export default {
  fields: [
    { formId: 'common' },
    { fieldId: 'security', type: 'labeltitle', label: 'Security' },
    { fieldId: 'webhook.provider' },
    { fieldId: 'webhook.verify' },
    { fieldId: 'webhook.algorithm' },
    { fieldId: 'webhook.encoding' },
    { fieldId: 'webhook.key' },
    { fieldId: 'webhook.header' },
    { fieldId: 'webhook.token' },
    { fieldId: 'webhook.path' },
    { fieldId: 'webhook.username' },
    { fieldId: 'webhook.password' },
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: false,
      fields: [{ fieldId: 'transform.expression.rules' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'advancedSettings' }],
    },
  ],
};
