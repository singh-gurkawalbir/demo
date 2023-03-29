/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/no-identical-title */
/* eslint-disable jest/no-conditional-in-test */
/* eslint-disable jest/no-standalone-expect */

import each from 'jest-each';
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../actions';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, UNASSIGNED_SECTION_ID, TILE_STATUS, USER_ACCESS_LEVELS, FILE_PROVIDER_ASSISTANTS } from '../constants';
import customCloneDeep from '../utils/customCloneDeep';
import { FILTER_KEY, LIST_VIEW, TILE_VIEW } from '../utils/home';
import getRoutePath from '../utils/routePaths';
import { COMM_STATES } from './comms/networkComms';

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
    const selector = selectors.mkTileApplications();
    const state = {
      data: {
        resources: {
          integrations: [
            {
              _id: 'diyIntegration',
              _registeredConnectionIds: [1, 2],
            },
            {
              _id: 'diyIntegration1',
              _registeredConnectionIds: [3, 4],
            },
            {
              _id: 'diyIntegration2',
              _registeredConnectionIds: [1, 3],
            },
            {
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
            },
            {
              _id: 'ia2Integration1',
              _connectorId: 'connector2',
              installSteps: ['1'],
              initChild: () => {},
              name: 'IA2.0 parent integration 1',
            }, {
              _id: 'ia2IntegrationChild1',
              _parentId: 'ia2Integration1',
              installSteps: ['1'],
              _connectorId: 'connector2',
              name: 'IA2.0 child integration 1',
            },
          ],
          connections: [
            {
              _id: 'connection1',
              assistant: 'assistant1',
              _integrationId: 'ia2IntegrationChild',
            },
            {
              _id: 'connection2',
              type: 'assistant2',
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
              type: 'netsuite',
              _integrationId: 'ia2Integration',
            },
            {
              _id: 'connection6',
              assistant: 'assistant1',
              _integrationId: 'ia2IntegrationChild',
            },
            {
              _id: 'connection7',
              type: 'assistant1',
              _integrationId: 'ia2Integration1',
            },
            {
              _id: 'connection8',
              type: 'assistant2',
              _integrationId: 'ia2Integration1',
            },
            {
              _id: 'connection9',
              type: 'netsuite',
              _integrationId: 'ia2IntegrationChild1',
            },
            {
              _id: 'connection10',
              type: 'assistant4',
              _integrationId: 'ia2IntegrationChild1',
            },
            {
              _id: 'connection11',
              type: 'assistant5',
              _integrationId: 'ia2IntegrationChild1',
            },
            {
              _id: 1,
              assistant: 'Square',
            },
            {
              _id: 2,
              rdbms: {
                type: 'mssql',
              },
            },
            {
              _id: 3,
              http: {
                formType: 'rest',
              },
            },
            {
              _id: 4,
              type: 'http',
            },
          ],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
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
    test('should return empty array if dashboard view is tile and tile is not IA', () => {
      expect(selector(state, {_integrationId: 'diyIntegration'})).toEqual([]);
    });
    test('should return empty array for suitescript tile', () => {
      const suiteScriptTile = {
        name: 'SVB - NetSuite Connector',
        isNotEditable: false,
        isConnector: true,
        _integrationId: '101',
        displayName: 'SVB - NetSuite Connector',
        _connectorId: 'suitescript-svb-netsuite',
        urlName: 'svbns',
        status: 'has_errors',
        ssLinkedConnectionId: '5cbdeecb0c8f006904be68db',
      };

      expect(selector(state, suiteScriptTile)).toEqual([]);
    });
    const listViewState = {...state,
      user: {
        preferences: {
          dashboard: {
            view: LIST_VIEW,
          },
        },
      } };

    test('should return all applications from registered connections for diy integrations for list view', () => {
      expect(selector(listViewState, {_integrationId: 'diyIntegration', _registeredConnectionIds: [1, 2]})).toEqual(['Square', 'mssql']);
      expect(selector(listViewState, {_integrationId: 'diyIntegration1', _registeredConnectionIds: [3, 4]})).toEqual(['rest', 'http']);
      expect(selector(listViewState, {_integrationId: 'diyIntegration2', _registeredConnectionIds: [1, 3]})).toEqual(['Square', 'rest']);
      expect(selector(listViewState, {_integrationId: 'none'})).toEqual([]);
    });

    describe('should return correct application list for integrationApp', () => {
      test('should return all applications in the tile', () => {
        expect(selector(state, {
          _connectorId: 'connector1',
          connector: {
            applications: ['app1', 'app2'],
          },
        })).toEqual(['app1', 'app2']);
      });
      test('should return all applications (more than 4) in the tile for list view', () => {
        expect(selector(listViewState, {
          _connectorId: 'connector1',
          connector: {
            applications: ['app1', 'app2', 'app3', 'app4', 'app5', 'app6', 'app7', 'app8', 'app9', 'app10'],
          },
        })).toEqual(['app1', 'app2', 'app3', 'app4', 'app5', 'app6', 'app7', 'app8', 'app9', 'app10']);
      });
      test('should return only 4 applications for tile view', () => {
        expect(selector(state, {
          _connectorId: 'connector1',
          connector: {
            applications: ['app1', 'app2', 'app3', 'app4', 'app5'],
          },
        })).toEqual(['app1', 'app2', 'app3', 'app4']);
      });
      test('should return magento1 as application if tile name contains magento1 and magento exists in application list', () => {
        expect(selector(state, {
          _connectorId: 'connector1',
          name: 'Magento 1 - NetSuite',
          connector: {
            applications: ['magento', 'app2'],
          },
        })).toEqual(['magento1', 'app2']);
      });
      test('should return netsuite as the last application for tile view', () => {
        expect(selector(state, {
          _connectorId: 'connector1',
          connector: {
            applications: ['app1', 'app2', 'netsuite', 'app3'],
          },
        })).toEqual(['app1', 'app2', 'app3', 'netsuite']);
      });
    });

    describe('should return correct application list for integrationApp 2.0', () => {
      test('should return all applications limit to 4 for tile view and netsuite as last application', () => {
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
      test('should return all application (more than 4) for list view and netsuite should not be the last application', () => {
        expect(selector(listViewState, {
          _connectorId: 'connector1',
          _integrationId: 'ia2Integration1',
        })).toEqual(['netsuite', 'assistant4', 'assistant5', 'assistant1', 'assistant2']);
      });
    });
  });

  describe('selectors.resourceList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceList()).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: undefined});
    });
  });

  describe('selectors.makeResourceListSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeResourceListSelector();

      expect(selector(undefined, {})).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: undefined});
    });
  });

  describe('selectors.flowDetails, mkflowDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowDetails()).toEqual({});
    });
    test('should verify flowDetails for real-time flow', () => {
      const exp = {
        _id: 'e1',
        type: 'distributed',
        adaptorType: 'SalesforceExport',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.flowDetails(state, 'f1').isRealtime).toBe(true);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toBe(false);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toBe(false);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toBe(true);
      expect(selector(state, 'f1').isRunnable).toBe(false);
      expect(selector(state, 'f1').canSchedule).toBe(false);
      expect(selector(state, 'f1').isSimpleImport).toBe(false);
      expect(selector(state, 'f1').isDeltaFlow).toBe(false);
    });

    test('should verify flowDetails for data-loader flow', () => {
      const exp = {
        _id: 'e1',
        type: 'simple',
        adaptorType: 'SimpleExport',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.flowDetails(state, 'f1').isRealtime).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toBe(true);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toBe(true);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toBe(false);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toBe(false);
      expect(selector(state, 'f1').isRunnable).toBe(true);
      expect(selector(state, 'f1').canSchedule).toBe(false);
      expect(selector(state, 'f1').isSimpleImport).toBe(true);
      expect(selector(state, 'f1').isDeltaFlow).toBe(false);
    });

    test('should verify flowDetails for batch delta flow', () => {
      const exp = {
        _id: 'e1',
        adaptorType: 'SalesforceExport',
        salesforce: {
          type: 'soql',
        },
        type: 'delta',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.flowDetails(state, 'f1').isRealtime).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toBe(true);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toBe(true);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toBe(false);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toBe(true);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toBe(false);
      expect(selector(state, 'f1').isRunnable).toBe(true);
      expect(selector(state, 'f1').canSchedule).toBe(true);
      expect(selector(state, 'f1').isSimpleImport).toBe(false);
      expect(selector(state, 'f1').isDeltaFlow).toBe(true);
    });
    test('should verify flowDetails for IA flow', () => {
      const exp = {
        _id: 'e1',
        adaptorType: 'SalesforceExport',
        salesforce: {
          type: 'soql',
        },
        type: 'delta',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const integration = {
        _id: 'i1',
        _connectorId: 'ctr1',
        settings: {
          sections: [
            {
              title: 't1',
              flows: [
                {
                  _id: 'f1',
                  showMapping: true,
                  showSchedule: true,
                  showStartDateDialog: true,
                  disableSlider: true,
                  disableRunFlow: true,
                  showUtilityMapping: true,
                },
              ],
            },
          ],
        },
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      const expected = {
        _id: 'f1',
        _integrationId: 'i1',
        canSchedule: true,
        disableRunFlow: true,
        disableSlider: true,
        hasSettings: false,
        isSetupInProgress: false,
        isDeltaFlow: true,
        isRealtime: false,
        isRunnable: true,
        isSimpleImport: false,
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
        showMapping: true,
        showSchedule: true,
        showStartDateDialog: true,
        showUtilityMapping: true,
      };

      expect(selectors.flowDetails(state, 'f1')).toEqual(expected);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1')).toEqual(expected);
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

    test('should verify flowDetails for IA flow with childId passed', () => {
      const exp = {
        _id: 'e1',
        adaptorType: 'SalesforceExport',
        salesforce: {
          type: 'soql',
        },
        type: 'delta',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const integration = {
        _id: 'i1',
        _connectorId: 'ctr1',
        settings: {
          supportsMultiStore: true,
          sections: [
            {
              title: 't1',
              id: 'secId',
              sections: [
                {
                  flows: [
                    {
                      _id: 'f1',
                      showMapping: true,
                      showSchedule: true,
                      showStartDateDialog: true,
                      disableSlider: false,
                      disableRunFlow: true,
                      showUtilityMapping: true,
                    },
                  ],
                },
                {
                  flows: [
                    {
                      _id: 'f2',
                      showMapping: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      const expected = {
        _id: 'f1',
        _integrationId: 'i1',
        canSchedule: true,
        disableRunFlow: true,
        disableSlider: false,
        hasSettings: false,
        isDeltaFlow: true,
        isRealtime: false,
        isRunnable: true,
        isSetupInProgress: false,
        isSimpleImport: false,
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
        ],
        showMapping: true,
        showSchedule: true,
        showStartDateDialog: true,
        showUtilityMapping: true,
      };

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1')).toEqual(expected);
    });
  });

  describe('selectors.isDataLoader test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDataLoader()).toBe(false);
    });

    test('should return true for dataLoader flow', () => {
      const exp = {
        _id: 'e1',
        type: 'simple',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.isDataLoader(state, 'f1')).toBe(true);
    });

    test('should return true for dataLoader flow if flow is in OLD DL format', () => {
      const exp = {
        _id: 'e1',
        type: 'simple',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        _exportId: 'e1',
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.isDataLoader(state, 'f1')).toBe(true);
    });

    test('should return false for non-dataLoader flow', () => {
      const exp = {
        _id: 'e1',
        type: 'distributed',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        _exportId: 'e1',
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.isDataLoader(state, 'f1')).toBe(false);
    });
  });

  describe('selectors.mkFlowAttributes test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowAttributes();

      expect(selector(undefined, {})).toEqual({});
    });
    test('should return empty object if exports doesn\'t exist', () => {
      const exps = [
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exps)
      );

      const flows = [
        {
          _id: 'f1',
          _integrationId: 'i1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('flows', flows)
      );

      const selector = selectors.mkFlowAttributes();

      expect(selector(state, flows, undefined)).toEqual({});
    });
    test('should generate flow attributes for the provided flows for stand-alone integration', () => {
      const exps = [
        {
          type: 'simple',
          _id: 'e1',
        },
        {
          _id: 'e2',
          type: 'distributed',
        },
        {
          _id: 'e3',
          type: 'rest',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exps)
      );

      const flows = [
        {
          _id: 'f1',
          _integrationId: 'i1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f2',
          _integrationId: 'i1',
          pageGenerators: [{
            _exportId: 'e2',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f3',
          _integrationId: 'i1',
          pageGenerators: [{
            _exportId: 'e3',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('flows', flows)
      );

      state = reducer(
        state,
        actions.resource.received('imports', {
          _id: 'i1',
        })
      );

      const integration = {
        _id: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      const selector = selectors.mkFlowAttributes();

      expect(selector(state, flows, integration)).toEqual(
        {
          f1: {
            isDataLoader: true,
            disableRunFlow: true,
            isFlowEnableLocked: false,
            allowSchedule: false,
            type: 'Data loader',
            supportsSettings: false,
          },
          f2: {
            isDataLoader: false,
            disableRunFlow: true,
            isFlowEnableLocked: false,
            allowSchedule: false,
            type: 'Realtime',
            supportsSettings: false,
          },
          f3: {
            isDataLoader: false,
            disableRunFlow: true,
            isFlowEnableLocked: false,
            allowSchedule: true,
            type: 'Scheduled',
            supportsSettings: false,
          },
        }
      );
    });

    test('should generate flow attributes for the provided flows for connector integration', () => {
      const exps = [
        {
          type: 'simple',
          _id: 'e1',
        },
        {
          _id: 'e2',
          type: 'distributed',
        },
        {
          _id: 'e3',
          type: 'rest',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('exports', exps)
      );

      const flows = [
        {
          _id: 'f1',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e1',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f2',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e2',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
        {
          _id: 'f3',
          _integrationId: 'i1',
          _connectorId: 'ctr1',
          pageGenerators: [{
            _exportId: 'e3',
          }],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('flows', flows)
      );

      state = reducer(
        state,
        actions.resource.received('imports', {
          _id: 'i1',
        })
      );

      const integration = {
        _id: 'i1',
        _connectorId: 'ctr1',
        settings: {
          supportsMultiStore: true,
          sections: [
            {
              id: 'secid',
              sections: [
                {
                  flows: [
                    {
                      _id: 'f1',
                      disableSlider: true,
                      disableRunFlow: true,
                    },
                    {
                      _id: 'f2',
                      disableSlider: false,
                      disableRunFlow: true,
                    },
                    {
                      _id: 'f3',
                      disableSlider: false,
                      disableRunFlow: false,
                      showSchedule: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      const selector = selectors.mkFlowAttributes();

      expect(selector(state, flows, integration, 'secid')).toEqual(
        {
          f1: {
            isDataLoader: true,
            disableRunFlow: false,
            isFlowEnableLocked: true,
            allowSchedule: false,
            type: 'Data loader',
            supportsSettings: false,
          },
          f2: {
            isDataLoader: false,
            disableRunFlow: false,
            isFlowEnableLocked: false,
            allowSchedule: false,
            type: 'Realtime',
            supportsSettings: false,
          },
          f3: {
            isDataLoader: false,
            disableRunFlow: true,
            isFlowEnableLocked: false,
            allowSchedule: true,
            type: 'Scheduled',
            supportsSettings: false,
          },
        }
      );
    });
  });

  describe('selectors.flowType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowType()).toBe('');
    });

    test('should return empty string if export does not exist', () => {
      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      const state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      expect(selectors.flowType(state, 'f1')).toBe('');
    });

    test('should return real-time if flow is real-time', () => {
      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      let state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      const exp = {
        _id: 'e1',
        type: 'distributed',
      };

      state = reducer(
        state,
        actions.resource.received('exports', exp)
      );

      expect(selectors.flowType(state, 'f1')).toBe('Realtime');
    });

    test('should return dataloader if flow is of simple type', () => {
      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      let state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      const exp = {
        _id: 'e1',
        type: 'simple',
      };

      state = reducer(
        state,
        actions.resource.received('exports', exp)
      );

      expect(selectors.flowType(state, 'f1')).toBe('Data loader');
    });

    test('should return Scheduled for normal flow', () => {
      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      let state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      const exp = {
        _id: 'e1',
        type: 'rest',
      };

      state = reducer(
        state,
        actions.resource.received('exports', exp)
      );

      expect(selectors.flowType(state, 'f1')).toBe('Scheduled');
    });
  });

  describe('selectors.mkFlowAllowsScheduling test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector()).toBe(false);
    });
    test('should return true for standalone batch flow', () => {
      const exp = {
        type: 'rest',
        _id: 'e1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector(state, 'f1')).toBe(true);
    });

    test('should return false for standalone real-time flow', () => {
      const exp = {
        type: 'distributed',
        _id: 'e1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector(state, 'f1')).toBe(false);
    });

    test('should return true for v2 scheduled flow', () => {
      const exp = {
        type: 'rest',
        _id: 'e1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        _connectorId: 'c1',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      state = reducer(
        state,
        actions.resource.received('integrations', {
          _id: 'i1',
          installSteps: [
            {
              stepId: 's1',
            },
          ],
        })
      );

      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector(state, 'f1')).toBe(true);
    });

    test('should return from IA setting for IA flow', () => {
      const exp = {
        type: 'rest',
        _id: 'e1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flow = {
        _id: 'f1',
        _connectorId: 'c1',
        _integrationId: 'i1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      state = reducer(
        state,
        actions.resource.received('integrations', {
          _id: 'i1',
          _connectorId: 'ctr1',
          settings: {
            sections: [
              {
                flows: [
                  {
                    _id: 'f1',
                    showSchedule: false,
                  },
                ],
              },
            ],
          },
        })
      );

      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector(state, 'f1')).toBe(false);
    });
  });

  describe('selectors.flowUsesUtilityMapping test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flowId1',
            name: 'flow 1',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId2',
            name: 'flow 2',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId3',
            name: 'flow 3',
            _integrationId: 'integration2',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId4',
            name: 'flow 4',
            _integrationId: 'integration2',
            _connectorId: 'connector2',

          }],
          integrations: [{
            _id: 'integrationId1',
            _connectorId: 'connector1',
            settings: {
              supportsMultiStore: true,
              sections: [{
                id: 'child1',
                sections: [
                  {
                    title: 'Title2',
                    flows: [{
                      _id: 'flowId1',
                      settings: {},
                    }, {
                      _id: 'flowId2',
                      showUtilityMapping: true,
                      settings: {},
                    }],
                  },
                ],
              }],
            },
          }, {
            _id: 'integration2',
            _connectorId: 'connector2',
            settings: {
              sections: [
                {
                  title: 'Title',
                  flows: [
                    {
                      _id: 'flowId3',
                      settings: {},
                    },
                    {
                      _id: 'flowId4',
                      settings: {},
                      showUtilityMapping: true,
                    },
                  ],
                },
              ],
            },
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowUsesUtilityMapping()).toBe(false);
      expect(selectors.flowUsesUtilityMapping(null)).toBe(false);
      expect(selectors.flowUsesUtilityMapping(null, null)).toBe(false);
      expect(selectors.flowUsesUtilityMapping({}, {})).toBe(false);
      expect(selectors.flowUsesUtilityMapping(123, 124)).toBe(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowUsesUtilityMapping(state, 'invalidFlowId')).toBe(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId3')).toBe(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId4')).toBe(true);
    });

    test('should return correct value for mullti store connector', () => {
      expect(selectors.flowUsesUtilityMapping(state, 'flowId1', 'child1')).toBe(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2')).toBe(true);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2', 'child1')).toBe(true);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2', 'child2')).toBe(false);
    });
  });

  describe('selectors.flowSupportsMapping test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flowId1',
            name: 'flow 1',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId2',
            name: 'flow 2',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId3',
            name: 'flow 2',
            _integrationId: 'integrationId2',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId4',
            name: 'flow 4',
            _integrationId: 'integrationId2',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId5',
            name: 'flow 5',
            _integrationId: 'integrationId1',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId6',
            name: 'flow 6',
            _integrationId: 'integrationId1',
            _connectorId: 'connector2',

          },
          {
            _id: 'flowId7',
            name: 'flow 7',
            _integrationId: 'integrationId3',
            _connectorId: 'connector2',

          }],
          integrations: [{
            _id: 'integrationId1',
            _connectorId: 'connector1',
            settings: {
              supportsMultiStore: true,
              sections: [{
                id: 'child1',
                sections: [
                  {
                    title: 'Title2',
                    flows: [{
                      _id: 'flowId1',
                      settings: {},
                    }, {
                      _id: 'flowId2',
                      showUtilityMapping: true,
                      showMapping: true,
                      settings: {},
                    }],
                  },
                  {
                    title: 'Title3',
                    flows: [{
                      _id: 'flowId5',
                      settings: {},
                      showMapping: false,
                    }, {
                      _id: 'flowId6',
                      showUtilityMapping: true,
                      showMapping: true,
                      settings: {},
                    }],
                  },
                ],
              }],
            },
          }, {
            _id: 'integrationId2',
            _connectorId: 'connector2',
            settings: {
              sections: [
                {
                  title: 'Title',
                  flows: [
                    {
                      _id: 'flowId3',
                      settings: {},
                    },
                  ],
                },
                {
                  title: 'Title2',
                  flows: [
                    {
                      _id: 'flowId4',
                      settings: {},
                      showMapping: true,
                    },
                  ],
                },
              ],
            },
          },
          {
            _id: 'integrationId3',
            _connectorId: 'connector3',
            installSteps: [
              {
                name: 'NetSuite connection',
                description: 'Configure your NetSuite connection',
                imageUrl: '/images/company-logos/netsuite.png',
                completed: true,
                type: 'connection',
                sourceConnection: {
                  type: 'netsuite',
                  externalId: 'payout_to_reconciliation_netsuite_connection',
                  name: 'NetSuite Connection',
                },
              }],
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowSupportsMapping()).toBe(false);
      expect(selectors.flowSupportsMapping(null)).toBe(false);
      expect(selectors.flowSupportsMapping(null, null)).toBe(false);
      expect(selectors.flowSupportsMapping({}, {})).toBe(false);
      expect(selectors.flowSupportsMapping(123, 124)).toBe(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowSupportsMapping(state, 'integrationId1')).toBe(false);
      expect(selectors.flowSupportsMapping(state, 'flowId7')).toBe(true);
      expect(selectors.flowSupportsMapping(state, 'flowId4')).toBe(true);
      expect(selectors.flowSupportsMapping(state, 'flowId3')).toBe(false);
    });

    test('should return correct value for mullti store connector', () => {
      expect(selectors.flowSupportsMapping(state, 'flowId1', 'child1')).toBe(false);
      expect(selectors.flowSupportsMapping(state, 'flowId2')).toBe(true);
      expect(selectors.flowSupportsMapping(state, 'flowId2', 'child1')).toBe(true);
      expect(selectors.flowSupportsMapping(state, 'flowId2', 'child2')).toBe(false);
    });
  });

  describe('selectors.flowSupportsSettings test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flowId1',
            name: 'flow 1',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId2',
            name: 'flow 2',
            _integrationId: 'integrationId1',
            _connectorId: 'connector1',

          }, {
            _id: 'flowId3',
            name: 'flow 2',
            _integrationId: 'integrationId2',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId4',
            name: 'flow 4',
            _integrationId: 'integrationId2',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId5',
            name: 'flow 5',
            _integrationId: 'integrationId1',
            _connectorId: 'connector2',

          }, {
            _id: 'flowId6',
            name: 'flow 6',
            _integrationId: 'integrationId1',
            _connectorId: 'connector2',

          }],
          integrations: [{
            _id: 'integrationId1',
            _connectorId: 'connector1',
            settings: {
              supportsMultiStore: true,
              sections: [{
                id: 'child1',
                sections: [
                  {
                    title: 'Title2',
                    flows: [{
                      _id: 'flowId1',
                      settings: [],
                    }, {
                      _id: 'flowId2',
                      showUtilityMapping: true,
                      showMapping: true,
                      settings: [{}],
                    }],
                  },
                  {
                    title: 'Title3',
                    flows: [{
                      _id: 'flowId5',
                      settings: [],
                      showMapping: false,
                    }, {
                      _id: 'flowId6',
                      showUtilityMapping: true,
                      showMapping: true,
                      settings: [],
                    }],
                  },
                ],
              }],
            },
          }, {
            _id: 'integrationId2',
            _connectorId: 'connector2',
            settings: {
              sections: [
                {
                  title: 'Title',
                  flows: [
                    {
                      _id: 'flowId3',
                      settings: [],
                    },
                  ],
                },
                {
                  title: 'Title2',
                  flows: [
                    {
                      _id: 'flowId4',
                      sections: [{}],
                      showMapping: true,
                    },
                  ],
                },
              ],
            },
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowSupportsSettings()).toBe(false);
      expect(selectors.flowSupportsSettings(null)).toBe(false);
      expect(selectors.flowSupportsSettings(null, null)).toBe(false);
      expect(selectors.flowSupportsSettings({}, {})).toBe(false);
      expect(selectors.flowSupportsSettings(123, 124)).toBe(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowSupportsSettings(state, 'integrationId1')).toBe(false);
      expect(selectors.flowSupportsSettings(state, 'flowId4')).toBe(true);
      expect(selectors.flowSupportsSettings(state, 'flowId3')).toBe(false);
    });

    test('should return correct value for multi store connector', () => {
      expect(selectors.flowSupportsSettings(state, 'flowId1', 'child1')).toBe(false);
      expect(selectors.flowSupportsSettings(state, 'flowId2')).toBe(true);
      expect(selectors.flowSupportsSettings(state, 'flowId2', 'child1')).toBe(true);
      expect(selectors.flowSupportsSettings(state, 'flowId2', 'child2')).toBe(false);
    });
  });

  describe('selectors.mkNextDataFlowsForFlow test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkNextDataFlowsForFlow();

      expect(selector()).toEqual([]);
    });
  });

  describe('selectors.isConnectionOffline test cases', () => {
    const connState = reducer(
      {
        user: {
          profile: {},
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
              },
              {
                _id: 'ashare2',
                accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
              },
            ],
            users: [],
          },
        },
        data: {
          resources: {
            connections: [{
              _id: 'connection1',
              name: 'connection 1',
              offline: true,
            }, {
              _id: 'connection2',
              name: 'connection2',
            }],
          },
        },
      },
      'some action'
    );

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isConnectionOffline()).toBe(false);
    });
    test('should return true if given connection is offline', () => {
      expect(selectors.isConnectionOffline(connState, 'connection1')).toBe(true);
    });
    test('should return undefined if given connection is online', () => {
      expect(selectors.isConnectionOffline(connState, 'connection2')).toBe(false);
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

  describe('filteredResourceList selector tests', () => {
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

    let combinedState = reducer(
      undefined,
      actions.resource.receivedCollection('connections', connections)
    );

    combinedState = reducer(
      combinedState,
      actions.resource.receivedCollection('stacks', stacks)
    );

    describe('matchingConnectionList selector', () => {
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
        expect(selectors.matchingConnectionList(state, { assistant: 'zendesk' })).toEqual([
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
        expect(selectors.matchingConnectionList(state, { assistant: 'zendesk' })).toEqual([
          assistantConnectionSandbox,
        ]);
      });
    });

    describe('matchingStackList selector', () => {
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
    describe('selectors.filteredResourceList test cases', () => {
      test('should not throw any exception for invalid arguments', () => {
        expect(selectors.filteredResourceList()).toEqual([]);
      });

      test('should return connections in production environment', () => {
        expect(selectors.filteredResourceList(combinedState, {
          type: 'salesforce',
        }, 'connections', 'production')).toEqual([salesforceConnection]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'rest',
        }, 'connections', 'production')).toEqual([restConnection, assistantConnection]);

        expect(selectors.filteredResourceList(combinedState, {
          assistant: 'zendesk',
        }, 'connections', 'production')).toEqual([assistantConnection]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'rdbms',
          rdbms: {type: 'postgresql'},
        }, 'connections', 'production')).toEqual([postgresqlConnection]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'rdbms',
          rdbms: {type: 'snowflake'},
        }, 'connections', 'production')).toEqual([snowflakeConnection]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'netsuite',
        }, 'connections', 'production')).toEqual([netsuiteConnection, validNetsuiteConnection]);
      });

      test('should return connections in sandbox environment', () => {
        expect(selectors.filteredResourceList(combinedState, {
          type: 'salesforce',
        }, 'connections', 'sandbox')).toEqual([salesforceConnectionSandbox]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'rest',
        }, 'connections', 'sandbox')).toEqual([assistantConnectionSandbox]);

        expect(selectors.filteredResourceList(combinedState, {
          assistant: 'zendesk',
        }, 'connections', 'sandbox')).toEqual([assistantConnectionSandbox]);

        expect(selectors.filteredResourceList(combinedState, {
          type: 'netsuite',
        }, 'connections', 'sandbox')).toEqual([]);
      });

      test('should return stacks if resourceType is stacks', () => {
        expect(selectors.filteredResourceList(combinedState, undefined, 'stacks', 'sandbox')).toEqual([stack1]);
      });
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
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false,
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
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false,
        },
      ]);
      expect(marketplaceConnectorsSelector(state, 'amazonmws', false)).toEqual([
        {
          _id: 'connector1',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          usedTrialLicenseExists: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector',
          published: false,
          canRequestDemo: true,
          canStartTrial: false },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          usedTrialLicenseExists: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
          canRequestDemo: true,
          canStartTrial: false },
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
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
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
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
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
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
        {
          _id: 'connector2',
          _stackId: '57be8a07be81b76e185bbb8d',
          applications: ['amazonmws', 'netsuite'],
          canInstall: false,
          contactEmail: 'sravan@sravan.com',
          installed: false,
          name: 'Sample Connector2',
          published: true,
          usedTrialLicenseExists: false,
          canRequestDemo: true,
          canStartTrial: false },
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
        mode: 'settings',
      },
      {
        _integrationId: 'integration6',
        _connectorId: 'connector1',
        tag: 'tag 1',
        name: 'Connector 1',
        mode: 'settings',
        numError: 36,
        numFlows: 7,
      },
      {
        _integrationId: 'integration7',
        _connectorId: 'connector1',
        tag: 'tag 2',
        name: 'Connector 1',
        mode: 'settings',
        numError: 49,
        offlineConnections: ['conn1'],
        numFlows: 8,
      },
      {
        _integrationId: 'integration8',
        _connectorId: 'connector2',
        name: 'Connector 2',
        numFlows: 9,
        mode: 'install',
      },
      {
        _integrationId: 'integration9',
        _connectorId: 'connector2',
        name: 'Connector 2',
        tag: 'test tag',
        numFlows: 10,
        mode: 'install',
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
    const flows = [
      {_id: 1, _integrationId: 'integration2', _connectorId: 'connector2', name: 'integration app'},
      {_id: 2, _integrationId: 'integration1', name: 'search2', description: 'searchflow'},
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
              flows,
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
      const defaultProps = {
        sortablePropType: -1,
      };
      const expectedStandalone = [{
        _integrationId: 'none',
        flowsNameAndDescription: '',
        integration: {permissions: expectedIntegrationPermissions },
        key: 'none',
        name: 'Standalone flows',
        numError: 0,
        numFlows: 5,
        offlineConnections: ['conn1', 'conn2'],
        sortablePropType: 5,
        status: 'success',
      }];
      const expected = [
        {
          flowsNameAndDescription: '|search2|searchflow',
          integration: {permissions: expectedIntegrationPermissions },
          key: 'integration1',
          sortablePropType: 2,
          status: TILE_STATUS.SUCCESS,
        },
        {
          flowsNameAndDescription: '|integration app|',
          integration: {permissions: expectedIntegrationPermissions },
          key: 'integration2',
          sortablePropType: 3,
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          flowsNameAndDescription: '',
          integration: {permissions: expectedIntegrationPermissions},
          key: 'integration3',
          sortablePropType: 4,
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          flowsNameAndDescription: '',
          integration: {permissions: expectedIntegrationPermissions },
          key: 'integration4',
          sortablePropType: 5,
          status: TILE_STATUS.SUCCESS,
        },
        {
          connector: {applications: ['app1', 'app2'], owner: 'Company 1' },
          flowsNameAndDescription: '',
          integration: {mode: 'settings', permissions: expectedIntegrationPermissions},
          key: 'integration5',
          sortablePropType: -1,
          status: TILE_STATUS.SUCCESS,
        },
        {
          connector: {applications: ['app1', 'app2'], owner: 'Company 1'},
          flowsNameAndDescription: '',
          integration: {mode: 'settings', permissions: expectedIntegrationPermissions},
          key: 'integration6',
          sortablePropType: -1,
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          connector: { applications: ['app1', 'app2'], owner: 'Company 1'},
          flowsNameAndDescription: '',
          integration: {mode: 'settings', permissions: expectedIntegrationPermissions},
          key: 'integration7',
          sortablePropType: -1,
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          connector: { applications: [], owner: 'User 2'},
          flowsNameAndDescription: '|integration app|',
          integration: { mode: 'install', permissions: expectedIntegrationPermissions},
          key: 'integration8',
          status: TILE_STATUS.IS_PENDING_SETUP,
          ...defaultProps,
        },
        {
          connector: { applications: [], owner: 'User 2'},
          flowsNameAndDescription: '|integration app|',
          integration: {mode: 'install', permissions: expectedIntegrationPermissions},
          key: 'integration9',
          status: TILE_STATUS.IS_PENDING_SETUP,
          ...defaultProps,
        },
      ];
      const expectedResult = [...expectedStandalone, ...expected.map((e, idx) => ({
        ...e,
        ...tilesCollection[idx],
      }))];

      expect(tiles).toEqual(expectedResult);
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
              flows,
            },
          },
        },
        actions.resource.receivedCollection('tiles', [
          ...standaloneTiles,
          ...tilesCollection,
        ])
      );
      const expectedStandalone = [{
        _integrationId: 'none',
        name: 'Standalone flows',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        key: 'none',
        flowsNameAndDescription: '',
        sortablePropType: 5,
        integration: {permissions: {}},
        status: TILE_STATUS.SUCCESS,
      }];
      const expectedResult = [
        {
          key: 'integration1',
          flowsNameAndDescription: '|search2|searchflow',
          sortablePropType: 2,
          integration: {permissions: {} },
          status: TILE_STATUS.SUCCESS,
        },
        {
          flowsNameAndDescription: '|integration app|',
          key: 'integration2',
          sortablePropType: 3,
          integration: {permissions: {} },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          key: 'integration3',
          flowsNameAndDescription: '',
          sortablePropType: 4,
          integration: {permissions: {} },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          key: 'integration4',
          flowsNameAndDescription: '',
          sortablePropType: 5,
          integration: {permissions: {} },
          status: TILE_STATUS.SUCCESS,
        },
        {
          connector: {owner: 'Company 1', applications: ['app1', 'app2'] },
          key: 'integration5',
          flowsNameAndDescription: '',
          sortablePropType: -1,
          integration: {mode: 'settings', permissions: {} },
          status: TILE_STATUS.SUCCESS,
        },
        {
          connector: {owner: 'Company 1', applications: ['app1', 'app2'] },
          key: 'integration6',
          flowsNameAndDescription: '',
          sortablePropType: -1,
          integration: {mode: 'settings', permissions: {} },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          connector: {owner: 'Company 1', applications: ['app1', 'app2'] },
          key: 'integration7',
          flowsNameAndDescription: '',
          sortablePropType: -1,
          integration: {mode: 'settings', permissions: {} },
          status: TILE_STATUS.HAS_ERRORS,
        },
        {
          flowsNameAndDescription: '|integration app|',
          connector: {owner: 'User 2', applications: [] },
          key: 'integration8',
          sortablePropType: -1,
          integration: {mode: 'install', permissions: {} },
          status: TILE_STATUS.IS_PENDING_SETUP,
        },
        {
          flowsNameAndDescription: '|integration app|',
          connector: {owner: 'User 2', applications: [] },
          key: 'integration9',
          sortablePropType: -1,
          integration: {mode: 'install', permissions: {} },
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
      const expected = [...expectedStandalone, ...expectedResult.map((e, idx) => ({
        ...e,
        ...tilesCollection[idx],
      }))];

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

  describe('selectors.mkFilteredHomeTiles test cases', () => {
    const filteredHomeTiles = selectors.mkFilteredHomeTiles();
    const tiles = [
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
        lastErrorAt: 2,
      },
      {
        _integrationId: 'connector1',
        name: 'Integration Two',
        numError: 4,
        numFlows: 3,
        lastErrorAt: 1,
        _connectorId: 'connector1',
      },
      {
        _integrationId: 'integration3',
        name: 'HTTP Integration Three',
        numError: 9,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 4,
        lastErrorAt: 3,
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
    const published = [
      {
        _id: 'connector1',
        name: 'Connector 1',
        user: { name: 'User 1', company: 'Company 1' },
        applications: ['http', 'app2'],
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
        _id: 'integration3',
      },
    ];
    const connections = [
      {
        _id: 'connection1',
      },
      {
        _id: 'connection2',
      },
      {
        _id: 'connection3',
      },
      {
        _id: 'connection4',
      },
    ];
    const initialState = reducer(
      {
        user: {
          profile: {},
          preferences: {
            defaultAShareId: ACCOUNT_IDS.OWN,
            environment: 'production',
            ssConnectionIds: [
              'connection1',
              'connection2',
              'connection3',
              'connection4',
            ],
          },
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
            connections,
          },
          suiteScript: {
            connection1: {
              tiles: [
                {
                  _integrationId: 'suitescript1',
                  ssLinkedConnectionId: 'connection1',
                  displayName: 'salesforce netsuite',
                },
                {
                  _integrationId: 'suitescript2',
                  ssLinkedConnectionId: 'connection1',
                  _connectorId: 'connector1',
                  numFlows: 10,
                },
              ],
            },
            connection2: {
              tiles: [
                {
                  _integrationId: 'suitescript1',
                  ssLinkedConnectionId: 'connection2',
                  displayName: 'salesforce netsuite',
                  numError: 10,
                  status: TILE_STATUS.HAS_ERRORS,
                },
              ],
            },
            connection3: {
              tiles: [
                {
                  _integrationId: 'suitescript1',
                  ssLinkedConnectionId: 'connection3',
                  _connectorId: 'suitescript-svb-netsuite',
                  status: TILE_STATUS.IS_PENDING_SETUP,
                },
                {
                  _integrationId: 'suitescript2',
                  ssLinkedConnectionId: 'connection3',
                },
              ],
            },
            connection4: {},
          },
        },
      },
      actions.resource.receivedCollection('tiles', [
        ...standaloneTiles,
        ...tiles,
      ])
    );
    const state = reducer(
      initialState,
      actions.patchFilter(FILTER_KEY,
        {
          sort: { order: 'asc', orderBy: 'name' },
          searchBy: ['name', 'description', 'flowsNameAndDescription'],
          take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
        }
      )
    );

    test('should return limited number of tiles for list view', () => {
      // taking 2 for take as an arbitrary value
      const newState = reducer(state, actions.patchFilter(FILTER_KEY, {take: 2 }));
      const finalState = reducer(newState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
        ],
        perPageCount: 2,
        totalCount: 4,
      };

      expect(filteredHomeTiles(finalState)).toEqual(expected);
    });
    test('should not return limited number of tiles for tile view', () => {
      // taking 2 for take as an arbitrary value
      const newState = reducer(state, actions.patchFilter(FILTER_KEY, {take: 2 }));
      const finalState = reducer(newState, actions.user.preferences.update({dashboard: {view: TILE_VIEW}}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(finalState)).toEqual(expected);
    });
    test('should return tiles sorted by name if default filter is applied for list view', () => {
      const finalState = reducer(state, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(finalState)).toEqual(expected);
    });
    test('should return tiles sorted by status for list view', () => {
      const initialState = reducer(state, actions.patchFilter(FILTER_KEY,
        {
          sort: {
            order: 'desc',
            orderBy: 'status',
          },
        }));
      const newState = reducer(initialState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
      const newTiles = [
        ...tiles,
        {
          _integrationId: 'integration10',
          name: 'Integration ten',
          numError: 2,
        },
      ];
      const finalState = reducer(
        newState,
        actions.resource.receivedCollection('tiles', [
          ...standaloneTiles,
          ...newTiles,
        ])
      );
      const expected = {
        filteredCount: 9,
        filteredTiles: [
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _integrationId: 'integration10',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration10',
            name: 'Integration ten',
            numError: 2,
            pinned: false,
            sortablePropType: 0,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
        ],
        perPageCount: 9,
        totalCount: 5,
      };

      expect(filteredHomeTiles(finalState)).toEqual(expected);
    });
    test('should return tiles sorted by last open error for list view', () => {
      const initialState = reducer(state, actions.patchFilter(FILTER_KEY,
        {
          sort: {
            order: 'asc',
            orderBy: 'lastErrorAt',
          },
        }));
      const newState = reducer(initialState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(newState)).toEqual(expected);
    });
    test('should return tiles sorted by type for list view', () => {
      const initialState = reducer(state, actions.patchFilter(FILTER_KEY,
        {
          sort: {
            order: 'desc',
            orderBy: 'sortablePropType',
          },
        }));
      const newState = reducer(initialState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(newState)).toEqual(expected);
    });
    describe('should return tiles filtered by applications for list view', () => {
      test('for applications with single version', () => {
        const initialState = reducer(state, actions.patchFilter(FILTER_KEY,
          {
            applications: [
              'http',
            ],
          }));
        const newState = reducer(initialState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
        const expected = {
          filteredCount: 1,
          filteredTiles: [
            {
              _connectorId: 'connector1',
              _integrationId: 'connector1',
              applications: [
                'http',
                'app2',
              ],
              connector: {
                applications: [
                  'http',
                  'app2',
                ],
                owner: 'Company 1',
              },
              flowsNameAndDescription: '',
              integration: {
                mode: undefined,
                permissions: {
                  accessLevel: 'owner',
                  connections: {
                    edit: true,
                  },
                },
              },
              key: 'connector1',
              lastErrorAt: 1,
              name: 'Integration Two',
              numError: 4,
              numFlows: 3,
              pinned: false,
              sortablePropType: -1,
              status: 'has_errors',
            },
          ],
          perPageCount: 1,
          totalCount: 4,
        };

        expect(filteredHomeTiles(newState)).toEqual(expected);
      });
      test('for applications with multiple versions', () => {
        const stateWithNewConnections = reducer(state,
          actions.resource.receivedCollection('connections', [
            ...connections,
            {
              _id: 'connection5',
              assistant: 'constantcontactv3',
            },
          ]));
        const stateWithNewApps = reducer(stateWithNewConnections,
          actions.resource.receivedCollection('tiles', [
            ...standaloneTiles,
            ...tiles,
            {
              _integrationId: 'integration1',
              _registeredConnectionIds: ['connection5'],
            },
          ]));
        const initialState = reducer(stateWithNewApps, actions.patchFilter(FILTER_KEY,
          {
            applications: [
              'constantcontact',
            ],
          }));
        const newState = reducer(initialState, actions.user.preferences.update({dashboard: {view: LIST_VIEW}}));
        const expected = {
          filteredCount: 1,
          filteredTiles: [
            {
              _integrationId: 'integration1',
              _registeredConnectionIds: ['connection5'],
              applications: ['constantcontactv3'],
              flowsNameAndDescription: '',
              integration: {
                permissions:
                  {
                    accessLevel: 'owner',
                    connections: {edit: true}},
              },
              key: 'integration1',
              pinned: false,
              sortablePropType: 0,
              status: 'success'}],
          perPageCount: 1,
          totalCount: 5,
        };

        expect(filteredHomeTiles(newState)).toEqual(expected);
      });
    });
    describe('should return tiles filtered by the search filter applied', () => {
      const newState = reducer(state, actions.patchFilter(FILTER_KEY,
        {
          keyword: 'http',
        }));

      test('should return tiles filterd by integration name', () => {
        const expected = {
          filteredCount: 1,
          filteredTiles: [
            {
              _integrationId: 'integration3',
              applications: [],
              flowsNameAndDescription: '',
              integration: {
                permissions: {
                  accessLevel: 'owner',
                  connections: {
                    edit: true,
                  },
                },
              },
              key: 'integration3',
              lastErrorAt: 3,
              name: 'HTTP Integration Three',
              numError: 9,
              numFlows: 4,
              offlineConnections: [
                'conn1',
                'conn2',
              ],
              pinned: false,
              sortablePropType: 4,
              status: 'has_errors',
            },
          ],
          perPageCount: 1,
          totalCount: 4,
        };

        expect(filteredHomeTiles(newState)).toEqual(expected);
      });
      test('should return tiled filtered by flow name and description', () => {
        const expected = {
          filteredCount: 1,
          filteredTiles: [
            {
              _integrationId: 'integration1',
              applications: [],
              flowsNameAndDescription: '|search2|searchflow',
              integration: {
                permissions: {
                  accessLevel: 'owner',
                  connections: {
                    edit: true,
                  },
                },
              },
              key: 'integration1',
              lastErrorAt: 2,
              name: 'Integration One',
              numError: 0,
              numFlows: 2,
              pinned: false,
              sortablePropType: 2,
              status: 'success',
            },
          ],
          perPageCount: 1,
          totalCount: 4,
        };
        const flows = [
          {_id: 1, _connectorId: 'connector1', name: 'integration app'},
          {_id: 2, _integrationId: 'integration1', name: 'search2', description: 'searchflow'},
          {_id: 3, name: 'standalone flow'},
        ];
        let localState = reducer(
          newState,
          actions.resource.receivedCollection('flows', flows)
        );

        localState = reducer(
          localState,
          actions.patchFilter(FILTER_KEY, {keyword: 'search' }
          )
        );
        expect(filteredHomeTiles(localState)).toEqual(expected);
      });
    });
    test('should return tiles by tilesOrder for tile view', () => {
      const initialState = reducer(state, actions.user.preferences.update({
        dashboard: {
          view: TILE_VIEW,
          tilesOrder: ['integration1', 'integration3', 'none', 'connector1']},
      }));
      const finalState = reducer(initialState, actions.patchFilter(FILTER_KEY, {sort: {
        order: 'desc',
        orderBy: 'sortablePropType',
      }}));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(finalState)).toEqual(expected);
    });
    test('should not return pinned tiles before unpinned tiles for tile view', () => {
      const newState = reducer(state, actions.user.preferences.update({
        dashboard: {
          view: TILE_VIEW,
          pinnedIntegrations: ['integration3', 'integration1']},
      }));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: true,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              mode: undefined,
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: true,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            name: undefined,
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            name: undefined,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(newState)).toEqual(expected);
    });
    test('should return pinned tiles before unpinned tiles for list view', () => {
      const newState = reducer(state, actions.user.preferences.update({
        dashboard: {
          view: LIST_VIEW,
          pinnedIntegrations: ['integration3', 'integration4', 'integration5']},
      }));
      const expected = {
        filteredCount: 8,
        filteredTiles: [
          {
            _integrationId: 'integration3',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration3',
            lastErrorAt: 3,
            name: 'HTTP Integration Three',
            numError: 9,
            numFlows: 4,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: true,
            sortablePropType: 4,
            status: 'has_errors',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'suitescript2',
            key: 'connection1_suitescript2',
            numFlows: 10,
            pinned: false,
            sortablePropType: -1,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript2',
            key: 'connection3_suitescript2',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection3',
          },
          {
            _integrationId: 'integration1',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'integration1',
            lastErrorAt: 2,
            name: 'Integration One',
            numError: 0,
            numFlows: 2,
            pinned: false,
            sortablePropType: 2,
            status: 'success',
          },
          {
            _connectorId: 'connector1',
            _integrationId: 'connector1',
            applications: [
              'http',
              'app2',
            ],
            connector: {
              applications: [
                'http',
                'app2',
              ],
              owner: 'Company 1',
            },
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'connector1',
            lastErrorAt: 1,
            name: 'Integration Two',
            numError: 4,
            numFlows: 3,
            pinned: false,
            sortablePropType: -1,
            status: 'has_errors',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection1_suitescript1',
            name: 'salesforce netsuite',
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection1',
          },
          {
            _integrationId: 'suitescript1',
            displayName: 'salesforce netsuite',
            key: 'connection2_suitescript1',
            name: 'salesforce netsuite',
            numError: 10,
            pinned: false,
            sortablePropType: 0,
            ssLinkedConnectionId: 'connection2',
            status: 'has_errors',
          },
          {
            _integrationId: 'none',
            applications: [],
            flowsNameAndDescription: '',
            integration: {
              permissions: {
                accessLevel: 'owner',
                connections: {
                  edit: true,
                },
              },
            },
            key: 'none',
            name: 'Standalone flows',
            numError: 0,
            numFlows: 5,
            offlineConnections: [
              'conn1',
              'conn2',
            ],
            pinned: false,
            sortablePropType: 5,
            status: 'success',
          },
        ],
        perPageCount: 8,
        totalCount: 4,
      };

      expect(filteredHomeTiles(newState)).toEqual(expected);
    });
  });
  describe('selectors.mkHomeTileRedirectUrl test cases', () => {
    const homeTileRedirectUrl = selectors.mkHomeTileRedirectUrl();
    const tiles = [
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
      },
      {
        _integrationId: 'integration2',
        name: 'Integration Two',
        _connectorId: 'connector1',
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
        status: TILE_STATUS.UNINSTALL,
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
    const suiteScriptTiles = [
      {
        _integrationId: 'suitescript0',
        name: 'Connector 1',
        tag: 'test tag',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
      {
        _integrationId: 'suitescript1',
        name: 'Connector 2',
        tag: 'test tag',
        numFlows: 10,
        status: TILE_STATUS.IS_PENDING_SETUP,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
      {
        _integrationId: 'suitescript2',
        name: 'Connector 3',
        tag: 'test tag',
        numFlows: 10,
        status: TILE_STATUS.UNINSTALL,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
      {
        _integrationId: 'suitescript3',
        name: 'Connector 4',
        tag: 'test tag',
        connectorId: 'connector4',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
      {
        _integrationId: 'suitescript4',
        name: 'Connector 5',
        tag: 'test tag',
        connectorId: 'connector5',
        status: TILE_STATUS.IS_PENDING_SETUP,
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
      {
        _integrationId: 'suitescript5',
        name: 'Connector 6',
        connectorId: 'connector6',
        status: TILE_STATUS.UNINSTALL,
        tag: 'test tag',
        numFlows: 10,
        offlineConnections: ['conn1', 'conn2'],
        ssLinkedConnectionId: 'suitescript0',
      },
    ];
    const standaloneTile =
      {
        _integrationId: 'none',
        name: 'Standalone flows',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
      };

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('tiles', tiles)
    );

    test('should return correct values for standalone tiles', () => {
      expect(homeTileRedirectUrl(state, standaloneTile)).toEqual(
        {
          urlToIntegrationConnections: '/integrations/none/connections',
          urlToIntegrationSettings: '/integrations/none',
          urlToIntegrationStatus: '/integrations/none/dashboard',
          urlToIntegrationUsers: '/integrations/none/users',
        }
      );
    });
    describe('suitescript tiles', () => {
      // no connector id
      test('tile has no connectorId, no status', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[0])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrations/suitescript0',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrations/suitescript0/dashboard',
          }
        );
      });

      test('tile has no connectorId, status is pending_setup', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[1])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrationapps/undefined/setup',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrationapps/undefined/setup',
          }
        );
      });
      test('tile has no connectorId, status is uninstall', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[2])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrationapps/undefined/suitescript2/uninstall',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrations/suitescript2/dashboard',
          }
        );
      });

      // connectorId
      test('tile has connectorId, no status', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[3])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrations/suitescript3',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrations/suitescript3/dashboard',
          }
        );
      });
      test('tile has connectorId, status is pending setup', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[4])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrationapps/undefined/setup',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrationapps/undefined/setup',
          }
        );
      });
      test('tile has connectorId, status is uninstall', () => {
        expect(homeTileRedirectUrl(state, suiteScriptTiles[5])).toEqual(
          {
            urlToIntegrationSettings: '/suitescript/suitescript0/integrationapps/undefined/suitescript5/uninstall',
            urlToIntegrationStatus: '/suitescript/suitescript0/integrations/suitescript5/dashboard',
          }
        );
      });
    });
    describe('IO tiles', () => {
      describe('tile status is pending setup', () => {
        test('tile is cloned', () => {
          expect(homeTileRedirectUrl(state, tiles[0])).toEqual(
            {
              urlToIntegrationConnections: '/integrations/integration1/connections',
              urlToIntegrationSettings: '/integrations/integration1',
              urlToIntegrationStatus: '/integrations/integration1/dashboard',
              urlToIntegrationUsers: '/integrations/integration1/users',
            }
          );
        });
        test('tile has connectorId', () => {
          expect(homeTileRedirectUrl(state, tiles[1])).toEqual(
            {
              urlToIntegrationConnections: '/integrationapps/IntegrationTwo/integration2/connections',
              urlToIntegrationSettings: '/integrationapps/IntegrationTwo/integration2',
              urlToIntegrationStatus: '/integrationapps/IntegrationTwo/integration2/dashboard',
              urlToIntegrationUsers: '/integrationapps/IntegrationTwo/integration2/users',
            }
          );
        });
        test('tile has no connectorId', () => {
          expect(homeTileRedirectUrl(state, tiles[2])).toEqual(
            {
              urlToIntegrationConnections: '/integrations/integration3/connections',
              urlToIntegrationSettings: '/integrations/integration3',
              urlToIntegrationStatus: '/integrations/integration3/dashboard',
              urlToIntegrationUsers: '/integrations/integration3/users',
            }
          );
        });
      });
      test('tile status is uninstall', () => {
        expect(homeTileRedirectUrl(state, tiles[3])).toEqual(
          {
            urlToIntegrationConnections: '/integrations/integration4/connections',
            urlToIntegrationSettings: '/integrationapps//integration4/uninstall',
            urlToIntegrationStatus: '/integrations/integration4/dashboard',
            urlToIntegrationUsers: '/integrationapps//integration4/uninstall',
          }
        );
      });
      const errMgt2State = reducer(
        {
          user: {
            profile: { email: 'something@test.com', name: 'First Last', _id: 'owner', useErrMgtTwoDotZero: true },
          },
        },
        'some action'
      );

      describe('tile has connectorId', () => {
        test('tile has connectorId', () => {
          expect(homeTileRedirectUrl(state, tiles[4])).toEqual(
            {
              urlToIntegrationConnections: '/integrationapps/1/integration5/connections',
              urlToIntegrationSettings: '/integrationapps/1/integration5',
              urlToIntegrationStatus: '/integrationapps/1/integration5/dashboard',
              urlToIntegrationUsers: '/integrationapps/1/integration5/users',
            }
          );
        });
        test('user is in error management 2.0', () => {
          expect(homeTileRedirectUrl(errMgt2State, tiles[5])).toEqual(
            {
              urlToIntegrationConnections: '/integrationapps/1/integration6/connections',
              urlToIntegrationSettings: '/integrationapps/1/integration6',
              urlToIntegrationStatus: '/integrationapps/1/integration6',
              urlToIntegrationUsers: '/integrationapps/1/integration6/users',
            }
          );
        });
      });
      describe('tile has template name', () => {
        test('tile has no status, no connectorId, not in err mgt 2', () => {
          expect(homeTileRedirectUrl(state, tiles[6])).toEqual(
            {
              urlToIntegrationConnections: '/integrations/integration7/connections',
              urlToIntegrationSettings: '/integrations/integration7',
              urlToIntegrationStatus: '/integrations/integration7/dashboard',
              urlToIntegrationUsers: '/integrations/integration7/users',
            }
          );
        });
        test('tile has no status, no connectorId, in err mgt 2', () => {
          expect(homeTileRedirectUrl(errMgt2State, tiles[7])).toEqual(
            {
              urlToIntegrationConnections: '/integrationapps/2/integration8/connections',
              urlToIntegrationSettings: '/integrationapps/2/integration8',
              urlToIntegrationStatus: '/integrationapps/2/integration8',
              urlToIntegrationUsers: '/integrationapps/2/integration8/users',
            }
          );
        });
      });
    });
  });
  describe('selectors.isHomeListView test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.isHomeListView()).toBe(false);
    });

    test('should return true if dashboard view is list view', () => {
      const state = reducer(
        undefined,
        actions.user.preferences.update({
          dashboard: {
            view: LIST_VIEW,
          },
        })
      );

      expect(selectors.isHomeListView(state)).toBeTruthy();
    });

    test('should return false if dashboard view is not list view', () => {
      const state = reducer(
        undefined,
        actions.user.preferences.update({
          dashboard: {
            view: TILE_VIEW,
          },
        })
      );

      expect(selectors.isHomeListView(state)).toBeFalsy();
    });
  });
  describe('selectors.isResourceCollectionLoading test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isResourceCollectionLoading()).toBe(false);
    });

    const resource = 'someResource';
    const path = getRoutePath(resource);
    const method = 'GET';

    const newState = reducer(undefined, actions.api.request(path, method));

    test('should return true when the api request is made', () => {
      expect(selectors.isResourceCollectionLoading(newState, resource)).toBe(true);
    });

    const state = reducer(newState, actions.api.complete(path, method));

    test('should return false when the api request is complete', () => {
      expect(selectors.isResourceCollectionLoading(state, resource)).toBe(false);
    });

    const resource2 = 'transfers';
    const path1 = getRoutePath(resource2);
    const path2 = getRoutePath(`${resource2}/invited`);

    const state1 = reducer(undefined, actions.api.request(path1, method));

    test('should return true when the api request is made', () => {
      expect(selectors.isResourceCollectionLoading(state1, resource2)).toBe(true);
    });
    const state2 = reducer(state1, actions.api.complete(path1, method));

    test('should return false when the api request is complete', () => {
      expect(selectors.isResourceCollectionLoading(state2, resource2)).toBe(false);
    });

    const state3 = reducer(undefined, actions.api.request(path2, method));

    test('should return true when the api request is made', () => {
      expect(selectors.isResourceCollectionLoading(state3, resource2)).toBe(true);
    });
    const state4 = reducer(state3, actions.api.complete(path2, method));

    test('should return false when the api request is complete', () => {
      expect(selectors.isResourceCollectionLoading(state4, resource2)).toBe(false);
    });
  });

  describe('resourceStatus', () => {
    describe('GET resource calls', () => {
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

    const resourceType = 'someResource';
    const resourceCollection = [
      { _id: 's1' },
    ];
    const path = getRoutePath(resourceType);
    const method = 'GET';

    describe('resource collection is not present in state', () => {
      const newState = reducer(undefined, actions.api.request(path, method));

      test('should return correct object when api request is made', () => {
        expect(selectors.resourceStatusModified(newState.data.resources, newState.comms.networkComms, resourceType)).toEqual(
          {hasData: false, isLoading: true, isReady: false, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });

      const state1 = reducer(newState, actions.api.retry(path, method));

      test('should return correct object when api retry is made', () => {
        expect(selectors.resourceStatusModified(state1.data.resources, state1.comms.networkComms, resourceType)).toEqual(
          {hasData: false, isLoading: true, isReady: false, method: 'GET', resourceType: 'someResource', retryCount: 1}
        );
      });
      const state2 = reducer(state1, actions.api.complete(path, method));

      test('should return correct object when api is successful', () => {
        expect(selectors.resourceStatusModified(state2.data.resources, state2.comms.networkComms, resourceType)).toEqual(
          {hasData: false, isLoading: false, isReady: false, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });

      const state3 = reducer(state2, actions.resource.receivedCollection(resourceType, resourceCollection));

      test('should return correct object when resource collection is received', () => {
        expect(selectors.resourceStatusModified(state3.data.resources, state3.comms.networkComms, resourceType)).toEqual(
          {hasData: true, isLoading: false, isReady: true, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });
    });
    describe('resource collection is present in state', () => {
      const previousCollection = [{ _id: 's2' }];
      const newState = reducer(undefined, actions.resource.receivedCollection(resourceType, previousCollection));

      test('should return correct object when collection is received', () => {
        expect(selectors.resourceStatusModified(newState.data.resources, newState.comms.networkComms, resourceType)).toEqual(
          {hasData: true, isLoading: false, isReady: true, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });
      const state1 = reducer(newState, actions.api.request(path, method));

      test('should return correct object when api request is made', () => {
        expect(selectors.resourceStatusModified(state1.data.resources, state1.comms.networkComms, resourceType)).toEqual(
          {hasData: true, isLoading: true, isReady: false, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });

      const state2 = reducer(state1, actions.api.retry(path, method));

      test('should return correct object when api retry is made', () => {
        expect(selectors.resourceStatusModified(state2.data.resources, state2.comms.networkComms, resourceType)).toEqual(
          {hasData: true, isLoading: true, isReady: false, method: 'GET', resourceType: 'someResource', retryCount: 1}
        );
      });

      const state3 = reducer(state1, actions.api.complete(path, method));

      test('should return correct object when api is successful', () => {
        expect(selectors.resourceStatusModified(state3.data.resources, state3.comms.networkComms, resourceType)).toEqual(
          {hasData: true, isLoading: false, isReady: true, method: 'GET', resourceType: 'someResource', retryCount: 0}
        );
      });
    });
  });

  describe('selectors.allResourceStatus test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.allResourceStatus({}, {}, [])).toEqual([]);
    });
    test('should return correct object at a given state', () => {
      const method = 'GET';
      const paths = {
        integrationsPath: '/integrations',
        exportsPath: '/exports',
        importsPath: '/imports',
        connectionsPath: '/connections',
      };
      const integrations = [{ _id: 'i1' }];
      const exports = [{ _id: 'e1' }, { _id: 'e2' }];
      const connections = [{ _id: 'c1' }];
      const resourceTypes = [
        'integrations',
        'exports',
        'connections',
        'imports',
      ];

      const newState = reducer(undefined, actions.resource.receivedCollection('integrations', integrations));
      const state1 = reducer(newState, actions.resource.receivedCollection('exports', exports));
      const state2 = reducer(state1, actions.resource.receivedCollection('connections', connections));

      const state3 = reducer(state2, actions.api.request(paths.integrationsPath, method));
      const state4 = reducer(state3, actions.api.request(paths.exportsPath, method));
      const state5 = reducer(state4, actions.api.request(paths.importsPath, method));
      const state6 = reducer(state5, actions.api.retry(paths.importsPath, method));

      expect(selectors.allResourceStatus(state6.data.resources, state6.comms.networkComms, resourceTypes)).toEqual([
        {hasData: true, isLoading: true, isReady: false, method: 'GET', resourceType: 'integrations', retryCount: 0},
        {hasData: true, isLoading: true, isReady: false, method: 'GET', resourceType: 'exports', retryCount: 0},
        {hasData: true, isLoading: false, isReady: true, method: 'GET', resourceType: 'connections', retryCount: 0},
        {hasData: false, isLoading: true, isReady: false, method: 'GET', resourceType: 'imports', retryCount: 1},
      ]);
    });
  });

  describe('selectors.makeAllResourceStatusSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeAllResourceStatusSelector();

      expect(selector({}, ['connectorLicenses'])).toEqual([{hasData: false, isLoading: false, isReady: false, method: 'GET', resourceType: 'connectorLicenses', retryCount: 0}]);
    });
    test('should return correct object for a given state', () => {
      const state = reducer(
        {
          data: {
            resources: {
              connectorLicenses: [
                { _id: 'cl1' },
              ],
            },
          },
          comms: {
            networkComms: {
              'GET:/connectorLicenses': {
                status: COMM_STATES.LOADING,
                method: 'GET',
              },
            },
          },
        },
        'some-action',
      );

      const selector = selectors.makeAllResourceStatusSelector();

      expect(selector(state, ['connectorLicenses'])).toEqual([{hasData: true, isLoading: true, isReady: false, method: 'GET', resourceType: 'connectorLicenses', retryCount: 0}]);
    });
  });

  describe('selectors.resourceDataModified test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceDataModified()).toEqual({});
    });
    test('should return correct data if only resource is present', () => {
      const resource = { _id: 1, name: 'test X' };

      expect(selectors.resourceDataModified(resource, null, {}, 'exports', '1')).toEqual(
        {
          lastChange: undefined,
          master: { _id: 1, name: 'test X' },
          merged: { _id: 1, name: 'test X' },
          patch: undefined,
        }
      );
    });
    test('should return correct data if only stageIdState present', () => {
      const timestamp1 = Date.now();
      const timestamp2 = Date.now();
      const stagedIdState = {
        patch: [
          { op: 'add', path: '/_connectionId', value: '123', timestamp: timestamp1},
          { op: 'add', path: '/name', value: 'patch X', timestamp: timestamp2},
        ],
      };

      expect(selectors.resourceDataModified(null, stagedIdState, {}, 'exports', 'new-0t575NHzJT')).toEqual(
        {
          lastChange: timestamp2,
          master: null,
          merged: { _connectionId: '123', name: 'patch X' },
          patch: stagedIdState.patch,
        }
      );
    });
    test('should return correct data if both resource and patch are present', () => {
      const resource = { _id: 1, name: 'test X' };
      const timestamp = Date.now();
      const stagedIdState = {
        patch: [{ op: 'replace', path: '/name', value: 'patch X', timestamp}],
      };

      expect(selectors.resourceDataModified(resource, stagedIdState, {}, 'exports', '1')).toEqual(
        {
          lastChange: timestamp,
          master: { _id: 1, name: 'test X' },
          merged: { _id: 1, name: 'patch X' },
          patch: stagedIdState.patch,
        }
      );
    });
  });

  describe('resourceData cache', () => {
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

      expect(resourceData(state, 'exports', 'new-resource-id')).toEqual({merged: {}});
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

  describe('selectors.auditLogs test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.auditLogs({}, 'flows', 'id')).toEqual({logs: [], totalCount: 0});
    });
    const logs = [
      {
        _id: 'l1',
        resourceType: 'flow',
        resourceId: 'f1',
      },
      {
        _id: 'l2',
        resourceType: 'flow',
        resourceId: 'f1',
      },
      {
        _id: 'l3',
        resourceType: 'flow',
        resourceId: 'f1',
      },
      {
        _id: 'l4',
        resourceType: 'flow',
        resourceId: 'f1',
      },
    ];

    const expectedResult = [
      {
        _id: 'l1',
        resourceType: 'flow',
        resourceId: 'f1',
        fieldChange: {},
      },
      {
        _id: 'l2',
        resourceType: 'flow',
        resourceId: 'f1',
        fieldChange: {},
      },
      {
        _id: 'l3',
        resourceType: 'flow',
        resourceId: 'f1',
        fieldChange: {},
      },
      {
        _id: 'l4',
        resourceType: 'flow',
        resourceId: 'f1',
        fieldChange: {},
      },
    ];

    test('should return logs for provided resourceId', () => {
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('flows/f1/audit',
          logs)
      );

      state = reducer(
        state,
        actions.resource.receivedCollection('flows', [{
          _id: 'f1',
        }])
      );

      expect(selectors.auditLogs(state, 'flows', 'f1')).toEqual(
        {
          logs: expectedResult,
          totalCount: 4,
        }
      );
    });

    test('should return logs for IA if childId is passed as argument', () => {
      const conns = [{
        _id: 'c1',
        _integrationId: 'i1',
      }, {
        _id: 'c2',
      }, {
        _id: 'c3',
        _integrationId: 'i2',
      }, {
        _id: 'c4',
        _integrationId: 'i1',
      }];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const flows = [
        {
          _id: 'f1',
          name: 'flow from a to b',
          _integrationId: 'i1',
          pageGenerators: [
            {
              _exportId: 'e1',
            },
          ],
          pageProcessors: [
            {
              _importId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('flows', flows)
      );

      const integration = {
        _id: 'i1',
        settings: {
          supportsMultiStore: true,
          sections: [{
            title: 'Section1',
            id: 's1',
            sections: [{
              flows: [{
                _id: 'f1',
              }],
            },
            ],
          }],
        },
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      const exports = [
        {
          _id: 'e1',
        },
        {
          _id: 'e2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exports)
      );

      const imports = [
        {
          _id: 'i1',
        },
        {
          _id: 'i2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imports)
      );

      const logs = [
        {
          _id: 'l1',
          resourceType: 'flow',
          _resourceId: 'f1',
        },
        {
          _id: 'l2',
          resourceType: 'flow',
          _resourceId: 'f2',
        },
        {
          _id: 'l3',
          resourceType: 'export',
          _resourceId: 'e1',
        },
        {
          _id: 'l4',
          resourceType: 'import',
          _resourceId: 'i1',
        },
        {
          _id: 'l5',
          resourceType: 'connection',
          _resourceId: 'c1',
        },
        {
          _id: 'l6',
          resourceType: 'connection',
          _resourceId: 'c2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('audit', logs)
      );

      expect(selectors.auditLogs(state, undefined, 'i1', {
        childId: 's1',
      })).toEqual({
        logs: [
          {
            _id: 'l1',
            _resourceId: 'f1',
            fieldChange: {

            },
            resourceType: 'flow',
          },
          {
            _id: 'l3',
            _resourceId: 'e1',
            fieldChange: {

            },
            resourceType: 'export',
          },
          {
            _id: 'l4',
            _resourceId: 'i1',
            fieldChange: {

            },
            resourceType: 'import',
          },
          {
            _id: 'l5',
            _resourceId: 'c1',
            fieldChange: {

            },
            resourceType: 'connection',
          },
        ],
        totalCount: 4,
      });
    });
  });

  describe('selectors.mkFlowResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowResources();

      expect(selector()).toEqual([{_id: undefined, name: 'Flow-level'}]);
    });

    const flows = [
      {
        _id: 'f1',
        _exportId: 'e1',
        _importId: 'i1',
        p1: 1,
        p2: 2,
        _integrationId: 'i1',
      },
      {
        _id: 'f4',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        _integrationId: 'i1',
      },
      {
        _id: 'f5',
        pageProcessors: [
          { _exportId: 'e1', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e2', type: 'export' },
        ],
        _integrationId: 'i1',
      },
      {
        _id: 'f6',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        pageProcessors: [
          { _exportId: 'e3', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e4', type: 'export' },
          { _importId: 'i2', type: 'import' },
        ],
        _integrationId: 'i1',
      },
    ];
    const exports = [{
      _id: 'e1',
      name: 'e1',
      _connectionId: 'c1',
    },
    {
      _id: 'e2',
      name: 'e2',
      _connectionId: 'c2',
    }, {
      _id: 'e3',
      name: 'e3',
      _connectionId: 'c3',
    }];
    const imports = [{
      _id: 'i1',
      name: 'i1',
      _connectionId: 'c1',
    }, {
      _id: 'i2',
      name: 'i2',
      _connectionId: 'c4',
    }];

    test('should return correct object if flows are not present in state', () => {
      const flowId = 'f1';
      const state = reducer(
        {
          data: {
            resources: {
              exports,
              imports,
            },
          },
        },
        'some-action',
      );
      const selector = selectors.mkFlowResources();

      expect(selector(state, flowId)).toEqual([{_id: 'f1', name: 'Flow-level'}]);
    });
    test('should Really eturn return correct object for a given state', () => {
      const flowId = 'f6';
      const state = reducer(
        {
          data: {
            resources: {
              flows,
              exports,
              imports,
            },
          },
        },
        'some-action',
      );
      const selector = selectors.mkFlowResources();

      expect(selector(state, flowId)).toEqual(
        [
          {_id: 'f6', name: 'Flow-level'},
          {_id: 'e1', name: 'e1', type: 'exports'},
          {_id: 'e2', name: 'e2', type: 'exports'},
          {_id: 'e3', name: 'e3', isLookup: true, type: 'exports'},
          {_id: 'i1', name: 'i1', type: 'imports'},
          {_id: 'i2', name: 'i2', type: 'imports'},
        ]);
    });
  });

  describe('selectors.mkFlowResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowStepsErrorInfo();

      expect(selector()).toEqual([]);
    });

    const flows = [
      {
        _id: 'f1',
        _exportId: 'e1',
        _importId: 'i1',
        p1: 1,
        p2: 2,
        _integrationId: 'i1',
      },
      {
        _id: 'f4',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        _integrationId: 'i1',
      },
      {
        _id: 'f5',
        pageProcessors: [
          { _exportId: 'e1', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e2', type: 'export' },
        ],
        _integrationId: 'i1',
      },
      {
        _id: 'f6',
        pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
        pageProcessors: [
          { _exportId: 'e3', type: 'export' },
          { _importId: 'i1', type: 'import' },
          { _exportId: 'e4', type: 'export' },
          { _importId: 'i2', type: 'import' },
        ],
        _integrationId: 'i1',
      },
    ];
    const exports = [{
      _id: 'e1',
      name: 'e1',
      _connectionId: 'c1',
    },
    {
      _id: 'e2',
      name: 'e2',
      _connectionId: 'c2',
    }, {
      _id: 'e3',
      name: 'e3',
      _connectionId: 'c3',
    }];
    const imports = [{
      _id: 'i1',
      name: 'i1',
      _connectionId: 'c1',
    }, {
      _id: 'i2',
      name: 'i2',
      _connectionId: 'c4',
    }];

    test('should return empty list if there are no steps for the passed flow', () => {
      const flowId = 'f1';
      const state = reducer(
        {
          data: {
            resources: {
              exports,
              imports,
            },
          },
        },
        'some-action',
      );
      const selector = selectors.mkFlowStepsErrorInfo();

      expect(selector(state, flowId)).toEqual([]);
    });
    test('should return expected error steps for the passed flow with corresponding open error info', () => {
      const flowId = 'f6';
      const integrationId = 'i1';
      const lastErrorAt = new Date().toISOString();
      const state = reducer(
        {
          data: {
            resources: {
              flows,
              exports,
              imports,
            },
          },

          session: {
            errorManagement: {
              openErrors: {
                [flowId]: {
                  status: 'received',
                  data: {
                    e1: { _expOrImpId: 'e1', numError: 10, lastErrorAt },
                    e2: { _expOrImpId: 'e2', numError: 20 },
                    e3: { _expOrImpId: 'e3', numError: 30, lastErrorAt },
                    i1: { _expOrImpId: 'i1', numError: 10 },
                    i2: { _expOrImpId: 'i2', numError: 20 },
                  },
                },
              },
            },
          },
        },
        'some-action',
      );
      const selector = selectors.mkFlowStepsErrorInfo();

      expect(selector(state, flowId, integrationId)).toEqual(
        [
          {id: 'e1', name: 'e1', integrationId, flowId, type: 'exports', count: 10, lastErrorAt },
          {id: 'e2', name: 'e2', integrationId, flowId, type: 'exports', count: 20 },
          {id: 'e3', name: 'e3', isLookup: true, integrationId, flowId, type: 'exports', count: 30, lastErrorAt },
          {id: 'i1', name: 'i1', integrationId, flowId, type: 'imports', count: 10 },
          {id: 'i2', name: 'i2', integrationId, flowId, type: 'imports', count: 20 },
        ]);
    });
    test('should return expected error steps for the passed flow with corresponding open error info sorted by lastErrorAt', () => {
      const flowId = 'f6';
      const integrationId = 'i1';
      const lastErrorAt = new Date().toISOString();
      const state = reducer(
        {
          data: {
            resources: {
              flows,
              exports,
              imports,
            },
          },

          session: {
            errorManagement: {
              openErrors: {
                [flowId]: {
                  status: 'received',
                  data: {
                    e1: { _expOrImpId: 'e1', numError: 10, lastErrorAt },
                    e2: { _expOrImpId: 'e2', numError: 20 },
                    e3: { _expOrImpId: 'e3', numError: 30, lastErrorAt },
                    i1: { _expOrImpId: 'i1', numError: 10 },
                    i2: { _expOrImpId: 'i2', numError: 20 },
                  },
                },
              },
            },
            filters: {
              errorsList: {
                sort: {
                  order: 'desc',
                  orderBy: 'lastErrorAt',
                },
              },
            },
          },
        },
        'some-action',
      );
      const selector = selectors.mkFlowStepsErrorInfo();

      expect(selector(state, flowId, integrationId, undefined, 'errorsList')).toEqual(
        [
          {id: 'e1', name: 'e1', integrationId, flowId, type: 'exports', count: 10, lastErrorAt },
          {id: 'e3', name: 'e3', isLookup: true, integrationId, flowId, type: 'exports', count: 30, lastErrorAt },
          {id: 'e2', name: 'e2', integrationId, flowId, type: 'exports', count: 20 },
          {id: 'i1', name: 'i1', integrationId, flowId, type: 'imports', count: 10 },
          {id: 'i2', name: 'i2', integrationId, flowId, type: 'imports', count: 20 },
        ]);
    });
  });

  describe('selectors.accessTokenList test cases', () => {
    const state = {
      data: {
        resources: {
          accesstokens: [{
            _id: 'token1',
            name: 'AuditlogTest',
            description: 'asdasda',
            revoked: false,
            fullAccess: true,
            legacyNetSuite: false,
            _exportIds: [

            ],
            _importIds: [

            ],
            _apiIds: [

            ],
            _connectionIds: [

            ],
          },
          {
            _id: 'token2',
            name: 'Connector',
            revoked: false,
            fullAccess: false,
            legacyNetSuite: false,
            _exportIds: [
              'exp1',
            ],
            _importIds: [
              'imp1',
            ],
            _apiIds: [
              'api1',
            ],
            _connectionIds: [
              'conn1',
            ],
            _integrationId: 'int1',
            _connectorId: 'conn1',
          }],
        },
      },
    };
    const expected1 = {count: 2,
      filtered: 1,
      resources: [
        {
          _apiIds: [],
          _connectionIds: [],
          _exportIds: [],
          _id: 'token1',
          _importIds: [],
          description: 'asdasda',
          fullAccess: true,
          isEmbeddedToken: false,
          legacyNetSuite: false,
          name: 'AuditlogTest',
          permissionReasons: {
            delete: 'To delete this api token you need to revoke it first.',
          },
          permissions: {
            activate: false,
            delete: false,
            displayToken: true,
            edit: true,
            generateToken: true,
            revoke: true,
          },
          revoked: false,
        },
      ],
      total: 2,
      type: 'accesstokens',
    };
    const expected2 = {
      count: 2,
      filtered: 1,
      resources: [
        {
          _apiIds: [
            'api1',
          ],
          _connectionIds: [
            'conn1',
          ],
          _connectorId: 'conn1',
          _exportIds: [
            'exp1',
          ],
          _id: 'token2',
          _importIds: [
            'imp1',
          ],
          _integrationId: 'int1',
          fullAccess: false,
          isEmbeddedToken: true,
          legacyNetSuite: false,
          name: 'Connector',
          permissionReasons: {
            delete: 'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
            displayToken: 'Embedded Token',
            edit: 'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
            generateToken: 'This api token is owned by a SmartConnector and cannot be regenerated.',
          },
          permissions: {
            activate: false,
            delete: false,
            displayToken: false,
            edit: false,
            generateToken: false,
            revoke: true,
          },
          revoked: false,
          token: undefined,
        },
      ],
      total: 2,
      type: 'accesstokens',
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.accessTokenList({}, {})).toEqual({count: 0, filtered: 0, resources: [], total: 0, type: 'accesstokens'});
    });
    test('should return correct access tokens list for given arguments', () => {
      expect(selectors.accessTokenList(state, {})).toEqual(expected1);
      expect(selectors.accessTokenList(state, {integrationId: 'int1'})).toEqual(expected2);
    });
  });

  describe('selectors.mkConnectionIdsUsedInSelectedFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector()).toEqual([]);
    });
    const state = {
      data: {
        resources: {
          connections: [{
            _id: 'conn1',
            type: 'ftp',
          }, {
            _id: 'conn2',
            type: 'http',
          }, {
            _id: 'conn3',
            type: 'http',
          }, {
            _id: 'conn4',
            type: 'ftp',
          }, {
            _id: 'conn5',
            type: 'http',
          }],
          exports: [{
            _id: 'exp1',
            _connectionId: 'conn1',
          }, {
            _id: 'exp2',
            _connectionId: 'conn2',
          }],
          imports: [{
            _id: 'imp1',
            _connectionId: 'conn3',
          }, {
            _id: 'imp2',
            _connectionId: 'conn4',
          }],
          flows: [{
            _id: 'flow1',
            pageGenerators: [{
              _exportId: 'exp1',
            }],
            pageProcessors: [{
              _importId: 'imp1',
              type: 'import',
            }],
          },
          {
            _id: 'flow2',
            pageGenerators: [{
              _exportId: 'exp2',
            }],
            pageProcessors: [{
              _importId: 'imp2',
              type: 'import',
            }],
          }],
        },
      },
    };

    test('should return connection ids used in selected flows', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector(state, ['flow1', 'flow2'])).toEqual(['conn1', 'conn3', 'conn2', 'conn4']);
    });
    test('should return connection ids used in selected flows', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector(state, ['flow1'])).toEqual(['conn1', 'conn3']);
    });
    test('should return connection ids used in selected flows', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector(state, ['flow1'])).toEqual(['conn1', 'conn3']);
    });
    test('should return empty array if no flow is selected', () => {
      const selector = selectors.mkConnectionIdsUsedInSelectedFlows();

      expect(selector(state, [])).toEqual([]);
    });
  });

  describe('selectors.mkChildIntegration test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkChildIntegration();

      expect(selector()).toEqual();
    });

    test('should return child integration for a parent integration', () => {
      const integrations = [
        {
          _id: 'i1',
          name: 'parent integration',
        },
        {
          _id: 'i2',
          name: 'child integration',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );

      state = reducer(
        state,
        actions.resource.updateChildIntegration('i1', 'i2')
      );

      const selector = selectors.mkChildIntegration();

      expect(selector(state, 'i1')).toEqual(
        integrations[1]
      );
    });

    test('should return undefined if child integration doesn\'t exist', () => {
      const integrations = [
        {
          _id: 'i1',
          name: 'parent integration',
        },
      ];

      const state = reducer(
        undefined,
        actions.resource.receivedCollection('integrations', integrations)
      );

      const selector = selectors.mkChildIntegration();

      expect(selector(state, 'i1')).toEqual();
    });
  });

  describe('selectors.mkFlowGroupMap test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flow1',
            name: 'Flow Name1',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow2',
            name: 'Flow Name2',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow3',
            name: 'Flow Name3',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow4',
            name: 'Flow Name5',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow6',
            name: 'Flow Name6',
          }, {
            _id: 'flow7',
            name: 'Flow Name7',
            _integrationId: 'integration6',
            _connectorId: 'connectorId2',
          }, {
            _id: 'flow8',
            name: 'Flow Name8',
            _integrationId: 'integration5',
          }, {
            _id: 'flow9',
            name: 'Flow Name9',
            _integrationId: 'integration4',
          }, {
            _id: 'flow10',
            name: 'Flow Name10',
            _integrationId: 'integration3',
          }, {
            _id: 'flow11',
            name: 'Flow Name11',
          }, {
            _id: 'flow12',
            name: 'Flow Name12',
            _integrationId: 'integration2',
          }, {
            _id: 'flow13',
            name: 'Flow Name13',
            _integrationId: 'integration1',
          }, {
            _id: 'flow14',
            name: 'flow 14',
            sandbox: true,
          }, {
            _id: 'flow15',
            name: 'Flow Name15',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow16',
            name: 'Flow Name16',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }],
          integrations: [{
            _id: 'integration1',
            name: 'Diy Integration1',
          }, {
            _id: 'integration2',
            name: 'Diy Integration2',
          }, {
            _id: 'integration3',
            name: 'IA2.0 Integration Parent',
            _connectorId: 'connectorId',
            flowGroupings: [
              {name: 'Grouping1 name', _id: 'grouping1Id'},
              {name: 'Grouping2 name', _id: 'grouping2Id'},
            ],
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration5',
            name: 'IA2.0 Integration Child2',
            _connectorId: 'connectorId',
            _parentId: 'integration3',
            installSteps: [{}],
          }, {
            _id: 'integration6',
            name: 'IA1.0 integration',
            _connectorId: 'connectorId2',
          }],
        },
      },
    };

    const selector = selectors.mkFlowGroupMap();

    test('should not throw any exception for bad params', () => {
      expect(selector()).toEqual({});
      expect(selector({})).toEqual({});
      expect(selector(null, null)).toEqual({});
      expect(selector(1, 1)).toEqual({});
      expect(selector('string', 'string')).toEqual({});
    });

    test('should return correct flowMap for integrations containing flow groupings', () => {
      expect(selector(state, 'integration3')).toEqual({
        grouping1Id: 'Grouping1 name',
        grouping2Id: 'Grouping2 name',
        unassigned: 'Unassigned',
      });
    });
  });

  describe('selectors.mkDIYIntegrationFlowList test cases', () => {
    const sortProperties = {
      lastExecutedAtSort: undefined,
      lastExecutedAtSortType: 'date',
    };

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
                    flow2: {
                      flowId: 'flow2',
                      numError: 2,
                    },
                    flow6: {
                      flowId: 'flow6',
                      numError: 1,
                    },
                    flow7: {
                      flowId: 'flow7',
                      numError: 0,
                    },
                  },
                },
                integrationId2: {
                  status: 'received',
                  data: {
                    flow3: {
                      flowId: 'flow3',
                      numError: 23,
                    },
                  },
                },
                integrationId3: {
                  status: 'received',
                  data: {
                    flow4: {
                      flowId: 'flow4',
                      numError: 213,
                    },
                    flow5: {
                      flowId: 'flow5',
                      numError: 32,
                    },
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
                name: 'flow name 1 sandbox',
                _id: 'flow1sb',
                sandbox: true,
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
              }, {
                name: 'flow name 8',
                _id: 'flow8',
                _integrationId: 'integrationId4',
                _flowGroupingId: 'flowGroup1',
              }, {
                name: 'flow name 9',
                _id: 'flow9',
                _integrationId: 'integrationId4',
              }, {
                name: 'flow name 10',
                _id: 'flow10',
                _integrationId: 'integrationId5',
                _flowGroupingId: 'flowGroup1',
              }, {
                name: 'flow name 11',
                _id: 'flow11',
                _integrationId: 'integrationId5',
                _flowGroupingId: 'flowGroup2',
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
              }, {
                _id: 'integrationId4',
                _registeredConnectionIds: ['connection3'],
                _connectorId: 'connector1',
                flowGroupings: [
                  {
                    name: 'flow group 1',
                    _id: 'flowGroup1',
                  },
                  {
                    name: 'flow group 2',
                    _id: 'flowGroup2',
                  },
                  {
                    name: 'flow group 3',
                    _id: 'flowGroup3',
                  },
                ],
              }, {
                _id: 'integrationId5',
                _parentId: 'integrationId4',
                _registeredConnectionIds: ['connection3'],
                _connectorId: 'connector1',
                flowGroupings: [
                  {
                    name: 'flow group 1',
                    _id: 'flowGroup1',
                  },
                  {
                    name: 'flow group 2',
                    _id: 'flowGroup2',
                  },
                  {
                    name: 'flow group 3',
                    _id: 'flowGroup3',
                  },
                ],
              }, {
                _id: 'integrationId6',
                _parentId: 'integrationId4',
                _registeredConnectionIds: ['connection3'],
                _connectorId: 'connector1',
                flowGroupings: [
                  {
                    name: 'flow group 1',
                    _id: 'flowGroup1',
                  },
                  {
                    name: 'flow group 2',
                    _id: 'flowGroup2',
                  },
                  {
                    name: 'flow group 3',
                    _id: 'flowGroup3',
                  },
                ],
              }],
              connections: [{
                _id: 'connection1',
                name: 'connection 1',
              }, {
                _id: 'connection2',
                name: 'connection2',
              }, {
                _id: 'connection3',
                name: 'connection3',
              }],
            },
          },
        },
        'some action'
      );
      const selector = selectors.mkDIYIntegrationFlowList();

      test('should return correct flow list for standalone integration', () => {
        expect(selector(state, 'none')).toEqual([{
          ...sortProperties,
          name: 'flow name 1',
          errors: 0,
          _id: 'flow1',
        }]);
      });
      test('should return correct flow list for standalone integration for sandbox environment', () => {
        expect(selector({...state, user: {preferences: { environment: 'sandbox'}}})).toEqual([
          {
            ...sortProperties,
            name: 'flow name 1 sandbox',
            _id: 'flow1sb',
            sandbox: true,
            errors: 0},
        ]);
      });

      test('should return correct flow list for a diy integration in default order', () => {
        expect(selector(state, 'integrationId1')).toEqual([
          {
            ...sortProperties,
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
          {
            ...sortProperties,
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            ...sortProperties,
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
        ]);
      });

      test('should return correct flow list for a diy integration in sorted order', () => {
        expect(selector(state, 'integrationId1', null, false, {sort: {order: 'asc', orderBy: 'errors'}})).toEqual([
          {
            ...sortProperties,
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
          {
            ...sortProperties,
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            ...sortProperties,
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
        ]);

        expect(selector(state, 'integrationId1', null, false, {sort: {order: 'desc', orderBy: 'errors'}})).toEqual([
          {
            ...sortProperties,
            name: 'flow name 2',
            _integrationId: 'integrationId1',
            errors: 2,
            _id: 'flow2',
          },
          {
            ...sortProperties,
            name: 'flow name 6',
            _integrationId: 'integrationId1',
            errors: 1,
            _id: 'flow6',
          },
          {
            ...sortProperties,
            name: 'flow name 7',
            _integrationId: 'integrationId1',
            errors: 0,
            _id: 'flow7',
          },
        ]);
      });

      test('should return correct flow list for a parent integration with flowGroupings', () => {
        expect(selector(state, 'integrationId4', 'integrationId4')).toEqual([{
          ...sortProperties,
          name: 'flow name 8',
          _id: 'flow8',
          _integrationId: 'integrationId4',
          _flowGroupingId: 'flowGroup1',
          errors: 0,
        }, {
          ...sortProperties,
          errors: 0,
          name: 'flow name 9',
          _id: 'flow9',
          _integrationId: 'integrationId4',
        }]);
      });

      test('should return correct flow list for a child integration with flowGroupings', () => {
        expect(selector(state, 'integrationId4', 'integrationId5')).toEqual([{
          ...sortProperties,
          name: 'flow name 10',
          _id: 'flow10',
          _integrationId: 'integrationId5',
          _flowGroupingId: 'flowGroup1',
          errors: 0,
        }, {
          ...sortProperties,
          errors: 0,
          name: 'flow name 11',
          _id: 'flow11',
          _integrationId: 'integrationId5',
          _flowGroupingId: 'flowGroup2',
        }]);
      });

      test('should return correct flow list for a child integration with flowGroupings and has no flows', () => {
        expect(selector(state, 'integrationId4', 'integrationId6')).toEqual([]);
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

  describe('selectors.mkIntegrationFlowsByGroup test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flow1',
            name: 'Flow Name1',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow2',
            name: 'Flow Name2',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow3',
            name: 'Flow Name3',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow4',
            name: 'Flow Name5',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow6',
            name: 'Flow Name6',
          }, {
            _id: 'flow7',
            name: 'Flow Name7',
            _integrationId: 'integration6',
            _connectorId: 'connectorId2',
          }, {
            _id: 'flow8',
            name: 'Flow Name8',
            _integrationId: 'integration5',
          }, {
            _id: 'flow9',
            name: 'Flow Name9',
            _integrationId: 'integration4',
          }, {
            _id: 'flow10',
            name: 'Flow Name10',
            _integrationId: 'integration3',
          }, {
            _id: 'flow11',
            name: 'Flow Name11',
          }, {
            _id: 'flow12',
            name: 'Flow Name12',
            _integrationId: 'integration2',
          }, {
            _id: 'flow13',
            name: 'Flow Name13',
            _integrationId: 'integration1',
          }, {
            _id: 'flow14',
            name: 'flow 14',
            sandbox: true,
          }, {
            _id: 'flow15',
            name: 'Flow Name15',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow16',
            name: 'Flow Name16',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }],
          integrations: [{
            _id: 'integration1',
            name: 'Diy Integration1',
          }, {
            _id: 'integration2',
            name: 'Diy Integration2',
          }, {
            _id: 'integration3',
            name: 'IA2.0 Integration Parent',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration5',
            name: 'IA2.0 Integration Child2',
            _connectorId: 'connectorId',
            _parentId: 'integration3',
            installSteps: [{}],
          }, {
            _id: 'integration6',
            name: 'IA1.0 integration',
            _connectorId: 'connectorId2',
          }, {
            _id: 'integration7',
            name: 'IA1.0 integration',
            _connectorId: 'connectorId3',
            install: [{}],
            settings: {
              supportsMultiStore: true,
              sections: [{
                mode: 'settings',
                title: 'child1',
                id: 'child1',
                sections: [{
                  title: 'section1',
                  flows: [{
                    _id: 'flow1',
                  }, {
                    _id: 'flow2',
                  }],
                }, {
                  title: 'section2',
                  flows: [{
                    _id: 'flow3',
                  }, {
                    _id: 'flow4',
                  }],
                }],
              }, {
                mode: 'settings',
                title: 'child2',
                id: 'child2',
                sections: [{
                  title: 'section1',
                  flows: [{
                    _id: 'flow16',
                  }],
                }, {
                  title: 'section2',
                  flows: [{
                    _id: 'flow15',
                  }],
                }],
              }],
            },
          }],
        },
      },
    };
    const integrationFlowsByGroup = selectors.mkIntegrationFlowsByGroup();

    test('should not throw any exceptions for invalid params', () => {
      expect(() => integrationFlowsByGroup()).not.toThrow();
      expect(() => integrationFlowsByGroup(null)).not.toThrow();
      expect(() => integrationFlowsByGroup({})).not.toThrow();
      expect(() => integrationFlowsByGroup(null, null, null, null)).not.toThrow();
    });
    test('should return correct flows for standalone integration', () => {
      expect(integrationFlowsByGroup(state)).toEqual([
        {_id: 'flow6', name: 'Flow Name6'},
        {_id: 'flow11', name: 'Flow Name11'},
      ]);
    });

    test('should return correct flows for standalone integration for sandbox environment', () => {
      expect(integrationFlowsByGroup({...state, user: {preferences: { environment: 'sandbox'}}})).toEqual([
        {_id: 'flow14', name: 'flow 14', sandbox: true},
      ]);
    });

    test('should return correct flows for diy integration', () => {
      expect(integrationFlowsByGroup(state, 'integration1')).toEqual([
        {_id: 'flow13', name: 'Flow Name13', _integrationId: 'integration1'},
      ]);
    });

    test('should return correct flows for IA1.0 integration with no childId and no sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration7')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow3',
          _integrationId: 'integration4',
          name: 'Flow Name3',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow4',
          _integrationId: 'integration4',
          name: 'Flow Name5',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow15',
          _integrationId: 'integration7',
          name: 'Flow Name15',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow16',
          _integrationId: 'integration7',
          name: 'Flow Name16',
        },
      ]);
    });

    test('should return correct flows for IA1.0 integration with childId and no sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration7', 'child1')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow3',
          _integrationId: 'integration4',
          name: 'Flow Name3',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow4',
          _integrationId: 'integration4',
          name: 'Flow Name5',
        },
      ]);
    });

    test('should return correct flows for IA1.0 integration with childId and sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration7', 'child1', 'section1')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
      ]);
    });

    test('should return correct flows for IA1.0 integration with no childId and sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration7', null, 'section1')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow16',
          _integrationId: 'integration7',
          name: 'Flow Name16',
        },
      ]);
    });

    test('should return correct flows for IA2.0 integration with no childId and no sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration3')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow3',
          _integrationId: 'integration4',
          name: 'Flow Name3',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow4',
          _integrationId: 'integration4',
          name: 'Flow Name5',
        },
        {
          _id: 'flow8',
          _integrationId: 'integration5',
          name: 'Flow Name8',
        },
        {
          _id: 'flow9',
          _integrationId: 'integration4',
          name: 'Flow Name9',
        },
        {
          _id: 'flow10',
          _integrationId: 'integration3',
          name: 'Flow Name10',
        },

      ]);
    });

    test('should return correct flows for IA2.0 integration with no childId and sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration3', undefined, 'groupId1')).toEqual([
        {
          _connectorId: 'connectorId3',
          _id: 'flow1',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow2',
          _flowGroupingId: 'groupId1',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },

      ]);
    });

    test('should return correct flows for IA2.0 integration with childId and no sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration3', 'integration4')).toEqual([
        {
          _connectorId: 'connectorId3',
          _flowGroupingId: 'groupId1',
          _id: 'flow1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _flowGroupingId: 'groupId1',
          _id: 'flow2',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow3',
          _integrationId: 'integration4',
          name: 'Flow Name3',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow4',
          _integrationId: 'integration4',
          name: 'Flow Name5',
        },
        {
          _id: 'flow9',
          _integrationId: 'integration4',
          name: 'Flow Name9',
        },
      ]);
    });

    test('should return correct flows for IA2.0 integration with childId and sectionId', () => {
      expect(integrationFlowsByGroup(state, 'integration3', 'integration4', 'groupId1')).toEqual([
        {
          _connectorId: 'connectorId3',
          _flowGroupingId: 'groupId1',
          _id: 'flow1',
          _integrationId: 'integration4',
          name: 'Flow Name1',
        },
        {
          _connectorId: 'connectorId3',
          _flowGroupingId: 'groupId1',
          _id: 'flow2',
          _integrationId: 'integration4',
          name: 'Flow Name2',
        },
      ]);
    });

    test('should return correct flows for IA2.0 integration with no childId and sectionId is Unassigned', () => {
      expect(integrationFlowsByGroup(state, 'integration3', undefined, UNASSIGNED_SECTION_ID)).toEqual([

        {
          _connectorId: 'connectorId3',
          _id: 'flow3',
          _integrationId: 'integration4',
          name: 'Flow Name3',
        },
        {
          _connectorId: 'connectorId3',
          _id: 'flow4',
          _integrationId: 'integration4',
          name: 'Flow Name5',
        },
        {
          _id: 'flow8',
          _integrationId: 'integration5',
          name: 'Flow Name8',
        },
        {
          _id: 'flow9',
          _integrationId: 'integration4',
          name: 'Flow Name9',
        },
        {
          _id: 'flow10',
          _integrationId: 'integration3',
          name: 'Flow Name10',
        },
      ]);
    });

    test('should return correct flows for IA2.0 integration with childId and sectionId is unassigned', () => {
      expect(integrationFlowsByGroup(state, 'integration3', 'integration5', UNASSIGNED_SECTION_ID)).toEqual([

        {
          _id: 'flow8',
          _integrationId: 'integration5',
          name: 'Flow Name8',
        },

      ]);
    });
  });

  describe('selectors.mkIntegrationFlowGroups test cases', () => {
    const state = {
      data: {
        resources: {
          flows: [{
            _id: 'flow1',
            name: 'Flow Name1',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow2',
            name: 'Flow Name2',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
            _flowGroupingId: 'groupId1',
          }, {
            _id: 'flow3',
            name: 'Flow Name3',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow4',
            name: 'Flow Name5',
            _integrationId: 'integration4',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow6',
            name: 'Flow Name6',
          }, {
            _id: 'flow7',
            name: 'Flow Name7',
            _integrationId: 'integration6',
            _connectorId: 'connectorId2',
          }, {
            _id: 'flow8',
            name: 'Flow Name8',
            _integrationId: 'integration5',
          }, {
            _id: 'flow9',
            name: 'Flow Name9',
            _integrationId: 'integration4',
          }, {
            _id: 'flow10',
            name: 'Flow Name10',
            _integrationId: 'integration3',
          }, {
            _id: 'flow11',
            name: 'Flow Name11',
          }, {
            _id: 'flow12',
            name: 'Flow Name12',
            _integrationId: 'integration2',
          }, {
            _id: 'flow13',
            name: 'Flow Name13',
            _integrationId: 'integration1',
          }, {
            _id: 'flow14',
            name: 'flow 14',
            sandbox: true,
          }, {
            _id: 'flow15',
            name: 'Flow Name15',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }, {
            _id: 'flow16',
            name: 'Flow Name16',
            _integrationId: 'integration7',
            _connectorId: 'connectorId3',
          }],
          integrations: [{
            _id: 'integration1',
            name: 'Diy Integration1',
          }, {
            _id: 'integration2',
            name: 'Diy Integration2',
          }, {
            _id: 'integration3',
            name: 'IA2.0 Integration Parent',
            _connectorId: 'connectorId',
            flowGroupings: [
              {name: 'Grouping1 name', _id: 'grouping1Id'},
              {name: 'Grouping2 name', _id: 'grouping2Id'},
            ],
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration4',
            name: 'IA2.0 Integration Child',
            _parentId: 'integration3',
            _connectorId: 'connectorId',
            installSteps: [{}],
          }, {
            _id: 'integration5',
            name: 'IA2.0 Integration Child2',
            _connectorId: 'connectorId',
            _parentId: 'integration3',
            installSteps: [{}],
          }, {
            _id: 'integration6',
            name: 'IA1.0 integration',
            _connectorId: 'connectorId2',
          }, {
            _id: 'integration7',
            name: 'IA1.0 integration',
            _connectorId: 'connectorId3',
            install: [{}],
            settings: {
              supportsMultiStore: true,
              sections: [{
                mode: 'settings',
                title: 'child1',
                id: 'child1',
                sections: [{
                  title: 'section1',
                  flows: [{
                    _id: 'flow1',
                  }, {
                    _id: 'flow2',
                  }],
                }, {
                  title: 'section2',
                  flows: [{
                    _id: 'flow3',
                  }, {
                    _id: 'flow4',
                  }],
                }],
              }, {
                mode: 'settings',
                title: 'child2',
                id: 'child2',
                sections: [{
                  title: 'section1',
                  flows: [{
                    _id: 'flow16',
                  }],
                }, {
                  title: 'section2',
                  flows: [{
                    _id: 'flow15',
                  }],
                }],
              }],
            },
          }],
        },
      },
    };
    const integrationFlowGroups = selectors.mkIntegrationFlowGroups();

    test('should not throw any exceptions for invalid params', () => {
      expect(() => integrationFlowGroups()).not.toThrow();
      expect(() => integrationFlowGroups(null)).not.toThrow();
      expect(() => integrationFlowGroups({})).not.toThrow();
      expect(() => integrationFlowGroups(null, null, null, null)).not.toThrow();
    });
    test('should return empty array for standalone integration', () => {
      expect(integrationFlowGroups(state)).toEqual([]);
    });

    test('should return empty array for standalone integration for sandbox environment', () => {
      expect(integrationFlowGroups({...state, user: {preferences: { environment: 'sandbox'}}})).toEqual([]);
    });

    test('should return correct flows for diy integration', () => {
      expect(integrationFlowGroups(state, 'integration1')).toEqual([
      ]);
    });

    test('should return correct flows for IA1.0 integration', () => {
      expect(integrationFlowGroups(state, 'integration7')).toEqual([
        {
          flows: [
            {
              _id: 'flow1',
            },
            {
              _id: 'flow2',
            },
            {
              _id: 'flow16',
            },
          ],
          title: 'section1',
          titleId: 'section1',
        },
        {
          flows: [
            {
              _id: 'flow3',
            },
            {
              _id: 'flow4',
            },
            {
              _id: 'flow15',
            },
          ],
          title: 'section2',
          titleId: 'section2',
        },
      ]);
    });

    test('should return correct flows for IA2.0 integration', () => {
      expect(integrationFlowGroups(state, 'integration3')).toEqual([
        {
          sectionId: 'grouping1Id',
          title: 'Grouping1 name',
        },
        {
          sectionId: 'grouping2Id',
          title: 'Grouping2 name',
        },
        {
          sectionId: 'unassigned',
          title: 'Unassigned',
        },
      ]);
    });
  });

  describe('selectors.showNotificationForTechAdaptorForm', () => {
    const state = {
      data: {
        resources: {
          connections: [
            {
              _id: 'connection1',
              type: 'http',
              http: {mediaType: 'xml'},
            },
            {
              _id: 'connection2',
              assistant: 'amazonmws',
              type: 'http',
              http: {type: 'Amazon-SP-API'},
            },
          ],
        },
      },
      session: {
        stage: {
          123: {patch: [{op: 'replace', path: '/_connectionId', value: 'connection2'}]},
          2: {patch: [{op: 'replace', path: '/useTechAdaptorForm', value: false}]},
          3: {patch: [{op: 'replace', path: '/useTechAdaptorForm', value: true}]},
        },
      },
    };

    test('should not throw exception for invalid arguments', () => {
      expect(selectors.showNotificationForTechAdaptorForm()).toBeFalsy();
      expect(selectors.showNotificationForTechAdaptorForm({})).toBeFalsy();
      expect(selectors.showNotificationForTechAdaptorForm({}, '123')).toBeFalsy();
    });

    test('should return false if resource uses amazon sp-api connection', () => {
      expect(selectors.showNotificationForTechAdaptorForm(state, '123')).toBeFalsy();
    });

    test('should return false if resource uses assistant form', () => {
      expect(selectors.showNotificationForTechAdaptorForm(state, '2')).toBeFalsy();
    });

    test('should return true if resource uses tech adaptor form', () => {
      expect(selectors.showNotificationForTechAdaptorForm(state, '3')).toBeTruthy();
    });
  });
  describe('selectors.getResourceType test cases', () => {
    const state = {
      session: {
        resource: {
          'res-id1': 'temp-id1',
          'res-id2': 'temp-id2',
        },
      },
      data: {
        resources: {
          imports: [{
            name: 'import name 1',
            _id: 'import1',
          }, {
            name: 'import name 2',
            _id: 'temp-id1',
          }],
          exports: [{
            name: 'export name 1',
            _id: 'temp-id2',
          }],
        },
      },
    };

    test('should return exports if passed resource type is pageGenerator', () => {
      expect(selectors.getResourceType(state, { resourceType: 'pageGenerator', resourceId: 'res-123' })).toBe('exports');
    });
    test('should return imports if passed resource type is pageProcessor and an import resource exists with that id', () => {
      expect(selectors.getResourceType(state, { resourceType: 'pageProcessor', resourceId: 'res-id1' })).toBe('imports');
    });
    test('should return exports if passed resource type is pageProcessor and no import resource exists with that id', () => {
      expect(selectors.getResourceType(state, { resourceType: 'pageProcessor', resourceId: 'res-id2' })).toBe('exports');
    });
    test('should return passed resource type if its neither pageGenerator nor pageProcessor', () => {
      expect(selectors.getResourceType(state, { resourceType: 'imports', resourceId: 'res-123' })).toBe('imports');
    });
  });

  describe('selectors.mappingHasLookupOption test cases', () => {
    const state = {
      data: {
        resources: {
          connections: [
            {
              _id: 'connection1',
              type: 'http',
              http: {mediaType: 'xml'},
            },
            {
              _id: 'connection2',
              type: 'rdbms',
              rdbms: {type: 'bigquery'},
            },
            {
              _id: 'connection3',
              type: 'rdbms',
              rdbms: {type: 'redshift'},
            },
            {
              _id: 'connection4',
              type: 'rdbms',
              rdbms: {type: 'snowflake'},
            },
            {
              _id: 'connection5',
              type: 'rdbms',
              rdbms: {type: 'oracle'},
            },
          ],
        },
      },
    };

    test('should return false if the connection is of bigquery rdbms subtype', () => {
      expect(selectors.mappingHasLookupOption(state, 'connections', 'connection2')).toBe(false);
    });
    test('should return false if the connection is of redshift rdbms subtype', () => {
      expect(selectors.mappingHasLookupOption(state, 'connections', 'connection3')).toBe(false);
    });
    test('should return false if the connection is of snowflake rdbms subtype', () => {
      expect(selectors.mappingHasLookupOption(state, 'connections', 'connection4')).toBe(false);
    });
    test('should return true if the connection is not of bigquery, redshift or snowflake rdbms subtype', () => {
      expect(selectors.mappingHasLookupOption(state, 'connections', 'connection5')).toBe(true);
    });
    test('should return true if the connection is of not rdbms type', () => {
      expect(selectors.mappingHasLookupOption(state, 'connections', 'connection1')).toBe(true);
    });
  });

  describe('selectors.mkGetMediaTypeOptions test cases', () => {
    const state = {
      data: {
        resources: {
          connections: [{
            _id: 'connection1',
            type: 'http',
            http: {mediaType: 'xml'},
          },

          ],
        },
      },
      session: {
        form: {
          'exports-1234': {
            parentContext: {
              resourceId: '1234',
              resourceType: 'exports',
            },
            value: {
              '/_connectionId': 'connection1',
              '/http/requestMediaType': 'json',
            },
          },
          'imports-1234': {
            parentContext: {
              resourceId: '1234',
              resourceType: 'imports',
            },
            value: {
              '/_connectionId': 'connection1',
              '/http/requestMediaType': 'json',
            },
          },
          'imports-1111': {
            parentContext: {
              resourceId: '1111',
              resourceType: 'imports',
            },
            value: {
              '/_connectionId': 'connection1',
              '/inputMode': 'blob',
            },
          },
          'connections-1234': {
            parentContext: {
              resourceId: '1234',
              resourceType: 'connections',
            },
            value: {
              '/http/mediaType': 'json',
            },
          },
        },
      },
    };

    const getMediaTypeOptions = selectors.mkGetMediaTypeOptions();

    test('should return correct options for requestMediaType field if resource type is imports and input type is blob', () => {
      const expectedOutput = {
        modifiedOptions: [{ items: [
          { label: 'Multipart / form-data', value: 'form-data' },
          { label: 'JSON', value: 'json' },
        ]}],
        parentFieldMediaType: 'xml',
      };

      expect(getMediaTypeOptions(state, {
        formKey: 'imports-1111',
        resourceType: 'imports',
        fieldId: 'http.requestMediaType',

      })).toEqual(expectedOutput);
    });
    test('should return updated options after removing dependent field media type for exports', () => {
      const expectedOutput = {
        modifiedOptions: [{ items: [
          { label: 'XML', value: 'xml' },
          { label: 'CSV', value: 'csv' },
        ]}],
        parentFieldMediaType: 'json',
      };

      expect(getMediaTypeOptions(state, {
        formKey: 'exports-1234',
        resourceType: 'exports',
        fieldId: 'http.successMediaType',
        dependentFieldForMediaType: '/http/requestMediaType',
        options: [
          { label: 'XML', value: 'xml' },
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
        ],
      })).toEqual(expectedOutput);
    });
    test('should return updated options after removing connection media type for imports', () => {
      const expectedOutput = {
        modifiedOptions: [{ items: [
          { label: 'JSON', value: 'json' },
        ]}],
        parentFieldMediaType: 'xml',
      };

      expect(getMediaTypeOptions(state, {
        formKey: 'imports-1234',
        resourceType: 'imports',
        fieldId: 'http.errorMediaType',
        options: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
        ],
      })).toEqual(expectedOutput);
    });
    test('should return updated options after removing dependent field media type for connections', () => {
      const expectedOutput = {
        modifiedOptions: [{ items: [
          { label: 'XML', value: 'xml' },
          { label: 'CSV', value: 'csv' },
        ]}],
        parentFieldMediaType: 'json',
      };

      expect(getMediaTypeOptions(state, {
        formKey: 'connections-1234',
        resourceType: 'connections',
        fieldId: 'http.successMediaType',
        dependentFieldForMediaType: '/http/mediaType',
        options: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
          { label: 'CSV', value: 'csv' },
        ],
      })).toEqual(expectedOutput);
    });
  });
});

