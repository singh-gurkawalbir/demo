/* global describe, expect, beforeAll, test */
import each from 'jest-each';
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../actions';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, TILE_STATUS, USER_ACCESS_LEVELS } from '../utils/constants';

const suitescriptConnectors = [
  {
    _id: 'suitescript-salesforce-netsuite',
    applications: [
      'salesforce',
      'netsuite',
    ],
    description: 'v2 is the legacy version of our Integration app that comes bundled with comprehensive out-of-the-box flows for the Lead-to-Cash process. With an intuitive setup that requires no coding, integrating platforms is a seamless process.',
    installSteps: [
      {
        __index: 1,
        completed: false,
        connectionType: 'netsuite',
        description: 'Select a NetSuite connection or create a new one for your NetSuite account. Integrator.io will use this to connect to your NetSuite account.',
        imageURL: '/images/company-logos/netsuite.png',
        name: 'NetSuite Connection',
        type: 'connection',
      },
      {
        __index: 2,
        completed: false,
        description: 'Install integrator bundle in NetSuite account.',
        imageURL: '/images/company-logos/netsuite.png',
        installURL: 'https://system.na1.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
        name: 'Integrator Bundle',
        type: 'integrator-bundle',
      },
      {
        __index: 3,
        completed: false,
        description: 'Install Salesforce Connector bundle in NetSuite account.',
        imageURL: '/images/company-logos/netsuite.png',
        installURL: 'https://system.na1.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=48893',
        name: 'Salesforce Bundle',
        type: 'connector-bundle',
      },
      {
        __index: 4,
        completed: false,
        connectionType: 'netsuite',
        description: 'Provide NetSuite account credentials. The Connector will use them to send data from Salesforce to NetSuite.',
        imageURL: '/images/company-logos/netsuite.png',
        name: 'NetSuite Connection',
        type: 'ssConnection',
      },
      {
        __index: 5,
        completed: false,
        connectionType: 'salesforce',
        description: 'Provide Salesforce account credentials. The Connector will use them to send data from NetSuite to Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        name: 'Salesforce Connection',
        type: 'ssConnection',
      },
      {
        __index: 6,
        completed: false,
        description: 'Install integrator package in Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        installURL: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04to0000000OIhq',
        installerFunction: 'verifyIntegratorPackage',
        name: 'Integrator package',
        type: 'package',
      },
      {
        __index: 7,
        completed: false,
        description: 'Install NetSuite Connector package in Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        installURL: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04tj0000000LYeu',
        installerFunction: 'verifyConnectorPackage',
        name: 'Connector package',
        type: 'package',
      },
    ],
    name: 'Salesforce - NetSuite Connector (V2)',
    ssName: 'Salesforce Connector',
    urlName: 'sfns',
    user: {
      company: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      name: 'Celigo',
    },
  },
  {
    _id: 'suitescript-svb-netsuite',
    applications: [
      'svb',
      'netsuite',
    ],
    description: 'The Silicon Valley Bank – NetSuite Connector enables NetSuite customers to automatically import Silicon Valley Bank (SVB) transactions into NetSuite and reconcile efficiently using a wizard-driven process. The Connector offers an intuitive user interface, customized matching logic and automated import of SVB account transactions into NetSuite.',
    name: 'SVB - NetSuite Connector',
    ssName: 'SVB Connector',
    urlName: 'svbns',
    user: {
      company: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      name: 'Celigo',
    },
  },
];

