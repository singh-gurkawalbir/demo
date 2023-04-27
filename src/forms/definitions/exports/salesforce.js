import { isNewId } from '../../../utils/resource';
import { safeParse } from '../../../utils/string';

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
    if (fieldId === 'salesforce.distributed.skipExportFieldId') {
      const sObjectTypeField = fields.find(
        field => field.fieldId === 'salesforce.sObjectType'
      );

      return {
        commMetaPath: `salesforce/metadata/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}`,
        disableFetch: !(sObjectTypeField && sObjectTypeField.value),
      };
    }

    const soqlField = fields.find(field => field.id === 'salesforce.soql');
    const dateField = fields.find(field => field.id === 'delta.dateField');

    if (dateField) {
      if (
        soqlField &&
        soqlField.value &&
        soqlField.value.query &&
        soqlField.value.query.includes('lastExportDateTime')
      ) {
        dateField.defaultRequired = false;
      } else {
        dateField.defaultRequired = true;
      }
      dateField.required = dateField.defaultRequired;
    }
  },
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/type'] === 'all') {
      retValues['/test'] = undefined;
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
    } else if (retValues['/type'] === 'test') {
      retValues['/delta'] = undefined;
      retValues['/once'] = undefined;
    } else if (retValues['/type'] === 'delta') {
      retValues['/once'] = undefined;
      retValues['/test'] = undefined;
      retValues['/delta/dateField'] = retValues['/delta/dateField'] && Array.isArray(retValues['/delta/dateField']) ? retValues['/delta/dateField'].join(',') : retValues['/delta/dateField'];
    } else if (retValues['/type'] === 'once') {
      retValues['/delta'] = undefined;
      retValues['/test'] = undefined;
    }

    if (retValues['/salesforce/executionType'] === 'scheduled') {
      retValues['/salesforce/type'] = 'soql';
      retValues['/salesforce/api'] = 'rest';
    } else if (retValues['/salesforce/executionType'] === 'realtime') {
      retValues['/type'] = 'distributed';

      /**
       * When no qualifier or if it is an empty string we are sending null in ampersand app.
       * If there is no difference in setting null vs empty string from backend perspective, we can remove this check.
       */
      if (!retValues['/salesforce/distributed/qualifier']) {
        retValues['/salesforce/distributed/qualifier'] = null;
      }
    }

    if (retValues['/outputMode'] === 'blob') {
      retValues['/salesforce/sObjectType'] =
        retValues['/salesforce/objectType'];
      retValues['/type'] = 'blob';
    }

    delete retValues['/outputMode'];
    retValues['/mockOutput'] = safeParse(retValues['/mockOutput']);

    return {
      ...retValues,
    };
  },
  fieldMap: {
    common: { formId: 'common' },
    exportOneToMany: { formId: 'exportOneToMany' },
    'salesforce.executionType': { fieldId: 'salesforce.executionType' },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Output mode',
      required: true,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      visible: false,
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'salesforce.soql': {
      id: 'salesforce.soql',
      type: 'soqlquery',
      label: 'SOQL query',
      omitWhenHidden: true,
      filterKey: 'salesforce-soqlQuery',
      required: true,
      multiline: true,
      helpKey: 'export.salesforce.soql.query',
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
      label: 'Export type',
      isLoggable: true,
      defaultValue: r => {
        const isNew = isNewId(r._id);

        // if its create
        if (isNew) return '';
        const output = r && r.type;

        return output || 'all';
      },
      required: true,
      skipSort: true,
      options: [
        {
          items: [
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Limit – export a set number of records', value: 'test' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'salesforce.executionType', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
      removeWhen: [{field: 'type', is: ['all']}],
    },
    'test.limit': {fieldId: 'test.limit', deleteWhen: [{field: 'type', is: ['all', 'delta', 'once']}]},
    'delta.dateField': {
      id: 'delta.dateField',
      type: 'salesforcerefreshableselect',
      label: 'Date fields to use in delta search',
      multiselect: true,
      placeholder: 'Please select a date field',
      fieldName: 'deltaExportDateFields',
      filterKey: 'salesforce-recordType',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.soql', 'delta.dateField'],
      required: true,
      visibleWhen: [{ field: 'type', is: ['delta'] }],
      defaultValue: r => r && r.delta && r.delta.dateField && r.delta.dateField.split(','),
      deleteWhen: [{field: 'type', is: ['all', 'test', 'once']}],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      deleteWhen: [{field: 'type', is: ['all', 'test', 'once']}],
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'salesforcerefreshableselect',
      label: 'Boolean field to mark records as exported',
      isLoggable: true,
      placeholder: 'Please select a boolean field',
      helpKey: 'export.once.booleanField',
      fieldName: 'onceExportBooleanFields',
      filterKey: 'salesforce-recordType',
      connectionId: r => r && r._connectionId,
      required: true,
      visibleWhen: [{ field: 'type', is: ['once'] }],
      deleteWhen: [{field: 'type', is: ['all', 'test', 'delta']}],
    },
    'salesforce.sObjectType': {
      connectionId: r => r._connectionId,
      fieldId: 'salesforce.sObjectType',
      type: 'salesforcesobject',
      bundlePath: r => r && `connections/${r._connectionId}/distributed`,
      bundleUrlHelp:
        'Please install our <a target="_blank" href="BUNDLE_URL">integrator distributed adapter package</a> in your Salesforce account to create realtime exports.',
      commMetaPath: r =>
        `salesforce/metadata/connections/${r._connectionId}/sObjectTypes`,
    },
    'salesforce.id': { fieldId: 'salesforce.id' },
    'salesforce.distributed.batchSize': {
      fieldId: 'salesforce.distributed.batchSize',
    },
    'salesforce.distributed.skipExportFieldId': {
      fieldId: 'salesforce.distributed.skipExportFieldId',
      type: 'refreshableselect',
      filterKey: 'salesforce-recordType-boolean',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      visibleWhenAll: [
        {
          field: 'salesforce.executionType',
          is: ['realtime'],
        },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'salesforce.distributed.requiredTrigger': {
      type: 'salesforcerequiredtrigger',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
      defaultDisabled: true,
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
    'salesforce.objectType': {
      fieldId: 'salesforce.objectType',
    },
    'salesforce.distributed.qualifier': {
      fieldId: 'salesforce.distributed.qualifier',
    },
    advancedSettings: {
      formId: 'advancedSettings',
    },
    mockOutput: {fieldId: 'mockOutput'},
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'common',
          'outputMode',
          'exportOneToMany',
          'salesforce.executionType',
        ],
      },
      {
        collapsed: true,
        label: r => {
          if (r.resourceType === 'lookupFiles' || r.type === 'blob') {
            return 'What would you like to transfer?';
          }
          if (
            r.resourceType === 'realtime' ||
                    r.type === 'distributed'
          ) {
            return 'Configure real-time export in source application';
          }

          return 'What would you like to export?';
        },
        fields: [
          'salesforce.sObjectType',
          'salesforce.objectType',
          'salesforce.distributed.requiredTrigger',
          'salesforce.distributed.referencedFields',
          'salesforce.distributed.relatedLists',
          'salesforce.distributed.qualifier',
          'salesforce.soql',
          'salesforce.id',
        ],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'test.limit',
          'delta.dateField',
          'delta.lagOffset',
          'once.booleanField',
        ],
      },
      {
        collapsed: true,
        actionId: 'mockOutput',
        label: 'Mock output',
        fields: ['mockOutput'],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'salesforce.distributed.batchSize',
          'salesforce.distributed.skipExportFieldId',
          'advancedSettings',
        ],
      },
    ],
  },
};
