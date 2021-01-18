export default {
  preSave: formValues => {
    const newValues = formValues;

    newValues['/import/file/method'] = newValues['/import/rakuten/method'];

    return newValues;
  },
  fieldMap: {
    'import.rakuten.method': {
      fieldId: 'import.rakuten.method',
    },
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
          },
          {
            label: 'Where would you like the files transferred?',
            fields: ['import.rakuten.method'],
          },
        ],
      },
    ],
  },
};
