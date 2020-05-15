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
      newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    }

    delete newValues['/outputMode'];

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
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to transfer?',
    },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Do you need to parse files?',
      required: true,
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
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    's3.keyStartsWith': { fieldId: 's3.keyStartsWith' },
    's3.keyEndsWith': { fieldId: 's3.keyEndsWith' },
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
  },
  layout: {
    fields: [
      'common',
      'outputMode',
      'exportData',
      's3.region',
      's3.bucket',
      's3.keyStartsWith',
      's3.keyEndsWith',
      'file',
      'ftp.leaveFile',
    ],
    type: 'collapse',
    containers: [
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
