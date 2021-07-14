import { EXPORT_FILE_FIELD_MAP } from '../../metaDataUtils/fileUtil';
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

    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    if (!newValues['/file/encoding']) {
      newValues['/file/encoding'] = undefined;
    }

    delete newValues['/file/decompressFiles'];
    newValues['/s3/backupBucket'] = undefined;     // TODO Ashok, This code can be removed once all backend issues are resolved.
    if (!newValues['/file/decrypt']) {
      newValues['/file/decrypt'] = undefined;
    }

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'file.xlsx.keyColumns') {
      const keyColoumnField = fields.find(
        field => field.id === 'file.xlsx.keyColumns'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.xlsx.hasHeaderRow'
      );

      // resetting key coloums when hasHeaderRow changes
      if (
        keyColoumnField &&
        keyColoumnField &&
        keyColoumnField.hasHeaderRow !== hasHeaderRowField.value
      ) {
        keyColoumnField.value = [];
        keyColoumnField.hasHeaderRow = hasHeaderRowField.value;
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
          's3.region',
          's3.bucket',
          's3.keyStartsWith',
          's3.keyEndsWith',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'fileAdvanced',
          'file.decompressFiles',
          'file.compressionFormat',
          'file.skipDelete',
          'fileMetadata',
          'file.backupPath',
          'file.encoding',
          'pageSize',
          'dataURITemplate',
          'skipRetries',
          'traceKeyTemplate',
          'apiIdentifier',
        ],
      },
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
    {
      id: 'cancel',
    },
  ],
};
