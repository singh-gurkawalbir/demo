import { isNewId } from '../../../../../utils/resource';

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
    'restlet.type': {
      id: 'restlet.type',
      type: 'netsuiteexporttype',
      label: 'Export Type',
      required: true,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      filterKey: 'suitescript-recordTypes',
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      selectOptions: [
        { label: 'All', value: 'all' },
        { label: 'Test', value: 'test' },
        { label: 'Delta', value: 'delta' },
        { label: 'Once', value: 'once' },
      ],
    },
    'restlet.delta.dateField': {
      id: 'restlet.delta.dateField',
      label: 'Date field',
      type: 'refreshableselect',
      filterKey: 'suitescript-dateField',
      required: true,
      placeholder: 'Please select a date field',
      connectionId: r => r && r._connectionId,
      defaultValue: r => r && r.delta && r.delta.dateField,
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'restlet.type', is: ['delta'] },
      ],
    },
    'restlet.delta.lagOffset': {
      id: 'restlet.delta.lagOffset',
      type: 'text',
      label: 'Offset',
      defaultValue: r => r && r.delta && r.delta.lagOffset,
      visibleWhenAll: [
        { field: 'restlet.type', is: ['delta'] },
        { field: 'netsuite.restlet.recordType', isNot: [''] },
      ],
    },
    'restlet.once.booleanField': {
      id: 'restlet.once.booleanField',
      label: 'Boolean field',
      type: 'refreshableselect',
      placeholder: 'Please select a Boolean field',
      filterKey: 'suitescript-booleanField',
      required: true,
      defaultValue: r => r && r.once && r.once.booleanField,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'restlet.type', is: ['once'] },
      ],
    },
  },
  layout: {
    fields: [
      'netsuite.restlet.recordType',
      'netsuite.restlet.searchId',
      'restlet.type',
      'restlet.delta.dateField',
      'restlet.delta.lagOffset',
      'restlet.once.booleanField',
    ],
  },
};
