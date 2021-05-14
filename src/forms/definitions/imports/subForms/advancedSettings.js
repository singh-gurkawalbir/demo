import { getResourceSubType } from '../../../../utils/resource';

const shouldInputModeBeRecords = r => {
  const importType = getResourceSubType(r).type;
  const importTypes = ['http', 'rest', 'salesforce'];

  return importTypes.includes(importType);
};

export default {
  fieldMap: {
    idLockTemplate: {
      fieldId: 'idLockTemplate',
      visibleWhenAll: r => {
        if (shouldInputModeBeRecords(r)) {
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
        if (shouldInputModeBeRecords(r)) {
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
        if (shouldInputModeBeRecords(r)) {
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
