export default {
  // #region common
  name: {
    type: 'text',
    label: 'Name',
  },
  // adaptor type has export appended to it
  // strip it off and lowercase the connection type
  // _connectionId: {
  //   type: 'text',
  //   label: 'Connection',
  //   resourceType: 'connections',
  //   resourceProp: 'type',
  //   filter: r => ({ _id: r._connectionId }),
  //   // excludeFilter: r => ({ _id: r._id }),
  // },
  description: {
    type: 'text',
    label: 'Description',
  },
  asynchronous: {
    type: 'checkbox',
    label: 'Asynchronous',
  },
  apiIdentifier: {
    label: 'Invoke this Export [POST]',
    type: 'apiidentifier',
  },
  configureAsyncHelper: {
    type: 'checkbox',
    label: 'Configure Async Helper',
  },
  allConnectionsExportType: {
    type: 'select',
    helpId: 'export.type',
    label: 'Type',
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Test', value: 'test' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
        ],
      },
    ],
  },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      {
        items: [
          { label: 'Webhook', value: 'webhook' },
          { label: 'Distributed', value: 'distributed' },
          { label: 'Test', value: 'test' },
          { label: 'Delta', value: 'delta' },
          { label: 'Once', value: 'once' },
          { label: 'Tranlinedelta', value: 'tranlinedelta' },
          { label: 'Simple', value: 'simple' }, // dataloader
          { label: 'Blob', value: 'blob' }, // attachments
        ],
      },
    ],
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URITemplate',
  },
  oneToMany: {
    type: 'checkbox',
    label: 'One To Many',
  },
  pathToMany: {
    type: 'text',
    label: 'Path To Many',
  },
  sampleData: {
    type: 'sampledata',
    label: 'Raw Data',
    mode: 'json',
    stage: 'raw',
    defaultValue: r => r && r.sampleData,
    connectionId: r => r && r._connectionId,
  },
  originSampleData: {
    type: 'sampledata',
    label: 'Sample Data',
    mode: 'json',
    stage: 'sample',
    defaultValue: r => r && r.sampleData,
    connectionId: r => r && r._connectionId,
  },
  // not using it
  assistant: {
    type: 'select',
    label: 'Assistant',
    options: [
      {
        items: [
          { label: '3dcart', value: '3dcart' },
          { label: 'Accelo', value: 'accelo' },
          { label: 'Adp', value: 'adp' },
          { label: 'Amazonaws', value: 'amazonaws' },
          { label: 'Amazon S3', value: 'amazon s3' },
          { label: 'Anaplan', value: 'anaplan' },
          { label: 'Ariba', value: 'ariba' },
          { label: 'Asana', value: 'asana' },
          { label: 'Atera', value: 'atera' },
          { label: 'Authorize.net', value: 'authorize.net' },
          { label: 'Avalara', value: 'avalara' },
          { label: 'Banking', value: 'banking' },
          { label: 'Bigcommerce', value: 'bigcommerce' },
          { label: 'Bill.com', value: 'bill.com' },
          { label: 'Box', value: 'box' },
          { label: 'Braintree', value: 'braintree' },
          { label: 'Campaignmonitor', value: 'campaignmonitor' },
          { label: 'Certify', value: 'certify' },
          { label: 'Chargebee', value: 'chargebee' },
          { label: 'Chargify', value: 'chargify' },
          { label: 'Clover', value: 'clover' },
          { label: 'Dcl', value: 'dcl' },
          { label: 'Desk', value: 'desk' },
          { label: 'Dnb', value: 'dnb' },
          { label: 'Docusign', value: 'docusign' },
          { label: 'Doubleclick', value: 'doubleclick' },
          { label: 'Dropbox', value: 'dropbox' },
          { label: 'Ebay', value: 'ebay' },
          { label: 'Ebay-xml', value: 'ebay-xml' },
          { label: 'Eloquent', value: 'eloquent' },
          { label: 'Etsy', value: 'etsy' },
          { label: 'Eventbrite', value: 'eventbrite' },
          { label: 'Exacterp', value: 'exacterp' },
          { label: 'Expensify', value: 'expensify' },
          { label: 'Facebookads', value: 'facebookads' },
          { label: 'Fieldaware', value: 'fieldaware' },
          { label: 'Freshbooks', value: 'freshbooks' },
          { label: 'Freshdesk', value: 'freshdesk' },
          { label: 'Ftp', value: 'ftp' },
          { label: 'Github', value: 'github' },
          { label: 'Gooddata', value: 'gooddata' },
          { label: 'Google', value: 'google' },
          { label: 'Googleanalytics', value: 'googleanalytics' },
          { label: 'Googlecontacts', value: 'googlecontacts' },
          { label: 'Googledrive', value: 'googledrive' },
          { label: 'Googlemail', value: 'googlemail' },
          { label: 'Googlesheets', value: 'googlesheets' },
          { label: 'Googleshopping', value: 'googleshopping' },
          { label: 'Harvest', value: 'harvest' },
          { label: 'Hoovers', value: 'hoovers' },
          { label: 'Hubspot', value: 'hubspot' },
          { label: 'Hybris', value: 'hybris' },
          { label: 'Insightly', value: 'insightly' },
          { label: 'Integratorio', value: 'integratorio' },
          { label: 'Jet', value: 'jet' },
          { label: 'Jira', value: 'jira' },
          { label: 'Jobvite', value: 'jobvite' },
          { label: 'Lightspeed', value: 'lightspeed' },
          { label: 'Linkedin', value: 'linkedin' },
          { label: 'Liquidplanner', value: 'liquidplanner' },
          { label: 'Magento', value: 'magento' },
          { label: 'Mailchimp', value: 'mailchimp' },
          { label: 'Mediaocean', value: 'mediaocean' },
          { label: 'Namely', value: 'namely' },
          { label: 'Netsuite', value: 'netsuite' },
          { label: 'Newegg', value: 'newegg' },
          { label: 'Newrelic', value: 'newrelic' },
          { label: 'Okta', value: 'okta' },
          { label: 'Openair', value: 'openair' },
          { label: 'Osn', value: 'osn' },
          { label: 'Other', value: 'other' },
          { label: 'Paychex', value: 'paychex' },
          { label: 'Paylocity', value: 'paylocity' },
          { label: 'Paypal', value: 'paypal' },
          { label: 'Pulseway', value: 'pulseway' },
          { label: 'Quickbooks', value: 'quickbooks' },
          { label: 'Recurly', value: 'recurly' },
          { label: 'Replicon', value: 'replicon' },
          { label: 'S3', value: 's3' },
          { label: 'Sageone', value: 'sageone' },
          { label: 'Salesforce', value: 'salesforce' },
          { label: 'Servicenow', value: 'servicenow' },
          { label: 'Shiphawk', value: 'shiphawk' },
          { label: 'Shipstation', value: 'shipstation' },
          { label: 'Shipwire', value: 'shipwire' },
          { label: 'Shopify', value: 'shopify' },
          { label: 'Skubana', value: 'skubana' },
          { label: 'Slack', value: 'slack' },
          { label: 'Smartsheet', value: 'smartsheet' },
          { label: 'Snapfulfil', value: 'snapfulfil' },
          { label: 'Splunk', value: 'splunk' },
          { label: 'Spreecommerce', value: 'spreecommerce' },
          { label: 'Squareup', value: 'squareup' },
          { label: 'Steelbrick', value: 'steelbrick' },
          { label: 'Stripe', value: 'stripe' },
          { label: 'Surveymonkey', value: 'surveymonkey' },
          { label: 'Svb', value: 'svb' },
          { label: 'Tableau', value: 'tableau' },
          { label: 'Tesco', value: 'tesco' },
          { label: 'Travis', value: 'travis' },
          { label: 'Tsheets', value: 'tsheets' },
          { label: 'Twilio', value: 'twilio' },
          { label: 'Walmart', value: 'walmart' },
          { label: 'Wiser', value: 'wiser' },
          { label: 'Woocommerce', value: 'woocommerce' },
          { label: 'Wrike', value: 'wrike' },
          { label: 'Xcart', value: 'xcart' },
          { label: 'Yahoo', value: 'yahoo' },
          { label: 'Yammer', value: 'yammer' },
          { label: 'Zendesk', value: 'zendesk' },
          { label: 'Zoho', value: 'zoho' },
          { label: 'Zuora', value: 'zuora' },
          { label: 'Coupa', value: 'coupa' },
          { label: 'Taxjar', value: 'taxjar' },
          { label: 'Quip', value: 'quip' },
          { label: 'Allbound', value: 'allbound' },
          { label: 'Zohocrm', value: 'zohocrm' },
          { label: 'Zohodesk', value: 'zohodesk' },
          { label: 'Microsoftoffice365', value: 'microsoftoffice365' },
          { label: 'Microsoftdynamics365', value: 'microsoftdynamics365' },
          { label: 'Pitneybowes', value: 'pitneybowes' },
          { label: 'Mysql', value: 'mysql' },
          { label: 'Postgresql', value: 'postgresql' },
          { label: 'Microsoft SQL', value: 'microsoft sql' },
          { label: 'Greenhouse', value: 'greenhouse' },
          { label: 'Shippo', value: 'shippo' },
          { label: 'Gusto', value: 'gusto' },
          { label: 'Easypost', value: 'easypost' },
          { label: 'Segment', value: 'segment' },
          { label: 'Zohobooks', value: 'zohobooks' },
          {
            label: 'Microsoftbusinesscentral',
            value: 'microsoftbusinesscentral',
          },
          {
            label: 'Microsoftoutlookcalendar',
            value: 'microsoftoutlookcalendar',
          },
          { label: 'Microsoftoutlookmail', value: 'microsoftoutlookmail' },
          {
            label: 'Microsoftoutlookcontacts',
            value: 'microsoftoutlookcontacts',
          },
          { label: 'Microsoftonenote', value: 'microsoftonenote' },
          { label: 'Wish', value: 'wish' },
          { label: 'Pdffiller', value: 'pdffiller' },
          { label: 'Signnow', value: 'signnow' },
          { label: 'Acton', value: 'acton' },
          { label: 'Acumatica', value: 'acumatica' },
          { label: 'Mongodb', value: 'mongodb' },
          { label: 'Zohomail', value: 'zohomail' },
          { label: 'Zoom', value: 'zoom' },
          { label: 'Myobessentials', value: 'myobessentials' },
          { label: 'Nimble', value: 'nimble' },
          { label: 'Bronto', value: 'bronto' },
          { label: 'Strata', value: 'strata' },
          { label: 'Returnly', value: 'returnly' },
          { label: 'Activecampaign', value: 'activecampaign' },
          { label: 'Klaviyo', value: 'klaviyo' },
          { label: 'Postmark', value: 'postmark' },
          { label: 'Powerbi', value: 'powerbi' },
          { label: 'Procurify', value: 'procurify' },
          { label: 'Mailgun', value: 'mailgun' },
          { label: 'Zimbra', value: 'zimbra' },
          { label: 'Merchantesolutions', value: 'merchantesolutions' },
          { label: 'Aptrinsic', value: 'aptrinsic' },
          { label: 'Cardknox', value: 'cardknox' },
          { label: 'Skuvault', value: 'skuvault' },
          { label: 'Nextag', value: 'nextag' },
          { label: 'Concur', value: 'concur' },
          { label: 'Oandav20fxtrade', value: 'oandav20fxtrade' },
          { label: 'Oandaexchangerates', value: 'oandaexchangerates' },
          { label: 'Tophatter', value: 'tophatter' },
          { label: 'Concurv4', value: 'concurv4' },
          { label: 'Sugarcrm', value: 'sugarcrm' },
          { label: 'Marketo', value: 'marketo' },
          { label: 'Grms', value: 'grms' },
          { label: 'Retailops', value: 'retailops' },
          { label: 'Sharepoint', value: 'sharepoint' },
          { label: 'Parseur', value: 'parseur' },
          { label: 'Firstdata', value: 'firstdata' },
          { label: 'Propack', value: 'propack' },
          { label: 'Outreach', value: 'outreach' },
          { label: 'Ramplogistics', value: 'ramplogistics' },
          { label: 'Constantcontactv3', value: 'constantcontactv3' },
          { label: 'Constantcontactv2', value: 'constantcontactv2' },
          { label: 'Concurall', value: 'concurall' },
          { label: 'Dunandbradstreet', value: 'dunandbradstreet' },
          { label: 'Trinet', value: 'trinet' },
          { label: 'Pacejet', value: 'pacejet' },
          { label: 'Solidcommerce', value: 'solidcommerce' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Bamboohr', value: 'bamboohr' },
        ],
      },
    ],
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant Metadata',
  },
  isLookup: {
    type: 'checkbox',
    label: 'Is Lookup',
  },
  useTechAdaptorForm: {
    type: 'checkbox',
    label: 'Use Tech Adaptor Form',
  },
  adaptorType: {
    type: 'text',
    label: 'Adaptor Type',
  },
  // #endregion common
  // #region inputFilter
  'inputFilter.expression.version': {
    type: 'radiogroup',
    label: 'Input Filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'inputFilter.expression.rules': {
    type: 'text',
    label: 'Input Filter expression rules',
  },
  'inputFilter.script._scriptId': {
    type: 'text',
    label: 'Input Filter script _script Id',
  },
  'inputFilter.script.function': {
    type: 'text',
    label: 'Input Filter script function',
  },
  // #endregion inputFilter
  // #region test
  'test.limit': {
    type: 'text',
    label: 'Test limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion test
  // #region delta
  'delta.dateField': {
    label: 'Date field',
    type: 'refreshableselect',
    mode: 'suitescript',
    filterKey: 'dateField',
    defaultValue: r => r && r.delta && r.delta.dateField,
    required: true,
    placeholder: 'Please select a date field',
    connectionId: r => r && r._connectionId,
  },
  'delta.dateFormat': {
    type: 'text',
    label: 'Delta date Format',
  },
  'delta.startDate': {
    type: 'text',
    label: 'Delta start Date',
  },
  'delta.lagOffset': {
    type: 'text',
    label: 'Offset',
    defaultValue: r => r && r.delta && r.delta.lagOffset,
    required: true,
  },
  'delta.endDateField': {
    type: 'text',
    label: 'Delta end Date Field',
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    label: 'Boolean Field',
    type: 'refreshableselect',
    placeholder: 'Please select a Boolean field',
    defaultValue: r => r && r.once && r.once.booleanField,
    mode: 'suitescript',
    filterKey: 'booleanField',
    required: true,
    connectionId: r => r && r._connectionId,
  },
  // #endregion once
  // #region valueDelta
  'valueDelta.exportedField': {
    type: 'text',
    label: 'Value Delta exported Field',
  },
  'valueDelta.pendingField': {
    type: 'text',
    label: 'Value Delta pending Field',
  },
  // #endregion valueDelta
  // #region webhook
  'webhook.provider': {
    type: 'select',
    label: 'Webhook provider',
    options: [
      {
        items: [
          { label: 'Github', value: 'github' },
          { label: 'Shopify', value: 'shopify' },
          { label: 'Travis', value: 'travis' },
          { label: 'Travis-org', value: 'travis-org' },
          { label: 'Slack', value: 'slack' },
          { label: 'Dropbox', value: 'dropbox' },
          { label: 'Helpscout', value: 'helpscout' },
          { label: 'Errorception', value: 'errorception' },
          { label: 'Box', value: 'box' },
          { label: 'Stripe', value: 'stripe' },
          { label: 'Aha', value: 'aha' },
          { label: 'Jira', value: 'jira' },
          { label: 'Pagerduty', value: 'pagerduty' },
          { label: 'Postmark', value: 'postmark' },
          { label: 'Mailchimp', value: 'mailchimp' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Activecampaign', value: 'activecampaign' },
          { label: 'Segment', value: 'segment' },
          { label: 'Recurly', value: 'recurly' },
          { label: 'Shipwire', value: 'shipwire' },
          { label: 'Surveymonkey', value: 'surveymonkey' },
          { label: 'Parseur', value: 'parseur' },
          { label: 'Mailparser-io', value: 'mailparser-io' },
          { label: 'Integrator-extension', value: 'integrator-extension' },
          { label: 'Custom', value: 'custom' },
        ],
      },
    ],
  },
  'webhook.verify': {
    type: 'select',
    label: 'Webhook verify',
    options: [
      {
        items: [
          { label: 'Token', value: 'token' },
          { label: 'Hmac', value: 'hmac' },
          { label: 'Basic', value: 'basic' },
          { label: 'Publickey', value: 'publickey' },
          { label: 'Secret_url', value: 'secret_url' },
        ],
      },
    ],
  },
  'webhook.token': {
    type: 'text',
    label: 'Webhook token',
  },
  'webhook.path': {
    type: 'text',
    label: 'Webhook path',
  },
  'webhook.algorithm': {
    type: 'radiogroup',
    label: 'Webhook algorithm',
    options: [
      {
        items: [
          { label: 'Sha1', value: 'sha1' },
          { label: 'Sha256', value: 'sha256' },
        ],
      },
    ],
  },
  'webhook.encoding': {
    type: 'radiogroup',
    label: 'Webhook encoding',
    options: [
      {
        items: [
          { label: 'Hex', value: 'hex' },
          { label: 'Base64', value: 'base64' },
        ],
      },
    ],
  },
  'webhook.key': {
    type: 'text',
    label: 'Webhook key',
  },
  'webhook.header': {
    type: 'text',
    label: 'Webhook header',
  },
  'webhook.username': {
    type: 'text',
    label: 'Webhook username',
  },
  'webhook.password': {
    type: 'text',
    label: 'Webhook password',
  },
  // #endregion webhook
  // #region distributed
  'distributed.bearerToken': {
    type: 'text',
    label: 'Distributed bearer Token',
  },
  // #endregion distributed
  // #region hooks
  hookType: {
    type: 'radiogroup',
    label: 'Hook Type',
    defaultValue: 'script',
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preSavePage.function': {
    type: 'text',
    label: 'Hooks pre Save Page function',
  },
  'hooks.preSavePage._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    placeholder: 'Please select a script',
    label: 'Hooks pre Save Page _script Id',
  },
  'hooks.preSavePage.configuration': {
    type: 'text',
    label: 'Hooks pre Save Page configuration',
  },
  'hooks.preSavePage._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Hooks pre Save Page _stack Id',
  },

  // #endregion hooks
  // #region transform
  'transform.expression.rules': {
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },

  'transform.script._scriptId': {
    type: 'text',
    label: 'Transform script _script Id',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
  // #region parsers
  // parsers check
  'parsers.version': {
    type: 'text',
    label: 'Parsers version',
  },
  'parsers.rules': {
    type: 'text',
    label: 'Parsers rules',
  },
  // #endregion parsers
  // #region filter
  'filter.expression.version': {
    type: 'radiogroup',
    label: 'Filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'filter.expression.rules': {
    type: 'text',
    label: 'Filter expression rules',
  },
  'filter.script._scriptId': {
    type: 'text',
    label: 'Filter script _script Id',
  },
  'filter.script.function': {
    type: 'text',
    label: 'Filter script function',
  },
};
