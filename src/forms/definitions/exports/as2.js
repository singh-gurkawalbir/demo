export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/file/type'] = 'filedefinition';

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.filedefinition.rules') {
      // Fetch format specific Field Definition field to fetch id
      const definitionFieldId = 'edix12.format';
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
    common: { formId: 'common' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
    },
    'edix12.format': {
      fieldId: 'edix12.format',
    },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
    },
    advancedSettings: { formId: 'advancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    fields: [
      'common',
      'exportOneToMany',
      'exportData',
      'edix12.format',
      'file.fileDefinition.resourcePath',
      'file.filedefinition.rules',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
