export default {
  'agent.name':
    "Give your agent a name so that users in your integrator.io account know where it is installed and what it has access to.  For example: 'Production AWS VPC, MySQL Connections'.",
  'agent.description':
    'Provide an optional description, or any information you like that will help you keep track of this agent. This information is displayed when viewing/editing an agent or in the Agent List page.',
  'asynchelper._id': 'System generated unique identifier for this asynchelper.',
  'asynchelper.name':
    'Enter a name for the Async Helper that you are creating.',
  'asynchelper.http.submit.sameAsStatus':
    'Select this checkbox if the Resource Path specified in the Status Export is same as that of the Submit Resource Path.',
  'asynchelper.http.submit.resourcePath':
    'This field appears if Same As Status Export checkbox is disabled. Specify the path for obtaining other feed info resources. This data is passed to Status and Result exports for evaluating handlebars.\n For example, <i>/SubmitFeedResponse/SubmitFeedResult/FeedSubmissionInfo</i>.',
  'asynchelper.http.submit.transform':
    'This field is optional. You can use it when the response is other JSON. For example, if your target application is Amazon, the response data received will be in XML format that you can convert to JSON using Transform Rules for Submit Response. For more information, refer to <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/115002669511-Transformation-Rules-Guide">Transform Rules Guide</a>.',
  'asynchelper.http.status._exportId':
    'Click the <b>+</b> icon to configure the status export. For more information, refer to <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/360004872932-Async-Helper#h_73655244751529322925787">Configure Status Export</a>.',
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
    'Click the <b>+</b> icon to configure the result export. For more information, refer to <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/360004872932-Async-Helper#h_15255507731529322901895">Configure Result Export.</a>',
  'connection._id':
    'System generated primary unique identifier for your connection.  For API users, this value should be used for GET, PUT and DELETE requests.',
  'connection._agentId':
    "To connect to an on-premise application integrator.io requires that an 'Agent' be installed on a computer that has network access to the on-premise application. Once the agent has been installed you can simply reference the agent here, and then integrating your on-premise applications is no different than integrating any other applications using integrator.io. Please note also that a single 'Agent' can be used by multiple different connections.",
  'connection.name':
    "Name your connection so that you can easily reference it from other parts of the application.  For example: 'NetSuite - your@email.com'",
  'connection.type':
    "This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors. If you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'connection.lastModified':
    'System generated date/time to track the last time this resource was modified.',
  'connection.offline':
    "This flag identifies if your connection is currently offline.  When a connection is offline then no exports, imports, flows, etc... will be run, and all data currently in the queues (i.e. in progress) will also pause.  Connections are marked offline automatically anytime there is a failure to connect.  Connections can be brought back online manually by re-entering credentials and clicking the 'Save' button (assuming there are no new errors).  There is also an automated batch process that runs multiple times per hour to continually ping/test all offline connections for you, and bring those connection back online if the ping/test succeeds (and also resume any data flows that were paused as a result of the connection being offline).  Note that it is relatively common for a connection to go offline (and then back online via the automated ping/test batch process) if you are running data flows off hours at times when the applications being integrated go offline temporarily for their own maintenance.",
  'connection._connectorId':
    'If this connection was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this field will hold the _id of the SmartConnector app that owns the connection.  Please note that for security reasons, connections owned by a SmartConnector cannot be referenced outside the context of the SmartConnector. This implies that you cannot use any of these connections in the data flows that you build yourself.',
  'connection._integrationId':
    'If this connection was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this field will hold the _id of the specific integration instance (a.k.a. integration tile) that owns the connection.  Please note that for security reasons connections owned by a SmartConnector cannot be referenced outside the context of the specific integration tile that they belong to. This implies that you cannot use these connections in the data flows that you build yourself, nor can you use the same SmartConnector referenced connections across different integration tiles.',
  'connection.debugDate':
    'Indicates for how long integrator.io should be recording both request and response traffic from this connection. You can later review this raw debug information directly from the download icon on the /connections page.',
  'connection._borrowConcurrencyFromConnectionId':
    'By default, all data flowing through a connection record will get submitted to the respective endpoint application at the concurrency level configured for that connection record. There are use cases however where you need multiple connections to share the same concurrency level, and this field allows you to specify that a connection should borrow concurrency from another connection such that the data flowing through both connections will get submitted to the endpoint application together via a shared concurrency model. For example, you might have three separate NetSuite connection records in your integrator.io account (for the purpose of isolating different permissions for different integrations), but you only want to provision one concurrent request for all three NetSuite connection records to share. To implement this use case you would setup one of the three connections with a concurrency level 1, and then you would setup the other two NetSuite connections to borrow concurrency from the other.',
  'connection.netsuite.account':
    'Your NetSuite Account Id.  One way to obtain this value within NetSuite is via Setup -> Integration -> Web Services Preferences.  If this does not work then please contact NetSuite support.',
  'connection.netsuite.roleId':
    "The NetSuite Internal Id of the Role associated with the User.  To obtain this value you must first know which NetSuite Role record is associated with the User you are using for this connection.  Once you know the Role then you can navigate to Setup -> Users/Roles -> Manage Roles and if you have NetSuite Internal Ids displayed automatically it will just show in the list view, or you can open the Role in view mode and look at the URL in the browser and the id will be listed there too.  If these steps didn't work for your particular NetSuite instance then please contact NetSuite support.",
  'connection.netsuite.email':
    'The email address that you use to login to NetSuite.',
  'connection.netsuite.password':
    'Your NetSuite password.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password data safe.',
  'connection.netsuite.tokenId':
    "Important: before creating an Access Token in NetSuite for integrator.io, please make sure you have installed the 'Celigo integrator.io' SuiteApp (i.e. the Bundle with id 20038) in your NetSuite account. You must reference 'integrator.io' in the 'Application' field for all Access Tokens used by integrator.io. After you create an Access Token in NetSuite, 'Token Id' and 'Token Secret' will be displayed only once (on the token confirmation page inside NetSuite). Please copy and paste 'Token Id' here before you leave the confirmation page.",
  'connection.netsuite.tokenSecret':
    "Important: before creating an Access Token in NetSuite for integrator.io, please make sure you have installed the 'Celigo integrator.io' SuiteApp (i.e. the Bundle with id 20038) in your NetSuite account. You must reference 'integrator.io' in the 'Application' field for all Access Tokens used by integrator.io. After you create an Access Token in NetSuite, 'Token Id' and 'Token Secret' will be displayed only once (on the token confirmation page inside NetSuite). Please copy and paste 'Token Secret' here before you leave the confirmation page.",
  'connection.netsuite.environment':
    'The NetSuite environment that you want to connect with.  NetSuite supports Production, Sandbox and Beta environments.  Sandbox NetSuite accounts must be provisioned by NetSuite, and Beta environments are typically only available in the weeks prior to a large NetSuite upgrade.',
  'connection.netsuite.concurrencyLevelRESTlet':
    'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.netsuite.concurrencyLevelWebServices':
    'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.netsuite.concurrencyLevel':
    'Set this field to limit (or increase) the number of concurrent requests allowed by this connection.  Please contact NetSuite if you are unsure how many concurrent requests are allowed in your NetSuite account.  You can also contact NetSuite to purchase additional concurrent requests if you need more throughput.  If you need more throughput than 25 concurrent requests for a single connection resource then please consider creating a second connection resource and partitioning your flows across different connections.',
  'connection.rest.mediaType':
    'The data format that should be used for all HTTP requests sent to the REST API.  Typically a REST API will only support one media type and will publish this info right at the top of their API guides.',
  'connection.rest.baseURI':
    "The common part of an API's URL that can be used across all the different HTTP/REST API endpoints that you invoke. Using a base URI in your connection makes it easier to configure all your exports and imports because all you need then is the Relative URI, and using a Base URI also makes it easier to manage upgrading versions of the HTTP/REST API because all you typically need to change is the version value in the Base URI. Assuming that the new version of the REST API is mostly backward compatible, very few of your exports and imports should need to be changed.\nTypically, a Base URI will have the following format: https://< api.domain.com>/<version>. For example, 'https://api.stripe.com/v1' is the Base URI you would use for Stripe's v1 API. Another example, 'https://www.googleapis.com/calendar/v3' is the Base URI you would use for Google's v3 calendar API.",
  'connection.rest.bearerToken':
    'Please enter your API token here.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
  'connection.rest.tokenLocation':
    "Use this field to specify where in the HTTP request the API token should be located.  If both 'URL Parameter' and 'Header' are supported by the REST API then 'Header' is the preferred option because HTTP header data is slightly less likely to end up in an access log file (i.e. in the REST API's server logs).",
  'connection.rest.tokenParam':
    "Use this field to specify the name of the URL parameter that will hold the API token value.  For example, if you specify 'myAPITokenURLParam' then all HTTP requests will include the following: '?myAPITokenURLParam=bearerToken'.",
  'connection.rest.scope':
    "Use this field to list out all the scope values that should be sent when a connection is authorized.  The list of supported scopes for any given REST API should be documented clearly in that API's user guide.  If you cannot find this info then please contact the company, or author that owns the API.",
  'connection.rest.scopeDelimiter':
    "Use this field to override the default delimiter (' ') used to separate scope values sent to the REST API during the authorization process.",
  'connection.rest.refreshToken':
    'This field is set automatically during the OAuth 2.0 authorization process, and can never be retrieved in the browser or the integrator.io API (this field is only used by the back-end servers to generate access tokens as needed).  Please note also that there are multiple layers of protection in place (including AES 256 encryption) to keep your refresh token safe.',
  'connection.rest.authURI':
    'Use this field to specify the authorization endpoint that should be invoked when the initial OAuth 2.0 workflow kicks off.',
  'connection.rest.authHeader':
    "By default, integrator.io will send all authentication type info in the 'Authorization: ' HTTP header field.  If the REST API you are connecting to requires a different HTTP header, use this field to provide an override.",
  'connection.rest.authScheme':
    'By default, integrator.io will follow the HTTP specs with regards to auth scheme names (i.e. Bearer, OAuth, MAC, etc...), but if the REST API you are connecting to does not follow the specs exactly, this field can be used to provide an override.',
  'connection.rest.disableStrictSSL':
    'An optional flag that (if set) skips verifying the SSL certificate, allowing self-signed or expired certs.  It is highly recommended (for hopefully obvious reasons) that you never set this flag for any production data connections.  In general, use at your own risk.',
  'connection.rest.retryHeader':
    "It is common for a REST API to return status code 429 if too many requests are made in a short period of time. These 429 responses are typically paired with a 'retry-after' response HTTP header with information used to determine when the next request will be successfully served. It is also possible that an API may use a custom header, and this field can be used to provide an override.",
  'connection.rest.basicAuth.username':
    'The basic authentication username. Sometimes services providers use other terms like clientId or API Key',
  'connection.rest.basicAuth.password':
    "The password associated with your service account. Sometimes service providers have other names for this field, such as 'secret key', or 'API key', and so on. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password safe.",
  'connection.rest._iClientId':
    'The iClient resource type is used to register OAuth 2.0 client credentials that can be used to authorize connections.  iClients are typically only needed by developers that wish to build their own SmartConnector product for the integrator.io marketplace, where the OAuth 2.0 credentials for their product will be owned by them, and the iClient will be bundled in their app, and only resources in their app will be able to reference it.',
  'connection.rest.info':
    'This read only field is used to store ad hoc profile type data returned by the OAuth 2.0 provider during the OAuth 2.0 authorization flow.',
  'connection.rest.pingRelativeURI':
    "Any relative URI for an authenticated HTTP GET request that can be used to test if a connection is working properly.  For example: '/me', '/tokenInfo', '/currentTime', etc...  Whenever a connection is saved, integrator.io will invoke the Ping URI (if one is set), and only if the ping request is successful will the connection resource be saved.  There is also an automated batch process that runs multiple times per hour to continually ping all offline connections (i.e. connections that failed at one point) to bring those connection back online (and to resume any data flows that were paused as a result of the connections being offline).  It is definitely a best practice to set Ping URI on all your REST API connections so that integrator.io can do more to identify offline connections (before they are saved) and also bring them back online automatically wherever possible.",
  'connection.rest.pingSuccessPath':
    "There are some APIs out there (i.e. Slack) that will return a 200 HTTP status code even if the ping HTTP request failed, and instead use a field in the response body to identify success vs fail. For these use cases, the 'Ping Success Path' field can be used to specify the JSON path of a field in the response body that should instead be used to determine if a ping request was a success.  For example, if you are building a connection for Slack's API you would set this field to: 'ok' (see Slack API docs for more info).",
  'connection.rest.pingSuccessValues':
    'This optional field is used in unison with the successPath field. The value found in the HTTP response at the path provided by successPath is compared against this list of success values. If there is an exact case-sensitive match of any of the values, then the request is considered successful.',
  'connection.rest.concurrencyLevel':
    "Set this field to limit the number of concurrent HTTP requests allowed by the connection resource (at any one time), or leave this field blank to use burst mode.  With burst mode, integrator.io will make HTTP requests as fast as possible, with really high levels of concurrency.  APIs like Google's are really great with burst mode, and can typically handle any types of volume.  Other APIs, like Zendesk or Shopify, are much more strict when it comes to the number of API requests being sent to their servers, and burst mode may not be recommended.",
  'connection.http.mediaType':
    'The data format that should be used for all requests sent to, or responses received from (via HTTP) the API being connected to.  Typically a single API will only support one media type (data format) and will publish that info right at the top of their API guides. If the mediaType foe request/response are not the same, it is possible to override the mediaType for specific endpoints by using the export success/error media type fields.',
  'connection.http.baseURI':
    "The common part of an API's URL - used across all the different HTTP endpoints you will invoke.  Using a base URI in your connection makes it easier to configure all your exports and imports (because all you need then is a Relative URI).",
  'connection.http.headers':
    "In some rare cases, it may be necessary to include custom HTTP headers with your API requests.  The appropriate 'content-type' header is automatically added by integrator.io based on the mediaType value described in the connection associated with this request (typically 'application/json'). Note that if the authentication method described in the associated connection requires a header value, this will also be added automatically.  This header field is used in the rare case that an API requires additional headers other than these two.",
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
    "There are many non-REST based APIs that will return a 200 HTTP status code even if the ping HTTP request failed, and instead use a field in the response body to identify success vs fail. For these use cases, the 'Ping Success Path' field can be used to specify the path of a field in the response body that should instead be used to determine if a ping request was a success.",
  'connection.http.ping.successValues':
    'This optional field is used in unison with the successPath field. The value found in the HTTP response at the path provided by successPath is compared against this list of success values. If there is an exact case-sensitive match of any of the values, then the request is considered successful.',
  'connection.http.ping.errorPath':
    'This optional field can be used if the response from failed ping request is large and only part of the response should be returned as the reason for a failed ping response. If no value is given, then the full HTTP response is used as a description of the failure. If the media-type of the failed response is XML, this value should be an XPATH. Conversely, if the media-type is JSON, then use a JSON path. Note that if failed responses to ping requests have no body then a text version of the HTTP status code is used as the reason for failure.',
  'connection.http.auth.type':
    "The HTTP adaptors currently support 3 types of authentication. Choose 'basic' authentication if your service implements the HTTP basic auth strategy. This auth method adds a base64 encoded username/password pair value in the 'authentication' HTTP request header.  Choose 'token' if your service relies on token-based authentication. The token may exist in the header, url or body of the http request. This method also supports refreshing tokens if supported by the service being called. Finally, choose 'custom' for all other types. If you select the 'custom' auth method integrator.io will not perform any special auth processing. It is up to the user to configure the HTTP request fields (method, relativeUri, headers and body) of the import and export models to include {{placeholders}} for any authentication related values. These values can be stored in the 'encrypted' and 'unencrypted' fields of this connection.",
  'connection.http.auth.failStatusCode':
    'The HTTP specification states that authentication errors should return a 401 status code.  Some services have custom authentication implementations that rely on other status codes, or return 200 and indicate auth errors within the HTTP body. Use this field if the service you are connecting to uses a status code other than 401.',
  'connection.http.auth.failPath':
    'If the service you are connecting to embeds authentication errors within the HTTP body, use this field to set the path within the response body where integrator.io should look to identify a failed auth response. If there is a specific value (or set of values) that indicate a failed auth response at this path, use the failValues field to further instruct our platform on how to identify this type of error.',
  'connection.http.auth.failValues':
    'This field is used only if the failPath field is set. It indicates to integrator.io what specific values to test for when determining if the requests we made failed for authentication reasons.',
  'connection.http.auth.basic.username':
    'The basic authentication username. Sometimes services providers use other terms like clientId or API Key',
  'connection.http.auth.basic.password':
    "The password associated with your service account. Sometimes service providers have other names for this field such as 'secret key', or 'API key', etc.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password safe.",
  'connection.http.auth.token.token':
    "The authentication token provided to you from the service provider. Some service providers use other names for this value such as 'bearer token', or 'secret key', etc.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your token safe. In some cases, a service may have a token request process, or tokens that expire after a given time. Use the refresh fields to instruct integrator.io on how to request and extract the token form the response.",
  'connection.http.auth.token.location':
    "Where does your application's API expect to find the auth token? Choose 'url' if the auth token should be located in the url.  You will then be able to specify the query string parameter name that should hold the token value. If you choose 'header' you will then need to specify the header name and auth scheme to use when constructing the HTTP request. Finally, choose 'body' if your API needs the token embedded in the body structure of your HTTP request. In this case, its up to you to place the token in your body template using the placeholder: {{{connection.http.token.token}}}",
  'connection.http.auth.token.headerName':
    "By default, integrator.io will send all authentication type info in the 'Authorization: ' HTTP header field.  If the API you are connecting to requires a different HTTP header, use this field to provide an override.",
  'connection.http.auth.token.scheme':
    'By default, integrator.io will follow the HTTP specs with regards to auth scheme names (i.e. Bearer, OAuth, MAC, etc...), but if the API you are connecting to does not follow the specs exactly, this field can be used to provide an override.',
  'connection.http.auth.token.paramName':
    "Use this field to specify the name of the URL parameter that will hold the API token value.  For example, if you specify 'myAPITokenURLParam' then all HTTP requests will include the following: '?myAPITokenURLParam=[token]'.",
  'connection.http.auth.token.refreshMethod':
    'If the service being connected to supports request/refresh token, use this field to set the HTTP method to use in the token call.',
  'connection.http.auth.token.refreshRelativeURI':
    'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the url to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.http.encrypted.password}}.',
  'connection.http.auth.token.refreshBody':
    'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to set the body to use in the request token call. note that placeholders may be used to reference any connection fields. Typically a username/password or refreshToken would be used in the request. These values can be stored in the encrypted field, or if not sensitive, the unencrypted field. You can then reference these values by using placeholders such as: {{connection.http.encrypted.password}}.',
  'connection.http.auth.token.refreshTokenPath':
    'If the service being connected to supports requests to obtain or refresh existing tokens, use this field to indicate to integrator.io what path to use against the HTTP response to extract the new token.  If no value is found at this path then the token request is considered a failure.',
  'connection.http.auth.token.refreshHeaders':
    "In some cases, it may be necessary to include custom HTTP headers with your token refresh requests. As with the 'body' field, any value from the connection can be referenced using {{{placeholders}} with a complete path matching the connection field.",
  'connection.http.auth.token.refreshToken':
    'This field is used if you have a refresh token that can be used in refresh expired auth tokens.  You can place this token in the body, headers or url simply by using referencing it with the placeholder: {{{connection.http.token.refreshToken}}}.  Please note also that there are multiple layers of protection in place (including AES 256 encryption) to keep your refresh token safe.',
  'connection.http.rateLimit.failStatusCode':
    'The HTTP specification states that rate-limit response errors should return a 429 status code.  Some services have custom rate limit implementations that rely on other status codes, or even throttle errors within the HTTP body. Use this field if the service you are connecting to uses a status code other than 429.',
  'connection.http.rateLimit.failPath':
    'If the service you are connecting to embeds rate limit errors within the HTTP body, use this field to set the path within the response body where integrator.io should look to identify a throttled response. If there is a specific value (or set of values) that indicate rate-limit response at this path, use the failValues field to further instruct our platform on how to identify this type of error.',
  'connection.http.rateLimit.failValues':
    'This field is used only if the failPath field is set. It indicates to the integrator.io platform what specific values to test for when determining if the requests we make have been rate-limited.',
  'connection.http.rateLimit.limit':
    'This field lets the user to tell us the speed at which we can make requests. In other words, how long should we wait before we make subsequent IO calls to the service.  This should be used if the service does not implement and return rate-limit responses and we need to manually regulate IO calls from our platform.',
  'connection.http.unencrypted':
    "Use this JSON field to store all the non security sensitive fields needed by your imports and exports (to access the application being integrated).  For example: {'email':'my_email@company.com', 'accountId': '5765432', 'role': 'admin'}",
  'connection.http.encrypted':
    "Use this encrypted JSON field to store all the security sensitive fields needed by your imports and exports (to access the application being integrated).  For example:  {'password': 'ayTb53Img!do'} or {'token': 'x7ygd4njlwerf63nhg'}.  Please note that in addition to AES 256 encryption there are multiple layers of protection in place to keep your data safe.",
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
  'connection.ftp.hostURI':
    "The URI of the FTP/SFTP/FTPS server host.  Typically this value will look something like 'ftp.mycompany.com', or sometimes just a raw IP address '100.200.300.1'.  It is also very common for FTP/SFTP/FTPS servers to be behind a firewall, and to support accessing resources behind a firewall you will need to make sure all of the FTP/SFTP/FTPS specific integrator.io IP addresses (listed right below the HOST field) have been white-listed on your FTP/SFTP/FTPS server infrastructure.",
  'connection.ftp.username':
    'The username that you will use to log in to the FTP/SFTP/FTPS server.',
  'connection.ftp.password':
    'The password associated with the username that you are using to connect with the FTP/SFTP/FTPS server.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password safe.',
  'connection.ftp.port':
    'Set this field to override the default port number. In most cases, this field can be left empty. Only on rare occasions are FTP/SFTP/FTPS servers configured to run on alternate ports.',
  'connection.ftp.usePassiveMode':
    'This field tells integrator.io to use Passive Mode instead of Active Mode when connecting to a FTP or FTPS server.  This field is enabled by default; un-check this checkbox if you want to use Active Mode instead.  If Active Mode is used your FTP or FTPS server must accept traffic from the inbound port range 15000-15100.  Note that this field is only relevant for FTP or FTPS connections, and will be ignored for SFTP.  If you want to know the difference between Active and Passive Modes there is a good explanation here: <a href="http://www.jscape.com/blog/bid/80512/Active-v-s-Passive-FTP-Simplified" target="_blank"/>http://www.jscape.com/blog/bid/80512/Active-v-s-Passive-FTP-Simplified</a>',
  'connection.ftp.entryParser':
    "This optional field can be used to explicity identify the system specific FTP/SFTP/FTPS implementation. In most cases no value should be selected; you only need to set this field if your FTP/SFTP/FTPS server is an uncommon type (not Windows or Linux), or it does not support the 'SYST' command.  Possible values are: ['UNIX', 'UNIX-TRIM', 'VMS', 'WINDOWS', 'OS/2', 'OS/400', 'AS/400', 'MVS', 'UNKNOWN-TYPE', 'NETWARE', 'MACOS-PETER']",
  'connection.ftp.authKey':
    'A SFTP connection can use a password or an authentication key to authenticate a user trying to connect to the SFTP server.  Use this field to store the RSA private key used for authentication.  The key must be in PEM format.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your authentication key safe.',
  'connection.ftp.userDirectoryIsRoot':
    'This optional field is used to tell integrator.io if the Relative Path used by a File Export or File Import is relative to your FTP/SFTP/FTPS login\'s user directory or to the server root folder.  Suppose your files are located on the server at "/usr/local/iio/files/download"--if your FTP/SFTP/FTPS server account places you in your user directory after login ("/usr/local/iio") then you need to check this checkbox and use "/files/download" as your Relative Path, but if you go straight to the server’s root directory ("/") after login then leave this checkbox unchecked and use "/usr/local/iio/files/download" as your Relative Path.',
  'connection.ftp.useImplicitFtps':
    "By default integrator.io makes FTPS connections in 'Explicit' mode: integrator.io has to ask the server to use TLS before the connection can be encrypted.  You should check this checkbox field if the server supports 'Implicit' FTPS where the client and server always use an encrypted connection.",
  'connection.ftp.requireSocketReUse':
    'By default FTPS servers are configured to use 2 sockets on 2 different ports for connections.  If your FTPS server uses only 1 port for FTPS traffic you can check this optional checkbox field to tell integrator.io to reuse 1 socket to connect to this 1 port.',
  'connection.ftp.pgpEncryptKey':
    'Specify a public key for use with PGP file transfers.  If you set this field then all files imported from integrator.io will be encrypted with this public key during file upload.  If you do not want to use PGP encryption in your FTP Import then leave this field blank.  The key must be in ASCII Armor format.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your authentication key safe.',
  'connection.ftp.pgpDecryptKey':
    'Specify a private key for use with PGP file transfers.  If you set this field then all files exported to integrator.io will be decrypted with this private key during file download.  If you do not want to use PGP decryption in your FTP Export then leave this field blank.  The key must be in ASCII Armor format.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your authentication key safe.',
  'connection.ftp.pgpPassphrase':
    'Set this field if your PGP private key is secured with a passphrase.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your passphrase safe.',
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
    "The password associated with your service account. Sometimes service providers have other names for this field such as 'secret key', or 'API key', etc.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password safe.",
  'connection.as2.partnerStationInfo.auth.token.token':
    "The authentication token provided to you from the service provider. Some service providers use other names for this value such as 'bearer token', or 'secret key', etc.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your token safe. In some cases, a service may have a token request process, or tokens that expire after a given time. Use the refresh fields to instruct integrator.io on how to request and extract the token form the response.",
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
    'This field is used if you have a refresh token that can be used in refresh expired auth tokens.  You can place this token in the body, headers or url simply by using referencing it with the placeholder: {{{connection.as2.partnerStationInfo.auth.token.refreshToken}}}.  Please note also that there are multiple layers of protection in place (including AES 256 encryption) to keep your refresh token safe.',
  'connection.as2.partnerStationInfo.rateLimit.failStatusCode':
    'The HTTP specification states that rate-limit response errors should return a 429 status code.  Some services have custom rate limit implementations that rely on other status codes, or even throttle errors within the HTTP body. Use this field if the service you are connecting to uses a status code other than 429.',
  'connection.as2.partnerStationInfo.rateLimit.failPath':
    'If the service you are connecting to embeds rate limit errors within the HTTP body, use this field to set the path within the response body where integrator.io should look to identify a throttled response. If there is a specific value (or set of values) that indicate rate-limit response at this path, use the failValues field to further instruct our platform on how to identify this type of error.',
  'connection.as2.partnerStationInfo.rateLimit.failValues':
    'This field is used only if the failPath field is set. It indicates to the integrator.io platform what specific values to test for when determining if the requests we make have been rate-limited.',
  'connection.as2.partnerStationInfo.rateLimit.limit':
    'This field lets the user to tell us the speed at which we can make requests. In other words, how long should we wait before we make subsequent IO calls to the service.  This should be used if the service does not implement and return rate-limit responses and we need to manually regulate IO calls from our platform.',
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
    'This is the key that integrator.io will use to decrypt incoming messages from the trading partner, who should be using the above public key to encrypt messages. The private key is sensitive and should be guarded carefully just like any other credential.',
  'connection.s3.region': 'The AWS region where your S3 bucket is located.',
  'connection.s3.accessKeyId':
    "Many of Amazon's APIs require an access key, and this field stores the 'id' for the access key that you want this connection to use.  Please check the AWS guides if you need more info about access keys and how to generate and/or find them in your AWS account.",
  'connection.s3.secretAccessKey':
    'When you create a new access key in your AWS account, AWS will display both the access key id and the secret access key.  The secret access key will only be available once, and you should store it immediately in integrator.io (i.e. in this field).  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your secret access key safe.',
  'connection.s3.pingBucket':
    'If you specify a bucket name in this field then integrator.io will specifically try to connect to this bucket when your S3 connection is tested, pinged, etc.... If you do not specify a bucket name then please make sure your AWS access key has access to get the list of buckets in your AWS account.',
  'connection.salesforce.concurrencyLevel':
    'Set this field to limit the number of concurrent API requests allowed by this connection resource (at any one time), or leave this field blank to use burst mode.  With burst mode, integrator.io will send requests to Salesforce as fast as possible, with really high levels of concurrency.  Salesforce uses a combination of concurrent request governance along with daily limits to throttle API usage, and burst mode is not recommended.  Please read more about Salesforce API governance in the Salesforce help guides, or contact Salesforce support for more info.',
  'connection.wrapper.unencrypted':
    "Use this JSON field to store all the non security sensitive fields needed by your wrapper (to access the application being integrated).  For example: {'email':'my_email@company.com', 'accountId': '5765432', 'role': 'admin'}",
  'connection.wrapper.encrypted':
    "Use this encrypted JSON field to store all the security sensitive fields needed by your wrapper (to access the application being integrated).  For example:  {'password': 'ayTb53Img!do'} or {'token': 'x7ygd4njlwerf63nhg'}.  Please note that in addition to AES 256 encryption there are multiple layers of protection in place to keep your data safe.",
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
    "This is your MWS account's signing key.  When making a request to Amazon MWS integrator.io will sign the request with this key and add a 'Signature' header to the request.  If you do not know this value please go to mws.amazon.com and follow the API and Developer Guides to sign up for the service and retrieve this key.  Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your secret access key safe.",
  'connection.amazonmws.marketplaceRegion':
    'This is the region where the Amazon seller account is based.  Select the country or continent where your seller account is based (North America and Europe are unified seller regions).',
  'connector._id':
    'System generated primary unique identifier for the connector.  For API users, this value should be used for GET and PUT requests.',
  'connector.name':
    'Name of the connector used to easily reference it from other parts of the application.',
  'connector.lastModified':
    'System generated datetime to track the last time this resource was modified.',
  'connector.handle': '.',
  'connector.legacyId': '.',
  'connector.published': '.',
  'connector.description': 'Brief description on the connector.',
  'connector.imageURL': '.',
  'connector._integrationId':
    'If this flow is part of an integration, this value will hold the id of that integration. ',
  'connector.websiteURL': '.',
  'connector.oauth2ResultsURL': '.',
  'connector.managed': '.',
  'connector._stackId': '.',
  'connector.installerFunction': '.',
  'connector.updateFunction': '.',
  'connector.uninstallerFunction': '.',
  'connector.sharedImportIds': '.',
  'connector.sharedExportIds': '.',
  'connector.oAuthServerFlow._iClientId': '.',
  'connector.oAuthServerFlow.putConnection': '.',
  'connector.repository.name': '.',
  'export._id':
    'System generated primary unique identifier for your export.  For API users, this value should be used for GET, PUT and DELETE requests.',
  'editor.xml.simple':
    'Simple parsing means the code is converted to JSON without any user configurations.This typically generates a more complex and difficult to read JSON.\nIf you would like to have more control over what the JSON output looks like, use the Advanced options.',
  'export.name':
    "Name your export so that you can easily reference it from other parts of the application.  For example: 'Salesforce - Query All Accounts'",
  'export._connectionId':
    'The specific connection you would like to use for your export or import.\nYou can pre-establish and save your connections using Menu > Connections. Each stored connection contains credentials along with other related information needed to access the desired application.\nIn addition, you can click the + icon beside this field to create a new connection.',
  'export.type':
    "There are multiple export types available to help support common integration patterns.  'All' will export all data, always.  'Delta' will only export data that has changed since the last time the data flow was run.  'Once' will only export data that has not been exported already, and will also automatically update records to mark them as exported.  'Test' will only export 1 record by default, and should be used while testing to avoid syncing lots of data.",
  'export.lastModified':
    'System generated date/time to track the last time this resource was modified.',
  'export.apiIdentifier':
    "Every export that you create is assigned a unique handle that you can then use in your own application logic to invoke the export programmatically via the integrator.io API.  For example, your export identifier might be 'e762db96', and you could invoke this export with a simple HTTP POST to https://api.integrator.io/e762db96",
  'export._integrationId':
    'If this export was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this value will be hold the _id value of the specific integration instance (a.k.a. integration tile) that owns the export.  Please note that for security reasons exports owned by a SmartConnector cannot be referenced outside the context of the specific integration tile that they belong to, meaning that you cannot use these exports in the data flows that you build yourself, nor can the same SmartConnector reference exports across different integration tiles.',
  'export._connectorId':
    'If this export was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this value will hold the _id value of the SmartConnector app that owns the export.  Please note that for security reasons exports owned by a SmartConnector cannot be referenced outside the context of the SmartConnector, meaning that you cannot use any of these exports in the data flows that you build yourself.',
  'export.pageSize':
    "When an export runs in the context of a data flow (where the data from the export is sent right away to an import queue) integrator.io will break the data being exported into one or more smaller pages of records.  Saying this another way, integrator.io uses streaming to export data out of one app and import it into another app.  The 'Page Size' field can be used to specify how many records you want in each page of data.  The default system value (when you leave this field blank) is 20.  There is no max value, but a page of data will automatically get capped when it exceeds 5 MB.  Most of the time, the application that you are importing data into will bottleneck the page size value.  For example, if you are importing data into NetSuite or Salesforce they each specify (in their API guides) a maximum number of records that can be submitted in any single request.",
  'export.dataURITemplate':
    "When your flow runs but has data errors this field can be really helpful in that it allows you to make sure that all the errors in your job dashboard have a link to the original data in the export application.  This field uses a handlebars template to generate the dynamic links based on the data being exported.  For example, if you are exporting a customer record from Shopify, you would most likely set this field to the following value 'https://your-store.myshopify.com/admin/customers/{{{id}}}'.  Or, if you are just exporting a CSV file from an FTP site then this field could simply be one or more columns from the file: {{{internal_id}}, {{{email}}}, etc...",
  'export.sampleData':
    'If you have sample data please provide it here.  This data will be used to help you map fields later.  Please note also that the sample data does not need to be overly large, but it should contain all the fields you want to work with, and also be in the exact same format that the export will see when running in a production capacity.',
  'export.description':
    'Describe your export so that other users can quickly understand what it is doing without having to read through all the fields and settings. Be sure to highlight any nuances that a user should be aware of before using your export in their flows. Also, as you make changes to the export be sure to keep this field up to date.',
  'export.filter.rules':
    'Important: only records where your filter expression evaluates to true will get passed along by the results of this export.  Defining a filter on your export allows you to discard records such that they will not get returned in the results, or get passed along to any subsequent processors. Export filters come in handy when you are working with older applications or data sources that do not natively support the ability to define search criteria to exclude records. If an application does support the ability to define search criteria then you should use that native functionality (vs defining filters here) to avoid pulling unnecessary data into integrator.io.',
  'export.transform.rules':
    'Transformations are an optional feature that lets you alter the representation of your record(s).  By providing a set of rules, you can change the structure of your record. Each rule is made up of a pair of extract and generate json paths. These paths let you map where to get (extract) values from and where to place (generate) them. At its most basic form, by providing rules, you can cherry-pick which record properties you want to keep and which to drop. Only properties that are referenced in a rule will be part of the transformed record. Often simply renaming property names is not enough. It is also possible to promote parent properties to child items. For example, consider the following sample record: <pre>{ id: 1,\n items: [\n {name: ‘bob’},\n {name: ‘joe’}\n ] \n}</pre>\nIf you wanted to rename items.name to people.firstName and move an ‘id’ property into each item, you would use the rule-set: <pre>[\n { extract: ‘items[*].name’, generate: ‘people[*].firstName’ },\n { extract: ‘id’, generate: ‘people[*].id’ }\n]</pre> The result of this transform would be: <pre>{ people: [\n { id: 1, firstName: ‘bob },\n { id: 1, firstName: ‘joe’ } \n] }</pre>',
  'export.test.limit':
    'For testing purpose, records exported will be limited to the number specified',
  'export.delta.dateField':
    "Please select a date field from the export application that integrator.io can use to keep track of records that have changed since the last time the export was run.  It is recommended that you pick a system generated field.  For example, many applications maintain a standard 'Date Last Modified' (or 'Last Modified Date', etc...) field that always contains the date and time that a record was last changed.  You can also select a non system generated field if you have your own logic in place (in the export application) to set the field accordingly whenever a relevant change is made to a record.",
  'export.delta.dateFormat':
    "The default data format is ISO8601. If your application uses a different format, you can specify it here. For a detailed instructions on how to specify custom formats, please visit <a href='https://momentjs.com/docs/#/displaying/' target='_blank'>momentjs.com/docs/#/displaying/</a>",
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
  'export.netsuite.skipGrouping':
    'By default, integrator.io requires all NetSuite Saved Searches to be sorted by Internal Id (and to also explicitly include the Internal Id column in the search results) so that consecutive search rows with the same Internal Id can be grouped together into individual logical records.  There are usecases though where this default grouping behavior is not desired, and Skip Grouping can be used to turn it off (including the validation requiring your NetSuite Saved Searches to be sorted by Internal Id).  Please note that when Skip Grouping is set to true then all search rows will be exported as individual records, and if any type of grouping is needed later then that would need to be implemented via a custom hook or in a wrapper (i.e. using the integrator.io extension framework).',
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
  'export.rest.method':
    "The most common HTTP method used by APIs for the retrieval of resources is 'GET'. In some cases, RPC style APIs will require the use of the 'POST' HTTP method.  Both of these scenarios are supported by integrator.io.  If the POST method is used, typically the body of the HTTP request will contain filtering or selection criteria in the body of the request.  This information is provided in the postBody field. Refer to this field for more information.",
  'export.rest.headers':
    "In some rare cases, it may be necessary to include custom HTTP headers with your API requests.  The appropriate 'content-type' header is automatically added by integrator.io based on the mediaType value described in the connection associated with this request (typically 'application/json'). Note that if the authentication method described in the associated connection requires a header value, this will also be added automatically.  This header field is used in the rare case that an API requires additional headers other than these two.",
  'export.rest.resourcePath':
    'This optional field is used to help integrator.io locate the resource (or set of resources) returned from an API call.  If the HTTP response from an API contains the resource(s) at the root, then no value is necessary for this field.  If on the other hand, the response from an API contains a deeper json structure that for example contains paging information, it will be necessary for you to provide the JSON path to the resource(s).',
  'export.rest.successPath':
    "There are some APIs out there (i.e. Slack) that will return a 200 HTTP status code even if an HTTP request fails.  These APIs instead use a field in the HTTP response body to identify success vs fail. For these APIs, this option field 'Success Path' can be used to specify the JSON path for the field in the response body that should be used to determine if an HTTP request was successful.  For example, if you are working with Slack's API you would set this field to: 'ok'.",
  'export.rest.successValues':
    'This field indicates the value(s) that represents the success of an HTTP response. For example, 0 or 0,2,3.\nThis field is used in unison with the Success Path field. The value found in the HTTP response at the path specified in Success Path is compared against the provided list of success values. If there is an exact case-sensitive match of any of the specified values, the request is considered successful.',
  'export.rest.postBody':
    "Most HTTP/REST exports utilize GET requests that do not have an HTTP body. In some cases, such as RPC style API's an HTTP body is necessary to convey the details of the export request. If this is the case for the application you are integrating with, this field allows you to configure the content of the HTTP request body. Note that the integrator.io platform support handlebar templates to aid in the construction of the HTTP body. It is also possible to use helper method and field placeholders to pull-in and manipulate data passed into the export, or from the connection object itself. This button with launch an editor to make the process of constructing (and testing) your body templates easier.",
  'export.rest.pagingMethod':
    "Some APIs offer paging functionality in order to limit each of their responses to a manageable size if the total set of resources is large.  The following paging methods are supported by integrator.io. Choose 'Next Page URL' if the API returns a link to the next page within the response body.  Choose 'Page Argument' if the API uses a query string parameter to paginate the results. Choose 'Relative URI' if the same endpoint should be hit repeatedly until no more data is returned. Finally, choose 'Skip Argument' if the API uses a query string parameter to indicate the record offset for the next page request. The export will automatically calculate the amount to skip and integrator.io will add this parameter to the relativeURI for each subsequent page request. Note that typically these services also support an optional 'take' or 'pageSize' query string parameter to control how many records are returned in each page; integrator.io will not set or modify this parameter.",
  'export.rest.nextPagePath':
    "This optional field can be used when the 'Paging Method' is set to 'Next Page URL'.  Set this field's value to the JSON path that will point to the next page URL returned in the HTTP response from the API. Zendesk for example uses 'next_page' while SalesForce uses 'nextRecordsUrl'. The default value used if this field is left blank is 'nextpage'.",
  'export.rest.pageArgument':
    "This optional field can be used when the 'Paging Method' is set to 'Page Argument'.  Set this field's value to the name of the query string argument that should be used to convey paging information to the API. The default, and most common argument name is, 'page'.",
  'export.rest.nextPageRelativeURI':
    "This optional field can be used when the 'Paging Method' is set to 'Relative URI'. If this field is blank, the 'Relative URI' field is used repeatedly to request pages of data until no more records or a 404 (not found) status is returned.  If required, subsequent page requests (after the 1st) can use this field to set a custom relative uri expression. The value can contain {{placeholders}} that are populated from the last record of the previous page. For example: '/products?skip={{itemNumber}}'",
  'export.rest.blobFormat':
    'Please specify the encoding type of the file that needs to be exported. Supported encoding types are: utf8, ucs2 / utf16-le, ascii, binary, base64, hex. We need this encoding type to have the file content properly transmitted as data is transmitted in binary format.',
  'export.rest.maxPagePath':
    'Some APIs return the number of pages available in their response to resource requests. This optional field can be used to tell integrator.io how many pages to expect. Set the value to the JSON path of the field containing the max page count. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.rest.maxCountPath':
    'Some APIs return the total number of resources available in their response to resource requests. This optional field can be used to tell integrator.io how many resources to expect. Set the value to the JSON path of the field containing the total resource count count. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.rest.skipArgument':
    "This optional field can be used when the 'Paging Method' is set to 'Skip Argument'.  Set this field's value to the name of the query string argument that tells the API how many records to 'skip' past when returning subsequent page results.  The default query argument used by integator.io is 'skip'; you can leave this field blank if the API uses this default query argument name.",
  'export.rest.lastPageStatusCode':
    'Some APIs will return an error status code (less than 200 or greater than 300) as the last page response.  This optional field can be used to tell integrator.io the response code to expect in these situations, and to not treat this response as an error.  This field can be used in conjunction with "lastPagePath" and "lastPageValue".  Note that error 404 is automatically treated as the last page response so it is not necessary to set this field for that case.',
  'export.rest.lastPagePath':
    'If "lastPageStatusCode" is set you can set this field to tell integrator.io to check a specific field in the response object to determine if paging is complete.  If "lastPageValue" is not set then paging will be considered complete if this field is present in the response object, otherwise this response will be considered an error.',
  'export.rest.lastPageValue':
    'If "lastPageStatusCode" and "lastPagePath" you can set this field to tell integrator.io to check a specific field\'s value in the response object to determine if paging is complete.  If the value in the response object matches this field then paging will be considered complete if  response object, otherwise this response will be considered an error.',
  'export.rest.once.relativeURI':
    "This is the relativeURI for making the 'Once' HTTP request directed against the export application. It is possible to use placeholders within the url that will get replaced by values from your export record(s).",
  'export.rest.once.method':
    "Choose the HTTP method our platform should use when making this 'Once' request. Most often 'Once' HTTP request will use the PUT method since the idea here is that we are updating the record just exported. As such the HTTP convention is to use \"PUT\" in this situation.",
  'export.rest.once.postBody':
    "This postBody will in most cases be a template modeling the record to update. The template should have named placeholders matching the JSON fields in the record being exported. The export record becomes the data source for the 'body' template. If not provided, the export record itself is used as the body of the request. Note that in both cases, the field described in 'booleanField' is added/set to 'true'.",
  'export.s3.keyStartsWith':
    'Enter the starting letters of the key using which the objects will be exported.\nA key is the unique identifier for an object within a bucket.\nFor example, in the URL http://doc.s3.amazonaws.com/2006-03-01/AmazonS3.wsdl, "doc" is the name of the bucket and "2006-03-01/AmazonS3.wsdl" is the key.',
  'export.s3.keyEndsWith':
    "Use this field to specify a key postfix that will be used to filter which files in the S3 bucket that will be exported (vs not). For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be exported (like myFile-test.csv). Please note that you must specify the file extension for this filter to work correctly.",
  'export.http.successMediaType':
    'The success media type indicates the format of the data received from all successful (HTTP) requests.  Typically APIs will only support one media type (data format) and will publish that info right at the top of their API guides. This is an optional override of the media type associated with the connection in case the API has route specific data formats. Amazon MWS for example, is an XML service that returns CSV data for some of its reports.',
  'export.http.errorMediaType':
    'The error media type indicates the format of the response data received from all unsuccessful (HTTP) requests.  This refers to all responses with non-2xx HTTP status codes.  Typically APIs will only support one media type (data format) and will publish that info right at the top of their API guides. This is an optional override of the media type associated with the connection in case the API has route specific data formats.  Amazon MWS for example, has some endpoints that return CSV data, but send error responses in XML.',
  'export.http.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/products' or '/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this export. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to refine the set of resources an API endpoint returns.",
  'export.http.method':
    "The most common HTTP method used by APIs for the retrieval of resources is 'GET'. In some cases, RPC style or SOAP/XML APIs will require the use of the 'POST' HTTP method.  Both of these scenarios are supported by integrator.io.  If the POST method is used, typically the body of the HTTP request will contain filtering or selection criteria.  This information can be provided in the 'body' field. Refer to this field for more information.",
  'export.http.body':
    "Most HTTP/REST exports utilize GET requests that do not have an HTTP body. In some cases, such as RPC style API's an HTTP body is necessary to convey the details of the export request. If this is the case for the application you are integrating with, this field allows you to configure the content of the HTTP request body. Note that the integrator.io platform support handlebar templates to aid in the construction of the HTTP body. It is also possible to use helper method and field placeholders to pull-in and manipulate data passed into the export, or from the connection object itself. This button with launch an editor to make the process of constructing (and testing) your body templates easier.",
  'export.http.headers':
    "In some cases, it may be necessary to include custom HTTP headers with your API requests. As with the 'body' field, any value from the connection or export models can be references using {{placeholders}} with a complete path matching either the connection or export field.",
  'export.http.paging.method':
    "Some APIs offer paging functionality in order to limit their HTTP response to a manageable size if the total set of resources is large. Several different paging methods are supported by integrator.io. Choose 'token' if the API returns a token to the next page within the response body.  Choose 'page' if the API uses a page number parameter to paginate the results. Choose 'skip' if the API uses a skip-take style paging mechanism. Other names for this paging method would be offset and limit.",
  'export.http.paging.skip':
    "This optional field is used when paging method is set to 'skip'. It only needs to be set if the export should start at an offset from the first record. This value is automatically set on each subsequent page request. The value can be referenced as a placeholder in the body, headers, or relativeURI of the export request. Example: '/products?offset={{{export.http.paging.skip}}}'.",
  'export.http.paging.page':
    "This optional field is used when paging method is set to 'page'. It only needs to be set with an initial value if the export should start at a page offset. This value is automatically incremented on each subsequent page request. The value can be referenced as a placeholder in the body, headers, or relativeURI of the export request. Example: '/products?page={{{export.http.paging.page}}}'.",
  'export.http.paging.token':
    "This optional field is used when paging method is set to 'token'. It only needs to be set if the initial export should contain a token. This value is automatically set on each subsequent page request. The value can be referenced as a placeholder in the body, headers, or relativeURI of the export request. Example: '/products?token={{{export.http.paging.token}}}'.",
  'export.http.paging.tokenPath':
    'If the paging method is set to token, integrator.io needs to be able to find the token in the HTTP response of each page in order to construct the next page request. This field lets IO know where to look for the next page token. If no value is found at this path, then paging is terminated (final page reached).',
  'export.http.paging.relativeURI':
    'This optional field can be used in combination with any paging method. In some cases subsequent page requests need to use a different relativeURI from the first page request.',
  'export.http.paging.pathAfterFirstRequest':
    'This is an optional override for the token path. It is only necessary if the next-page-token is found at a different location for subsequent page requests. Some APIs change their response structure after the first page request. This is a rare occurrence.',
  'export.http.paging.resourcePath':
    'This is an optional override to the resource path if subsequent page responses have a different response structure.  Note that the format of this path is specific to the media type. If the response is represented in JSON structure, then use "dot" notation to describe the path to your resources. Example: "results.customers". If the response is XML, then use XPATH style selectors. Example: "/SearchResults/Customers/Customer"',
  'export.http.paging.linkHeaderRelation':
    'When the paging method is set to "Link Header", by default IO uses HTTP conventions to look for the next page url within a dedicated "link" header value. It is possible, within this link header, to include multiple urls facilitating page navigation forward, back, or even first or last. In cases where multiple values are found, integrator.io needs to know which to use. The convention for these "rel" (Relation) values is "prev", "next", "last" and "first", where "next" is default in integrator.io. Some APIs that use this paging mechanism may not comply to these defaults. As such, this field allows you to overriding the default "next" relation to a value used by the application you are connecting too. For more information on link headers, please refer <a href="https://tools.ietf.org/html/rfc5988">https://tools.ietf.org/html/rfc5988</a>.',
  'export.http.paging.lastPageStatusCode':
    'Some APIs will return an error status code (less than 200 or greater than 300) as the last page response. This optional field can be used to tell integrator.io the response code to expect in these situations and not to treat this response as an error. For example, if an API returns a generic "500" status code, set this value to 500. This field can be used in conjunction with "lastPagePath" and "lastPageValue". Note that error 404 is automatically treated as the last page response so it is not necessary to set this field for that case.',
  'export.http.paging.lastPagePath':
    'If "lastPageStatusCode" is set then you can set this field to tell integrator.io to check a specific field in the response object to determine if paging is complete. For example, the specified field can be "error.message". If "lastPagePath" is not set then paging will be considered complete otherwise this response will be considered an error.',
  'export.http.paging.lastPageValues':
    'If "lastPageStatusCode" and "lastPagePath" are set then you can set this field to tell integrator.io to check a specific field\'s value in the response object to determine if paging is complete. If the value in the response object matches this field then paging will be considered complete otherwise this response will be considered an error. Example: "No records found".',
  'export.http.paging.maxPagePath':
    'Some APIs return the total number of pages available in each of their page responses. This optional field can be used as a trigger to stop making page requests. This field tells integrator.io where to find the maximum page value within each page response, and when this page count is met, no more page requests will be made. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.http.paging.maxCountPath':
    'Some APIs return the total number of resources available in each of their page responses. This optional field can be used as a trigger to stop making page requests. This field tells integrator.io where to find the total resource count within each page response, and when this resource count is met, no more page requests will be made. If omitted, integrator.io will continue to make requests until no resources are returned, or a 404 (not found) response is encountered.',
  'export.http.paging.path':
    'If the paging method is set to token, integrator.io needs to be able to find the token in the HTTP response of each page in order to construct the next page request. This field lets integrator.io know where to look for the next page token. If no value is found at this path, then paging is terminated (final page reached). When the paging method is set to "nextPageUrl", this "path" field is used to tell integrator.io where in the HTTP response to look to find a URL to use when requesting the next page of data. The format of this path is dependent on the media-type (content-type) of the original (first) page response. For JSON responses, the path should be represented in "dot" notation. Example: "result.paging.nextPageUrl".In contrast, if the response contains XML, then an XPATH style path should be used. Example: "/result/paging/nextPageUrl".Paging is terminated when no URL is found at the specified path.',
  'export.http.once.relativeURI':
    'This field indicates what url endpoint to hit for each successful exported record. It can contain {{{placeholders}}} that will be populated from a model object that consists of a connection, export and data property. The data property is the record that was just exported.',
  'export.http.once.method':
    'The HTTP method (GET/PUT/POST/PATCH/DELETE) of the once request.',
  'export.http.once.body':
    'This field represents the body of the once http request that is hit for each successful exported record. It can contain {{{placeholders}}} that will be populated from a model object that consists of a connection, export and data property. The data property is the record that was just exported.',
  'export.http.response.resourcePath':
    'This optional field is used to help integrator.io locate the resource (or set of resources) returned from an API call.  If the HTTP response from an API contains the resource(s) at the root, then no value is necessary for this field.  If on the other hand, the response from an API contains a deeper response structure that for example contains paging information, it will be necessary for you to provide the path to the resource(s). If no value is provided, integrator.io assumes that the resources can be found at the root of the response. Note that the format of this path is specific to the media type. If the response is represented in JSON structure, then use "dot" notation to describe the path to your resources. Example: "results.customers". If the response is XML, then use XPATH style selectors. Example: "/SearchResults/Customers/Customer"',
  'export.http.response.successPath':
    'Not all services return http status codes that can be used to determine success or failure of a request.  If a service always returns 200 http status code, even for some failures, then this field can be used to tell integrator.io where to look for a success indicator. This field is used in unison with successValues to further refine how our platform can identify a successful response. If no success values are provided, any truthy value found in the response body at this path will be considered a success.',
  'export.http.response.successValues':
    'This optional field is used in unison with the successPath field. The value found in the HTTP response at the path provided by successPath is compared against the provided list of success values. If there is an exact case-sensitive match of any of the values, then the request is considered successful.',
  'export.http.response.blobFormat':
    'Please specify the encoding type of the file that needs to be exported. Supported encoding types are: utf8, ucs2 / utf16-le, ascii, binary, base64, hex. We need this encoding type to have the file content properly transmitted as data is transmitted in binary format.',
  'export.http.response.errorPath':
    'This optional field is used to help identify where in the body of a failed HTTP response integrator.io can find the error message. If desired, provide the field path to the property/node containing the error message. If no value is given, then the full HTTP response body is used as the description of the failure in the dashboard. If the media-type of the failed response is XML, this value should be an XPATH. Conversely, if the media-type is JSON, then use a JSON path. Note that if failed responses for the application you are integrating with have no body, then a text version of the HTTP status code is used as the reason for failure. An Example of a JSON path would be: "result.error.message" while an XPATH for XML responses would be: "/result/error.message/text()"',
  'export.rdbms.query': 'The query that fetches records to be exported.',
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
  'export.hooks.preSavePage.function':
    'This hook gets invoked at the very end of your export process, right before each page of data is saved and passed along to downstream applications. This hook can be used to modify, add, or delete records.',
  'export.hooks.preSavePage.scriptFunction':
    'This hook gets invoked at the very end of your export process, right before each page of data is saved and passed along to downstream applications. This hook can be used to modify, add, or delete records.',
  'export.hooks.preSavePage._stackId':
    'The stack that contains your preSavePage hook code.',
  'export.hooks.preSavePage._scriptId':
    'The script record that contains your preSavePage hook function.',
  'export.file.encoding':
    'The file encoding indicates how the individual characters in your data are represented on the file system. The default encoding is utf-8. Depending on the source system of the data, the encoding can take on different formats. Current supported formats are: utf-8, win-1254 and utf-16le. If you do not know what encoding your data is, in most cases it will be utf-8.',
  'export.file.output':
    'This field determines what type of information will be returned by the file export. For most usecases the "Records" option is desired. This option will read and parse your files for you, and return pages of records that can then be imported into other applications. The "Metadata" option will not process your files, but will instead return a record entry for just the filename and last modified date of each file in the specified directory. The "Blob Keys" option will transfer your raw files as-is into integrator.io storage without processing them, and will return a "blobKey" for each file that was successfully transferred; and then you can use the "blobKey" values that were returned in subsequent imports to tell integrator.io to transfer the copied files into other applications. For example, you might build a flow that exports all the files from an FTP directory as-is and then imports those same files into the NetSuite file cabinet.',
  'export.file.type':
    'Please specify the type of files being exported so that integrator.io will know how to parse your data. For example, if you are exporting CSV files (i.e. files containing Comma Separated Value data) then please choose CSV.  Please note that integrator.io does not care how your files are actually named, nor does it matter what file name extensions are being used.  For example, you can select CSV here for files with all sorts of different file name extensions (i.e. csvData.txt, csvData.dat, csvData.random), and integrator.io will parse them all the same with the CSV data parser.',
  'export.file.skipDelete':
    "If this field is set to 'true' then integrator.io will NOT delete files from the export application after an export completes.  The files will be left on the export application, and if the export process runs again the same files will be exported again.  For example, if you are exporting files from an FTP folder, and have this field set to true, then integrator.io will export all files on the FTP folder but leave them in the FTP folder, and if the export runs again then integrator.io will export the same files again.",
  'export.file.compressionFormat':
    "Currently 'gzip' is the only compression format supported by integrator.io, please log a support ticket if you would like any other compression formats added.",
  'export.file.csv.columnDelimiter':
    'Unfortunately, integrator.io is not smart enough (yet) to dynamically determine the column delimiter in a CSV file, so we recommend that you tell us exactly which character is being used to separate column values.  For example: comma, pipe, tab, etc...  If you cannot easily see the character being used in a sample file, try opening the file with a text editor like Textpad or notepad, and then hopefully it will be obvious.',
  'export.file.csv.rowDelimiter':
    "The character, or set of characters used to identify the end of a row. If this field is left blank then integrator.io will attempt to identify the row delimiter itself. Some common row delimiters are: '\n', '\r\n', '\r'",
  'export.file.csv.keyColumns':
    'If multiple rows of data represent a single object (sales order line items for example), it is possible to group these rows into a single export record. If this behavior is desired, this field should be used to provide 1 or more columns in the source data that should be used to group related records. Typically this would be the id column of the parent object. In our example above, this would be the sales order id.',
  'export.file.csv.hasHeaderRow':
    'Set this field to true if the files you are exporting contain a top level header row.  Saying this another way, if the very first row in the CSV files being exported is reserved for column names (and not actual data) then set this field to true.',
  'export.file.csv.trimSpaces':
    'Set this field to true if you would like to remove all leading and trailing whitespaces in your column data. Please note that header row values are not affected by this setting. Leading and trailing whitespaces in the header row (if one is present) are always trimmed. For example:\nHeader1 , Header 2,Header3 \nCol 11 , Col 12 , Col 13\nCol21, Col22, Col23 \n\n Would look like:\n[\n{ "Header1": "Col 11", "Header 2": "Col 12", "Header3": "Col 13" },\n{ "Header1": "Col21", "Header 2": "Col22", "Header3": "Col23" }\n]',
  'export.file.csv.rowsToSkip':
    'In some rare occasions CSV files will contain multiple header rows that do not describe the columns. These header rows could for example contain the filename or date/time the file was created. Use this field if your file has header rows you wish to skip.',
  'export.file.xlsx.keyColumns':
    'If multiple rows of data represent a single object (sales order line items for example), it is possible to group these rows into a single export record. If this behavior is desired, this field should be used to provide 1 or more columns in the source data that should be used to group related records. Typically this would be the id column of the parent object. In our example above, this would be the sales order id.',
  'export.file.xlsx.hasHeaderRow':
    'Set this field to true if the files you are exporting contain a top level header row.  Saying this another way, if the very first row in the CSV files being exported is reserved for column names (and not actual data) then set this field to true.',
  'export.exportData':
    'Over here you can specify how you would like to export data.',
  'export.ftp.directoryPath':
    "Use this field to specify the directory path of the FTP folder containing the files that you want to export.  For example, if you set this field to 'MySite/Orders' integrator.io will first look for a parent folder 'MySite', and then for a child folder 'Orders', and then export all files from the child folder 'Orders'.  Please note that by default integrator.io will export all files in the folder, and also delete them from the folder once the export completes.   Copies of the original files will be stored in integrator.io for a maximum of 30 days, and can be exported from the jobs dashboard.  You can also (optionally) configure integrator.io to leave files on the FTP server, or to only export files that match a certain 'starts with' or 'ends with' name pattern.",
  'export.ftp.fileNameStartsWith':
    "Use this field to specify a file name prefix that will be used to filter which files in the FTP folder will be exported (vs not).  For example, if you set this value to 'test' then only files where the name starts with 'test' will be exported (like test-myFile.csv).",
  'export.ftp.fileNameEndsWith':
    "Use this field to specify a file name postfix that will be used to filter which files in the FTP folder will be exported (vs not).  For example, if you set this value to 'test.csv' then only files where the name ends with 'test.csv' will be exported (like myFile-test.csv).  Please note that you must specify the file extension for this filter to work correctly",
  'export.s3.region':
    "Name of the amazon s3 region to the location where the request is being made. If not set, by default 'us-east-1' is selected",
  'export.webhook.provider':
    "Many popular webhooks have been exposed here for your convenience.  If you don't see the application that you need please log a support ticket so we can prioritize accordingly.  If you are creating your own webhook please choose 'Custom'.",
  'export.webhook.verify':
    'Please specify the method that should be used to verify the authenticity of the data being sent to this webhook export.',
  'export.webhook.token':
    'Please provide a secret token that will be used to verify the authenticity of the data sent to this webhook export.  This token value should only be shared with the webhook provider, and ideally should be generated by some sort of industry standard password tool.',
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
    'Basic auth requires both username and password. Please enter your password here. Please note that there are multiple layers of protections in place (including AES 256 encryption) to keep your password safe.',
  'export.salesforce.soql.query':
    "Use the Salesforce Object Query Language (i.e. SOQL) to define what data you would like to export out of Salesforce.  For example: 'SELECT Id, Name FROM Account WHERE SendToBlah = TRUE'.  SOQL is an incredibly powerful query language with all sorts of capabilities, and lots of documentation and examples on the web.  If you need additional help understanding SOQL, or piecing together a specific query, then please contact Salesforce support.",
  'export.salesforce.id':
    'To export raw files out of Salesforce, integrator.io needs to know the ID of the Salesforce record you want to export. You can hard code a specific file by specifying the ID directly. For example: 00530050000ibYc. Or, if the files being exported are dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the ID values. For example: myFileField.ID.',
  'export.wrapper.function':
    'The name of the extension wrapper function in your code that needs to be invoked as part of the export process.',
  'export.wrapper.configuration':
    'This field can be used to provide custom information which will be passed to the wrapper function whenever it is invoked. This can be useful if the same wrapper function is used for different exports and it needs to be configured differently per export.',
  'flow._id':
    'System generated primary unique identifier for your connection.  For API users, this value should be used for GET and PUT requests.',
  'flow.name':
    'Name your flow so that other users can understand at a very high level what it is doing. For example, "Send NetSuite Item Updates to Amazon". The name you choose will show up on your job dashboard and also in email notifications.',
  'flow.description':
    'Describe your flow in more detail here so that other users can understand the business problem you are solving, and also how your integration solution works. Be sure to highlight any nuances that a user who will make changes in the future might need to know about.',
  'flow.schedule':
    'It is a cron (time-based job scheduler). You can set scheduling for flow execution',
  'flow.lastModified':
    'System generated datetime to track the last time this resource was modified.',
  'flow._exportId':
    'Unique identifier of the export created from where the data is exported',
  'flow._importId':
    'Unique identifier of the import created where the data is going to be imported',
  'flow._integrationId':
    "This field can only be set when a flow is first created, or when a flow belongs to the default system 'Standalone Flows' integration tile. To move a flow that already belongs to a specific integration tile please first 'Detach' it from that tile, and then this field can be set again to assign the flow to a new integration tile.",
  'flow._connectorId':
    'If this connection was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this value will hold the _id value of the SmartConnector app that owns the connection.  Please note that for security reasons connections owned by a SmartConnector cannot be referenced outside the context of the SmartConnector, meaning that you cannot use any of these connections in the data flows that you build yourself.',
  'flow.disabled': 'Boolean value. If set, the flow will be in inactive state',
  'flow.timezone':
    'Use this field to configure the time zone that the integrator.io scheduler should use to run your integration flow.',
  'flow._runNextFlowIds':
    'Use this field to configure a next flow that you would like to run automatically anytime this flow completes. The next flow must be enabled, and please note that the current flow will not be blocked from running again while the next flow is in progress.',
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
    "Name your import so that you can easily reference it from other parts of the application.  For example: 'Shopify - Import Tracking Numbers'",
  'import._connectionId':
    'The specific connection you would like to use for your export or import.\nYou can pre-establish and save your connections using Menu > Connections. Each stored connection contains credentials along with other related information needed to access the desired application.\nIn addition, you can click the + icon beside this field to create a new connection.',
  'import.lastModified':
    'System generated datetime to track the last time this resource was modified.',
  'import.apiIdentifier':
    "Every import that you create is assigned a unique handle that you can then use in your own application logic to invoke the import programmatically via the integrator.io API.  For example, your import identifier might be 'i662cb46', and you could invoke this import with a simple HTTP POST (with the data to be imported as a JSON array in the post body) to https://api.integrator.io/i662cb46",
  'import._integrationId':
    'If this import was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this value will be hold the _id value of the specific integration instance (a.k.a. integration tile) that owns the import.  Please note that for security reasons imports owned by a SmartConnector cannot be referenced outside the context of the specific integration tile that they belong to, meaning that you cannot use these imports in the data flows that you build yourself, nor can the same SmartConnector reference imports across different integration tiles.',
  'import._connectorId':
    'If this import was installed as part of a SmartConnector app (i.e. from the integrator.io marketplace), then this value will hold the _id value of the SmartConnector app that owns the import.  Please note that for security reasons imports owned by a SmartConnector cannot be referenced outside the context of the SmartConnector, meaning that you cannot use any of these imports in the data flows that you build yourself.',
  'import.sampleData': 'Used in UI, which helps in populating data for mapping',
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
  'import.description':
    'Describe your import so that other users can quickly understand what it is doing without having to read through all the fields and settings. Be sure to highlight any nuances that a user should be aware of before using your import in their flows. Also, as you make changes to the import be sure to keep this field up to date.',
  'import.blobKeyPath':
    'When you use integrator.io to sync documents, attachments, images, etc. (i.e. raw blob data) you first need a blob export defined in your flow to get the raw blob data from an external application and into integrator.io storage. You then need to make sure that you have a response mapping on your blob export for the blobKey value that integrator.io returns whenever blob data is successfully stored in integrator.io. Assuming these two things have been done, use this field to indicate the JSON path where you mapped the blobKey value in your data, and then integrator.io will use the blobKey value to get the file out of integrator.io storage and transfer it to the import application.',
  'import.deleteAfterImport':
    'Set this field to true if you would like to delete the blob content which is intermittently stored during the transit. On successful import, intermittently stored blob content will be deleted.',
  'import.filter.rules':
    'Important: only records where your filter expression evaluates to true will get processed by this import.  All other records will be marked as ignored.  Defining a filter on your import allows you to skip processing for specific records. For example, if you have an import that posts messages to Slack for all web orders that come in throughout the day you could add an import filter to instead only post orders that are above a certain amount. Please note that unlike export filters, import filters do not discard data traveling through your flow. Records that get ignored will still get passed along to subsequent processors in your flow.',
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
  'import.netsuite.recordTypeId':
    'Unique id associated with the recordType selected',
  'import.netsuite.operation':
    "Please select 'Add' if you are only importing new records into NetSuite.  Please select 'Update' if you are only importing changes to existing records in NetSuite.  Please select 'Add or Update' if you want your import to be more dynamic such that (1) if an existing record is found in NetSuite then that record will be updated, or (2) if an existing record cannot be found in NetSuite then a new record will be created.  When using just 'Add' it is definitely a best practice to make sure you have some sort of protection in place against duplicate records.  Probably the easiest way to add this protection is to use the 'Ignore Existing Records' field.",
  'import.netsuite.retryUpdateAsAdd':
    'Boolean value if set, on failure of any record update on NS, it will be retried as a add operation',
  'import.netsuite.customFieldMetadata':
    'If the record is custom field, this json path contain the metadata information on that custom field.',
  'import.netsuite.internalIdLookup.extract': '',
  'import.netsuite.internalIdLookup.searchField': '',
  'import.netsuite.internalIdLookup.expression':
    'Ex: \'[["email", "is", "{{email}}"], "AND", ["lastName", "is", "{{lastName}}"]]\'',
  'import.rest.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/product' or '/bulkUpdate/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this import. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to pass extended information to an API endpoint.",
  'import.rest.body':
    'This optional field can be used to customize the structure of the HTTP body. It is technically a handlebar template that supports {{{placeholders}}} which will be replaced with the corresponding values within the post-mapped record. It is also possible to reference specific fields within the connection model as well by using the placeholder pattern: {{connection.rest.[desired field]}}. Please ensure that you have wrapped all JSON property names in quotes. Note that this can also be used to wrap the complete post-mapped object within a larger json structure. Example: { "request": {"items": [ {{jsonSerialize data}} ] } }',
  'import.rest.method':
    "The most common HTTP method used by APIs for the creating resources is 'POST'. Updates typically use 'PUT'. In some cases, RPC style or SOAP/XML APIs will always use the 'POST' HTTP method.  All of these scenarios are supported by integrator.io.",
  'import.rest.headers':
    'In some cases, it may be necessary to include custom HTTP headers with your API requests. Any value from the connection can be referenced using {{placeholders}} with a complete path matching the connection field you require.',
  'import.rest.responseIdPath':
    'This field is used to help integrator.io find the identifer (id) of the resource returned in the HTTP response. Use the complete path of the resource id within the response. If this field is left blank, integrator.io will try to find a property named id or _id anywhere in the response body.',
  'import.rest.successPath':
    "There are some APIs out there (i.e. Slack) that will return a 200 HTTP status code even if an HTTP request fails.  These APIs instead use a field in the HTTP response body to identify success vs fail. For these APIs, this option field 'Success Path' can be used to specify the JSON path for the field in the response body that should be used to determine if an HTTP request was successful.  For example, if you are working with Slack's API you would set this field to: 'ok'.",
  'import.rest.successValues':
    'This is an optional field which only needs to be configured if the application you are integrating with does not respect HTTP conventions that utilize HTTP status codes to convey success/failure. By default our platform will treat all HTTP responses with a status code in the 2xx range as successful. Conversely, responses with all other status codes are treated as failures. (401 auth failure, 404 resource not found, 500 server error, etc)\n\nIf the application you are integrating with always returns a 200 response, and instead, the body of the response has a property which indicates success/failure, you can use this field to tell our platform (in conjunction with the above "Success Path" field), what responses should be treated as successful. All others will be considered failed responses. For example the Slack API always returns a 200 response, and the body contains an "ok" property with a vale of \'true\' or \'false\'. In this case, the "Success Value" field should have a value of \'true\'.',
  'import.rest.ignoreLookupName':
    'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the lookup that will be used to test for the existence of a resource.',
  'import.rest.ignoreExtract':
    'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the json path of a field within the exported resource to be used to test for the existence of a resource. In other words, this is the path to an identifier or some other field that would only be present if a resource already exists in the import system.',
  'import.http.successMediaType':
    'The success media type indicates the format of the data received from all successful (HTTP) requests.  Typically APIs will only support one media type (data format) and will publish that info right at the top of their API guides. This is an optional override of the media type associated with the connection in case the API has route specific data formats. Amazon MWS for example, is an XML service that returns CSV data for some of its reports.',
  'import.http.requestMediaType':
    'The request media type indicates the format of the content within the HTTP request body sent to the service.  Typically APIs will only support one media type (data format) and will publish that info right at the top of their API guides. This is an optional override of the media type associated with the connection in case the API has route specific data formats.  Amazon MWS for example, has some endpoints that allow CSV request data, but send error responses in XML.',
  'import.http.errorMediaType':
    'The error media type indicates the format of the response data received from all unsuccessful (HTTP) requests.  This refers to all responses with non-2xx HTTP status codes.  Typically APIs will only support one media type (data format) and will publish that info right at the top of their API guides. This is an optional override of the media type associated with the connection in case the API has route specific data formats.  Amazon MWS for example, has some endpoints that return CSV data, but send error responses in XML.',
  'import.http.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/product' or '/bulkUpdate/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this import. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to pass extended information to an API endpoint.",
  'import.http.method':
    "The most common HTTP method used by APIs for the creating resources is 'POST'. Updates typically use 'PUT'. In some cases, RPC style or SOAP/XML APIs will always use the 'POST' HTTP method.  All of these scenarios are supported by integrator.io.",
  'import.http.body':
    'The value of this field becomes the HTTP body that is sent to the API endpoint.  The format of the body is dependent on the API being used.  It could be url-encoded, json or XML data.  IN either case, the metadata contained in this body will provide the API with the information needed to fulfill your request. Note that this field is considered a Handlebar template. It can contain {{{placeholders}}} that will be populated from a model comprising of a connection, export and data object. The data object will be 1 or more of the records being imported. Refer to your API documentation to determine what (if any) batch size is possible per HTTP request. Note that for some XML/SOAP services authentication information is also embedded in the request body. In this case, within the body template, you could reference the connection details using a placeholder like: {{connection.http.auth.encrypted.key}}.',
  'import.http.headers':
    "In some cases, it may be necessary to include custom HTTP headers with your API requests. As with the 'body' field, any value from the connection or import models can be referenced using {{placeholders}} with a complete path matching either the connection or import field you require.",
  'import.http.response.resourcePath':
    'This field is used only when batchSizeLimit is > 1.  In this case, this path identifies where to find the set of resources returned in the HTTP response.',
  'import.http.response.resourceIdPath':
    'This field is used to help integrator.io find the identifer (id) of the resource(s) returned in the HTTP response. If the response is from a batch request (batchSizeLimit > 1), then this path is relative to the resourcePath, otherwise use the complete path of the resource id within the response. If this field is left blank, integrator.io will try to find a property named id or _id.',
  'import.http.response.successPath':
    'Not all services return http status codes that can be used to determine success or failure of a request.  If a service always returns 200 http status code, even for some failures, then this field can be used to tell integrator.io where to look for a success indicator. This field is used in unison with successValues to further refine how our platform can identify a successful response. If no success values are provided, any truthy value found in the response body at this path will be considered a success.',
  'import.http.response.successValues':
    'This optional field is used in unison with the successPath field. The value found in the HTTP response at the path provided by successPath is compared against the provided list of success values. If there is an exact case-sensitive match of any of the values, then the request is considered successful.',
  'import.http.response.errorPath':
    'This optional field is used to help identify where in the body of a failed HTTP response our platform can find the error message. If desired, provide the field path to the property/node containing the error message. If no value is given, then the full HTTP response body is used as the description of the failure in the dashboard. If the media-type of the failed response is XML, this value should be an XPATH. Conversely, if the media-type is JSON, then use a JSON path. Note that if failed responses for the application you are integrating with have no body, then a text version of the HTTP status code is used as the reason for failure. An Example of a JSON path would be: "result.error.message" while an XPATH for XML responses would be: "/result/error.message/text()"',
  'import.http.batchSize':
    "The HTTP adaptor supports batch and single resource endpoints. If left blank, this field defaults to 1 (non-batch endpoint). Use this field only if you are using an API endpoint that supports batch record processing. There may also be limits to the number of resources an API allows you to act on in a single HTTP request. Refer to their documentation for acceptable limits. Note that your 'body' field will need to have a handlebar template that can iterate over the set of resources provided in the data property of the model used to populate the template.",
  'import.http.ignoreLookupName':
    'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the lookup that will be used to test for the existence of a resource.',
  'import.http.ignoreExtract':
    'If this import has either the ignoreMissing (update) or ignoreExisting (create) flags set to true, this field is used to identify the extract path of a field within the exported resource to be used to test for the existence of a resource. In other words, this is the path to an identifier or some other field that would only be present if a resource already exists in the import system.',
  'import.http.ignoreEmptyNodes':
    'IF this flag is set to true, then the XML or JSON that makes up the HTTP request body will be stripped of all nodes that do not have a value. For example, if the body template resolves to: <customer id="1"><phone></phone></customer> and this flag is set, then the actual XML that will be used in the HTTP request will be: <customer id="1"></customer>',
  'import.file.skipAggregation':
    'By default, integrator.io will aggregate all the pages of data that get generated by an export into one (possibly large) file.  If you prefer multiple smaller files (vs one large file) then please set this field to true.',
  'import.file.type':
    'Please specify the type of files that you want to generate. For example, if you are trying to generate CSV files (i.e. files containing Comma Separated Value data) then please choose CSV.  Please note also that you can name your files however you like (i.e. using the File Name field) without affecting the type of data being generated.',
  'import.file.compressionFormat':
    "Currently 'gzip' is the only compression format supported by integrator.io, please log a support ticket if you would like any other compression formats added.",
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
  'import.file.csv.replaceNewlineWithSpace':
    'Boolean value, when set new lines in the content of the data (except rowDelimiters) are replaced with a space (Default is false)',
  'import.as2.fileNameTemplate':
    "Use this field to specify how the files being sent via AS2 should be named in the AS2 message header. You can type '{{{' to include a variable in your file name, such as timestamp, unique ID, and other AS2 metadata (consult the documentation for more details). For example, 'FileXYZ-{{{timestamp(YY-MM-DD)}}}.txt' will create files with the following pattern: 'FileXYZ-16-06-30.txt'. Or, 'FileXYZ-{{{random \"UUID\"}}}.txt' will upload files with the following pattern: 'FileXYZ-69368e91d9a440f79165b73afd46859d.txt', using the unique id (UUID) of the file. Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.as2.messageIdTemplate':
    'This field is used to specify the format of a unique message identifier that can be automatically generated as part of the import and included in the AS2 message header. The field uses handlebars to access available variables. For example, {{dateFormat "ddMMyyyyHHmmssZ"-random@ connection.as2.as2Id _ connection.as2.partnerId',
  'import.as2.maxRetries':
    'Use this field to determine how many times integrator.io will retry sending an EDI message in the event of receiving an AS2 error response. By default, messages failures will not be retried.',
  'import.salesforce.upsert.externalIdField':
    'An External ID field in Salesforce is a custom field that has the External ID attribute set to true.  External ID fields should be used to store unique record identifiers from systems outside Salesforce.  External ID is required to perform Upserts.  If you need additional help understanding External IDs or creating a new External ID field in Salesforce then please contact Salesforce support, or check the Salesforce developer guides.',
  'import.salesforce.sObjectType':
    'Use this field to specify which Salesforce sObject type you want to import.  You can choose any standard sObject type (i.e. account, opportunity, contact) or any custom sObject type that has been defined in your Salesforce account. Please note that this list of sObject types is dependent on the permissions associated with the connection selected above. Also, if you add any new custom sObject types to your Salesforce account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'import.salesforce.operation':
    "Please select 'Insert' if you are only importing new records into Salesforce.  Please select 'Update' if you are only importing changes to existing records in Salesforce.  Please select 'Upsert' if you want your import to be more dynamic such that (1) if an existing record exists in Salesforce then that record will be updated, or (2) if an existing record does not exist then a new record will be created.  When using just 'Insert' it is definitely a best practice to make sure you have some sort of protection in place against duplicate records.  Probably the easiest way to add this protection is to use the 'Ignore Existing Records' field.",
  'import.salesforce.idLookup.whereClause':
    'Use this field to define a WHERE clause that integrator.io will use (to execute a SOQL query against the SObject Type defined in this import) to determine if a record already exists in Salesforce or not.  For example, if you are importing contact records and you have a unique email for each contact, then you can use this field to define a WHERE clause to see if any contacts with the same email already exists in Salesforce.  If needed, you can also define more complex WHERE clauses using AND and OR.  For example, if you are importing product records you can define a WHERE clause to see if any products exist with a specific product name AND also belong to a specific product family (i.e. because maybe product name by itself is not guaranteed to be unique, but product name plus product family always is unique).',
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
    "Document name specifies the name or label of the document record getting imported to Salesforce. Please enter the name (e.g. 'temp.text') for your document that you want to import. Or, if the name should be dynamic based on the data you are integrating then you can instead specify the JSON path to the field in your data containing the ID values. For example: myFileField.name.",
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
    "Use this field to specify the directory path of the FTP folder where you want files to be imported.  For example, if you set this field to 'MySite/Items' integrator.io will first look for a parent folder 'MySite', and then for a child folder 'Items', and then import all files into this child folder 'Items'.",
  'import.ftp.fileExtension':
    "This field can be used to include a specific file name extension to all files being generated and imported to an FTP site.  For example, if you choose '.csv' then all files being imported to the FTP site will include the extension '.csv' in their file name (i.e. FileXYZ-16-06-30.csv). Please note that this field is only relates to the file's name, and does not dictate the type of data being generated (which is set via a different field).  Saying this another way, although not recommended you could generate json files but use a '.csv' extension for the file names.",
  'import.ftp.fileName':
    "Use this field to specify how the files being uploaded to the ftp site should be named.  You can type '{{{' to include a predefined timestamp template in your file name.  For example, 'FileXYZ-{{{timestamp(YY-MM-DD)}}}.txt' will upload files with the following pattern: 'FileXYZ-16-06-30.txt'.  Please note also that you can include whatever file name extension you like, and the file name extension will never change the type of data being generated.",
  'import.ftp.inProgressFileName':
    'If the destination folder where your file is being generated is also being watched by another service, it may be necessary to "hide" the file being generated by integrator.io until it completes.  This field is used to tell our platform to write the file under a temporary filename while the write opperation is in progress. Upon completion, integrator.io will rename this file to the intended filename defined by the "fileName" field.',
  'import.s3.region':
    'Name of the nearest amazon s3 region to the location from where the request is being made. If not set, by default "us-east-1" is selected',
  'import.s3.bucket':
    'Name of the bucket in S3, where you want file to be saved',
  'import.s3.fileKey': 'Name of the file',
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
  'integration._id':
    'System generated primary unique identifier for your integration.  For API users, this value should be used for GET and PUT requests.',
  'integration.name':
    "Name your integration so that you can easily reference it from other parts of the application.  For example: 'NetSuite Flows'",
  'integration.lastModified':
    'System generated datetime to track the last time this resource was modified.',
  'integration.description':
    'Brief description on the integration group created',
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
    'Please name your script record so that you can easily reference it from other parts of the application.\n For example: "all-my-hooks.js"',
  'script.description':
    'Please describe your script so that other integrator.io users can quickly understand what it does and how it works.',
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

  // Ui help text generation
  // #region UI help text
  'export._applicationId':
    "This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors.\nIf you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'export.executionType': '',
  'export.overrideDataURITemplate':
    'For applications like NetSuite and Salesforce, integrator.io will by default try to generate links for any records that fail to export and then display those links in your job dashboard.  If you prefer to define your own custom links then please use this handlebars field to override the default functionality.  For example, if you are exporting sales orders but instead want the errors to link to customers, you could use the following.  "https://system.na1.netsuite.com/app/common/entity/custjob?id={{{entity}}}"',
  'export.csvFile':
    'Please select a file from your local computer that you would like to import. The maximum file size allowed is currently 100 MB. If you need to import anything larger than this please log a support ticket, or as a work around you can break your larger files into separate smaller ones.',
  'export.requiredTrigger':
    'When you select an sObject type in the SObject Type field, an Apex trigger code is generated in this field. This code is required per sObject type to facilitate real-time data exports. You have to copy this code using the Copy icon and paste it in the Salesforce page in your account, the link for which appears just below this field.',
  'export.referencedFields':
    'Use this setting to add additional fields to the export data defined as lookup fields on the sObject on Salesforce. Ex: Account is a lookup field on Opportunity. This setting allows users to pull data from the reference fields (such as Name, AccountNumber) on the Account sObject.',
  'export.relatedLists':
    'Use this setting to add additional fields from the related/sublist sObject to the export data defined on the sObject on Salesforce. Ex: Contact sObject is a sublist sObject for an Account. This setting allows users to pull data from sublist fields such as Name, Email and Department from all Contact records related to an Account record. Users can also use filters to only pull filtered Contacts belonging to a specific Department.',
  'export.http-headers':
    'Click this button to specify any custom HTTP header name and value pairs which will be added to all HTTP requests. Note that in most cases our platform will auto-populate common headers such as "content-type" (based of the media type of the request), or the "Authorize" header (used if your application authenticates using tokens in the header). Unless your HTTP request fails or does not return expected results, there is no need to use this feature. In some rare cases, it may be necessary to add other application specific headers that the integrator.io platform does not manage. An example of this would be adding an "x-clientId" or any other application specific header. These would be documented in the API guide of the Application you are integrating with.',
  'export.fixedWidthFormat':
    'Please select the file format that most closely matches your needs. If the exact format is not found, select the closest template. You will have an opportunity to modify the rules within this template by using the “File Definition Editor” below.',
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
  'export.netsuite.recordType':
    'Use this field to specify which NetSuite record type you want to export. You can choose any standard record type (i.e. customer, sales order, journal entry) or any custom record type that has been defined in your NetSuite account. Please note that this list of record types is dependent on the permissions associated with the connection selected above. Also, if you add any new custom record types to your NetSuite account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'export.netsuite.executionContext':
    "This is a required field to specify the exact execution context values for which a record should be exported in real-time.  For example, it is very common for a real-time export to run only for 'User Interface' and 'Web Store' changes.  These values both represent actual end users manually submitting changes to NetSuite (like a user editing and saving a customer record in the browser, or a shopper submitting an order via the web store), and these manual data changes are normally small and also important to propagate quickly to other applications (i.e. new web orders probably need to get sent to the shipping API asap).  Execution context values like 'CSV Import' are risky to enable because (1) you will slow down your mass update due to the overhead of sending data to an external system one record at a time, and (2) you may inadvertently flood your integration with way too many individual records that don't need to be synced right away (where a scheduled data flow would have been a better fit).",
  'export.netsuite.executionType':
    "This is a required field to specify the exact execution type values for which a record should be exported in real-time.  It is very common for a real-time export to include 'Create' to export brand new records when they are first submitted to NetSuite, and then also to include both 'Edit' and 'Inline Edit' to export records that have been changed.  Some of the other values available in this field are a bit more advanced, and please check the NetSuite help guides (or contact NetSuite support) for more info on what the different execution types mean. To provide at least one example for one of the more advanced options, you might want to enable a real-time export on the Sales Order record type in NetSuite, but you ONLY want the sales order to be exported when an approver clicks on the Approve button for the order (or via a mass approval action).   A possible usecase for this export would be to route a simple message into a Slack or HipChat type application to let someone (or a team of people) know via chat that an order has been approved.",
  'export.netsuite.sublists':
    'In order to keep the time it takes to save a record in NetSuite lightening fast, the default behavior for a real-time export is to ONLY include body level fields (like name, phone and email for a customer record).  If you do need to export sublist data (like the addresses for a customer,  or the line items in a sales order, or basically any data that is displayed in the NetSuite UI as a list) then you need to explicitly specify that here in this field.  Also, when including sublist data please keep in mind that each sublist typically requires an extra query to NetSuite to get the extra data, and while each individual query is relatively fast, if you are exporting lots of different sublists it can slow down the time it takes so save a record in NetSuite (i.e. when you click save for a record that has a real-time export deployed that also includes lots of different sublists it might take a little longer for the save to complete due to the extra queries).',
  'export.netsuite.qualifier':
    'Use this field to further refine which records you would like to export based on fields and their values (i.e. by looking at the record before it is exported and evaluating simple conditional expressions to decide if the record should be exported or discarded).  For example, if you are exporting customers you can use this field to only export customers that belong to a specific subsidiary, or if you are exporting sales orders you can use this field to only export sales orders that exceed a certain amount.  You can also perform more complex expressions using AND and OR.  For example, if you are exporting items you can use this field to only export items belonging to a specific vendor AND only items that are displayed in your web store.',
  'export.netsuite.forceReload':
    "When a record is saved in NetSuite there are certain fields that are not available until after the save completes, and the only way to export those fields in real-time is to reload the record again from the NetSuite database.  One example of this is the Line ID field on many of NetSuite's transaction record types (i.e. sales order, transfer order, etc...).  When a transaction record is first created, or when new line items are added to an existing transaction record, the Line ID values are not immediately available, and it is required to re-load the record again from the NetSuite database to export the Line ID values.  Please note that this extra load is relatively expensive too (for NetSuite) and will slow down the real-time export, so if you do not need one of these special fields then please avoid using this reload setting.  Unfortunately also, there is no master list of all the fields that require a reload (at least not presently), so trial and error might be needed if a field is not being exported as expected.",
  'export.netsuite.restlet.searchType':
    'NetSuite Saved Searches are an incredibly powerful and super easy way to define the exact data that you want to extract out of NetSuite.  By default, integrator.io can see all the public Saved Searches in your NetSuite account, and we display them all below so that you can quickly select the search data that you want to export.  If you want to export the data from a private Saved Search that works too, but please specify that here so that we know to prompt you for one extra field needed to access the private Saved Search (i.e. because we cannot by default see the private searches in your account we need you to tell us one more detail).  For private Saved Searches also, please make sure that the credentials associated with the connection record set above have access to the search results data in NetSuite.',
  'export.netsuite.restlet.searchInternalId':
    "To use a private NetSuite Saved Search please tell us the Internal Id of the Saved Search here (should be a numeric value) .  One way to obtain this value is to navigate to the Saved Search in the NetSuite UI and then in the browser URL you should see a numeric searchId field (i.e. searchid=123456 and then just use the numeric part 123456).  Another way to obtain this value is by editing the Saved Search and then in the 'ID' field there should be a numeric value that you can extract (i.e. customsearch123456 and then just use the numeric part 123456).  Please contact NetSuite support if you need more guidance finding your Saved Search Internal Ids.",
  'export.netsuite.hooks.preSend': '',
  'export.s3.bucket': 'The Amazon S3 folder path. For example, Mysite/Orders.',
  'export.salesforce.sObjectType':
    'Use this field to specify which Salesforce sObject type you want to export.  You can choose any standard sObject type (i.e. account, opportunity, contact) or any custom sObject type as long as the sObject type supports Salesforce triggers. Please note that this list of sObject types is also dependent on the permissions associated with the connection selected above. Also, if you add any new custom sObject types to your Salesforce account, or if there are any changes to the permissions associated with the connection selected above, you can use the refresh icon (next to this field) to regenerate the list.',
  'export.webhook.url':
    "If a URL has not already been generated, please use the 'Click To Generate' link below to generate a public URL for this webhook export, and then you will need to share this generated URL with the webhook provider through that provider's UI or API.  Saying this another way, each webhook provider (like GitHub, Shopify, etc...) will support a mechanism to configure the URL where you want the webhook data sent, and all you need to do to send data to integrator.io is provide them with this generated URL here.  Regarding security, please note that the data sent to this URL will always be secured via some sort of data verification (i.e. typically an HMAC or a token in the payload), along with SSL.",
  'export.hookType':
    "Please select 'Script' if you want to use the native integrator.io JavaScript runtime engine (where all your code is managed and executed by integrator.io), or choose 'Stack' if you prefer to host your code outside integrator.io (either on your own servers, or on AWS Lambda).",
  'export.skipRetries':
    'Select this checkbox if you do not want integrator.io to retry importing failed records.',
  'export.oneToMany':
    'There are advanced use cases where a parent record is being passed around in a flow, but you actually need to process child records contained within the parent record context. For example, if you are exporting Sales Order records out of NetSuite but you want to enhance each line item in the Sales Order with addition information stored in NetSuite (i.e. by running a dynamic search for each line item), then you will need to use this option.',
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
  'export.batchSize':
    "NetSuite's search APIs will by default return up to 1000 records every time you request a new page of results. This is problematic if you need to execute a SuiteScript based hook on the records before they are exported (in which case you will likely run out of SuiteScript points or hit NetSuite instruction count limits), or if the individual records you are exporting are very large such that the sum of all 1000 records exceeds 5 MB (which is also not allowed). For either situation, this field can easily be used to tell integrator.io to break down the default 1000 record batches into smaller batches where you define the ideal size.",
  'import._applicationId':
    "This field lists all applications and technology adaptors that integrator.io supports for exporting or importing the data. For less technical users, application adaptors, such as NetSuite or Salesforce are the easiest to use, whereas technology adaptors, such as the REST API adaptor requires a more technical understanding of the applications being integrated. However, once you learn how to use a specific technology adaptor, you will be able to integrate a multitude of different applications without having to wait for integrator.io to expose specific application adaptors.\nIf you are unable to find a matching application or a technology adaptor, the only other connectivity option is to use the integrator.io extension framework to develop a custom Wrapper. For more information on Wrappers and to learn more about integrator.io's developer extension framework, contact Celigo Support.",
  'import.overrideDataURITemplate':
    'For applications like NetSuite and Salesforce, integrator.io will by default try to generate links for any records that fail to import and then display those links in your job dashboard.  If you prefer to define your own custom links then please use this handlebars field to override the default functionality.  Please note that the template you provide will run against your data after it has been mapped, and then again after it has been submitted to the import application, to maximize the ability to link to the right place.  For example, if you are importing sales orders but instead want the errors to link to customers, you could use the following.  "https://system.na1.netsuite.com/app/common/entity/custjob?id={{{entity}}}"',
  'import.csvFile':
    'Please provide a sample file that this import would need to process.  We will use the sample file to auto set various fields (where possible), and also to help you map data in a subsequent step.  The sample file that you provide does not need to be overly large, but it should contain all the fields that you want to work with, and also be in the same format that the import will need to generate when running in a production capacity.',
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
  'import.file.compressFile':
    'Set this field to true if you would like to compress files before they are posted to the import application.',
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
    'Salesforce supports both SOAP and REST API types.  Salesforce actually supports a multitude of different API types, but SOAP and REST are the most relevant for importing data via integrator.io.  SOAP is recommended here because SOAP supports the ability to submit more than one record at a time (i.e. in a single API request).  Salesforce governs its API based on the total number of API requests per day, so it is important to batch up your data wherever possible; and with the REST API you are limited to only one record per API request.  The REST API can be a slightly better option when the data being imported is guaranteed to come in one record at a time, or if you are using the integrator.io API to invoke the import from your own application and you prefer the REST paradigm.',
  'import.rest.composite.type':
    "Choose 'Create New and Update Existing' to dynamically create vs update records in the import application based on their existence in that application already. Choose 'Create New Data and Ignore Existing Data' to only create new records, and this option will ignore records that exist already. Choose 'Update Existing Data and Ignore New Data' to only update existing records, and this option will ignore records that cannot be found.\"",
  'import.rest.composite.create.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/product' or '/bulkUpdate/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this import. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to pass extended information to an API endpoint.",
  'import.rest.composite.create.method':
    'Choose the HTTP method to use for requesting the endpoint. Most of the endpoints use POST method for creating new records. But some endpoints might be using PUT method for the same.',
  'import.rest.composite.create.body':
    'Click this button to specify Handlebar expression which will be evaluated and the result is used as Http Request body while importing.',
  'import.rest.composite.create.successPath':
    "There are some APIs out there (i.e. Slack) that will return a 200 HTTP status code even if an HTTP request fails. These APIs instead use a field in the HTTP response body to identify success vs fail. For these APIs, this option field 'Success Path' can be used to specify the JSON path for the field in the response body that should be used to determine if an HTTP request was successful. For example, if you are working with Slack's API you would set this field to: 'ok'.",
  'import.rest.composite.create.successValues':
    'This field indicates the value(s) that represents the success of an HTTP response. For example, 0 or 0,2,3 . This field is used in unison with the Success Path field. The value found in the HTTP response at the path specified in Success Path is compared against the provided list of success values. If there is an exact case-sensitive match of any of the specified values, the request is considered successful.',
  'import.rest.composite.create.responseIdPath':
    'This field is used to help integrator.io find the identifer (id) of the resource returned in the HTTP response. Use the complete path of the resource id within the response. If this field is left blank, integrator.io will try to find a property named id or _id anywhere in the response body.',
  'import.rest.composite.update.relativeURI':
    "The typical value of this field is the resource path portion of an API endpoint. Some examples are: '/product' or '/bulkUpdate/orders'. This relativeURI value is combined with the baseURI defined in the connection resource associated with this import. The baseURI and relativeURI together complete a fully qualified url that describes an API endpoint. Note that occasionally query string parameters can be used to pass extended information to an API endpoint.",
  'import.rest.composite.update.method':
    'Choose the HTTP method to use for requesting the endpoint. Most of the endpoints use PUT method for updating existing records. But some endpoints might be using POST method for the same.',
  'import.rest.composite.update.body':
    'Click this button to specify Handlebar expression which will be evaluated and the result is used as Http Request body while importing.',
  'import.rest.composite.update.successPath':
    "There are some APIs out there (i.e. Slack) that will return a 200 HTTP status code even if an HTTP request fails. These APIs instead use a field in the HTTP response body to identify success vs fail. For these APIs, this option field 'Success Path' can be used to specify the JSON path for the field in the response body that should be used to determine if an HTTP request was successful. For example, if you are working with Slack's API you would set this field to: 'ok'.",
  'import.rest.composite.update.successValues':
    'This field indicates the value(s) that represents the success of an HTTP response. For example, 0 or 0,2,3 . This field is used in unison with the Success Path field. The value found in the HTTP response at the path specified in Success Path is compared against the provided list of success values. If there is an exact case-sensitive match of any of the specified values, the request is considered successful.',
  'import.rest.composite.update.responseIdPath':
    'This field is used to help integrator.io find the identifer (id) of the resource returned in the HTTP response. Use the complete path of the resource id within the response. If this field is left blank, integrator.io will try to find a property named id or _id anywhere in the response body.',
  'import.rest.composite.ignore.resourceId':
    'This field is used to inform integrator.io on how to identify existing records, and if a record is found to exist, it will be ignored (no operation performed for this record). integrator.io will determine if a record exists by the presence of a specific record property. Typically this would be a field that is only present on existing records such as an "ID", or "createDate". If this is the case, simply provide the field path to this property. Example: "customerId" or "dateCreated".Alternatively, identify existing records by using the result of a lookup. If the lookup returned a value, then this would be an indication that the record exists. An example of this would be a lookup that maps an email from the export record to an ID from the destination App. If this is how you wish to identify an existing lookup, first define the lookup and then simply enter the lookup\'s name in this field.',
  'import.rest.lookups.failFields':
    '<b>Fail Record:</b> If no results are found or the dynamic lookup fails, the lookup will silently fail (return empty string). Similarly, if multiple results are found  (dynamic lookup) then the first value is chosen. In other words, if allowFailures is set to true, then no errors will be raised and the default lookup value will be used if the lookup fails. \n\n<b>Use Empty String as Default Value:</b> Please select this field if you want to use ‘’(i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Null as Default Value:</b> Please select this field if you want to use ‘null’ as the default lookup value. This value will be used if your lookup does not find anything. \n\n<b>Use Custom Default Value:</b> This holds the default value to be set for the extract field.',
  'import.rest.lookups.useNull':
    "Please check this field if you want to use 'null' as the default lookup value. This value will be used if your lookup does not find anything.",
  'import.rest.lookups.useEmptyString':
    "Please check this field if you want to use '' (i.e. the empty string) as the default lookup value. This value will be used if your lookup does not find anything.",
  'import.hooks.preMap.scriptFunction':
    'The name of the preMap hook function (in your script) that you want to invoke.',
  'import.hooks.postMap.scriptFunction':
    'The name of the postMap hook function (in your script) that you want to invoke.',
  'import.hooks.postSubmit.scriptFunction':
    'The name of the postSubmit hook function (in your script) that you want to invoke.',
  'import.hooks.postAggregate.scriptFunction':
    'The name of the postAggregate hook function (in your script) that you want to invoke.',
  'import.restImportFieldMappingSettings':
    'The type of field mapping that you want to perform. For more information refer to, the <a href="https://celigosuccess.zendesk.com/hc/en-us/sections/205928707-Field-Mapping-options-in-integrator-io" target="_blank"/> Field Reference Guide.</a>',
  'import.netsuiteImportFieldMappingSettings':
    'The type of field mapping that you want to perform. For more information refer to, the <a href="https://celigosuccess.zendesk.com/hc/en-us/sections/205928707-Field-Mapping-options-in-integrator-io" target="_blank"/> Field Reference Guide.</a>',
  'import.etailImportFieldMappingSettings':
    'The type of field mapping that you want to perform. For more information refer to, the <a href="https://celigosuccess.zendesk.com/hc/en-us/sections/205928707-Field-Mapping-options-in-integrator-io" target="_blank"/> Field Reference Guide.</a>',
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
  'import.rdbms.lookups.name':
    'Name of the lookups that will be exposed to the mapping to refer.',
  'import.mongodb.lookupType':
    'There are two ways to identify existing records. Either by testing for the existence of a field value on the export record (such as id), or by performing a lookup against the destination application. Choose the option, "Records have a specific field populated" if you can identify existing records by examining the content of your export records. If on the other hand a lookup is necessary, select the "Run a dynamic search against MongoDB" option. After making this selection, other fields will become available to describe how to define your lookup.',
  'import.oneToMany':
    "There are advanced use cases where a parent record is being passed around in a flow, but you actually need to process child records contained within the parent record context. For example, if you're exporting Sales Order records out of NetSuite and importing them into Salesforce as Opportunity and Opportunity Line Item records, then you will need to import the Opportunity Line Item records using this option.",
  'import.pathToMany':
    "If the parent record is represented by a JSON object then this field should be used to specify the JSON path of the child records. If the parent record is represented by a JSON array (where each entry in the array is a child record) then this field does not need to be set. If you are unsure how parent records are being represented in your flow then please view the 'Sample Data' field for the 'Export' resource that is generating the data. Following are two examples also to hopefully help clarify how data can be represented differently depending on the export context. Example 1: If you are exporting Sales Orders out of NetSuite in real-time then NetSuite sends integrator.io a JSON object for each Sales Order, and if you want to process the line items in that Sales Order then you need to specify the JSON path for the line items field. There is no way to tell NetSuite to send an array for real-time data. Example 2: But, if you are exporting Sales Orders out of NetSuite via a scheduled flow then in this case NetSuite represents each order via an array where each entry in the array represents a line item in the order. There is no way to tell NetSuite to give you an object for batch data.",
  'import.restImportFieldMappingLookupType':
    'Use a dynamic search if you need to lookup data directly in the import application, e.g. if you have an email address in your export data and you want to run a search on the fly to find a system id value in the import application. Use a static value to value mapping when you know in advance all the possible values and how they should be translated. For example, if you are mapping a handful of shipping methods between two applications you can define them here.',
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
    'This drop-down has all the available helper methods that let you transform your field values. Once you make a selection, the function and placeholder values will be added to the expression text box below. You can then make any necessary changes by editing the complete expression.For a complete list and extended help of all helper methods, please see this article: <a target="blank" href="https://celigosuccess.zendesk.com/hc/en-us/articles/115004695128-Handlebar-Helpers-Reference-Guide">Handlebar Helper Guide</a>',
  'import.field':
    'This dropdown lists all the available fields from your export record that can be used in your expression. Either by themselves, or as argument value for any selected helper methods.',
  'import.expression':
    'This field represents your complete handlebar expression. You have the freedom to manually enter an expression, or use the function and field drop-downs above to help construct it.',
  'jobErrors.helpSummary':
    "This page allows you to manage all the errors associated with a specific integration job. In general, the best practice for fixing errors is always to understand the root cause for each error, and then to fix the root problem so that the same type error does not repeat again. For example, if you get an error that a record was rejected because a required field was missing then you should first try to make the same field required in all the applications being integrated, or if this is not possible then you should enhance your field mapping for that field so that a default value is auto set when a value is missing.\n\nThe 'Retry' button can be used to process one or more records again. For example, if several records were rejected because an application was experiencing network issues, then you can click 'Retry All' to quickly rerun all the records again.\n\nThe 'Mark Resolved' button can be used to clear one or more errors when there is no need to reprocess the records again. For example, if a record was rejected because it already exists in the import application then there is no need to submit it again.\n\nIf your integration job contains more than 1000 errors then you need to click the 'Download All Errors' button to view and manage the errors in a CSV file. The CSV error file that you download will have specific columns to retry errors, or to mark them as resolved. After you process all the errors in the CSV error file, then you need to click the 'Upload Processed Errors' button to submit the processed file. The result of submitting the CSV error file is exactly the same as processing errors directly on the dialog when the number of errors is less than 1000. VERY IMPORTANT THOUGH, if you are uploading a processed error file, the uploaded file will completely replace the error file currently associated with the job, and if you remove entries from the CSV error file then they will also be removed from the job. Saying this another way, even if you are only fixing a couple of errors it is very important that you always submit the entire file to avoid losing any error data.\n\nThe 'Source' column indicates the source of the error. For example, if the Salesforce API rejects your data due to an invalid phone field, then the 'Source' of that error would be 'salesforce'. Another example, if you are doing a dynamic lookup in one of your Salesforce field mappings, but the record being looked up cannot be found by integrator.io, then that error would have source 'adaptor'.\n\nThe 'Code' column indicates the code of the error. For example, if you are submitting data to a REST API you might see the value 422, which is the generic HTTP response code indicating that there was an error in the data. Another example, if you are submitting data to NetSuite you might see 'invalid_fld_value', which is NetSuite's generic code that you sent invalid data for a specific field.\n\nThe 'Message' column represents the full error message. Please note that many APIs do not have great error messages, and the values reported in this column can be difficult to process.\n\nThe 'Retry Data' column will have an edit icon displayed when there is retry data associated with the error. You can use this icon to quickly fix and resubmit failed data. For example, you might have a web order that is stuck processing because it contains an invalid phone number, and you can use this edit icon to fix the phone field immediately (or remove it) to get your order processed asap.",
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
    'Select Cloud if you are connecting to an application on the cloud and is publicly accessible. For example, Salesforce, NetSuite. Select On-Premise if you are connecting to a server that is publicly inaccessible and has integrator.io Agent installed on it. For example, Production AWS VPC, MySQL server.',
  'connection.rest.authType':
    "integrator.io supports the following authentication types:\n\n<b>Basic:</b> Select Basic if your service implements the HTTP basic authentication strategy. This authentication method adds a Base64 encoded username and password values in the 'authentication' HTTP request header.\n\n<b>Cookie</b>: Select Cookie if your service relies on session-based authentication. Session based authentication is typically implemented by including a unique cookie into the HTTP request header. By selecting this option, the platform will automatically create and insert this cookie into every HTTP request it sends to your application. \n\n<b>Custom:</b> Select Custom for all other types. If you select the Custom authentication method, integrator.io will not perform any special authentication. It is up to the user to configure the HTTP request fields (method, relativeUri, headers, and body) of the import and export models to include {{placeholders}} for any authentication related values. These values can be stored in Encrypted and Unencrypted fields of this connection.\n\n<b>Token:</b>  Select Token if your service relies on token-based authentication. The token may exist in the header, URL, or body of the HTTP request. This method also supports refreshing tokens if the service being called supports it.\n\n<b>OAuth 2.0:</b> Select this value if your application supports the OAuth 2.0 authentication.",
  // TODO:"Duplicated token"
  // 'connection.rest.bearerToken': "The 3dcart merchant's token.",
  'connection.rest.pingMethod':
    'The HTTP method (GET/PUT/POST/HEAD) to use when making the ping request.',
  'connection.rest.pingBody':
    'This field is typically used in for HTTP requests not using the GET method. The value of this field becomes the HTTP body that is sent to the API endpoint. The format of the body is dependent on the API being used. It could be URLl-encoded, JSON, or XML data. In either case, the metadata contained in this body will provide the API with the information needed to fulfill your ping request. Note that this field can contain {{{placeholders}}} that are populated from a model comprising of a connection and an export object. For example, if the export request body requires an authentication token to be embedded, you can use the placeholder {{connection.http.auth.token.token}}.',
  'connection.rest.threedcartSecureUrl': "3dcart merchant's Secure URL.",
  'connection.rest.encrypted':
    "Use this JSON field to store all the security sensitive fields needed by your imports and exportsto access the application being integrated. For example: {'password': 'ayTb53Img!do'} or {'token': 'x7ygd4njlwerf63nhg'}. Please note that in addition to AES 256 encryption there are multiple layers of protection in place to keep your data safe.",
  'connection.rest.unencrypted':
    "Use this JSON field to store all the security insensitive fields needed by your imports and exports to access the application being integrated. For example: {'email':'my_email@company.com', 'accountId': '5765432', 'role': 'admin'}",
  'connection.rest.storeName':
    "Go to your Shopify store and you can find out the store name in the browser URL. For example - if your Shopify store URL is 'https://demo-store.myshopify.com/', then provide 'demo-store' as the store name.",
  'connection.rest.applicationType':
    "These are the OAuth 2.0 providers currently supported by integrator.io. Please contact support if you need an application that is not currently listed here, and it is also worth checking with the application provider to see if they have any other forms of API authentication available. For example, Shopify supports both OAuth 2.0 and Basic Auth (i.e. username and password). Keep in mind too that once a new OAuth 2.0 provider is supported by integrator.io you will likely be able to choose that application directly in the 'Connection Type' field (vs connecting at the technology level via HTTP or REST).",
  'connection.salesforce.sandbox':
    'Select Production or Sandbox from this field. You can then click on Save & Authorize that opens a Salesforce window where you can enter your Salesforce account credentials to connect to Salesforce.',
  'connection.salesforce.oauth2FlowType':
    "The Force.com platform implements the OAuth 2.0 Authorization Framework, so users can authorize applications to access Force.com resources on their behalf without revealing their passwords or other credentials to those applications. You can select one of the following authorization flows for authentication. \n \n <b>Refresh Token Flow:</b> This flow tends to be used for web applications where server-side code needs to interact with Force.com APIs on the user's behalf. \n \n <b>JWT Bearer Token Flow:</b> The main use case of the JWT Bearer Token Flow is server-to-server API integration. This flow uses a certificate to sign the JWT request and doesn’t require explicit user interaction.",
  'connection.salesforce.username':
    "Enter the username for your Salesforce Account for 'JWT Bearer Token' authentication.",
  'connection.amazonmws.authToken': 'The MWS authorization token.',
  'connection.amazonmws.marketplaceId':
    "Please specify the Amazon MWS 'MarketplaceId' for this connection. This value is required for specific Amzaon MWS requests to succeed. Please note that you must be registered to sell in the Amazon MWS 'MarketplaceId' selected, else your Amazon MWS calls will fail.",
  'connection.threedcart.rest.bearerToken': "The 3dcart merchant's token.",
  'connection.threedcart.rest.threedcartSecureUrl':
    "3dcart merchant's Secure URL.",
  'connection.threedcart.rest.encrypted.PrivateKey':
    "Your application's private key.",
  'connection.shopify.rest.storeName':
    "Go to your Shopify store and you can find out the store name in the browser URL. For example - if your Shopify store URL is 'https://demo-store.myshopify.com/', then provide 'demo-store' as the store name.",
  'connection.shopify.rest.basicAuth.username':
    "Login to your Shopify store and navigate to 'Apps' section. Click on the respective private app and the API key can be found next to the 'Authentication' section.",
  'connection.shopify.rest.basicAuth.password':
    "Login to your Shopify store and navigate to 'Apps' section. Click on the respective private app and the password can be found next to the 'Authentication' section.",
  'connection.netsuite.authType':
    "Please choose 'Basic' to use your NetSuite email and password for this connection, or choose 'Token' to use NetSuite's new token based authentication. Token based auth is slightly more complicated to enable, but it is much more secure than email and password, and your tokens will never expire. It is also common for users to start out with basic auth and then switch to token based auth when an integration is ready for production.  You can switch back and forth between basic and token based auth at any time. Please contact NetSuite support if you need help creating Access Tokens inside NetSuite.",
  'connection.netsuite.linkSuiteScriptIntegrator':
    "Prior to integrator.io, NetSuite integrations built by Celigo ran directly inside your NetSuite account via a managed bundle. If you are still running any of these older integrations this field must be used to link integrator.io to your NetSuite account. Celigo's older UI that ran directly inside NetSuite has been deprecated, and users are required to use integrator.io going forward to manage and monitor all integrations.",
  'connection.configureApiRateLimits':
    'By default the HTTP adaptor will treat all HTTP responses with status code 429 as being rate-limited and then look for a “retry-after” header to determine when our platform can retry the request. If the service you are connecting to respects these HTTP specifications, then you do not need any additional configuration. If however your service implements a custom rate-limit response structure, use these options to tell our platform how to identify and respond to a rate-limited response.',
  'connection.http.auth.oauth.applicationType':
    "These are the OAuth 2.0 providers currently supported by integrator.io. Please contact support if you need an application that is not currently listed here, and it is also worth checking with the application provider to see if they have any other forms of API authentication available. For example, Shopify supports both OAuth 2.0 and Basic Auth (i.e. username and password). Keep in mind too that once a new OAuth 2.0 provider is supported by integrator.io you will likely be able to choose that application directly in the 'Connection Type' field (vs connecting at the technology level via HTTP or REST).",
  'connection.http._iClientId':
    'iClient lets you configure your developer access and secret keys for your marketplace region.',
  'connection.marketplaceRegion':
    'Please specify the Amazon MWS Region for this connection. Please note that you must be registered to sell in the Amazon MWS Region selected, else your Amazon MWS calls will fail.',
  'connection.rdbms.useSSL':
    'Please check this field if you want to establish a secure connection to the database. This ensures that data in transit is encrypted.',
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
  'notifications.jobErrors':
    "Please choose 'All Flows' to receive an email notification whenever any flow in this integration has a job error, or select individual flows to focus your email traffic to just higher priority data flows.",
  'notifications.connections':
    'Please select which connections you would like to be notified about when they go offline (and subsequently back online).  Please note that connections can be shared across integrations, and if you choose to be notified here, this notification setting will be reflected everywhere else this connection is being used.',
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
    "This field lets you control the first execution time of your flow (i.e. your integration flow will not run before this time), and then subsequent execution times are determined by the 'Frequency' and 'End Time' values set.",
  'flow.endTime':
    'This field lets you control the last scheduled execution of your flow (i.e. your integration flow will not be scheduled after this time).',
  'flow.daysToRunOn':
    'This field lets you configure the specific day(s) you would like this integration flow to run on.',
  'flow.type':
    "Please select 'Use Presets' if you would like to use one of the more popular frequency options, and then the UI will guide you through the setup for each. If you need something more custom then please select 'Use Cron Expression', and then the UI will display a simple cron builder to help you define a custom frequency.",
  'asynchelper.rules':
    'This field is optional. You can use it when the response is other JSON. For example, if your target application is Amazon, the response data received will be in XML format that you can convert to JSON using Transform Rules for Submit Response. For more information, refer to <a href="https://celigosuccess.zendesk.com/hc/en-us/articles/115002669511-Transformation-Rules-Guide">Transform Rules Guide</a>',
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
  'accesstoken.scope':
    'Scope is used to define access permissions for your token.\n\n<ul><li><b>Full Access</b> - Full access tokens have unlimited permissions to your integrator.io account. Please be very careful provisioning full access tokens!</li>\n\n<li><b>Custom</b> - Custom scope tokens can be created with only minimal permissions to specific resources in your integrator.io account, and they can only be used to invoke very specific integrator.io APIs (i.e. only the APIs required to import or export data from external applications).</li></ul>',
  'accesstoken.name':
    'Name your token so that you can easily reference it from other parts of the application',
  'accesstoken._connectionIds':
    'Select the Connections that this token should provide access to.',
  'accesstoken._exportIds':
    'Select the Exports that this token should provide access to.',
  'accesstoken._importIds':
    'Select the Imports that this token should provide access to.',
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
    'Define schedule to run export which overrides the flow schedule',
  'fb.pp.exports.transform':
    'Define a ‘transformation’ here to rename fields, remove fields, and/or structurally optimize records returned by the lookup before the records are merged back into the source record.',
  'fb.pp.exports.filter':
    'Define an ‘output filter’ here to specify which records returned by the lookup should get merged back into the source record. i.e. Records that evaluate to true are merged. Records that evaluate to false are discarded.',
  'fb.pp.exports.hooks':
    'Define a ‘hook’ here to use custom code to process records returned by the lookup before the records are merged back into the source record.',
  'fb.pp.exports.responseMapping':
    'Define a ‘results mapping’ here to specify where the data returned by the lookup should be merged back into the source record.',
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
    'Define a ‘response mapping’ here to specify where the response data returned by the import should be merged back into the source record.',
  'fb.pp.imports.proceedOnFailure':
    'If the import fails for a specific record then what should happen to that record?  Should the failed record pause here until someone can analyze and fix the error (i.e. the default behavior), or should the failed record proceed to the next application in the flow regardless?',
  'fb.pp.imports.inputFilter':
    'Define an ‘input filter’ here to specify which source records should get processed by the import. i.e. Records that evaluate to true are processed. Records that evaluate to false are ignored (but still passed along to downstream applications in the flow).',
  'fb.pp.imports.templateMapping': ' Define a Template Mapping for import ',
  // #region UI help text
};
