import {
  HTTP_PAGING_TOKEN_REGEX_STRING,
  HTTP_PAGING_SKIP_REGEX_STRING,
  HTTP_PAGING_PAGE_REGEX_STRING,
} from '../../../../constants';

export default {
  'http.successMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    placeholder: 'Do not override',
    label: 'Override media type for success responses',
    options: [
      { label: 'XML', value: 'xml' },
      { label: 'CSV', value: 'csv' },
      { label: 'JSON', value: 'json' },
    ],
    // dependentFieldForMediaType: '/http/requestMediaType',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.requestMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    label: 'Override request media type',
    placeholder: 'Do not override',
    options: [
      { label: 'XML', value: 'xml' },
      { label: 'URL encoded', value: 'urlencoded' },
      { label: 'JSON', value: 'json' },
      { label: 'Multipart / form-data', value: 'form-data' },
    ],
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.method',
        isNot: ['GET', ''],
      },
    ],
  },
  'http.errorMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    label: 'Override media type for error responses',
    placeholder: 'Do not override',
    options: [
      { label: 'XML', value: 'xml' },
      { label: 'JSON', value: 'json' },
    ],
    // dependentFieldForMediaType: '/http/requestMediaType',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.relativeURI': {
    isLoggable: true,
    type: 'relativeuri',
    showLookup: false,
    label: 'Relative URI',
    connectionId: r => r && r._connectionId,
    validateInComponent: true,
    deltaFieldsToValidate: ['http.relativeURI', 'http.body'],
    pagingFieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'],
    pagingMethodsToValidate: {
      page: /.*{{.*export\.http\.paging\.page.*}}/,
      skip: /.*{{.*export\.http\.paging\.skip.*}}/,
      token: /.*{{.*export\.http\.paging\.token.*}}/,
    },
    requiredWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
      {
        field: 'http.body',
        is: [''],
      },
    ],
  },
  'http.method': {
    isLoggable: true,
    type: 'select',
    label: 'HTTP method',
    required: true,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.blobMethod': {
    isLoggable: true,
    type: 'select',
    label: 'HTTP method',
    helpKey: 'export.http.method',
    required: true,
    defaultValue: r => r && r.http && r.http.method,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
    ],
  },
  'http.body': {
    isLoggable: true,
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    label: 'HTTP request body',
    refreshOptionsOnChangesTo: ['http.requestMediaType'],
    requestMediaType: r =>
      r?.http?.requestMediaType || '',
    requiredWhenAll: [
      {
        field: 'http.relativeURI',
        is: [''],
      },
      {
        field: 'http.method',
        isNot: [''],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    label: 'Configure HTTP headers',
  },
  'http.paging.method': {
    isLoggable: true,
    type: 'selectwithvalidations',
    label: 'Paging method',
    options: [
      {
        items: [
          { label: 'Next page token',
            value: 'token',
            regex: HTTP_PAGING_TOKEN_REGEX_STRING,
            description: 'Add {{export.http.paging.token}} to either the relative URI or HTTP request body to complete the setup.',
            helpKey: 'export.paging.token',
            fieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'] },

          { label: 'Skip number parameter',
            value: 'skip',
            regex: HTTP_PAGING_SKIP_REGEX_STRING,
            description: 'Add {{export.http.paging.skip}} to either the relative URI or HTTP request body to complete the setup.',
            helpKey: 'export.paging.skip',
            fieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body']},

          { label: 'Page number parameter',
            value: 'page',
            regex: HTTP_PAGING_PAGE_REGEX_STRING,
            description: 'Add {{export.http.paging.page}} to either the relative URI or HTTP request body to complete the setup.',
            helpKey: 'export.paging.page',
            fieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'],
          },

          { label: 'Next page URL', value: 'url' },
          { label: 'Link header', value: 'linkheader' },
          { label: 'Custom relative URI', value: 'relativeuri' },
          { label: 'Custom request body', value: 'body' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.skip': {
    isLoggable: true,
    type: 'text',
    label: 'Override skip number start index',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['skip'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.body': {
    isLoggable: true,
    type: 'httprequestbody',
    label: 'Override HTTP request body for subsequent page requests',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['body'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.page': {
    isLoggable: true,
    type: 'text',
    label: 'Override page number start index',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['page'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  configureAsyncHelper: {
    isLoggable: true,
    type: 'checkbox',
    label: 'Configure async helper',
  },
  'http.paging.token': {
    isLoggable: true,
    type: 'text',
    label: 'Override initial token value',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },

  // added 2 separate UI fields for paths for url and token methods
  // to have diff help texts and labels
  'http.paging.urlPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to next page URL field in HTTP response body',
    required: true,
    defaultValue: r => r?.http?.paging?.path,
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['url'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.tokenPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to next page token field in HTTP response body',
    required: true,
    defaultValue: r => r?.http?.paging?.path,
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.relativeURI': {
    isLoggable: true,
    type: 'relativeuri',
    label: 'Override relative URI for subsequent page requests',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token', 'relativeuri'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.pathAfterFirstRequest': {
    isLoggable: true,
    type: 'text',
    label: 'Override path to next page token field for subsequent page requests',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.resourcePath': {
    isLoggable: true,
    type: 'text',
    label: 'Override path to records for subsequent page requests',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.maxPagePath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to total number of pages field in HTTP response body',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['skip', 'page'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.maxCountPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to total number of results field in HTTP response body',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['skip', 'page'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.lastPageStatusCode': {
    isLoggable: true,
    type: 'text',
    label: 'Override HTTP status code for last page',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.lastPagePath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to paging complete field in HTTP response body',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.lastPageValues': {
    isLoggable: true,
    type: 'text',
    label: 'Paging complete values',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    delimiter: ',',
  },
  'http.paging.linkHeaderRelation': {
    isLoggable: true,
    type: 'text',
    label: 'Override link header relation name',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['linkheader'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http._asyncHelperId': {
    isLoggable: true,
    label: 'Async helper',
    type: 'selectresource',
    resourceType: 'asyncHelpers',
    appTypeIsStatic: true,
    options: { appType: 'Async Helpers' },
    allowNew: true,
    allowEdit: true,
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      { field: 'configureAsyncHelper', is: [true] },
    ],
  },
  'http.response.resourcePath': {
    isLoggable: true,
    type: 'text',
    label: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'Path to file in HTTP response body'; }

      return 'Path to records in HTTP response body';
    },
    helpKey: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'export.http.response.file.resourcePath'; }

      return 'export.http.response.resourcePath';
    },
    visibleWhen: [
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.resourceIdPath': {
    isLoggable: true,
    type: 'text',
    label: 'Http response resource ID path',
    visibleWhen: [
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.successPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to success field in HTTP response body',
    requiredWhen: [
      {
        field: 'http.response.successValues',
        isNot: ['', []],
      },
    ],
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.fileURLPaths': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Path to file URLs in HTTP response body',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.successValues': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Success values',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.errorPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to detailed error message field in HTTP response body',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.failPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to error field in HTTP response body',
    requiredWhen: [
      {
        field: 'http.response.failValues',
        isNot: ['', []],
      },
    ],
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.failValues': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Error values',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },

  // #region transform
  'transform.expression.rules': {
    isLoggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
  'http.once.relativeURI': {
    isLoggable: true,
    type: 'relativeuri',
    showLookup: false,
    label: 'Relative URI to update records',
    required: true,
    connectionId: r => r && r._connectionId,
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      { field: 'type', is: ['once'] },
    ],
  },
  'http.once.body': {
    isLoggable: true,
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    label: 'HTTP request body to update records',
    required: true,
    refreshOptionsOnChangesTo: ['http.requestMediaType'],
    requestMediaType: r =>
      r?.http?.requestMediaType || '',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      { field: 'type', is: ['once'] },
    ],
  },
  'http.once.method': {
    isLoggable: true,
    type: 'select',
    label: 'HTTP method to update records',
    required: true,
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      { field: 'type', is: ['once'] },
    ],
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.response.blobFormat': {
    isLoggable: true,
    type: 'select',
    label: 'File encoding',
    options: [
      {
        items: [
          { label: 'ASCII', value: 'ascii' },
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
          { label: 'Hex', value: 'hex' },
          { label: 'UTF-16LE', value: 'utf-16le' },
          { label: 'UTF-8', value: 'utf8' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
    ],
  },
  'unencrypted.apiType': {
    isLoggable: true,
    type: 'selectAmazonSellerCentralAPIType',
    label: 'API type',
    skipDefault: true,
    skipSort: true,
    options: [
      {
        items: [
          {label: 'Selling Partner API (SP-API)', value: 'Amazon-SP-API'},
          {label: 'Marketplace Web Service API (MWS)', value: ''},
        ],
      },
    ],
  },
  'unencrypted.restrictedReportType': {
    type: 'amazonRestrictedReportType',
    label: 'Restricted report type',
    helpKey: 'export.http.unencrypted.restrictedReportType',
  },
};
