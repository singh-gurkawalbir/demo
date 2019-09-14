export default {
  optionsHandler(fieldId, fields) {
    if (fieldId === 'uploadFile') {
      const uploadFileField = fields.find(
        field => field.fieldId === 'uploadFile'
      );

      // if there is a uploadFileField in the form meta
      // then provide the file type if not return null
      // then the prevalent mode value will take over
      if (uploadFileField) {
        const fileTypeField = fields.find(
          field => field.fieldId === 'file.type'
        );

        return fileTypeField.value.toLowerCase();
      }
    }

    return null;
  },
  fields: [
    { fieldId: 'file.type' },
    {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
      visibleWhenAll: [{ field: 'file.output', is: ['records'] }],
    },
    {
      fieldId: 'file.csv',
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
      id: 'rowsPerRecord',
      type: 'checkbox',
      label: 'Multiple Rows Per Record',
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
        { field: 'rowsPerRecord', is: [true] },
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
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
    {
      fieldId: 'file.fileDefinition._fileDefinitionId',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
        { field: 'file.output', is: ['records'] },
      ],
    },
  ],
  fieldSets: [],
};
