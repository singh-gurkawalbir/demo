export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    retValues['/file/type'] = 'csv';
    retValues['/http/method'] = 'GET';

    if (retValues['/outputMode'] === 'blob') {
      retValues['/type'] = 'blob';
      retValues['/http/method'] = retValues['/http/blobMethod'];
    }

    delete retValues['/outputMode'];

    return {
      ...retValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'dataURITemplate' || fieldId === 'http.relativeURI') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
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
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'http.blobMethod': {
      fieldId: 'http.blobMethod',
    },
    'http.headers': { fieldId: 'http.headers' },
    'http.relativeURI': { fieldId: 'http.relativeURI' },
    'http.response.resourcePath': {
      fieldId: 'http.response.resourcePath',
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
      placeholder: 'Sample file (that would be parsed)',
      options: 'csv',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.csv': {
      id: 'file.csv',
      type: 'csvparse',
      label: 'CSV parser helper',
      helpKey: 'file.csvParse',
      defaultValue: r => r?.file?.csv || {
        columnDelimiter: ',',
        rowDelimiter: '\n',
        hasHeaderRow: false,
        keyColumns: [],
        rowsToSkip: 0,
        trimSpaces: false,
      },
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'http.response.blobFormat': { fieldId: 'http.response.blobFormat' },
    exportOneToMany: { formId: 'exportOneToMany' },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    formView: { fieldId: 'formView' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'outputMode', 'exportOneToMany', 'formView'] },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'Where would you like to transfer from?';

          return 'What would you like to export?';
        },
        containers: [
          {
            fields: [
              'http.blobMethod',
              'http.relativeURI',
              'http.headers',
              'uploadFile',
            ],
          },
          {
            type: 'indent',
            containers: [
              {fields: [
                'file.csv',
              ]},
            ],
          },
          {
            fields: [
              'http.response.blobFormat',
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API response patterns',
        fields: ['http.response.resourcePath'],
      },
      { collapsed: 'true', label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
