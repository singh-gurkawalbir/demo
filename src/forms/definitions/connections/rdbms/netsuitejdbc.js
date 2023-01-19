import { isNewId } from '../../../../utils/resource';

export default {
  preSave: formValues => {
    const newValues = { ...formValues };

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

    newValues['/jdbc/properties'] = [
      ['accountId', newValues['/netsuite/account']],
      ['roleId', newValues['/netsuite/token/auto/roleId']],
      ['serverDataSource', newValues['/jdbc/serverDataSource']],
    ];
    newValues['/jdbc/type'] = 'netsuitejdbc';

    delete newValues['/netsuite/token/auto'];
    delete newValues['/netsuite/token/auto/roleId'];
    delete newValues['/netsuite/token/auto/account'];
    delete newValues['/netsuite/tokenEnvironment'];

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

    if (fieldId === 'netsuite.roleId' && env !== '' && acc !== '') return { env, acc };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'jdbc.host': { fieldId: 'jdbc.host' },
    'jdbc.serverDataSource': { fieldId: 'jdbc.serverDataSource' },
    'jdbc.port': { fieldId: 'jdbc.port', defaultDisabled: true, defaultValue: 1708 },
    'jdbc.staticschemaexport': { fieldId: 'jdbc.staticschemaexport'},
    'jdbc.authType': { fieldId: 'jdbc.authType'},
    'netsuite.tokenEnvironment': {
      fieldId: 'netsuite.tokenEnvironment',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.tokenAccount': {
      id: 'netsuite.tokenAccount',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
      type: 'text',
      defaultValue: r => r && r.netsuite && r.netsuite.account,
      label: 'Account ID',
      uppercase: true,
    },
    'netsuite.token.auto.account': {
      id: 'netsuite.token.auto.account',
      type: 'text',
      label: 'Account ID',
      uppercase: true,
      required: true,
      defaultValue: r => r && r.netsuite && r.netsuite.account,
      visibleWhen: [{ field: 'netsuite.authType', is: ['token-auto'] }],
    },
    'netsuite.token.auto.roleId': {
      fieldId: 'netsuite.token.auto.roleId',
      type: 'text',
      label: 'Role',
      defaultDisabled: true,
      visible: r => r && !isNewId(r._id),
      visibleWhen: r => {
        const isNew = isNewId(r._id);

        if (isNew) return [];

        return [
          {
            field: 'netsuite.authType',
            is: ['token-auto'],
          },
        ];
      },
      defaultValue: r => r && r.netsuite && r.netsuite.roleId,
    },
    'netsuite.tokenId': {
      fieldId: 'netsuite.tokenId',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite.tokenSecret': {
      fieldId: 'netsuite.tokenSecret',
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    rdbmsAdvanced: { formId: 'rdbmsAdvanced' },
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
              {fields: ['jdbc.staticschemaexport']},
            ],
          },
          { fields: [
            'jdbc.authType',
            'netsuite.tokenEnvironment',
            'netsuite.tokenAccount',
            'netsuite.token.auto.account',
            'netsuite.token.auto.roleId',
            'netsuite.token.auto.roleId',
            'netsuite.tokenId',
            'netsuite.tokenSecret',
          ]},

        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rdbmsAdvanced'],
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
