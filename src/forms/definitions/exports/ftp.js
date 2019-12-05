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
    } else {
      // make visibility of format fields false incase of edit mode of file adaptors
      const fields = ['edix12.format', 'fixed.format', 'edifact.format'];

      fields.forEach(field => {
        const formatField = fieldMeta.fieldMap[field];

        delete formatField.visibleWhenAll;
        formatField.visible = false;
      });
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
          is: ['records'],
        },
      ],
    },
    fileAdvancedSettings: { formId: 'fileAdvancedSettings' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    fields: [
      'common',
      'outputMode',
      'exportOneToMany',
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
