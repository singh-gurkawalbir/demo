const MULTIPLE_EMAILS = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/; // Regular Expression to Simple multiple email addresses separated by commas from regextester.com

export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  description: {
    type: 'text',
    multiline: true,
    maxRows: 5,
    label: 'Description',
  },
  imageURL: {
    type: 'text',
    label: 'Image URL',
    required: true,
  },
  websiteURL: {
    type: 'text',
    label: 'Website URL',
    validWhen: {
      matchesRegEx: {
        pattern:
          "^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$",
        message: 'Please enter a valid URL.',
      },
    },
  },
  contactEmail: {
    type: 'text',
    label: 'Contact emails',
    required: true,
    placeholder: 'Comma separated list of emails',
    validWhen: {
      matchesRegEx: {
        pattern: MULTIPLE_EMAILS,
        message: 'Please enter a valid Email.',
      },
    },
  },
  installerFunction: {
    type: 'text',
    label: 'Installer function',
    required: true,
  },
  _stackId: {
    type: 'selectresource',
    label: 'Stack',
    resourceType: 'stacks',
    required: true,
  },
  uninstallerFunction: {
    type: 'text',
    label: 'Uninstaller function',
    required: true,
  },
  updateFunction: {
    type: 'text',
    label: 'Update function',
    required: true,
  },
  applications: {
    type: 'multiselect',
    label: 'Applications',
    valueDelimiter: ',',
    options: [
      {
        items: [
          { label: '3dCart', value: '3dcart' },
          { label: '3PL Central', value: '3plcentral' },
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
          { label: 'Jet', value: 'jet' },
          { label: 'Jira', value: 'jira' },
          { label: 'Jobvite', value: 'jobvite' },
          { label: 'LiquidPlanner', value: 'liquidplanner' },
          { label: 'Loop Returns', value: 'loopreturns' },
          { label: 'Magento 2', value: 'magento' },
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
          // { label: 'Desk', value: 'desk' },
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
