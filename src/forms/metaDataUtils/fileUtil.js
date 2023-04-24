import { isNewId } from '../../utils/resource';

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
  fileAdvanced: { formId: 'fileAdvanced' },
  'http.fileRelativeURI': {
    fieldId: 'http.fileRelativeURI',
    defaultValue: r => r.http?.relativeURI,
    label: r => ['googledrive', 'box', 'dropbox'].includes(r?.assistant) ? 'Directory path' : 'Container name',
    required: true,
    type: 'uri',
    helpKey: r => ['googledrive', 'box', 'dropbox'].includes(r?.assistant) ? `export.${r?.assistant}.directoryPath` : 'export.azure.containerName',
  },
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
    validWhen: {
      matchesRegEx: {
        pattern: '^[\\d]+$',
        message: 'Only numbers allowed',
      },
    },
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
  traceKeyTemplate: {
    fieldId: 'traceKeyTemplate',
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
  'file.sortByFields': { fieldId: 'file.sortByFields' },
  'file.groupByFields': { fieldId: 'file.groupByFields' },
  mockOutput: { fieldId: 'mockOutput' },
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
'http.relativeURI': {
  fieldId: 'http.relativeURI',
  label: r => ['googledrive', 'box', 'dropbox'].includes(r?.assistant) ? 'Directory path' : 'Container name',
  required: true,
  type: 'uri',
  helpKey: r => ['googledrive', 'box', 'dropbox'].includes(r?.assistant) ? `import.${r?.assistant}.directoryPath` : 'import.azure.containerName',

},
'file.fileName': {
  fieldId: 'file.fileName', required: true,
},
fileAdvanced: { formId: 'fileAdvanced' },
'file.xml.body': {
  id: 'file.xml.body',
  type: 'httprequestbody',
  connectionId: r => r && r._connectionId,
  label: 'XML document',
  refreshOptionsOnChangesTo: ['file.type'],
  required: true,
  helpKey: 'import.ftp.XMLDocument',
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
'file.json.body': {
  id: 'file.json.body',
  type: 'httprequestbody',
  label: 'JSON document',
  refreshOptionsOnChangesTo: ['file.type'],
  visibleWhenAll: [
    {
      field: 'file.type',
      is: ['json'],
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

  defaultValue: r => (r && r.blob ? 'blob' : 'records'),
},
'file.encoding': {
  fieldId: 'file.encoding',
},
'file.batchSize': {
  fieldId: 'file.batchSize',
  visibleWhenAll: [
    {
      field: 'inputMode',
      is: ['records'],
    },
  ],
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
's3.serverSideEncryptionType': {
  fieldId: 's3.serverSideEncryptionType',
},
traceKeyTemplate: {fieldId: 'traceKeyTemplate'},
mockResponseSection: {formId: 'mockResponseSection'},
};
export const updatePGPFormValues = formValues => {
  const newValues = { ...formValues };

  if (!newValues['/usePgp']) {
    delete newValues['/pgp/publicKey'];
    delete newValues['/pgp/privateKey'];
    delete newValues['/pgp/passphrase'];
    delete newValues['/pgp/compressionAlgorithm'];
    delete newValues['/pgp/asciiArmored'];
    newValues['/pgp'] = undefined;
  } else {
    if (!newValues['/pgp/publicKey']) { newValues['/pgp/publicKey'] = undefined; }
    if (!newValues['/pgp/compressionAlgorithm']) { newValues['/pgp/compressionAlgorithm'] = undefined; }
    if (!newValues['/pgp/privateKey']) { newValues['/pgp/privateKey'] = undefined; }
    if (!newValues['/pgp/passphrase']) { newValues['/pgp/passphrase'] = undefined; }
    if (newValues['/pgp/asciiArmored'] === 'false') {
      newValues['/pgp/asciiArmored'] = false;
    } else {
      newValues['/pgp/asciiArmored'] = true;
    }
  }

  return newValues;
};

export const updateFileProviderFormValues = formValues => {
  const newValues = { ...formValues };

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
    if (newValues['/file/type']) {
      newValues['/file/skipAggregation'] = true;
    }
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

  return newValues;
};

export const getFileProviderExportsOptionsHandler = (fieldId, fields) => {
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

    return {
      format: definition && definition.format,
      definitionId: definition && definition.value,
      resourcePath: resourcePath && resourcePath.value,
    };
  }
  if (fieldId === 'file.encoding') {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fileType.value === 'xlsx') {
      return [
        {
          items: [
            { label: 'UTF-8', value: 'utf8' },
          ],
        },
      ];
    }

    return [
      {
        items: [
          { label: 'UTF-8', value: 'utf8' },
          { label: 'Windows-1252', value: 'win1252' },
          { label: 'UTF-16LE', value: 'utf-16le' },
        ],
      },
    ];
  }
};

export const getfileProviderImportsOptionsHandler = (fieldId, fields) => {
  // DO NOT REMOVE below commented code as it might be required later for ref (same for as2 and s3 import also)

  /* if (fieldId === 'ftp.fileName') {
      const fileNameField = fields.find(field => field.fieldId === fieldId);
      const fileName = fileNameField.value;

      if (!fileName) { return; }
      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const newExtension = [
        'filedefinition',
        'fixed',
        'delimited/edifact',
      ].includes(fileTypeField.value)
        ? 'edi'
        : fileTypeField.value;

      if (newExtension) {
        const lastDotIndex = fileName.lastIndexOf('.'); // fix this logic for multiple dots filename eg {{data.0.name}}
        const fileNameWithoutExt =
          lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

        fileNameField.value = `${fileNameWithoutExt}.${newExtension}`;
      }
    } else if (fieldId === 'ftp.inProgressFileName') {
      const inprogressFileNameField = fields.find(
        field => field.fieldId === fieldId
      );

      if (!inprogressFileNameField.value) { return; }

      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const fileNameField = fields.find(
        field => field.fieldId === 'ftp.fileName'
      );
      const newExtension = [
        'filedefinition',
        'fixed',
        'delimited/edifact',
      ].includes(fileTypeField.value)
        ? 'edi'
        : fileTypeField.value;

      if (newExtension) {
        const fileName = fileNameField.value;
        const endsWithTmp = fileName.endsWith('.tmp');
        // const tmpIndex = fileName.search('.tmp');
        const fileNameWithoutTmp = endsWithTmp
          ? fileName.substring(0, fileName.length - 4)
          : fileName;
        const lastDotIndex = fileNameWithoutTmp.lastIndexOf('.');
        const fileNameWithoutExt =
          lastDotIndex !== -1
            ? fileNameWithoutTmp.substring(0, lastDotIndex)
            : fileNameWithoutTmp;

        inprogressFileNameField.value = `${fileNameWithoutExt}.${newExtension}.tmp`;
      }
    } */

  if (fieldId === 'uploadFile') {
    const uploadFileField = fields.find(
      field => field.fieldId === 'uploadFile'
    );
    // if there is a uploadFileField in the form meta
    // then provide the file type if not return null
    // then the prevalent mode value will take over
    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }

    if (uploadFileField) {
      const fileTypeField = fields.find(
        field => field.fieldId === 'file.type'
      );

      return fileTypeField.value.toLowerCase();
    }
  } else if (fieldId === 'file.skipAggregation') {
    const fileType = fields.find(field => field.id === 'file.type');
    const skipAggregationField = fields.find(field => field.id === fieldId);
    const batchSize = fields.find(field => field.id === 'file.batchSize')?.value;

    // TODO: value being changed in optionalHandler. check if a DynaForm util to handle inter field dependencies can be created.
    skipAggregationField.value = ['filedefinition', 'fixed', 'delimited/edifact'].includes(fileType.value) || // Skip aggregation should be true for file definitions
    skipAggregationField.defaultValue || // or the user defined value
    batchSize > 1; // or when batchSize is greater than 1
  } else if (fieldId === 'file.encoding') {
    const fileType = fields.find(field => field.id === 'file.type');

    if (fileType.value === 'xlsx') {
      return [
        {
          items: [
            { label: 'UTF-8', value: 'utf8' },
          ],
        },
      ];
    }

    return [
      {
        items: [
          { label: 'UTF-8', value: 'utf8' },
          { label: 'Windows-1252', value: 'win1252' },
          { label: 'UTF-16LE', value: 'utf-16le' },
        ],
      },
    ];
  }

  return null;
};
export const updateHTTPFrameworkFormValues = (formValues, resource, connector) => {
  let httpConnector = connector;

  if (!httpConnector) {
    return formValues;
  }
  if (resource?.http?._httpConnectorApiId) {
    httpConnector = connector.apis.find(api => api._id === resource?.http?._httpConnectorApiId);
  }
  const retValues = { ...formValues };

  if (httpConnector.versioning?.location === 'uri' && httpConnector?.baseURIs?.[0]?.includes('/:_version')) {
    if (retValues['/http/unencrypted/version']) {
      retValues['/http/baseURI'] += `/${retValues['/http/unencrypted/version']}`;
    } else if (retValues['/http/unencrypted']?.version) {
      retValues['/http/baseURI'] += `/${retValues['/http/unencrypted'].version}`;
    } else {
      const versionRelativeURI = httpConnector.versions?.[0]?.name;

      // Regex is used here to remove continuous multiple slashes if there are any
      retValues['/http/ping/relativeURI'] = `/${versionRelativeURI}/${retValues['/http/ping/relativeURI']}`.replace(/([^:]\/)\/+/g, '$1');
    }
  }
  if (httpConnector.versioning?.location === 'header') {
    const {headerName} = httpConnector.versioning;
    let httpHeaders = retValues['/http/headers'];

    if (!httpHeaders) {
      httpHeaders = [];
    }

    if (httpHeaders?.find(header => header.name === headerName)) {
      const index = httpHeaders?.findIndex(header => header.name === headerName);

      httpHeaders[index].value = retValues['/http/unencrypted/version'] || retValues['/http/unencrypted']?.version;
    } else {
      httpHeaders.push({name: headerName, value: retValues['/http/unencrypted/version'] || retValues['/http/unencrypted']?.version});
    }
    retValues['/http/headers'] = httpHeaders;
  }

  retValues['/http/_httpConnectorId'] = connector?._id;
  if (retValues['/http/unencrypted/version']) {
    const version = httpConnector.versions?.find(ver => ver.name === retValues['/http/unencrypted/version']);

    retValues['/http/_httpConnectorVersionId'] = version?._id;
  } else {
    retValues['/http/_httpConnectorVersionId'] = undefined;
  }
  if (!resource?._id || isNewId(resource?._id)) {
    const settingFields = httpConnector?.supportedBy?.connection?.preConfiguredFields?.find(field => field.path === 'settingsForm');
    const fieldMap = settingFields?.values?.[0];

    if (fieldMap) { retValues['/settingsForm'] = {form: fieldMap}; }
  }

  return retValues;
};
