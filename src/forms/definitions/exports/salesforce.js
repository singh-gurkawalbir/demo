import { isNewId } from '../../../utils/resource';
import { isLookupResource } from '../../../utils/flows';

export default {
  init: (fieldMeta, resource = {}, flow) => {
    const exportPanelField = fieldMeta.fieldMap.exportPanel;

    if (isLookupResource(flow, resource)) {
      exportPanelField.visible = false;
    }

    return fieldMeta;
  },
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
    } else if (fieldId === 'salesforce.distributed.qualifier') {
      const sObjectTypeField = fields.find(
        field => field.fieldId === 'salesforce.sObjectType'
      );

      return {
        commMetaPath: sObjectTypeField
          ? `salesforce/metadata/connections/${sObjectTypeField.connectionId}/sObjectTypes/${sObjectTypeField.value}`
          : '',
        resetValue:
          sObjectTypeField &&
          sObjectTypeField.value !== sObjectTypeField.defaultValue,
      };
    } else if (fieldId === 'salesforce.distributed.skipExportFieldId') {
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
        dateField.required = false;
      } else {
        dateField.required = true;
      }
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
        if (r.resourceType === 'lookupFiles' || r.type === 'blob')
          return 'blob';

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
      label: 'Date field',
      placeholder: 'Please select a date field',
      fieldName: 'deltaExportDateFields',
      filterKey: 'salesforce-recordType',
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['salesforce.soql', 'delta.dateField'],
      required: true,
      visibleWhen: [{ field: 'type', is: ['delta'] }],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
    },
    'once.booleanField': {
      id: 'once.booleanField',
      type: 'salesforcerefreshableselect',
      label: 'Boolean field',
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
    pageSize: { fieldId: 'pageSize' },
    dataURITemplate: { fieldId: 'dataURITemplate' },
    'salesforce.distributed.qualifier': {
      fieldId: 'salesforce.distributed.qualifier',
      refreshOptionsOnChangesTo: ['salesforce.sObjectType'],
    },
    advancedSettings: {
      formId: 'advancedSettings',
      visibleWhenAll: [{ field: 'outputMode', is: ['records'] }],
    },
    exportPanel: {
      fieldId: 'exportPanel',
    },
  },
  layout: {
    type: 'column',
    containers: [
      {
        fields: ['common', 'outputMode', 'salesforce.executionType'],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'How should this export be parameterized?',
            fields: ['exportOneToMany'],
          },
          {
            collapsed: true,
            label: r => {
              if (r.resourceType === 'lookupFiles' || r.type === 'blob') {
                return 'What would you like to transfer?';
              } else if (
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
            label: 'Configure export type?',
            fields: [
              'type',
              'delta.dateField',
              'delta.lagOffset',
              'once.booleanField',
            ],
          },
          {
            collapsed: true,
            label: 'Advanced',
            fields: [
              'pageSize',
              'salesforce.distributed.batchSize',
              'salesforce.distributed.skipExportFieldId',
              'dataURITemplate',
            ],
          },
        ],
      },
      {
        fields: ['exportPanel'],
      },
    ],
  },
};
