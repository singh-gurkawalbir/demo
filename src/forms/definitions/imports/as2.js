import { adaptorTypeMap } from '../../../utils/resource';

export default {
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

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: 'How would you like the data imported?',
    },
    'edix12.format': {
      fieldId: 'edix12.format',
      label: 'EDI Format',
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
    hooks: { formId: 'hooks' },
    'hooks.postAggregate.function': { fieldId: 'hooks.postAggregate.function' },
    'hooks.postAggregate._scriptId': {
      fieldId: 'hooks.postAggregate._scriptId',
    },
    'hooks.postAggregate._stackId': { fieldId: 'hooks.postAggregate._stackId' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
    mapping: {
      fieldId: 'mapping',
      application: adaptorTypeMap.AS2Import,
      refreshOptionsOnChangesTo: ['file.lookups'],
    },
  },
  layout: {
    fields: [
      'common',
      'importData',
      'edix12.format',
      'as2.fileNameTemplate',
      'as2.messageIdTemplate',
      'file.filedefinition.rules',
      'as2.headers',
      'dataMappings',
      'file.lookups',
      'mapping',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['compressFiles', 'as2.maxRetries'],
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
