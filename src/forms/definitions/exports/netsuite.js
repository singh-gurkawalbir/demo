import { isNewId } from '../../../utils/resource';

export default {
  preSave: ({ executionType, apiType, ...rest }) => {
    const newValues = rest;
    const netsuiteType =
      executionType === 'scheduled' ? apiType : executionType;

    newValues['/netsuite/type'] = netsuiteType;

    if (newValues['/outputMode'] === 'blob') {
      newValues['/type'] = 'blob';
      newValues['/netsuite/type'] = undefined;
    }

    if (netsuiteType === 'search') {
      newValues['/netsuite/searches'] = [
        {
          savedSearchId: newValues['/netsuite/webservices/searchId'],
          recordType: newValues['/netsuite/webservices/recordType'],
          criteria: [],
        },
      ];
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
      newValues['/delta/dateField'] = newValues['/restlet/delta/dateField'];
      newValues['/once/booleanField'] = newValues['/restlet/once/booleanField'];
      delete newValues['/restlet/type'];
      delete newValues['/restlet/delta/lagOffset'];
      delete newValues['/restlet/delta/dateField'];
      delete newValues['/restlet/once/booleanField'];

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

    try {
      newValues['/netsuite/distributed/qualifier'] = JSON.parse(
        newValues['/netsuite/distributed/qualifier']
      );
    } catch (ex) {
      newValues['/netsuite/distributed/qualifier'] = undefined;
    }

    return newValues;
  },
  fieldMap: {
    'netsuite.netsuiteExportlabel': {
      fieldId: 'netsuite.netsuiteExportlabel',
      visibleWhenAll: [{ field: 'netsuite.api.type', isNot: [''] }],
    },
    'netsuite.execution.type': {
      id: 'netsuite.execution.type',
      name: 'executionType',
      type: 'radiogroup',
      label: 'Execution Type',
      required: true,
      visible: r => !(r && r.isLookup),
      visibleWhen: r => {
        if (r && r.isLookup) return [];

        return [
          {
            field: 'outputMode',
            is: ['records'],
          },
        ];
      },
      defaultDisabled: r => {
        const isNew = isNewId(r._id);

        if (!isNew) return true;

        return false;
      },
      defaultValue: r => {
        const netsuiteType = r && r.netsuite && r.netsuite.type;

        if (r && r.isLookup) return 'scheduled';

        if (netsuiteType) {
          return netsuiteType === 'distributed' ? 'distributed' : 'scheduled';
        }
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
      label: 'Output Mode',
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

        const output = r && r.netsuite && r.netsuite.internalId;

        if (output === 'blob') return 'blob';

        return 'records';
      },
    },
    'netsuite.api.type': {
      id: 'netsuite.api.type',
      name: 'apiType',
      type: 'radiogroup',
      label: 'API Type',
      required: true,
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
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhenAll: [
        { field: 'netsuite.execution.type', isNot: [''] },
        { field: 'outputMode', is: ['records'] },
        { field: 'netsuite.api.type', isNot: [''] },
      ],
    },
    'netsuite.distributed.forceReload': {
      fieldId: 'netsuite.distributed.forceReload',
      visibleWhenAll: [
        { field: 'netsuite.execution.type', is: ['distributed'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    'netsuite.restlet.batchSize': {
      fieldId: 'netsuite.restlet.batchSize',
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['restlet'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
    pageSize: {
      fieldId: 'pageSize',
      visibleWhenAll: [
        { field: 'netsuite.api.type', is: ['restlet', 'search'] },
        { field: 'netsuite.execution.type', is: ['scheduled'] },
        { field: 'outputMode', is: ['records'] },
      ],
    },
  },
  layout: {
    fields: [
      'outputMode',
      'netsuite.execution.type',
      'netsuite.api.type',
      'exportOneToMany',
      'netsuite.netsuiteExportlabel',
      'distributed',
      'restlet',
      'search',
      'netsuite.skipGrouping',
      'blob',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'dataURITemplate',
          'netsuite.distributed.forceReload',
          'pageSize',
          'netsuite.restlet.batchSize',
        ],
      },
    ],
  },
};
