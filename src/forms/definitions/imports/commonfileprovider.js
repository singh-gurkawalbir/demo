import { getfileProviderImportsOptionsHandler, IMPORT_FILE_FIELD_MAP, updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

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
  optionsHandler: getfileProviderImportsOptionsHandler,
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
