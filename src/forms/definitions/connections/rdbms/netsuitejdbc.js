import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = {...formValues};

    const roleId = newValues['/netsuite/token/auto/roleId'];
    const accId = newValues['/netsuite/tokenAccount'] || newValues['/netsuite/token/auto/account'];

    if (newValues['/netsuite/authType'] === 'token') {
      newValues['/netsuite/environment'] =
        newValues['/netsuite/tokenEnvironment'];
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
      {name: 'staticSchema', value: newValues['/jdbc/staticSchema'] ? 1 : 0 },
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
    delete newValues['/netsuite/tokenEnvironment'];
    delete newValues['/jdbc/staticSchema'];
    delete newValues['/jdbc/serverDataSource'];
    delete newValues['/rdbms/concurrencyLevel'];
    delete newValues['/rdbms/options'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'jdbc.host': { fieldId: 'jdbc.host' },
    'jdbc.serverDataSource': {
      id: 'jdbc.serverDataSource',
      isLoggable: true,
      required: true,
      type: 'select',
      label: 'Server Data Source',
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
    'jdbc.port': { fieldId: 'jdbc.port', defaultDisabled: true, defaultValue: 1708 },
    'jdbc.staticSchema': {
      id: 'jdbc.staticSchema',
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

        properties.forEach(each => { if (each.name === 'staticSchema') value = each.value; });

        if (value === '1') { return true; }

        return false;
      },
    },
    'jdbc.authType': { fieldId: 'jdbc.authType'},
    'netsuite.tokenEnvironment': {
      fieldId: 'netsuite.tokenEnvironment',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
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
        'AccountID', 'RoleID', 'staticSchema', 'ServerDataSource',
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
              {fields: ['jdbc.staticSchema']},
            ],
          },
          { fields: [
            'jdbc.authType',
            'netsuite.tokenEnvironment',
            'netsuite.tokenAccount',
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
  ],
};
