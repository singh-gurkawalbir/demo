export default {
  'http.successMediaType': {
    loggable: true,
    type: 'select',
    placeholder: 'Do not override',
    label: 'Override media type for success responses',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
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
  'http.requestMediaType': {
    loggable: true,
    type: 'select',
    label: 'Override request media type',
    placeholder: 'Do not override',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'URL encoded', value: 'urlencoded' },
          { label: 'JSON', value: 'json' },
          { label: 'Multipart / form-data', value: 'form-data' },
        ],
      },
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
    loggable: true,
    type: 'select',
    label: 'Override media type for error responses',
    placeholder: 'Do not override',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
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
  'http.relativeURI': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'selectwithvalidations',
    label: 'Paging method',
    options: [
      {
        items: [
          { label: 'Next page token',
            value: 'token',
            regex: /.*{{.*export\.http\.paging\.token.*}}/,
            description: 'Add {{export.http.paging.token}} to either the relative URI or HTTP request body to complete the setup.',
            helpKey: 'export.paging.token',
            fieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body'] },

          { label: 'Skip number parameter',
            value: 'skip',
            regex: /.*{{.*export\.http\.paging\.skip.*}}/,
            description: 'Add {{export.http.paging.skip}} to either the relative URI or HTTP request body to complete the setup.',
            helpKey: 'export.paging.skip',
            fieldsToValidate: ['http.relativeURI', 'http.body', 'http.paging.relativeURI', 'http.paging.body']},

          { label: 'Page number parameter',
            value: 'page',
            regex: /.*{{.*export\.http\.paging\.page.*}}/,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'checkbox',
    label: 'Configure async helper',
  },
  'http.paging.token': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'text',
    label: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'Path to file in HTTP response body'; }

      return 'Path to records in HTTP response body';
    },
    helpKey: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'export.http.response.file.resourcePath'; }

      return 'export.http.response.resourcePath';
    },
    requiredWhen: [
      {
        field: 'http.successMediaType',
        is: ['xml'],
      },
    ],
    visibleWhen: [
      {
        field: 'http.successMediaType',
        isNot: ['csv'],
      },
    ],
  },
  'http.response.resourceIdPath': {
    loggable: true,
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
    loggable: true,
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
  'http.response.successValues': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    loggable: true,
    type: 'text',
    label: 'Transform script _script id',
  },
  'transform.script.function': {
    loggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
  'http.once.relativeURI': {
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
    loggable: true,
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
};
