export default {
  fieldMap: {
    name: { fieldId: 'name' },
    'wrapper.unencrypted': { fieldId: 'wrapper.unencrypted' },
    'wrapper.encrypted': { fieldId: 'wrapper.encrypted' },
    'wrapper.pingFunction': { fieldId: 'wrapper.pingFunction' },
    'wrapper._stackId': { fieldId: 'wrapper._stackId' },
    wrapperAdvanced: { formId: 'wrapperAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'wrapper.unencrypted',
      'wrapper.encrypted',
      'wrapper.pingFunction',
      'wrapper._stackId',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['wrapperAdvanced'],
      },
    ],
  },
};
