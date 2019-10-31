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
    if (fieldId === 'mapping') {
      const lookupField = fields.find(
        field => field.fieldId === 'file.lookups'
      );

      if (lookupField) {
        return {
          lookupId: 'file.lookups',
          lookups: lookupField && lookupField.value,
        };
      }
    }

    if (fieldId === 's3.fileKey') {
      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const fileNameField = fields.find(
        field => field.fieldId === 's3.fileKey'
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
    inputMode: {
      id: 'inputMode',
      type: 'radiogroup',
      label: 'Input Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => (r && r.blobKeyPath ? 'blob' : 'records'),
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    fileType: {
      formId: 'fileType',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    's3.fileKey': { fieldId: 's3.fileKey' },
    blobKeyPath: { fieldId: 'blobKeyPath' },
    file: {
      formId: 'file',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    'file.lookups': {
      fieldId: 'file.lookups',
      visible: false,
    },
    mapping: {
      fieldId: 'mapping',
      refreshOptionsOnChangesTo: ['file.lookups'],
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
        },
      ],
    },
    'file.csv.rowDelimiter': {
      fieldId: 'file.csv.rowDelimiter',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
    fileAdvancedSettings: {
      formId: 'fileAdvancedSettings',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
  },
  layout: {
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      's3.region',
      's3.bucket',
      'fileType',
      's3.fileKey',
      'file',
      'dataMappings',
      'file.lookups',
      'mapping',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'file.csv.rowDelimiter',
          'fileAdvancedSettings',
          'deleteAfterImport',
        ],
      },
    ],
  },
};
