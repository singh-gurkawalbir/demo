export const templateList = [
  { label: '3dCart', value: '3dcart' },
  { label: '3PL Central', value: '3plcentral' },
  { label: 'ADP', value: 'adp' },
  { label: 'AS2', value: 'as2' },
  { label: 'Amazon AWS', value: 'amazonaws' },
  { label: 'Amazon MWS', value: 'amazonmws' },
  { label: 'Ariba', value: 'ariba' },
  { label: 'Asana', value: 'asana' },
  { label: 'Banking', value: 'banking' },
  { label: 'BigCommerce', value: 'bigcommerce' },
  { label: 'Box', value: 'box' },
  { label: 'Braintree', value: 'braintree' },
  { label: 'Certify', value: 'certify' },
  { label: 'Chargify', value: 'chargify' },
  { label: 'Clover', value: 'clover' },
  { label: 'DCL', value: 'dcl' },
  { label: 'Desk', value: 'desk' },
  { label: 'Docusign', value: 'docusign' },
  { label: 'Dropbox', value: 'dropbox' },
  { label: 'eBay', value: 'ebay' },
  { label: 'FTP', value: 'ftp' },
  { label: 'Facebook Ads', value: 'facebookads' },
  { label: 'Gainsight', value: 'gainsight' },
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
  { label: 'Zendesk', value: 'zendesk' },
  { label: 'Zuora', value: 'zuora' },
];
templateList.sort((a, b) => {
  const nameA = a.label ? a.label.toUpperCase() : '';
  const nameB = b.label ? b.label.toUpperCase() : '';

  if (nameA < nameB) return -1;

  if (nameA > nameB) return 1;

  return 0; // names must be equal
});

export default {
  templateList,
};
