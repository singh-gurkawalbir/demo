/* global describe,  expect, jest, beforeEach, afterEach */
import each from 'jest-each';
import IntegrationApp, {
  getIntegrationAppUrlName,
  getEmptyMessage,
  getAdminLevelTabs,
  isParentViewSelected,
  getTopLevelTabs,
  getIntegrationApp,
  getTitleIdFromSection,
} from '.';

describe('getIntegrationAppUrlName', () => {
  const testCases = [
    ['integrationApp', 123],
    ['IntegrationAppId', 'connector/IntegrationAppId'],
  ];

  each(testCases).test(
    'should return %s when integrationAppName = %s',
    (expected, integrationAppName) => {
      expect(getIntegrationAppUrlName(integrationAppName)).toEqual(expected);
    }
  );
});

describe('getEmptyMessage', () => {
  const testCases = [
    [
      'Choose an Amazon account from the account drop-down to action.',
      'aMaZoN account',
      'action',
    ],
    [
      'Choose a bank from the bank drop-down to action.',
      'bank',
      'action',
    ],
    [
      'Choose a Shopify store from the store drop-down to action.',
      'shopify store',
      'action',
    ],
    [
      'Choose a default from the default drop-down to action.',
      'default',
      'action',
    ],
  ];

  each(testCases).test(
    'should return %s when storeLabel = %s and action = %s',
    (expected, storeLabel, action) => {
      expect(getEmptyMessage(storeLabel, action)).toEqual(expected);
    }
  );
});

describe('getAdminLevelTabs', () => {
  const testCases = [
    [
      ['subscription'],
      {
        integrationId: 'none',
        isIntegrationApp: true,
        isParent: true,
        supportsChild: true,
        children: ['dummy', 'dummy'],
        isMonitorLevelUser: true,
      },
    ],
    [
      ['subscription'],
      {
        integrationId: 'none',
        isIntegrationApp: true,
        isParent: false,
        supportsChild: false,
        children: [],
        isMonitorLevelUser: true,
      },
    ],
    [
      [
        'apitoken',
        'subscription',
      ],
      {
        integrationId: 'none',
        isIntegrationApp: true,
        isParent: true,
        supportsChild: true,
        children: ['dummy', 'dummy'],
        isMonitorLevelUser: false,
      },
    ],
    [
      [
        'subscription',
        'uninstall',
      ],
      {
        integrationId: 'none',
        isIntegrationApp: true,
        isParent: false,
        supportsChild: false,
        children: [],
        isMonitorLevelUser: false,
      },
    ],
    [
      [],
      {
        integrationId: 'none',
        isIntegrationApp: false,
        isParent: false,
        supportsChild: false,
        children: [],
        isMonitorLevelUser: true,
      },
    ],
    [
      [
        'general',
        'readme',
      ],
      {
        integrationId: 'something',
        isIntegrationApp: false,
        isParent: false,
        supportsChild: false,
        children: [],
        isMonitorLevelUser: false,
      },
    ],
  ];

  each(testCases).test(
    'should return %o when args = %o',
    (
      expected,
      {
        integrationId,
        isIntegrationApp,
        isParent,
        supportsChild,
        children,
        isMonitorLevelUser,
      }
    ) => {
      expect(
        getAdminLevelTabs({
          integrationId,
          isIntegrationApp,
          isParent,
          supportsChild,
          children,
          isMonitorLevelUser,
        })
      ).toEqual(expected);
    }
  );
});

describe('isParentViewSelected', () => {
  const testCases = [
    [
      false,
      {
        settings: {
          supportsMultiStore: true,
        },
      },
      'dummyId',
    ],
    [
      true,
      {
        settings: {
          supportsMultiStore: true,
        },
      },
      '',
    ],
    [
      false,
      {
        settings: {
          supportsMultiStore: false,
        },
      },
      'dummyId',
    ],
  ];

  each(testCases).test(
    'should return %s when integration = %o and storeId = %s',
    (expected, integration, storeId) => {
      expect(isParentViewSelected(integration, storeId)).toEqual(expected);
    }
  );
});

