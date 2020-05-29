export default {
  'http.successMediaType': {
    type: 'select',
    label: 'Override success media type',
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
  'http.errorMediaType': {
    type: 'select',
    label: 'Override error media type',
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
    type: 'relativeuri',
    label: 'Relative URI',
    connectionId: r => r && r._connectionId,
    validWhen: {
      someAreTrue: {
        message:
          'For delta exports please use lastExportDateTime in the relative URI or Request Body.',
        conditions: [
          {
            field: 'type',
            isNot: {
              values: ['delta'],
            },
          },
          {
            matchesRegEx: {
              pattern: '^(.*)lastExportDateTime',
            },
          },
        ],
      },
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
    type: 'select',
    label: 'HTTP method',
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
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    label: 'Build HTTP request body',
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
    type: 'select',
    label: 'Paging method',
    options: [
      {
        items: [
          { label: 'Token', value: 'token' },
          { label: 'Skip', value: 'skip' },
          { label: 'Page', value: 'page' },
          { label: 'Next Page URL', value: 'url' },
          { label: 'Link Header', value: 'linkheader' },
          { label: 'Relative URI', value: 'relativeuri' },
          { label: 'Post Body', value: 'body' },
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
    type: 'text',
    label: 'Skip',
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
    type: 'httprequestbody',
    label: 'Build paging post body',
    required: true,
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
    type: 'text',
    label: 'Page',
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
    type: 'checkbox',
    label: 'Configure async helper',
  },
  'http.paging.token': {
    type: 'text',
    label: 'Token',
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
  'http.paging.path': {
    type: 'text',
    label: 'Path',
    visibleWhenAll: [
      {
        field: 'http.paging.method',
        is: ['token', 'url'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.relativeURI': {
    type: 'text',
    label: 'Relative URI',
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
    type: 'text',
    label: 'Token path after first request',
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
    type: 'text',
    label: 'Resource path',
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
    type: 'text',
    label: 'Max page path',
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
    type: 'text',
    label: 'Max count path',
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
    type: 'text',
    label: 'Last page status code',
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
    type: 'text',
    label: 'Last page path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.lastPageValues': {
    type: 'text',
    label: 'Last page values',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    delimiter: ',',
  },
  'http.paging.linkHeaderRelation': {
    type: 'text',
    label: 'Link header relation',
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
    type: 'text',
    label: 'Resource path',
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
    type: 'text',
    label: 'Success path',
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
    type: 'text',
    label: 'Error path',
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
    type: 'text',
    label: 'Fail path',
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
    type: 'text',
    delimiter: ',',
    label: 'Fail values',
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
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
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
  'http.once.relativeURI': {
    type: 'relativeuri',
    label: 'Relative URI',
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
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    label: 'Build HTTP request body',
    visibleWhenAll: [
      {
        field: 'outputMode',
        is: ['records'],
      },
      { field: 'type', is: ['once'] },
    ],
  },
  'http.once.method': {
    type: 'select',
    label: 'HTTP method',
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
    type: 'select',
    label: 'Blob format',
    options: [
      {
        items: [
          { label: 'ASCII', value: 'ascii' },
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
          { label: 'Hex', value: 'hex' },
          { label: 'UCS-2/UTF-16', value: 'ucs2/utf16-le' },
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
};
