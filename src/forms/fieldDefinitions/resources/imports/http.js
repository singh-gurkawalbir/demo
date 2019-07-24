export default {
  'http.requestMediaType': {
    type: 'select',
    label: 'Http request Media Type',
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
          { label: 'Csv', value: 'csv' },
          { label: 'Urlencoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'http.successMediaType': {
    type: 'radiogroup',
    label: 'Http success Media Type',
    options: [
      {
        items: [
          { label: 'Xml', value: 'xml' },
          { label: 'Json', value: 'json' },
        ],
      },
    ],
  },
  'http.requestType[*]s': {
    type: 'text',
    label: 'Http request Type[*]',
    name: 'undefineds',
    validWhen: [],
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
  'http.relativeURI[*]s': {
    type: 'text',
    label: 'Http relative URI[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.method[*]s': {
    type: 'text',
    label: 'Http method[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.body[*]s': {
    type: 'text',
    label: 'Http body[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.endPointBodyLimit': {
    type: 'text',
    label: 'Http end Point Body Limit',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.headers[*].name': {
    type: 'text',
    label: 'Http headers[*] name',
  },
  'http.response.resourcePath[*]s': {
    type: 'text',
    label: 'Http response resource Path[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.response.resourceIdPath[*]s': {
    type: 'text',
    label: 'Http response resource Id Path[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.response.successPath': {
    type: 'text',
    label: 'Http response success Path',
  },
  'http.response.successValues[*]s': {
    type: 'text',
    label: 'Http response success Values[*]',
    name: 'undefineds',
    validWhen: [],
  },
  'http.response.errorPath': {
    type: 'text',
    label: 'Http response error Path',
  },
  'http._asyncHelperId': {
    type: 'text',
    label: 'Http _async Helper Id',
  },
  'http.batchSize': {
    type: 'text',
    label: 'Http batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.ignoreLookupName': {
    type: 'text',
    label: 'Http ignore Lookup Name',
  },
  'http.ignoreExtract': {
    type: 'text',
    label: 'Http ignore Extract',
  },
  'http.lookups[*].name': {
    type: 'text',
    label: 'Http lookups[*] name',
  },
  'http.lookups[*].map': {
    type: 'text',
    label: 'Http lookups[*] map',
  },
  'http.lookups[*].default': {
    type: 'text',
    label: 'Http lookups[*] default',
  },
  'http.lookups[*].relativeURI': {
    type: 'text',
    label: 'Http lookups[*] relative URI',
  },
  'http.lookups[*].method': {
    type: 'text',
    label: 'Http lookups[*] method',
  },
  'http.lookups[*].body': {
    type: 'text',
    label: 'Http lookups[*] body',
  },
  'http.lookups[*].extract': {
    type: 'text',
    label: 'Http lookups[*] extract',
  },
  'http.lookups[*].allowFailures': {
    type: 'text',
    label: 'Http lookups[*] allow Failures',
  },
  'http.ignoreEmptyNodes': {
    type: 'checkbox',
    label: 'Http ignore Empty Nodes',
    defaultValue: false,
  },
};
