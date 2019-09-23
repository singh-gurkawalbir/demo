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
  fieldMap: {
    'file.type': { fieldId: 'file.type' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: ['file.type'],
      visibleWhenAll: [{ field: 'file.output', is: ['records'] }],
    },
    'file.csv': {
      fieldId: 'file.csv',
      visibleWhenAll: [
        { field: 'file.type', is: ['csv'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
      visibleWhenAll: [
        { field: 'file.type', is: ['json'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.xlsx.hasHeaderRow': {
      fieldId: 'file.xlsx.hasHeaderRow',
      visibleWhenAll: [
        { field: 'file.type', is: ['xlsx'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.xlsx.keyColumns': {
      fieldId: 'file.xlsx.keyColumns',
      visibleWhenAll: [
        { field: 'file.type', is: ['xlsx'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.xml.resourcePath': {
      fieldId: 'file.xml.resourcePath',
      visibleWhenAll: [
        { field: 'file.type', is: ['xml'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
      visibleWhenAll: [
        { field: 'file.type', is: ['edi', 'fixedWidth'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'file.fileDefinition._fileDefinitionId': {
      fieldId: 'file.fileDefinition._fileDefinitionId',
      visibleWhenAll: [
        { field: 'file.type', is: ['edi', 'fixedWidth'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
  },
  layout: {
    fields: [
      'file.type',
      'uploadFile',
      'file.csv',
      'file.json.resourcePath',
      'file.xlsx.hasHeaderRow',
      'file.xlsx.keyColumns',
      'file.xml.resourcePath',
      'file.fileDefinition.resourcePath',
      'file.fileDefinition._fileDefinitionId',
    ],
  },
};
