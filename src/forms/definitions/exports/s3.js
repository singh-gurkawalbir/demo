export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/outputMode'] === 'BLOB') {
      newValues['/file/skipDelete'] = newValues['/ftp/leaveFile'];
      newValues['/file/output'] = 'blobKeys';
    }

    return {
      ...newValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    outputMode: {
      id: 'outputMode',
      type: 'radiogroup',
      label: 'Output Mode',
      options: [
        {
          items: [
            { label: 'Records', value: 'RECORDS' },
            { label: 'Blob Keys', value: 'BLOB' },
          ],
        },
      ],
      defaultValue: r => {
        const output = r && r.file && r.file.output;

        if (!output) return 'RECORDS';

        return output;
      },
    },
    's3.region': { fieldId: 's3.region' },
    's3.bucket': { fieldId: 's3.bucket' },
    'file.output': { fieldId: 'file.output' },
    's3.keyStartsWith': { fieldId: 's3.keyStartsWith' },
    's3.keyEndsWith': { fieldId: 's3.keyEndsWith' },
    'ftp.leaveFile': { fieldId: 'ftp.leaveFile' },
    file: {
      formId: 'file',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['RECORDS'],
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
      'file.output',
      's3.keyStartsWith',
      's3.keyEndsWith',
      'file',
      'ftp.leaveFile',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['fileAdvancedSettings'] },
    ],
  },
};
