export default {
  pageSize: {
    loggable: true,
    type: 'text',
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    loggable: true,
    type: 'uri',
    label: 'Data URI template',
    refreshOptionsOnChangesTo: ['name'],
    showLookup: false,
    connectionId: r => r && r._connectionId,
  },
};
