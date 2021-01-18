
export default {
  fieldMap: {
    'import.ftp.fileName': {
      fieldId: 'import.ftp.fileName',
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
            fields: ['import.ftp.fileName', 'import.ftp.fileExtension', 'import.file.csv.columnDelimiter', 'import.file.csv.includeHeader'],
            collapsed: false,
          },
        ],
      },
    ],
  },
};
