export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.filedefinition.rules') {
      // Fetch format specific Field Definition field to fetch id
      // if (fileType.value === 'filedefinition')
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

    if (fieldId === 'dataURITemplate') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }

    return null;
  },
  init: fieldMeta => {
    const fileDefinitionRulesField =
      fieldMeta.fieldMap['file.filedefinition.rules'];

    if (fileDefinitionRulesField.userDefinitionId) {
      // make visibility of format fields false incase of edit mode of file adaptors
      const formatField = fieldMeta.fieldMap['edix12.format'];

      delete formatField.visibleWhenAll;
      formatField.visible = false;
    }

    return fieldMeta;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    distributed: { fieldId: 'distributed', defaultValue: false },
    'file.type': {
      fieldId: 'file.type',
      defaultValue: 'filedefinition',
      visible: false,
    },
    'file.skipAggregation': {
      fieldId: 'file.skipAggregation',
      defaultValue: 'true',
      visible: false,
    },
    'edix12.format': {
      fieldId: 'edix12.format',
      label: 'EDI Format',
      required: true,
    },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
    },
    'as2.fileNameTemplate': { fieldId: 'as2.fileNameTemplate' },
    'as2.messageIdTemplate': { fieldId: 'as2.messageIdTemplate' },
    'as2.headers': { fieldId: 'as2.headers' },
    dataMappings: { formId: 'dataMappings' },
    compressFiles: { formId: 'compressFiles' },
    'as2.maxRetries': { fieldId: 'as2.maxRetries' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'distributed',
      'file.type',
      'file.skipAggregation',
      'edix12.format',
      'as2.fileNameTemplate',
      'as2.messageIdTemplate',
      'file.filedefinition.rules',
      'as2.headers',
      'dataMappings',
      'file.lookups',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['compressFiles', 'as2.maxRetries'],
      },
    ],
  },
  actions: [
    {
      // Button that saves file defs and then submit resource
      id: 'savedefinition',
    },
    {
      id: 'cancel',
    },
  ],
};
