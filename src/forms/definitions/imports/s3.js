import { adaptorTypeMap } from '../../../utils/resource';

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

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    fileType: { formId: 'fileType' },
    's3.fileKey': { fieldId: 's3.fileKey' },
    file: { formId: 'file' },
    dataMappings: { formId: 'dataMappings' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
    mapping: {
      fieldId: 'mapping',
      application: adaptorTypeMap.S3Import,
      refreshOptionsOnChangesTo: ['file.lookups'],
    },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
    hooks: { formId: 'hooks' },
    'hooks.postAggregate.function': { fieldId: 'hooks.postAggregate.function' },
    'hooks.postAggregate._scriptId': {
      fieldId: 'hooks.postAggregate._scriptId',
    },
    'hooks.postAggregate._stackId': { fieldId: 'hooks.postAggregate._stackId' },
  },
  layout: {
    fields: [
      'common',
      'importData',
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
        fields: ['file.csv.rowDelimiter', 'fileAdvancedSettings'],
      },
      {
        collapsed: false,
        label: 'Hooks (Optional, Developers Only)',
        fields: [
          'hooks',
          'hooks.postAggregate.function',
          'hooks.postAggregate._scriptId',
          'hooks.postAggregate._stackId',
        ],
      },
    ],
  },
};
