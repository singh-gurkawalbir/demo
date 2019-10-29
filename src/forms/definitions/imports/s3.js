import { adaptorTypeMap } from '../../../utils/resource';
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
            { label: 'Records', value: 'RECORDS' },
            { label: 'Blob Keys', value: 'BLOB' },
          ],
        },
      ],
      defaultValue: r => (r && r.blobKeyPath ? 'BLOB' : 'RECORDS'),
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    fileType: {
      formId: 'fileType',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
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
          is: ['RECORDS'],
        },
      ],
    },
    dataMappings: { formId: 'dataMappings' },
    'file.lookups': {
      fieldId: 'file.lookups',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
      visible: false,
    },
    mapping: {
      fieldId: 'mapping',
      application: adaptorTypeMap.S3Import,
      refreshOptionsOnChangesTo: ['file.lookups'],
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    deleteAfterImport: {
      fieldId: 'deleteAfterImport',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['BLOB'],
        },
      ],
    },
    'file.csv.rowDelimiter': {
      fieldId: 'file.csv.rowDelimiter',
      visibleWhen: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
        },
      ],
    },
    fileAdvancedSettings: {
      formId: 'fileAdvancedSettings',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['RECORDS'],
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
