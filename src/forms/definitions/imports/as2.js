import { alterFileDefinitionRulesVisibility } from '../../utils';

export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.csv') {
      const includeHeaderField = fields.find(
        field => field.id === 'file.csv.includeHeader'
      );
      const columnDelimiterField = fields.find(
        field => field.id === 'file.csv.columnDelimiter'
      );
      const rowDelimiterField = fields.find(
        field => field.id === 'file.csv.rowDelimiter'
      );
      const replaceNewlineWithSpaceField = fields.find(
        field => field.id === 'file.csv.replaceNewlineWithSpace'
      );
      const replaceTabWithSpaceField = fields.find(
        field => field.id === 'file.csv.replaceTabWithSpace'
      );
      const wrapWithQuotesField = fields.find(
        field => field.id === 'file.csv.wrapWithQuotes'
      );

      return {
        includeHeader: (includeHeaderField && includeHeaderField.value) || true,
        columnDelimiter:
          (columnDelimiterField && columnDelimiterField.value) || ',',
        rowDelimiter: (rowDelimiterField && rowDelimiterField.value) || '\n',
        replaceNewlineWithSpace: !!(
          replaceNewlineWithSpaceField && replaceNewlineWithSpaceField.value
        ),
        replaceTabWithSpace: !!(
          replaceTabWithSpaceField && replaceTabWithSpaceField.value
        ),
        wrapWithQuotes: !!(wrapWithQuotesField && wrapWithQuotesField.value),
      };
    } else if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;
      const fileType = fields.find(field => field.id === 'file.type');

      // Fetch format specific Field Definition field to fetch id
      if (fileType.value === 'filedefinition')
        definitionFieldId = 'edix12.format';
      else if (fileType.value === 'fixed') definitionFieldId = 'fixed.format';
      else definitionFieldId = 'edifact.format';
      const definition = fields.find(field => field.id === definitionFieldId);

      alterFileDefinitionRulesVisibility(fields);

      return {
        format: definition && definition.format,
        definitionId: definition && definition.value,
      };
    } else if (fieldId === 'as2.fileNameTemplate') {
      const fileNameField = fields.find(field => field.fieldId === fieldId);
      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const newExtension = [
        'filedefinition',
        'fixed',
        'delimited/edifact',
      ].includes(fileTypeField.value)
        ? 'edi'
        : fileTypeField.value;

      if (newExtension) {
        const fileName = fileNameField.value;
        const lastDotIndex = fileName.lastIndexOf('.');
        const fileNameWithoutExt =
          lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

        fileNameField.value = `${fileNameWithoutExt}.${newExtension}`;
      }
    } else if (fieldId === 'dataURITemplate') {
      const nameField = fields.find(field => field.fieldId === 'name');

      return {
        resourceName: nameField && nameField.value,
      };
    }

    return null;
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
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/xml/body'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xml/body'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/xml/body'];
    }

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    delete newValues['/file/compressFiles'];
    newValues['/file/skipAggregation'] = true;

    return {
      ...newValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    distributed: { fieldId: 'distributed', defaultValue: false },

    'file.csv': { fieldId: 'file.csv' },
    'file.csv.includeHeader': { fieldId: 'file.csv.includeHeader' },
    'file.csv.columnDelimiter': { fieldId: 'file.csv.columnDelimiter' },
    'file.csv.rowDelimiter': { fieldId: 'file.csv.rowDelimiter' },
    'file.csv.replaceNewlineWithSpace': {
      fieldId: 'file.csv.replaceNewlineWithSpace',
    },
    'file.csv.replaceTabWithSpace': { fieldId: 'file.csv.replaceTabWithSpace' },
    'file.csv.wrapWithQuotes': { fieldId: 'file.csv.wrapWithQuotes' },
    'file.xlsx.includeHeader': { fieldId: 'file.xlsx.includeHeader' },
    'as2.fileNameTemplate': { fieldId: 'as2.fileNameTemplate' },
    'as2.messageIdTemplate': { fieldId: 'as2.messageIdTemplate' },
    'as2.headers': { fieldId: 'as2.headers' },
    dataMappings: { formId: 'dataMappings' },
    compressFiles: { formId: 'compressFiles' },
    'as2.maxRetries': { fieldId: 'as2.maxRetries' },
    'file.lookups': { fieldId: 'file.lookups', visible: false },
    'file.type': { fieldId: 'file.type' },
    'edifact.format': { fieldId: 'edifact.format' },
    'fixed.format': { fieldId: 'fixed.format' },
    'edix12.format': { fieldId: 'edix12.format' },
    'file.filedefinition.rules': {
      fieldId: 'file.filedefinition.rules',
      refreshOptionsOnChangesTo: [
        'edix12.format',
        'fixed.format',
        'edifact.format',
        'file.type',
      ],
      required: true,
    },
    'file.xml.body': {
      id: 'file.xml.body',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'XML document builder',
      title: 'Build XML document',
      refreshOptionsOnChangesTo: ['file.type'],
      required: true,
      visibleWhenAll: [
        {
          field: 'file.type',
          is: ['xml'],
        },
      ],
    },
  },
  layout: {
    fields: ['common', 'dataMappings'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like the files transferred?',
        fields: [
          'distributed',
          'file.type',
          'edifact.format',
          'fixed.format',
          'edix12.format',
          'as2.fileNameTemplate',
          'as2.messageIdTemplate',
          'file.xml.body',
          'file.csv',
          'file.csv.includeHeader',
          'file.csv.columnDelimiter',
          'file.csv.rowDelimiter',
          'file.csv.replaceNewlineWithSpace',
          'file.csv.replaceTabWithSpace',
          'file.csv.wrapWithQuotes',
          'file.xlsx.includeHeader',
          'file.filedefinition.rules',
          'as2.headers',
          'file.lookups',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['compressFiles', 'as2.maxRetries'],
      },
    ],
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
