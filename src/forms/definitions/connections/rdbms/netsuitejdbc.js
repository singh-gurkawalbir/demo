import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

    let roleId = newValues['/netsuite/token/auto/roleId'];
    let accId = newValues['/netsuite/tokenAccount'] || newValues['/netsuite/token/auto/account'];

    if (newValues['/netsuite/authType'] === 'token') {
      newValues['/netsuite/account'] = newValues['/netsuite/tokenAccount'];
      newValues['/netsuite/requestLevelCredentials'] = true;
    } else if (newValues['/netsuite/authType'] === 'token-auto') {
      newValues['/netsuite/account'] = newValues['/netsuite/token/auto/account'];
      newValues['/netsuite/roleId'] = newValues['/netsuite/token/auto/roleId'];
      newValues['/netsuite/tokenId'] = undefined;
      newValues['/netsuite/tokenSecret'] = undefined;
    }
    newValues['/type'] = 'jdbc';
    newValues['/jdbc/type'] = 'netsuitejdbc';
    newValues['/jdbc/user'] = 'TBA';
    newValues['/jdbc/database'] = newValues['/jdbc/serverDataSource'];
    newValues['/jdbc/concurrencyLevel'] = newValues['/rdbms/concurrencyLevel'];

    if (newValues['/jdbc/serverDataSource'] === 'NetSuite.com') {
      newValues['/netsuite/authType'] = 'basic';
      roleId = newValues['/jdbc/roleId'];
      accId = newValues['/jdbc/account'];
      newValues['/jdbc/user'] = newValues['/jdbc/email'];
      delete newValues['/jdbc/email'];
      delete newValues['/netsuite/tokenAccount'];
    } else {
      newValues['/jdbc/email'] = undefined;
      newValues['/jdbc/password'] = undefined;
    }
    const configuredProperties = newValues['/rdbms/options'] || [];
    let properties = [
      { name: 'ServerDataSource', value: newValues['/jdbc/serverDataSource'] },
      { name: 'StaticSchema', value: newValues['/jdbc/StaticSchema'] ? '1' : '0' },
    ];

    if (roleId) {
      properties = [{ name: 'RoleID', value: roleId }, ...properties];
    }
    if (accId) {
      properties = [{ name: 'AccountID', value: accId }, ...properties];
    }
    newValues['/jdbc/properties'] = [...properties, ...configuredProperties];

    delete newValues['/netsuite/token/auto'];
    delete newValues['/netsuite/roleId'];
    delete newValues['/netsuite/token/auto/roleId'];
    delete newValues['/netsuite/token/auto/account'];
    delete newValues['/jdbc/StaticSchema'];
    delete newValues['/jdbc/serverDataSource'];
    delete newValues['/jdbc/roleId'];
    delete newValues['/jdbc/account'];
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
      label: 'Server data source',
      options: [{
        items: [
          { label: 'NetSuite.com', value: 'NetSuite.com' },
          { label: 'NetSuite2.com', value: 'NetSuite2.com' },
        ],
      }],
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'ServerDataSource')?.value || '',
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
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'StaticSchema')?.value === '1',
      visibleWhen: [{field: 'jdbc.serverDataSource', is: ['NetSuite2.com']}],
    },
    'jdbc.authType': {
      fieldId: 'jdbc.authType',
      defaultValue: r => {
        // passing '' because basic option not present in dropdown options
        if (r?.netsuite?.authType === 'basic') return '';

        return r?.netsuite?.authType;
      },
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] }],
    },
    'jdbc.email': {
      fieldId: 'jdbc.email',
      required: true,
      defaultValue: r => r?.jdbc?.user,
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'jdbc.password': {
      fieldId: 'jdbc.password',
      required: true,
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'netsuite.tokenAccount': {
      id: 'netsuite.tokenAccount',
      type: 'text',
      required: true,
      label: 'Account ID',
      uppercase: true,
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'AccountID')?.value || null,
      visibleWhenAll: [
        { field: 'netsuite.authType', is: ['token'] },
        { field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] },
      ],
    },
    'jdbc.account': {
      fieldId: 'jdbc.account',
      required: true,
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'AccountID')?.value,
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'jdbc.roleId': {
      fieldId: 'jdbc.roleId',
      required: true,
      uppercase: true,
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'RoleID')?.value,
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite.com'] }],
    },
    'netsuite.token.auto.account': {
      id: 'netsuite.token.auto.account',
      type: 'text',
      label: 'Account ID',
      uppercase: true,
      required: true,
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'AccountID')?.value || null,
      visibleWhenAll: [
        { field: 'netsuite.authType', is: ['token-auto'] },
        { field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] },
      ],
    },
    'netsuite.token.auto.roleId': {
      fieldId: 'netsuite.token.auto.roleId',
      type: 'text',
      label: 'Role',
      defaultDisabled: true,
      visible: r => r && !isNewId(r._id),
      visibleWhen: [{ field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] }],
      defaultValue: r => r?.jdbc?.properties?.find(field => field.name === 'RoleID')?.value || null,
    },
    'netsuite.tokenId': {
      fieldId: 'netsuite.tokenId',
      visibleWhenAll: [
        { field: 'netsuite.authType', is: ['token'] },
        { field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] },
      ],
    },
    'netsuite.tokenSecret': {
      fieldId: 'netsuite.tokenSecret',
      visibleWhenAll: [
        { field: 'netsuite.authType', is: ['token'] },
        { field: 'jdbc.serverDataSource', is: ['NetSuite2.com'] },
      ],
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'rdbms.concurrencyLevel': {
      fieldId: 'rdbms.concurrencyLevel',
      defaultValue: r => r?.jdbc?.concurrencyLevel,
    },
    'rdbms.options': {
      fieldId: 'rdbms.options',
      defaultValue: r => r?.jdbc?.properties?.filter(
        property => !['AccountID', 'RoleID', 'StaticSchema', 'ServerDataSource'].includes(property.name)),
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
              { fields: ['jdbc.StaticSchema'] },
            ],
          },
          {
            fields: [
              'jdbc.authType',
              'jdbc.email',
              'jdbc.password',
              'netsuite.tokenAccount',
              'jdbc.account',
              'jdbc.roleId',
              'netsuite.token.auto.account',
              'netsuite.token.auto.roleId',
              'netsuite.tokenId',
              'netsuite.tokenSecret',
            ],
          },

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
      visibleWhenAll: [
        {
          field: 'netsuite.authType',
          is: [''],
        },
        {
          field: 'jdbc.serverDataSource',
          isNot: ['NetSuite.com'],
        },
      ],
    },
    {
      id: 'oauthandcancel',
      visibleWhenAll: [
        {
          field: 'netsuite.authType',
          is: ['token-auto'],
        },
        {
          field: 'jdbc.serverDataSource',
          is: ['NetSuite2.com'],
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
        {
          field: 'jdbc.serverDataSource',
          is: ['NetSuite.com'],
        },
      ],
    },
  ],
};
