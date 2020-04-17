const alterFileDefinitionRulesVisibility = fields => {
  // TODO @Raghu : Move this to metadata visibleWhen rules when we support combination of ANDs and ORs in Forms processor
  const fileDefinitionRulesField = fields.find(
    field => field.id === 'file.filedefinition.rules'
  );
  const fileType = fields.find(field => field.id === 'file.type');
  const fileDefinitionFieldsMap = {
    filedefinition: 'edix12.format',
    fixed: 'fixed.format',
    'delimited/edifact': 'edifact.format',
  };

  if (
    fileType &&
    fileType.value &&
    !fileDefinitionRulesField.userDefinitionId
  ) {
    // Delete existing visibility rules
    delete fileDefinitionRulesField.visibleWhenAll;
    delete fileDefinitionRulesField.visibleWhen;

    if (Object.keys(fileDefinitionFieldsMap).includes(fileType.value)) {
      const formatFieldType = fileDefinitionFieldsMap[fileType.value];
      const fileDefinitionFormatField = fields.find(
        fdField => fdField.id === formatFieldType
      );

      fileDefinitionRulesField.visible = !!fileDefinitionFormatField.value;
    } else {
      fileDefinitionRulesField.visible = false;
    }
  } else {
    // make visibility of format fields false incase of edit mode of file adaptors
    Object.values(fileDefinitionFieldsMap).forEach(field => {
      const fileDefinitionFormatField = fields.find(
        fdField => fdField.id === field
      );

      delete fileDefinitionFormatField.visibleWhenAll;
      fileDefinitionFormatField.visible = false;
    });
  }
};

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/type'] = 'webhook';

    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }

    return {
      ...newValues,
    };
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
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

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

      alterFileDefinitionRulesVisibility(fields);

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
      label: 'What would you like to export?',
    },
    'edix12.format': {
      fieldId: 'edix12.format',
    },
    'file.type': { fieldId: 'file.type' },
    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'fixed.format': { fieldId: 'fixed.format' },
    'edifact.format': { fieldId: 'edifact.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.fileDefinition.resourcePath',
        'file.type',
      ],
      required: true,
    },
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
    },
    advancedSettings: { formId: 'advancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    fields: [
      'common',
      'exportOneToMany',
      'exportData',
      'file.type',
      'file.csv',
      'file.xml.resourcePath',
      'file.json.resourcePath',
      'file.xlsx.hasHeaderRow',
      'file.xlsx.rowsPerRecord',
      'file.xlsx.keyColumns',
      'edix12.format',
      'fixed.format',
      'edifact.format',
      'file.filedefinition.rules',
      'file.fileDefinition.resourcePath',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
  actions: [
    {
      id: 'save',
      visibleWhen: [
        {
          field: 'file.type',
          isNot: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      // Button that saves file defs and then submit resource
      id: 'savedefinition',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      id: 'cancel',
    },
  ],
};
