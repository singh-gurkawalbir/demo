import csvOptions from '../../../AFE/Editor/panels/CsvParseRules/options';

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
        isLoggable: true,
      },
      columnDelimiter: {
        id: 'columnDelimiter',
        name: 'columnDelimiter',
        label: 'Column delimiter',
        type: 'selectwithinput',
        helpKey: 'import.file.csv.columnDelimiter',
        defaultValue: options?.columnDelimiter,
        options: csvOptions.ColumnDelimiterOptions,
        isLoggable: true,
      },
      rowDelimiter: {
        id: 'rowDelimiter',
        name: 'rowDelimiter',
        label: 'Row delimiter',
        type: 'select',
        helpKey: 'import.file.csv.rowDelimiter',
        defaultValue: options?.rowDelimiter,
        options: [{items: csvOptions.RowDelimiterOptions}],
        isLoggable: true,
      },
      replaceNewlineWithSpace: {
        id: 'replaceNewlineWithSpace',
        name: 'replaceNewlineWithSpace',
        label: 'Replace new line with space',
        type: 'checkbox',
        helpKey: 'import.file.csv.replaceNewlineWithSpace',
        defaultValue: options?.replaceNewlineWithSpace,
        isLoggable: true,
      },
      replaceTabWithSpace: {
        id: 'replaceTabWithSpace',
        name: 'replaceTabWithSpace',
        label: 'Replace tab with space',
        type: 'checkbox',
        helpKey: 'import.file.csv.replaceTabWithSpace',
        defaultValue: options?.replaceTabWithSpace,
        isLoggable: true,
      },
      truncateLastRowDelimiter: {
        id: 'truncateLastRowDelimiter',
        name: 'truncateLastRowDelimiter',
        label: 'Truncate last row delimiter',
        type: 'checkbox',
        helpKey: 'import.file.csv.truncateLastRowDelimiter',
        defaultValue: options?.truncateLastRowDelimiter,
        isLoggable: true,
      },
      wrapWithQuotes: {
        id: 'wrapWithQuotes',
        name: 'wrapWithQuotes',
        label: 'Wrap with quotes',
        type: 'checkbox',
        helpKey: 'import.file.csv.wrapWithQuotes',
        defaultValue: options?.wrapWithQuotes,
        isLoggable: true,
      },
      customHeaderRows: {
        id: 'customHeaderRows',
        name: 'customHeaderRows',
        label: 'Custom header rows',
        type: 'text',
        rowsMax: 4,
        multiline: true,
        helpKey: 'import.file.csv.customHeaderRows',
        defaultValue: options?.customHeaderRows || '',
        isLoggable: true,
      },
    },

  };

  if (!options.customHeaderRowsSupported) {
    delete fieldMeta.fieldMap.customHeaderRows;
  }

  return fieldMeta;
}
