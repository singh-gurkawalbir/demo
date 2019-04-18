export default {
  // #region common
  name: {
    type: 'text',
    label: 'Name',
  },
  // adaptor type has export appended to it
  // strip it off and lowercase the connection type
  _connectionId: {
    type: 'selectresource',
    label: 'Connection',
    resourceType: 'connections',
    filter: r => {
      const removedExport = r.adaptorType.replace('Export', '');
      const type = removedExport.toLowerCase();

      return { type };
    },
    // excludeFilter: r => ({ _id: r._id }),
  },
  // Todo why helpKey is it named csv file id like to change it to
  // something meaningful
  uploadFile: {
    type: 'uploadFile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
    //
  },
  'ftp.exportFrom': {
    type: 'labelTitle',
    label: 'Where would you like to export data from?',
  },

  description: {
    type: 'text',
    label: 'Description',
  },
  asynchronous: {
    type: 'checkbox',
    label: 'Asynchronous',
  },
  apiIdentifier: {
    type: 'text',
    label: 'Api Identifier',
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
          { label: 'Simple', value: 'simple' },
          { label: 'Blob', value: 'blob' },
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
    type: 'editor',
    label: 'Sample Data',
  },
  originSampleData: {
    type: 'text',
    label: 'Origin Sample Data',
  },
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
    type: 'text',
    label: 'Delta date Field',
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
    label: 'Delta lag Offset',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'delta.endDateField': {
    type: 'text',
    label: 'Delta end Date Field',
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    type: 'text',
    label: 'Once boolean Field',
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
  'ftp.exportHooks': {
    label: 'Hooks (Optional, Developers Only)',
    type: 'labelTitle',
  },
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
  'ftp.exportTransformRecords': {
    label: 'Would you like to transform the records?',
    type: 'labelTitle',
  },
  'transform.expression.rules': {
    type: 'transformeditor',
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
  // #endregion filter
  // #region file
  csvFile: {
    label: 'Sample File (that would be exported):',
    type: 'uploadFile',
  },
  'file.extractFile': {
    type: 'checkbox',
    label: 'Decompress Files',
  },

  'file.encoding': {
    type: 'select',
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
    label: 'File type',
    options: [
      {
        items: [
          { label: 'Csv', value: 'csv' },
          { label: 'Json', value: 'json' },
          { label: 'Xlsx', value: 'xlsx' },
          { label: 'Xml', value: 'xml' },
          // { label: 'Filedefinition', value: 'filedefinition' },
          { label: 'Edi', value: 'edi' },
          { label: 'Fixed width', value: 'fixedWidth' },
        ],
      },
    ],
  },
  'file.output': {
    type: 'select',
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
    label: 'Leave File On Server',
  },
  'file.compressionFormat': {
    type: 'checkbox',
    label: 'File compression Format',
    options: [{ items: [{ label: 'Gzip', value: 'gzip' }] }],
  },
  'file.csv': {
    type: 'csvparse',
    label: 'Configure CSV parse options',
    sampleData: r => r.sampleData,
  },
  'file.csv.columnDelimiter': {
    type: 'text',
    label: 'File csv column Delimiter',
  },
  'file.csv.rowDelimiter': {
    type: 'text',
    label: 'File csv row Delimiter',
  },
  'file.csv.keyColumnss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'File csv key Columns',
    validWhen: [],
  },
  'file.csv.hasHeaderRow': {
    type: 'checkbox',
    label: 'File csv has Header Row',
  },
  'file.csv.trimSpaces': {
    type: 'checkbox',
    label: 'File csv trim Spaces',
  },
  'file.csv.rowsToSkip': {
    type: 'text',
    label: 'File csv rows To Skip',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'file.json.resourcePath': {
    type: 'text',
    label: 'File json resource Path',
  },
  'file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    label: 'File xlsx has Header Row',
  },
  'file.xlsx.keyColumns': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'File xlsx key Columns',
    validWhen: [],
  },
  'file.xml.resourcePath': {
    type: 'text',
    label: 'File xml resource Path',
  },
  'file.fileDefinition.resourcePath': {
    type: 'text',
    label: 'File file Definition resource Path',
  },
  'file.fileDefinition._fileDefinitionId': {
    type: 'text',
    label: 'File file Definition _file Definition Id',
  },
  'file.purgeInternalBackup': {
    type: 'checkbox',
    label: 'File purge Internal Backup',
  },
  // #endregion file
  // #region rest
  'rest.relativeURI': {
    type: 'text',
    label: 'Rest relative URI',
  },
  'rest.method': {
    type: 'select',
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
    label: 'Rest post Body',
  },
  'rest.resourcePath': {
    type: 'text',
    label: 'Rest resource Path',
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Rest headers',
  },
  'rest.allowUndefinedResource': {
    type: 'checkbox',
    label: 'Rest allow Undefined Resource',
  },
  'rest.pagingMethod': {
    type: 'select',
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
    label: 'Rest next Page Path',
  },
  'rest.linkHeaderRelation': {
    type: 'text',
    label: 'Rest link Header Relation',
  },
  'rest.nextPageRelativeURI': {
    type: 'text',
    label: 'Rest next Page Relative URI',
  },
  'rest.pageArgument': {
    type: 'text',
    label: 'Rest page Argument',
  },
  'rest.pagingPostBody': {
    type: 'text',
    label: 'Rest paging Post Body',
  },
  'rest.maxPagePath': {
    type: 'text',
    label: 'Rest max Page Path',
  },
  'rest.maxCountPath': {
    type: 'text',
    label: 'Rest max Count Path',
  },
  'rest.skipArgument': {
    type: 'text',
    label: 'Rest skip Argument',
  },
  'rest.blobFormat': {
    type: 'text',
    label: 'Rest blob Format',
  },
  'rest.successPath': {
    type: 'text',
    label: 'Rest success Path',
  },
  'rest.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Rest success Values',
    validWhen: [],
  },
  'rest.lastPageStatusCode': {
    type: 'text',
    label: 'Rest last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.lastPagePath': {
    type: 'text',
    label: 'Rest last Page Path',
  },
  'rest.lastPageValue': {
    type: 'text',
    label: 'Rest last Page Value',
  },
  'rest.once.relativeURI': {
    type: 'text',
    label: 'Rest once relative URI',
  },
  'rest.once.method': {
    type: 'radiogroup',
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
    label: 'Rest once post Body',
  },
  // #endregion rest
  // #region ftp
  'ftp.directoryPath': {
    type: 'text',
    label: 'Ftp directory Path',
  },
  'ftp.fileNameStartsWith': {
    type: 'text',
    label: 'Ftp file Name Starts With',
  },
  'ftp.fileNameEndsWith': {
    type: 'text',
    label: 'Ftp file Name Ends With',
  },
  'ftp.backupDirectoryPath': {
    type: 'text',
    label: 'Ftp backup Directory Path',
  },
  'ftp.exportSampleDataLabel': {
    type: 'labelTitle',
    label: 'What data would you like to Export?',
  },
  // #endregion ftp
  // #region http
  'http.successMediaType': {
    type: 'select',
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
    label: 'Http relative URI',
  },
  'http.method': {
    type: 'select',
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
    label: 'Http body',
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Http headers',
  },
  'http.paging.method': {
    type: 'select',
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
    label: 'Http paging skip',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.page': {
    type: 'text',
    label: 'Http paging page',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.token': {
    type: 'text',
    label: 'Http paging token',
  },
  'http.paging.path': {
    type: 'text',
    label: 'Http paging path',
  },
  'http.paging.relativeURI': {
    type: 'text',
    label: 'Http paging relative URI',
  },
  'http.paging.pathAfterFirstRequest': {
    type: 'text',
    label: 'Http paging path After First Request',
  },
  'http.paging.resourcePath': {
    type: 'text',
    label: 'Http paging resource Path',
  },
  'http.paging.maxPagePath': {
    type: 'text',
    label: 'Http paging max Page Path',
  },
  'http.paging.maxCountPath': {
    type: 'text',
    label: 'Http paging max Count Path',
  },
  'http.paging.lastPageStatusCode': {
    type: 'text',
    label: 'Http paging last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.lastPagePath': {
    type: 'text',
    label: 'Http paging last Page Path',
  },
  'http.paging.lastPageValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http paging last Page Values',
    validWhen: [],
  },
  'http.paging.linkHeaderRelation': {
    type: 'text',
    label: 'Http paging link Header Relation',
  },
  'http._asyncHelperId': {
    type: 'text',
    label: 'Http _async Helper Id',
  },
  'http.once.relativeURI': {
    type: 'text',
    label: 'Http once relative URI',
  },
  'http.once.method': {
    type: 'select',
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
    label: 'Http once body',
  },
  'http.response.resourcePath': {
    type: 'text',
    label: 'Http response resource Path',
  },
  'http.response.resourceIdPath': {
    type: 'text',
    label: 'Http response resource Id Path',
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Http response success Path',
  },
  'http.response.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http response success Values',
    validWhen: [],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Http response error Path',
  },
  'http.response.blobFormat': {
    type: 'text',
    label: 'Http response blob Format',
  },
  // #endregion http
  // #region netsuite
  'netsuite.searchess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite searches',
    validWhen: [],
  },
  'netsuite.metadata': {
    type: 'text',
    label: 'Netsuite metadata',
  },
  'netsuite.selectoption': {
    type: 'text',
    label: 'Netsuite selectoption',
  },
  'netsuite.customFieldMetadata': {
    type: 'text',
    label: 'Netsuite custom Field Metadata',
  },
  'netsuite.skipGrouping': {
    type: 'checkbox',
    label: 'Netsuite skip Grouping',
  },
  'netsuite.statsOnly': {
    type: 'checkbox',
    label: 'Netsuite stats Only',
  },
  'netsuite.internalId': {
    type: 'text',
    label: 'Netsuite internal Id',
  },
  'netsuite.restlet.recordType': {
    type: 'text',
    label: 'Netsuite restlet record Type',
  },
  'netsuite.restlet.searchId': {
    type: 'text',
    label: 'Netsuite restlet search Id',
  },
  'netsuite.restlet.criteria.field': {
    type: 'text',
    label: 'Netsuite restlet criteria field',
  },
  'netsuite.restlet.criteria.join': {
    type: 'text',
    label: 'Netsuite restlet criteria join',
  },
  'netsuite.restlet.criteria.operator': {
    type: 'text',
    label: 'Netsuite restlet criteria operator',
  },
  'netsuite.restlet.criteria.searchValue': {
    type: 'text',
    label: 'Netsuite restlet criteria search Value',
  },
  'netsuite.restlet.criteria.searchValue2': {
    type: 'text',
    label: 'Netsuite restlet criteria search Value2',
  },
  'netsuite.restlet.batchSize': {
    type: 'text',
    label: 'Netsuite restlet batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.batchSize': {
    type: 'text',
    label: 'Netsuite restlet hooks batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.restlet.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send file Internal Id',
  },
  'netsuite.restlet.hooks.preSend.function': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send function',
  },
  'netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',
    label: 'Netsuite restlet hooks pre Send configuration',
  },
  'netsuite.distributed.recordType': {
    type: 'text',
    label: 'Netsuite distributed record Type',
  },
  'netsuite.distributed.executionContexts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite distributed execution Context',
    validWhen: [],
  },
  'netsuite.distributed.disabled': {
    type: 'checkbox',
    label: 'Netsuite distributed disabled',
  },
  'netsuite.distributed.executionTypes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Netsuite distributed execution Type',
    validWhen: [],
  },
  'netsuite.distributed.qualifier': {
    type: 'text',
    label: 'Netsuite distributed qualifier',
  },
  'netsuite.distributed.hooks.preSend.fileInternalId': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send file Internal Id',
  },
  'netsuite.distributed.hooks.preSend.function': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send function',
  },
  'netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',
    label: 'Netsuite distributed hooks pre Send configuration',
  },
  'netsuite.distributed.sublists': {
    type: 'text',
    label: 'Netsuite distributed sublists',
  },
  'netsuite.distributed.forceReload': {
    type: 'checkbox',
    label: 'Netsuite distributed force Reload',
  },
  'netsuite.distributed.ioEnvironment': {
    type: 'text',
    label: 'Netsuite distributed io Environment',
  },
  'netsuite.distributed.lastSyncedDate': {
    type: 'text',
    label: 'Netsuite distributed last Synced Date',
  },
  'netsuite.distributed.settings': {
    type: 'text',
    label: 'Netsuite distributed settings',
  },
  'netsuite.getList[].typeId': {
    type: 'text',
    label: 'Netsuite get List type Id',
  },
  'netsuite.getList.internalId': {
    type: 'text',
    label: 'Netsuite get List internal Id',
  },
  'netsuite.getList.externalId': {
    type: 'text',
    label: 'Netsuite get List external Id',
  },
  'netsuite.searchPreferences.bodyFieldsOnly': {
    type: 'checkbox',
    label: 'Netsuite search Preferences body Fields Only',
  },
  'netsuite.searchPreferences.pageSize': {
    type: 'text',
    label: 'Netsuite search Preferences page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.searchPreferences.returnSearchColumns': {
    type: 'checkbox',
    label: 'Netsuite search Preferences return Search Columns',
  },
  // #endregion netsuite
  // #region rdbms
  'rdbms.query': {
    type: 'text',
    label: 'Rdbms query',
  },
  'rdbms.once.query': {
    type: 'text',
    label: 'Rdbms once query',
  },
  // #endregion rdbms
  // #region s3
  's3.region': {
    type: 'select',
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
    label: 'S3 bucket',
  },
  's3.keyStartsWith': {
    type: 'text',
    label: 'S3 key Starts With',
  },
  's3.keyEndsWith': {
    type: 'text',
    label: 'S3 key Ends With',
  },
  's3.backupBucket': {
    type: 'text',
    label: 'S3 backup Bucket',
  },
  // #endregion s3
  // #region salesforce
  'salesforce.sObjectType': {
    type: 'text',
    label: 'Salesforce s Object Type',
  },
  'salesforce.id': {
    type: 'text',
    label: 'Salesforce id',
  },
  'salesforce.api': {
    type: 'radiogroup',
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
    label: 'Salesforce soql query',
  },
  'salesforce.distributed.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.disabled': {
    type: 'checkbox',
    label: 'Salesforce distributed disabled',
  },
  'salesforce.distributed.connectorId': {
    type: 'text',
    label: 'Salesforce distributed connector Id',
  },
  'salesforce.distributed.userDefinedReferencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed user Defined Referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.qualifier': {
    type: 'text',
    label: 'Salesforce distributed qualifier',
  },
  'salesforce.distributed.relatedLists.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce distributed related Lists referenced Fields',
    validWhen: [],
  },
  'salesforce.distributed.relatedLists.parentField': {
    type: 'text',
    label: 'Salesforce distributed related Lists parent Field',
  },
  'salesforce.distributed.relatedLists.sObjectType': {
    type: 'text',
    label: 'Salesforce distributed related Lists s Object Type',
  },
  'salesforce.distributed.relatedLists.filter': {
    type: 'text',
    label: 'Salesforce distributed related Lists filter',
  },
  'salesforce.distributed.relatedLists.orderBy': {
    type: 'text',
    label: 'Salesforce distributed related Lists order By',
  },
  'salesforce.distributed.relatedLists.userDefined': {
    type: 'text',
    label: 'Salesforce distributed related Lists user Defined',
  },
  // #endregion salesforce
  // #region wrapper
  'wrapper.function': {
    type: 'text',
    label: 'Wrapper function',
  },
  'wrapper.configuration': {
    type: 'text',
    label: 'Wrapper configuration',
  },
  // #endregion wrapper
  // #region mongodb
  'mongodb.method': {
    type: 'radiogroup',
    label: 'Mongodb method',
    options: [{ items: [{ label: 'Find', value: 'find' }] }],
  },
  'mongodb.collection': {
    type: 'text',
    label: 'Mongodb collection',
  },
  'mongodb.filter': {
    type: 'text',
    label: 'Mongodb filter',
  },
  'mongodb.projection': {
    type: 'text',
    label: 'Mongodb projection',
  },
  // #endregion mongodb
  // #region as2
  'as2.fileKey': {
    type: 'text',
    label: 'As2 file Key',
  },
  // #endregion as2
};
