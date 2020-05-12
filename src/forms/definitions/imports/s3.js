import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
    };

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/xml/body'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/includeHeader'];
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/includeHeader'];
      delete newValues['/file/csv/columnDelimiter'];
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

    if (newValues['/file/compressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    delete newValues['/file/compressFiles'];

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 's3.fileKey') {
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
    importData: {
      id: 'importData',
      type: 'labeltitle',
      label: `How would you like the data transfered?`,
    },
    inputMode: {
      id: 'inputMode',
      type: 'mode',
      label: 'Do you need to parse files?',
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
    's3.region': {
      fieldId: 's3.region',
    },
    's3.bucket': {
      fieldId: 's3.bucket',
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
    's3.fileKey': {
      fieldId: 's3.fileKey',
    },
    blobKeyPath: {
      fieldId: 'blobKeyPath',
    },
    'file.xml.body': {
      id: 'file.xml.body',
      type: 'httprequestbody',
      connectionId: r => r && r._connectionId,
      label: 'Launch XML builder',
      title: 'XML Document Editor',
      ruleTitle: 'Type your template here.',
      resultTitle: 'Your evaluated result!',
      dataTitle: 'Resources available in your template.',
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
    },
    'file.lookups': {
      fieldId: 'file.lookups',
      visible: false,
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
    fields: [
      'common',
      'inputMode',
      'importData',
      'blobKeyPath',
      's3.region',
      's3.bucket',
      'fileType',
      's3.fileKey',
      'file.xml.body',
      'file',
      'dataMappings',
      'file.lookups',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
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
