export default {
  uploadFile: {
    type: 'suitescriptuploadfile',
    placeholder: 'Sample file (that would be parsed)',
    mode: 'csv',
    required: true,
  },
  'export.file.csv': {
    type: 'suitescriptcsvparse',
    label: 'Configure CSV parse options',
    defaultValue: r =>
      (r.export && r.export.file && r.export.file.csv) || {
        rowsToSkip: 0,
        trimSpaces: true,
        columnDelimiter: ',',
        hasHeaderRow: false,
        rowDelimiter: '\n',
      },
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
  },
};
