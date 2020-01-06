import { isTransactionWSRecordType } from '../../../../../utils/metadata';
import { isNewId } from '../../../../../utils/resource';

export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite.webservices.searchId') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );
      let record = recordTypeField && recordTypeField.value;

      if (record && record.toLowerCase().indexOf('customrecord') === 0) {
        record = 'customRecord';
      }

      if (isTransactionWSRecordType(record)) {
        record = 'transaction';
      }

      return {
        commMetaPath:
          recordTypeField &&
          `netSuiteWS/searchMetadata/${recordTypeField.connectionId}?recordType=${record}`,
      };
    }

    if (fieldId === 'delta.dateField' || fieldId === 'once.booleanField') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.webservices.recordType'
      );
      let record = recordTypeField && recordTypeField.value;

      if (record && record.toLowerCase().indexOf('customrecord') === 0) {
        record = 'customRecord';
      }

      return {
        commMetaPath:
          recordTypeField &&
          `netSuiteWS/recordMetadata/${recordTypeField.connectionId}?type=export&recordType=${record}`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    'netsuite.webservices.recordType': {
      fieldId: 'netsuite.webservices.recordType',
    },
    'netsuite.webservices.searchId': {
      fieldId: 'netsuite.webservices.searchId',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
    },
    'delta.dateField': {
      id: 'delta.dateField',
      label: 'Date field',
      type: 'refreshableselect',
      required: true,
      placeholder: 'Please select a date field',
      connectionId: r => r && r._connectionId,
      filterKey: 'webservices-dateField',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.webservices.recordType', isNot: [''] },
        { field: 'type', is: ['delta'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'once.booleanField': {
      id: 'once.booleanField',
      label: 'Boolean Field',
      type: 'refreshableselect',
      placeholder: 'Please select a Boolean field',
      required: true,
      connectionId: r => r && r._connectionId,
      filterKey: 'webservices-booleanField',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.webservices.recordType', isNot: [''] },
        { field: 'type', is: ['once'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      required: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      options: [
        {
          items: [
            { label: 'All', value: 'all' },
            { label: 'Test', value: 'test' },
            { label: 'Delta', value: 'delta' },
            { label: 'Once', value: 'once' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhenAll: [
        { field: 'type', is: ['delta'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
  },
  layout: {
    fields: [
      'netsuite.webservices.recordType',
      'netsuite.webservices.searchId',
      'type',
      'delta.dateField',
      'delta.lagOffset',
      'once.booleanField',
    ],
  },
};
