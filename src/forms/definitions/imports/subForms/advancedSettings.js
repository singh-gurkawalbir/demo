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
      visible: r => {
        const importType = getResourceSubType(r).type;

        // this field should not be shown in graphql advanced section
        if (importType === 'graph_ql' || r?.http?.formType === 'graph_ql') {
          return false;
        }

        return true;
      },
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
