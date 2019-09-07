export default {
  presubmit: formValues => {
    const submitFormValues = { ...formValues };

    delete submitFormValues['/uploadFile'];

    return submitFormValues;
  },

  fields: [
    { formId: 'common' },
    {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    { fieldId: 'ftp.directoryPath' },
    { fieldId: 'file.output' },
    { fieldId: 'ftp.fileNameStartsWith' },
    { fieldId: 'ftp.fileNameEndsWith' },
    { fieldId: 'ftp.file.type' },
    {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
      isFTP: true,
    },
    { fieldId: 'file.csv' },
    { fieldId: 'file.json.resourcePath' },
    { fieldId: 'file.xml.resourcePath' },
    { fieldId: 'file.xlsx.hasHeaderRow' },
    { fieldId: 'file.xlsx.rowsPerRecord' },
    { fieldId: 'file.xlsx.keyColumns' },
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
    },
    { fieldId: 'file.fileDefinition.resourcePath' },
    { fieldId: 'rawData', isFTP: true },
    { fieldId: 'sampleData' },
    // { fieldId: 'ftp.fileDefinition._fileDefinitionId' },
  ],
  fieldSets: [
    {
      header: 'Would you like to transform the records?',
      collapsed: false,
      fields: [{ fieldId: 'transform' }],
    },
    {
      header: 'Hooks (Optional, Developers Only)',
      collapsed: false,
      fields: [{ formId: 'hooks' }],
    },
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { fieldId: 'file.decompressFiles' },
        { fieldId: 'file.compressionFormat' },
        { fieldId: 'file.skipDelete' },
        { fieldId: 'file.encoding' },
        { formId: 'advancedSettings' },
      ],
    },
  ],
  actions: [
    {
      id: 'cancel',
    },
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
