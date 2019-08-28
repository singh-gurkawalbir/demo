export default {
  optionsHandler(fieldId, fields) {
    const { value: env } =
      fields.find(field => field.id === 'netsuite.environment') || {};
    const { value: acc } =
      fields.find(field => field.id === 'netsuite.account') || {};

    if (fieldId === 'netsuite.account' && env !== '') {
      return { env };
    }

    if (fieldId === 'netsuite.roleId' && env !== '' && acc !== '')
      return { env, acc };
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'netsuite.authType',
      required: true,
      defaultValue: r => {
        let aType = '';

        if (
          r &&
          r.netsuite &&
          (r.netsuite._iClientId ||
            r.netsuite.tokenSecret ||
            r.netsuite.tokenId)
        ) {
          aType = 'token';
        } else if (
          r &&
          r.netsuite &&
          (r.netsuite.email || r.netsuite.password)
        ) {
          aType = 'basic';
        }

        return aType;
      },
    },
    {
      fieldId: 'netsuite.email',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
      requiredWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'netsuite.password',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
      requiredWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    // {
    //   id: 'netsuite.environmentToken',
    //   name: '/netsuite/environment',
    //   type: 'select',
    //   helpKey: 'connection.netsuite.environment',
    //   options: [
    //     {
    //       items: [
    //         { label: 'Production', value: 'production' },
    //         { label: 'Beta', value: 'beta' },
    //         { label: 'Sandbox2.0', value: 'sandbox2.0' },
    //       ],
    //     },
    //   ],
    //   visibleWhen: [
    //     {
    //       field: 'netsuite.authType',
    //       is: ['token'],
    //     },
    //   ],
    // },
    {
      fieldId: 'netsuite.account',
      netsuiteResourceType: 'account',
      refreshOptionsOnChangesTo: ['validate', 'netsuite.environment'],
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      fieldId: 'netsuite.roleId',
      netsuiteResourceType: 'role',
      refreshOptionsOnChangesTo: [
        'validate',
        'netsuite.account',
        'netsuite.environment',
      ],
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
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
      label: 'Save',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'testandsave',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token'],
        },
      ],
    },
  ],
};
