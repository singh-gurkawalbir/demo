import { stringCompare } from '../../utils/sort';

export const templateList = [
  { label: '3dCart', value: '3dcart' },
  { label: '3PL Central', value: '3plcentral' },
  { label: 'ADP', value: 'adp' },
  { label: 'AS2', value: 'as2' },
  { label: 'Amazon AWS', value: 'amazonaws' },
  { label: 'Amazon MWS', value: 'amazonmws' },
  { label: 'SAP Ariba', value: 'ariba' },
  { label: 'Asana', value: 'asana' },
  { label: 'Banking', value: 'banking' },
  { label: 'BigCommerce', value: 'bigcommerce' },
  { label: 'Box', value: 'box' },
  { label: 'Braintree', value: 'braintree' },
  { label: 'Certify', value: 'certify' },
  { label: 'Chargify', value: 'chargify' },
  { label: 'Clover', value: 'clover' },
  { label: 'DCL', value: 'dcl' },
  // { label: 'Desk', value: 'desk' },
  { label: 'Docusign', value: 'docusign' },
  { label: 'Dropbox', value: 'dropbox' },
  { label: 'eBay', value: 'ebay' },
  { label: 'FTP', value: 'ftp' },
  { label: 'Facebook Ads', value: 'facebookads' },
  { label: 'FinancialForce', value: 'financialforce' },
  { label: 'Gainsight CS', value: 'gainsight' },
  { label: 'GitHub', value: 'github' },
  { label: 'Google', value: 'google' },
  { label: 'Jet', value: 'jet' },
  { label: 'Jira', value: 'jira' },
  { label: 'Jobvite', value: 'jobvite' },
  { label: 'LiquidPlanner', value: 'liquidplanner' },
  { label: 'Loop Returns', value: 'loopreturns' },
  { label: 'Magento 2', value: 'magento' },
  { label: 'NetSuite', value: 'netsuite' },
  { label: 'Newegg', value: 'newegg' },
  { label: 'NexTag', value: 'nextag' },
  { label: 'OpenAir', value: 'openair' },
  { label: 'Oracle Supplier Network', value: 'osn' },
  { label: 'Other', value: 'other' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Paychex', value: 'paychex' },
  { label: 'Propack', value: 'propack' },
  { label: 'Salesforce', value: 'salesforce' },
  { label: 'ServiceNow', value: 'servicenow' },
  { label: 'ShipStation', value: 'shipstation' },
  { label: 'Shipwire', value: 'shipwire' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'Silicon Valley Bank', value: 'svb' },
  { label: 'SkuVault', value: 'skuvault' },
  { label: 'Skubana', value: 'skubana' },
  { label: 'Slack', value: 'slack' },
  { label: 'Square', value: 'squareup' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'SurveyMonkey', value: 'surveymonkey' },
  { label: 'Travis CI', value: 'travis' },
  { label: 'Twilio', value: 'twilio' },
  { label: 'Walmart', value: 'walmart' },
  { label: 'Wiser', value: 'wiser' },
  { label: 'WooCommerce', value: 'woocommerce' },
  { label: 'X-Cart', value: 'xcart' },
  { label: 'Zendesk Support', value: 'zendesk' },
  { label: 'Zuora', value: 'zuora' },
];
templateList.sort(stringCompare('label'));

const getAssistants = () => {
  let localStorageAssistants;

  try {
    localStorageAssistants = JSON.parse(localStorage.getItem('assistants')) || [];
  } catch (e) {
    localStorageAssistants = [];
  }

  return localStorageAssistants;
};
export const applicationsList = () => {
  const assistants = getAssistants();
  const applications = templateList.filter(templates => {
    const assistant = assistants.find(a => a.id === templates.value);

    return !assistant || !templates.value;
  });

  assistants.forEach(asst => {
    if (
      ![
        'yammer',
        'hybris',
        'etsy',
        'concur',
        'concurall',
        'concurv4',
        'constantcontact',
      ].includes(asst.id)
    ) {
      applications.push({
        value: asst.id,
        label: asst.name
      });
    }
  });
  applications.sort(stringCompare('label'));

  return applications;
};
export default templateList;
