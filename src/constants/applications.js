// Schema details:
// ---------------
// id: Required. Any unique token.
// name: Required. Display name used in UI. (example: app selection list)
// type: Required - maps to connector type (previously called adaptor)
// assistant: Optional - set if App is a variant (Assistant)
// connections: Optional - if application supports multiple connection
//   types, list them. Concur and Constant Contact are examples.
// keyword: any words in combination with the name that will be used for search.
// group: optional. If present used to group connectors together in the UI when
//   listing them.
const connectors = [
  // tech connectors
  {
    id: 'http',
    name: 'HTTP',
    type: 'http',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'rest',
    name: 'REST API',
    type: 'rest',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  { id: 'ftp', name: 'FTP', type: 'ftp', keywords: 'technology,protocol' },
  {
    id: 'webhook',
    name: 'Webhook',
    type: 'webhook',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'wrapper',
    name: 'Wrapper',
    type: 'wrapper',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    type: 'webhook',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'as2',
    name: 'AS2',
    type: 'as2',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  // Database connectors
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'mongodb',
    keywords: 'database,db',
    group: 'db',
  },
  {
    id: 'mssql',
    name: 'Microsoft SQL',
    type: 'mssql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'mysql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'postgresql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  // Application connectors
  { id: '3dcart', name: '3DCart', type: 'http', assistant: '3dcart' },
  { id: 'accelo', name: 'Accelo', type: 'http', assistant: 'accelo' },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    type: 'http',
    assistant: 'activecampaign',
  },
  { id: 'acton', name: 'Act-On', type: 'http', assistant: 'acton' },
  { id: 'acumatica', name: 'Acumatica', type: 'http', assistant: 'acumatica' },
  { id: 'adp', name: 'ADP Workforce Now', type: 'http', assistant: 'adp' },
  // is this supported? no image in CDN..
  // { id: 'allbound', name: 'allbound', type: 'http', assistant: 'allbound' },
  { id: 'amazonaws', name: 'Amazon AWS', type: 'http', assistant: 'amazonaws' },
  { id: 'amazonmws', name: 'Amazon MWS', type: 'http', assistant: 'amazonmws' },
  { id: 'anaplan', name: 'anaplan', type: 'http', assistant: 'anaplan' },
  { id: 'aptrinsic', name: 'Aptrinsic', type: 'http', assistant: 'aptrinsic' },
  { id: 'ariba', name: 'Ariba', type: 'http', assistant: 'ariba' },
  { id: 'asana', name: 'Asana', type: 'http', assistant: 'asana' },
  { id: 'atera', name: 'Atera', type: 'http', assistant: 'atera' },
  {
    id: 'authorize',
    name: 'Authorize.Net',
    type: 'http',
    assistant: 'authorize.net',
  },
  { id: 'autopilot', name: 'Autopilot', type: 'http', assistant: 'autopilot' },
  { id: 'avalara', name: 'Avalara', type: 'http', assistant: 'avalara' },
  {
    id: 'azureactivedirectory',
    name: 'Azure Active Directory',
    type: 'http',
    assistant: 'azureactivedirectory',
  },
  { id: 'bamboohr', name: 'BambooHr', type: 'http', assistant: 'bamboohr' },
  { id: 'banking', name: 'Banking', type: 'http', assistant: 'banking' },
  {
    id: 'bigcommerce',
    name: 'BigCommerce',
    type: 'http',
    assistant: 'bigcommerce',
  },
  // { id: 'bill.com', name: 'bill.com', type: 'http', assistant: 'bill.com' },
  { id: 'box', name: 'Box', type: 'http', assistant: 'box' },
  { id: 'braintree', name: 'Braintree', type: 'http', assistant: 'braintree' },
  { id: 'bronto', name: 'Bronto', type: 'http', assistant: 'bronto' },
  {
    id: 'campaignmonitor',
    name: 'Campaign Monitor',
    type: 'http',
    assistant: 'campaignmonitor',
  },
  { id: 'cardknox', name: 'Cardknox', type: 'http', assistant: 'cardknox' },
  { id: 'cartrover', name: 'CartRover', type: 'http', assistant: 'cartrover' },
  { id: 'certify', name: 'Certify', type: 'http', assistant: 'certify' },
  { id: 'chargebee', name: 'Chargebee', type: 'http', assistant: 'chargebee' },
  { id: 'chargify', name: 'Chargify', type: 'http', assistant: 'chargify' },
  // { id: 'clio', name: 'clio', type: 'http', assistant: 'clio' },
  { id: 'clover', name: 'Clover', type: 'http', assistant: 'clover' },
  { id: 'concur', name: 'Concur', type: 'http', assistant: 'concur' },
  {
    id: 'concurall',
    name: 'Concur',
    type: 'http',
    assistant: 'concurall',
    icon: 'concur',
  },
  {
    id: 'concurv4',
    name: 'Concur',
    type: 'http',
    assistant: 'concurv4',
    icon: 'concur',
  },
  {
    id: 'constantcontactv2',
    name: 'Constant Contact',
    type: 'http',
    assistant: 'constantcontactv2',
    icon: 'constantcontactv3',
  },
  {
    id: 'constantcontactv3',
    name: 'Constant Contact',
    type: 'http',
    assistant: 'constantcontactv3',
    icon: 'constantcontactv3',
  },
  { id: 'coupa', name: 'Coupa', type: 'http', assistant: 'coupa' },
  { id: 'dcl', name: 'Dcl', type: 'http', assistant: 'dcl' },
  { id: 'desk', name: 'Desk', type: 'http', assistant: 'desk' },
  // { id: 'dnb', name: 'dnb', type: 'http', assistant: 'dnb' },
  { id: 'docusign', name: 'DocuSign', type: 'http', assistant: 'docusign' },
  // {
  //   id: 'doubleclick',
  //   name: 'doubleclick',
  //   type: 'http',
  //   assistant: 'doubleclick',
  // },
  { id: 'drift', name: 'Drift', type: 'http', assistant: 'drift' },
  { id: 'dropbox', name: 'Dropbox', type: 'http', assistant: 'dropbox' },
  {
    id: 'dunandbradstreet',
    name: 'Dun & Bradstreet',
    type: 'http',
    assistant: 'dunandbradstreet',
  },
  { id: 'easypost', name: 'EasyPost', type: 'http', assistant: 'easypost' },
  { id: 'easyship', name: 'Easyship', type: 'http', assistant: 'easyship' },
  { id: 'ebay-xml', name: 'eBay(XML)', type: 'http', assistant: 'ebay-xml' },
  { id: 'ebay', name: 'eBay', type: 'http', assistant: 'ebay' },
  // { id: 'eloquent', name: 'eloquent', type: 'http', assistant: 'eloquent' },
  { id: 'etsy', name: 'Etsy', type: 'http', assistant: 'etsy' },
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    type: 'http',
    assistant: 'eventbrite',
  },
  { id: 'exacterp', name: 'Exact ERP', type: 'http', assistant: 'exacterp' },
  { id: 'expensify', name: 'Expensify', type: 'http', assistant: 'expensify' },
  {
    id: 'facebookads',
    name: 'Facebook ads',
    type: 'http',
    assistant: 'facebookads',
  },
  {
    id: 'faire',
    name: 'Faire',
    type: 'http',
    assistant: 'faire',
  },
  {
    id: 'fieldaware',
    name: 'FieldAware',
    type: 'http',
    assistant: 'fieldaware',
  },
  // { id: 'firstdata', name: 'firstdata',
  // type: 'http', assistant: 'firstdata' },
  {
    id: 'freshbooks',
    name: 'FreshBooks',
    type: 'http',
    assistant: 'freshbooks',
  },
  { id: 'freshdesk', name: 'Freshdesk', type: 'http', assistant: 'freshdesk' },
  { id: 'github', name: 'GitHub', type: 'http', assistant: 'github' },
  // { id: 'gooddata', name: 'gooddata', type: 'http', assistant: 'gooddata' },
  { id: 'google', name: 'Google', type: 'http', assistant: 'google' },
  {
    id: 'googleanalytics',
    name: 'Google Analytics',
    type: 'http',
    assistant: 'googleanalytics',
  },
  {
    id: 'googlecontacts',
    name: 'Google Contacts',
    type: 'http',
    assistant: 'googlecontacts',
  },
  // {
  //   id: 'googledrive',
  //   name: 'googledrive',
  //   type: 'http',
  //   assistant: 'googledrive',
  // },
  {
    id: 'googlemail',
    name: 'Googl Email',
    type: 'http',
    assistant: 'googlemail',
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    type: 'http',
    assistant: 'googlesheets',
  },
  {
    id: 'googleshopping',
    name: 'Google Shopping',
    type: 'http',
    assistant: 'googleshopping',
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    type: 'http',
    assistant: 'greenhouse',
  },
  { id: 'grms', name: 'GRMS', type: 'http', assistant: 'grms' },
  // { id: 'gusto', name: 'gusto', type: 'http', assistant: 'gusto' },
  { id: 'harvest', name: 'Harvest', type: 'http', assistant: 'harvest' },
  // { id: 'hoovers', name: 'hoovers', type: 'http', assistant: 'hoovers' },
  { id: 'hubspot', name: 'HubSpot', type: 'http', assistant: 'hubspot' },
  { id: 'insightly', name: 'Insightly', type: 'http', assistant: 'insightly' },
  {
    id: 'integratorio',
    name: 'Integrator.io',
    type: 'http',
    assistant: 'integratorio',
  },
  { id: 'intercom', name: 'Intercom', type: 'http', assistant: 'intercom' },
  { id: 'jet', name: 'Jet', type: 'http', assistant: 'jet' },
  { id: 'jira', name: 'Jira', type: 'http', assistant: 'jira' },
  { id: 'jobvite', name: 'Jobvite', type: 'http', assistant: 'jobvite' },
  { id: 'klaviyo', name: 'Klaviyo', type: 'http', assistant: 'klaviyo' },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    type: 'http',
    assistant: 'lightspeed',
  },
  // { id: 'linkedin', name: 'linkedin', type: 'http', assistant: 'linkedin' },
  {
    id: 'liquidplanner',
    name: 'LiquidPlanner',
    type: 'http',
    assistant: 'liquidplanner',
  },
  { id: 'magento', name: 'Magento', type: 'http', assistant: 'magento' },
  { id: 'mailchimp', name: 'Mailchimp', type: 'http', assistant: 'mailchimp' },
  { id: 'mailgun', name: 'Mailgun', type: 'http', assistant: 'mailgun' },
  { id: 'marketo', name: 'Marketo', type: 'http', assistant: 'marketo' },
  // {
  //   id: 'mediaocean',
  //   name: 'mediaocean',
  //   type: 'http',
  //   assistant: 'mediaocean',
  // },
  {
    id: 'merchantesolutions',
    name: 'Merchant e-Solutions',
    type: 'http',
    assistant: 'merchantesolutions',
  },
  {
    id: 'MessageMedia',
    name: 'MessageMedia',
    type: 'http',
    assistant: 'messagemedia',
  },
  {
    id: 'microsoftbusinesscentral',
    name: 'Microsoft Dynamics 365 Business Central',
    type: 'http',
    assistant: 'microsoftbusinesscentral',
  },
  {
    id: 'microsoftdynamics365',
    name: 'Microsoft Dynamics 365 CRM',
    type: 'http',
    assistant: 'microsoftdynamics365',
  },
  {
    id: 'microsoftoffice365',
    name: 'microsoftoffice365',
    type: 'http',
    assistant: 'microsoftoffice365',
  },
  {
    id: 'microsoftonenote',
    name: 'Microsoft OneNote',
    type: 'http',
    assistant: 'microsoftonenote',
  },
  {
    id: 'microsoftoutlookcalendar',
    name: 'Microsoft Outlook Calendar',
    type: 'http',
    assistant: 'microsoftoutlookcalendar',
  },
  {
    id: 'microsoftoutlookcontacts',
    name: 'Microsoft Outlook Contacts',
    type: 'http',
    assistant: 'microsoftoutlookcontacts',
  },
  {
    id: 'microsoftoutlookmail',
    name: 'Microsoft Outlook Mail',
    type: 'http',
    assistant: 'microsoftoutlookmail',
  },
  { id: 'miva', name: 'Miva', type: 'http', assistant: 'miva' },
  {
    id: 'myobaccountright',
    name: 'MYOB Accountright',
    type: 'http',
    assistant: 'myobaccountright',
  },
  {
    id: 'myobessentials',
    name: 'MYOB Essentials',
    type: 'http',
    assistant: 'myobessentials',
  },
  { id: 'namely', name: 'Namely', type: 'http', assistant: 'namely' },
  { id: 'netsuite', name: 'NetSuite', type: 'netsuite' },
  { id: 'newegg', name: 'Newegg', type: 'http', assistant: 'newegg' },
  { id: 'newrelic', name: 'Newrelic', type: 'http', assistant: 'newrelic' },
  { id: 'nextag', name: 'Nextag', type: 'http', assistant: 'nextag' },
  { id: 'nimble', name: 'Nimble', type: 'http', assistant: 'nimble' },
  {
    id: 'oandaexchangerates',
    name: 'OANDA Exchange Rates',
    type: 'http',
    assistant: 'oandaexchangerates',
  },
  {
    id: 'oandav20fxtrade',
    name: 'OANDA v20 fxTrade',
    type: 'http',
    assistant: 'oandav20fxtrade',
  },
  { id: 'okta', name: 'Okta', type: 'http', assistant: 'okta' },
  { id: 'onelogin', name: 'OneLogin', type: 'http', assistant: 'onelogin' },
  { id: 'openair', name: 'OpenAir', type: 'http', assistant: 'openair' },
  { id: 'osn', name: 'Osn', type: 'http', assistant: 'osn' },
  { id: 'other', name: 'Other', type: 'http', assistant: 'other' },
  { id: 'outreach', name: 'Outreach', type: 'http', assistant: 'outreach' },
  { id: 'pacejet', name: 'Pacejet', type: 'http', assistant: 'pacejet' },
  { id: 'parseur', name: 'Parseur', type: 'http', assistant: 'parseur' },
  { id: 'paychex', name: 'Paychex', type: 'http', assistant: 'paychex' },
  { id: 'paycor', name: 'Paycor', type: 'http', assistant: 'paycor' },
  // { id: 'paylocity', name: 'paylocity',
  // type: 'http', assistant: 'paylocity' },
  { id: 'paypal', name: 'Paypal', type: 'http', assistant: 'paypal' },
  { id: 'pdffiller', name: 'PDFfiller', type: 'http', assistant: 'pdffiller' },
  {
    id: 'pitneybowes',
    name: 'Pitney Bowes',
    type: 'http',
    assistant: 'pitneybowes',
  },
  { id: 'postmark', name: 'Postmark', type: 'http', assistant: 'postmark' },
  { id: 'powerbi', name: 'Power BI', type: 'http', assistant: 'powerbi' },
  {
    id: 'practicepanther',
    name: 'Practice Panther',
    type: 'http',
    assistant: 'practicepanther',
  },
  { id: 'procurify', name: 'Procurify', type: 'http', assistant: 'procurify' },
  { id: 'propack', name: 'Propack (P3PL)', type: 'http', assistant: 'propack' },
  { id: 'pulseway', name: 'Pulseway', type: 'http', assistant: 'pulseway' },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'http',
    assistant: 'quickbooks',
  },
  { id: 'quip', name: 'Quip', type: 'http', assistant: 'quip' },
  {
    id: 'ramplogistics',
    name: 'Ramp Logistics',
    type: 'http',
    assistant: 'ramplogistics',
  },
  { id: 'recharge', name: 'ReCharge', type: 'http', assistant: 'recharge' },
  { id: 'recurly', name: 'Recurly', type: 'http', assistant: 'recurly' },
  // { id: 'replicon', name: 'replicon', type: 'http', assistant: 'replicon' },
  { id: 'retailops', name: 'RetailOps', type: 'http', assistant: 'retailops' },
  { id: 'returnly', name: 'Returnly', type: 'http', assistant: 'returnly' },
  { id: 's3', name: 'Amazon S3', type: 's3' },
  { id: 'sageone', name: 'Sage One', type: 'http', assistant: 'sageone' },
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'salesforce',
  },
  // { id: 'segment', name: 'segment', type: 'http', assistant: 'segment' },
  {
    id: 'servicenow',
    name: 'Service Now',
    type: 'http',
    assistant: 'servicenow',
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    type: 'http',
    assistant: 'sharepoint',
  },
  { id: 'shiphawk', name: 'ShipHawk', type: 'http', assistant: 'shiphawk' },
  { id: 'shippo', name: 'Shippo', type: 'http', assistant: 'shippo' },
  {
    id: 'shipstation',
    name: 'ShipStation',
    type: 'http',
    assistant: 'shipstation',
  },
  { id: 'shipwire', name: 'Shipwire', type: 'http', assistant: 'shipwire' },
  { id: 'shopify', name: 'Shopify', type: 'http', assistant: 'shopify' },
  { id: 'signnow', name: 'SignNow', type: 'http', assistant: 'signnow' },
  { id: 'skubana', name: 'Skubana', type: 'http', assistant: 'skubana' },
  { id: 'skuvault', name: 'Skuvault', type: 'http', assistant: 'skuvault' },
  { id: 'slack', name: 'Slack', type: 'http', assistant: 'slack' },
  {
    id: 'smartsheet',
    name: 'Smartsheet',
    type: 'http',
    assistant: 'smartsheet',
  },
  {
    id: 'snapfulfil',
    name: 'Snapfulfil',
    type: 'http',
    assistant: 'snapfulfil',
  },
  {
    id: 'solidcommerce',
    name: 'Solid Commerce',
    type: 'http',
    assistant: 'solidcommerce',
  },
  { id: 'splunk', name: 'Splunk', type: 'http', assistant: 'splunk' },
  {
    id: 'spreecommerce',
    name: 'Spree Commerce',
    type: 'http',
    assistant: 'spreecommerce',
  },
  { id: 'squareup', name: 'Square', type: 'http', assistant: 'squareup' },
  {
    id: 'steelbrick',
    name: 'Steelbrick',
    type: 'http',
    assistant: 'steelbrick',
  },
  { id: 'strata', name: 'Strata', type: 'http', assistant: 'strata' },
  { id: 'stripe', name: 'Stripe', type: 'http', assistant: 'stripe' },
  { id: 'sugarcrm', name: 'SugarCRM', type: 'http', assistant: 'sugarcrm' },
  {
    id: 'surveymonkey',
    name: 'SurveyMonkey',
    type: 'http',
    assistant: 'surveymonkey',
  },
  { id: 'svb', name: 'Svb', type: 'http', assistant: 'svb' },
  { id: 'tableau', name: 'Tableau', type: 'http', assistant: 'tableau' },
  { id: 'taxjar', name: 'TaxJar', type: 'http', assistant: 'taxjar' },
  { id: 'tesco', name: 'Tesco', type: 'http', assistant: 'tesco' },
  { id: 'tophatter', name: 'Tophatter', type: 'http', assistant: 'tophatter' },
  { id: 'travis', name: 'Travis', type: 'http', assistant: 'travis' },
  { id: 'trinet', name: 'Trinet', type: 'http', assistant: 'trinet' },
  { id: 'tsheets', name: 'TSheets', type: 'http', assistant: 'tsheets' },
  { id: 'twilio', name: 'Twilio', type: 'http', assistant: 'twilio' },
  { id: 'vend', name: 'Vend', type: 'http', assistant: 'vend' },
  { id: 'walmart', name: 'Walmart', type: 'http', assistant: 'walmart' },
  { id: 'ware2go', name: 'Ware2Go', type: 'http', assistant: 'ware2go' },
  { id: 'wiser', name: 'Wiser', type: 'http', assistant: 'wiser' },
  { id: 'wish', name: 'Wish', type: 'http', assistant: 'wish' },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    type: 'http',
    assistant: 'woocommerce',
  },
  { id: 'wrike', name: 'Wrike', type: 'http', assistant: 'wrike' },
  { id: 'xcart', name: 'X-Cart', type: 'http', assistant: 'xcart' },
  { id: 'yahoo', name: 'Yahoo', type: 'http', assistant: 'yahoo' },
  { id: 'yammer', name: 'Yammer', type: 'http', assistant: 'yammer' },
  { id: 'zendesk', name: 'Zendesk', type: 'http', assistant: 'zendesk' },
  { id: 'zimbra', name: 'Zimbra', type: 'http', assistant: 'zimbra' },
  { id: 'zoho', name: 'Zoho', type: 'http', assistant: 'zoho' },
  { id: 'zohobooks', name: 'Zoho Books', type: 'http', assistant: 'zohobooks' },
  { id: 'zohocrm', name: 'Zoho CRM', type: 'http', assistant: 'zohocrm' },
  { id: 'zohodesk', name: 'Zoho Desk', type: 'http', assistant: 'zohodesk' },
  { id: 'zohomail', name: 'Zoho Mail', type: 'http', assistant: 'zohomail' },
  { id: 'zoom', name: 'Zoom', type: 'http', assistant: 'zoom' },
  { id: 'zuora', name: 'Zuora', type: 'http', assistant: 'zuora' },
];

export const groupApplications = () => [
  {
    label: 'Databases',
    connectors: connectors.filter(c => c.group === 'db'),
  },
  {
    label: 'Generic tech connectors',
    connectors: connectors.filter(c => c.group === 'tech'),
  },
  {
    label: 'Connectors',
    connectors: connectors.filter(c => !c.group),
  },
];

export const getApp = (type, assistant) => {
  const id = assistant || type;

  return connectors.find(c => c.id === id) || {};
};

export const getApplicationConnectors = () =>
  connectors.filter(conn => !!conn.assistant);

export default connectors;
