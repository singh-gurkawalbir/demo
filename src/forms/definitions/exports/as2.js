import { alterFileDefinitionRulesVisibility } from '../../utils';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    delete newValues['/file/csvHelper'];
    newValues['/type'] = 'webhook';

    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};
    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
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
    if (fieldId === 'file.csvHelper') {
      const keyColumnsField = fields.find(
        field => field.id === 'file.csv.keyColumns'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );

      return {
        fields: {
          columnDelimiter: columnDelimiterField && columnDelimiterField.value,
          rowDelimiter: rowDelimiterField && rowDelimiterField.value,
          trimSpaces: trimSpacesField && trimSpacesField.value,
          rowsToSkip: rowsToSkipField && rowsToSkipField.value,
          hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
          keyColumns: keyColumnsField && keyColumnsField.value,
        },
      };
    }
    if (fieldId === 'file.csv.keyColumns') {
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const trimSpacesField = fields.find(
        field => field.id === 'file.csv.trimSpaces'
      );
      const rowsToSkipField = fields.find(
        field => field.id === 'file.csv.rowsToSkip'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.csv.hasHeaderRow'
      );
      const options = {
        columnDelimiter: columnDelimiterField && columnDelimiterField.value,
        rowDelimiter: rowDelimiterField && rowDelimiterField.value,
        trimSpaces: trimSpacesField && trimSpacesField.value,
        rowsToSkip: rowsToSkipField && rowsToSkipField.value,
        hasHeaderRow: hasHeaderRowField && hasHeaderRowField.value,
      };

      return options;
    }
  },
  fieldMap: {
    common: { formId: 'common' },
    'edix12.format': {
      fieldId: 'edix12.format',
    },
    'file.type': { fieldId: 'file.type' },
    'file.csvHelper': { fieldId: 'file.csvHelper' },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.trimSpaces': { fieldId: 'file.csv.trimSpaces' },
    'file.csv.rowsToSkip': { fieldId: 'file.csv.rowsToSkip' },
    'file.csv.hasHeaderRow': { fieldId: 'file.csv.hasHeaderRow' },
    'file.csv.rowsPerRecord': { fieldId: 'file.csv.rowsPerRecord' },
    'file.csv.keyColumns': { fieldId: 'file.csv.keyColumns' },
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
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          { collapsed: true, label: 'General', fields: ['common', 'exportOneToMany'] },
          {
            collapsed: true,
            label: 'How would you like to parse files?',
            type: 'indent',
            fields: [
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
              'file.csvHelper',
              'file.csv.columnDelimiter',
              'file.csv.rowDelimiter',
              'file.csv.trimSpaces',
              'file.csv.rowsToSkip',
              'file.csv.hasHeaderRow',
              'file.csv.rowsPerRecord',
              'file.csv.keyColumns']}]
          },
          { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
        ],
      },
      {
        fields: ['exportPanel'],
      }
    ]

  },
  actions: [
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
    {
      id: 'cancel',
    },
  ],
};
