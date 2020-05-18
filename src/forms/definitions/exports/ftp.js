import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/file/json/resourcePath'] === '') {
      newValues['/file/json'] = undefined;
      delete newValues['/file/json/resourcePath'];
    }

    if (newValues['/file/type'] === 'json') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xml') {
      newValues['/file/xlsx'] = undefined;
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'xlsx') {
      newValues['/file/json'] = undefined;
      newValues['/file/csv'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/csv/rowsToSkip'];
      delete newValues['/file/csv/trimSpaces'];
      delete newValues['/file/csv/columnDelimiter'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
    } else if (newValues['/file/type'] === 'csv') {
      newValues['/file/json'] = undefined;
      newValues['/file/xlsx'] = undefined;
      newValues['/file/xml'] = undefined;
      newValues['/file/fileDefinition'] = undefined;
      delete newValues['/file/json/resourcePath'];
      delete newValues['/file/xml/resourcePath'];
      delete newValues['/file/fileDefinition/resourcePath'];
      delete newValues['/file/xlsx/hasHeaderRow'];
      delete newValues['/file/xlsx/rowsPerRecord'];
      delete newValues['/file/xlsx/keyColumns'];
    }

    if (newValues['/outputMode'] === 'blob') {
      newValues['/file/skipDelete'] = newValues['/ftp/leaveFile'];

      if (newValues['/fileMetadata']) {
        newValues['/file/output'] = 'metadata';
      } else newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    }

    delete newValues['/outputMode'];
    delete newValues['/fileMetadata'];

    if (newValues['/file/decompressFiles'] === false) {
      newValues['/file/compressionFormat'] = undefined;
    }

    delete newValues['/file/decompressFiles'];

    return {
      ...newValues,
    };
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'file.xlsx.keyColumns') {
      const keyColoumnField = fields.find(
        field => field.id === 'file.xlsx.keyColumns'
      );
      const hasHeaderRowField = fields.find(
        field => field.id === 'file.xlsx.hasHeaderRow'
      );

      // resetting key coloums when hasHeaderRow changes
      if (
        keyColoumnField &&
        keyColoumnField &&
        keyColoumnField.hasHeaderRow !== hasHeaderRowField.value
      ) {
        keyColoumnField.value = [];
        keyColoumnField.hasHeaderRow = hasHeaderRowField.value;
      }

      return {
        includeHeader: hasHeaderRowField.value,
      };
    }
  },
  fieldMap: {
    common: { formId: 'common' },

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

        // if its create
        if (isNew) return 'records';

        const output = r && r.file && r.file.type;

        return output ? 'records' : 'blob';
      },
    },

    'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },

    'ftp.fileNameStartsWith': { fieldId: 'ftp.fileNameStartsWith' },
    'ftp.fileNameEndsWith': { fieldId: 'ftp.fileNameEndsWith' },
    'ftp.leaveFile': { fieldId: 'ftp.leaveFile' },

    file: {
      formId: 'file',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    fields: ['common', 'outputMode'],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How would you like to parse files?',
        fields: ['file'],
      },
      {
        collapsed: true,
        label: 'Where would you like to transfer from?',
        fields: [
          'ftp.directoryPath',
          'ftp.fileNameStartsWith',
          'ftp.fileNameEndsWith',
          'ftp.leaveFile',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['fileAdvancedSettings'],
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
