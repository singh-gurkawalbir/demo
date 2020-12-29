export default {
  pageSize: {
    type: 'text',
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'uri',
    label: 'Data URI template',
    refreshOptionsOnChangesTo: ['name'],
    showLookup: false,
    connectionId: r => r && r._connectionId,
  },
};
