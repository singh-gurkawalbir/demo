import { isNewId } from '../../../utils/resource';

export default {
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

        const output = r && r.type;

        return output ? 'records' : 'blob';
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
    'salesforce.sObjectType': { fieldId: 'salesforce.sObjectType' },
    'salesforce.objectType': { fieldId: 'salesforce.objectType' },
    'salesforce.id': { fieldId: 'salesforce.id' },
    'salesforce.distributed.requiredTrigger': {
      fieldId: 'salesforce.distributed.requiredTrigger',
    },
    'salesforce.distributed.referencedFields': {
      fieldId: 'salesforce.distributed.referencedFields',
    },
    'salesforce.distributed.relatedLists.referencedFields': {
      fieldId: 'salesforce.distributed.relatedLists.referencedFields',
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
      'salesforce.sObjectType',
      'salesforce.distributed.requiredTrigger',
      'salesforce.distributed.referencedFields',
      'salesforce.distributed.relatedLists.referencedFields',
      'salesforce.distributed.qualifier',
      'salesforce.soql.query',
      'type',
      'delta.dateField',
      'delta.lagOffset',
      'once.booleanField',
      'salesforce.objectType',
      'salesforce.id',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['advancedSettings'] },
    ],
  },
};
