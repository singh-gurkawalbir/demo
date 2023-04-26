import {
  updateFileProviderFormValues,
  getFileProviderExportsOptionsHandler,
} from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    newValues['/type'] = 'webhook';

    return {
      ...newValues,
    };
  },
  optionsHandler: getFileProviderExportsOptionsHandler,
  fieldMap: {
    common: { formId: 'common' },
    'file.type': {
      fieldId: 'file.type',
      isLoggable: true,
      type: 'filetypeselect',
      label: 'File type',
      required: true,
      defaultValue: r => r && r.file && r.file.type,
      options: [
        {
          items: [
            { label: 'EDI X12', value: 'filedefinition' },
            { label: 'EDIFACT', value: 'delimited/edifact' },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
      userDefinitionId: r =>
        r &&
        r.file &&
        r.file.fileDefinition &&
        r.file.fileDefinition._fileDefinitionId,
    },
    'edix12.format': {
      fieldId: 'edix12.format',
      isLoggable: true,
      type: 'filedefinitionselect',
      label: 'EDI x12 format',
      required: true,
      format: 'edi',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['filedefinition'],
        },
      ],
    },
    'edifact.format': {
      fieldId: 'edifact.format',
      isLoggable: true,
      type: 'filedefinitionselect',
      label: 'EDIFACT format',
      required: true,
      format: 'ediFact',
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['delimited/edifact'],
        },
      ],
    },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      isLoggable: true,
      type: 'filedefinitioneditor',
      label: 'File parser helper',
      helpKey: 'export.file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'edifact.format',
        'file.fileDefinition.resourcePath',
      ],
      fileDefinitionResourcePath: r => r?.file?.fileDefinition?.resourcePath,
      userDefinitionId: r =>
        r &&
        r.file &&
        r.file.fileDefinition &&
        r.file.fileDefinition._fileDefinitionId,
      sampleData: r => r && r.sampleData,
      visibleWhenAll: [
        {
          field: 'file.type',
          isNot: [''],
        },
      ],
    },
    'file.sortByFields': {
      fieldId: 'file.sortByFields',
      isLoggable: true,
      type: 'sortandgroup',
      enableSorting: true,
      keyName: 'field',
      valueName: 'descending',
      valueType: 'keyvalue',
      showDelete: true,
      sampleData: r => r && r.sampleData,
      defaultValue: r => (r.file?.sortByFields) || '',
      label: 'Sort records by fields',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'file.groupByFields': {
      fieldId: 'file.groupByFields',
      isLoggable: true,
      type: 'sortandgroup',
      label: 'Group records by fields',
      defaultValue: r => r.file?.groupByFields,
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    advancedSettings: { formId: 'advancedSettings' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common'] },
      {
        collapsed: true,
        label: 'How would you like to parse files?',
        type: 'indent',
        fields: [
          'file.type',
          'edix12.format',
          'edifact.format',
          'file.filedefinition.rules',
        ],
      },
      {
        collapsed: true,
        label: 'How would you like to group and sort records?',
        fields: [
          'file.sortByFields',
          'file.groupByFields',
        ],
      },
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
  actions: [
    {
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'file.type',
          isNot: ['filedefinition', 'delimited/edifact'],
        },
      ],
    },
    {
      // Button that saves file defs and then submit resource
      id: 'savefiledefinitions',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'delimited/edifact'],
        },
      ],
    },
  ],
};
