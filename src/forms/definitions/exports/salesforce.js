import { isNewId } from '../../../utils/resource';

export default {
  optionsHandler: (fieldId, fields) => {
    if (
      [
        'salesforce.distributed.requiredTrigger',
        'salesforce.distributed.referencedFields',
        'salesforce.distributed.relatedLists',
      ].includes(fieldId)
    ) {
      const { value } = fields.find(
        field => field.id === 'salesforce.distributed.sObjectType'
      );

      return value;
    }
  },
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/type'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/test/limit'] = 1;
    }

    if (retValues['/salesforce/executionType'] === 'scheduled') {
      retValues['/salesforce/type'] = 'soql';
      retValues['/salesforce/api'] = 'rest';
    } else if (retValues['/salesforce/executionType'] === 'realtime') {
      retValues['/type'] = 'distributed';
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/salesforce/sObjectType'] =
        retValues['/salesforce/objectType'];
    }

    delete retValues['/outputMode'];

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    'salesforce.executionType': { fieldId: 'salesforce.executionType' },
    exportData: {
      id: 'exportData',
      type: 'labeltitle',
      label: 'What would you like to export from Salesforce?',
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

        const output = r && r.salesforce && r.salesforce.id;

        return output ? 'blob' : 'records';
      },
    },
    'salesforce.soql.query': { fieldId: 'salesforce.soql.query' },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export Type',
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
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
        { field: 'salesforce.executionType', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'delta.dateField': {
      fieldId: 'delta.dateField',
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'once.booleanField': {
      fieldId: 'once.booleanField',
    },
    'salesforce.distributed.sObjectType': {
      connectionId: r => r._connectionId,
      fieldId: 'salesforce.distributed.sObjectType',
      type: 'salesforcesobjecttype',
      filterKey: 'salesforce-sObjects-triggerable',
      commMetaPath: r =>
        `salesforce/metadata/connections/${r._connectionId}/sObjectTypes`,
    },
    'salesforce.id': { fieldId: 'salesforce.id' },
    'salesforce.distributed.requiredTrigger': {
      type: 'salesforcerequiredtrigger',
      refreshOptionsOnChangesTo: ['salesforce.distributed.sObjectType'],
      fieldId: 'salesforce.distributed.requiredTrigger',
    },
    'salesforce.distributed.referencedFields': {
      connectionId: r => r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.distributed.sObjectType'],
      type: 'salesforcereferencedfields',
      fieldId: 'salesforce.distributed.referencedFields',
      disabledWhen: [
        {
          field: 'salesforce.distributed.sObjectType',
          is: [''],
        },
      ],
    },
    'salesforce.distributed.relatedLists': {
      type: 'salesforcerelatedlist',
      connectionId: r => r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.distributed.sObjectType'],
      fieldId: 'salesforce.distributed.relatedLists',
      disabledWhen: [
        {
          field: 'salesforce.distributed.sObjectType',
          is: [''],
        },
      ],
    },
    'salesforce.distributed.qualifier': {
      fieldId: 'salesforce.distributed.qualifier',
    },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [{ field: 'outputMode', is: ['records'] }],
    },
  },
  layout: {
    fields: [
      'common',
      'outputMode',
      'salesforce.executionType',
      'exportData',
      'salesforce.distributed.sObjectType',
      'salesforce.distributed.requiredTrigger',
      'salesforce.distributed.referencedFields',
      'salesforce.distributed.relatedLists',
      'salesforce.distributed.qualifier',
      'salesforce.soql.query',
      'type',
      'delta.dateField',
      'delta.lagOffset',
      'once.booleanField',
      'salesforce.id',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