describe('resource region selector testcases', () => {
  describe('selectors.mkTileApplications test cases', () => {
    const state = {
      data: {
        resources: {
          integrations: [{
            _id: 'diyIntegration',
            name: 'DIY integration',
          }, {
            _id: 'iaIntegration',
            _connectorId: 'connector1',
            name: 'DIY integration',
          }, {
            _id: 'ia2Integration',
            _connectorId: 'connector2',
            installSteps: ['1'],
            initChild: () => {},
            name: 'IA2.0 parent integration',
          }, {
            _id: 'ia2IntegrationChild',
            _parentId: 'ia2Integration',
            installSteps: ['1'],
            _connectorId: 'connector2',
            name: 'IA2.0 child integration',
          }],
          connections: [{
            _id: 'connection1',
            assistant: 'assistant1',
            _integrationId: 'ia2IntegrationChild',
          },
          {
            _id: 'connection2',
            assistant: 'assistant2',
            _integrationId: 'ia2IntegrationChild',

          },
          {
            _id: 'connection3',
            assistant: 'assistant3',
            _integrationId: 'ia2IntegrationChild',

          },
          {
            _id: 'connection4',
            assistant: 'assistant4',
            _integrationId: 'ia2Integration',

          },
          {
            _id: 'connection5',
            assistant: 'assistant5',
            _integrationId: 'ia2Integration',

          },
          {
            _id: 'connection6',
            assistant: 'assistant1',
            _integrationId: 'ia2IntegrationChild',

          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkTileApplications();

      expect(selector()).toEqual([]);
      expect(selector({})).toEqual([]);
      expect(selector({_connectorId: 'yes'})).toEqual([]);
      expect(selector(null)).toEqual([]);
      expect(selector(null, null)).toEqual([]);
      expect(selector(null, {_connectorId: 'yes'})).toEqual([]);
      expect(selector({}, {_connectorId: 'yes'})).toEqual([]);
      expect(selector(null, {_integrationId: 'yes'})).toEqual([]);
      expect(selector({}, {_integrationId: 'yes'})).toEqual([]);
    });

    test('should return empty array for diy integrations', () => {
      const selector = selectors.mkTileApplications();

      expect(selector(state, {_integrationId: 'diyIntegration'})).toEqual([]);
      expect(selector(state, {_integrationId: 'none'})).toEqual([]);
    });

    test('should return correct application list for integrationApp', () => {
      const selector = selectors.mkTileApplications();

      expect(selector(state, {
        _connectorId: 'connector1',
        connector: {
          applications: ['app1', 'app2'],
        },
      })).toEqual(['app1', 'app2']);

      expect(selector(state, {
        _connectorId: 'connector1',
        connector: {
          applications: ['app1', 'app2', 'app3', 'app4', 'app5'],
        },
      })).toEqual(['app1', 'app2', 'app3', 'app4']);

      expect(selector(state, {
        _connectorId: 'connector1',
        name: 'Magento 1 - NetSuite',
        connector: {
          applications: ['magento', 'app2'],
        },
      })).toEqual(['magento1', 'app2']);
    });

    test('should return correct application list for integrationApp 2.0', () => {
      const selector = selectors.mkTileApplications();

      expect(selector(state, {
        _connectorId: 'connector1',
        _integrationId: 'ia2Integration',
        connector: {
          applications: ['app1', 'app2'],
        },
      })).toEqual(['assistant1', 'assistant2', 'assistant3', 'assistant4']);

      expect(selector(state, {
        _connectorId: 'connector1',
        _integrationId: 'ia2Integration',
      })).toEqual(['assistant1', 'assistant2', 'assistant3', 'assistant4']);
    });
  });

  describe('selectors.resourceList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceList()).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: undefined});
    });
  });

  describe('selectors.resourceListModified test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceListModified(false)).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: undefined});
    });
  });

  describe('selectors.makeResourceListSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeResourceListSelector();

      expect(selector(undefined, {})).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: undefined});
    });
  });

  describe('selectors.flowDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowDetails()).toEqual({});
    });
  });

  describe('mkFlowDetails', () => {
    test('should work', () => {
      const state = reducer({
        data: {
          resources: {
            flows: [{
              _id: 123,
              name: 'aflow',
              _integrationId: 456,
            }],
            integrations: [{
              _id: 456,
              name: 'anintegration',
            }],
          },
        },
      }, 'a');
      const sel = selectors.mkFlowDetails();

      expect(sel(state, 123)).not.toBeNull();
    });
  });

  describe('selectors.isDataLoader test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoader()).toEqual(false);
    });
  });

  describe('selectors.mkFlowAttributes test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowAttributes();

      expect(selector(undefined, {})).toEqual({});
    });
  });

  describe('selectors.flowType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowType()).toEqual('');
    });
  });

  describe('selectors.mkFlowAllowsScheduling test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector()).toEqual(false);
    });
  });

  describe('selectors.flowUsesUtilityMapping test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowUsesUtilityMapping()).toEqual(false);
    });
  });

  describe('selectors.flowSupportsMapping test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowSupportsMapping()).toEqual(false);
    });
  });

  describe('selectors.flowSupportsSettings test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowSupportsSettings()).toEqual(false);
    });
  });

  describe('selectors.flowListWithMetadata test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowListWithMetadata()).toEqual({resources: []});
    });
  });

  describe('selectors.mkNextDataFlowsForFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkNextDataFlowsForFlow();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.isConnectionOffline test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isConnectionOffline()).toEqual(null);
    });
  });

  describe('selectors.resourcesByIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourcesByIds()).toEqual([]);
    });
  });

  describe('userAccessLevelOnConnection selector', () => {
    test(`should return ${USER_ACCESS_LEVELS.ACCOUNT_OWNER} access level for account owner`, () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                },
              ],
              users: [],
            },
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevelOnConnection(state, 'c1')).toEqual(
        USER_ACCESS_LEVELS.ACCOUNT_OWNER
      );
    });
    test(`should return ${USER_ACCESS_LEVELS.ACCOUNT_ADMIN} access level for account administrator`, () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: '123' },
            org: {
              accounts: [
                {
                  _id: '123',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
                },
              ],
              users: [],
            },
          },
        },
        'some action'
      );

      expect(selectors.userAccessLevelOnConnection(state, 'c1')).toEqual(
        USER_ACCESS_LEVELS.ACCOUNT_ADMIN
      );
    });
    describe('should return correct access level for org users', () => {
      const accounts = [
        {
          _id: 'aShare1',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
        },
        {
          _id: 'aShare2',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
        },
        {
          _id: 'aShare3',
          accessLevel: USER_ACCESS_LEVELS.TILE,
          integrationAccessLevel: [
            {
              _integrationId: 'i1',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
            {
              _integrationId: 'i2',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
            },
          ],
        },
        {
          _id: 'aShare4',
          accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
        },
      ];
      const testCases = [];

      testCases.push(
        [
          USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
          'any',
          '',
          'account level manage user',
          'aShare1',
        ],
        [
          USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
          'any',
          '',
          'account level adminstrator user',
          'aShare4',
        ],
        [
          USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
          'any',
          '',
          'account level monitor user',
          'aShare2',
        ],
        [
          INTEGRATION_ACCESS_LEVELS.MONITOR,
          'c1',
          ' (registed on an integration that user has monitor access)',
          'tile level user',
          'aShare3',
        ],
        [
          INTEGRATION_ACCESS_LEVELS.MANAGE,
          'c2',
          ' (registed on an integration that user has manage access)',
          'tile level user',
          'aShare3',
        ],
        [
          undefined,
          'c4',
          ' (not registed on any integration that user has access)',
          'tile level user',
          'aShare3',
        ]
      );
      each(testCases).test(
        'should return %s for %s%s connection for %s',
        (expected, connectionId, description, userType, defaultAShareId) => {
          const state = reducer(
            {
              user: {
                profile: {},
                preferences: { defaultAShareId },
                org: {
                  accounts,
                },
              },
              data: {
                resources: {
                  integrations: [
                    { _id: 'i1', _registeredConnectionIds: ['c1', 'c2'] },
                    { _id: 'i2', _registeredConnectionIds: ['c2', 'c3'] },
                  ],
                },
              },
            },
            'some action'
          );

          expect(
            selectors.userAccessLevelOnConnection(state, connectionId)
          ).toEqual(expected);
        }
      );
    });
  });

  describe('matchingConnectionList selector', () => {
    const netsuiteConnection = {
      _id: 'netsuiteId',
      type: 'netsuite',
      netsuite: {
        account: 'netsuite_account',
      },
    };
    const postgresqlConnection = {
      _id: 'postgresqlId',
      type: 'rdbms',
      rdbms: {
        type: 'postgresql',
      },
    };
    const snowflakeConnection = {
      _id: 'snowflakeId',
      type: 'rdbms',
      rdbms: {
        type: 'snowflake',
      },
    };
    const netsuiteConnectionConnector = {
      _id: 'netsuiteId',
      _connectorId: 'connector',
      type: 'netsuite',
      netsuite: {
        account: 'netsuite_account',
      },
    };
    const validNetsuiteConnection = {
      _id: 'netsuiteId',
      type: 'netsuite',
      netsuite: {
        account: 'netsuite_account',
        environment: 'production',
      },
    };
    const salesforceConnection = {
      _id: 'salesforce',
      type: 'salesforce',
    };
    const salesforceConnectionSandbox = {
      _id: 'salesforce',
      sandbox: true,
      type: 'salesforce',
    };
    const restConnection = {
      _id: 'restConnection',
      type: 'rest',
      rest: {
        baseURI: 'https://baseuri.com',
      },
    };
    const assistantConnection = {
      _id: 'assistant',
      type: 'rest',
      assistant: 'zendesk',
      rest: {
        baseURI: 'https://baseuri.com',
      },
    };
    const assistantConnectionSandbox = {
      _id: 'assistant',
      type: 'rest',
      sandbox: true,
      assistant: 'zendesk',
      rest: {
        baseURI: 'https://baseuri.com',
      },
    };
    const connections = [
      netsuiteConnection,
      netsuiteConnectionConnector,
      validNetsuiteConnection,
      salesforceConnection,
      salesforceConnectionSandbox,
      restConnection,
      assistantConnection,
      assistantConnectionSandbox,
      postgresqlConnection,
      snowflakeConnection,
    ];

    test('should not throw any error when params are bad', () => {
      const state = {};

      expect(selectors.matchingConnectionList(state, {})).toEqual([]);
      expect(selectors.matchingConnectionList(state, undefined)).toEqual([]);
      expect(selectors.matchingConnectionList(undefined, {})).toEqual([]);
      expect(selectors.matchingConnectionList(undefined, undefined)).toEqual([]);
    });
    test('should return correct values in production environment', () => {
      const state = reducer(
        {
          data: {
            resources: {
              connections,
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.matchingConnectionList(state, { type: 'salesforce' })
      ).toEqual([salesforceConnection]);
      expect(selectors.matchingConnectionList(state, { type: 'rest' })).toEqual([
        restConnection,
        assistantConnection,
      ]);
      expect(
        selectors.matchingConnectionList(state, { type: 'rdbms', rdbms: {type: 'postgresql'} })
      ).toEqual([postgresqlConnection]);
      expect(selectors.matchingConnectionList(state, { type: 'rdbms', rdbms: {type: 'snowflake'} })).toEqual([
        snowflakeConnection,
      ]);
    });
    test('should return correct values in sandbox environment', () => {
      const state = reducer(
        {
          data: {
            resources: {
              connections,
            },
          },
          user: {
            preferences: {
              environment: 'sandbox',
            },
          },
        },
        'some_action'
      );

      expect(
        selectors.matchingConnectionList(state, { type: 'netsuite' })
      ).toEqual([]);
      expect(
        selectors.matchingConnectionList(state, { type: 'salesforce' })
      ).toEqual([salesforceConnectionSandbox]);
      expect(selectors.matchingConnectionList(state, { type: 'rest' })).toEqual([
        assistantConnectionSandbox,
      ]);
    });
  });

  describe('matchingStackList selector', () => {
    const stack1 = {
      _id: '57bfd7d06260d08f1ea6b831',
      name: 'Hightech connectors',
      type: 'server',
      lastModified: '2017-07-27T07:34:04.291Z',
      createdAt: '2017-03-20T12:25:53.129Z',
      server: {
        systemToken: '******',
        hostURI: 'http://localhost.io:7000',
        ipRanges: [],
      },
    };
    const stack2 = {
      _id: '57bfd7d06260d08f1ea6b831',
      name: 'Hightech connectors',
      _connectorId: 'connector',
      type: 'lambda',
      lastModified: '2017-07-27T07:34:04.291Z',
      createdAt: '2017-03-20T12:25:53.129Z',
      lambda: {
        systemToken: '******',
        hostURI: 'http://localhost.io:7000',
        ipRanges: [],
      },
    };
    const stacks = [stack1, stack2];

    test('should not throw any error when params are bad', () => {
      const state = {};

      expect(selectors.matchingStackList(state, {})).toEqual([]);
      expect(selectors.matchingStackList(state, undefined)).toEqual([]);
      expect(selectors.matchingStackList(undefined, {})).toEqual([]);
      expect(selectors.matchingStackList(undefined, undefined)).toEqual([]);
    });
    test('should return correct values in production environment', () => {
      const state = reducer(
        {
          data: {
            resources: {
              stacks,
            },
          },
        },
        'some_action'
      );

      expect(selectors.matchingStackList(state)).toEqual([stack1]);
    });
    test('should return correct values in sandbox environment', () => {
      const state = reducer(
        {
          data: {
            resources: {
              stacks,
            },
          },
          user: {
            preferences: {
              environment: 'sandbox',
            },
          },
        },
        'some_action'
      );

      expect(selectors.matchingStackList(state)).toEqual([stack1]);
    });
  });

  describe('publishedConnectors selector', () => {
    const published = [{ _id: 'c1' }, { _id: 'c2' }];

    test('should return suitescript connectors only, when state is undefined', () => {
      const state = reducer(
        {
          data: {
            resources: {},
          },
        },
        'some action'
      );

      expect(selectors.publishedConnectors(state)).toEqual(
        suitescriptConnectors
      );
    });
    test('should return both suitescript and io connectors', () => {
      const state = reducer(
        {
          data: {
            resources: {
              published,
            },
          },
        },
        'some action'
      );

      expect(selectors.publishedConnectors(state)).toEqual(
        published.concat(suitescriptConnectors)
      );
    });
  });

  describe('selectors.integrationEnabledFlowIds test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationEnabledFlowIds()).toEqual([]);
    });
  });

  describe('selectors.filteredResourceList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.filteredResourceList()).toEqual([]);
    });
  });

  describe('marketplaceConnectorList selector', () => {
    const connector1 = {
      _id: 'connector1',
      name: 'Sample Connector',
      contactEmail: 'sravan@sravan.com',
      published: false,
      _stackId: '57be8a07be81b76e185bbb8d',
      applications: ['amazonmws', 'netsuite'],
    };
    const connector2 = {
      _id: 'connector2',
      name: 'Sample Connector2',
      contactEmail: 'sravan@sravan.com',
      published: true,
      _stackId: '57be8a07be81b76e185bbb8d',
      applications: ['amazonmws', 'netsuite'],
    };
    const connectors = [connector1, connector2];
    let marketplaceConnectorsSelector;

    beforeAll(() => {
      marketplaceConnectorsSelector = selectors.makeMarketPlaceConnectorsSelector();
    });
    test('should not throw any error when params are bad', () => {
      const state = {};

      expect(marketplaceConnectorsSelector(state, '')).toEqual([]);
      expect(marketplaceConnectorsSelector(state, undefined)).toEqual([]);
      expect(marketplaceConnectorsSelector(undefined, '')).toEqual([]);
      expect(marketplaceConnectorsSelector(undefined, undefined)).toEqual([]);
    });
    test('should return correct values with respect to environment', () => {
      const state = reducer(
        {
          data: {
            marketplace: {
              connectors,
              templates: [],
            },
          },
        },
        'some_action'
      );

      expect(marketplaceConnectorsSelector(state, 'netsuite')).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
        },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
        },
      ]);
      expect(marketplaceConnectorsSelector(state, 'amazonmws', false)).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
        },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
        },
      ]);
    });
    test('should return correct values with license values', () => {
      const state = reducer(
        {
          data: {
            marketplace: {
              connectors,
              templates: [],
            },
          },
          user: {
            org: {
              accounts: [
                {
                  _id: 'accountId',
                  accessLevel: 'owner',
                  ownerUser: {
                    licenses: [
                      {
                        _id: 'licenseId',
                        createdAt: 'date',
                        _connectorId: 'connector1',
                        expires: moment()
                          .add(1, 'y')
                          .toISOString(),
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        'some_action'
      );

      expect(marketplaceConnectorsSelector(state, 'netsuite')).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
        },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
        },
      ]);
      expect(marketplaceConnectorsSelector(state, 'amazonmws', false)).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
        },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
        },
      ]);
      expect(marketplaceConnectorsSelector(state, 'amazonmws', true)).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
        },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
        },
      ]);
    });
  });

  describe('tiles', () => {
    const published = [
      {
        _id: 'connector1',
        name: 'Connector 1',
        user: { name: 'User 1', company: 'Company 1' },
        applications: ['app1', 'app2'],
      },
      {
        _id: 'connector2',
        name: 'Connector 2',
        user: { name: 'User 2' },
      },
    ];
    const integrations = [
      {
        _id: 'integration1',
      },
      {
        _id: 'integration2',
      },
      {
        _id: 'integration3',
      },
      {
        _id: 'integration4',
      },
      {
        _id: 'integration5',
        mode: 'settings',
      },
      {
        _id: 'integration6',
        mode: 'settings',
      },
      {
        _id: 'integration7',
        mode: 'settings',
      },
      {
        _id: 'integration8',
        mode: 'install',
      },
      {
        _id: 'integration9',
        mode: 'install',
      },
    ];
    const tilesCollection = [
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
      },
      {
        _integrationId: 'integration2',
        name: 'Integration Two',
        numError: 4,
        numFlows: 3,
      },
      {
        _integrationId: 'integration3',
        name: 'Integration Three',
        numError: 9,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 4,
      },
      {
        _integrationId: 'integration4',
        name: 'Integration Four',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
      },
      {
        _integrationId: 'integration5',
        _connectorId: 'connector1',
        name: 'Connector 1',
        numFlows: 6,
      },
      {
        _integrationId: 'integration6',
        _connectorId: 'connector1',
        tag: 'tag 1',
        name: 'Connector 1',
        numError: 36,
        numFlows: 7,
      },
      {
        _integrationId: 'integration7',
        _connectorId: 'connector1',
        tag: 'tag 2',
        name: 'Connector 1',
        numError: 49,
        offlineConnections: ['conn1'],
        numFlows: 8,
      },
      {
        _integrationId: 'integration8',
        _connectorId: 'connector2',
        name: 'Connector 2',
        numFlows: 9,
      },
      {
        _integrationId: 'integration9',
        _connectorId: 'connector2',
        name: 'Connector 2',
        tag: 'test tag',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
      },
    ];
    const standaloneTiles = [
      {
        _integrationId: 'none',
        name: 'Standalone flows',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
      },
    ];

    test('should return correct tiles info for account owner', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN, environment: 'production' },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_OWNER,
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              published,
              integrations,
            },
          },
        },
        actions.resource.receivedCollection('tiles', [
          ...standaloneTiles,
          ...tilesCollection,
        ])
      );
      const tiles = selectors.mkTiles()(state);
      const expectedIntegrationPermissions = {
        accessLevel: INTEGRATION_ACCESS_LEVELS.OWNER,
        connections: {
          edit: true,
        },
      };
      const expected = [
        {
          _integrationId: 'none',
          name: 'Standalone flows',
          numError: 0,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 5,
          integration: {
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration1',
          name: 'Integration One',
          numError: 0,
          numFlows: 2,
          integration: {
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration2',
          name: 'Integration Two',
          numError: 4,
          numFlows: 3,
          integration: {
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration3',
          name: 'Integration Three',
          numError: 9,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 4,
          integration: {
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration4',
          name: 'Integration Four',
          numError: 0,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 5,
          integration: {
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration5',
          _connectorId: 'connector1',
          name: 'Connector 1',
          numFlows: 6,
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration6',
          _connectorId: 'connector1',
          tag: 'tag 1',
          name: 'Connector 1',
          numError: 36,
          numFlows: 7,
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration7',
          _connectorId: 'connector1',
          tag: 'tag 2',
          name: 'Connector 1',
          numError: 49,
          numFlows: 8,
          offlineConnections: ['conn1'],
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration8',
          _connectorId: 'connector2',
          name: 'Connector 2',
          numFlows: 9,
          connector: {
            owner: 'User 2',
            applications: [],
          },
          integration: {
            mode: 'install',
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.IS_PENDING_SETUP,
        },
        {
          _integrationId: 'integration9',
          _connectorId: 'connector2',
          name: 'Connector 2',
          tag: 'test tag',
          numFlows: 10,
          offlineConnections: ['conn1', 'conn2'],
          connector: {
            owner: 'User 2',
            applications: [],
          },
          integration: {
            mode: 'install',
            permissions: expectedIntegrationPermissions,
          },
          status: TILE_STATUS.IS_PENDING_SETUP,
        },
      ];

      expect(tiles).toEqual(expected);
    });
    test('should return correct tiles info for org users', () => {
      const state = reducer(
        {
          user: {
            profile: {},
            preferences: { defaultAShareId: 'ashare_manage' },
            org: {
              accounts: [
                {
                  _id: 'ashare_manage',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                },
                {
                  _id: 'ashare_monitor',
                  accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
                },
                {
                  _id: 'ashare_tile',
                  integrationAccessLevel: [
                    {
                      _integrationId: 'integration1',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                    },
                    {
                      _integrationId: 'integration2',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                    },
                    {
                      _integrationId: 'integration3',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                    },
                    {
                      _integrationId: 'integration4',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                    },
                    {
                      _integrationId: 'integration5',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                    },
                    {
                      _integrationId: 'integration6',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                    },
                    {
                      _integrationId: 'integration7',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                    },
                    {
                      _integrationId: 'integration8',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
                    },
                    {
                      _integrationId: 'integration9',
                      accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
                    },
                  ],
                },
              ],
              users: [],
            },
          },
          data: {
            resources: {
              published,
              integrations,
            },
          },
        },
        actions.resource.receivedCollection('tiles', [
          ...standaloneTiles,
          ...tilesCollection,
        ])
      );
      const expected = [
        {
          _integrationId: 'none',
          name: 'Standalone flows',
          numError: 0,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 5,
          integration: {
            permissions: {},
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration1',
          name: 'Integration One',
          numError: 0,
          numFlows: 2,
          integration: {
            permissions: {},
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration2',
          name: 'Integration Two',
          numError: 4,
          numFlows: 3,
          integration: {
            permissions: {},
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration3',
          name: 'Integration Three',
          numError: 9,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 4,
          integration: {
            permissions: {},
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration4',
          name: 'Integration Four',
          numError: 0,
          offlineConnections: ['conn1', 'conn2'],
          numFlows: 5,
          integration: {
            permissions: {},
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration5',
          _connectorId: 'connector1',
          name: 'Connector 1',
          numFlows: 6,
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: {},
          },
          status: TILE_STATUS.SUCCESS,
        },
        {
          _integrationId: 'integration6',
          _connectorId: 'connector1',
          tag: 'tag 1',
          name: 'Connector 1',
          numError: 36,
          numFlows: 7,
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: {},
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration7',
          _connectorId: 'connector1',
          tag: 'tag 2',
          name: 'Connector 1',
          numError: 49,
          numFlows: 8,
          offlineConnections: ['conn1'],
          connector: {
            owner: 'Company 1',
            applications: ['app1', 'app2'],
          },
          integration: {
            mode: 'settings',
            permissions: {},
          },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          _integrationId: 'integration8',
          _connectorId: 'connector2',
          name: 'Connector 2',
          numFlows: 9,
          connector: {
            owner: 'User 2',
            applications: [],
          },
          integration: {
            mode: 'install',
            permissions: {},
          },
          status: TILE_STATUS.IS_PENDING_SETUP,
        },
        {
          _integrationId: 'integration9',
          _connectorId: 'connector2',
          name: 'Connector 2',
          tag: 'test tag',
          numFlows: 10,
          offlineConnections: ['conn1', 'conn2'],
          connector: {
            owner: 'User 2',
            applications: [],
          },
          integration: {
            mode: 'install',
            permissions: {},
          },
          status: TILE_STATUS.IS_PENDING_SETUP,
        },
      ];
      const expectedIntegrationPermissions = {
        manage: {
          accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          connections: {
            edit: true,
          },
        },
        monitor: {
          accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          connections: {
            edit: undefined,
          },
        },
      };

      expected.forEach(t => {
        // eslint-disable-next-line no-param-reassign
        t.integration.permissions = expectedIntegrationPermissions.manage;
      });

      const tilesForManageUser = selectors.mkTiles()(state);

      expect(tilesForManageUser).toEqual(expected);

      const stateForMonitor = reducer(
        state,
        actions.user.preferences.update({
          defaultAShareId: 'ashare_monitor',
        })
      );

      expected.forEach(t => {
        // eslint-disable-next-line no-param-reassign
        t.integration.permissions = expectedIntegrationPermissions.monitor;
      });
      const tilesForMonitorUser = selectors.mkTiles()(stateForMonitor);

      expect(tilesForMonitorUser).toEqual(expected);

      let stateForTileAccess = reducer(
        state,
        actions.user.preferences.update({
          defaultAShareId: 'ashare_tile',
        })
      );

      stateForTileAccess = reducer(
        stateForTileAccess,
        actions.resource.receivedCollection('tiles', tilesCollection)
      );

      let integrationPermissions;

      expected.forEach(t => {
        if (
          [
            'integration1',
            'integration3',
            'integration5',
            'integration7',
            'integration9',
          ].includes(t._integrationId)
        ) {
          integrationPermissions = expectedIntegrationPermissions.manage;
        } else {
          integrationPermissions = expectedIntegrationPermissions.monitor;
        }

        // eslint-disable-next-line no-param-reassign
        t.integration.permissions = integrationPermissions;
      });
      const expectedForTileLevelAccessUser = expected.filter(
        t => t._integrationId !== 'none'
      );
      const tilesForTileLevelAccessUser = selectors.mkTiles()(stateForTileAccess);

      expect(tilesForTileLevelAccessUser).toEqual(expectedForTileLevelAccessUser);
    });
  });

  describe('selectors.isDataReady test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataReady()).toEqual(false);
    });
  });

  describe('selectors.isResourceCollectionLoading test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isResourceCollectionLoading()).toEqual(false);
    });
  });

  describe('resourceStatus ', () => {
    describe('GET resource calls ', () => {
      const method = 'GET';

      test('should correctly indicate the resource is not Ready for a loading resource call', () => {
        const state = reducer(
          undefined,
          actions.api.request('/exports', method, 'some message')
        );

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is not Ready for a failed resource call', () => {
        let state = reducer(
          undefined,
          actions.api.request('/exports', method, 'some message')
        );

        state = reducer(state, actions.api.failure('/exports', method));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(false);
      });
      test('should correctly indicate the resource is Ready for a success resource call and has data', () => {
        let state = reducer(
          undefined,
          actions.resource.receivedCollection('exports', { data: 'something' })
        );

        state = reducer(
          state,
          actions.api.request('/exports', method, 'some message')
        );
        state = reducer(state, actions.api.complete('/exports', method));

        expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
      });
    });
    test('should correctly indicate the resource is ready for a non-GET resource call', () => {
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', { data: 'something' })
      );

      state = reducer(
        state,
        actions.api.request('/exports', 'POST', 'some message', true)
      );
      state = reducer(state, actions.api.complete('/exports', 'POST'));
      expect(selectors.resourceStatus(state, 'exports').isReady).toBe(true);
    });
    test('shouldn\'t re-add the forward slash in the resourceStatus selector to determine comm status for non resource calls', () => {
      let state = reducer(
        {},
        actions.api.request(
          '/processor/handlebars/',
          'POST',
          'some message',
          true
        )
      );

      state = reducer(
        state,
        actions.api.retry('/processor/handlebars/', 'POST')
      );
      // with resource starting with forward slash
      expect(
        selectors.resourceStatus(state, '/processor/handlebars/', 'POST')
          .retryCount
      ).toBe(1);
      // with resource starting without forward slash
      expect(
        selectors.resourceStatus(state, 'processor/handlebars/', 'POST')
          .retryCount
      ).toBe(1);
    });
  });

  describe('selectors.resourceStatusModified test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceStatusModified()).toEqual({hasData: false, isLoading: false, isReady: false, method: 'GET', resourceType: undefined, retryCount: 0});
    });
  });

  describe('selectors.allResourceStatus test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.allResourceStatus({}, {}, [])).toEqual([]);
    });
  });

  describe('selectors.makeAllResourceStatusSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeAllResourceStatusSelector();

      expect(selector({}, ['connectorLicenses'])).toEqual([{hasData: false, isLoading: false, isReady: false, method: 'GET', resourceType: 'connectorLicenses', retryCount: 0}]);
    });
  });

  describe('resourceData', () => {
    test('should return {} on bad state or args.', () => {
      expect(selectors.resourceData()).toEqual({});
      expect(selectors.resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when no staged data or resource exists. (new resource)', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(
        selectors.resourceData(state, 'exports', 'new-resource-id')
      ).toEqual({
        merged: {},
        staged: undefined,
        master: undefined,
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(selectors.resourceData(state, 'exports', 1)).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });
    });

    test('should return correct data when staged data exists but no master.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged('new-id', patch));

      expect(selectors.resourceData(state, 'exports', 'new-id')).toEqual({
        merged: { name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: null,
      });
    });
  });

  describe('selectors.resourceDataModified test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceDataModified()).toEqual({});
    });
  });

  describe('resourceData cache ', () => {
    const resourceData = selectors.makeResourceDataSelector();

    test('should return {} on bad state or args.', () => {
      expect(resourceData()).toEqual({});
      expect(resourceData({ data: {} })).toEqual({});
    });

    test('should return correct data when no staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(resourceData(state, 'exports', 1)).toEqual({
        merged: exports[0],
        staged: undefined,
        master: exports[0],
      });
    });

    test('should return correct data when no staged data or resource exists. (new resource)', () => {
      const exports = [{ _id: 1, name: 'test A' }];
      const state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );

      expect(resourceData(state, 'exports', 'new-resource-id')).toEqual({
        merged: {},
        staged: undefined,
        master: undefined,
      });
    });

    test('should return correct data when staged data exists.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));

      expect(resourceData(state, 'exports', 1)).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });
    });

    test('should return the same cached data even when a patch occurs for a different id', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));
      const result = resourceData(state, 'exports', 1);

      expect(result).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });
      state = reducer(state, actions.resource.patchStaged(2, patch));
      const cachedResult = resourceData(state, 'exports', 1);

      expect(result).toBe(cachedResult);
    });

    test('should return the same cached data even after a different resource has been received', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));
      const result = resourceData(state, 'exports', 1);

      expect(result).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });

      const imports = [{ _id: 1, name: 'test X' }];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imports)
      );
      const cachedResult = resourceData(state, 'exports', 1);

      expect(result).toBe(cachedResult);
    });
    test('should return the different cached data for different instances', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));
      const resourceDataSel1 = selectors.makeResourceDataSelector();
      const resourceDataSel2 = selectors.makeResourceDataSelector();
      const r1 = resourceDataSel1(state, 'exports', 1);
      const r2 = resourceDataSel2(state, 'exports', 1);

      expect(r1).not.toBe(r2);
      expect(resourceDataSel1(state, 'exports', 1)).toBe(r1);
      expect(resourceDataSel2(state, 'exports', 1)).toBe(r2);
    });
    test('should void the cache and regenerate the same result when we received the same collection again', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const anotherExportsInst = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged(1, patch));
      const result = resourceData(state, 'exports', 1);

      expect(result).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });

      // provoke cache to regenerate with another instance of exports
      state = reducer(
        state,
        actions.resource.receivedCollection('exports', anotherExportsInst)
      );

      const cachedResult = resourceData(state, 'exports', 1);

      // cachedResult is the same as result but different reference
      expect(cachedResult).toEqual({
        merged: { _id: 1, name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: exports[0],
      });

      expect(result).not.toBe(cachedResult);
    });
    test('should return correct data when staged data exists but no master.', () => {
      const exports = [{ _id: 1, name: 'test X' }];
      const patch = [{ op: 'replace', path: '/name', value: 'patch X' }];
      let state;

      state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exports)
      );
      state = reducer(state, actions.resource.patchStaged('new-id', patch));

      expect(resourceData(state, 'exports', 'new-id')).toEqual({
        merged: { name: 'patch X' },
        lastChange: expect.any(Number),
        patch: [{ ...patch[0], timestamp: expect.any(Number) }],
        master: null,
      });
    });
  });

  describe('selectors.resourceFormField test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceFormField()).toEqual();
    });
  });

  describe('selectors.auditLogs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.auditLogs({}, 'flows', 'id')).toEqual({count: 0, logs: [], totalCount: 0});
    });
  });

  describe('selectors.mkFlowResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowResources();

      expect(selector()).toEqual([{_id: undefined, name: 'Flow-level'}]);
    });
  });

  describe('selectors.accessTokenList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.accessTokenList({}, {})).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: 'accesstokens'});
    });
  });

  describe('selectors.mkConnectionIdsUsedInSelectedFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.getScriptContext test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getScriptContext({}, {})).toEqual();
    });
  });

  describe('selectors.mkChildIntegration test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkChildIntegration();

      expect(selector()).toEqual();
    });
  });

  describe('selectors.mkDIYIntegrationFlowList test cases', () => {
    test('should not throw any exception for bad params', () => {
      const selector = selectors.mkDIYIntegrationFlowList();

      expect(selector()).toEqual([]);
      expect(selector({})).toEqual([]);
      expect(selector(null, null, null, null)).toEqual([]);
      expect(selector(1, 1, 1, 1)).toEqual([]);
      expect(selector('string', 'string', 'string', 'string')).toEqual([]);
    });

    describe('should return correct flow list for all integration types', () => {
      const state = reducer(
        {
          session: {
            errorManagement: {
              openErrors: {
                integrationId1: {
                  status: 'received',
                  data: {
                    flow2: 2,
                    flow6: 1,
                    flow7: 0,
                  },
                },
                integrationId2: {
                  status: 'received',
                  data: {
                    flow3: 23,
                  },
                },
                integrationId3: {
                  status: 'received',
                  data: {
                    flow4: 213,
                    flow5: 32,
                  },
                },
              },
            },
          },
          data: {
            resources: {
              flows: [{
                name: 'flow name 1',
                _id: 'flow1',
              }, {
                name: 'flow name 2',
                _id: 'flow2',
                _integrationId: 'integrationId1',
              },
              {
                name: 'flow name 6',
                _id: 'flow6',
                _integrationId: 'integrationId1',
              }, {
                name: 'flow name 7',
                _id: 'flow7',
                _integrationId: 'integrationId1',
              }, {
                name: 'flow name 3',
                _id: 'flow3',
                _integrationId: 'integrationId2',
              }, {
                name: 'flow name 4',
                _id: 'flow4',
                _integrationId: 'integrationId3',
              }, {
                name: 'flow name 5',
                _id: 'flow5',
                _integrationId: 'integrationId3',
              }],
              integrations: [{
                _id: 'integrationId1',
                _registeredConnectionIds: ['connection1'],
              }, {
                _id: 'integrationId2',
                _registeredConnectionIds: ['connection2'],
              }, {
                _id: 'integrationId3',
                _parentId: 'integrationId2',
                _registeredConnectionIds: ['connection2'],
              }],
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }],
            },
          },
        },
        'some action'
      );
      const selector = selectors.mkDIYIntegrationFlowList();

      test('should return correct flow list for standalone integration', () => {
        expect(selector(state, 'none')).toEqual([{
          name: 'flow name 1',
          errors: 0,
          _id: 'flow1',
        }]);
      });

      test('should return correct flow list for a diy integration in default order', () => {
        expect(selector(state, 'integrationId1')).toEqual([
          {
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
          {
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
        ]);
      });

      test('should return correct flow list for a diy integration in sorted order', () => {
        expect(selector(state, 'integrationId1', null, {sort: {order: 'asc', orderBy: 'errors'}})).toEqual([
          {
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
          {
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
        ]);

        expect(selector(state, 'integrationId1', null, {sort: {order: 'desc', orderBy: 'errors'}})).toEqual([
          {
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
          {
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
        ]);
      });

      // Skipping all these test cases for noo as ccurrent errorMap doesnt work for IAF2.0
      test.skip('should return correct flow list for a parent integration', () => {
        expect(selector(state, 'integrationId2')).toEqual([{
          name: 'flow name 3',
          errors: 23,
          _integrationId: 'integrationId2',
          _id: 'flow3',
        }, {
          name: 'flow name 4',
          errors: 213,
          _integrationId: 'integrationId3',
          _id: 'flow4',
        }, {
          name: 'flow name 5',
          errors: 32,
          _integrationId: 'integrationId3',
          _id: 'flow5',
        }]);
      });

      test.skip('should return correct flow list for child Integration', () => {
        expect(selector(state, 'integrationId2', 'integrationId3')).toEqual([
          {
            name: 'flow name 4',
            errors: 213,
            _integrationId: 'integrationId3',
            _id: 'flow4',
          },
          {
            name: 'flow name 5',
            errors: 32,
            _integrationId: 'integrationId3',
            _id: 'flow5',
          },
        ]);
      });

      test.skip('should return correct flow list and sorteed by errors when filter config is sent', () => {
        expect(selector(state, 'integrationId2', 'integrationId3', {sort: {order: 'asc', orderBy: 'errors'}})).toEqual([
          {
            name: 'flow name 4',
            errors: 213,
            _integrationId: 'integrationId3',
            _id: 'flow4',
          },
          {
            name: 'flow name 5',
            errors: 32,
            _integrationId: 'integrationId3',
            _id: 'flow5',
          },
        ]);
      });
    });
  });
});

