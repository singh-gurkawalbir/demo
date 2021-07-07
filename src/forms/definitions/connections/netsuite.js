import { isNewId } from '../../../utils/resource';
import { isProduction } from '../../formFactory/utils';

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
    } else if (newValues['/netsuite/authType'] === 'basic') {
      newValues['/netsuite/tokenId'] = undefined;
      newValues['/netsuite/tokenSecret'] = undefined;
      newValues['/netsuite/_iClientId'] = undefined;
    } else if (newValues['/netsuite/authType'] === 'token-auto') {
      newValues['/netsuite/email'] = undefined;
      newValues['/netsuite/password'] = undefined;
      newValues['/netsuite/account'] =
        newValues['/netsuite/token/auto/account'];
      newValues['/netsuite/tokenId'] = undefined;
      newValues['/netsuite/tokenSecret'] = undefined;
      newValues['/netsuite/roleId'] = newValues['/netsuite/token/auto/roleId'];
    }

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
    'netsuite.authType': {
      id: 'netsuite.authType',
      label: 'Authentication type',
      type: 'nsauthtype',
      required: true,
      skipSort: true,
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
      visibleWhen: [{ field: 'netsuite.authType', is: ['token'] }],
    },
    'netsuite._iClientId': {
      fieldId: 'netsuite._iClientId',
      visibleWhen: [
        { field: 'netsuite.authType', is: ['token', 'token-auto'] },
      ],
      filter: { provider: 'netsuite' },
      type: 'dynaiclient',
      connType: 'netsuite',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      requiredWhen: r => {
        const isRequired =
          !!r._connectorId || (!r._connectorId && !isProduction());

        return isRequired
          ? [
            {
              field: 'netsuite.authType',
              is: ['token-auto'],
            },
            {
              field: 'netsuite.authType',
              is: ['token'],
            },
          ]
          : [];
      },
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
    'netsuite.linkSuiteScriptIntegrator': {
      fieldId: 'netsuite.linkSuiteScriptIntegrator',
    },
    _borrowConcurrencyFromConnectionId: {
      fieldId: '_borrowConcurrencyFromConnectionId',
    },
    'netsuite.concurrencyLevel': { fieldId: 'netsuite.concurrencyLevel' },
    application: {
      fieldId: 'application',
    },
    'netsuite.wsdlVersion': {
      id: 'netsuite.wsdlVersion',
      type: 'select',
      label: 'WSDL version',
      skipSort: true,
      defaultValue: r => {
        const version = r?.netsuite?.wsdlVersion;

        if (version === 'next') return '2018.1';
        if (version === 'current') return '2016.2';

        return version || '2020.2';
      },
      options: [
        {
          items: [
            { label: '2020.2', value: '2020.2' },
            { label: '2018.1', value: '2018.1' },
            { label: '2016.2', value: '2016.2' },
          ],
        },
      ],
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
        fields: [
          'netsuite.authType',
          'netsuite.email',
          'netsuite.password',
          'netsuite.environment',
          'netsuite.tokenEnvironment',
          'netsuite.account',
          'netsuite.tokenAccount',
          'netsuite.token.auto.account',
          'netsuite.token.auto.roleId',
          'netsuite.roleId',
          'netsuite.tokenId',
          'netsuite.tokenSecret',
          'netsuite._iClientId',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'netsuite.linkSuiteScriptIntegrator',
          '_borrowConcurrencyFromConnectionId',
          'netsuite.concurrencyLevel',
          'netsuite.wsdlVersion',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
        {
          field: 'netsuite.authType',
          is: [''],
        },
      ],
    },
    {
      id: 'saveandclose',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
        {
          field: 'netsuite.authType',
          is: [''],
        },
      ],
    },
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token-auto'],
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
    {
      id: 'testsaveandclose',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token'],
        },
      ],
    },
    {
      id: 'cancel',
    },
    {
      id: 'validate',
      label: 'Validate',
      mode: 'secondary',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['basic'],
        },
      ],
    },
    {
      id: 'test',
      mode: 'secondary',
      visibleWhen: [
        {
          field: 'netsuite.authType',
          is: ['token'],
        },
      ],
    },
  ],
};
