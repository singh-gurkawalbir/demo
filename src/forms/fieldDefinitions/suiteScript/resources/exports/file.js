
export default {
  uploadFile: {
    type: 'suitescriptuploadfile',
    placeholder: 'Sample file (that would be parsed)',
    mode: 'csv',
    required: true,
  },
  'export.file.csv': {
    type: 'suitescriptcsvparse',
    label: 'CSV parser helper',
    helpKey: 'file.csvParse',
    uploadSampleDataFieldName: 'uploadFile',
    ssLinkedConnectionId: r => r.ssLinkedConnectionId,
  },
};
