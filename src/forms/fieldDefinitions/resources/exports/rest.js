export default {
  'rest.method': {
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
  },
  'rest.postBody': {
    type: 'httprequestbody',
    label: 'Build HTTP Request Body',
    connectionId: r => r && r._connectionId,
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.method',
        is: ['POST', 'PUT'],
      },
    ],
  },
  'rest.resourcePath': {
    type: 'text',
    label: 'Resource Path',
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure HTTP headers',
  },
  // #region paging
  'rest.pagingMethod': {
    type: 'select',
    label: 'Paging Method',
    options: [
      {
        items: [
          { label: 'Next Page URL', value: 'nextpageurl' },
          { label: 'Page Argument', value: 'pageargument' },
          { label: 'Relative URI', value: 'relativeuri' },
          { label: 'Link Header', value: 'linkheader' },
          { label: 'Skip Argument', value: 'skipargument' },
          { label: 'Token', value: 'token' },
          { label: 'Post Body', value: 'postbody' },
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
  'rest.nextPagePath': {
    type: 'text',
    label: 'Next Page Path',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['nextpageurl', 'token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.linkHeaderRelation': {
    type: 'text',
    required: true,
    label: 'Link Header Relation',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['linkheader'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.nextPageRelativeURI': {
    type: 'text',
    label: 'Next Page Relative URI',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['relativeuri'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.pageArgument': {
    type: 'text',
    label: 'Page Argument',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument', 'token'],
      },
    ],
  },
  'rest.pagingPostBody': {
    type: 'httprequestbody',
    label: 'Build Paging Post Body',
    connectionId: r => r && r._connectionId,
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['postbody'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.maxPagePath': {
    type: 'text',
    label: 'Max Page Path',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.maxCountPath': {
    type: 'text',
    label: 'Max Count Path',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.skipArgument': {
    type: 'text',
    label: 'Skip Argument',
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['skipargument'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.relativeURI': {
    type: 'relativeuri',
    required: true,
    label: 'Relative URI',
    connectionId: r => r && r._connectionId,
    requiredWhen: [
      {
        field: 'outputMode',
        is: ['blob'],
      },
    ],
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.lastPageStatusCode': {
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
  'rest.lastPagePath': {
    type: 'text',
    label: 'Last Page Path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.lastPageValue': {
    type: 'text',
    label: 'Last Page Value',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  // #endregion paging
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

  'rest.once.relativeURI': {
    type: 'relativeuri',
    label: 'Relative URI',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.once.method': {
    type: 'select',
    label: 'HTTP Method',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.blobFormat': {
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
  // #endregion once
  'rest.once.postBody': {
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    label: 'Build HTTP Request Body',
  },
};
