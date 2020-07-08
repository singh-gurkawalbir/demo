import csvOptions from '../../../../AFE/CsvConfigEditor/options';

export default function getFormMetadata(options) {
  const fieldMeta = {
    fieldMap: {
      includeHeader: {
        id: 'includeHeader',
        name: 'includeHeader',
        label: 'Include header',
        type: 'checkbox',
        helpKey: 'import.file.csv.includeHeader',
        defaultValue: options?.includeHeader,
        required: true,
      },
      columnDelimiter: {
        id: 'columnDelimiter',
        name: 'columnDelimiter',
        label: 'Column delimiter',
        type: 'selectwithinput',
        helpKey: 'import.file.csv.columnDelimiter',
        defaultValue: options?.columnDelimiter,
        options: csvOptions.ColumnDelimiterOptions,
        required: true,
      },
      rowDelimiter: {
        id: 'rowDelimiter',
        name: 'rowDelimiter',
        label: 'Row delimiter',
        type: 'select',
        helpKey: 'import.file.csv.rowDelimiter',
        defaultValue: options?.rowDelimiter,
        options: [{items: csvOptions.RowDelimiterOptions}],
        required: true,
      },
      replaceNewlineWithSpace: {
        id: 'replaceNewlineWithSpace',
        name: 'replaceNewlineWithSpace',
        label: 'Replace new line with space',
        type: 'checkbox',
        helpKey: 'import.file.csv.replaceNewlineWithSpace',
        defaultValue: options?.replaceNewlineWithSpace,
        required: true,
      },
      replaceTabWithSpace: {
        id: 'replaceTabWithSpace',
        name: 'replaceTabWithSpace',
        label: 'Replace tab with space',
        type: 'checkbox',
        helpKey: 'import.file.csv.replaceTabWithSpace',
        defaultValue: options?.replaceTabWithSpace,
        required: true,
      },
      truncateLastRowDelimiter: {
        id: 'truncateLastRowDelimiter',
        name: 'truncateLastRowDelimiter',
        label: 'Truncate last row delimiter',
        type: 'checkbox',
        helpKey: 'import.file.csv.truncateLastRowDelimiter',
        defaultValue: options?.truncateLastRowDelimiter,
        required: true,
      },
      wrapWithQuotes: {
        id: 'wrapWithQuotes',
        name: 'wrapWithQuotes',
        label: 'Wrap with quotes',
        type: 'checkbox',
        helpKey: 'import.file.csv.wrapWithQuotes',
        defaultValue: options?.wrapWithQuotes,
        required: true,
      },
    },
    optionsHandler: (fieldId, fields) => {
      if (fieldId === 'keyColumns') {
        const columnDelimiterField = fields.find(
          field => field.id === 'columnDelimiter'
        );
        const rowDelimiterField = fields.find(
          field => field.id === 'rowDelimiter'
        );
        const trimSpacesField = fields.find(
          field => field.id === 'trimSpaces'
        );
        const rowsToSkipField = fields.find(
          field => field.id === 'rowsToSkip'
        );
        const hasHeaderRowField = fields.find(
          field => field.id === 'hasHeaderRow'
        );
        return {
          columnDelimiter: columnDelimiterField?.value,
          rowDelimiter: rowDelimiterField?.value,
          trimSpaces: trimSpacesField?.value,
          rowsToSkip: rowsToSkipField?.value,
          hasHeaderRow: hasHeaderRowField?.value,
          fileType: 'csv',
        };
      }

      return null;
    }
  };
  return fieldMeta;
}
