export default {
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    mode: 'csv',
    required: true,
  },
  'export.file.csv': {
    type: 'suitescriptcsvparse',
    label: 'Configure CSV Parse Options',
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
