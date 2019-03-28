export default {
  // #region common
  'export.name': {
    type: 'text',
    helpKey: 'export.name',
    name: '/name',
    id: 'export.name',
    label: 'Name',
    defaultValue: r => r && r.name,
  },

  'export._connectionId': {
    type: 'selectresource',
    helpKey: 'export._connectionId',
    name: '/_connectionId',
    label: 'Connection',
    id: 'export._connectionId',
    resourceType: 'connections',
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _id: r._id }),
    defaultValue: r => r._connectionId,
  },
  'export.description': {
    type: 'text',
    helpKey: 'export.description',
    name: '/description',
    id: 'export.description',
    label: 'Description',
    defaultValue: r => r && r.description,
  },
  'export.asynchronous': {
    type: 'checkbox',
    helpKey: 'export.asynchronous',
    name: '/asynchronous',
    id: 'export.asynchronous',
    label: 'Asynchronous',
    defaultValue: false,
  },
  'export.apiIdentifier': {
    type: 'text',
    helpKey: 'export.apiIdentifier',
    name: '/apiIdentifier',
    id: 'export.apiIdentifier',
    label: 'Api Identifier',
    defaultValue: r => r && r.apiIdentifier,
  },
  'export.type': {
    type: 'select',
    helpKey: 'export.type',
    name: '/type',
    id: 'export.type',
    label: 'Type',
    defaultValue: r => r && r.type,
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
  'export.pageSize': {
    type: 'text',
    helpKey: 'export.pageSize',
    name: '/pageSize',
    id: 'export.pageSize',
    label: 'Page Size',
    defaultValue: r => r && r.pageSize,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.dataURITemplate': {
    type: 'text',
    helpKey: 'export.dataURITemplate',
    name: '/dataURITemplate',
    id: 'export.dataURITemplate',
    label: 'Data URITemplate',
    defaultValue: r => r && r.dataURITemplate,
  },
  'export.oneToMany': {
    type: 'checkbox',
    helpKey: 'export.oneToMany',
    name: '/oneToMany',
    id: 'export.oneToMany',
    label: 'One To Many',
    defaultValue: false,
  },
  'export.pathToMany': {
    type: 'text',
    helpKey: 'export.pathToMany',
    name: '/pathToMany',
    id: 'export.pathToMany',
    label: 'Path To Many',
    defaultValue: r => r && r.pathToMany,
  },
  'export.sampleData': {
    type: 'editor',
    helpKey: 'export.sampleData',
    name: '/sampleData',
    id: 'export.sampleData',
    label: 'Sample Data',
    defaultValue: r => r && r.sampleData,
  },
  'export.originSampleData': {
    type: 'text',
    helpKey: 'export.originSampleData',
    name: '/originSampleData',
    id: 'export.originSampleData',
    label: 'Origin Sample Data',
    defaultValue: r => r && r.originSampleData,
  },
  'export.assistant': {
    type: 'select',
    helpKey: 'export.assistant',
    name: '/assistant',
    id: 'export.assistant',
    label: 'Assistant',
    defaultValue: r => r && r.assistant,
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
  'export.assistantMetadata': {
    type: 'text',
    helpKey: 'export.assistantMetadata',
    name: '/assistantMetadata',
    id: 'export.assistantMetadata',
    label: 'Assistant Metadata',
    defaultValue: r => r && r.assistantMetadata,
  },
  'export.isLookup': {
    type: 'checkbox',
    helpKey: 'export.isLookup',
    name: '/isLookup',
    id: 'export.isLookup',
    label: 'Is Lookup',
    defaultValue: false,
  },
  'export.useTechAdaptorForm': {
    type: 'checkbox',
    helpKey: 'export.useTechAdaptorForm',
    name: '/useTechAdaptorForm',
    id: 'export.useTechAdaptorForm',
    label: 'Use Tech Adaptor Form',
    defaultValue: false,
  },
  'export.adaptorType': {
    type: 'text',
    helpKey: 'export.adaptorType',
    name: '/adaptorType',
    id: 'export.adaptorType',
    label: 'Adaptor Type',
    defaultValue: r => r && r.adaptorType,
  },
  // #endregion common
  // #region inputFilter
  'export.inputFilter.expression.version': {
    type: 'radiogroup',
    helpKey: 'export.inputFilter.expression.version',
    name: '/inputFilter/expression/version',
    id: 'export.inputFilter.expression.version',
    label: 'Input Filter expression version',
    defaultValue: r =>
      r &&
      r.inputFilter &&
      r.inputFilter.expression &&
      r.inputFilter.expression.version,
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'export.inputFilter.expression.rules': {
    type: 'text',
    helpKey: 'export.inputFilter.expression.rules',
    name: '/inputFilter/expression/rules',
    id: 'export.inputFilter.expression.rules',
    label: 'Input Filter expression rules',
    defaultValue: r =>
      r &&
      r.inputFilter &&
      r.inputFilter.expression &&
      r.inputFilter.expression.rules,
  },
  'export.inputFilter.script._scriptId': {
    type: 'text',
    helpKey: 'export.inputFilter.script._scriptId',
    name: '/inputFilter/script/_scriptId',
    id: 'export.inputFilter.script._scriptId',
    label: 'Input Filter script _script Id',
    defaultValue: r =>
      r &&
      r.inputFilter &&
      r.inputFilter.script &&
      r.inputFilter.script._scriptId,
  },
  'export.inputFilter.script.function': {
    type: 'text',
    helpKey: 'export.inputFilter.script.function',
    name: '/inputFilter/script/function',
    id: 'export.inputFilter.script.function',
    label: 'Input Filter script function',
    defaultValue: r =>
      r &&
      r.inputFilter &&
      r.inputFilter.script &&
      r.inputFilter.script.function,
  },
  // #endregion inputFilter
  // #region test
  'export.test.limit': {
    type: 'text',
    helpKey: 'export.test.limit',
    name: '/test/limit',
    id: 'export.test.limit',
    label: 'Test limit',
    defaultValue: r => r && r.test && r.test.limit,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion test
  // #region delta
  'export.delta.dateField': {
    type: 'text',
    helpKey: 'export.delta.dateField',
    name: '/delta/dateField',
    id: 'export.delta.dateField',
    label: 'Delta date Field',
    defaultValue: r => r && r.delta && r.delta.dateField,
  },
  'export.delta.dateFormat': {
    type: 'text',
    helpKey: 'export.delta.dateFormat',
    name: '/delta/dateFormat',
    id: 'export.delta.dateFormat',
    label: 'Delta date Format',
    defaultValue: r => r && r.delta && r.delta.dateFormat,
  },
  'export.delta.startDate': {
    type: 'text',
    helpKey: 'export.delta.startDate',
    name: '/delta/startDate',
    id: 'export.delta.startDate',
    label: 'Delta start Date',
    defaultValue: r => r && r.delta && r.delta.startDate,
  },
  'export.delta.lagOffset': {
    type: 'text',
    helpKey: 'export.delta.lagOffset',
    name: '/delta/lagOffset',
    id: 'export.delta.lagOffset',
    label: 'Delta lag Offset',
    defaultValue: r => r && r.delta && r.delta.lagOffset,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.delta.endDateField': {
    type: 'text',
    helpKey: 'export.delta.endDateField',
    name: '/delta/endDateField',
    id: 'export.delta.endDateField',
    label: 'Delta end Date Field',
    defaultValue: r => r && r.delta && r.delta.endDateField,
  },
  // #endregion delta
  // #region once
  'export.once.booleanField': {
    type: 'text',
    helpKey: 'export.once.booleanField',
    name: '/once/booleanField',
    id: 'export.once.booleanField',
    label: 'Once boolean Field',
    defaultValue: r => r && r.once && r.once.booleanField,
  },
  // #endregion once
  // #region valueDelta
  'export.valueDelta.exportedField': {
    type: 'text',
    helpKey: 'export.valueDelta.exportedField',
    name: '/valueDelta/exportedField',
    id: 'export.valueDelta.exportedField',
    label: 'Value Delta exported Field',
    defaultValue: r => r && r.valueDelta && r.valueDelta.exportedField,
  },
  'export.valueDelta.pendingField': {
    type: 'text',
    helpKey: 'export.valueDelta.pendingField',
    name: '/valueDelta/pendingField',
    id: 'export.valueDelta.pendingField',
    label: 'Value Delta pending Field',
    defaultValue: r => r && r.valueDelta && r.valueDelta.pendingField,
  },
  // #endregion valueDelta
  // #region webhook
  'export.webhook.provider': {
    type: 'select',
    helpKey: 'export.webhook.provider',
    name: '/webhook/provider',
    id: 'export.webhook.provider',
    label: 'Webhook provider',
    defaultValue: r => r && r.webhook && r.webhook.provider,
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
  'export.webhook.verify': {
    type: 'select',
    helpKey: 'export.webhook.verify',
    name: '/webhook/verify',
    id: 'export.webhook.verify',
    label: 'Webhook verify',
    defaultValue: r => r && r.webhook && r.webhook.verify,
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
  'export.webhook.token': {
    type: 'text',
    helpKey: 'export.webhook.token',
    name: '/webhook/token',
    id: 'export.webhook.token',
    label: 'Webhook token',
    defaultValue: r => r && r.webhook && r.webhook.token,
  },
  'export.webhook.path': {
    type: 'text',
    helpKey: 'export.webhook.path',
    name: '/webhook/path',
    id: 'export.webhook.path',
    label: 'Webhook path',
    defaultValue: r => r && r.webhook && r.webhook.path,
  },
  'export.webhook.algorithm': {
    type: 'radiogroup',
    helpKey: 'export.webhook.algorithm',
    name: '/webhook/algorithm',
    id: 'export.webhook.algorithm',
    label: 'Webhook algorithm',
    defaultValue: r => r && r.webhook && r.webhook.algorithm,
    options: [
      {
        items: [
          { label: 'Sha1', value: 'sha1' },
          { label: 'Sha256', value: 'sha256' },
        ],
      },
    ],
  },
  'export.webhook.encoding': {
    type: 'radiogroup',
    helpKey: 'export.webhook.encoding',
    name: '/webhook/encoding',
    id: 'export.webhook.encoding',
    label: 'Webhook encoding',
    defaultValue: r => r && r.webhook && r.webhook.encoding,
    options: [
      {
        items: [
          { label: 'Hex', value: 'hex' },
          { label: 'Base64', value: 'base64' },
        ],
      },
    ],
  },
  'export.webhook.key': {
    type: 'text',
    helpKey: 'export.webhook.key',
    name: '/webhook/key',
    id: 'export.webhook.key',
    label: 'Webhook key',
    defaultValue: r => r && r.webhook && r.webhook.key,
  },
  'export.webhook.header': {
    type: 'text',
    helpKey: 'export.webhook.header',
    name: '/webhook/header',
    id: 'export.webhook.header',
    label: 'Webhook header',
    defaultValue: r => r && r.webhook && r.webhook.header,
  },
  'export.webhook.username': {
    type: 'text',
    helpKey: 'export.webhook.username',
    name: '/webhook/username',
    id: 'export.webhook.username',
    label: 'Webhook username',
    defaultValue: r => r && r.webhook && r.webhook.username,
  },
  'export.webhook.password': {
    type: 'text',
    helpKey: 'export.webhook.password',
    name: '/webhook/password',
    id: 'export.webhook.password',
    label: 'Webhook password',
    defaultValue: r => r && r.webhook && r.webhook.password,
  },
  // #endregion webhook
  // #region distributed
  'export.distributed.bearerToken': {
    type: 'text',
    helpKey: 'export.distributed.bearerToken',
    name: '/distributed/bearerToken',
    id: 'export.distributed.bearerToken',
    label: 'Distributed bearer Token',
    defaultValue: r => r && r.distributed && r.distributed.bearerToken,
  },
  // #endregion distributed
  // #region hooks
  'export.hooks.preSavePage.function': {
    type: 'text',
    helpKey: 'export.hooks.preSavePage.function',
    name: '/hooks/preSavePage/function',
    id: 'export.hooks.preSavePage.function',
    label: 'Hooks pre Save Page function',
    defaultValue: r =>
      r && r.hooks && r.hooks.preSavePage && r.hooks.preSavePage.function,
  },
  'export.hooks.preSavePage._scriptId': {
    type: 'text',
    helpKey: 'export.hooks.preSavePage._scriptId',
    name: '/hooks/preSavePage/_scriptId',
    id: 'export.hooks.preSavePage._scriptId',
    label: 'Hooks pre Save Page _script Id',
    defaultValue: r =>
      r && r.hooks && r.hooks.preSavePage && r.hooks.preSavePage._scriptId,
  },
  'export.hooks.preSavePage._stackId': {
    type: 'text',
    helpKey: 'export.hooks.preSavePage._stackId',
    name: '/hooks/preSavePage/_stackId',
    id: 'export.hooks.preSavePage._stackId',
    label: 'Hooks pre Save Page _stack Id',
    defaultValue: r =>
      r && r.hooks && r.hooks.preSavePage && r.hooks.preSavePage._stackId,
  },
  'export.hooks.preSavePage.configuration': {
    type: 'text',
    helpKey: 'export.hooks.preSavePage.configuration',
    name: '/hooks/preSavePage/configuration',
    id: 'export.hooks.preSavePage.configuration',
    label: 'Hooks pre Save Page configuration',
    defaultValue: r =>
      r && r.hooks && r.hooks.preSavePage && r.hooks.preSavePage.configuration,
  },
  // #endregion hooks
  // #region transform
  'export.transform.expression.version': {
    type: 'radiogroup',
    helpKey: 'export.transform.expression.version',
    name: '/transform/expression/version',
    id: 'export.transform.expression.version',
    label: 'Transform expression version',
    defaultValue: r =>
      r &&
      r.transform &&
      r.transform.expression &&
      r.transform.expression.version,
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'export.transform.expression.rules': {
    type: 'text',
    helpKey: 'export.transform.expression.rules',
    name: '/transform/expression/rules',
    id: 'export.transform.expression.rules',
    label: 'Transform expression rules',
    defaultValue: r =>
      r &&
      r.transform &&
      r.transform.expression &&
      r.transform.expression.rules,
  },
  'export.transform.script._scriptId': {
    type: 'text',
    helpKey: 'export.transform.script._scriptId',
    name: '/transform/script/_scriptId',
    id: 'export.transform.script._scriptId',
    label: 'Transform script _script Id',
    defaultValue: r =>
      r && r.transform && r.transform.script && r.transform.script._scriptId,
  },
  'export.transform.script.function': {
    type: 'text',
    helpKey: 'export.transform.script.function',
    name: '/transform/script/function',
    id: 'export.transform.script.function',
    label: 'Transform script function',
    defaultValue: r =>
      r && r.transform && r.transform.script && r.transform.script.function,
  },
  // #endregion transform
  // #region parsers
  // parsers check
  'export.parsers.version': {
    type: 'text',
    helpKey: 'export.parsers.version',
    name: '/parsers/version',
    id: 'export.parsers.version',
    label: 'Parsers version',
    defaultValue: r => r && r.parsers && r.parsers.version,
  },
  'export.parsers.rules': {
    type: 'text',
    helpKey: 'export.parsers.rules',
    name: '/parsers/rules',
    id: 'export.parsers.rules',
    label: 'Parsers rules',
    defaultValue: r => r && r.parsers && r.parsers.rules,
  },
  // #endregion parsers
  // #region filter
  'export.filter.expression.version': {
    type: 'radiogroup',
    helpKey: 'export.filter.expression.version',
    name: '/filter/expression/version',
    id: 'export.filter.expression.version',
    label: 'Filter expression version',
    defaultValue: r =>
      r && r.filter && r.filter.expression && r.filter.expression.version,
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'export.filter.expression.rules': {
    type: 'text',
    helpKey: 'export.filter.expression.rules',
    name: '/filter/expression/rules',
    id: 'export.filter.expression.rules',
    label: 'Filter expression rules',
    defaultValue: r =>
      r && r.filter && r.filter.expression && r.filter.expression.rules,
  },
  'export.filter.script._scriptId': {
    type: 'text',
    helpKey: 'export.filter.script._scriptId',
    name: '/filter/script/_scriptId',
    id: 'export.filter.script._scriptId',
    label: 'Filter script _script Id',
    defaultValue: r =>
      r && r.filter && r.filter.script && r.filter.script._scriptId,
  },
  'export.filter.script.function': {
    type: 'text',
    helpKey: 'export.filter.script.function',
    name: '/filter/script/function',
    id: 'export.filter.script.function',
    label: 'Filter script function',
    defaultValue: r =>
      r && r.filter && r.filter.script && r.filter.script.function,
  },
  // #endregion filter
  // #region file
  'export.file.encoding': {
    type: 'select',
    helpKey: 'export.file.encoding',
    name: '/file/encoding',
    id: 'export.file.encoding',
    label: 'File encoding',
    defaultValue: r => r && r.file && r.file.encoding,
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

  'export.file.type': {
    type: 'select',
    helpKey: 'export.file.type',
    name: '/file/type',
    id: 'export.file.type',
    label: 'File type',
    defaultValue: r => r && r.file && r.file.type,
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
  'export.file.output': {
    type: 'select',
    helpKey: 'export.file.output',
    name: '/file/output',
    id: 'export.file.output',
    label: 'File output',
    defaultValue: r => r && r.file && r.file.output,
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
  'export.file.skipDelete': {
    type: 'checkbox',
    helpKey: 'export.file.skipDelete',
    name: '/file/skipDelete',
    id: 'export.file.skipDelete',
    label: 'File skip Delete',
    defaultValue: false,
  },
  'export.file.compressionFormat': {
    type: 'radiogroup',
    helpKey: 'export.file.compressionFormat',
    name: '/file/compressionFormat',
    id: 'export.file.compressionFormat',
    label: 'File compression Format',
    defaultValue: r => r && r.file && r.file.compressionFormat,
    options: [{ items: [{ label: 'Gzip', value: 'gzip' }] }],
  },
  'export.file.csv': {
    id: 'export.file.csv',
    name: '/file/csv',
    type: 'csvparse',
    helpText: 'Use this editor to preview how your parse options affect your ',
    label: 'Configure CSV parse options',
    defaultValue: r => r.file && r.file.csv,
    sampleData: r => r.sampleData,
  },
  'export.file.csv.columnDelimiter': {
    type: 'text',
    helpKey: 'export.file.csv.columnDelimiter',
    name: '/file/csv/columnDelimiter',
    id: 'export.file.csv.columnDelimiter',
    label: 'File csv column Delimiter',
    defaultValue: r => r && r.file && r.file.csv && r.file.csv.columnDelimiter,
  },
  'export.file.csv.rowDelimiter': {
    type: 'text',
    helpKey: 'export.file.csv.rowDelimiter',
    name: '/file/csv/rowDelimiter',
    id: 'export.file.csv.rowDelimiter',
    label: 'File csv row Delimiter',
    defaultValue: r => r && r.file && r.file.csv && r.file.csv.rowDelimiter,
  },
  'export.file.csv.keyColumnss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.file.csv.keyColumns',
    name: '/file/csv/keyColumnss',
    id: 'export.file.csv.keyColumnss',
    label: 'File csv key Columns',
    defaultValue: r => r && r.file && r.file.csv && r.file.csv.keyColumns,
    validWhen: [],
  },
  'export.file.csv.hasHeaderRow': {
    type: 'checkbox',
    helpKey: 'export.file.csv.hasHeaderRow',
    name: '/file/csv/hasHeaderRow',
    id: 'export.file.csv.hasHeaderRow',
    label: 'File csv has Header Row',
    defaultValue: false,
  },
  'export.file.csv.trimSpaces': {
    type: 'checkbox',
    helpKey: 'export.file.csv.trimSpaces',
    name: '/file/csv/trimSpaces',
    id: 'export.file.csv.trimSpaces',
    label: 'File csv trim Spaces',
    defaultValue: false,
  },
  'export.file.csv.rowsToSkip': {
    type: 'text',
    helpKey: 'export.file.csv.rowsToSkip',
    name: '/file/csv/rowsToSkip',
    id: 'export.file.csv.rowsToSkip',
    label: 'File csv rows To Skip',
    defaultValue: r => r && r.file && r.file.csv && r.file.csv.rowsToSkip,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.file.json.resourcePath': {
    type: 'text',
    helpKey: 'export.file.json.resourcePath',
    name: '/file/json/resourcePath',
    id: 'export.file.json.resourcePath',
    label: 'File json resource Path',
    defaultValue: r => r && r.file && r.file.json && r.file.json.resourcePath,
  },
  'export.file.xlsx.hasHeaderRow': {
    type: 'checkbox',
    helpKey: 'export.file.xlsx.hasHeaderRow',
    name: '/file/xlsx/hasHeaderRow',
    id: 'export.file.xlsx.hasHeaderRow',
    label: 'File xlsx has Header Row',
    defaultValue: false,
  },
  'export.file.xlsx.keyColumnss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.file.xlsx.keyColumns',
    name: '/file/xlsx/keyColumnss',
    id: 'export.file.xlsx.keyColumnss',
    label: 'File xlsx key Columns',
    defaultValue: r => r && r.file && r.file.xlsx && r.file.xlsx.keyColumns,
    validWhen: [],
  },
  'export.file.xml.resourcePath': {
    type: 'text',
    helpKey: 'export.file.xml.resourcePath',
    name: '/file/xml/resourcePath',
    id: 'export.file.xml.resourcePath',
    label: 'File xml resource Path',
    defaultValue: r => r && r.file && r.file.xml && r.file.xml.resourcePath,
  },
  'export.file.fileDefinition.resourcePath': {
    type: 'text',
    helpKey: 'export.file.fileDefinition.resourcePath',
    name: '/file/fileDefinition/resourcePath',
    id: 'export.file.fileDefinition.resourcePath',
    label: 'File file Definition resource Path',
    defaultValue: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition.resourcePath,
  },
  'export.file.fileDefinition._fileDefinitionId': {
    type: 'text',
    helpKey: 'export.file.fileDefinition._fileDefinitionId',
    name: '/file/fileDefinition/_fileDefinitionId',
    id: 'export.file.fileDefinition._fileDefinitionId',
    label: 'File file Definition _file Definition Id',
    defaultValue: r =>
      r &&
      r.file &&
      r.file.fileDefinition &&
      r.file.fileDefinition._fileDefinitionId,
  },
  'export.file.purgeInternalBackup': {
    type: 'checkbox',
    helpKey: 'export.file.purgeInternalBackup',
    name: '/file/purgeInternalBackup',
    id: 'export.file.purgeInternalBackup',
    label: 'File purge Internal Backup',
    defaultValue: false,
  },
  // #endregion file
  // #region rest
  'export.rest.relativeURI': {
    type: 'text',
    helpKey: 'export.rest.relativeURI',
    name: '/rest/relativeURI',
    id: 'export.rest.relativeURI',
    label: 'Rest relative URI',
    defaultValue: r => r && r.rest && r.rest.relativeURI,
  },
  'export.rest.method': {
    type: 'select',
    helpKey: 'export.rest.method',
    name: '/rest/method',
    id: 'export.rest.method',
    label: 'Rest method',
    defaultValue: r => r && r.rest && r.rest.method,
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
  'export.rest.postBody': {
    type: 'text',
    helpKey: 'export.rest.postBody',
    name: '/rest/postBody',
    id: 'export.rest.postBody',
    label: 'Rest post Body',
    defaultValue: r => r && r.rest && r.rest.postBody,
  },
  'export.rest.resourcePath': {
    type: 'text',
    helpKey: 'export.rest.resourcePath',
    name: '/rest/resourcePath',
    id: 'export.rest.resourcePath',
    label: 'Rest resource Path',
    defaultValue: r => r && r.rest && r.rest.resourcePath,
  },
  'export.rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'export.rest.headers',
    name: '/rest/headers',
    id: 'export.rest.headers',
    label: 'Rest headers',
    defaultValue: r => r && r.rest && r.rest.headers,
  },
  'export.rest.allowUndefinedResource': {
    type: 'checkbox',
    helpKey: 'export.rest.allowUndefinedResource',
    name: '/rest/allowUndefinedResource',
    id: 'export.rest.allowUndefinedResource',
    label: 'Rest allow Undefined Resource',
    defaultValue: false,
  },
  'export.rest.pagingMethod': {
    type: 'select',
    helpKey: 'export.rest.pagingMethod',
    name: '/rest/pagingMethod',
    id: 'export.rest.pagingMethod',
    label: 'Rest paging Method',
    defaultValue: r => r && r.rest && r.rest.pagingMethod,
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
  'export.rest.nextPagePath': {
    type: 'text',
    helpKey: 'export.rest.nextPagePath',
    name: '/rest/nextPagePath',
    id: 'export.rest.nextPagePath',
    label: 'Rest next Page Path',
    defaultValue: r => r && r.rest && r.rest.nextPagePath,
  },
  'export.rest.linkHeaderRelation': {
    type: 'text',
    helpKey: 'export.rest.linkHeaderRelation',
    name: '/rest/linkHeaderRelation',
    id: 'export.rest.linkHeaderRelation',
    label: 'Rest link Header Relation',
    defaultValue: r => r && r.rest && r.rest.linkHeaderRelation,
  },
  'export.rest.nextPageRelativeURI': {
    type: 'text',
    helpKey: 'export.rest.nextPageRelativeURI',
    name: '/rest/nextPageRelativeURI',
    id: 'export.rest.nextPageRelativeURI',
    label: 'Rest next Page Relative URI',
    defaultValue: r => r && r.rest && r.rest.nextPageRelativeURI,
  },
  'export.rest.pageArgument': {
    type: 'text',
    helpKey: 'export.rest.pageArgument',
    name: '/rest/pageArgument',
    id: 'export.rest.pageArgument',
    label: 'Rest page Argument',
    defaultValue: r => r && r.rest && r.rest.pageArgument,
  },
  'export.rest.pagingPostBody': {
    type: 'text',
    helpKey: 'export.rest.pagingPostBody',
    name: '/rest/pagingPostBody',
    id: 'export.rest.pagingPostBody',
    label: 'Rest paging Post Body',
    defaultValue: r => r && r.rest && r.rest.pagingPostBody,
  },
  'export.rest.maxPagePath': {
    type: 'text',
    helpKey: 'export.rest.maxPagePath',
    name: '/rest/maxPagePath',
    id: 'export.rest.maxPagePath',
    label: 'Rest max Page Path',
    defaultValue: r => r && r.rest && r.rest.maxPagePath,
  },
  'export.rest.maxCountPath': {
    type: 'text',
    helpKey: 'export.rest.maxCountPath',
    name: '/rest/maxCountPath',
    id: 'export.rest.maxCountPath',
    label: 'Rest max Count Path',
    defaultValue: r => r && r.rest && r.rest.maxCountPath,
  },
  'export.rest.skipArgument': {
    type: 'text',
    helpKey: 'export.rest.skipArgument',
    name: '/rest/skipArgument',
    id: 'export.rest.skipArgument',
    label: 'Rest skip Argument',
    defaultValue: r => r && r.rest && r.rest.skipArgument,
  },
  'export.rest.blobFormat': {
    type: 'text',
    helpKey: 'export.rest.blobFormat',
    name: '/rest/blobFormat',
    id: 'export.rest.blobFormat',
    label: 'Rest blob Format',
    defaultValue: r => r && r.rest && r.rest.blobFormat,
  },
  'export.rest.successPath': {
    type: 'text',
    helpKey: 'export.rest.successPath',
    name: '/rest/successPath',
    id: 'export.rest.successPath',
    label: 'Rest success Path',
    defaultValue: r => r && r.rest && r.rest.successPath,
  },
  'export.rest.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.rest.successValues',
    name: '/rest/successValuess',
    id: 'export.rest.successValuess',
    label: 'Rest success Values',
    defaultValue: r => r && r.rest && r.rest.successValues,
    validWhen: [],
  },
  'export.rest.lastPageStatusCode': {
    type: 'text',
    helpKey: 'export.rest.lastPageStatusCode',
    name: '/rest/lastPageStatusCode',
    id: 'export.rest.lastPageStatusCode',
    label: 'Rest last Page Status Code',
    defaultValue: r => r && r.rest && r.rest.lastPageStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.rest.lastPagePath': {
    type: 'text',
    helpKey: 'export.rest.lastPagePath',
    name: '/rest/lastPagePath',
    id: 'export.rest.lastPagePath',
    label: 'Rest last Page Path',
    defaultValue: r => r && r.rest && r.rest.lastPagePath,
  },
  'export.rest.lastPageValue': {
    type: 'text',
    helpKey: 'export.rest.lastPageValue',
    name: '/rest/lastPageValue',
    id: 'export.rest.lastPageValue',
    label: 'Rest last Page Value',
    defaultValue: r => r && r.rest && r.rest.lastPageValue,
  },
  'export.rest.once.relativeURI': {
    type: 'text',
    helpKey: 'export.rest.once.relativeURI',
    name: '/rest/once/relativeURI',
    id: 'export.rest.once.relativeURI',
    label: 'Rest once relative URI',
    defaultValue: r => r && r.rest && r.rest.once && r.rest.once.relativeURI,
  },
  'export.rest.once.method': {
    type: 'radiogroup',
    helpKey: 'export.rest.once.method',
    name: '/rest/once/method',
    id: 'export.rest.once.method',
    label: 'Rest once method',
    defaultValue: r => r && r.rest && r.rest.once && r.rest.once.method,
    options: [
      {
        items: [
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'export.rest.once.postBody': {
    type: 'text',
    helpKey: 'export.rest.once.postBody',
    name: '/rest/once/postBody',
    id: 'export.rest.once.postBody',
    label: 'Rest once post Body',
    defaultValue: r => r && r.rest && r.rest.once && r.rest.once.postBody,
  },
  // #endregion rest
  // #region ftp
  'export.ftp.directoryPath': {
    type: 'text',
    helpKey: 'export.ftp.directoryPath',
    name: '/ftp/directoryPath',
    id: 'export.ftp.directoryPath',
    label: 'Ftp directory Path',
    defaultValue: r => r && r.ftp && r.ftp.directoryPath,
  },
  'export.ftp.fileNameStartsWith': {
    type: 'text',
    helpKey: 'export.ftp.fileNameStartsWith',
    name: '/ftp/fileNameStartsWith',
    id: 'export.ftp.fileNameStartsWith',
    label: 'Ftp file Name Starts With',
    defaultValue: r => r && r.ftp && r.ftp.fileNameStartsWith,
  },
  'export.ftp.fileNameEndsWith': {
    type: 'text',
    helpKey: 'export.ftp.fileNameEndsWith',
    name: '/ftp/fileNameEndsWith',
    id: 'export.ftp.fileNameEndsWith',
    label: 'Ftp file Name Ends With',
    defaultValue: r => r && r.ftp && r.ftp.fileNameEndsWith,
  },
  'export.ftp.backupDirectoryPath': {
    type: 'text',
    helpKey: 'export.ftp.backupDirectoryPath',
    name: '/ftp/backupDirectoryPath',
    id: 'export.ftp.backupDirectoryPath',
    label: 'Ftp backup Directory Path',
    defaultValue: r => r && r.ftp && r.ftp.backupDirectoryPath,
  },
  // #endregion ftp
  // #region http
  'export.http.successMediaType': {
    type: 'select',
    helpKey: 'export.http.successMediaType',
    name: '/http/successMediaType',
    id: 'export.http.successMediaType',
    label: 'Http success Media Type',
    defaultValue: r => r && r.http && r.http.successMediaType,
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
  'export.http.errorMediaType': {
    type: 'radiogroup',
    helpKey: 'export.http.errorMediaType',
    name: '/http/errorMediaType',
    id: 'export.http.errorMediaType',
    label: 'Http error Media Type',
    defaultValue: r => r && r.http && r.http.errorMediaType,
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'export.http.relativeURI': {
    type: 'text',
    helpKey: 'export.http.relativeURI',
    name: '/http/relativeURI',
    id: 'export.http.relativeURI',
    label: 'Http relative URI',
    defaultValue: r => r && r.http && r.http.relativeURI,
  },
  'export.http.method': {
    type: 'select',
    helpKey: 'export.http.method',
    name: '/http/method',
    id: 'export.http.method',
    label: 'Http method',
    defaultValue: r => r && r.http && r.http.method,
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
  'export.http.body': {
    type: 'text',
    helpKey: 'export.http.body',
    name: '/http/body',
    id: 'export.http.body',
    label: 'Http body',
    defaultValue: r => r && r.http && r.http.body,
  },
  'export.http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'export.http.headers',
    name: '/http/headers',
    id: 'export.http.headers',
    label: 'Http headers',
    defaultValue: r => r && r.http && r.http.headers,
  },
  'export.http.paging.method': {
    type: 'select',
    helpKey: 'export.http.paging.method',
    name: '/http/paging/method',
    id: 'export.http.paging.method',
    label: 'Http paging method',
    defaultValue: r => r && r.http && r.http.paging && r.http.paging.method,
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
  'export.http.paging.skip': {
    type: 'text',
    helpKey: 'export.http.paging.skip',
    name: '/http/paging/skip',
    id: 'export.http.paging.skip',
    label: 'Http paging skip',
    defaultValue: r => r && r.http && r.http.paging && r.http.paging.skip,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.http.paging.page': {
    type: 'text',
    helpKey: 'export.http.paging.page',
    name: '/http/paging/page',
    id: 'export.http.paging.page',
    label: 'Http paging page',
    defaultValue: r => r && r.http && r.http.paging && r.http.paging.page,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.http.paging.token': {
    type: 'text',
    helpKey: 'export.http.paging.token',
    name: '/http/paging/token',
    id: 'export.http.paging.token',
    label: 'Http paging token',
    defaultValue: r => r && r.http && r.http.paging && r.http.paging.token,
  },
  'export.http.paging.path': {
    type: 'text',
    helpKey: 'export.http.paging.path',
    name: '/http/paging/path',
    id: 'export.http.paging.path',
    label: 'Http paging path',
    defaultValue: r => r && r.http && r.http.paging && r.http.paging.path,
  },
  'export.http.paging.relativeURI': {
    type: 'text',
    helpKey: 'export.http.paging.relativeURI',
    name: '/http/paging/relativeURI',
    id: 'export.http.paging.relativeURI',
    label: 'Http paging relative URI',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.relativeURI,
  },
  'export.http.paging.pathAfterFirstRequest': {
    type: 'text',
    helpKey: 'export.http.paging.pathAfterFirstRequest',
    name: '/http/paging/pathAfterFirstRequest',
    id: 'export.http.paging.pathAfterFirstRequest',
    label: 'Http paging path After First Request',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.pathAfterFirstRequest,
  },
  'export.http.paging.resourcePath': {
    type: 'text',
    helpKey: 'export.http.paging.resourcePath',
    name: '/http/paging/resourcePath',
    id: 'export.http.paging.resourcePath',
    label: 'Http paging resource Path',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.resourcePath,
  },
  'export.http.paging.maxPagePath': {
    type: 'text',
    helpKey: 'export.http.paging.maxPagePath',
    name: '/http/paging/maxPagePath',
    id: 'export.http.paging.maxPagePath',
    label: 'Http paging max Page Path',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.maxPagePath,
  },
  'export.http.paging.maxCountPath': {
    type: 'text',
    helpKey: 'export.http.paging.maxCountPath',
    name: '/http/paging/maxCountPath',
    id: 'export.http.paging.maxCountPath',
    label: 'Http paging max Count Path',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.maxCountPath,
  },
  'export.http.paging.lastPageStatusCode': {
    type: 'text',
    helpKey: 'export.http.paging.lastPageStatusCode',
    name: '/http/paging/lastPageStatusCode',
    id: 'export.http.paging.lastPageStatusCode',
    label: 'Http paging last Page Status Code',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.lastPageStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.http.paging.lastPagePath': {
    type: 'text',
    helpKey: 'export.http.paging.lastPagePath',
    name: '/http/paging/lastPagePath',
    id: 'export.http.paging.lastPagePath',
    label: 'Http paging last Page Path',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.lastPagePath,
  },
  'export.http.paging.lastPageValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.http.paging.lastPageValues',
    name: '/http/paging/lastPageValuess',
    id: 'export.http.paging.lastPageValuess',
    label: 'Http paging last Page Values',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.lastPageValues,
    validWhen: [],
  },
  'export.http.paging.linkHeaderRelation': {
    type: 'text',
    helpKey: 'export.http.paging.linkHeaderRelation',
    name: '/http/paging/linkHeaderRelation',
    id: 'export.http.paging.linkHeaderRelation',
    label: 'Http paging link Header Relation',
    defaultValue: r =>
      r && r.http && r.http.paging && r.http.paging.linkHeaderRelation,
  },
  'export.http._asyncHelperId': {
    type: 'text',
    helpKey: 'export.http._asyncHelperId',
    name: '/http/_asyncHelperId',
    id: 'export.http._asyncHelperId',
    label: 'Http _async Helper Id',
    defaultValue: r => r && r.http && r.http._asyncHelperId,
  },
  'export.http.once.relativeURI': {
    type: 'text',
    helpKey: 'export.http.once.relativeURI',
    name: '/http/once/relativeURI',
    id: 'export.http.once.relativeURI',
    label: 'Http once relative URI',
    defaultValue: r => r && r.http && r.http.once && r.http.once.relativeURI,
  },
  'export.http.once.method': {
    type: 'select',
    helpKey: 'export.http.once.method',
    name: '/http/once/method',
    id: 'export.http.once.method',
    label: 'Http once method',
    defaultValue: r => r && r.http && r.http.once && r.http.once.method,
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
  'export.http.once.body': {
    type: 'text',
    helpKey: 'export.http.once.body',
    name: '/http/once/body',
    id: 'export.http.once.body',
    label: 'Http once body',
    defaultValue: r => r && r.http && r.http.once && r.http.once.body,
  },
  'export.http.response.resourcePath': {
    type: 'text',
    helpKey: 'export.http.response.resourcePath',
    name: '/http/response/resourcePath',
    id: 'export.http.response.resourcePath',
    label: 'Http response resource Path',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.resourcePath,
  },
  'export.http.response.resourceIdPath': {
    type: 'text',
    helpKey: 'export.http.response.resourceIdPath',
    name: '/http/response/resourceIdPath',
    id: 'export.http.response.resourceIdPath',
    label: 'Http response resource Id Path',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.resourceIdPath,
  },
  'export.http.response.successPath': {
    type: 'text',
    helpKey: 'export.http.response.successPath',
    name: '/http/response/successPath',
    id: 'export.http.response.successPath',
    label: 'Http response success Path',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.successPath,
  },
  'export.http.response.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.http.response.successValues',
    name: '/http/response/successValuess',
    id: 'export.http.response.successValuess',
    label: 'Http response success Values',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.successValues,
    validWhen: [],
  },
  'export.http.response.errorPath': {
    type: 'text',
    helpKey: 'export.http.response.errorPath',
    name: '/http/response/errorPath',
    id: 'export.http.response.errorPath',
    label: 'Http response error Path',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.errorPath,
  },
  'export.http.response.blobFormat': {
    type: 'text',
    helpKey: 'export.http.response.blobFormat',
    name: '/http/response/blobFormat',
    id: 'export.http.response.blobFormat',
    label: 'Http response blob Format',
    defaultValue: r =>
      r && r.http && r.http.response && r.http.response.blobFormat,
  },
  // #endregion http
  // #region netsuite
  'export.netsuite.searchess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.netsuite.searches',
    name: '/netsuite/searchess',
    id: 'export.netsuite.searchess',
    label: 'Netsuite searches',
    defaultValue: r => r && r.netsuite && r.netsuite.searches,
    validWhen: [],
  },
  'export.netsuite.metadata': {
    type: 'text',
    helpKey: 'export.netsuite.metadata',
    name: '/netsuite/metadata',
    id: 'export.netsuite.metadata',
    label: 'Netsuite metadata',
    defaultValue: r => r && r.netsuite && r.netsuite.metadata,
  },
  'export.netsuite.selectoption': {
    type: 'text',
    helpKey: 'export.netsuite.selectoption',
    name: '/netsuite/selectoption',
    id: 'export.netsuite.selectoption',
    label: 'Netsuite selectoption',
    defaultValue: r => r && r.netsuite && r.netsuite.selectoption,
  },
  'export.netsuite.customFieldMetadata': {
    type: 'text',
    helpKey: 'export.netsuite.customFieldMetadata',
    name: '/netsuite/customFieldMetadata',
    id: 'export.netsuite.customFieldMetadata',
    label: 'Netsuite custom Field Metadata',
    defaultValue: r => r && r.netsuite && r.netsuite.customFieldMetadata,
  },
  'export.netsuite.skipGrouping': {
    type: 'checkbox',
    helpKey: 'export.netsuite.skipGrouping',
    name: '/netsuite/skipGrouping',
    id: 'export.netsuite.skipGrouping',
    label: 'Netsuite skip Grouping',
    defaultValue: false,
  },
  'export.netsuite.statsOnly': {
    type: 'checkbox',
    helpKey: 'export.netsuite.statsOnly',
    name: '/netsuite/statsOnly',
    id: 'export.netsuite.statsOnly',
    label: 'Netsuite stats Only',
    defaultValue: false,
  },
  'export.netsuite.internalId': {
    type: 'text',
    helpKey: 'export.netsuite.internalId',
    name: '/netsuite/internalId',
    id: 'export.netsuite.internalId',
    label: 'Netsuite internal Id',
    defaultValue: r => r && r.netsuite && r.netsuite.internalId,
  },
  'export.netsuite.restlet.recordType': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.recordType',
    name: '/netsuite/restlet/recordType',
    id: 'export.netsuite.restlet.recordType',
    label: 'Netsuite restlet record Type',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.restlet && r.netsuite.restlet.recordType,
  },
  'export.netsuite.restlet.searchId': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.searchId',
    name: '/netsuite/restlet/searchId',
    id: 'export.netsuite.restlet.searchId',
    label: 'Netsuite restlet search Id',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.restlet && r.netsuite.restlet.searchId,
  },
  'export.netsuite.restlet.criteria.field': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.criteria.field',
    name: '/netsuite/restlet/criteria/field',
    id: 'export.netsuite.restlet.criteria.field',
    label: 'Netsuite restlet criteria field',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.criteria &&
      r.netsuite.restlet.criteria.field,
  },
  'export.netsuite.restlet.criteria.join': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.criteria.join',
    name: '/netsuite/restlet/criteria/join',
    id: 'export.netsuite.restlet.criteria.join',
    label: 'Netsuite restlet criteria join',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.criteria &&
      r.netsuite.restlet.criteria.join,
  },
  'export.netsuite.restlet.criteria.operator': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.criteria.operator',
    name: '/netsuite/restlet/criteria/operator',
    id: 'export.netsuite.restlet.criteria.operator',
    label: 'Netsuite restlet criteria operator',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.criteria &&
      r.netsuite.restlet.criteria.operator,
  },
  'export.netsuite.restlet.criteria.searchValue': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.criteria.searchValue',
    name: '/netsuite/restlet/criteria/searchValue',
    id: 'export.netsuite.restlet.criteria.searchValue',
    label: 'Netsuite restlet criteria search Value',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.criteria &&
      r.netsuite.restlet.criteria.searchValue,
  },
  'export.netsuite.restlet.criteria.searchValue2': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.criteria.searchValue2',
    name: '/netsuite/restlet/criteria/searchValue2',
    id: 'export.netsuite.restlet.criteria.searchValue2',
    label: 'Netsuite restlet criteria search Value2',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.criteria &&
      r.netsuite.restlet.criteria.searchValue2,
  },
  'export.netsuite.restlet.batchSize': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.batchSize',
    name: '/netsuite/restlet/batchSize',
    id: 'export.netsuite.restlet.batchSize',
    label: 'Netsuite restlet batch Size',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.restlet && r.netsuite.restlet.batchSize,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.netsuite.restlet.hooks.batchSize': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.hooks.batchSize',
    name: '/netsuite/restlet/hooks/batchSize',
    id: 'export.netsuite.restlet.hooks.batchSize',
    label: 'Netsuite restlet hooks batch Size',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.hooks &&
      r.netsuite.restlet.hooks.batchSize,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.netsuite.restlet.hooks.preSend.fileInternalId': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.hooks.preSend.fileInternalId',
    name: '/netsuite/restlet/hooks/preSend/fileInternalId',
    id: 'export.netsuite.restlet.hooks.preSend.fileInternalId',
    label: 'Netsuite restlet hooks pre Send file Internal Id',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.hooks &&
      r.netsuite.restlet.hooks.preSend &&
      r.netsuite.restlet.hooks.preSend.fileInternalId,
  },
  'export.netsuite.restlet.hooks.preSend.function': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.hooks.preSend.function',
    name: '/netsuite/restlet/hooks/preSend/function',
    id: 'export.netsuite.restlet.hooks.preSend.function',
    label: 'Netsuite restlet hooks pre Send function',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.hooks &&
      r.netsuite.restlet.hooks.preSend &&
      r.netsuite.restlet.hooks.preSend.function,
  },
  'export.netsuite.restlet.hooks.preSend.configuration': {
    type: 'text',
    helpKey: 'export.netsuite.restlet.hooks.preSend.configuration',
    name: '/netsuite/restlet/hooks/preSend/configuration',
    id: 'export.netsuite.restlet.hooks.preSend.configuration',
    label: 'Netsuite restlet hooks pre Send configuration',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.restlet &&
      r.netsuite.restlet.hooks &&
      r.netsuite.restlet.hooks.preSend &&
      r.netsuite.restlet.hooks.preSend.configuration,
  },
  'export.netsuite.distributed.recordType': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.recordType',
    name: '/netsuite/distributed/recordType',
    id: 'export.netsuite.distributed.recordType',
    label: 'Netsuite distributed record Type',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.recordType,
  },
  'export.netsuite.distributed.executionContexts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.netsuite.distributed.executionContext',
    name: '/netsuite/distributed/executionContexts',
    id: 'export.netsuite.distributed.executionContexts',
    label: 'Netsuite distributed execution Context',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.executionContext,
    validWhen: [],
  },
  'export.netsuite.distributed.disabled': {
    type: 'checkbox',
    helpKey: 'export.netsuite.distributed.disabled',
    name: '/netsuite/distributed/disabled',
    id: 'export.netsuite.distributed.disabled',
    label: 'Netsuite distributed disabled',
    defaultValue: false,
  },
  'export.netsuite.distributed.executionTypes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.netsuite.distributed.executionType',
    name: '/netsuite/distributed/executionTypes',
    id: 'export.netsuite.distributed.executionTypes',
    label: 'Netsuite distributed execution Type',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.executionType,
    validWhen: [],
  },
  'export.netsuite.distributed.qualifier': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.qualifier',
    name: '/netsuite/distributed/qualifier',
    id: 'export.netsuite.distributed.qualifier',
    label: 'Netsuite distributed qualifier',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.qualifier,
  },
  'export.netsuite.distributed.hooks.preSend.fileInternalId': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.hooks.preSend.fileInternalId',
    name: '/netsuite/distributed/hooks/preSend/fileInternalId',
    id: 'export.netsuite.distributed.hooks.preSend.fileInternalId',
    label: 'Netsuite distributed hooks pre Send file Internal Id',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.hooks &&
      r.netsuite.distributed.hooks.preSend &&
      r.netsuite.distributed.hooks.preSend.fileInternalId,
  },
  'export.netsuite.distributed.hooks.preSend.function': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.hooks.preSend.function',
    name: '/netsuite/distributed/hooks/preSend/function',
    id: 'export.netsuite.distributed.hooks.preSend.function',
    label: 'Netsuite distributed hooks pre Send function',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.hooks &&
      r.netsuite.distributed.hooks.preSend &&
      r.netsuite.distributed.hooks.preSend.function,
  },
  'export.netsuite.distributed.hooks.preSend.configuration': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.hooks.preSend.configuration',
    name: '/netsuite/distributed/hooks/preSend/configuration',
    id: 'export.netsuite.distributed.hooks.preSend.configuration',
    label: 'Netsuite distributed hooks pre Send configuration',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.hooks &&
      r.netsuite.distributed.hooks.preSend &&
      r.netsuite.distributed.hooks.preSend.configuration,
  },
  'export.netsuite.distributed.sublists': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.sublists',
    name: '/netsuite/distributed/sublists',
    id: 'export.netsuite.distributed.sublists',
    label: 'Netsuite distributed sublists',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.sublists,
  },
  'export.netsuite.distributed.forceReload': {
    type: 'checkbox',
    helpKey: 'export.netsuite.distributed.forceReload',
    name: '/netsuite/distributed/forceReload',
    id: 'export.netsuite.distributed.forceReload',
    label: 'Netsuite distributed force Reload',
    defaultValue: false,
  },
  'export.netsuite.distributed.ioEnvironment': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.ioEnvironment',
    name: '/netsuite/distributed/ioEnvironment',
    id: 'export.netsuite.distributed.ioEnvironment',
    label: 'Netsuite distributed io Environment',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.ioEnvironment,
  },
  'export.netsuite.distributed.lastSyncedDate': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.lastSyncedDate',
    name: '/netsuite/distributed/lastSyncedDate',
    id: 'export.netsuite.distributed.lastSyncedDate',
    label: 'Netsuite distributed last Synced Date',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.lastSyncedDate,
  },
  'export.netsuite.distributed.settings': {
    type: 'text',
    helpKey: 'export.netsuite.distributed.settings',
    name: '/netsuite/distributed/settings',
    id: 'export.netsuite.distributed.settings',
    label: 'Netsuite distributed settings',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.distributed &&
      r.netsuite.distributed.settings,
  },
  'export.netsuite.getList[].typeId': {
    type: 'text',
    helpKey: 'export.netsuite.getList[].typeId',
    name: '/netsuite/getList/typeId',
    id: 'export.netsuite.getList.typeId',
    label: 'Netsuite get List type Id',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.getList && r.netsuite.getList.typeId,
  },
  'export.netsuite.getList.internalId': {
    type: 'text',
    helpKey: 'export.netsuite.getList.internalId',
    name: '/netsuite/getList/internalId',
    id: 'export.netsuite.getList.internalId',
    label: 'Netsuite get List internal Id',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.getList && r.netsuite.getList.internalId,
  },
  'export.netsuite.getList.externalId': {
    type: 'text',
    helpKey: 'export.netsuite.getList.externalId',
    name: '/netsuite/getList/externalId',
    id: 'export.netsuite.getList.externalId',
    label: 'Netsuite get List external Id',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.getList && r.netsuite.getList.externalId,
  },
  'export.netsuite.searchPreferences.bodyFieldsOnly': {
    type: 'checkbox',
    helpKey: 'export.netsuite.searchPreferences.bodyFieldsOnly',
    name: '/netsuite/searchPreferences/bodyFieldsOnly',
    id: 'export.netsuite.searchPreferences.bodyFieldsOnly',
    label: 'Netsuite search Preferences body Fields Only',
    defaultValue: false,
  },
  'export.netsuite.searchPreferences.pageSize': {
    type: 'text',
    helpKey: 'export.netsuite.searchPreferences.pageSize',
    name: '/netsuite/searchPreferences/pageSize',
    id: 'export.netsuite.searchPreferences.pageSize',
    label: 'Netsuite search Preferences page Size',
    defaultValue: r =>
      r &&
      r.netsuite &&
      r.netsuite.searchPreferences &&
      r.netsuite.searchPreferences.pageSize,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'export.netsuite.searchPreferences.returnSearchColumns': {
    type: 'checkbox',
    helpKey: 'export.netsuite.searchPreferences.returnSearchColumns',
    name: '/netsuite/searchPreferences/returnSearchColumns',
    id: 'export.netsuite.searchPreferences.returnSearchColumns',
    label: 'Netsuite search Preferences return Search Columns',
    defaultValue: false,
  },
  // #endregion netsuite
  // #region rdbms
  'export.rdbms.query': {
    type: 'text',
    helpKey: 'export.rdbms.query',
    name: '/rdbms/query',
    id: 'export.rdbms.query',
    label: 'Rdbms query',
    defaultValue: r => r && r.rdbms && r.rdbms.query,
  },
  'export.rdbms.once.query': {
    type: 'text',
    helpKey: 'export.rdbms.once.query',
    name: '/rdbms/once/query',
    id: 'export.rdbms.once.query',
    label: 'Rdbms once query',
    defaultValue: r => r && r.rdbms && r.rdbms.once && r.rdbms.once.query,
  },
  // #endregion rdbms
  // #region s3
  'export.s3.region': {
    type: 'select',
    helpKey: 'export.s3.region',
    name: '/s3/region',
    id: 'export.s3.region',
    label: 'S3 region',
    defaultValue: r => r && r.s3 && r.s3.region,
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
  'export.s3.bucket': {
    type: 'text',
    helpKey: 'export.s3.bucket',
    name: '/s3/bucket',
    id: 'export.s3.bucket',
    label: 'S3 bucket',
    defaultValue: r => r && r.s3 && r.s3.bucket,
  },
  'export.s3.keyStartsWith': {
    type: 'text',
    helpKey: 'export.s3.keyStartsWith',
    name: '/s3/keyStartsWith',
    id: 'export.s3.keyStartsWith',
    label: 'S3 key Starts With',
    defaultValue: r => r && r.s3 && r.s3.keyStartsWith,
  },
  'export.s3.keyEndsWith': {
    type: 'text',
    helpKey: 'export.s3.keyEndsWith',
    name: '/s3/keyEndsWith',
    id: 'export.s3.keyEndsWith',
    label: 'S3 key Ends With',
    defaultValue: r => r && r.s3 && r.s3.keyEndsWith,
  },
  'export.s3.backupBucket': {
    type: 'text',
    helpKey: 'export.s3.backupBucket',
    name: '/s3/backupBucket',
    id: 'export.s3.backupBucket',
    label: 'S3 backup Bucket',
    defaultValue: r => r && r.s3 && r.s3.backupBucket,
  },
  // #endregion s3
  // #region salesforce
  'export.salesforce.sObjectType': {
    type: 'text',
    helpKey: 'export.salesforce.sObjectType',
    name: '/salesforce/sObjectType',
    id: 'export.salesforce.sObjectType',
    label: 'Salesforce s Object Type',
    defaultValue: r => r && r.salesforce && r.salesforce.sObjectType,
  },
  'export.salesforce.id': {
    type: 'text',
    helpKey: 'export.salesforce.id',
    name: '/salesforce/id',
    id: 'export.salesforce.id',
    label: 'Salesforce id',
    defaultValue: r => r && r.salesforce && r.salesforce.id,
  },
  'export.salesforce.api': {
    type: 'radiogroup',
    helpKey: 'export.salesforce.api',
    name: '/salesforce/api',
    id: 'export.salesforce.api',
    label: 'Salesforce api',
    defaultValue: r => r && r.salesforce && r.salesforce.api,
    options: [
      {
        items: [
          { label: 'Rest', value: 'rest' },
          { label: 'Soap', value: 'soap' },
        ],
      },
    ],
  },
  'export.salesforce.soql.query': {
    type: 'text',
    helpKey: 'export.salesforce.soql.query',
    name: '/salesforce/soql/query',
    id: 'export.salesforce.soql.query',
    label: 'Salesforce soql query',
    defaultValue: r =>
      r && r.salesforce && r.salesforce.soql && r.salesforce.soql.query,
  },
  'export.salesforce.distributed.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.salesforce.distributed.referencedFields',
    name: '/salesforce/distributed/referencedFieldss',
    id: 'export.salesforce.distributed.referencedFieldss',
    label: 'Salesforce distributed referenced Fields',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.referencedFields,
    validWhen: [],
  },
  'export.salesforce.distributed.disabled': {
    type: 'checkbox',
    helpKey: 'export.salesforce.distributed.disabled',
    name: '/salesforce/distributed/disabled',
    id: 'export.salesforce.distributed.disabled',
    label: 'Salesforce distributed disabled',
    defaultValue: false,
  },
  'export.salesforce.distributed.connectorId': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.connectorId',
    name: '/salesforce/distributed/connectorId',
    id: 'export.salesforce.distributed.connectorId',
    label: 'Salesforce distributed connector Id',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.connectorId,
  },
  'export.salesforce.distributed.userDefinedReferencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.salesforce.distributed.userDefinedReferencedFields',
    name: '/salesforce/distributed/userDefinedReferencedFieldss',
    id: 'export.salesforce.distributed.userDefinedReferencedFieldss',
    label: 'Salesforce distributed user Defined Referenced Fields',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.userDefinedReferencedFields,
    validWhen: [],
  },
  'export.salesforce.distributed.qualifier': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.qualifier',
    name: '/salesforce/distributed/qualifier',
    id: 'export.salesforce.distributed.qualifier',
    label: 'Salesforce distributed qualifier',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.qualifier,
  },
  'export.salesforce.distributed.relatedLists.referencedFieldss': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'export.salesforce.distributed.relatedLists.referencedFields',
    name: '/salesforce/distributed/relatedLists/referencedFieldss',
    id: 'export.salesforce.distributed.relatedLists.referencedFieldss',
    label: 'Salesforce distributed related Lists referenced Fields',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.referencedFields,
    validWhen: [],
  },
  'export.salesforce.distributed.relatedLists.parentField': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.relatedLists.parentField',
    name: '/salesforce/distributed/relatedLists/parentField',
    id: 'export.salesforce.distributed.relatedLists.parentField',
    label: 'Salesforce distributed related Lists parent Field',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.parentField,
  },
  'export.salesforce.distributed.relatedLists.sObjectType': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.relatedLists.sObjectType',
    name: '/salesforce/distributed/relatedLists/sObjectType',
    id: 'export.salesforce.distributed.relatedLists.sObjectType',
    label: 'Salesforce distributed related Lists s Object Type',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.sObjectType,
  },
  'export.salesforce.distributed.relatedLists.filter': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.relatedLists.filter',
    name: '/salesforce/distributed/relatedLists/filter',
    id: 'export.salesforce.distributed.relatedLists.filter',
    label: 'Salesforce distributed related Lists filter',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.filter,
  },
  'export.salesforce.distributed.relatedLists.orderBy': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.relatedLists.orderBy',
    name: '/salesforce/distributed/relatedLists/orderBy',
    id: 'export.salesforce.distributed.relatedLists.orderBy',
    label: 'Salesforce distributed related Lists order By',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.orderBy,
  },
  'export.salesforce.distributed.relatedLists.userDefined': {
    type: 'text',
    helpKey: 'export.salesforce.distributed.relatedLists.userDefined',
    name: '/salesforce/distributed/relatedLists/userDefined',
    id: 'export.salesforce.distributed.relatedLists.userDefined',
    label: 'Salesforce distributed related Lists user Defined',
    defaultValue: r =>
      r &&
      r.salesforce &&
      r.salesforce.distributed &&
      r.salesforce.distributed.relatedLists &&
      r.salesforce.distributed.relatedLists.userDefined,
  },
  // #endregion salesforce
  // #region wrapper
  'export.wrapper.function': {
    type: 'text',
    helpKey: 'export.wrapper.function',
    name: '/wrapper/function',
    id: 'export.wrapper.function',
    label: 'Wrapper function',
    defaultValue: r => r && r.wrapper && r.wrapper.function,
  },
  'export.wrapper.configuration': {
    type: 'text',
    helpKey: 'export.wrapper.configuration',
    name: '/wrapper/configuration',
    id: 'export.wrapper.configuration',
    label: 'Wrapper configuration',
    defaultValue: r => r && r.wrapper && r.wrapper.configuration,
  },
  // #endregion wrapper
  // #region mongodb
  'export.mongodb.method': {
    type: 'radiogroup',
    helpKey: 'export.mongodb.method',
    name: '/mongodb/method',
    id: 'export.mongodb.method',
    label: 'Mongodb method',
    defaultValue: r => r && r.mongodb && r.mongodb.method,
    options: [{ items: [{ label: 'Find', value: 'find' }] }],
  },
  'export.mongodb.collection': {
    type: 'text',
    helpKey: 'export.mongodb.collection',
    name: '/mongodb/collection',
    id: 'export.mongodb.collection',
    label: 'Mongodb collection',
    defaultValue: r => r && r.mongodb && r.mongodb.collection,
  },
  'export.mongodb.filter': {
    type: 'text',
    helpKey: 'export.mongodb.filter',
    name: '/mongodb/filter',
    id: 'export.mongodb.filter',
    label: 'Mongodb filter',
    defaultValue: r => r && r.mongodb && r.mongodb.filter,
  },
  'export.mongodb.projection': {
    type: 'text',
    helpKey: 'export.mongodb.projection',
    name: '/mongodb/projection',
    id: 'export.mongodb.projection',
    label: 'Mongodb projection',
    defaultValue: r => r && r.mongodb && r.mongodb.projection,
  },
  // #endregion mongodb
  // #region as2
  'export.as2.fileKey': {
    type: 'text',
    helpKey: 'export.as2.fileKey',
    name: '/as2/fileKey',
    id: 'export.as2.fileKey',
    label: 'As2 file Key',
    defaultValue: r => r && r.as2 && r.as2.fileKey,
  },
  // #endregion as2
};
