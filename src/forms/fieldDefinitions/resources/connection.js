import { URI_VALIDATION_PATTERN, RDBMS_TYPES } from "../../../utils/constants";
import {
  isNewId,
  getDomainUrl,
  getAssistantFromResource,
  rdbmsSubTypeToAppType,
  rdbmsAppTypeToSubType,
} from "../../../utils/resource";
import { applicationsList } from "../../../constants/applications";
import { getConstantContactVersion } from "../../../utils/connections";

export default {
  // #region common
  // TODO: develop code for this two components
  // agent list handleBars evaluated its a dynamicList
  _borrowConcurrencyFromConnectionId: {
    isLoggable: true,
    resourceType: "connections",
    filter: (r) => {
      const expression = [{ _id: { $ne: r._id } }];

      if (RDBMS_TYPES.includes(rdbmsSubTypeToAppType(r.type))) {
        // rdbms subtype is required to filter the connections
        expression.push({ "rdbms.type": rdbmsAppTypeToSubType(r.type) });
      } else {
        // Should not borrow concurrency for ['ftp', 'as2', 's3']
        const destinationType = ["ftp", "as2", "s3"].includes(r.type)
          ? ""
          : r.type;

        if (r?.http?.formType === "rest" || r.type === "rest") {
          expression.push({
            $or: [{ "http.formType": "rest" }, { type: "rest" }],
          });
        } else {
          expression.push({ type: destinationType });
        }
        if (r.assistant) {
          expression.push({ assistant: r.assistant });
        }

        if (r.type === "netsuite") {
          expression.push({
            "netsuite.account": r?.netsuite?.account,
            "netsuite.environment": r?.netsuite?.environment,
          });
        }
      }

      return {
        $and: expression,
      };
    },
    type: "selectresource",
    label: "Borrow concurrency from",
  },
  _agentId: {
    isLoggable: true,
    type: "selectresource",
    label: "Agent",
    resourceType: "agents",
  },
  uploadFile: {
    type: "uploadfile",
    label: "Sample file (that would be exported)",
    resourceType: "connections",
  },
  scope: {
    isLoggable: true,
    type: "selectscopes",
    label: "Configure scopes",
  },
  name: {
    isLoggable: true,
    type: "text",
    label: "Name",
    defaultDisabled: (r) => !!r._connectorId && !isNewId(r._id),
    required: true,
  },
  application: {
    isLoggable: true,
    id: "application",
    type: "text",
    label: "Application",
    defaultValue: (r) => {
      const isNew = isNewId(r._id);

      if (isNew && r.application) {
        return r.application;
      }
      const applications = applicationsList();
      let application =
        getAssistantFromResource(r) ||
        (r.type === "rdbms" ? rdbmsSubTypeToAppType(r.rdbms.type) : r.type);

      if (r.type === "http" && r.http?.formType === "rest") {
        application = "rest";
      }
      if (r.type === "http" && r.http?.formType === "graph_ql") {
        application = "graph_ql";
      }
      const app = applications.find((a) => a.id === application) || {};

      return app.name;
    },
    defaultDisabled: true,
  },
  // #endregion common
  // #region rdbms
  "rdbms.host": {
    isLoggable: true,
    type: "text",
    label: "Host",
    required: true,
  },
  "rdbms.port": {
    isLoggable: true,
    type: "text",
    label: "Port",
    validWhen: [
      {
        fallsWithinNumericalRange: {
          min: 0,
          max: 65535,
          message: "The value must be more than 0 and less than 65535",
        },
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "rdbms.database": {
    isLoggable: true,
    type: "text",
    label: "Database name",
    required: true,
  },
  "rdbms.instanceName": {
    isLoggable: true,
    type: "text",
    label: "Instance name",
    visibleWhen: [{ field: "type", is: ["mssql"] }],
  },
  "rdbms.user": {
    type: "text",
    label: "Username",
    required: true,
  },
  "rdbms.password": {
    type: "text",
    label: "Password",
    required: true,
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "rdbms.ssl.ca": {
    type: "editor",
    mode: "text",
    label: "Certificate authority",
  },
  "rdbms.ssl.key": {
    type: "editor",
    mode: "text",
    label: "Key",
  },
  "rdbms.ssl.passphrase": {
    type: "text",
    label: "Passphrase",
  },
  "rdbms.ssl.cert": {
    type: "editor",
    mode: "text",
    label: "Certificate",
  },
  "rdbms.version": {
    isLoggable: true,
    type: "select",
    label: "SQL server version",
    required: true,
    visibleWhen: [{ field: "type", is: ["mssql"] }],
    options: [
      {
        items: [
          {
            label: "SQL Server 2008 R2 (Not supported by Microsoft)",
            value: "SQL Server 2008 R2",
          },
          { label: "SQL Server 2012", value: "SQL Server 2012" },
          { label: "SQL Server 2014", value: "SQL Server 2014" },
          { label: "SQL Server 2016", value: "SQL Server 2016" },
          { label: "SQL Server 2017", value: "SQL Server 2017" },
          { label: "Azure", value: "Azure" },
        ],
      },
    ],
  },
  "rdbms.options": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Configure properties",
  },
  "rdbms.concurrencyLevel": {
    isLoggable: true,
    label: "Concurrency level",
    type: "select",
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "_borrowConcurrencyFromConnectionId",
        is: [""],
      },
    ],
  },
  "rdbms.bigquery.projectId": {
    fieldId: "rdbms.bigquery.projectId",
    label: "Project",
    type: "text",
    required: true,
  },
  "rdbms.bigquery.clientEmail": {
    fieldId: "rdbms.bigquery.clientEmail",
    label: "Client email",
    type: "text",
    required: true,
  },
  "rdbms.bigquery.privateKey": {
    fieldId: "rdbms.bigquery.privateKey",
    label: "Private key",
    multiline: true,
    type: "text",
    required: true,
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "rdbms.bigquery.dataset": {
    fieldId: "rdbms.bigquery.dataset",
    label: "Dataset",
    type: "text",
    required: true,
  },
  // #endregion rdbms
  // #region rest
  "rest.mediaType": {
    isLoggable: true,
    type: "select",
    label: "Media type",
    helpKey: "connection.http.mediaType",
    options: [
      {
        items: [
          { label: "JSON", value: "json" },
          { label: "URL encoded", value: "urlencoded" },
          { label: "CSV", value: "csv" },
        ],
      },
    ],
    defaultValue: (r) =>
      r && r.rest && r.rest.mediaType ? r.rest.mediaType : "json",
  },
  "rest.baseURI": {
    isLoggable: true,
    type: "text",
    label: "Base URI",
    required: true,
    helpKey: "connection.http.baseURI",
  },
  "rest.bearerToken": {
    type: "text",
    label: "Token",
    inputType: "password",
    helpKey: "connection.http.auth.token.token",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "rest.tokenLocation": {
    isLoggable: true,
    type: "select",
    label: "Send token via",
    helpKey: "connection.http.auth.token.location",
    options: [
      {
        items: [
          { label: "HTTP header", value: "header" },
          { label: "URL parameter", value: "url" },
        ],
      },
    ],
  },

  "rest.scope": {
    type: "selectscopes",
    label: "Configure scopes",
    helpKey: "connection.http.auth.oauth.scope",
  },

  "rest.authType": {
    isLoggable: true,
    type: "select",
    label: "Auth type",
    helpKey: "connection.http.auth.type",
    options: [
      {
        items: [
          { label: "Basic", value: "basic" },
          { label: "Token", value: "token" },
          { label: "Custom", value: "custom" },
          { label: "Cookie", value: "cookie" },
        ],
      },
    ],
  },

  "rest.authScheme": {
    isLoggable: true,
    type: "select",
    label: "Header scheme",
    helpKey: "connection.http.auth.token.scheme",
    skipDefault: true,
    defaultValue: (r) => r?.rest?.authScheme || " ",
    options: [
      {
        items: [
          { label: "MAC", value: "MAC" },
          { label: "OAuth 2.0", value: "OAuth" },
          { label: "Bearer", value: "Bearer" },
          // { label: 'Hmac', value: 'Hmac' },
          { label: "None", value: " " },
        ],
      },
    ],
  },
  "rest.basicAuth.username": {
    type: "text",
    label: "Username",
    required: true,
    helpKey: "connection.http.auth.basic.username",
  },
  "rest.basicAuth.password": {
    type: "text",
    label: "Password",
    inputType: "password",
    helpKey: "connection.http.auth.basic.password",
    description:
      "Note: for security reasons this field must always be re-entered.",
    required: true,
    defaultValue: "",
  },

  "rest.headers": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Configure HTTP headers",
    helpKey: "connection.http.headers",
  },
  "rest.encrypted": {
    type: "editor",
    label: "Encrypted",
    mode: "json",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "rest.unencrypted": {
    isLoggable: true,
    type: "editor",
    label: "Unencrypted",
    mode: "json",
  },
  "rest.refreshTokenMethod": {
    isLoggable: true,
    type: "select",
    label: "HTTP method",
    helpKey: "connection.http.auth.token.refreshMethod",
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
        ],
      },
    ],
  },
  "rest.refreshTokenBody": {
    type: "httprequestbody",
    label: "HTTP request body",
    helpKey: "connection.http.auth.token.refreshBody",
  },
  "rest.refreshTokenMediaType": {
    isLoggable: true,
    type: "select",
    label: "Override media type",
    placeholder: "Do not override",
    helpKey: "connection.http.auth.token.refreshMediaType",
    defaultValue: (r) =>
      (r && r.rest && r.rest.refreshTokenMediaType) || "json",
    options: [
      {
        items: [
          { label: "JSON", value: "json" },
          { label: "URL encoded", value: "urlencoded" },
        ],
      },
    ],
  },

  "rest.pingMethod": {
    isLoggable: true,
    type: "select",
    label: "HTTP method",
    helpKey: "connection.http.ping.method",
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
        ],
      },
    ],
  },
  // #endregion rest
  // #region http
  "http.auth.type": {
    isLoggable: true,
    type: "select",
    label: "Auth type",
    required: true,
    options: [
      {
        items: [
          { label: "Basic", value: "basic" },
          { label: "Token", value: "token" },
          { label: "OAuth 2.0", value: "oauth" },
          { label: "Custom", value: "custom" },
          { label: "Cookie", value: "cookie" },
          { label: "Digest", value: "digest" },
          { label: "WSSE", value: "wsse" },
        ],
      },
    ],
  },
  "http.mediaType": {
    isLoggable: true,
    type: "select",
    label: "Media type",
    required: true,
    defaultValue: (r) => (r && r.http && r.http.mediaType) || "json",
    options: [
      {
        items: [
          { label: "XML", value: "xml" },
          { label: "JSON", value: "json" },
          { label: "URL encoded", value: "urlencoded" },
          { label: "Multipart / form-data", value: "form-data" },
        ],
      },
    ],
  },
  "http.successMediaType": {
    isLoggable: true,
    type: "selectoverridemediatype",
    label: "Override media type for success responses",
    placeholder: "Do not override",
    options: [
      { label: "XML", value: "xml" },
      { label: "JSON", value: "json" },
      { label: "CSV", value: "csv" },
    ],
    dependentFieldForMediaType: "/http/mediaType",
  },
  "http.errorMediaType": {
    isLoggable: true,
    type: "selectoverridemediatype",
    label: "Override media type for error responses",
    placeholder: "Do not override",
    options: [
      { label: "XML", value: "xml" },
      { label: "JSON", value: "json" },
    ],
    dependentFieldForMediaType: "/http/mediaType",
  },
  configureApiRateLimits: {
    isLoggable: true,
    label: "Configure api rate limits",
    type: "checkbox",
    defaultValue: (r) =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.limit,
  },
  "http.baseURI": {
    isLoggable: true,
    type: "text",
    label: "Base URI",
    required: true,
  },
  "http.disableStrictSSL": {
    isLoggable: true,
    type: "checkbox",
    label: "Disable strict SSL",
  },
  "rdbms.disableStrictSSL": {
    isLoggable: true,
    type: "checkbox",
    label: "Disable strict SSL",
  },
  "http.concurrencyLevel": {
    isLoggable: true,
    label: "Concurrency level",
    type: "select",
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "_borrowConcurrencyFromConnectionId",
        is: [""],
      },
    ],
  },
  "http.retryHeader": {
    type: "text",
    label: "Override retry-after HTTP response header name",
  },
  "http.ping.relativeURI": {
    isLoggable: true,
    type: "relativeuri",
    showLookup: false,
    showExtract: false,
    label: "Relative URI",
  },
  "http.ping.method": {
    isLoggable: true,
    type: "select",
    label: "HTTP method",
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
        ],
      },
    ],
  },
  "http.ping.body": {
    isLoggable: true,
    type: "httprequestbody",
    label: "HTTP request body",
  },
  "http.ping.successPath": {
    isLoggable: true,
    type: "text",
    label: "Path to success field in HTTP response body",
  },
  "http.ping.successValues": {
    isLoggable: true,
    type: "text",
    label: "Success values",
    delimiter: ",",
  },
  "http.ping.failPath": {
    isLoggable: true,
    type: "text",
    label: "Path to error field in HTTP response body",
    visibleWhen: [
      {
        field: "outputMode",
        is: ["records"],
      },
    ],
  },
  "http.ping.failValues": {
    isLoggable: true,
    type: "text",
    delimiter: ",",
    label: "Error values",
    visibleWhen: [
      {
        field: "outputMode",
        is: ["records"],
      },
    ],
  },
  "http.ping.errorPath": {
    isLoggable: true,
    type: "text",
    label: "Path to detailed error message field in HTTP response body",
  },
  "http.auth.failStatusCode": {
    isLoggable: true,
    type: "text",
    label: "Override HTTP status code for auth errors",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "http.auth.failPath": {
    isLoggable: true,
    type: "text",
    label: "Path to auth error field in HTTP response body",
  },
  "http.auth.failValues": {
    isLoggable: true,
    type: "text",
    delimiter: ",",
    label: "Auth error values",
  },
  "http.auth.basic.username": {
    type: "text",
    label: "Username",
    required: true,
  },
  "http.auth.basic.password": {
    type: "text",
    label: "Password",
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    required: true,
  },
  "http.auth.oauth.tokenURI": {
    type: "text",
    label: "Access token URL",
  },
  "http.auth.oauth.scope": {
    type: "selectscopes",
    label: "Configure scopes",
  },
  "http.auth.oauth.scopeDelimiter": {
    isLoggable: true,
    type: "text",
    label: "Override default scope delimiter",
  },
  "http.auth.oauth.accessTokenPath": {
    isLoggable: true,
    type: "text",
    label: "Http auth oauth access token path",
  },
  "http.auth.oauth.authURI": {
    type: "text",
    label: "Authorization URL",
  },
  "http.auth.oauth.clientCredentialsLocation": {
    isLoggable: true,
    type: "select",
    label: "Send client credentials via",
    defaultValue: (r) =>
      (r &&
        r.http &&
        r.http.auth &&
        r.http.auth.oauth &&
        r.http.auth.oauth.clientCredentialsLocation) ||
      "body",
    options: [
      {
        items: [
          { label: "Basic auth header", value: "basicauthheader" },
          { label: "HTTP body", value: "body" },
        ],
      },
    ],
  },
  "http.auth.oauth.accessTokenHeaders": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Override access token HTTP headers",
  },
  "http.auth.oauth.accessTokenBody": {
    type: "httprequestbody",
    contentType: "json",
    label: "Override access token HTTP request body",
  },
  "http._iClientId": {
    isLoggable: true,
    label: "IClient",
    type: "selectresource",
    resourceType: "iClients",
    allowNew: true,
    allowEdit: true,
  },
  "http.auth.oauth.grantType": {
    isLoggable: true,
    type: "select",
    label: "Grant type",
    options: [
      {
        items: [
          { label: "Authorization code", value: "authorizecode" },
          // { label: 'Password', value: 'password' },
          { label: "Client credentials", value: "clientcredentials" },
        ],
      },
    ],
  },
  "http.auth.oauth.username": {
    type: "text",
    label: "Http auth oauth username",
  },
  "http.auth.oauth.applicationType": {
    isLoggable: true,
    type: "select",
    label: "Provider",
    defaultValue: (r) =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.grantType
        ? "custom"
        : r &&
          r.http &&
          r.http.auth &&
          r.http.auth.oauth &&
          r.http.auth.oauth.applicationType,
    options: [
      {
        items: [{ label: "Custom", value: "custom" }],
      },
    ],
  },
  "http.auth.oauth.callbackURL": {
    isLoggable: true,
    type: "text",
    label: "Redirect URL",
    defaultDisabled: true,
    defaultValue: () => `${getDomainUrl()}/connection/oauth2callback`,
  },
  "http.auth.oauth.type": {
    isLoggable: true,
    defaultValue: "custom",
  },
  "http.auth.token.revoke.uri": {
    type: "text",
    label: "Revoke token URL",
  },
  "http.auth.token.revoke.body": {
    type: "httprequestbody",
    contentType: "json",
    label: "Override revoke token HTTP request body",
  },
  "http.auth.token.revoke.headers": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Override revoke token HTTP headers",
  },
  "http.auth.oauth.password": {
    type: "text",
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    label: "Http auth oauth password",
  },
  "http.auth.token.token": {
    type: "text",
    label: "Token",
    inputType: "password",
    required: true,
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "http.auth.token.location": {
    isLoggable: true,
    type: "select",
    label: "Send token via",
    required: true,
    options: [
      {
        items: [
          { label: "URL parameter", value: "url" },
          { label: "HTTP header", value: "header" },
          { label: "HTTP body", value: "body" },
        ],
      },
    ],
  },
  "http.auth.token.headerName": {
    isLoggable: true,
    type: "text",
    label: "Header name",
    defaultValue: (r) =>
      (r &&
        r.http &&
        r.http.auth &&
        r.http.auth.token &&
        r.http.auth.token.headerName) ||
      "Authorization",
  },
  "http.auth.token.scheme": {
    isLoggable: true,
    type: "select",
    label: "Header scheme",
    skipDefault: true,
    defaultValue: (r) => {
      if (!r?.http?.auth?.token?.scheme) return " ";

      if (!["Bearer", "MAC", " "].includes(r.http.auth.token.scheme))
        return "Custom";

      return r.http.auth.token.scheme;
    },
    options: [
      {
        items: [
          { label: "Bearer", value: "Bearer" },
          { label: "MAC", value: "MAC" },
          { label: "None", value: " " },
          { label: "Custom", value: "Custom" },
        ],
      },
    ],
  },
  "http.auth.token.paramName": {
    isLoggable: true,
    type: "text",
    label: "Parameter name",
    required: true,
  },
  "http.auth.token.refreshMethod": {
    isLoggable: true,
    type: "select",
    label: "HTTP method",
    defaultValue: (r) =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMethod,
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
        ],
      },
    ],
  },
  "http.auth.token.refreshRelativeURI": {
    isLoggable: true,
    type: "relativeuri",
    showLookup: false,
    showExtract: false,
    label: "Relative URI",
  },
  "http.auth.token.refreshBody": {
    type: "httprequestbody",
    label: "HTTP request body",
  },
  "http.auth.token.refreshTokenPath": {
    type: "text",
    label: "Path to token field in HTTP response body",
  },
  "http.auth.token.refreshMediaType": {
    isLoggable: true,
    type: "select",
    label: "Override media type",
    placeholder: "Do not override",
    options: [
      {
        items: [
          { label: "JSON", value: "json" },
          { label: "URL encoded", value: "urlencoded" },
          { label: "XML", value: "xml" },
        ],
      },
    ],
  },
  "http.auth.token.refreshHeaders": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Configure HTTP headers",
  },
  "http.auth.token.refreshToken": {
    type: "text",
    inputType: "password",
    required: true,
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    label: "Refresh token",
  },
  "http.auth.cookie.uri": {
    type: "uri",
    showLookup: false,
    showExtract: false,
    label: "Absolute URL",
  },
  "http.auth.cookie.body": {
    type: "httprequestbody",
    label: "HTTP request body",
  },
  "http.auth.cookie.method": {
    isLoggable: true,
    type: "select",
    label: "HTTP method",
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
        ],
      },
    ],
  },
  "http.auth.cookie.successStatusCode": {
    isLoggable: true,
    type: "text",
    label: "Override HTTP status code for success",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "http.rateLimit.failStatusCode": {
    isLoggable: true,
    type: "text",
    label: "Override HTTP status code for rate-limit errors",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "http.rateLimit.failPath": {
    isLoggable: true,
    type: "text",
    label: "Path to rate-limit error field in HTTP response body",
  },
  "http.rateLimit.failValues": {
    type: "text",
    label: "Rate-limit error values",
    delimiter: ",",
  },
  "http.rateLimit.limit": {
    isLoggable: true,
    type: "text",
    label: "Wait time between HTTP requests",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "http.headers": {
    isLoggable: true,
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    defaultValue: (r) => (r && r.http && r.http.headers) || "",
    label: "Configure HTTP headers",
  },
  "http.unencrypted": {
    isLoggable: true,
    type: "editor",
    mode: "json",
    label: "Unencrypted",
  },
  "http.encrypted": {
    type: "editor",
    mode: "json",
    label: "Encrypted",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "http.clientCertificates.cert": {
    type: "uploadfile",
    placeholder: "SSL certificate",
    label: "SSL certificate",
    helpKey: "connection.http.clientCertificates.cert",
  },
  "http.clientCertificates.key": {
    type: "uploadfile",
    placeholder: "SSL client key",
    label: "SSL client key",
    helpKey: "connection.http.clientCertificates.key",
  },
  "http.clientCertificates.passphrase": {
    type: "text",
    label: "SSL passphrase",
    helpKey: "connection.http.clientCertificates.passphrase",
  },
  // #endregion http
  // #region ftp
  "ftp.hostURI": {
    isLoggable: true,
    type: "text",
    label: "Host",
    required: true,
    description:
      "If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.",
  },
  "ftp.type": {
    isLoggable: true,
    type: "radiogroup",
    label: "Protocol",
    required: true,
    defaultValue: (r) => (r && r.ftp && r.ftp.type) || "sftp",
    options: [
      {
        items: [
          { label: "FTP", value: "ftp" },
          { label: "SFTP", value: "sftp" },
          { label: "FTPS", value: "ftps" },
        ],
      },
    ],
  },
  "ftp.username": {
    type: "text",
    label: "Username",
    required: true,
  },
  "ftp.password": {
    type: "text",
    label: "Password",
    inputType: "password",
    requiredWhen: [
      {
        field: "ftp.type",
        is: ["ftp"],
      },
      {
        field: "ftp.authKey",
        is: [""],
      },
    ],
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "ftp.authKey": {
    type: "text",
    label: "Authentication key (pem format)",
    placeholder: "Optional if password is entered",
    multiline: true,
  },
  "ftp.port": {
    isLoggable: true,
    type: "ftpport",
    label: "Port",
    required: true,
    validWhen: {
      fallsWithinNumericalRange: {
        min: 0,
        max: 65535,
        message: "The value must be more than 0 and less than 65535",
      },
      matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
    },
  },
  "ftp.usePassiveMode": {
    isLoggable: true,
    type: "checkbox",
    label: "Use passive mode",
    defaultValue: (r) => (r && r.ftp && r.ftp.usePassiveMode) || "true",
  },
  "ftp.entryParser": {
    isLoggable: true,
    type: "select",
    label: "Entry parser",
    options: [
      {
        items: [
          { label: "UNIX", value: "UNIX" },
          { label: "UNIX-TRIM", value: "UNIX-TRIM" },
          { label: "VMS", value: "VMS" },
          { label: "WINDOWS", value: "WINDOWS" },
          { label: "OS/2", value: "OS/2" },
          { label: "OS/400", value: "OS/400" },
          { label: "AS/400", value: "AS/400" },
          { label: "MVS", value: "MVS" },
          { label: "UNKNOWN-TYPE", value: "UNKNOWN-TYPE" },
          { label: "NETWARE", value: "NETWARE" },
          { label: "MACOS-PETER", value: "MACOS-PETER" },
        ],
      },
    ],
  },
  "ftp.userDirectoryIsRoot": {
    isLoggable: true,
    type: "checkbox",
    label: "User directory is root",
    defaultValue: (r) => !!r?.ftp?.userDirectoryIsRoot,
  },
  "ftp.useImplicitFtps": {
    isLoggable: true,
    type: "checkbox",
    label: "Use implicit ftps",
    defaultValue: (r) => !!r?.ftp?.useImplicitFtps,
  },
  "ftp.requireSocketReUse": {
    isLoggable: true,
    type: "checkbox",
    label: "Require socket reuse",
    defaultValue: (r) => !!r?.ftp?.requireSocketReUse,
  },
  "ftp.usePgp": {
    isLoggable: true,
    type: "checkbox",
    defaultValue: (r) =>
      !!(r && r.ftp && (r.ftp.pgpEncryptKey || r.ftp.pgpDecryptKey)),
    label: "Use PGP encryption",
  },
  "ftp.pgpEncryptKey": {
    type: "text",
    multiline: true,
    label: "PGP public key",
    requiredWhen: [
      {
        field: "ftp.pgpDecryptKey",
        is: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "ftp.pgpKeyAlgorithm": {
    isLoggable: true,
    type: "select",
    label: "PGP encryption algorithm",
    defaultValue: (r) => (r && r.ftp && r.ftp.pgpKeyAlgorithm) || "CAST5",
    description:
      "Note: for security reasons this field must always be re-entered.",
    options: [
      {
        items: [
          { label: "Please select (Optional)", value: "" },
          { label: "AES-256", value: "AES-256" },
          { label: "AES-192", value: "AES-192" },
          { label: "AES-128", value: "AES-128" },
          { label: "3DES", value: "3DES" },
          { label: "CAST5", value: "CAST5" },
        ],
      },
    ],
  },
  "ftp.pgpDecryptKey": {
    type: "text",
    label: "PGP private key",
    multiline: true,
    requiredWhen: [
      {
        field: "ftp.pgpEncryptKey",
        is: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "ftp.pgpPassphrase": {
    type: "text",
    label: "PGP passphrase",
    requiredWhen: [
      {
        field: "ftp.pgpDecryptKey",
        isNot: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  usePgp: {
    isLoggable: true,
    type: "checkbox",
    defaultValue: (r) => !!(r?.pgp?.publicKey || r?.pgp?.privateKey),
    label: "Enable PGP cryptographic",
  },
  "pgp.publicKey": {
    isLoggable: true,
    type: "text",
    multiline: true,
    label: "PGP public key",
    defaultValue: "",
    requiredWhen: [
      {
        field: "pgp.privateKey",
        is: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "pgp.compressionAlgorithm": {
    isLoggable: true,
    type: "select",
    label: "Compression algorithm",
    skipSort: true,
    options: [
      {
        items: [
          { label: "zip", value: "zip" },
          { label: "zlib", value: "zlib" },
        ],
      },
    ],
  },
  "pgp.asciiArmored": {
    isLoggable: true,
    label: "ASCII armor",
    type: "radiogroup",
    defaultValue: (r) => (r?.pgp?.asciiArmored === false ? "false" : "true"),
    options: [
      {
        items: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
      },
    ],
  },
  "pgp.privateKey": {
    type: "text",
    label: "PGP private key",
    defaultValue: "",
    multiline: true,
    requiredWhen: [
      {
        field: "pgp.publicKey",
        is: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "pgp.passphrase": {
    type: "text",
    label: "Private key passphrase",
    defaultValue: "",
    requiredWhen: [
      {
        field: "pgp.privateKey",
        isNot: [""],
      },
    ],
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "ftp.concurrencyLevel": {
    isLoggable: true,
    label: "Concurrency level",
    type: "select",
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
        ],
      },
    ],
  },
  // #endregion ftp
  // #region s3
  "s3.accessKeyId": {
    isLoggable: true,
    type: "text",
    label: "Access key ID",
  },
  "s3.secretAccessKey": {
    type: "text",
    label: "Secret access key",
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
  },
  "s3.pingBucket": {
    isLoggable: true,
    type: "text",
    label: "Ping bucket",
  },
  // #endregion s3
  // #region as2
  "as2.as2Id": {
    type: "text",
    label: "AS2 identifier",
    required: true,
  },
  "as2.partnerId": {
    type: "text",
    label: "Partner's AS2 Identifier:",
    required: true,
  },
  "as2.partnerStationInfo.as2URI": {
    type: "text",
    label: "Partner's AS2 URL:",
    required: true,
    validWhen: {
      matchesRegEx: {
        pattern: URI_VALIDATION_PATTERN,
        message: "Please enter a valid URI.",
      },
    },
  },
  "as2.partnerStationInfo.mdn.verifyMDNSignature": {
    type: "checkbox",
    label: "Partner requires MDN signature verification",
  },
  "as2.userStationInfo.mdn.mdnURL": {
    type: "text",
    label: "Partner's URL for Asynchronous MDN:",
    required: true,
    visibleWhen: [
      {
        field: "partnerrequireasynchronousmdns",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.mdn.signatureProtocol": {
    type: "radiogroup",
    label: "As2 partner station info mdn signature protocol",
    options: [
      { items: [{ label: "Pkcs7-signature", value: "pkcs7-signature" }] },
    ],
  },
  "as2.partnerStationInfo.mdn.mdnSigning": {
    type: "select",
    label: "MDN verification algorithm",
    options: [
      {
        items: [
          { label: "SHA1", value: "SHA1" },
          { label: "MD5", value: "MD5" },
          { label: "SHA256", value: "SHA256" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.mdn.verifyMDNSignature",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.failStatusCode": {
    isLoggable: true,
    type: "text",
    label: "Authentication fail status code",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]$", message: "Only numbers allowed" },
      },
    ],
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["basic", "token"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.type": {
    isLoggable: true,
    type: "select",
    label: "Authentication type",
    required: true,
    options: [
      {
        items: [
          { label: "Basic", value: "basic" },
          { label: "Token", value: "token" },
          { label: "None", value: "none" },
        ],
      },
    ],
  },
  "as2.partnerStationInfo.auth.failPath": {
    isLoggable: true,
    type: "text",
    label: "Authentication fail path",
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["basic", "token"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.failValues": {
    isLoggable: true,
    type: "text",
    delimiter: ",",
    label: "Authentication fail values",
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["basic", "token"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.basic.username": {
    type: "text",
    label: "Username",
    required: true,
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["basic"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.basic.password": {
    type: "text",
    label: "Password",
    inputType: "password",
    defaultValue: "",
    required: true,
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["basic"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.token": {
    type: "text",
    label: "Token",
    required: true,
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["token"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.location": {
    isLoggable: true,
    type: "select",
    label: "Location",
    options: [
      {
        items: [
          { label: "URL Parameter", value: "url" },
          { label: "Header", value: "header" },
          { label: "Body", value: "body" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.type",
        is: ["token"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.headerName": {
    isLoggable: true,
    type: "text",
    label: "Header name",
    defaultValue: (r) =>
      (r &&
        r.as2 &&
        r.as2.partnerStationInfo &&
        r.as2.partnerStationInfo.auth &&
        r.as2.partnerStationInfo.auth.token &&
        r.as2.partnerStationInfo.auth.token.headerName) ||
      "Authorization",
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.token.location",
        is: ["header"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.scheme": {
    isLoggable: true,
    type: "select",
    label: "Scheme",
    options: [
      {
        items: [
          { label: "Bearer", value: "bearer" },
          { label: "MAC", value: "mac" },
          { label: "OAuth 2.0", value: "oauth" },
          { label: "None", value: "none" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.token.location",
        is: ["header"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.paramName": {
    isLoggable: true,
    type: "text",
    label: "Parameter name",
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.token.location",
        is: ["url"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshMethod": {
    isLoggable: true,
    type: "select",
    label: "Refresh method",
    options: [
      {
        items: [
          { label: "GET", value: "GET" },
          { label: "POST", value: "POST" },
          { label: "PUT", value: "PUT" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshRelativeURI": {
    isLoggable: true,
    type: "text",
    label: "Refresh relative URI",
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshBody": {
    type: "editor",
    mode: "json",
    label: "Refresh body",
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.auth.token.refreshMethod",
        is: ["POST", "PUT"],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshTokenPath": {
    isLoggable: true,
    type: "text",
    label: "Refresh token path",
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshMediaType": {
    isLoggable: true,
    type: "select",
    label: "Refresh media type",
    options: [
      {
        items: [
          { label: "JSON", value: "json" },
          { label: "URL encoded", value: "urlencoded" },
          { label: "XML", value: "xml" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshHeaders": {
    type: "keyvalue",
    keyName: "name",
    valueName: "value",
    valueType: "keyvalue",
    label: "Refresh token headers",
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.auth.token.refreshToken": {
    type: "text",
    label: "Refresh token",
    visibleWhen: [
      {
        field: "configureTokenRefresh",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.rateLimit.failStatusCode": {
    isLoggable: true,
    type: "text",
    label: "HTTP status code for rate-limit errors",
    visibleWhen: [
      {
        field: "configureApiRateLimits",
        is: [true],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]$", message: "Only numbers allowed" },
      },
    ],
  },
  "as2.partnerStationInfo.rateLimit.failPath": {
    isLoggable: true,
    type: "text",
    label: "Path to rate-limit errors in HTTP response body",
    visibleWhen: [
      {
        field: "configureApiRateLimits",
        is: [true],
      },
    ],
  },
  "as2.partnerStationInfo.rateLimit.failValues": {
    isLoggable: true,
    type: "text",
    delimiter: ",",
    visibleWhen: [
      {
        field: "configureApiRateLimits",
        is: [true],
      },
    ],
    label: "Rate-limit error values",
  },
  "as2.partnerStationInfo.rateLimit.limit": {
    isLoggable: true,
    type: "text",
    label: "Wait time between HTTP requests",
    visibleWhen: [
      {
        field: "configureApiRateLimits",
        is: [true],
      },
    ],
    requiredWhen: [
      {
        field: "configureApiRateLimits",
        is: [true],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]$", message: "Only numbers allowed" },
      },
      {
        fallsWithinNumericalRange: {
          message:
            "The value must be greater than undefined and  lesser than undefined",
        },
      },
    ],
  },
  "as2.partnerStationInfo.encryptionType": {
    isLoggable: true,
    type: "select",
    label: "Encryption type",
    required: true,
    options: [
      {
        items: [
          { label: "None", value: "NONE" },
          { label: "DES", value: "DES" },
          { label: "RC2", value: "RC2" },
          { label: "3DES", value: "3DES" },
          { label: "AES128", value: "AES128" },
          { label: "AES256", value: "AES256" },
        ],
      },
    ],
  },
  requiremdnspartners: {
    isLoggable: true,
    type: "labelvalue",
    label: "Require MDNs from partners?",
    value: "Yes",
  },
  requireasynchronousmdns: {
    isLoggable: true,
    type: "labelvalue",
    label: "Require asynchronous MDNs?",
    value: "No",
  },
  partnerrequireasynchronousmdns: {
    isLoggable: true,
    type: "checkbox",
    label: "Partner requires asynchronous MDNs?",
  },
  "as2.userStationInfo.ipAddresses": {
    type: "labelvalue",
    label: "AS2 ip addresses",
    value: "Click here to see the list of IP Addresses.",
  },
  "as2.partnerStationInfo.signing": {
    isLoggable: true,
    type: "select",
    label: "Signing",
    required: true,
    options: [
      {
        items: [
          { label: "None", value: "NONE" },
          { label: "SHA1", value: "SHA1" },
          { label: "MD5", value: "MD5" },
          { label: "SHA256", value: "SHA256" },
        ],
      },
    ],
  },
  "as2.partnerStationInfo.encoding": {
    isLoggable: true,
    type: "select",
    label: "Encoding",
    options: [
      {
        items: [
          { label: "Base64", value: "base64" },
          { label: "Binary", value: "binary" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "as2.partnerStationInfo.encryptionType",
        isNot: ["NONE"],
      },
    ],
  },
  "as2.partnerStationInfo.signatureEncoding": {
    isLoggable: true,
    type: "select",
    label: "Signature encoding",
    options: [
      {
        items: [
          { label: "Base64", value: "base64" },
          { label: "Binary", value: "binary" },
        ],
      },
    ],
  },
  "as2.encrypted.userPrivateKey": {
    type: "editor",
    mode: "text",
    label: "X.509 Private Key",
    requiredWhen: [
      {
        field: "as2.userStationInfo.encryptionType",
        isNot: ["NONE"],
      },
    ],
  },
  "as2.userStationInfo.mdn.mdnSigning": {
    isLoggable: true,
    type: "select",
    label: "MDN signing",
    required: true,
    options: [
      {
        items: [
          { label: "None", value: "NONE" },
          { label: "SHA1", value: "SHA1" },
          { label: "MD5", value: "MD5" },
          { label: "SHA256", value: "SHA256" },
        ],
      },
    ],
  },
  "as2.userStationInfo.mdn.mdnEncoding": {
    isLoggable: true,
    type: "select",
    label: "MDN encoding",
    options: [
      {
        items: [
          { label: "Base64", value: "base64" },
          { label: "Binary", value: "binary" },
        ],
      },
    ],
  },
  "as2.userStationInfo.encryptionType": {
    isLoggable: true,
    type: "select",
    label: "Decryption algorithm",
    required: true,
    options: [
      {
        items: [
          { label: "None", value: "NONE" },
          { label: "DES", value: "DES" },
          { label: "RC2", value: "RC2" },
          { label: "3DES", value: "3DES" },
          { label: "AES128", value: "AES128" },
          { label: "AES256", value: "AES256" },
        ],
      },
    ],
  },
  "as2.userStationInfo.signing": {
    isLoggable: true,
    type: "select",
    label: "Signature verification algorithm",
    required: true,
    options: [
      {
        items: [
          { label: "None", value: "NONE" },
          { label: "SHA1", value: "SHA1" },
          { label: "MD5", value: "MD5" },
          { label: "SHA256", value: "SHA256" },
        ],
      },
    ],
  },
  "as2.partnerStationInfo.mdnSigning": {
    isLoggable: true,
    type: "select",
    label: "Signature encoding",
    options: [
      {
        items: [
          { label: "Base64", value: "base64" },
          { label: "Binary", value: "binary" },
        ],
      },
    ],
  },
  "as2.userStationInfo.encoding": {
    isLoggable: true,
    type: "select",
    label: "Incoming message encoding",
    required: true,
    options: [
      {
        items: [
          { label: "Base64", value: "base64" },
          { label: "Binary", value: "binary" },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "as2.userStationInfo.encryptionType",
        isNot: ["NONE"],
      },
    ],
  },
  "as2.unencrypted.userPublicKey": {
    isLoggable: true,
    type: "editor",
    mode: "text",
    label: "X.509 Public Certificate",
    requiredWhen: [
      {
        field: "as2.userStationInfo.encryptionType",
        isNot: ["NONE"],
      },
    ],
  },
  "as2.unencrypted.partnerCertificate": {
    type: "editor",
    mode: "text",
    label: "Partner's Certificate:",
    requiredWhen: [
      {
        field: "as2.partnerStationInfo.encryptionType",
        isNot: ["NONE"],
      },
    ],
  },
  "as2.preventCanonicalization": {
    isLoggable: true,
    label: "Prevent canonicalization",
    type: "checkbox",
  },
  "as2.concurrencyLevel": {
    isLoggable: true,
    label: "Concurrency level",
    type: "select",
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
  },
  "as2.contentBasedFlowRouter": {
    isLoggable: true,
    type: "routingrules",
    label: "Routing rules editor",
    required: false,
    editorResultMode: "text",
    hookStage: "contentBasedFlowRouter",
    helpKey: "connection.as2.contentBasedFlowRouter",
    title:
      "Choose a script and function name to use for determining AS2 message routing",
    preHookData: {
      httpHeaders: {
        "as2-from": "OpenAS2_appA",
        "as2-to": "OpenAS2_appB",
      },
      mimeHeaders: {
        "content-type": "application/edi-x12",
        "content-disposition": "Attachment; filename=rfc1767.dat",
      },
      rawMessageBody: "sample message",
    },
  },
  // #endregion as2
  // #region netsuite
  "netsuite.account": {
    type: "netsuiteuserroles",
    label: "Account ID",
  },
  "netsuite.tokenId": {
    type: "text",
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    required: true,
    label: "Token ID",
  },
  "netsuite.tokenSecret": {
    type: "text",
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    required: true,
    label: "Token secret",
  },
  "netsuite.tokenEnvironment": {
    isLoggable: true,
    type: "select",
    label: "Environment",
    defaultValue: (r) => r && r.netsuite && r.netsuite.environment,
    options: [
      {
        items: [
          { value: "production", label: "Production" },
          { value: "sandbox2.0", label: "Sandbox2.0" },
          { value: "beta", label: "Beta" },
        ],
      },
    ],
  },
  "netsuite.environment": {
    isLoggable: true,
    type: "netsuiteuserroles",
    label: "Environment",
  },
  "netsuite.roleId": {
    isLoggable: true,
    type: "netsuiteuserroles",
    label: "Role",
  },
  "netsuite.email": {
    type: "text",
    label: "Email",
  },
  "netsuite.password": {
    type: "text",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    inputType: "password",
    label: "Password",
  },
  "netsuite.requestLevelCredentials": {
    isLoggable: true,
    type: "checkbox",
    label: "NetSuite request level credentials",
  },
  "netsuite.dataCenterURLs": {
    isLoggable: true,
    type: "text",
    label: "NetSuite data center URLs",
  },
  "netsuite.accountName": {
    type: "text",
    label: "NetSuite account name",
  },
  "netsuite.roleName": {
    type: "text",
    label: "NetSuite role name",
  },
  "netsuite.concurrencyLevelRESTlet": {
    isLoggable: true,
    type: "text",
    label: "NetSuite concurrency level restlet",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "netsuite.concurrencyLevelWebServices": {
    isLoggable: true,
    type: "text",
    label: "NetSuite concurrency level web services",
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
  },
  "netsuite.linkSuiteScriptIntegrator": {
    isLoggable: true,
    label: "Link SuiteScript integrator",
    type: "linksuitescriptintegrator",
  },
  "netsuite._iClientId": {
    isLoggable: true,
    label: "IClient",
    type: "selectresource",
    resourceType: "iClients",
  },
  "netsuite.concurrencyLevel": {
    isLoggable: true,
    label: "Concurrency level",
    type: "select",
    defaultValue: (r) =>
      r && r.netsuite && r.netsuite.concurrencyLevel
        ? r.netsuite.concurrencyLevel
        : 1,
    visibleWhen: [
      {
        field: "_borrowConcurrencyFromConnectionId",
        is: [""],
      },
    ],
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
  },
  "netsuite.wsdlVersion": {
    isLoggable: true,
    type: "radiogroup",
    label: "NetSuite wsdl version",
    options: [
      {
        items: [
          { label: "Current", value: "current" },
          { label: "Next", value: "next" },
        ],
      },
    ],
  },
  "netsuite.applicationId": {
    isLoggable: true,
    type: "text",
    label: "NetSuite application ID",
  },
  // #endregion netsuite
  // #region netSuiteDistributedAdaptor
  "netSuiteDistributedAdaptor.accountId": {
    type: "text",
    label: "Net suite distributed adaptor account ID",
  },
  "netSuiteDistributedAdaptor.environment": {
    isLoggable: true,
    type: "select",
    label: "Net suite distributed adaptor environment",
    options: [
      {
        items: [
          { label: "Production", value: "production" },
          { label: "Sandbox", value: "sandbox" },
          { label: "Beta", value: "beta" },
          { label: "Sandbox2.0", value: "sandbox2.0" },
        ],
      },
    ],
  },
  "netSuiteDistributedAdaptor.connectionId": {
    isLoggable: true,
    type: "text",
    label: "Net suite distributed adaptor connection ID",
  },
  "netSuiteDistributedAdaptor.username": {
    type: "text",
    label: "Net suite distributed adaptor username",
  },
  "netSuiteDistributedAdaptor.uri": {
    isLoggable: true,
    type: "text",
    label: "Net suite distributed adaptor URI",
  },
  // #endregion netSuiteDistributedAdaptor
  // #region salesforce
  "salesforce.sandbox": {
    isLoggable: true,
    type: "select",
    label: "Account type",
    required: true,
    options: [
      {
        items: [
          { label: "Production", value: false },
          { label: "Sandbox", value: true },
        ],
      },
    ],
  },
  "salesforce.baseURI": {
    isLoggable: true,
    type: "text",
    label: "Salesforce base URI",
  },
  "salesforce.oauth2FlowType": {
    isLoggable: true,
    type: "select",
    label: "OAuth 2.0 flow type",
    required: true,
    options: [
      {
        items: [
          { label: "Refresh Token", value: "refreshToken" },
          { label: "JWT Bearer Token", value: "jwtBearerToken" },
        ],
      },
    ],
  },
  "salesforce.username": {
    type: "text",
    label: "Username",
    visibleWhen: [
      {
        field: "salesforce.oauth2FlowType",
        is: ["jwtBearerToken"],
      },
    ],
  },
  "salesforce.bearerToken": {
    type: "text",
    label: "Salesforce bearer token",
  },
  "salesforce.refreshToken": {
    type: "text",
    label: "Salesforce refresh token",
  },
  "salesforce.packagedOAuth": {
    type: "checkbox",
    label: "Salesforce packaged oauth",
  },
  "salesforce.scopes": {
    type: "text",
    keyName: "name",
    valueName: "value",
    valueType: "array",
    label: "Salesforce scope",
  },
  "salesforce.info": {
    isLoggable: true,
    type: "text",
    label: "Salesforce info",
  },
  "salesforce.concurrencyLevel": {
    isLoggable: true,
    type: "select",
    label: "Concurrency level",
    defaultValue: (r) =>
      r && r.salesforce && r.salesforce.concurrencyLevel
        ? r && r.salesforce && r.salesforce.concurrencyLevel
        : 5,
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
    visibleWhen: [
      {
        field: "_borrowConcurrencyFromConnectionId",
        is: [""],
      },
    ],
    required: true,
  },
  // #endregion salesforce
  // #region wrapper
  "wrapper.unencrypted": {
    isLoggable: true,
    type: "editor",
    mode: "json",
    label: "Unencrypted",
  },
  "wrapper.encrypted": {
    type: "editor",
    mode: "json",
    label: "Encrypted",
    defaultValue: "",
  },
  "wrapper.pingFunction": {
    isLoggable: true,
    type: "text",
    label: "Ping function",
    required: true,
    visible: (r) => !(r && r._connectorId),
  },
  "wrapper._stackId": {
    isLoggable: true,
    label: "Stack",
    type: "selectresource",
    placeholder: "Please select a stack",
    resourceType: "stacks",
    required: true,
    visible: (r) => !(r && r._connectorId),
  },
  "wrapper.concurrencyLevel": {
    isLoggable: true,
    type: "select",
    label: "Concurrency level",
    options: [
      {
        items: [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
          { label: "7", value: 7 },
          { label: "8", value: 8 },
          { label: "9", value: 9 },
          { label: "10", value: 10 },
          { label: "11", value: 11 },
          { label: "12", value: 12 },
          { label: "13", value: 13 },
          { label: "14", value: 14 },
          { label: "15", value: 15 },
          { label: "16", value: 16 },
          { label: "17", value: 17 },
          { label: "18", value: 18 },
          { label: "19", value: 19 },
          { label: "20", value: 20 },
          { label: "21", value: 21 },
          { label: "22", value: 22 },
          { label: "23", value: 23 },
          { label: "24", value: 24 },
          { label: "25", value: 25 },
        ],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: "^[\\d]+$", message: "Only numbers allowed" },
      },
    ],
    visibleWhen: [
      {
        field: "_borrowConcurrencyFromConnectionId",
        is: [""],
      },
    ],
    defaultValue: (r) => (r && r.wrapper && r.wrapper.concurrencyLevel) || 1,
  },
  // #endregion wrapper
  // #region mongodb
  "mongodb.host": {
    isLoggable: true,
    type: "text",
    required: true,
    omitWhenValueIs: [""],
    label: "Host(s)",
    defaultValue: (r) => r && r.mongodb && r.mongodb.host[0],
  },
  "mongodb.database": {
    isLoggable: true,
    type: "text",
    label: "Database",
  },
  "mongodb.username": {
    type: "text",
    required: true,
    label: "Username",
  },
  "mongodb.password": {
    type: "text",
    required: true,
    inputType: "password",
    defaultValue: "",
    description:
      "Note: for security reasons this field must always be re-entered.",
    label: "Password",
  },
  "mongodb.replicaSet": {
    isLoggable: true,
    type: "text",
    label: "Replica set",
  },
  "mongodb.ssl": {
    isLoggable: true,
    type: "checkbox",
    label: "TLS/SSL",
    defaultValue: (r) => (r && r.mongodb && r.mongodb.ssl) || false,
  },
  "mongodb.authSource": {
    type: "text",
    label: "Auth source",
  },
  // #endregion mongodb
  // #region dynamodb
  "dynamodb.aws.accessKeyId": {
    type: "text",
    label: "Access key ID",
    required: true,
    helpKey: "connection.dynamodb.aws.accessKeyId",
  },
  "dynamodb.aws.secretAccessKey": {
    type: "text",
    label: "Secret access key",
    required: true,
    helpKey: "connection.dynamodb.aws.secretAccessKey",
  },
  // #endregion dynamodb
  settings: {
    type: "settings",
    defaultValue: (r) => r && r.settings,
  },
  // #region custom connection
  // #region constant contact
  versionType: {
    isLoggable: true,
    type: "select",
    label: "Version type",
    required: true,
    defaultValue: (r) => getConstantContactVersion(r),
    options: [
      {
        items: [
          { label: "V2", value: "constantcontactv2" },
          { label: "V3", value: "constantcontactv3" },
        ],
      },
    ],
  },
};
