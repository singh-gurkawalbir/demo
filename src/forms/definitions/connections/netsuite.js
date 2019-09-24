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
      'netsuite.account',
      'netsuite.roleId',
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
};