describe('getTopLevelTabs', () => {
  const testCases = [
    [
      [],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: false,
        hasAddOns: false,
        integrationId: 'none',
        hideSettingsTab: false,
      },
    ],
    [
      [],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: true,
        hasAddOns: false,
        integrationId: 'none',
        hideSettingsTab: true,
      },
    ],
    [
      [{ path: 'addons' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: true,
        hasAddOns: true,
        integrationId: 'none',
        hideSettingsTab: false,
      },
    ],
    [
      [{ path: 'addons' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: true,
        hasAddOns: true,
        integrationId: 'none',
        hideSettingsTab: true,
      },
    ],
    [
      [{ path: 'admin' }, { path: 'settings' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: false,
        hasAddOns: false,
        integrationId: 'something',
        hideSettingsTab: false,
      },
    ],
    [
      [{ path: 'admin' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: false,
        hasAddOns: false,
        integrationId: 'something',
        hideSettingsTab: true,
      },
    ],
    [
      [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: true,
        hasAddOns: true,
        integrationId: 'something',
        hideSettingsTab: false,
      },
    ],
    [
      [{ path: 'addons'}, { path: 'admin' }],
      {
        tabs: [{ path: 'addons' }, { path: 'admin' }, { path: 'settings' }],
        isIntegrationApp: true,
        hasAddOns: true,
        integrationId: 'something',
        hideSettingsTab: true,
      },
    ],
  ];

  each(testCases).test(
    'should return %o when options = %o',
    (expected, options) => {
      expect(getTopLevelTabs(options)).toEqual(expected);
    }
  );
});

describe('getIntegrationApp', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });
  const testCases = [
    [
      'zendesk',
      {
        _connectorId: '5666865f67c1650309224904',
        name: 'Zendesk - NetSuite Connector',
      },
    ],
    [
      'shopify',
      {
        _connectorId: '5656f5e3bebf89c03f5dd77e',
        name: 'Shopify - NetSuite Connector',
      },
    ],
    [
      undefined,
      {
        _connectorId: 'something',
        name: 'something',
      },
    ],
  ];

  each(testCases).test(
    'should return %o when options = %o',
    (expected, { _connectorId, name }) => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      return expect(getIntegrationApp({ _connectorId, name })).toEqual(expected);
    }
  );
});

describe('getStepText', () => {
  const testCases = [
    [
      {
        stepText: 'Uninstalled',
        showSpinner: false,
      },
      {
        _connectionId: 'something',
        completed: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Configured',
        showSpinner: false,
      },
      {
        _connectionId: 'something',
        completed: true,
      },
      'something',
    ],
    [
      {
        stepText: 'Uninstalling',
        showSpinner: true,
      },
      {
        _connectionId: 'something',
        isTriggered: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Configuring',
        showSpinner: true,
      },
      {
        _connectionId: 'something',
        isTriggered: true,
      },
      'something',
    ],
    [
      {
        stepText: 'Uninstall',
        showSpinner: false,
      },
      {
        _connectionId: 'something',
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Configure',
        showSpinner: false,
      },
      {
        _connectionId: 'something',
        isTriggered: false,
      },
      'something',
    ],
    [
      {
        stepText: 'Uninstalled',
        showSpinner: false,
      },
      {
        installURL: 'something',
        completed: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Installed',
        showSpinner: false,
      },
      {
        installURL: 'something',
        completed: true,
      },
      'something',
    ],
    [
      {
        stepText: 'Verifying',
        showSpinner: true,
      },
      {
        installURL: 'something',
        isTriggered: true,
        verifying: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Verify now',
        showSpinner: false,
      },
      {
        installURL: 'something',
        isTriggered: true,
        verifying: false,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Uninstall',
        showSpinner: false,
      },
      {
        installURL: 'something',
        isTriggered: false,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Install',
        showSpinner: false,
      },
      {
        installURL: 'something',
        isTriggered: false,
      },
      'something',
    ],
    [
      {
        stepText: 'Done',
        showSpinner: false,
      },
      {
        completed: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Configured',
        showSpinner: false,
      },
      {
        completed: true,
      },
      'something',
    ],
    [
      {
        stepText: 'Uninstalling',
        showSpinner: true,
      },
      {
        isTriggered: true,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Installing',
        showSpinner: true,
      },
      {
        isTriggered: true,
      },
      'something',
    ],
    [
      {
        stepText: 'Uninstall',
        showSpinner: false,
      },
      {
        isTriggered: false,
      },
      'uninstall',
    ],
    [
      {
        stepText: 'Install',
        showSpinner: false,
      },
      {
        isTriggered: false,
      },
      'something',
    ],
  ];

  each(testCases).test(
    'should return %o when step = %o and mode = %s',
    (expected, step, mode) => {
      expect(IntegrationApp.getStepText(step, mode)).toEqual(expected);
    }
  );
});

