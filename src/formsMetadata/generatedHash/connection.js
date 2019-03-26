export default {
  // #region common
  // TODO: develop code for this two components
  // agent list handleBars evaluated its a dynamicList
  'connection._borrowConcurrencyFromConnectionId': {
    type: 'select',
    helpKey: 'connection._borrowConcurrencyFromConnectionId',
    name: '/_borrowConcurrencyFromConnectionId',
    id: 'connection._borrowConcurrencyFromConnectionId',
    defaultValue: r => r._borrowConcurrencyFromConnectionId,
    label: 'Borrow Concurrency From',
  },
  'connection._agentId': {
    type: 'select',
    helpKey: 'connection._agentId',
    name: '/_agentId',
    label: 'Agent',
    id: 'connection._agentId',
    defaultValue: r => r._agentId,
  },
  'connection.type': {
    type: 'select',
    helpKey: 'connection.type',
    name: '/type',
    id: 'connection.type',
    label: 'Type',
    defaultValue: r => r && r.type,
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
  'connection.name': {
    type: 'text',
    helpKey: 'connection.name',
    name: '/name',
    id: 'connection.name',
    label: 'Name',
    defaultValue: r => r && r.name,
  },
  'connection.assistant': {
    type: 'select',
    helpKey: 'connection.assistant',
    name: '/assistant',
    id: 'connection.assistant',
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
          { label: 'Solidcommercxe', value: 'solidcommercxe' },
          { label: 'Intercom', value: 'intercom' },
          { label: 'Bamboohr', value: 'bamboohr' },
        ],
      },
    ],
  },
  // #endregion common
  // #region rdbms
  'connection.rdbms.host': {
    type: 'text',
    helpKey: 'connection.rdbms.host',
    name: '/rdbms/host',
    id: 'connection.rdbms.host',
    label: 'Rdbms host',
    defaultValue: r => r && r.rdbms && r.rdbms.host,
  },
  'connection.rdbms.port': {
    type: 'text',
    helpKey: 'connection.rdbms.port',
    name: '/rdbms/port',
    id: 'connection.rdbms.port',
    label: 'Rdbms port',
    defaultValue: r => r && r.rdbms && r.rdbms.port,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.rdbms.database': {
    type: 'text',
    helpKey: 'connection.rdbms.database',
    name: '/rdbms/database',
    id: 'connection.rdbms.database',
    label: 'Rdbms database',
    defaultValue: r => r && r.rdbms && r.rdbms.database,
  },
  'connection.rdbms.instanceName': {
    type: 'text',
    helpKey: 'connection.rdbms.instanceName',
    name: '/rdbms/instanceName',
    id: 'connection.rdbms.instanceName',
    label: 'Rdbms instance Name',
    defaultValue: r => r && r.rdbms && r.rdbms.instanceName,
  },
  'connection.rdbms.user': {
    type: 'text',
    helpKey: 'connection.rdbms.user',
    name: '/rdbms/user',
    id: 'connection.rdbms.user',
    label: 'Rdbms user',
    defaultValue: r => r && r.rdbms && r.rdbms.user,
  },
  'connection.rdbms.password': {
    type: 'text',
    helpKey: 'connection.rdbms.password',
    name: '/rdbms/password',
    id: 'connection.rdbms.password',
    label: 'Rdbms password',
    defaultValue: r => r && r.rdbms && r.rdbms.password,
  },
  'connection.rdbms.ssl.ca': {
    type: 'text',
    helpKey: 'connection.rdbms.ssl.ca',
    name: '/rdbms/ssl/ca',
    id: 'connection.rdbms.ssl.ca',
    label: 'Rdbms ssl ca',
    defaultValue: r => r && r.rdbms && r.rdbms.ssl && r.rdbms.ssl.ca,
  },
  'connection.rdbms.ssl.key': {
    type: 'text',
    helpKey: 'connection.rdbms.ssl.key',
    name: '/rdbms/ssl/key',
    id: 'connection.rdbms.ssl.key',
    label: 'Rdbms ssl key',
    defaultValue: r => r && r.rdbms && r.rdbms.ssl && r.rdbms.ssl.key,
  },
  'connection.rdbms.ssl.passphrase': {
    type: 'text',
    helpKey: 'connection.rdbms.ssl.passphrase',
    name: '/rdbms/ssl/passphrase',
    id: 'connection.rdbms.ssl.passphrase',
    label: 'Rdbms ssl passphrase',
    defaultValue: r => r && r.rdbms && r.rdbms.ssl && r.rdbms.ssl.passphrase,
  },
  'connection.rdbms.ssl.cert': {
    type: 'text',
    helpKey: 'connection.rdbms.ssl.cert',
    name: '/rdbms/ssl/cert',
    id: 'connection.rdbms.ssl.cert',
    label: 'Rdbms ssl cert',
    defaultValue: r => r && r.rdbms && r.rdbms.ssl && r.rdbms.ssl.cert,
  },
  'connection.rdbms.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.rdbms.concurrencyLevel',
    name: '/rdbms/concurrencyLevel',
    id: 'connection.rdbms.concurrencyLevel',
    label: 'Rdbms concurrency Level',
    defaultValue: r => r && r.rdbms && r.rdbms.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion rdbms
  // #region rest
  'connection.rest.mediaType': {
    type: 'select',
    helpKey: 'connection.rest.mediaType',
    name: '/rest/mediaType',
    id: 'connection.rest.mediaType',
    label: 'Rest media Type',
    defaultValue: r => r && r.rest && r.rest.mediaType,
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
  'connection.rest.baseURI': {
    type: 'text',
    helpKey: 'connection.rest.baseURI',
    name: '/rest/baseURI',
    id: 'connection.rest.baseURI',
    label: 'Rest base URI',
    defaultValue: r => r && r.rest && r.rest.baseURI,
  },
  'connection.rest.bearerToken': {
    type: 'text',
    helpKey: 'connection.rest.bearerToken',
    name: '/rest/bearerToken',
    id: 'connection.rest.bearerToken',
    label: 'Rest bearer Token',
    defaultValue: r => r && r.rest && r.rest.bearerToken,
  },
  'connection.rest.tokenLocation': {
    type: 'radiogroup',
    helpKey: 'connection.rest.tokenLocation',
    name: '/rest/tokenLocation',
    id: 'connection.rest.tokenLocation',
    label: 'Rest token Location',
    defaultValue: r => r && r.rest && r.rest.tokenLocation,
    options: [
      {
        items: [
          { label: 'Header', value: 'header' },
          { label: 'Url', value: 'url' },
        ],
      },
    ],
  },
  'connection.rest.tokenParam': {
    type: 'text',
    helpKey: 'connection.rest.tokenParam',
    name: '/rest/tokenParam',
    id: 'connection.rest.tokenParam',
    label: 'Rest token Param',
    defaultValue: r => r && r.rest && r.rest.tokenParam,
  },
  'connection.rest.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.rest.scope',
    name: '/rest/scopes',
    id: 'connection.rest.scopes',
    label: 'Rest scope',
    defaultValue: r => r && r.rest && r.rest.scope,
    validWhen: [],
  },
  'connection.rest.scopeDelimiter': {
    type: 'text',
    helpKey: 'connection.rest.scopeDelimiter',
    name: '/rest/scopeDelimiter',
    id: 'connection.rest.scopeDelimiter',
    label: 'Rest scope Delimiter',
    defaultValue: r => r && r.rest && r.rest.scopeDelimiter,
  },
  'connection.rest.refreshToken': {
    type: 'text',
    helpKey: 'connection.rest.refreshToken',
    name: '/rest/refreshToken',
    id: 'connection.rest.refreshToken',
    label: 'Rest refresh Token',
    defaultValue: r => r && r.rest && r.rest.refreshToken,
  },
  'connection.rest.oauthTokenURI': {
    type: 'text',
    helpKey: 'connection.rest.oauthTokenURI',
    name: '/rest/oauthTokenURI',
    id: 'connection.rest.oauthTokenURI',
    label: 'Rest oauth Token URI',
    defaultValue: r => r && r.rest && r.rest.oauthTokenURI,
  },
  'connection.rest.disableStrictSSL': {
    type: 'checkbox',
    helpKey: 'connection.rest.disableStrictSSL',
    name: '/rest/disableStrictSSL',
    id: 'connection.rest.disableStrictSSL',
    label: 'Rest disable Strict SSL',
    defaultValue: false,
  },
  'connection.rest.authType': {
    type: 'select',
    helpKey: 'connection.rest.authType',
    name: '/rest/authType',
    id: 'connection.rest.authType',
    label: 'Rest auth Type',
    defaultValue: r => r && r.rest && r.rest.authType,
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
  'connection.rest.authURI': {
    type: 'text',
    helpKey: 'connection.rest.authURI',
    name: '/rest/authURI',
    id: 'connection.rest.authURI',
    label: 'Rest auth URI',
    defaultValue: r => r && r.rest && r.rest.authURI,
  },
  'connection.rest.authHeader': {
    type: 'text',
    helpKey: 'connection.rest.authHeader',
    name: '/rest/authHeader',
    id: 'connection.rest.authHeader',
    label: 'Rest auth Header',
    defaultValue: r => r && r.rest && r.rest.authHeader,
  },
  'connection.rest.retryHeader': {
    type: 'text',
    helpKey: 'connection.rest.retryHeader',
    name: '/rest/retryHeader',
    id: 'connection.rest.retryHeader',
    label: 'Rest retry Header',
    defaultValue: r => r && r.rest && r.rest.retryHeader,
  },
  'connection.rest.authScheme': {
    type: 'select',
    helpKey: 'connection.rest.authScheme',
    name: '/rest/authScheme',
    id: 'connection.rest.authScheme',
    label: 'Rest auth Scheme',
    defaultValue: r => r && r.rest && r.rest.authScheme,
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
  'connection.rest.basicAuth.username': {
    type: 'text',
    helpKey: 'connection.rest.basicAuth.username',
    name: '/rest/basicAuth/username',
    id: 'connection.rest.basicAuth.username',
    label: 'Rest basic Auth username',
    defaultValue: r =>
      r && r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
  },
  'connection.rest.basicAuth.password': {
    type: 'text',
    helpKey: 'connection.rest.basicAuth.password',
    name: '/rest/basicAuth/password',
    id: 'connection.rest.basicAuth.password',
    label: 'Rest basic Auth password',
    defaultValue: r =>
      r && r.rest && r.rest.basicAuth && r.rest.basicAuth.password,
  },
  'connection.rest.cookieAuth.uri': {
    type: 'text',
    helpKey: 'connection.rest.cookieAuth.uri',
    name: '/rest/cookieAuth/uri',
    id: 'connection.rest.cookieAuth.uri',
    label: 'Rest cookie Auth uri',
    defaultValue: r =>
      r && r.rest && r.rest.cookieAuth && r.rest.cookieAuth.uri,
  },
  'connection.rest.cookieAuth.body': {
    type: 'text',
    helpKey: 'connection.rest.cookieAuth.body',
    name: '/rest/cookieAuth/body',
    id: 'connection.rest.cookieAuth.body',
    label: 'Rest cookie Auth body',
    defaultValue: r =>
      r && r.rest && r.rest.cookieAuth && r.rest.cookieAuth.body,
  },
  'connection.rest.cookieAuth.method': {
    type: 'text',
    helpKey: 'connection.rest.cookieAuth.method',
    name: '/rest/cookieAuth/method',
    id: 'connection.rest.cookieAuth.method',
    label: 'Rest cookie Auth method',
    defaultValue: r =>
      r && r.rest && r.rest.cookieAuth && r.rest.cookieAuth.method,
  },
  'connection.rest.cookieAuth.successStatusCode': {
    type: 'text',
    helpKey: 'connection.rest.cookieAuth.successStatusCode',
    name: '/rest/cookieAuth/successStatusCode',
    id: 'connection.rest.cookieAuth.successStatusCode',
    label: 'Rest cookie Auth success Status Code',
    defaultValue: r =>
      r && r.rest && r.rest.cookieAuth && r.rest.cookieAuth.successStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'connection.rest.headers',
    name: '/rest/headers',
    id: 'connection.rest.headers',
    label: 'Rest headers',
    defaultValue: r => r && r.rest && r.rest.headers,
  },
  'connection.rest.encrypted': {
    type: 'text',
    helpKey: 'connection.rest.encrypted',
    name: '/rest/encrypted',
    id: 'connection.rest.encrypted',
    label: 'Rest encrypted',
    defaultValue: r => r && r.rest && r.rest.encrypted,
  },
  'connection.rest.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.rest.encrypteds',
    name: '/rest/encrypteds',
    id: 'connection.rest.encrypteds',
    label: 'Rest encrypted',
    defaultValue: r => r && r.rest && r.rest.encrypted,
  },
  'connection.rest.unencrypted': {
    type: 'text',
    helpKey: 'connection.rest.unencrypted',
    name: '/rest/unencrypted',
    id: 'connection.rest.unencrypted',
    label: 'Rest unencrypted',
    defaultValue: r => r && r.rest && r.rest.unencrypted,
  },
  'connection.rest.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.rest.unencrypteds',
    name: '/rest/unencrypteds',
    id: 'connection.rest.unencrypteds',
    label: 'Rest unencrypted',
    defaultValue: r => r && r.rest && r.rest.unencrypted,
  },
  'connection.rest.oauth.accessTokenPath': {
    type: 'text',
    helpKey: 'connection.rest.oauth.accessTokenPath',
    name: '/rest/oauth/accessTokenPath',
    id: 'connection.rest.oauth.accessTokenPath',
    label: 'Rest oauth access Token Path',
    defaultValue: r =>
      r && r.rest && r.rest.oauth && r.rest.oauth.accessTokenPath,
  },
  'connection.rest.oauth.grantType': {
    type: 'radiogroup',
    helpKey: 'connection.rest.oauth.grantType',
    name: '/rest/oauth/grantType',
    id: 'connection.rest.oauth.grantType',
    label: 'Rest oauth grant Type',
    defaultValue: r => r && r.rest && r.rest.oauth && r.rest.oauth.grantType,
    options: [
      {
        items: [
          { label: 'Authorizecode', value: 'authorizecode' },
          { label: 'Password', value: 'password' },
        ],
      },
    ],
  },
  'connection.rest.oauth.username': {
    type: 'text',
    helpKey: 'connection.rest.oauth.username',
    name: '/rest/oauth/username',
    id: 'connection.rest.oauth.username',
    label: 'Rest oauth username',
    defaultValue: r => r && r.rest && r.rest.oauth && r.rest.oauth.username,
  },
  'connection.rest.oauth.password': {
    type: 'text',
    helpKey: 'connection.rest.oauth.password',
    name: '/rest/oauth/password',
    id: 'connection.rest.oauth.password',
    label: 'Rest oauth password',
    defaultValue: r => r && r.rest && r.rest.oauth && r.rest.oauth.password,
  },
  'connection.rest.refreshTokenMethod': {
    type: 'text',
    helpKey: 'connection.rest.refreshTokenMethod',
    name: '/rest/refreshTokenMethod',
    id: 'connection.rest.refreshTokenMethod',
    label: 'Rest refresh Token Method',
    defaultValue: r => r && r.rest && r.rest.refreshTokenMethod,
  },
  'connection.rest.refreshTokenBody': {
    type: 'text',
    helpKey: 'connection.rest.refreshTokenBody',
    name: '/rest/refreshTokenBody',
    id: 'connection.rest.refreshTokenBody',
    label: 'Rest refresh Token Body',
    defaultValue: r => r && r.rest && r.rest.refreshTokenBody,
  },
  'connection.rest.refreshTokenURI': {
    type: 'text',
    helpKey: 'connection.rest.refreshTokenURI',
    name: '/rest/refreshTokenURI',
    id: 'connection.rest.refreshTokenURI',
    label: 'Rest refresh Token URI',
    defaultValue: r => r && r.rest && r.rest.refreshTokenURI,
  },
  'connection.rest.refreshTokenPath': {
    type: 'text',
    helpKey: 'connection.rest.refreshTokenPath',
    name: '/rest/refreshTokenPath',
    id: 'connection.rest.refreshTokenPath',
    label: 'Rest refresh Token Path',
    defaultValue: r => r && r.rest && r.rest.refreshTokenPath,
  },
  'connection.rest.refreshTokenMediaType': {
    type: 'radiogroup',
    helpKey: 'connection.rest.refreshTokenMediaType',
    name: '/rest/refreshTokenMediaType',
    id: 'connection.rest.refreshTokenMediaType',
    label: 'Rest refresh Token Media Type',
    defaultValue: r => r && r.rest && r.rest.refreshTokenMediaType,
    options: [
      {
        items: [
          { label: 'Json', value: 'json' },
          { label: 'Urlencoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'connection.rest.refreshTokenHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'connection.rest.refreshTokenHeaders',
    name: '/rest/refreshTokenHeaders',
    id: 'connection.rest.refreshTokenHeaders',
    label: 'Rest refresh Token Headers',
    defaultValue: r => r && r.rest && r.rest.refreshTokenHeaders,
  },
  'connection.rest.info': {
    type: 'text',
    helpKey: 'connection.rest.info',
    name: '/rest/info',
    id: 'connection.rest.info',
    label: 'Rest info',
    defaultValue: r => r && r.rest && r.rest.info,
  },
  'connection.rest.pingRelativeURI': {
    type: 'text',
    helpKey: 'connection.rest.pingRelativeURI',
    name: '/rest/pingRelativeURI',
    id: 'connection.rest.pingRelativeURI',
    label: 'Rest ping Relative URI',
    defaultValue: r => r && r.rest && r.rest.pingRelativeURI,
  },
  'connection.rest.pingSuccessPath': {
    type: 'text',
    helpKey: 'connection.rest.pingSuccessPath',
    name: '/rest/pingSuccessPath',
    id: 'connection.rest.pingSuccessPath',
    label: 'Rest ping Success Path',
    defaultValue: r => r && r.rest && r.rest.pingSuccessPath,
  },
  'connection.rest.pingSuccessValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.rest.pingSuccessValues',
    name: '/rest/pingSuccessValuess',
    id: 'connection.rest.pingSuccessValuess',
    label: 'Rest ping Success Values',
    defaultValue: r => r && r.rest && r.rest.pingSuccessValues,
    validWhen: [],
  },
  'connection.rest.pingFailurePath': {
    type: 'text',
    helpKey: 'connection.rest.pingFailurePath',
    name: '/rest/pingFailurePath',
    id: 'connection.rest.pingFailurePath',
    label: 'Rest ping Failure Path',
    defaultValue: r => r && r.rest && r.rest.pingFailurePath,
  },
  'connection.rest.pingFailureValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.rest.pingFailureValues',
    name: '/rest/pingFailureValuess',
    id: 'connection.rest.pingFailureValuess',
    label: 'Rest ping Failure Values',
    defaultValue: r => r && r.rest && r.rest.pingFailureValues,
    validWhen: [],
  },
  'connection.rest.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.rest.concurrencyLevel',
    name: '/rest/concurrencyLevel',
    id: 'connection.rest.concurrencyLevel',
    label: 'Rest concurrency Level',
    defaultValue: r => r && r.rest && r.rest.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.rest.pingMethod': {
    type: 'radiogroup',
    helpKey: 'connection.rest.pingMethod',
    name: '/rest/pingMethod',
    id: 'connection.rest.pingMethod',
    label: 'Rest ping Method',
    defaultValue: r => r && r.rest && r.rest.pingMethod,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'connection.rest.pingBody': {
    type: 'text',
    helpKey: 'connection.rest.pingBody',
    name: '/rest/pingBody',
    id: 'connection.rest.pingBody',
    label: 'Rest ping Body',
    defaultValue: r => r && r.rest && r.rest.pingBody,
  },
  // #endregion rest
  // #region http
  'connection.http.mediaType': {
    type: 'radiogroup',
    helpKey: 'connection.http.mediaType',
    name: '/http/mediaType',
    id: 'connection.http.mediaType',
    label: 'Http media Type',
    defaultValue: r => r && r.http && r.http.mediaType,
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'connection.http.baseURI': {
    type: 'text',
    helpKey: 'connection.http.baseURI',
    name: '/http/baseURI',
    id: 'connection.http.baseURI',
    label: 'Http base URI',
    defaultValue: r => r && r.http && r.http.baseURI,
  },
  'connection.http.disableStrictSSL': {
    type: 'checkbox',
    helpKey: 'connection.http.disableStrictSSL',
    name: '/http/disableStrictSSL',
    id: 'connection.http.disableStrictSSL',
    label: 'Http disable Strict SSL',
    defaultValue: false,
  },
  'connection.http.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.http.concurrencyLevel',
    name: '/http/concurrencyLevel',
    id: 'connection.http.concurrencyLevel',
    label: 'Http concurrency Level',
    defaultValue: r => r && r.http && r.http.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.http.retryHeader': {
    type: 'text',
    helpKey: 'connection.http.retryHeader',
    name: '/http/retryHeader',
    id: 'connection.http.retryHeader',
    label: 'Http retry Header',
    defaultValue: r => r && r.http && r.http.retryHeader,
  },
  'connection.http.ping.relativeURI': {
    type: 'text',
    helpKey: 'connection.http.ping.relativeURI',
    name: '/http/ping/relativeURI',
    id: 'connection.http.ping.relativeURI',
    label: 'Http ping relative URI',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.relativeURI,
  },
  'connection.http.ping.method': {
    type: 'select',
    helpKey: 'connection.http.ping.method',
    name: '/http/ping/method',
    id: 'connection.http.ping.method',
    label: 'Http ping method',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.method,
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
  'connection.http.ping.body': {
    type: 'text',
    helpKey: 'connection.http.ping.body',
    name: '/http/ping/body',
    id: 'connection.http.ping.body',
    label: 'Http ping body',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.body,
  },
  'connection.http.ping.successPath': {
    type: 'text',
    helpKey: 'connection.http.ping.successPath',
    name: '/http/ping/successPath',
    id: 'connection.http.ping.successPath',
    label: 'Http ping success Path',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.successPath,
  },
  'connection.http.ping.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.http.ping.successValues',
    name: '/http/ping/successValuess',
    id: 'connection.http.ping.successValuess',
    label: 'Http ping success Values',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.successValues,
    validWhen: [],
  },
  'connection.http.ping.errorPath': {
    type: 'text',
    helpKey: 'connection.http.ping.errorPath',
    name: '/http/ping/errorPath',
    id: 'connection.http.ping.errorPath',
    label: 'Http ping error Path',
    defaultValue: r => r && r.http && r.http.ping && r.http.ping.errorPath,
  },
  'connection.http.auth.failStatusCode': {
    type: 'text',
    helpKey: 'connection.http.auth.failStatusCode',
    name: '/http/auth/failStatusCode',
    id: 'connection.http.auth.failStatusCode',
    label: 'Http auth fail Status Code',
    defaultValue: r => r && r.http && r.http.auth && r.http.auth.failStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.http.auth.failPath': {
    type: 'text',
    helpKey: 'connection.http.auth.failPath',
    name: '/http/auth/failPath',
    id: 'connection.http.auth.failPath',
    label: 'Http auth fail Path',
    defaultValue: r => r && r.http && r.http.auth && r.http.auth.failPath,
  },
  'connection.http.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.http.auth.failValues',
    name: '/http/auth/failValuess',
    id: 'connection.http.auth.failValuess',
    label: 'Http auth fail Values',
    defaultValue: r => r && r.http && r.http.auth && r.http.auth.failValues,
    validWhen: [],
  },
  'connection.http.auth.basic.username': {
    type: 'text',
    helpKey: 'connection.http.auth.basic.username',
    name: '/http/auth/basic/username',
    id: 'connection.http.auth.basic.username',
    label: 'Http auth basic username',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.basic &&
      r.http.auth.basic.username,
  },
  'connection.http.auth.basic.password': {
    type: 'text',
    helpKey: 'connection.http.auth.basic.password',
    name: '/http/auth/basic/password',
    id: 'connection.http.auth.basic.password',
    label: 'Http auth basic password',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.basic &&
      r.http.auth.basic.password,
  },
  'connection.http.auth.oauth.authURI': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.authURI',
    name: '/http/auth/oauth/authURI',
    id: 'connection.http.auth.oauth.authURI',
    label: 'Http auth oauth auth URI',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.authURI,
  },
  'connection.http.auth.oauth.tokenURI': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.tokenURI',
    name: '/http/auth/oauth/tokenURI',
    id: 'connection.http.auth.oauth.tokenURI',
    label: 'Http auth oauth token URI',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.tokenURI,
  },
  'connection.http.auth.oauth.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.http.auth.oauth.scope',
    name: '/http/auth/oauth/scopes',
    id: 'connection.http.auth.oauth.scopes',
    label: 'Http auth oauth scope',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.scope,
    validWhen: [],
  },
  'connection.http.auth.oauth.scopeDelimiter': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.scopeDelimiter',
    name: '/http/auth/oauth/scopeDelimiter',
    id: 'connection.http.auth.oauth.scopeDelimiter',
    label: 'Http auth oauth scope Delimiter',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.scopeDelimiter,
  },
  'connection.http.auth.oauth.accessTokenPath': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.accessTokenPath',
    name: '/http/auth/oauth/accessTokenPath',
    id: 'connection.http.auth.oauth.accessTokenPath',
    label: 'Http auth oauth access Token Path',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.accessTokenPath,
  },
  'connection.http.auth.oauth.grantType': {
    type: 'radiogroup',
    helpKey: 'connection.http.auth.oauth.grantType',
    name: '/http/auth/oauth/grantType',
    id: 'connection.http.auth.oauth.grantType',
    label: 'Http auth oauth grant Type',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.grantType,
    options: [
      {
        items: [
          { label: 'Authorizecode', value: 'authorizecode' },
          { label: 'Password', value: 'password' },
        ],
      },
    ],
  },
  'connection.http.auth.oauth.username': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.username',
    name: '/http/auth/oauth/username',
    id: 'connection.http.auth.oauth.username',
    label: 'Http auth oauth username',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.username,
  },
  'connection.http.auth.oauth.password': {
    type: 'text',
    helpKey: 'connection.http.auth.oauth.password',
    name: '/http/auth/oauth/password',
    id: 'connection.http.auth.oauth.password',
    label: 'Http auth oauth password',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.password,
  },
  'connection.http.auth.token.token': {
    type: 'text',
    helpKey: 'connection.http.auth.token.token',
    name: '/http/auth/token/token',
    id: 'connection.http.auth.token.token',
    label: 'Http auth token token',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.token,
  },
  'connection.http.auth.token.location': {
    type: 'select',
    helpKey: 'connection.http.auth.token.location',
    name: '/http/auth/token/location',
    id: 'connection.http.auth.token.location',
    label: 'Http auth token location',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.location,
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
  'connection.http.auth.token.headerName': {
    type: 'text',
    helpKey: 'connection.http.auth.token.headerName',
    name: '/http/auth/token/headerName',
    id: 'connection.http.auth.token.headerName',
    label: 'Http auth token header Name',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.headerName,
  },
  'connection.http.auth.token.scheme': {
    type: 'text',
    helpKey: 'connection.http.auth.token.scheme',
    name: '/http/auth/token/scheme',
    id: 'connection.http.auth.token.scheme',
    label: 'Http auth token scheme',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.scheme,
  },
  'connection.http.auth.token.paramName': {
    type: 'text',
    helpKey: 'connection.http.auth.token.paramName',
    name: '/http/auth/token/paramName',
    id: 'connection.http.auth.token.paramName',
    label: 'Http auth token param Name',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.paramName,
  },
  'connection.http.auth.token.refreshMethod': {
    type: 'radiogroup',
    helpKey: 'connection.http.auth.token.refreshMethod',
    name: '/http/auth/token/refreshMethod',
    id: 'connection.http.auth.token.refreshMethod',
    label: 'Http auth token refresh Method',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMethod,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'connection.http.auth.token.refreshRelativeURI': {
    type: 'text',
    helpKey: 'connection.http.auth.token.refreshRelativeURI',
    name: '/http/auth/token/refreshRelativeURI',
    id: 'connection.http.auth.token.refreshRelativeURI',
    label: 'Http auth token refresh Relative URI',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshRelativeURI,
  },
  'connection.http.auth.token.refreshBody': {
    type: 'text',
    helpKey: 'connection.http.auth.token.refreshBody',
    name: '/http/auth/token/refreshBody',
    id: 'connection.http.auth.token.refreshBody',
    label: 'Http auth token refresh Body',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshBody,
  },
  'connection.http.auth.token.refreshTokenPath': {
    type: 'text',
    helpKey: 'connection.http.auth.token.refreshTokenPath',
    name: '/http/auth/token/refreshTokenPath',
    id: 'connection.http.auth.token.refreshTokenPath',
    label: 'Http auth token refresh Token Path',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshTokenPath,
  },
  'connection.http.auth.token.refreshMediaType': {
    type: 'select',
    helpKey: 'connection.http.auth.token.refreshMediaType',
    name: '/http/auth/token/refreshMediaType',
    id: 'connection.http.auth.token.refreshMediaType',
    label: 'Http auth token refresh Media Type',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMediaType,
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
  'connection.http.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'connection.http.auth.token.refreshHeaders',
    name: '/http/auth/token/refreshHeaders',
    id: 'connection.http.auth.token.refreshHeaders',
    label: 'Http auth token refresh Headers',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshHeaders,
  },
  'connection.http.auth.token.refreshToken': {
    type: 'text',
    helpKey: 'connection.http.auth.token.refreshToken',
    name: '/http/auth/token/refreshToken',
    id: 'connection.http.auth.token.refreshToken',
    label: 'Http auth token refresh Token',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshToken,
  },
  'connection.http.rateLimit.failStatusCode': {
    type: 'text',
    helpKey: 'connection.http.rateLimit.failStatusCode',
    name: '/http/rateLimit/failStatusCode',
    id: 'connection.http.rateLimit.failStatusCode',
    label: 'Http rate Limit fail Status Code',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.failStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.http.rateLimit.failPath': {
    type: 'text',
    helpKey: 'connection.http.rateLimit.failPath',
    name: '/http/rateLimit/failPath',
    id: 'connection.http.rateLimit.failPath',
    label: 'Http rate Limit fail Path',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.failPath,
  },
  'connection.http.rateLimit.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.http.rateLimit.failValues',
    name: '/http/rateLimit/failValuess',
    id: 'connection.http.rateLimit.failValuess',
    label: 'Http rate Limit fail Values',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.failValues,
    validWhen: [],
  },
  'connection.http.rateLimit.limit': {
    type: 'text',
    helpKey: 'connection.http.rateLimit.limit',
    name: '/http/rateLimit/limit',
    id: 'connection.http.rateLimit.limit',
    label: 'Http rate Limit limit',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.limit,
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
  'connection.http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'connection.http.headers',
    name: '/http/headers',
    id: 'connection.http.headers',
    label: 'Http headers',
    defaultValue: r => r && r.http && r.http.headers,
  },
  'connection.http.unencrypted': {
    type: 'text',
    helpKey: 'connection.http.unencrypted',
    name: '/http/unencrypted',
    id: 'connection.http.unencrypted',
    label: 'Http unencrypted',
    defaultValue: r => r && r.http && r.http.unencrypted,
  },
  'connection.http.encrypted': {
    type: 'text',
    helpKey: 'connection.http.encrypted',
    name: '/http/encrypted',
    id: 'connection.http.encrypted',
    label: 'Http encrypted',
    defaultValue: r => r && r.http && r.http.encrypted,
  },
  'connection.http.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.http.encrypteds',
    name: '/http/encrypteds',
    id: 'connection.http.encrypteds',
    label: 'Http encrypted',
    defaultValue: r => r && r.http && r.http.encrypted,
  },
  // #endregion http
  // #region ftp
  'connection.ftp.hostURI': {
    type: 'text',
    helpKey: 'connection.ftp.hostURI',
    name: '/ftp/hostURI',
    id: 'connection.ftp.hostURI',
    label: 'Host',
    defaultValue: r => r && r.ftp && r.ftp.hostURI,
  },
  'connection.ftp.type': {
    type: 'radiogroup',
    helpKey: 'connection.ftp.type',
    name: '/ftp/type',
    id: 'connection.ftp.type',
    label: 'Protocol',
    defaultValue: '{{ftp.type}}',
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
  'connection.ftp.username': {
    type: 'text',
    helpKey: 'connection.ftp.username',
    name: '/ftp/username',
    id: 'connection.ftp.username',
    label: 'Username',
    defaultValue: r => r && r.ftp && r.ftp.username,
  },
  'connection.ftp.password': {
    type: 'text',
    helpKey: 'connection.ftp.password',
    name: '/ftp/password',
    id: 'connection.ftp.password',
    label: 'Password',
    defaultValue: r => r && r.ftp && r.ftp.password,
  },
  'connection.ftp.authKey': {
    type: 'text',
    helpKey: 'connection.ftp.authKey',
    name: '/ftp/authKey',
    id: 'connection.ftp.authKey',
    label: 'Authentication Key (PEM format)',
    defaultValue: r => r && r.ftp && r.ftp.authKey,
  },
  'connection.ftp.port': {
    type: 'text',
    helpKey: 'connection.ftp.port',
    name: '/ftp/port',
    id: 'connection.ftp.port',
    label: 'Ftp port',
    defaultValue: r => r && r.ftp && r.ftp.port,
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
  'connection.ftp.usePassiveMode': {
    type: 'checkbox',
    helpKey: 'connection.ftp.usePassiveMode',
    name: '/ftp/usePassiveMode',
    id: 'connection.ftp.usePassiveMode',
    label: 'Use Passive Mode',
    defaultValue: false,
  },
  'connection.ftp.entryParser': {
    type: 'select',
    helpKey: 'connection.ftp.entryParser',
    name: '/ftp/entryParser',
    id: 'connection.ftp.entryParser',
    label: 'Entry Parser',
    defaultValue: r => r && r.ftp && r.ftp.entryParser,
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
  'connection.ftp.userDirectoryIsRoot': {
    type: 'checkbox',
    helpKey: 'connection.ftp.userDirectoryIsRoot',
    name: '/ftp/userDirectoryIsRoot',
    id: 'connection.ftp.userDirectoryIsRoot',
    label: 'User Directory is Root',
    defaultValue: false,
  },
  'connection.ftp.useImplicitFtps': {
    type: 'checkbox',
    helpKey: 'connection.ftp.useImplicitFtps',
    name: '/ftp/useImplicitFtps',
    id: 'connection.ftp.useImplicitFtps',
    label: 'Ftp use Implicit Ftps',
    defaultValue: false,
  },
  'connection.ftp.requireSocketReUse': {
    type: 'checkbox',
    helpKey: 'connection.ftp.requireSocketReUse',
    name: '/ftp/requireSocketReUse',
    id: 'connection.ftp.requireSocketReUse',
    label: 'Ftp require Socket Re Use',
    defaultValue: false,
  },
  'connection.ftp.usePgp': {
    type: 'checkbox',
    helpKey: 'connection.ftp.usePgp',
    name: '/ftp/usePgp',
    id: 'connection.ftp.usePgp',
    label: 'Use PGP Encryption',
    defaultValue: false,
  },
  'connection.ftp.pgpEncryptKey': {
    type: 'text',
    helpKey: 'connection.ftp.pgpEncryptKey',
    name: '/ftp/pgpEncryptKey',
    id: 'connection.ftp.pgpEncryptKey',
    label: 'PGP Public Key',
    defaultValue: r => r && r.ftp && r.ftp.pgpEncryptKey,
  },
  'connection.ftp.pgpDecryptKey': {
    type: 'text',
    helpKey: 'connection.ftp.pgpDecryptKey',
    name: '/ftp/pgpDecryptKey',
    id: 'connection.ftp.pgpDecryptKey',
    label: 'PGP Private Key',
    defaultValue: r => r && r.ftp && r.ftp.pgpDecryptKey,
  },
  'connection.ftp.pgpPassphrase': {
    type: 'text',
    helpKey: 'connection.ftp.pgpPassphrase',
    name: '/ftp/pgpPassphrase',
    id: 'connection.ftp.pgpPassphrase',
    label: 'PGP Passphrase',
    defaultValue: r => r && r.ftp && r.ftp.pgpPassphrase,
  },
  // #endregion ftp
  // #region s3
  'connection.s3.accessKeyId': {
    type: 'text',
    helpKey: 'connection.s3.accessKeyId',
    name: '/s3/accessKeyId',
    id: 'connection.s3.accessKeyId',
    label: 'S3 access Key Id',
    defaultValue: r => r && r.s3 && r.s3.accessKeyId,
  },
  'connection.s3.secretAccessKey': {
    type: 'text',
    helpKey: 'connection.s3.secretAccessKey',
    name: '/s3/secretAccessKey',
    id: 'connection.s3.secretAccessKey',
    label: 'S3 secret Access Key',
    defaultValue: r => r && r.s3 && r.s3.secretAccessKey,
  },
  'connection.s3.pingBucket': {
    type: 'text',
    helpKey: 'connection.s3.pingBucket',
    name: '/s3/pingBucket',
    id: 'connection.s3.pingBucket',
    label: 'S3 ping Bucket',
    defaultValue: r => r && r.s3 && r.s3.pingBucket,
  },
  // #endregion s3
  // #region as2
  'connection.as2.as2Id': {
    type: 'text',
    helpKey: 'connection.as2.as2Id',
    name: '/as2/as2Id',
    id: 'connection.as2.as2Id',
    label: 'As2 as2Id',
    defaultValue: r => r && r.as2 && r.as2.as2Id,
  },
  'connection.as2.partnerId': {
    type: 'text',
    helpKey: 'connection.as2.partnerId',
    name: '/as2/partnerId',
    id: 'connection.as2.partnerId',
    label: 'As2 partner Id',
    defaultValue: r => r && r.as2 && r.as2.partnerId,
  },
  'connection.as2.contentBasedFlowRouter.function': {
    type: 'text',
    helpKey: 'connection.as2.contentBasedFlowRouter.function',
    name: '/as2/contentBasedFlowRouter/function',
    id: 'connection.as2.contentBasedFlowRouter.function',
    label: 'As2 content Based Flow Router function',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.contentBasedFlowRouter &&
      r.as2.contentBasedFlowRouter.function,
  },
  'connection.as2.contentBasedFlowRouter._scriptId': {
    type: 'text',
    helpKey: 'connection.as2.contentBasedFlowRouter._scriptId',
    name: '/as2/contentBasedFlowRouter/_scriptId',
    id: 'connection.as2.contentBasedFlowRouter._scriptId',
    label: 'As2 content Based Flow Router _script Id',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.contentBasedFlowRouter &&
      r.as2.contentBasedFlowRouter._scriptId,
  },
  'connection.as2.partnerStationInfo.as2URI': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.as2URI',
    name: '/as2/partnerStationInfo/as2URI',
    id: 'connection.as2.partnerStationInfo.as2URI',
    label: 'As2 partner Station Info as2URI',
    defaultValue: r =>
      r && r.as2 && r.as2.partnerStationInfo && r.as2.partnerStationInfo.as2URI,
  },
  'connection.as2.partnerStationInfo.mdn.mdnURL': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.mdn.mdnURL',
    name: '/as2/partnerStationInfo/mdn/mdnURL',
    id: 'connection.as2.partnerStationInfo.mdn.mdnURL',
    label: 'As2 partner Station Info mdn mdn URL',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.mdn &&
      r.as2.partnerStationInfo.mdn.mdnURL,
  },
  'connection.as2.partnerStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',
    helpKey: 'connection.as2.partnerStationInfo.mdn.signatureProtocol',
    name: '/as2/partnerStationInfo/mdn/signatureProtocol',
    id: 'connection.as2.partnerStationInfo.mdn.signatureProtocol',
    label: 'As2 partner Station Info mdn signature Protocol',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.mdn &&
      r.as2.partnerStationInfo.mdn.signatureProtocol,
    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'connection.as2.partnerStationInfo.mdn.mdnSigning': {
    type: 'select',
    helpKey: 'connection.as2.partnerStationInfo.mdn.mdnSigning',
    name: '/as2/partnerStationInfo/mdn/mdnSigning',
    id: 'connection.as2.partnerStationInfo.mdn.mdnSigning',
    label: 'As2 partner Station Info mdn mdn Signing',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.mdn &&
      r.as2.partnerStationInfo.mdn.mdnSigning,
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
  'connection.as2.partnerStationInfo.auth.failStatusCode': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.failStatusCode',
    name: '/as2/partnerStationInfo/auth/failStatusCode',
    id: 'connection.as2.partnerStationInfo.auth.failStatusCode',
    label: 'As2 partner Station Info auth fail Status Code',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.failStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.as2.partnerStationInfo.auth.failPath': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.failPath',
    name: '/as2/partnerStationInfo/auth/failPath',
    id: 'connection.as2.partnerStationInfo.auth.failPath',
    label: 'As2 partner Station Info auth fail Path',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.failPath,
  },
  'connection.as2.partnerStationInfo.auth.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.as2.partnerStationInfo.auth.failValues',
    name: '/as2/partnerStationInfo/auth/failValuess',
    id: 'connection.as2.partnerStationInfo.auth.failValuess',
    label: 'As2 partner Station Info auth fail Values',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.failValues,
    validWhen: [],
  },
  'connection.as2.partnerStationInfo.auth.basic.username': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.basic.username',
    name: '/as2/partnerStationInfo/auth/basic/username',
    id: 'connection.as2.partnerStationInfo.auth.basic.username',
    label: 'As2 partner Station Info auth basic username',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.basic &&
      r.as2.partnerStationInfo.auth.basic.username,
  },
  'connection.as2.partnerStationInfo.auth.basic.password': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.basic.password',
    name: '/as2/partnerStationInfo/auth/basic/password',
    id: 'connection.as2.partnerStationInfo.auth.basic.password',
    label: 'As2 partner Station Info auth basic password',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.basic &&
      r.as2.partnerStationInfo.auth.basic.password,
  },
  'connection.as2.partnerStationInfo.auth.token.token': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.token',
    name: '/as2/partnerStationInfo/auth/token/token',
    id: 'connection.as2.partnerStationInfo.auth.token.token',
    label: 'As2 partner Station Info auth token token',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.token,
  },
  'connection.as2.partnerStationInfo.auth.token.location': {
    type: 'select',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.location',
    name: '/as2/partnerStationInfo/auth/token/location',
    id: 'connection.as2.partnerStationInfo.auth.token.location',
    label: 'As2 partner Station Info auth token location',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.location,
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
  'connection.as2.partnerStationInfo.auth.token.headerName': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.headerName',
    name: '/as2/partnerStationInfo/auth/token/headerName',
    id: 'connection.as2.partnerStationInfo.auth.token.headerName',
    label: 'As2 partner Station Info auth token header Name',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.headerName,
  },
  'connection.as2.partnerStationInfo.auth.token.scheme': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.scheme',
    name: '/as2/partnerStationInfo/auth/token/scheme',
    id: 'connection.as2.partnerStationInfo.auth.token.scheme',
    label: 'As2 partner Station Info auth token scheme',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.scheme,
  },
  'connection.as2.partnerStationInfo.auth.token.paramName': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.paramName',
    name: '/as2/partnerStationInfo/auth/token/paramName',
    id: 'connection.as2.partnerStationInfo.auth.token.paramName',
    label: 'As2 partner Station Info auth token param Name',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.paramName,
  },
  'connection.as2.partnerStationInfo.auth.token.refreshMethod': {
    type: 'radiogroup',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshMethod',
    name: '/as2/partnerStationInfo/auth/token/refreshMethod',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshMethod',
    label: 'As2 partner Station Info auth token refresh Method',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshMethod,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'connection.as2.partnerStationInfo.auth.token.refreshRelativeURI': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshRelativeURI',
    name: '/as2/partnerStationInfo/auth/token/refreshRelativeURI',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshRelativeURI',
    label: 'As2 partner Station Info auth token refresh Relative URI',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshRelativeURI,
  },
  'connection.as2.partnerStationInfo.auth.token.refreshBody': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshBody',
    name: '/as2/partnerStationInfo/auth/token/refreshBody',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshBody',
    label: 'As2 partner Station Info auth token refresh Body',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshBody,
  },
  'connection.as2.partnerStationInfo.auth.token.refreshTokenPath': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshTokenPath',
    name: '/as2/partnerStationInfo/auth/token/refreshTokenPath',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshTokenPath',
    label: 'As2 partner Station Info auth token refresh Token Path',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshTokenPath,
  },
  'connection.as2.partnerStationInfo.auth.token.refreshMediaType': {
    type: 'select',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshMediaType',
    name: '/as2/partnerStationInfo/auth/token/refreshMediaType',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshMediaType',
    label: 'As2 partner Station Info auth token refresh Media Type',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshMediaType,
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
  'connection.as2.partnerStationInfo.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshHeaders',
    name: '/as2/partnerStationInfo/auth/token/refreshHeaders',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshHeaders',
    label: 'As2 partner Station Info auth token refresh Headers',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshHeaders,
  },
  'connection.as2.partnerStationInfo.auth.token.refreshToken': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.auth.token.refreshToken',
    name: '/as2/partnerStationInfo/auth/token/refreshToken',
    id: 'connection.as2.partnerStationInfo.auth.token.refreshToken',
    label: 'As2 partner Station Info auth token refresh Token',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.auth &&
      r.as2.partnerStationInfo.auth.token &&
      r.as2.partnerStationInfo.auth.token.refreshToken,
  },
  'connection.as2.partnerStationInfo.rateLimit.failStatusCode': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.rateLimit.failStatusCode',
    name: '/as2/partnerStationInfo/rateLimit/failStatusCode',
    id: 'connection.as2.partnerStationInfo.rateLimit.failStatusCode',
    label: 'As2 partner Station Info rate Limit fail Status Code',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.rateLimit &&
      r.as2.partnerStationInfo.rateLimit.failStatusCode,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.as2.partnerStationInfo.rateLimit.failPath': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.rateLimit.failPath',
    name: '/as2/partnerStationInfo/rateLimit/failPath',
    id: 'connection.as2.partnerStationInfo.rateLimit.failPath',
    label: 'As2 partner Station Info rate Limit fail Path',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.rateLimit &&
      r.as2.partnerStationInfo.rateLimit.failPath,
  },
  'connection.as2.partnerStationInfo.rateLimit.failValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.as2.partnerStationInfo.rateLimit.failValues',
    name: '/as2/partnerStationInfo/rateLimit/failValuess',
    id: 'connection.as2.partnerStationInfo.rateLimit.failValuess',
    label: 'As2 partner Station Info rate Limit fail Values',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.rateLimit &&
      r.as2.partnerStationInfo.rateLimit.failValues,
    validWhen: [],
  },
  'connection.as2.partnerStationInfo.rateLimit.limit': {
    type: 'text',
    helpKey: 'connection.as2.partnerStationInfo.rateLimit.limit',
    name: '/as2/partnerStationInfo/rateLimit/limit',
    id: 'connection.as2.partnerStationInfo.rateLimit.limit',
    label: 'As2 partner Station Info rate Limit limit',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.rateLimit &&
      r.as2.partnerStationInfo.rateLimit.limit,
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
  'connection.as2.partnerStationInfo.SMIMEVersion': {
    type: 'radiogroup',
    helpKey: 'connection.as2.partnerStationInfo.SMIMEVersion',
    name: '/as2/partnerStationInfo/SMIMEVersion',
    id: 'connection.as2.partnerStationInfo.SMIMEVersion',
    label: 'As2 partner Station Info SMIMEVersion',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.SMIMEVersion,
    options: [
      { items: [{ label: 'V2', value: 'v2' }, { label: 'V3', value: 'v3' }] },
    ],
  },
  'connection.as2.partnerStationInfo.encryptionType': {
    type: 'select',
    helpKey: 'connection.as2.partnerStationInfo.encryptionType',
    name: '/as2/partnerStationInfo/encryptionType',
    id: 'connection.as2.partnerStationInfo.encryptionType',
    label: 'As2 partner Station Info encryption Type',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.encryptionType,
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
  'connection.as2.partnerStationInfo.signing': {
    type: 'select',
    helpKey: 'connection.as2.partnerStationInfo.signing',
    name: '/as2/partnerStationInfo/signing',
    id: 'connection.as2.partnerStationInfo.signing',
    label: 'As2 partner Station Info signing',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.signing,
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
  'connection.as2.partnerStationInfo.encoding': {
    type: 'radiogroup',
    helpKey: 'connection.as2.partnerStationInfo.encoding',
    name: '/as2/partnerStationInfo/encoding',
    id: 'connection.as2.partnerStationInfo.encoding',
    label: 'As2 partner Station Info encoding',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.partnerStationInfo &&
      r.as2.partnerStationInfo.encoding,
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'connection.as2.userStationInfo.mdn.mdnURL': {
    type: 'text',
    helpKey: 'connection.as2.userStationInfo.mdn.mdnURL',
    name: '/as2/userStationInfo/mdn/mdnURL',
    id: 'connection.as2.userStationInfo.mdn.mdnURL',
    label: 'As2 user Station Info mdn mdn URL',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.userStationInfo &&
      r.as2.userStationInfo.mdn &&
      r.as2.userStationInfo.mdn.mdnURL,
  },
  'connection.as2.userStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',
    helpKey: 'connection.as2.userStationInfo.mdn.signatureProtocol',
    name: '/as2/userStationInfo/mdn/signatureProtocol',
    id: 'connection.as2.userStationInfo.mdn.signatureProtocol',
    label: 'As2 user Station Info mdn signature Protocol',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.userStationInfo &&
      r.as2.userStationInfo.mdn &&
      r.as2.userStationInfo.mdn.signatureProtocol,
    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'connection.as2.userStationInfo.mdn.mdnSigning': {
    type: 'select',
    helpKey: 'connection.as2.userStationInfo.mdn.mdnSigning',
    name: '/as2/userStationInfo/mdn/mdnSigning',
    id: 'connection.as2.userStationInfo.mdn.mdnSigning',
    label: 'As2 user Station Info mdn mdn Signing',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.userStationInfo &&
      r.as2.userStationInfo.mdn &&
      r.as2.userStationInfo.mdn.mdnSigning,
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
  'connection.as2.userStationInfo.encryptionType': {
    type: 'select',
    helpKey: 'connection.as2.userStationInfo.encryptionType',
    name: '/as2/userStationInfo/encryptionType',
    id: 'connection.as2.userStationInfo.encryptionType',
    label: 'As2 user Station Info encryption Type',
    defaultValue: r =>
      r &&
      r.as2 &&
      r.as2.userStationInfo &&
      r.as2.userStationInfo.encryptionType,
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
  'connection.as2.userStationInfo.signing': {
    type: 'select',
    helpKey: 'connection.as2.userStationInfo.signing',
    name: '/as2/userStationInfo/signing',
    id: 'connection.as2.userStationInfo.signing',
    label: 'As2 user Station Info signing',
    defaultValue: r =>
      r && r.as2 && r.as2.userStationInfo && r.as2.userStationInfo.signing,
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
  'connection.as2.userStationInfo.encoding': {
    type: 'radiogroup',
    helpKey: 'connection.as2.userStationInfo.encoding',
    name: '/as2/userStationInfo/encoding',
    id: 'connection.as2.userStationInfo.encoding',
    label: 'As2 user Station Info encoding',
    defaultValue: r =>
      r && r.as2 && r.as2.userStationInfo && r.as2.userStationInfo.encoding,
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'connection.as2.encrypted': {
    type: 'text',
    helpKey: 'connection.as2.encrypted',
    name: '/as2/encrypted',
    id: 'connection.as2.encrypted',
    label: 'As2 encrypted',
    defaultValue: r => r && r.as2 && r.as2.encrypted,
  },
  'connection.as2.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.as2.concurrencyLevel',
    name: '/as2/concurrencyLevel',
    id: 'connection.as2.concurrencyLevel',
    label: 'As2 concurrency Level',
    defaultValue: r => r && r.as2 && r.as2.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.as2.unencrypted': {
    type: 'text',
    helpKey: 'connection.as2.unencrypted',
    name: '/as2/unencrypted',
    id: 'connection.as2.unencrypted',
    label: 'As2 unencrypted',
    defaultValue: r => r && r.as2 && r.as2.unencrypted,
  },
  'connection.as2.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.as2.encrypteds',
    name: '/as2/encrypteds',
    id: 'connection.as2.encrypteds',
    label: 'As2 encrypted',
    defaultValue: r => r && r.as2 && r.as2.encrypted,
  },
  // #endregion as2
  // #region netsuite
  'connection.netsuite.account': {
    type: 'text',
    helpKey: 'connection.netsuite.account',
    name: '/netsuite/account',
    id: 'connection.netsuite.account',
    label: 'Netsuite account',
    defaultValue: r => r && r.netsuite && r.netsuite.account,
  },
  'connection.netsuite.tokenId': {
    type: 'text',
    helpKey: 'connection.netsuite.tokenId',
    name: '/netsuite/tokenId',
    id: 'connection.netsuite.tokenId',
    label: 'Netsuite token Id',
    defaultValue: r => r && r.netsuite && r.netsuite.tokenId,
  },
  'connection.netsuite.tokenSecret': {
    type: 'text',
    helpKey: 'connection.netsuite.tokenSecret',
    name: '/netsuite/tokenSecret',
    id: 'connection.netsuite.tokenSecret',
    label: 'Netsuite token Secret',
    defaultValue: r => r && r.netsuite && r.netsuite.tokenSecret,
  },
  'connection.netsuite.environment': {
    type: 'select',
    helpKey: 'connection.netsuite.environment',
    name: '/netsuite/environment',
    id: 'connection.netsuite.environment',
    label: 'Netsuite environment',
    defaultValue: r => r && r.netsuite && r.netsuite.environment,
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
  'connection.netsuite.roleId': {
    type: 'text',
    helpKey: 'connection.netsuite.roleId',
    name: '/netsuite/roleId',
    id: 'connection.netsuite.roleId',
    label: 'Netsuite role Id',
    defaultValue: r => r && r.netsuite && r.netsuite.roleId,
  },
  'connection.netsuite.email': {
    type: 'text',
    helpKey: 'connection.netsuite.email',
    name: '/netsuite/email',
    id: 'connection.netsuite.email',
    label: 'Netsuite email',
    defaultValue: r => r && r.netsuite && r.netsuite.email,
  },
  'connection.netsuite.password': {
    type: 'text',
    helpKey: 'connection.netsuite.password',
    name: '/netsuite/password',
    id: 'connection.netsuite.password',
    label: 'Netsuite password',
    defaultValue: r => r && r.netsuite && r.netsuite.password,
  },
  'connection.netsuite.requestLevelCredentials': {
    type: 'checkbox',
    helpKey: 'connection.netsuite.requestLevelCredentials',
    name: '/netsuite/requestLevelCredentials',
    id: 'connection.netsuite.requestLevelCredentials',
    label: 'Netsuite request Level Credentials',
    defaultValue: false,
  },
  'connection.netsuite.dataCenterURLs': {
    type: 'text',
    helpKey: 'connection.netsuite.dataCenterURLs',
    name: '/netsuite/dataCenterURLs',
    id: 'connection.netsuite.dataCenterURLs',
    label: 'Netsuite data Center URLs',
    defaultValue: r => r && r.netsuite && r.netsuite.dataCenterURLs,
  },
  'connection.netsuite.accountName': {
    type: 'text',
    helpKey: 'connection.netsuite.accountName',
    name: '/netsuite/accountName',
    id: 'connection.netsuite.accountName',
    label: 'Netsuite account Name',
    defaultValue: r => r && r.netsuite && r.netsuite.accountName,
  },
  'connection.netsuite.roleName': {
    type: 'text',
    helpKey: 'connection.netsuite.roleName',
    name: '/netsuite/roleName',
    id: 'connection.netsuite.roleName',
    label: 'Netsuite role Name',
    defaultValue: r => r && r.netsuite && r.netsuite.roleName,
  },
  'connection.netsuite.concurrencyLevelRESTlet': {
    type: 'text',
    helpKey: 'connection.netsuite.concurrencyLevelRESTlet',
    name: '/netsuite/concurrencyLevelRESTlet',
    id: 'connection.netsuite.concurrencyLevelRESTlet',
    label: 'Netsuite concurrency Level RESTlet',
    defaultValue: r => r && r.netsuite && r.netsuite.concurrencyLevelRESTlet,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.netsuite.concurrencyLevelWebServices': {
    type: 'text',
    helpKey: 'connection.netsuite.concurrencyLevelWebServices',
    name: '/netsuite/concurrencyLevelWebServices',
    id: 'connection.netsuite.concurrencyLevelWebServices',
    label: 'Netsuite concurrency Level Web Services',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.concurrencyLevelWebServices,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.netsuite.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.netsuite.concurrencyLevel',
    name: '/netsuite/concurrencyLevel',
    id: 'connection.netsuite.concurrencyLevel',
    label: 'Netsuite concurrency Level',
    defaultValue: r => r && r.netsuite && r.netsuite.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'connection.netsuite.wsdlVersion': {
    type: 'radiogroup',
    helpKey: 'connection.netsuite.wsdlVersion',
    name: '/netsuite/wsdlVersion',
    id: 'connection.netsuite.wsdlVersion',
    label: 'Netsuite wsdl Version',
    defaultValue: r => r && r.netsuite && r.netsuite.wsdlVersion,
    options: [
      {
        items: [
          { label: 'Current', value: 'current' },
          { label: 'Next', value: 'next' },
        ],
      },
    ],
  },
  'connection.netsuite.applicationId': {
    type: 'text',
    helpKey: 'connection.netsuite.applicationId',
    name: '/netsuite/applicationId',
    id: 'connection.netsuite.applicationId',
    label: 'Netsuite application Id',
    defaultValue: r => r && r.netsuite && r.netsuite.applicationId,
  },
  // #endregion netsuite
  // #region netSuiteDistributedAdaptor
  'connection.netSuiteDistributedAdaptor.accountId': {
    type: 'text',
    helpKey: 'connection.netSuiteDistributedAdaptor.accountId',
    name: '/netSuiteDistributedAdaptor/accountId',
    id: 'connection.netSuiteDistributedAdaptor.accountId',
    label: 'Net Suite Distributed Adaptor account Id',
    defaultValue: r =>
      r &&
      r.netSuiteDistributedAdaptor &&
      r.netSuiteDistributedAdaptor.accountId,
  },
  'connection.netSuiteDistributedAdaptor.environment': {
    type: 'select',
    helpKey: 'connection.netSuiteDistributedAdaptor.environment',
    name: '/netSuiteDistributedAdaptor/environment',
    id: 'connection.netSuiteDistributedAdaptor.environment',
    label: 'Net Suite Distributed Adaptor environment',
    defaultValue: r =>
      r &&
      r.netSuiteDistributedAdaptor &&
      r.netSuiteDistributedAdaptor.environment,
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
  'connection.netSuiteDistributedAdaptor.connectionId': {
    type: 'text',
    helpKey: 'connection.netSuiteDistributedAdaptor.connectionId',
    name: '/netSuiteDistributedAdaptor/connectionId',
    id: 'connection.netSuiteDistributedAdaptor.connectionId',
    label: 'Net Suite Distributed Adaptor connection Id',
    defaultValue: r =>
      r &&
      r.netSuiteDistributedAdaptor &&
      r.netSuiteDistributedAdaptor.connectionId,
  },
  'connection.netSuiteDistributedAdaptor.username': {
    type: 'text',
    helpKey: 'connection.netSuiteDistributedAdaptor.username',
    name: '/netSuiteDistributedAdaptor/username',
    id: 'connection.netSuiteDistributedAdaptor.username',
    label: 'Net Suite Distributed Adaptor username',
    defaultValue: r =>
      r &&
      r.netSuiteDistributedAdaptor &&
      r.netSuiteDistributedAdaptor.username,
  },
  'connection.netSuiteDistributedAdaptor.uri': {
    type: 'text',
    helpKey: 'connection.netSuiteDistributedAdaptor.uri',
    name: '/netSuiteDistributedAdaptor/uri',
    id: 'connection.netSuiteDistributedAdaptor.uri',
    label: 'Net Suite Distributed Adaptor uri',
    defaultValue: r =>
      r && r.netSuiteDistributedAdaptor && r.netSuiteDistributedAdaptor.uri,
  },
  // #endregion netSuiteDistributedAdaptor
  // #region salesforce
  'connection.salesforce.sandbox': {
    type: 'checkbox',
    helpKey: 'connection.salesforce.sandbox',
    name: '/salesforce/sandbox',
    id: 'connection.salesforce.sandbox',
    label: 'Salesforce sandbox',
    defaultValue: false,
  },
  'connection.salesforce.baseURI': {
    type: 'text',
    helpKey: 'connection.salesforce.baseURI',
    name: '/salesforce/baseURI',
    id: 'connection.salesforce.baseURI',
    label: 'Salesforce base URI',
    defaultValue: r => r && r.salesforce && r.salesforce.baseURI,
  },
  'connection.salesforce.oauth2FlowType': {
    type: 'radiogroup',
    helpKey: 'connection.salesforce.oauth2FlowType',
    name: '/salesforce/oauth2FlowType',
    id: 'connection.salesforce.oauth2FlowType',
    label: 'Salesforce oauth2Flow Type',
    defaultValue: r => r && r.salesforce && r.salesforce.oauth2FlowType,
    options: [
      {
        items: [
          { label: 'JwtBearerToken', value: 'jwtBearerToken' },
          { label: 'RefreshToken', value: 'refreshToken' },
        ],
      },
    ],
  },
  'connection.salesforce.username': {
    type: 'text',
    helpKey: 'connection.salesforce.username',
    name: '/salesforce/username',
    id: 'connection.salesforce.username',
    label: 'Salesforce username',
    defaultValue: r => r && r.salesforce && r.salesforce.username,
  },
  'connection.salesforce.bearerToken': {
    type: 'text',
    helpKey: 'connection.salesforce.bearerToken',
    name: '/salesforce/bearerToken',
    id: 'connection.salesforce.bearerToken',
    label: 'Salesforce bearer Token',
    defaultValue: r => r && r.salesforce && r.salesforce.bearerToken,
  },
  'connection.salesforce.refreshToken': {
    type: 'text',
    helpKey: 'connection.salesforce.refreshToken',
    name: '/salesforce/refreshToken',
    id: 'connection.salesforce.refreshToken',
    label: 'Salesforce refresh Token',
    defaultValue: r => r && r.salesforce && r.salesforce.refreshToken,
  },
  'connection.salesforce.packagedOAuth': {
    type: 'checkbox',
    helpKey: 'connection.salesforce.packagedOAuth',
    name: '/salesforce/packagedOAuth',
    id: 'connection.salesforce.packagedOAuth',
    label: 'Salesforce packaged OAuth',
    defaultValue: false,
  },
  'connection.salesforce.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.salesforce.scope',
    name: '/salesforce/scopes',
    id: 'connection.salesforce.scopes',
    label: 'Salesforce scope',
    defaultValue: r => r && r.salesforce && r.salesforce.scope,
    validWhen: [],
  },
  'connection.salesforce.info': {
    type: 'text',
    helpKey: 'connection.salesforce.info',
    name: '/salesforce/info',
    id: 'connection.salesforce.info',
    label: 'Salesforce info',
    defaultValue: r => r && r.salesforce && r.salesforce.info,
  },
  'connection.salesforce.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.salesforce.concurrencyLevel',
    name: '/salesforce/concurrencyLevel',
    id: 'connection.salesforce.concurrencyLevel',
    label: 'Salesforce concurrency Level',
    defaultValue: r => r && r.salesforce && r.salesforce.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion salesforce
  // #region wrapper
  'connection.wrapper.unencrypted': {
    type: 'text',
    helpKey: 'connection.wrapper.unencrypted',
    name: '/wrapper/unencrypted',
    id: 'connection.wrapper.unencrypted',
    label: 'Wrapper unencrypted',
    defaultValue: r => r && r.wrapper && r.wrapper.unencrypted,
  },
  'connection.wrapper.unencrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.wrapper.unencrypteds',
    name: '/wrapper/unencrypteds',
    id: 'connection.wrapper.unencrypteds',
    label: 'Wrapper unencrypted',
    defaultValue: r => r && r.wrapper && r.wrapper.unencrypted,
  },
  'connection.wrapper.encrypted': {
    type: 'text',
    helpKey: 'connection.wrapper.encrypted',
    name: '/wrapper/encrypted',
    id: 'connection.wrapper.encrypted',
    label: 'Wrapper encrypted',
    defaultValue: r => r && r.wrapper && r.wrapper.encrypted,
  },
  'connection.wrapper.encrypteds': {
    type: 'editor',
    valueType: 'editorExpression',
    helpKey: 'connection.wrapper.encrypteds',
    name: '/wrapper/encrypteds',
    id: 'connection.wrapper.encrypteds',
    label: 'Wrapper encrypted',
    defaultValue: r => r && r.wrapper && r.wrapper.encrypted,
  },
  'connection.wrapper.pingFunction': {
    type: 'text',
    helpKey: 'connection.wrapper.pingFunction',
    name: '/wrapper/pingFunction',
    id: 'connection.wrapper.pingFunction',
    label: 'Wrapper ping Function',
    defaultValue: r => r && r.wrapper && r.wrapper.pingFunction,
  },
  'connection.wrapper._stackId': {
    type: 'text',
    helpKey: 'connection.wrapper._stackId',
    name: '/wrapper/_stackId',
    id: 'connection.wrapper._stackId',
    label: 'Wrapper _stack Id',
    defaultValue: r => r && r.wrapper && r.wrapper._stackId,
  },
  'connection.wrapper.concurrencyLevel': {
    type: 'text',
    helpKey: 'connection.wrapper.concurrencyLevel',
    name: '/wrapper/concurrencyLevel',
    id: 'connection.wrapper.concurrencyLevel',
    label: 'Wrapper concurrency Level',
    defaultValue: r => r && r.wrapper && r.wrapper.concurrencyLevel,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  // #endregion wrapper
  // #region mongodb
  'connection.mongodb.hosts': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    helpKey: 'connection.mongodb.host',
    name: '/mongodb/hosts',
    id: 'connection.mongodb.hosts',
    label: 'Mongodb host',
    defaultValue: r => r && r.mongodb && r.mongodb.host,
    validWhen: [],
  },
  'connection.mongodb.database': {
    type: 'text',
    helpKey: 'connection.mongodb.database',
    name: '/mongodb/database',
    id: 'connection.mongodb.database',
    label: 'Mongodb database',
    defaultValue: r => r && r.mongodb && r.mongodb.database,
  },
  'connection.mongodb.username': {
    type: 'text',
    helpKey: 'connection.mongodb.username',
    name: '/mongodb/username',
    id: 'connection.mongodb.username',
    label: 'Mongodb username',
    defaultValue: r => r && r.mongodb && r.mongodb.username,
  },
  'connection.mongodb.password': {
    type: 'text',
    helpKey: 'connection.mongodb.password',
    name: '/mongodb/password',
    id: 'connection.mongodb.password',
    label: 'Mongodb password',
    defaultValue: r => r && r.mongodb && r.mongodb.password,
  },
  'connection.mongodb.replicaSet': {
    type: 'text',
    helpKey: 'connection.mongodb.replicaSet',
    name: '/mongodb/replicaSet',
    id: 'connection.mongodb.replicaSet',
    label: 'Mongodb replica Set',
    defaultValue: r => r && r.mongodb && r.mongodb.replicaSet,
  },
  // #endregion mongodb
};
