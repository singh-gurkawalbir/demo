import { alterFileDefinitionRulesVisibility } from '../../formFactory/utils';
import { updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    newValues['/type'] = 'webhook';

    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};

    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    return {
      ...newValues,
    };
  },
  init: fieldMeta => {
    const fileDefinitionRulesField =
      fieldMeta.fieldMap['file.filedefinition.rules'];

    if (fileDefinitionRulesField.userDefinitionId) {
      // make visibility of format fields false incase of edit mode of file adaptors
      const formatField = fieldMeta.fieldMap['edix12.format'];

      delete formatField.visibleWhenAll;
      formatField.visible = false;
    }

    return fieldMeta;
  },
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;

      // Fetch format specific Field Definition field to fetch id
      if (fileType.value === 'filedefinition') definitionFieldId = 'edix12.format';
      else if (fileType.value === 'fixed') definitionFieldId = 'fixed.format';
      else definitionFieldId = 'edifact.format';
      const definition = fields.find(field => field.id === definitionFieldId);
      const resourcePath = fields.find(
        field => field.id === 'file.fileDefinition.resourcePath'
      );

      alterFileDefinitionRulesVisibility(fields);

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
        resourcePath: resourcePath && resourcePath.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    'edix12.format': {
      fieldId: 'edix12.format',
    },
    outputMode: {
      id: 'outputMode',
      type: 'text',
      label: 'Parse files being transferred',
      defaultValue: 'records',
      visible: false,
    },
    'file.type': { fieldId: 'file.type' },
    'file.csv': { fieldId: 'file.csv' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': { fieldId: 'file.xlsx.rowsPerRecord' },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': { fieldId: 'file.xml.resourcePath' },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'fixed.format': { fieldId: 'fixed.format' },
    'edifact.format': { fieldId: 'edifact.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.fileDefinition.resourcePath',
        'file.type',
      ],
      required: true,
    },
    advancedSettings: { formId: 'advancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['common', 'exportOneToMany'] },
      {
        collapsed: true,
        label: 'How would you like to parse files?',
        type: 'indent',
        fields: [
          'outputMode',
          'file.type',
          'file.xml.resourcePath',
          'file.json.resourcePath',
          'file.xlsx.hasHeaderRow',
          'file.xlsx.rowsPerRecord',
          'file.xlsx.keyColumns',
          'edix12.format',
          'fixed.format',
          'edifact.format',
          'file.filedefinition.rules',
        ],
        containers: [{fields: [
          'file.csv',
        ]}],
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
          isNot: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
    {
      // Button that saves file defs and then submit resource
      id: 'savefiledefinitions',
      visibleWhen: [
        {
          field: 'file.type',
          is: ['filedefinition', 'fixed', 'delimited/edifact'],
        },
      ],
    },
  ],
};
