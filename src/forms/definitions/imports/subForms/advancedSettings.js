import { getResourceSubType } from '../../../../utils/resource';

const shouldInputModeBeRecords = r => {
  const importType = getResourceSubType(r).type;
  const importTypes = ['http', 'rest', 'salesforce'];

  if (importTypes.includes(importType)) {
    return [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ];
  }

  return [];
};

export default {
  fieldMap: {
    idLockTemplate: {
      fieldId: 'idLockTemplate',
      visibleWhenAll: shouldInputModeBeRecords,
    },
    dataURITemplate: {
      fieldId: 'dataURITemplate',
      visibleWhenAll: shouldInputModeBeRecords,
    },
    apiIdentifier: {
      fieldId: 'apiIdentifier',
      visibleWhenAll: shouldInputModeBeRecords,
    },
    traceKeyTemplate: { fieldId: 'traceKeyTemplate' },
  },
  layout: {
    fields: ['idLockTemplate', 'dataURITemplate', 'traceKeyTemplate', 'apiIdentifier'],
  },
};
