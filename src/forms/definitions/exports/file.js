export default {
  fields: [
    { fieldId: 'file.type' },
    { fieldId: 'file.encoding' },
    { fieldId: 'file.output' },

    {
      fieldId: 'file.skipDelete',
      visibleWhenAll: [{ field: 'file.output', is: ['records'] }],
    },
    {
      fieldId: 'file.compressionFormat',
      visibleWhenAll: [{ field: 'file.output', is: ['records'] }],
    },
    {
      fieldId: 'file.csv.columnDelimiter',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.csv.rowDelimiter',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.csv.keyColumns',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.csv.hasHeaderRow',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.csv.trimSpaces',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.csv.rowsToSkip',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['csv'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.json.resourcePath',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['json'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.xlsx.hasHeaderRow',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xlsx'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.xlsx.keyColumns',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xlsx'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.xml.resourcePath',

      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xml'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.fileDefinition.resourcePath',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['edi', 'fixedWidth'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.fileDefinition._fileDefinitionId',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['edi', 'fixedWidth'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    { fieldId: 'file.purgeInternalBackup' },
  ],
  fieldSets: [],
};
