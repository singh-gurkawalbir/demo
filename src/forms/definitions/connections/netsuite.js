export default {
  fields: [
    { fieldId: 'name' },
    { fieldId: 'netsuite.authType' },
    { fieldId: 'netsuite.email' },
    { fieldId: 'netsuite.password' },
    { fieldId: 'netsuite.environment' },
    { fieldId: 'netsuite.roleId' },
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
};
