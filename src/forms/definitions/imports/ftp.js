import timeStamps from '../../../utils/timeStamps';

export default {
  init: fieldMeta => {
    const fileDefinitionRulesField =
      fieldMeta.fieldMap['file.filedefinition.rules'];

    if (!fileDefinitionRulesField.userDefinitionId) {
      // In Import creation mode, delete generic visibleWhenAll rules
      // Add custom visible when rules
      delete fileDefinitionRulesField.visibleWhenAll;
      fileDefinitionRulesField.visibleWhen = [
        {
          field: 'edix12.format',
          isNot: [''],
        },
        {
          field: 'fixed.format',
          isNot: [''],
        },
        {
          field: 'edifact.format',
          isNot: [''],
        },
      ];
    }

    return fieldMeta;
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'ftp.fileName') {
      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const fileNameField = fields.find(
        field => field.fieldId === 'ftp.fileName'
      );
      let suggestionList = [];

      if (
        fileNameField &&
        fileNameField.value &&
        fileTypeField &&
        fileTypeField.value
      ) {
        const extension = fileTypeField.value;
        const lastDotIndex = fileNameField.value.lastIndexOf('.');
        const fileNameWithoutExt =
          lastDotIndex !== -1
            ? fileNameField.value.substring(0, lastDotIndex)
            : fileNameField.value;
        const bracesStartIndex = fileNameWithoutExt.indexOf('{');
        const textBeforeBraces =
          bracesStartIndex !== -1
            ? fileNameWithoutExt.substring(0, bracesStartIndex)
            : fileNameWithoutExt;

        suggestionList = timeStamps.map(
          timestamp =>
            `${textBeforeBraces}{{timestamp(${timestamp._id})}}.${extension}`
        );

        fileNameField.value = `${fileNameWithoutExt}.${extension}`;
      }

      return { suggestions: suggestionList };
    }

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

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
      };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },
    fileType: { formId: 'fileType' },
    'ftp.fileName': { fieldId: 'ftp.fileName' },
    file: { formId: 'file' },
    dataMappings: { formId: 'dataMappings' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'ftp.useTempFile': { fieldId: 'ftp.useTempFile' },
    'ftp.inProgressFileName': { fieldId: 'ftp.inProgressFileName' },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'ftp.directoryPath',
      'fileType',
      'ftp.fileName',
      'file',
      'dataMappings',
      'file.lookups',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'file.csv.rowDelimiter',
          'ftp.useTempFile',
          'ftp.inProgressFileName',
          'fileAdvancedSettings',
        ],
      },
    ],
  },
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
      // Button that saves file defs and then submit resource
      id: 'savedefinition',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
  ],
};
