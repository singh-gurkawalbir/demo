import { safeParse } from '../../../utils/string';
import { getfileProviderImportsOptionsHandler, IMPORT_FILE_FIELD_MAP, updateFileProviderFormValues } from '../../metaDataUtils/fileUtil';

export default {
  preSave: formValues => {
    const newValues = updateFileProviderFormValues(formValues);

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    if (newValues['/inputMode'] !== 'blob') {
      delete newValues['/blobKeyPath'];
      delete newValues['/blob'];
    } else {
      newValues['/blob'] = true;
    }

    if (!newValues['/file/encoding']) {
      newValues['/file/encoding'] = undefined;
    }

    delete newValues['/file/compressFiles'];

    // TODO Ashok, This code can be removed once all backend issues are resolved.

    newValues['/s3/fileKey'] = undefined;
    newValues['/s3/backupBucket'] = undefined;
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
    newValues['/mockResponse'] = safeParse(newValues['/mockResponse']);

    if (!newValues['/s3/serverSideEncryptionType']) {
      newValues['/s3/serverSideEncryptionType'] = undefined;
    } else {
      newValues['/s3/serverSideEncryptionType'] = 'AES256';
    }

    return {
      ...newValues,
    };
  },
  optionsHandler: getfileProviderImportsOptionsHandler,
  fieldMap: {...IMPORT_FILE_FIELD_MAP},
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
          's3.region',
          's3.bucket',
          'file.fileName',
          'file.xml.body',
          'file.json.body',
          'file.lookups',
          's3.serverSideEncryptionType',
        ],
      },
      {
        actionId: 'mockResponse',
        collapsed: true,
        label: 'Mock response',
        fields: ['mockResponseSection'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'fileAdvanced',
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
