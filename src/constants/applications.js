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
    name: 'mssql',
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
    name: 'postgresql',
    type: 'postgresql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  // Application connectors
  { id: '3dcart', name: '3D Cart', type: 'rest', assistant: '3dcart' },
  { id: 'accelo', name: 'Accelo', type: 'rest', assistant: 'accelo' },
  {
    id: 'activecampaign',
    name: 'activecampaign',
    type: 'http',
    assistant: 'activecampaign',
  },
  { id: 'acton', name: 'acton', type: 'rest', assistant: 'acton' },
  { id: 'acumatica', name: 'acumatica', type: 'rest', assistant: 'acumatica' },
  { id: 'adp', name: 'adp', type: 'http', assistant: 'adp' },
  // is this supported? no image in CDN..
  // { id: 'allbound', name: 'allbound', type: 'http', assistant: 'allbound' },
  { id: 'amazonaws', name: 'Amazon AWS', type: 'http', assistant: 'amazonaws' },
  { id: 'amazonmws', name: 'amazonmws', type: 'http', assistant: 'amazonmws' },
  // { id: 'anaplan', name: 'anaplan', type: 'http', assistant: 'anaplan' },
  { id: 'aptrinsic', name: 'aptrinsic', type: 'rest', assistant: 'aptrinsic' },
  { id: 'ariba', name: 'ariba', type: 'http', assistant: 'ariba' },
  { id: 'asana', name: 'asana', type: 'rest', assistant: 'asana' },
  { id: 'atera', name: 'atera', type: 'rest', assistant: 'atera' },
  {
    id: 'authorize',
    name: 'authorize.net',
    type: 'http',
    assistant: 'authorize.net',
  },
  { id: 'autopilot', name: 'autopilot', type: 'http', assistant: 'autopilot' },
  { id: 'avalara', name: 'avalara', type: 'rest', assistant: 'avalara' },
  {
    id: 'azureactivedirectory',
    name: 'azureactivedirectory',
    type: 'http',
    assistant: 'azureactivedirectory',
  },
  { id: 'bamboohr', name: 'bamboohr', type: 'http', assistant: 'bamboohr' },
  { id: 'banking', name: 'banking', type: 'http', assistant: 'banking' },
  {
    id: 'bigcommerce',
    name: 'bigcommerce',
    type: 'rest',
    assistant: 'bigcommerce',
  },
  // { id: 'bill.com', name: 'bill.com', type: 'http', assistant: 'bill.com' },
  { id: 'box', name: 'box', type: 'rest', assistant: 'box' },
  { id: 'braintree', name: 'braintree', type: 'http', assistant: 'braintree' },
  { id: 'bronto', name: 'bronto', type: 'rest', assistant: 'bronto' },
  {
    id: 'campaignmonitor',
    name: 'campaignmonitor',
    type: 'rest',
    assistant: 'campaignmonitor',
  },
  { id: 'cardknox', name: 'cardknox', type: 'http', assistant: 'cardknox' },
  { id: 'cartrover', name: 'cartrover', type: 'http', assistant: 'cartrover' },
  { id: 'certify', name: 'certify', type: 'rest', assistant: 'certify' },
  { id: 'chargebee', name: 'chargebee', type: 'rest', assistant: 'chargebee' },
  { id: 'chargify', name: 'chargify', type: 'rest', assistant: 'chargify' },
  // { id: 'clio', name: 'clio', type: 'http', assistant: 'clio' },
  { id: 'clover', name: 'clover', type: 'http', assistant: 'clover' },
  { id: 'concur', name: 'concur', type: 'rest', assistant: 'concur' },
  {
    id: 'concurall',
    name: 'concur',
    type: 'rest',
    assistant: 'concurall',
    icon: 'concur',
  },
  {
    id: 'concurv4',
    name: 'concur',
    type: 'rest',
    assistant: 'concurv4',
    icon: 'concur',
  },
  {
    id: 'constantcontactv2',
    name: 'constantcontactv2',
    type: 'rest',
    assistant: 'constantcontactv2',
    icon: 'constantcontactv3',
  },
  {
    id: 'constantcontactv3',
    name: 'constantcontactv3',
    type: 'rest',
    assistant: 'constantcontactv3',
    icon: 'constantcontactv3',
  },
  { id: 'coupa', name: 'coupa', type: 'rest', assistant: 'coupa' },
  { id: 'dcl', name: 'dcl', type: 'http', assistant: 'dcl' },
  { id: 'desk', name: 'desk', type: 'rest', assistant: 'desk' },
  // { id: 'dnb', name: 'dnb', type: 'http', assistant: 'dnb' },
  { id: 'docusign', name: 'docusign', type: 'rest', assistant: 'docusign' },
  // {
  //   id: 'doubleclick',
  //   name: 'doubleclick',
  //   type: 'http',
  //   assistant: 'doubleclick',
  // },
  { id: 'drift', name: 'drift', type: 'http', assistant: 'drift' },
  { id: 'dropbox', name: 'dropbox', type: 'rest', assistant: 'dropbox' },
  {
    id: 'dunandbradstreet',
    name: 'dunandbradstreet',
    type: 'rest',
    assistant: 'dunandbradstreet',
  },
  { id: 'easypost', name: 'easypost', type: 'rest', assistant: 'easypost' },
  { id: 'easyship', name: 'easyship', type: 'http', assistant: 'easyship' },
  { id: 'ebay-xml', name: 'ebay-xml', type: 'http', assistant: 'ebay-xml' },
  { id: 'ebay', name: 'ebay', type: 'rest', assistant: 'ebay' },
  // { id: 'eloquent', name: 'eloquent', type: 'http', assistant: 'eloquent' },
  { id: 'etsy', name: 'etsy', type: 'rest', assistant: 'etsy' },
  {
    id: 'eventbrite',
    name: 'eventbrite',
    type: 'rest',
    assistant: 'eventbrite',
  },
  { id: 'exacterp', name: 'exacterp', type: 'rest', assistant: 'exacterp' },
  { id: 'expensify', name: 'expensify', type: 'rest', assistant: 'expensify' },
  {
    id: 'facebookads',
    name: 'facebookads',
    type: 'rest',
    assistant: 'facebookads',
  },
  {
    id: 'fieldaware',
    name: 'fieldaware',
    type: 'rest',
    assistant: 'fieldaware',
  },
  // { id: 'firstdata', name: 'firstdata',
  // type: 'http', assistant: 'firstdata' },
  {
    id: 'freshbooks',
    name: 'freshbooks',
    type: 'rest',
    assistant: 'freshbooks',
  },
  { id: 'freshdesk', name: 'freshdesk', type: 'rest', assistant: 'freshdesk' },
  { id: 'ftp', name: 'ftp', type: 'ftp', assistant: 'ftp' },
  { id: 'github', name: 'github', type: 'rest', assistant: 'github' },
  // { id: 'gooddata', name: 'gooddata', type: 'http', assistant: 'gooddata' },
  { id: 'google', name: 'google', type: 'rest', assistant: 'google' },
  {
    id: 'googleanalytics',
    name: 'googleanalytics',
    type: 'rest',
    assistant: 'googleanalytics',
  },
  {
    id: 'googlecontacts',
    name: 'googlecontacts',
    type: 'rest',
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
    name: 'googlemail',
    type: 'rest',
    assistant: 'googlemail',
  },
  {
    id: 'googlesheets',
    name: 'googlesheets',
    type: 'rest',
    assistant: 'googlesheets',
  },
  {
    id: 'googleshopping',
    name: 'googleshopping',
    type: 'rest',
    assistant: 'googleshopping',
  },
  {
    id: 'greenhouse',
    name: 'greenhouse',
    type: 'rest',
    assistant: 'greenhouse',
  },
  { id: 'grms', name: 'grms', type: 'rest', assistant: 'grms' },
  // { id: 'gusto', name: 'gusto', type: 'http', assistant: 'gusto' },
  { id: 'harvest', name: 'harvest', type: 'rest', assistant: 'harvest' },
  // { id: 'hoovers', name: 'hoovers', type: 'http', assistant: 'hoovers' },
  { id: 'hubspot', name: 'hubspot', type: 'rest', assistant: 'hubspot' },
  // { id: 'hybris', name: 'hybris', type: 'http', assistant: 'hybris' },
  { id: 'insightly', name: 'insightly', type: 'rest', assistant: 'insightly' },
  {
    id: 'integratorio',
    name: 'integratorio',
    type: 'rest',
    assistant: 'integratorio',
  },
  { id: 'intercom', name: 'intercom', type: 'http', assistant: 'intercom' },
  { id: 'jet', name: 'jet', type: 'rest', assistant: 'jet' },
  { id: 'jira', name: 'Jira', type: 'rest', assistant: 'jira' },
  { id: 'jobvite', name: 'jobvite', type: 'rest', assistant: 'jobvite' },
  { id: 'klaviyo', name: 'klaviyo', type: 'rest', assistant: 'klaviyo' },
  {
    id: 'lightspeed',
    name: 'lightspeed',
    type: 'rest',
    assistant: 'lightspeed',
  },
  // { id: 'linkedin', name: 'linkedin', type: 'http', assistant: 'linkedin' },
  {
    id: 'liquidplanner',
    name: 'liquidplanner',
    type: 'rest',
    assistant: 'liquidplanner',
  },
  { id: 'magento', name: 'magento', type: 'rest', assistant: 'magento' },
  { id: 'mailchimp', name: 'mailchimp', type: 'rest', assistant: 'mailchimp' },
  { id: 'mailgun', name: 'mailgun', type: 'rest', assistant: 'mailgun' },
  { id: 'marketo', name: 'marketo', type: 'rest', assistant: 'marketo' },
  // {
  //   id: 'mediaocean',
  //   name: 'mediaocean',
  //   type: 'http',
  //   assistant: 'mediaocean',
  // },
  {
    id: 'merchantesolutions',
    name: 'merchantesolutions',
    type: 'rest',
    assistant: 'merchantesolutions',
  },
  {
    id: 'messagemedia',
    name: 'messagemedia',
    type: 'http',
    assistant: 'messagemedia',
  },
  {
    id: 'microsoftbusinesscentral',
    name: 'microsoftbusinesscentral',
    type: 'rest',
    assistant: 'microsoftbusinesscentral',
  },
  {
    id: 'microsoftdynamics365',
    name: 'microsoftdynamics365',
    type: 'rest',
    assistant: 'microsoftdynamics365',
  },
  // {
  //   id: 'microsoftoffice365',
  //   name: 'microsoftoffice365',
  //   type: 'http',
  //   assistant: 'microsoftoffice365',
  // },
  {
    id: 'microsoftonenote',
    name: 'microsoftonenote',
    type: 'rest',
    assistant: 'microsoftonenote',
  },
  {
    id: 'microsoftoutlookcalendar',
    name: 'microsoftoutlookcalendar',
    type: 'rest',
    assistant: 'microsoftoutlookcalendar',
  },
  {
    id: 'microsoftoutlookcontacts',
    name: 'microsoftoutlookcontacts',
    type: 'rest',
    assistant: 'microsoftoutlookcontacts',
  },
  {
    id: 'microsoftoutlookmail',
    name: 'microsoftoutlookmail',
    type: 'rest',
    assistant: 'microsoftoutlookmail',
  },
  {
    id: 'myobaccountright',
    name: 'myobaccountright',
    type: 'http',
    assistant: 'myobaccountright',
  },
  {
    id: 'myobessentials',
    name: 'myobessentials',
    type: 'rest',
    assistant: 'myobessentials',
  },
  { id: 'namely', name: 'namely', type: 'rest', assistant: 'namely' },
  { id: 'netsuite', name: 'netsuite', type: 'netsuite' },
  { id: 'newegg', name: 'newegg', type: 'rest', assistant: 'newegg' },
  { id: 'newrelic', name: 'newrelic', type: 'rest', assistant: 'newrelic' },
  { id: 'nextag', name: 'nextag', type: 'rest', assistant: 'nextag' },
  { id: 'nimble', name: 'nimble', type: 'rest', assistant: 'nimble' },
  {
    id: 'oandaexchangerates',
    name: 'oandaexchangerates',
    type: 'rest',
    assistant: 'oandaexchangerates',
  },
  {
    id: 'oandav20fxtrade',
    name: 'oandav20fxtrade',
    type: 'rest',
    assistant: 'oandav20fxtrade',
  },
  { id: 'okta', name: 'okta', type: 'http', assistant: 'okta' },
  { id: 'onelogin', name: 'onelogin', type: 'http', assistant: 'onelogin' },
  { id: 'openair', name: 'openair', type: 'http', assistant: 'openair' },
  { id: 'osn', name: 'osn', type: 'http', assistant: 'osn' },
  { id: 'other', name: 'other', type: 'http', assistant: 'other' },
  { id: 'outreach', name: 'outreach', type: 'http', assistant: 'outreach' },
  { id: 'pacejet', name: 'pacejet', type: 'http', assistant: 'pacejet' },
  { id: 'parseur', name: 'parseur', type: 'rest', assistant: 'parseur' },
  { id: 'paychex', name: 'paychex', type: 'rest', assistant: 'paychex' },
  { id: 'paycor', name: 'paycor', type: 'http', assistant: 'paycor' },
  // { id: 'paylocity', name: 'paylocity',
  // type: 'http', assistant: 'paylocity' },
  { id: 'paypal', name: 'paypal', type: 'rest', assistant: 'paypal' },
  { id: 'pdffiller', name: 'pdffiller', type: 'http', assistant: 'pdffiller' },
  {
    id: 'pitneybowes',
    name: 'pitneybowes',
    type: 'rest',
    assistant: 'pitneybowes',
  },
  { id: 'postmark', name: 'postmark', type: 'rest', assistant: 'postmark' },
  { id: 'powerbi', name: 'powerbi', type: 'rest', assistant: 'powerbi' },
  {
    id: 'practicepanther',
    name: 'practicepanther',
    type: 'http',
    assistant: 'practicepanther',
  },
  { id: 'procurify', name: 'procurify', type: 'rest', assistant: 'procurify' },
  { id: 'propack', name: 'propack', type: 'http', assistant: 'propack' },
  { id: 'pulseway', name: 'pulseway', type: 'rest', assistant: 'pulseway' },
  {
    id: 'quickbooks',
    name: 'quickbooks',
    type: 'http',
    assistant: 'quickbooks',
  },
  { id: 'quip', name: 'quip', type: 'rest', assistant: 'quip' },
  {
    id: 'ramplogistics',
    name: 'ramplogistics',
    type: 'rest',
    assistant: 'ramplogistics',
  },
  { id: 'recharge', name: 'recharge', type: 'http', assistant: 'recharge' },
  { id: 'recurly', name: 'recurly', type: 'http', assistant: 'recurly' },
  // { id: 'replicon', name: 'replicon', type: 'http', assistant: 'replicon' },
  { id: 'retailops', name: 'retailops', type: 'rest', assistant: 'retailops' },
  { id: 'returnly', name: 'returnly', type: 'rest', assistant: 'returnly' },
  { id: 's3', name: 's3', type: 's3' },
  { id: 'sageone', name: 'sageone', type: 'rest', assistant: 'sageone' },
  {
    id: 'salesforce',
    name: 'salesforce',
    type: 'salesforce',
  },
  // { id: 'segment', name: 'segment', type: 'http', assistant: 'segment' },
  {
    id: 'servicenow',
    name: 'servicenow',
    type: 'rest',
    assistant: 'servicenow',
  },
  {
    id: 'sharepoint',
    name: 'sharepoint',
    type: 'rest',
    assistant: 'sharepoint',
  },
  { id: 'shiphawk', name: 'shiphawk', type: 'rest', assistant: 'shiphawk' },
  { id: 'shippo', name: 'shippo', type: 'rest', assistant: 'shippo' },
  {
    id: 'shipstation',
    name: 'shipstation',
    type: 'rest',
    assistant: 'shipstation',
  },
  { id: 'shipwire', name: 'shipwire', type: 'rest', assistant: 'shipwire' },
  { id: 'shopify', name: 'shopify', type: 'rest', assistant: 'shopify' },
  { id: 'signnow', name: 'signnow', type: 'rest', assistant: 'signnow' },
  { id: 'skubana', name: 'skubana', type: 'rest', assistant: 'skubana' },
  { id: 'skuvault', name: 'skuvault', type: 'http', assistant: 'skuvault' },
  { id: 'slack', name: 'slack', type: 'rest', assistant: 'slack' },
  {
    id: 'smartsheet',
    name: 'smartsheet',
    type: 'rest',
    assistant: 'smartsheet',
  },
  {
    id: 'snapfulfil',
    name: 'snapfulfil',
    type: 'rest',
    assistant: 'snapfulfil',
  },
  {
    id: 'solidcommerce',
    name: 'solidcommerce',
    type: 'http',
    assistant: 'solidcommerce',
  },
  { id: 'splunk', name: 'splunk', type: 'rest', assistant: 'splunk' },
  {
    id: 'spreecommerce',
    name: 'spreecommerce',
    type: 'rest',
    assistant: 'spreecommerce',
  },
  { id: 'squareup', name: 'squareup', type: 'rest', assistant: 'squareup' },
  // {
  //   id: 'steelbrick',
  //   name: 'steelbrick',
  //   type: 'http',
  //   assistant: 'steelbrick',
  // },
  { id: 'strata', name: 'strata', type: 'rest', assistant: 'strata' },
  { id: 'stripe', name: 'stripe', type: 'rest', assistant: 'stripe' },
  { id: 'sugarcrm', name: 'sugarcrm', type: 'rest', assistant: 'sugarcrm' },
  {
    id: 'surveymonkey',
    name: 'surveymonkey',
    type: 'rest',
    assistant: 'surveymonkey',
  },
  { id: 'svb', name: 'svb', type: 'http', assistant: 'svb' },
  { id: 'tableau', name: 'tableau', type: 'rest', assistant: 'tableau' },
  { id: 'taxjar', name: 'taxjar', type: 'rest', assistant: 'taxjar' },
  { id: 'tesco', name: 'tesco', type: 'rest', assistant: 'tesco' },
  { id: 'tophatter', name: 'tophatter', type: 'rest', assistant: 'tophatter' },
  { id: 'travis', name: 'travis', type: 'rest', assistant: 'travis' },
  { id: 'trinet', name: 'trinet', type: 'http', assistant: 'trinet' },
  { id: 'tsheets', name: 'tsheets', type: 'rest', assistant: 'tsheets' },
  { id: 'twilio', name: 'twilio', type: 'rest', assistant: 'twilio' },
  { id: 'vend', name: 'vend', type: 'http', assistant: 'vend' },
  { id: 'walmart', name: 'walmart', type: 'rest', assistant: 'walmart' },
  { id: 'ware2go', name: 'ware2go', type: 'http', assistant: 'ware2go' },
  { id: 'wiser', name: 'wiser', type: 'rest', assistant: 'wiser' },
  { id: 'wish', name: 'wish', type: 'rest', assistant: 'wish' },
  {
    id: 'woocommerce',
    name: 'woocommerce',
    type: 'rest',
    assistant: 'woocommerce',
  },
  { id: 'wrike', name: 'wrike', type: 'rest', assistant: 'wrike' },
  { id: 'xcart', name: 'xcart', type: 'rest', assistant: 'xcart' },
  { id: 'yahoo', name: 'yahoo', type: 'rest', assistant: 'yahoo' },
  { id: 'yammer', name: 'yammer', type: 'rest', assistant: 'yammer' },
  { id: 'zendesk', name: 'zendesk', type: 'rest', assistant: 'zendesk' },
  { id: 'zimbra', name: 'zimbra', type: 'rest', assistant: 'zimbra' },
  { id: 'zoho', name: 'zoho', type: 'rest', assistant: 'zoho' },
  { id: 'zohobooks', name: 'zohobooks', type: 'rest', assistant: 'zohobooks' },
  { id: 'zohocrm', name: 'zohocrm', type: 'rest', assistant: 'zohocrm' },
  { id: 'zohodesk', name: 'zohodesk', type: 'rest', assistant: 'zohodesk' },
  { id: 'zohomail', name: 'zohomail', type: 'rest', assistant: 'zohomail' },
  { id: 'zoom', name: 'zoom', type: 'rest', assistant: 'zoom' },
  { id: 'zuora', name: 'zuora', type: 'rest', assistant: 'zuora' },
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

export default connectors;
