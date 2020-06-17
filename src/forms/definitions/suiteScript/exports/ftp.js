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
    'export.ftp.directoryPath': { fieldId: 'export.ftp.directoryPath' },
    'export.file.skipDelete': { fieldId: 'export.file.skipDelete' },
    uploadFile: { fieldId: 'uploadFile', required: false },
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
          'export.ftp.directoryPath',
          'export.file.skipDelete',
          'uploadFile',
          'export.file.csv',
        ],
        type: 'collapse',
      },
    ],
  },
};
