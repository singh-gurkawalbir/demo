import timeStamps from '../../../utils/timeStamps';
import { isNewId } from '../../../utils/resource';

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
    } else {
      // make visibility of format fields false incase of edit mode of file adaptors
      const fields = ['edix12.format', 'fixed.format', 'edifact.format'];

      fields.forEach(field => {
        const formatField = fieldMeta.fieldMap[field];

        delete formatField.visibleWhenAll;
        formatField.visible = false;
      });
    }

    return fieldMeta;
  },
  optionsHandler: (fieldId, fields) => {
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
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
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
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['blob'],
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
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['fileAdvancedSettings', 'deleteAfterImport'],
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
