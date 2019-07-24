// Schema details:
// ---------------
// id: Required. Any unique token.
// name: Required. Display name used in UI. (example: app selection list)
// type: Required - maps to connector type (previously called adaptor)
// assistant: Optional - set if App is a variant (Assistant)
// connections: Optional - if application supports multiple connection
//   types, list them. Concur and Constant Contact are examples.

export default [
  // generic connectors
  { id: 'HTTP', name: 'HTTP', type: 'http' },

  { id: 'REST', name: 'REST API', type: 'rest' },
  { id: 'FTP', name: 'FTP', type: 'ftp' },
  { id: 'Webhook', name: 'Webhook', type: 'webhook' },

  // databases
  { id: 'mongodb', name: 'MongoDB', type: 'mongodb' },
  { id: 'mssql', name: 'mssql', type: 'mssql' },
  { id: 'mysql', name: 'MySQL', type: 'mysql' },
  { id: 'postgresql', name: 'postgresql', type: 'postgresql' },

  // Assistants
  { id: '3dcart', name: '3D Cart', type: 'http', assistant: '3dcart' },
  { id: 'accelo', name: 'Accelo', type: 'rest', assistant: 'accelo' },
  {
    id: 'activecampaign',
    name: 'activecampaign',
    type: 'http',
    assistant: 'activecampaign',
  },
  { id: 'acton', name: 'acton', type: 'http', assistant: 'acton' },
  { id: 'acumatica', name: 'acumatica', type: 'http', assistant: 'acumatica' },
  { id: 'adp', name: 'adp', type: 'http', assistant: 'adp' },
  // is this supported? no image in CDN..
  // { id: 'allbound', name: 'allbound', type: 'http', assistant: 'allbound' },
  { id: 'amazonaws', name: 'Amazon AWS', type: 'http', assistant: 'amazonaws' },
  { id: 'amazonmws', name: 'amazonmws', type: 'http', assistant: 'amazonmws' },
  // { id: 'anaplan', name: 'anaplan', type: 'http', assistant: 'anaplan' },
  { id: 'aptrinsic', name: 'aptrinsic', type: 'http', assistant: 'aptrinsic' },
  { id: 'ariba', name: 'ariba', type: 'http', assistant: 'ariba' },
  { id: 'asana', name: 'asana', type: 'http', assistant: 'asana' },
  { id: 'atera', name: 'atera', type: 'http', assistant: 'atera' },
  {
    id: 'authorize',
    name: 'authorize.net',
    type: 'http',
    assistant: 'authorize.net',
  },
  { id: 'autopilot', name: 'autopilot', type: 'http', assistant: 'autopilot' },
  { id: 'avalara', name: 'avalara', type: 'http', assistant: 'avalara' },
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
    type: 'http',
    assistant: 'bigcommerce',
  },
  // { id: 'bill.com', name: 'bill.com', type: 'http', assistant: 'bill.com' },
  { id: 'box', name: 'box', type: 'http', assistant: 'box' },
  { id: 'braintree', name: 'braintree', type: 'http', assistant: 'braintree' },
  { id: 'bronto', name: 'bronto', type: 'http', assistant: 'bronto' },
  {
    id: 'campaignmonitor',
    name: 'campaignmonitor',
    type: 'http',
    assistant: 'campaignmonitor',
  },
  { id: 'cardknox', name: 'cardknox', type: 'http', assistant: 'cardknox' },
  { id: 'cartrover', name: 'cartrover', type: 'http', assistant: 'cartrover' },
  { id: 'certify', name: 'certify', type: 'http', assistant: 'certify' },
  { id: 'chargebee', name: 'chargebee', type: 'http', assistant: 'chargebee' },
  { id: 'chargify', name: 'chargify', type: 'http', assistant: 'chargify' },
  // { id: 'clio', name: 'clio', type: 'http', assistant: 'clio' },
  { id: 'clover', name: 'clover', type: 'http', assistant: 'clover' },
  { id: 'concur', name: 'concur', type: 'http', assistant: 'concur' },
  {
    id: 'concurall',
    name: 'concur',
    type: 'http',
    assistant: 'concurall',
    icon: 'concur',
  },
  {
    id: 'concurv4',
    name: 'concur',
    type: 'http',
    assistant: 'concurv4',
    icon: 'concur',
  },
  {
    id: 'constantcontactv2',
    name: 'constantcontactv2',
    type: 'http',
    assistant: 'constantcontactv2',
    icon: 'constantcontactv3',
  },
  {
    id: 'constantcontactv3',
    name: 'constantcontactv3',
    type: 'http',
    assistant: 'constantcontactv3',
    icon: 'constantcontactv3',
  },
  { id: 'coupa', name: 'coupa', type: 'http', assistant: 'coupa' },
  { id: 'dcl', name: 'dcl', type: 'http', assistant: 'dcl' },
  { id: 'desk', name: 'desk', type: 'http', assistant: 'desk' },
  // { id: 'dnb', name: 'dnb', type: 'http', assistant: 'dnb' },
  { id: 'docusign', name: 'docusign', type: 'http', assistant: 'docusign' },
  // {
  //   id: 'doubleclick',
  //   name: 'doubleclick',
  //   type: 'http',
  //   assistant: 'doubleclick',
  // },
  { id: 'drift', name: 'drift', type: 'http', assistant: 'drift' },
  { id: 'dropbox', name: 'dropbox', type: 'http', assistant: 'dropbox' },
  {
    id: 'dunandbradstreet',
    name: 'dunandbradstreet',
    type: 'http',
    assistant: 'dunandbradstreet',
  },
  { id: 'easypost', name: 'easypost', type: 'http', assistant: 'easypost' },
  { id: 'easyship', name: 'easyship', type: 'http', assistant: 'easyship' },
  { id: 'ebay-xml', name: 'ebay-xml', type: 'http', assistant: 'ebay-xml' },
  { id: 'ebay', name: 'ebay', type: 'http', assistant: 'ebay' },
  // { id: 'eloquent', name: 'eloquent', type: 'http', assistant: 'eloquent' },
  { id: 'etsy', name: 'etsy', type: 'http', assistant: 'etsy' },
  {
    id: 'eventbrite',
    name: 'eventbrite',
    type: 'http',
    assistant: 'eventbrite',
  },
  { id: 'exacterp', name: 'exacterp', type: 'http', assistant: 'exacterp' },
  { id: 'expensify', name: 'expensify', type: 'http', assistant: 'expensify' },
  {
    id: 'facebookads',
    name: 'facebookads',
    type: 'http',
    assistant: 'facebookads',
  },
  {
    id: 'fieldaware',
    name: 'fieldaware',
    type: 'http',
    assistant: 'fieldaware',
  },
  // { id: 'firstdata', name: 'firstdata',
  // type: 'http', assistant: 'firstdata' },
  {
    id: 'freshbooks',
    name: 'freshbooks',
    type: 'http',
    assistant: 'freshbooks',
  },
  { id: 'freshdesk', name: 'freshdesk', type: 'http', assistant: 'freshdesk' },
  { id: 'ftp', name: 'ftp', type: 'http', assistant: 'ftp' },
  { id: 'github', name: 'github', type: 'http', assistant: 'github' },
  // { id: 'gooddata', name: 'gooddata', type: 'http', assistant: 'gooddata' },
  { id: 'google', name: 'google', type: 'http', assistant: 'google' },
  {
    id: 'googleanalytics',
    name: 'googleanalytics',
    type: 'http',
    assistant: 'googleanalytics',
  },
  {
    id: 'googlecontacts',
    name: 'googlecontacts',
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
    name: 'googlemail',
    type: 'http',
    assistant: 'googlemail',
  },
  {
    id: 'googlesheets',
    name: 'googlesheets',
    type: 'http',
    assistant: 'googlesheets',
  },
  {
    id: 'googleshopping',
    name: 'googleshopping',
    type: 'http',
    assistant: 'googleshopping',
  },
  {
    id: 'greenhouse',
    name: 'greenhouse',
    type: 'http',
    assistant: 'greenhouse',
  },
  { id: 'grms', name: 'grms', type: 'http', assistant: 'grms' },
  // { id: 'gusto', name: 'gusto', type: 'http', assistant: 'gusto' },
  { id: 'harvest', name: 'harvest', type: 'http', assistant: 'harvest' },
  // { id: 'hoovers', name: 'hoovers', type: 'http', assistant: 'hoovers' },
  { id: 'hubspot', name: 'hubspot', type: 'http', assistant: 'hubspot' },
  // { id: 'hybris', name: 'hybris', type: 'http', assistant: 'hybris' },
  { id: 'insightly', name: 'insightly', type: 'http', assistant: 'insightly' },
  {
    id: 'integratorio',
    name: 'integratorio',
    type: 'http',
    assistant: 'integratorio',
  },
  { id: 'intercom', name: 'intercom', type: 'http', assistant: 'intercom' },
  { id: 'jet', name: 'jet', type: 'http', assistant: 'jet' },
  { id: 'jira', name: 'Jira', type: 'rest', assistant: 'jira' },
  { id: 'jobvite', name: 'jobvite', type: 'http', assistant: 'jobvite' },
  { id: 'klaviyo', name: 'klaviyo', type: 'http', assistant: 'klaviyo' },
  {
    id: 'lightspeed',
    name: 'lightspeed',
    type: 'http',
    assistant: 'lightspeed',
  },
  // { id: 'linkedin', name: 'linkedin', type: 'http', assistant: 'linkedin' },
  {
    id: 'liquidplanner',
    name: 'liquidplanner',
    type: 'http',
    assistant: 'liquidplanner',
  },
  { id: 'magento', name: 'magento', type: 'http', assistant: 'magento' },
  { id: 'mailchimp', name: 'mailchimp', type: 'http', assistant: 'mailchimp' },
  { id: 'mailgun', name: 'mailgun', type: 'http', assistant: 'mailgun' },
  { id: 'marketo', name: 'marketo', type: 'http', assistant: 'marketo' },
  // {
  //   id: 'mediaocean',
  //   name: 'mediaocean',
  //   type: 'http',
  //   assistant: 'mediaocean',
  // },
  {
    id: 'merchantesolutions',
    name: 'merchantesolutions',
    type: 'http',
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
    type: 'http',
    assistant: 'microsoftbusinesscentral',
  },
  {
    id: 'microsoftdynamics365',
    name: 'microsoftdynamics365',
    type: 'http',
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
    type: 'http',
    assistant: 'microsoftonenote',
  },
  {
    id: 'microsoftoutlookcalendar',
    name: 'microsoftoutlookcalendar',
    type: 'http',
    assistant: 'microsoftoutlookcalendar',
  },
  {
    id: 'microsoftoutlookcontacts',
    name: 'microsoftoutlookcontacts',
    type: 'http',
    assistant: 'microsoftoutlookcontacts',
  },
  {
    id: 'microsoftoutlookmail',
    name: 'microsoftoutlookmail',
    type: 'http',
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
    type: 'http',
    assistant: 'myobessentials',
  },
  { id: 'namely', name: 'namely', type: 'http', assistant: 'namely' },
  { id: 'netsuite', name: 'netsuite', type: 'http', assistant: 'netsuite' },
  { id: 'newegg', name: 'newegg', type: 'http', assistant: 'newegg' },
  { id: 'newrelic', name: 'newrelic', type: 'http', assistant: 'newrelic' },
  { id: 'nextag', name: 'nextag', type: 'http', assistant: 'nextag' },
  { id: 'nimble', name: 'nimble', type: 'http', assistant: 'nimble' },
  {
    id: 'oandaexchangerates',
    name: 'oandaexchangerates',
    type: 'http',
    assistant: 'oandaexchangerates',
  },
  {
    id: 'oandav20fxtrade',
    name: 'oandav20fxtrade',
    type: 'http',
    assistant: 'oandav20fxtrade',
  },
  { id: 'okta', name: 'okta', type: 'http', assistant: 'okta' },
  { id: 'onelogin', name: 'onelogin', type: 'http', assistant: 'onelogin' },
  { id: 'openair', name: 'openair', type: 'http', assistant: 'openair' },
  { id: 'osn', name: 'osn', type: 'http', assistant: 'osn' },
  { id: 'other', name: 'other', type: 'http', assistant: 'other' },
  { id: 'outreach', name: 'outreach', type: 'http', assistant: 'outreach' },
  { id: 'pacejet', name: 'pacejet', type: 'http', assistant: 'pacejet' },
  { id: 'parseur', name: 'parseur', type: 'http', assistant: 'parseur' },
  { id: 'paychex', name: 'paychex', type: 'http', assistant: 'paychex' },
  { id: 'paycor', name: 'paycor', type: 'http', assistant: 'paycor' },
  // { id: 'paylocity', name: 'paylocity',
  // type: 'http', assistant: 'paylocity' },
  { id: 'paypal', name: 'paypal', type: 'http', assistant: 'paypal' },
  { id: 'pdffiller', name: 'pdffiller', type: 'http', assistant: 'pdffiller' },
  {
    id: 'pitneybowes',
    name: 'pitneybowes',
    type: 'http',
    assistant: 'pitneybowes',
  },
  { id: 'postmark', name: 'postmark', type: 'http', assistant: 'postmark' },
  { id: 'powerbi', name: 'powerbi', type: 'http', assistant: 'powerbi' },
  {
    id: 'practicepanther',
    name: 'practicepanther',
    type: 'http',
    assistant: 'practicepanther',
  },
  { id: 'procurify', name: 'procurify', type: 'http', assistant: 'procurify' },
  { id: 'propack', name: 'propack', type: 'http', assistant: 'propack' },
  { id: 'pulseway', name: 'pulseway', type: 'http', assistant: 'pulseway' },
  {
    id: 'quickbooks',
    name: 'quickbooks',
    type: 'http',
    assistant: 'quickbooks',
  },
  { id: 'quip', name: 'quip', type: 'http', assistant: 'quip' },
  {
    id: 'ramplogistics',
    name: 'ramplogistics',
    type: 'http',
    assistant: 'ramplogistics',
  },
  { id: 'recharge', name: 'recharge', type: 'http', assistant: 'recharge' },
  { id: 'recurly', name: 'recurly', type: 'http', assistant: 'recurly' },
  // { id: 'replicon', name: 'replicon', type: 'http', assistant: 'replicon' },
  { id: 'retailops', name: 'retailops', type: 'http', assistant: 'retailops' },
  { id: 'returnly', name: 'returnly', type: 'http', assistant: 'returnly' },
  { id: 's3', name: 's3', type: 'http', assistant: 's3' },
  { id: 'sageone', name: 'sageone', type: 'http', assistant: 'sageone' },
  {
    id: 'salesforce',
    name: 'salesforce',
    type: 'http',
    assistant: 'salesforce',
  },
  // { id: 'segment', name: 'segment', type: 'http', assistant: 'segment' },
  {
    id: 'servicenow',
    name: 'servicenow',
    type: 'http',
    assistant: 'servicenow',
  },
  {
    id: 'sharepoint',
    name: 'sharepoint',
    type: 'http',
    assistant: 'sharepoint',
  },
  { id: 'shiphawk', name: 'shiphawk', type: 'http', assistant: 'shiphawk' },
  { id: 'shippo', name: 'shippo', type: 'http', assistant: 'shippo' },
  {
    id: 'shipstation',
    name: 'shipstation',
    type: 'http',
    assistant: 'shipstation',
  },
  { id: 'shipwire', name: 'shipwire', type: 'http', assistant: 'shipwire' },
  { id: 'shopify', name: 'shopify', type: 'http', assistant: 'shopify' },
  { id: 'signnow', name: 'signnow', type: 'http', assistant: 'signnow' },
  { id: 'skubana', name: 'skubana', type: 'http', assistant: 'skubana' },
  { id: 'skuvault', name: 'skuvault', type: 'http', assistant: 'skuvault' },
  { id: 'slack', name: 'slack', type: 'http', assistant: 'slack' },
  {
    id: 'smartsheet',
    name: 'smartsheet',
    type: 'http',
    assistant: 'smartsheet',
  },
  {
    id: 'snapfulfil',
    name: 'snapfulfil',
    type: 'http',
    assistant: 'snapfulfil',
  },
  {
    id: 'solidcommerce',
    name: 'solidcommerce',
    type: 'http',
    assistant: 'solidcommerce',
  },
  { id: 'splunk', name: 'splunk', type: 'http', assistant: 'splunk' },
  {
    id: 'spreecommerce',
    name: 'spreecommerce',
    type: 'http',
    assistant: 'spreecommerce',
  },
  { id: 'squareup', name: 'squareup', type: 'http', assistant: 'squareup' },
  // {
  //   id: 'steelbrick',
  //   name: 'steelbrick',
  //   type: 'http',
  //   assistant: 'steelbrick',
  // },
  { id: 'strata', name: 'strata', type: 'http', assistant: 'strata' },
  { id: 'stripe', name: 'stripe', type: 'http', assistant: 'stripe' },
  { id: 'sugarcrm', name: 'sugarcrm', type: 'http', assistant: 'sugarcrm' },
  {
    id: 'surveymonkey',
    name: 'surveymonkey',
    type: 'http',
    assistant: 'surveymonkey',
  },
  { id: 'svb', name: 'svb', type: 'http', assistant: 'svb' },
  { id: 'tableau', name: 'tableau', type: 'http', assistant: 'tableau' },
  { id: 'taxjar', name: 'taxjar', type: 'http', assistant: 'taxjar' },
  { id: 'tesco', name: 'tesco', type: 'http', assistant: 'tesco' },
  { id: 'tophatter', name: 'tophatter', type: 'http', assistant: 'tophatter' },
  { id: 'travis', name: 'travis', type: 'http', assistant: 'travis' },
  { id: 'trinet', name: 'trinet', type: 'http', assistant: 'trinet' },
  { id: 'tsheets', name: 'tsheets', type: 'http', assistant: 'tsheets' },
  { id: 'twilio', name: 'twilio', type: 'http', assistant: 'twilio' },
  { id: 'vend', name: 'vend', type: 'http', assistant: 'vend' },
  { id: 'walmart', name: 'walmart', type: 'http', assistant: 'walmart' },
  { id: 'ware2go', name: 'ware2go', type: 'http', assistant: 'ware2go' },
  { id: 'wiser', name: 'wiser', type: 'http', assistant: 'wiser' },
  { id: 'wish', name: 'wish', type: 'http', assistant: 'wish' },
  {
    id: 'woocommerce',
    name: 'woocommerce',
    type: 'http',
    assistant: 'woocommerce',
  },
  { id: 'wrike', name: 'wrike', type: 'http', assistant: 'wrike' },
  { id: 'xcart', name: 'xcart', type: 'http', assistant: 'xcart' },
  { id: 'yahoo', name: 'yahoo', type: 'http', assistant: 'yahoo' },
  { id: 'yammer', name: 'yammer', type: 'http', assistant: 'yammer' },
  { id: 'zendesk', name: 'zendesk', type: 'http', assistant: 'zendesk' },
  { id: 'zimbra', name: 'zimbra', type: 'http', assistant: 'zimbra' },
  { id: 'zoho', name: 'zoho', type: 'http', assistant: 'zoho' },
  { id: 'zohobooks', name: 'zohobooks', type: 'http', assistant: 'zohobooks' },
  { id: 'zohocrm', name: 'zohocrm', type: 'http', assistant: 'zohocrm' },
  { id: 'zohodesk', name: 'zohodesk', type: 'http', assistant: 'zohodesk' },
  { id: 'zohomail', name: 'zohomail', type: 'http', assistant: 'zohomail' },
  { id: 'zoom', name: 'zoom', type: 'http', assistant: 'zoom' },
  { id: 'zuora', name: 'zuora', type: 'http', assistant: 'zuora' },
];
