This component is used to render an <img> tag for all 
supported assistants (connectors) and generic technology connectors.

Generic technology connector Images should use the type prop.
```js
<div>
  <ApplicationImg type="ftp" />
  <ApplicationImg type="http" />
  <ApplicationImg type="rest" />
  <ApplicationImg type="mysql" />
  <ApplicationImg type="postgresql" />
  <ApplicationImg type="netsuite" />
  <ApplicationImg type="salesforce" />
</div>
```

Assistant images should use the assistant prop./
Note that if both type and assistant props are supplied, the assistant prop is used and type is ignored.
```js
  <ApplicationImg assistant="jira" />
```

Here is a list of all current assistants
```js
const assistants = ['3dcart', 'accelo', 'adp', 'amazonaws', 'amazonmws', 'anaplan', 'ariba', 'asana', 'atera', 'authorize.net', 'avalara', 'banking', 'bigcommerce', 'bill.com', 'box', 'braintree', 'campaignmonitor', 'certify', 'chargebee', 'chargify', 'clover', 'dcl', 'desk', 'dnb', 'docusign', 'doubleclick', 'dropbox', 'ebay', 'ebay-xml', 'eloquent', 'etsy', 'eventbrite', 'exacterp', 'expensify', 'facebookads', 'fieldaware', 'freshbooks', 'freshdesk', 'ftp', 'github', 'gooddata', 'google', 'googleanalytics', 'googlecontacts', 'googledrive', 'googlemail', 'googlesheets', 'googleshopping', 'harvest', 'hoovers', 'hubspot', 'hybris', 'insightly', 'integratorio', 'jet', 'jira', 'jobvite', 'lightspeed', 'linkedin', 'liquidplanner', 'magento', 'mailchimp', 'mediaocean', 'namely', 'netsuite', 'newegg', 'newrelic', 'okta', 'openair', 'osn', 'other', 'paychex', 'paylocity', 'paypal', 'pulseway', 'quickbooks', 'recurly', 'replicon', 's3', 'sageone', 'salesforce', 'servicenow', 'shiphawk', 'shipstation', 'shipwire', 'shopify', 'skubana', 'slack', 'smartsheet', 'snapfulfil', 'splunk', 'spreecommerce', 'squareup', 'steelbrick', 'stripe', 'surveymonkey', 'svb', 'tableau', 'tesco', 'travis', 'tsheets', 'twilio', 'walmart', 'wiser', 'woocommerce', 'wrike', 'xcart', 'yahoo', 'yammer', 'zendesk', 'zoho', 'zuora', 'coupa', 'taxjar', 'quip', 'allbound', 'zohocrm', 'zohodesk', 'microsoftoffice365', 'microsoftdynamics365', 'pitneybowes', 'mysql', 'postgresql', 'mssql', 'greenhouse', 'shippo', 'gusto', 'easypost', 'segment', 'zohobooks', 'microsoftbusinesscentral', 'microsoftoutlookcalendar', 'microsoftoutlookmail', 'microsoftoutlookcontacts', 'microsoftonenote', 'wish', 'pdffiller', 'signnow', 'acton', 'acumatica', 'mongodb', 'zohomail', 'zoom', 'myobessentials', 'nimble', 'bronto', 'strata', 'returnly', 'activecampaign', 'klaviyo', 'postmark', 'powerbi', 'procurify', 'mailgun', 'zimbra', 'merchantesolutions', 'aptrinsic', 'cardknox', 'skuvault', 'nextag', 'concur', 'oandav20fxtrade', 'oandaexchangerates', 'spreecommerce', 'tophatter', 'concurv4', 'sugarcrm', 'marketo', 'grms', 'retailops', 'sharepoint', 'parseur', 'authorize.net', 'firstdata', 'propack', 'outreach', 'ramplogistics', 'constantcontactv3', 'constantcontactv2', 'concurall', 'dunandbradstreet', 'trinet', 'pacejet', 'solidcommerce', 'intercom', 'bamboohr', 'myobaccountright', 'easyship', 'azureactivedirectory', 'clio', 'practicepanther', 'onelogin', 'cartrover', 'recharge', 'autopilot', 'drift', 'paycor', 'vend', 'messagemedia', 'ware2go'];

<div>
  {assistants.map(a => <ApplicationImg key={a} assistant={a} /> )}
</div>
```
