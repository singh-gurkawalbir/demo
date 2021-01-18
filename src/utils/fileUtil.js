import { isNewId } from './resource';

export const EXPORT_FILE_FIELD_MAP = {common: { formId: 'common' },
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

      if (r && r.isLookup) {
        if (r?.resourceType === 'lookupRecords' || r?.file?.type) {
          return 'records';
        }

        return 'blob';
      }

      if (isNew) return 'records';

      const output = r && r.file && r.file.type;

      return output ? 'records' : 'blob';
    },
  },
  'http.relativeURI': { fieldId: 'http.relativeURI', label: 'Directory path', required: true, type: 'uri'},
  'file.fileNameStartsWith': { fieldId: 'file.fileNameStartsWith' },
  'file.fileNameEndsWith': { fieldId: 'file.fileNameEndsWith' },
  'file.type': { fieldId: 'file.type' },
  'file.backupPath': {
    fieldId: 'file.backupPath',
  },
  uploadFile: {
    fieldId: 'uploadFile',
    refreshOptionsOnChangesTo: 'file.type',
    placeholder: 'Sample file (that would be parsed)',
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
    ] },
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
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'file.type',
        is: ['xml'],
      },
    ],
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
    visibleWhen: [
      {
        field: 'outputMode',
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
  'file.batchSize': {
    fieldId: 'file.batchSize',
  },
  'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },
  'ftp.fileNameStartsWith': { fieldId: 'ftp.fileNameStartsWith' },
  'ftp.fileNameEndsWith': { fieldId: 'ftp.fileNameEndsWith' },
  's3.region': { fieldId: 's3.region' },
  's3.bucket': { fieldId: 's3.bucket' },
  's3.keyStartsWith': { fieldId: 's3.keyStartsWith' },
  's3.keyEndsWith': { fieldId: 's3.keyEndsWith' },
};
export const IMPORT_FILE_FIELD_MAP = {common: {
  formId: 'common',
},
fileType: {
  formId: 'fileType',
  visibleWhenAll: [
    {
      field: 'inputMode',
      is: ['records'],
    },
  ],
},
blobKeyPath: {
  fieldId: 'blobKeyPath',
},
'http.relativeURI': { fieldId: 'http.relativeURI', label: 'Directory path', required: true, type: 'uri' },
'file.fileName': {
  fieldId: 'file.fileName', required: true,
},
'file.xml.body': {
  id: 'file.xml.body',
  type: 'httprequestbody',
  connectionId: r => r && r._connectionId,
  label: 'Build XML document',
  refreshOptionsOnChangesTo: ['file.type'],
  required: true,
  visibleWhenAll: [
    {
      field: 'file.type',
      is: ['xml'],
    },
    {
      field: 'inputMode',
      is: ['records'],
    },
  ],
},
uploadFile: {
  fieldId: 'uploadFile',
  refreshOptionsOnChangesTo: ['file.type'],
  placeholder: 'Sample file (that would be generated)',
  helpKey: 'import.uploadFile',
},
'file.csv': { fieldId: 'file.csv' },
'file.xlsx.includeHeader': { fieldId: 'file.xlsx.includeHeader' },
dataMappings: {
  formId: 'dataMappings',
  visibleWhenAll: [
    {
      field: 'inputMode',
      is: ['records'],
    },
  ],
},
'file.lookups': {
  fieldId: 'file.lookups',
  visible: false,
},
inputMode: {
  id: 'inputMode',
  type: 'mode',
  label: 'Generate files from records:',
  helpKey: 'import.inputMode',
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

  defaultValue: r => (r && r.blobKeyPath ? 'blob' : 'records'),
},
'file.encoding': {
  fieldId: 'file.encoding',
},
'file.backupPath': {
  fieldId: 'file.backupPath',
},
deleteAfterImport: {
  fieldId: 'deleteAfterImport',
  visibleWhen: [
    {
      field: 'inputMode',
      is: ['blob'],
    },
  ],
},
fileAdvancedSettings: {
  formId: 'fileAdvancedSettings',
  visibleWhenAll: [
    {
      field: 'inputMode',
      is: ['records'],
    },
  ],
},
fileApiIdentifier: {
  formId: 'fileApiIdentifier',
},
'ftp.directoryPath': {
  fieldId: 'ftp.directoryPath',
},
'ftp.fileName': {
  fieldId: 'ftp.fileName',
},
'ftp.useTempFile': {
  fieldId: 'ftp.useTempFile',
},
'ftp.inProgressFileName': {
  fieldId: 'ftp.inProgressFileName',
},
'ftp.blobFileName': {
  fieldId: 'ftp.blobFileName',
},
'ftp.blobUseTempFile': {
  fieldId: 'ftp.blobUseTempFile',
},
'ftp.blobInProgressFileName': {
  fieldId: 'ftp.blobInProgressFileName',
},
's3.region': {
  fieldId: 's3.region',
},
's3.bucket': {
  fieldId: 's3.bucket',
},
's3.fileKey': {
  fieldId: 's3.fileKey',
},
};
