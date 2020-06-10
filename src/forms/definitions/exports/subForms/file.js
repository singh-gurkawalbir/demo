import { isNewId } from '../../../../utils/resource';
import { alterFileDefinitionRulesVisibility } from '../../../utils';

export default {
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }
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
        uploadSampleDataFieldName: 'uploadFile',
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
    'file.type': { fieldId: 'file.type' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
      placeholder: 'Sample file (that would be parsed):',
    },
    'file.csvHelper': { fieldId: 'file.csvHelper' },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.trimSpaces': { fieldId: 'file.csv.trimSpaces' },
    'file.csv.rowsToSkip': { fieldId: 'file.csv.rowsToSkip' },
    'file.csv.hasHeaderRow': { fieldId: 'file.csv.hasHeaderRow' },
    'file.csv.rowsPerRecord': { fieldId: 'file.csv.rowsPerRecord' },
    'file.csv.keyColumns': { fieldId: 'file.csv.keyColumns' },
    'file.xlsx.hasHeaderRow': { fieldId: 'file.xlsx.hasHeaderRow' },
    'file.xlsx.rowsPerRecord': {
      fieldId: 'file.xlsx.rowsPerRecord',
      disabledWhenAll: r => {
        if (isNewId(r._id)) {
          return [{ field: 'uploadfile', is: [''] }];
        }

        return [];
      },
    },
    'file.xlsx.keyColumns': { fieldId: 'file.xlsx.keyColumns' },
    'file.xml.resourcePath': {
      fieldId: 'file.xml.resourcePath',
      validWhen: {
        matchesRegEx: {
          pattern: '^/',
          message: "Resource Path should start with '/'",
        },
      },
    },
    'file.json.resourcePath': {
      fieldId: 'file.json.resourcePath',
    },
    'edix12.format': { fieldId: 'edix12.format' },
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
    'file.fileDefinition.resourcePath': {
      fieldId: 'file.fileDefinition.resourcePath',
    },
  },
  layout: {
    fields: [
      'file.type',
      'uploadFile',
      'file.csv.columnDelimiter',
      'file.csv.rowDelimiter',
      'file.csv.trimSpaces',
      'file.csv.rowsToSkip',
      'file.csv.hasHeaderRow',
      'file.csv.rowsPerRecord',
      'file.csv.keyColumns',
      'file.csvHelper',
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
  },
};
