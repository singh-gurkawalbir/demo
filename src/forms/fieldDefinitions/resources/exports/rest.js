export default {
  'rest.method': {
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
  'rest.blobMethod': {
    type: 'select',
    label: 'HTTP method',
    required: true,
    defaultValue: r => r && r.rest && r.rest.method,
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
  'rest.postBody': {
    type: 'httprequestbody',
    label: 'HTTP request body',
    connectionId: r => r && r._connectionId,
    contentType: 'json',
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
    label: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'Path to file in HTTP response body'; }

      return 'Path to records in HTTP response body';
    },
    helpKey: r => {
      if (r?.resourceType === 'lookupFiles' || r?.type === 'blob') { return 'export.http.response.file.resourcePath'; }

      return 'export.http.response.resourcePath';
    },
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
    type: 'selectwithvalidations',
    helpKey: 'export.http.paging.method',
    label: 'Paging method',
    options: [
      {
        items: [
          { label: 'Next page URL', value: 'nextpageurl' },
          { label: 'Page number parameter', value: 'pageargument'},
          { label: 'Custom relative URI', value: 'relativeuri' },
          { label: 'Link header', value: 'linkheader' },
          { label: 'Skip number parameter', value: 'skipargument'},
          { label: 'Next page token', value: 'token'},
          { label: 'Custom request body', value: 'postbody' },
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

  // added 2 separate UI fields for paths for url and token methods
  // to have diff help texts and labels
  'rest.nextPageURLPath': {
    type: 'text',
    label: 'Path to next page URL field in HTTP response body',
    defaultValue: r => r?.rest?.nextPagePath,
    helpKey: 'export.http.paging.urlPath',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['nextpageurl'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.nextPageTokenPath': {
    type: 'text',
    label: 'Path to next page token field in HTTP response body',
    defaultValue: r => r?.rest?.nextPagePath,
    helpKey: 'export.http.paging.tokenPath',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['token'],
      },
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.linkHeaderRelation': {
    type: 'text',
    label: 'Override link header relation name',
    helpKey: 'export.http.paging.linkHeaderRelation',
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
    label: 'Override relative URI for subsequent page requests',
    helpKey: 'export.http.paging.relativeURI',
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
    label: 'Override query parameter name',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument', 'token'],
      },
    ],
  },
  'rest.pagingPostBody': {
    type: 'httprequestbody',
    label: 'Override HTTP request body for subsequent page requests',
    helpKey: 'export.http.paging.body',
    connectionId: r => r && r._connectionId,
    contentType: 'json',
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
    label: 'Path to total number of pages field in HTTP response body',
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
    label: 'Path to total number of results field in HTTP response body',
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
    label: 'Override query parameter name',
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
    validateInComponent: true,
    deltaFieldsToValidate: ['rest.relativeURI', 'rest.postBody'],
    connectionId: r => r && r._connectionId,
  },
  'rest.successPath': {
    type: 'text',
    label: 'Path to success field in HTTP response body',
    helpKey: 'export.http.response.successPath',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success values',
    helpKey: 'export.http.response.successValues',
    delimiter: ',',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.lastPageStatusCode': {
    type: 'text',
    label: 'Override HTTP status code for last page',
    helpKey: 'export.http.paging.lastPageStatusCode',
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
    label: 'Path to paging complete field in HTTP response body',
    helpKey: 'export.http.paging.lastPagePath',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'rest.lastPageValue': {
    type: 'text',
    label: 'Paging complete values',
    helpKey: 'export.http.paging.lastPageValues',
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
    label: 'Transform script _script ID',
  },
  'transform.script.function': {
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
  'rest.once.relativeURI': {
    type: 'relativeuri',
    label: 'Relative URI to update records',
    required: true,
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
    label: 'HTTP method to update records',
    required: true,
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
  'rest.once.postBody': {
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    contentType: 'json',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
    label: 'HTTP request body to update records',
    helpKey: 'export.http.once.body',
    required: true,
  },
  'rest.blobFormat': {
    type: 'select',
    label: 'Blob format',
    helpKey: 'export.http.response.blobFormat',
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
  // #endregion once
};
