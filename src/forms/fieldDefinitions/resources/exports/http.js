export default {
  'http.successMediaType': {
    type: 'select',
    label: 'Success Media Type',
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
    label: 'Error Media Type',
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
    type: 'textwithlookupextract',
    fieldType: 'relativeUri',
    label: 'Relative URI',
    connectionId: r => r && r._connectionId,
    refreshOptionsOnChangesTo: ['name'],
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
    label: 'HTTP Method',
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
    label: 'HTTP Method',
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
    label: 'Build HTTP Request Body',
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
    label: 'Configure HTTP Headers',
  },
  'http.paging.method': {
    type: 'select',
    label: 'Paging Method',
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
    label: 'Build Paging Post Body',
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
    label: 'Configure Async Helper',
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
    label: 'Token Path After First Request',
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
    label: 'Resource Path',
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
    label: 'Max Page Path',
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
    label: 'Max Count Path',
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
    label: 'Last Page Status Code',
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
    label: 'Last Page Path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.paging.lastPageValues': {
    type: 'text',
    label: 'Last Page Values',
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
    label: 'Link Header Relation',
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
    type: 'text',
    label: 'Http _async Helper Id',
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
    label: 'Resource Path',
    requiredWhen: [
      {
        field: 'http.successMediaType',
        is: ['xml'],
      },
    ],
  },
  'http.response.resourceIdPath': {
    type: 'text',
    label: 'Http response resource Id Path',
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Success Path',
    requiredWhen: [
      {
        field: 'http.response.successValues',
        isNot: [''],
      },
    ],
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.successValues': {
    type: 'text',
    delimiter: ',',
    label: 'Success Values',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Error Path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
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
    label: 'Transform script _script Id',
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
    label: 'Build HTTP Request Body',
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
    label: 'HTTP Method',
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
    label: 'Blob Format',
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
