export default {
  fields: [
    { fieldId: 'file.type' },
    { fieldId: 'file.encoding' },
    { fieldId: 'file.output' },
    { fieldId: 'file.skipDelete' },
    { fieldId: 'file.compressionFormat' },
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
