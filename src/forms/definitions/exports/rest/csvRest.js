export default {
  preSave: formValues => {
    const retValues = { ...formValues };

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
    'rest.blobFormat': { fieldId: 'rest.blobFormat' },
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
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'What would you like to transfer?';

          return 'What would you like to export?';
        },
        containers: [
          {
            fields: [
              'rest.blobMethod',
              'rest.relativeURI',
              'rest.headers',
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
              'rest.blobFormat',
            ],
          },
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
