export default {
  preSave: formValues => {
    const newValues = formValues;

    newValues['/export/netsuite/restlet/ignoreFilter'] = undefined;

    if (newValues['/export/type'] === 'all') {
      newValues['/export/delta'] = undefined;
      newValues['/export/once'] = undefined;
      newValues['/export/test'] = undefined;
      newValues['/export/valueDelta'] = undefined;
      newValues['/export/netsuite/restlet/ignoreFilter'] = true;
      delete newValues['/export/delta/dateField'];
      delete newValues['/export/once/booleanField'];
      delete newValues['/export/valueDelta/exportedField'];
      delete newValues['/export/valueDelta/pendingField'];
    } else if (newValues['/export/type'] === 'delta') {
      newValues['/export/once'] = undefined;
      newValues['/export/test'] = undefined;
      newValues['/export/valueDelta'] = undefined;
      delete newValues['/export/once/booleanField'];
      delete newValues['/export/valueDelta/exportedField'];
      delete newValues['/export/valueDelta/pendingField'];
    } else if (newValues['/export/type'] === 'once') {
      newValues['/export/delta'] = undefined;
      newValues['/export/test'] = undefined;
      newValues['/export/valueDelta'] = undefined;
      delete newValues['/export/delta/dateField'];
      delete newValues['/export/valueDelta/exportedField'];
      delete newValues['/export/valueDelta/pendingField'];
    } else if (newValues['/export/type'] === 'test') {
      newValues['/export/delta'] = undefined;
      newValues['/export/once'] = undefined;
      newValues['/export/test/limit'] = 1;
      newValues['/export/valueDelta'] = undefined;
      delete newValues['/export/delta/dateField'];
      delete newValues['/export/once/booleanField'];
      delete newValues['/export/valueDelta/exportedField'];
      delete newValues['/export/valueDelta/pendingField'];
    } else if (newValues['/export/type'] === 'tranlinedelta') {
      newValues['/export/delta'] = undefined;
      newValues['/export/once'] = undefined;
      newValues['/export/test'] = undefined;
      delete newValues['/export/delta/dateField'];
      delete newValues['/export/once/booleanField'];
    }

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    const recordTypeField = fields.find(
      field => field.fieldId === 'export.netsuite.restlet.recordType'
    );

    if (
      ['export.delta.dateField', 'export.once.booleanField'].includes(fieldId)
    ) {
      return {
        commMetaPath:
          recordTypeField &&
          `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    if (
      [
        'export.valueDelta.exportedField',
        'export.valueDelta.pendingField',
      ].includes(fieldId)
    ) {
      return {
        commMetaPath:
          recordTypeField &&
          `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}?includeSelectOptions=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    'export.netsuite.restlet.recordType': {
      fieldId: 'export.netsuite.restlet.recordType',
    },
    'export.netsuite.restlet.searchId': {
      fieldId: 'export.netsuite.restlet.searchId',
    },
    'export.type': {
      fieldId: 'export.type',
    },
    'export.delta.dateField': {
      fieldId: 'export.delta.dateField',
    },
    'export.once.booleanField': {
      fieldId: 'export.once.booleanField',
    },
    'export.valueDelta.exportedField': {
      fieldId: 'export.valueDelta.exportedField',
    },
    'export.valueDelta.pendingField': {
      fieldId: 'export.valueDelta.pendingField',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: [
          'export.netsuite.restlet.recordType',
          'export.netsuite.restlet.searchId',
          'export.type',
          'export.delta.dateField',
          'export.once.booleanField',
          'export.valueDelta.exportedField',
          'export.valueDelta.pendingField',
        ],
        type: 'collapse',
      },
    ],
  },
};
