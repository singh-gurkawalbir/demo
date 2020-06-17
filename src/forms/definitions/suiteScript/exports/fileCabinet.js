export default {
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/uploadFile']) {
      newValues['/export/sampleData'] = newValues['/uploadFile'];
      delete newValues['/uploadFile'];
    }

    return newValues;
  },
  fieldMap: {
    exportData: { fieldId: 'exportData' },
    'export.fileCabinet.folderHierarchy': {
      fieldId: 'export.fileCabinet.folderHierarchy',
    },
    uploadFile: { fieldId: 'uploadFile' },
    'export.file.csv': {
      fieldId: 'export.file.csv',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'exportData',
          'export.fileCabinet.folderHierarchy',
          'uploadFile',
          'export.file.csv',
        ],
        type: 'collapse',
      },
    ],
  },
};
