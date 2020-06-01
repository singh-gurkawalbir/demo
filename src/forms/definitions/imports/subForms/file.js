export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'file.csvHelper') {
      const includeHeaderField = fields.find(
        field => field.id === 'file.csv.includeHeader'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const replaceNewlineWithSpaceField = fields.find(
        field => field.id === 'file.csv.replaceNewlineWithSpace'
      );
      const replaceTabWithSpaceField = fields.find(
        field => field.id === 'file.csv.replaceTabWithSpace'
      );
      const wrapWithQuotesField = fields.find(
        field => field.id === 'file.csv.wrapWithQuotes'
      );

      return {
        fields: {
          includeHeader: includeHeaderField && includeHeaderField.value,
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          replaceNewlineWithSpace:
            replaceNewlineWithSpaceField && replaceNewlineWithSpaceField.value,
          replaceTabWithSpace:
            replaceTabWithSpaceField && replaceTabWithSpaceField.value,
          wrapWithQuotes: wrapWithQuotesField && wrapWithQuotesField.value,
        },
      };
    } else if (fieldId === 'uploadFile') {
      const uploadFileField = fields.find(
        field => field.fieldId === 'uploadFile'
      );
      // if there is a uploadFileField in the form meta
      // then provide the file type if not return null
      // then the prevalent mode value will take over
      const fileType = fields.find(field => field.id === 'file.type');

      if (fieldId === 'uploadFile') {
        return fileType.value;
      }

      if (uploadFileField) {
        const fileTypeField = fields.find(
          field => field.fieldId === 'file.type'
        );

        return fileTypeField.value.toLowerCase();
      }
    }

    return null;
  },
  fieldMap: {
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
      placeholder: 'Sample file (that would be generated):',
      helpKey: 'import.uploadFile',
    },
    'file.csvHelper': { fieldId: 'file.csvHelper' },
    'file.csv.includeHeader': { fieldId: 'file.csv.includeHeader' },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.replaceNewlineWithSpace': {
      fieldId: 'file.csv.replaceNewlineWithSpace',
    },
    'file.csv.replaceTabWithSpace': { fieldId: 'file.csv.replaceTabWithSpace' },
    'file.csv.wrapWithQuotes': { fieldId: 'file.csv.wrapWithQuotes' },
    'file.xlsx.includeHeader': { fieldId: 'file.xlsx.includeHeader' },
  },
  layout: {
    fields: [
      'uploadFile',
      'file.csv.includeHeader',
      'file.csv.columnDelimiter',
      'file.csv.rowDelimiter',
      'file.csv.replaceNewlineWithSpace',
      'file.csv.replaceTabWithSpace',
      'file.csv.wrapWithQuotes',
      'file.csvHelper',
      'file.xlsx.includeHeader',
    ],
  },
};
