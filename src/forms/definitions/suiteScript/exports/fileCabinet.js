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
        type: 'collapse',
        containers: [
          {
            label: 'How would you like to parse files?',
            fields: [
              'uploadFile',
              'export.file.csv',
            ],
          },
          {
            label: 'Where would you like to transfer from?',
            fields: [
              'export.fileCabinet.folderHierarchy',
            ],
          },
        ],
      },
    ],
  },
};
