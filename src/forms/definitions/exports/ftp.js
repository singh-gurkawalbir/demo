import { isNewId } from '../../../utils/resource';
import { isLookupResource } from '../../../utils/flows';
import { alterFileDefinitionRulesVisibility } from '../../utils';

export default {
  init: (fieldMeta, resource = {}, flow) => {
    const exportPanelField = fieldMeta.fieldMap.exportPanel;

    if (isLookupResource(flow, resource)) {
      exportPanelField.visible = false;
    }

    return fieldMeta;
  },
  preSave: formValues => {
    const newValues = { ...formValues };

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
      delete newValues['/parsers'];
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
      newValues['/file/xml/resourcePath'] = newValues['/parsers']?.resourcePath;
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

      delete newValues['/parsers'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/parsers'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    } else {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/hasHeaderRow'];
      delete newValues['/file/csv/rowsPerRecord'];
      delete newValues['/file/csv/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/parsers'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }

    if (newValues['/outputMode'] === 'blob') {
      if (newValues['/fileMetadata']) {
        newValues['/file/output'] = 'metadata';
      } else newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    } else {
      newValues['/file/output'] = 'records';
    }

    delete newValues['/outputMode'];
    delete newValues['/fileMetadata'];

    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    delete newValues['/file/decompressFiles'];

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'file.xlsx.keyColumns') {
      const keyColumnField = fields.find(
        field => field.id === 'file.xlsx.keyColumns'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.xlsx.hasHeaderRow'
      );

      // resetting key columns when hasHeaderRow changes
      if (
        keyColumnField &&
        keyColumnField &&
        keyColumnField.hasHeaderRow !== hasHeaderRowField.value
      ) {
        keyColumnField.value = [];
        keyColumnField.hasHeaderRow = hasHeaderRowField.value;
      }

      return {
        hasHeaderRow: hasHeaderRowField.value,
        fileType: fileType.value
      };
    }

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
  },
  fieldMap: {
    common: { formId: 'common' },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Parse files being transferred',
      helpKey: 'export.outputMode',
      options: [
        {
          items: [
            { label: 'Yes', value: 'records' },
            { label: 'No', value: 'blob' },
          ],
        },
      ],
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },

      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return 'records';

        const output = r && r.file && r.file.type;

        return output ? 'records' : 'blob';
      },
    },
    'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },
    'ftp.fileNameStartsWith': { fieldId: 'ftp.fileNameStartsWith' },
    'ftp.fileNameEndsWith': { fieldId: 'ftp.fileNameEndsWith' },
    'ftp.backupDirectoryPath': {fieldId: 'ftp.backupDirectoryPath'},
    'file.type': { fieldId: 'file.type' },
    uploadFile: {
      fieldId: 'uploadFile',
      refreshOptionsOnChangesTo: 'file.type',
      placeholder: 'Sample file (that would be parsed):',
    },
    'file.csv': { fieldId: 'file.csv',
      uploadSampleDataFieldName: 'uploadFile',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'file.type',
          is: ['csv'],
        },
      ], },
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
    parsers: {
      fieldId: 'parsers',
      uploadSampleDataFieldName: 'uploadFile',
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
    fileMetadata: {
      id: 'fileMetadata',
      type: 'checkbox',
      label: 'File metadata only',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['blob'],
        },
      ],
      defaultValue: r => r && r.file && r.file.output === 'metadata',
    },
    'file.decompressFiles': {
      id: 'file.decompressFiles',
      type: 'checkbox',
      label: 'Decompress files',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
        {
          field: 'file.output',
          is: ['records'],
        },
      ],
      defaultValue: r => !!(r && r.file && r.file.compressionFormat),
    },
    'file.compressionFormat': {
      fieldId: 'file.compressionFormat',
      visibleWhen: [{ field: 'file.decompressFiles', is: [true] }],
    },
    'file.skipDelete': { fieldId: 'file.skipDelete' },
    'file.encoding': { fieldId: 'file.encoding' },
    pageSize: {
      fieldId: 'pageSize',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhen: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    skipRetries: {
      fieldId: 'skipRetries',
    },
    apiIdentifier: { fieldId: 'apiIdentifier' },
    exportOneToMany: { formId: 'exportOneToMany' },
    exportPanel: {
      fieldId: 'exportPanel',
    },
    'file.batchSize': {
      fieldId: 'file.batchSize',
    }
  },
  layout: {
    type: 'column',
    containers: [
      {
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'General',
            fields: ['common', 'outputMode'],
          },
          {
            collapsed: true,
            label: 'How would you like to parse files?',
            fields: [
              'file.type',
              'uploadFile',
              'file.json.resourcePath',
              'file.xlsx.hasHeaderRow',
              'file.xlsx.rowsPerRecord',
              'file.xlsx.keyColumns',
              'edix12.format',
              'fixed.format',
              'edifact.format',
              'file.filedefinition.rules'],
            type: 'indent',
            containers: [{fields: [
              'parsers',
              'file.csv',
            ]}]
          },
          {
            collapsed: true,
            label: 'Where would you like to transfer from?',
            fields: [
              'ftp.directoryPath',
              'ftp.fileNameStartsWith',
              'ftp.fileNameEndsWith',
            ],
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: [
              'file.decompressFiles',
              'file.compressionFormat',
              'file.skipDelete',
              'fileMetadata',
              'ftp.backupDirectoryPath',
              'file.encoding',
              'pageSize',
              'dataURITemplate',
              'skipRetries',
              'apiIdentifier',
              'file.batchSize'],
          },
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
      id: 'saveandclose',
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
      // Button that saves file defs and then submit resource
      id: 'saveandclosedefinition',
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