describe('getHighestEditionForIntegrationApp', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });
  const testCases = [
    ['starter', { _connectorId: '', name: 'dummy' }],
    ['starter', { _connectorId: 'something', name: 'something' }],
    ['enterprise', { _connectorId: '57e10364a0047c23baeffa09', name: 'Jet - NetSuite Connector' }],
    ['enterprise', { _connectorId: '5811aeea2095951e76c6ce64', name: 'salesforceCommerce' }],
    ['premium', { _connectorId: '5656f5e3bebf89c03f5dd77e', name: 'Shopify - NetSuite Connector'}],
    ['premium', { _connectorId: '56fbb1176691821844de2721', name: 'BigCommerce - NetSuite Connector'}],
    ['premium', { _connectorId: '56d3e8d3e24d0cf5090e5a18', name: 'Magento 2 - NetSuite Connector'}],
    ['premium', { _connectorId: '58777a2b1008fb325e6c0953', name: 'Amazon - NetSuite Connector'}],
    ['premium', { _connectorId: '5b61ae4aeb538642c26bdbe6', name: 'Salesforce - NetSuite Connector'}],
    ['premium', { _connectorId: '570222ce6c99305e0beff026', name: 'ADP - NetSuite Connector'}],
    ['premium', { _connectorId: '58d3b1b7822f16187f873177', name: 'Vendor Payment Manager'}],
    ['premium', { _connectorId: '568e4843d997f2b705f44082', name: 'JIRA - NetSuite Connector'}],
    ['premium', { _connectorId: '57c8199e8489cc1a298cc6ea', name: 'Cash Application Manager for NetSuite'}],
    ['standard', { _connectorId: '5666865f67c1650309224904', name: 'Zendesk - NetSuite Connector' }],
    ['standard', { _connectorId: '5829bce6069ccb4460cdb34e', name: 'eBay - NetSuite Connector' }],
    ['standard', { _connectorId: '57b5c79c61314b461e1515b1', name: 'Walmart - NetSuite Connector' }],
  ];

  each(testCases).test(
    'should return %s when integration = %o',
    (expected, integration) => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      return expect(IntegrationApp.getHighestEditionForIntegrationApp(integration)).toEqual(expected);
    }
  );
});

describe('isCloningSupported', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });
  const testCases = [
    [false, '', ''],
    [false, 'dummy', 'dummy'],
    [false, '5666865f67c1650309224904', 'Zendesk - NetSuite Connector'],
    [true, '5b61ae4aeb538642c26bdbe6', 'Salesforce - NetSuite Connector'],
  ];

  each(testCases).test(
    'should return %s when _connectorId = %s and name = %s',
    (expected, _connectorId, name) => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      return expect(IntegrationApp.isCloningSupported(_connectorId, name)).toEqual(expected);
    }
  );
});

describe('getTitleIdFromSection', () => {
  const testCases = [
    [
      '',
      {
        noTitle: '',
      },
    ],
    [
      'sectionTitle',
      {
        title: 'section Title',
      },
    ],
    [
      'section_title_123',
      {
        title: 'section@title@123',
      },
    ],
  ];

  each(testCases).test(
    'should return %s when sec = %o',
    (expected, sec) => {
      expect(getTitleIdFromSection(sec)).toEqual(expected);
    }
  );
});