describe('selectors.isParserSupported test cases', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.isParserSupported()).toBe(true);
  });

  test("should return false if it's a new HTTP export and final success media type is not xml or csv", () => {
    const parser = 'xml';
    const conn = {
      _id: 'c1',
      type: 'HTTP',
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };

    const formKey = 'new-xyz123';

    let state = reducer(
      undefined,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'c1'} }));
    const resource = selectors.resourceData(state, 'exports', formKey);

    resource.merged.adaptorType = 'HTTPExport';

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(false);
  });

  test("should return true if it's a new export but not an HTTP Export", () => {
    const parser = 'xml';
    const conn = {
      _id: 'c1',
      type: 'FTP',
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };

    const formKey = 'new-hadh';

    let state = reducer(
      undefined,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'c1'} }));
    const resource = selectors.resourceData(state, 'exports', formKey);

    resource.merged.adaptorType = 'FTPExport';

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(true);
  });

  test("should return true if it's a new export with adaptorType as 'HTTPExport' but not an HTTP Export", () => {
    const parser = 'xml';
    const conn = {
      _id: 'c1',
      type: 'HTTP',
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };

    const formKey = 'new-hadh';

    let state = reducer(
      undefined,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'c1'} }));
    const resource = selectors.resourceData(state, 'exports', formKey);

    resource.merged.adaptorType = 'HTTPExport';
    resource.merged.assistant = 'googledrive';

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(true);
  });

  test('should return true if not an HTTP export but adaptorType as "HTTPExport"', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
      assistant: 'googledrive',
    };
    const fieldMeta = {
      fieldMap: {},
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(true);
  });

  test('should return true if not an HTTP export', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'FTP',
      adaptorType: 'FTPExport',
    };
    const fieldMeta = {
      fieldMap: {},
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(true);
  });

  test('should return true for HTTP export with overridden success media type as parser', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
    };
    const fieldMeta = {
      fieldMap: {
      },
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));
    const cloneState = customCloneDeep(state);

    cloneState.session.form[formKey].value = { '/http/successMediaType': parser };

    expect(selectors.isParserSupported(cloneState, formKey, parser)).toBe(true);
  });

  test('should return false for HTTP export with overridden success media type different from parser', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
    };
    const fieldMeta = {
      fieldMap: {
      },
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    const cloneState = customCloneDeep(state);

    cloneState.session.form[formKey].value = { '/http/successMediaType': 'csv' };

    expect(selectors.isParserSupported(cloneState, formKey, parser)).toBe(false);
  });

  test('should not rely on success media type of connection', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
      _connectionId: 'c1',
    };
    const conn = {
      _id: 'c1',
      type: 'HTTP',
      http: { successMediaType: parser },
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(
      state,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(false);
  });

  test('should return true for HTTP export with media type as parser', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
      _connectionId: 'c1',
    };
    const conn = {
      _id: 'c1',
      type: 'HTTP',
      http: { mediaType: parser },
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(
      state,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(true);
  });

  test('should return false for HTTP export with media different from parser', () => {
    const parser = 'xml';
    const exp = {
      _id: 'e1',
      type: 'HTTP',
      adaptorType: 'HTTPExport',
      _connectionId: 'c1',
    };
    const conn = {
      _id: 'c1',
      type: 'HTTP',
      http: { mediaType: 'form-data' },
    };
    const fieldMeta = {
      fieldMap: {
        _connectionId: {
          id: '_connectionId',
          value: 'c1',
        },
      },
    };
    const formKey = 'exports-e1';

    let state = reducer(
      undefined,
      actions.resource.received('exports', exp)
    );

    state = reducer(
      state,
      actions.resource.received('connections', conn)
    );

    state = reducer(state, actions.form.init(formKey, '', { fieldMeta, parentContext: {resourceId: 'e1'} }));

    expect(selectors.isParserSupported(state, formKey, parser)).toBe(false);
  });
});

