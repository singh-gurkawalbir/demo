export default {
  fields: [
    { formId: 'common' },
    {
      fieldId: 'netsuite.netsuiteExportlabel',
      label: 'Would you like to transform the records?',
      type: 'labelTitle',
    },
    {
      resourceType: 'recordTypes',
      netsuiteSpecificResource: 'suitescript',
      fieldId: 'netsuite.recordType',
      connectionId: r => r._connectionId,
    },
    {
      fieldId: 'netsuite.restlet.searchType',
    },
    // TODO: is this restlet.searchId or searches.searchId
    // {
    //   fieldId: 'netsuite.restlet.searchId',
    //   resourceToRetrieve: r =>
    //     `netsuite/metadata/webservices/connections/${
    //       r._connectionId
    //     }/savedSearches`,
    //   visibleWhenAll: [
    //     {
    //       field: 'netsuite.restlet.searchType',
    //       is: ['public'],
    //     },
    //   ],
    // },
    {
      fieldId: 'netsuite.restlet.searchInternalId',
      visibleWhenAll: [
        {
          field: 'netsuite.restlet.searchType',
          is: ['private'],
        },
      ],
    },
    { fieldId: 'allConnectionsExportType' },

    {
      fieldId: 'delta.lagOffset',

      visibleWhenAll: [
        {
          field: 'allConnectionsExportType',
          is: ['delta'],
        },
      ],
    },

    {
      fieldId: 'once.booleanField',
      visibleWhenAll: [
        {
          field: 'allConnectionsExportType',
          is: ['once'],
        },
      ],
    },
    { fieldId: 'ftp.exportTransformRecords' },
    { fieldId: 'transform.expression.rules' },
    {
      fieldId: 'netsuite.netsuiteSuiteScriptlabel',
      label: 'SuiteScript Hooks (Optional, Developers Only)',
      type: 'labelTitle',
    },
    { fieldId: 'ftp.exportHooks' },
    { formId: 'hooks' },
    /*
    { fieldId: 'netsuite.metadata' },
    { fieldId: 'netsuite.selectoption' },
    { fieldId: 'netsuite.customFieldMetadata' },
    { fieldId: 'netsuite.skipGrouping' },
    { fieldId: 'netsuite.statsOnly' },
    { fieldId: 'netsuite.internalId' },
    { fieldId: 'netsuite.restlet.recordType' },
    { fieldId: 'netsuite.restlet.searchId' },
    { fieldId: 'netsuite.restlet.criteria[*].field' },
    { fieldId: 'netsuite.restlet.criteria[*].join' },
    { fieldId: 'netsuite.restlet.criteria[*].operator' },
    { fieldId: 'netsuite.restlet.criteria[*].searchValue' },
    { fieldId: 'netsuite.restlet.criteria[*].searchValue2' },
    { fieldId: 'netsuite.restlet.batchSize' },
    { fieldId: 'netsuite.restlet.hooks.batchSize' },
    { fieldId: 'netsuite.restlet.hooks.preSend.fileInternalId' },
    { fieldId: 'netsuite.restlet.hooks.preSend.function' },
    { fieldId: 'netsuite.restlet.hooks.preSend.configuration' },
    { fieldId: 'netsuite.distributed.recordType' },
    { fieldId: 'netsuite.distributed.executionContext' },
    { fieldId: 'netsuite.distributed.disabled' },
    { fieldId: 'netsuite.distributed.executionType' },
    { fieldId: 'netsuite.distributed.qualifier' },
    { fieldId: 'netsuite.distributed.hooks.preSend.fileInternalId' },
    { fieldId: 'netsuite.distributed.hooks.preSend.function' },
    { fieldId: 'netsuite.distributed.hooks.preSend.configuration' },
    { fieldId: 'netsuite.distributed.sublists' },
    { fieldId: 'netsuite.distributed.forceReload' },
    { fieldId: 'netsuite.distributed.ioEnvironment' },
    { fieldId: 'netsuite.distributed.lastSyncedDate' },
    { fieldId: 'netsuite.distributed.settings' },
    { fieldId: 'netsuite.getList[*].typeId' },
    { fieldId: 'netsuite.getList[*].internalId' },
    { fieldId: 'netsuite.getList[*].externalId' },
    { fieldId: 'netsuite.searchPreferences.bodyFieldsOnly' },
    { fieldId: 'netsuite.searchPreferences.pageSize' },
    { fieldId: 'netsuite.searchPreferences.returnSearchColumns' },
*/
  ],
  fieldSets: [],
};
