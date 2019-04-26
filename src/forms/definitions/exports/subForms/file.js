export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'uploadFile') {
      const uploadFileField = fields.find(
        field => field.fieldId === 'uploadFile'
      );

      // if there is a uploadFileField in the form meta
      // then provide the file type if not return null
      // then the prevelant mode value will take over
      if (uploadFileField) {
        const fileTypeField = fields.find(
          field => field.fieldId === 'file.type'
        );

        return fileTypeField.value.toLowerCase();
      }
    }
  },
  fields: [
    { fieldId: 'exportData' },
    { fieldId: 'file.type' },
    { fieldId: 'file.output' },
    { fieldId: 'uploadFile', refreshOptionsOnChangesTo: 'file.type' },
    { fieldId: 'file.skipDelete' },
    {
      fieldId: 'file.csv.columnDelimiter',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.rowDelimiter',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.keyColumns',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.hasHeaderRow',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.trimSpaces',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.csv.rowsToSkip',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
      ],
    },
    {
      fieldId: 'file.json.resourcePath',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['json'],
        },
      ],
    },
    {
      fieldId: 'file.xlsx.hasHeaderRow',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xlsx'],
        },
      ],
    },
    {
      fieldId: 'file.xlsx.keyColumns',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xlsx'],
        },
      ],
    },
    {
      fieldId: 'file.xml.resourcePath',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xml'],
        },
      ],
    },
    {
      fieldId: 'file.fileDefinition.resourcePath',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['edi', 'fixedWidth'],
        },
      ],
    },
    {
      fieldId: 'file.fileDefinition._fileDefinitionId',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['edi', 'fixedWidth'],
        },
      ],
    },
    { fieldId: 'file.purgeInternalBackup' },
  ],
  fieldSets: [],
};
