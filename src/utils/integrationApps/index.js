import isEmpty from 'lodash/isEmpty';
import { INSTALL_STEP_TYPES, CLONING_SUPPORTED_IAS, STANDALONE_INTEGRATION, FORM_SAVE_STATUS, CATEGORY_MAPPING_SAVE_STATUS } from '../../constants';
import { capitalizeFirstLetter } from '../string';

export const getIntegrationAppUrlName = integrationAppName => {
  if (!integrationAppName || typeof integrationAppName !== 'string') {
    return 'integrationApp';
  }

  return integrationAppName.replace(/\W/g, '').replace(/Connector/gi, '');
};

export const isIntegrationAppVersion2 = (integration, skipCloneCheck) => {
  if (!integration) return false;
  let isCloned = false;

  if (!skipCloneCheck) {
    isCloned =
    integration.install &&
    integration.install.find(step => step.isClone);
  }
  const isFrameWork2 =
    !!((
      integration.installSteps &&
      integration.installSteps.length) || (
      integration.uninstallSteps &&
        integration.uninstallSteps.length)) ||
    !!isCloned;

  return isFrameWork2;
};

export const getEmptyMessage = (storeLabel = '', action) => {
  switch (storeLabel.toLowerCase()) {
    case 'amazon account':
      return `Choose an Amazon account from the account drop-down to ${action}.`;
    case 'bank':
      return `Choose a bank from the bank drop-down to ${action}.`;
    case 'shopify store':
      return `Choose a Shopify store from the store drop-down to ${action}.`;
    default:
      return `Choose a ${storeLabel} from the ${storeLabel} drop-down to ${action}.`;
  }
};

export const getAdminLevelTabs = ({integrationId, isIntegrationApp, isParent, supportsChild, children, isMonitorLevelUser, isManageLevelUser}) => {
  const tabs = [
    'general',
    'readme',
    'apitoken',
    'subscription',
    'uninstall',
  ];
  const sectionsToHide = [];

  if (integrationId === STANDALONE_INTEGRATION.id) {
    sectionsToHide.push('readme');
    sectionsToHide.push('general');
  }
  if (!isIntegrationApp) {
    sectionsToHide.push('subscription');
    sectionsToHide.push('apitoken');
    sectionsToHide.push('uninstall');
  } else {
    sectionsToHide.push('readme');
    sectionsToHide.push('general');
    if (isManageLevelUser || !isParent) {
      sectionsToHide.push('apitoken');
    } else if (supportsChild && children && children.length > 1) {
      sectionsToHide.push('uninstall');
    }
  }
  if (isMonitorLevelUser) {
    sectionsToHide.push('uninstall');
    sectionsToHide.push('apitoken');
  }

  return tabs.filter(
    sec => !sectionsToHide.includes(sec)
  );
};

export const isParentViewSelected = (integration, childId) => !!(integration?.settings?.supportsMultiStore && !childId);

export const getTopLevelTabs = (options = {}) => {
  const {
    tabs: allTabs,
    isIntegrationApp,
    hasAddOns,
    integrationId,
    hideSettingsTab,
  } = options;
  const excludeTabs = [];
  const showAdminTabs = !!getAdminLevelTabs(options).length;
  const isStandalone = STANDALONE_INTEGRATION.id === integrationId;

  if (isIntegrationApp) {
    if (!hasAddOns) {
      excludeTabs.push('addons');
    }
  } else {
    excludeTabs.push('addons');
  }
  // if (isParent) {
  //   excludeTabs.push('flows');
  //   excludeTabs.push('dashboard');
  // }
  if (!showAdminTabs || isStandalone) {
    excludeTabs.push('admin');
  }
  if (isStandalone || hideSettingsTab) {
    excludeTabs.push('settings');
  }

  return allTabs.filter(tab => !excludeTabs.includes(tab.path));
};

