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
    type: 'datauritemplate',
    label: 'Data URI template',
    refreshOptionsOnChangesTo: ['name'],
    connectionId: r => r && r._connectionId,
  },
};
