export default {
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }

    if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;

      // Fetch format specific Field Definition field to fetch id
      if (fileType.value === 'filedefinition')
        definitionFieldId = 'edix12.format';
      else if (fileType.value === 'fixed') definitionFieldId = 'fixed.format';
      else definitionFieldId = 'edifact.format';
      const definition = fields.find(field => field.id === definitionFieldId);
      const resourcePath = fields.find(
        field => field.id === 'file.fileDefinition.resourcePath'
      );

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
        resourcePath: resourcePath && resourcePath.value,
      };
    }
  },
  fieldMap: {
    'file.type': { fieldId: 'file.type' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
    },
    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx': { fieldId: 'file.xlsx' },
    'file.xml': { fieldId: 'file.xml' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
      visibleWhenAll: [
        { field: 'file.type', is: ['json'] },
        { field: 'file.output', is: ['records'] },
      ],
    },
    'edix12.format': { fieldId: 'edix12.format' },
    'fixed.format': { fieldId: 'fixed.format' },
    'edifact.format': { fieldId: 'edifact.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.fileDefinition.resourcePath',
      ],
    },
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
    },
  },
  layout: {
    fields: [
      'file.type',
      'uploadFile',
      'file.csv',
      'file.xlsx',
      'file.xml',
      'file.json.resourcePath',
      'edix12.format',
      'fixed.format',
      'edifact.format',
      'file.filedefinition.rules',
    ],
  },
};
