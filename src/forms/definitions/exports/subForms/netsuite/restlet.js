export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'restlet.type') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.restlet.recordType'
      );

      return {
        recordType: recordTypeField && recordTypeField.value,
        commMetaPath: `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes`,
      };
    }

    if (
      fieldId === 'restlet.delta.dateField' ||
      fieldId === 'restlet.once.booleanField'
    ) {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.restlet.recordType'
      );

      return {
        commMetaPath:
          recordTypeField &&
          `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    if (fieldId === 'netsuite.restlet.criteria') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.restlet.recordType'
      );
      const criteriaField = fields.find(
        field => field.fieldId === 'netsuite.restlet.criteria'
      );

      return {
        recordType: recordTypeField && recordTypeField.value,
        commMetaPath:
          recordTypeField &&
          recordTypeField.value &&
          `netsuite/metadata/suitescript/connections/${criteriaField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?&includeJoinFilters=true`,
      };
    }

    if (fieldId === 'netsuite.webservices.criteria') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );
      const criteriaField = fields.find(
        field => field.fieldId === 'netsuite.webservices.criteria'
      );

      return {
        recordType: recordTypeField && recordTypeField.value,
        commMetaPath:
          recordTypeField &&
          recordTypeField.value &&
          `netSuiteWS/recordMetadata/${criteriaField.connectionId}?type=export&recordType=${recordTypeField.value}`,
      };
    }

    return null;
  },
  fieldMap: {
    'netsuite.netsuiteExportlabel': { fieldId: 'netsuite.netsuiteExportlabel' },
    'netsuite.restlet.recordType': {
      fieldId: 'netsuite.restlet.recordType',
    },
    'netsuite.restlet.searchId': {
      fieldId: 'netsuite.restlet.searchId',
    },
  },
  layout: {
    fields: ['netsuite.restlet.recordType', 'netsuite.restlet.searchId'],
  },
};
