import csvOptions from './options';

export default function getFormMetadata(options) {
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
        defaultValue: options?.hasHeaderRow,
        required: true,
      },
      rowsPerRecord: {
        id: 'rowsPerRecord',
        name: 'rowsPerRecord',
        label: 'Multiple rows per record',
        type: 'checkboxforresetfields',
        fieldsToReset: [{ id: 'keyColumns', value: [] }],
        defaultValue: !!(Array.isArray(options?.keyColumns) && options.keyColumns.length),
        required: true,
      },
      keyColumns: {
        id: 'keyColumns',
        name: 'keyColumns',
        label: 'Key columns',
        type: 'suitescriptfilekeycolumn',
        resourceId: options.resourceId,
        helpKey: 'export.file.csv.keyColumns',
        defaultValue: options?.keyColumns || [],
        resourceType: options.resourceType,
        ssLinkedConnectionId: options.ssLinkedConnectionId,
        refreshOptionsOnChangesTo: [
          'columnDelimiter',
          'rowDelimiter',
          'hasHeaderRow',
          'rowsPerRecord',
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
        const hasHeaderRowField = fields.find(
          field => field.id === 'hasHeaderRow'
        );

        return {
          columnDelimiter: columnDelimiterField?.value,
          rowDelimiter: rowDelimiterField?.value,
          hasHeaderRow: hasHeaderRowField?.value,
          fileType: 'csv',
        };
      }

      return null;
    },
  };

  return fieldMeta;
}
