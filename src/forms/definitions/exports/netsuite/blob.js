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
    'netsuite.blob.purgeFileAfterExport': {
      fieldId: 'netsuite.blob.purgeFileAfterExport',
    },
  },
  layout: {
    fields: [
      'common',
      'netsuite.internalId',
      'netsuite.blob.purgeFileAfterExport',
    ],
  },
};
