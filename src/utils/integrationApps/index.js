import { INSTALL_STEP_TYPES, CLONING_SUPPORTED_IAS } from '../constants';
import { isProduction } from '../../forms/utils';

export const getIntegrationAppUrlName = (
  integrationAppName,
  isV2Integration
) => {
  if (!integrationAppName || typeof integrationAppName !== 'string') {
    return 'integrationApp';
  }

  return (
    integrationAppName.replace(/\W/g, '').replace(/Connector/gi, '') +
    (isV2Integration ? 'V2' : '')
  );
};

export const getAvailableTabs = ({tabs: allTabs, isIntegrationApp, isParent, hasAddOns}) => {
  const tabs = []
  if (isIntegrationApp) {
    tabs.push('users')
    if (!hasAddOns) {
      tabs.push('addons')
    }
  } else {
    tabs.push('addons')
  }
  if (isParent) {
    tabs.push('flows')
    tabs.push('dashboard')
  }
  return allTabs.filter(tab => !tabs.includes(tab.path))
}

const getIntegrationApp = ({ _connectorId, name }) => {
  const domain = window.document.location.hostname.replace('www.', '');
  const integrationAppId = {
    'staging.integrator.io': {
      '5666865f67c1650309224904': 'zendesk',
      '5656f5e3bebf89c03f5dd77e': 'shopify',
      '568e4843d997f2b705f44082': 'jira',
      '56d3e8d3e24d0cf5090e5a18': 'magento2',
      '570222ce6c99305e0beff026': 'adp',
      '56fbb1176691821844de2721': 'bigcommerce',
      '57b5c79c61314b461e1515b1': 'walmart',
      '5773b7378910c875334053ba': 'openair',
      '57c8199e8489cc1a298cc6ea': 'cashapp',
      '57e10364a0047c23baeffa09': 'jet',
      '58777a2b1008fb325e6c0953': 'amazon',
      '5829bce6069ccb4460cdb34e': 'eBay',
      '58ee6029319bd30cc2fee160': 'salesforceSubscription',
      '58d3b1b7822f16187f873177': 'vendorPaymentManager',
      '5b61ae4aeb538642c26bdbe6': 'sfnsio',
      '5811aeea2095951e76c6ce64': 'salesforceCommerce',
      '5d84891a2af6196b2e0be90c': 'square',
      '5b4f5b8ab3122842c1be0314': 'amazonmcf',
    },
    'integrator.io': {
      '55022fc3285348c76a000005': 'zendesk',
      '54fa0b38a7044f9252000036': 'shopify',
      '56cc2a64a42f08124832753a': 'jira',
      '5717912fbc5a8ca446571f1e': 'magento2',
      '5728756afee45a8d11e79cb7': 'adp',
      '57179182e0a908200c2781d9': 'bigcommerce',
      '57dbed962eca42c50e6e22be': 'walmart',
      '57a82017810491d30e1c9760': 'openair',
      '586cb88fc1d53d6a279d527e': 'cashapp',
      '581cebf290a63a26daea6081': 'jet',
      '58c90bccc13f547763bf2fc1': 'amazon',
      '58d94e6b2e4b300dbf6b01bc': 'eBay',
      '5833ea9127b52153647f3b7e': 'magento1',
      '592e8679c95560380ff1325c': 'salesforceSubscription',
      '58f772ed3c25f31c8041d5fe': 'vendorPaymentManager',
      '5c8f30229f701b3e9a0aa817': 'sfnsio',
      '5db8164d9df868329731fca0': 'square',
      '5b754a8fddbb3b71d6046c87': 'amazonmcf',
      '5845210ebfa3ab6faced62fb': 'salesforceCommerce',
    },
    'eu.integrator.io': {
      '5e8d6f912387e356b6769bc5': 'amazon',
      '5e8d6ca02387e356b6769bb8': 'shopify',
      '5e7d921e2387e356b67669ce': 'sfnsio',
    },
    'localhost.io': {
      'Zendesk - NetSuite Connector': 'zendesk',
      'Shopify - NetSuite Connector': 'shopify',
      'JIRA - NetSuite Connector': 'jira',
      'ADP - NetSuite Connector': 'adp',
      'Magento 2 - NetSuite Connector': 'magento2',
      'BigCommerce - NetSuite Connector': 'bigcommerce',
      'Walmart - NetSuite Connector': 'walmart',
      'OpenAir - Salesforce Connector': 'openair',
      'Cash Application Manager for NetSuite': 'cashapp',
      'Jet - NetSuite Connector': 'jet',
      'Amazon - NetSuite Connector': 'amazon',
      'eBay - NetSuite Connector': 'eBay',
      'Salesforce - Subscription Billing Connector': 'salesforceSubscription',
      'Vendor Payment Manager': 'vendorPaymentManager',
      'Salesforce - NetSuite Connector': 'sfnsio',
    },
  };
  let integrationApp;

  if (domain === 'localhost.io') {
    integrationApp = integrationAppId[domain][name];
  } else {
    integrationApp = integrationAppId[domain][_connectorId];
  }

  return integrationApp;
};

export default {
  getStepText: (step = {}, mode) => {
    let stepText = '';
    const isUninstall = mode === 'uninstall';

    if (
      step._connectionId ||
      step.type === INSTALL_STEP_TYPES.STACK ||
      step.type === 'connection' ||
      step.sourceConnection ||
      step.type === INSTALL_STEP_TYPES.FORM
    ) {
      if (step.completed) {
        stepText = 'Configured';
      } else if (step.isTriggered) {
        stepText = 'Configuring...';
      } else {
        stepText = 'Click to Configure';
      }
    } else if (step.installURL || step.uninstallURL) {
      if (step.completed) {
        stepText = isUninstall ? 'Uninstalled' : 'Installed';
      } else if (step.isTriggered) {
        if (step.verifying) {
          stepText = 'Verifying...';
        } else {
          stepText = 'Verify Now';
        }
      } else {
        stepText = isUninstall ? 'Click to Uninstall' : 'Click to Install';
      }
    } else if (step.completed) {
      stepText = isUninstall ? 'Done' : 'Configured';
    } else if (step.isTriggered) {
      stepText = isUninstall ? 'Uninstalling...' : 'Installing...';
    } else {
      stepText = isUninstall ? 'Click to Uninstall' : 'Click to Install';
    }

    return stepText;
  },
  getHighestEditionForIntegrationApp: (integration = {}) => {
    const { _connectorId, name } = integration;
    let highestEdition = 'starter';

    if (!_connectorId) {
      return 'starter';
    }

    const integrationApp = getIntegrationApp({ _connectorId, name });

    if (!integrationApp) return highestEdition;

    if (['jet', 'salesforceCommerce'].indexOf(integrationApp) !== -1) {
      highestEdition = 'enterprise';
    } else if (
      [
        'shopify',
        'bigcommerce',
        'magento2',
        'amazon',
        'sfnsio',
        'adp',
        'vendorPaymentManager',
        'jira',
        'cashapp',
      ].indexOf(integrationApp) !== -1
    ) {
      highestEdition = 'premium';
    } else if (['zendesk', 'eBay', 'walmart'].includes(integrationApp)) {
      highestEdition = 'standard';
    } else {
      highestEdition = 'starter';
    }

    return highestEdition;
  },
  isCloningSupported: (_connectorId, name) =>
    !isProduction() &&
    CLONING_SUPPORTED_IAS.includes(getIntegrationApp({ _connectorId, name })),
};
