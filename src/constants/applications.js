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
  {
    id: 'ftp',
    name: 'FTP',
    type: 'ftp',
    keywords: 'sftp,ftps,technology,protocol',
    group: 'tech',
  },
  {
    id: 'wrapper',
    name: 'Wrapper',
    type: 'wrapper',
    keywords: 'technology',
    group: 'tech',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    type: 'webhook',
    keywords: 'technology, realtime',
    group: 'tech',
    webhookOnly: true,
  },
  {
    id: 'travis-org',
    type: 'webhook',
    name: 'Travis Org',
    webhookOnly: true,
  },
  {
    id: 'helpscout',
    type: 'webhook',
    name: 'Help Scout',
    webhookOnly: true,
  },
  {
    id: 'errorception',
    type: 'webhook',
    name: 'Errorception',
    webhookOnly: true,
  },
  {
    id: 'aha',
    type: 'webhook',
    name: 'Aha!',
    webhookOnly: true,
  },
  {
    id: 'pagerduty',
    type: 'webhook',
    name: 'PagerDuty',
    webhookOnly: true,
  },
  {
    id: 'surveymonkey',
    type: 'webhook',
    name: 'SurveyMonkey',
    webhookOnly: true,
  },
  {
    id: 'mailparser-io',
    type: 'webhook',
    name: 'Mailparser',
    webhookOnly: true,
  },
  {
    id: 'integrator-extension',
    type: 'webhook',
    name: 'integrator.io extension',
    icon: 'integratorio',
    webhookOnly: true,
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
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    type: 'dynamodb',
    keywords: 'database,db',
    group: 'db',
  },
  // Application connectors
  { id: '3dcart', name: '3DCart', type: 'rest', assistant: '3dcart' },
  {
    id: '3plcentral',
    name: '3PL Central',
    type: 'http',
    assistant: '3plcentral',
  },
  { id: 'vroozi', name: 'Vroozi', type: 'http', assistant: 'vroozi' },
  { id: 'accelo', name: 'Accelo', type: 'rest', assistant: 'accelo' },
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    type: 'http',
    assistant: 'activecampaign',
    webhook: true,
  },
  { id: 'acton', name: 'Act-On', type: 'rest', assistant: 'acton' },
  { id: 'acumatica', name: 'Acumatica', type: 'rest', assistant: 'acumatica' },
  { id: 'adp', name: 'ADP Workforce Now', type: 'http', assistant: 'adp' },
  // is this supported? no image in CDN..
  // { id: 'allbound', name: 'allbound', type: 'http', assistant: 'allbound' },
  { id: 'amazonaws', name: 'Amazon AWS', type: 'http', assistant: 'amazonaws' },
  { id: 'amazonmws', name: 'Amazon MWS', type: 'http', assistant: 'amazonmws' },
  { id: 'anaplan', name: 'Anaplan', type: 'http', assistant: 'anaplan' },
  { id: 'aptrinsic', name: 'Aptrinsic', type: 'rest', assistant: 'aptrinsic' },
  { id: 'ariba', name: 'Ariba', type: 'http', assistant: 'ariba' },
  { id: 'asana', name: 'Asana', type: 'rest', assistant: 'asana' },
  {
    id: '4castplus',
    name: '4CastPlus',
    type: 'http',
    assistant: '4castplus',
  },
  { id: 'atera', name: 'Atera', type: 'rest', assistant: 'atera' },
  {
    id: 'authorize.net',
    name: 'Authorize.Net',
    type: 'http',
    assistant: 'authorize.net',
  },
  { id: 'autopilot', name: 'Autopilot', type: 'http', assistant: 'autopilot' },
  { id: 'avalara', name: 'Avalara', type: 'rest', assistant: 'avalara' },
  { id: 'shipbob', name: 'ShipBob', type: 'http', assistant: 'shipbob' },
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
    type: 'rest',
    assistant: 'bigcommerce',
  },
  // { id: 'bill.com', name: 'bill.com', type: 'http', assistant: 'bill.com' },
  { id: 'box', name: 'Box', type: 'http', assistant: 'box', webhook: true },
  // { id: 'braintree', name: 'Braintree', type: 'http', assistant: 'braintree' },
  { id: 'bronto', name: 'Bronto', type: 'rest', assistant: 'bronto' },
  {
    id: 'campaignmonitor',
    name: 'Campaign Monitor',
    type: 'rest',
    assistant: 'campaignmonitor',
  },
  // { id: 'cardknox', name: 'Cardknox', type: 'http', assistant: 'cardknox' },
  { id: 'cartrover', name: 'CartRover', type: 'http', assistant: 'cartrover' },
  { id: 'certify', name: 'Certify', type: 'rest', assistant: 'certify' },
  { id: 'chargebee', name: 'Chargebee', type: 'rest', assistant: 'chargebee' },
  { id: 'chargify', name: 'Chargify', type: 'rest', assistant: 'chargify' },
  // { id: 'clio', name: 'clio', type: 'http', assistant: 'clio' },
  { id: 'clover', name: 'Clover', type: 'http', assistant: 'clover' },
  // { id: 'concur', name: 'Concur', type: 'rest', assistant: 'concur' },
  // {
  //   id: 'concurall',
  //   name: 'Concur',
  //   type: 'rest',
  //   assistant: 'concurall',
  //   icon: 'concur',
  // },
  // {
  //   id: 'concurv4',
  //   name: 'Concur',
  //   type: 'rest',
  //   assistant: 'concurv4',
  //   icon: 'concur',
  // },
  {
    id: 'constantcontactv2',
    name: 'Constant Contact V2',
    type: 'rest',
    assistant: 'constantcontactv2',
    icon: 'constantcontactv3',
  },
  {
    id: 'constantcontactv3',
    name: 'Constant Contact V3',
    type: 'rest',
    assistant: 'constantcontactv3',
    icon: 'constantcontactv3',
  },
  { id: 'coupa', name: 'Coupa', type: 'rest', assistant: 'coupa' },
  { id: 'dcl', name: 'Dcl', type: 'http', assistant: 'dcl' },
  // { id: 'desk', name: 'Desk', type: 'rest', assistant: 'desk' },
  // { id: 'dnb', name: 'dnb', type: 'http', assistant: 'dnb' },
  { id: 'docusign', name: 'DocuSign', type: 'rest', assistant: 'docusign' },
  // {
  //   id: 'doubleclick',
  //   name: 'doubleclick',
  //   type: 'http',
  //   assistant: 'doubleclick',
  // },
  { id: 'drift', name: 'Drift', type: 'http', assistant: 'drift' },
  {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'rest',
    assistant: 'dropbox',
    webhook: true,
  },
  {
    id: 'dunandbradstreet',
    name: 'Dun & Bradstreet',
    type: 'rest',
    assistant: 'dunandbradstreet',
  },
  { id: 'easypost', name: 'EasyPost', type: 'rest', assistant: 'easypost' },
  { id: 'easyship', name: 'Easyship', type: 'http', assistant: 'easyship' },
  { id: 'ebay-xml', name: 'eBay(XML)', type: 'http', assistant: 'ebay-xml' },
  { id: 'ebay', name: 'eBay', type: 'rest', assistant: 'ebay' },
  // { id: 'eloquent', name: 'eloquent', type: 'http', assistant: 'eloquent' },
  { id: 'etsy', name: 'Etsy', type: 'http', assistant: 'etsy' },
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    type: 'rest',
    assistant: 'eventbrite',
  },
  { id: 'exacterp', name: 'Exact ERP', type: 'rest', assistant: 'exacterp' },
  { id: 'expensify', name: 'Expensify', type: 'rest', assistant: 'expensify' },
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
    type: 'rest',
    assistant: 'fieldaware',
  },
  // { id: 'firstdata', name: 'firstdata',
  // type: 'http', assistant: 'firstdata' },
  {
    id: 'freshbooks',
    name: 'FreshBooks',
    type: 'rest',
    assistant: 'freshbooks',
  },
  { id: 'freshdesk', name: 'Freshdesk', type: 'rest', assistant: 'freshdesk' },
  {
    id: 'github',
    name: 'GitHub',
    type: 'rest',
    assistant: 'github',
    webhook: true,
  },
  // { id: 'gooddata', name: 'gooddata', type: 'http', assistant: 'gooddata' },
  // { id: 'google', name: 'Google', type: 'http', assistant: 'google' },
  {
    id: 'googleanalytics',
    name: 'Google Analytics',
    type: 'rest',
    assistant: 'googleanalytics',
  },
  {
    id: 'googlecontacts',
    name: 'Google Contacts',
    type: 'rest',
    assistant: 'googlecontacts',
  },
  // {
  //   id: 'googledrive',
  //   name: 'googledrive',
  //   type: 'rest',
  //   assistant: 'googledrive',
  // },
  // {
  // id: 'googlemail',
  //   name: 'Googl Email',
  // type: 'rest',
  // assistant: 'googlemail',
  // },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    type: 'rest',
    assistant: 'googlesheets',
  },
  {
    id: 'googleshopping',
    name: 'Google Shopping',
    type: 'rest',
    assistant: 'googleshopping',
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    type: 'rest',
    assistant: 'greenhouse',
  },
  { id: 'grms', name: 'GRMS', type: 'rest', assistant: 'grms' },
  // { id: 'gusto', name: 'gusto', type: 'http', assistant: 'gusto' },
  { id: 'harvest', name: 'Harvest', type: 'rest', assistant: 'harvest' },
  // { id: 'hoovers', name: 'hoovers', type: 'http', assistant: 'hoovers' },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'rest',
    assistant: 'hubspot',
    webhook: true,
  },
  { id: 'insightly', name: 'Insightly', type: 'rest', assistant: 'insightly' },
  {
    id: 'integratorio',
    name: 'integrator.io',
    type: 'rest',
    assistant: 'integratorio',
  },
  // {
  //  id: 'intercom',
  //  name: 'Intercom',
  // type: 'http',
  //  assistant: 'intercom',
  //  webhook: true,
  // },
  { id: 'jet', name: 'Jet', type: 'rest', assistant: 'jet' },
  { id: 'jira', name: 'Jira', type: 'rest', assistant: 'jira', webhook: true },
  { id: 'jobvite', name: 'Jobvite', type: 'rest', assistant: 'jobvite' },
  { id: 'klaviyo', name: 'Klaviyo', type: 'rest', assistant: 'klaviyo' },
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    type: 'rest',
    assistant: 'lightspeed',
  },
  // { id: 'linkedin', name: 'linkedin', type: 'http', assistant: 'linkedin' },
  {
    id: 'liquidplanner',
    name: 'LiquidPlanner',
    type: 'rest',
    assistant: 'liquidplanner',
  },
  { id: 'magento', name: 'Magento 2', type: 'rest', assistant: 'magento' },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    type: 'rest',
    assistant: 'mailchimp',
    webhook: true,
  },
  { id: 'mailgun', name: 'Mailgun', type: 'rest', assistant: 'mailgun' },
  { id: 'marketo', name: 'Marketo', type: 'rest', assistant: 'marketo' },
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
    id: 'messagemedia',
    name: 'MessageMedia',
    type: 'http',
    assistant: 'messagemedia',
  },
  {
    id: 'microsoftbusinesscentral',
    name: 'Microsoft Dynamics 365 Business Central',
    type: 'rest',
    assistant: 'microsoftbusinesscentral',
  },
  {
    id: 'microsoftdynamics365',
    name: 'Microsoft Dynamics 365 CRM',
    type: 'rest',
    assistant: 'microsoftdynamics365',
  },
  {
    id: 'microsoftoffice365',
    name: 'Microsoft Office 365',
    type: 'http',
    assistant: 'microsoftoffice365',
  },
  {
    id: 'microsoftonenote',
    name: 'Microsoft OneNote',
    type: 'rest',
    assistant: 'microsoftonenote',
  },
  {
    id: 'microsoftoutlookcalendar',
    name: 'Microsoft Outlook Calendar',
    type: 'rest',
    assistant: 'microsoftoutlookcalendar',
  },
  {
    id: 'microsoftoutlookcontacts',
    name: 'Microsoft Outlook Contacts',
    type: 'rest',
    assistant: 'microsoftoutlookcontacts',
  },
  {
    id: 'microsoftoutlookmail',
    name: 'Microsoft Outlook Mail',
    type: 'rest',
    assistant: 'microsoftoutlookmail',
  },
  { id: 'miva', name: 'Miva', type: 'rest', assistant: 'miva' },
  {
    id: 'myobaccountright',
    name: 'MYOB Accountright',
    type: 'http',
    assistant: 'myobaccountright',
  },
  {
    id: 'myobessentials',
    name: 'MYOB Essentials',
    type: 'rest',
    assistant: 'myobessentials',
  },
  { id: 'namely', name: 'Namely', type: 'rest', assistant: 'namely' },
  { id: 'netsuite', name: 'NetSuite', type: 'netsuite' },
  { id: 'newegg', name: 'Newegg', type: 'http', assistant: 'newegg' },
  { id: 'newrelic', name: 'Newrelic', type: 'rest', assistant: 'newrelic' },
  { id: 'nextag', name: 'Nextag', type: 'http', assistant: 'nextag' },
  // { id: 'nimble', name: 'Nimble', type: 'http', assistant: 'nimble' },
  {
    id: 'oandaexchangerates',
    name: 'OANDA Exchange Rates',
    type: 'rest',
    assistant: 'oandaexchangerates',
  },
  {
    id: 'oandav20fxtrade',
    name: 'OANDA v20 fxTrade',
    type: 'rest',
    assistant: 'oandav20fxtrade',
  },
  { id: 'okta', name: 'Okta', type: 'http', assistant: 'okta' },
  { id: 'onelogin', name: 'OneLogin', type: 'http', assistant: 'onelogin' },
  { id: 'openair', name: 'OpenAir', type: 'http', assistant: 'openair' },
  { id: 'osn', name: 'Osn', type: 'http', assistant: 'osn' },
  { id: 'other', name: 'Other', type: 'http', assistant: 'other' },
  { id: 'outreach', name: 'Outreach', type: 'http', assistant: 'outreach' },
  { id: 'pacejet', name: 'Pacejet', type: 'http', assistant: 'pacejet' },
  {
    id: 'parseur',
    name: 'Parseur',
    type: 'rest',
    assistant: 'parseur',
    webhook: true,
  },
  { id: 'paychex', name: 'Paychex', type: 'http', assistant: 'paychex' },
  { id: 'paycor', name: 'Paycor', type: 'http', assistant: 'paycor' },
  // { id: 'paylocity', name: 'paylocity',
  // type: 'http', assistant: 'paylocity' },
  { id: 'paypal', name: 'Paypal', type: 'http', assistant: 'paypal' },
  { id: 'pdffiller', name: 'PDFfiller', type: 'rest', assistant: 'pdffiller' },
  {
    id: 'pitneybowes',
    name: 'Pitney Bowes',
    type: 'rest',
    assistant: 'pitneybowes',
  },
  {
    id: 'postmark',
    name: 'Postmark',
    type: 'rest',
    assistant: 'postmark',
    webhook: true,
  },
  { id: 'powerbi', name: 'Power BI', type: 'rest', assistant: 'powerbi' },
  {
    id: 'practicepanther',
    name: 'Practice Panther',
    type: 'http',
    assistant: 'practicepanther',
  },
  { id: 'procurify', name: 'Procurify', type: 'rest', assistant: 'procurify' },
  { id: 'propack', name: 'Propack (P3PL)', type: 'http', assistant: 'propack' },
  { id: 'pulseway', name: 'Pulseway', type: 'rest', assistant: 'pulseway' },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    type: 'http',
    assistant: 'quickbooks',
  },
  { id: 'quip', name: 'Quip', type: 'rest', assistant: 'quip' },
  {
    id: 'ramplogistics',
    name: 'Ramp Logistics',
    type: 'http',
    assistant: 'ramplogistics',
  },
  { id: 'recharge', name: 'ReCharge', type: 'http', assistant: 'recharge' },
  {
    id: 'recurly',
    name: 'Recurly',
    type: 'http',
    assistant: 'recurly',
    webhook: true,
  },
  // { id: 'replicon', name: 'replicon', type: 'http', assistant: 'replicon' },
  { id: 'retailops', name: 'RetailOps', type: 'rest', assistant: 'retailops' },
  { id: 'returnly', name: 'Returnly', type: 'rest', assistant: 'returnly' },
  { id: 's3', name: 'Amazon S3', type: 's3' },
  { id: 'sageone', name: 'Sage One', type: 'rest', assistant: 'sageone' },
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'salesforce',
  },
  // { id: 'segment', name: 'segment', type: 'http', assistant: 'segment', webhook: true },
  {
    id: 'servicenow',
    name: 'Service Now',
    type: 'rest',
    assistant: 'servicenow',
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    type: 'rest',
    assistant: 'sharepoint',
  },
  { id: 'shiphawk', name: 'ShipHawk', type: 'rest', assistant: 'shiphawk' },
  { id: 'shippo', name: 'Shippo', type: 'rest', assistant: 'shippo' },
  {
    id: 'shipstation',
    name: 'ShipStation',
    type: 'rest',
    assistant: 'shipstation',
  },
  {
    id: 'shipwire',
    name: 'Shipwire',
    type: 'rest',
    assistant: 'shipwire',
    webhook: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    type: 'rest',
    assistant: 'shopify',
    webhook: true,
  },
  // { id: 'signnow', name: 'SignNow', type: 'http', assistant: 'signnow' },
  { id: 'skubana', name: 'Skubana', type: 'rest', assistant: 'skubana' },
  { id: 'skuvault', name: 'Skuvault', type: 'http', assistant: 'skuvault' },
  {
    id: 'slack',
    name: 'Slack',
    type: 'rest',
    assistant: 'slack',
    webhook: true,
  },
  {
    id: 'smartsheet',
    name: 'Smartsheet',
    type: 'rest',
    assistant: 'smartsheet',
  },
  {
    id: 'snapfulfil',
    name: 'Snapfulfil',
    type: 'rest',
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
    type: 'rest',
    assistant: 'spreecommerce',
  },
  { id: 'squareup', name: 'Square', type: 'rest', assistant: 'squareup' },
  // {
  //   id: 'steelbrick',
  //   name: 'Steelbrick',
  //   type: 'http',
  //   assistant: 'steelbrick',
  // },
  { id: 'strata', name: 'Strata', type: 'rest', assistant: 'strata' },
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'rest',
    assistant: 'stripe',
    webhook: true,
  },
  { id: 'sugarcrm', name: 'SugarCRM', type: 'rest', assistant: 'sugarcrm' },
  // {
  // id: 'surveymonkey',
  // name: 'SurveyMonkey',
  // type: 'rest',
  // assistant: 'surveymonkey',
  // webhook: true,
  // },
  { id: 'svb', name: 'Svb', type: 'http', assistant: 'svb' },
  { id: 'tableau', name: 'Tableau', type: 'rest', assistant: 'tableau' },
  { id: 'target', name: 'Target', type: 'http', assistant: 'target' },
  { id: 'taxjar', name: 'TaxJar', type: 'rest', assistant: 'taxjar' },
  { id: 'tesco', name: 'Tesco', type: 'rest', assistant: 'tesco' },
  { id: 'tophatter', name: 'Tophatter', type: 'rest', assistant: 'tophatter' },
  {
    id: 'travis',
    name: 'Travis',
    type: 'http',
    assistant: 'travis',
    webhook: true,
  },
  { id: 'trinet', name: 'Trinet', type: 'http', assistant: 'trinet' },
  { id: 'tsheets', name: 'TSheets', type: 'http', assistant: 'tsheets' },
  { id: 'twilio', name: 'Twilio', type: 'rest', assistant: 'twilio' },
  { id: 'vend', name: 'Vend', type: 'http', assistant: 'vend' },
  { id: 'walmart', name: 'Walmart', type: 'http', assistant: 'walmart' },
  { id: 'ware2go', name: 'Ware2Go', type: 'http', assistant: 'ware2go' },
  { id: 'wiser', name: 'Wiser', type: 'http', assistant: 'wiser' },
  { id: 'wish', name: 'Wish', type: 'rest', assistant: 'wish' },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    type: 'rest',
    assistant: 'woocommerce',
  },
  { id: 'wrike', name: 'Wrike', type: 'http', assistant: 'wrike' },
  // { id: 'xcart', name: 'X-Cart', type: 'http', assistant: 'xcart' },
  // { id: 'yahoo', name: 'Yahoo', type: 'http', assistant: 'yahoo' },
  // { id: 'yammer', name: 'Yammer', type: 'rest', assistant: 'yammer' },
  { id: 'zendesk', name: 'Zendesk', type: 'rest', assistant: 'zendesk' },
  { id: 'zimbra', name: 'Zimbra', type: 'http', assistant: 'zimbra' },
  // { id: 'zoho', name: 'Zoho', type: 'http', assistant: 'zoho' },
  { id: 'zohobooks', name: 'Zoho Books', type: 'rest', assistant: 'zohobooks' },
  { id: 'zohocrm', name: 'Zoho CRM', type: 'rest', assistant: 'zohocrm' },
  { id: 'zohodesk', name: 'Zoho Desk', type: 'rest', assistant: 'zohodesk' },
  { id: 'zohomail', name: 'Zoho Mail', type: 'rest', assistant: 'zohomail' },
  { id: 'zoom', name: 'Zoom', type: 'http', assistant: 'zoom' },
  { id: 'zuora', name: 'Zuora', type: 'rest', assistant: 'zuora' },
];

