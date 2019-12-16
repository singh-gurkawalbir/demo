export default {
  name: { type: 'text', label: 'Name' },
  description: { type: 'text', label: 'Description' },
  apiIdentifier: {
    label: 'Invoke this Import [POST]',
    type: 'apiidentifier',
  },
  mapping: {
    type: 'mapping',
    connectionId: r => r && r._connectionId,
    label: 'Manage Import Mapping',
  },
  sampleData: { type: 'text', label: 'Sample Data' },
  distributed: {
    type: 'text',
    label: 'Distributed',
    defaultValue: true,
    visible: false,
  },
  maxAttempts: {
    type: 'text',
    label: 'Max Attempts',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  ignoreExisting: {
    type: 'checkbox',
    label: 'Ignore Existing',
  },
  ignoreMissing: {
    type: 'checkbox',
    label: 'Ignore Missing',
  },
  idLockTemplate: {
    type: 'relativeuri',
    label: 'Concurrency Id Lock Template',
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URITemplate',
    placeholder: 'Optional',
    connectionId: r => r && r._connectionId,
  },
  oneToMany: {
    type: 'radiogroup',
    label:
      'Does each individual record being processed translate to multiple records in the import application?',
    defaultValue: r => (r && r.oneToMany ? 'true' : 'false'),
    options: [
      {
        items: [
          { label: 'Yes(Advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  pathToMany: {
    type: 'text',
    label:
      'if records being processed are represented by Objects then please specify the JSON path to be child records',
    placeholder: 'Optional. Not needed for row/array formats.',
    visibleWhen: [
      {
        field: 'oneToMany',
        is: ['true'],
      },
    ],
    validWhen: [
      {
        field: 'oneToMany',
        is: ['true'],
      },
    ],
  },
  blobKeyPath: {
    type: 'text',
    label: 'Blob Key Path',
    placeholder: 'Blob Key Path',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    required: true,
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
          { label: 'Magento 2', value: 'magento' },
          { label: 'Mailchimp', value: 'mailchimp' },
          { label: 'Mediaocean', value: 'mediaocean' },
          { label: 'Namely', value: 'namely' },
          { label: 'NetSuite', value: 'netsuite' },
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
  deleteAfterImport: {
    type: 'checkbox',
    label: 'Purge Blob data immediately?',
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant Metadata',
  },
  useTechAdaptorForm: {
    type: 'checkbox',
    label: 'Use Tech Adaptor Form',
    defaultValue: false,
  },
  sampleResponseData: {
    type: 'text',
    label: 'Sample Response Data',
  },
  modelMetadata: { type: 'text', label: 'Model metadata' },
  adaptorType: { type: 'text', label: 'Adaptor type' },
  // #endregion common
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
  // #region parsers[*]
  'parsers[*].version': {
    type: 'text',
    label: 'Parsers[*] version',
  },
  'parsers[*].rules': {
    type: 'text',
    label: 'Parsers[*] rules',
  },
  // #endregion parsers[*]
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
  'hooks.preMap.function': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.preMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.preMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.preMap._scriptId': {
    type: 'selectresource',
    label: 'Pre Map Script',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preMap._stackId': {
    label: 'Pre Map Stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.preMap.configuration': {
    type: 'text',
    label: 'Pre Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.function': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postMap._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postMap._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postMap._scriptId': {
    label: 'Post Map Script',
    type: 'selectresource',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postMap._stackId': {
    label: 'Post Map Stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postMap.configuration': {
    type: 'text',
    label: 'Post Map',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.function': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postSubmit._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postSubmit._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postSubmit._scriptId': {
    label: 'Post Submit Script',
    type: 'selectresource',
    resourceType: 'scripts',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postSubmit._stackId': {
    label: 'Post Submit Stack',
    type: 'selectresource',
    resourceType: 'stacks',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postSubmit.configuration': {
    type: 'text',
    label: 'Post Submit',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postAggregate.function': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
    requiredWhen: [
      {
        field: 'hooks.postAggregate._scriptId',
        isNot: [''],
      },
      {
        field: 'hooks.postAggregate._stackId',
        isNot: [''],
      },
    ],
  },
  'hooks.postAggregate._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    label: 'Post Aggregate Script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.postAggregate._stackId': {
    type: 'selectresource',
    resourceType: 'stacks',
    label: 'Post Aggregate Stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  'hooks.postAggregate.configuration': {
    type: 'text',
    label: 'Post Aggregate',
    placeholder: 'Function Name',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },
  // #endregion hooks
  // #region responseTransform
  'responseTransform.expression.version': {
    type: 'radiogroup',
    label: 'Response Transform expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'responseTransform.expression.rules': {
    type: 'text',
    label: 'Response Transform expression rules',
  },
  'responseTransform.script._scriptId': {
    type: 'text',
    label: 'Response Transform script _script Id',
  },
  'responseTransform.script.function': {
    type: 'text',
    label: 'Response Transform script function',
  },
  // #endregion responseTransform
  // #region mapping
  'mapping.fields[*].extract': {
    type: 'text',
    label: 'Mapping fields[*] extract',
  },
  'mapping.fields[*].extractDateFormat': {
    type: 'text',
    label: 'Mapping fields[*] extract Date Format',
  },
  'mapping.fields[*].extractDateTimezone': {
    type: 'text',
    label: 'Mapping fields[*] extract Date Timezone',
  },
  'mapping.fields[*].generate': {
    type: 'text',
    label: 'Mapping fields[*] generate',
  },
  'mapping.fields[*].generateDateFormat': {
    type: 'text',
    label: 'Mapping fields[*] generate Date Format',
  },
  'mapping.fields[*].generateDateTimezone': {
    type: 'text',
    label: 'Mapping fields[*] generate Date Timezone',
  },
  'mapping.fields[*].hardCodedValue': {
    type: 'text',
    label: 'Mapping fields[*] hard Coded Value',
  },
  'mapping.fields[*].immutable': {
    type: 'text',
    label: 'Mapping fields[*] immutable',
  },
  'mapping.fields[*].lookupName': {
    type: 'text',
    label: 'Mapping fields[*] lookup Name',
  },
  'mapping.fields[*].dataType': {
    type: 'text',
    label: 'Mapping fields[*] data Type',
  },
  'mapping.fields[*].default': {
    type: 'text',
    label: 'Mapping fields[*] default',
  },
  'mapping.fields[*].conditional.lookupName': {
    type: 'text',
    label: 'Mapping fields[*] conditional lookup Name',
  },
  'mapping.fields[*].conditional.when': {
    type: 'text',
    label: 'Mapping fields[*] conditional when',
  },
  'mapping.fields[*].conditional.expression': {
    type: 'text',
    label: 'Mapping fields[*] conditional expression',
  },
  'mapping.fields[*].discardIfEmpty': {
    type: 'text',
    label: 'Mapping fields[*] discard If Empty',
  },
  'mapping.lists[*].generate': {
    type: 'text',
    label: 'Mapping lists[*] generate',
  },
  'mapping.lists[*].fields[*].extract': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] extract',
  },
  'mapping.lists[*].fields[*].extractDateFormat': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] extract Date Format',
  },
  'mapping.lists[*].fields[*].extractDateTimezone': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] extract Date Timezone',
  },
  'mapping.lists[*].fields[*].generate': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] generate',
  },
  'mapping.lists[*].fields[*].generateDateFormat': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] generate Date Format',
  },
  'mapping.lists[*].fields[*].generateDateTimezone': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] generate Date Timezone',
  },
  'mapping.lists[*].fields[*].hardCodedValue': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] hard Coded Value',
  },
  'mapping.lists[*].fields[*].immutable': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] immutable',
  },
  'mapping.lists[*].fields[*].lookupName': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] lookup Name',
  },
  'mapping.lists[*].fields[*].dataType': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] data Type',
  },
  'mapping.lists[*].fields[*].default': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] default',
  },
  'mapping.lists[*].fields[*].conditional.lookupName': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] conditional lookup Name',
  },
  'mapping.lists[*].fields[*].conditional.when': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] conditional when',
  },
  'mapping.lists[*].fields[*].conditional.expression': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] conditional expression',
  },
  'mapping.lists[*].fields[*].discardIfEmpty': {
    type: 'text',
    label: 'Mapping lists[*] fields[*] discard If Empty',
  },
  // #endregion mapping
  // #region lookups[*]
  'lookups[*].name': {
    type: 'text',
    label: 'Lookups[*] name',
  },
  'lookups[*].map': {
    type: 'text',
    label: 'Lookups[*] map',
  },
  'lookups[*].default': {
    type: 'text',
    label: 'Lookups[*] default',
  },
  'lookups[*].allowFailures': {
    type: 'text',
    label: 'Lookups[*] allow Failures',
  },
  'lookups[*].relativeURI': {
    type: 'text',
    label: 'Lookups[*] relative URI',
  },
  'lookups[*].method': {
    type: 'text',
    label: 'Lookups[*] method',
  },
  'lookups[*].postBody': {
    type: 'text',
    label: 'Lookups[*] post Body',
  },
  'lookups[*].extract': {
    type: 'text',
    label: 'Lookups[*] extract',
  },
  'lookups[*].body': {
    type: 'text',
    label: 'Lookups[*] body',
  },
  'lookups[*].useDefaultOnMultipleMatches': {
    type: 'text',
    label: 'Lookups[*] use Default On Multiple Matches',
  },
  'lookups[*].recordType': {
    type: 'text',
    label: 'Lookups[*] record Type',
  },
  'lookups[*].searchField': {
    type: 'text',
    label: 'Lookups[*] search Field',
  },
  'lookups[*].expression': {
    type: 'text',
    label: 'Lookups[*] expression',
  },
  'lookups[*].resultField': {
    type: 'text',
    label: 'Lookups[*] result Field',
  },
  'lookups[*].includeInactive': {
    type: 'text',
    label: 'Lookups[*] include Inactive',
  },
  'lookups[*].query': {
    type: 'text',
    label: 'Lookups[*] query',
  },
  'lookups[*].sObjectType': {
    type: 'text',
    label: 'Lookups[*] s Object Type',
  },
  'lookups[*].whereClause': {
    type: 'text',
    label: 'Lookups[*] where Clause',
  },
};
