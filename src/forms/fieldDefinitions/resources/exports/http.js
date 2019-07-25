export default {
  type: {
    type: 'select',
    label: 'Export Type1234',
    options: [
      {
        items: [
          { label: 'All', value: 'all' },
          { label: 'Test', value: 'test' },
          { label: 'Delta', value: 'delta' },
        ],
      },
    ],
  },
  pagingData: {
    type: 'labeltitle',
    label: 'Does this API support paging?HTTP!!!',
  },
  'delta.dateFormat': {
    type: 'text',
    label: 'Date Format',
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
  'delta.lagOffset': {
    type: 'text',
    label: 'Offset',
    visibleWhen: [
      {
        field: 'type',
        is: ['delta'],
      },
    ],
  },
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
  },
  'http.relativeURI': {
    type: 'text',
    label: 'Relative URI',
  },
  'http.method': {
    type: 'select',
    label: 'HTTP Method',
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
  'http.body': {
    type: 'text',
    label: 'Build HTTP Request Body',
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
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
        ],
      },
    ],
  },
  'http.paging.skip': {
    type: 'text',
    label: 'Skip',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['skip'],
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
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['page'],
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
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
    ],
  },
  'http.paging.path': {
    type: 'text',
    label: 'Path',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'http.paging.method',
        is: ['url'],
      },
    ],
  },
  'http.paging.relativeURI': {
    type: 'text',
    label: 'Relative URI',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
      {
        field: 'http.paging.method',
        is: ['relativeuri'],
      },
    ],
  },
  'http.paging.pathAfterFirstRequest': {
    type: 'text',
    label: 'Token Path After First Request',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
    ],
  },
  'http.paging.resourcePath': {
    type: 'text',
    label: 'Resource Path',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['token'],
      },
    ],
  },
  'http.paging.maxPagePath': {
    type: 'text',
    label: 'Max Page Path',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['skip'],
      },
      {
        field: 'http.paging.method',
        is: ['page'],
      },
    ],
  },
  'http.paging.maxCountPath': {
    type: 'text',
    label: 'Max Count Path',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['skip'],
      },
      {
        field: 'http.paging.method',
        is: ['page'],
      },
    ],
  },
  'http.paging.lastPageStatusCode': {
    type: 'text',
    label: 'Last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.lastPagePath': {
    type: 'text',
    label: 'Last Page Path',
  },
  'http.paging.lastPageValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Last Page Values',
    validWhen: [],
  },
  'http.paging.linkHeaderRelation': {
    type: 'text',
    label: 'Link Header Relation',
    visibleWhen: [
      {
        field: 'http.paging.method',
        is: ['linkheader'],
      },
    ],
  },
  'http._asyncHelperId': {
    type: 'text',
    label: 'Http _async Helper Id',
  },
  'http.response.resourcePath': {
    type: 'text',
    label: 'Resource Path',
  },
  'http.response.resourceIdPath': {
    type: 'text',
    label: 'Http response resource Id Path',
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Success Path',
  },
  'http.response.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Success Values',
    validWhen: [],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Error Path',
  },
  pageSize: {
    type: 'text',
    label: 'Page Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  dataURITemplate: {
    type: 'relativeuri',
    label: 'Data URI Template',
  },
  'http.response.blobFormat': {
    type: 'text',
    label: 'Http response blob Format',
  },
  // #region transform
  'ftp.exportTransformRecords': {
    label: 'Would you like to transform the records?',
    type: 'labeltitle',
  },
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
  hookType: {
    type: 'radiogroup',
    label: 'Hook Type',
    defaultValue: 'script',
    options: [
      {
        items: [
          { label: 'Script', value: 'script' },
          { label: 'Stack', value: 'stack' },
        ],
      },
    ],
  },
  'hooks.preSavePage.function': {
    type: 'text',
    label: 'Pre Save Page',
  },
  'hooks.preSavePage._scriptId': {
    type: 'selectresource',
    resourceType: 'scripts',
    label: 'Pre Save Page _script Id',
  },
  'hooks.preSavePage._stackId': {
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    label: 'Pre Save Page _stack Id',
  },
};
