import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/outputMode'] === 'blob') {
      newValues['/file/skipDelete'] = newValues['/ftp/leaveFile'];
      newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    }

    delete newValues['/outputMode'];

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
      required: true,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob Keys', value: 'blob' },
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
    'file.output': { fieldId: 'file.output' },
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
  actions: [
    {
      id: 'cancel',
    },
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
  ],
};
