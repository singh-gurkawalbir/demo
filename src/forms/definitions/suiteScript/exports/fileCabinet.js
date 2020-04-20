export default {
  fieldMap: {
    uploadFile: { fieldId: 'uploadFile' },
    'export.file.csv': {
      fieldId: 'export.file.csv',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: ['uploadFile', 'export.file.csv'],
        type: 'collapse',
      },
    ],
  },
};
