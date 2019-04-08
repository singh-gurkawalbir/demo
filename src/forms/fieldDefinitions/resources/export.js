export default {
  // #region common
  name: {
    type: 'text',

    name: '/name',

    label: 'Name',
  },

  _connectionId: {
    type: 'selectresource',

    name: '/_connectionId',
    label: 'Connection',

    resourceType: 'connections',
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
  },
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'text',

    name: '/uploadFile',
    label: 'Sample File (that would be exported)',

    resourceType: 'connections',
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },
  description: {
    type: 'text',

    name: '/description',

    label: 'Description',
  },
  asynchronous: {
    type: 'checkbox',

    name: '/asynchronous',

    label: 'Asynchronous',
  },
  apiIdentifier: {
    type: 'text',

    name: '/apiIdentifier',

    label: 'Api Identifier',
  },
  type: {
    type: 'select',

    name: '/type',

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
          { label: 'Simple', value: 'simple' },
          { label: 'Blob', value: 'blob' },
        ],
      },
    ],
  },
  pageSize: {
    type: 'text',

    name: '/pageSize',

    label: 'Page Size',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'text',

    name: '/dataURITemplate',

    label: 'Data URITemplate',
  },
  oneToMany: {
    type: 'checkbox',

    name: '/oneToMany',

    label: 'One To Many',
  },
  pathToMany: {
    type: 'text',

    name: '/pathToMany',

    label: 'Path To Many',
  },
  sampleData: {
    type: 'editor',

    name: '/sampleData',

    label: 'Sample Data',
  },
  originSampleData: {
    type: 'text',

    name: '/originSampleData',

    label: 'Origin Sample Data',
  },
  assistant: {
    type: 'select',

    name: '/assistant',

    label: 'Assistant',

    options: [
      {
        items: [
          { label: '3dcart', value: '3dcart' },
          { label: 'Accelo', value: 'accelo' },
          { label: 'Adp', value: 'adp' },
          { label: 'Amazonaws', value: 'amazonaws' },
          { label: 'Amazonmws', value: 'amazonmws' },
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
          { label: 'Mssql', value: 'mssql' },
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
          { label: 'Spreecommerce', value: 'spreecommerce' },
          { label: 'Tophatter', value: 'tophatter' },
          { label: 'Concurv4', value: 'concurv4' },
          { label: 'Sugarcrm', value: 'sugarcrm' },
          { label: 'Marketo', value: 'marketo' },
          { label: 'Grms', value: 'grms' },
          { label: 'Retailops', value: 'retailops' },
          { label: 'Sharepoint', value: 'sharepoint' },
          { label: 'Parseur', value: 'parseur' },
          { label: 'Authorize.net', value: 'authorize.net' },
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

    name: '/assistantMetadata',

    label: 'Assistant Metadata',
  },
  isLookup: {
    type: 'checkbox',

    name: '/isLookup',

    label: 'Is Lookup',
  },
  useTechAdaptorForm: {
    type: 'checkbox',

    name: '/useTechAdaptorForm',

    label: 'Use Tech Adaptor Form',
  },
  adaptorType: {
    type: 'text',

    name: '/adaptorType',

    label: 'Adaptor Type',
  },
  // #endregion common
  // #region inputFilter
  'inputFilter.expression.version': {
    type: 'radiogroup',

    name: '/inputFilter/expression/version',

    label: 'Input Filter expression version',

    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'inputFilter.expression.rules': {
    type: 'text',

    name: '/inputFilter/expression/rules',

    label: 'Input Filter expression rules',
  },
  'inputFilter.script._scriptId': {
    type: 'text',

    name: '/inputFilter/script/_scriptId',

    label: 'Input Filter script _script Id',
  },
  'inputFilter.script.function': {
    type: 'text',

    name: '/inputFilter/script/function',

    label: 'Input Filter script function',
  },
  // #endregion inputFilter
  // #region test
  'test.limit': {
    type: 'text',

    name: '/test/limit',

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
    type: 'text',

    name: '/delta/dateField',

    label: 'Delta date Field',
  },
  'delta.dateFormat': {
    type: 'text',

    name: '/delta/dateFormat',

    label: 'Delta date Format',
  },
  'delta.startDate': {
    type: 'text',

    name: '/delta/startDate',

    label: 'Delta start Date',
  },
  'delta.lagOffset': {
    type: 'text',

    name: '/delta/lagOffset',

    label: 'Delta lag Offset',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'delta.endDateField': {
    type: 'text',

    name: '/delta/endDateField',

    label: 'Delta end Date Field',
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    type: 'text',

    name: '/once/booleanField',

    label: 'Once boolean Field',
  },
  // #endregion once
  // #region valueDelta
  'valueDelta.exportedField': {
    type: 'text',

    name: '/valueDelta/exportedField',

    label: 'Value Delta exported Field',
  },
  'valueDelta.pendingField': {
    type: 'text',

    name: '/valueDelta/pendingField',

    label: 'Value Delta pending Field',
  },
  // #endregion valueDelta
  // #region webhook
  'webhook.provider': {
    type: 'select',

    name: '/webhook/provider',

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

    name: '/webhook/verify',

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

    name: '/webhook/token',

    label: 'Webhook token',
  },
  'webhook.path': {
    type: 'text',

    name: '/webhook/path',

    label: 'Webhook path',
  },
  'webhook.algorithm': {
    type: 'radiogroup',

    name: '/webhook/algorithm',

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

    name: '/webhook/encoding',

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

    name: '/webhook/key',

    label: 'Webhook key',
  },
  'webhook.header': {
    type: 'text',

    name: '/webhook/header',

    label: 'Webhook header',
  },
  'webhook.username': {
    type: 'text',

    name: '/webhook/username',

    label: 'Webhook username',
  },
  'webhook.password': {
    type: 'text',

    name: '/webhook/password',

    label: 'Webhook password',
  },
  // #endregion webhook
  // #region distributed
  'distributed.bearerToken': {
    type: 'text',

    name: '/distributed/bearerToken',

    label: 'Distributed bearer Token',
  },
  // #endregion distributed
  // #region hooks
  'hooks.preSavePage.function': {
    type: 'text',

    name: '/hooks/preSavePage/function',

    label: 'Hooks pre Save Page function',
  },
  'hooks.preSavePage._scriptId': {
    type: 'text',

    name: '/hooks/preSavePage/_scriptId',

    label: 'Hooks pre Save Page _script Id',
  },
  'hooks.preSavePage._stackId': {
    type: 'text',

    name: '/hooks/preSavePage/_stackId',

    label: 'Hooks pre Save Page _stack Id',
  },
  'hooks.preSavePage.configuration': {
    type: 'text',

    name: '/hooks/preSavePage/configuration',

    label: 'Hooks pre Save Page configuration',
  },
  // #endregion hooks
  // #region transform

  'transform.expression.rules': {
    type: 'transformeditor',

    name: '/transform/expression/rules',

    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rule: r =>
      r &&
      r.transform &&
      r.transform.expression &&
      r.transform.expression.rules,
  },
  'transform.script._scriptId': {
    type: 'text',

    name: '/transform/script/_scriptId',

    label: 'Transform script _script Id',
  },
  'transform.script.function': {
    type: 'text',

    name: '/transform/script/function',

    label: 'Transform script function',
  },
  // #endregion transform
  // #region parsers
  // parsers check
  'parsers.version': {
    type: 'text',

    name: '/parsers/version',

    label: 'Parsers version',
  },
  'parsers.rules': {
    type: 'text',

    name: '/parsers/rules',

    label: 'Parsers rules',
  },
  // #endregion parsers
  // #region filter
  'filter.expression.version': {
    type: 'radiogroup',

    name: '/filter/expression/version',

    label: 'Filter expression version',

    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'filter.expression.rules': {
    type: 'text',

    name: '/filter/expression/rules',

    label: 'Filter expression rules',
  },
  'filter.script._scriptId': {
    type: 'text',

    name: '/filter/script/_scriptId',

    label: 'Filter script _script Id',
  },
  'filter.script.function': {
    type: 'text',

    name: '/filter/script/function',

    label: 'Filter script function',
  },
  // #endregion filter
  // #region file
  'file.encoding': {
    type: 'select',

    name: '/file/encoding',

    label: 'File encoding',

    options: [
      {
        items: [
          { label: 'Utf8', value: 'utf8' },
          { label: 'Win1252', value: 'win1252' },
          { label: 'Utf-16le', value: 'utf-16le' },
        ],
      },
    ],
  },

  'file.type': {
    type: 'select',

    name: '/file/type',

    label: 'File type',

    options: [
      {
        items: [
          { label: 'Csv', value: 'csv' },
          { label: 'Json', value: 'json' },
          { label: 'Xlsx', value: 'xlsx' },
          { label: 'Xml', value: 'xml' },
          { label: 'Filedefinition', value: 'filedefinition' },
        ],
      },
    ],
  },
  'file.output': {
    type: 'select',

    name: '/file/output',

    label: 'File output',

    options: [
      {
        items: [
          { label: 'Records', value: 'records' },
          { label: 'Metadata', value: 'metadata' },
          { label: 'BlobKeys', value: 'blobKeys' },
        ],
      },
    ],
  },
  'file.skipDelete': {
    type: 'checkbox',

    name: '/file/skipDelete',

    label: 'File skip Delete',
  },
  'file.compressionFormat': {
    type: 'radiogroup',

    name: '/file/compressionFormat',

    label: 'File compression Format',

    options: [{ items: [{ label: 'Gzip', value: 'gzip' }] }],
  },
  'file.csv': {
    name: '/file/csv',
    type: 'csvparse',
    helpText: 'Use this editor to preview how your parse options affect your ',
    label: 'Configure CSV parse options',

    sampleData: r => r.sampleData,
  },
  'file.csv.columnDelimiter': {
    type: 'text',

    name: '/file/csv/columnDelimiter',

    label: 'File csv column Delimiter',
  },
  'file.csv.rowDelimiter': {
    type: 'text',

    name: '/file/csv/rowDelimiter',

    label: 'File csv row Delimiter',
  },
  'file.csv.keyColumnss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/file/csv/keyColumnss',

    label: 'File csv key Columns',

    validWhen: [],
  },
  'file.csv.hasHeaderRow': {
    type: 'checkbox',

    name: '/file/csv/hasHeaderRow',

    label: 'File csv has Header Row',
  },
  'file.csv.trimSpaces': {
    type: 'checkbox',

    name: '/file/csv/trimSpaces',

    label: 'File csv trim Spaces',
  },
  'file.csv.rowsToSkip': {
    type: 'text',

    name: '/file/csv/rowsToSkip',

    label: 'File csv rows To Skip',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'file.json.resourcePath': {
    type: 'text',

    name: '/file/json/resourcePath',

    label: 'File json resource Path',
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',

    name: '/file/xlsx/hasHeaderRow',

    label: 'File xlsx has Header Row',
  },
  'file.xlsx.keyColumnss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/file/xlsx/keyColumnss',

    label: 'File xlsx key Columns',

    validWhen: [],
  },
  'file.xml.resourcePath': {
    type: 'text',

    name: '/file/xml/resourcePath',

    label: 'File xml resource Path',
  },
  'file.fileDefinition.resourcePath': {
    type: 'text',

    name: '/file/fileDefinition/resourcePath',

    label: 'File file Definition resource Path',
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',

    name: '/file/fileDefinition/_fileDefinitionId',

    label: 'File file Definition _file Definition Id',
  },
  'file.purgeInternalBackup': {
    type: 'checkbox',

    name: '/file/purgeInternalBackup',

    label: 'File purge Internal Backup',
  },
  // #endregion file
  // #region rest
  'rest.relativeURI': {
    type: 'text',

    name: '/rest/relativeURI',

    label: 'Rest relative URI',
  },
  'rest.method': {
    type: 'select',

    name: '/rest/method',

    label: 'Rest method',

    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
  'rest.postBody': {
    type: 'text',

    name: '/rest/postBody',

    label: 'Rest post Body',
  },
  'rest.resourcePath': {
    type: 'text',

    name: '/rest/resourcePath',

    label: 'Rest resource Path',
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',

    name: '/rest/headers',

    label: 'Rest headers',
  },
  'rest.allowUndefinedResource': {
    type: 'checkbox',

    name: '/rest/allowUndefinedResource',

    label: 'Rest allow Undefined Resource',
  },
  'rest.pagingMethod': {
    type: 'select',

    name: '/rest/pagingMethod',

    label: 'Rest paging Method',

    options: [
      {
        items: [
          { label: 'Nextpageurl', value: 'nextpageurl' },
          { label: 'Pageargument', value: 'pageargument' },
          { label: 'Relativeuri', value: 'relativeuri' },
          { label: 'Linkheader', value: 'linkheader' },
          { label: 'Skipargument', value: 'skipargument' },
          { label: 'Token', value: 'token' },
          { label: 'Postbody', value: 'postbody' },
        ],
      },
    ],
  },
  'rest.nextPagePath': {
    type: 'text',

    name: '/rest/nextPagePath',

    label: 'Rest next Page Path',
  },
  'rest.linkHeaderRelation': {
    type: 'text',

    name: '/rest/linkHeaderRelation',

    label: 'Rest link Header Relation',
  },
  'rest.nextPageRelativeURI': {
    type: 'text',

    name: '/rest/nextPageRelativeURI',

    label: 'Rest next Page Relative URI',
  },
  'rest.pageArgument': {
    type: 'text',

    name: '/rest/pageArgument',

    label: 'Rest page Argument',
  },
  'rest.pagingPostBody': {
    type: 'text',

    name: '/rest/pagingPostBody',

    label: 'Rest paging Post Body',
  },
  'rest.maxPagePath': {
    type: 'text',

    name: '/rest/maxPagePath',

    label: 'Rest max Page Path',
  },
  'rest.maxCountPath': {
    type: 'text',

    name: '/rest/maxCountPath',

    label: 'Rest max Count Path',
  },
  'rest.skipArgument': {
    type: 'text',

    name: '/rest/skipArgument',

    label: 'Rest skip Argument',
  },
  'rest.blobFormat': {
    type: 'text',

    name: '/rest/blobFormat',

    label: 'Rest blob Format',
  },
  'rest.successPath': {
    type: 'text',

    name: '/rest/successPath',

    label: 'Rest success Path',
  },
  'rest.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/rest/successValuess',

    label: 'Rest success Values',

    validWhen: [],
  },
  'rest.lastPageStatusCode': {
    type: 'text',

    name: '/rest/lastPageStatusCode',

    label: 'Rest last Page Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.lastPagePath': {
    type: 'text',

    name: '/rest/lastPagePath',

    label: 'Rest last Page Path',
  },
  'rest.lastPageValue': {
    type: 'text',

    name: '/rest/lastPageValue',

    label: 'Rest last Page Value',
  },
  'rest.once.relativeURI': {
    type: 'text',

    name: '/rest/once/relativeURI',

    label: 'Rest once relative URI',
  },
  'rest.once.method': {
    type: 'radiogroup',

    name: '/rest/once/method',

    label: 'Rest once method',

    options: [
      {
        items: [
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.once.postBody': {
    type: 'text',

    name: '/rest/once/postBody',

    label: 'Rest once post Body',
  },
  // #endregion rest
  // #region ftp
  'ftp.directoryPath': {
    type: 'text',

    name: '/ftp/directoryPath',

    label: 'Ftp directory Path',
  },
  'ftp.fileNameStartsWith': {
    type: 'text',

    name: '/ftp/fileNameStartsWith',

    label: 'Ftp file Name Starts With',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',

    name: '/ftp/fileNameEndsWith',

    label: 'Ftp file Name Ends With',
  },
  'ftp.backupDirectoryPath': {
    type: 'text',

    name: '/ftp/backupDirectoryPath',

    label: 'Ftp backup Directory Path',
  },
  // #endregion ftp
  // #region http
  'http.successMediaType': {
    type: 'select',

    name: '/http/successMediaType',

    label: 'Http success Media Type',

    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Csv', value: 'csv' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'http.errorMediaType': {
    type: 'radiogroup',

    name: '/http/errorMediaType',

    label: 'Http error Media Type',

    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'http.relativeURI': {
    type: 'text',

    name: '/http/relativeURI',

    label: 'Http relative URI',
  },
  'http.method': {
    type: 'select',

    name: '/http/method',

    label: 'Http method',

    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.body': {
    type: 'text',

    name: '/http/body',

    label: 'Http body',
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',

    name: '/http/headers',

    label: 'Http headers',
  },
  'http.paging.method': {
    type: 'select',

    name: '/http/paging/method',

    label: 'Http paging method',

    options: [
      {
        items: [
          { label: 'Token', value: 'token' },
          { label: 'Skip', value: 'skip' },
          { label: 'Page', value: 'page' },
          { label: 'Url', value: 'url' },
          { label: 'Linkheader', value: 'linkheader' },
          { label: 'Relativeuri', value: 'relativeuri' },
        ],
      },
    ],
  },
  'http.paging.skip': {
    type: 'text',

    name: '/http/paging/skip',

    label: 'Http paging skip',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.page': {
    type: 'text',

    name: '/http/paging/page',

    label: 'Http paging page',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.token': {
    type: 'text',

    name: '/http/paging/token',

    label: 'Http paging token',
  },
  'http.paging.path': {
    type: 'text',

    name: '/http/paging/path',

    label: 'Http paging path',
  },
  'http.paging.relativeURI': {
    type: 'text',

    name: '/http/paging/relativeURI',

    label: 'Http paging relative URI',
  },
  'http.paging.pathAfterFirstRequest': {
    type: 'text',

    name: '/http/paging/pathAfterFirstRequest',

    label: 'Http paging path After First Request',
  },
  'http.paging.resourcePath': {
    type: 'text',

    name: '/http/paging/resourcePath',

    label: 'Http paging resource Path',
  },
  'http.paging.maxPagePath': {
    type: 'text',

    name: '/http/paging/maxPagePath',

    label: 'Http paging max Page Path',
  },
  'http.paging.maxCountPath': {
    type: 'text',

    name: '/http/paging/maxCountPath',

    label: 'Http paging max Count Path',
  },
  'http.paging.lastPageStatusCode': {
    type: 'text',

    name: '/http/paging/lastPageStatusCode',

    label: 'Http paging last Page Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.lastPagePath': {
    type: 'text',

    name: '/http/paging/lastPagePath',

    label: 'Http paging last Page Path',
  },
  'http.paging.lastPageValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/paging/lastPageValuess',

    label: 'Http paging last Page Values',

    validWhen: [],
  },
  'http.paging.linkHeaderRelation': {
    type: 'text',

    name: '/http/paging/linkHeaderRelation',

    label: 'Http paging link Header Relation',
  },
  'http._asyncHelperId': {
    type: 'text',

    name: '/http/_asyncHelperId',

    label: 'Http _async Helper Id',
  },
  'http.once.relativeURI': {
    type: 'text',

    name: '/http/once/relativeURI',

    label: 'Http once relative URI',
  },
  'http.once.method': {
    type: 'select',

    name: '/http/once/method',

    label: 'Http once method',

    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.once.body': {
    type: 'text',

    name: '/http/once/body',

    label: 'Http once body',
  },
  'http.response.resourcePath': {
    type: 'text',

    name: '/http/response/resourcePath',

    label: 'Http response resource Path',
  },
  'http.response.resourceIdPath': {
    type: 'text',

    name: '/http/response/resourceIdPath',

    label: 'Http response resource Id Path',
  },
  'http.response.successPath': {
    type: 'text',

    name: '/http/response/successPath',

    label: 'Http response success Path',
  },
  'http.response.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/response/successValuess',

    label: 'Http response success Values',

    validWhen: [],
  },
  'http.response.errorPath': {
    type: 'text',

    name: '/http/response/errorPath',

    label: 'Http response error Path',
  },
  'http.response.blobFormat': {
    type: 'text',

    name: '/http/response/blobFormat',

    label: 'Http response blob Format',
  },
  // #endregion http
  // #region netsuite
  'netsuite.searchess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/netsuite/searchess',

    label: 'Netsuite searches',

    validWhen: [],
  },
  'netsuite.metadata': {
    type: 'text',

    name: '/netsuite/metadata',

    label: 'Netsuite metadata',
  },
  'netsuite.selectoption': {
    type: 'text',

    name: '/netsuite/selectoption',

    label: 'Netsuite selectoption',
  },
  'netsuite.customFieldMetadata': {
    type: 'text',

    name: '/netsuite/customFieldMetadata',

    label: 'Netsuite custom Field Metadata',
  },
  'netsuite.skipGrouping': {
    type: 'checkbox',

    name: '/netsuite/skipGrouping',

    label: 'Netsuite skip Grouping',
  },
  'netsuite.statsOnly': {
    type: 'checkbox',

    name: '/netsuite/statsOnly',

    label: 'Netsuite stats Only',
  },
  'netsuite.internalId': {
    type: 'text',

    name: '/netsuite/internalId',

    label: 'Netsuite internal Id',
  },
  'netsuite.restlet.recordType': {
    type: 'text',

    name: '/netsuite/restlet/recordType',

    label: 'Netsuite restlet record Type',
  },
  'netsuite.restlet.searchId': {
    type: 'text',

    name: '/netsuite/restlet/searchId',

    label: 'Netsuite restlet search Id',
  },
  'netsuite.restlet.criteria.field': {
    type: 'text',

    name: '/netsuite/restlet/criteria/field',

    label: 'Netsuite restlet criteria field',
  },
  'netsuite.restlet.criteria.join': {
    type: 'text',

    name: '/netsuite/restlet/criteria/join',

    label: 'Netsuite restlet criteria join',
  },
  'netsuite.restlet.criteria.operator': {
    type: 'text',

    name: '/netsuite/restlet/criteria/operator',

    label: 'Netsuite restlet criteria operator',
  },
  'netsuite.restlet.criteria.searchValue': {
    type: 'text',

    name: '/netsuite/restlet/criteria/searchValue',

    label: 'Netsuite restlet criteria search Value',
  },
  'netsuite.restlet.criteria.searchValue2': {
    type: 'text',

    name: '/netsuite/restlet/criteria/searchValue2',

    label: 'Netsuite restlet criteria search Value2',
  },
  'netsuite.restlet.batchSize': {
    type: 'text',

    name: '/netsuite/restlet/batchSize',

    label: 'Netsuite restlet batch Size',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.batchSize': {
    type: 'text',

    name: '/netsuite/restlet/hooks/batchSize',

    label: 'Netsuite restlet hooks batch Size',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.preSend.fileInternalId': {
    type: 'text',

    name: '/netsuite/restlet/hooks/preSend/fileInternalId',

    label: 'Netsuite restlet hooks pre Send file Internal Id',
  },
  'netsuite.restlet.hooks.preSend.function': {
    type: 'text',

    name: '/netsuite/restlet/hooks/preSend/function',

    label: 'Netsuite restlet hooks pre Send function',
  },
  'netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',

    name: '/netsuite/restlet/hooks/preSend/configuration',

    label: 'Netsuite restlet hooks pre Send configuration',
  },
  'netsuite.distributed.recordType': {
    type: 'text',

    name: '/netsuite/distributed/recordType',

    label: 'Netsuite distributed record Type',
  },
  'netsuite.distributed.executionContexts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/netsuite/distributed/executionContexts',

    label: 'Netsuite distributed execution Context',

    validWhen: [],
  },
  'netsuite.distributed.disabled': {
    type: 'checkbox',

    name: '/netsuite/distributed/disabled',

    label: 'Netsuite distributed disabled',
  },
  'netsuite.distributed.executionTypes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/netsuite/distributed/executionTypes',

    label: 'Netsuite distributed execution Type',

    validWhen: [],
  },
  'netsuite.distributed.qualifier': {
    type: 'text',

    name: '/netsuite/distributed/qualifier',

    label: 'Netsuite distributed qualifier',
  },
  'netsuite.distributed.hooks.preSend.fileInternalId': {
    type: 'text',

    name: '/netsuite/distributed/hooks/preSend/fileInternalId',

    label: 'Netsuite distributed hooks pre Send file Internal Id',
  },
  'netsuite.distributed.hooks.preSend.function': {
    type: 'text',

    name: '/netsuite/distributed/hooks/preSend/function',

    label: 'Netsuite distributed hooks pre Send function',
  },
  'netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',

    name: '/netsuite/distributed/hooks/preSend/configuration',

    label: 'Netsuite distributed hooks pre Send configuration',
  },
  'netsuite.distributed.sublists': {
    type: 'text',

    name: '/netsuite/distributed/sublists',

    label: 'Netsuite distributed sublists',
  },
  'netsuite.distributed.forceReload': {
    type: 'checkbox',

    name: '/netsuite/distributed/forceReload',

    label: 'Netsuite distributed force Reload',
  },
  'netsuite.distributed.ioEnvironment': {
    type: 'text',

    name: '/netsuite/distributed/ioEnvironment',

    label: 'Netsuite distributed io Environment',
  },
  'netsuite.distributed.lastSyncedDate': {
    type: 'text',

    name: '/netsuite/distributed/lastSyncedDate',

    label: 'Netsuite distributed last Synced Date',
  },
  'netsuite.distributed.settings': {
    type: 'text',

    name: '/netsuite/distributed/settings',

    label: 'Netsuite distributed settings',
  },
  'netsuite.getList[].typeId': {
    type: 'text',

    name: '/netsuite/getList/typeId',

    label: 'Netsuite get List type Id',
  },
  'netsuite.getList.internalId': {
    type: 'text',

    name: '/netsuite/getList/internalId',

    label: 'Netsuite get List internal Id',
  },
  'netsuite.getList.externalId': {
    type: 'text',

    name: '/netsuite/getList/externalId',

    label: 'Netsuite get List external Id',
  },
  'netsuite.searchPreferences.bodyFieldsOnly': {
    type: 'checkbox',

    name: '/netsuite/searchPreferences/bodyFieldsOnly',

    label: 'Netsuite search Preferences body Fields Only',
  },
  'netsuite.searchPreferences.pageSize': {
    type: 'text',

    name: '/netsuite/searchPreferences/pageSize',

    label: 'Netsuite search Preferences page Size',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.searchPreferences.returnSearchColumns': {
    type: 'checkbox',

    name: '/netsuite/searchPreferences/returnSearchColumns',

    label: 'Netsuite search Preferences return Search Columns',
  },
  // #endregion netsuite
  // #region rdbms
  'rdbms.query': {
    type: 'text',

    name: '/rdbms/query',

    label: 'Rdbms query',
  },
  'rdbms.once.query': {
    type: 'text',

    name: '/rdbms/once/query',

    label: 'Rdbms once query',
  },
  // #endregion rdbms
  // #region s3
  's3.region': {
    type: 'select',

    name: '/s3/region',

    label: 'S3 region',

    options: [
      {
        items: [
          { label: 'Us-east-1', value: 'us-east-1' },
          { label: 'Us-east-2', value: 'us-east-2' },
          { label: 'Us-west-1', value: 'us-west-1' },
          { label: 'Us-west-2', value: 'us-west-2' },
          { label: 'Ca-central-1', value: 'ca-central-1' },
          { label: 'Ap-south-1', value: 'ap-south-1' },
          { label: 'Ap-northeast-2', value: 'ap-northeast-2' },
          { label: 'Ap-southeast-1', value: 'ap-southeast-1' },
          { label: 'Ap-southeast-2', value: 'ap-southeast-2' },
          { label: 'Ap-northeast-1', value: 'ap-northeast-1' },
          { label: 'Eu-central-1', value: 'eu-central-1' },
          { label: 'Eu-west-1', value: 'eu-west-1' },
          { label: 'Eu-west-2', value: 'eu-west-2' },
          { label: 'Sa-east-1', value: 'sa-east-1' },
          { label: 'Cn-north-1', value: 'cn-north-1' },
        ],
      },
    ],
  },
  's3.bucket': {
    type: 'text',

    name: '/s3/bucket',

    label: 'S3 bucket',
  },
  's3.keyStartsWith': {
    type: 'text',

    name: '/s3/keyStartsWith',

    label: 'S3 key Starts With',
  },
  's3.keyEndsWith': {
    type: 'text',

    name: '/s3/keyEndsWith',

    label: 'S3 key Ends With',
  },
  's3.backupBucket': {
    type: 'text',

    name: '/s3/backupBucket',

    label: 'S3 backup Bucket',
  },
  // #endregion s3
  // #region salesforce
  'salesforce.sObjectType': {
    type: 'text',

    name: '/salesforce/sObjectType',

    label: 'Salesforce s Object Type',
  },
  'salesforce.id': {
    type: 'text',

    name: '/salesforce/id',

    label: 'Salesforce id',
  },
  'salesforce.api': {
    type: 'radiogroup',

    name: '/salesforce/api',

    label: 'Salesforce api',

    options: [
      {
        items: [
          { label: 'Rest', value: 'rest' },
          { label: 'Soap', value: 'soap' },
        ],
      },
    ],
  },
  'salesforce.soql.query': {
    type: 'text',

    name: '/salesforce/soql/query',

    label: 'Salesforce soql query',
  },
  'salesforce.distributed.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/salesforce/distributed/referencedFieldss',

    label: 'Salesforce distributed referenced Fields',

    validWhen: [],
  },
  'salesforce.distributed.disabled': {
    type: 'checkbox',

    name: '/salesforce/distributed/disabled',

    label: 'Salesforce distributed disabled',
  },
  'salesforce.distributed.connectorId': {
    type: 'text',

    name: '/salesforce/distributed/connectorId',

    label: 'Salesforce distributed connector Id',
  },
  'salesforce.distributed.userDefinedReferencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/salesforce/distributed/userDefinedReferencedFieldss',

    label: 'Salesforce distributed user Defined Referenced Fields',

    validWhen: [],
  },
  'salesforce.distributed.qualifier': {
    type: 'text',

    name: '/salesforce/distributed/qualifier',

    label: 'Salesforce distributed qualifier',
  },
  'salesforce.distributed.relatedLists.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/salesforce/distributed/relatedLists/referencedFieldss',

    label: 'Salesforce distributed related Lists referenced Fields',

    validWhen: [],
  },
  'salesforce.distributed.relatedLists.parentField': {
    type: 'text',

    name: '/salesforce/distributed/relatedLists/parentField',

    label: 'Salesforce distributed related Lists parent Field',
  },
  'salesforce.distributed.relatedLists.sObjectType': {
    type: 'text',

    name: '/salesforce/distributed/relatedLists/sObjectType',

    label: 'Salesforce distributed related Lists s Object Type',
  },
  'salesforce.distributed.relatedLists.filter': {
    type: 'text',

    name: '/salesforce/distributed/relatedLists/filter',

    label: 'Salesforce distributed related Lists filter',
  },
  'salesforce.distributed.relatedLists.orderBy': {
    type: 'text',

    name: '/salesforce/distributed/relatedLists/orderBy',

    label: 'Salesforce distributed related Lists order By',
  },
  'salesforce.distributed.relatedLists.userDefined': {
    type: 'text',

    name: '/salesforce/distributed/relatedLists/userDefined',

    label: 'Salesforce distributed related Lists user Defined',
  },
  // #endregion salesforce
  // #region wrapper
  'wrapper.function': {
    type: 'text',

    name: '/wrapper/function',

    label: 'Wrapper function',
  },
  'wrapper.configuration': {
    type: 'text',

    name: '/wrapper/configuration',

    label: 'Wrapper configuration',
  },
  // #endregion wrapper
  // #region mongodb
  'mongodb.method': {
    type: 'radiogroup',

    name: '/mongodb/method',

    label: 'Mongodb method',

    options: [{ items: [{ label: 'Find', value: 'find' }] }],
  },
  'mongodb.collection': {
    type: 'text',

    name: '/mongodb/collection',

    label: 'Mongodb collection',
  },
  'mongodb.filter': {
    type: 'text',

    name: '/mongodb/filter',

    label: 'Mongodb filter',
  },
  'mongodb.projection': {
    type: 'text',

    name: '/mongodb/projection',

    label: 'Mongodb projection',
  },
  // #endregion mongodb
  // #region as2
  'as2.fileKey': {
    type: 'text',

    name: '/as2/fileKey',

    label: 'As2 file Key',
  },
  // #endregion as2
};