export const groupApplications = (
  resourceType,
  { assistants, appType, isSimpleImport }
) => {
  const filteredConnectors = connectors.filter(connector => {
    if (connector.assistant && assistants && resourceType !== 'connections') {
      let assistant = assistants.http.applications.find(
        a => a._id === connector.assistant
      );

      if (assistant) {
        if (appType === 'import') {
          return assistant.import;
        } else if (appType === 'export') {
          return assistant.export;
        }

        return true;
      }

      assistant = assistants.rest.applications.find(
        a => a._id === connector.assistant
      );

      if (assistant) {
        if (appType === 'import') {
          return assistant.import;
        } else if (appType === 'export') {
          return assistant.export;
        }

        return true;
      }

      return false;
    }

    // Do not show FTP import for DataLoader flows
    if (
      resourceType === 'pageProcessor' &&
      appType === 'import' &&
      isSimpleImport
    ) {
      return connector.id !== 'ftp' && !connector.webhookOnly;
    }

    // Webhooks are shown only for exports and for page generators in flow context
    if (resourceType && !['exports', 'pageGenerator'].includes(resourceType)) {
      // for pageProcessor lookups even ftps are not shown
      if (resourceType === 'pageProcessor' && appType === 'export') {
        return connector.id !== 'ftp' && !connector.webhookOnly;
      }

      // all other resource types handled here
      return !connector.webhookOnly;
    }

    return true;
  });

  return [
    {
      label: 'Databases',
      connectors: filteredConnectors.filter(c => c.group === 'db'),
    },
    {
      label: 'Universal connectors',
      connectors: filteredConnectors.filter(c => c.group === 'tech'),
    },
    {
      label: 'Connectors',
      connectors: filteredConnectors.filter(c => !c.group),
    },
  ];
};
/* MISSING WEBHOOK PROVIDERS
  'travis-org',
  'helpscout', 
  'errorception',
  'aha', 
  'pagerduty', 
  'surveymonkey', 
  'mailparser-io', 
  'integrator-extension', 
*/

export const getApplicationConnectors = () => connectors.filter(c => !c.group);
export const getWebhookConnectors = () => connectors.filter(c => !!c.webhook);
export const getWebhookOnlyConnectors = () =>
  connectors.filter(c => !!c.webhookOnly);

export const getApp = (type, assistant) => {
  const id = assistant || type;

  return connectors.find(c => c.id === id) || {};
};

export default connectors;
