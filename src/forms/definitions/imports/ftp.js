import { IMPORT_FILE_FIELD_MAP } from '../../../utils/fileUtil';

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

    if (newValues['/inputMode'] === 'blob') {
      newValues['/file/fileName'] = newValues['/ftp/blobFileName'];
      newValues['/ftp/useTempFile'] = newValues['/ftp/blobUseTempFile'];
      newValues['/ftp/inProgressFileName'] =
        newValues['/ftp/blobInProgressFileName'];
      delete newValues['/ftp/blobFileName'];
      delete newValues['/ftp/blobUseTempFile'];
      delete newValues['/ftp/blobInProgressFileName'];
    } else {
      delete newValues['/blobKeyPath'];
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

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
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
    }

    return null;
  },
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
          'ftp.blobFileName',
          'file.lookups',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'ftp.useTempFile',
          'ftp.inProgressFileName',
          'ftp.blobUseTempFile',
          'ftp.blobInProgressFileName',
          'file.backupPath',
          'file.encoding',
          'blobKeyPath',
          'fileAdvancedSettings',
          'deleteAfterImport',
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
