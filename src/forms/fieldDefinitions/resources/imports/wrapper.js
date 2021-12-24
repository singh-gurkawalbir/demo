export default {
  'wrapper.function': {
    isLoggable: true,
    type: 'text',
    label: 'Function',
    required: true,
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Configuration',
  },
  sampleData: {
    type: 'editor',
    label: 'Paste destination record here',
    helpKey: 'import.sampleData',
    defaultValue: r =>
      r && r.sampleData && JSON.stringify(r.sampleData, null, 2),
  },
};
