import csvOptions from '../../../../components/AFE/CsvConfigEditor/options';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    delete retValues['/file/csvHelper'];
    retValues['/file/type'] = 'csv';
    retValues['/rest/method'] = 'GET';

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/rest/method'] = retValues['/rest/blobMethod'];
    }

    delete retValues['/outputMode'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'dataURITemplate' || fieldId === 'rest.relativeURI') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    } else if (fieldId === 'file.csvHelper') {
      const keyColumnsField = fields.find(
        field => field.id === 'file.csv.keyColumns'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );

      return {
        fields: {
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          trimSpaces: trimSpacesField && trimSpacesField.value,
          rowsToSkip: rowsToSkipField && rowsToSkipField.value,
          hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
          keyColumns: keyColumnsField && keyColumnsField.value,
        },
      };
    } else if (fieldId === 'file.csv.keyColumns') {
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      const options = {
        columnDelimiter: columnDelimiterField && columnDelimiterField.value,
        rowDelimiter: rowDelimiterField && rowDelimiterField.value,
        trimSpaces: trimSpacesField && trimSpacesField.value,
        rowsToSkip: rowsToSkipField && rowsToSkipField.value,
        hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
      };

      return options;
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output mode',
      required: true,
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob')
          return 'blob';

        return 'records';
      },
    },
    'rest.blobMethod': {
      fieldId: 'rest.blobMethod',
    },
    'rest.headers': { fieldId: 'rest.headers' },
    'rest.relativeURI': { fieldId: 'rest.relativeURI' },
    'rest.resourcePath': {
      fieldId: 'rest.resourcePath',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['blob'],
        },
      ],
    },
    uploadFile: {
      id: 'uploadFile',
      type: 'uploadfile',
      label: 'Sample file (that would be exported)',
      mode: r => r && r.file && r.file.type,
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.csvHelper': {
      id: 'file.csvHelper',
      type: 'csvparse',
      label: 'CSV parser helper:',
      helpKey: 'file.csvParse',
      refreshOptionsOnChangesTo: [
        'file.csv.keyColumns',
        'file.csv.columnDelimiter',
        'file.csv.rowDelimiter',
        'file.csv.trimSpaces',
        'file.csv.rowsToSkip',
        'file.csv.hasHeaderRow',
        'file.csv.keyColumns',
      ],
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv.columnDelimiter': {
      id: 'file.csv.columnDelimiter',
      type: 'selectwithinput',
      label: 'Column delimiter',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      options: csvOptions.ColumnDelimiterOptions,
      defaultValue: r =>
        (r && r.file && r.file.csv && r.file.csv.columnDelimiter) || ',',
    },
    'file.csv.rowDelimiter': {
      id: 'file.csv.rowDelimiter',
      type: 'select',
      label: 'Row delimiter',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      options: [
        {
          items: csvOptions.RowDelimiterOptions,
        },
      ],
      defaultValue: r =>
        (r && r.file && r.file.csv && r.file.csv.rowDelimiter) || '\n',
    },
    'file.csv.trimSpaces': {
      id: 'file.csv.trimSpaces',
      type: 'checkbox',
      label: 'Trim spaces',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => !!(r && r.file && r.file.csv && r.file.csv.trimSpaces),
    },
    'file.csv.rowsToSkip': {
      id: 'file.csv.rowsToSkip',
      type: 'text',
      inputType: 'number',
      label: 'Number of rows to skip',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      defaultValue: r =>
        (r && r.file && r.file.csv && r.file.csv.rowsToSkip) || 0,
    },
    'file.csv.hasHeaderRow': {
      id: 'file.csv.hasHeaderRow',
      type: 'csvhasheaderrow',
      fieldToReset: 'file.csv.keyColumns',
      fieldResetValue: [],
      label: 'File has header',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      defaultValue: r =>
        !!(r && r.file && r.file.csv && r.file.csv.hasHeaderRow),
    },
    'file.csv.rowsPerRecord': {
      id: 'file.csv.rowsPerRecord',
      type: 'checkbox',
      label: 'Multiple rows per record',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      defaultValue: r => !!(r && r.file && r.file.csv && r.file.csv.keyColumns),
    },
    'file.csv.keyColumns': {
      id: 'file.csv.keyColumns',
      type: 'filekeycolumn',
      label: 'Key columns',
      refreshOptionsOnChangesTo: [
        'file.csv.hasHeaderRow',
        'file.csv.columnDelimiter',
        'file.csv.rowDelimiter',
        'file.csv.trimSpaces',
        'file.csv.rowsToSkip',
        'file.csv.rowsPerRecord',
      ],
      sampleData: r => r && r.sampleData,
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        {
          field: 'file.csv.rowsPerRecord',
          is: [true],
        },
      ],
      defaultValue: r =>
        (r && r.file && r.file.csv && r.file.csv.keyColumns) || [],
    },
    'rest.blobFormat': { fieldId: 'rest.blobFormat' },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    formView: { fieldId: 'formView' },
  },
  layout: {
    fields: ['common', 'outputMode', 'exportOneToMany', 'formView'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob')
            return 'What would you like to transfer?';

          return 'What would you like to export?';
        },
        fields: [
          'rest.blobMethod',
          'rest.relativeURI',
          'rest.headers',
          'uploadFile',
          'file.csv.columnDelimiter',
          'file.csv.rowDelimiter',
          'file.csv.trimSpaces',
          'file.csv.rowsToSkip',
          'file.csv.hasHeaderRow',
          'file.csv.rowsPerRecord',
          'file.csv.keyColumns',
          'file.csvHelper',
          'rest.blobFormat',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: ['rest.resourcePath'],
      },
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
