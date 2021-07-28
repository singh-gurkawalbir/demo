import { getfileProviderImportsOptionsHandler, IMPORT_FILE_FIELD_MAP, updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    if (newValues['/inputMode'] === 'blob') {
      newValues['/file/fileName'] = newValues['/ftp/blobFileName'];
      newValues['/blob'] = true;
      newValues['/ftp/useTempFile'] = newValues['/ftp/blobUseTempFile'];
      newValues['/ftp/inProgressFileName'] =
        newValues['/ftp/blobInProgressFileName'];
      delete newValues['/ftp/blobFileName'];
      delete newValues['/ftp/blobUseTempFile'];
      delete newValues['/ftp/blobInProgressFileName'];
    } else {
      delete newValues['/blobKeyPath'];
      delete newValues['/blob'];
    }

    if (newValues['/ftp/useTempFile'] === false) {
      newValues['/ftp/inProgressFileName'] = undefined;
    }

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    if (!newValues['/file/encoding']) {
      newValues['/file/encoding'] = undefined;
    }
    delete newValues['/file/compressFiles'];
    delete newValues['/inputMode'];

    // TODO Ashok, This code can be removed once all backend issues are resolved.

    newValues['/ftp/fileName'] = undefined;
    newValues['/ftp/backupDirectoryPath'] = undefined;
    if (!newValues['/file/encrypt']) {
      newValues['/file/encrypt'] = undefined;
    }
    if (!newValues['/file/pgp/symmetricKeyAlgorithm']) {
      newValues['/file/pgp/symmetricKeyAlgorithm'] = undefined;
    }
    if (!newValues['/file/pgp/hashAlgorithm']) {
      newValues['/file/pgp/hashAlgorithm'] = undefined;
    }
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
  fieldMap: {
    ...IMPORT_FILE_FIELD_MAP,
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
          'ftp.directoryPath',
          'file.fileName',
          'file.xml.body',
          'file.json.body',
          'ftp.blobFileName',
          'file.lookups',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'fileAdvanced',
          'ftp.useTempFile',
          'ftp.inProgressFileName',
          'ftp.blobUseTempFile',
          'ftp.blobInProgressFileName',
          'file.backupPath',
          'file.encoding',
          'blobKeyPath',
          'fileAdvancedSettings',
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
