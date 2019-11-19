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
    'netsuite.blob.purgeFileAfterExport': {
      fieldId: 'netsuite.blob.purgeFileAfterExport',
    },
  },
  layout: {
    fields: [
      'common',
      'exportOneToMany',
      'netsuite.internalId',
      'netsuite.blob.purgeFileAfterExport',
    ],
  },
};
