import { HELP_CENTER_BASE_URL } from '../../constants';
// uncomment eslint-disable no-dupe-keys this to expose dupe keys
export default {
  formView: 'The application specific form is customized to help configure your resource for this particular application. However, if you would like more flexibility, choose the universal connector form (e.g. REST or HTTP) instead, which is a generic form.',
  connectionFormView: '<b>•</b> Simple form helps you to quickly configure the resources by displaying only the required minimum fields.<br><b>•</b> HTTP form allows you to view and/or modify application specific resources at the universal HTTP connector level.',
  'afe.handlebar.data': 'This is sample help for handlebar afe, data panel',
  'afe.handlebar.rule.relaviveUri': 'This is sample help for handlebar afe, rule panel, relativeUri fieldId',
  previewPanelRecords: 'Enter or select the maximum number of records – up to 100 – to preview. Then, click <b>Preview</b> to see the records that match your query in the order that they’re received.',
  populateMockOutput: 'Replace any mock output values in this editor with the <a href="https://docs.celigo.com/hc/en-us/articles/360039842611-Preview-export-data" target="_blank">preview data</a> from the most recent export. Clicking this overwrites any existing mock data with preview data.',
  populateMockResponse: 'Replace any mock response in this editor with the preview data from the most recent import. Clicking this button overwrites any existing mock response with preview data.',
  populateMockResponseWithSampleData: 'Replace any mock response in this editor with the sample response data. Clicking this button overwrites any existing mock response with sample data.',
  'export.mockOutput': 'Mock output simulates exported data during flow configuration or when you execute a flow test run. Instead of actually executing the export to retrieve sample data (or waiting for webhook listeners to receive data), integrator.io uses the mock output you provide to simulate export data while you are configuring your flow. Mock output is always required when running the flow in test mode. Click Populate with preview data to replace any mock output values in this editor with <a href="https://docs.celigo.com/hc/en-us/articles/360039842611-Preview-export-data" target="_blank">preview data</a>, or enter your own sample data (max 10 records up to 1 MB in size). Mock output must be in <a href="https://docs.celigo.com/hc/en-us/articles/4473437451163-integrator-io-canonical-format-for-mock-data" target="_blank">integrator.io canonical format.</a>',
  'import.mockResponse': 'Mock response data simulates a response returned by the destination application. You can use mock response data to configure the rest of your flow. You can also use mock data when running the flow in test mode to avoid interactions with the destination application while running end-to-end flow tests. Mock response data must be in <a href="https://docs.celigo.com/hc/en-us/articles/4473437451163" target="_blank">integrator.io canonical JSON format.</a>',
  settingsForm:
'Open <a href="https://docs.celigo.com/hc/en-us/articles/360058595552-Create-forms" target="_blank">Form builder</a> to create or edit user-friendly fields that prompt for text entry or selections that will be returned as settings applied to this resource. Your forms can include any <a href="https://docs.celigo.com/hc/en-us/articles/360059205112-Common-form-fields" target="_blank">field types</a> that you see elsewhere in integrator.io. Forms fields make it much easier for less technical users to work with your settings.',
  settings:
'This same JSON settings field is exposed on many of the core resource types: integration, flow, export, import, connection, etc... Generally speaking, this settings field can be used to parameterize the logic within your resource. Hooks, filters, handlebars, etc... are all given access to the settings fields when they run, and can incorporate the settings values into their logic. It is worth highlighting that the settings fields stored on linked/related resources are also accessible at runtime. For example, the settings field defined at the integration tile level will be accessible to all flows running within the same integration tile. \n\nIt is recommended that you create a custom form to expose and manage your settings fields, so that less technical users do not need to work with raw JSON. Be sure to check out the "Launch form builder" button!.',
  'license._trialLicenseId': 'Enter a license value that will be the default license configuration for any trial licenses.',
  'license.trialPeriod': 'Choose a trial period for this integration: 14 days, 30 days, or 60 days.',
  'license.trialEnabled': 'You must create the integration app listing before you can enable the trials.',
  // fieldDefinitions
  'connection.jdbc.host': 'Enter the NetSuite SuiteAnalytics Connect server TCP/IP address. For more information on how to retrieve the server name, see <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_1202105110.html">Connect Driver Download</a>',
  'connection.jdbc.port': 'Displays 1708. This is required while configuring the <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_1202105110.html"> data source </a>in NetSuite.',
  'connection.jdbc.serverDataSource': 'Select the <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1549957264.html"> NetSuite SuiteAnalytics Connect </a> server data source, either <b>NetSuite.com</b> or <b>NetSuite2.com.</b>',
  'connection.jdbc.StaticSchema': 'Choose Yes to use the <a href="https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_164485063706.html">static data model</a>, which provides the structure, the name of all available record types, and the fields in the NetSuite2.com data source. (To use the static data model in your account, you must add the StaticSchema attribute and set it to 1.)  ',
  'connection.jdbc.email': 'Email to log in into your NetSuite account',
  'connection.jdbc.password': 'Password to log in into your NetSuite account',
  'connection.as2.partnerStationInfo.mdn.verifyMDNSignature':
'Check this box if your trading partner requires that the MDN signature be verified. Otherwise, integrator.io will not attempt to verify the signature.',
  'connection.partnerrequireasynchronousmdns':
'Check this box if your trading partner requires MDNs to be sent asynchronously. By default, integrator.io is configured to send MDNs synchronously.',
  'connection.as2.contentBasedFlowRouter':
'The AS2 connection you selected is being used by other listeners. Script based routing rules must be defined to route inbound files received to the correct flows.',
  'connection.van.contentBasedFlowRouter':
'The VAN connection you selected is being used by other listeners. Script based routing rules must be defined to route inbound files received to the correct flows.',
  'export.as2.contentBasedFlowRouter':
'The AS2 connection you selected is being used by other listeners. Script based routing rules must be defined to route inbound files received to the correct flows.',
  'export.netsuite.distributed.executionContext': 'This is a required field to specify the exact execution context values for which a record should be exported in real-time. For example, it is very common for a real-time export to run only for \'User Interface\' and \'Web Store\' changes. These values both represent actual end users manually submitting changes to NetSuite (like a user editing and saving a customer record in the browser, or a shopper submitting an order via the web store), and these manual data changes are normally small and also important to propagate quickly to other applications (i.e. new web orders probably need to get sent to the shipping API asap). Execution context values like \'CSV Import\' are risky to enable because (1) you will slow down your mass update due to the overhead of sending data to an external system one record at a time, and (2) you may inadvertently flood your integration with way too many individual records that don\'t need to be synced right away (where a scheduled data flow would have been a better fit).',
  'export.netsuite.distributed.executionType': 'This is a required field to specify the exact execution type values for which a record should be exported in real-time. It is very common for a real-time export to include \'Create\' to export brand new records when they are first submitted to NetSuite, and then also to include both \'Edit\' and \'Inline Edit\' to export records that have been changed. Some of the other values available in this field are a bit more advanced, and please check the NetSuite help guides (or contact NetSuite support) for more info on what the different execution types mean. To provide at least one example for one of the more advanced options, you might want to enable a real-time export on the Sales Order record type in NetSuite, but you ONLY want the sales order to be exported when an approver clicks on the Approve button for the order (or via a mass approval action). A possible usecase for this export would be to route a simple message into a Slack or HipChat type application to let someone (or a team of people) know via chat that an order has been approved.',
  'iClient.oauth2.clientId':
'This is the ID for your client app that is registered with the API provider.',
  'iClient.provider': 'The name of the app that provides your client ID and client secret.',
  'iClient.oauth2.clientSecret':
'This is the client secret the API provider gave you.',
  'import.http.requestType':
'Please specify whether the record is being created or updated using this field.',
  'import.rdbms.queryType':
'Choose <b>Insert</b> if you are importing new records into the database. Choose <b>Update</b> if you are importing changes to existing records in the database. Choose <b>Insert or Update</b> if you want your import to dynamically check whether a record exists in the database. If so, that record will be updated; otherwise, a record will be created.',
  'import.rdbms.query': 'Enter the exact SQL query to be sent to your database including <a href="https://docs.celigo.com/hc/en-us/articles/360039326071">handlebars</a> expressions. This query can be static or dynamic. Handlebars themselves are not submitted in the query, but they insert and send the data you request (values, records, and flow settings) in the SQL query. An example query would be: <br /> <br /> EXEC pdi_sp_UpdateCustomerPostSync {{record.NetSuiteInternalId}}, {{record.Id}} ',
  // definitions
  'amazonmws.connection.http.sellingPartnerId': 'The identifier of the selling partner who is authorizing your application.',
  'amazonmws.connection.http.type': '<b>Selling Partner API (SP-API)</b>: The Selling Partner API is a REST-based API and is an evolution of the legacy Amazon Marketplace Web Service (MWS) APIs. It’s recommended you integrate using SP-APIs.<br><b>Hybrid Selling Partner API (SP-API and MWS)</b>: Hybrid Selling Partner API application can make calls both to the Selling Partner API and to Amazon Marketplace Web Service (Amazon MWS). Use Hybrid Selling Partner API when your integration requires functionality from both services.<br><b>Marketplace Web Service API (MWS)</b>: Amazon Marketplace Web Service (Amazon MWS) is the legacy web service API.',
  'connection.salesforce.info.email': 'Your Salesforce account email.',
  'connection.salesforce.info.organization_id':
"Your organization's unique Salesforce ID",
  'omnisend.connection.http.auth.token.token': 'Enter the API key of your Omnisend account.<br><b>Steps to get the API key:</b><br>1. Sign into the Omnisend account.<br>2. From the account avatar at the top right, select <b>Store settings</b>. Navigate to <b>Integrations & API > API keys.</b><br>3. Copy the API key. (If none exists yet or you want to change the API key,click <b>Create APIKEY+</b>, select its permissions, and click <b>Save</b>.)<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pagerduty.connection.http.auth.token.token': 'Enter the API key of your Pagerduty account.<br><b>Steps to get the API key:</b><br>1. Sign in to the Pagerduty account.<br>2. On the dashboard, Navigate to <b>Integrations → Developer Tools → API Access Keys</b>.<br>3. Copy the API key.(If none exists yet or you want to change the API key,click to <b>Create New API Key</b> option and select appropriate permissions to create a new API key.)<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pagerduty.connection.http.auth.type': 'Please select Authentication Type.',
  'pagerduty.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><b>Steps to get the client ID and client secret:</b><br>1. Sign in to the Pagerduty account.<br>2. On the dashboard, Navigate to <b>Integrations → Developer Tools → Developer Mode</b>.<br> 3. Click on the App(under functionality) → Manage option for OAuth 2.0.<br> 4. Copy the Client ID and Client Secret.(If none exists yet,click to <b>Create New App</b> option to create a new pair.)',
  'sharepoint.connection.http.subDomain':
"Please enter your SharePoint subdomain. For example, in https://temp-portal.sharepoint.com 'temp-portal' is the subdomain.",
  'vroozi.connection.accountType':
'Please select your account type here. Select Sandbox if your API Endpoint starts with https://sandbox-api.vroozi.com. Select Production if your API Endpoint starts with https://api.vroozi.com',
  'vroozi.connection.http.unencrypted.apiKey':
'Please enter your API Key here.API key is generated after creating your application.',
  'vroozi.connection.http.auth.token.token': 'Please enter your Access Token here. To get an API key for your Vroozi account,login to your Vroozi account and Under API Integration section, click on Credentials.Create your application by clicking on "Add New Application" After entering your application name, you will be provided with an access token which is shown only once.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'saplitmos.connection.http.auth.token.token': 'Please enter API Key of your SAP Litmos Account. <br> <b>Steps to generate API Key:</b> <br> 1. Login to SAP Litmos Account <br>2. Click "My Profile & Settings" from the drop-down menu at the top right corner of the screen <br>3. View the bottom of your profile.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'oandav20fxtrade.connection.accountType': 'Please select your account type here. Select Demo if your account type is "fxTrade Practice". Select Trading if your account type is "fxTrade".',
  'oandav20fxtrade.connection.http.auth.token.token':
'Please enter your API token here.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'openair.connection.environment':
'Please select the environment of your OpenAir account.',
  'openair.connection.http.unencrypted.companyId':
'Please enter Company ID of your account.',
  'openair.connection.http.unencrypted.userId':
'Please enter User ID of your account.',
  'openair.connection.http.encrypted.password':
'Please enter Password of your account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.unencrypted.namespace':
'Please enter the API Namespace of your account.',
  'openair.connection.http.unencrypted.apiKey':
'Please enter the API Key of your account. <br> Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.oneloginRegion': 'OneLogin is hosted in two independent operating regions: the United States (US) and the European Union (EU). Enter your location as the region.',
  'onelogin.connection.http.unencrypted.apiKey':
'Enter the Client ID for your OneLogin account. If you do not know your Client ID, use the following steps to retrieve it from OneLogin:<br> 1. Access OneLogin as an account owner or administrator.<br> 2. Click <b>Developers</b> > <b>API Credentials</b>.<br> 3. Click <b>New Credential</b> on the <b>API Access</b> page.<br> 4. Copy the Client ID and paste the value into this field.',
  'onelogin.connection.http.encrypted.apiSecret':
'Enter the Client secret for your OneLogin Account. If you do not know your Client secret, use the following steps to retrieve it from OneLogin:<br> 1. Access OneLogin as an account owner or administrator.<br> 2. Click <b>Developers</b> > <b>API Credentials</b>.<br> 3. Click <b>New Credential</b> on the <b>API Access</b> page.<br> 4.Copy the Client secret and paste the value into this field.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Client secret safe. You must re-enter this value each time you edit the connection, because integrator.io stores the Client secret only when the connection is saved. integrator.io never displays the Client secret as unencrypted text.',
  'onelogin.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by OneLogin. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'paycor.connection.http.unencrypted.publicKey':
'Please enter your public key here. Your public key identifies you to our system. This is similar to a username. You will include your public key every time you send request to Paycor. This is not secret information.',
  'paycor.connection.http.encrypted.secretKey':
'Please enter your private key here. The private key is secret and is similar to a password. Only you and Paycor should have your private key. The shared secret allows access to your sensitive data.<br> Multiple layers of protection, including AES 256 encryption, are in place to keep your Private key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.quickbooksEnvironment':
'Please select your environment here. Select Sandbox Accounting if the account is created on https://sandbox-quickbooks.api.intuit.com. Select Sandbox Payment if the account is created on https://sandbox.api.intuit.com. Select Production Accounting if the account is created on https://quickbooks.api.intuit.com. Select Production Payment if the account is created on https://api.intuit.com.',
  'quickbooks.connection.http._iClientId':
'Save your client ID and client secret for an extra layer of security.<br><br><b>Steps to get the client ID and client secret:<br></b>1. Sign in to your QuickBooks developer account.<br>2. From the toolbar, select the <b>Dashboard </b>link.<br>3. Select and open the required app.<br>4. If you are connecting a sandbox company account, navigate to the <b>Development</b> section and select <b>Keys & OAuth</b> (or) if you are connecting a production app, navigate to the <b>Production</b> section and select <b>Keys & OAuth</b>.<br>5. Copy the <b>Client ID</b> and <b>Client secret</b>.',
  'trinet.connection.http.unencrypted.companyId':
'Please reach out to TriNet support team for company Id.',
  'trinet.connection.http.auth.token.token':
'Please reach out to TriNet support team for API key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.unencrypted.pacejetLocation':
'Please reach out to Pacejet support team for location header.',
  'connection.http.encrypted.pacejetLicenseKey':
'Please reach out to Pacejet support team for License key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your license key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'integratorio.connection.integrator.region':
'Please select your region here. Select North America if the account is created on https://api.integrator.io. Select Europe if the account is created on https://api.eu.integrator.io.',
  'integratorio.connection.http.auth.token.token': 'Enter an integrator.io token. You can generate a token in <b>Resources</b> > <a href=https://docs.celigo.com/hc/en-us/articles/360019782431-Generate-API-tokens>API tokens</a>, when <a href=https://docs.celigo.com/hc/en-us/articles/227018868-Switch-to-Developer-mode>Developer mode</a> is enabled. <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'recharge.connection.http.auth.token.token':
'Please enter your API key here. Access to the API will need to be given by a member of the ReCharge team so reach out to their support team to enable this for you. Once this has been enabled for your store, you can go to Integrations and click on API tokens on the far right corner of your dashboard.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bamboohr.connection.http.bamboohrSubdomain':
'Enter the unique portion of the bamboohr.com address that you visit to log in to your portal. For example, if your portal is found at https://personnel.bamboohr.com, then enter personnel for the subdomain.',
  'bamboohr.connection.http.encrypted.apiKey': 'Please enter your API key here. To generate an API key for a given user, users should log in and click their name in the upper right hand corner of any page to get to the user context menu. There will be an "API Keys" option in that menu to go to the page.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.unencrypted.oktaDomain':
  'Enter the domain of your Okta account.<br><b> Steps to find your Okta domain:</b><br>1. Sign in to your Okta organization with your administrator account.<br>2. Look for the Okta domain in the global header located in the upper-right corner of the dashboard.<br>3.Your Okta domain looks like:<br> <b>example.oktapreview.com,<br> example.okta.com,<br> example.okta-emea.com</b>.<br>See<a href="https://developer.okta.com/docs/concepts/okta-organizations/">Okta Organizations</a>for more information on the types of Okta orgs.',
  'okta.connection.http.auth.token.token': 'Please enter your Token here. To generate an API key for a given user, users should log in and click their name in the upper right hand corner of any page to get to the user context menu. There will be an "API Keys" option in that menu to go to the page.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pipedrive.connection.http.auth.type': 'Please select Authentication Type.',
  'pipedrive.connection.http.subdomain': 'Please enter the unique portion of the pipedrive.com address that you visit to log in to your portal. For example, if your portal is found at https://personnel.pipedrive.com, then enter personnel for the subdomain.',
  'pipedrive.connection.http.auth.token.token': 'Please enter the API token of your Pipedrive account.<br><b>Please follow the steps below to fetch this</b><br> 1. Log in to your Pipedrive account, on the top right corner you’ll find "Personal Preferences" when you click on your profile image.<br>2. Click on the API tab. You can generate a new token or use the existing one.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'easyship.connection.http.auth.token.token':
'Please enter your API access token here. You can generate the API Access Token from https://app.easyship.com/connect. You will need to create an API connection, and then retrieve the token from the store settings.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'propack.connection.environment':
'Please select your environment here. Select Test if the account is created on https://test.webservices.p3pl.com. Select Production if the account is created on https://webservices.p3pl.com.',
  'connection.http.unencrypted.p3plUserID':
'Please enter your P3PL account User ID.',
  'connection.http.encrypted.p3plUserPassword':
'Please enter your P3PL account Password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'solidcommerce.connection.http.encrypted.securityKey':
'Enter your Solid Commerce Developer Key or Security Key here. This can be obtained from the Settings section and Security Key subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your security key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'solidcommerce.connection.http.encrypted.appKey':
'Application Key is generated at https://www.upsefulfillment.com, under Marketplaces --> Marketplaces Setup --> Web Services..<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'parseur.connection.http.encrypted.apiKey':
'Please enter your API key here.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'paypal.connection.http.accountType':
'Select one of the following, depending on the account you’re connecting to. <br> <b>.</b> Sandbox </br> <b>.</b> Production',
  'paypal.connection.http.unencrypted.clientId':
'Please enter Client ID of your Paypal Account.Steps to generate API credentials: Login to Developer Account -- > My Apps & Credentials -- > Select the Sandbox or Live -- > Create an App -- > Copy the Client ID and Secret',
  'paypal.connection.http.encrypted.clientSecret':
'Please enter Client Secret of your Paypal Account. Steps to generate API credentials: Login to Developer Account -- > My Apps & Credentials -- > Select the Sandbox or Live -- > Create an App -- > Copy the Client ID and Secret.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your client secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'paypal.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Paypal. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'returnly.connection.http.encrypted.apiKey':
'Please enter your API key here. This can be obtained from the Summary tab in Your Account section.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'returnly.connection.http.unencrypted.version': 'Enter the API version. For example 2020-08.',
  '4castplus.connection.http.subdomain':
'The subdomain is the unique portion of the 4castplus.com address that you visit to log in to your portal.',
  '4castplus.connection.http.unencrypted.username':
'Username is your 4castplus account email.',
  '4castplus.connection.http.encrypted.password':
'Password is your 4castplus account password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'expensify.connection.http.unencrypted.partnerUserId':
'Enter your partner user ID provided by Expensify.<br>To retrieve the partner user ID:<br>1. Sign in to your <a href="https://www.expensify.com/">Expensify</a> account.<br>2. Navigate to <a href="https://www.expensify.com/tools/integrations/">Integration server access</a>.<br>3. Copy the <b>Partner user ID</b>.',
  'expensify.connection.http.encrypted.partnerUserSecret':
'Enter your partner user secret provided by Expensify.<br>To retrieve the partner user secret:<br>1. Sign in to your <a href="https://www.expensify.com/">Expensify</a> account.<br>2. Navigate to <a href="https://www.expensify.com/tools/integrations/">Integration server access</a>.<br>3. Copy the <b>Partner user secret</b>.',
  'klaviyo.connection.http.encrypted.apiKey':
'Please enter your API key here. This can be obtained from the Settings section and API Keys subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zohodesk.connection.http.unencrypted.organizationId':
'Please enter your organization id here. This can be obtained by using the Get All Organizations API. In Zoho Desk, each business is categorized as an organization. All APIs except the ones directly related to organizations must include the organization ID in the header.',
  'tophatter.connection.http.auth.token.token':
'Please enter your token here. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zohocrm.connection.http.zohoSubdomain': 'Please enter the Domain. Input ".com" to connect to US data-center. Input ".in" to connect to India data-center. Input ".com.cn" to connect to China data-center. Input ".eu" to connect to Europe data-center.',
  'tsheets.connection.http.tsheetsSubdomain':
'Please enter your subdomain here which can be obtained from the base url of your Tsheets account.',
  'squareup.connection.http.auth.type': 'Please select Authentication Type.',
  'squareup.connection.http.auth.token.token':
'Enter your access token for Square here.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'squareup.connection.accountType': 'Select the Square account environment type you are connecting to, either <b>Production</b> or <b>Sandbox</b>.',
  'squareup.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security. For more information, see <a href=https://developer.squareup.com/docs/devtools/sandbox/overview#create-a-sandbox-test-account/>Square Sandbox</a>.',
  'connection.http.encrypted.serverToken':
'Please enter your Server Token here. Used for requests that require server level privileges. This token can be found on the Credentials tab under your Postmark server.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Server token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.encrypted.accountToken':
'Please enter your Account Token here. Used for requests that require account level privileges. This token is only accessible by the account owner, and can be found on the API tokens tab of your Postmark account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Account token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zendesk.connection.http.auth.type': 'Please select Authentication Type.',
  'zendesk.connection.http.zendeskSubdomain':
'Please enter your team name here which you configured while signing up for a new Zendesk account.',
  'zendesk.connection.http.apiToken':
'API tokens are managed in the Support admin interface at Admin > Channels > API',
  'connection.http.deskSubdomain':
"Enter your Desk subdomain. For example, in https://mycompany.desk.com 'mycompany' is the subdomain.",
  'desk.connection.http.auth.basic.username':
'The username of your desk account',
  'desk.connection.http.auth.basic.password':
'The password of your desk account',
  'connection.http.activecampaignSubdomain':
'Please enter your account subdomain here.',
  'activecampaign.connection.http.auth.token.token':
'Please enter your API key here. This can be obtained from the Settings section and Developer subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'drift.connection.http.auth.token.token':
'Please enter your access token here. This token is automatically generated when you installed the app to your team. You can use this to authenticate your app.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your accesstoken safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.authorizeNet.accType':
'Please select your account type here. Select Sandbox if your API Endpoint starts with https://apitest.authorize.net. Select Production if your API Endpoint starts with https://api.authorize.net.',
  'connection.http.encrypted.apiLoginID':
'Merchant’s unique API Login ID. The API Login ID is provided in the Merchant Interface and must be stored securely. The API Login ID and Transaction Key together provide the merchant authentication required for access to the payment gateway.',
  'connection.http.encrypted.transactionKey':
'Merchant’s unique Transaction Key. The merchant Transaction Key is provided in the Merchant Interface and must be stored securely. The API Login ID and Transaction Key together provide the merchant authentication required for access to the payment gateway.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Transaction key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.recurlySubdomain':
'Please enter your subdomain here which you configured while activating your new Recurly account.',
  'recurly.connection.http.auth.basic.username':
'Please enter your API key here. You can go to Integrations >> API Credentials to find it.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'recurly.connection.http.unencrypted.version': 'The API versions determines which API your connection will use.<br><b>Note:</b>The v2 APIs are going to be deprecated; use the v3 instead.',
  'cartrover.connection.http.auth.basic.username':
'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
  'cartrover.connection.http.auth.basic.password':
'Please enter your API key here. Navigate to Merchant view on left hand side and click on API keys section to find API Key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'amazonmws.connection.http.unencrypted.sellerId': 'Specify the account ID for the Amazon seller account you are integrating with. Amazon’s UI calls this the Merchant token, but their API response calls it the Seller ID, which Amazon calls the Merchant token . You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters. If you don’t know this value, you can find it in Amazon Seller Central > Settings > Account info.',
  'amazonmws.connection.http.unencrypted.mwsAuthToken':
'The MWS authorization token.',
  'amazonmws.connection.http.unencrypted.marketplaceId': 'Please specify the Amazon MWS "MarketplaceId" for this connection. This value is required for specific Amazon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS "MarketplaceId" selected, else your Amazon MWS calls will fail.',
  'amazonmws.connection.http.unencrypted.marketplaceRegion':
'Please specify the Amazon MWS Region for this connection. Please note that you must be registered to sell in the Amazon MWS Region selected, else your Amazon MWS calls will fail.',
  'amazonmws.connection.http._iClientId': `Integrator IO uses Celigo’s Developer keys to connect to Amazon. You'll need to give Celigo permission to access your Amazon account. For help with authorization, refer to (<a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360035639851-Enable-Developer-Access-for-Celigo-in-Amazon-Seller-Central-Registration-">Developer Access</a>).<br>If you want to use your own developer keys instead of Celigo, add the iClient which lets you configure your developer and secret keys for your marketplace region.`,
  'confluencecloud.connection.http.unencrypted.instanceURL': 'Enter your Confluence Cloud instance URL. If your account is located at https://demo.atlassian.net/wiki/home, enter <b>demo.atlassian.net</b>.',
  'confluencecloud.connection.http.auth.basic.username': 'The username of your Confluence Cloud account.',
  'confluencecloud.connection.http.auth.basic.password': 'Enter the API Token of your Confluence Cloud account.<br><b>Steps to get the API Token:</b><br>1.Sign in to your Confluence Cloud account.<br>2. Navigate to <b>Profile</b> > <b>Manage your account</b> > <b>Security</b> > <b>API Token</b> > <b>Create or Manage API tokens</b>.<br>3. Click “Create API token”, to generate a new token. Make sure you copy your new API token. You won’t be able to see this token again.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'autopilot.connection.http.auth.token.token':
    'Please enter your API key here. To obtain an API key for your Autopilot account, follow the steps below: <br>1. Log in to your Autopilot account.<br> 2. Go to <b>Settings</b>.<br>3. Select <b>Autopilot API</b>.<br>4. Click <b>Generate</b>.<br>5. Copy the <b>API key</b>.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'ebay-xml.connection.environment': 'Select either Production or Sandbox.',
  'connection.http.unencrypted.apiSiteId':
'After you have specified the API Site ID, click Save & Authorize that opens up the eBay window where you can enter email/username and password to establish the connection with eBay.',
  '3dcart.connection.http.threedcartSecureUrl': "3dcart merchant's Secure URL.",
  '3dcart.connection.http.encrypted.PrivateKey':
"Your application's private key. This can be obtained from the Settings section and Private Key subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Private key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  '3dcart.connection.http.auth.token.token': "The 3dcart merchant's token.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'snapfulfil.connection.http.subdomain':
"Enter your Snapfulfil subdomain. For example, in https://syndemo-eapi.snapfulfil.net/ 'syndemo-eapi' is the subdomain.",
  'snapfulfil.connection.http.auth.basic.username':
"Please enter your snapfulfil account's username",
  'snapfulfil.connection.http.auth.basic.password':
"Please enter your snapfulfil account's password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'anaplan.connection.http.auth.basic.username':
'The username of your Anaplan account.',
  'anaplan.connection.http.auth.basic.password':
'The password of your Anaplan account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'anaplan.connection.http.auth.type': 'Please select Authentication type.',
  'anaplan.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Anaplan. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'namely.connection.http.namelyCompanyName':
'Your subdomain. For example, https://mysubdomain.namely.com',
  'namely.connection.http.auth.token.token':
'The personal access token of your account on namely. This can be obtained from the Settings section and Personal Access Token subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your personal access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'newegg.connection.accountType':
"Select 'Newegg Business' if your account is created on https://www.neweggbusiness.com.Select 'Newegg' if your account is created on https://www.newegg.com.",
  'newegg.connection.http.encrypted.apiKey':
'Please enter the unique API Key which Newegg Marketplace integration team assigned to you.This can be obtained from the Settings section and API Key subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'newegg.connection.http.encrypted.apiSecret':
'Please enter the unique Secret Key which Newegg Marketplace integration team assigned to you.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'newegg.connection.http.unencrypted.sellerId':
'Get Seller ID from the seller/Newegg that authorized the Newegg Marketplace API Services access to you, for each seller you are integrating for.',
  'asana.connection.http.auth.token.token':
'Enter your personal access token. <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Personal access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'slack.connection.http.auth.type': 'Select the authentication type, either <a href="https://docs.celigo.com/hc/en-us/articles/360041818592-Set-up-an-OAuth-2-0-connection-to-Slack"><b>OAuth 2.0</b></a> or <a href="https://docs.celigo.com/hc/en-us/articles/360038550732-Set-up-a-token-connection-to-Slack"><b>Token</b></a>.',
  'slack.connection.http.unencrypted.userScopes': 'User scopes are permissions that allow you to work directly on behalf of your workspace members. For more information on user scopes, see <a href="https://api.slack.com/authentication/token-types#user"><b>User tokens</b></a>.',
  'slack.connection.http.auth.oauth.scope': 'Scopes are permissions that the Slack API defines to limit the access to your account. Select the relevant scopes from the Scopes editor. For more information on each scope, see the Slack API <a href="https://api.slack.com/scopes?filter=bot"><b>documentation</b></a>.',
  'slack.connection.http.auth.token.token': 'Enter your token provided by Slack.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.<br> To retrieve the token:<br>1. Sign in to your <a href="https://api.slack.com/apps"><b>Slack</b></a> account.<br>2. Click <b>Your apps</b>.<br>3. Select the required app and navigate to <b>App-level tokens</b>.<br>4. Click <b>Generate token</b> and <b>scopes</b>.<br>5. Provide the <b>Token name</b>, add <b>Scopes</b>, and click <b>Generate</b>.<br>6. Copy the <b>Token</b>.',
  'slack.import.resource': 'Choose the API resource to send the records to Slack, such as <b>chat</b>, <b>groups</b>, or <b>team</b>. The methods below will change according to the resource you apply.',
  'slack.import.operation': 'Choose the Slack API method for the selected resource. For example, if you’re posting a field to a specific channel, select <b>chat</b> for the resource and <b>chat.postMessage</b> for the method.',
  'bigcommerce.connection.http.auth.type': 'Please select Authentication Type.',
  'bigcommerce.connection.http.auth.basic.username':
'Client ID will be the Username.',
  'bigcommerce.connection.http.auth.basic.password':
'Access Token will be the Password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bigcommerce.connection.http.auth.token.token':
'This Access Token works in tandem with the Client ID.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bigcommerce.connection.http.unencrypted.clientId':
'This Client ID works together with the Access Token to grant authorization.',
  'connection.storeHash':
'The BigCommerce store hash is a unique identifier for your store comprised of a short sequence of lower-case letters and numbers. It can be found in the URLs assigned to your store by BigCommerce. The base API path will look something like this: https://api.bigcommerce.com/stores/123456/, where the store hash is 123456.',
  'certify.connection.http.encrypted.apiKey':
'The API Key of your Certify account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'certify.connection.http.encrypted.apiSecret':
'The API Secret of your Certify account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.chargifySubdomain':
'The subdomain of your chargify account. For example, https://mysubdomain.chargify.com.',
  'chargify.connection.http.encrypted.apiKey':
'The API key of your Chargify account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'docusign.connection.environment':
'Select either Production or Demo and then click Save & Authorize that opens up the DocuSign window where you can enter your DocuSign account email ID and password to establish the connection.',
  'ebay.connection.http.unencrypted.apiType': 'Select your API type here. <br>1. Select <b>Finance API</b> if the requirement is for Finance API. <br>2. Select <b>Other API</b> for all other APIs like, Account API, Compliance API, Analytics API, Inventory API, Fulfillment API, Metadata API.',
  'ebay.connection.accountType':
'Select the eBay account environment type you are connecting to, either <b>Production</b> or <b>Sandbox</b>.',
  'jet.connection.http.refreshTokenBody.user':
'API User Key available from Jet under API Section-> Get API Keys',
  'jet.connection.http.encrypted.password':
'Secret Key available from Jet under API Section-> Get API Keys<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'jira.connection.http.baseURI':
'Enter the Base URI for Jira Cloud platform. The base URI for Jira Cloud platform is <b>https://your-domain.atlassian.net</b>. Replace <b>your-domain</b> with the base URL for your Jira Cloud platform',
  'jira.connection.http.auth.basic.username':
'The username of your JIRA account.',
  'jira.connection.http.auth.basic.password':
'To create an API token for your Atlassian account, log in to your Atlassian account and navigate to <b>Profile</b> > <b>Manage your account</b> > <b>Security</b>.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'jobvite.connection.environment':
'Select either Production or Sandbox based on your requirement.',
  'jobvite.connection.http.unencrypted.companyId':
'The company ID of your Jobvite account.',
  'jobvite.connection.http.unencrypted.api':
'The API Key of your Jobvite account.',
  'jobvite.connection.http.encrypted.secret':
'The Secret Key of your Jobvite account. This can be obtained from the Settings section and user secret subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'liquidplanner.connection.http.auth.type':
'Please select Authentication Type.',
  'liquidplanner.connection.http.auth.basic.username':
'Enter Username of your registered LiquidPlanner account.',
  'liquidplanner.connection.http.auth.basic.password':
'Enter Password of your registered LiquidPlanner account. The Password is created when the account is created.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'liquidplanner.connection.http.auth.token.token':
'The API token of your LiquidPlanner account when using the Token authentication.',
  'magento.connection.http.baseURI':
'Enter the Base URI for Magento 2. You can find this URL in the address bar when you sign in to your account. For example, if the URL is <b> http://123.12.12.1/xyz/admin</b>, then enter <b> http://123.12.12.1/xyz/rest</b> <br> Note: In the URL, you have to replace admin with rest while providing the Base URI.',
  'magento.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Magento 2. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.mailchimpDataCenter':
'The Data Center name provided by Mailchimp. Click Save & Authorize to open up the Mailchimp login screen where you can enter your username and password to establish the connection with your Mailchimp account.',
  'connection.instanceName':
'The URL of your instance with ServiceNow. For example, https://mycompany.service-now.com.',
  'servicenow.connection.http.auth.basic.username':
'The username of your ServiceNow account.',
  'servicenow.connection.http.auth.basic.password':
'The password of your ServiceNow account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'servicenow.connection.http.auth.type': 'Please select Authentication type.',
  'servicenow.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><br><b>Steps to get the client ID and client secret:<br></b>1. Sign in to your ServiceNow instance.<br>2. Activate the OAuth 2.0 plugin.<br>3. Set the system property <b>com.snc.platform.security.oauth.is.active</b> to true.<br>4. Navigate to <b>System OAuth</b> > <b>Application Registry</b>.<br>5. Click <b>New</b> and then click <b>Create an OAuth API endpoint for external clients</b>.<br>6. Record the <b>client_id</b> and <b>client_secret</b> values from the previous step.',
  'shipstation.connection.http.auth.basic.username':
'The API Key of your ShipStation account.',
  'shipstation.connection.http.auth.basic.password':
'The API Secret of your ShipStation account. This can be obtained from the Settings section and API secret subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'shopify.connection.http.auth.type': 'Integrator.io supports the following authentication types: Basic: Select Basic if your service implements the HTTP basic authentication strategy. This authentication method adds a Base64 encoded username and password values in the "authentication" HTTP request header.Cookie: Select Cookie if your service relies on session-based authentication. Session based authentication is typically implemented by including a unique cookie into the HTTP request header. By selecting this option, the platform will automatically create and insert this cookie into every HTTP request it sends to your application.Custom: Select Custom for all other types. If you select the Custom authentication method, integrator.io will not perform any special authentication. It is up to the user to configure the HTTP request fields (method, relativeUri, headers, and body) of the import and export models to include {{placeholders}} for any authentication related values. These values can be stored in Encrypted and Unencrypted fields of this connection.Token: Select Token if your service relies on token-based authentication. The token may exist in the header, URL, or body of the HTTP request. This method also supports refreshing tokens if the service being called supports it. OAuth 2.0: Select this value if your application supports the OAuth 2.0 authentication.',
  'shopify.connection.http.storeURL': 'Enter the unique portion of your Shopify store’s URL. For example, if your Shopify store URL is https://demo-store.myshopify.com, then provide <i>demo-store</i> for the store URL.',
  'shopify.connection.http.unencrypted.version':
'Select your Shopify account version, such as 2020-10. For more information, see <a href="https://shopify.dev/concepts/about-apis/versioning">Shopify API Versioning</a>.',
  'shopify.connection.http.auth.basic.username': 'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the API key can be found next to the "Authentication" section.',
  'shopify.connection.http.auth.basic.password': 'Login to your Shopify store and navigate to "Apps" section. Click on the respective private app and the password can be found next to the "Authentication" section.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'shopify.connection.http.auth.token.token': 'Enter the access token created in the Shopify custom app. For more information, see <a href="https://help.shopify.com/en/manual/apps/custom-apps?shpxid=5ef7b108-7D90-4BAE-ABAB-3CA2FF5EC05E">Shopify Custom app</a>.',
  'concurinvoice.connection.http.unencrypted.username': 'Please enter the value of <b>id</b> which appears in the redirected popup page URL after signin to integrator.io.',
  'concurinvoice.connection.http.encrypted.password': 'Please enter the value of <b>requestToken</b> which appears in the redirected popup page URL after signin to integrator.io.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'concurinvoice.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Concur Invoice. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'concurexpense.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Concur Expense. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'fulfilment.connection.http.unencrypted.clientId': 'Please enter Client ID of your Fulfillment.com account. <br> Note: To obtain an OAuth Client ID contact your account executive.',
  'fulfilment.connection.http.encrypted.clientSecret': 'Please enter Client Secret of your Fulfillment.com account. <br>Note: To obtain an OAuth Client Secret contact your account executive.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'fulfilment.connection.http.unencrypted.username': 'Enter the username of your Fulfillment.com account.',
  'fulfilment.connection.http.encrypted.password': 'Enter the password of your Fulfillment.com account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'fulfilment.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Fulfillment.com. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'stripe.connection.http.auth.token.token':
'The secret key of your Stripe account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'twilio.connection.http.auth.basic.username': 'Enter your account SID provided by Twilio. <br />To retrieve the account SID:<ul><li>Sign into your <a href="https://www.twilio.com/" target="_blank">Twilio</a> account.</li><li>Navigate to the <b>Console Dashboard</b>.</li><li>From <b>Project info</b>, copy the <b>Account SID</b>.</li></ul>',
  'twilio.connection.http.auth.basic.password': 'Enter your auth token provided by Twilio. <br />To retrieve the auth token:<ul><li>Sign into your <a href="https://www.twilio.com/" target="_blank">Twilio</a> account.</li><li>Navigate to the <b>Console Dashboard</b>.</li><li>From <b>Project info</b>, click <b>Show</b>, and copy the <b>Auth token</b>.</li></ul>Multiple layers of protection, including AES 256 encryption, are in place to keep your auth token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'woocommerce.connection.http.baseURI': 'Enter the base URI of your WooCommerce account. For example, if your endpoint is at https://shopName.com/wp-json/wc/v1/orders, then enter https://shopName.com.',
  'woocommerce.connection.http.auth.basic.username':
'The consumer key of your WooCommerce account.',
  'woocommerce.connection.http.auth.basic.password':
'The consumer secret of your WooCommerce account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'shipwire.connection.environment':
'Please select your environment here. Select Sandbox if the account is created on https://beta.shipwire.com. Select Production if the account is created on https://www.shipwire.com.',
  'shipwire.connection.http.auth.basic.username':
'The username of your Shipwire account.',
  'shipwire.connection.http.auth.basic.password':
'The password of your Shipwire account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zuora.connection.http.unencrypted.apiAccessKeyId':
'Please enter Username of your Zuora account.',
  'zuora.connection.http.encrypted.apiSecretAccessKey':
'Please enter Password of your Zuora account. This can be obtained from the Settings section and password subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.sandbox': 'regex zuora regex The Zuora account type.',
  'atera.connection.http.encrypted.apiKey':
'Please enter your API key here. This can be obtained by Navigating to Admin >> API from the left hand panel.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'hubspot.connection.http.auth.type': 'Please select Authentication Type',
  'hubspot.connection.http.auth.token.token':
'Enter the access token provided to you by HubSpot.<br><b>Steps to retrieve the access token:</b><br>1. Sign in to your HubSpot account.<br>2. Navigate to <b>Settings > Integrations > Private apps</b>.<br>3. Click your private app and copy your access token. (To create an access token, click <b>Create app</b>).<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'insightly.connection.http.auth.basic.username':
'The API key of your Insightly account. This can be obtained from the Settings section and API Keys subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.freshdeskSubdomain':
"Enter your Freshdesk subdomain. For example, in https://mycompany.freshdesk.com 'mycompany' is the subdomain.",
  'freshdesk.connection.http.auth.basic.username':
'Enter the API key of your Freshdesk account.<br><b>Steps to get the API key:</b><br>1. Sign into the Freshdesk account.<br>2. From the account avatar at the top right, select <b>Profile settings</b>.<br>3. Copy the <b>API key</b> present in the sidebar.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'avalara.connection.accType':
'Please select your account type here. Select Production if your account URL starts with https://admin-avatax.avalara.net/. Select Sandbox if your account URL starts with https://admin-development.avalara.net/.',
  'connection.http.acceloSubdomain':
'Please enter your subdomain here which you configured in Deployment Information page while signing up for your new Accelo account.',
  'harvest.connection.http.encrypted.accountId':
'Please enter the Harvest account ID. This can be obtained from the Settings section and Account ID subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Account ID safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pulseway.connection.http.baseURI':
'Enter the base URI of your Pulseway account. If you host your own Pulseway Enterprise Server, enter https://your-server-name/api as the base URI.',
  'pulseway.connection.http.auth.basic.username': 'Enter your Pulseway account username.',
  'pulseway.connection.http.auth.basic.password': 'Enter your Pulseway account password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'shiphawk.connection.http.encrypted.apiKey':
'The API Key of your ShipHawk account. This can be obtained from the Settings section and API Key subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'newrelic.connection.http.encrypted.apiKey':
'Please enter your API key here. From the account dropdown in the New Relic UI, select Account settings > Integrations > API keys to find it.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'tableau.connection.http.myServer':
'Please enter your server name here which you configured while signing up for a new Tableau account.',
  'tableau.connection.http.auth.basic.username':
'Please enter the User Id/Email of your Tableau Account.',
  'tableau.connection.http.auth.basic.password':
'Please enter password of your Tableau Account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'tableau.connection.http.unencrypted.contentUrl':
'The content URL is the value that in the server environment is referred to as the Site ID.',
  'tableau.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Tableau. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'tableau.connection.http.unencrypted.siteId': 'Enter your Tableau site ID. The site ID value is included in the site URL before <i>#/site</i>. For example, if your site URL is <i>https://xyz/#/site/misc/projects</i>, then <i>xyz</i> is your site ID.',
  'tableau.connection.http.unencrypted.version': 'Please enter the version of the API to use, such as 3.10. For more information, see <a href="https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_versions.htm">REST API and Resource Versions</a>.',
  'tesco.connection.http.encrypted.apiKey':
'The subscription key of your Tesco account. This can be obtained from the Settings section and API Keys subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your subscription key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'fieldaware.connection.http.encrypted.apiKey':
'Please enter your API key here. This can be obtained by reaching out to FieldAware support team.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'chargebee.connection.http.auth.basic.username':
'The API Key of your Chargebee account.',
  'chargebee.connection.http.subdomain':
'Enter your Chargebee subdomain. For example, if you sign into your Chargebee account at https://celigo-xyz-test.chargebee.com, then <b>celigo-xyz-test</b> is your subdomain.',
  'taxjar.connection.http.auth.token.token':
'Please enter your token here. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pitneybowes.connection.http.sandbox':
'Please select your environment here.',
  'pitneybowes.connection.http.unencrypted.apiKey':
'Please enter API Key of your Pitney Bowes Account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pitneybowes.connection.http.encrypted.apiSecret':
'Please enter API Secret of your Pitney Bowes Account. <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'pitneybowes.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Pitney Bowes. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'mixpanel.connection.http.unencrypted.projectId': 'Enter your Mixpanel Project ID.<br><b>Steps to get the Project ID: </b><br>1. Sign in to your Mixpanel Account.<br>2. Navigate to <b>Settings</b> → <b>Project settings</b>.<br>3. Select your project (if none exists yet, create a new project).<br>4. Copy your <b>Project ID</b> from the \'Overview\' tab.',
  'mixpanel.connection.http.encrypted.projectToken': 'Enter your Mixpanel Project token.<br><b>Steps to get the Project Token: </b><br>1. Sign in to your Mixpanel Account.<br>2. Navigate to <b>Settings</b> → <b>Project settings</b>.<br>3. Select your project (if none exists yet, create a new project).<br>4. Copy your <b>Project Token</b> from the \'Overview\' tab.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'mixpanel.connection.http.auth.basic.username': 'Enter your Mixpanel username.<br><b>Steps to get the username: </b><br>1. Sign in to your Mixpanel Account.<br>2. Navigate to <b>Settings</b>  →  <b>Organizational Settings</b> and select an organization.<br>3.Select your service account(if none exists yet, create a new service account).<br>4. Copy your <b>Username</b> from the \'Service account\' tab.',
  'mixpanel.connection.http.auth.basic.password': 'Enter your Mixpanel secret.<br><b>Steps to get the secret: </b><br>1.Sign in to your Mixpanel Account.<br>2. Navigate to <b>Settings</b>  →  <b>Organizational Settings</b> and select an organization.<br>3. Create a new service account and Copy your <b>Secret</b> from the \'Service account\' tab.<br> <b>Note:</b> Make sure you save the service account\'s secret. You will never be able to access it again.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'saphana.connection.http.unencrypted.host': 'Enter the host for your SAP S/4HANA Cloud instance. For example, instance URL can be <b>https://my1234.s4hana.cloud.sap</b>. <br>This URL can also be found under the "Communication Arrangement" tab → "API-URL" field in your SAP S/4HANA Cloud instance.',
  'saphana.connection.http.auth.basic.username': 'Enter the username from the Communication Arrangement.<br> For more information, refer to <a href=https://blogs.sap.com/2017/11/09/setting-up-communication-management-in-sap-s4hana-cloud/>Setting up Communication Management in SAP S/4HANA Cloud</a>',
  'saphana.connection.http.auth.basic.password': 'Enter the password from the Communication Arrangement.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zenefits.connection.http.auth.token.token': 'Enter your Zenefits App key.<br><b>Steps to get the App key: </b><br>1.Log in to your Zenefits account.<br>2.On the dashboard, Navigate to <b>Company Profile</b> → <b>Custom Integrations</b>.<br>3. Unmask and copy the token. (If none exists yet, click “Add Token” and select required scopes to create a new token.)<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sapsuccessfactors.connection.http.unencrypted.baseurl': 'Enter the Base URL for your SAP SuccessFactors account.<br>If your instance is located at <b>https://pmsalesdemo8.successfactors.com</b>, then your URL would be <b>apisalesdemo8.successfactors.com</b>.<br>For more information on DCs and API Servers, refer to <a href="https://help.sap.com/viewer/d599f15995d348a1b45ba5603e2aba9b/2105/en-US/af2b8d5437494b12be88fe374eba75b6.html">List of SAP SuccessFactors API Servers</a>.',
  'sapsuccessfactors.connection.http.unencrypted.clientId': 'Enter your Client ID.<br><b>Steps to get the Client ID:</b> <br>1. Log in to your SAP SuccessFactors account. <br> 2. Navigate to your Admin Center and under tools, search for “Manage OAuth2 Client Applications”.<br>3. Register a Client Application and generate X.509 Certificate in your application or via terminal.<br>4. Click "Download" to download the certificate and the private key. (which can only be seen while registering an app)<br>5. Once registered, you can find your Client ID under the "API Key" field.',
  'sapsuccessfactors.connection.http.unencrypted.companyId': 'Enter your Company ID, which you can find under your profile dropdown in "Show Version information", when logged in.',
  'sapsuccessfactors.connection.http.unencrypted.userId': 'Enter Your SAP SuccessFactors User ID.',
  'sapsuccessfactors.connection.http.encrypted.assertion': 'Once you register an application in the <b>API center</b>, you can download the private key, using which you can generate a SAML Assertion via terminal. For more information, refer to <a href=https://launchpad.support.sap.com/#/notes/3031657>How to generate SAML assertion for SAP SuccessFactors API</a><br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your assertion safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sapsuccessfactors.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by SAP Success Factor. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'pagerdutyevents.connection.http.encrypted.routingKey': 'Enter the Routing Key. This is the 32 character Integration Key for an integration on a service or on a global ruleset.<br> <b>Steps to get the key:</b><br>1. Log in to the Pagerduty account.<br>2. From the dashboard, Navigate to <b>Integrations</b> → <b>Developer Tools</b> → <b>Developer Mode</b>.<br>3. Select an App. Under functionality, Click the manage option for Events Integration.<br>4. From the Event API endpoint, copy the Integration Key. For example, if the endpoint looks like “https://events.pagerduty.com/integration/Integartion-Key/enqueue”. Copy the value which is in place of <b>Integration-Key</b> to authenticate the connection.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'quickbase.connection.http.unencrypted.hostname': 'Enter the hostname for your Quickbase account. For example, if your account is located at https://demo.quickbase.com/, then your hostname would be <b>demo.quickbase.com</b>',
  'quickbase.connection.http.unencrypted.appId': 'Enter the App ID. <br><b>Steps to get the App ID:</b><br>1. Sign in to your Quickbase account.<br>2. Navigate to <b>My Apps</b> and select an application(If none exists yet, create a new app).<br>3. Copy the <b>App ID</b> from your address bar.',
  'quickbase.connection.http.auth.token.token': 'Enter the token of your Quickbase account.<br> <b>Steps to get the token:</b> <br>1. Sign in to your Quickbase Account.<br>2. Navigate to <b>My profile</b> > <b>My Preferences</b> > <b>Manage User Tokens</b>.<br>3. Copy your Token(If none exists yet or you want to change the token, Click <b>New token</b> and select appropriate permissions to create a new token).<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'orangehrm.connection.http.unencrypted.username': 'Enter the username of your OrangeHRM account.',
  'orangehrm.connection.http.encrypted.password': 'Enter the password of your OrangeHRM account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'orangehrm.connection.http.unencrypted.subdomain': 'Enter the subdomain of your OrangeHRM account. For example, if <b>https://mycompany.orangehrm.com</b> is the login URL, then <b>"mycompany"</b> is the subdomain.',
  'pricefx.connection.http.unencrypted.baseurl': 'Enter the Base URL for your PriceFx account. For example, if your account is located at https://test.pricefx.com/, then enter “test.pricefx.com”.<br>For more information, refer to <a href="https://pricefx.atlassian.net/wiki/spaces/KB/pages/2564915288/REST+API+Documentation#RESTAPIDocumentation-HowtoAccesstheAPI">How to Access the API</a>.',
  'pricefx.connection.http.unencrypted.partition': 'Please enter the partition of your Pricefx account.This can be found under the Administration/User Admin section of your Pricefx account.',
  'pricefx.connection.http.unencrypted.username': 'Please enter the username of your Pricefx account.',
  'pricefx.connection.http.encrypted.password': 'Please enter the password of your Pricefx account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'lexbizz.connection.http.auth.type': 'Please select Authentication Type.',
  'lexbizz.connection.instanceURI':
'Please enter URL of your instance with lexbizz. For example, https://isv.lexbizz.app/entity/Default/18.200.001, then the Instance URI would be https://isv.lexbizz.app.',
  'lexbizz.connection.http.unencrypted.endpointName':
'Please enter endpoint name of your lexbizz account.',
  'lexbizz.connection.http.unencrypted.endpointVersion':
'Please enter endpoint version of your lexbizz account.',
  'lexbizz.connection.http.unencrypted.username':
'Please enter username of your lexbizz account.',
  'lexbizz.connection.http.encrypted.password':
'Please enter password of your lexbizz account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'lexbizz.connection.http.unencrypted.company':
'Please enter company name of your lexbizz account.',
  'lexbizz.connection.http.unencrypted.locale':
'Please enter locale of your lexbizz account.',
  'braintree.connection.http.unencrypted.environment': 'Select the Braintree account environment type you are connecting to, either <b>Production</b> or <b>Sandbox</b>.',
  'braintree.connection.http.auth.basic.username': 'Enter the Public key of your Braintree account.<br> <b>Steps to get the Public Key:</b> <br>1. Sign in to your Braintree account.<br>2. Navigate to <b>My User</b> at the top right.<br>2. Click on <b>View Authorizations</b>.Copy the Public Key shown on the dashboard. (If none exists yet or you want to change the API credentials, click on <b>Generate New API Key</b> to generate a new pair.)',
  'braintree.connection.http.auth.basic.password': 'Enter the Private key of your Braintree account.<br> <b>Steps to get the Private Key:</b> <br>1. Sign in to your Braintree account.<br>2. Navigate to <b>My User</b> at the top right.<br>2. Click on <b>View Authorizations</b>.Copy the Private Key shown on the dashboard. (If none exists yet or you want to change the API credentials, click on <b>Generate New API Key</b> to generate a new pair.)<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'myobadvanced.connection.http.auth.type': 'Please select Authentication Type.',
  'myobadvanced.connection.instanceURI':
'Please enter URL of your instance with MYOB Advanced. For example, https://demo.myobadvanced.com/entity/Default/18.200.001, then the Instance URI would be demo.myobadvanced.com.',
  'myobadvanced.connection.http.unencrypted.endpointName':
'Please enter endpoint name of your MYOB Advanced account.',
  'myobadvanced.connection.http.unencrypted.endpointVersion':
'Please enter endpoint version of your MYOB Advanced account.',
  'myobadvanced.connection.http.unencrypted.username':
'Please enter username of your MYOB Advanced account.',
  'myobadvanced.connection.http.encrypted.password':
'Please enter password of your MYOB Advanced account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'myobadvanced.connection.http.unencrypted.company':
'Please enter company name of your MYOB Advanced account.',
  'myobadvanced.connection.http.unencrypted.locale':
'Please enter locale of your MYOB Advanced account.',
  'g2.connection.http.auth.token.token': 'Please enter your API Token here.<br><b>Steps to get API Token:</b> <br>Login to your G2 account, under Integrations > API Tokens, you can create and manage your Tokens.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'shippo.connection.http.encrypted.token':
'Please enter your API key here. You can find your token on the Shippo API settings page.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'acumatica.connection.http.auth.type':
'Select the authentication method, either <b>Cookie</b> or <b>OAuth 2.0</b>.<br><b>Cookie</b>: If your service relies on session-based authentication. This method includes a unique cookie in the HTTP request header. When you select this option, the platform automatically creates and inserts this cookie into every HTTP request it sends to your application.<br><b>OAuth 2.0</b>: If your application supports the OAuth2.0 authentication.',
  'acumatica.connection.instanceURI':
'Please enter URL of your instance with Acumatica provided by system administrator. For example, http://try.acumatica.com/isv/entity/Default/6.00.001.',
  'acumatica.connection.http.unencrypted.endpointName':
'Please enter endpoint name of your Acumatica account.',
  'acumatica.connection.http.unencrypted.endpointVersion':
'Please enter endpoint version of your Acumatica account.',
  'acumatica.connection.http.unencrypted.username':
'Please enter username of your Acumatica account.',
  'acumatica.connection.http.encrypted.password':
'Please enter password of your Acumatica account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'acumatica.connection.http.unencrypted.company':
'Please enter company name of your Acumatica account.',
  'zoom.connection.http.auth.type': 'Select the required authentication type, either OAuth 2.0 or JWT.',
  'zoom.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security. For more information, see <a href=https://marketplace.zoom.us/docs/guides/build/oauth-app/>Authentication document</a>.',
  'zoom.connection.http.encrypted.apiKey':
'The API Key of your zoom account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zoom.connection.http.encrypted.apiSecret':
'The API Secret of your zoom account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bronto.connection.http.unencrypted.clientId':
'Please enter Client ID of your Bronto Account.',
  'bronto.connection.http.encrypted.clientSecret':
'Please enter Client Secret of your Bronto Account. <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bronto.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Bronto. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'greenhouse.connection.http.auth.basic.username':
'Please enter your API token here. You can go to Configure >> Dev Center >> API Credential Management and from there, you can create a Harvest API key and choose which endpoints it may access.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'greenhouse.connection.http.unencrypted.userID':
'Enter the unique user ID for a Greenhouse developer account with “Can manage ALL organization’s API credentials“ permissions. You can view the ID by signing into Greenhouse, viewing the page source in the browser’s Inspector (right-click and choose Inspect), and searching for “USER_ID“ in the HTML code.',
  'connection.http.unencrypted.adminUser':
'Please check this if you are The Power BI Service Administrator. The Power BI Service Administrator role can be assigned to users who should have access to the Power BI Admin Portal without also granting them other Office 365 administrative access.',
  'mailgun.connection.http.auth.basic.password':
'Please enter your API key here. This can be obtained from the Settings section and API Keys subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'procurify.connection.http.procurifySubdomain': 'Enter your Procurify subdomain. For example, in https://celigo.procurify.com/api "celigo" is the subdomain.',
  'procurify.connection.http.unencrypted.username':
'Please enter the Username of your Procurify account.',
  'procurify.connection.http.encrypted.password': 'Please enter password of your Procurify account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'procurify.connection.http.generateClientIdandSecret': 'Please click Generate "Client Id & Secret" button to get Client ID and Client Secret of your Procurify account.',
  'procurify.connection.http.unencrypted.clientId':
'Please click "Generate client id & secret" button to get Client id of your Procurify account.',
  'procurify.connection.http.encrypted.clientSecret': 'Please click "Generate client id & secret" button to get Client secret of your Procurify account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-generate this value each time; it is stored only when the connection is saved and never displayed as text.',
  'procurify.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Procurify. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'strata.connection.http.unencrypted.applicationKey':
'Please enter application key of your Strata account',
  'strata.connection.http.encrypted.subscriptionKey':
'Please enter Ocp-Apim-Subscription-Key of your Strata account..<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'strata.connection.http.auth.token.token':
'The Access Token of your Strata account',
  'aptrinsic.connection.http.encrypted.apiKey':
'Please enter your API key here. This can be obtained from Account Settings in REST API section.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.coupaSubdomain':
'Please enter the subdomain of your account here which can be obtained from the login url.',
  'coupa.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><br> <b> Steps to get the Client ID and secret</b><br>1. Sign in to your Coupa account as an administrator.</b>.<br>2. Navigate to <b>Profile > Projects > All Setup Items > Integrations > Oauth2/OpenID Connect Clients > Create</b>.<br>3. Select <b>Grant Type</b> as <b>Client credentials</b> and input the required details for the fields <b>Name</b>,<b> Login</b>, <b>Contact First Name</b>, <b>Contact Last Name</b> and <b>Contact Email</b>.<br>4. Select the <b>Scopes</b> as per the requirement.<br>5. Click on <b>Save</b> to get the value of Client ID and secret.',
  'coupa.connection.http.auth.type': 'Please select Authentication type.',
  'coupa.connection.http.auth.token.token':
'Please enter API Key of your Coupa account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.microsoftDynamics365Subdomain':
'Please enter the unique portion of the dynamics.com address that you visit to log in to your portal. For example, if your portal is found at https://my-corp.dynamics.com, then enter <b>my-corp</b> for the subdomain.',
  'quip.connection.http.auth.token.token':
'Please enter your API token here. This can be obtained from the Settings section and API Access token subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'oandaexchangerates.connection.http.auth.token.token':
'Please enter the API Key of your OANDA account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sugarcrm.connection.sugarcrmSubdomain': 'Please enter your SugarCRM subdomain. For example, in https://jpeyoy4394.trial.sugarcrm.eu/http/v11_2/ "jpeyoy4394.trial.sugarcrm.eu" is the subdomain.',
  'sugarcrm.connection.http.unencrypted.version':
'Please enter endpoint version of your SugarCRM account.',
  'sugarcrm.connection.http.unencrypted.clientID': 'The client_id of "sugar" will automatically create an OAuth Key in the system and can be used for "password" authentication. The client_id of "support_portal" will create an OAuth Key if the portal system is enabled and will allow for portal authentication. Other client_id \'s can be created by the administrator in the OAuthKeys section in the Administration section and can be used in the future for additional grant types,if the client secret is filled in, it will be checked to validate the use of the client id.',
  'sugarcrm.connection.http.unencrypted.username': 'Enter your SugarCRM account username.',
  'sugarcrm.connection.http.encrypted.password': 'Enter your SugarCRM account password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sugarcrm.connection.http.unencrypted.platform': 'Defaults to "base" allows you to have custom meta-data per platform. If using a value other than "base", you should make sure it is registered using the Platform extension or configure an API platform in Administration panel.',
  'sugarcrm.connection.http.encrypted.clientSecret': 'Defaults to "base" allows you to have custom meta-data per platform. If using a value other than "base", you should make sure it is registered using the Platform extension or configure an API platform in Administration panel.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sugarcrm.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by SugarCRM. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'copper.connection.http.auth.token.token': 'Enter the API key of your Copper account.<br><b>Steps to get the API key:</b><br>1. Sign in to the Copper account.<br>2. Navigate to <b>Settings > Integrations > API Keys</b>.<br>3. Copy your <b>API key</b>. (If none exists yet, then create a new API key by clicking on <b>Generate API Key </b>button.)<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'copper.connection.http.unencrypted.email': 'Enter the email address that you use to login to Copper.',
  'microsoftpowerautomate.connection.http.unencrypted.subdomain': 'Enter the subdomain of your Microsoft Power Automate account.<br><br><b>Steps to get the subdomain:</b><br>1. Sign in to your Microsoft Power Automate account.<br>2. Navigate to <b>Settings</b> → <b>Power Platform admin center</b>.<br>3. Select the environment you use to build your flows.<br>4. Copy the value under the environment URL and paste it into integrator.io. For example, if your environment URL is orgbe1234.crm.dynamics.com, then enter <b>orgbe1234.crm</b>.',
  'microsoftpowerautomate.connection.http.unencrypted.tenantId': 'Enter the Tenant ID of your Azure application.<br><br><b>Steps to get the Tenant ID:</b><br>1. Sign in to your <a href=https://portal.azure.com/signin/index/>Azure portal</a>.<br>2. Under <b>Azure services</b>, click on <b>App registrations</b>.<br>3. Select the application which you will be using for Microsoft Power Automate.<br>4. In the overview tab under Essentials, you will find your <b>Directory (tenant) ID</b>.',
  'microsoftpowerautomate.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><br><b>Steps to get the client ID and client secret:<br></b>1. Sign in to your <a href=https://portal.azure.com/signin/index/>Azure portal</a>.<br>2.Under <b>Azure services</b>, click <b>App registrations</b>.<br>3. Select the application that you will be using for Microsoft Power Automate.<br>4. On the <b>Overview</b> tab under <b>Essentials</b>, locate the <b>Application (client) ID</b>.<br>5. On the <b>Certificates & secrets</b> tab, click <b>New client secret</b>.',
  'microsoftdynamics365finance.connection.http.unencrypted.subdomain': 'Enter your Microsoft Dynamics 365 Finance subdomain. <br><b>Steps to get the subdomain:</b><br>1. Sign in to the LCS portal.<br>2. Select the corresponding project.<br>3. Scroll right to the Environment pane, click on the deployed topology.<br>4. On the top right corner, under the Login drop-down, launch your instance by clicking the <b>Log on to environment</b> option.<br>5. You will find your Subdomain in the address bar.',
  'googlecontacts.connection.http.unencrypted.apiType': 'Select the API type.',
  'googlecontacts.connection.http.scopePeople': 'Scopes are named permissions that are provided when the connection is authorized. The list of supported scopes should be clearly documented in the API user guide. Connecting with a given scope allows your integration, for example, to export data or perform admin functions.',
  '15five.connection.http.auth.token.token': 'Enter the API key of your 15Five account.<br><b>Steps to get the API key:</b><br>1. Sign in to your 15Five account.<br>2. Navigate to <b>Settings > Features > Integrations</b> and enable to the right of the Public API option.<br>3. Once enabled, you will land on the <b>Company API keys</b> page.<br>3. Click the <b>Create new key</b> button, Add in a short name for your API key, and Click Save to save your name and setting.<br> <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'docebo.connection.http.baseURI': 'Enter the base URI of your Docebo account. For example, if <b>https://yoursubdomain.docebosaas.com/learn/signin</b> is the login URL, then <b>\'https://yoursubdomain.docebosaas.com\'</b> is the base URI',
  'breezyhr.connection.http.unencrypted.email': 'Enter the email of your Breezy HR account.',
  'breezyhr.connection.http.encrypted.password': 'Enter the password of your Breezy HR account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'breezyhr.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Breezy HR. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'mercadolibre.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><br><b>Steps to get the client ID and client secret:<br></b>1. Sign in to your MercadoLibre developer account.<br>2. Navigate to <b>Profile → My Apps</b>.<br>3. Click on <b>Edit</b> after selecting the app to copy <b>Client ID</b> and <b>Client Select</b>.(If none exists yet,click to <b>Create new app</b> option to create a new pair.)',
  'mercadolibre.connection.http.unencrypted.region': 'Select the region of your MercadoLibre account.',
  'bundleb2b.connection.http.unencrypted.storeHash': 'Enter the unique Store hash of your BigCommerce store. For example, if your BigCommerce store URL is https://store-a123456bc.mybigcommerce.com/, then provide <i>a123456bc</i> for the Store hash.',
  'bundleb2b.connection.http.unencrypted.email': 'Enter the email of your BundleB2B app.',
  'bundleb2b.connection.http.encrypted.password': 'Enter the password of your BundleB2B app. <br> Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bundleb2b.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by BundleB2B. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'constantcontact.connection.http.versiontype': 'Select the Contact Contact API version you are using, either <b>V2</b> or <b>V3</b>.',
  'constantcontact.connection.http._iClientId': 'Enter your client ID and client secret provided by Constant Contact.<br>To retrieve the client ID and client secret:<br>1. Navigate to the <a href= https://v3.developer.constantcontact.com/>Constant Contact</a> API developer portal.<br>2. Click <b>My applications</b>. The Constant Contact <b>Sign in</b> page appears.<br>3. Enter the username and password of your Constant Contact account.<br>4. Click Log in. The <b>My applications page</b> appears.<br><b>NOTE:</b> If you have already created an application, you can copy the Client secret of the required application. Otherwise, follow the steps below to create a Client secret.<br>5. Click <b>New application</b>.<br>6. Enter the <b>Name</b> and configure the application settings according to your business requirements.<br>7. Click <b>Save</b>. The <b>My applications</b> page appears.<br>8. Click the application, copy the <b>API key</b> (Client ID) and Click <b>Generate secret</b> and copy the Client secret.',
  'connection.http.marketoSubdomain':
"Please enter your Marketo subdomain. For example, in https://591-vse-736.mktohttp.com/http/v1/activities/types.json '591-vse-736.mktohttp.com' is the subdomain.",
  'marketo.connection.http.unencrypted.clientId':
'The Client ID will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details.',
  'marketo.connection.http.encrypted.clientSecret':
'The Client Secret will be found in the Admin > LaunchPoint menu by selecting the custom service, and clicking View Details.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'zimbra.connection.http.baseURI': 'Enter the base URI of your Zimbra account. For example, if the URL is <i>http://localhost:7070/home/john.doe/inbox.rss</i>, then <i>http://localhost:7070</i> is your base URI.',
  'zimbra.connection.http.unencrypted.userAccount': 'The user. To load an explicit user account, specify the user in one of the following formats:<ul> <li>john.doe <pre>http://localhost:7070/home/john.doe/inbox.rss </pre> </li> <li>john.doe@mydomain.com</li> <pre>http://localhost:7070/home/john.doe@mydomain.com/inbox.rss </pre> </ul>',
  'grms.connection.http.unencrypted.apiKey':
'GRMS assigned API key to a partner account. API key is given out by GRMS customer support team.',
  'grms.connection.http.encrypted.apiSecret':
'GRMS assigned API secret to a partner account. API secret is given out by GRMS customer support team.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'grms.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by GRMS. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'retailops.connection.http.encrypted.apiKey':
'Please enter API Key of your RetailOps Account.Path to get API Key(Administration > User Manager>Select your user account>User Details pane(bottom-right),when the API key appears in its separate window, this will be your only opportunity to view/copy the entire API key. Once you close the window, you will not be able to view the entire API key again (a truncated version appears under the Credentials pane to indicate that an API key was created previously). This can be obtained from the Settings section and API Keys subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'skubana.connection.http.unencrypted.subdomain': 'Enter the subdomain of your Skubana account. For example, in https://api.demo.skubana.com, \'api.demo\' is the subdomain.<br><b>Note:</b> This setting is populated automatically, according to the Environment you entered above. Modify this value only if it is configured differently for your Skubana account. For more information, see the <a href= https://documentation.skubana.com/> Skubana API reference</a>.',
  'skubana.connection.environment':
'Please select your environment here. Select Sandbox if the account is created on https://demo.skubana.com/login. Select Production if the account is created on https://app.skubana.com/login.',
  'connection.http.unencrypted.profileId':
'ID (Profile ID) issued by Merchant e-Solutions.',
  'connection.http.encrypted.profileKey':
'API password (Profile Key) assigned by Merchant e-Solutions.',
  'connection.http.encrypted.cardNumber': 'Payment card number.',
  'dunandbradstreet.connection.http.unencrypted.username':
'Please enter username of your Dun & Bradstreet account.',
  'dunandbradstreet.connection.http.encrypted.password':
'Please enter password of your Dun & Bradstreet account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'dunandbradstreet.connection.http.auth.token.token':
'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Dun & Bradstreet. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'adp.connection.accType':
'Select <b>Production</b> if your API endpoint starts with https://api.adp.com. Select <b>UAT</b> if it starts with https://uat-api.adp.com. ',
  'adp.connection.http.unencrypted.clientId':
'<a href = "https://docs.celigo.com/hc/en-us/articles/360038433932-Set-up-a-connection-to-ADP-using-SSL">Generate a CSR file</a> and send it to your ADP representative to receive the <b>Client ID</b> and client secret to enter for your connection.',
  'adp.connection.http.encrypted.clientSecret':
'<a href = "https://docs.celigo.com/hc/en-us/articles/360038433932-Set-up-a-connection-to-ADP-using-SSL">Generate a CSR file</a> and send it to your ADP representative to receive the client ID and <b>Client secret</b> to enter for your connection. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection’s secret safe. When editing this form later, you must enter this value again; it is stored only when the connection is saved and never displayed as text.',
  'adp.connection.http.clientCertificates.cert':
'<a href = "https://docs.celigo.com/hc/en-us/articles/360038433932-Set-up-a-connection-to-ADP-using-SSL">Generate a CSR file</a> and send it to your ADP representative to receive the PEM certificate file to upload to this setting.',
  'adp.connection.http.clientCertificates.key':
'<a href = "https://docs.celigo.com/hc/en-us/articles/360038433932-Set-up-a-connection-to-ADP-using-SSL">Generate a KEY file</a> and upload to this setting.',
  'adp.connection.http.clientCertificates.passphrase':
'Enter the password you have set for the PFX file, if any.',
  'faire.connection.http.accountType': 'Please select your environment here.',
  'faire.connection.http.encrypted.apiKey':
'Please Enter the access token got from Faire support. This can be obtained from the Settings section and API Access token subsection.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.Multiple layers of protection, including AES 256 encryption, are in place to keep your access token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'brex.connection.http.unencrypted.accountType': 'Please select your environment here.',
  'brex.connection.http.auth.token.token':
'Enter the API token provided by Brex.<br><b>Steps to get the API Token:</b><br>1. Sign in to <a href="https://dashboard.brex.com/">Brex account</a> as an <a href= "https://developer.brex.com/docs/roles_permissions_scopes">account admin</a>.<br>2. Go to <a href="https://dashboard.brex.com/settings/developer">Developer > Settings</a>.<br>3. Click <b><i>Create Token</i></b>.<br>4. Create a name for your token that will help you identify it. Choose what level of data access you need for your application; these are the <a href="https://developer.brex.com/docs/roles_permissions_scopes">scopes</a> your token will have.<br>5. The next screen will confirm your previous selections. Make sure it looks good, then select <b><i>Allow access</i></b>.<br>6. Your token is now created. Copy and store the token securely. You won\'t be able to see it again.<br><b>Note: </b>User tokens will expire if they are not used to make an API call for 30 days.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'ware2go.connection.http.accountType':
'Please select your environment here. Select Staging if the account is created on https://openapi.staging.ware2goproject.com/ware2go. Select Production if the account is created on https://openapi.ware2goproject.com/ware2go.',
  'ware2go.connection.http.auth.basic.username':
'Please enter your Access Token here. This can be obtained by reaching out to Ware2Go support team.',
  'ware2go.connection.http.auth.basic.password':
'Please enter your Access Secret here. This can be obtained by reaching out to Ware2Go support team.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Access secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'ware2go.connection.http.unencrypted.merchantId':
'Please enter your Merchant Id here. This can be obtained by reaching out to Ware2Go support team.',
  'ware2go.connection.http.platformversion': 'Select your Ware2Go account platform version:<br>1. Select <b>Platform 1</b> to connect using the <b>Access token</b> and <b>Access secret</b> (or) select <b>Platform2</b> to connect using a <b>Username</b> and <b>Password</b>.',
  'ware2go.connection.http.unencrypted.username': 'Please enter the username of your Ware2Go account here.',
  'ware2go.connection.http.unencrypted.password': 'Please enter the password of your Ware2Go account here.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'messagemedia.connection.http.auth.basic.username':
'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
  'messagemedia.connection.http.auth.basic.password':
'Please enter your API key here. Navigate to Merchant view on left hand side and click on API keys section to find API Key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'vend.connection.http.subdomain': 'Enter your Vend subdomain. For example, in https://soda.vendhq.com, \'soda\' is the subdomain.',
  'connection.http.apiEndpoint':
  'Please enter the API Endpoint. Under Domain Settings > Site Configuration> Base URL for Graphics we will get the Domain Name. Every store has its own unique API endpoint associated with the domain name. The format will be as follows: https://www.domain.com/mm5/',
  'connection.http.unencrypted.Store_Code':
    'Please enter the Store Code. Under store settings, we will get the store code.',
  'miva.connection.http.unencrypted.signature': 'Select the HMAC signature type.<br><b> Note:</b> Please select MIVA (no hmac present), if in the OAuth App <b>"Accept Requests Without Signature"</b> is enabled inside <b>Signature</b> section. ',
  'miva.connection.http.encrypted.privateKey': 'Enter the Private key of your Miva account.<br><b>Steps to get Private key:</b><br> 1. Sign in to the Miva account.<br>2.On the Dashboard, select <b>Settings → User Management → API Tokens</b>.<br>3. Click on the App to edit API Token.<br>4. Under section <b>Signature</b> select the <b>Require Signature with Key</b> and click on <b>Generate</b> to get a new Private Key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Private key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.xMivaAPIToken':
    'Please enter the API token of your account. The token is generated in the Miva admin under Users > API Tokens.<br><b> Note:</b> When we are generating token please follow the points mentioned <br> 1.Select the Accept Requests Without Timestamp.<br>2. Provide IP Address as 0.0.0.0/0.<br>3.Provide required permissions for groups and functions.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'target.connection.accType':
'Please select Production for a live seller account or Sandbox if you currently want to integrate with a development staging environment.',
  'target.connection.http.auth.token.token':
'Please enter the x-seller-token provided by Target.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'target.connection.http.unencrypted.x-seller-id':
'Please enter the x-seller-id provided by Target.',
  '3plcentral.connection.http.unencrypted.environment': 'Select the environment type.<br>If your account URL is https://secure-wms.com, select <b>Production</b>. If your account URL is https://box.secure-wms.com, select <b>Sandbox</b>.',
  '3plcentral.connection.http.unencrypted.tpl':
'Contact the 3PL Central Warehouse you are working with for this project and have them submit a request for REST API access to their 3PL Central Customer Success Manager.',
  '3plcentral.connection.http.unencrypted.userLoginId':
'Contact your 3PL Central Warehouse and submit a request for your User login ID or an authorization key. The authentication key will not work with transaction requests (orders, receivers, etc). For transaction requests, you must use a User login ID.',
  'sapbusinessone.connection.http.unencrypted.serverNameOrIP': 'Enter the Server name/IP. Contact your SAP Admin for further details.',
  'sapbusinessone.connection.http.unencrypted.port': 'Enter the Port number. Contact your SAP Admin for further details.',
  'sapbusinessone.connection.http.unencrypted.companyDatabase': 'Enter the Company Database. Contact your SAP Admin for further details.',
  'sapbusinessone.connection.http.unencrypted.userName': 'Enter the Username. Contact your SAP Admin for further details.',
  'sapbusinessone.connection.http.encrypted.password': 'Enter the Password. Contact your SAP Admin for further details.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'bartender.connection.http.unencrypted.printPortalBaseURL': 'Enter the Print portal Base URL for BarTender. For example, if your print portal is located at http://localhost/BarTender, enter <b>http://localhost</b>.',
  'bartender.connection.http.unencrypted.userName': 'Enter the username for your BarTender print portal.',
  'bartender.connection.http.encrypted.password': 'Enter the password for your BarTender print portal.<br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s password safe. When editing this form later, you must enter this value again; it is stored only when the connection is saved and never displayed as text.',
  'bartender.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by BarTender.<br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'zohoexpense.connection.http._iClientId': 'Save your client ID and client secret in iClient for an added layer of security.<br><b>Steps to get the client ID and client secret:</b><br>1. Sign in to your <a href= https://api-console.zoho.com>Zoho Expense API console</a>.<br>2. Click the "Add Client" and Choose Client Type as <b>Server-based Applications</b>.<br> 3. Provide all the necessary details along with the integrator.io Callback URL.<br> 4. Once your application is registered, client ID and client secret will be displayed.',
  'zohoexpense.connection.http.unencrypted.organizationId': 'Enter your Organization ID. <br><b>Steps to get the Organization ID:</b><br>1. Sign in to your Zoho Expense account.<br>2. Copy your Organization ID from the top right corner in the <b>My Organizations</b> tab.',
  'jazzhr.connection.http.auth.token.token': 'Enter your JazzHR API key. <br><b>Steps to get the API key:</b><br>1. Log in to your JazzHR account.<br> 2. On the dashboard, navigate to <b>Settings</b> → <b>Integration</b>.<br>3. Copy your API key. <br><b>Note:</b> Only Super Administrators, Recruiting Administrators, or Developers have visibility of the API Key.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'segment.connection.http.encrypted.writeKey': 'Enter the Write key for your Segment source. The write key is a unique identifier for each source. It lets Segment know which source is sending the data, and which destinations should receive that data.<br><b>Steps to get the Write key:</b><br>1. Sign in to your Segment account.<br>2. From the Dashboard navigate to <b>Sources</b>, select the respective source.<br>3. Go to <b>Settings</b> -> <b>API keys</b>.<br>4. Copy the Write key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'loopreturns.connection.http.unencrypted.version': 'The API versions determines which API your connection will use.',
  'loopreturns.connection.http.auth.token.token': `Please enter your API key here. Log into your Loop Returns Account. Go to Settings > Developers, you can generate an API key or use an existing one.
<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.`,
  'clover.connection.http.unencrypted.environment': 'Please select the environment of your Clover account.',
  'clover.connection.http.unencrypted.region': 'Please select your region.',
  'clover.connection.http.unencrypted.merchantId': 'Enter the Merchant ID for your Clover account. Use the following steps to find your Merchant ID:<br> 1. Sign in to your Clover account (or return to the <b>Businesses</b> dashboard if already signed in).<br> 2. From the <b>Setup</b> menu, select <b>Merchants</b>.<br> 3. Copy the ID shown under the merchant.',
  'inspectorio.connection.http.encrypted.apiKey':
'Please enter your API key here.Log into your Inspectorio Account-> Configuration > API keys, you can generate an API key or use an existing one.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'inspectorio.connection.enviornment':
'Please select the environment of your Inspectorio account.',
  'orderful.connection.http.unencrypted.version': 'Please enter the version of your Orderful account.',
  'orderful.connection.http.auth.token.token':
'Please enter your API key here.Log into your Orderful Account->Settings > API Credentials, you can view your API token.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'happyreturns.connection.http.auth.token.token':
'Enter the API key provided by Happy Returns.<br><b>Note: </b>Contact Happy Returns to get the API key.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'gorgias.connection.gorgiasSubdomain': 'Please enter your Gorgias subdomain. For example, in https://temp-portal.gorgias.com \'temp-portal\' is the subdomain.',
  'gorgias.connection.http.auth.basic.username':
'Please enter the Username of your Gorgias account',
  'gorgias.connection.http.auth.basic.password':
'Please enter the API key of your Gorgias account. <br><b>Steps to retrieve the API key:<br></b>1. Sign in to your Gorgias account. <br>2. Navigate to <b>Settings > REST API</b>. <br>3. Copy your <b>API key</b>. (To create a new API key, click on <b>generate button</b>).<br> Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'walmart.connection.environment':
'Please select the environment of your Walmart account here.',
  'walmart.connection.http.unencrypted.clientId':
'Please enter Client ID of your Walmart Account.',
  'walmart.connection.http.encrypted.clientSecret':
'Please enter Client Secret of your Walmart Account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Client secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'walmartcanada.connection.http.unencrypted.consumerId': 'Enter the consumer ID, which you can find in your <a href="https://developer.walmart.com/ca/">Walmart Canada account</a>.<br>1. Sign in and click <b>My Account</b> at the top right.<br>2. Choose the account type <b>Marketplace</b>, and sign in with your email address & password.<br>3. From the <b>Settings</b> menu, select <b>Consumer IDs & Private Keys</b>.<br>4. Copy the consumer ID. (If none exists yet or you want to change the API credentials, click to generate a new pair.)',
  'walmartcanada.connection.http.unencrypted.localeId': 'Select the geographic location of your Walmart Canada account.',
  'walmartcanada.connection.http.encrypted.consumerKey': 'Enter the private key, which you can find in your <a href="https://developer.walmart.com/ca/">Walmart Canada account</a>.<br>1. Sign in and click <b>My Account</b> at the top right.<br>2. Choose the account type <b>Marketplace</b>, and sign in with your email address & password.<br>3. From the <b>Settings</b> menu, select <b>Consumer IDs & Private Keys</b>.<br>4. Copy the private key. (If none exists yet or you want to change the API credentials, click to generate a new pair.).<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your consumer Key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'paylocity.connection.http.unencrypted.environment': 'Please select the environment of your Paylocity account.',
  'paylocity.connection.http.unencrypted.companyId': 'Enter the Company ID.<br><br><b>Steps to get the Company ID:</b><br> 1. Sign in to the Paylocity account.<br>2.On the Dashboard, select <b>Help</b> → <b>About/Copyright</b>.<br>3. Copy the Company ID.',
  'freshservice.connection.http.unencrypted.subdomain': 'Enter the subdomain of your Freshservice account. For example, if https://mycompany.freshservice.com is the login URL, then \'mycompany\' is the subdomain.',
  'freshservice.connection.http.auth.basic.username': 'Enter the API key of your Freshservice account.<br><b>Steps to get API key:</b><br>1. Login to your Support Portal.<br>2. Click on your profile picture on the top right corner of your portal.<br>3. Go to <b>Profile settings</b> Page.<br>4. Your API key will be available below the change password section to your right.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'logisense.connection.environment':
'Please select the environment of your LogiSense account.',
  'logisense.connection.storeURL':
'Please enter the Store URL of your LogiSense account, provided by LogiSense team.',
  'logisense.connection.http.unencrypted.version': 'Please enter your current LogiSense version.',
  'logisense.connection.http.unencrypted.username':
'Please enter the Username of your LogiSense account.',
  'logisense.connection.http.encrypted.password':
'Please enter the Password of your LogiSense account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'logisense.connection.http.encrypted.clientId':
'Please enter the Client ID provided by LogiSense team and perform any needed whitelisting with the destination/source systems.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Client ID safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'logisense.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by LogiSense. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'microsoftteams.connection.http.unencrypted.tenantId': 'Please enter the Tenant ID of your Azure application.<br><b>Please follow the steps to find the Tenant ID:</b><br>1. Login to your Azure portal.<br>2. Under Azure services, click on App registrations.<br>3. Select the application which you will be using for Microsoft Teams.<br>4. In the overview tab under Essentials, you will find your Directory (tenant) ID.',
  'prestashop.connection.storeURL': 'Please enter the URL where you log in to your back office. For example, if http://localhost/prestashop/admin12345 is your login URL, then just enter \'localhost/prestashop\'.',
  'prestashop.connection.http.encrypted.apiKey': 'Please enter the API key of your PrestaShop account.<br><b>Steps to fetch the API key</b><br>1.Login to your back office.<br>2.In the left pane, go to <b>CONFIGURE > Advanced Parameters > Webservice</b>, under Configuration, <b>Enable PrestaShop\'s webservice</b> should be set to YES.<br>3. On the same page, you’ll find an option to add a new webservice key. You can give the appropriate scopes and generate a key.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API Key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'adobesign.connection.http.unencrypted.subdomain': 'Please enter the “shard” of your Adobe Sign account.For example, in https://na3.adobesign.com \'na3\' is the subdomain.',
  'adobesign.connection.http.unencrypted.email': 'Please enter the email of API caller using the Adobe Sign account.',
  'joor.connection.environment':
'Please select the environment of your JOOR account here.',
  'joor.connection.http.encrypted.apiKey':
'Please enter the API token thats generated by the JOOR technical team and provided to approved clients to access the AIS web services.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'freshworks.connection.http.freshworksSubdomain': 'Please enter the Subdomain of your Freshworks CRM account. <br><b>Steps to fetch the subdomain:</b><br>1. Log in to your Freshworks CRM Account.<br>2. In the URL you will find the subdomain. For example:- If “https://test.myfreshworks.com/crm/marketer/mas/#/settings/domain-verify“ is the URL, then the subdomain will be <b>test</b> from “test.myfreshworks.com“.',
  'freshworks.connection.http.encrypted.apiKey': 'Please enter the API key of your Freshworks CRM account.<br><b>Steps to fetch the API key:</b><br>1. Log in to your Freshworks CRM account.<br>2. Click on your profile picture and select <b>Profile Settings</b>.<br>3. Click on the <b>API Settings</b> tab.<br>4. You can find your API key in the field <b>Your API key.</b> <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'yotpo.connection.http.unencrypted.clientId': 'Please enter the API key of your Yotpo account.<br><b>Steps to fetch the API key:</b><br>1. Log in to your Yotpo <b>Reviews & Ratings</b> Account as an administrator.<br>2. Click on the profile icon at the top right corner of the screen.<br>3.Select <b>Store Settings</b>.<br>4.You will find your Yotpo API Credentials at the bottom of the <b>General Settings</b> section.',
  'yotpo.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Yotpo. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'yotpo.connection.http.encrypted.clientSecret': 'Please enter the API secret of your Yotpo account.<br><b>Steps to fetch the API secret:</b><br>1. Log in to your Yotpo <b>Reviews & Ratings</b> Account as an administrator.<br>2. Click on the profile icon at the top right corner of the screen.<br>3.Select <b>Store Settings</b>.<br>4.You will find your Yotpo API Credentials at the bottom of the <b>General Settings</b> section.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'googleads.connection.http.encrypted.developerToken': 'Enter the Developer token of your Google Ads account. Use the following steps to retrieve the developer token:<br>1. Log in to your Manager Account. (You can apply for a token for your Manager Account directly from the Google Ads UI.)<br> 2.Navigate to <b>TOOLS > MORE TOOLS > API Center</b>. The API Center option only displays for Google Ads Manager Accounts.<br> 3.You will find your <b>Developer token</b> under <b>API Access.</b> <br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your developer token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'googleads.connection.http.unencrypted.customerId': 'Enter the Customer ID of your Google Ads account. Use the following steps to retrieve the Customer ID:<br> 1.Log in to your Google Ads account.<br> 2. Click the help icon (<b>?</b>) on the top right corner of the page. <br> 3.Your <b>Customer ID</b> displays at the bottom of the menu. <br> If you are using a client account to make API calls, enter the client customer ID in the <b>Customer ID</b> field and manager customer ID in the <b>Login customer ID</b> field.',
  'googleads.connection.http.unencrypted.loginCustomerId': 'Enter the Login customer ID of your Google Ads account. For Google Ads API calls made by a manager to a client account, you must supply the login-customer-id. This value represents the Google Ads customer ID of the manager making the API call.<br> <b>Note:</b> If you are making API calls directly to a manager account then enter the same value as <b>Customer ID</b>.',
  'googleads.connection.http.unencrypted.version': 'Please enter your current Google Ads version.',
  'looker.connection.http.unencrypted.instanceurl': 'Enter the instance URL for Looker. For example, if your instance is located at https://test-instance.cloud.looker.com, then your Instance URL would be <b>test-instance.cloud.looker.com</b>. If your URL includes port number, it should be specified as a part of the Instance URL. For example, <b>test-instance.cloud.looker.com:443</b>',
  'looker.connection.http.unencrypted.clientId': 'Enter your Client ID.<br><b> Steps to get the Client ID:</b><br> 1. Log in to your Looker account. <br>2. Navigate to <b>Admin > Users</b>. Add a new user or edit an existing user.<br>3. Under the user, you will find <b>API3 Keys</b>. Click <b>Edit Keys</b>, this will redirect to a page where you can view <b>API3 Keys.</b>(If none exists yet or you want to create new API credentials, click <b>New API3 Key</b> to generate a new pair.)',
  'looker.connection.http.encrypted.clientSecret': 'Enter your Client secret.<br> <b>Steps to get the Client secret:</b><br> 1. Log in to your Looker account. <br>2. Navigate to <b>Admin > Users</b>. Add a new user or edit an existing user.<br>3. Under the user, you will find <b>API3 Keys</b>. Click <b>Edit Keys</b>, this will redirect to a page where you can view <b>API3 Keys</b>.(If none exists yet or you want to create new API credentials, click <b>New API3 Key</b> to generate a new pair.)<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'looker.connection.http.auth.token.token': 'Click the <b>Generate token</b> button to have integrator.io fill in an encrypted access token or enter the token generated for you by Looker. <br>Multiple layers of protection are in place, including AES 256 encryption, to keep your connection\'s token safe. When editing this form later, you must generate this value again; it is stored only when the connection is saved and never displayed as text.',
  'pandadoc.connection.http.auth.type': 'Please select Authentication Type.',
  'pandadoc.connection.http.auth.token.token': 'Enter the API key of your PandaDoc account.<br><b> Steps to get the API key:</b> <br>1. Sign in to the PandaDoc account. <br> 2. Navigate to <b>Profile settings -> API & Integrations -> API</b> and generate the API key.<br><br>Multiple layers of protection, including AES 256 encryption, are in place to keep your key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sapbydesign.connection.http.unencrypted.tenantHostname': 'Enter the Tenant hostname for your SAP Business ByDesign instance. If your instance is located at <b>https://my1234.sapbydesign.com</b>, then enter <b>my1234.sapbydesign.com</b>.',
  'sapbydesign.connection.http.unencrypted.username': 'Please enter the Username of your SAP ByDesign account.',
  'sapbydesign.connection.http.encrypted.password': 'Please enter the Password of your SAP ByDesign account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'sapbydesign.connection.http.unencrypted.apiType': 'Select the API mode.<br><b>SOAP API</b>: Choose this for complex data imports. The SOAP web service API enables you to create and update products with a single call.<br><b>OData</b>: Choose this for SAP ByDesign business objects. The OData API is for user-centric applications like mobile apps and customized user interfaces that rely on ByDesign business objects on the backend.',
  'microsoftbusinesscentral.connection.http.unencrypted.apiType': 'Select the web service you want to use to build integrations in Microsoft Dynamics 365 Business Central. You can also <a href="https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/webservices/web-services">learn more about Web services</a>.',
  'microsoftbuisnesscentral.connection.http.unencrypted.environmentName': 'Enter your Microsoft Dynamics 365 Business Central\'s environment.<br>Steps to get the environment name:<br> 1. Log in to the Business Central Admin Center.<br>  2. Click on Environment available at the left side.<br>  3. Copy the Environment Name available on the list.',
  'precisely.http._iClientId': 'Save your API key and secret of Precisely account in iClient for an added layer of security.',
  'microsoftdynamics365financeandoperation.connection.http.subdomain': 'Please enter the subdomain of your Microsoft Finance and Operations account. <br><b>Steps to get the organization\'s root URL: </b><br>1.Login to LCS portal<br>2.Open the project Associated to Finance and Operations.<br>3.Scroll to the right and in the Environment pane, click on the deployed topology.<br>4.Click on the Login at top right corner and click on Log on to environment after that a separate tab will open in browser and copy the URL after https:// upto .dynamics.com from search.',
  'shipengine.connection.http.auth.token.token': `Please enter the API key of your ShipEngine account.<br><b>Note:</b>In your ShipEngine dashboard, if you are using a Sandbox account you'll find your API keys in the 'Sandbox' page,
if you're using a production account, you'll find your API keys under the 'API Management' page.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.`,
  'jiraserver.connection.http.baseURI':
'Please enter the base URI for Jira Server. For example, http://localhost:8080/rest/api/2/customFields, if this is your endpoint URL. The Base URL would be http://localhost:8080/.',
  'jiraserver.connection.http.auth.basic.username':
'Please enter the username of your Jira Server account.',
  'jiraserver.connection.http.auth.basic.password':
'Please enter the password of your Jira Server account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'gainsight.connection.http.gainsightInstanceURL': 'Please enter the instance URI shown in your Gainsight CS account.For example, if https://test-domain.gainsightcloud.com/v1/ui/home is the URL after logging in,then the instance URI would be \'test-domain.gainsightcloud\'.',
  'gainsight.connection.http.auth.token.token': 'Please enter the API key of Gainsight account here.<br><b>Steps to get API key:</b><br>1. Login to your Gainsight CS account<br>2. Navigate to Administration > Integrations > Connectors 2.0 > Connectors tab > Click on Gainsight API <br> 3.Click the Create Connection button and click GENERATE ACCESS KEY.<br><b> Note:</b>You can create a connection or edit the existing connection to retrieve the Access Key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'dotdigital.connection.http.auth.basic.username': 'Please enter the username from API user credentials of your Dotdigital account.To know how to create the API user, please follow the link <a href=https://developer.dotdigital.com/docs/getting-started-with-the-api#setting-up-your-api-user>https://developer.dotdigital.com/docs/getting-started-with-the-api#setting-up-your-api-user</a>.',
  'dotdigital.connection.http.auth.basic.password': 'Please enter the password from API user credentials of your Dotdigital account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'dotdigital.connection.http.region': 'Please select your region.',
  'channelape.connection.http.auth.token.token': 'To generate a new private key visit ChannelApe and create an API Account for your business. If you want to access the API\'s via a user account, you can use the Users - Create session request, and use that Session ID as the X-Channel-Ape-Authorization-Token.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your private key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'checkout.connection.environment': 'Please select the environment of your Checkout.com account.',
  'checkout.connection.http.auth.token.token': 'Please enter the API key of Checkout.com account here.Login to your Sandbox/Live account, under Settings > Channels, you will find your API keys.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your API key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'walmartmexico.connection.environment':
'Please select the environment of your Walmart Mexico account here.',
  'walmartmexico.connection.http.unencrypted.clientId': 'Enter the client ID, which you can find at the Walmart Mexico <a href="https://developer.walmart.com/mx/">Developer portal</a>: <br> 1. Click <b>My Account</b> at the top right.<br> 2. Choose the account type <b>Marketplace</b>, and sign in with your email address & password. <br> 3. Copy the client ID shown on the dashboard. (If none exists yet or you want to change the API credentials, click to generate a new pair.)',
  'walmartmexico.connection.http.encrypted.clientSecret': 'Enter the client secret, which you can find at the Walmart Mexico <a href="https://developer.walmart.com/mx/">Developer portal</a>: <br> 1. Click <b>My Account</b> at the top right.<br> 2. Choose the account type <b>Marketplace</b>, and sign in with your email address & password. <br> 3. Copy the client secret shown on the dashboard. (If none exists yet or you want to change the API credentials, click to generate a new pair.)<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your client secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'http.import.http.requestTypeCreate':
'Please specify whether the record is being created or updated using this field.',
  'http.import.http.requestTypeUpdate':
'Please specify whether the record is being created or updated using this field.',
  'agent.name':
'Give your agent a name so that users in your integrator.io account know where it is installed and what it has access to.',
  'agent.description':
'Provide an optional description, or any information you like that will help you keep track of this agent. This information is displayed when viewing/editing an agent or in the Agent List page.',
  'api.name': 'Name your API so that you can easily reference it from other parts of the application.',
  'api.description': 'Describe your API in more detail here so that other users can understand the problem you are solving, and also how your API works. Be sure to highlight any nuances that a user making changes in the future might want to know.',
  'api.function': 'Enter the name of the function that will get called when a request is sent to this <a href="https://docs.celigo.com/hc/en-us/articles/360047267771-What-is-My-API-" target="_blank">My API</a>. Although your script may contain additional functions, only the single entry point specified here is initially called and receives any data passed in the HTTP header and body. <br />The name of the function in the default <b>Handle request</b> stub is &#60;tt&#62;handleRequest&#60;/tt&#62;. If you used a different name, you can click the <b>Edit script</b> button to open it and copy the exact name (without parentheses).',
  'api.scripts': 'Select a <a href="https://docs.celigo.com/hc/en-us/articles/360047267771-What-is-My-API-" target="_blank">My API</a> script from the list that you’ve already written, or click + to start writing your own code. The easiest way to start from scratch is to select the <b>Handle request</b> function stub, which fully documents the options passed to the function and the expected response object.',
  'api.shipworks.username': 'Enter the username that was entered during the ShipWorks store setup.',
  'api.shipworks.password': 'Enter the password that was entered during the ShipWorks store setup.',
  'asynchelper._id': 'System generated unique identifier for this asynchelper.',
  'asynchelper.name':
'Enter a name for the Async Helper that you are creating.',
  'asynchelper.http.submit.sameAsStatus':
'Select this checkbox if the Resource Path specified in the Status Export is same as that of the Submit Resource Path.',
  'asynchelper.http.submit.resourcePath':
'This field appears if Same As Status Export checkbox is disabled. Specify the path for obtaining other feed info resources. This data is passed to Status and Result exports for evaluating handlebars.\n For example, <i>/SubmitFeedResponse/SubmitFeedResult/FeedSubmissionInfo</i>.',
  'asynchelper.http.submit.transform':
`This field is optional. You can use it when the response is other JSON. For example, if your target application is Amazon, the response data received will be in XML format that you can convert to JSON using Transform Rules for Submit Response. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/115002669511-Transformation-Rules-Guide">Transform Rules Guide</a>.`,
  'asynchelper.http.status._exportId':
`Click the <b>+</b> icon to configure the status export. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360004872932-Async-Helper#h_73655244751529322925787">Configure Status Export</a>.`,
  'asynchelper.http.status.initialWaitTime':
'The wait time in minutes for IO before sending the first poll to the target application to check the feed status. For example, if you specify 2, IO will wait for two minutes before making the first poll to check the current feed status.',
  'asynchelper.http.status.pollWaitTime':
'The time interval between two successive polls in minutes. For example, if you specify 2 in this field, IO will poll the target application every two minutes for checking the feed status.',
  'asynchelper.http.status.statusPath':
'The XML/JSON path where the <b>In Progress Values</b> and <b>Done Values</b> appear in the response received. This path is applied to resources extracted from the <b>Status Export</b>. For example, <i>FeedProcessingStatus</i>.',
  'asynchelper.http.status.inProgressValues':
'The in-progress values that you receive as a response from the target application while your feed is being processed. For example, if you have sent a feed to Amazon, your in-progress values will be the following:<i>SUBMIT</i>, <i>IN PROGRESS</i>. Comma separated values can be used to for defining all the in-progress value and it is case sensitive',
  'asynchelper.http.status.doneValues':
'The value(s) that you receive as a response from the target application after the feed processing is complete. For example, if you have sent a feed to Amazon, your <b>Done Values</b> is <i>DONE</i>.',
  'asynchelper.http.result._exportId':
`Click the <b>+</b> icon to configure the result export. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360004872932-Async-Helper#h_15255507731529322901895">Configure Result Export.</a>`,
  'connection._id':
'System generated primary unique identifier for your connection.  For API users, this value should be used for GET, PUT and DELETE requests.',
  'connection._agentId':
"To connect to an on-premise application integrator.io requires that an 'Agent' be installed on a computer that has network access to the on-premise application. Once the agent has been installed you can simply reference the agent here, and then integrating your on-premise applications is no different than integrating any other applications using integrator.io. Please note also that a single 'Agent' can be used by multiple different connections.",
  'connection.name':
'Enter a unique name for your connection so that you can easily reference it from other parts of the application.',
  'connection.application': 'The application you are connecting to.',
  'connection.type':
"This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors. If you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'connection.lastModified':
'System generated date/time to track the last time this resource was modified.',
  'connection.offline':
"This flag identifies if your connection is currently offline.  When a connection is offline then no exports, imports, flows, etc... will be run, and all data currently in the queues (i.e. in progress) will also pause.  Connections are marked offline automatically anytime there is a failure to connect.  Connections can be brought back online manually by re-entering credentials and clicking the 'Save' button (assuming there are no new errors).  There is also an automated batch process that runs multiple times per hour to continually ping/test all offline connections for you, and bring those connection back online if the ping/test succeeds (and also resume any data flows that were paused as a result of the connection being offline).  Note that it is relatively common for a connection to go offline (and then back online via the automated ping/test batch process) if you are running data flows off hours at times when the applications being integrated go offline temporarily for their own maintenance.",
  'connection._connectorId':
'If this connection was installed as part of an Integration App app (i.e. from the integrator.io marketplace), then this field will hold the _id of the Integration App app that owns the connection.  Please note that for security reasons, connections owned by an Integration App cannot be referenced outside the context of the Integration App. This implies that you cannot use any of these connections in the data flows that you build yourself.',
  'connection._integrationId':
'If this connection was installed as part of an Integration App app (i.e. from the integrator.io marketplace), then this field will hold the _id of the specific integration instance (a.k.a. integration tile) that owns the connection.  Please note that for security reasons connections owned by an Integration App cannot be referenced outside the context of the specific integration tile that they belong to. This implies that you cannot use these connections in the data flows that you build yourself, nor can you use the same Integration App referenced connections across different integration tiles.',
  'connection.debugDate':
'Indicates for how long integrator.io should be recording both request and response traffic from this connection. You can later review this raw debug information directly from the download icon on the /connections page.',
  'connection._borrowConcurrencyFromConnectionId':
'By default, all data flowing through a connection record will get submitted to the respective endpoint application at the concurrency level configured for that connection record. There are use cases however where you need multiple connections to share the same concurrency level, and this field allows you to specify that a connection should borrow concurrency from another connection such that the data flowing through both connections will get submitted to the endpoint application together via a shared concurrency model. For example, you might have three separate NetSuite connection records in your integrator.io account (for the purpose of isolating different permissions for different integrations), but you only want to provision one concurrent request for all three NetSuite connection records to share. To implement this use case you would setup one of the three connections with a concurrency level 1, and then you would setup the other two NetSuite connections to borrow concurrency from the other.',
  'connection.netsuite.account':
'Your NetSuite Account Id.  One way to obtain this value within NetSuite is via Setup -> Integration -> Web Services Preferences.  If this does not work then please contact NetSuite support.',
  'connection.netsuite.tokenAccount': 'Enter your NetSuite account ID. <br /> To retrieve the account ID: <ul><li>Sign in to your <a href="https://www.netsuite.com/portal/in/home.shtml" target="_blank">NetSuite</a> account.</li><li>Navigate to <b>Setup > Integration > SOAP Web services preferences</b>.</li><li>From <b>Primary information</b>, copy the <b>Account ID</b>.</li></ul>',
  'connection.netsuite.token.auto.account': 'Enter your NetSuite account ID. <br /> To retrieve the account ID: <ul><li>Sign in to your <a href="https://www.netsuite.com/portal/in/home.shtml" target="_blank">NetSuite</a> account.</li><li>Navigate to <b>Setup > Integration > SOAP Web services preferences</b>.</li><li>From <b>Primary information</b>, copy the <b>Account ID</b>.</li></ul>',
  'connection.netsuite.roleId':
"The NetSuite Internal Id of the Role associated with the User.  To obtain this value you must first know which NetSuite Role record is associated with the User you are using for this connection.  Once you know the Role then you can navigate to Setup -> Users/Roles -> Manage Roles and if you have NetSuite Internal Ids displayed automatically it will just show in the list view, or you can open the Role in view mode and look at the URL in the browser and the id will be listed there too.  If these steps didn't work for your particular NetSuite instance then please contact NetSuite support.",
  'connection.netsuite.email':
'The email address that you use to login to NetSuite.',
  'connection.netsuite.password':
'Your NetSuite password.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.netsuite.tokenId':
"Important: before creating an Access Token in NetSuite for integrator.io, please make sure you have installed the 'Celigo integrator.io' SuiteApp (i.e. the Bundle with id 20038) in your NetSuite account. You must reference 'integrator.io' in the 'Application' field for all Access Tokens used by integrator.io. After you create an Access Token in NetSuite, 'Token Id' and 'Token Secret' will be displayed only once (on the token confirmation page inside NetSuite). Please copy and paste 'Token Id' here before you leave the confirmation page.",
  'connection.netsuite.tokenSecret':
"Important: before creating an Access Token in NetSuite for integrator.io, please make sure you have installed the 'Celigo integrator.io' SuiteApp (i.e. the Bundle with id 20038) in your NetSuite account. You must reference 'integrator.io' in the 'Application' field for all Access Tokens used by integrator.io. After you create an Access Token in NetSuite, 'Token Id' and 'Token Secret' will be displayed only once (on the token confirmation page inside NetSuite). Please copy and paste 'Token Secret' here before you leave the confirmation page.",
  'connection.netsuite.environment':
'The NetSuite environment that you want to connect with.  NetSuite supports Production, Sandbox and Beta environments.  Sandbox NetSuite accounts must be provisioned by NetSuite, and Beta environments are typically only available in the weeks prior to a large NetSuite upgrade.',
  'connection.netsuite.tokenEnvironment': 'Select the required environment for the NetSuite account instance you\'re connecting to: <br /><b>Beta</b> – if your account is created at http://rp.app.netsuite.com/ <br /><b>Production</b> – if your account is created at http://app.netsuite.com/ <br /><b>Sandbox 2.0</b> – if your account is created at http://sb.app.netsuite.com/',
  'connection.netsuite.concurrencyLevelRESTlet':
'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.netsuite.concurrencyLevelWebServices':
'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.netsuite.concurrencyLevel':
'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.configureTokenRefresh':
'Check this box if your token expires after a period of time. A series of new fields will appear in the form.',
  'connection.http.auth.token.refreshMediaType':
'Use this field to handle the use case where the HTTP request requires a different media type than what is configured on the connection.',
  'http.auth.token.tokenPaths':
'Use this field to handle the use case where the HTTP request requires a different media type than what is configured on the connection.',
  'connection.http.auth.cookie.method':
'Select GET or POST for the session cookie request.',
  'connection.http.auth.cookie.uri':
'Provide the absolute URL where the session cookie is obtained.',
  'connection.http.auth.cookie.successStatusCode':
'This field only needs to be set if the HTTP status code for success is not 200.',
  'connection.http.auth.token.headerName':
"By default, integrator.io will send all authentication type info in the 'Authorization: ' HTTP header field.  If the REST API you are connecting to requires a different HTTP header, use this field to provide an override.",
  'connection.rest.disableStrictSSL':
'An optional flag that (if set) skips verifying the SSL certificate, allowing self-signed or expired certs.  It is highly recommended (for hopefully obvious reasons) that you never set this flag for any production data connections.  In general, use at your own risk.',
  'connection.rest._iClientId':
'The iClient resource type is used to register OAuth 2.0 client credentials that can be used to authorize connections.  iClients are typically only needed by developers that wish to build their own Integration App product for the integrator.io marketplace, where the OAuth 2.0 credentials for their product will be owned by them, and the iClient will be bundled in their app, and only resources in their app will be able to reference it.',
  'connection.http._httpConnectorApiId':
'This application supports multiple APIs. Select the specific API you would like to use for this connection.',
  'connection.http.mediaType':
'Specify the data format to use in the HTTP request body and HTTP response body.',
  'connection.http.successMediaType':
'Use this field to handle the use case where a successful HTTP response returns a different media type than the original HTTP request body sent.',
  'connection.http.errorMediaType':
'Use this field to handle the use case where an unsuccessful HTTP response returns a different media type than the original HTTP request body sent.',
  'connection.http.baseURI': 'This common part of an API’s URL is used across all of the HTTP endpoints you invoke. A base URI makes it easier to configure exports and imports.',
  'connection.http.headers': 'In some rare cases, you may need to include custom HTTP headers with your API requests. <a href="https://www.celigo.com/ipaas-integration-platform/">integrator.io</a> automatically adds the appropriate content-type header based on the mediaType value described in the connection associated with this request (typically application/json). Note that the request header value automatically includes the authentication method described in the associated connection if required. Use this header field in the rare case when an API requires additional headers other than application or JSON.',
  'connection.http.disableStrictSSL':
'An optional flag that (if set) skips verifying the SSL certificate, allowing self-signed or expired certs.  It is highly recommended (for hopefully obvious reasons) that you never set this flag for any production data connections.  In general, use at your own risk.',
  'connection.http.concurrencyLevel':
'Set this field to limit the number of concurrent HTTP requests allowed by the connection resource (at any one time), or leave this field blank to use burst mode.  With burst mode, integrator.io will make HTTP requests as fast as possible, with really high levels of concurrency.  Some APIs are really great with burst mode, and can typically handle any types of volume.  Conversely other APIs are much more strict when it comes to the number of API requests being sent to their servers, and burst mode may not be recommended.',
  'connection.http.retryHeader':
"It is common for a HTTP Service to return status code 429 if too many requests are made in a short period of time. These 429 responses are typically paired with a 'retry-after' response HTTP header that specifies the time to wait until a successful request can be made.  Some services send this response header with a different name, and you can specify this custom name in this field.",
  'connection.http.ping.method':
'The HTTP method (GET/PUT/POST/HEAD) to use when making the ping request.',
  'connection.http.ping.body':
'This field is typically used in for HTTP requests not using the GET method. The value of this field becomes the HTTP body that is sent to the API endpoint.  The format of the body is dependent on the API being used.  It could be url-encoded, json or XML data.  IN either case, the metadata contained in this body will provide the API with the information needed to fulfill your ping request. Note that this field can contain {{{placeholders}}} that will be populated from a model comprising of a connection and export object. For example if the export request body requires an authentication token to be embedded, you could use the placeholder {{connection.http.auth.token.token}}.',
  'connection.http.ping.relativeURI':
"Any relative URI (for an HTTP GET request) to an authenticated endpoint that can indicate if a connection is working properly.  For example: '/me', '/tokenInfo', '/currentTime', etc...  Whenever a connection is saved, integrator.io will invoke the Ping URI (if one is set), and only if the ping request is successful will the connection resource be saved.  There is also an automated batch process that runs multiple times per hour to continually ping all offline connections (i.e. connections that failed at one point) to bring those connection back online (and to resume any data flows that were paused as a result of the connections being offline).  It is definitely a best practice to set Ping URI on all your REST API connections so that integrator.io can do more to identify offline connections (before they are saved) and also bring them back online automatically wherever possible.",
  'connection.http.ping.successPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a successful request. For example, if the API always returns a 200 success HTTP status code, but then indicates success via a 'success' boolean field in the HTTP response body.",
  'connection.http.ping.failPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a failed request. For example, if the API always returns a 200 success HTTP status code, but then indicates errors via an 'error.message' field in the HTTP response body.",
  'connection.http.ping.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request failed. To provide multiple values, use a comma-separated list.',
  'connection.http.ping.successValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request succeeded. To provide multiple values, use a comma-separated list.',
  'connection.http.ping.errorPath':
'This optional field is used to specify which field in the HTTP response body contains the detailed error message for the purpose of displaying the error on the error management dashboard.  If this field is not set, then the full HTTP response body will be used as the error message in the error management dashboard.',
  'connection.http.auth.type':
  'Select your connection’s authentication type: <ul><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360050722452-Set-up-a-basic-auth-HTTP-connection">Basic</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360045051311-Set-up-a-cookie-based-HTTP-connection">Cookie</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360051227991-Set-up-a-custom-HTTP-connection">Custom</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360044808971-Set-up-a-digest-based-HTTP-connection-">Digest</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/10552671272219">OAuth 1.0</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360039586072-Set-up-an-OAuth-2-0-HTTP-connection">OAuth 2.0</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360045127771-Set-up-a-token-based-HTTP-connection">Token</a></b></li><li><b><a href="https://docs.celigo.com/hc/en-us/articles/360044808491-Set-up-a-WSSE-based-HTTP-connection">WSSE</a></b></li></ul>',
  'connection.http.auth.failStatusCode':
'This field only needs to be set if the HTTP status code for auth errors is not 401. For example, an API could return a generic 400 status code instead, and then use a field in the HTTP response body to indicate auth errors.',
  'connection.http.auth.failPath':
"This field only needs to be set if the API returns a field in the HTTP response body to indicate auth errors. For example, if an API returns the field 'errorMessage' with the value 'Auth failed', then you would set this field to 'errorMessage'.",
  'connection.http.auth.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine auth errors. To provide multiple values, use a comma-separated list.',
  'connection.http.auth.basic.username':
'The basic authentication username. Sometimes services providers use other terms like clientId or API Key',
  'connection.http.auth.basic.password':
"The password associated with your service account. Sometimes service providers have other names for this field such as 'secret key', or 'API key', etc.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.http.auth.token.token':
"The authentication token provided to you from the service provider. Some service providers use other names for this value such as 'bearer token', or 'secret key', etc. In some cases, a service may have a token request process, or tokens that expire after a given time. Use the refresh fields to instruct integrator.io on how to request and extract the token form the response.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your authentication token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.http.auth.token.location': 'This determines where your application’s API expects to find the authentication token.</br>Choose URL if the authentication token is located in the URL. You can then specify the query string parameter name that holds the token value.</br> Choose Header and specify the header name and authentication scheme to use when constructing the HTTP request. </br>Choose Body if your API requires the token to be embedded in the body structure of your HTTP request. In such cases, place the token in your body template using the placeholder: {connection.http.token.token}.',
  'connection.http.auth.oauth.headerName': 'By default, integrator.io sends all authentication type info in the authorization HTTP header field. If the API you are connecting to requires a different HTTP header, use this field to provide an override.',
  'connection.http.auth.wsse.headerName': 'Provide “header name”, where the hash token generated needs to be added in the request headers. By default, the name is going to be <b>X-WSSE</b>.',
  'connection.http.auth.token.scheme':
"Use this field to set the HTTP authorization header scheme value. For example, 'Bearer' would be the scheme value for 'Authorization: Bearer my_secret_api_token'",
  'connection.http.auth.token.paramName': 'Use this field to specify the name of the URL parameter that holds the API token value. For example, if you specify myAPITokenURLParam, then all HTTP requests will include ?myAPITokenURLParam=[token]',
  'connection.http.auth.token.refreshMethod':
'If the service being connected to supports request/refresh token, use this field to set the HTTP method to use in the token call.',
  'connection.http.auth.token.refreshRelativeURI':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the url to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.http.encrypted.password}}.',
  'connection.http.auth.token.refreshBody':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the body to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.http.encrypted.password}}.',
  'connection.http.auth.token.refreshTokenPath':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to indicate to integrator.io what path to use against the HTTP response to extract the new token.  If no value is found at this path then the token request is considered a failure.',
  'connection.http.auth.token.refreshHeaders':
"In some cases, it may be necessary to include custom HTTP headers with your token refresh requests. As with the 'body' field, any value from the connection can be referenced using {{{placeholders}}} with a complete path matching the connection field.",
  'connection.http.auth.token.refreshToken':
'This field is used if you have a refresh token that can be used in refresh expired auth tokens. You can place this token in the body, headers or url simply by using referencing it with the placeholder: {{{connection.http.auth.token.refreshToken}}}. <br>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.http.auth.token.tokenPaths':
'If the service you’re connecting to responds with one or more encrypted fields containing refresh tokens, then enter the JSON paths contained in the HTTP response where the new tokens can be extracted. Separate multiple fields with a comma. If no values are found at these paths, then the token request is considered a failure',
  'connection.http.rateLimit.failStatusCode':
'This field only needs to be set if the HTTP status code for rate-limit errors is not 429.  For example, an API could return a generic 400 status code instead, and then use a field in the HTTP response body to indicate rate-limit errors.',
  'connection.http.rateLimit.failPath':
"This field only needs to be set if the API returns a field in the HTTP response body to indicate rate-limit errors. For example, if an API returns the field 'errorMessage' with the value 'Too many requests', then you would set this field to 'errorMessage'.",
  'connection.http.rateLimit.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine rate-limit errors. To provide multiple values, use a comma-separated list.',
  'connection.http.rateLimit.limit': 'If your app’s API response does not let us know how long we need to wait before we make another call to it, then you will need to tell us how much time to take between API calls. <b>Important:</b> This value must be entered in milliseconds.',
  'connection.http.encrypted': 'Store all sensitive fields required by your imports and exports to access the app you are connecting to. For example, {\'password\':\'celigorocks\'} or {\'token\':\'x7if4nkovhgr63ghp\'}. These values are stored with AES-256 encryption and other layers of protection to keep your data safe.',
  'connection.http.unencrypted': 'Store all non-sensitive fields required by your imports and exports to access the app you are connecting to. For example, {\'email\':\'my_email@company.com\', \'accountId\': \'8675301\', \'role\':\'admin\'}.',
  'http.auth.oauth.oauth1.signatureMethod': 'Select the required method to sign the API call:<ul><li>HMAC-SHA1</li><li>HMAC-SHA256</li><li>HMAC-SHA512</li><li>RSA-SHA1</li><li>RSA-SHA256</li><li>RSA-SHA512</li><li>PLAINTEXT</li></ul>',
  'http.auth.oauth.oauth1.consumerKey': 'Enter your consumer key. The consumer uses this value to identify itself to the service provider.',
  'http.auth.oauth.oauth1.consumerSecret': 'Enter your consumer secret. The consumer uses this password to establish ownership of the consumer key. <br \\>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'http.auth.oauth.oauth1.accessToken': 'Enter the access token. The consumer uses this token to gain access to the protected resources on user\'s behalf.<br \\>Multiple layers of protection, including AES 256 encryption, are in place to keep your token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'http.auth.oauth.oauth1.tokenSecret': 'Enter the token secret. The consumer uses this secret to establish ownership of a provided token.<br \\>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'http.auth.oauth.oauth1.consumerPrivateKey': 'Enter the consumer private RSA key. This key is used to sign the API call request.',
  'http.auth.oauth.oauth1.realm': 'This is a string specified by the server in the WWW-Authenticate response header. It should contain at least the name of the host performing the authentication and might additionally indicate the collection of users who might have access.',
  'connection.rdbms.type': 'Select the database type.',
  'connection.rdbms.host':
'Hostname/IP of the server. OR Hostname/IP of the server to connect to.',
  'connection.rdbms.port':
'The server port to connect to. The default value varies depending on the type of database you are connecting to.',
  'connection.rdbms.instanceName':
'For Microsoft SQL (MS SQL) only--this field specifies the instance name to connect to. The SQL Server Browser service must be running on the database server, and UDP port 1434 on the database server must be reachable. If you set this field you cannot set the "port" field as well, as "instanceName" and "port" are mutually exclusive connection options.',
  'connection.rdbms.database': 'The database schema to connect to.',
  'connection.rdbms.user': 'Username for authentication.',
  'connection.rdbms.password': 'The password for the specified Username.',
  'snowflake.import.rdbms.queryType': "'Use bulk insert SQL query' to quickly insert batches of data efficiently. </br>'Use SQL query once per record' to execute a custom query per record. </br>'Use SQL query once per page of records' to execute a custom query per page of records.</br>'Use SQL query on first page only' to execute a custom query that runs only once in a flow on the first page of records.",
  'bigquery.import.rdbms.queryType': "'Use bulk insert SQL query' to quickly insert batches of data efficiently. </br>'Use SQL query once per page of records' to execute a custom query per page of records.</br>'Use SQL query on first page only' to execute a custom query that runs only once in a flow on the first page of records.",
  'redshift.import.rdbms.queryType': "'Use SQL query once per record' to execute a custom query per record. </br>'Use SQL query once per page of records' to execute a custom query per page of records.</br>'Use SQL query on first page only' to execute a custom query that runs only once in a flow on the first page of records.",
  'connection.rdbms.snowflake.warehouse':
'Warehouse used for executing compute process.',
  'connection.rdbms.snowflake.schema':
'Name of the schema that the connection will use. If the name is not provided, the connection will use the default schema defined in Snowflake for the user.',
  'connection.rdbms.snowflake.role':
'Name of the Roles to use in the connection. If the user role is not provided, the connection will use the default user role defined in Snowflake for the user.',
  'snowflake.connection.rdbms.host': 'Account name of Snowflake instance.',
  'snowflake.connection.rdbms.database':
'Snowflake database that you want to connect.',
  'snowflake.connection.rdbms.user': 'Username to connect to Snowflake.',
  'snowflake.connection.rdbms.password': 'Password to connect to Snowflake.',
  'connection.rdbms.bigquery.projectId': 'The unique identifier for the BigQuery project in the Google Cloud account.',
  'connection.rdbms.bigquery.clientEmail': 'The email address for the Google Cloud service account used for authentication.',
  'connection.rdbms.bigquery.privateKey': 'First, copy the private key from the Google portal for the service account that you want to use to authenticate the connection. Before you add it to integrator.io you must replace all newline characters (\\n) throughout the private key:<br>1. Paste the private key into a text editor.<br>2. Find \\n.<br>3. With your cursor in that location, delete the \\n characters and press Enter or Return.<br>4. Repeat this for each instance of \\n.<br>5. Ensure -----BEGIN PRIVATE KEY----- appears before the key, and -----END PRIVATE KEY----- appears after the key.<br>6. Copy and paste the reformatted private key (including the begin and end declarations) into integrator.io.',
  'connection.rdbms.bigquery.dataset': 'The name of the dataset containing the tables and views being accessed.',
  'connection.rdbms.redshift.region': 'The default Amazon Redshift region is [us-east-1]. To change the region, select the region for this Redshift account',
  'connection.rdbms.redshift.aws.accessKeyId': 'Many Amazon APIs require an access key, and you must enter its ID in this setting for Redshift authentication. Refer to the AWS guides for more info about access keys and how to generate or find them in your AWS account.',
  'connection.rdbms.redshift.aws.secretAccessKey': 'When you create an access key in your Amazon Redshift account, AWS will display both the access key ID and the secret access key. The secret access key will be available only once, and you should immediately copy it to a secure location and paste it into this setting. Multiple layers of protection, including AES 256 encryption, are in place to keep your secret access key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.rdbms.redshift.user': 'Enter your Identity and access management (IAM) database username. For more information, see <a href="https://docs.aws.amazon.com/redshift/latest/mgmt/generating-iam-credentials-user-and-groups.html" target="_blank">Create a database user</a>.',
  'connection.rdbms.redshift.database': 'Enter the Redshift database name that you want to connect to.',
  'connection.rdbms.redshift.clusterIdentifier': 'Enter the Redshift Cluster name. For more information, see <a href="https://docs.aws.amazon.com/redshift/latest/mgmt/configuring-connections.html" target="_blank">Find your cluster connection</a>.',
  'connection.rdbms.options':
'Define additional configurations for the database connection that is available according to the database documentation. For example, you can configure the connection timeout if the SQL server you are trying to connect to is slow (default connection timeout for MS SQL server is 15000ms).',
  'connection.rdbms.concurrencyLevel':
'The number of adapters to be executed concurrently.',
  'connection.rdbms.ssl.ca':
"This is an optional field, If the database uses a certificate that doesn't match or chain to one of the known CAs, use the ca option to provide a CA certificate that the peer's certificate can match or chain to. For self-signed certificates, the certificate is its own CA, and must be provided.",
  'connection.rdbms.ssl.key':
'Please provide the optional private key in PEM format. This is necessary only if database server is using client certificate authentication.',
  'connection.rdbms.ssl.passphrase':
'Please provide optional Passphrase. This is used to decrypt the "Key" field. This is necessary only if database server is using client certificate authentication.',
  'connection.rdbms.ssl.cert':
'Please provide optional cert chain in PEM format.This is necessary only if database server is using client certificate authentication.',
  'mssql.connection.rdbms.version':
'There are many different SQL Server versions. To find out which version you\'re using:</br>1.Connect to the SQL server you want to use.</br>2.Run the Windows command: SELECT @@version;</br>3.See <a href="https://support.microsoft.com/en-us/help/321185/how-to-determine-the-version-edition-and-update-level-of-sql-server-an" >Microsoft’s docs</a> for more information on finding your version.',
  'connection.mongodb.host':
'Enter the hostname or IP address for your MongoDB instance. For example: mongodb-instance1.com or 172.16.254.1.  By default, integrator.io will connect to port 27017.  If you need to connect to a different port then please append :port to your hostname.  For example:  mongodb-instance1.com:12345 or 172.16.254.1:98765.   If you are connecting to a mongodb cluster then please enter all your hostname:port combinations separated by commas.  For example: mongodb-instance1.com:12345,mongodb-instance2.com:12345,mongodb-instance3.com:12345.',
  'connection.mongodb.database':
"The name of the database to authenticate. If a database name is not provided here, then the 'admin' database will be used to authenticate.",
  'connection.mongodb.username':
'If your MongoDB instance requires login credentials please enter username here.',
  'connection.mongodb.password':
'If your MongoDB instance requires login credentials please enter password here.',
  'connection.mongodb.replicaSet':
"The name of the replica set.  When connecting to a replica set be sure to supply the list of the replica set members in the 'Host(s)' field above.",
  'connection.mongodb.ssl': 'Enables or disables TLS/SSL for the connection.',
  'connection.mongodb.authSource':
"The name of the database associated with the user’s credentials. If a database name is not provided here, then the 'Database' field above will be used as the default",
  'connection.dynamodb.aws.accessKeyId': 'Enter the ID for this account set up by the DynamoDB server administrator.',
  'connection.dynamodb.aws.secretAccessKey': 'Enter the access key for the account ID.',
  'connection.ftp.hostURI':
"The URI of the FTP/SFTP/FTPS server host.  Typically this value will look something like 'ftp.mycompany.com', or sometimes just a raw IP address '100.200.300.1'.  It is also very common for FTP/SFTP/FTPS servers to be behind a firewall, and to support accessing resources behind a firewall you will need to make sure all of the FTP/SFTP/FTPS specific integrator.io IP addresses (listed right below the HOST field) have been white-listed on your FTP/SFTP/FTPS server infrastructure.",
  'connection.ftp.username':
'The username that you will use to log in to the FTP/SFTP/FTPS server.',
  'connection.ftp.password':
'The password associated with the username that you are using to connect with the FTP/SFTP/FTPS server.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.ftp.port':
'Set this field to override the default port number. In most cases, this field can be left empty. Only on rare occasions are FTP/SFTP/FTPS servers configured to run on alternate ports.',
  'connection.ftp.usePassiveMode':
'This field tells integrator.io to use Passive Mode instead of Active Mode when connecting to a FTP or FTPS server.  This field is enabled by default; un-check this checkbox if you want to use Active Mode instead.  If Active Mode is used your FTP or FTPS server must accept traffic from the inbound port range 15000-15100.  Note that this field is only relevant for FTP or FTPS connections, and will be ignored for SFTP.  If you want to know the difference between Active and Passive Modes there is a good explanation here: <a href="http://www.jscape.com/blog/bid/80512/Active-v-s-Passive-FTP-Simplified" target="_blank"/>http://www.jscape.com/blog/bid/80512/Active-v-s-Passive-FTP-Simplified</a>',
  'connection.ftp.tradingPartner': 'Set this flag to indicate that the FTP site represents an external trading partner. Doing so will ensure that this endpoint counts against the Trading Partners entitlement of your <a href="https://www.celigo.com/ipaas-integration-platform/">integrator.io</a> license.',
  'connection.ftp.entryParser':
"This optional field can be used to explicity identify the system specific FTP/SFTP/FTPS implementation. In most cases no value should be selected; you only need to set this field if your FTP/SFTP/FTPS server is an uncommon type (not Windows or Linux), or it does not support the 'SYST' command.  Possible values are: ['UNIX', 'UNIX-TRIM', 'VMS', 'WINDOWS', 'OS/2', 'OS/400', 'AS/400', 'MVS', 'UNKNOWN-TYPE', 'NETWARE', 'MACOS-PETER']",
  'connection.ftp.authKey':
'A SFTP connection can use a password or an authentication key to authenticate a user trying to connect to the SFTP server.  Use this field to store the RSA private key used for authentication.  The key must be in PEM format.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your authentication key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.ftp.userDirectoryIsRoot':
'This optional field is used to tell integrator.io if the Relative Path used by a File Export or File Import is relative to your FTP/SFTP/FTPS login\'s user directory or to the server root folder.  Suppose your files are located on the server at "/usr/local/iio/files/download"--if your FTP/SFTP/FTPS server account places you in your user directory after login ("/usr/local/iio") then you need to check this checkbox and use "/files/download" as your Relative Path, but if you go straight to the server’s root directory ("/") after login then leave this checkbox unchecked and use "/usr/local/iio/files/download" as your Relative Path.',
  'connection.ftp.useImplicitFtps':
"By default integrator.io makes FTPS connections in 'Explicit' mode: integrator.io has to ask the server to use TLS before the connection can be encrypted.  You should check this checkbox field if the server supports 'Implicit' FTPS where the client and server always use an encrypted connection.",
  'connection.ftp.requireSocketReUse':
'By default FTPS servers are configured to use 2 sockets on 2 different ports for connections.  If your FTPS server uses only 1 port for FTPS traffic you can check this optional checkbox field to tell integrator.io to reuse 1 socket to connect to this 1 port.',
  'connection.ftp.pgpEncryptKey':
'Specify a public key for use with PGP file transfers.  If you set this field then all files imported from integrator.io will be encrypted with this public key during file upload.  If you do not want to use PGP encryption in your FTP Import then leave this field blank.  The key must be in ASCII Armor format.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your authentication key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.ftp.pgpDecryptKey':
'Specify a private key for use with PGP file transfers.  If you set this field then all files exported to integrator.io will be decrypted with this private key during file download.  If you do not want to use PGP decryption in your FTP Export then leave this field blank.  The key must be in ASCII Armor format.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your authentication key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.ftp.pgpPassphrase':
'Set this field if your PGP private key is secured with a passphrase.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your passphrase safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.pgp.publicKey':
'Enter the public key to use for encryption and verifying signatures.',
  'connection.pgp.privateKey':
'Enter the private key to use for decryption and signing files.',
  'connection.pgp.passphrase':
'Enter the private key’s passphrase',
  'connection.pgp.compressionAlgorithm':
'Select an algorithm to use to compress files during encryption and decompress files during decryption. If this field is empty, files are left uncompressed.',
  'connection.pgp.asciiArmored':
'In an Export step, this setting indicates the incoming file format for parsing. In an Import step, it dictates the output format of the encrypted file. Select “Yes” for text (ASCII-armored) format. Select "No" for binary format.',
  'connection.ftp.concurrencyLevel': 'Set this field to limit the number of concurrent/parallel requests allowed by the connection at any one time.',
  'connection.as2.as2Id':
'This is the AS2 Identifier your trading partners will use as the "To" identifier when sending you documents, and the identifier integrator.io will use as the "From" identifier when you send documents to your trading partners. This field must be unique across all integrator.io users to ensure that inbound documents from your trading partners are routed to the correct integration flows. In addition, you should use a different identifier for production vs. sandbox.',
  'connection.as2.partnerId':
'This is the AS2 Identifier your trading partners will use as the "From" identifier when sending you documents, and the identifier integrator.io will use as the "To" identifier when you send documents to your trading partners.',
  'connection.as2.partnerStationInfo.as2URI':
'This is the URL via which integrator.io will send AS2 documents to your trading partner.',
  'connection.as2.partnerStationInfo.mdn.mdnSigning':
'This is the digest algorithm used by integrator.io while verifying the MDN returned by your trading partner.',
  'connection.as2.partnerStationInfo.encryptionType':
'This is the algorithm integrator.io will use when sending messages to your trading partner.',
  'connection.as2.partnerStationInfo.signing':
'This is the digest algorithm integrator.io will use when sending messages to your trading partner.',
  'connection.as2.partnerStationInfo.encoding':
'This is the character encoding used by integrator.io for outgoing messages when they are encrypted (base64 or binary, with base64 being the default).',
  'connection.as2.partnerStationInfo.signatureEncoding':
'Choose the way your partner is expecting the signature to be encoded on receiving side. We have multiple ways of data encoding like binary, base64, etc. This field is used to encode the signature in that respective format. Your partner will have shared this info with you already.',
  'connection.as2.partnerStationInfo.auth.type':
"The as2 adaptors currently support 2 types of authentication. Choose 'basic' authentication if your service implements the HTTP basic auth strategy. This auth method adds a base64 encoded username/password pair value in the 'authentication' HTTP request header.  Choose 'token' if your service relies on token-based authentication. The token may exist in the header, url or body of the http request. This method also supports refreshing tokens if supported by the service being called.",
  'connection.as2.partnerStationInfo.auth.failStatusCode':
'The HTTP specification states that authentication errors should return a 401 status code.  Some services have custom authentication implementations that rely on other status codes, or return 200 and indicate auth errors within the HTTP body. Use this field if the service you are connecting to uses a status code other than 401.',
  'connection.as2.partnerStationInfo.auth.failPath':
'If the service you are connecting to embeds authentication errors within the HTTP body, use this field to set the path within the response body where integrator.io should look to identify a failed auth response. If there is a specific value (or set of values) that indicate a failed auth response at this path, use the failValues field to further instruct our platform on how to identify this type of error.',
  'connection.as2.partnerStationInfo.auth.failValues':
'This field is used only if the failPath field is set. It indicates to integrator.io what specific values to test for when determining if the requests we made failed for authentication reasons.',
  'connection.as2.partnerStationInfo.auth.basic.username':
'The basic authentication username. Sometimes services providers use other terms like clientId or API Key',
  'connection.as2.partnerStationInfo.auth.basic.password':
"The password associated with your service account. Sometimes service providers have other names for this field such as 'secret key', or 'API key', etc.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.as2.partnerStationInfo.auth.token.token':
"The authentication token provided to you from the service provider. Some service providers use other names for this value such as 'bearer token', or 'secret key', etc. In some cases, a service may have a token request process, or tokens that expire after a given time. Use the refresh fields to instruct integrator.io on how to request and extract the token form the response.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your authentication token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.as2.partnerStationInfo.auth.token.location':
"Where does your application's API expect to find the auth token? Choose 'url' if the auth token should be located in the url.  You will then be able to specify the query string parameter name that should hold the token value. If you choose 'header' you will then need to specify the header name and auth scheme to use when constructing the HTTP request. Finally, choose 'body' if your API needs the token embedded in the body structure of your HTTP request. In this case, its up to you to place the token in your body template using the placeholder: {{{connection.as2.partnerStationInfo.auth.token.token}}}",
  'connection.as2.partnerStationInfo.auth.token.headerName':
"By default, integrator.io will send all authentication type info in the 'Authorization: ' HTTP header field.  If the API you are connecting to requires a different HTTP header, use this field to provide an override.",
  'connection.as2.partnerStationInfo.auth.token.scheme':
'By default, integrator.io will follow the HTTP specs with regards to auth scheme names (i.e. Bearer, OAuth, MAC, etc...), but if the API you are connecting to does not follow the specs exactly, this field can be used to provide an override.',
  'connection.as2.partnerStationInfo.auth.token.paramName':
"Use this field to specify the name of the URL parameter that will hold the API token value.  For example, if you specify 'myAPITokenURLParam' then all HTTP requests will include the following: '?myAPITokenURLParam=[token]'.",
  'connection.as2.partnerStationInfo.auth.token.refreshMethod':
'If the service being connected to supports request/refresh token, use this field to set the HTTP method to use in the token call.',
  'connection.as2.partnerStationInfo.auth.token.refreshRelativeURI':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the url to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.as2.encrypted.password}}.',
  'connection.as2.partnerStationInfo.auth.token.refreshBody':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the body to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.as2.encrypted.password}}.',
  'connection.as2.partnerStationInfo.auth.token.refreshTokenPath':
'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to indicate to integrator.io what path to use against the HTTP response to extract the new token.  If no value is found at this path then the token request is considered a failure.',
  'connection.as2.partnerStationInfo.auth.token.refreshHeaders':
"In some cases, it may be necessary to include custom HTTP headers with your token refresh requests. As with the 'body' field, any value from the connection can be referenced using {{{placeholders}} with a complete path matching the connection field.",
  'connection.as2.partnerStationInfo.auth.token.refreshToken':
'This field is used if you have a refresh token that can be used in refresh expired auth tokens.  You can place this token in the body, headers or url simply by using referencing it with the placeholder: {{{connection.as2.partnerStationInfo.auth.token.refreshToken}}}.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your refresh token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.as2.partnerStationInfo.rateLimit.failStatusCode':
'Use this field only if your service uses custom rate limit implementations that rely on status codes other than 429, or throttles errors in the HTTP body. HTTP specifications expect rate limit responses to return a 429 status code.',
  'connection.as2.partnerStationInfo.rateLimit.failPath':
'Use this field if the service you are connecting to embeds rate limit errors in the HTTP body. <a href="https://www.celigo.com/ipaas-integration-platform/">integrator.io</a> uses this path to identify a rate-limited (throttled) response.',
  'connection.as2.partnerStationInfo.rateLimit.failValues':
'Use this field only if the rate limit fail path is set. <a href="https://www.celigo.com/ipaas-integration-platform/">integrator.io</a> uses these values to identify a rate-limited response.',
  'connection.as2.partnerStationInfo.rateLimit.limit':
'If your app’s API response does not let us know how long we need to wait before we make another call to it, then you will need to tell us how much time to take between API calls. <b>Important:</b> This value must be entered in milliseconds.',
  'connection.as2.userStationInfo.encryptionType':
'This is the algorithm we use while decrypting the message (this information is present in the MIME Message itself). So it is nothing more that verification of same.',
  'connection.as2.userStationInfo.signing':
'This is the algorithm used by integrator.io to calculate the digest of the incoming message from your trading partner.',
  'connection.as2.userStationInfo.encoding':
'Character encoding of the incoming HTTP message body in case it is encrypted (base64 or binary, with base64 being the default)',
  'connection.as2.userStationInfo.mdn.mdnURL':
"This is the URL via which integrator.io will send asynchronous MDNs to your trading partner. Note that this URL will typically be different to the Partner's AS2 URL field above.",
  'connection.as2.userStationInfo.mdn.mdnSigning':
'This field describes what signing algorithm, if any, integrator.io will use when sending back MDNs to your trading partner.',
  'connection.as2.unencrypted.partnerCertificate':
'This has the partner certificate information required to encrypt the message to be sent to partner or verify the signature on receiving part.',
  'connection.as2.unencrypted.userPublicKey':
'This is the key that you should share with your trading partner that they will use to encrypt EDI messages.',
  'connection.as2.encrypted.userPrivateKey':
'This is the key that integrator.io will use to decrypt incoming messages from the trading partner, who should be using the above public key to encrypt messages. The private key is sensitive and should be guarded carefully just like any other credential.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.s3.region': 'The AWS region where your S3 bucket is located.',
  'connection.s3.accessKeyId':
"Many of Amazon's APIs require an access key, and this field stores the 'id' for the access key that you want this connection to use.  Please check the AWS guides if you need more info about access keys and how to generate and/or find them in your AWS account.",
  'connection.s3.secretAccessKey':
'When you create a new access key in your AWS account, AWS will display both the access key id and the secret access key.  The secret access key will only be available once, and you should store it immediately in integrator.io (i.e. in this field).<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret access key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'connection.s3.pingBucket':
'If you specify a bucket name in this field then integrator.io will specifically try to connect to this bucket when your S3 connection is tested, pinged, etc.... If you do not specify a bucket name then please make sure your AWS access key has access to get the list of buckets in your AWS account.',
  'connection.salesforce.concurrencyLevel':
'Set this field to limit the number of concurrent API requests allowed by this connection resource (at any one time), or leave this field blank to use burst mode.  With burst mode, integrator.io will send requests to Salesforce as fast as possible, with really high levels of concurrency.  Salesforce uses a combination of concurrent request governance along with daily limits to throttle API usage, and burst mode is not recommended.  Please read more about Salesforce API governance in the Salesforce help guides, or contact Salesforce support for more info.',
  'connection.wrapper.unencrypted':
"Use this JSON field to store all the non security sensitive fields needed by your wrapper (to access the application being integrated).  For example: {'email':'my_email@company.com', 'accountId': '5765432', 'role': 'admin'}",
  'connection.wrapper.encrypted':
"Use this encrypted JSON field to store all the security sensitive fields needed by your wrapper (to access the application being integrated).  For example:  {'password': 'ayTb53Img!do'} or {'token': 'x7ygd4njlwerf63nhg'}.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your data safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.wrapper.pingFunction':
'If you implement a ping function in your wrapper code, and specify the name of that function here, then integrator.io can test your connection to make sure it is working; and also if your connection ever goes offline due to an intermittent issue, integrator.io runs a batch process every hour (with an exponential decay) to regularly ping all offline connections and automatically bring them back online (if possible) so that any pending or in progress jobs can resume processing.',
  'connection.wrapper._stackId':
'This field specifies the stack currently hosting your wrapper code.',
  'connection.wrapper.concurrencyLevel':
'Set this field to limit the number of concurrent requests that will be sent to your wrapper at any one time, or leave this field blank to use burst mode.  With burst mode, integrator.io will send requests as fast as possible, with really high levels of concurrency.  The decision to use burst mode, or any other specific level of concurrency, should be based on the governance rules established by the application being integrated.',
  'connection.amazonmws.sellerId':
'The account ID for the Amazon seller account you are integrating with.  You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters.  If you do not know this value you can find it in the "Settings" section in Amazon Seller Central.',
  'connection.amazonmws.mwsAuthToken':
"This optional field stores the authorization token for your integration's Amazon seller account.  You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters.  It is only needed if you are trying to integrate with a different seller account from your MWS login.  Leave it blank if you are building integrations with your own seller account.  If you do not have this value please go to mws.amazon.com and follow the API and Developer Guides to learn how to request access.",
  'connection.amazonmws.accessKeyId':
'This is the ID that Amazon assigns to your MWS account when you signed up for the service.  You do not need to include it in your relativeURI; integrator.io will automatically add it to all request parameters.  If you do not know this value please go to mws.amazon.com and follow the API and Developer Guides to sign up for the service and retrieve this ID.',
  'connection.amazonmws.secretAccessKey':
"This is your MWS account's signing key.  When making a request to Amazon MWS integrator.io will sign the request with this key and add a 'Signature' header to the request.  If you do not know this value please go to mws.amazon.com and follow the API and Developer Guides to sign up for the service and retrieve this key.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your secret access key safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.",
  'connection.amazonmws.marketplaceRegion':
'This is the region where the Amazon seller account is based.  Select the country or continent where your seller account is based (North America and Europe are unified seller regions).',
  'connection.mode': 'Select cloud if you are connecting to a publicly accessible application like Salesforce, Slack, etc... Select on-premise if you are connecting to an application that is behind a firewall like a database or custom HTTP endpoint.  Connecting to an on-premise application requires installing an agent behind your firewall.',
  'connector._id':
'System generated primary unique identifier for the connector.  For API users, this value should be used for GET and PUT requests.',
  'connector.name':
'Name of the connector used to easily reference it from other parts of the application.',
  'connector.lastModified':
'System generated datetime to track the last time this resource was modified.',
  'connector.handle': '.',
  'connector.legacyId': '.',
  'connector.published': '.',
  'connector.description': 'The description of the integration app.',
  'connector.applications': 'Displays the source and destination applications to which this integration can be connected. You can integrate with an application, database, or  universal connector.',
  'connector.contactEmail': 'Enter one or many email addresses for the integration admin. The integration admin is notified when the user requests a demo, integration upgrade, add-on installation, or a subscription extension. ',
  'connector.imageURL': '.',
  'connector._integrationId': 'Select the source integration ID. The selected integration is used as a source copy to create integrations to user accounts.',
  'connector.websiteURL': 'Enter the website URL of the integration.',
  'connector.oauth2ResultsURL': '.',
  'connector.managed': '.',
  'connector._stackId': 'You can use stacks to host code for hooks, wrappers, connector installers, and settings pages. <a href="https://docs.celigo.com/hc/en-us/articles/227055868" target="_blank">Stacks</a> are simple server environments that can be implemented in any coding language and are always invoked via HTTP. Every stack is assigned a system token that should be used to authenticate HTTP requests. You own the IP for all of your stacks and can optionally choose to share a stack with other integrator.io users.',
  'connector.installerFunction': 'This function creates an integration when a license is provided and passes control to the installer function with the required information. The relevant resources required by the integration are created and the install steps can be updated on the integration document. In this field, enter the function name as <b>installerFunction</b>.',
  'connector.updateFunction': 'This function is used to do an update for the integrations belonging to a connector. Whenever new versions of the integration app need to be released or new features added to an integration app, use the update function to make the required changes for integrations installed in user accounts. This function can be invoked only by the owner of the connector. In this field, enter the function name as <b>updateFunction</b>.',
  'connector.uninstallerFunction': 'This function removes all of the documents that are not removed while uninstalling the integration, or it completes any uninstallation steps. On completion, the integration is deleted from integrator.io and the license is dissociated for future use. In this field, enter the function name as <b>uninstallerFunction</b>.',
  'connector.sharedImportIds': '.',
  'connector.sharedExportIds': '.',
  'connector.oAuthServerFlow._iClientId': '.',
  'connector.oAuthServerFlow.putConnection': '.',
  'connector.repository.name': '.',
  'connection.ftp.type':
'Choose the protocol to use for your FTP connection. Choose <b>FTP</b> (basic File Transfer Protocol) if your data is sent and received unencrypted. Choose <b>SFTP</b> if your data is transferred over the encrypted Secure Shell (SSH2) protocol. <b>FTPS</b> is similar to basic FTP, but data is encrypted via the Transport Layer Security (TLS) protocol before transfer.',
  'connection.usePgp':
'Set this field to <a href="https://docs.celigo.com/hc/en-us/articles/360060934611-Enable-PGP-encryption-decryption-in-file-exports-and-imports" target="_blank">configure PGP</a>cryptographic information used for encrypting and decrypting files.',
  'connection.as2.userStationInfo.mdn.mdnEncoding':
'You can tell integrator.io which character encoding to use when we send an MDN back to your trading partner. You can choose between base64 or binary. Base64 will be the default.',
  'export._id':
'System generated primary unique identifier for your export.  For API users, this value should be used for GET, PUT and DELETE requests.',
  'editor.xml.simple':
'Simple parsing means the code is converted to JSON without any user configurations.This typically generates a more complex and difficult to read JSON.\nIf you would like to have more control over what the JSON output looks like, use the Advanced options.',
  'export.name':
'Name your resource so that you can easily reference it from other parts of the application.',
  'export._connectionId':
'The specific connection you would like to use for your export or import.\nYou can pre-establish and save your connections using Menu > Connections. Each stored connection contains credentials along with other related information needed to access the desired application.\nIn addition, you can click the + icon beside this field to create a new connection.',
  'export.type':
`Choose an export type depending on your integration pattern:<br/>
  <ul> <li><b>All</b> – Export all data, every time the flow runs.</li>
  <li><b>Delta</b> – Export data that has changed since the last time the flow ran.</li>
  <li><b>Once</b> – Export only data that has not been exported already, and then write back to the source app to mark the retrieved records as exported.</li>
  <li><b>Limit</b> – Export a set number of records (max 100). You can change the maximum number of records to export each time the flow runs, default is set to 1. <b>Limit</b> is useful when developing and testing integrations to avoid syncing lots of data.</ul>`,
  'export.bigquery.type':
`Choose an export type depending on your integration pattern:<br/>
  <ul> <li><b>All</b> – Export all data, every time the flow runs.</li>
  <li><b>Delta</b> – Export data that has changed since the last time the flow ran.</li>
  <li><b>Limit</b> – Export a set number of records (max 100). You can change the maximum number of records to export each time the flow runs, default is set to 1. <b>Limit</b> is useful when developing and testing integrations to avoid syncing lots of data.</ul>`,
  'export.lastModified':
'System generated date/time to track the last time this resource was modified.',
  'export.apiIdentifier':
"Every export that you create is assigned a unique handle that you can then use in your own application logic to invoke the export programmatically via the integrator.io API.  For example, your export identifier might be 'e762db96', and you could invoke this export with a simple HTTP POST to https://api.integrator.io/e762db96",
  'export.groupByFields':
  "Select the fields you'll group, so each group of records returned by the application is treated as a single record downstream in your flow. For example, export records from a source or lookup, group the records based on a column value, and import each group as a journal entry in NetSuite, where each journal entry contains all the records in the group as line items. When grouping, the page size property dictates the maximum number of groups included in a single page. If the application does not sort the exported data, grouping may not work as expected.",
  'export._integrationId':
'If this export was installed as part of an Integration App app (i.e. from the integrator.io marketplace), then this value will be hold the _id value of the specific integration instance (a.k.a. integration tile) that owns the export.  Please note that for security reasons exports owned by an Integration App cannot be referenced outside the context of the specific integration tile that they belong to, meaning that you cannot use these exports in the data flows that you build yourself, nor can the same Integration App reference exports across different integration tiles.',
  'export._connectorId':
'If this export was installed as part of an Integration App app (i.e. from the integrator.io marketplace), then this value will hold the _id value of the Integration App app that owns the export.  Please note that for security reasons exports owned by an Integration App cannot be referenced outside the context of the Integration App, meaning that you cannot use any of these exports in the data flows that you build yourself.',
  'export.pageSize':
"When an export runs in the context of a data flow (where the data from the export is sent right away to an import queue) integrator.io will break the data being exported into one or more smaller pages of records.  Saying this another way, integrator.io uses streaming to export data out of one app and import it into another app.  The 'Page Size' field can be used to specify how many records you want in each page of data.  The default system value (when you leave this field blank) is 20.  There is no max value, but a page of data will automatically get capped when it exceeds 5 MB.  Most of the time, the application that you are importing data into will bottleneck the page size value.  For example, if you are importing data into NetSuite or Salesforce they each specify (in their API guides) a maximum number of records that can be submitted in any single request.",
  'export.dataURITemplate':
"When your flow runs but has data errors this field can be really helpful in that it allows you to make sure that all the errors in your job dashboard have a link to the original data in the export application.  This field uses a handlebars template to generate the dynamic links based on the data being exported.  For example, if you are exporting a customer record from Shopify, you would most likely set this field to the following value 'https://your-store.myshopify.com/admin/customers/{{{id}}}'.  Or, if you are just exporting a CSV file from an FTP site then this field could simply be one or more columns from the file: {{{internal_id}}, {{{email}}}, etc...",
  'export.traceKeyTemplate':
'Define a <a href="https://docs.celigo.com/hc/en-us/articles/360060740672" target="_blank">trace key</a> that integrator.io will use to identify a unique record. Any value you provide overrides the default trace key for your app. You can specify a single field, such as {{record.field1}}, or use a <a href="https://docs.celigo.com/hc/en-us/articles/360039326071" target="_blank">handlebars expression.</a>For example, {{join "_" record.field1 record.field2}} generates a trace key such as 123_456.<br /> <b>Note:</b>If you have applied a <a href="https://docs.celigo.com/hc/en-us/articles/360025928231">transformation</a> to exported data, reference its fields in the trace key template without the path record. – for example, {{field1}}.',
  'export.sampleData':
'Enter a sample destination record here so that integrator.io can help you later map fields between source and destination applications. The sample destination record should ideally contain all fields that you want to process in this flow, and should follow the exact same formatting rules that the destination application/API requires.',
  'export.description':
'Describe your resource so that other users can quickly understand what it is doing without having to read through all the fields and settings. Be sure to highlight any nuances that a user should be aware of before using your resource in their flows. Also, as you make changes to the resource be sure to keep this field up to date.',
  'export.filter.rules':
'Important: only records where your filter expression evaluates to true will get passed along by the results of this export.  Defining a filter on your export allows you to discard records such that they will not get returned in the results, or get passed along to any subsequent processors. Export filters come in handy when you are working with older applications or data sources that do not natively support the ability to define search criteria to exclude records. If an application does support the ability to define search criteria then you should use that native functionality (vs defining filters here) to avoid pulling unnecessary data into integrator.io.',
  'export.transform.rules':
'Transformations are an optional feature that lets you alter the representation of your record(s).  By providing a set of rules, you can change the structure of your record. Each rule is made up of a pair of extract and generate json paths. These paths let you map where to get (extract) values from and where to place (generate) them. At its most basic form, by providing rules, you can cherry-pick which record properties you want to keep and which to drop. Only properties that are referenced in a rule will be part of the transformed record. Often simply renaming property names is not enough. It is also possible to promote parent properties to child items. For example, consider the following sample record: <pre>{ id: 1,\n items: [\n {name: ‘bob’},\n {name: ‘joe’}\n ] \n}</pre>\nIf you wanted to rename items.name to people.firstName and move an ‘id’ property into each item, you would use the rule-set: <pre>[\n { extract: ‘items[*].name’, generate: ‘people[*].firstName’ },\n { extract: ‘id’, generate: ‘people[*].id’ }\n]</pre> The result of this transform would be: <pre>{ people: [\n { id: 1, firstName: ‘bob },\n { id: 1, firstName: ‘joe’ } \n] }</pre>',
  'export.test.limit':
'Enter the maximum number of records to export each time this flow runs (maximum limit is 100 records). In most cases, you would apply this limit only while developing and testing an integration.',
  'export.delta.dateField':
'Please select one or more date fields from the export application, and integrator.io will use these date fields to process records that were created and/or modified since the last time the flow was run.  If you are using multiple date fields, please use commas to separate the different values.  For example, \'createdAt,lastModified\' will first export \'createdAt\' records, and then \'lastModified\' records.',
  'export.delta.dateFormat':
'This field ONLY needs to be set if the standard ISO8601 date format is not supported by the source application. If this is the case, then there are multiple non-standard formats to pick from, or you can define a completely custom format. For instructions on how to specify custom formats, please visit <a class="sc-dEfkYy jDnahj" href="https://momentjs.com/docs/#/displaying/" title="https://momentjs.com/docs/#/displaying/">https://momentjs.com/docs/#/displaying/</a>',
  'export.delta.startDate':
'If no date is specified, the first execution of a deltaExport uses the current date. This effectively sets the startDate to the first time the delta export is run.  You can override this by providing your own start date.',
  'export.delta.lagOffset':
'In very rare cases when records are created or updated in an application, those changes are not immediately visible through API calls to the application.  If you experience records getting dropped that were modified just as the export ran, then use this value to subtract time from the next delta flow start date.  This will "pick-up" the missed records from the previous run. Lag Offset is measured in milliseconds (1/1000s). if you find it takes 15 seconds for application changes to be visible though their API, you would set this value to 15000.',
  'export.once.booleanField':
'Please select a boolean field (i.e. a checkbox field) from the export application that integrator.io can use to keep track of records that have been exported or not.  Please note that integrator.io will only export all records where this booean field is false (i.e. unchecked), and integrator.io will also automatically make a subsequent request back into the export application to set this boolean field to true for all the records that were exported (so that those records are not exported again).',
  'export.valueDelta.exportedField': '.|',
  'export.valueDelta.pendingField': '.|',
  'export.distributed.bearerToken': 'Token used for authentication purpose. |',
  'export.netsuite.type':
'This field determines the type of the operation to be performed on the NS account (Ex: search, basicSearch, metadata, selectoption, restlet) |',
  'export.netsuite.searches':
'If the type is set to "search" or "basicSearch" this field holds an array of objects describing the search criteria for the NS records.|',
  'export.netsuite.metadata':
'If the type is set to "metadata". This is the json path containing the recordType for which the metadata is to be exported|',
  'export.netsuite.selectoption':
'If the type is set to "selectoption". This contains the json path for the recordType and fields in the record to be exported.|',
  'export.netsuite.customFieldMetadata':
'This field contains the customField name in the NS account for which the metadata is expected|',
  'export.netsuite.skipGrouping': 'If your NetSuite saved search is outputting multiple rows for each record, then check this box to tell integrator.io to group rows together into individual logical records according to internal ID. When the NetSuite saved search is sorted by internal ID, then the records exported to integrator.io are grouped together into a data set, represented by a single array object. <br />In certain cases, this default grouping may not be intended. Simply leave the box unchecked to turn off the default grouping (as well as the validation that required the NetSuite saved search to be sorted by internal ID). <br />Note that when <b>Group rows</b> is not checked, all search rows will be exported as individual records. If any type of grouping is needed later, that can be implemented via a custom hook or in a wrapper using the integrator.io extension framework.',
  'export.netsuite.statsOnly':
'When this field is set only high level stats provided by the export application about the search results will be returned.  For example, if you are invoking a NetSuite saved search then only the totalRecords value will be returned, and not any of the actual records.  Note also that this field is currently limited to just NetSuite web services, but other APIs can be exposed as needed upon request.',
  'export.netsuite.internalId':
'To export raw files out of NetSuite, integrator.io needs to know the internal id of the NetSuite File record you want to export. You can hard code a specific file by specifying its internal id directly. For example: 1234. Or, if the files being exported are dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the File Internal id values. For example: myFileField.internalId.',
  'export.netsuite.blob.purgeFileAfterExport':
'Set this field to true if you would like to delete the file from Netsuite File Cabinet after successful NS Blob export.',
  'export.netsuite.hooks.preSend.function':
'This very special hook gets invoked before records leave NetSuite. This hooks is great because it runs inside NetSuite, and the entire SuiteScript API is at your disposal, and there are lots of performance benefits if you need to run dynamic NetSuite searches on your data.',
  'export.netsuite.hooks.preSend.fileInternalId':
'The internal id of the file record (inside your NetSuite file cabinet) containing the SuiteScript code.',
  'export.netsuite.restlet.recordType':
'Use this field to specify which NetSuite record type you want to export.  You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the connection selected above. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'export.netsuite.restlet.searchId':
'Once you have a NetSuite Saved Search defined with all the data that you want to export then simply tell us which one it is here, and then it really is that simple.  Exporting data via NetSuite Saved Searches is one of the most popular features of the integrator.io platform!  If you are not familiar with NetSuite Saved Searches then please checkout the NetSuite help guides for a basic intro, and then the best way to become an expert fast is to just test them out in your own NetSuite account.  IMPORTANT: please be sure to always sort your NetSuite Saved Searches by Internal Id (and to also explicitly include the Internal Id column in the search results).  This sort is required to group consecutive search rows with the same Internal Id into individual logical records.  For example, one single sales order will output multiple search rows if there are multiple line items on the order, and the Internal Id column is what integrator.io uses to group all the rows (belonging to the same sales order) together.  If you cannot sort your NetSuite Saved Search by Internal Id then you will need to set Skip Grouping below to true, and please see the help text for Skip Grouping to learn more about that field.',
  'export.netsuite.restlet.hooks.batchSize': '',
  'export.netsuite.restlet.hooks.preSend.fileInternalId':
'The internal id of the file record (inside your NetSuite file cabinet) containing the SuiteScript code.',
  'export.netsuite.restlet.hooks.preSend.function':
'This very special hook gets invoked before records leave NetSuite.  This hooks is great because it runs inside NetSuite, and the entire SuiteScript API is at your disposal, and there are lots of performance benefits if you need to run dynamic NetSuite searches on your data.',
  'export.netsuite.searches.recordType':
'Use this field to specify which NetSuite record type you want to export.  You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the connection selected above. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'export.netsuite.searches.searchId':
'Once you have a NetSuite Saved Search defined with all the data that you want to export then simply tell us which one it is here, and then it really is that simple.  Exporting data via NetSuite Saved Searches is one of the most popular features of the integrator.io platform!  If you are not familiar with NetSuite Saved Searches then please checkout the NetSuite help guides for a basic intro, and then the best way to become an expert fast is to just test them out in your own NetSuite account.  IMPORTANT: please be sure to always sort your NetSuite Saved Searches by Internal Id (and to also explicitly include the Internal Id column in the search results).  This sort is required to group consecutive search rows with the same Internal Id into individual logical records.  For example, one single sales order will output multiple search rows if there are multiple line items on the order, and the Internal Id column is what integrator.io uses to group all the rows (belonging to the same sales order) together.  If you cannot sort your NetSuite Saved Search by Internal Id then you will need to set Skip Grouping below to true, and please see the help text for Skip Grouping to learn more about that field.',
  'export.netsuite.basicSearch.bodyFieldsOnly': 'Include only the body fields.',
  'export.netsuite.basicSearch.pageSize':
'Page size can be set on the basicSearch results fetched back from the NS.',
  'export.rest.relativeURI':
"The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/products' or '/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this export. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to refine the set of resources an API endpoint returns.",
  'export.rest.headers':
"In some rare cases, it may be necessary to include custom HTTP headers with your API requests.  The appropriate 'content-type' header is automatically added by integrator.io based on the mediaType value described in the connection associated with this request (typically 'application/json'). Note that if the authentication method described in the associated connection requires a header value, this will also be added automatically.  This header field is used in the rare case that an API requires additional headers other than these two.",
  'export.rest.postBody':
"Most HTTP/REST exports utilize GET requests that do not have an HTTP body. In some cases, such as RPC style API's an HTTP body is necessary to convey the details of the export request. If this is the case for the application you are integrating with, this field allows you to configure the content of the HTTP request body. Note that the integrator.io platform support handlebars templates to aid in the construction of the HTTP body. It is also possible to use helper method and field placeholders to pull-in and manipulate data passed into the export, or from the connection object itself. This button with launch an editor to make the process of constructing (and testing) your body templates easier.",
  'export.rest.pageArgument':
"This field only needs to be set if the page number URL query parameter used by the API is not 'page'. While the export is running, the page number query parameter gets updated automatically for each subsequent page request. Example: '/products?page=1', '/products?page=2', '/products?page=3’.",
  'export.rest.tokenPageArgument':
'Use this field to tell integrator.io which query parameter name to use for the next page token field when requesting the next page of data.',
  'export.rest.maxPagePath':
'Some APIs return the number of pages available in their response to resource requests. This optional field can be used to tell integrator.io how many pages to expect. Set the value to the JSON path of the field containing the max page count. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.rest.maxCountPath':
'Some APIs return the total number of resources available in their response to resource requests. This optional field can be used to tell integrator.io how many resources to expect. Set the value to the JSON path of the field containing the total resource count count. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.rest.skipArgument':
"This field only needs to be set if the skip number URL query parameter used by the API is not 'skip'. While the export is running, the skip number query parameter gets updated automatically  for each subsequent page request. Example: '/products?skip=100', '/products?skip=200', '/products?skip=300’.",
  'export.rest.once.relativeURI':
'The relative URI that will be used to mark records as exported.',
  'export.rest.once.method':
'The HTTP method that will be used to mark records as exported.',
  'export.s3.keyStartsWith':
'Enter the starting letters of the key using which the objects will be exported.\nA key is the unique identifier for an object within a bucket.\nFor example, in the URL http://doc.s3.amazonaws.com/2006-03-01/AmazonS3.wsdl, "doc" is the name of the bucket and "2006-03-01/AmazonS3.wsdl" is the key.',
  'export.s3.keyEndsWith':
"Use this field to specify a key postfix that will be used to filter which files in the S3 bucket that will be exported (vs not). For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be exported (like myFile-test.csv). Please note that you must specify the file extension for this filter to work correctly.",
  'export.http.successMediaType':
'Use this field to handle the use case where a successful HTTP response returns a different media type than the original HTTP request body sent.',
  'export.http.requestMediaType': 'Use this field to handle the use case where the HTTP request requires a different media type than what is configured on the connection.',
  'export.http.errorMediaType':
'Use this field to handle the use case where an unsuccessful HTTP response returns a different media type than the original HTTP request body sent.',
  'export.http.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/products' or '/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this export. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to refine the set of resources an API endpoint returns.",
  'export.http.unencrypted.restrictedReportType':
    'Check the box if the report to be fetched is of restricted type. Please see <a href="https://github.com/amzn/selling-partner-api-docs/blob/main/guides/en-US/use-case-guides/tokens-api-use-case-guide/tokens-API-use-case-guide-2021-03-01.md#restricted-report-types">here</a> to understand which report type(s) are restricted.',
  'export.http.method':
"The most common HTTP method used by APIs for the retrieval of resources is 'GET'. In some cases, RPC style or SOAP/XML APIs will require the use of the 'POST' HTTP method.  Both of these scenarios are supported by integrator.io.  If the POST method is used, typically the body of the HTTP request will contain filtering or selection criteria.  This information can be provided in the 'body' field. Refer to this field for more information.",
  'export.http.body':
'Typically exports will use an HTTP GET method, and do not require an HTTP request body.  That said, there are use cases where a different HTTP method is used, and/or a request body is required.  Use this field to define the HTTP request body that will get sent to the source application endpoint.',
  'export.http.headers':
"In some cases, it may be necessary to include custom HTTP headers with your API requests. As with the 'body' field, any value from the connection or export models can be references using {{placeholders}} with a complete path matching either the connection or export field.",
  'export.http.paging.method':
"Many APIs use paging to limit the amount of data returned in a single HTTP response. Use this field to tell integrator.io the paging method used by the API. For example, choose 'Next page token’ if the API returns a token field in the HTTP response body that must be used to access the next page of data. Choose 'Page number parameter' if the API uses a page number parameter in the relative URI to paginate results. Etc...",
  'export.delta':
"The {{lastExportDateTime}} field is automatically calculated based on the last time the flow ran and successfully exported data. This read-only datetime field can be referenced by other fields using handlebars. Example relative URI field: '/products?after={{lastExportDateTime}}'.",
  'export.paging.token':
"While the export is running, the read-only {{export.http.paging.token}} field gets updated automatically for each subsequent page request. This read-only token field can be referenced by other fields using handlebars. Example relative URI field: '/products?token={{export.http.paging.token}}'.",
  'export.paging.skip':
"While the export is running, the read-only {{export.http.paging.skip}} field gets updated automatically for each subsequent page request. This read-only counter field can be referenced by other fields using handlebars. Example relative URI field: '/products?offset={{export.http.paging.skip}}'.",
  'export.paging.page':
"While the export is running, the read-only {{export.http.paging.page}} field gets updated automatically for each subsequent page request. This read-only counter field can be referenced by other fields using handlebars. Example relative URI field: '/products?page={{export.http.paging.page}}'.",
  'export.http.paging.body':
'This field only needs to be set if subsequent page requests require a different HTTP request body than what is configured in the primary HTTP request body field.',
  'export.http.paging.skip':
'This field only needs to be set if the export should start at a specific skip number index other than 0.',
  'export.http.paging.page':
'This field only needs to be set if the export should start at a specific page number other than 0.',
  'export.http.paging.token':
'This field only needs to be set if the initial export request should contain a specific token value.',
  'export.http.paging.relativeURI':
'This field only needs to be set if subsequent page requests require a different relative URI than what is configured in the primary relative URI field.',
  'export.http.paging.pathAfterFirstRequest':
'This field only needs to be set if subsequent page requests return a different response structure, and the next page token field is located in a different place than the original request.',
  'export.http.paging.resourcePath':
'This field only needs to be set if subsequent page requests return a different response structure, and the records are located in a different place than the original request.',
  'export.http.paging.linkHeaderRelation':
'When the paging method is set to "Link Header", by default IO uses HTTP conventions to look for the next page url within a dedicated "link" header value. It is possible, within this link header, to include multiple urls facilitating page navigation forward, back, or even first or last. In cases where multiple values are found, integrator.io needs to know which to use. The convention for these "rel" (Relation) values is "prev", "next", "last" and "first", where "next" is default in integrator.io. Some APIs that use this paging mechanism may not comply to these defaults. As such, this field allows you to overriding the default "next" relation to a value used by the application you are connecting too. For more information on link headers, please refer <a href="https://tools.ietf.org/html/rfc5988">https://tools.ietf.org/html/rfc5988</a>.',
  'export.http.paging.lastPageStatusCode':
'This field only needs to be set if the HTTP status code for the last page is not 404.  For example, an API could return a generic 400 status code instead, and then use a field in the HTTP response body to indicate no more pages are available.',
  'export.http.paging.lastPagePath':
"This field only needs to be set if the API returns a field in the HTTP response body to indicate paging is complete. For example, if an API returns the field 'errorMessage' with the value 'No more pages' to indicate paging is done, then you would set this field to 'errorMessage' to tell integrator.io to check this field on each page response.",
  'export.http.paging.lastPageValues':
"Use this field to limit the exact values in the HTTP response body field that should be used to determine if paging is complete. For example, if an API returns the field 'errorMessage' with the value 'No more pages' to indicate paging is done, then you would set this field to 'No more pages'. To provide multiple values, use a comma-separated list.",
  'export.http.paging.maxPagePath':
'Some APIs return the total number of pages available in each of their page responses. This optional field can be used as a trigger to stop making page requests. This field tells integrator.io where to find the maximum page value within each page response, and when this page count is met, no more page requests will be made. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.http.paging.maxCountPath':
'Some APIs return the total number of resources available in each of their page responses. This optional field can be used as a trigger to stop making page requests. This field tells integrator.io where to find the total resource count within each page response, and when this resource count is met, no more page requests will be made. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.http.paging.urlPath':
'Use this field to tell integrator.io where in the HTTP response body to find the URL to use when requesting the next page of data.',
  'export.http.paging.tokenPath':
'Use this field to tell integrator.io where in the HTTP response body to find the token to use when requesting the next page of data.',
  'export.http.once.relativeURI':
'The relative URI that will be used to mark records as exported.',
  'export.http.once.method':
'The HTTP method that will be used to mark records as exported.',
  'export.http.once.body':
'The HTTP request body that will be used to mark records as exported.',
  'export.http.response.resourcePath':
"Use this field if the records returned by the API are not located at the root level of the HTTP response body. For example, an API could return records inside a container object like 'results.customers'.",
  'export.http.response.file.resourcePath':
"Use this field if the file returned by the API is not located at the root level of the HTTP response body. For example, an API could return files inside a container object like 'file.content'.",
  'export.http.response.successPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a successful request. For example, if the API always returns a 200 success HTTP status code, but then indicates success via a 'success' boolean field in the HTTP response body.",
  'export.http.response.fileURLPaths': 'Enter any fields in the HTTP response body that contain URLs that can be used to download these files. Separate multiple path values with a comma. The files can be passed as-is via blobs to the subsequent flow steps.',
  'export.http.response.successValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request succeeded. To provide multiple values, use a comma-separated list.',
  'export.http.response.blobFormat':
'Use this field to specify the encoding type of the files being transferred. The encoding information is needed to process binary data correctly.',
  'export.http.response.failPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a failed request. For example, if the API always returns a 200 success HTTP status code, but then indicates errors via an 'error.message' field in the HTTP response body.",
  'export.http.response.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request failed. To provide multiple values, please use a comma separated list.',
  'export.http.response.errorPath':
'This optional field is used to specify which field in the HTTP response body contains the detailed error message for the purpose of displaying the error on the error management dashboard.  If this field is not set, then the full HTTP response body will be used as the error message in the error management dashboard.',
  'export.rdbms.query': 'Enter a SQL query that retrieves the records you want to export from your source database.</br><b>Note</b>: For Delta exports, include a comparison to lastExportDateTime or currentExportDateTime in the query, as in the following examples:</br>Oracle SQL</br>SELECT * FROM TABLE_NAME </br>WHERE COLUMN_NAME > TO_TIMESTAMP({{lastExportDateTime}}, \'YYYY-MM-DD"T"HH24:MI:SS.ff3"Z"\')</br>MySQL</br>SELECT * FROM TABLE_NAME </br>WHERE COLUMN_NAME > {{lastExportDateTime}}',
  'snowflake.export.rdbms.query':
'Build the query command to query the database and retrieves a set of rows.',
  'export.rdbms.once.query':
"Please specify the query to update each record as exported in the database (i.e. integrator.io will make a request back into the database to set this field to true for all the records that were exported so that those same records are not exported again). For example, you can give the query like 'Update Employee set exported=true where id={ {data.id }}'. Here, 'Employee' is the table name, 'exported' is the boolean field to identify whether a record is exported or not, and 'id' is the unique identifier of the record.",
  'export.mongodb.method':
'Enter the method to use for querying documents from your MongoDB instance. For more information on the available methods please refer to the MongoDB documentation: https://docs.mongodb.com/manual/reference/method/js-collection/',
  'export.mongodb.collection':
'Enter the name of the MongoDB collection in your database that you would like to query from.  For example: orders, items, users, customers, etc...',
  'export.mongodb.filter':
'If you only want to export specific documents from your collection then please enter your filter object here. The value of this field must be a valid JSON string describing a MongoDB filter object in the correct format and with the correct operators. Refer to the <a href="https://docs.mongodb.com/manual/reference/operator/query/" target="_blank">MongoDB documentation</a> for the list of valid query operators and the correct filter object syntax.',
  'export.mongodb.projection':
'If you only want to return a subset of fields from each MongoDB document then please enter your projection object here. The value of this field must be a valid JSON string describing a MongoDB projection object in the correct format and with the correct operators (and cannot mix inclusions and exclusions). Refer to the <a href="https://docs.mongodb.com/manual/reference/method/db.collection.find/#find-projection" target="_blank">MongoDB documentation</a> for the expected projection object syntax and operators.',
  'export.dynamodb.region': 'Name of the DynamoDB region to the location where the request is being made. If not set, by default \'us-east-1\' is selected.',
  'export.dynamodb.tableName':
'Enter the name of the DynamoDB collection in your database that you would like to query from. For example: orders, items, users, customers, etc..',
  'export.dynamodb.expressionAttributeNames':
'An expression attribute name is a placeholder that you use in an Amazon DynamoDB expression as an alternative to an actual attribute name. An expression attribute name must begin with a pound sign (#), and be followed by one or more alphanumeric characters. Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'export.dynamodb.expressionAttributeValues':
' If you need to compare an attribute with a value, define an expression attribute value as a placeholder. Expression attribute values in Amazon DynamoDB are substitutes for the actual values that you want to compare—values that you might not know until runtime. An expression attribute value must begin with a colon (: and be followed by one or more alphanumeric character.  Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'export.dynamodb.keyConditionExpression':
'To specify the search criteria, you use a key condition expression—a string that determines the items to be read from the table or index.',
  'export.dynamodb.filterExpression':
'If you only want to export specific documents from your collection then please enter your filter object here. The value of this field must be a valid JSON string describing a DynamoDB filter object in the correct format and with the correct operators. Refer to the DynamoDB documentation for the list of valid query operators and the correct filter object syntax.',
  'export.dynamodb.projectionExpression':
'If you only want to return a subset of fields from each DynamoDB document then please enter your projection object here. The value of this field must be a valid JSON string describing a DynamoDB projection object in the correct format and with the correct operators. Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'export.dynamodb.onceExportPartitionKey': '',
  'export.dynamodb.onceExportSortKey': '',
  'export.hooks.preSavePage.function':
'This hook gets invoked at the very end of your export process, right before each page of data is saved and passed along to downstream applications. This hook can be used to modify, add, or delete records.',
  'export.hooks.preSavePage.scriptFunction':
'This hook gets invoked at the very end of your export process, right before each page of data is saved and passed along to downstream applications. This hook can be used to modify, add, or delete records.',
  'export.hooks.preSavePage._stackId':
'The stack that contains your preSavePage hook code.',
  'export.hooks.preSavePage._scriptId':
'The script record that contains your preSavePage hook function.',
  'export.file.rowsPerRecord': 'This setting has been deprecated in favor of the more powerful options in the <b>Sorting and grouping</b> section.',
  'export.file.groupByFields': "Select the fields you'll group, so each group of records returned by the application is treated as a single record downstream in your flow. For example, export records from a source or lookup, group the records based on a column value, and import each group as a journal entry in NetSuite, where each journal entry contains all the records in the group as line items. When grouping, the page size property dictates the maximum number of groups included in a single page. If the application does not sort the exported data, grouping may not work as expected.",
  'export.file.sortByFields': 'Enter one or more fields to use for sorting records.',
  'export.file.filedefinition.rules':
'File definition rules are used by our platform to understand how to parse custom files. The file parser helper allows you to modify our templated rules to solve more specific file parsing requirements. Within the editor, you can use the rules panel to describe how a custom file should be parsed into JSON records, and then you can use the sample file and output panels to test your rules.',
  'export.pgpdecrypt': 'Use this option to decrypt files. This option is enabled only when you have configured at least one cryptographic system in the connection and selected the parse file option. If it is unchecked, then decryption will not be performed when files are parsed.',
  'export.file.decompressFiles':
'If you’re exporting compressed files, set this field to <b>True</b>. Once you check this field, a dropdown field appears for you to choose the compression format',
  'export.file.decrypt': 'Select the algorithm to decrypt files. Make sure you choose the same algorithm that is used to encrypt the files.',
  'export.file.encoding':
'The file encoding indicates how the individual characters in your data are represented on the file system. The default encoding is utf-8. Depending on the source system of the data, the encoding can take on different formats. Current supported formats are: utf-8, win-1254 and utf-16le. If you do not know what encoding your data is, in most cases it will be utf-8.',
  'export.file.output':
'This field determines what type of information will be returned by the file transfer. For most usecases the "Records" option is desired. This option will read and parse your files for you, and return pages of records that can then be imported into other applications. The "Metadata" option will not process your files, but will instead return a record entry for just the filename and last modified date of each file in the specified directory. The "Blob Keys" option will transfer your raw files as-is into integrator.io storage without processing them, and will return a "blobKey" for each file that was successfully transferred; and then you can use the "blobKey" values that were returned in subsequent imports to tell integrator.io to transfer the copied files into other applications. For example, you might build a flow that exports all the files from an FTP directory as-is and then imports those same files into the NetSuite file cabinet.',
  'export.file.type':
'Please specify the type of files being transferred so that integrator.io will know how to parse your data. For example, if you are transferring CSV files (i.e. files containing Comma Separated Value data) then please choose CSV.  Please note that integrator.io does not care how your files are actually named, nor does it matter what file name extensions are being used.  For example, you can select CSV here for files with all sorts of different file name extensions (i.e. csvData.txt, csvData.dat, csvData.random), and integrator.io will parse them all the same with the CSV data parser.',
  'export.file.skipDelete':
"If this field is set to 'true' then integrator.io will NOT delete files from the transfer application after an transfer completes.  The files will be left on the transfer application, and if the transfer process runs again the same files will be transferred again.  For example, if you are transferring files from an FTP folder, and have this field set to true, then integrator.io will transfer all files on the FTP folder but leave them in the FTP folder, and if the transfer runs again then integrator.io will transfer the same files again.",
  'export.file.compressionFormat':
"Currently 'gzip' is the only compression format supported by integrator.io, please log a support ticket if you would like any other compression formats added.",
  'export.file.csv.columnDelimiter':
'Either select a common character from the list or enter your own freeform value with multiple characters allowed – such as <b>||</b> – in this field, depending on how the columns are uniformly separated in your sample CSV file. The default value is <b>Comma (,)</b> simply by convention; integrator.io does not dynamically determine the column delimiter for you.',
  'export.file.csv.rowDelimiter': 'The characters used to identify the end of a row.',
  'export.file.csv.keyColumns':
'If multiple rows of data represent a single object (sales order line items for example), it is possible to group these rows into a single transfer record. If this behavior is desired, this field should be used to provide 1 or more columns in the source data that should be used to group related records. Typically this would be the id column of the parent object. In our example above, this would be the sales order id.',
  'export.file.csv.hasHeaderRow':
'Check this checkbox if the files you are transferring contain a top level header row that is used for column names (and not actual data).',
  'export.file.csv.trimSpaces':
'Set this field to true if you would like to remove all leading and trailing whitespaces in your column data. Please note that header row values are not affected by this setting. Leading and trailing whitespaces in the header row (if one is present) are always trimmed. For example:\nHeader1 , Header 2,Header3 \nCol 11 , Col 12 , Col 13\nCol21, Col22, Col23 \n\n Would look like:\n[\n{ "Header1": "Col 11", "Header 2": "Col 12", "Header3": "Col 13" },\n{ "Header1": "Col21", "Header 2": "Col22", "Header3": "Col23" }\n]',
  'export.file.csv.rowsToSkip':
'In some rare occasions CSV files will contain multiple header rows that do not describe the columns. These header rows could for example contain the filename or date/time the file was created. Use this field if your file has header rows you wish to skip.',
  'export.file.xlsx.keyColumns':
'If multiple rows of data represent a single object (sales order line items for example), it is possible to group these rows into a single transfer record. If this behavior is desired, this field should be used to provide 1 or more columns in the source data that should be used to group related records. Typically this would be the id column of the parent object. In our example above, this would be the sales order id.',
  'export.file.xlsx.hasHeaderRow':
'Set this field to true if the files you are transferring contain a top level header row.  Saying this another way, if the very first row in the CSV files being transferred is reserved for column names (and not actual data) then set this field to true.',
  'export.exportData':
'Over here you can specify how you would like to export data.',
  'export.file.backupPath':
    'Specify the directory path of the google drive folder where files will be backed up after the successful transfer.',
  'export.azure.backupPath':
    'Specify the directory path of the Azure blob storage container where files will be backed up after the successful transfer.',
  'export.ftp.directoryPath':
"Use this field to specify the directory path of the FTP folder containing the files that you want to transfer.  For example, if you set this field to 'MySite/Orders' integrator.io will first look for a parent folder 'MySite', and then for a child folder 'Orders', and then transfer all files from the child folder 'Orders'.  integrator.io will transfer all files and also delete them from the folder once the transfer completes. Copies of the original files will be stored in integrator.io up to 30 days. You can also (optionally) configure integrator.io to leave files on the FTP server, or to only transfer files that match a certain 'starts with' or 'ends with' name pattern.",
  'export.ftp.fileNameStartsWith':
"Use this field to specify a file name prefix that will be used to filter which files in the FTP folder will be transferred (vs not).  For example, if you set this value to 'test' then only files where the name starts with 'test' will be transferred (like test-myFile.csv).",
  'export.ftp.fileNameEndsWith':
"Use this field to specify a file name postfix that will be used to filter which files in the FTP folder will be transferred (vs not).  For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be transferred (like myFile-test.csv).  Please note that you must specify the file extension for this filter to work correctly",
  'export.file.fileNameStartsWith':
"Use this field to specify a file name prefix that will be used to filter which files in the google drive folder will be transferred (vs not).  For example, if you set this value to 'test' then only files where the name starts with 'test' will be transferred (like test-myFile.csv).",
  'export.file.fileNameEndsWith':
"Use this field to specify a file name postfix that will be used to filter which files in the google drive folder will be transferred (vs not).  For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be transferred (like myFile-test.csv).  Please note that you must specify the file extension for this filter to work correctly",
  'export.azure.fileNameStartsWith':
"Use this field to specify a file name prefix that will be used to filter which files in the Azure blob storage container will be transferred (vs not).  For example, if you set this value to 'test' then only files where the name starts with 'test' will be transferred (like test-myFile.csv).",
  'export.azure.fileNameEndsWith':
"Use this field to specify a file name postfix that will be used to filter which files in the Azure blob storage container will be transferred (vs not).  For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be transferred (like myFile-test.csv).  Please note that you must specify the file extension for this filter to work correctly",
  'export.file.batchSize': 'Set this field to limit the number of files processed in a single batch request. Setting this field will not limit the total number of files you can process in a flow. This field allows you to optimize for really big files where bigger batches might experience network timeout errors vs. really small files where processing 1000 files in a single batch keeps the flow more performant. 1000 is the max value allowed.',
  'export.ftp.backupDirectoryPath': 'Specify the directory path of the FTP folder where files will be backed up after successful transfer.',
  'export.unencrypted.apiType': '<b>Selling Partner API (SP-API)</b>: The Selling Partner API is a REST-based API and is an evolution of the legacy Amazon Marketplace Web Service (MWS) APIs. It’s recommended you integrate using SP-APIs.<br><b>Marketplace Web Service API (MWS)</b>: Amazon Marketplace Web Service (Amazon MWS) is the legacy web service API.',
  'import.unencrypted.feedType': 'The type of the feed.',
  'import.unencrypted.feedOptions': 'Additional options to control the feed. These vary by feed type.',
  'export.s3.region':
  'The default Amazon S3 region is [us-east-1]. To change the region, select the region for this S3 account',
  'export.webhook.provider':
"Many popular webhooks have been exposed here for your convenience.  If you don't see the application that you need please log a support ticket so we can prioritize accordingly.  If you are creating your own webhook please choose 'Custom'.",
  'export.webhook.verify':
'Please specify the method that should be used to verify the authenticity of the data being sent to this webhook export.',
  'export.webhook.token':
'Generate a new token or enter your own token, which will be sent by the webhook origin so that integrator.io can authenticate that it is allowed to receive data from that endpoint. You should share this token only with the webhook provider.',
  'export.webhook.path':
"Please use this field to specify the JSON path of the field in the request body that will contain the token value.  For example, 'myAuth.token'.",
  'export.webhook.algorithm':
'Please specify which hash algorithm is being used (i.e. for the the HMAC values sent to this webhook export). If you need an algorithm not currently available in this list then please log a support ticket to submit an enhancement request.',
  'export.webhook.encoding':
'Please specify which encoding is being used (i.e. for the the HMAC values sent to this webhook export).',
  'export.webhook.key':
'Please provide the secret key that will be used to verify the authenticity of the data sent to this webhook export.  This key value should only be shared with the webhook provider, and ideally should be generated by some sort of industry standard password tool.',
  'export.webhook.header':
"Please use this field to specify the HTTP header field that will contain the HMAC value.  For example, 'X-MY-HMAC'.",
  'export.webhook.username':
'Basic auth requires both username and password. Please enter your username here. If you are not sure which username and password to use then please check with your webhook provider.',
  'export.webhook.password':
'Basic auth requires both username and password. Please enter your password here.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your password safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'export.webhook.successStatusCode':
'integrator.io returns a 204 HTTP status code for all successful webhook requests by default. Use this list to select an alternate successful HTTP status code for the listener.',
  'export.webhook.successMediaType':
'integrator.io uses JSON as the default media type for success responses. Use this list to select an alternate media type.',
  'export.webhook.successBody':
'integrator.io returns an empty response body message for all successful webhook requests by default. Use this field to customize an HTTP response body returned for successful requests made to the listener.',
  'export.salesforce.soql.query':
"Use the Salesforce Object Query Language (i.e. SOQL) to define what data you would like to export out of Salesforce.  For example: 'SELECT Id, Name FROM Account WHERE SendToBlah = TRUE'.  SOQL is an incredibly powerful query language with all sorts of capabilities, and lots of documentation and examples on the web.  If you need additional help understanding SOQL, or piecing together a specific query, then please contact Salesforce support.",
  'export.salesforce.id':
'To export raw files out of Salesforce, integrator.io needs to know the ID of the Salesforce record you want to export. You can hard code a specific file by specifying the ID directly. For example: 00530050000ibYc. Or, if the files being exported are dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the ID values. For example: myFileField.ID.',
  'export.salesforce.distributed.batchSize':
'When performing bulk operations create or update, you can use this setting to allow records to be exported in batches. You can provide any value between 4 and 200 to set how many records to export in each batch. Use this setting in combination with Page size to manage data size limits and concurrency.',
  'export.salesforce.distributed.skipExportFieldId':
'Select a checkbox field on this Salesforce sObject type. This checkbox will serve as a flag that integrator.io can set to true during a real-time export, so that this record will be ignored and not exported later if it is created or updated during a data sync. (This checkbox will be set to false – toggled off, or unchecked – after the flow runs; make sure that anyone setting this checkbox to true in Salesforce is aware that integrator.io may be updating it.)</br> <b>Skip export field ID</b> may be useful when you are updating a large set of records in Salesforce and you want to exclude selected records from being exported.</br>Another important application for this field is during a bidirectional sync flow between Salesforce and another system. Previously, an infinite loop could result when the system wrote back to the Salesforce record, again triggering a real-time export. Defining which field to skip avoids a second export, continuing with the next valid record.</br>',
  'export.wrapper.function':
'The name of the extension wrapper function in your code that needs to be invoked as part of the export process.',
  'export.wrapper.configuration':
'This field can be used to provide custom information which will be passed to the wrapper function whenever it is invoked. This can be useful if the same wrapper function is used for different exports and it needs to be configured differently per export.',
  'exports.previewData':
'This section allows you to verify that you have configured the request correctly and that the data is successfully retrieved. When exporting records, you can view the HTTP request, the HTTP response, and the number of records you specify in JSON format, along with any errors.',
  'flow._id':
'System generated primary unique identifier for your connection.  For API users, this value should be used for GET and PUT requests.',
  'flow.name':
'Name your flow so that other users can understand at a very high level what it is doing. The name you choose will show up on your job dashboard and also in email notifications.',
  'flow.description':
'Describe your flow in more detail here so that other users can understand the business problem you are solving, and also how your integration solution works. Be sure to highlight any nuances that a user who will make changes in the future might need to know about.',
  'flow.schedule':
'Your flow will be run on schedule according to this cron expression.',
  'flow.lastModified':
'System generated datetime to track the last time this resource was modified.',
  'flow._exportId':
'Unique identifier of the export created from where the data is exported',
  'flow._importId':
'Unique identifier of the import created where the data is going to be imported',
  'flow._integrationId':
"This field can only be set when a flow is first created, or when a flow belongs to the default system 'Standalone Flows' integration tile. To move a flow that already belongs to a specific integration tile please first 'Detach' it from that tile, and then this field can be set again to assign the flow to a new integration tile.",
  'flow._connectorId':
'If this connection was installed as part of an Integration App  (i.e. from the integrator.io marketplace), then this value will hold the _id value of the Integration App app that owns the connection.  Please note that for security reasons connections owned by an Integration App cannot be referenced outside the context of the Integration App, meaning that you cannot use any of these connections in the data flows that you build yourself.',
  'flow.disabled': 'Boolean value. If set, the flow will be in inactive state',
  'flow.timezone':
'Use this field to configure the time zone that the integrator.io scheduler should use to run your integration flow.',
  'flow._runNextFlowIds':
'Select one or more flows that you would like to run automatically whenever this flow completes. The next flow must be enabled, and it cannot be a realtime flow. (Note that the current flow may run again even though the next flow is in progress.) ',
  'flow.notifyOfFlowError': 'Choose Yes to <a href="https://docs.celigo.com/hc/en-us/articles/8961419557019" target="_blank">receive an email notification</a> whenever the flow encounters an error. <a href="https://docs.celigo.com/hc/en-us/articles/8864920211355-How-integrator-io-determines-when-to-email-an-error-notification" target="_blank">integrator.io checks for errors</a> every 15 minutes.',
  'flow.autoResolveMatchingTraceKeys': 'Enable <b>Auto-resolve errors with matching trace key</b> to resolve other open errors with the same <a href="https://docs.celigo.com/hc/en-us/articles/360060740672" target="_blank">trace key</a> (unique field identifier).',
  'flow.manageAliases': 'Use this page to see all of your aliases for this flow, as well as any integration-level aliases (inherited aliases). You can create a new alias for this flow (top right), or use the Actions menu to edit, copy, delete, or view details for a flow-level alias.  Inherited aliases are passed down to the flow from the integration. However, keep in mind that if you reference both a flow-level alias and an integration-level alias for a resource in a script, the flow-level alias will take precedence. Use the Actions menu for Inherited aliases to copy an alias or view its details. To create, edit, or delete one of these aliases, navigate to the integration instead and use the Alias tab. <a href="https://docs.celigo.com/hc/en-us/articles/4454740861979" target="_blank">Learn more about aliases</a>.',
  'flow.router.branchType': `Select the <a href="https://docs.celigo.com/hc/en-us/articles/7287177264795-Branch-flows-Add-flow-branching-" target="_blank">type of branching</a> based on how you want records to flow through the branches:
  <ul><li>If you select <b>First matching branch</b>, the branching conditions will be applied to a record sequentially based on the order of the branches. The record will only go through the first branch where the conditions are met.</li>
  <li>If you select <b>All matching branches</b>, the branching conditions will be applied to a record for all branches. The record will go through all the branches where the conditions are met.</li></ul>`,
  'flow.router.name': 'Name your branching router (optional) to make your flow more readable on the flow builder canvas.',
  'flow.routers.branches': 'Add branches and define branching conditions. You can change the order of a branch by dragging it up or down, except when <b>All matching branches</b> is selected.',
  'alias.aliasId': 'Enter a descriptive, unique name to use as the Alias ID. This is what you will use in scripts to refer to the resource. Use only letters, numbers, hyphens(-) and/or underscores(_). For example, shopify_flow_neworders or netsuite-connection2_prod',
  'alias.description': 'Enter a description that provides more context on how the resource is used in your integration.',
  'alias.resourceType': 'Select the type of resource this alias will reference (such as a flow or import). Once you select the type, you can choose from a list of resources matching this type.',
  'alias.resource': 'Select the specific resource for this alias to reference. For example, if you selected Connection as the Resource type and your integration has three connections, choose the one you want this alias to reference.',
  'iclient._id':
'System generated primary unique identifier for your iClient.  For API users, this value should be used for GET and PUT requests.',
  'iclient.lastModified':
'System generated datetime to track the last time this resource was modified.',
  'iclient.provider': 'Service for which the connection to be established.',
  'iclient._userId': 'Unique identifier of the user creating the iClient.',
  'iclient.clientId': 'Unique identifier created for the iClient',
  'iclient.clientSecret':
'Secret key for accessing the service used at the authorization along with clientId',
  'iclient.scope':
'An array providing the access permissions with respect to each resource.',
  'iclient.scopeDelimiter': 'Delimiter in the scope array.',
  'import._id':
'System generated primary unique identifier for your import.  For API users, this value should be used for GET, PUT and DELETE requests.',
  'import.name':
'Name your resource so that you can easily reference it from other parts of the application.',
  'import._connectionId':
'The specific connection you would like to use for your export or import.\nYou can pre-establish and save your connections using Menu > Connections. Each stored connection contains credentials along with other related information needed to access the desired application.\nIn addition, you can click the + icon beside this field to create a new connection.',
  'import.lastModified':
'System generated datetime to track the last time this resource was modified.',
  'import.uploadFile':
' Please provide a sample file that this transfer would need to process. We will use the sample file to auto-set various fields (where possible), and also help you map data in a subsequent step. The sample file that you provide does not need to be overly large (at max 5 records), but it should contain all the fields that you want to work with, and also be in the same format that the transfer will need to generate when running in a production capacity.',
  'import.traceKeyTemplate':
'Define a <a href="https://docs.celigo.com/hc/en-us/articles/360060740672" target="_blank">trace key</a> that integrator.io will use to identify a unique record for a parent-child record combination. You can use a single field such as {{{field1}}} or use a handlebar expression. When this field is set, you will override the platform default child record trace key field. The child record trace key template value will include the parent record trace key in the format ‘parent_record_trace_key - child_record_trace_key’.',
  'import.apiIdentifier':
"Every import that you create is assigned a unique handle that you can then use in your own application logic to invoke the import programmatically via the integrator.io API.  For example, your import identifier might be 'i662cb46', and you could invoke this import with a simple HTTP POST (with the data to be imported as a JSON array in the post body) to https://api.integrator.io/i662cb46",
  'import._integrationId':
'If this import was installed as part of an Integration App (i.e. from the integrator.io marketplace), then this value will be hold the _id value of the specific integration instance (a.k.a. integration tile) that owns the import.  Please note that for security reasons imports owned by an Integration App cannot be referenced outside the context of the specific integration tile that they belong to, meaning that you cannot use these imports in the data flows that you build yourself, nor can the same Integration App reference imports across different integration tiles.',
  'import._connectorId':
'If this import was installed as part of an Integration App (i.e. from the integrator.io marketplace), then this value will hold the _id value of the Integration App that owns the import.  Please note that for security reasons imports owned by an Integration App cannot be referenced outside the context of the Integration App, meaning that you cannot use any of these imports in the data flows that you build yourself.',
  'import.sampleData': 'Enter a sample destination record here so that <a href="https://www.celigo.com/ipaas-integration-platform/">integrator.io</a> can help you later map fields between source and destination applications. The sample destination record should ideally contain all fields that you want to process in this flow, and should follow the exact same formatting rules that the destination application/API requires.',
  'import.distributed':
'Boolean value, if set the resulting import would be NS Distributed Import and dependent fields to be set accordingly',
  'import.maxAttempts':
'Maximum number of retries in the event of request failure',
  'import.ignoreExisting':
'When importing new data, if it is possible for the data being imported to already exist in the import application, or if you are worried that someone might accidentally re-import the same data twice, you can use this field to tell integrator.io to ignore existing data.  It is definitely a best practice to have some sort of protection against duplicates, and this field is a good solution for most use-cases.  The only downside of using this field is the slight performance hit needed to check first if something exists or not.',
  'import.ignoreMissing':
'When updating existing data, if it is possible (or just harmless) for the data being imported to include stuff that does not exist in the import application, you can use this field to tell integrator.io to just ignore that missing data (i.e. so that unnecessary errors are not returned). If it is expected that all the data being imported always exist in the import application then it is better to leave this field unchecked so that you get an error to alert you that the data being imported is not what you expected.',
  'import.idLockTemplate':
"This field can be used to help prevent duplicate records from being submitted at the same time when the connection associated with this import is using a concurrency level greater than 1.  Saying this another way, there are fields on the connection record associated with this import to limit the number of concurrent requests that can be made at any one time, and if you are allowing more than 1 request at a time then it is possible for imports to override each other (i.e. a race condition) if multiple messages/updates for the same record are being processed at the same time.  This field allows you to enforce an ordering across concurrent requests such that imports for a specific record id will queue up and happen one at a time (while still allowing imports for different record ids to happen in parallel).  The value of this field should be a handlebars template that generates a unique id for each exported record (note: we are using the raw exported data when generating the ids -- before any import or mapping logic is invoked), and then with this id the integrator.io back-end will make sure that no two records with the same id are submitted for import at the same time.  One example, if you are exporting Zendesk records and importing them into NetSuite then you would most likely use '{{id}}' (the field Zendesk uses to identify unique records), and then no two records with the same Zendesk id value would import into NetSuite at the same time.",
  'import.dataURITemplate':
"When your flow runs but has data errors this field can be really helpful in that it allows you to make sure that all the errors in your job dashboard have a link to the target data in the import application (where possible).  This field uses a handlebars template to generate the dynamic links based on the data being imported.   Please note that the template you provide will run against your data after it has been mapped, and then again after it has been submitted to the import application, to maximize the ability to link to the right place.  For example, if you are updating a customer record in Shopify, you would most likely set this field to the following value 'https://your-store.myshopify.com/admin/customers/{{{id}}}'.",
  'import.netsuite_da.batchSize': 'NetSuite’s APIs only allow a certain number of API calls at a time, and each call costs so called points depending on the data, e.g. number of records, or number of lookups configured per record. If too much data is sent at any given time in a single page, then NetSuite might return errors stating that you’ve run out of points and hence your flow will fail. You can avoid this by managing the size of the data sent to NetSuite using this Batch size limit field. The batch size limit determines the number of records to be sent with each API call to NetSuite. This field is useful for certain flow configurations where it’s not possible to manage the page size for the source data. One example is one-to-many lookups, where each record will result in exponentially larger number of records being sent to the import. By setting a batch size limit, the results from the lookup will be sent to the import in batches where the maximum batch size will be per this field’s setting, and hence overloading the NetSuite APIs can be avoided.',
  'import.description':
'Describe your resource so that other users can quickly understand what it is doing without having to read through all the fields and settings. Be sure to highlight any nuances that a user should be aware of before using your resource in their flows. Also, as you make changes to the resource be sure to keep this field up to date.',
  'import.blobKeyPath':
'When you use integrator.io to sync documents, attachments, images, etc. (i.e. raw blob data) you first need a blob export defined in your flow to get the raw blob data from an external application and into integrator.io storage. You then need to make sure that you have a response mapping on your blob export for the blobKey value that integrator.io returns whenever blob data is successfully stored in integrator.io. Assuming these two things have been done, use this field to indicate the JSON path where you mapped the blobKey value in your data, and then integrator.io will use the blobKey value to get the file out of integrator.io storage and transfer it to the import application.',
  'import.deleteAfterImport':
'Set this field to true if you would like to delete the blob content which is intermittently stored during the transit. On successful import, intermittently stored blob content will be deleted.',
  'import.filter.rules':
'Important: only records where your filter expression evaluates to true will get processed by this import.  All other records will be marked as ignored.  Defining a filter on your import allows you to skip processing for specific records. For example, if you have an import that posts messages to Slack for all web orders that come in throughout the day you could add an import filter to instead only post orders that are above a certain amount. Please note that unlike export filters, import filters do not discard data traveling through your flow. Records that get ignored will still get passed along to subsequent processors in your flow.',
  'import.pgpencrypt': 'Use this cryptographic system to encrypt generated files.  This option is enabled only when you have configured at least one cryptographic system in the connection. If it is unchecked, then encryption will not be performed on generated files.',
  'import.file.encrypt': 'Select the algorithm to use to encrypt the files before transfer.',
  'import.file.pgp.symmetricKeyAlgorithm': 'Select the symmetric key algorithm to use for encryption.',
  'import.file.pgp.hashAlgorithm': 'The hashing algorithm to use when signing files. If this field is not set, then integrator.io will not sign files after encrypting them.',
  'import.file.filedefinition.rules':
'File definition rules are used by our platform to generate custom files. The file generator helper allows you to modify our templated rules to solve more specific file generation requirements. Within the editor, you can use the rules panel to describe how a custom file should be generated from the JSON records/rows being processed by your flow, and then you can use the sample flow data and generated file panels to test your rules.',
  'import.hooks.preMap': `You can use this hook to apply logic to the data within an import prior to going through the mapping process. Any manipulation of the data in this step only applies to the import that it is running on. <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/5926315530139-Import-hooks#preMapHook" target="_blank"/> Get more info</a>`,
  'export.hooks.preSavePage': `You can use this hook to format, filter, and perform logic on the data coming from your export before it moves on to the rest of your data flow. Logic that applies to the data at all steps of the integration should be done at this stage of the flow.<a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360039655111-Hooks-for-integrator-io#preSavePageHook" target="_blank"/> Get more info</a>`,
  'import.hooks.postResponseMap': `Invoke this function before the fields are mapped to their respective fields in the objects to be imported. You can use this to reformat the record’s field to anything you like. <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/5926315530139-Import-hooks#postResponseMapHook" target="_blank"/> Get more info</a>`,
  'import.hooks.postMap': `This hook gets invoked after the fields in the source objects have been mapped to their respective fields in the object to be imported. Post map hooks run on the mapped data in the import before it is submitted to the target system. <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/5926315530139-Import-hooks#postMapHook" target="_blank"/> Get more info</a>`,
  'import.hooks.postSubmit': `This hook gets invoked after the records are processed by the import. You can use this hook to further process imported objects and modify the response data received from import for success and error cases. Post submit hooks run after the record has been successfully synced to the target system, and prior to the flow moving on to the next step of the integration. <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/5926315530139-Import-hooks#postSubmitHook" target="_blank"/> Get more info</a>`,
  'import.hooks.postAggregate': `Invoke this function after the final aggregated file is uploaded to the destination app. Make sure to set the skipAggregation property to false for this hook to work. <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/5926315530139-Import-hooks#postAggregateHook" target="_blank"/> Get more info</a>`,
  'import.hooks.preMap.function':
"The name of the preMap hook function in your code that you want invoked. Please see <a href='https://github.com/celigo/integrator-extension/blob/master/README.md#hooks' target='_blank'>here</a> for the full documentation on hooks.",
  'import.hooks.preMap._stackId':
'The stack that contains your preMap hook code.',
  'import.hooks.preMap._scriptId':
'The script record that contains your preMap hook function.',
  'import.hooks.postMap.function':
"The name of the postMap hook function in your code that you want invoked. Please see <a href='https://github.com/celigo/integrator-extension/blob/master/README.md#hooks' target='_blank'>here</a> for the full documentation on hooks.",
  'import.hooks.postMap._stackId':
'The stack that contains your postMap hook code.',
  'import.hooks.postMap._scriptId':
'The script record that contains your postMap hook function.',
  'import.hooks.postSubmit.function':
"The name of the postSubmit hook function in your code that you want invoked. Please see <a href='https://github.com/celigo/integrator-extension/blob/master/README.md#hooks' target='_blank'>here</a> for the full documentation on hooks.",
  'import.hooks.postSubmit._stackId':
'The stack that contains your postSubmit hook code.',
  'import.hooks.postSubmit._scriptId':
'The script record that contains your postSubmit hook function.',
  'import.hooks.postAggregate.function':
"The name of the postAggregate hook function in your code that you want invoked. Please see <a href='https://github.com/celigo/integrator-extension/blob/master/README.md#hooks' target='_blank'>here</a> for the full documentation on hooks.",
  'import.hooks.postAggregate._stackId':
'The stack that contains your postAggregate hook code.',
  'import.hooks.postAggregate._scriptId':
'The script record that contains your postAggregate hook function.',
  'import.mapping': 'Mapping sub-schema',
  'import.netsuite.recordType':
'Use this field to specify which NetSuite record type you want to import.  You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the connection selected above. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'import.netsuite_da.recordType': 'Use this field to specify the NetSuite record type you would like to import. You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the NetSuite connection being used. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection being used, then you can use the refresh icon to regenerate the list.',
  'import.netsuite_da.internalIdLookup.expression': 'Use this field to define a lookup that integrator.io will use to determine if a record already exists in NetSuite or not. For example, if you are importing contact records and you have a unique email for each contact, then you can use this field to define a lookup to see if any contacts with the same email already exists in NetSuite. If needed, you can also define more complex lookups using AND and OR. For example, if you are importing item records you can define a lookup to see if any items exist with a specific itemid (i.e. sku) AND also belong to a specific vendor (i.e. because maybe sku by itself is not guaranteed to be unique, but sku plus vendor always is unique).',
  'import.netsuite.recordTypeId':
'Unique id associated with the recordType selected',
  'import.netsuite_da.operation': 'Please select <b>Add</b> if you are only importing new records into NetSuite.</br></br> Please select <b>Update</b> if you are only importing changes to existing records in NetSuite.</br></br>Please select <b>Add or update</b> if you want your import to be more dynamic such that (1) if an existing record is found in NetSuite then that record will be updated, or (2) if an existing record cannot be found in NetSuite then a new record will be created. When using just \'Add\' it is definitely a best practice to make sure you have some sort of protection in place against duplicate records. Probably the easiest way to add this protection is to use the \'Ignore Existing Records\' field. </br></br><b>Attach and Detach</b> can be used to define or remove a relationship between two records. For example, a Contact record can be associated with a Partner record, or an Opportunity record can be associated with a Customer record. You can also use the Attach/Detach operations to attach or detach a file to, or from, a record. Any file that is in the NetSuite file cabinet, for example a MS Word or Excel file or a PDF can be attached to any record other than a custom record.</br></br>The <b>Delete</b> operation will permanently delete records in your NetSuite account found using ”How can we find the records to delete?” lookup criteria. If a record is not found, an error will be thrown, which can be suppressed by marking the “Ignore missing records” checkbox. Typically no mappings are needed, but NetSuite Delete API supports “deletionreasoncode” and “deletionreasonmemo” to be set while deleting a record which can be set on the mappings. Note that NetSuite Delete operation is non-reversible and should be used with care. You can also choose to avoid accidental deletions by using the Update operation instead and make the record inactive.',
  'import.netsuite.retryUpdateAsAdd':
'Boolean value if set, on failure of any record update on NS, it will be retried as a add operation',
  'import.netsuite.customFieldMetadata':
'If the record is custom field, this json path contain the metadata information on that custom field.',
  'import.netsuite.internalIdLookup.extract': '',
  'import.netsuite.internalIdLookup.searchField': '',
  'import.netsuite.internalIdLookup.expression':
'Ex: \'[["email", "is", "{{email}}"], "AND", ["lastName", "is", "{{lastName}}"]]\'',
  'import.http.successMediaType':
'Use this field to handle the use case where a successful HTTP response returns a different media type than the original HTTP request body sent.',
  'import.http.requestMediaType':
'Use this field to handle the use case where the HTTP request requires a different media type than what is configured on the connection.',
  'import.http.errorMediaType':
'Use this field to handle the use case where an unsuccessful HTTP response returns a different media type than the original HTTP request body sent.',
  'import.http.relativeURI':
"The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/product' or '/bulkUpdate/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this import. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to pass extended information to an API endpoint.",
  'import.http.method':
"The most common HTTP method used by APIs for the creating resources is 'POST'. Updates typically use 'PUT'. In some cases, RPC style or SOAP/XML APIs will always use the 'POST' HTTP method.  All of these scenarios are supported by integrator.io.",
  'import.http.body': 'The field is used to define the exact HTTP request body that will get sent to the destination application endpoint.',
  'import.http.headers':
"In some cases, it may be necessary to include custom HTTP headers with your API requests. As with the 'body' field, any value from the connection or import models can be referenced using {{placeholders}} with a complete path matching either the connection or import field you require.",
  'import.http.response.resourcePath':
"Use this field if the records returned by the API are not located at the root level of the HTTP response body. For example, an API could return records inside a container object like 'results.customers'.",
  'import.http.response.resourceIdPath':
'Use this field to tell integrator.io where in the HTTP response body to find the id field for the record submitted. For batch requests, this path field is relative to each individual record returned. If this field is left blank, then integrator.io will automatically try to pick an id field for you.',
  'import.http.response.file.resourceIdPath':
'Use this field to tell integrator.io where in the HTTP response body to find the id field for the file submitted. If this field is left blank, then integrator.io will automatically try to pick an id field for you.',
  'import.http.response.successPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a successful request. For example, if the API always returns a 200 success HTTP status code, but then indicates success via a 'success' boolean field in the HTTP response body.",
  'import.http.response.successValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request succeeded. To provide multiple values, use a comma-separated list.',
  'import.http.response.errorPath':
'This optional field is used to specify which field in the HTTP response body contains the detailed error message for the purpose of displaying the error on the error management dashboard.  If this field is not set, then the full HTTP response body will be used as the error message in the error management dashboard.',
  'import.http.batchSize':
'This field only needs to be set if the API endpoint supports receiving batches of records in a single HTTP request. If left blank, this field defaults to 1.',
  'import.http.ignoreLookupName':
'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the lookup that will be used to test for the existence of a resource.',
  'import.http.ignoreExtract':
'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the extract path of a field within the exported resource to be used to test for the existence of a resource. In other words, this is the path to an identifier or some other field that would only be present if a resource already exists in the import system.',
  'import.http.response.failPath':
"This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a failed request. For example, if the API always returns a 200 success HTTP status code, but then indicates errors via an 'error.message' field in the HTTP response body.",
  'import.http.response.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine if the request failed. To provide multiple values, please use a comma separated list.',
  'import.http.ignoreEmptyNodes':
'Set this field to true if you want integrator.io to remove empty fields from the HTTP request body before submitting to the API.',
  'import.rdbms.bulkInsert.batchSize':
'BatchSize indicates number of records that will be imported in one request. The default value is 100. Please note that there is a query limit of 1 MB in the Snowflake. So, for larger values of batchSize, the number of records getting imported in a single request will be adjusted to the 1MB size limit.',
  'import.file.skipAggregation':
'By default, integrator.io will aggregate all the pages of data that get generated by an export into one (possibly large) file.  If you prefer multiple smaller files (vs one large file) then please set this field to true.',
  'import.file.type':
'Choose the type of file that you want to generate. For example, choose CSV if you are importing a flat, delimited text file, or XLSX for a binary Microsoft Excel file. The file name you specify can include a file extension, although it does not affect this file type setting. You’ll then be able to choose a sample file to define the record structure. See <a href="https://docs.celigo.com/hc/en-us/articles/360045305492" target="_blank">Import files to an FTP server</a> more information.',
  'import.file.encoding': 'The file encoding indicates how the individual characters in your data are represented on the file system. Leave this field blank if you do not know what the encoding format is. The default encoding is UTF-8 and the other supported format is: UTF-8, Windows-1252 and UTF-16LE',
  'import.file.compressionFormat':
"Currently 'gzip' and 'zip' are the only compression formats supported by integrator.io, please log a support ticket if you would like any other compression formats added.",
  'import.file.csv.columnDelimiter':
'Column delimiter to be used in the file. Ex: ",", "*", "|", etc...',
  'import.file.csv.rowDelimiter':
"Row delimiter to be used in the file. Ex: '\\n', '\\r\\n', '\\r' (Default is crlf)",
  'import.file.csv.includeHeader':
'Set this field to true to include a top level header row in your CSV file (i.e. the very first row in your CSV file will be a set of column names so that anyone reading the CSV file can quickly understand what each column represents).',
  'import.file.csv.customHeaderRows':
'In some rare cases it is necessary to include 1 or more custom header rows before the actual csv data. Use this field to add any such prefix rows.',
  'import.file.csv.wrapWithQuotes':
'Boolean value, when set all the values in the file are wrapped with quotes (Default is false)',
  'import.file.csv.replaceTabWithSpace':
'Boolean value, when set tabs in the content of the data (except columnDelimiters) are replaced with a space (Default is false)',
  'import.file.csv.truncateLastRowDelimiter':
'Select this option to prevent errors that may occur if a string value in the CSV file exceeds the maximum allowed length.',
  'import.file.csv.replaceNewlineWithSpace':
'Boolean value, when set new lines in the content of the data (except rowDelimiters) are replaced with a space (Default is false)',
  'import.as2.fileNameTemplate':
"Use this field to specify how the files being sent via AS2 should be named in the AS2 message header. You can type '{{{' to include a variable in your file name, such as timestamp, unique ID, and other AS2 metadata (consult the documentation for more details). For example, 'FileXYZ-{{{timestamp \"YY-MM-DD\" \"America/Los_Angeles\"}}}.txt' will create files with the following pattern: 'FileXYZ-16-06-30.txt' in America/Los_Angeles time. Or, 'FileXYZ-{{{random \"UUID\"}}}.txt' will upload files with the following pattern: 'FileXYZ-69368e91d9a440f79165b73afd46859d.txt', using the unique id (UUID) of the file. Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.as2.messageIdTemplate':
'This field is used to specify the format of a unique message identifier that can be automatically generated as part of the import and included in the AS2 message header. The field uses handlebars to access available variables. For example, {{dateFormat "ddMMyyyyHHmmssZ"-random@ connection.as2.as2Id _ connection.as2.partnerId',
  'import.as2.maxRetries':
'Use this field to determine how many times integrator.io will retry sending an EDI message in the event of receiving an AS2 error response. By default, messages failures will not be retried.',
  'import.salesforce.upsert.externalIdField':
'An External ID field in Salesforce is a custom field that has the External ID attribute set to true.  External ID fields should be used to store unique record identifiers from systems outside Salesforce.  External ID is required to perform Upserts.  If you need additional help understanding External IDs or creating a new External ID field in Salesforce then please contact Salesforce support, or check the Salesforce developer guides.',
  'import.salesforce.sObjectType': 'Use this field to specify which Salesforce sObject type you would like to import.  You can choose any standard sObject type (i.e. account, opportunity, contact) or any custom sObject type as long as the sObject type supports Salesforce triggers. Please note that this list of sObject types is also dependent on the permissions associated with the Salesforce connection being used. Also, if you add any new custom sObject types to your Salesforce account, or if there are any changes to the permissions associated with the connection being used, you can use the refresh icon to regenerate the list.',
  'import.salesforce.operation':
"Please select <b>Insert</b> if you are only importing new records into Salesforce.  When using just Insert it is definitely a best practice to make sure you have some sort of protection in place against duplicate records.  Probably the easiest way to add this protection is to use the 'Ignore Existing Records' field.</br></br>  Please select <b>Update</b> if you are only importing changes to existing records in Salesforce.</br></br>  Please select <b>Upsert</b> if you want your import to be more dynamic such that (1) if an existing record exists in Salesforce then that record will be updated, or (2) if an existing record does not exist then a new record will be created.</br></br>  Please select the <b>Delete</b> operation which will permanently delete records in your Salesforce account found using ”How can we find existing records?” lookup criteria. If a record is not found, an error will be thrown, which can be suppressed by marking the “Ignore missing records” checkbox.",
  'import.salesforce.idLookup.whereClause': "To determine if a record exists in Salesforce, define a SOQL query WHERE clause for the <b>sObject type</b> selected above. For example, if you are importing contact records with a unique email, your WHERE clause should identify contacts with the same email.</br></br>Handlebars statements are allowed, and more complex WHERE clauses can contain AND and OR logic. For example, when the product name alone is not unique, you can define a WHERE clause to find any records where the product name exists AND the product also belongs to a specific product family, resulting in a unique product record that matches both criteria.</br></br>To find string values that contain spaces, wrap them in single quotes, for example,</br>Name = 'John Smith'.",
  'import.salesforce.idLookup.extract':
'Please specify which field from your export data should map to External ID.  It is very important to pick a field that is both unique, and guaranteed to always have a value when exported (otherwise the Salesforce Upsert operation will fail). If sample data is available then a select list should be displayed here to help you find the right field from your export data.  If sample data is not available then you will need to manually type the field id that should map to External ID.',
  'import.salesforce.contentVersion.title':
'Title specifies the name or label of the Content Version record getting imported. Please enter title for your Content Version record getting imported. Or, if the title should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the title values. For example: myFileField.title.',
  'import.salesforce.contentVersion.pathOnClient':
"Please specify complete path for the document including the path extension in order for the document to be visible in the preview tab. For example 'test_doc.text'.",
  'import.salesforce.contentVersion.tagCsv':
'It is a text used to apply tags to a content version via the API for grouping the content version records.',
  'import.salesforce.contentVersion.contentLocation':
'Please enter the origin of the document\nValid values are:\n<b>S</b>—Document is located within Salesforce. Label is Salesforce.\n<b>E</b>—Document is located outside of Salesforce. Label is External.\n<b>L</b>—Document is located on a social network and accessed via Social Customer Service. Label is Social Customer Service.',
  'import.salesforce.document.name':
"Document name specifies the name or label of the document record getting imported to Salesforce. Please enter the name (e.g. 'temp.text') for your document that you want to import. Or, if the name should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the ID values.",
  'import.salesforce.document.folderId':
'All documents in Salesforce must be imported/uploaded to a specific folder. Please enter the folder id where you want to upload your documents. Or, if the folder should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the folder id values. For example: myFileField.folderID.',
  'import.salesforce.document.contentType':
'The content type header is used by clients to tell the server the type of content of the documents getting imported. Please specify content type of documents e.g. application/html, application/pdf, etc. Or, if the content type should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the content type values. For example: myFileField.contentType.',
  'import.salesforce.document.developerName':
'Developer name is the unique name of the object in the API. This name can contain only underscores and alphanumeric characters, and must be unique in your org. It must begin with a letter, not include spaces, not end with an underscore, and not contain two consecutive underscores. In managed packages, this field prevents naming conflicts on package installations. With this field, a developer can change the object’s name in a managed package and the changes are reflected in a subscriber’s organization. If the developer name should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the developer name values. For example: myFileField.developerName.',
  'import.salesforce.document.isInternalUseOnly':
'Indicates whether the document is only available for internal use (true) or not (false).',
  'import.salesforce.document.isPublic':
'Indicates whether the document is available for external use (true) or not (false).',
  'import.salesforce.attachment.id': '',
  'import.salesforce.attachment.name':
"Attachment name specifies the label shown for the file imported to the a sObject record in Salesforce as an attachment. Please specify the name (e.g. 'temp.text') for your attachment that you want to import. Or, if the name should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the ID values. For example: { { myFileField.name}}.",
  'import.salesforce.attachment.parentId':
' Parent Id is the record Id in Salesforce to which you want to attach your attachments. Please enter the record id of the record to which you want to upload the attachments. Or, if the parent should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the parent id values. For example: myParentField.id.',
  'import.salesforce.attachment.contentType':
'The content type header is used by clients to tell the server the content type of the attachments that are being imported. Please specify content type of attachment e.g. application/html, application/pdf, etc.. Or, if the type should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the content type values. For example: myFileField.contentType.',
  'import.salesforce.attachment.description':
'Please enter a description for the attachment getting imported. Maximum size allowed is 500 characters. Or, if the description should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the description values. For example: myFileField.description.',
  'import.salesforce.attachment.isPrivate':
" This indicates whether this record is viewable only by the owner and administrators (true) or viewable by all otherwise-allowed users (false). During a create or update call, it is possible to mark an Attachment record as private even if you are not the owner. This can result in a situation in which you can no longer access the record that you just inserted or updated. Label is Private. Attachments on tasks or events can't be marked private.",
  'import.ftp.directoryPath':
"Use this field to specify the directory path of the FTP folder where you want files to be transferred.  For example, if you set this field to 'MySite/Items' integrator.io will first look for a parent folder 'MySite', and then for a child folder 'Items', and then transfer all files into this child folder 'Items'.",
  'import.ftp.fileExtension':
"This field can be used to include a specific file name extension to all files being generated and transferred to an FTP site.  For example, if you choose '.csv' then all files being transferred to the FTP site will include the extension '.csv' in their file name (i.e. FileXYZ-16-06-30.csv). Please note that this field is only relates to the file's name, and does not dictate the type of data being generated (which is set via a different field).  Saying this another way, although not recommended you could generate json files but use a '.csv' extension for the file names.",
  'import.file.fileName':
"Use this field to specify how the files being uploaded to the google drive site should be named. You can type '{{{' to include a predefined timestamp template in your file name. For example, 'FileXYZ-{{{timestamp \"YY-MM-DD\" \"America/Los_Angeles\"}}}.txt' will upload files with the following pattern: 'FileXYZ-16-06-30.txt' in America/Los_Angeles time.  Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.ftp.fileName':
"Use this field to specify how the files being uploaded to the ftp site should be named. You can type '{{{' to include a predefined timestamp or unique file identifier in your file name. For example, 'FileXYZ-{{{timestamp \"YY-MM-DD\" \"America/Los_Angeles\"}}}.txt' will upload files with the following pattern: 'FileXYZ-16-06-30.txt' in America/Los_Angeles time, Or, 'FileXYZ-{UUID}.txt' will upload files with the following pattern: 'FileXYZ-69368e91d9a440f79165b73afd46859d.txt', using the unique id (UUID) of the file. Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.ftp.inProgressFileName':
'If the destination folder where your file is being generated is also being watched by another service, it may be necessary to "hide" the file being generated by integrator.io until it completes.  This field is used to tell our platform to write the file under a temporary filename while the write opperation is in progress. Upon completion, integrator.io will rename this file to the intended filename defined by the "fileName" field.',
  'import.file.batchSize':
'Set this field to limit the number of files processed in a single batch request. Setting this field will not limit the total number of files you can process in a flow. This field allows you to optimize for really big files where bigger batches might experience network timeout errors vs. really small files where processing 1000 files in a single batch keeps the flow more performant. 1000 is the max value allowed.',
  'import.ftp.backupDirectoryPath': 'Specify the directory path of the FTP folder where files will be backed up after successful transfer.',
  'import.ftp.XMLDocument': 'This field is used to define the XML document that will get sent to the destination application endpoint.',
  'import.ftp.blobUseTempFile': 'Check this box if the destination folder where your file is being generated is also being watched by another service. If checked, integrator․io will "hide" the file being generated until the upload is complete.',
  'import.googledrive.directoryPath':
'Specify google drive folder containing the files to be transferred.  For example, if you set this field to \'MySite/Items\'. <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will first look for a parent folder \'MySite\', and then for a child folder \'Items\', and then transfer all files into folder \'Items\'',
  'import.box.directoryPath':
'Enter the relative path to the Box directory that will store the imported files.',
  'import.dropbox.directoryPath':
'Enter the relative path to the Dropbox directory that will store the imported files.',
  'import.azure.containerName':
'Specify the Azure blob storage container that has the files to be transferred. <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will transfer all files and also delete them from the folder once the transfer completes. You can also (optionally) configure <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> to leave files in the folder or transfer files that match a certain \'starts with\' or \'ends with\' file name pattern.',
  'import.azure.fileName':
"Use this field to specify how the files being uploaded to the Azure blob storage container should be named. You can type '{{{' to include a predefined timestamp template in your file name. For example, 'FileXYZ-{{{timestamp \"YY-MM-DD\" \"America/Los_Angeles\"}}}.txt' will upload files with the following pattern: 'FileXYZ-16-06-30.txt' in America/Los_Angeles time.  Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.file.backupPath':
'Specify the directory path of the google drive folder where files will be backed up after the successful transfer.',
  'import.box.backupPath':
'Enter the relative path to the Box directory that will store backup files.',
  'import.dropbox.backupPath':
'Enter the relative path to the Dropbox directory that will store backup files.',
  'import.azure.backupPath':
'Specify the directory path of the Azure blob storage container where files will be backed up after the successful transfer.',
  'import.s3.region':
'The default Amazon S3 region is [us-east-1]. To change the region, select the region for this S3 account',
  'import.s3.bucket':
'Name of the bucket in S3, where you want file to be saved',
  'import.s3.backupBucket': 'Specify the bucket name where files will be backed up after successful transfer.',
  'import.s3.fileKey': 'Name of the file',
  'import.s3.serverSideEncryptionType': 'Use this field to instruct Amazon S3 to server-side encrypt files using Amazon S3 managed keys (SSE-S3). Please note that integrator.io also supports the ability to encrypt files before they are sent to Amazon S3.',
  'import.wrapper.function':
'The name of the extension wrapper function in your code that needs to be invoked as part of the import process.',
  'import.wrapper.configuration':
'This field can be used to provide custom information which will be passed to the wrapper function whenever it is invoked. This can be useful if the same wrapper function is used for different exports and it needs to be configured differently per import.',
  'import.mongodb.method':
'Enter the method to use for adding or updating documents in your MongoDB instance. For more information on the available methods please refer to the <a href="https://docs.mongodb.com/manual/reference/method/js-collection/" target="_blank">MongoDB documentation.</a>',
  'import.mongodb.collection':
'Enter the name of the MongoDB collection in your database that you would like to query from.  For example: orders, items, users, customers, etc...',
  'import.mongodb.filter':
'If you want to update documents in your MongoDB instance please enter a filter object to find existing documents here. The value of this field must be a valid JSON string describing a MongoDB filter object in the correct format and with the correct operators. Refer to the <a href="https://docs.mongodb.com/manual/reference/operator/query/" target="_blank">MongoDB documentation</a> for the list of valid query operators and the correct filter object syntax.',
  'import.mongodb.document':
'By default integrator.io will create new documents in your MongoDB instance using the raw JSON data returned by the exports running in your flow (or the raw JSON data that you submitted via the integrator.io API). If you want to modify the data before it is added to MongoDB (for example, using handlebars to convert timestamps to Dates) then enter a JSON string describing the expected document object structure in this field. The value of this field must be a valid JSON string describing a MongoDB document.',
  'import.mongodb.update':
'Enter the update object that specifies the fields to modify when updating documents in your MongoDB instance. The value of this field must be a valid JSON string describing a MongoDB update object in the correct format and with the correct operators. Refer to the <a href="https://docs.mongodb.com/manual/reference/operator/update/" target="_blank">MongoDB documentation</a> for the list of valid update operators and the correct update object syntax. If this field is left blank then the default update object of { "set": <exportRecordData> } will be used.',
  'import.mongodb.upsert':
'Set this field to true if you want MongoDB to dynamically create new documents when nothing is found with the provided filter.  Set this field to false (i.e. the default) if you want MongoDB to ignore documents that cannot be found with the provided filter.',
  'import.mongodb.ignoreExtract':
'If this import has either the Ignore Missing or Ignore Existing flags set to true, this field is used to identify the extract path of the field within the exported resource to be used to test for the existence of the resource. In other words, this is the path to an identifier or some other field that would only be present if a resource already exists in the import system.',
  'import.mongodb.ignoreLookupFilter':
'If you are adding documents to your MongoDB instance and you have the Ignore Existing flag set to true please enter a filter object here to find existing documents in this collection. The value of this field must be a valid JSON string describing a MongoDB filter object in the correct format and with the correct operators. Refer to the <a href="https://docs.mongodb.com/manual/reference/operator/query/" target="_blank">MongoDB documentation</a> for the list of valid query operators and the correct filter object syntax.',
  'import.dynamodb.region': 'Name of the DynamoDB region to the location where the request is being made. If not set, by default \'us-east-1\' is selected.',
  'import.dynamodb.method': '<b>putItem: </b>Creates an item or replaces an old item with a new item.<br><b> updateItem: </b>Edits an existing item’s attributes or adds a new item to the table if it does not already exist.',
  'import.dynamodb.tableName':
'Enter the name of the DynamoDB collection in your database that you would like to query from. For example: orders, items, users, customers, etc..',
  'import.dynamodb.partitionKey':
'The primary key that uniquely identifies each item in an Amazon DynamoDB table can be simple (a partition key only) or composite (a partition key combined with a sort key). Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'import.dynamodb.sortKey':
'In an Amazon DynamoDB table, the primary key that uniquely identifies each item in the table can be composed not only of a partition key, but also of a sort key. Refer to the DynamoDB documentation for the expected projection object syntax and operators',
  'import.dynamodb.itemDocument': '',
  'import.dynamodb.updateExpression': '',
  'import.dynamodb.conditionExpression':
'To specify the search criteria, you use a key condition expression—a string that determines the items to be read from the table or index.  Filter Expression - If you only want to export specific documents from your collection then please enter your filter object here. The value of this field must be a valid JSON string describing a DynamoDB filter object in the correct format and with the correct operators. Refer to the DynamoDB documentation for the list of valid query operators and the correct filter object syntax.',
  'import.dynamodb.expressionAttributeNames':
'An expression attribute name is a placeholder that you use in an Amazon DynamoDB expression as an alternative to an actual attribute name. An expression attribute name must begin with a pound sign (#), and be followed by one or more alphanumeric characters. Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'import.dynamodb.expressionAttributeValues':
' If you need to compare an attribute with a value, define an expression attribute value as a placeholder. Expression attribute values in Amazon DynamoDB are substitutes for the actual values that you want to compare—values that you might not know until runtime. An expression attribute value must begin with a colon ( and be followed by one or more alphanumeric character. Refer to the DynamoDB documentation for the expected projection object syntax and operators.',
  'import.dynamodb.ignoreExtract': '',
  'import.previewAndSend': `Toggle the Preview/Send button to either preview the request that will be sent to the destination application, or manually send requests to the destination application.</br></br>
  <ul><li> Preview – Click Preview to see the HTTP request constructed with a sample record from your flow data, according to your import configurations.</li></br></br>
  <li>Send – Click Send to initiate an import request to the destination application and view its HTTP request, response, and parsed output.</li></ul>`,
  'integration._id':
'System generated primary unique identifier for your integration.  For API users, this value should be used for GET and PUT requests.',
  'integration.name':
'Name your integration so that you can easily reference it from other parts of the application.',
  'integration.lastModified':
'System generated datetime to track the last time this resource was modified.',
  'integration.description':
'Describe your integration here so that other users can quickly understand the high level business problems being solved. Be sure to highlight any nuances that other users might need to know in order to work in this integration.',
  'integration._connectorId':
'If this flow belongs to a connector, this value will be hold the id of that connector.',
  'integration.mode':
'Field that determines the mode of the integration i.e. install, settings, uninstall',
  'integration.settings':
'Configuration of the integration that is persisted in the database',
  'integration.version':
'If this flow belongs to a connector, this value will be hold the id of that connector.',
  'integration.tag': '.',
  'integration.updateInProgress':
'Flag which indicates if an update is in progress.',
  'integration.install':
'If this flow belongs to a connector, this value will be hold the id of that connector.',
  'me.name':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'me.email':
'Email is a very important field. Password reset links, product notifications, subscription notifications, etc. are all sent via email. It is highly recommended that you take the time to secure your email, especially if you are integrating sensitive information with your integrator.io account.',
  'me.password':
'There are minimum password requirements that all integrator.io users must satisfy, but we highly recommend using a password management app to auto generate a truly random, complex password that no one can remember or guess, and then rely solely on your password management app to sign you in to integrator.io.',
  'me.company':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'me.role':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'me.phone':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'me.timezone':
'Use this field to configure the time zone that you want dates and times to be displayed in your integrator.io account. This field is also used by the integrator.io scheduler to run your integration flows at the correct time of day based on your time zone.',
  'me.developer':
"Turning on this setting will expose developer centric fields in the integrator.io UI. For example, when defining an 'Export' or an 'Import' there are 'Hooks' fields available in the UI where custom code can be configured.",
  'script._id': 'System generated unique identifier for this script.',
  'script.name':
'Please name your script record so that you can easily reference it from other parts of the application.',
  'script.description':
'Please describe your script so that other integrator.io users can quickly understand what it does and how it works.',
  'stack.name':
'Enter a distinguishable name for the stack you are creating.',
  'stack.type':
'The environment in which your integrator-extension code is hosted. Currently, you can run your code in two different ways i.e. on your own server environment or as a micro-service on AWS Lambda. The server environment could be a single server or a set of servers behind a load balancer.',
  'stack.server.hostURI':
'The baseURI of the integrator-extension server/load-balancer where you code is hosted.',
  'stack.lambda.accessKeyId':
'Access Key Id of the IAM User who has access to your Lambda function.',
  'stack.lambda.secretAccessKey':
'Secret Access Key of the IAM User who has access to your Lambda function.',
  'stack.lambda.awsRegion':
'AWS Region in which your Lambda function will be executed.',
  'stack.lambda.functionName': 'Name of your AWS Lambda function.',
  'stack.lambda.language': 'Language of the AWS Lambda Function.',

  // Ui help text generation
  // #region UI help text
  'export._applicationId':
"This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors.\nIf you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'export.executionType': '',
  'export.overrideDataURITemplate':
'For applications like NetSuite and Salesforce, integrator.io will by default try to generate links for any records that fail to export and then display those links in your job dashboard.  If you prefer to define your own custom links then please use this handlebars field to override the default functionality.  For example, if you are exporting sales orders but instead want the errors to link to customers, you could use the following.  "https://system.na1.netsuite.com/app/common/entity/custjob?id={{{entity}}}"',
  'export.csvFile':
'Please select a file from your local computer that you would like to import. The maximum file size allowed is currently 100 MB. If you need to import anything larger than this please log a support ticket, or as a work around you can break your larger files into separate smaller ones.',
  'export.salesforce.distributed.requiredTrigger': 'A Salesforce trigger is required per sObject type to facilitate real-time exports.  Please copy the base trigger code provided in this field, and then configure the trigger to run in your Salesforce account.  You can change the logic in the trigger however is needed to meet specific business requirements.',
  'export.uploadFile':
'Please provide a sample file that this transfer would need to parse when the flow runs.  This sample file will be used to help you configure the file parser options, and it will also be used to help you map data in subsequent steps in your flow.  The sample file does not need to be overly large, but it should contain all possible fields that your flow needs to work with.',
  'export.salesforce.distributed.referencedFields': 'Use this setting to add additional fields to the export data defined as lookup fields on the sObject on Salesforce. Ex: Account is a lookup field on Opportunity. This setting allows users to pull data from the reference fields (such as Name, AccountNumber) on the Account sObject.',
  'export.salesforce.distributed.relatedLists': 'Use this setting to add additional fields from the related/sublist sObject to the export data defined on the sObject on Salesforce. Ex: Contact sObject is a sublist sObject for an Account. This setting allows users to pull data from sublist fields such as Name, Email and Department from all Contact records related to an Account record. Users can also use filters to only pull filtered Contacts belonging to a specific Department.',
  'export.salesforce.distributed.qualifier': 'Use this field to further refine which sObjects you would like to export based on fields and their values (i.e. by looking at the sObjects before it is exported and evaluating simple conditional expressions to decide if the record should be exported or discarded).  For example, if you are exporting leads you can use this field to only export leads that belong to a specific lead source, or if you are exporting opportunities you can use this field to only export opportunities that exceed a certain amount.  You can also perform more complex expressions using AND and OR.  For example, if you are exporting leads you can use this field to only export leads belonging to a specific lead source AND tagged with a specific competitor.',
  'export.http-headers':
'Click this button to specify any custom HTTP header name and value pairs which will be added to all HTTP requests. Note that in most cases our platform will auto-populate common headers such as "content-type" (based of the media type of the request), or the "Authorize" header (used if your application authenticates using tokens in the header). Unless your HTTP request fails or does not return expected results, there is no need to use this feature. In some rare cases, it may be necessary to add other application specific headers that the integrator.io platform does not manage. An example of this would be adding an "x-clientId" or any other application specific header. These would be documented in the API guide of the Application you are integrating with.',
  'export.fixedWidthFormat':
'Please select the file format that most closely matches your needs. If the exact format is not found, select the closest template. You will have an opportunity to modify the rules within this template by using the “File Definition Editor” below.',
  'export.outputMode':
'Do you need to parse CSV, XML, JSON, etc... files into records before sending them to other applications, or should the files simply be transferred raw as-is (i.e. PDFs, JPGs, etc...)?',
  'export.fileMetadata':
'Check this box if you ONLY need to transfer metadata about the files, but not the files themselves.',
  'export.ediFormat':
'Please select the file format that most closely matches your needs. If the exact format is not found, select the closest template. You will have an opportunity to modify the rules within this template by using the “File Definition Editor” below.',
  'export.filedefinitionRules':
'File Definition Rules are used by our platform to understand how to extract data from your EDI file. The result of evaluating these rules against your EDI files are JSON records, which can then be used anywhere in your integration. \n Once you have selected a template that most closely matches your needs, this editor can be used to modify (if needed) the parsing rules in the stock template to your specific needs. If no template is available that meets your needs, this editor can also be used to write your own “file definition” from scratch. \n Within the editor, the Available Resources pane holds all the raw EDI file export. The File Definition Rules pane describes how the available resources should be converted to JSON. The Generated Export pane shows the generated JSON which the platform will work with following the export, based on the defined rules.',
  'export.file.csv.hasMultipleRowsPerRecord':
'Select this checkbox, if your CSV or XLSX contains multiple records that can be grouped together. For example, line items of a sales order.\nNote: This is applicable only for CSV and XLSX files.',
  'export.file.fileDefinition.resourcePath':
'In some cases, you may not require all the data within the parsed EDI file. You can use this optional field to select where the data you are interested in is located within the JSON object generated by your File Definition Rules. The format of this field is a JSON path. An example would be, ’N1.N3’.',
  'export.file.extractFile':
'If the files you are exporting are in a compressed format then please set this field to true.',
  'export.netsuite.apiType': '',
  'export.netsuite.api.type': 'NetSuite supports two different API types: RESTlet and Web Services. The RESTlet API is recommended because it is newer, more user friendly, and much easier to get started with. It also supports greater levels of concurrency when using just a regular NetSuite license (i.e. a license that does not have NetSuite\'s SuiteCloud Plus enabled), and the RESTlet API enables more advanced capabilities like the ability to define a preSend hook in NetSuite using SuiteScript, or to support more performant and robust \'Once\' type exports. The Web Services API is a good fit when you\'ve purchased a NetSuite SuiteCloud Plus license and you also need to export very large amounts of data. The Web Services API is the only option available if you cannot install our integrator.io bundle in your NetSuite account. To completely maximize the amount of data that can be exported from a single NetSuite license you would use a combination of both RESTlet and Web Services API based exports.',
  'export.netsuite.distributed.frameworkVersion': 'Choose a NetSuite SuiteScript API version for configuring your step. When selecting SuiteApp SuiteScript 2.x or 1.0, the Celigo integrator.io SuiteApp must already be installed in your NetSuite account. Or for SuiteBundle SuiteScript 1.0, the Celigo integrator.io bundle must already be installed in your NetSuite account.Read more about the <a href="https://docs.celigo.com/hc/en-us/articles/360047138512" target="_blank">new SuiteScript 2.x APIs.</a>',
  'export.netsuite.restlet.restletVersion': 'Choose a NetSuite SuiteScript API version for configuring your step. When selecting SuiteApp SuiteScript 2.x or 1.0, the Celigo integrator.io SuiteApp must already be installed in your NetSuite account. Or for SuiteBundle SuiteScript 1.0, the Celigo integrator.io bundle must already be installed in your NetSuite account.Read more about the <a href="https://docs.celigo.com/hc/en-us/articles/360047138512" target="_blank">new SuiteScript 2.x APIs.</a>',
  'export.netsuite.restlet.markExportedBatchSize': 'This is only applicable for Export type Once. The recommended range is 1 to 100 (100 is the default). Set the value to a lower number in case Export type once is failing due to slow NetSuite account/connection',
  'import.netsuite_da.restletVersion': 'Choose a NetSuite SuiteScript API version for configuring your step. When selecting SuiteApp SuiteScript 2.x or 1.0, the Celigo integrator.io SuiteApp must already be installed in your NetSuite account. Or for SuiteBundle SuiteScript 1.0, the Celigo integrator.io bundle must already be installed in your NetSuite account.Read more about the <a href="https://docs.celigo.com/hc/en-us/articles/360047138512" target="_blank">new SuiteScript 2.x APIs.</a>',
  'export.netsuite.recordType':
'Use this field to specify the NetSuite record type you would like to export. You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the NetSuite connection being used. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection being used, then you can use the refresh icon to regenerate the list.',
  'export.netsuite.sublists':
'In order to keep the time it takes to save a record in NetSuite lightening fast, the default behavior for a real-time export is to ONLY include body level fields (like name, phone and email for a customer record).  If you do need to export sublist data (like the addresses for a customer,  or the line items in a sales order, or basically any data that is displayed in the NetSuite UI as a list) then you need to explicitly specify that here in this field.  Also, when including sublist data please keep in mind that each sublist typically requires an extra query to NetSuite to get the extra data, and while each individual query is relatively fast, if you are exporting lots of different sublists it can slow down the time it takes so save a record in NetSuite (i.e. when you click save for a record that has a real-time export deployed that also includes lots of different sublists it might take a little longer for the save to complete due to the extra queries).',
  'export.netsuite.qualifier':
'Use this field to further refine which records you would like to export based on fields and their values (i.e. by looking at the record before it is exported and evaluating simple conditional expressions to decide if the record should be exported or discarded).  For example, if you are exporting customers you can use this field to only export customers that belong to a specific subsidiary, or if you are exporting sales orders you can use this field to only export sales orders that exceed a certain amount.  You can also perform more complex expressions using AND and OR.  For example, if you are exporting items you can use this field to only export items belonging to a specific vendor AND only items that are displayed in your web store.',
  'export.netsuite.distributed.skipExportFieldId':
'Allows users to specify a checkbox field on the NetSuite record type being exported which can be marked on record create/update to skip exporting the record for that operation. The checkbox will auto-uncheck itself without initiating the Realtime export.<br> A common use case where this feature can be used is when you are mass updating the records in NetSuite, and doesn’t want to send all these updates from NetSuite. By also marking the checkbox field as defined in this setting,  IO will skip that export for that update and auto-uncheck checkbox. <br> Another use case is in bi-directional sync between two systems. Lets say, you have a RealTime Export which is exporting customers from NetSuite to System A. After successful import to system A, we might need Id of System A to be present on the NetSuite record and need another flow which updates back the Id from System A back to NS. In this case the Id Write Back to NS would trigger the RT flow to run again and it would end up in an infinite loop. To stop this loop, when the Id Write Back Import runs, we can mark the checkbox provided in the Realtime Export as true. IO would would uncheck this checkbox and will skip sending this update from NetSuite and hence stopping the infinite loop.',
  'export.netsuite.distributed.forceReload':
"When a record is saved in NetSuite there are certain fields that are not available until after the save completes, and the only way to export those fields in real-time is to reload the record again from the NetSuite database.  One example of this is the Line ID field on many of NetSuite's transaction record types (i.e. sales order, transfer order, etc...).  When a transaction record is first created, or when new line items are added to an existing transaction record, the Line ID values are not immediately available, and it is required to re-load the record again from the NetSuite database to export the Line ID values.  Please note that this extra load is relatively expensive too (for NetSuite) and will slow down the real-time export, so if you do not need one of these special fields then please avoid using this reload setting.  Unfortunately also, there is no master list of all the fields that require a reload (at least not presently), so trial and error might be needed if a field is not being exported as expected.",
  'export.netsuite.restlet.criteria':
'This field can be used to specify any additional search criteria for the saved search that you want to execute for this flow. These will be added to the existing saved search criteria before records are exported out of NetSuite.',
  'export.netsuite.restlet.searchType':
'Select <b>Public</b> or <b>Private</b>, depending on how you defined your saved search in NetSuite. \n<br>When you export a record type from a saved search, all of the matching data is retrieved according to how you defined it in NetSuite. It’s a simple and popular option for populating your integration flow. (If you’re unfamiliar with NetSuite saved searches, see the NetSuite help guides, and then you can quickly become an expert by testing them in your NetSuite account.) \n<br>IMPORTANT: Always sort your NetSuite saved search results by the Internal Id and then explicitly include the Internal Id column in the results, which is required to group consecutive search rows with the same Internal Id into individual logical records. For example, a single sales order with multiple line items will output multiple rows on the order. integrator.io needs the Internal Id to group all rows belonging to the same sales order. If you cannot sort your NetSuite saved search by Internal Id, then you must leave <b>Group rows</b> (below) unchecked.',
  'export.netsuite.restlet.searchInternalId': 'Enter either of the following IDs for the saved search you want to run: \n<br>&#8226; The Internal Id \n <br>&#8226; Your custom search Id \n<br>If you specify an Internal Id, you can click the launch shortcut button to go directly to the saved search in your NetSuite account. \n<br>Referencing the search Id is a best practice for being able to access the saved search even after you refresh the sandbox and the Internal Id changes.',
  'export.netsuite.hooks.preSend': '',
  'export.googledrive.directoryPath':
'Specify  google drive folder containing the files to be transferred.  For example, if you set this field to \'MySite/Items\'. <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will first look for a parent folder \'MySite\', and then for a child folder \'Items\', and then transfer all files from folder \'Items\'. <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will transfer all files and also delete them from the folder once the transfer completes.  You can also (optionally) configure <a href="http://integrator.io" title="http://integrator.io" >integrator.io</a> to leave files in the folder, or to transfer files that match a certain \'starts with\' or \'ends with\' file name pattern.',
  'export.box.directoryPath':
'Enter the relative path to the Box directory that contains the files to export.',
  'export.dropbox.directoryPath':
'Enter the relative path to the Dropbox directory that contains the files to export.',
  'export.azure.containerName':
    'Specify the Azure blob storage container that has the files to be transferred. <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will transfer all files and also delete them from the folder once the transfer completes. You can also (optionally) configure <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> to leave files in the folder or transfer files that match a certain \'starts with\' or \'ends with\' file name pattern.',
  'export.azure.skipDelete':
    'If this field is set to \'true\' then <a  href="http://integrator.io" title="http://integrator.io" >integrator.io</a> will NOT delete files from the transfer application after a transfer completes. The files will be left on the transfer application, and if the transfer process runs again the same files will be transferred again.\n <br> Note: Select this option, if the Azure connection has only read access to avoid failure in the flow',
  'export.s3.bucket': 'Specify the Amazon S3 folder, such as: folder1. S3 bucket names cannot contain forward slashes or folder structure. If you have folder structure in the bucket such as folder1/subfolderA/topic1, the bucket name would be <b>folder1</b>. You would then put the remaining <b>subfolderA/topic1</b> in the <b>Key starts with</b> field.',
  'export.s3.backupBucket': 'Specify the bucket name where files will be backed up after successful transfer.',
  'export.salesforce.sObjectType': 'Use this field to specify which Salesforce sObject type you would like to export.  You can choose any standard sObject type (i.e. account, opportunity, contact) or any custom sObject type as long as the sObject type supports Salesforce triggers. Please note that this list of sObject types is also dependent on the permissions associated with the Salesforce connection being used. Also, if you add any new custom sObject types to your Salesforce account, or if there are any changes to the permissions associated with the connection being used, you can use the refresh icon to regenerate the list.',
  'export.webhook.url': 'If a URL has not been generated yet, please use the \'Generate URL\' link to generate a public URL for this webhook listener, and then you will need to share this URL with the webhook provider (i.e. through that provider\'s UI or API).  Saying this another way, each webhook provider like GitHub, Shopify, etc... will support a mechanism to configure a URL where you want webhook data sent, and please provide them with this generated URL here.',
  'export.webhook.sampledata': 'Use this field to provide sample data so that integrator.io can help you map your webhook data later. For brand new webhook exports, if you can trigger the webhook to send test data right now (against the URL above) then you can use the \'Click To Show\' link below to see the live data that actually got sent. If this is not a brand new export (in which case it is not possible anymore for integrator.io to intercept test data), or if the webhook provider does not support a test send, then you will need to manually copy and paste the expected webhook data into this field.',
  'webhook.sampleData': 'Use the Click to show button to populate the sample data field with the webhook data most recently received by the public URL endpoint. If the public URL endpoint has not yet received any data, you can manually enter sample JSON data in the field provided. NOTE: XML is supported for webhooks, but the sample data in the webhook allows only JSON. You can convert XML to JSON in the Developer playground with the XML parser helper. <a href="https://docs.celigo.com/hc/en-us/articles/360043040652-Advanced-field-editors-AFEs-and-the-Dev-playground" target="_blank">Learn more</a>',
  'export.hookType':
"Please select 'Script' if you want to use the native integrator.io JavaScript runtime engine (where all your code is managed and executed by integrator.io), or choose 'Stack' if you prefer to host your code outside integrator.io (either on your own servers, or on AWS Lambda).",
  'export.skipRetries': 'Check this box if you do NOT want <a href="http://integrator.io" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://integrator.io&amp;source=gmail&amp;ust=1590556088890000&amp;usg=AFQjCNFM_k8PAvITBLyHS0Wg3n3N_M_dNw">integrator.io</a> to store retry data for records that fail in your flow. Storing retry data can slow down your flow\'s overall performance if you are processing very large numbers of records that are failing. Storing retry data also means that anyone with access to your flow\'s dashboard can see the retry data in clear text.',
  'export.oneToMany':
'Choose this option if the records being processed contain child records that should instead be treated as the main records (i.e. for this step only in the flow). For example, you could be processing order records but want to process the line items within the orders as the main records for this step.',
  'export.searchCriteria':
'This field can be used to specify any additional search criteria for the saved search that you want to execute for this flow. These will be added to the existing saved search criteria before records are exported out of NetSuite.',
  'export.invoke-url':
'It is possible to invoke this export at any time by using this URL in a POST request to our API. You can use any HTTP client (like <a target="blank" href="https://www.getpostman.com/">Postman</a>) to invoke this export. Set the HTTP method in your client app to POST, and use the url below to uniquely target this export. You will also need to set the "content-type" header of your request to application/json and the "authorize" header to "Bearer [ your API token ]". Finally, if your export contains {{ placeholders }} within its fields, you can populate these by including values for these placeholders as a JSON object in the POST body of the HTTP request.',
  'export.pathToMany':
"If the parent record is represented by a JSON object, then this field should be used to specify the JSON path of the child records. If the parent record is represented by a JSON array (where each entry in the array is a child record), then this field does not need to be set. If you are unsure how parent records are being represented in your flow then please view the 'Sample Data' field for the 'Export' resource that is generating the data. Following are two examples also to hopefully help clarify how data can be represented differently depending on the export context. Example 1: If you are exporting Sales Orders out of NetSuite in real-time then NetSuite sends integrator.io a JSON object for each Sales Order, and if you want to process the line items in that Sales Order then you need to specify the JSON path for the line items field. There is no way to tell NetSuite to send an array for real-time data. Example 2: But, if you are exporting Sales Orders out of NetSuite via a scheduled flow, then in this case NetSuite represents each order via an array where each entry in the array represents a line item in the order. There is no way to tell NetSuite to give you an object for batch data.",
  'export.configureAsyncHelper':
'If data is exported asynchronously, check this field to select the Async Helper configuration to be used.',
  'export.http._asyncHelperId':
'Select an existing Async Helper configuration or create a new one to be used for async response processing.',
  'export.netsuite.restlet.batchSize':
"NetSuite's search APIs will by default return up to 1000 records every time you request a new page of results. This is problematic if you need to execute a SuiteScript based hook on the records before they are exported (in which case you will likely run out of SuiteScript points or hit NetSuite instruction count limits), or if the individual records you are exporting are very large such that the sum of all 1000 records exceeds 5 MB (which is also not allowed). For either situation, this field can easily be used to tell integrator.io to break down the default 1000 record batches into smaller batches where you define the ideal size.",
  'import.inputMode':
'Choose Yes if you need to build a new CSV, XML, JSON or other file. Choose No if you are just transferring raw files as-is (such as PDFs, JPGs, etc).',
  'import._applicationId':
"This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors.\nIf you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'import.overrideDataURITemplate':
'For applications like NetSuite and Salesforce, integrator.io will by default try to generate links for any records that fail to import and then display those links in your job dashboard.  If you prefer to define your own custom links then please use this handlebars field to override the default functionality.  Please note that the template you provide will run against your data after it has been mapped, and then again after it has been submitted to the import application, to maximize the ability to link to the right place.  For example, if you are importing sales orders but instead want the errors to link to customers, you could use the following.  "https://system.na1.netsuite.com/app/common/entity/custjob?id={{{entity}}}"',
  'import.csvFile':
'Please provide a sample file that this transfer would need to process.  We will use the sample file to auto set various fields (where possible), and also to help you map data in a subsequent step.  The sample file that you provide does not need to be overly large, but it should contain all the fields that you want to work with, and also be in the same format that the import will need to generate when running in a production capacity.',
  'import.http-headers':
'Click this button to specify any custom HTTP header name and value pairs which will be added to all HTTP requests. Note that in most cases our platform will auto-populate common headers such as "content-type" (based of the media type of the request), or the "Authorize" header (used if your application authenticates using tokens in the header). Unless your HTTP request fails or does not return expected results, there is no need to use this feature. In some rare cases, it may be necessary to add other application specific headers that the integrator.io platform does not manage. An example of this would be adding an "x-clientId" or any other application specific header. These would be documented in the API guide of the Application you are integrating with.',
  'import.as2Headers':
"Click this button to specify any custom HTTP header name and value pairs that will be added to all outgoing AS2 messages. Note that in most cases you will not need to populate any headers here, but if your trading partner's AS2 endpoint requires certain headers to be present (even if not required by the AS2 specification), this feature will allow that.",
  'import.ediFormat':
'Please select the file format that most closely matches your needs. If the exact format is not found, select the closest template. You will have an opportunity to modify the rules within this template by using the “File Definition Editor” below.',
  'import.fixedWidthFormat':
'Please select the file format that most closely matches your needs. If the exact format is not found, select the closest template. You will have an opportunity to modify the rules within this template by using the “File Definition Editor” below.',
  'import.filedefinitionRules':
'File Definition Rules are used by our platform to generate your EDI file. Once you have selected a template that most closely matches your needs, this editor is used at a minimum, to modify those rules to indicate where to find your data values. If you did not find an exact template match, this editor can also be used to make changes to an existing template or even write your own from scratch. \n Within the editor, the “Available Resources” pane holds all the data that you can reference within the file definition rules. The “File Definition Rules” pane holds the instructions in JSON format that will be used to generate your EDI file. The Generated Import field shows, in real-time, the generated output based on your defined rules.',
  'import.file.compressFiles':
'If you would like to compress files before they are posted to the import application, set this field to <b>True</b>. Once you check this field, a dropdown field appears for you to choose the compression format',
  'import.ftp.useUploadInProgressTempFile':
'Some FTP sites require that a file use a temporary file name pattern while an upload is in progress, and then after an upload is complete that a file be renamed to officially let the FTP site know that no more data is expected, and that the file can safely be processed by another application.',
  'import.netsuite.referenceField':
'Select the NetSuite subrecord under the chosen record type that you want to import. For example if you want to select the inventory detail section of an item fulfillment select "Items : Inventory Details".',
  'import.netsuite.jsonPath':
'Select the element of the data that contains the list of objects that will be used in mapping to the subrecords. If you are mapping to subrecord under a sublist (such as inventory detail on the item list of a transaction) you should select the node that contains the list of items.',
  'import.netsuite.hooks.preMap': '',
  'import.netsuite.hooks.postMap': '',
  'import.netsuite.hooks.postSubmit': '',
  'import.netsuite.lookups.failFields':
'<b>Fail Record:</b> If no results are found or the dynamic lookup fails, the lookup will silently fail (return empty string). Similarly, if multiple results are found  (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails. \n\n<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'import.netsuite-record-config-button':
'This button represents the primary record type you are importing. To change the record type shown on this button you need to change the value selected in the Record Type field. To add a subrecord to be mapped: click the down arrow and click Add Subrecord Import.',
  'import.netsuite-sub-record-config-button':
'This button represents a subrecord that will be imported under the primary record type selected in the Record Type field. To change what subrecord type is imported or where the data is extracted from: click the down arrow and select Edit Configuration. To remove this subrecord import click the down arrow and select Remove.',
  'import.netsuite-edit-mapping':
'Click this button to set or edit the mappings for the primary record that is being imported. This is where you will edit both header and line level mappings.',
  'import.netsuite-subrecord-mapper':
'Click this button to set or edit the mappings of this subrecord on your import. These mappings will be processed along with the primary record mappings, and the resulting record will be submitted at the same time.',
  'import.salesforce.lookups.failFields':
'<b>Fail Record:</b> If no results are found or the dynamic lookup fails, the lookup will silently fail (return empty string). Similarly, if multiple results are found  (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails. \n\n<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'import.salesforce.api':
'Salesforce supports both SOAP and REST API types.  Salesforce actually supports a multitude of different API types, but SOAP and REST are the most relevant for importing data via integrator.io.  SOAP is recommended here because SOAP supports the ability to submit more than one record at a time (i.e. in a single API request).  Salesforce governs its API based on the total number of API requests per day, so it is important to batch up your data wherever possible; and with the REST API you are limited to only one record per API request.  The REST API can be a slightly better option when the data being imported is guaranteed to come in one record at a time, or if you are using the integrator.io API to invoke the import from your own application and you prefer the REST paradigm.\n\n<b>Composite:</b> This enables you to import a parent record along with its child record to leverage the composite requests of Salesforce.',
  'import.http.compositeType':
  "Choose 'Create new records & update existing records' to dynamically create vs update records in the import application based on their existence in that application already. Choose 'Create new records & ignore existing records' to only create new records, and this option will ignore records that exist already. Choose 'Ignore new records & update existing records' to only update existing records, and this option will ignore records that cannot be found.",
  'import.hooks.preMap.scriptFunction':
'The name of the preMap hook function (in your script) that you want to invoke.',
  'import.hooks.postMap.scriptFunction':
'The name of the postMap hook function (in your script) that you want to invoke.',
  'import.hooks.postSubmit.scriptFunction':
'The name of the postSubmit hook function (in your script) that you want to invoke.',
  'import.hooks.postAggregate.scriptFunction':
'The name of the postAggregate hook function (in your script) that you want to invoke.',
  'import.netsuiteImportFieldMappingSettings':
`The type of field mapping that you want to perform. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360019506771" target="_blank"/>Map source record fields to destination</a>.`,
  'import.etailImportFieldMappingSettings':
`The type of field mapping that you want to perform. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360019506771" target="_blank"/>Map source record fields to destination</a>.`,
  'import.mapping.lists.fields.useFirstRow': '',
  'import.mapping.lists.fields.useAsAnInitializeValue':
'NetSuite allows certain fields to be initialized (pre-loaded on the NetSuite form) during create/transform of a record. Mark this check box if you would like to add this field during record initialization. \nExample: If you are trying to create a non inventory item and you want to specify the subtype as "Sale" or "Purchase" or "ReSale", this mapping has to be set during the initialization itself. In such cases, we mark the subtype mapping as an initialization parameter.',
  'import.rdbms.type':
"Please select 'Insert' if you are only importing new records into the Database. Please select 'Update' if you are only importing changes to existing records in the Database. Please select 'Insert or Update' if you want your import to be more dynamic such that (1) if an existing record exists in the Database then that record will be updated, or (2) if an existing record does not exist then a new record will be created.",
  'import.rdbms.lookups.failFields':
'<b>Fail Record:</b> If no results are found or the dynamic lookup fails, the lookup will silently fail (return empty string). Similarly, if multiple results are found  (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails. \n\n<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'import.rdbms.lookups.extract':
'When integrator.io runs this lookup it will read the column named in this field from the SQL result set and return that single value as the result of the lookup. Please make sure this field contains a valid column name from your database table.',
  'import.rdbms.lookups.query':
'The query that fetches records to be exported.',
  'import.lookups.name':
'Enter a unique name so that you can identify this lookup later.',
  'import.mongodb.lookupType':
'There are two ways to identify existing records. Either by testing for the existence of a field value on the export record (such as id), or by performing a lookup against the destination application. Choose the option, "Records have a specific field populated" if you can identify existing records by examining the content of your export records. If on the other hand a lookup is necessary, select the "Run a dynamic search against MongoDB" option. After making this selection, other fields will become available to describe how to define your lookup.',
  'import.oneToMany':
"There are advanced use cases where a parent record is being passed around in a flow, but you actually need to process child records contained within the parent record context. For example, if you're exporting Sales Order records out of NetSuite and importing them into Salesforce as Opportunity and Opportunity Line Item records, then you will need to import the Opportunity Line Item records using this option.<b>One to many</b> is used in cases where you have a single record which internally needs to create multiple records. This field cannot be used when importing a CSV file.",
  'import.pathToMany':
"If the parent record is represented by a JSON object then this field should be used to specify the JSON path of the child records. If the parent record is represented by a JSON array (where each entry in the array is a child record) then this field does not need to be set. If you are unsure how parent records are being represented in your flow then please view the 'Sample Data' field for the 'Export' resource that is generating the data. Following are two examples also to hopefully help clarify how data can be represented differently depending on the export context. Example 1: If you are exporting Sales Orders out of NetSuite in real-time then NetSuite sends integrator.io a JSON object for each Sales Order, and if you want to process the line items in that Sales Order then you need to specify the JSON path for the line items field. There is no way to tell NetSuite to send an array for real-time data. Example 2: But, if you are exporting Sales Orders out of NetSuite via a scheduled flow then in this case NetSuite represents each order via an array where each entry in the array represents a line item in the order. There is no way to tell NetSuite to give you an object for batch data.",
  'import.netsuiteImportFieldMappingLookupType':
'Use a dynamic search if you need to lookup data directly in the import application, e.g. if you have an email address in your export data and you want to run a search on the fly to find a system id value in the import application. Use a static value to value mapping when you know in advance all the possible values and how they should be translated. For example, if you are mapping a handful of shipping methods between two applications you can define them here.',
  'import.invoke-url':
'It is possible to invoke this import at any time by using this URL in a POST request to our API. You can use any HTTP client (like <a target="blank" href="https://www.getpostman.com/">Postman</a>) to invoke this import. Set the HTTP method in your client app to POST, and use the url below to uniquely target this import. You will also need to set the "content-type" header of your request to application/json and the "authorize" header to "Bearer [ your API token ]". Finally, use the body of the HTTP request to supply data to your import. The body structure should be an array of JSON objects. Each object in this array represents an individual record to be imported.\nExample body: [\n{ "id": 1, "name": "Joe" },\n{ "id": 2, "name": "Jim" }\n]',
  'import.configureAsyncHelper':
'If data is imported asynchronously, check this field to select the Async Helper configuration to be used.',
  'import.http._asyncHelperId':
'Select an existing Async Helper configuration or create a new one to be used for async response processing.',
  'import.failFields':
'<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'import.function':
`This drop-down has all the available helper methods that let you transform your field values. Once you make a selection, the function and placeholder values will be added to the expression text box below. You can then make any necessary changes by editing the complete expression.For a complete list and extended help of all helper methods, please see this article: <a target="blank" href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/115004695128-Handlebar-Helpers-Reference-Guide">handlebars Helper Guide</a>`,
  'import.field':
'This dropdown lists all the available fields from your export record that can be used in your expression. Either by themselves, or as argument value for any selected helper methods.',
  'import.expression':
'This field represents your complete handlebars expression. You have the freedom to manually enter an expression, or use the function and field drop-downs above to help construct it.',
  'import.editMockInput': 'Use this <a href="https://docs.celigo.com/hc/en-us/articles/4473437451163" target="_blank">mock data</a> to preview and send import requests. The data can be modified to test different import scenarios, or to help with import configurations. Mock input is stored only during the current session for the current user account (it is discarded when you sign out or the session expires after an hour of inactivity), and is used for import testing (preview/send) purposes only.',
  'jobErrors.helpSummary':
'You can view the error source, code and message, as well as when the error occurred. Hover over each error to click the … Actions to access the record where the error occurred and make any necessary changes. Once you’ve tracked down and resolved your error, resolve it from the Actions or button toolbar. You can also retry errors, such as something due to an intermittent connection failure. If you have a lot of errors, you’ll want to download them into a csv, then mark them resolved or retried, and upload your processed errors.',
  'connection.useSFTP': '',
  'connection.enableDebugging':
'Set this flag if you want to establish the connection in debug mode.',
  'connection.timeFrame': '',
  'connection.httpHeaders':
'Click this button to specify any custom HTTP header name and value pairs which will be added to all HTTP requests. Note that in most cases our platform will auto-populate common headers such as "content-type" (based of the media type of the request), or the "Authorize" header (used if your application authenticates using tokens in the header). Unless your HTTP request fails or does not return expected results, there is no need to use this feature. In some rare cases, it may be necessary to add other application specific headers that the integrator.io platform does not manage. An example of this would be adding an "x-clientId" or any other application specific header. These would be documented in the API guide of the Application you are integrating with.',
  'connection.scope':
'OAuth 2.0 scopes provide a way to limit the amount of access that is granted to an access token. For example, an access token issued to a client app may be granted READ and WRITE access to protected resources, or just READ access.',
  'connection.ftpType':
'The file transfer protocol using which you want to establish the FTP connection.\nThe following protocols are available:\n<bold>FTP:</bold> Select FTP if the server that you are connecting to requires an FTP protocol.\nSFTP: Select SFTP if the server that you are connecting to requires an SFTP protocol.\nFTPS: Select FTPS if the sever that you are connecting to requires an FTPS protocol.',
  'connection.connMode':
'Select Cloud if you are connecting to an application on the cloud and is publicly accessible. For example, Salesforce, NetSuite. Select On-premise if you are connecting to a server that is publicly inaccessible and has integrator.io Agent installed on it. For example, Production AWS VPC, MySQL server.',
  // TODO:"Duplicated token"
  // 'connection.rest.bearerToken': "The 3dcart merchant's token.",
  'connection.http.auth.revoke.uri':
'This is the URL that we will use to revoke this token’s access to this endpoint.',
  'iClient.oauth2.grantType': 'OAuth 2.0 authentication currently supports two grant types: authorization code and client credentials. Choose Authorization code to use an authorization server to obtain an authorization code as an intermediary between the client and resource owner. Choose Client credentials if authorization scopes are limited to protected resources under the control of the client or previously configured on the authorization server.',
  'iClient.oauth2.callbackURL': 'Use the callback URL to exchange secure messages with the authorization server after authentication. You must whitelist this URL with your authorization server.',
  'iClient.oauth2.clientCredentialsLocation': 'Sends a basic auth request in the header or client credentials in the request body.',
  'iClient.oauth2.token.uri':
'integrator.io retrieves the access token from this URL.',
  'iClient.oauth2.scopeDelimiter':
'Enter the non-space scope delimiter used by your API provider.',
  'iClient.oauth2.auth.uri':
'This is the authorization code retrieval endpoint on the API provider’s authorization server.',
  'connection.generic.http.auth.oauth.scope':
'List the scopes to grant access to authorization server requests. Separate multiple scopes with a space character, unless you are providing an alternative delimiter, below.',
  'connection.http.auth.oauth.scope':
'Scopes are named permissions that are provided when the connection is authorized. The list of supported scopes should be clearly documented in the API user guide. Connecting with a given scope allows your integration, for example, to export data or perform admin functions.',
  'iClient.oauth2.token.headers': 'In some rare cases, it may be necessary to include custom HTTP headers with your API requests. The default content-type header value is application/x-www-form-urlencoded. Enter a name and a value to replace default header values with custom values.',
  'iClient.oauth2.token.body':
"Configure your own access token body in JSON format if it is different from the default access token body. This JSON format is finally converted to the form-urlencoded format on the wire. <br> Default access token body format if 'Client Authentication' set as 'body':</br>{ code: {{{query.code}}}, redirect_uri: {{{redirectUri}}}, client_id: {{{clientId}}}, client_secret: {{{clientSecret}}}, grant_type: “authorization_code”}. <br> Default access token body format if 'Client Authentication' set as 'header': { client_id: {{{clientId}}}, client_secret: {{{clientSecret}}} grant_type: “client_credentials” }.",
  'iClient.oauth2.refresh.headers':
  "In some cases, it may be necessary to include custom HTTP headers with your token refresh requests. As with the 'body' field, any value from the connection can be referenced using {{{placeholders}}} with a complete path matching the connection field.",
  'iClient.oauth2.refresh.body':
'Configure your own refresh token body in JSON format if it is different from the default refresh token body. This JSON format is finally converted to the form-urlencoded format on the wire.<br>Default refresh token body format:</br>{ client_id: {{{clientId}}}, client_secret: {{{clientSecret}}}, grant_type: “refresh_token” }',
  'iClient.oauth2.revoke.body':
'Configure your own revoke body in JSON format if it is different from the default revoke token body. This JSON format is finally converted to the form-urlencoded format on the wire.<br>Default revoke body format:</br>{ token: {{{connection.http.auth.token.token}}} }.',
  'iClient.oauth2.revoke.headers': 'In some rare cases, you may need to include custom HTTP headers with your API requests. The default content-type header value is application/x-www-form-urlencoded, and the authorization header value is basic.',
  'iClient.oauth2.revoke.uri':
'integrator.io makes an HTTP post request to the token revocation endpoint URL to revoke a particular token.',
  'iClient.oauth2.validDomainNames':
'integrator.io validates the HTTP requests sent to various OAuth URLs using the domain name value. If the Authorization URL, access token URL and revoke token URL have different domain names, provide them as comma-separated values in any order.',
  'iClient.oauth2.accessTokenLocation': 'This determines where your application’s API expects to find the authentication token.</br>Choose URL if the authentication token is located in the URL. You can then specify the query string parameter name that holds the token value.</br> Choose Header and specify the header name and authentication scheme to use when constructing the HTTP request. </br>Choose Body if your API requires the token to be embedded in the body structure of your HTTP request. In such cases, place the token in your body template using the placeholder: {connection.http.token.token}.',
  'iClient.oauth2.accessTokenHeaderName':
"By default, integrator.io will send all authentication type info in the 'Authorization: ' HTTP header field.  If the REST API you are connecting to requires a different HTTP header, use this field to provide an override.",
  'iClient.oauth2.scheme':
"Use this field to set the HTTP authorization header scheme value. For example, 'Bearer' would be the scheme value for 'Authorization: Bearer my_secret_api_token'",
  'iClient.oauth2.accessTokenParamName': 'Use this field to specify the name of the URL parameter that holds the API token value. For example, if you specify myAPITokenURLParam, then all HTTP requests will include ?myAPITokenURLParam=[token]',
  'iClient.oauth2.failStatusCode':
'This field only needs to be set if the HTTP status code for auth errors is not 401. For example, an API could return a generic 400 status code instead, and then use a field in the HTTP response body to indicate auth errors.',
  'iClient.oauth2.failPath':
"This field only needs to be set if the API returns a field in the HTTP response body to indicate auth errors. For example, if an API returns the field 'errorMessage' with the value 'Auth failed', then you would set this field to 'errorMessage'.",
  'iClient.oauth2.failValues':
'Use this field to limit the exact values in the HTTP response body field that should be used to determine auth errors. To provide multiple values, use a comma-separated list.',
  'connection.rest.threedcartSecureUrl': "3dcart merchant's Secure URL.",
  'connection.salesforce.sandbox':
'Select Production or Sandbox from this field. You can then click on Save & Authorize that opens a Salesforce window where you can enter your Salesforce account credentials to connect to Salesforce.',
  'connection.salesforce.oauth2FlowType':
"The Force.com platform implements the OAuth 2.0 Authorization Framework, so users can authorize applications to access Force.com resources on their behalf without revealing their passwords or other credentials to those applications. You can select one of the following authorization flows for authentication. \n \n <b>Refresh Token Flow:</b> This flow tends to be used for web applications where server-side code needs to interact with Force.com APIs on the user's behalf. \n \n <b>JWT Bearer Token Flow:</b> The main use case of the JWT Bearer Token Flow is server-to-server API integration. This flow uses a certificate to sign the JWT request and doesn’t require explicit user interaction.",
  'connection.salesforce.username':
"Enter the username for your Salesforce Account for 'JWT Bearer Token' authentication.",
  'connection.amazonmws.authToken': 'The MWS authorization token.',
  'connection.amazonmws.marketplaceId':
"Please specify the Amazon MWS 'MarketplaceId' for this connection. This value is required for specific Amazon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS 'MarketplaceId' selected, else your Amazon MWS calls will fail.",
  'connection.shopify.rest.basicAuth.username':
"Login to your Shopify store and navigate to 'Apps' section. Click on the respective private app and the API key can be found next to the 'Authentication' section.",
  'connection.shopify.rest.basicAuth.password':
"Login to your Shopify store and navigate to 'Apps' section. Click on the respective private app and the password can be found next to the 'Authentication' section.",
  'concur.connection.http.unencrypted.username': 'Please enter the Username of your Concur account.',
  'concur.connection.http.encrypted.password': 'Please enter the Password of your Concur account.',
  'concur.connection.http.unencrypted.consumerKey': 'Please enter the consumer Key of your Concur account.',
  'concurall.connection.http.unencrypted.username': 'Please enter the ID value which will be available in the URL after connecting to Concur App present at the App Center.',
  'concurall.connection.http.encrypted.password': 'Please enter the Request token value which will be available in the URL after connecting to Concur App present at the App Center.',
  'concurall.connection.http.subdomain': 'Please enter the subdomain of your Concur account.',
  'concurall.connection.http.unencrypted.clientId': 'Please enter Client ID of your Concur account.',
  'concurall.connection.http.encrypted.clientSecret': 'Please enter Client Secret of your Concur Account.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Client secret safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'concurall.connection.http.unencrypted.credtype': 'For connections from the App Center, use authtoken. if omitted, oauth2 will assume the type is password.',
  'azurestorageaccount.connecton.http.unencrypted.storageAccount':
'Specify the name of the Azure storage account which contains the data.',
  'graphql.baseURI':
  'Provide the specific URI/endpoint on the GraphQL server. Your GraphQL server operates on a single endpoint (traditionally /graphql), and all requests are directed to this endpoint.',
  'connection.graphql.query':
  'Enter the query to be processed by GraphQL server. The supported operation type is either query or mutation. The operation type is required unless you\'re using the query shorthand syntax, in which case you can\'t supply a name or variable definitions for your operation. The query may also include an operation name, which is required for a multi-operations query.',
  'connection.graphql.operationName':
  'Provide the operation name if your query has two or more operations. Note that a request can only execute one operation at a time.',
  'connection.graphql.variables':
  'Define the <a href="https://docs.celigo.com/hc/en-us/articles/4409527888923-Work-with-JSON-data-in-integrator-io">JSON</a> variables used in your query. For example, if the query is "query HeroNameAndFriends($episode: Episode)", define the variable as {"episode":"JEDI"}.',
  'azurestorageaccount.connecton.http.unencrypted.tenantId':
'Specify the tenant ID that identifies the Azure Active Directory tenant used for authentication.',
  'connection.netsuite.authType':
`Token Based Auth is NetSuite’s recommended way of authentication a connection. Tokens generate while setting up the connection will never expire until revoked in NetSuite. There are two ways to configure Token Based Auth: </br><b>1.Token Based Auth(Manual) : </b>A user would have to manually create the Tokens in NetSuite and enter them in IO.Please read <a href=${HELP_CENTER_BASE_URL}/hc/en-us/articles/115000694991-NetSuite-2018-2-two-factor-authentication-2FA-requirement>here</a> on generating tokens manually. Once you generate the tokens, please keep them secure as they can be re-used for multiple connections.</br> <b>2.Token Based Auth(Automatic) :</b> [Recommended] Integrator will generate tokens on behalf of the user. Once you select this option, IO will redirect you to NetSuite login page and you can select the role for which you need to generate the tokens. Please note that authorising a connection generates a new set of tokens in NetSuite everytime, so anytime a connection is created/edited with this option will generate a new set of tokens. <br>Note 1: At a time there can be 25 active tokens for a user/role combination. <br>Note 2:  ‘Basic’ Auth can be used with your NetSuite email and password and it planned for deprecation by NetSuite. This is only supported for legacy integrations which should also move to TBA.`,
  'connection.netsuite.wsdlVersion':
`The NetSuite WSDL version that this connection uses. It's always recommended to use the latest WSDL version. You can switch between different versions by editing the connection.
<br/>Note that Switching versions for an existing connection might have an impact on running flows, and it is recommended to review NetSuite’s release notes prior to making a change.
<br/>Note that NetSuite WSDL 2020.2 and later versions only support token-based auth.`,
  'connection.netsuite.linkSuiteScriptIntegrator':
'Prior to integrator.io, NetSuite integrations built by Celigo ran directly inside your NetSuite account via a managed bundle. If you are still running any of these older integrations, check this box to link integrator.io to your NetSuite account. The older Celigo interface that ran directly inside NetSuite has been deprecated, and you must now use integrator.io to manage and monitor all integrations.',
  'connection.configureApiRateLimits':
'By default the HTTP adaptor will treat all HTTP responses with status code 429 as being rate-limited and then look for a “retry-after” header to determine when our platform can retry the request. If the service you are connecting to respects these HTTP specifications, then you do not need any additional configuration. If however your service implements a custom rate-limit response structure, use these options to tell our platform how to identify and respond to a rate-limited response.',
  'connection.http.auth.oauth.applicationType':
'For some providers, OAuth 2.0 is built into the app’s endpoint. You will need to use Custom for any apps that do not have OAuth 2.0 built in.',
  'connection.http._iClientId':
'OAuth 2.0 clients are used to securely link your integrator.io account to an external OAuth 2.0 provider for the purpose of acquiring API access tokens. OAuth 2.0 clients can be reused by any number of connections.',
  'connection.http.clientCertificates.key': 'Select a .KEY private key file.',
  'connection.http.clientCertificates.type':
'Select the certificate type.',
  'connection.http.clientCertificates.cert':
'Select a certificate in PEM format.',
  'connection.http.clientCertificates.pfx':
'Select a certificate in PFX format.',
  'connection.http.clientCertificates.passphrase':
'Enter a passphrase if you need to further protect this certificate file.',
  'connection.marketplaceRegion':
'Please specify the Amazon MWS Region for this connection. Please note that you must be registered to sell in the Amazon MWS Region selected, else your Amazon MWS calls will fail.',
  'connection.rdbms.useSSL':
'Please check this field if you want to establish a secure connection to the database. This ensures that data in transit is encrypted.',
  'connection.as2.preventCanonicalization': '“Canonicalized” data has been transformed to its simplest essential form during HTTP requests. Check this box to skip canonicalization during signature verification, which avoids any risk of the signature’s getting invalidated when accompanying transformed binary data',
  'connection.as2.concurrencyLevel': 'Set this field to limit the number of concurrent HTTP requests allowed by the connection resource (at any one time), or leave this field blank to use burst mode. With burst mode, integrator.io will make HTTP requests as fast as possible, with really high levels of concurrency. Some APIs are really great with burst mode, and can typically handle any types of volume. Conversely other APIs are much more strict when it comes to the number of API requests being sent to their servers, and burst mode may not be recommended.',
  'connection.as2.userStationInfo.as2URL':
'This is the URL to which your trading partners will send AS2 documents. Note that the same URL is used for all integrator.io users, which is why the above AS2 identifier must be unique. It is not editable but is provided here so that you can communicate it to your trading partners.',
  'connection.as2.userStationInfo.requireMDNsFromPartners':
"Celigo's integrator.io is configured to require MDNs from partners. This field is not editable but is provided so that you can easily share this setting with your trading partners.",
  'connection.as2.userStationInfo.requireAsynchronousMDNs':
"Celigo's integrator.io is configured to expect synchronous MDNs from trading partners. Since we do not require asynchronous MDNs, there is no need to set a specific URL to receive asynchronous MDNs. This field is not editable but is provided so that you can easily share this setting with your trading partners.",
  'connection.as2.userStationInfo.ipAddresses':
'These are the IP addresses of the various servers that comprise integrator.io. These should be shared with your trading partners if the trading partner has a firewall that needs to be configured to allow inbound AS2 traffic from integrator.io',
  'connection.as2.partnerStationInfo.requireAsynchronousMDNs':
'Check this box if your trading partner requires MDNs to be sent asynchronously. By default, integrator.io is configured to send MDNs synchronously.',
  'connection.rdbms.disableStrictSSL':
'An optional flag that (if set) skips verifying the SSL certificate, allowing self-signed or expired certs.  It is highly recommended (for hopefully obvious reasons) that you never set this flag for any production data connections.  In general, use at your own risk.',
  'notifications.jobErrors':
"Please choose 'All flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.",
  'notifications.connections':
  'Please select which connections you would like to be notified about when they go offline (and subsequently back online). Please note that connections can be shared across integrations, and if you choose to be notified here, this notification setting will be reflected everywhere else this connection is being used.',
  'me.dateFormat':
'Use this field to configure how you want dates to be formatted in your integrator.io account. For example, there is a dashboard in your integrator.io account to view integration activity, and this field controls how the dates on that page appear.',
  'me.timeFormat':
'Use this field to configure how you want times to be formatted in your integrator.io account. For example, there is an Audit Log page in your integrator.io account that lists changes made to resources in your account, and this field controls how the times on that page appear.',
  'me.change-email':
'Email is a very important field. Password reset links, product notifications, subscription notifications, etc. are all sent via email. It is highly recommended that you take the time to secure your email, especially if you are integrating sensitive information with your integrator.io account.',
  'me.change-password':
'There are minimum password requirements that all integrator.io users must satisfy, but we highly recommend using a password management app to auto generate a truly random, complex password that no one can remember or guess, and then rely solely on your password management app to sign you in to integrator.io.',
  'me.google-id': 'This is the Google Id linked to your integrator.io account.',
  'me.google-email':
'This is the Google email linked to your integrator.io account.',
  'me.google-header':
"Click here to enable 'Sign in via Google'. Once this setting is enabled you will no longer need to enter email and password to sign in to integrator.io. This setting can be disabled and/or changed at any time.",
  'me.google-link':
"Click here to enable 'Sign in via Google'. Once this setting is enabled you will no longer need to enter email and password to sign in to integrator.io. This setting can be disabled and/or changed at any time.",
  'me.google-unlink':
"Click here to disable 'Sign in via Google'. Once this setting is disabled the only way to access your integrator.io account is via email and password.",
  'flow.frequency':
'This field dictates how often your integration flow is run. Please log a support ticket if there is a specific preset frequency that you would like to see added to this list.',
  'flow.startTime':
'Set the first time that you want your flow to run each day. <br>Note that the start time represents when a flow will get placed into your queue for processing, but the actual run time of your flow may differ based on the load of your queue. The list of available start times is also subject to change to allow Celigo to maintain a global balance across all customers regarding the number of flows starting at any given time.',
  'flow.endTime':
'Set the final time that you want your flow to run each day.',
  'flow.daysToRunOn':
'Choose the specific day when you would like this integration flow to run.',
  'flow.type':
"Please select 'Use Presets' if you would like to use one of the more popular frequency options, and then the UI will guide you through the setup for each. If you need something more custom then please select 'Use Cron Expression', and then the UI will display a simple cron builder to help you define a custom frequency.",
  'asynchelper.rules':
`This field is optional. You can use it when the response is other JSON. For example, if your target application is Amazon, the response data received will be in XML format that you can convert to JSON using Transform Rules for Submit Response. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/115002669511-Transformation-Rules-Guide">Transform Rules Guide</a>`,
  'asynchelper.http.response.resourcePath':
'This field appears if Same As Status Export checkbox is disabled. Specify the path for obtaining other feed info resources. This data is passed to Status and Result exports for evaluating handlebars.\n For example, <i>/SubmitFeedResponse/SubmitFeedResult/FeedSubmissionInfo</i>.',
  'ashare.email':
'Enter the email of the user you would like to invite to manage and/or monitor selected integrations.',
  'ashare.accessLevel.allIntegrations':
'List of integrations available in your account to which you can invite users to manage and/or monitor.',
  'ashare.accessLevel.integrationsToManage':
'The invited user will have permissions to manage the integrations listed here.',
  'ashare.accessLevel.integrationsToMonitor':
'The invited user will have permissions to monitor the integrations listed here, but they will not have permissions to make any changes to them. They will however be able to run the flows within the integrations.',
  'accesstoken.description':
'Describe how your token is being used and be sure to mention exactly where your token is being stored externally.',
  'accesstoken.fullAccess': 'Set the access permissions for your API token:<br/><b>Full access</b> – gives unrestricted permissions to your integrator.io account resources (such as all flows, My APIs, exports, & imports), if the token is created in the Resources > API token page. Or, <b>Full access</b> gives permissions only to resources of an Integration App when the token is created under your Integration App’s Admin tab. <br/><b>Custom</b> – grants permissions to the specific resources in your integrator.io account that you specify below: scopes limited to selected connections, exports, imports, & My APIs',
  'accesstoken.name':
'Name your token so that you can easily reference it from other parts of the application',
  'accesstoken._connectionIds':
'Select the Connections that this token should provide access to.',
  'accesstoken._exportIds':
'Select the Exports that this token should provide access to.',
  'accesstoken._importIds':
'Select the Imports that this token should provide access to.',
  'accesstoken._apiIds': 'Select the My API that this token should provide access to.',
  'accesstoken.autoPurgeAt':
'Select the time after which the token should be automatically purged from the system.',
  'distributed.sObjectType':
'Use this field to specify the additional referencelist (child sObjects of parent sObject) that you would like to add to the export data. Ex: Contact is a childSObjectType for the parentSObject type Account.',
  'distributed.referencedFields':
'Use this setting to add additional fields on the childSObject to the export data defined as lookup fields on Salesforce. Ex: If Contact is set as the childSObjectType, this setting allows users to pull data from the reference fields (such as Created By, Account Name) on the Contact sObject.',
  'distributed.filter':
'Use this field to filter out any reference list by entering the "where" clause of SOQL query. This expression will be added as a part of the SOQL query in the where clause while fetching the childSObjectType. If no filter is added, IO will send all the child SObjects in the export data. Ex: If you would like to only export Contacts whose LastName has "Bond" in it, set the expression as "LastName=`Bond` ".',
  'distributed.orderBy':
'Use this field to specify how you would like to order the related list records. Ex: Use `CreatedDate` to order the records by date created. The default order is `Ascending order`. To change it to use descending order using the order by field as `CreatedDate DESC`.',
  'fb.pg.exports.transform':
'Define a ‘transformation’ here to rename fields, remove fields, and/or structurally optimize records returned by the export before the records are passed along to downstream applications.',
  'fb.pg.exports.filter':
'Define an ‘output filter’ here to specify which records returned by the export should get passed along to downstream applications. i.e. Records that evaluate to true are passed along. Records that evaluate to false are discarded.',
  'fb.pg.exports.hooks':
'Define a ‘hook’ here to use custom code to process records returned by the export before the records are passed along to downstream applications.',
  'fb.pg.exports.schedule':
"Define a 'schedule override' here to run this export/transfer on its own schedule.",
  'fb.pg.exports.as2routing':
'AS2 Exports which share a connection require routing rules to be in place so that incoming messages can be properly routed to the correct flow. This export has a shared AS2 connection and thus needs routing rules to be in place.',
  'fb.pp.exports.transform':
'Define a ‘transformation’ here to rename fields, remove fields, and/or structurally optimize records returned by the lookup before the records are merged back into the source record.',
  'fb.pp.exports.filter':
'Define an ‘output filter’ here to specify which records returned by the lookup should get merged back into the source record. i.e. Records that evaluate to true are merged. Records that evaluate to false are discarded.',
  'fb.pp.exports.hooks':
'Define a ‘hook’ here to use custom code to process records returned by the lookup before the records are merged back into the source record.',
  'fb.pp.exports.responseMapping':
'Configure ‘results mapping‘ to specify where data returned by the lookup should be merged back into the source record.',
  'fb.pp.exports.postResponseMap':
'Define a ‘hook’ here to use custom code to process records after the response/results mapping is complete, but before the records are passed along to downstream applications.',
  'fb.pp.exports.proceedOnFailure':
'If the lookup fails for a specific record then what should happen to that record?  Should the failed record pause here until someone can analyze and fix the error (i.e. the default behavior), or should the failed record proceed to the next application in the flow regardless?',
  'fb.pp.exports.inputFilter':
'Define an ‘input filter‘ here to specify which source records should get processed by the lookup. i.e. Records that evaluate to true are processed. Records that evaluate to false are ignored (but still passed along to downstream applications in the flow).',
  'fb.pp.imports.importMapping':
'Define an ‘import mapping’ here to specify how fields in the source record should map to fields in the destination application.  i.e. first_name in the source record should map to firstName in the destination application.',
  'fb.pp.imports.transform':
'Define a ‘transformation’ here to rename fields, remove fields, and/or structurally optimize the response data returned by the import before the response data is merged back into the source record.',
  'fb.pp.imports.filter':
'Define an ‘output filter’ here to specify which source records should be processed by the import.  i.e. Records that evaluate to true are processed.  Records that evaluate to false are ignored (but still sent along to downstream applications in the flow).',
  'fb.pp.imports.hooks':
'Define a ‘hook’ here to use custom code to process source records before they are submitted to the destination application (pre and post mapping hooks are available), or to process response data returned by the import (i.e. to handle errors, enhance error messages, etc...).',
  'fb.pp.imports.responseMapping':
'Configure ‘response mapping‘ to specify where fields returned by the destination application should be merged back into the source record.',
  'fb.pp.imports.postResponseMap':
'Define a ‘hook’ here to use custom code to process records after the response/results mapping is complete, but before the records are passed along to downstream applications.',
  'fb.pp.imports.proceedOnFailure':
'If the import fails for a specific record then what should happen to that record?  Should the failed record pause here until someone can analyze and fix the error (i.e. the default behavior), or should the failed record proceed to the next application in the flow regardless?',
  'fb.pp.imports.inputFilter':
'Define an ‘input filter’ here to specify which source records should get processed by the import. i.e. Records that evaluate to true are processed. Records that evaluate to false are ignored (but still passed along to downstream applications in the flow).',
  'mapping.v2.dataType': 'Select the data type of the destination field.',
  'mapping.v2.sourceDataType': 'The source field data type is automatically assigned when the source field is chosen from the drop-down list or the field mapping type is hardcoded or expression. If you are entering a new field into the source record, use this to assign its data type.',
  'mapping.v2.fieldMappingType': 'Select the type of mapping you want to apply to the destination field:<br><b>• Standard</b>: Send the value of the source field as the value in the destination field.<br><b>• Hard-coded</b>: Set the source field to a defined value for the destination field.<br><b>• Handlebars expression</b>: Build a handlebars expression for the value in the source field to send to the destination field.<br><b>• Lookup</b>: Define a static value-to-value mapping or use the results of a dynamic search to populate the destination field value.<br>See <a href="https://docs.celigo.com/hc/en-us/articles/360019506771-Map-source-record-fields-to-destination">Map source fields to destination</a>.',
  'mapping.v2.useDate': 'Check this box if the destination field is a date type field. Additional options display if this box is checked.',
  'mapping.v2.extractDateFormat': 'Select the date format for the source field',
  'mapping.v2.extractDateTimezone': 'Select the time zone for the source field',
  'mapping.v2.generateDateFormat': 'Select the date format for the destination field',
  'mapping.v2.generateDateTimezone': 'Select the timezone for the destination field',
  'mapping.v2.default': 'Enter a custom value to set as the default value.',
  'mapping.v2.expression': 'Use the advanced field editor (AFE) to build a handlebars expression. The result of the handlebars expression will populate the destination field.',
  'mapping.v2.lookup.mode': '<b>• Static or value-to-value lookup</b>: Use a static lookup if you already know all possible source and destination field values and how the lookup data should be mapped. For example, if you are mapping shipping methods between two applications, use a static lookup to define the source and destination mappings. You can use handlebars expressions if necessary.<br><b>• Dynamic lookup</b>: Use a dynamic lookup to search for record data by sending an HTTP call to the import application\'s API. For example, if you have an email address in your source, you can use the email address to search for additional data from the associated records in the import application.',
  'import.v2.lookup.name': 'Enter a descriptive and unique name to identify this lookup for future use.',
  'mapping.v2.relativeURI': 'Enter the resource path portion of the API endpoint. For example: \'/product\' or \'/bulkUpdate/orders\'. The relative URI value is appended to the base URI defined in the connection resource associated with this import. The base URI and relative URI together complete a fully qualified URL that defines the API endpoint. You can sometimes use query string parameters to pass extended information to an API endpoint. See the lookup application\'s API documentation for available endpoints and query string parameters.',
  'mapping.v2.lookup.method': 'Provide the HTTP method required by your lookup application to retrieve the lookup data (options include GET, or POST). Consult your destination application\'s API documentation to determine which method is best to use for your lookup.',
  'mapping.v2.lookup.extract': 'Enter the JSON path to the lookup field in the response body returned by the lookup application. For example: "products[0].name".',
  'mapping.v2.lookup.body': 'Define the exact HTTP request body that integrator.io will send to the destination application endpoint. Any mapping configurations you have configured with the user interface will be ignored, and only the HTTP request body text entered in this field will be sent in the request.',
  'mapping.v2.copyObject': 'Select <b>Yes</b> if there is an object in the source that you want to send to the target application without modification. integrator.io will send exactly the same child fields and their values to the target application. Otherwise, select <b>No</b> to define the mappings for each child field of the object. You don\'t need to add any mappings for the object type of the destination field.',
  'mapping.v2.copyObjectArray': 'Select <b>Yes</b> if there is an object in the source that you want to send to the target application without modification. integrator.io will send exactly the same child fields and their values to the target application. Otherwise, select <b>No</b> to define the mappings for each child field of the object.',
  'mapping.v2.objectAction': 'Action to take if the mapping returns an empty value:<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.multifieldAction': 'Select one of the following options when the mappings return an empty value:<br><b>• Use empty string as default value</b>: The value will be set to an empty string (\'\').<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define. Only use TRUE or FALSE as the custom value as the destination field is a boolean data type.<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.hardcodedAction': 'Select one of the following options to hard-code the value for the destination field:<br><b>• Use empty string as default value</b>: The value will be set to an empty string (\'\').<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define.',
  'mapping.v2.boolStandardAction': 'Select one of the following options when the mappings return an empty value:<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define. Only use TRUE or FALSE as the custom value as the destination field is a boolean data type.<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.standardAction': 'Select one of the following options when the mappings return an empty value:<br><b>• Use empty string as default value</b>: The value will be set to an empty string (\'\').<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define. Only use TRUE or FALSE as the custom value as the destination field is a boolean data type.<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.staticLookupAction': 'Action to take if the source field value does not match any field values in the lookup record<br><b>• Fail record</b>: Records without any match will fail without generating errors.<br><b>• Use empty string as default value</b>: The value will be set to an empty string (\'\').<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define. Only use TRUE or FALSE as the custom value as the destination field is a boolean data type.<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.dynamicLookupAction': 'Action to take if the dynamic lookup fails to return a record<br><b>• Fail record</b>: Records without any match will fail without generating errors.<br><b>• Use empty string as default value</b>: The value will be set to an empty string (\'\').<br><b>• Use null as default value</b>: The value will be set to "null".<br><b>• Use custom default value</b>: The value will be set to the custom value you define. Only use TRUE or FALSE as the custom value as the destination field is a boolean data type.<br><b>• Do nothing</b>: The record will be skipped.',
  'mapping.v2.description': 'Describe your mappings so that other users can quickly understand the logic without having to read through the configurations. It\'s a good idea to highlight any nuances that you or someone else might need to know for later revisions. Also, as you make changes to the mappings, remember to keep this setting up to date.',
  'mapping.dataType':
'Select the data type of the import field, such as Boolean, string, or number array.',
  'mapping.discardIfEmpty':
'Please check this checkbox if you would like to discard this mapping when the result of the mapping is empty. If you are mapping a list field and all the fields in the list are mapped to empty values then the whole list will be discarded.',
  'mapping.useFirstRow':
`Check this box to update the destination sublist fields using only the value of the first sublist retrieved for the record. For example, if the source app contains the following two rows:
<table style="width:98%; margin-top: 8px; margin-bottom: 8px; border-collapse:collapse;"  text-align: left; color:#D6E4ED; background-color: #ffffff;"> <thead><tr> <th style="border:1px solid #D6E4ED; padding-left: 6px;">Name</th> <th style="border:1px solid #D6E4ED; padding-left: 6px;">Visits</th> </tr></thead>
<tr> <td style="border:1px solid #D6E4ED; padding-left: 6px;">Jones</td> <td style="border:1px solid #D6E4ED; padding-left: 6px;">3</td> </tr>
<tr> <td style="border:1px solid #D6E4ED; padding-left: 6px;">Smith</td> <td style="border:1px solid #D6E4ED; padding-left: 6px;">11</td> </tr>
</table>
When you select <b>Apply only the first row’s value and map the Visits</b>, the destination records will be synced as follows upon import, ignoring the second (or subsequent) rows.
<table style="width:98%; margin-top: 8px; margin-bottom: 8px; border-collapse:collapse;"  text-align: left; color:#D6E4ED; background-color: #ffffff;"> <thead><tr> <th style="border:1px solid #D6E4ED; padding-left: 6px;">Name</th> <th style="border:1px solid #D6E4ED; padding-left: 6px;">Visits</th> </tr></thead>
<tr> <td style="border:1px solid #D6E4ED; padding-left: 6px;">Jones</td> <td style="border:1px solid #D6E4ED; padding-left: 6px;">3</td> </tr>
<tr> <td style="border:1px solid #D6E4ED; padding-left: 6px;">Smith</td> <td style="border:1px solid #D6E4ED; padding-left: 6px;">3</td> </tr>
</table>
`,
  'mapping.isKey':
'Check this box to use this NetSuite sublist field to identify a NetSuite line with the same value as the external field. If a match is found, integrator.io will update the NetSuite sublist line; otherwise, it will insert a new line. \n For example, let’s say you are updating a sales order that has a custom field called VendorItemId in its line items. When the source app sends a VendorItemId in the line data, you can map that field to the NetSuite destination’s VendorItemId and select <b>Use as a key field to find existing lines.</b> Then, if NetSuite has the same VendorItemId value in that record’s sublist, <a href="https://www.celigo.com/ipaas-integration-platform/" target="_blank"/>integrator.io</a>will update the corresponding lines with the source value.',
  'mapping.fieldMappingType':
`The type of field mapping that you want to perform. For more information, refer to <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360019506771" target="_blank"/>Map source record fields to destination</a>.`,
  'mapping.extract':
'This dropdown lists all the available fields from your export record that can be used in your expression. Either by themselves, or as argument value for any selected helper methods.',
  'mapping.expression':
'This field represents your complete handlebars expression. You have the freedom to manually enter an expression, or use the function and field drop-downs above to help construct it.',
  'mapping.standardAction':
'<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. <br /><b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. <br /><b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'mapping.lookupAction':
'<b>Fail Record:</b> If no results are found or the dynamic lookup fails, the lookup will silently fail (return empty string). Similarly, if multiple results are found  (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails. <br /><b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. <br /><b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. <br /><b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'mapping.default':
'This holds the default value to be set for the extract field.',
  'mapping.hardcodedDefault':
'This field can be used when any field value on the import system has to be hardcoded with some value. Generate field combined with this field will make the generate field to be filled with this value.',
  'mapping.lookupDefault':
'This holds the default value to be set for the extract field.',
  'mapping.options': 'Hard-coding a field mapping will ignore the exported value and replace it with one of the following options:<br /> <ul><li><b>Use empty string as hard-coded value</b>: Populates an empty string (\'\') into this field</li><li><b>Use null as hard-coded value</b>: Populates a null data type into this field</li><li><b>Use custom value</b>: Populates the string that you enter below for <b>Enter default value</b> into the mapped field</li></ul>',
  'mapping.extractDateFormat':
'If the export field is of date, then this field represents the date format of the field being exported.',
  'mapping.extractDateTimezone':
'If the export field is of date, then this field represents the time zone of the field being exported',
  'mapping.generateDateFormat':
'If the import field is of type date, this field represents the date format supported on the import system.',
  'mapping.generateDateTimezone':
'If the import field is of type date, this field represents the time zone of the field on the import system.',
  'mapping.functions':
`This drop-down has all the available helper methods that let you transform your field values. Once you make a selection, the function and placeholder values will be added to the expression text box below. You can then make any necessary changes by editing the complete expression.For a complete list and extended help of all helper methods, please see this article: <a target="blank" href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360039326071-Handlebars-Library">handlebars Helper Guide</a>`,
  'mapping.immutable':
'Check to always import records, even if they generate errors from the destination app. By default, if a record fails to import, integrator.io will parse the error message from the destination app. If a specific field can be identified in the error message as the root cause for the import’s failure, then that field will be removed and the import will be retried again automatically.<br>For most fields, this behavior (when left unchecked) is intended, so that single fields do not prevent entire records from importing. However, for those fields where the import/sync is mission critical, check <b>Immutable</b> to tell integrator.io not to remove the field for an automatic retry. See the <a href="https://docs.celigo.com/hc/en-us/articles/360019506771" target="_blank">Import mapping settings</a> for an example record.',
  'mapping.useAsInitializeValue':
'NetSuite allows certain fields to be initialized (preloaded on the NetSuite form) when the record is being created or transformed, known as record initialization. Check this box if you would like to add this field during record initialization. \nExample: To specify the subtype as Sale, Purchase, or Resale when creating a non-inventory item, you must set the mapping during the initialization process by checking this box.',
  'mapping.lookup.mode':
'Use a dynamic search to look up data directly in the import application. For example, you can use this option if you have an email address in your export data and you want to run a search to find a system id value in the import application. Use a static value-to-value mapping when you already know all possible values and how they should be translated. For example, if you are mapping a handful of shipping methods between two applications, you can define them here. You can also use <a href="https://docs.celigo.com/hc/en-us/articles/115000924331-Use-handlebars-in-static-lookups" target="_blank">handlebars</a> for static lookups in this field.',
  'mapping.conditional.when':
'Perform this mapping when <br> <b>Record is created </b> </br> Perform the field mapping only when the record is being created. Otherwise, ignore this mapping.</br> <b>Record is updated</b> </br>Perform the field mapping only when the record is being updated. Otherwise, ignore this mapping.</br><b>Source is not empty</b> </br>Perform the field mapping when the extract resolves to a truthy value. Otherwise, ignore this mapping.</br> <b>Lookup is not empty</b> </br>Perform the field mapping when the lookup defined finds a record and it the return field’s value is not empty. Otherwise, ignore this mapping.</br><b>Lookup is empty</b> </br>Perform the field mapping when the lookup defined does not find a record or the found records field value is empty. Otherwise, ignore this mapping.</br><b>Field is not set</b> </br>Perform this field mapping if the record to be updated in NS does not have a value set. Otherwise, ignore the mapping.</br>By default, if none of the condition is specified the mapping is always considered.',
  'mapping.relativeURI':
'This json path used to set the lookup in the URI itself. Ex: search.json?query=type:organization name:{customer.name}',
  'mapping.lookup.method': 'Select the HTTP method to use when performing the lookup query.',
  'mapping.lookup.extract': 'Enter the JSON path in the lookup response body where the expected lookup value, to be set in the import application, will be found, such as "products[0].name".',
  'mapping.netsuite.lookup.recordType':
'Record type on the Netsuite for which we are defining the import.',
  'mapping.netsuite.lookup.expressionText':
'Expression can be provided in this field which will return the matching resultField after evaluating the expression. Ex: [["subsidiary", "anyOf", "{{subsidiary}}"], "AND", ["entityId", "is", "{{entityid}}"]]',
  'mapping.netsuite.lookup.resultField':
'Field name that has to be extracted out using the lookups.searchField.',
  'mapping.salesforce.lookup.sObjectType':
'Enter the sObject type in Salesforce that you would like to query. If the sObject type you are looking for is not displayed then please click the refresh icon.',
  'mapping.salesforce.lookup.whereClauseText':
'The SOQL where clause expression that will be executed when this lookup is run.',
  'mapping.salesforce.lookup.resultField':
'The value of this field will be used to populate your field mapping.',
  'export.hooks':
'Hooks represent well defined places where custom code can be injected into an integration flow. For example, when data is first exported out of an application there is a ‘Pre Save Page’ hook available that allows you to modify each page of data before it gets passed along to downstream processors. Another example, after data is imported into an application there is a ‘Post Submit’ hook available that allows you to handle errors, or enhance error messages to include more information, etc… Hooks can be written directly in integrator.io using native JavaScript, or hooks can be hosted externally (either on your own server or via AWS Lambda), in which case any programming language can be used.',
  'lookup.input.filter':
'Important: only records where the filter expression evaluates to true will get processed. All other records will simply get passed along to subsequent applications in your flow. Defining an input filter allows you to skip processing for specific records for specific applications. For example, if you have an import that posts messages to Slack for all web orders that come in throughout the day, you could use an input filter to instead only post messages for orders that are above a certain amount.',
  'lookup.output.filter':
'Important: only records where the filter expression evaluates to true will get passed along. All other records will get discarded. Defining an output filter allows you to discard records when you are working with older applications that do not natively support the ability to define search criteria. If an application does support the ability to define search criteria then you should use that native functionality (vs defining out filters here) to avoid pulling unnecessary data into integrator.io.',
  'import.response.mapping': `Response mapping enables you to specify where fields returned by the destination application should be merged back into the source record. If you don't see a specific import response field in the drop-down below, you can still map it by manually typing in the field name, then the mapping will work as long as the field is returned by the destination application when the flow is running. You can merge import response fields into any existing field in the source record, or you can specify a new field in which case integrator.io will create the field on-the-fly. You can also merge errors back into the source record if you want to manually process errors downstream in your flow.Learn <a href="${HELP_CENTER_BASE_URL}/hc/en-us/articles/360019506771-Understand-data-mapping" target="_blank">more about mapping.</a>`,
  'lookup.response.mapping':
'The primary reason for defining a results mapping is to specify where the ‘data’ returned by the lookup should be merged back into the source record.  You can merge ‘data’ into any existing field in the source record, or you can specify a brand new field in which case integrator.io will create the field on the fly.  By default, integrator.io will add this mapping for you, and will create a brand new field in the source record following the naming convention ‘lookupResultsN’, but it is recommended that you change this name to match the type of data being returned (i.e. relatedContacts, linkedItems, etc…) so that your source records are more intuitive to read and map later.  Though much less common, you can also merge the results field ‘errors’ back into the source record if you want to manually process errors downstream in your flow logic.',
  'lookup.transform': 'Define one or more transformation rules to rename fields, remove fields, and/or structurally optimize records returned by the export before the records are passed to the next step in the flow.<br/>• At the left, select the field you want to extract from your export data. Then enter the field name to generate.<br/>• You must extract all of the fields you want to keep, even if you do not modify all of them.<br/>• Transformation rules are applied in the order in which they appear; drag and drop the rules to change the order.',
  'import.transform': 'Define one or more transformation rules to rename fields, remove fields, and/or structurally optimize the response data returned by the import before the response data is merged back into the source record.<br/>• At the left, select the field you want to extract from the response data. Then, enter the field name to generate.<br/>• Transformation rules are applied in the order in which they appear; drag and drop the rules to change the order.',
  'users.user': 'All users who have access to your account and integrations, or who have been invited to join your account.',
  'users.accesslevel': 'Users with administer-level access can perform all the same actions as an account Owner, with the exception of transferring account ownership to another user, and will have full access to all integrations in the account. Users with manage level access can make changes to the integration. Users with monitor level access can view the integration only for the purpose of running flows and troubleshooting integration errors. Owner and Administrator users are responsible for provisioning access to the integration. <a href="https://docs.celigo.com/hc/en-us/articles/115003929872" target="_blank">Find out more about role and permissions.</a>',
  'users.status': "'Pending' means the user has not yet accepted the invite to your account.  'Accepted' means the user has accepted the invite to your account.  'Dismissed' means the user dismissed the invite to your account.",
  'users.enable': 'This enables you to revoke access without deleting the user from the account. If Off, then the user will no longer be able to switch to this account - it will no longer show up in their <b>Accounts</b> drop-down.',
  'users.accountSSOLinked': ' This field indicates whether the user has successfully signed in using the account’s SSO settings. If yes, the user can only sign in to integrator.io using this account’s SSO settings. If no, the user can sign in to integrator.io using other authentication methods.',
  'users.requireAccountSSO': 'Define whether a user must sign in using the account’s SSO  settings.<ul><li>If you enable this field, it indicates that a user can sign in only with the account’s SSO settings. Before you enable this field, ensure that the user selects this account as the <a href="https://docs.celigo.com/hc/en-us/articles/6720519866395-Sign-in-using-single-sign-on-SSO-#Primary-SSO-account" target="_blank">primary SSO account</a>.</li><li>If you disable this field, it indicates that a user can sign in using other authentication methods.</li></ul>',
  'users.requireAccountMFA': 'Switch <b>Require MFA</b> on for any users who are required to authenticate with MFA when accessing your account. You can modify the security settings for these users in the <b>MFA section</b> under the <b>Security</b> tab in your profile.',
  'users.actions': 'These are actions the account owner can perform, like <b>Make account owner</b>, which will make that user the owner of the selected account. <b>Change permissions</b> enables the account owner to manage each user’s access level. <b>Delete</b> will delete the user from the account and they will no longer have access.',
  'accountdashboard.numRuns': 'The number of times the flow has completed for the selected date range.',
  'accountdashboard.avgRuntime': 'The average time the flow takes to complete running. The run time includes the time the flow is “Waiting in queue” status.',
  'accountdashboard.numResolvedByAuto': 'The number of errors that were auto-resolved, based on a match to another error’s <a href="https://docs.celigo.com/hc/en-us/articles/360060740672" title="https://docs.celigo.com/hc/en-us/articles/360060740672" data-renderer-mark="true">trace key</a> (unique field identifier).',
  'runConsole.resolved': 'This column displays the total number of duplicate errors in each flow step that were resolved as a result of automatic identification with a matching <a href="https://docs.celigo.com/hc/en-us/articles/360060740672" title="https://docs.celigo.com/hc/en-us/articles/360060740672" data-renderer-mark="true">trace key</a>.',
  'runHistory.flow': 'Expand a flow run to see the historical breakdown of success, ignored, errors and pages encountered at each flow step (such as an export) from previous flow runs. The total number of errors, if any, reported at that flow step contains a link to complete details and actions for each error.',
  'runHistory.status': 'Filter the flow runs to see execution of flows that completed but with errors (Contains errors), that was canceled by someone or automatically (Canceled), that completed with no errors or with errors (Completed), and that failed (Failed).<br />You can click on the "info icon" next to "Canceled" status to view whether the flow was canceled by a user or by the System.',
  'runHistory.errors': 'The numbers in this column represent a historical snapshot of the error count when a flow was run. To preserve the historical nature of these stats, the numbers in this column are not updated when you retry and/or resolve the same errors.',
  'myaccount.name':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'myaccount.email':
'Email is a very important field. Password reset links, product notifications, subscription notifications, etc. are all sent via email.It is highly recommended that you take the time to secure your email, especially if you are integrating sensitive information with your integrator.io account.',
  'myaccount.password':
'There are minimum password requirements that all integrator.io users must satisfy, but we highly recommend using a password management app to auto generate a truly random, complex password that no one can remember or guess, and then rely solely on your password management app to sign you in to integrator.io.',
  'myaccount.company':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'myaccount.role':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'myaccount.phone':
'This field will be displayed to other integrator.io users that you are collaborating with, and is also used by Celigo to administrate your account/subscription.',
  'myaccount.timezone':
'Use this field to configure the time zone that you want dates and times to be displayed in your integrator.io account. This field is also used by the integrator.io scheduler to run your integration flows at the correct time of day based on your time zone.',
  'myaccount.dateFormat':
'Use this field to configure how you want dates to be formatted in your integrator.io account. For example, there is a dashboard in your integrator.io account to view integration activity, and this field controls how the dates on that page appear.',
  'myaccount.timeFormat':
'Use this field to configure how you want times to be formatted in your integrator.io account. For example, there is an Audit Log page in your integrator.io account that lists changes made to resources in your account, and this field controls how the times on that page appear.',
  'myaccount.developer': 'Turning on this setting will expose developer centric fields in the integrator.io UI. For example, when defining an \'Export\' or an \'Import\' there are \'Hooks\' fields available in the UI where custom code can be configured.',
  'myaccount.showIconView': 'Turning on this setting will expose a toggle option in the flowbuilder page which allows you to switch between bubble view and iconic view in the flowbuilder layout',
  'myaccount.showRelativeDateTime': 'Check this box to view the amount of time elapsed since an event occurred, such as <b>1 hour ago</b> or <b>1 day ago</b>. Otherwise, the display format is absolute, such as <b>2021-10-25 7:47:33 PM</b>.',
  'hooks.insertFunction':
'Select a function stub to add a model entry point for a built-in <a href="https://docs.celigo.com/hc/en-us/articles/360039655111-Hooks-for-integrator-io">hook</a>. Each stub includes example parameters, a return value, and self-documenting comments.',
  'hooks.scriptContent':
'Edit your script in the pane below, or expand the view by using the control. Your script should be valid JavaScript and may contain multiple functions that can be used across a range of flows within your account.',
  'file.csvGenerate':
'The CSV generator helper can be used to visualize and experiment with how <a href="http://integrator.io" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://integrator.io&amp;source=gmail&amp;ust=1590834533735000&amp;usg=AFQjCNFu7ZCLXUvr9xFWTLIWM0LeXPlPwg">integrator.io</a> builds CSV files (or any other delimited text files) from the JSON records/rows being processed by your flow.',
  'file.csvParse':
'The CSV parser helper can be used to visualize and experiment with how <a href="http://integrator.io" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://integrator.io&amp;source=gmail&amp;ust=1590834533735000&amp;usg=AFQjCNFu7ZCLXUvr9xFWTLIWM0LeXPlPwg">integrator.io</a> parses CSV files (or any other delimited text files) into the JSON records/rows that then get processed by your flow.',
  apiIdentifier:
'This resource can be invoked via an HTTP request to this unique URL.',
  pathToMany:
'If the records being processed are JSON objects, then use this field to specify the JSON path to the child records. This field does not need to be set for array/row based data.',
  'connection.debug':
'Enable Connection debugging for the selected period of time to collect all requests and responses made via the Connection. The debug logs can be accessed via the Connections tab of the Flow Builder.',
  'stack.sharing':
'Invite users from any integrator.io account to share your stack, which will allow them to invoke the functions in your stack from their integration flows. You may revoke their access from this screen at any time.',
  parentSObjectType: 'Use this field to specify the additional referencelist (child sObjects of parent sObject) that you would like to add to the export data. Ex: Contact is a childSObjectType for the parentSObject type Account.',
  'pageGenerator.type': 'The source options presented – or automatically selected for you – depend on the features available in the application that you chose.',
  'pageGenerator.connection': 'Choose an existing connection to this application, or click the <b>+</b> icon to create a new connection. You can always change your connection later.',
  'pageGenerator.checkExistingExport': 'Select an existing resource (export, listener, or transfer) to add to this flow.<br/> <b>Note: Any edits you make to an existing resource will also apply to all other flows that use it, so verify that no other flows will break as a consequence.</b><br/><br/>To set up a new resource, leave this box unchecked and click <b>Next.</b>',
  application: 'Choose an application, database, or universal connector.',
  'pageProcessor.connection': 'Choose an existing connection to this application, or click the <b>+</b> icon to create a new connection. You can always change your connection later.',
  'pageProcessor.resourceType': 'The destination options presented – or automatically selected for you – depend on the features available in the application that you chose.',
  'pageProcessor.checkExistingImport': 'Select an existing resource (import, lookup, or transfer) to add to this flow.<br/> <b>Note: Any edits you make to an existing resource will also apply to all other flows that use it, so verify that no other flows will break as a consequence.</b><br/><br/>To set up a new resource, leave this box unchecked and click <b>Next.</b>',
  'pageProcessor.checkExistingExport': 'Select an existing resource (export, listener, or transfer) to add to this flow.<br/> <b>Note: Any edits you make to an existing resource will also apply to all other flows that use it, so verify that no other flows will break as a consequence.</b><br/><br/>To set up a new resource, leave this box unchecked and click <b>Next.</b>',
  referencedFields: 'Use this setting to add additional fields on the childSObject to the export data defined as lookup fields on Salesforce. Ex: If Contact is set as the childSObjectType, this setting allows users to pull data from the reference fields (such as Created By, Account Name) on the Contact sObject.',
  childRelationship: 'Use this field to specify the additional referencelist (child sObjects of parent sObject) that you would like to add to the export data. Ex: Contact is a childSObjectType for the parentSObject type Account.',
  'salesforce.referencedFields': 'Use this setting to add additional fields on the childSObject to the export data defined as lookup fields on Salesforce. Ex: If Contact is set as the childSObjectType, this setting allows users to pull data from the reference fields (such as Created By, Account Name) on the Contact sObject.',
  filterExpression: 'Use this field to filter out any reference list by entering the "where" clause of SOQL query. This expression will be added as a part of the SOQL query in the where clause while fetching the childSObjectType. If no filter is added, IO will send all the child SObjects in the export data. Ex: If you would like to only export Contacts whose LastName has "Bond" in it, set the expression as "LastName=`Bond` ".',
  orderBy: 'Use this field to specify how you would like to order the related list records. Ex: Use `CreatedDate` to order the records by date created. The default order is `Ascending order`. To change it to use descending order using the order by field as `CreatedDate DESC`.',
  'afe.sampleDataSwitch': "Advanced Field Editor (AFE) 2.0 exposes an improved set of context variables that make it easier to build dynamic values and/or complex structures. The generic 'data' variable has been replaced by a set of more specific variable names to better represent the structure of your template data. For example: 'record', 'rows[]', 'batch_of_records[]', etc... <br /> Note: This AFE defaults to AFE 2.0 each time you open it. If your edits rely on AFE 1.0 functionality, verify that you have set this to AFE 1.0 on save. If you enter data for both AFE 1.0 and AFE 2.0, only the data displayed for the active toggle when you click Save will be preserved.",
  'afe.mappings.toggle': 'Mapper 2.0 provides an improved record representation that allows users to better visualize the record structure integrator.io sends to the target application. These improvements include the ability to create nested arrays and write handlebars expression using advanced field editors (AFEs).<br>Note: Additional mapping functionality in future releases will only be added to Mapper 2.0.',
  'afe.mappings.settings': 'Define mappings for the destination field',
  'afe.mappings.v2.rule': 'Define the JSON structure of the data to send to the destination application. See <a href="https://docs.celigo.com/hc/en-us/articles/4409527888923-Work-with-JSON-data-in-integrator-io">Work with JSON data in integrator.io.</a>',
  'afe.mappings.v2.input': 'This is an example of the source application\'s input data received by the mapping for this flow step. You can also view the data classification (<a href="https://docs.celigo.com/hc/en-us/articles/4409527888923-Work-with-JSON-data-in-integrator-io#JSON-record-or-row">record or row</a>) in this panel.',
  'afe.mappings.v2.output': 'This is an example of the output data generated by your current mapping configuration. You can also view the data classification (<a href="https://docs.celigo.com/hc/en-us/articles/4409527888923-Work-with-JSON-data-in-integrator-io#JSON-record-or-row">record or row</a>) in this panel.',
  'afe.mappings.input': 'The input area shows the complete source data as it enters the mapping processor.',
  'afe.filters': '<a href="https://docs.celigo.com/hc/en-us/articles/360025927811-Apply-filters">Applying filters</a> helps you refine your data as it progresses through a flow. Output filters refine the data retrieved from your source application, while input filters selectively accept incoming data for a lookup or import.',
  'afe.import.mapping': 'Use <a href="https://docs.celigo.com/hc/en-us/articles/360019506771">import mapping</a> to define the record structures integrator.io sends to the destination application. integrator.io can auto-map your data (BETA) for certain connections, and you can use handlebars expressions to write complex logic for most use cases.',
  'afe.responseMappings.input': 'The input area shows the parsed response from the import application, and this data is available to merge with existing source record data.',
  'afe.lookupMappings.input': 'The Input area shows the parsed results from the lookup application, and this data is available to merge with existing source record data.',
  'afe.mappings.output': 'The output area shows the complete data set that will be sent to the import application, after the mapping has been applied.',
  'afe.responseMappings.output': 'The output area shows the new source record data after the import response has been added or merged.',
  'afe.lookupMappings.output': 'The output area shows the new source record data after the lookup data has been added or merged.',
  'afe.mappings.netsuite.assistant': 'The NetSuite Mapping Assistant emulates your NetSuite account, displaying a standard form with only the visible fields. Click a destination field to be mapped, and then select the field in the Assistant to populate your import mapping with the NetSuite (path and) field name.',
  'afe.mappings.salesforce.assistant': 'The Salesforce Mapping Assistant emulates your Salesforce account, displaying a standard form with only the visible fields. Click a destination field to be mapped, and then select the field in the Assistant to populate your import mapping with the Salesforce (path and) field name.',
  'afe.router.input': 'The input area shows the complete source data as it enters a flow branching.',
  'afe.router.output': 'The output area shows the branches into which records will flow based on the branch conditions.',
  'mapping.suitescript.netsuite.lookup.searchField': 'Field name that is provided to the lookups defined, using this field name the respective field from the record will be extracted out and provided for the respective field in the import system.',
  'mapping.suitescript.lookup.failWhenUniqueMatchNotFound': 'When this flag is set, if no results are found or the dynamic lookup fails, the lookup will silently fail(return empty string). Similarly, if multiple results are found (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails.',
  'mapping.lookup.default': 'This holds the default value to be set for the extract field.',
  'mapping.suitescript.lookup.useNull': 'Please check this field if you want to use \'null\' as the default lookup value. This value will be used if your lookup does not find anything.',
  'mapping.suitescript.lookup.useEmptyString': 'Please check this field if you want to use \'\' (i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything.',
  'parser.xml.V0_json': `Automatic parsing means the XML data is converted to JSON without any user configurations.
This typically generates a more complex and difficult to read JSON.
If you would like to have more control over what the JSON output looks like,
use the custom option.`,
  'parser.xml.trimSpaces': 'If checked, values will be stripped of leading and trailing whitespace.',
  'parser.xml.listNodes': 'It is not always possible to infer which XML nodes are single values or a list. To force an XML node to be recognized as a list (Array), enter it\'s path here.',
  'parser.xml.includeNodes': 'Often XML documents are large and their full content is not needed. It is possibly to reduce the record size by specifying only the set of nodes (specified by path) that should be extracted.',
  'parser.xml.excludeNodes': 'It may be easier to specify node to exclude than which to include. If you wish to exclude certain xml nodes from the final record, specify them here using a simplified xpath.',
  'fb.pp.inputFilter':
'Define an \'input filter\' here to specify which source records should get processed. i.e. Records that evaluate to true are processed. Records that evaluate to false are ignored (but still passed along to downstream applications in the flow).',
  'afe.lookups': 'Lookups can be used to dynamically retrieve information from the destination application for the purpose of setting fields that cannot be set directly from the fields provided by the source application. For example, if the destination application requires \'customer_id\' values, but the source application only gives you email addresses, then you can define a lookup to search for \'customer_id\' values using the email addresses, and then inject the \'customer_id\' values into your final API requests.',
  'resource.debugLogs': 'Click <b>Start debug</b> to debug your resource. Select a duration, then run your flow to capture the logs. Click <b>Refresh logs</b> to see the latest logs. <br /> To view logs, click on a timestamp in the <b>Time</b> column. On the right, you can see the request made by integrator.io to the flow step application at that time, and the response returned by the application.',
  autoMapFields: 'Auto-map populates known field mappings for destination fields that have not yet been configured. Auto-map doesn’t overwrite mapping values that you have already set up manually. For example, if you have already mapped firstName in the destination field, then auto-map will preserve your configuration for firstName and only add field mappings for the remaining destination fields.',
  enableSSO: 'Use this toggle to enable single sign-on (SSO) for the account.',
  'sso.issuerURL': 'Enter the domain-specific URL issued by your SSO provider',
  'sso.clientId': 'Enter the  unique ID issued by your SSO provider.',
  'sso.clientSecret': 'Enter the  secret key issued by your SSO provider ',
  'sso.orgId': 'Enter a unique organization ID that integrator.io will use to generate a unique SSO URL for your account. This field only accepts alphanumeric characters and must be 3-20 characters in length.',
  'sso.loginURL': 'Use this unique URL to sign in to your account with SSO. Use this URL  when configuring the integrator.io app in your SSO provider.',
  'sso.redirectURL': 'Your SSO provider will send the authorization code tokens to this unique URL. Use this URL when configuring the integrator.io app in your SSO provider.',
  'sso.primaryAccount': 'Choose the account that you would like to use for SSO. Every time you sign in via SSO, integrator.io will verify that the SSO provider is linked to this specific account.',
  classification: 'Errors are automatically categorized according to their properties, such as the code, message, and source fields. For more information, see <a href="https://docs.celigo.com/hc/en-us/articles/4403697564429" target="_blank">Error classifications</a>',
  'import.lookup': 'Choose an existing lookup from the list or click <b>+</b> to define a new lookup. Lookups provide a way to dynamically search the destination application on the fly to find existing records.',
  'import.lookupType': 'Choose the method that should be used to identify if a source record already exists in the destination application: <br><b>• Records have a specific field populated – </b> <br>This method checks if a specific field in the source record already has a value, and then if so, the source record will be considered an existing record.<br>  <b>• Run a dynamic lookup – </b>This method will run a search in the destination application to find a record on the fly, and then if a record is found, the source record will be considered an existing record.',
  'import.ignoreExtract': 'Enter the path to the field in the source record that should be used to identify existing records. If a value is found for this field, then the source record will be considered an existing record.',
  'import.existingExtract': 'Enter the path to the field in the source record that should be used to identify existing records. If a value is found for this field, then the source record will be considered an existing record.',
  'import.existingLookupName': 'Choose an existing lookup from the list or click <b>+</b> to define a new lookup. Lookups provide a way to dynamically search the destination application on the fly to find existing records.',
  'import.netsuite.operation': 'Select <b>Add</b> if you are only importing new files into NetSuite. <br /><br /> Select <b>Update</b> if you are only importing modified versions of existing files into NetSuite. <br /> <br /> Select <b> Add or update</b> if you want your import to be more dynamic such that (1) if an existing file  is found in NetSuite then that file will be updated, or (2) if an existing file cannot be found in NetSuite then a new file will be added.',
  'import.netsuite.file.name': 'Specify the name (e.g. \'temp.txt\') for the file that you want to import to the NetSuite File Cabinet. If the file name should be dynamic based on the data you are integrating, you can specify the JSON path to the field in your data containing the name values instead. For example, {{{myFileField.fileName}}}. ',
  'import.netsuite.file.fileType': 'Each file in NetSuite has a fileType. This is an optional field that defines the file format (e.g. _PDF, _PLAINTEXT, etc.). If you have already provided file names with file extensions (e.g. temp.txt), then there’s no need to explicitly define the file type. If you haven’t, specify the file type (e.g. _PDF) for the files that you want to import. If the file type should be dynamic based on the data you are integrating, you can specify the JSON path to the field in your data containing the file type values instead. For example, <code>{{{myFileField.fileName}}}</code>. See all supported file types.',
  'import.netsuite.file.folder': 'Specify the internal ID for the Netsuite File Cabinet folder where you want to import  your files. If the folder internal ID should be dynamic based on the data you are integrating, you can specify the JSON path to the field in your data containing the folder internal id values instead. For example, {{{myFileField.fileName}}}.',
  'import.netsuite.file.internalId': 'Enter a reference ID or expression to identify reference IDs of files to replace in the NetSuite File Cabinet.',
  'auditlogs.download': 'Download up to 20000 records from the last year.',
  'pull.integration': 'Select the remote production or sandbox integration from which you pull changes. All linked integrations are displayed, which includes clones of this integration and the integration from which it was cloned.',
  'pull.description': 'Enter text describing the changes you are pulling into your integration.',
  'pull.reviewChanges': 'Review the changes between the current and remote integration. You can see all your integration resource changes, except for sensitive resources like API tokens and connections. You must resolve conflicts before you can continue to merge your changes. You’ll configure any new connections in the Merge changes step.',
  'pull.mergeChanges': 'You must first configure any new connections that are coming from the remote integration. There may be additional installations steps depending on the type of connection, including installing remote packages. You can cancel your merge at any time, or close the window and resume your merge later.',
  'revert.create': 'When creating a revert, you are restoring to a revision of an integration. The revert action will also generate a revision',
  'revert.description': 'Enter information about the revert',
  'revert.revision.createdAt': 'The date and time of the revision you’ll revert to.',
  'revert.revisionId': 'The revision you are reverting to.',
  'revert.reviewChanges': 'Review the changes between your current revision and the revision that you are reverting to. This is a list of every change you’ve made to your exports, imports, flows, and scripts.',
  'revert.finalRevertChanges': ' You can make changes to a source or cloned integration, then revert them. You must reconfigure your connections to revert your changes and there may be additional revert steps depending on necessary packages',
  'snapshot.description': 'Describe your snapshot so you can quickly identify the revision and any important details.',
  'http.parseSuccessResponses': 'The integrator.io works on JSON internally. If your API returns success data in a different format than JSON, parse HTTP response data using available parsers for CSV and XML.',
  'mfa.enable':
    'Switch the toggle ON to initiate the process to enable MFA for your profile. You must also complete the following steps; otherwise, MFA will remain disabled. When you disable MFA,  device settings will also be disabled so that you can enable MFA at any point in future.',
  'mfa.getVerificationApp':
    'You can configure MFA to use any authenticator app that supports time-based one-time-password protocol (TOTP). Supported authenticator apps include, but not limited to, Google, LastPass, and Microsoft.',
  'mfa.addIntegrationIO':
    'To add integrator.io to your MFA authenticator app, you can either scan the QR code or enter the secret key manually. You must enter the password to view the secret key or QR code for your profile. Do not save these details anywhere else. You can find the secret key and QR code in your profile at any time in the future if necessary.',
  'mfa.code.verify':
    'Enter the code from your authenticator app for the Celigo configuration you just completed to verify that the configuration is successful.',
  'mfa.primaryAccount':
    'If you lose the mobile device that has the authenticator app installed, the account owner or admin of the primary account can reset MFA credentials for your profile. Choose the account that you want to perform MFA resets.',
  'mfa.trustDevice':
    'If you choose to trust the device you are using to sign in to integrator.io, you will only be required to enter MFA credentials after 90 days. Your account owner can modify the number of days a trusted device will not require credentials.',
  'mfa.connect': 'This completes the MFA enablement process for your profile.',
  'mfa.reset':
    'If you have lost access to your MFA device or you believe your secret key has been compromised, click Reset to initiate the MFA reset process.',
  'mfa.qrcode':
    'View the QR code that was used to enable MFA for your profile.',
  'mfa.viewSecret':
    'View the secret key that was used to enable MFA for your profile.',
  'mfa.trustedDevices':
    'Click <b>Manage devices</b> to see a list of all trusted devices for your profile.',
  'mfa.dontAllowTrustedDevices': 'Check this box to remove the ability for users to add <a href="https://docs.celigo.com/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-your-account#Trusted-devices-vs-auth-devices" target="_blank">trusted devices</a>. Allowing users to add their own computer/browser to the trusted device list eliminates the need for them to enter their six-digit authentication code every time they sign in from the computer and browser they commonly use. If checked, MFA users can’t add trusted devices and must enter the six-digit code from their authentication device every time they sign in regardless of which device they use.',
  'mfa.trustDeviceForPeriod': 'If left blank, MFA users who sign in from <a href="https://docs.celigo.com/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-your-account#Trusted-devices-vs-auth-devices" target="_blank">trusted devices</a> are only required to enter their six-digit authentication code after 90 days of inactivity from the trusted device. To extend or reduce the default, enter the number of days of inactivity before re-authentication is required.',
  'accountSettings.dataRetentionPeriod': 'Select the number of days to store data. <br /><br /> Changing the retention period will apply to new data only. Data retained before a retention period change will continue to expire based on the retention period defined at the time of retention.<br /><br /><a href="https://docs.celigo.com/hc/en-us/articles/6359380074779-Access-data-for-more-than-30-days" target="_blank">Learn more about data retention</a>.',
  'template.name': 'Enter a logical name for this template so that potential users can identify it in the Marketplace.',
  'template.description': 'Provide additional information about the purpose of this template.',
  'template.applications': 'Search for the name of each third-party application you are integrating using this template, and select it to add it to the applications list. This helps potential users find your template when they search the Marketplace.',
  'template.contactEmail': 'Enter one or more email addresses, separated by commas, to make available for potential users to contact you with any questions.',
  'template.websiteURL': 'Provide the website for your organization.',
  'flowGroup.name': 'Provide a logical name for the new flow group and select the flows to include in this group. Keep in mind that flow groups are simply a tool to categorize flows within an integration.',
  'flowGroup.flows': 'Assigning a flow to a group does not impact scheduling or other flow configuration settings that determine when a flow runs. <a href="https://docs.celigo.com/hc/en-us/articles/4416660353819-Organize-flows-into-groups" target="_blank">Learn more</a>.',
  'dynaFormField.subrecord': 'Within the parent record shown, select a subrecord to map the source field to in the import. (Subrecords hold information about a parent record and are meaningful only within that context.) <a href="https://docs.celigo.com/hc/en-us/articles/360016510891-Configure-and-map-NetSuite-subrecords" target="_blank">Learn more</a>.',
  'dynaFormField.pathToNode': 'Select the JSON path to the line item fields. <a href="https://docs.celigo.com/hc/en-us/articles/360016510891-Configure-and-map-NetSuite-subrecords" target="_blank">Learn more</a>.',
  'userForm.email': 'Enter the email of the user you would like to invite to manage and/or monitor selected integrations.',
  'userForm.integrationsToManage': 'The invited user will have permissions to manage the integrations selected here.',
  'userForm.integrationsToMonitor': 'The invited user will have permissions to monitor the integrations selected here.',
  'userForm.accountSSORequired': 'Switch <b>Require SSO</b> on to require single sign-on (SSO) authentication for this user.',
  'userForm.accountMFARequired': 'Switch <b>Require MFA</b> on to require the user to authenticate with MFA when accessing your account.',
  'connectorLicense.email': 'This field is read-only. It displays the user’s email.',
  'connectorLicense.trialEndDate': 'Select the date when the trial subscription expires. The Integration App (IA) owner can edit the field based on changes in the trial subscription.',
  'connectorLicense.expires': 'Select the date when the subscription license expires. The Integration App (IA) owner can edit the field based on any changes in the subscription license.',
  'connectorLicense.sandbox': 'This field is read-only. It displays the user environment as production or sandbox based on the subscription license.',
  'connectorLicense.opts': 'You can add license details in the JSON format. For example, <br /> { <br /> "company" : "xxx" <br /> }',
  'spreecommerce.connection.http.baseURI': 'Enter the local host URL. For more information on how to retrieve the Base URI, see <a href="https://dev-docs.spreecommerce.org/getting-started/installation">Installation</a>.',
  'spreecommerce.connection.http.auth.token.token': 'Enter the API token provided by Spree Commerce. For more information on how to retrieve the API token, see <a href="https://dev-docs.spreecommerce.org/getting-started/installation">Installation</a>.<br>Multiple layers of protection, including AES 256 encryption, are in place to keep your Token safe. When editing this connection, you must re-enter this value each time; it is stored only when the connection is saved and never displayed as text.',
  'myaccount.colorTheme': 'Turning on this setting will display dark surfaces across the majority of a UI. It\'s designed to be a supplemental mode to a default (or light) theme. Dark themes reduce the luminance emitted by device screens, reduce eye strain, and facilitate screen use in dark environments.',
  'transfer.email': 'Email address of the person who the integration is transferred to. The receiver needs to be a user with their own integrator.io account and can’t be part of your organization',
  'transfer._integrationIds': 'Click the checkbox for each integration to be transferred to the new owner.',
  'flowbuilder.iconView': "<ul style='list-style-type:disc'><b>Structure:</b></br><li>The application logo with an icon coresponding to each bubble is displayed here.The icon depicts the type of the import/export/lookup i.e, whether it is a batch export or a webhook listener and various other types.</li><li>Clicking on the icon button shows a list of all the mappings,hooks and all other available actions for that particular export/import/lookup.</li><li>All the actions that are configured on a particular export/import/lookup will have a <b>blue dot</b> on that respective action icon indicating that that particaular action has been configured</li></br><b>Import/export/lookup drawer:</b></br><li>One needs to click on the export/import/lookup icon from the above list displayed,if he wishes to open that particular export/import/lookup</li></br><b>Selective expansion:</b></br><li>We have an option to selectively expand some of the bubbles through upstream and downstream expansion options from the above list</li><li>When clicked on downstream expansion button for a particular node,we expand all the downstream nodes that originate from this node</li><li>When clicked on upstream expansion button for a particular node,we expand all the upstream nodes that point to the particular selected node</li><li>Simply put,This expanded bubble is a miniature version of the bigger bubble that we are currently using.</li><li>Successful completion of flow run shows a success icon.Any error in any particular bubble will be displayed with a warning icon followed by the number of errors,which is clickable and redired=ct to the errors drawer</li><li>There is a close subflow icon that appears on the edge connected to the node in the above 2 cases.Clicking on it would collapse the subflow and revert it back to the icon view layout</li><li>Hovering on any particular edge highlights the entire path of that edge from the beginning to the end.</li></ul></p>",
  'import.assistantMetadata.lookupQueryParams': 'Click Launch to enter the dynamic search parameters to identify existing records.',
  'amazonvendorcentral.connection.http.type': 'Selling Partner API (SP-API): The Selling Partner API is a REST-based API and is an evolution of the legacy Amazon Marketplace Web Service (MWS) APIs.',
  'amazonvendorcentral.connection.http.unencrypted.sellingRegion': 'Select AWS regions to associate your API Endpoints. The region is required for calculating a signature when calling the Selling Partner API.',
  'amazonvendorcentral.connection.http.unencrypted.marketplace': 'Select a country or marketplace for your connection request. This field is populated based on the selling region chosen above.',
  'amazonvendorcentral.connection.http.sellingPartnerId': 'The identifier selling partner who is authorizing your application.',
  'export.http._httpConnectorResourceId': 'Select a resource. Resources are typically ‘Customers’ and ‘Orders’. Refer to the API documentation for the application you’re connecting.',
  'export.http._httpConnectorEndpointId': 'Select an API endpoint to perform an operation on the selected resource. Typically, these endpoints create, update, retrieve, or delete records. Refer to the API documentation for the application you’re connecting.',
  'export.http._httpConnectorVersionId': 'Select the required API version. For more information on the API version, see your application’s API documentation.',
  'import.http._httpConnectorResourceId': 'Select a resource. Resources are typically ‘Customers’ and ‘Orders’. Refer to the API documentation for the application you’re connecting.',
  'import.http._httpConnectorEndpointId': 'Select an API endpoint to perform an operation on the selected resource. Typically, these endpoints create, update, retrieve, or delete records. Refer to the API documentation for the application you’re connecting.',
  'import.http._httpConnectorVersionId': 'Select the required API version. For more information on the API version, see your application’s API documentation.',
};
