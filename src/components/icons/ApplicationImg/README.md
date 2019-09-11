This component is used to render an <img> tag for all 
supported assistants (connectors) and generic technology connectors.
Generic technology connector Images should use the type prop.
**Small generic connector images**
```js
const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;

<SpacedContainer>
  <ApplicationImg type="ftp" />
  <ApplicationImg type="http" />
  <ApplicationImg type="rest" />
  <ApplicationImg type="mysql" />
  <ApplicationImg type="mssql" />
  <ApplicationImg type="postgresql" />
  <ApplicationImg type="netsuite" />
  <ApplicationImg type="salesforce" />
</SpacedContainer>
```
**Large generic connector images**
```js
const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;

<SpacedContainer>
  <ApplicationImg size="large" type="ftp" />
  <ApplicationImg size="large" type="http" />
  <ApplicationImg size="large" type="rest" />
  <ApplicationImg size="large" type="mysql" />
  <ApplicationImg size="large" type="mssql" />
  <ApplicationImg size="large" type="postgresql" />
  <ApplicationImg size="large" type="netsuite" />
  <ApplicationImg size="large" type="salesforce" />
</SpacedContainer>
```
**Specific connector images**
Assistant images should use the assistant prop.  

**Note:**

1. If both type and assistant props are supplied, the assistant prop is used and type is ignored.   
2. Default size, if not specified is "small"
```js
const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;

<SpacedContainer>
  <ApplicationImg assistant="jira" />
  <ApplicationImg size="large" assistant="jira" />
</SpacedContainer>
```
Here is a list of all current assistants
```js
const SpacedContainer = require('../../../../src/styleguide/SpacedContainer').default;

//*** Removed some of the array items which were giving console errors and warnings---***
//Some of the Assistants having same key so i removed
// Some of the assistants is not exist in the existing stagging application so i removed


const assistants = ['3dcart', 'accelo', 'adp', 'amazonaws', 'amazonmws', 'ariba', 'asana', 'atera', 'authorize.net', 'avalara', 'banking', 'bigcommerce', 'box', 'braintree', 'campaignmonitor', 'certify', 'chargebee', 'chargify', 'clover', 'dcl', 'desk', 'docusign', 'dropbox', 'ebay', 'ebay-xml', 'etsy', 'eventbrite', 'exacterp', 'expensify', 'facebookads', 'fieldaware', 'freshbooks', 'freshdesk', 'ftp', 'github', 'google', 'googleanalytics', 'googlecontacts','googlemail', 'googlesheets', 'googleshopping', 'harvest', 'hubspot', 'insightly', 'integratorio', 'jet', 'jira', 'jobvite', 'lightspeed','liquidplanner', 'magento', 'mailchimp','namely', 'netsuite', 'newegg', 'newrelic', 'okta', 'openair', 'osn', 'other', 'paychex', 'paypal', 'pulseway', 'quickbooks', 'recurly', 's3', 'sageone', 'salesforce', 'servicenow', 'shiphawk', 'shipstation', 'shipwire', 'shopify', 'skubana', 'slack', 'smartsheet', 'snapfulfil', 'splunk', 'spreecommerce', 'squareup','stripe', 'surveymonkey', 'svb', 'tableau', 'tesco', 'travis', 'tsheets', 'twilio', 'walmart', 'wiser', 'woocommerce', 'wrike', 'xcart', 'yahoo', 'yammer', 'zendesk', 'zoho', 'zuora', 'coupa', 'taxjar', 'quip','zohocrm', 'zohodesk', 'microsoftdynamics365', 'pitneybowes', 'mysql', 'postgresql', 'mssql', 'greenhouse', 'shippo','easypost', 'zohobooks', 'microsoftbusinesscentral', 'microsoftoutlookcalendar', 'microsoftoutlookmail', 'microsoftoutlookcontacts', 'microsoftonenote', 'wish', 'pdffiller', 'signnow', 'acton', 'acumatica', 'mongodb', 'zohomail', 'zoom', 'myobessentials', 'nimble', 'bronto', 'strata', 'returnly', 'activecampaign', 'klaviyo', 'postmark', 'powerbi', 'procurify', 'mailgun', 'zimbra', 'merchantesolutions', 'aptrinsic', 'cardknox', 'skuvault', 'nextag', 'concur', 'oandav20fxtrade', 'oandaexchangerates', 'tophatter', 'concurv4', 'sugarcrm', 'marketo', 'grms', 'retailops', 'sharepoint', 'parseur','propack', 'outreach', 'ramplogistics', 'constantcontactv3','dunandbradstreet', 'trinet', 'pacejet', 'solidcommerce', 'intercom', 'bamboohr', 'myobaccountright', 'easyship', 'azureactivedirectory', 'practicepanther', 'onelogin', 'cartrover', 'recharge', 'autopilot', 'drift', 'paycor', 'vend', 'messagemedia', 'ware2go'];
<SpacedContainer>
  {assistants.map(a => 
  <ApplicationImg key={a} assistant={a} />
  )}
</SpacedContainer>
```