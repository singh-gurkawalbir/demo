export default {
  // #region common
  // TODO: develop code for this two components
  // agent list handleBars evaluated its a dynamicList
  _borrowConcurrencyFromConnectionId: {
    resourceType: 'connections',
    filter: r => ({ type: r.type }),
    excludeFilter: r => ({ _id: r._id }),
    type: 'selectresource',
    label: 'Borrow Concurrency From',
  },
  _agentId: {
    type: 'selectresource',
    label: 'Agent',
    resourceType: 'agents',
  },
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample File (that would be exported)',
    resourceType: 'connections',
  },
  scope: {
    type: 'selectscopes',
    label: 'Configure Scopes',
  },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      {
        items: [
          { label: 'NetSuite', value: 'netsuite' },
          { label: 'Salesforce', value: 'salesforce' },
          { label: 'Ftp', value: 'ftp' },
          { label: 'S3', value: 's3' },
          { label: 'Rest', value: 'rest' },
          { label: 'Wrapper', value: 'wrapper' },
          { label: 'Http', value: 'http' },
          { label: 'PostgreSQL', value: 'postgresql' },
          { label: 'Mongodb', value: 'mongodb' },
          { label: 'MySQL', value: 'mysql' },
          { label: 'Microsoft SQL', value: 'mssql' },
          { label: 'As2', value: 'as2' },
        ],
      },
    ],
  },
  name: {
    type: 'text',
    label: 'Name',
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
          { label: 'Solidcommercxe', value: 'solidcommercxe' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Bamboohr', value: 'bamboohr' },
        ],
      },
    ],
  },
  // #endregion common
  // #region rdbms
  'rdbms.host': {
    type: 'text',
    label: 'Host',
    required: true,
  },
  'rdbms.port': {
    type: 'text',
    label: 'Port',
    validWhen: [
      {
        fallsWithinNumericalRange: {
          min: 0,
          max: 65535,
          message: 'The value must be more than 0 and less than 65535',
        },
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rdbms.database': {
    type: 'text',
    label: 'Database Name',
    required: true,
  },
  'rdbms.instanceName': {
    type: 'text',
    label: 'Instance Name',
    visibleWhen: [{ field: 'type', is: ['mssql'] }],
  },
  'rdbms.user': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'rdbms.password': {
    type: 'text',
    label: 'Password',
    required: true,
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rdbms.ssl.ca': {
    type: 'editor',
    mode: 'text',
    label: 'Certificate Authority',
  },
  'rdbms.ssl.key': {
    type: 'editor',
    mode: 'text',
    label: 'Key',
  },
  'rdbms.ssl.passphrase': {
    type: 'text',
    label: 'Passphrase',
  },
  'rdbms.ssl.cert': {
    type: 'editor',
    mode: 'text',
    label: 'Certificate',
  },
  'rdbms.version': {
    type: 'select',
    label: 'SQL Server Version',
    required: true,
    visibleWhen: [{ field: 'type', is: ['mssql'] }],
    options: [
      {
        items: [
          { label: 'SQL Server 2008 R2', value: 'SQL Server 2008 R2' },
          { label: 'SQL Server 2012', value: 'SQL Server 2012' },
          { label: 'SQL Server 2014', value: 'SQL Server 2014' },
          { label: 'SQL Server 2016', value: 'SQL Server 2016' },
          { label: 'SQL Server 2017', value: 'SQL Server 2017' },
          { label: 'Azure', value: 'Azure' },
        ],
      },
    ],
  },

  'rdbms.concurrencyLevel': {
    label: 'Concurrency Level',
    type: 'select',
    options: [
      {
        items: [
          { label: '0', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 },
          { label: '11', value: 11 },
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '21', value: 21 },
          { label: '22', value: 22 },
          { label: '23', value: 23 },
          { label: '24', value: 24 },
          { label: '25', value: 25 },
        ],
      },
    ],
  },
  // #endregion rdbms
  // #region rest
  'rest.mediaType': {
    type: 'select',
    label: 'Media Type',
    options: [
      {
        items: [
          { label: 'Json', value: 'json' },
          { label: 'Urlencoded', value: 'urlencoded' },
          { label: 'Xml', value: 'xml' },
          { label: 'Csv', value: 'csv' },
        ],
      },
    ],
  },
  'rest.baseURI': {
    type: 'text',
    label: 'Base URI',
    required: true,
  },
  'rest.bearerToken': {
    type: 'text',
    label: 'Token',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rest.tokenLocation': {
    type: 'select',
    label: 'Location',
    options: [
      {
        items: [
          { label: 'Header', value: 'header' },
          { label: 'URL Parameter', value: 'url' },
        ],
      },
    ],
  },
  'rest.tokenParam': {
    type: 'text',
    label: 'Rest token Param',
  },
  'rest.scope': {
    type: 'selectscopes',
    label: 'Configure Scopes',
  },
  'rest.scopeDelimiter': {
    type: 'text',
    label: 'Rest scope Delimiter',
  },
  'rest.refreshToken': {
    type: 'text',
    label: 'Rest refresh Token',
  },
  'rest.oauthTokenURI': {
    type: 'text',
    label: 'Rest oauth Token URI',
  },
  'rest.disableStrictSSL': {
    type: 'checkbox',
    label: 'Rest disable Strict SSL',
  },
  'rest.authType': {
    type: 'select',
    label: 'Authentication Type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'Custom', value: 'custom' },
          { label: 'Cookie', value: 'cookie' },
        ],
      },
    ],
  },
  'rest.authURI': {
    type: 'text',
    label: 'Rest auth URI',
  },
  'rest.authHeader': {
    type: 'text',
    label: 'Rest auth Header',
  },
  'rest.retryHeader': {
    type: 'text',
    label: 'Rest retry Header',
  },
  'rest.authScheme': {
    type: 'select',
    label: 'Scheme',
    options: [
      {
        items: [
          { label: 'MAC', value: 'MAC' },
          { label: 'OAuth', value: 'OAuth' },
          { label: 'Bearer', value: 'Bearer' },
          // { label: 'Hmac', value: 'Hmac' },
          { label: 'None', value: ' ' },
        ],
      },
    ],
  },
  'rest.basicAuth.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'rest.basicAuth.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
    defaultValue: '',
  },
  'rest.cookieAuth.uri': {
    type: 'text',
    label: 'Cookie URI',
  },
  'rest.cookieAuth.body': {
    type: 'text',
    label: 'Cookie Body',
  },
  'rest.cookieAuth.method': {
    type: 'select',
    label: 'Cookie Method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.cookieAuth.successStatusCode': {
    type: 'text',
    label: 'Cookie Success Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'rest.encrypted': {
    type: 'editor',
    label: 'Encrypted',
    mode: 'json',
  },
  'rest.unencrypted': {
    type: 'editor',
    label: 'Unencrypted',
    mode: 'json',
  },
  'rest.oauth.accessTokenPath': {
    type: 'text',
    label: 'Rest oauth access Token Path',
  },
  'rest.oauth.grantType': {
    type: 'radiogroup',
    label: 'Rest oauth grant Type',
    options: [
      {
        items: [
          { label: 'Authorizecode', value: 'authorizecode' },
          { label: 'Password', value: 'password' },
        ],
      },
    ],
  },
  'rest.oauth.username': {
    type: 'text',
    label: 'Rest oauth username',
  },
  'rest.oauth.password': {
    type: 'text',
    inputType: 'password',
    label: 'Rest oauth password',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rest.refreshTokenMethod': {
    type: 'select',
    label: 'Refresh Token Method',
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
  'rest.refreshTokenBody': {
    type: 'text',
    label: 'Refresh Body',
  },
  'rest.refreshTokenURI': {
    type: 'text',
    label: 'Rest refresh Token URI',
  },
  'rest.refreshTokenPath': {
    type: 'text',
    label: 'Refresh Token Path',
  },
  'rest.refreshTokenMediaType': {
    type: 'select',
    label: 'Refresh Token Media Type',
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'rest.refreshTokenHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Refresh Token Headers',
  },
  'rest.info': {
    type: 'text',
    label: 'Rest info',
  },
  'rest.pingRelativeURI': {
    type: 'text',
    label: 'Ping URI',
  },
  'rest.pingSuccessPath': {
    type: 'text',
    label: 'Ping Success Path',
  },
  'rest.pingSuccessValues': {
    type: 'text',
    valueDelimiter: ',',
    label: 'Ping Success Values',
  },
  'rest.pingFailurePath': {
    type: 'text',
    label: 'Rest ping Failure Path',
  },
  'rest.pingFailureValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Rest ping Failure Values',
    validWhen: [],
  },
  'rest.concurrencyLevel': {
    type: 'select',
    label: 'Rest concurrency Level',
    options: [
      {
        items: [
          { label: '0', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 },
          { label: '11', value: 11 },
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '21', value: 21 },
          { label: '22', value: 22 },
          { label: '23', value: 23 },
          { label: '24', value: 24 },
          { label: '25', value: 25 },
        ],
      },
    ],
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  'rest.pingMethod': {
    type: 'select',
    label: 'Ping Method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.pingBody': {
    type: 'text',
    label: 'Ping Body',
  },
  // #endregion rest
  // #region http
  'http.auth.type': {
    type: 'select',
    label: 'Authentication Type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'Custom', value: 'custom' },
        ],
      },
    ],
  },
  'http.mediaType': {
    type: 'select',
    label: 'Media Type',
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  configureApiRateLimits: {
    label: 'Configure API Rate Limits',
    type: 'checkbox',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.limit,
  },
  'http.baseURI': {
    type: 'text',
    label: 'Base URI',
  },
  'http.disableStrictSSL': {
    type: 'checkbox',
    label: 'Http disable Strict SSL',
  },
  'http.concurrencyLevel': {
    label: 'Concurrency Level',
    type: 'select',
    options: [
      {
        items: [
          { label: '0', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 },
          { label: '11', value: 11 },
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '21', value: 21 },
          { label: '22', value: 22 },
          { label: '23', value: 23 },
          { label: '24', value: 24 },
          { label: '25', value: 25 },
        ],
      },
    ],
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  'http.retryHeader': {
    type: 'text',
    label: 'Retry Header',
  },
  'http.ping.relativeURI': {
    type: 'text',
    label: 'Ping Relative URI',
    description: 'Relative to Base URI',
  },
  'http.ping.method': {
    type: 'select',
    label: 'Ping Method',
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
  'http.ping.body': {
    type: 'text',
    label: 'Ping Body',
  },
  'http.ping.successPath': {
    type: 'text',
    label: 'Ping Success Path',
  },
  'http.ping.successValues': {
    type: 'text',
    label: 'Ping Success Values',
    valueDelimiter: ',',
  },
  'http.ping.errorPath': {
    type: 'text',
    label: 'Ping Error Path',
  },
  'http.auth.failStatusCode': {
    type: 'text',
    label: 'Http auth fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.auth.failPath': {
    type: 'text',
    label: 'Http auth fail Path',
  },
  'http.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http auth fail Values',
    validWhen: [],
  },
  'http.auth.basic.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'http.auth.basic.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
  },
  'http.auth.oauth.authURI': {
    type: 'text',
    label: 'Http auth oauth auth URI',
  },
  'http.auth.oauth.tokenURI': {
    type: 'text',
    label: 'Http auth oauth token URI',
  },
  'http.auth.oauth.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http auth oauth scope',
    validWhen: [],
  },
  'http.auth.oauth.scopeDelimiter': {
    type: 'text',
    label: 'Http auth oauth scope Delimiter',
  },
  'http.auth.oauth.accessTokenPath': {
    type: 'text',
    label: 'Http auth oauth access Token Path',
  },
  'http.auth.oauth.grantType': {
    type: 'radiogroup',
    label: 'Http auth oauth grant Type',
    options: [
      {
        items: [
          { label: 'Authorizecode', value: 'authorizecode' },
          { label: 'Password', value: 'password' },
        ],
      },
    ],
  },
  'http.auth.oauth.username': {
    type: 'text',
    label: 'Http auth oauth username',
  },
  'http.auth.oauth.password': {
    type: 'text',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    label: 'Http auth oauth password',
  },
  'http.auth.token.token': {
    type: 'text',
    label: 'Token',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'http.auth.token.location': {
    type: 'select',
    label: 'Location',
    options: [
      {
        items: [
          { label: 'URL Parameter', value: 'url' },
          { label: 'Header', value: 'header' },
          { label: 'Body', value: 'body' },
        ],
      },
    ],
  },
  'http.auth.token.headerName': {
    type: 'text',
    label: 'Header Name',
  },
  'http.auth.token.scheme': {
    type: 'select',
    label: 'Scheme',
    options: [
      {
        items: [
          { label: 'Bearer', value: 'Bearer' },
          { label: 'MAC', value: 'MAC' },
          { label: 'None', value: ' ' },
          { label: 'Custom', value: 'Custom' },
        ],
      },
    ],
  },
  'http.auth.token.paramName': {
    type: 'text',
    label: 'Parameter Name',
  },
  'http.auth.token.refreshMethod': {
    type: 'select',
    label: 'Refresh Method',
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
  'http.auth.token.refreshRelativeURI': {
    type: 'text',
    label: 'Refresh Relative URI',
  },
  'http.auth.token.refreshBody': {
    type: 'text',
    label: 'Refresh Body',
  },
  'http.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'Refresh Token Path',
  },
  'http.auth.token.refreshMediaType': {
    type: 'select',
    label: 'Refresh Media Type',
    options: [
      {
        items: [
          { label: 'Json', value: 'json' },
          { label: 'Urlencoded', value: 'urlencoded' },
          { label: 'Xml', value: 'xml' },
        ],
      },
    ],
  },
  'http.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Http auth token refresh Headers',
  },
  'http.auth.token.refreshToken': {
    type: 'text',
    label: 'Http auth token refresh Token',
  },
  'http.rateLimits': {
    type: 'labeltitle',
    label: 'API Rate Limits',
  },
  'http.rateLimit.failStatusCode': {
    type: 'text',
    label: 'Fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.rateLimit.failPath': {
    type: 'text',
    label: 'Fail Path',
  },
  'http.rateLimit.failValues': {
    type: 'text',
    label: 'Fail Values',
    valueDelimiter: ',',
  },
  'http.rateLimit.limit': {
    type: 'text',
    label: 'Limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure HTTP Headers',
  },
  'http.unencrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Unencrypted',
  },
  'http.encrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Encrypted',
  },
  'http.auth.oauth.scope': {
    type: 'selectscopes',
    label: 'Configure Scopes',
  },
  // #endregion http
  // #region ftp
  'ftp.hostURI': {
    type: 'text',
    label: 'Host',
    description:
      'If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.',
  },
  'ftp.type': {
    type: 'radiogroup',
    label: 'Protocol',
    options: [
      {
        items: [
          { label: 'FTP', value: 'ftp' },
          { label: 'SFTP', value: 'sftp' },
          { label: 'FTPS', value: 'ftps' },
        ],
      },
    ],
  },
  'ftp.username': {
    type: 'text',
    label: 'Username',
  },
  'ftp.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.authKey': {
    type: 'text',
    label: 'Authentication Key (PEM format)',
    placeholder: 'Optional if password is entered',
    multiline: true,
  },
  'ftp.port': {
    type: 'ftpport',
    label: 'Ftp port',
    validWhen: {
      fallsWithinNumericalRange: {
        min: 0,
        max: 65535,
        message: 'The value must be more than 0 and less than 65535',
      },
      matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
    },
  },
  'ftp.usePassiveMode': {
    type: 'checkbox',
    label: 'Use Passive Mode',
  },
  'ftp.entryParser': {
    type: 'select',
    label: 'Entry Parser',
    options: [
      {
        items: [
          { label: 'UNIX', value: 'UNIX' },
          { label: 'UNIX-TRIM', value: 'UNIX-TRIM' },
          { label: 'VMS', value: 'VMS' },
          { label: 'WINDOWS', value: 'WINDOWS' },
          { label: 'OS/2', value: 'OS/2' },
          { label: 'OS/400', value: 'OS/400' },
          { label: 'AS/400', value: 'AS/400' },
          { label: 'MVS', value: 'MVS' },
          { label: 'UNKNOWN-TYPE', value: 'UNKNOWN-TYPE' },
          { label: 'NETWARE', value: 'NETWARE' },
          { label: 'MACOS-PETER', value: 'MACOS-PETER' },
        ],
      },
    ],
  },
  'ftp.userDirectoryIsRoot': {
    type: 'checkbox',
    label: 'User Directory is Root',
  },
  'ftp.useImplicitFtps': {
    type: 'checkbox',
    label: 'Ftp use Implicit Ftps',
  },
  'ftp.requireSocketReUse': {
    type: 'checkbox',
    label: 'Ftp require Socket Re Use',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.usePgp': {
    type: 'checkbox',
    label: 'Use PGP Encryption',
  },
  'ftp.pgpEncryptKey': {
    type: 'text',
    label: 'PGP Public Key',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.pgpKeyAlgorithm': {
    type: 'select',
    label: 'PGP Encryption Algorithm',
    description:
      'Note: for security reasons this field must always be re-entered.',
    options: [
      {
        items: [
          { label: 'Please Select (Optional)', value: '' },
          { label: 'AES-256', value: 'AES-256' },
          { label: 'AES-192', value: 'AES-192' },
          { label: 'AES-128', value: 'AES-128' },
          { label: '3DES', value: '3DES' },
          { label: 'CAST5', value: 'CAST5' },
        ],
      },
    ],
    defaultValue: 'CAST5',
  },
  'ftp.pgpDecryptKey': {
    type: 'text',
    label: 'PGP Private Key',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.pgpPassphrase': {
    type: 'text',
    label: 'PGP Passphrase',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  // #endregion ftp
  // #region s3
  's3.accessKeyId': {
    type: 'text',
    label: 'S3 access Key Id',
  },
  's3.secretAccessKey': {
    type: 'text',
    label: 'S3 secret Access Key',
  },
  's3.pingBucket': {
    type: 'text',
    label: 'S3 ping Bucket',
  },
  // #endregion s3
  // #region as2
  'as2.as2Id': {
    type: 'text',
    label: 'AS2 Identifier',
    required: true,
  },
  configureTokenRefresh: {
    label: 'Configure Token Refresh',
    type: 'checkbox',
    defaultValue: r =>
      !!((((r && r.http) || {}).auth || {}).token || {}).refreshToken,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['token'],
      },
    ],
  },
  'as2.partnerId': {
    type: 'text',
    label: "Partner's AS2 Identifier:",
    required: true,
  },
  'as2.partnerStationInfo.as2URI': {
    type: 'text',
    label: "Partner's AS2 URL:",
    required: true,
  },
  'as2.partnerStationInfo.mdn.mdnURL': {
    type: 'text',
    label: "Partner's URL for Asynchronous MDN:",
    required: true,
    visibleWhen: [
      {
        field: 'partnerrequireasynchronousmdns',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',
    label: 'As2 partner Station Info mdn signature Protocol',
    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'as2.partnerStationInfo.mdn.mdnSigning': {
    type: 'select',
    label: 'MDN Verification Algorithm',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failStatusCode': {
    type: 'text',
    label: 'Authentication Fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        isNot: ['none'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.type': {
    type: 'select',
    label: 'Authentication Type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failPath': {
    type: 'text',
    label: 'Authentication Fail Path',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        isNot: ['none'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failValues': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Authentication Fail Values',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        isNot: ['none'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.basic.username': {
    type: 'text',
    label: 'Username',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.basic.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    defaultValue: '',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.token': {
    type: 'text',
    label: 'Token',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.location': {
    type: 'select',
    label: 'Location',
    options: [
      {
        items: [
          { label: 'URL Parameter', value: 'url' },
          { label: 'Header', value: 'header' },
          { label: 'Body', value: 'body' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.headerName': {
    type: 'text',
    label: 'Header Name',
    defaultValue: 'Authorization',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['header'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.scheme': {
    type: 'select',
    label: 'Scheme',
    options: [
      {
        items: [
          { label: 'Bearer', value: 'bearer' },
          { label: 'MAC', value: 'mac' },
          { label: 'OAuth', value: 'oauth' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['header'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.paramName': {
    type: 'text',
    label: 'Parameter Name',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['url'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshMethod': {
    type: 'select',
    label: 'Refresh Method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshRelativeURI': {
    type: 'text',
    label: 'Refresh Relative URI',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshBody': {
    type: 'editor',
    mode: 'json',
    label: 'Refresh Body',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.refreshMethod',
        is: ['POST', 'PUT'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'Refresh Token Path',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshMediaType': {
    type: 'select',
    label: 'Refresh Media Type',
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
          { label: 'XML', value: 'xml' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Refresh Token Headers',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshToken': {
    type: 'text',
    label: 'Refresh Token',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failStatusCode': {
    type: 'text',
    label: 'Fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failPath': {
    type: 'text',
    label: 'Fail Path',
  },
  'as2.partnerStationInfo.rateLimit.failValues': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Fail Values',
  },
  'as2.partnerStationInfo.rateLimit.limit': {
    type: 'text',
    label: 'Limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
      {
        fallsWithinNumericalRange: {
          message:
            'The value must be greater than undefined and  lesser than undefined',
        },
      },
    ],
  },

  'as2.partnerStationInfo.encryptionType': {
    type: 'select',
    label: 'Encryption Type',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'DES', value: 'DES' },
          { label: 'RC2', value: 'RC2' },
          { label: '3DES', value: '3DES' },
          { label: 'AES128', value: 'AES128' },
          { label: 'AES256', value: 'AES256' },
        ],
      },
    ],
  },
  as2url: {
    type: 'labelvalue',
    label: 'AS2 URL',
    value: 'https://api.staging.integrator.io/v1/as2',
  },
  requiremdnspartners: {
    type: 'labelvalue',
    label: 'Require MDNs from Partners?',
    value: 'Yes',
  },
  requireasynchronousmdns: {
    type: 'labelvalue',
    label: 'Require Asynchronous MDNs?',
    value: 'No',
  },
  partnerrequireasynchronousmdns: {
    type: 'checkbox',
    label: 'Partner Requires Asynchronous MDNs?',
  },
  'as2.userStationInfo.ipAddresses': {
    type: 'labelvalue',
    label: 'AS2 IP Addresses',
    value: 'Click here to see the list of IP Addresses.',
  },
  'as2.partnerStationInfo.signing': {
    type: 'select',
    label: 'Signing',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.encoding': {
    type: 'select',
    label: 'Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.signatureEncoding': {
    type: 'select',
    label: 'Signature Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.userStationInfo.mdn.mdnURL': {
    type: 'text',
    label: 'As2 user Station Info mdn mdn URL',
  },
  'as2.userStationInfo.encrypted.userPrivateKey': {
    type: 'editor',
    mode: 'text',
    label: 'X.509 Private Key',
  },
  'as2.userStationInfo.mdn.mdnSigning': {
    type: 'select',
    label: 'MDN Signing',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.userStationInfo.mdn.mdnEncoding': {
    type: 'select',
    label: 'Incoming Message Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.userStationInfo.encryptionType': {
    type: 'select',
    label: 'Decryption Algorithm',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'DES', value: 'DES' },
          { label: 'RC2', value: 'RC2' },
          { label: '3DES', value: '3DES' },
          { label: 'AES128', value: 'AES128' },
          { label: 'AES256', value: 'AES256' },
        ],
      },
    ],
  },
  'as2.userStationInfo.signing': {
    type: 'select',
    label: 'Signature Verification Algorithm',
    required: true,
    options: [
      {
        items: [
          { label: 'NONE', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.mdnSigning': {
    type: 'select',
    label: 'Signature Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.userStationInfo.encoding': {
    type: 'select',
    label: 'MDN Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.unencrypted.userPublicKey': {
    type: 'editor',
    mode: 'text',
    label: 'X.509 Public Certificate',
  },
  'as2.unencrypted.partnerCertificate': {
    type: 'editor',
    mode: 'text',
    label: "Partner's Certificate:",
  },
  // #endregion as2
  // #region netsuite
  'netsuite.authType': {
    type: 'select',
    label: 'Connection type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
        ],
      },
    ],
  },
  'netsuite.account': {
    type: 'netsuiteuserroles',
    label: 'NetSuite account',
  },
  'netsuite.tokenId': {
    type: 'text',
    label: 'NetSuite token Id',
  },
  'netsuite.tokenSecret': {
    type: 'text',
    label: 'NetSuite token Secret',
  },
  'netsuite.environment': {
    type: 'netsuiteuserroles',
    label: 'NetSuite environment',
  },
  'netsuite.roleId': {
    type: 'netsuiteuserroles',
    label: 'NetSuite role Id',
  },
  'netsuite.email': {
    type: 'text',
    label: 'NetSuite email',
  },
  'netsuite.password': {
    type: 'text',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    inputType: 'password',
    label: 'NetSuite password',
  },
  'netsuite.requestLevelCredentials': {
    type: 'checkbox',
    label: 'NetSuite request Level Credentials',
  },
  'netsuite.dataCenterURLs': {
    type: 'text',
    label: 'NetSuite data Center URLs',
  },
  'netsuite.accountName': {
    type: 'text',
    label: 'NetSuite account Name',
  },
  'netsuite.roleName': {
    type: 'text',
    label: 'NetSuite role Name',
  },
  'netsuite.concurrencyLevelRESTlet': {
    type: 'text',
    label: 'NetSuite concurrency Level RESTlet',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.concurrencyLevelWebServices': {
    type: 'text',
    label: 'NetSuite concurrency Level Web Services',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.linkSuiteScriptIntegrator': {
    label: 'Link SuiteScript Integrator',
    type: 'checkbox',
  },
  'netsuite.concurrencyLevel': {
    label: 'Concurrency Level',
    type: 'select',
    options: [
      {
        items: [
          { label: '0', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 },
          { label: '11', value: 11 },
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '21', value: 21 },
          { label: '22', value: 22 },
          { label: '23', value: 23 },
          { label: '24', value: 24 },
          { label: '25', value: 25 },
        ],
      },
    ],
  },
  'netsuite.wsdlVersion': {
    type: 'radiogroup',
    label: 'NetSuite wsdl Version',
    options: [
      {
        items: [
          { label: 'Current', value: 'current' },
          { label: 'Next', value: 'next' },
        ],
      },
    ],
  },
  'netsuite.applicationId': {
    type: 'text',
    label: 'NetSuite application Id',
  },
  // #endregion netsuite
  // #region netSuiteDistributedAdaptor
  'netSuiteDistributedAdaptor.accountId': {
    type: 'text',
    label: 'Net Suite Distributed Adaptor account Id',
  },
  'netSuiteDistributedAdaptor.environment': {
    type: 'select',
    label: 'Net Suite Distributed Adaptor environment',
    options: [
      {
        items: [
          { label: 'Production', value: 'production' },
          { label: 'Sandbox', value: 'sandbox' },
          { label: 'Beta', value: 'beta' },
          { label: 'Sandbox2.0', value: 'sandbox2.0' },
        ],
      },
    ],
  },
  'netSuiteDistributedAdaptor.connectionId': {
    type: 'text',
    label: 'Net Suite Distributed Adaptor connection Id',
  },
  'netSuiteDistributedAdaptor.username': {
    type: 'text',
    label: 'Net Suite Distributed Adaptor username',
  },
  'netSuiteDistributedAdaptor.uri': {
    type: 'text',
    label: 'Net Suite Distributed Adaptor uri',
  },
  // #endregion netSuiteDistributedAdaptor
  // #region salesforce
  'salesforce.sandbox': {
    type: 'select',
    label: 'Account Type',
    required: true,
    options: [
      {
        items: [
          { label: 'Production', value: false },
          { label: 'Sandbox', value: true },
        ],
      },
    ],
  },
  'salesforce.baseURI': {
    type: 'text',
    label: 'Salesforce base URI',
  },
  'salesforce.oauth2FlowType': {
    type: 'select',
    label: 'Oauth2 Flow Type',
    required: true,
    options: [
      {
        items: [
          { label: 'Refresh Token', value: 'refreshToken' },
          { label: 'JWT Bearer Token', value: 'jwtBearerToken' },
        ],
      },
    ],
  },
  'salesforce.username': {
    type: 'text',
    label: 'Username',
    visibleWhen: [
      {
        field: 'salesforce.oauth2FlowType',
        is: ['jwtBearerToken'],
      },
    ],
  },
  'salesforce.bearerToken': {
    type: 'text',
    label: 'Salesforce bearer Token',
  },
  'salesforce.refreshToken': {
    type: 'text',
    label: 'Salesforce refresh Token',
  },
  'salesforce.packagedOAuth': {
    type: 'checkbox',
    label: 'Salesforce packaged OAuth',
  },
  'salesforce.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce scope',
    validWhen: [],
  },
  'salesforce.info': {
    type: 'text',
    label: 'Salesforce info',
  },
  'salesforce.concurrencyLevel': {
    type: 'text',
    label: 'Concurrency Level',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  // #endregion salesforce
  // #region wrapper
  'wrapper.unencrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Wrapper unencrypted',
  },
  'wrapper.encrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Wrapper encrypted',
  },
  'wrapper.pingFunction': {
    type: 'text',
    label: 'Wrapper ping Function',
  },
  'wrapper._stackId': {
    type: 'text',
    label: 'Wrapper _stack Id',
  },
  'wrapper.concurrencyLevel': {
    type: 'text',
    label: 'Wrapper concurrency Level',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion wrapper
  // #region mongodb
  'mongodb.hosts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Mongodb host',
    validWhen: [],
  },
  'mongodb.database': {
    type: 'text',
    label: 'Mongodb database',
  },
  'mongodb.username': {
    type: 'text',
    label: 'Mongodb username',
  },
  'mongodb.password': {
    type: 'text',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    label: 'Mongodb password',
  },
  'mongodb.replicaSet': {
    type: 'text',
    label: 'Mongodb replica Set',
  },
  // #endregion mongodb

  // #region custom connection
};
