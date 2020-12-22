/* global describe, expect, test */
import { selectors } from '.';

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

  describe('selectors.mkFlowDetails test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const flowDetailsSelector = selectors.mkFlowDetails();

      expect(flowDetailsSelector(undefined, {})).toEqual({});
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

  describe('selectors.userAccessLevelOnConnection test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userAccessLevelOnConnection()).toEqual();
    });
  });

  describe('selectors.matchingConnectionList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.matchingConnectionList()).toEqual([]);
    });
  });

  describe('selectors.matchingStackList test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.matchingStackList()).toEqual([]);
    });
  });

  describe('selectors.publishedConnectors test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.publishedConnectors()).toEqual(suitescriptConnectors);
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

  describe('selectors.marketplaceConnectors test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.marketplaceConnectors()).toEqual([]);
    });
  });

  describe('selectors.mkTiles test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkTiles();

      expect(selector()).toEqual([]);
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

  describe('selectors.resourceStatus test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceStatus()).toEqual({hasData: false, isLoading: false, isReady: false, method: 'GET', resourceType: undefined, retryCount: 0});
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

  describe('selectors.resourceDataModified test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.resourceDataModified()).toEqual({});
    });
  });

  describe('selectors.makeResourceDataSelector test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.makeResourceDataSelector();

      expect(selector()).toEqual({});
    });
  });

  describe('selectors.isEditorV2Supported test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isEditorV2Supported()).toEqual(false);
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
});

