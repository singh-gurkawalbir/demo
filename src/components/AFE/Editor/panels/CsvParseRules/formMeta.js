import csvOptions from './options';

export default function getForm(options) {
  const fieldMeta = {
    fieldMap: {
      columnDelimiter: {
        id: 'columnDelimiter',
        name: 'columnDelimiter',
        label: 'Column delimiter',
        type: 'selectwithinput',
        helpKey: 'export.file.csv.columnDelimiter',
        defaultValue: options?.columnDelimiter,
        options: csvOptions.ColumnDelimiterOptions,
        isLoggable: true,
        required: true,
      },
      rowDelimiter: {
        id: 'rowDelimiter',
        name: 'rowDelimiter',
        label: 'Row delimiter',
        type: 'select',
        helpKey: 'export.file.csv.rowDelimiter',
        defaultValue: options?.rowDelimiter,
        options: [{items: csvOptions.RowDelimiterOptions}],
        skipDefault: true,
        isLoggable: true,
        required: true,
      },
      trimSpaces: {
        id: 'trimSpaces',
        name: 'trimSpaces',
        label: 'Trim spaces',
        type: 'checkbox',
        helpKey: 'export.file.csv.trimSpaces',
        isLoggable: true,
        defaultValue: !!options?.trimSpaces,
      },
      rowsToSkip: {
        id: 'rowsToSkip',
        name: 'rowsToSkip',
        label: 'Number of rows to skip',
        type: 'text',
        inputType: 'number',
        helpKey: 'export.file.csv.rowsToSkip',
        defaultValue: options?.rowsToSkip || 0,
        isLoggable: true,
        required: true,
      },
      hasHeaderRow: {
        id: 'hasHeaderRow',
        name: 'hasHeaderRow',
        label: 'File has header',
        type: 'csvhasheaderrow',
        fieldToReset: 'keyColumns',
        fieldResetValue: [],
        helpKey: 'export.file.csv.hasHeaderRow',
        isLoggable: true,
        defaultValue: !!options?.hasHeaderRow,
      },
      rowsPerRecord: {
        id: 'rowsPerRecord',
        name: 'rowsPerRecord',
        label: 'Multiple rows per record',
        helpKey: 'export.file.rowsPerRecord',
        type: 'checkboxforresetfields',
        fieldsToReset: [{ id: 'keyColumns', value: [] }],
        defaultValue: !!(Array.isArray(options?.keyColumns) && options.keyColumns.length),
        required: true,
        defaultDisabled: !options?.ignoreSortAndGroup,
        showDeprecatedMessage: !options?.ignoreSortAndGroup,
        isLoggable: true,
        ignoreSortAndGroup: options?.ignoreSortAndGroup,
      },
      keyColumns: {
        id: 'keyColumns',
        name: 'keyColumns',
        label: 'Key columns',
        type: 'filekeycolumn',
        defaultDisabled: !options?.ignoreSortAndGroup,
        resourceId: options.resourceId,
        helpKey: 'export.file.csv.keyColumns',
        defaultValue: options?.keyColumns || [],
        resourceType: options.resourceType,
        isLoggable: true,
        refreshOptionsOnChangesTo: [
          'columnDelimiter',
          'rowDelimiter',
          'trimSpaces',
          'rowsToSkip',
          'hasHeaderRow',
        ],
        visibleWhen: [
          {
            field: 'rowsPerRecord',
            is: [true],
          },
        ],
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
    },
  };

  return fieldMeta;
}
