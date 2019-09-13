export default {
  name: {
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  imageURL: {
    defaultValue: r => r.imageURL,
    type: 'text',
    label: 'Image URL',
    required: true,
  },
  websiteURL: {
    defaultValue: r => r.websiteURL,
    type: 'text',
    label: 'Website URL:',
  },
  contactEmail: {
    defaultValue: r => r.contactEmail,
    type: 'text',
    valueDelimiter: ',',
    label: 'Contact Emails',
    required: true,
  },
  installerFunction: {
    defaultValue: r => r.installerFunction,
    type: 'text',
    label: 'Installer Function',
    required: true,
  },
  _stackId: {
    defaultValue: r => r._stackId,
    type: 'text',
    label: 'Stack',
    required: true,
  },
  uninstallerFunction: {
    defaultValue: r => r.uninstallerFunction,
    type: 'select',
    label: 'Uninstaller Function',
    required: true,
  },
  updateFunction: {
    defaultValue: r => r.updateFunction,
    type: 'text',
    label: 'Update Function',
    required: true,
  },
  applications: {
    defaultValue: r => r.applications,
    type: 'multiselect',
    label: 'Applications',
    valueDelimiter: ',',
    options: [
      {
        items: [
          { label: '3dCart', value: '3dcart' },
          { label: 'Google', value: 'google' },
          { label: 'Asana', value: 'asana' },
          { label: 'Box', value: 'box' },
          { label: 'Dropbox', value: 'dropbox' },
          { label: 'Twilio', value: 'twilio' },
          { label: 'Facebook Ads', value: 'facebookads' },
          { label: 'Docusign', value: 'docusign' },
          { label: 'SurveyMonkey', value: 'surveymonkey' },
          { label: 'Paychex', value: 'paychex' },
          { label: 'X-Cart', value: 'xcart' },
          { label: 'Amazon MWS', value: 'amazonmws' },
          { label: 'Amazon AWS', value: 'amazonaws' },
          { label: 'BigCommerce', value: 'bigcommerce' },
          { label: 'Certify', value: 'certify' },
          { label: 'Chargify', value: 'chargify' },
          { label: 'Clover', value: 'clover' },
          { label: 'eBay', value: 'ebay' },
          { label: 'FTP', value: 'ftp' },
          { label: 'AS2', value: 'as2' },
          { label: 'Jet', value: 'jet' },
          { label: 'Jira', value: 'jira' },
          { label: 'Jobvite', value: 'jobvite' },
          { label: 'LiquidPlanner', value: 'liquidplanner' },
          { label: 'Magento 2', value: 'magento' },
          { label: 'labelly', value: 'labelly' },
          { label: 'NetSuite', value: 'netsuite' },
          { label: 'OpenAir', value: 'openair' },
          { label: 'PayPal', value: 'paypal' },
          { label: 'Salesforce', value: 'salesforce' },
          { label: 'Shopify', value: 'shopify' },
          { label: 'Skubana', value: 'skubana' },
          { label: 'Square', value: 'squareup' },
          { label: 'Stripe', value: 'stripe' },
          { label: 'Silicon Valley Bank', value: 'svb' },
          { label: 'Walmart', value: 'walmart' },
          { label: 'WooCommerce', value: 'woocommerce' },
          { label: 'Zendesk', value: 'zendesk' },
          { label: 'Slack', value: 'slack' },
          { label: 'DCL', value: 'dcl' },
          { label: 'ShipStation', value: 'shipstation' },
          { label: 'Wiser', value: 'wiser' },
          { label: 'Shipwire', value: 'shipwire' },
          { label: 'Travis CI', value: 'travis' },
          { label: 'GitHub', value: 'github' },
          { label: 'Banking', value: 'banking' },
          { label: 'ADP', value: 'adp' },
          { label: 'ServiceNow', value: 'servicenow' },
          { label: 'Zuora', value: 'zuora' },
          { label: 'Desk', value: 'desk' },
          { label: 'Other', value: 'other' },
          { label: 'Braintree', value: 'braintree' },
          { label: 'Ariba', value: 'ariba' },
          { label: 'Oracle Supplier Network', value: 'osn' },
          { label: 'SkuVault', value: 'skuvault' },
          { label: 'NexTag', value: 'nextag' },
          { label: 'Newegg', value: 'newegg' },
          { label: 'Gainsight', value: 'gainsight' },
        ],
      },
    ],
  },
};
