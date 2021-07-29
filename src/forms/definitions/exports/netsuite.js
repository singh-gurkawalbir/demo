import { isNewId } from '../../../utils/resource';

export default {
  preSave: ({ executionType, apiType, ...rest }) => {
    const newValues = rest;
    const netsuiteType =
      executionType === 'scheduled' ? apiType : executionType;

    newValues['/netsuite/type'] = netsuiteType;
    if (newValues['/netsuite/type'] === 'distributed') {
      newValues['/type'] = 'distributed';
      newValues['/netsuite/distributed/useSS2Framework'] = newValues['/netsuite/distributed/useSS2Framework'] === 'true';
      // removing other netsuiteType's Sub Doc @BugFix IO-12678
      newValues['/netsuite/restlet'] = undefined;
      newValues['/netsuite/searches'] = undefined;
      newValues['/netsuite/webservices'] = undefined;
      delete newValues['/netsuite/restlet/criteria'];
      delete newValues['/netsuite/restlet/useSS2Restlets'];
      delete newValues['/netsuite/webservices/criteria'];
      delete newValues['/netsuite/searches/criteria'];
    }

    if (netsuiteType === 'search') {
      newValues['/netsuite/searches'] = [
        {
          savedSearchId: newValues['/netsuite/webservices/searchId'],
          recordType: newValues['/netsuite/webservices/recordType'],
          criteria: newValues['/netsuite/webservices/criteria'],
        },
      ];
      newValues['/netsuite/restlet'] = undefined;
      delete newValues['/netsuite/restlet/criteria'];
      newValues['/netsuite/distributed'] = undefined;
      delete newValues['/netsuite/distributed/executionContext'];
      delete newValues['/netsuite/distributed/forceReload'];
      delete newValues['/netsuite/distributed/executionType'];
    }

    if (netsuiteType === 'search') {
      if (newValues['/type'] === 'all') {
        newValues['/type'] = undefined;
        newValues['/test'] = undefined;
        newValues['/delta'] = undefined;
        newValues['/once'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/delta/dateField'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'test') {
        newValues['/test/limit'] = 1;
        newValues['/delta'] = undefined;
        newValues['/once'] = undefined;
        delete newValues['/delta/dateField'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'delta') {
        newValues['/once'] = undefined;
        newValues['/test'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'once') {
        newValues['/delta'] = undefined;
        newValues['/test'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/delta/dateField'];
      }
    }

    if (netsuiteType === 'restlet') {
      newValues['/type'] = newValues['/restlet/type'];
      newValues['/delta/lagOffset'] = newValues['/restlet/delta/lagOffset'];
      newValues['/delta/dateField'] = newValues['/restlet/delta/dateField'] && Array.isArray(newValues['/restlet/delta/dateField']) ? newValues['/restlet/delta/dateField'].join(',') : newValues['/restlet/delta/dateField'];
      newValues['/once/booleanField'] = newValues['/restlet/once/booleanField'];
      newValues['/netsuite/restlet/useSS2Restlets'] = newValues['/netsuite/restlet/useSS2Restlets'] === 'true';
      delete newValues['/restlet/type'];
      delete newValues['/restlet/delta/lagOffset'];
      delete newValues['/restlet/delta/dateField'];
      delete newValues['/restlet/once/booleanField'];
      newValues['/netsuite/distributed'] = undefined;
      delete newValues['/netsuite/distributed/executionContext'];
      delete newValues['/netsuite/distributed/forceReload'];
      delete newValues['/netsuite/distributed/executionType'];

      if (newValues['/type'] === 'all') {
        newValues['/test'] = undefined;
        newValues['/delta'] = undefined;
        newValues['/type'] = undefined;
        newValues['/once'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/delta/dateField'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'test') {
        newValues['/test/limit'] = 1;
        newValues['/delta'] = undefined;
        newValues['/once'] = undefined;
        delete newValues['/delta/dateField'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'delta') {
        newValues['/once'] = undefined;
        newValues['/test'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/once/booleanField'];
      } else if (newValues['/type'] === 'once') {
        newValues['/delta'] = undefined;
        newValues['/test'] = undefined;
        delete newValues['/test/limit'];
        delete newValues['/delta/lagOffset'];
        delete newValues['/delta/dateField'];
      }
    }

    if (newValues['/netsuite/internalId']) {
      newValues['/type'] = 'blob';
      delete newValues['/netsuite/type'];
    }

    try {
      newValues['/netsuite/distributed/qualifier'] = JSON.parse(
        newValues['/netsuite/distributed/qualifier']
      );
    } catch (ex) {
      delete newValues['/netsuite/distributed/qualifier'];
    }

    return newValues;
  },
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'netsuite.distributed.skipExportFieldId') {
      const recordTypeField = fields.find(
        field => field.fieldId === 'netsuite.distributed.recordType'
      );

      return {
        disableFetch: !(recordTypeField && recordTypeField.value),
        commMetaPath:
          recordTypeField &&
          `netsuite/metadata/suitescript/connections/${recordTypeField.connectionId}/recordTypes/${recordTypeField.value}/searchFilters?includeJoinFilters=true`,
        resetValue:
          recordTypeField &&
          recordTypeField.value !== recordTypeField.defaultValue,
      };
    }

    return null;
  },
  fieldMap: {
    'netsuite.execution.type': {
      id: 'netsuite.execution.type',
      name: 'executionType',
      type: 'radiogroup',
      label: 'Execution type',
      required: true,
      visible: false,
      defaultValue: r => {
        if (r.resourceType === 'realtime' || r.type === 'distributed') return 'distributed';

        return 'scheduled';
      },
      options: [
        {
          items: [
            { label: 'Real-time', value: 'distributed' },
            { label: 'Scheduled', value: 'scheduled' },
          ],
        },
      ],
    },
    outputMode: {
      id: 'outputMode',
      type: 'mode',
      label: 'Output mode',
      visible: false,
      options: [
        {
          items: [
            { label: 'Records', value: 'records' },
            { label: 'Blob keys', value: 'blob' },
          ],
        },
      ],
      defaultValue: r => {
        if (r.resourceType === 'lookupFiles' || r.type === 'blob') return 'blob';

        return 'records';
      },
    },
    'netsuite.api.type': {
      id: 'netsuite.api.type',
      name: 'apiType',
      type: 'radiogroup',
      label: 'NetSuite API type',
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => {
        const netsuiteType = r && r.netsuite && r.netsuite.type;

        if (netsuiteType) {
          return netsuiteType === 'restlet' ? 'restlet' : 'search';
        }

        return 'restlet';
      },
      options: [
        {
          items: [
            { label: 'RESTlet (Recommended)', value: 'restlet' },
            { label: 'Web Services', value: 'search' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    distributed: {
      formId: 'distributed',
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.execution.type', is: ['distributed'] },
      ],
    },
    restlet: {
      formId: 'restlet',
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    search: {
      formId: 'search',
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    blob: {
      formId: 'blob',
      visibleWhenAll: [{ field: 'outputMode', is: ['blob'] }],
    },
    'netsuite.skipGrouping': {
      fieldId: 'netsuite.skipGrouping',
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['search', 'restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    exportOneToMany: {
      formId: 'exportOneToMany',
    },
    'netsuite.distributed.forceReload': {
      fieldId: 'netsuite.distributed.forceReload',
      visibleWhenAll: [
        { field: 'netsuite.execution.type', is: ['distributed'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'netsuite.distributed.skipExportFieldId': {
      fieldId: 'netsuite.distributed.skipExportFieldId',
      type: 'refreshableselect',
      connectionId: r => r && r._connectionId,
      filterKey: 'suitescript-booleanField',
      refreshOptionsOnChangesTo: ['netsuite.distributed.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.execution.type', is: ['distributed'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'netsuite.distributed.useSS2Framework': {
      fieldId: 'netsuite.distributed.useSS2Framework',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      defaultValue: r => r?.netsuite?.distributed?.useSS2Framework ? 'true' : 'false',
      defaultDisabled: r => {
        if (!isNewId(r._id)) {
          return true;
        }

        return false;
      },
      options: [
        {
          items: [
            { label: 'SuiteScript 1.0', value: 'false' },
            { label: 'SuiteScript 2.0 (beta)', value: 'true' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'netsuite.execution.type', is: ['distributed'] },
        { field: 'outputMode', is: ['records'] },
      ],
      isNew: r => isNewId(r._id),
      connectionId: r => r?._connectionId,
      resourceType: 'exports',
      resourceId: r => r?._id,
    },
    'netsuite.restlet.batchSize': {
      fieldId: 'netsuite.restlet.batchSize',
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'netsuite.restlet.useSS2Restlets': {
      fieldId: 'netsuite.restlet.useSS2Restlets',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      defaultValue: r => r?.netsuite?.restlet?.useSS2Restlets ? 'true' : 'false',
      defaultDisabled: r => {
        if (!isNewId(r._id)) {
          return true;
        }

        return false;
      },
      options: [
        {
          items: [
            { label: 'SuiteScript 1.0', value: 'false' },
            { label: 'SuiteScript 2.0 (beta)', value: 'true' },
          ],
        },
      ],
      visibleWhenAll: [{ field: 'netsuite.api.type', is: ['restlet'] }, { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] }],
      isNew: r => isNewId(r._id),
      connectionId: r => r?._connectionId,
      resourceType: 'exports',
      resourceId: r => r?._id,
    },
    'netsuite.restlet.criteria': {
      fieldId: 'netsuite.restlet.criteria',
      disabledWhen: [
        { field: 'netsuite.restlet.recordType', is: [''] },
      ],
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'netsuite.webservices.criteria': {
      fieldId: 'netsuite.webservices.criteria',
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    advancedSettings: {formId: 'advancedSettings'},
    common: { formId: 'common' },
    settings: { fieldId: 'settings' },
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
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'once.booleanField': {
      id: 'once.booleanField',
      label: 'Boolean field to mark records as exported',
      type: 'refreshableselect',
      placeholder: 'Please select a boolean field',
      required: true,
      connectionId: r => r && r._connectionId,
      filterKey: 'webservices-booleanField',
      refreshOptionsOnChangesTo: ['netsuite.webservices.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.webservices.recordType', isNot: [''] },
        { field: 'type', is: ['once'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    type: {
      id: 'type',
      type: 'select',
      label: 'Export type',
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
            { label: 'All – always export all data', value: 'all' },
            { label: 'Delta – export only modified data', value: 'delta' },
            { label: 'Once – export records only once', value: 'once' },
            { label: 'Test – export only 1 record', value: 'test' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'delta.lagOffset': {
      fieldId: 'delta.lagOffset',
      visibleWhenAll: [
        { field: 'type', is: ['delta'] },
        { field: 'netsuite.api.type', is: ['search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'restlet.type': {
      id: 'restlet.type',
      type: 'netsuiteexporttype',
      label: 'Export Type',
      required: true,
      helpKey: 'export.type',
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
        { label: 'All – always export all data', value: 'all' },
        { label: 'Delta – export only modified data', value: 'delta' },
        { label: 'Once – export records only once', value: 'once' },
        { label: 'Test – export only 1 record', value: 'test' },
      ],
      visibleWhenAll: [
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'restlet.delta.dateField': {
      id: 'restlet.delta.dateField',
      label: 'Date fields to use in delta search',
      type: 'refreshableselect',
      multiselect: true,
      helpKey: 'export.delta.dateField',
      filterKey: 'suitescript-dateField',
      required: true,
      placeholder: 'Please select a date field',
      connectionId: r => r && r._connectionId,
      defaultValue: r => r && r.delta && r.delta.dateField && r.delta.dateField.split(','),
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'restlet.type', is: ['delta'] },
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'restlet.delta.lagOffset': {
      id: 'restlet.delta.lagOffset',
      type: 'text',
      label: 'Delta date lag offset',
      helpKey: 'export.delta.lagOffset',
      defaultValue: r => r && r.delta && r.delta.lagOffset,
      visibleWhenAll: [
        { field: 'restlet.type', is: ['delta'] },
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'restlet.once.booleanField': {
      id: 'restlet.once.booleanField',
      label: 'Boolean field to mark records as exported',
      type: 'refreshableselect',
      helpKey: 'export.once.booleanField',
      placeholder: 'Please select a boolean field',
      filterKey: 'suitescript-booleanField',
      required: true,
      defaultValue: r => r && r.once && r.once.booleanField,
      connectionId: r => r && r._connectionId,
      refreshOptionsOnChangesTo: ['netsuite.restlet.recordType'],
      visibleWhenAll: [
        { field: 'netsuite.restlet.recordType', isNot: [''] },
        { field: 'restlet.type', is: ['once'] },
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
      ],
    },
    'netsuite.blob.purgeFileAfterExport': {
      fieldId: 'netsuite.blob.purgeFileAfterExport',
      visibleWhenAll: [{ field: 'outputMode', is: ['blob'] }],
    },
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
          'netsuite.execution.type',
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
          'distributed',
          'restlet',
          'search',
          'netsuite.skipGrouping',
          'blob',
          'netsuite.restlet.criteria',
          'netsuite.webservices.criteria',
        ],
      },
      {
        collapsed: true,
        label: 'Configure export type',
        fields: [
          'type',
          'delta.dateField',
          'delta.lagOffset',
          'once.booleanField',
          'restlet.type',
          'restlet.delta.dateField',
          'restlet.delta.lagOffset',
          'restlet.once.booleanField',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        containers: [
          {
            fields: [
              'netsuite.api.type',
            ],
          },
          {
            type: 'indent',
            containers: [
              {
                fields: [
                  'netsuite.restlet.useSS2Restlets',
                ],
              },
            ],
          },
          {
            fields: [
              'netsuite.blob.purgeFileAfterExport',
              'netsuite.distributed.useSS2Framework',
              'netsuite.distributed.skipExportFieldId',
              'netsuite.distributed.forceReload',
              'netsuite.restlet.batchSize',
              'advancedSettings',
            ],
          },
        ],
      },
    ],
  },
};
