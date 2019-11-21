import { isTransactionWSRecordType } from '../../../../utils/metadata';
import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const retValues = {
      ...formValues,
      '/netsuite/searches': [
        {
          savedSearchId: formValues['/netsuite/webservices/searchId'],
          recordType: formValues['/netsuite/webservices/recordType'],
          criteria: [],
        },
      ],
    };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/dateField'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
      delete retValues['/delta/dateField'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/once/booleanField'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
      delete retValues['/test/limit'];
      delete retValues['/delta/lagOffset'];
      delete retValues['/delta/dateField'];
    }

    return retValues;
  },

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
        commMetaPath: `netSuiteWS/searchMetadata/${recordTypeField.connectionId}?recordType=${record}`,
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
        commMetaPath: `netSuiteWS/recordMetadata/${recordTypeField.connectionId}?type=export&recordType=${record}`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    common: { formId: 'common' },
    'netsuite.netsuiteExportlabel': { fieldId: 'netsuite.netsuiteExportlabel' },
    'netsuite.webservices.recordType': {
      fieldId: 'netsuite.webservices.recordType',
    },
    'netsuite.webservices.searchId': {
      fieldId: 'netsuite.webservices.searchId',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhen: [{ field: 'netsuite.webservices.recordType', isNot: [''] }],
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
    },
    'test.limit': {
      fieldId: 'test.limit',
      defaultValue: 1,
      visible: false,
      validWhen: [{ field: 'type', is: ['test'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhen: [{ field: 'type', is: ['delta'] }],
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
      ],
    },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [
        {
          field: 'outputMode',
          is: ['records'],
        },
      ],
    },
    'netsuite.skipGrouping': { fieldId: 'netsuite.skipGrouping' },
    // skipRetries: { fieldId: 'skipRetries' },
    exportOneToMany: { formId: 'exportOneToMany' },
  },
  layout: {
    fields: [
      'common',
      'exportOneToMany',
      'netsuite.netsuiteExportlabel',
      'netsuite.webservices.recordType',
      'netsuite.webservices.searchId',
      'type',
      'test.limit',
      'delta.lagOffset',
      'delta.dateField',
      'once.booleanField',
      'netsuite.skipGrouping',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'advancedSettings',
          // 'skipRetries'
        ],
      },
    ],
  },
};