describe('resourceCanHaveFileDefinitions', () => {
  test('should return false incase of invalid  params', () => {
    expect(selectors.resourceCanHaveFileDefinitions()).toBe(false);
    expect(selectors.resourceCanHaveFileDefinitions({}, '123')).toBe(false);
    expect(selectors.resourceCanHaveFileDefinitions({}, undefined, 'invalid')).toBe(false);
  });
  test('should return false incase of invalid resourceType', () => {
    const state = reducer(undefined, actions.resource.received('scripts', { _id: 'scripts-1' }));

    expect(selectors.resourceCanHaveFileDefinitions(state, 'scripts-1', 'scripts')).toBe(false);
  });
  test('should return false for data loader export', () => {
    const dl = {
      _id: 'dl-1',
      type: 'simple',
    };
    const state = reducer(undefined, actions.resource.received('exports', dl));

    expect(selectors.resourceCanHaveFileDefinitions(state, 'dl-1', 'exports')).toBe(false);
  });
  test('should return false for rest import', () => {
    const imp = {
      _id: 'i-1',
      adaptorType: 'RESTImport',
      name: 'rest-import',
    };
    const state = reducer(undefined, actions.resource.received('imports', imp));

    expect(selectors.resourceCanHaveFileDefinitions(state, 'i-1', 'imports')).toBe(false);
  });
  test('should return true for file adaptors', () => {
    const exportsList = [{
      _id: 'e1',
      adaptorType: 'S3Export',
      name: 'e1',
    }, {
      _id: 'e2',
      adaptorType: 'FTPExport',
      name: 'e2',
    }];
    const importsList = [{
      _id: 'i1',
      adaptorType: 'FTPImport',
      name: 'i1',
    }, {
      _id: 'i2',
      adaptorType: 'S3Import',
      name: 'i2',
    }];
    const state = {
      data: {
        resources: {
          exports: exportsList,
          imports: importsList,
        },
      },
    };

    expect(selectors.resourceCanHaveFileDefinitions(state, 'i1', 'imports')).toBe(true);
    expect(selectors.resourceCanHaveFileDefinitions(state, 'i2', 'imports')).toBe(true);
    expect(selectors.resourceCanHaveFileDefinitions(state, 'e1', 'exports')).toBe(true);
    expect(selectors.resourceCanHaveFileDefinitions(state, 'e2', 'exports')).toBe(true);
  });
  test('should return true for as2 resource', () => {
    const imp = {
      _id: 'i1',
      adaptorType: 'AS2Import',
      name: 'i1',
    };
    const exp = {
      _id: 'e1',
      adaptorType: 'AS2Export',
      name: 'e1',
    };
    const state1 = reducer(undefined, actions.resource.received('imports', imp));
    const state2 = reducer(undefined, actions.resource.received('exports', exp));

    expect(selectors.resourceCanHaveFileDefinitions(state1, 'i1', 'imports')).toBe(true);
    expect(selectors.resourceCanHaveFileDefinitions(state2, 'e1', 'exports')).toBe(true);
  });
  test('should return true for file provider assistants', () => {
    const exportsList = FILE_PROVIDER_ASSISTANTS.map((assistant, index) => ({
      _id: `e-${index}`,
      assistant,
    }));
    const state = {
      data: {
        resources: {
          exports: exportsList,
        },
      },
    };

    exportsList.forEach(exp => {
      expect(selectors.resourceCanHaveFileDefinitions(state, exp._id, 'exports')).toBe(true);
    });
  });
});
