import { getResourceSubType } from '../../../../utils/resource';

export default {
  fieldMap: {
    pageSize: { fieldId: 'pageSize',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'netsuite') {
          return [
            { field: 'netsuite.api.type', is: ['restlet', 'search'] },
            { field: 'netsuite.execution.type', is: ['scheduled'] },
            { field: 'outputMode', is: ['records'] },
          ];
        }
        if (exportType === 'http' || exportType === 'rest' || exportType === 'graph_ql') {
          return [
            {
              field: 'outputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      },
    },
    dataURITemplate: { fieldId: 'dataURITemplate',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'netsuite') {
          return [
            { field: 'netsuite.execution.type', isNot: [''] },
            { field: 'outputMode', is: ['records'] },
            { field: 'netsuite.api.type', isNot: [''] },
          ];
        }
        if (exportType === 'http' || exportType === 'rest' || exportType === 'graph_ql') {
          return [
            {
              field: 'outputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      },
    },
    skipRetries: { fieldId: 'skipRetries',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'http' || exportType === 'rest' || exportType === 'graph_ql') {
          return [
            {
              field: 'outputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      },
    },
    apiIdentifier: {
      fieldId: 'apiIdentifier',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'graph_ql' || r?.http?.formType === 'graph_ql') {
          return [
            {
              field: 'outputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      },
    },
    traceKeyTemplate: {
      fieldId: 'traceKeyTemplate',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'graph_ql' || r?.http?.formType === 'graph_ql') {
          return [
            {
              field: 'outputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      } },
  },
  layout: {
    fields: ['pageSize', 'dataURITemplate', 'skipRetries', 'traceKeyTemplate', 'apiIdentifier'],
  },
};
