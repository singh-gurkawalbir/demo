import { isNewId } from '../../../../utils/resource';

const dateTimeOptions = [
  { label: 'YYYY-MM-DDTHH:mm:ss z', value: 'YYYY-MM-DDTHH:mm:ss z' },
  { label: 'YYYY-MM-DDTHH:mm:ss', value: 'YYYY-MM-DDTHH:mm:ss' },
  { label: 'YYYY-MM-DDTHH:mm:ssZ', value: 'YYYY-MM-DDTHH:mm:ssZ' },
  { label: 'YYYY-MM-DDTHH:mm:ss[Z]', value: 'YYYY-MM-DDTHH:mm:ss[Z]' },
  {
    label: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
    value: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
  },
  {
    label: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
    value: 'YYYY-MM-DDTHH:mm:ss.SSSSZZ',
  },
  { label: 'YYYY-MM-DD hh:mm:ss', value: 'YYYY-MM-DD hh:mm:ss' },
  { label: 'X (Unix timestamp)', value: 'X' },
  { label: 'x (Unix ms timestamp)', value: 'x' },
  { label: 'M/D/YYYY', value: 'M/D/YYYY' },
  { label: 'YYMMDD', value: 'YYMMDD' },
  { label: 'MMDDYY', value: 'MMDDYY' },
  { label: 'DDMMYY', value: 'DDMMYY' },
  { label: 'M/D/YY', value: 'M/D/YY' },
  { label: 'D/M/YYYY', value: 'D/M/YYYY' },
  { label: 'D/M/YY', value: 'D/M/YY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'M/D/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'MM/DD/YYYY HH:mm', value: 'MM/DD/YYYY HH:mm' },
  { label: 'MM/DD/YYYY HH:mm:ss', value: 'MM/DD/YYYY HH:mm:ss' },
];

