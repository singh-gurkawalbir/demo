export default {
  preSave: formValues => {
    const newValues = formValues;

    if (newValues['/netsuite/authType'] === 'token') {
      newValues['/netsuite/environment'] =
        newValues['/netsuite/tokenEnvironment'];
      newValues['/netsuite/account'] = newValues['/netsuite/tokenAccount'];
      newValues['/netsuite/requestLevelCredentials'] = true;

      newValues['/netsuite/wsdlVersion'] = 'next';
      newValues['/netsuite/email'] = undefined;
      newValues['/netsuite/password'] = undefined;
    } else if (newValues['/netsuite/authType'] === 'basic') {
      newValues['/netsuite/wsdlVersion'] = 'current';
      newValues['/netsuite/tokenId'] = undefined;
      newValues['/netsuite/tokenSecret'] = undefined;
      newValues['/netsuite/_iClientId'] = undefined;
    }

    return newValues;
  },
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
  fieldMap: {
    name: { fieldId: 'name' },
    'netsuite.authType': {
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
    'netsuite.email': {
      fieldId: 'netsuite.email',
      visibleWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
      requiredWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
    },
    'netsuite.password': {
      fieldId: 'netsuite.password',
      visibleWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
      requiredWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
    },
    'netsuite.environment': {
      fieldId: 'netsuite.environment',
      netsuiteResourceType: 'environment',
      visibleWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
    },
    'netsuite.tokenEnvironment': {
      fieldId: 'netsuite.tokenEnvironment',
      netsuiteResourceType: 'environment',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite._iClientId': {
      fieldId: 'netsuite._iClientId',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
      filter: { provider: 'netsuite' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
    },
    'netsuite.account': {
      fieldId: 'netsuite.account',
      netsuiteResourceType: 'account',
      refreshOptionsOnChangesTo: [
        'validate',
        'netsuite.account',
        'netsuite.environment',
        'netsuite.roleId',
      ],
      visibleWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
    },
    'netsuite.tokenAccount': {
      fieldId: 'netsuite.tokenAccount',
      netsuiteResourceType: 'account',
      refreshOptionsOnChangesTo: [
        'validate',
        'netsuite.account',
        'netsuite.environment',
        'netsuite.roleId',
      ],
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.roleId': {
      fieldId: 'netsuite.roleId',
      netsuiteResourceType: 'role',
      refreshOptionsOnChangesTo: [
        'validate',
        'netsuite.account',
        'netsuite.environment',
        'netsuite.roleId',
      ],
      visibleWhen: [{ field: 'netsuite.authType', is: ['basic'] }],
    },
    'netsuite.tokenId': {
      fieldId: 'netsuite.tokenId',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.tokenSecret': {
      fieldId: 'netsuite.tokenSecret',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.linkSuiteScriptIntegrator': {
      fieldId: 'netsuite.linkSuiteScriptIntegrator',
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'netsuite.concurrencyLevel': { fieldId: 'netsuite.concurrencyLevel' },
  },
  layout: {
    fields: [
      'name',
      'netsuite.authType',
      'netsuite.email',
      'netsuite.password',
      'netsuite.environment',
      'netsuite.tokenEnvironment',
      'netsuite.account',
      'netsuite.tokenAccount',
      'netsuite.roleId',
      'netsuite.tokenId',
      'netsuite.tokenSecret',
      'netsuite._iClientId',
      'netsuite.linkSuiteScriptIntegrator',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: [
          '_borrowConcurrencyFromConnectionId',
          'netsuite.concurrencyLevel',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
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
