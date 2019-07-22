export default {
  'http.successMediaType': {
    type: 'select',
    label: 'Http success Media Type',
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Csv', value: 'csv' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'http.errorMediaType': {
    type: 'radiogroup',
    label: 'Http error Media Type',
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'http.relativeURI': {
    type: 'text',
    label: 'Http relative URI',
  },
  'http.method': {
    type: 'select',
    label: 'Http method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.body': {
    type: 'text',
    label: 'Http body',
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Http headers',
  },
  'http.paging.method': {
    type: 'select',
    label: 'Http paging method',
    options: [
      {
        items: [
          { label: 'Token', value: 'token' },
          { label: 'Skip', value: 'skip' },
          { label: 'Page', value: 'page' },
          { label: 'Url', value: 'url' },
          { label: 'Linkheader', value: 'linkheader' },
          { label: 'Relativeuri', value: 'relativeuri' },
        ],
      },
    ],
  },
  'http.paging.skip': {
    type: 'text',
    label: 'Http paging skip',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.page': {
    type: 'text',
    label: 'Http paging page',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.token': {
    type: 'text',
    label: 'Http paging token',
  },
  'http.paging.path': {
    type: 'text',
    label: 'Http paging path',
  },
  'http.paging.relativeURI': {
    type: 'text',
    label: 'Http paging relative URI',
  },
  'http.paging.pathAfterFirstRequest': {
    type: 'text',
    label: 'Http paging path After First Request',
  },
  'http.paging.resourcePath': {
    type: 'text',
    label: 'Http paging resource Path',
  },
  'http.paging.maxPagePath': {
    type: 'text',
    label: 'Http paging max Page Path',
  },
  'http.paging.maxCountPath': {
    type: 'text',
    label: 'Http paging max Count Path',
  },
  'http.paging.lastPageStatusCode': {
    type: 'text',
    label: 'Http paging last Page Status Code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.paging.lastPagePath': {
    type: 'text',
    label: 'Http paging last Page Path',
  },
  'http.paging.lastPageValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http paging last Page Values',
    validWhen: [],
  },
  'http.paging.linkHeaderRelation': {
    type: 'text',
    label: 'Http paging link Header Relation',
  },
  'http._asyncHelperId': {
    type: 'text',
    label: 'Http _async Helper Id',
  },
  'http.once.relativeURI': {
    type: 'text',
    label: 'Http once relative URI',
  },
  'http.once.method': {
    type: 'select',
    label: 'Http once method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
  },
  'http.once.body': {
    type: 'text',
    label: 'Http once body',
  },
  'http.response.resourcePath': {
    type: 'text',
    label: 'Http response resource Path',
  },
  'http.response.resourceIdPath': {
    type: 'text',
    label: 'Http response resource Id Path',
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Http response success Path',
  },
  'http.response.successValuess': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Http response success Values',
    validWhen: [],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Http response error Path',
  },
  'http.response.blobFormat': {
    type: 'text',
    label: 'Http response blob Format',
  },
};
