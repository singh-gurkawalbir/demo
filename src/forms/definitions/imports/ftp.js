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
    mapping: {
      fieldId: 'mapping',
      application: adaptorTypeMap.FTPImport,
      refreshOptionsOnChangesTo: ['file.lookups'],
    },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'ftp.useTempFile': { fieldId: 'ftp.useTempFile' },
    'ftp.inProgressFileName': { fieldId: 'ftp.inProgressFileName' },
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
      'ftp.directoryPath',
      'fileType',
      'ftp.fileName',
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
          'ftp.useTempFile',
          'ftp.inProgressFileName',
          'fileAdvancedSettings',
        ],
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
