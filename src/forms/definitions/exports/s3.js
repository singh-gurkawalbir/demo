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
          's3.region',
          's3.bucket',
          's3.keyStartsWith',
          's3.keyEndsWith',
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
  ],
};
