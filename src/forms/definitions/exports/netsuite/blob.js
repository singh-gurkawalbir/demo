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
  },
  layout: {
    fields: ['common', 'netsuite.internalId'],
  },
};
