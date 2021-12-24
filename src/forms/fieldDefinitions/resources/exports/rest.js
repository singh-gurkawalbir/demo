export default {

  'rest.postBody': {
    isLoggable: true,
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

  // #region paging
  'rest.pagingMethod': {
    isLoggable: true,
    type: 'selectwithvalidations',
    helpKey: 'export.http.paging.method',
    label: 'Paging method',
    options: [
      {
        items: [
          { label: 'Next page URL', value: 'nextpageurl' },
          { label: 'Page number parameter', value: 'pageargument' },
          { label: 'Custom relative URI', value: 'relativeuri' },
          { label: 'Link header', value: 'linkheader' },
          { label: 'Skip number parameter', value: 'skipargument' },
          { label: 'Next page token', value: 'token' },
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
    isLoggable: true,
    type: 'text',
    label: 'Path to next page URL field in HTTP response body',
    required: true,
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
    isLoggable: true,
    type: 'text',
    label: 'Path to next page token field in HTTP response body',
    required: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'relativeuri',
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

  // added 2 separate UI fields for paths for page number and token methods
  // to have diff help texts and labels
  'rest.pageArgument': {
    isLoggable: true,
    type: 'text',
    label: 'Override page number query parameter name',
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument'],
      },
    ],
  },
  'rest.tokenPageArgument': {
    isLoggable: true,
    type: 'text',
    label: 'Next page token query parameter name',
    defaultValue: r => r?.rest?.pageArgument,
    required: true,
    visibleWhenAll: [
      {
        field: 'rest.pagingMethod',
        is: ['token'],
      },
    ],
  },
  'rest.pagingPostBody': {
    isLoggable: true,
    type: 'httprequestbody',
    label: 'Override HTTP request body for subsequent page requests',
    helpKey: 'export.http.paging.body',
    connectionId: r => r && r._connectionId,
    contentType: 'json',
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
    isLoggable: true,
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
    isLoggable: true,
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
    isLoggable: true,
    type: 'text',
    label: 'Override skip number query parameter name',
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
    isLoggable: true,
    type: 'relativeuri',
    showLookup: false,
    required: true,
    label: 'Relative URI',
    validateInComponent: true,
    deltaFieldsToValidate: ['rest.relativeURI', 'rest.postBody'],
    connectionId: r => r && r._connectionId,
  },
  'rest.lastPageValue': {
    isLoggable: true,
    type: 'text',
    label: 'Paging complete value',
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
    isLoggable: true,
    type: 'transformeditor',
    label: 'Transform expression rules',
    sampleData: r => r.sampleData,
    rules: r => r && r.transform && r.transform.rules,
  },
  'transform.script._scriptId': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script _script ID',
  },
  'transform.script.function': {
    isLoggable: true,
    type: 'text',
    label: 'Transform script function',
  },
  // #endregion transform
  'rest.once.relativeURI': {
    isLoggable: true,
    type: 'relativeuri',
    showLookup: false,
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
    isLoggable: true,
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
    isLoggable: true,
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
  // #endregion once
};
