export default {
  pageSize: {
    isLoggable: true,
    type: 'text',
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    isLoggable: true,
    type: 'uri',
    label: 'Data URI template',
    refreshOptionsOnChangesTo: ['name'],
    showLookup: false,
    connectionId: r => r && r._connectionId,
  },
};
