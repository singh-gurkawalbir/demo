/* global describe, expect, beforeAll, test */
import each from 'jest-each';
import moment from 'moment';
import reducer, { selectors } from '.';
import actions from '../actions';
import { ACCOUNT_IDS, INTEGRATION_ACCESS_LEVELS, TILE_STATUS, USER_ACCESS_LEVELS } from '../utils/constants';
import { MISCELLANEOUS_SECTION_ID } from '../views/Integration/DIY/panels/Flows';

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
            type: 'assistant5',
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

      expect(selectors.flowDetails(state, 'f1').isRealtime).toEqual(true);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toEqual(false);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toEqual(true);
      expect(selector(state, 'f1').isRunnable).toEqual(false);
      expect(selector(state, 'f1').canSchedule).toEqual(false);
      expect(selector(state, 'f1').isSimpleImport).toEqual(false);
      expect(selector(state, 'f1').isDeltaFlow).toEqual(false);
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

      expect(selectors.flowDetails(state, 'f1').isRealtime).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toEqual(true);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toEqual(true);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toEqual(false);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toEqual(false);
      expect(selector(state, 'f1').isRunnable).toEqual(true);
      expect(selector(state, 'f1').canSchedule).toEqual(false);
      expect(selector(state, 'f1').isSimpleImport).toEqual(true);
      expect(selector(state, 'f1').isDeltaFlow).toEqual(false);
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

      expect(selectors.flowDetails(state, 'f1').isRealtime).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isRunnable).toEqual(true);
      expect(selectors.flowDetails(state, 'f1').canSchedule).toEqual(true);
      expect(selectors.flowDetails(state, 'f1').isSimpleImport).toEqual(false);
      expect(selectors.flowDetails(state, 'f1').isDeltaFlow).toEqual(true);

      const selector = selectors.mkFlowDetails();

      expect(selector(state, 'f1').isRealtime).toEqual(false);
      expect(selector(state, 'f1').isRunnable).toEqual(true);
      expect(selector(state, 'f1').canSchedule).toEqual(true);
      expect(selector(state, 'f1').isSimpleImport).toEqual(false);
      expect(selector(state, 'f1').isDeltaFlow).toEqual(true);
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
      expect(selectors.isDataLoader()).toEqual(false);
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

      expect(selectors.isDataLoader(state, 'f1')).toEqual(true);
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

      expect(selectors.isDataLoader(state, 'f1')).toEqual(true);
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

      expect(selectors.isDataLoader(state, 'f1')).toEqual(false);
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
            type: 'Data Loader',
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
            type: 'Data Loader',
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
      expect(selectors.flowType()).toEqual('');
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

      expect(selectors.flowType(state, 'f1')).toEqual('');
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

      expect(selectors.flowType(state, 'f1')).toEqual('Realtime');
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

      expect(selectors.flowType(state, 'f1')).toEqual('Data Loader');
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

      expect(selectors.flowType(state, 'f1')).toEqual('Scheduled');
    });
  });

  describe('selectors.mkFlowAllowsScheduling test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkFlowAllowsScheduling();

      expect(selector()).toEqual(false);
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

      expect(selector(state, 'f1')).toEqual(true);
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

      expect(selector(state, 'f1')).toEqual(false);
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

      expect(selector(state, 'f1')).toEqual(true);
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

      expect(selector(state, 'f1')).toEqual(false);
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
      expect(selectors.flowUsesUtilityMapping()).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(null)).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(null, null)).toEqual(false);
      expect(selectors.flowUsesUtilityMapping({}, {})).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(123, 124)).toEqual(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowUsesUtilityMapping(state, 'invalidFlowId')).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId3')).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId4')).toEqual(true);
    });

    test('should return correct value for mullti store connector', () => {
      expect(selectors.flowUsesUtilityMapping(state, 'flowId1', 'child1')).toEqual(false);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2')).toEqual(true);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2', 'child1')).toEqual(true);
      expect(selectors.flowUsesUtilityMapping(state, 'flowId2', 'child2')).toEqual(false);
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
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowSupportsMapping()).toEqual(false);
      expect(selectors.flowSupportsMapping(null)).toEqual(false);
      expect(selectors.flowSupportsMapping(null, null)).toEqual(false);
      expect(selectors.flowSupportsMapping({}, {})).toEqual(false);
      expect(selectors.flowSupportsMapping(123, 124)).toEqual(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowSupportsMapping(state, 'integrationId1')).toEqual(false);
      expect(selectors.flowSupportsMapping(state, 'flowId4')).toEqual(true);
      expect(selectors.flowSupportsMapping(state, 'flowId3')).toEqual(false);
    });

    test('should return correct value for mullti store connector', () => {
      expect(selectors.flowSupportsMapping(state, 'flowId1', 'child1')).toEqual(false);
      expect(selectors.flowSupportsMapping(state, 'flowId2')).toEqual(true);
      expect(selectors.flowSupportsMapping(state, 'flowId2', 'child1')).toEqual(true);
      expect(selectors.flowSupportsMapping(state, 'flowId2', 'child2')).toEqual(false);
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
      expect(selectors.flowSupportsSettings()).toEqual(false);
      expect(selectors.flowSupportsSettings(null)).toEqual(false);
      expect(selectors.flowSupportsSettings(null, null)).toEqual(false);
      expect(selectors.flowSupportsSettings({}, {})).toEqual(false);
      expect(selectors.flowSupportsSettings(123, 124)).toEqual(false);
    });

    test('should return correct value for single store connector', () => {
      expect(selectors.flowSupportsSettings(state, 'integrationId1')).toEqual(false);
      expect(selectors.flowSupportsSettings(state, 'flowId4')).toEqual(true);
      expect(selectors.flowSupportsSettings(state, 'flowId3')).toEqual(false);
    });

    test('should return correct value for mullti store connector', () => {
      expect(selectors.flowSupportsSettings(state, 'flowId1', 'child1')).toEqual(false);
      expect(selectors.flowSupportsSettings(state, 'flowId2')).toEqual(true);
      expect(selectors.flowSupportsSettings(state, 'flowId2', 'child1')).toEqual(true);
      expect(selectors.flowSupportsSettings(state, 'flowId2', 'child2')).toEqual(false);
    });
  });

  describe('selectors.flowListWithMetadata test cases', () => {
    const state = {
      data: {
        resources: {
          exports: [{
            _id: 'exp1',
            type: 'distributed',
          }, {
            _id: 'exp2',
            type: 'simple',
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
              _importId: 'imp1',
              type: 'import',
            }],
          },
          {
            _id: 'flow3',
            schedule: '* 5 * * * *',
            pageGenerators: [{
              _exportId: 'exp3',
            }],
            pageProcessors: [{
              _importId: 'imp1',
              type: 'import',
            }],
          }],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowListWithMetadata()).toEqual({resources: []});
      expect(selectors.flowListWithMetadata({})).toEqual({resources: []});
      expect(selectors.flowListWithMetadata(null)).toEqual({resources: []});
      expect(selectors.flowListWithMetadata(null, null)).toEqual({resources: []});
    });

    test('should return correct flow list with metadata', () => {
      expect(selectors.flowListWithMetadata(state, { type: 'flows' })).toEqual({
        resources: [
          {
            _id: 'flow1',
            isRealtime: true,
            pageGenerators: [
              {
                _exportId: 'exp1',
              },
            ],
            pageProcessors: [
              {
                _importId: 'imp1',
                type: 'import',
              },
            ],
          },
          {
            _id: 'flow2',
            isRunnable: true,
            isSimpleImport: true,
            pageGenerators: [
              {
                _exportId: 'exp2',
              },
            ],
            pageProcessors: [
              {
                _importId: 'imp1',
                type: 'import',
              },
            ],
          },
          {
            _id: 'flow3',
            isRunnable: true,
            showScheduleIcon: true,
            schedule: '* 5 * * * *',
            pageGenerators: [
              {
                _exportId: 'exp3',
              },
            ],
            pageProcessors: [
              {
                _importId: 'imp1',
                type: 'import',
              },
            ],
          },
        ],
      });
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
      expect(selectors.isConnectionOffline()).toEqual(false);
    });
    test('should return true if given connection is offline', () => {
      expect(selectors.isConnectionOffline(connState, 'connection1')).toEqual(true);
    });
    test('should return undefined if given connection is online', () => {
      expect(selectors.isConnectionOffline(connState, 'connection2')).toEqual(false);
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
        },
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
          usedTrialLicenseExists: false,
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
          usedTrialLicenseExists: false,
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
          usedTrialLicenseExists: false,
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
      expect(selectors.resourceData()).toEqual({sandbox: false});
      expect(selectors.resourceData({ data: {} })).toEqual({sandbox: false});
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
        merged: {sandbox: false},
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
      expect(selectors.resourceDataModified()).toEqual({sandbox: false});
    });
  });

  describe('resourceData cache ', () => {
    const resourceData = selectors.makeResourceDataSelector();

    test('should return {} on bad state or args.', () => {
      expect(resourceData()).toEqual({sandbox: false});
      expect(resourceData({ data: {} })).toEqual({sandbox: false});
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
        merged: {
          sandbox: false,
        },
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
          count: 4,
          totalCount: 4,
        }
      );
    });

    test('should return logs for provided resourceId and with filtering', () => {
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

      expect(selectors.auditLogs(state, 'flows', 'f1', undefined, {
        take: 2,
      })).toEqual(
        {
          logs: [
            expectedResult[0],
            expectedResult[1],
          ],
          count: 2,
          totalCount: 4,
        }
      );
    });

    test('should return logs for IA if storeId is passed as argument', () => {
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

      expect(selectors.auditLogs(state, undefined, 'i1', undefined, {
        storeId: 's1',
      })).toEqual({
        count: 4,
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

  describe('selectors.getScriptContext test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getScriptContext({}, {})).toEqual();
    });
    const state = reducer(
      {
        data: {
          resources: {
            flows: [{
              name: 'flow name 1',
              _id: 'flow1',
            }, {
              name: 'flow name 2',
              _id: 'flow2',
              _integrationId: 'integrationId1',
            }],
          },
        },
      },
      'some action'
    );

    test('should return expected script context for valid state and flow id', () => {
      expect(selectors.getScriptContext(state, {contextType: 'hook',
        flowId: 'flow2'})).toEqual({_integrationId: 'integrationId1', container: 'integration', type: 'hook'});
    });
    test('should return undefined if given flow does not contains integrtion id', () => {
      expect(selectors.getScriptContext(state, {contextType: 'hook',
        flowId: 'flow1'})).toEqual(undefined);
    });
    test('should return undefined if given input does not contains context type', () => {
      expect(selectors.getScriptContext(state, {
        flowId: 'flow2'})).toEqual(undefined);
    });
    test('should return undefined if given input does not contains flow id', () => {
      expect(selectors.getScriptContext(state, {contextType: 'hook',
      })).toEqual(undefined);
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

    test('should return correct flows for IA2.0 integration with no childId and sectionId is miscellaneous', () => {
      expect(integrationFlowsByGroup(state, 'integration3', undefined, MISCELLANEOUS_SECTION_ID)).toEqual([

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

    test('should return correct flows for IA2.0 integration with childId and sectionId is miscellaneous', () => {
      expect(integrationFlowsByGroup(state, 'integration3', 'integration5', MISCELLANEOUS_SECTION_ID)).toEqual([

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
          sectionId: 'miscellaneous',
          title: 'Miscellaneous',
        },
      ]);
    });
  });
});
