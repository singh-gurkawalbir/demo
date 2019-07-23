export default {
  'rest.relativeURI': {
    type: 'text',
    label: 'Rest relative URI',
  },
  'rest.method': {
    type: 'select',
    label: 'Rest method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
  'rest.postBody': {
    type: 'text',
    label: 'Rest post Body',
  },
  'rest.resourcePath': {
    type: 'text',
    label: 'Rest resource Path',
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Rest headers',
  },
  'rest.allowUndefinedResource': {
    type: 'checkbox',
    label: 'Rest allow Undefined Resource',
  },
  'rest.pagingMethod': {
    type: 'select',
    label: 'Rest paging Method',
    options: [
      {
        items: [
          { label: 'Nextpageurl', value: 'nextpageurl' },
          { label: 'Pageargument', value: 'pageargument' },
          { label: 'Relativeuri', value: 'relativeuri' },
          { label: 'Linkheader', value: 'linkheader' },
          { label: 'Skipargument', value: 'skipargument' },
          { label: 'Token', value: 'token' },
          { label: 'Postbody', value: 'postbody' },
        ],
      },
    ],
  },
  'rest.nextPagePath': {
    type: 'text',
    label: 'Rest next Page Path',
  },
  'rest.linkHeaderRelation': {
    type: 'text',
    label: 'Rest link Header Relation',
  },
  'rest.nextPageRelativeURI': {
    type: 'text',
    label: 'Rest next Page Relative URI',
  },
  'rest.pageArgument': {
    type: 'text',
    label: 'Rest page Argument',
  },
  'rest.pagingPostBody': {
    type: 'text',
    label: 'Rest paging Post Body',
  },
  'rest.maxPagePath': {
    type: 'text',
    label: 'Rest max Page Path',
  },
  'rest.maxCountPath': {
    type: 'text',
    label: 'Rest max Count Path',
  },
  'rest.skipArgument': {
    type: 'text',
    label: 'Rest skip Argument',
  },
  'rest.blobFormat': {
    type: 'text',
    label: 'Rest blob Format',
  },
  'rest.successPath': {
    type: 'text',
    label: 'Rest success Path',
  },
  'rest.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Rest success Values',
    validWhen: [],
  },
  'rest.lastPageStatusCode': {
    type: 'text',
    label: 'Rest last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.lastPagePath': {
    type: 'text',
    label: 'Rest last Page Path',
  },
  'rest.lastPageValue': {
    type: 'text',
    label: 'Rest last Page Value',
  },
  'rest.once.relativeURI': {
    type: 'text',
    label: 'Rest once relative URI',
  },
  'rest.once.method': {
    type: 'radiogroup',
    label: 'Rest once method',
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
    type: 'text',
    label: 'Rest once post Body',
  },
};
