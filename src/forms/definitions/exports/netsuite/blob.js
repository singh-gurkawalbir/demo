export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    newValues['/type'] = 'blob';
    newValues['/netsuite/type'] = undefined;

    return newValues;
  },
  fieldMap: {
    common: { formId: 'common' },
    'netsuite.internalId': { fieldId: 'netsuite.internalId' },
    exportOneToMany: { formId: 'exportOneToMany' },
    exportData: {
      fieldId: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to Export?',
    },
    'netsuite.blob.purgeFileAfterExport': {
      fieldId: 'netsuite.blob.purgeFileAfterExport',
    },
  },
  layout: {
    fields: [
      'common',
      'exportOneToMany',
      'exportData',
      'netsuite.internalId',
      'netsuite.blob.purgeFileAfterExport',
    ],
  },
};
