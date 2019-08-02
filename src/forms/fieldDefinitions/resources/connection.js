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
          { label: 'Netsuite', value: 'netsuite' },
          { label: 'Salesforce', value: 'salesforce' },
          { label: 'Ftp', value: 'ftp' },
          { label: 'S3', value: 's3' },
          { label: 'Rest', value: 'rest' },
          { label: 'Wrapper', value: 'wrapper' },
          { label: 'Http', value: 'http' },
          { label: 'Rdbms', value: 'rdbms' },
          { label: 'Mongodb', value: 'mongodb' },
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
          { label: 'Solidcommercxe', value: 'solidcommercxe' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Bamboohr', value: 'bamboohr' },
        ],
      },
    ],
  },
  // #endregion common
  // #region rdbms
  'rdbms.useSSL': {
    type: 'checkbox',
    label: 'Use SSL',
  },
  'rdbms.host': {
    type: 'text',
    label: 'Rdbms host',
  },
  'rdbms.port': {
    type: 'text',
    label: 'Rdbms port',
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
    label: 'Rdbms database',
  },
  connMode: {
    type: 'radiogroup',
    label: 'Mode',
    defaultValue: 'cloud',
    options: [
      {
        items: [
          { label: 'Cloud', value: 'cloud' },
          { label: 'On-Premise', value: 'onPremise' },
        ],
      },
    ],
  },
  'rdbms.instanceName': {
    type: 'text',
    label: 'Rdbms instance Name',
  },
  'rdbms.user': {
    type: 'text',
    label: 'Rdbms user',
  },
  'rdbms.password': {
    type: 'text',
    label: 'Rdbms password',
  },
  'rdbms.ssl.ca': {
    type: 'text',
    label: 'Rdbms ssl ca',
  },
  'rdbms.ssl.key': {
    type: 'text',
    label: 'Rdbms ssl key',
  },
  'rdbms.ssl.passphrase': {
    type: 'text',
    label: 'Rdbms ssl passphrase',
  },
  'rdbms.ssl.cert': {
    type: 'text',
    label: 'Rdbms ssl cert',
  },
  'rdbms.concurrencyLevel': {
    label: 'Concurrency Level',
    type: 'select',
    options: [
      {
        items: [
          { label: ' ', value: 0 },
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
    label: 'Rest media Type',
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
    label: 'Rest base URI',
    required: true,
  },
  'rest.bearerToken': {
    type: 'text',
    label: 'Token:',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
    helpText:
      'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
  },
  'rest.tokenLocation': {
    type: 'radiogroup',
    label: 'Rest token Location',
    options: [
      {
        items: [
          { label: 'Header', value: 'header' },
          { label: 'Url', value: 'url' },
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
    label: 'Rest scope',
    helpText:
      'OAuth 2.0 scopes provide a way to limit the amount of access that is granted to an access token. For example, an access token issued to a client app may be granted READ and WRITE access to protected resources, or just READ access.',
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
    label: 'Rest auth Type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'Oauth', value: 'oauth' },
          { label: 'Custom', value: 'custom' },
          { label: 'Cookie', value: 'cookie' },
          { label: 'Jwt', value: 'jwt' },
          { label: 'Hmac', value: 'hmac' },
          { label: 'Wsse', value: 'wsse' },
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
    label: 'Rest auth Scheme',
    options: [
      {
        items: [
          { label: 'MAC', value: 'MAC' },
          { label: 'OAuth', value: 'OAuth' },
          { label: 'Bearer', value: 'Bearer' },
          { label: 'Hmac', value: 'Hmac' },
          { label: ' ', value: ' ' },
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
  },
  'rest.cookieAuth.uri': {
    type: 'text',
    label: 'Rest cookie Auth uri',
  },
  'rest.cookieAuth.body': {
    type: 'text',
    label: 'Rest cookie Auth body',
  },
  'rest.cookieAuth.method': {
    type: 'text',
    label: 'Rest cookie Auth method',
  },
  'rest.cookieAuth.successStatusCode': {
    type: 'text',
    label: 'Rest cookie Auth success Status Code',
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
    label: 'Rest headers',
  },
  'rest.encrypted': {
    type: 'text',
    label: 'Rest encrypted',
  },
  'rest.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    label: 'Rest encrypted',
  },
  'rest.unencrypted': {
    type: 'text',
    label: 'Rest unencrypted',
  },
  'rest.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    label: 'Rest unencrypted',
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
    label: 'Rest oauth password',
  },
  'rest.refreshTokenMethod': {
    type: 'text',
    label: 'Rest refresh Token Method',
  },
  'rest.refreshTokenBody': {
    type: 'text',
    label: 'Rest refresh Token Body',
  },
  'rest.refreshTokenURI': {
    type: 'text',
    label: 'Rest refresh Token URI',
  },
  'rest.refreshTokenPath': {
    type: 'text',
    label: 'Rest refresh Token Path',
  },
  'rest.refreshTokenMediaType': {
    type: 'radiogroup',
    label: 'Rest refresh Token Media Type',
    options: [
      {
        items: [
          { label: 'Json', value: 'json' },
          { label: 'Urlencoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'rest.refreshTokenHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Rest refresh Token Headers',
  },
  'rest.info': {
    type: 'text',
    label: 'Rest info',
  },
  'rest.pingRelativeURI': {
    type: 'text',
    label: 'Rest ping Relative URI',
  },
  'rest.pingSuccessPath': {
    type: 'text',
    label: 'Rest ping Success Path',
  },
  'rest.pingSuccessValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Rest ping Success Values',
    validWhen: [],
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
          { label: ' ', value: 0 },
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
    type: 'radiogroup',
    label: 'Rest ping Method',
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
    label: 'Rest ping Body',
  },
  // #endregion rest
  // #region http
  'http.auth.type': {
    type: 'select',
    label: 'Authentication Type:',
    helpText: `The HTTP adaptors currently support 3 types of authentication. Choose 'basic' authentication if your service implements the HTTP basic auth strategy. This auth method adds a base64 encoded username/password pair value in the 'authentication' HTTP request header.  Choose 'token' if your service relies on token-based authentication. The token may exist in the header, url or body of the http request. This method also supports refreshing tokens if supported by the service being called. Finally, choose 'custom' for all other types. If you select the 'custom' auth method integrator.io will not perform any special auth processing. It is up to the user to configure the HTTP request fields (method, relativeUri, headers and body) of the import and export models to include {{placeholders}} for any authentication related values. These values can be stored in the 'encrypted' and 'unencrypted' fields of this connection.`,
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
    label: 'Http media Type',
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
    label: 'Configure API Rate Limits:',
    type: 'checkbox',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.limit,
  },
  'http.baseURI': {
    type: 'text',
    label: 'Base URI:',
  },
  'http.disableStrictSSL': {
    type: 'checkbox',
    label: 'Http disable Strict SSL',
  },
  'http.concurrencyLevel': {
    label: 'Http concurrency Level',
    type: 'select',
    options: [
      {
        items: [
          { label: ' ', value: 0 },
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
    label: 'Retry Header:',
  },
  'http.pingHeader': {
    type: 'labeltitle',
    label: 'How to test connection?',
  },
  'http.ping.relativeURI': {
    type: 'text',
    label: 'Ping Relative URI:',
    description: 'Relative to Base URI',
  },
  'http.ping.method': {
    type: 'select',
    label: 'Ping Method:',
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
    label: 'Ping Body:',
  },
  'http.ping.successPath': {
    type: 'text',
    label: 'Ping Success Path:',
  },
  'http.ping.successValues': {
    type: 'text',
    label: 'Ping Success Values:',
    valueDelimiter: ',',
  },
  'http.ping.errorPath': {
    type: 'text',
    label: 'Ping Error Path:',
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
    label: 'Http auth oauth password',
  },
  'http.auth.token.token': {
    type: 'text',
    label: 'Token:',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
    helpText: `The authentication token provided to you from the service provider. Some service providers use other names for this value such as 'bearer token', or 'secret key', etc.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your token safe. In some cases, a service may have a token request process, or tokens that expire after a given time. Use the refresh fields to instruct integrator.io on how to request and extract the token form the response.`,
  },
  'http.auth.token.location': {
    type: 'select',
    label: 'Location:',
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
    label: 'Header Name:',
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
    label: 'Parameter Name:',
  },
  'http.auth.token.refreshMethod': {
    type: 'select',
    label: 'Refresh Method:',
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
    label: 'Refresh Relative URI:',
  },
  'http.auth.token.refreshBody': {
    type: 'text',
    label: 'Refresh Body:',
  },
  'http.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'Refresh Token Path:',
  },
  'http.auth.token.refreshMediaType': {
    type: 'select',
    label: 'Refresh Media Type:',
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
    label: 'Fail Status Code:',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.rateLimit.failPath': {
    type: 'text',
    label: 'Fail Path:',
  },
  'http.rateLimit.failValues': {
    type: 'text',
    label: 'Fail Values:',
    valueDelimiter: ',',
  },
  'http.rateLimit.limit': {
    type: 'text',
    label: 'Limit:',
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
    label: 'Http headers',
  },
  'http.unencrypted': {
    type: 'textarea',
    label: 'Unencrypted:',
  },
  'http.encrypted': {
    type: 'textarea',
    label: 'Encrypted:',
  },
  'http.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    label: 'Http encrypted',
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
          { label: 'Please Select (Optional)', value: '' },
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
    label: 'As2 as2Id',
  },
  'as2.partnerId': {
    type: 'text',
    label: 'As2 partner Id',
  },
  'as2.contentBasedFlowRouter.function': {
    type: 'text',
    label: 'As2 content Based Flow Router function',
  },
  'as2.contentBasedFlowRouter._scriptId': {
    type: 'text',
    label: 'As2 content Based Flow Router _script Id',
  },
  'as2.partnerStationInfo.as2URI': {
    type: 'text',
    label: 'As2 partner Station Info as2URI',
  },
  'as2.partnerStationInfo.mdn.mdnURL': {
    type: 'text',
    label: 'As2 partner Station Info mdn mdn URL',
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
    label: 'As2 partner Station Info mdn mdn Signing',
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
    label: 'As2 partner Station Info auth fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.auth.failPath': {
    type: 'text',
    label: 'As2 partner Station Info auth fail Path',
  },
  'as2.partnerStationInfo.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'As2 partner Station Info auth fail Values',
    validWhen: [],
  },
  'as2.partnerStationInfo.auth.basic.username': {
    type: 'text',
    label: 'As2 partner Station Info auth basic username',
  },
  'as2.partnerStationInfo.auth.basic.password': {
    type: 'text',
    label: 'As2 partner Station Info auth basic password',
  },
  'as2.partnerStationInfo.auth.token.token': {
    type: 'text',
    label: 'As2 partner Station Info auth token token',
  },
  'as2.partnerStationInfo.auth.token.location': {
    type: 'select',
    label: 'As2 partner Station Info auth token location',
    options: [
      {
        items: [
          { label: 'Url', value: 'url' },
          { label: 'Header', value: 'header' },
          { label: 'Body', value: 'body' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.headerName': {
    type: 'text',
    label: 'As2 partner Station Info auth token header Name',
  },
  'as2.partnerStationInfo.auth.token.scheme': {
    type: 'text',
    label: 'As2 partner Station Info auth token scheme',
  },
  'as2.partnerStationInfo.auth.token.paramName': {
    type: 'text',
    label: 'As2 partner Station Info auth token param Name',
  },
  'as2.partnerStationInfo.auth.token.refreshMethod': {
    type: 'radiogroup',
    label: 'As2 partner Station Info auth token refresh Method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshRelativeURI': {
    type: 'text',
    label: 'As2 partner Station Info auth token refresh Relative URI',
  },
  'as2.partnerStationInfo.auth.token.refreshBody': {
    type: 'text',
    label: 'As2 partner Station Info auth token refresh Body',
  },
  'as2.partnerStationInfo.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'As2 partner Station Info auth token refresh Token Path',
  },
  'as2.partnerStationInfo.auth.token.refreshMediaType': {
    type: 'select',
    label: 'As2 partner Station Info auth token refresh Media Type',
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
  'as2.partnerStationInfo.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'As2 partner Station Info auth token refresh Headers',
  },
  'as2.partnerStationInfo.auth.token.refreshToken': {
    type: 'text',
    label: 'As2 partner Station Info auth token refresh Token',
  },
  'as2.partnerStationInfo.rateLimit.failStatusCode': {
    type: 'text',
    label: 'As2 partner Station Info rate Limit fail Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failPath': {
    type: 'text',
    label: 'As2 partner Station Info rate Limit fail Path',
  },
  'as2.partnerStationInfo.rateLimit.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'As2 partner Station Info rate Limit fail Values',
    validWhen: [],
  },
  'as2.partnerStationInfo.rateLimit.limit': {
    type: 'text',
    label: 'As2 partner Station Info rate Limit limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
      {
        fallsWithinNumericalRange: {
          message:
            'The value must be greater than undefined and  lesser than undefined',
        },
      },
    ],
  },
  'as2.partnerStationInfo.SMIMEVersion': {
    type: 'radiogroup',
    label: 'As2 partner Station Info SMIMEVersion',
    options: [
      { items: [{ label: 'V2', value: 'v2' }, { label: 'V3', value: 'v3' }] },
    ],
  },
  'as2.partnerStationInfo.encryptionType': {
    type: 'select',
    label: 'As2 partner Station Info encryption Type',
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
  'as2.partnerStationInfo.signing': {
    type: 'select',
    label: 'As2 partner Station Info signing',
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
    type: 'radiogroup',
    label: 'As2 partner Station Info encoding',
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
  'as2.userStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',
    label: 'As2 user Station Info mdn signature Protocol',
    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'as2.userStationInfo.mdn.mdnSigning': {
    type: 'select',
    label: 'As2 user Station Info mdn mdn Signing',
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
  'as2.userStationInfo.encryptionType': {
    type: 'select',
    label: 'As2 user Station Info encryption Type',
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
    label: 'As2 user Station Info signing',
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
  'as2.userStationInfo.encoding': {
    type: 'radiogroup',
    label: 'As2 user Station Info encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.encrypted': {
    type: 'text',
    label: 'As2 encrypted',
  },
  'as2.concurrencyLevel': {
    type: 'text',
    label: 'As2 concurrency Level',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.unencrypted': {
    type: 'text',
    label: 'As2 unencrypted',
  },
  'as2.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    label: 'As2 encrypted',
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
    type: 'text',
    label: 'Netsuite account',
  },
  'netsuite.tokenId': {
    type: 'text',
    label: 'Netsuite token Id',
  },
  'netsuite.tokenSecret': {
    type: 'text',
    label: 'Netsuite token Secret',
  },
  'netsuite.environment': {
    type: 'select',
    label: 'Netsuite environment',
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
  'netsuite.roleId': {
    type: 'text',
    label: 'Netsuite role Id',
  },
  'netsuite.email': {
    type: 'text',
    label: 'Netsuite email',
  },
  'netsuite.password': {
    type: 'text',
    label: 'Netsuite password',
  },
  'netsuite.requestLevelCredentials': {
    type: 'checkbox',
    label: 'Netsuite request Level Credentials',
  },
  'netsuite.dataCenterURLs': {
    type: 'text',
    label: 'Netsuite data Center URLs',
  },
  'netsuite.accountName': {
    type: 'text',
    label: 'Netsuite account Name',
  },
  'netsuite.roleName': {
    type: 'text',
    label: 'Netsuite role Name',
  },
  'netsuite.concurrencyLevelRESTlet': {
    type: 'text',
    label: 'Netsuite concurrency Level RESTlet',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.concurrencyLevelWebServices': {
    type: 'text',
    label: 'Netsuite concurrency Level Web Services',
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
          { label: ' ', value: 0 },
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
    label: 'Netsuite wsdl Version',
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
    label: 'Netsuite application Id',
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
    type: 'checkbox',
    label: 'Salesforce sandbox',
  },
  'salesforce.baseURI': {
    type: 'text',
    label: 'Salesforce base URI',
  },
  'salesforce.oauth2FlowType': {
    type: 'radiogroup',
    label: 'Salesforce oauth2Flow Type',
    options: [
      {
        items: [
          { label: 'JwtBearerToken', value: 'jwtBearerToken' },
          { label: 'RefreshToken', value: 'refreshToken' },
        ],
      },
    ],
  },
  'salesforce.username': {
    type: 'text',
    label: 'Salesforce username',
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
    label: 'Salesforce concurrency Level',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion salesforce
  // #region wrapper
  'wrapper.unencrypted': {
    type: 'text',
    label: 'Wrapper unencrypted',
  },
  'wrapper.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    label: 'Wrapper unencrypted',
  },
  'wrapper.encrypted': {
    type: 'text',
    label: 'Wrapper encrypted',
  },
  'wrapper.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
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
    label: 'Mongodb password',
  },
  'mongodb.replicaSet': {
    type: 'text',
    label: 'Mongodb replica Set',
  },
  // #endregion mongodb

  // #region custom connection
};
