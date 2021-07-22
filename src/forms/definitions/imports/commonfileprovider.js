import { IMPORT_FILE_FIELD_MAP } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/xml/body'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/replaceNewlineWithSpace'];
      delete newValues['/file/csv/replaceTabWithSpace'];
      delete newValues['/file/csv/wrapWithQuotes'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/replaceNewlineWithSpace'];
      delete newValues['/file/csv/replaceTabWithSpace'];
      delete newValues['/file/csv/wrapWithQuotes'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/csv/rowDelimiter'];
      delete newValues['/file/csv/replaceNewlineWithSpace'];
      delete newValues['/file/csv/replaceTabWithSpace'];
      delete newValues['/file/csv/wrapWithQuotes'];
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
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }

    if (newValues['/inputMode'] !== 'blob') {
      delete newValues['/blobKeyPath'];
      delete newValues['/blob'];
    } else {
      newValues['/blob'] = true;
    }

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    if (!newValues['/file/encoding']) {
      newValues['/file/encoding'] = undefined;
    }
    if (!newValues['/file/encrypt']) {
      newValues['/file/encrypt'] = undefined;
    }
    if (!newValues['/file/pgp/symmetricKeyAlgorithm']) {
      newValues['/file/pgp/symmetricKeyAlgorithm'] = undefined;
    }
    if (!newValues['/file/pgp/hashAlgorithm']) {
      newValues['/file/pgp/hashAlgorithm'] = undefined;
    }
    delete newValues['/file/compressFiles'];
    delete newValues['/inputMode'];
    newValues['/http/method'] = 'POST';
    newValues['/http/type'] = 'file';
    newValues['/http/response'] = {
      resourcePath: 'files',
    };
    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    if (newValues['/oneToMany'] === 'false') {
      newValues['/pathToMany'] = undefined;
    }

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
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
    }

    return null;
  },
  fieldMap: {...IMPORT_FILE_FIELD_MAP,
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: ['common', 'dataMappings', 'inputMode'],
      },
      {
        collapsed: true,
        label: 'How would you like to generate files?',
        fields: ['fileType', 'uploadFile', 'file.xlsx.includeHeader'],
        type: 'indent',
        containers: [{fields: [
          'file.csv',
        ]}],
      },
      {
        collapsed: true,
        label: 'Where would you like the files transferred?',
        fields: [
          'http.relativeURI',
          'file.fileName',
          'file.xml.body',
          'file.json.body',
          'file.lookups',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'fileAdvanced',
          'file.encoding',
          'blobKeyPath',
          'fileAdvancedSettings',
          'file.backupPath',
          'deleteAfterImport',
          'traceKeyTemplate',
          'fileApiIdentifier',
        ],
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
