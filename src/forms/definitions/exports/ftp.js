export default {
  preSubmit: formValues => {
    const submitFormValues = { ...formValues };

    delete submitFormValues['/uploadFile'];

    if (submitFormValues['/file/output'] === 'metadata') {
      submitFormValues['/file/type'] = 'csv';
    }

    if (submitFormValues['/file/output'] === 'blobKeys') {
      submitFormValues['/file/skipDelete'] = false;
    }

    return submitFormValues;
  },

  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    {
      fieldId: 'ftp.directoryPath',
      defaultValue: r => r && r.ftp && r.ftp.directoryPath,
    },
    {
      fieldId: 'file.output',
      defaultValue: r => (r && r.file && r.file.output) || 'records',
    },
    { fieldId: 'ftp.fileNameStartsWith' },
    { fieldId: 'ftp.fileNameEndsWith' },
    // { formId: 'file' },

    {
      fieldId: 'ftp.file.type',
      defaultValue: r => r && r.file && r.file.type,
    },
    {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
    },
    {
      fieldId: 'file.csv',
      defaultValue: r => r && r.file && r.file.csv,
    },
    {
      fieldId: 'file.xlsx',
      defaultValue: r => r && r.file && r.file.xlsx,
    },
    {
      fieldId: 'file.xml',
      defaultValue: r => r && r.file && r.file.xml,
    },
    { fieldId: 'file.json.resourcePath' },

    { fieldId: 'edix12.format' },
    { fieldId: 'fixed.format' },
    { fieldId: 'edifact.format' },
    {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.fileDefinition.resourcePath',
      ],
      userDefinitionId: r =>
        r &&
        r.file &&
        r.file.fileDefinition &&
        r.file.fileDefinition._fileDefinitionId,
    },
    { fieldId: 'file.fileDefinition.resourcePath' },
    { fieldId: 'rawData' },
    { fieldId: 'sampleData' },
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: false,
      fields: [{ fieldId: 'transform' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: true,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced',
      collapsed: true,
      fields: [{ formId: 'fileAdvancedSettings' }],
    },
  ],
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'saverawdata',
      visibleWhen: [
        {
          field: 'file.type',
          isNot: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      // will be button that saves file defs and then submit resource
      id: 'savedefinition',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
  ],
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
};
