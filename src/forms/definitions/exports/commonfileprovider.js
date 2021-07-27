import { EXPORT_FILE_FIELD_MAP, getFileProviderExportsOptionsHandler, updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    const jsonResourcePath = newValues['/file/json/resourcePath'] || {};

    if (typeof jsonResourcePath === 'object' && 'resourcePathToSave' in jsonResourcePath) {
      newValues['/file/json/resourcePath'] = jsonResourcePath.resourcePathToSave || '';
    }
    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
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
    if (!newValues['/file/decrypt']) {
      newValues['/file/decrypt'] = undefined;
    }
    newValues['/http/relativeURI'] = newValues['/http/fileRelativeURI'];
    delete newValues['/http/fileRelativeURI'];

    return {
      ...newValues,
    };
  },
  optionsHandler: getFileProviderExportsOptionsHandler,
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
          'http.fileRelativeURI',
          'file.fileNameStartsWith',
          'file.fileNameEndsWith',
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
          'file.encoding',
          'file.backupPath',
          'pageSize',
          'dataURITemplate',
          'skipRetries',
          'traceKeyTemplate',
          'apiIdentifier',
          'file.batchSize',
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
  ],
};
