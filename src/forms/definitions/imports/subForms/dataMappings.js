import {
  getResourceSubTypeFromAdaptorType,
  adaptorTypeMap,
} from '../../../../utils/resource';

export default {
  fieldMap: {
    oneToMany: { fieldId: 'oneToMany' },
    pathToMany: { fieldId: 'pathToMany' },
    'netsuite_da.mapping': {
      fieldId: 'netsuite_da.mapping',
      refreshOptionsOnChangesTo: ['netsuite_da.lookups'],
      visible: r => {
        const { type: resourceSubType } = getResourceSubTypeFromAdaptorType(
          r.adaptorType
        );

        return resourceSubType === adaptorTypeMap.NetSuiteDistributedImport;
      },
    },
  },
  layout: {
    fields: [
      'oneToMany',
      'pathToMany',
    ],
  },
};
