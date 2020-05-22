export default {
  fieldMap: {
    common: { formId: 'common' },
    'wrapper.function': { fieldId: 'wrapper.function' },
    'wrapper.configuration': { fieldId: 'wrapper.configuration' },
    'wrapper.lookups': { fieldId: 'wrapper.lookups', visible: false },
    sampleData: {
      id: 'sampleData',
      type: 'labeltitle',
      label: 'Do you have sample data?',
    },
    'wrapper.sampleData': { fieldId: 'wrapper.sampleData' },
    dataMappings: { formId: 'dataMappings' },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    fields: ['common', 'dataMappings'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like the data imported?',
        fields: [
          'wrapper.function',
          'wrapper.configuration',
          'sampleData',
          'wrapper.lookups',
          'wrapper.sampleData',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