export const getIntegrationApp = ({ _connectorId, name }) => {
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
    'iaqa.staging.integrator.io': {
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
      '5f1ad76d288b074c1a73fadd': 'zendesk',
      '601c0115ec36e31f12bec565': 'magento2',
      '601c018dec36e31f12bec575': 'eBay',
      '601c01f51cad372eabaaafdf': 'bigcommerce',
      '601c00abec36e31f12bec551': 'walmart',
    },
    'localhost.io': {
      'Zendesk - NetSuite Connector': 'zendesk',
      'Shopify - NetSuite': 'shopify',
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
      'Salesforce - NetSuite': 'sfnsio',
    },
  };

  integrationAppId['qa.staging.integrator.io'] = integrationAppId['staging.integrator.io'];
  if (!integrationAppId[domain]) {
    integrationAppId[domain] = {...integrationAppId['staging.integrator.io']};
  }

  let integrationApp;

  if (domain.indexOf('localhost') > -1) {
    integrationApp = integrationAppId['localhost.io'][name];
  } else {
    integrationApp = integrationAppId[domain][_connectorId];
  }

  return integrationApp;
};

export default {
  getStepText: (step = {}, mode) => {
    // TODO: move this to a generic util file as Install steps are not just used in IAs
    let stepText = '';
    let showSpinner = false;
    const isUninstall = mode === 'uninstall';

    if (step.type === INSTALL_STEP_TYPES.MERGE) {
      if (step.isTriggered) {
        stepText = 'Merging';
        showSpinner = true;
      } else {
        stepText = 'Merge';
      }
    } else if (step.type === INSTALL_STEP_TYPES.REVERT) {
      if (step.isTriggered) {
        stepText = 'Reverting';
        showSpinner = true;
      } else {
        stepText = 'Revert';
      }
    } else if (
      step._connectionId ||
      step.type === INSTALL_STEP_TYPES.STACK ||
      step.type === 'connection' ||
      step.type === 'ssConnection' ||
      (step.sourceConnection && !(step?.name?.startsWith('Integrator Bundle') || step?.name?.startsWith('Integrator SuiteApp'))) ||
      step.type === INSTALL_STEP_TYPES.FORM ||
      // IA1.0 doesnt have type on their step scheam, instead check for 'form' property populated
      !isEmpty(step.form)
    ) {
      if (step.completed) {
        stepText = isUninstall ? 'Uninstalled' : 'Configured';
      } else if (step.isTriggered) {
        stepText = isUninstall ? 'Uninstalling' : 'Configuring';
        showSpinner = true;
      } else {
        stepText = isUninstall ? 'Uninstall' : 'Configure';
      }
    } else if (step.installURL || step.uninstallURL || step.url || step.getUrlFunction) {
      if (step.completed) {
        stepText = isUninstall ? 'Uninstalled' : 'Installed';
      } else if (step.isTriggered) {
        if (step.verifying) {
          showSpinner = true;
          stepText = 'Verifying';
        } else {
          stepText = 'Verify now';
        }
      } else {
        stepText = isUninstall ? 'Uninstall' : 'Install';
      }
    } else if (step.completed) {
      stepText = isUninstall ? 'Done' : 'Configured';
    } else if (step.isTriggered) {
      showSpinner = true;
      stepText = isUninstall ? 'Uninstalling' : 'Installing';
    } else {
      stepText = isUninstall ? 'Uninstall' : 'Install';
    }

    return { stepText, showSpinner };
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
    } else if (integrationApp === 'shopify') {
      highestEdition = 'shopifymarkets';
    } else if (
      [
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
    CLONING_SUPPORTED_IAS.includes(getIntegrationApp({ _connectorId, name })),
};

export const getTitleFromEdition = edition => {
  if (edition.toLowerCase() === 'shopifymarkets') {
    return 'Shopify Markets';
  }

  return capitalizeFirstLetter(edition);
};

export const getTitleIdFromSection = sec => sec.title ? sec.title.replace(/\s/g, '').replace(/\W/g, '_') : '';

export const getFormStatusFromCategoryMappingStatus = mappingSaveStatus => {
  switch (mappingSaveStatus) {
    case CATEGORY_MAPPING_SAVE_STATUS.REQUESTED: return FORM_SAVE_STATUS.LOADING;
    case CATEGORY_MAPPING_SAVE_STATUS.SAVED: return FORM_SAVE_STATUS.COMPLETE;
    default: return FORM_SAVE_STATUS.FAILED;
  }
};
