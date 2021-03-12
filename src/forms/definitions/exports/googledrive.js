import { EXPORT_FILE_FIELD_MAP } from '../../../utils/fileUtil';
import { alterFileDefinitionRulesVisibility } from '../../formFactory/utils';

export default {
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
      // TODO: Ashok needs to revisit on delete form values.
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
    newValues['/type'] = undefined;

    if (newValues['/outputMode'] === 'blob') {
      if (newValues['/fileMetadata']) {
        newValues['/file/output'] = 'metadata';
      } else {
        newValues['/file/output'] = 'blobKeys';
        newValues['/type'] = 'blob';
      }
      newValues['/file/type'] = undefined;
    } else {
      newValues['/file/output'] = 'records';
    }

    delete newValues['/outputMode'];
    delete newValues['/fileMetadata'];

    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    if (!newValues['/file/encoding']) {
      newValues['/file/encoding'] = undefined;
    }
    newValues['/http/method'] = 'GET';
    newValues['/http/type'] = 'file';
    newValues['/file/encoding'] = undefined;
    newValues['/http/response'] = {
      resourcePath: 'files',
    };
    delete newValues['/file/decompressFiles'];
    if (newValues['/file/fileNameStartsWith'] && newValues['/file/fileNameEndsWith']) {
      newValues['/file/filter'] = {
        type: 'expression',
        expression: {
          version: '1',
          rules: ['and',
            ['startswith', ['string', ['extract', 'name']], newValues['/file/fileNameStartsWith']],
            ['endswith', ['string', ['extract', 'name']], newValues['/file/fileNameEndsWith']]],
        },
      };
    } else if (newValues['/file/fileNameStartsWith']) {
      newValues['/file/filter'] = {
        type: 'expression',
        expression: {
          version: '1',
          rules:
            ['startswith', ['string', ['extract', 'name']], newValues['/file/fileNameStartsWith']],
        },
      };
    } else if (newValues['/file/fileNameEndsWith']) {
      newValues['/file/filter'] = {
        type: 'expression',
        expression: {
          version: '1',
          rules:
            ['endswith', ['string', ['extract', 'name']], newValues['/file/fileNameEndsWith']],
        },
      };
    } else {
      newValues['/file/filter'] = undefined;
    }

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
        keyColumnField.hasHeaderRow !== hasHeaderRowField.value
      ) {
        keyColumnField.value = [];
        keyColumnField.hasHeaderRow = hasHeaderRowField.value;
      }

      return {
        hasHeaderRow: hasHeaderRowField.value,
        fileType: fileType.value,
      };
    }

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }
    if (fieldId === 'file.filedefinition.rules') {
      let definitionFieldId;

      // Fetch format specific Field Definition field to fetch id
      // TODO: Raghu to refactor this code.
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
    ...EXPORT_FILE_FIELD_MAP,
  },
  layout: {
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
        ]}],
      },
      {
        collapsed: true,
        label: 'Where would you like to transfer from?',
        fields: [
          'http.relativeURI',
          'file.fileNameStartsWith',
          'file.fileNameEndsWith',
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
          'file.encoding',
          'file.backupPath',
          'pageSize',
          'dataURITemplate',
          'skipRetries',
          'apiIdentifier',
          'file.batchSize',
          'traceKeyTemplate'],
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
