export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'export.file.csvHelper') {
      const keyColumnsField = fields.find(
        field => field.id === 'export.file.csv.keyColumns'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'export.file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'export.file.csv.rowDelimiter'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'export.file.csv.hasHeaderRow'
      );

      return {
        fields: {
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
          keyColumns: keyColumnsField && keyColumnsField.value,
        },
      };
    }
    if (fieldId === 'export.file.csv.keyColumns') {
      const columnDelimiterField = fields.find(
        field => field.id === 'export.file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'export.file.csv.rowDelimiter'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'export.file.csv.hasHeaderRow'
      );
      const options = {
        columnDelimiter: columnDelimiterField && columnDelimiterField.value,
        rowDelimiter: rowDelimiterField && rowDelimiterField.value,
        hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
      };

      return options;
    }
  },
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
    'export.file.csvHelper': {fieldId: 'export.file.csvHelper'},
    'export.file.csv.columnDelimiter': {fieldId: 'export.file.csv.columnDelimiter'},
    'export.file.csv.rowDelimiter': {fieldId: 'export.file.csv.rowDelimiter'},
    'export.file.csv.hasHeaderRow': {fieldId: 'export.file.csv.hasHeaderRow'},
    'export.file.csv.rowsPerRecord': {fieldId: 'export.file.csv.rowsPerRecord'},
    'export.file.csv.keyColumns': {fieldId: 'export.file.csv.keyColumns'},
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
            ],
            collapsed: false,
            type: 'indent',
            containers: [{
              fields: [
                'export.file.csvHelper',
                'export.file.csv.columnDelimiter',
                'export.file.csv.rowDelimiter',
                'export.file.csv.hasHeaderRow',
                'export.file.csv.rowsPerRecord',
                'export.file.csv.keyColumns',
              ]
            }],
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
