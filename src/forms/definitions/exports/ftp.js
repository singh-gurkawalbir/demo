import { isNewId } from '../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    if (newValues['/outputMode'] === 'BLOB') {
      newValues['/file/skipDelete'] = newValues['/ftp/leaveFile'];
      newValues['/file/output'] = 'blobKeys';
      newValues['/file/type'] = undefined;
    }

    return {
      ...newValues,
    };
  },
  init: fieldMeta => {
    const fileDefinitionRulesField =
      fieldMeta.fieldMap['file.filedefinition.rules'];

    if (!fileDefinitionRulesField.userDefinitionId) {
      // In Export creation mode, delete generic visibleWhenAll rules
      // Add custom visible when rules
      delete fileDefinitionRulesField.visibleWhenAll;
      fileDefinitionRulesField.visibleWhen = [
        {
          field: 'edix12.format',
          isNot: [''],
        },
        {
          field: 'fixed.format',
          isNot: [''],
        },
        {
          field: 'edifact.format',
          isNot: [''],
        },
      ];
    }

    return fieldMeta;
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
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return 'RECORDS';

        const output = r && r.file && r.file.type;

        return output ? 'RECORDS' : 'BLOB';
      },
    },
    'ftp.directoryPath': { fieldId: 'ftp.directoryPath' },
    'file.output': {
      fieldId: 'file.output',
      defaultValue: r => (r && r.file && r.file.output) || 'records',
    },
    'ftp.fileNameStartsWith': { fieldId: 'ftp.fileNameStartsWith' },
    'ftp.fileNameEndsWith': { fieldId: 'ftp.fileNameEndsWith' },
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
      'ftp.directoryPath',
      'file.output',
      'ftp.fileNameStartsWith',
      'ftp.fileNameEndsWith',
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
