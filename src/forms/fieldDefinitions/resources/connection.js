export default {
  // #region common
  // TODO: develop code for this two components
  // agent list handleBars evaluated its a dynamicList
  _borrowConcurrencyFromConnectionId: {
    name: '/_borrowConcurrencyFromConnectionId',
    resourceType: 'connections',
    filter: r => ({ type: r.type }),
    excludeFilter: r => ({ _id: r._id }),
    type: 'selectresource',
    label: 'Borrow Concurrency From',
  },

  // TODO test it if it actually works
  // selecting all agents
  _agentId: {
    type: 'selectresource',
    name: '/_agentId',
    label: 'Agent',

    resourceType: 'agents',
    // filter: r => ({ type: r.type }),
    // excludeFilter: r => ({ _
  },
  type: {
    type: 'select',
    name: '/type',
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

    name: '/name',

    label: 'Name',
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

    name: '/rdbms/useSSL',

    label: 'Use SSL',
  },
  'rdbms.host': {
    type: 'text',

    name: '/rdbms/host',

    label: 'Rdbms host',
  },
  'rdbms.port': {
    type: 'text',

    name: '/rdbms/port',

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

    name: '/rdbms/database',

    label: 'Rdbms database',
  },
  connMode: {
    type: 'radiogroup',

    name: 'connMode',

    label: 'Mode',

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

    name: '/rdbms/instanceName',

    label: 'Rdbms instance Name',
  },
  'rdbms.user': {
    type: 'text',

    name: '/rdbms/user',

    label: 'Rdbms user',
  },
  'rdbms.password': {
    type: 'text',

    name: '/rdbms/password',

    label: 'Rdbms password',
  },
  'rdbms.ssl.ca': {
    type: 'text',

    name: '/rdbms/ssl/ca',

    label: 'Rdbms ssl ca',
  },
  'rdbms.ssl.key': {
    type: 'text',

    name: '/rdbms/ssl/key',

    label: 'Rdbms ssl key',
  },
  'rdbms.ssl.passphrase': {
    type: 'text',

    name: '/rdbms/ssl/passphrase',

    label: 'Rdbms ssl passphrase',
  },
  'rdbms.ssl.cert': {
    type: 'text',

    name: '/rdbms/ssl/cert',

    label: 'Rdbms ssl cert',
  },
  'rdbms.concurrencyLevel': {
    name: '/rdbms/concurrencyLevel',

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

    name: '/rest/mediaType',

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

    name: '/rest/baseURI',

    label: 'Rest base URI',
  },
  'rest.bearerToken': {
    type: 'text',

    name: '/rest/bearerToken',

    label: 'Rest bearer Token',
  },
  'rest.tokenLocation': {
    type: 'radiogroup',

    name: '/rest/tokenLocation',

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

    name: '/rest/tokenParam',

    label: 'Rest token Param',
  },
  'rest.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/rest/scopes',

    label: 'Rest scope',

    validWhen: [],
  },
  'rest.scopeDelimiter': {
    type: 'text',

    name: '/rest/scopeDelimiter',

    label: 'Rest scope Delimiter',
  },
  'rest.refreshToken': {
    type: 'text',

    name: '/rest/refreshToken',

    label: 'Rest refresh Token',
  },
  'rest.oauthTokenURI': {
    type: 'text',

    name: '/rest/oauthTokenURI',

    label: 'Rest oauth Token URI',
  },
  'rest.disableStrictSSL': {
    type: 'checkbox',

    name: '/rest/disableStrictSSL',

    label: 'Rest disable Strict SSL',
  },
  'rest.authType': {
    type: 'select',

    name: '/rest/authType',

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

    name: '/rest/authURI',

    label: 'Rest auth URI',
  },
  'rest.authHeader': {
    type: 'text',

    name: '/rest/authHeader',

    label: 'Rest auth Header',
  },
  'rest.retryHeader': {
    type: 'text',

    name: '/rest/retryHeader',

    label: 'Rest retry Header',
  },
  'rest.authScheme': {
    type: 'select',

    name: '/rest/authScheme',

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

    name: '/rest/basicAuth/username',

    label: 'Rest basic Auth username',
  },
  'rest.basicAuth.password': {
    type: 'text',

    name: '/rest/basicAuth/password',

    label: 'Rest basic Auth password',
  },
  'rest.cookieAuth.uri': {
    type: 'text',

    name: '/rest/cookieAuth/uri',

    label: 'Rest cookie Auth uri',
  },
  'rest.cookieAuth.body': {
    type: 'text',

    name: '/rest/cookieAuth/body',

    label: 'Rest cookie Auth body',
  },
  'rest.cookieAuth.method': {
    type: 'text',

    name: '/rest/cookieAuth/method',

    label: 'Rest cookie Auth method',
  },
  'rest.cookieAuth.successStatusCode': {
    type: 'text',

    name: '/rest/cookieAuth/successStatusCode',

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

    name: '/rest/headers',

    label: 'Rest headers',
  },
  'rest.encrypted': {
    type: 'text',

    name: '/rest/encrypted',

    label: 'Rest encrypted',
  },
  'rest.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/rest/encrypteds',

    label: 'Rest encrypted',
  },
  'rest.unencrypted': {
    type: 'text',

    name: '/rest/unencrypted',

    label: 'Rest unencrypted',
  },
  'rest.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/rest/unencrypteds',

    label: 'Rest unencrypted',
  },
  'rest.oauth.accessTokenPath': {
    type: 'text',

    name: '/rest/oauth/accessTokenPath',

    label: 'Rest oauth access Token Path',
  },
  'rest.oauth.grantType': {
    type: 'radiogroup',

    name: '/rest/oauth/grantType',

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

    name: '/rest/oauth/username',

    label: 'Rest oauth username',
  },
  'rest.oauth.password': {
    type: 'text',

    name: '/rest/oauth/password',

    label: 'Rest oauth password',
  },
  'rest.refreshTokenMethod': {
    type: 'text',

    name: '/rest/refreshTokenMethod',

    label: 'Rest refresh Token Method',
  },
  'rest.refreshTokenBody': {
    type: 'text',

    name: '/rest/refreshTokenBody',

    label: 'Rest refresh Token Body',
  },
  'rest.refreshTokenURI': {
    type: 'text',

    name: '/rest/refreshTokenURI',

    label: 'Rest refresh Token URI',
  },
  'rest.refreshTokenPath': {
    type: 'text',

    name: '/rest/refreshTokenPath',

    label: 'Rest refresh Token Path',
  },
  'rest.refreshTokenMediaType': {
    type: 'radiogroup',

    name: '/rest/refreshTokenMediaType',

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

    name: '/rest/refreshTokenHeaders',

    label: 'Rest refresh Token Headers',
  },
  'rest.info': {
    type: 'text',

    name: '/rest/info',

    label: 'Rest info',
  },
  'rest.pingRelativeURI': {
    type: 'text',

    name: '/rest/pingRelativeURI',

    label: 'Rest ping Relative URI',
  },
  'rest.pingSuccessPath': {
    type: 'text',

    name: '/rest/pingSuccessPath',

    label: 'Rest ping Success Path',
  },
  'rest.pingSuccessValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/rest/pingSuccessValuess',

    label: 'Rest ping Success Values',

    validWhen: [],
  },
  'rest.pingFailurePath': {
    type: 'text',

    name: '/rest/pingFailurePath',

    label: 'Rest ping Failure Path',
  },
  'rest.pingFailureValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/rest/pingFailureValuess',

    label: 'Rest ping Failure Values',

    validWhen: [],
  },
  'rest.concurrencyLevel': {
    type: 'text',

    name: '/rest/concurrencyLevel',

    label: 'Rest concurrency Level',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.pingMethod': {
    type: 'radiogroup',

    name: '/rest/pingMethod',

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

    name: '/rest/pingBody',

    label: 'Rest ping Body',
  },
  // #endregion rest
  // #region http
  'http.mediaType': {
    type: 'radiogroup',

    name: '/http/mediaType',

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
  'http.baseURI': {
    type: 'text',

    name: '/http/baseURI',

    label: 'Http base URI',
  },
  'http.disableStrictSSL': {
    type: 'checkbox',

    name: '/http/disableStrictSSL',

    label: 'Http disable Strict SSL',
  },
  'http.concurrencyLevel': {
    name: '/http/concurrencyLevel',

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
  },
  'http.retryHeader': {
    type: 'text',

    name: '/http/retryHeader',

    label: 'Http retry Header',
  },
  'http.ping.relativeURI': {
    type: 'text',

    name: '/http/ping/relativeURI',

    label: 'Http ping relative URI',
  },
  'http.ping.method': {
    type: 'select',

    name: '/http/ping/method',

    label: 'Http ping method',

    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'HEAD', value: 'HEAD' },
        ],
      },
    ],
  },
  'http.ping.body': {
    type: 'text',

    name: '/http/ping/body',

    label: 'Http ping body',
  },
  'http.ping.successPath': {
    type: 'text',

    name: '/http/ping/successPath',

    label: 'Http ping success Path',
  },
  'http.ping.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/ping/successValuess',

    label: 'Http ping success Values',

    validWhen: [],
  },
  'http.ping.errorPath': {
    type: 'text',

    name: '/http/ping/errorPath',

    label: 'Http ping error Path',
  },
  'http.auth.failStatusCode': {
    type: 'text',

    name: '/http/auth/failStatusCode',

    label: 'Http auth fail Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.auth.failPath': {
    type: 'text',

    name: '/http/auth/failPath',

    label: 'Http auth fail Path',
  },
  'http.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/auth/failValuess',

    label: 'Http auth fail Values',

    validWhen: [],
  },
  'http.auth.basic.username': {
    type: 'text',

    name: '/http/auth/basic/username',

    label: 'Http auth basic username',
  },
  'http.auth.basic.password': {
    type: 'text',

    name: '/http/auth/basic/password',

    label: 'Http auth basic password',
  },
  'http.auth.oauth.authURI': {
    type: 'text',

    name: '/http/auth/oauth/authURI',

    label: 'Http auth oauth auth URI',
  },
  'http.auth.oauth.tokenURI': {
    type: 'text',

    name: '/http/auth/oauth/tokenURI',

    label: 'Http auth oauth token URI',
  },
  'http.auth.oauth.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/auth/oauth/scopes',

    label: 'Http auth oauth scope',

    validWhen: [],
  },
  'http.auth.oauth.scopeDelimiter': {
    type: 'text',

    name: '/http/auth/oauth/scopeDelimiter',

    label: 'Http auth oauth scope Delimiter',
  },
  'http.auth.oauth.accessTokenPath': {
    type: 'text',

    name: '/http/auth/oauth/accessTokenPath',

    label: 'Http auth oauth access Token Path',
  },
  'http.auth.oauth.grantType': {
    type: 'radiogroup',

    name: '/http/auth/oauth/grantType',

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

    name: '/http/auth/oauth/username',

    label: 'Http auth oauth username',
  },
  'http.auth.oauth.password': {
    type: 'text',

    name: '/http/auth/oauth/password',

    label: 'Http auth oauth password',
  },
  'http.auth.token.token': {
    type: 'text',

    name: '/http/auth/token/token',

    label: 'Http auth token token',
  },
  'http.auth.token.location': {
    type: 'select',

    name: '/http/auth/token/location',

    label: 'Http auth token location',

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
  'http.auth.token.headerName': {
    type: 'text',

    name: '/http/auth/token/headerName',

    label: 'Http auth token header Name',
  },
  'http.auth.token.scheme': {
    type: 'text',

    name: '/http/auth/token/scheme',

    label: 'Http auth token scheme',
  },
  'http.auth.token.paramName': {
    type: 'text',

    name: '/http/auth/token/paramName',

    label: 'Http auth token param Name',
  },
  'http.auth.token.refreshMethod': {
    type: 'radiogroup',

    name: '/http/auth/token/refreshMethod',

    label: 'Http auth token refresh Method',

    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'http.auth.token.refreshRelativeURI': {
    type: 'text',

    name: '/http/auth/token/refreshRelativeURI',

    label: 'Http auth token refresh Relative URI',
  },
  'http.auth.token.refreshBody': {
    type: 'text',

    name: '/http/auth/token/refreshBody',

    label: 'Http auth token refresh Body',
  },
  'http.auth.token.refreshTokenPath': {
    type: 'text',

    name: '/http/auth/token/refreshTokenPath',

    label: 'Http auth token refresh Token Path',
  },
  'http.auth.token.refreshMediaType': {
    type: 'select',

    name: '/http/auth/token/refreshMediaType',

    label: 'Http auth token refresh Media Type',

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

    name: '/http/auth/token/refreshHeaders',

    label: 'Http auth token refresh Headers',
  },
  'http.auth.token.refreshToken': {
    type: 'text',

    name: '/http/auth/token/refreshToken',

    label: 'Http auth token refresh Token',
  },
  'http.rateLimit.failStatusCode': {
    type: 'text',

    name: '/http/rateLimit/failStatusCode',

    label: 'Http rate Limit fail Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.rateLimit.failPath': {
    type: 'text',

    name: '/http/rateLimit/failPath',

    label: 'Http rate Limit fail Path',
  },
  'http.rateLimit.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/http/rateLimit/failValuess',

    label: 'Http rate Limit fail Values',

    validWhen: [],
  },
  'http.rateLimit.limit': {
    type: 'text',

    name: '/http/rateLimit/limit',

    label: 'Http rate Limit limit',

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
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',

    name: '/http/headers',

    label: 'Http headers',
  },
  'http.unencrypted': {
    type: 'text',

    name: '/http/unencrypted',

    label: 'Http unencrypted',
  },
  'http.encrypted': {
    type: 'text',

    name: '/http/encrypted',

    label: 'Http encrypted',
  },
  'http.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/http/encrypteds',

    label: 'Http encrypted',
  },
  // #endregion http
  // #region ftp
  'ftp.hostURI': {
    type: 'text',

    name: '/ftp/hostURI',

    label: 'Host',
  },
  'ftp.type': {
    type: 'radiogroup',

    name: '/ftp/type',

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

    name: '/ftp/username',

    label: 'Username',
  },
  'ftp.password': {
    type: 'text',

    name: '/ftp/password',

    label: 'Password',
  },
  'ftp.authKey': {
    type: 'text',

    name: '/ftp/authKey',

    label: 'Authentication Key (PEM format)',
  },
  'ftp.port': {
    type: 'ftpport',

    name: '/ftp/port',

    label: 'Ftp port',

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
  'ftp.usePassiveMode': {
    type: 'checkbox',

    name: '/ftp/usePassiveMode',

    label: 'Use Passive Mode',
  },
  'ftp.entryParser': {
    type: 'select',

    name: '/ftp/entryParser',

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

    name: '/ftp/userDirectoryIsRoot',

    label: 'User Directory is Root',
  },
  'ftp.useImplicitFtps': {
    type: 'checkbox',

    name: '/ftp/useImplicitFtps',

    label: 'Ftp use Implicit Ftps',
  },
  'ftp.requireSocketReUse': {
    type: 'checkbox',

    name: '/ftp/requireSocketReUse',

    label: 'Ftp require Socket Re Use',
  },
  'ftp.usePgp': {
    type: 'checkbox',

    name: '/ftp/usePgp',

    label: 'Use PGP Encryption',
  },
  'ftp.pgpEncryptKey': {
    type: 'text',

    name: '/ftp/pgpEncryptKey',

    label: 'PGP Public Key',
  },
  'ftp.pgpDecryptKey': {
    type: 'text',

    name: '/ftp/pgpDecryptKey',

    label: 'PGP Private Key',
  },
  'ftp.pgpPassphrase': {
    type: 'text',

    name: '/ftp/pgpPassphrase',

    label: 'PGP Passphrase',
  },
  // #endregion ftp
  // #region s3
  's3.accessKeyId': {
    type: 'text',

    name: '/s3/accessKeyId',

    label: 'S3 access Key Id',
  },
  's3.secretAccessKey': {
    type: 'text',

    name: '/s3/secretAccessKey',

    label: 'S3 secret Access Key',
  },
  's3.pingBucket': {
    type: 'text',

    name: '/s3/pingBucket',

    label: 'S3 ping Bucket',
  },
  // #endregion s3
  // #region as2
  'as2.as2Id': {
    type: 'text',

    name: '/as2/as2Id',

    label: 'As2 as2Id',
  },
  'as2.partnerId': {
    type: 'text',

    name: '/as2/partnerId',

    label: 'As2 partner Id',
  },
  'as2.contentBasedFlowRouter.function': {
    type: 'text',

    name: '/as2/contentBasedFlowRouter/function',

    label: 'As2 content Based Flow Router function',
  },
  'as2.contentBasedFlowRouter._scriptId': {
    type: 'text',

    name: '/as2/contentBasedFlowRouter/_scriptId',

    label: 'As2 content Based Flow Router _script Id',
  },
  'as2.partnerStationInfo.as2URI': {
    type: 'text',

    name: '/as2/partnerStationInfo/as2URI',

    label: 'As2 partner Station Info as2URI',
  },
  'as2.partnerStationInfo.mdn.mdnURL': {
    type: 'text',

    name: '/as2/partnerStationInfo/mdn/mdnURL',

    label: 'As2 partner Station Info mdn mdn URL',
  },
  'as2.partnerStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',

    name: '/as2/partnerStationInfo/mdn/signatureProtocol',

    label: 'As2 partner Station Info mdn signature Protocol',

    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'as2.partnerStationInfo.mdn.mdnSigning': {
    type: 'select',

    name: '/as2/partnerStationInfo/mdn/mdnSigning',

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

    name: '/as2/partnerStationInfo/auth/failStatusCode',

    label: 'As2 partner Station Info auth fail Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.auth.failPath': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/failPath',

    label: 'As2 partner Station Info auth fail Path',
  },
  'as2.partnerStationInfo.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/as2/partnerStationInfo/auth/failValuess',

    label: 'As2 partner Station Info auth fail Values',

    validWhen: [],
  },
  'as2.partnerStationInfo.auth.basic.username': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/basic/username',

    label: 'As2 partner Station Info auth basic username',
  },
  'as2.partnerStationInfo.auth.basic.password': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/basic/password',

    label: 'As2 partner Station Info auth basic password',
  },
  'as2.partnerStationInfo.auth.token.token': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/token',

    label: 'As2 partner Station Info auth token token',
  },
  'as2.partnerStationInfo.auth.token.location': {
    type: 'select',

    name: '/as2/partnerStationInfo/auth/token/location',

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

    name: '/as2/partnerStationInfo/auth/token/headerName',

    label: 'As2 partner Station Info auth token header Name',
  },
  'as2.partnerStationInfo.auth.token.scheme': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/scheme',

    label: 'As2 partner Station Info auth token scheme',
  },
  'as2.partnerStationInfo.auth.token.paramName': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/paramName',

    label: 'As2 partner Station Info auth token param Name',
  },
  'as2.partnerStationInfo.auth.token.refreshMethod': {
    type: 'radiogroup',

    name: '/as2/partnerStationInfo/auth/token/refreshMethod',

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

    name: '/as2/partnerStationInfo/auth/token/refreshRelativeURI',

    label: 'As2 partner Station Info auth token refresh Relative URI',
  },
  'as2.partnerStationInfo.auth.token.refreshBody': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/refreshBody',

    label: 'As2 partner Station Info auth token refresh Body',
  },
  'as2.partnerStationInfo.auth.token.refreshTokenPath': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/refreshTokenPath',

    label: 'As2 partner Station Info auth token refresh Token Path',
  },
  'as2.partnerStationInfo.auth.token.refreshMediaType': {
    type: 'select',

    name: '/as2/partnerStationInfo/auth/token/refreshMediaType',

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

    name: '/as2/partnerStationInfo/auth/token/refreshHeaders',

    label: 'As2 partner Station Info auth token refresh Headers',
  },
  'as2.partnerStationInfo.auth.token.refreshToken': {
    type: 'text',

    name: '/as2/partnerStationInfo/auth/token/refreshToken',

    label: 'As2 partner Station Info auth token refresh Token',
  },
  'as2.partnerStationInfo.rateLimit.failStatusCode': {
    type: 'text',

    name: '/as2/partnerStationInfo/rateLimit/failStatusCode',

    label: 'As2 partner Station Info rate Limit fail Status Code',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failPath': {
    type: 'text',

    name: '/as2/partnerStationInfo/rateLimit/failPath',

    label: 'As2 partner Station Info rate Limit fail Path',
  },
  'as2.partnerStationInfo.rateLimit.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/as2/partnerStationInfo/rateLimit/failValuess',

    label: 'As2 partner Station Info rate Limit fail Values',

    validWhen: [],
  },
  'as2.partnerStationInfo.rateLimit.limit': {
    type: 'text',

    name: '/as2/partnerStationInfo/rateLimit/limit',

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

    name: '/as2/partnerStationInfo/SMIMEVersion',

    label: 'As2 partner Station Info SMIMEVersion',

    options: [
      { items: [{ label: 'V2', value: 'v2' }, { label: 'V3', value: 'v3' }] },
    ],
  },
  'as2.partnerStationInfo.encryptionType': {
    type: 'select',

    name: '/as2/partnerStationInfo/encryptionType',

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

    name: '/as2/partnerStationInfo/signing',

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

    name: '/as2/partnerStationInfo/encoding',

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

    name: '/as2/userStationInfo/mdn/mdnURL',

    label: 'As2 user Station Info mdn mdn URL',
  },
  'as2.userStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',

    name: '/as2/userStationInfo/mdn/signatureProtocol',

    label: 'As2 user Station Info mdn signature Protocol',

    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'as2.userStationInfo.mdn.mdnSigning': {
    type: 'select',

    name: '/as2/userStationInfo/mdn/mdnSigning',

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

    name: '/as2/userStationInfo/encryptionType',

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

    name: '/as2/userStationInfo/signing',

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

    name: '/as2/userStationInfo/encoding',

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

    name: '/as2/encrypted',

    label: 'As2 encrypted',
  },
  'as2.concurrencyLevel': {
    type: 'text',

    name: '/as2/concurrencyLevel',

    label: 'As2 concurrency Level',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.unencrypted': {
    type: 'text',

    name: '/as2/unencrypted',

    label: 'As2 unencrypted',
  },
  'as2.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/as2/encrypteds',

    label: 'As2 encrypted',
  },
  // #endregion as2
  // #region netsuite
  'netsuite.account': {
    type: 'text',

    name: '/netsuite/account',

    label: 'Netsuite account',
  },
  'netsuite.tokenId': {
    type: 'text',

    name: '/netsuite/tokenId',

    label: 'Netsuite token Id',
  },
  'netsuite.tokenSecret': {
    type: 'text',

    name: '/netsuite/tokenSecret',

    label: 'Netsuite token Secret',
  },
  'netsuite.environment': {
    type: 'select',

    name: '/netsuite/environment',

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

    name: '/netsuite/roleId',

    label: 'Netsuite role Id',
  },
  'netsuite.email': {
    type: 'text',

    name: '/netsuite/email',

    label: 'Netsuite email',
  },
  'netsuite.password': {
    type: 'text',

    name: '/netsuite/password',

    label: 'Netsuite password',
  },
  'netsuite.requestLevelCredentials': {
    type: 'checkbox',

    name: '/netsuite/requestLevelCredentials',

    label: 'Netsuite request Level Credentials',
  },
  'netsuite.dataCenterURLs': {
    type: 'text',

    name: '/netsuite/dataCenterURLs',

    label: 'Netsuite data Center URLs',
  },
  'netsuite.accountName': {
    type: 'text',

    name: '/netsuite/accountName',

    label: 'Netsuite account Name',
  },
  'netsuite.roleName': {
    type: 'text',

    name: '/netsuite/roleName',

    label: 'Netsuite role Name',
  },
  'netsuite.concurrencyLevelRESTlet': {
    type: 'text',

    name: '/netsuite/concurrencyLevelRESTlet',

    label: 'Netsuite concurrency Level RESTlet',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.concurrencyLevelWebServices': {
    type: 'text',

    name: '/netsuite/concurrencyLevelWebServices',

    label: 'Netsuite concurrency Level Web Services',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.concurrencyLevel': {
    type: 'text',

    name: '/netsuite/concurrencyLevel',

    label: 'Netsuite concurrency Level',

    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.wsdlVersion': {
    type: 'radiogroup',

    name: '/netsuite/wsdlVersion',

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

    name: '/netsuite/applicationId',

    label: 'Netsuite application Id',
  },
  // #endregion netsuite
  // #region netSuiteDistributedAdaptor
  'netSuiteDistributedAdaptor.accountId': {
    type: 'text',

    name: '/netSuiteDistributedAdaptor/accountId',

    label: 'Net Suite Distributed Adaptor account Id',
  },
  'netSuiteDistributedAdaptor.environment': {
    type: 'select',

    name: '/netSuiteDistributedAdaptor/environment',

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

    name: '/netSuiteDistributedAdaptor/connectionId',

    label: 'Net Suite Distributed Adaptor connection Id',
  },
  'netSuiteDistributedAdaptor.username': {
    type: 'text',

    name: '/netSuiteDistributedAdaptor/username',

    label: 'Net Suite Distributed Adaptor username',
  },
  'netSuiteDistributedAdaptor.uri': {
    type: 'text',

    name: '/netSuiteDistributedAdaptor/uri',

    label: 'Net Suite Distributed Adaptor uri',
  },
  // #endregion netSuiteDistributedAdaptor
  // #region salesforce
  'salesforce.sandbox': {
    type: 'checkbox',

    name: '/salesforce/sandbox',

    label: 'Salesforce sandbox',
  },
  'salesforce.baseURI': {
    type: 'text',

    name: '/salesforce/baseURI',

    label: 'Salesforce base URI',
  },
  'salesforce.oauth2FlowType': {
    type: 'radiogroup',

    name: '/salesforce/oauth2FlowType',

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

    name: '/salesforce/username',

    label: 'Salesforce username',
  },
  'salesforce.bearerToken': {
    type: 'text',

    name: '/salesforce/bearerToken',

    label: 'Salesforce bearer Token',
  },
  'salesforce.refreshToken': {
    type: 'text',

    name: '/salesforce/refreshToken',

    label: 'Salesforce refresh Token',
  },
  'salesforce.packagedOAuth': {
    type: 'checkbox',

    name: '/salesforce/packagedOAuth',

    label: 'Salesforce packaged OAuth',
  },
  'salesforce.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',

    name: '/salesforce/scopes',

    label: 'Salesforce scope',

    validWhen: [],
  },
  'salesforce.info': {
    type: 'text',

    name: '/salesforce/info',

    label: 'Salesforce info',
  },
  'salesforce.concurrencyLevel': {
    type: 'text',

    name: '/salesforce/concurrencyLevel',

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

    name: '/wrapper/unencrypted',

    label: 'Wrapper unencrypted',
  },
  'wrapper.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/wrapper/unencrypteds',

    label: 'Wrapper unencrypted',
  },
  'wrapper.encrypted': {
    type: 'text',

    name: '/wrapper/encrypted',

    label: 'Wrapper encrypted',
  },
  'wrapper.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',

    name: '/wrapper/encrypteds',

    label: 'Wrapper encrypted',
  },
  'wrapper.pingFunction': {
    type: 'text',

    name: '/wrapper/pingFunction',

    label: 'Wrapper ping Function',
  },
  'wrapper._stackId': {
    type: 'text',

    name: '/wrapper/_stackId',

    label: 'Wrapper _stack Id',
  },
  'wrapper.concurrencyLevel': {
    type: 'text',

    name: '/wrapper/concurrencyLevel',

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

    name: '/mongodb/hosts',

    label: 'Mongodb host',

    validWhen: [],
  },
  'mongodb.database': {
    type: 'text',

    name: '/mongodb/database',

    label: 'Mongodb database',
  },
  'mongodb.username': {
    type: 'text',

    name: '/mongodb/username',

    label: 'Mongodb username',
  },
  'mongodb.password': {
    type: 'text',

    name: '/mongodb/password',

    label: 'Mongodb password',
  },
  'mongodb.replicaSet': {
    type: 'text',

    name: '/mongodb/replicaSet',
    label: 'Mongodb replica Set',
  },
  // #endregion mongodb
};
