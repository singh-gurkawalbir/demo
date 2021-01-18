
export default {
  fieldMap: {
    'import.ftp.directoryPath': {
      fieldId: 'import.ftp.directoryPath',
    },
    'import.file.fileName': {
      fieldId: 'import.file.fileName',
    },
    'import.ftp.fileExtension': {
      fieldId: 'import.ftp.fileExtension',
    },
    'import.file.csv.columnDelimiter': {
      fieldId: 'import.file.csv.columnDelimiter',
    },
    'import.file.csv.includeHeader': {
      fieldId: 'import.file.csv.includeHeader',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            label: 'How would you like to generate files?',
            fields: ['import.file.fileName', 'import.ftp.fileExtension', 'import.file.csv.columnDelimiter', 'import.file.csv.includeHeader'],
            collapsed: false,
          },
          {
            label: 'Where would you like the files transferred?',
            fields: ['import.ftp.directoryPath'],
            collapsed: false,
          },
        ],
      },
    ],
  },
};
