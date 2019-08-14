export default {
  optionsHandler(fieldId, fields) {
    const { value: env } =
      fields.find(field => field.id === 'netsuite.environment') || {};
    const { value: acc } =
      fields.find(field => field.id === 'netsuite.account') || {};

    if (fieldId === 'netsuite.account') return { env };

    if (fieldId === 'netsuite.roleId') return { env, acc };
  },
  fields: [
    { fieldId: 'name' },
    { fieldId: 'netsuite.authType' },
    { fieldId: 'netsuite.email' },
    { fieldId: 'netsuite.password' },
    {
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
    },
    {
      fieldId: 'netsuite.account',
      netsuiteResourceType: 'account',
      refreshOptionsOnChangesTo: ['netsuite.environment'],
    },
    {
      fieldId: 'netsuite.roleId',
      netsuiteResourceType: 'role',
      refreshOptionsOnChangesTo: ['netsuite.account', 'netsuite.environment'],
    },
    { fieldId: 'netsuite.linkSuiteScriptIntegrator' },
    /*
    { fieldId: 'netsuite.account' },
    { fieldId: 'netsuite.tokenId' },
    { fieldId: 'netsuite.tokenSecret' },

    { fieldId: 'netsuite.requestLevelCredentials' },
    { fieldId: 'netsuite.dataCenterURLs' },
    { fieldId: 'netsuite.accountName' },
    { fieldId: 'netsuite.roleName' },
    { fieldId: 'netsuite.concurrencyLevelRESTlet' },
    { fieldId: 'netsuite.concurrencyLevelWebServices' },
    { fieldId: 'netsuite.concurrencyLevel' },
    { fieldId: 'netsuite.wsdlVersion' },
    { fieldId: 'netsuite.applicationId' },
    */
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [
        { fieldId: '_borrowConcurrencyFromConnectionId' },
        // There isn't any help text for this
        { fieldId: 'netsuite.concurrencyLevel' },
      ],
    },
  ],

  actions: [
    {
      id: 'validate',
      label: 'Validate',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'save',
    },
  ],
};
