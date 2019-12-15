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
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;
      const fileType = fields.find(field => field.id === 'file.type');

      // Fetch format specific Field Definition field to fetch id
      if (fileType.value === 'filedefinition')
        definitionFieldId = 'edix12.format';
      else if (fileType.value === 'fixed') definitionFieldId = 'fixed.format';
      else definitionFieldId = 'edifact.format';
      const definition = fields.find(field => field.id === definitionFieldId);

      alterFileDefinitionRulesVisibility(fields);

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
      };
    }
  },
  fieldMap: {
    'file.type': { fieldId: 'file.type' },
    'edifact.format': { fieldId: 'edifact.format' },
    'fixed.format': { fieldId: 'fixed.format' },
    'edix12.format': { fieldId: 'edix12.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.type',
      ],
    },
  },
  layout: {
    fields: [
      'file.type',
      'edifact.format',
      'fixed.format',
      'edix12.format',
      'file.filedefinition.rules',
    ],
  },
};
