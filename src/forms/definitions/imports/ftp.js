import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    delete newValues['/file/csvHelper'];

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
    }

    if (newValues['/inputMode'] === 'blob') {
      newValues['/ftp/fileName'] = newValues['/ftp/blobFileName'];
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

    delete newValues['/file/compressFiles'];
    delete newValues['/inputMode'];

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'ftp.fileName') {
      const fileNameField = fields.find(field => field.fieldId === fieldId);
      const fileTypeField = fields.find(field => field.fieldId === 'file.type');
      const newExtension = [
        'filedefinition',
        'fixed',
        'delimited/edifact',
      ].includes(fileTypeField.value)
        ? 'edi'
        : fileTypeField.value;

      if (newExtension) {
        const fileName = fileNameField.value;
        const lastDotIndex = fileName.lastIndexOf('.');
        const fileNameWithoutExt =
          lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

        fileNameField.value = `${fileNameWithoutExt}.${newExtension}`;
      }
    } else if (fieldId === 'ftp.inProgressFileName') {
      const inprogressFileNameField = fields.find(
        field => field.fieldId === fieldId
      );
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
    }

    const fileType = fields.find(field => field.id === 'file.type');

    if (fieldId === 'uploadFile') {
      return fileType.value;
    }

    return null;
  },
  fieldMap: {
    common: {
      formId: 'common',
    },
    'ftp.directoryPath': {
      fieldId: 'ftp.directoryPath',
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
    'ftp.fileName': {
      fieldId: 'ftp.fileName',
    },
    'file.xml.body': {
      id: 'file.xml.body',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'XML document builder',
      title: 'Build XML document',
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
    file: {
      formId: 'file',
      visibleWhenAll: [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ],
    },
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
  },
  layout: {
    fields: ['common', 'dataMappings', 'inputMode'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like to generate files?',
        fields: ['fileType', 'file'],
      },
      {
        collapsed: true,
        label: 'Where would you like the files transferred?',
        fields: [
          'ftp.directoryPath',
          'ftp.fileName',
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
      id: 'cancel',
    },
  ],
};
