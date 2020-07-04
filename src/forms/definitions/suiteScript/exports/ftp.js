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
        type: 'collapse',
        containers: [
          {
            label: 'How would you like to parse files?',
            fields: [
              'uploadFile',
              'export.file.csv',
            ],
            collapsed: false,
            type: 'indent',
          },
          {
            label: 'Where would you like to transfer from?',
            fields: [
              'export.ftp.directoryPath',
            ],
            collapsed: false,
          },
          {
            label: 'Advanced',
            fields: [
              'export.file.skipDelete',
            ],
          },
        ],
      },

    ],
  },
};
