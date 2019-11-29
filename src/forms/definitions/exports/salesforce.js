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
        field => field.id === 'salesforce.sObjectType'
      );

      return value;
    }
  },
  preSave: formValues => {
    const retValues = { ...formValues };

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
      delete retValues['/delta/dateField'];
      delete retValues['/delta/lagOffset'];
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
      retValues['/type'] = 'blob';
    }

    delete retValues['/outputMode'];

    return {
      ...retValues,
    };
  },

  fieldMap: {
    common: { formId: 'common' },
    exportOneToMany: { formId: 'exportOneToMany' },
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
    'salesforce.soql': {
      id: 'salesforce.soql',
      type: 'soqlquery',
      label: 'SOQL Query',
      omitWhenHidden: true,
      filterKey: 'salesforce-soqlQuery',
      required: true,
      multiline: true,
      connectionId: r => r && r._connectionId,
      defaultValue: r => r && r.salesforce && r.salesforce.soql,
      refreshOptionsOnChangesTo: ['delta.dateField', 'once.booleanField'],
      visibleWhenAll: [
        { field: 'salesforce.executionType', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
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
      id: 'delta.dateField',
      type: 'salesforcerefreshableselect',
      label: 'Date Field',
      placeholder: 'Please select a date field',
      fieldName: 'deltaExportDateFields',
      filterKey: 'salesforce-recordType',
      connectionId: r => r && r._connectionId,
      required: true,
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'salesforcerefreshableselect',
      label: 'Boolean Field',
      placeholder: 'Please select a boolean field',
      fieldName: 'onceExportBooleanFields',
      filterKey: 'salesforce-recordType',
      connectionId: r => r && r._connectionId,
      required: true,
      visibleWhen: [{ field: 'type', is: ['once'] }],
    },
    'salesforce.sObjectType': {
      connectionId: r => r._connectionId,
      fieldId: 'salesforce.sObjectType',
      type: 'refreshableselect',
      filterKey: 'salesforce-sObjects-triggerable',
      commMetaPath: r =>
        `salesforce/metadata/connections/${r._connectionId}/sObjectTypes`,
    },
    'salesforce.id': { fieldId: 'salesforce.id' },
    'salesforce.distributed.requiredTrigger': {
      type: 'salesforcerequiredtrigger',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      fieldId: 'salesforce.distributed.requiredTrigger',
    },
    'salesforce.distributed.referencedFields': {
      connectionId: r => r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      type: 'salesforcereferencedfields',
      delimiter: ',',
      fieldId: 'salesforce.distributed.referencedFields',
      disabledWhen: [
        {
          field: 'salesforce.sObjectType',
          is: [''],
        },
      ],
    },
    'salesforce.distributed.relatedLists': {
      type: 'salesforcerelatedlist',
      connectionId: r => r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      fieldId: 'salesforce.distributed.relatedLists',
      disabledWhen: [
        {
          field: 'salesforce.sObjectType',
          is: [''],
        },
      ],
    },
    'salesforce.distributed.qualifier': {
      fieldId: 'salesforce.distributed.qualifier',
    },
    'salesforce.objectType': {
      fieldId: 'salesforce.objectType',
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
      'exportOneToMany',
      'salesforce.executionType',
      'exportData',
      'salesforce.sObjectType',
      'salesforce.objectType',
      'salesforce.distributed.requiredTrigger',
      'salesforce.distributed.referencedFields',
      'salesforce.distributed.relatedLists',
      'salesforce.distributed.qualifier',
      'salesforce.soql',
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
