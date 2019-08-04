export default {
  // type: {
  //   type: 'select',
  //   label: 'Export Type',
  //   options: [
  //     {
  //       items: [
  //         { label: 'All', value: 'all' },
  //         { label: 'Test', value: 'test' },
  //         { label: 'Delta', value: 'delta' },
  //         { label: 'Once', value: 'once' },
  //       ],
  //     },
  //   ],
  // },
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
  'rest.method': {
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
  'rest.postBody': {
    type: 'text',
    label: 'Build HTTP Request Body',
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
  },
  'rest.nextPagePath': {
    type: 'text',
    label: 'Next Page Path',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['nextpageurl', 'token'],
      },
    ],
  },
  'rest.linkHeaderRelation': {
    type: 'text',
    label: 'Link Header Relation',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['linkheader'],
      },
    ],
  },
  'rest.nextPageRelativeURI': {
    type: 'text',
    label: 'Next Page Relative URI',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['relativeuri'],
      },
    ],
  },
  'rest.pageArgument': {
    type: 'text',
    label: 'Page Argument',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument', 'token'],
      },
    ],
  },
  'rest.pagingPostBody': {
    type: 'text',
    label: 'Build Paging Post Body',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['postbody'],
      },
    ],
  },
  'rest.maxPagePath': {
    type: 'text',
    label: 'Max Page Path',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument'],
      },
    ],
  },
  'rest.maxCountPath': {
    type: 'text',
    label: 'Max Count Path',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['pageargument'],
      },
    ],
  },
  'rest.skipArgument': {
    type: 'text',
    label: 'Skip Argument',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['skipargument'],
      },
    ],
  },
  'rest.relativeuri': {
    type: 'text',
    label: 'Relative URI',
    visibleWhen: [
      {
        field: 'rest.pagingMethod',
        is: ['relativeuri'],
      },
    ],
  },
  'rest.successPath': {
    type: 'text',
    label: 'Success Path',
  },
  'rest.successValues': {
    type: 'text',
    label: 'Success Values',
  },
  'rest.lastPageStatusCode': {
    type: 'text',
    label: 'Last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.lastPagePath': {
    type: 'text',
    label: 'Last Page Path',
  },
  'rest.lastPageValue': {
    type: 'text',
    label: 'Last Page Value',
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
  // #region once Commenting it as it over rides the one in NetSuite
  // 'once.booleanField': {
  //   type: 'text',
  //   label: 'Boolean Field',
  //   visibleWhen: [
  //     {
  //       field: 'type',
  //       is: ['once'],
  //     },
  //   ],
  // },
  // #endregion once
  'rest.once.relativeURI': {
    type: 'text',
    label: 'Relative URI',
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
  'rest.once.method': {
    type: 'select',
    label: 'HTTP Method',
    options: [
      {
        items: [
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
  // #endregion once
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
  'rest.once.postBody': {
    type: 'text',
    label: 'Build HTTP Request Body',
    visibleWhen: [
      {
        field: 'type',
        is: ['once'],
      },
    ],
  },
};
