import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = {...formValues};

    const roleId = newValues['/netsuite/token/auto/roleId'];
    const accId = newValues['/netsuite/tokenAccount'] || newValues['/netsuite/token/auto/account'];

    if (newValues['/netsuite/authType'] === 'token') {
      newValues['/netsuite/account'] = newValues['/netsuite/tokenAccount'];
      newValues['/netsuite/requestLevelCredentials'] = true;

      newValues['/netsuite/email'] = undefined;
      newValues['/netsuite/password'] = undefined;
    } else if (newValues['/netsuite/authType'] === 'token-auto') {
      newValues['/netsuite/email'] = undefined;
      newValues['/netsuite/password'] = undefined;
      newValues['/netsuite/account'] =
        newValues['/netsuite/token/auto/account'];
      newValues['/netsuite/tokenId'] = undefined;
      newValues['/netsuite/tokenSecret'] = undefined;
      newValues['/netsuite/roleId'] = newValues['/netsuite/token/auto/roleId'];
    }

    let properties = [
      {name: 'ServerDataSource', value: newValues['/jdbc/serverDataSource']},
      {name: 'StaticSchema', value: newValues['/jdbc/StaticSchema'] ? 1 : 0 },
    ];

    if (roleId) {
      properties = [{name: 'RoleID', value: roleId}, ...properties];
    }

    if (accId) {
      properties = [{name: 'AccountID', value: accId}, ...properties];
    }

    const configuredProperties = newValues['/rdbms/options'] || [];

    newValues['/jdbc/properties'] = [...properties, ...configuredProperties];
    newValues['/jdbc/type'] = 'netsuitejdbc';
    newValues['/jdbc/database'] = newValues['/jdbc/serverDataSource'];
    newValues['/jdbc/user'] = 'TBA';
    newValues['/jdbc/concurrencyLevel'] = newValues['/rdbms/concurrencyLevel'];

    newValues['/type'] = 'jdbc';

    delete newValues['/netsuite/token/auto'];
    delete newValues['/netsuite/roleId'];
    delete newValues['/netsuite/token/auto/roleId'];
    delete newValues['/netsuite/token/auto/account'];
    delete newValues['/jdbc/StaticSchema'];
    delete newValues['/jdbc/serverDataSource'];
    delete newValues['/rdbms/concurrencyLevel'];
    delete newValues['/rdbms/options'];

    return newValues;
  },
  optionsHandler(fieldId, fields) {
    const { value: env } =
      fields.find(field => field.id === 'jdbc.environment') || {};
    const { value: acc } =
      fields.find(field => field.id === 'jdbc.account') || {};

    if (fieldId === 'jdbc.account' && env !== '') {
      return { env };
    }

    if (fieldId === 'jdbc.roleId' && env !== '' && acc !== '') return { env, acc };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'jdbc.host': { fieldId: 'jdbc.host' },
    'jdbc.serverDataSource': {
      id: 'jdbc.serverDataSource',
      isLoggable: true,
      required: true,
      type: 'select',
      label: 'Server data source',
      options: [{
        items: [
          {label: 'NetSuite.com', value: 'NetSuite.com'},
          {label: 'NetSuite2.com', value: 'NetSuite2.com'},
        ],
      }],
      defaultValue: r => {
        const properties = r?.jdbc?.properties || [];
        let value = '';

        properties.forEach(each => { if (each.name === 'ServerDataSource') value = each.value; });

        return value;
      },
    },
    'jdbc.port': {
      fieldId: 'jdbc.port',
      defaultDisabled: true,
      defaultValue: r => r?.jdbc?.port || 1708,
    },
    'jdbc.StaticSchema': {
      id: 'jdbc.StaticSchema',
      isLoggable: true,
      type: 'checkbox',
      label: 'Static schema export',
      visibleWhen: [
        {
          field: 'jdbc.serverDataSource',
          is: ['NetSuite2.com'],
        },
      ],
      defaultValue: r => {
        const properties = r?.jdbc?.properties || [];
        let value = null;

        properties.forEach(each => { if (each.name === 'StaticSchema') value = each.value; });

        if (value === '1') { return true; }

        return false;
      },
    },
    'jdbc.authType': { fieldId: 'jdbc.authType',
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] }],
    },
    'jdbc.email': {
      fieldId: 'jdbc.email',
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
      requiredWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'jdbc.password': {
      fieldId: 'jdbc.password',
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
      requiredWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'jdbc.environment': {
      fieldId: 'jdbc.environment',
      netsuiteResourceType: 'environment',
      visible: false,
    },
    'netsuite.tokenAccount': {
      id: 'netsuite.tokenAccount',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
      type: 'text',
      required: true,
      defaultValue: r => {
        const properties = r?.jdbc?.properties || [];
        let value = null;

        properties.forEach(each => { if (each.name === 'AccountID') value = each.value; });

        return value;
      },
      label: 'Account ID',
      uppercase: true,
    },
    'jdbc.account': {
      fieldId: 'jdbc.account',
      netsuiteResourceType: 'account',
      refreshOptionsOnChangesTo: [
        'validate',
        'jdbc.account',
        'jdbc.environment',
        'jdbc.roleId',
      ],
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'jdbc.roleId': {
      fieldId: 'jdbc.roleId',
      netsuiteResourceType: 'role',
      refreshOptionsOnChangesTo: [
        'validate',
        'jdbc.account',
        'jdbc.environment',
        'jdbc.roleId',
      ],
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'netsuite.token.auto.account': {
      id: 'netsuite.token.auto.account',
      type: 'text',
      label: 'Account ID',
      uppercase: true,
      required: true,
      defaultValue: r => {
        const properties = r?.jdbc?.properties || [];
        let value = null;

        properties.forEach(each => { if (each.name === 'AccountID') value = each.value; });

        return value;
      },
      visibleWhen: [{ field: 'netsuite.authType', is: ['token-auto'] }],
    },
    'netsuite.token.auto.roleId': {
      fieldId: 'netsuite.token.auto.roleId',
      type: 'text',
      label: 'Role',
      defaultDisabled: true,
      visible: r => r && !isNewId(r._id),
      defaultValue: r => {
        const properties = r?.jdbc?.properties || [];
        let value = null;

        properties.forEach(each => { if (each.name === 'RoleID') value = each.value; });

        return value;
      },
    },
    'netsuite.tokenId': {
      fieldId: 'netsuite.tokenId',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.tokenSecret': {
      fieldId: 'netsuite.tokenSecret',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    _borrowConcurrencyFromConnectionId: {fieldId: '_borrowConcurrencyFromConnectionId'},
    'rdbms.concurrencyLevel': { fieldId: 'rdbms.concurrencyLevel',
      defaultValue: r => r?.jdbc?.concurrencyLevel },
    'rdbms.options': {
      fieldId: 'rdbms.options',
      defaultValue: r => r?.jdbc?.properties?.filter(property => ![
        'AccountID', 'RoleID', 'StaticSchema', 'ServerDataSource',
      ].includes(property.name)),
    },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        containers: [
          {
            fields:
            [
              'jdbc.host',
              'jdbc.port',
              'jdbc.serverDataSource',
            ],
          },
          {
            type: 'indent',
            containers: [
              {fields: ['jdbc.StaticSchema']},
            ],
          },
          { fields: [
            'jdbc.authType',
            'jdbc.email',
            'jdbc.password',
            'jdbc.environment',
            'netsuite.tokenAccount',
            'jdbc.account',
            'jdbc.roleId',
            'netsuite.token.auto.account',
            'netsuite.token.auto.roleId',
            'netsuite.tokenId',
            'netsuite.tokenSecret',
          ]},

        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'rdbms.options',
          '_borrowConcurrencyFromConnectionId',
          'rdbms.concurrencyLevel',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: [''],
        },
      ],
    },
    {
      id: 'oauthandcancel',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token-auto'],
        },
      ],
    },
    {
      id: 'testandsavegroup',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'validateandsave',
      visibleWhen: [
        {
          field: 'jdbc.serverDataSource',
          is: ['NetSuite.com'],
        },
      ],
    },
  ],
};