export default {
  // #region common
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  // adaptor type has export appended to it
  // strip it off and lowercase the connection type
  // _connectionId: {
  //   type: 'text',
  //   label: 'Connection',
  //   resourceType: 'connections',
  //   resourceProp: 'type',
  // },
  description: {
    type: 'text',
    label: 'Description',
  },

  // UI Specific field
  formView: {
    id: 'formView',
    type: 'formview',
    label: 'Form view',
    defaultValue: r => r && `${r.assistant ? 'false' : 'true'}`,
  },
  asynchronous: {
    type: 'checkbox',
    label: 'Asynchronous',
  },
  apiIdentifier: {
    label: 'Invoke',
    helpKey: 'apiIdentifier',
    type: 'apiidentifier',
    visible: r => r && !isNewId(r._id),
  },
  configureAsyncHelper: {
    type: 'checkbox',
    label: 'Configure async helper',
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
    label: 'Page size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'datauritemplate',
    label: 'Data URI template',
    editorTitle: 'Build data URI template',
  },
  exportOneToMany: {
    label: 'How should this export be parameterized?',
    type: 'labeltitle',
    visible: r => !!(r && r.isLookup),
  },
  oneToMany: {
    type: 'radiogroup',
    label: 'One to many',
    helpKey: 'oneToMany',
    defaultValue: r => (r && r.oneToMany ? 'true' : 'false'),
    visible: r => !!(r && r.isLookup),
    options: [
      {
        items: [
          { label: 'Yes (advanced)', value: 'true' },
          { label: 'No', value: 'false' },
        ],
      },
    ],
  },
  pathToMany: {
    type: 'text',
    label: 'Path to many',
    helpKey: 'pathToMany',
    placeholder: 'Not needed for array/row based data.',
    visible: r => !!(r && r.isLookup),
    visibleWhenAll: r => {
      if (r && r.isLookup)
        return [
          {
            field: 'oneToMany',
            is: ['true'],
          },
        ];

      return [];
    },
  },
  // sampleData: {
  //   type: 'editor',
  //   label: 'Sample Data',
  // },
  originSampleData: {
    type: 'text',
    label: 'Origin sample data',
  },
  // not using it
  assistant: {
    type: 'select',
    label: 'Assistant',
    options: [
      {
        items: [
          { label: '3dcart', value: '3dcart' },
          { label: '3PL Central', value: '3plcentral' },
          { label: 'Accelo', value: 'accelo' },
          { label: 'Adp', value: 'adp' },
          { label: 'Amazonaws', value: 'amazonaws' },
          { label: 'Amazon S3', value: 'amazon s3' },
          { label: 'Anaplan', value: 'anaplan' },
          { label: 'SAP Ariba', value: 'ariba' },
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
          // { label: 'Desk', value: 'desk' },
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
          { label: 'Gorgias', value: 'gorgias' },
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
          { label: 'Inspectorio', value: 'inspectorio' },
          { label: 'Integratorio', value: 'integratorio' },
          { label: 'Jet', value: 'jet' },
          { label: 'Jira', value: 'jira' },
          { label: 'Jobvite', value: 'jobvite' },
          { label: 'Lightspeed', value: 'lightspeed' },
          { label: 'Linkedin', value: 'linkedin' },
          { label: 'Liquidplanner', value: 'liquidplanner' },
          { label: 'LogiSense', value: 'logisense' },
          { label: 'Loop Returns', value: 'loopreturns' },
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
          { label: 'Zendesk Sell', value: 'zendesksell' },
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
          { label: 'Snowflake', value: 'snowflake' },
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
          { label: 'MongoDB', value: 'mongodb' },
          { label: 'DynamoDB', value: 'dynamodb' },
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
          { label: 'Orderful', value: 'orderful' },
        ],
      },
    ],
  },
  assistantMetadata: {
    type: 'text',
    label: 'Assistant metadata',
  },
  isLookup: {
    type: 'checkbox',
    label: 'Is lookup',
  },
  useTechAdaptorForm: {
    type: 'checkbox',
    label: 'Use tech adaptor form',
  },
  adaptorType: {
    type: 'text',
    label: 'Adaptor type',
  },
  // #endregion common
  // #region inputFilter
  'inputFilter.expression.version': {
    type: 'radiogroup',
    label: 'Input filter expression version',
    options: [{ items: [{ label: '1', value: '1' }] }],
  },
  'inputFilter.expression.rules': {
    type: 'text',
    label: 'Input filter expression rules',
  },
  'inputFilter.script._scriptId': {
    type: 'text',
    label: 'Input filter script _script id',
  },
  'inputFilter.script.function': {
    type: 'text',
    label: 'Input filter script function',
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
    label: 'Date field',
    required: true,
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.dateFormat': {
    type: 'toggleSelectToText',
    selectHrefLabel: 'Use custom format',
    textHrefLabel: 'Use presets',
    label: 'Delta date format',
    options: [
      {
        items: dateTimeOptions,
      },
    ],
    isTextComponent: r => {
      if ((r && r.delta === undefined) || r.delta.dateFormat === undefined)
        return false;

      return !(
        r &&
        r.delta &&
        r.delta.dateFormat &&
        dateTimeOptions.find(option => option.value === r.delta.dateFormat)
      );
    },
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.startDate': {
    type: 'text',
    label: 'Delta start date',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  'delta.lagOffset': {
    type: 'textwithflowcontext',
    label: 'Offset',
    visibleWhenAll: [{ field: 'type', is: ['delta'] }],
  },
  'delta.endDateField': {
    type: 'text',
    label: 'Delta end date field',
    visibleWhen: [{ field: 'type', is: ['delta'] }],
  },
  // #endregion delta
  // #region once
  'once.booleanField': {
    type: 'text',
    label: 'Boolean field',
    required: true,
    visibleWhen: [{ field: 'type', is: ['once'] }],
  },
  // #endregion once
  // #region valueDelta
  'valueDelta.exportedField': {
    type: 'text',
    label: 'Value delta exported field',
  },
  'valueDelta.pendingField': {
    type: 'text',
    label: 'Value delta pending field',
  },
  // #endregion valueDelta
  // #region distributed
  'distributed.bearerToken': {
    type: 'text',
    label: 'Distributed bearer token',
  },
  // #endregion distributed
  // #region hooks
  hookType: {
    type: 'radiogroup',
    label: 'Hook type',
    defaultValue: r => {
      let isStackType = false;

      isStackType = !!(((r || {}).hooks || {}).preSavePage || {})._stackId;

      if (isStackType) {
        return 'stack';
      }

      return 'script';
    },
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
    label: 'Pre save page',
  },
  'hooks.preSavePage._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    label: 'Pre save page script',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['script'],
      },
    ],
  },
  'hooks.preSavePage._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Pre save page stack',
    visibleWhen: [
      {
        field: 'hookType',
        is: ['stack'],
      },
    ],
  },

  // #endregion hooks
  // #region transform
  transform: {
    type: 'transformeditor',
    label: 'Transform expression rules',
    defaultValue: r => r && r.transform,
  },
  'transform.script._scriptId': {
    type: 'text',
    label: 'Transform script _script id',
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
    label: 'Filter script _script id',
  },
  'filter.script.function': {
    type: 'text',
    label: 'Filter script function',
  },
  rawData: {
    type: 'rawdata',
    label: 'Refresh sample data',
  },
  sampleData: {
    type: 'sampledata',
    label: 'Sample data',
  },
  exportPanel: {
    type: 'exportpanel',
  },
  skipRetries: {
    type: 'skipRetries',
    label: 'Do not store retry data',
    visible: r => !(r && r.isLookup),
  },
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
};
