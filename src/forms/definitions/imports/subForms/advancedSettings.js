import { getResourceSubType } from '../../../../utils/resource';

export default {
  fieldMap: {
    idLockTemplate: {
      fieldId: 'idLockTemplate',
      visibleWhenAll: r => {
        const importType = getResourceSubType(r).type;
        const showOnlyForRecordsTypes = ['http', 'rest', 'salesforce'];

        if (showOnlyForRecordsTypes.includes(importType)) {
          return [
            {
              field: 'inputMode',
              is: ['records'],
            },
          ];
        }

        return [];
      },
    },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhenAll: r => {
        const importType = getResourceSubType(r).type;
        const showOnlyForRecordsTypes = ['http', 'rest', 'salesforce'];

        if (showOnlyForRecordsTypes.includes(importType)) {
          return [
            {
              field: 'inputMode',
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
        const importType = getResourceSubType(r).type;
        const showOnlyForRecordsTypes = ['http', 'rest', 'salesforce'];

        if (showOnlyForRecordsTypes.includes(importType)) {
          return [
            {
              field: 'inputMode',
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
    fields: ['idLockTemplate', 'dataURITemplate', 'traceKeyTemplate', 'apiIdentifier'],
  },
};
