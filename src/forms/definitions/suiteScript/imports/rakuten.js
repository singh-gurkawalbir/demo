import csvOptions from '../../../../components/AFE/SuiteScript/CsvConfigEditor/options';

export default {
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/import/file/csv/columnDelimiter']) {
      newValues['/import/file/csv/columnDelimiter'] = csvOptions.ColumnDelimiterMap[newValues['/import/file/csv/columnDelimiter']];
    }
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
        fields: ['import.rakuten.method', 'import.ftp.fileName', 'import.ftp.fileExtension', 'import.file.csv.columnDelimiter', 'import.file.csv.includeHeader'],
        type: 'collapse',
      },
    ],
  },
};
