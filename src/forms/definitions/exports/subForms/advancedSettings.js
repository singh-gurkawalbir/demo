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
        if (exportType === 'http' || exportType === 'rest') {
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
        if (exportType === 'http' || exportType === 'rest') {
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

        if (exportType === 'http' || exportType === 'rest') {
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
    apiIdentifier: { fieldId: 'apiIdentifier',
      visibleWhenAll: r => {
        const exportType = getResourceSubType(r).type;

        if (exportType === 'http' || exportType === 'rest') {
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
    traceKeyTemplate: { fieldId: 'traceKeyTemplate' },
  },
  layout: {
    fields: ['pageSize', 'dataURITemplate', 'skipRetries', 'apiIdentifier', 'traceKeyTemplate'],
  },
};
