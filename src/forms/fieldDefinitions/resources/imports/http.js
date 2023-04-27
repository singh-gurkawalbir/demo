import { HTTP_IMPORT_CREATE_FEED_RELATIVE_URI } from '../../../../constants';

export default {
  'http.method': {
    isLoggable: true,
    type: 'select',
    label: 'HTTP method',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'Composite', value: 'COMPOSITE' },
        ],
      },
    ],
    defaultValue: r => {
      if (!r?.http?.method) return '';

      if (Array.isArray(r.http.method)) {
        if (r.http.method.length > 1 || r.ignoreMissing || r.ignoreExisting) {
          return 'COMPOSITE';
        }
        if (r.http.method.length === 1) {
          return r.http.method[0];
        }
      }

      return r.http.method;
    },
  },
  'http.blobMethod': {
    isLoggable: true,
    type: 'select',
    helpKey: 'import.http.method',
    label: 'HTTP method',
    required: true,
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    options: [
      {
        items: [
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    ],
    defaultValue: r => r && r.http && r.http.method && r.http.method[0],
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    label: 'Configure HTTP headers',
  },
  'http.requestMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    label: 'Override request media type',
    placeholder: 'Do not override',
  },
  'http.compositeType': {
    isLoggable: true,
    type: 'select',
    label: 'Composite type',
    options: [
      {
        items: [
          {
            label: 'Create new records & update existing records',
            value: 'createandupdate',
          },
          {
            label: 'Create new records & ignore existing records',
            value: 'createandignore',
          },
          {
            label: 'Ignore new records & update existing records',
            value: 'updateandignore',
          },
        ],
      },
    ],
    requiredWhen: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
    ],
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    defaultValue: r => {
      let type = '';

      if (!r || !r.http) {
        return type;
      }

      if (r.http.method?.length > 1 || r.ignoreMissing || r.ignoreExisting) {
        if (r.http.method.length > 1) {
          type = 'createandupdate';
        } else if (r.http.method.length === 1) {
          if (r.ignoreExisting) {
            type = 'createandignore';
          } else if (r.ignoreMissing) {
            type = 'updateandignore';
          }
        }
      }

      return type;
    },
  },
  'http.requestType': {
    isLoggable: true,
    type: 'select',
    label: 'Request type',
    options: [
      {
        items: [
          {
            label: 'CREATE',
            value: 'CREATE',
          },
          {
            label: 'UPDATE',
            value: 'UPDATE',
          },
        ],
      },
    ],

    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
    ],
    defaultValue: r =>
      r && r.http && r.http.requestType && r.http.requestType[0],
  },
  'http.relativeURI': {
    isLoggable: true,
    type: 'relativeuri',
    fieldType: 'relativeUri',
    label: 'Relative URI',
    arrayIndex: 0,
    connectionId: r => r && r._connectionId,
    visibleWhen: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
    defaultValue: r =>
      r && r.http && r.http.relativeURI && (Array.isArray(r.http.relativeURI) ? r.http.relativeURI[0] : r.http.relativeURI),
  },
  'http.body': {
    isLoggable: true,
    type: 'httprequestbody',
    connectionId: r => r && r._connectionId,
    arrayIndex: 0,
    defaultValue: r =>
      Array.isArray(((r || {}).http || {}).body) ? (r.http.body[0] || '') : '',
    label: 'HTTP request body',
    requestMediaType: r =>
      r && r.http ? r && r.http.requestMediaType : 'json',
    visibleWhen: [
      {
        field: 'http.method',
        isNot: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'http.response.successPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to success field in HTTP response body',
    delimiter: ',',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.successValues': {
    isLoggable: true,
    type: 'text',
    label: 'Success values',
    delimiter: ',',
    // defaultValue: r =>
    //   r && r.http && r.http.response && r.http.response.successValues[0],
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.resourceIdPath': {
    isLoggable: true,
    type: 'text',
    helpKey: r => {
      if (r?.resourceType === 'transferFiles' || r?.blob) { return 'import.http.response.file.resourceIdPath'; }

      return 'import.http.response.resourceIdPath';
    },
    label: 'Path to id field in HTTP response body',
    delimiter: ',',
    visibleWhen: [
      {
        field: 'http.method',
        isNot: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['blob'],
      },
    ],
  },
  'http.response.failPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to error field in HTTP response body',
    delimiter: ',',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.failValues': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Error values',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.response.resourcePath': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    omitWhenHidden: true,
    label: 'Path to records in HTTP response body',
    visibleWhenAll: [
      {
        field: 'http.batchSize',
        isNot: ['', 0, 1],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    requiredWhenAll: [{
      field: 'http.batchSize',
      isNot: ['', 0, 1],
    }],
  },
  'http.response.errorPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to detailed error message field in HTTP response body',
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.batchSize': {
    isLoggable: true,
    type: 'text',
    label: 'Number of records per HTTP request',
    defaultValue: r => r?.http?.batchSize || 1,
    validWhen: {
      matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
    },
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.successMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    label: 'Override media type for success responses',
    placeholder: 'Do not override',
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    options: [
      { label: 'XML', value: 'xml' },
      { label: 'JSON', value: 'json' },
    ],
    // dependentFieldForMediaType: '/http/requestMediaType',
  },
  'http.errorMediaType': {
    isLoggable: true,
    type: 'selectoverridemediatype',
    label: 'Override media type for error responses',
    placeholder: 'Do not override',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
    options: [
      { label: 'XML', value: 'xml' },
      { label: 'JSON', value: 'json' },
    ],
    // dependentFieldForMediaType: '/http/requestMediaType',
  },
  'http.ignoreEmptyNodes': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Remove empty fields from HTTP request body',
    visibleWhen: [
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.configureAsyncHelper': {
    isLoggable: true,
    type: 'checkbox',
    label: 'Configure async helper',
    defaultValue: r => !!(r && r.http && r.http._asyncHelperId),
    visible: r => !(r && r.statusExport),
    visibleWhen: r => {
      if (r && r.statusExport) return [];

      return [
        {
          field: 'inputMode',
          is: ['records'],
        },
      ];
    },
  },

  'http._asyncHelperId': {
    isLoggable: true,
    label: 'Async helper',
    type: 'selectresource',
    resourceType: 'asyncHelpers',
    appTypeIsStatic: true,
    options: { appType: 'Async Helpers' },
    allowNew: true,
    allowEdit: true,
    visibleWhenAll: [
      {
        field: 'inputMode',
        is: ['records'],
      },
      { field: 'http.configureAsyncHelper', is: [true] },
    ],
  },
  'http.existingLookupType': {
    isLoggable: true,
    id: 'http.existingLookupType',
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpKey: 'import.lookupType',
    noApi: true,
    defaultValue: r => {
      if (r.http?.ignoreLookupName) {
        return 'lookup';
      }

      return 'source';
    },
    options: [
      {
        items: [
          {
            label: 'Records have a specific field populated',
            value: 'source',
          },
          {
            label: 'Run a dynamic lookup',
            value: 'lookup',
          },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.ignoreExistingExtract': {
    isLoggable: true,
    id: 'http.ignoreExistingExtract',
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.ignoreExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.existingLookupType',
        is: ['source'],
      },
    ],
    defaultValue: r => r.http?.ignoreExtract,
  },
  'http.ignoreExistingLookupName': {
    isLoggable: true,
    id: 'http.ignoreExistingLookupName',
    omitWhenHidden: true,
    label: 'Lookup',
    type: 'selectlookup',
    helpKey: 'import.lookup',
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    required: true,
    defaultValue: r => r.http?.ignoreLookupName,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.existingLookupType',
        is: ['lookup'],
      },
    ],
  },
  'http.newLookupType': {
    isLoggable: true,
    id: 'http.newLookupType',
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpKey: 'import.lookupType',
    noApi: true,
    defaultValue: r => {
      if (r.http?.ignoreLookupName) {
        return 'lookup';
      }

      return 'source';
    },
    options: [
      {
        items: [
          {
            label: 'Records have a specific field populated',
            value: 'source',
          },
          {
            label: 'Run a dynamic lookup',
            value: 'lookup',
          },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['updateandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.ignoreNewExtract': {
    isLoggable: true,
    id: 'http.ignoreNewExtract',
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.ignoreExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['updateandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.newLookupType',
        is: ['source'],
      },
    ],
    defaultValue: r => r.http?.ignoreExtract,
  },
  'http.ignoreNewLookupName': {
    isLoggable: true,
    id: 'http.ignoreNewLookupName',
    omitWhenHidden: true,
    label: 'Lookup',
    type: 'selectlookup',
    helpKey: 'import.lookup',
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    required: true,
    defaultValue: r => r.http?.ignoreLookupName,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['updateandignore'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.newLookupType',
        is: ['lookup'],
      },
    ],
  },
  'http.lookupType': {
    loggable: true,
    id: 'http.lookupType',
    type: 'select',
    label: 'How would you like to identify existing records?',
    required: true,
    helpKey: 'import.lookupType',
    noApi: true,
    defaultValue: r => {
      if (r.http?.existingLookupName) {
        return 'lookup';
      }

      return 'source';
    },
    options: [
      {
        items: [
          {
            label: 'Records have a specific field populated',
            value: 'source',
          },
          {
            label: 'Run a dynamic lookup',
            value: 'lookup',
          },
        ],
      },
    ],
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      },
    ],
  },
  'http.existingExtract': {
    loggable: true,
    id: 'http.existingExtract',
    label: 'Which field?',
    omitWhenHidden: true,
    helpKey: 'import.existingExtract',
    type: 'textwithflowsuggestion',
    showSuggestionsWithoutHandlebar: true,
    showLookup: false,
    required: true,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.lookupType',
        is: ['source'],
      },
    ],
  },
  'http.existingLookupName': {
    loggable: true,
    id: 'http.existingLookupName',
    omitWhenHidden: true,
    label: 'Lookup',
    type: 'selectlookup',
    helpKey: 'import.existingLookupName',
    adaptorType: r => r.adaptorType,
    importId: r => r._id,
    required: true,
    visibleWhenAll: [
      {
        field: 'http.compositeType',
        is: ['createandupdate'],
      },
      {
        field: 'http.method',
        is: ['COMPOSITE'],
      },
      {
        field: 'inputMode',
        is: ['records'],
      }, {
        field: 'http.lookupType',
        is: ['lookup'],
      },
    ],
  },
  'unencrypted.apiType': {
    isLoggable: true,
    type: 'selectAmazonSellerCentralAPIType',
    label: 'API type',
    helpKey: 'export.unencrypted.apiType',
    skipDefault: true,
    skipSort: true,
    options: [
      {
        items: [
          {label: 'Selling Partner API (SP-API)', value: 'Amazon-SP-API'},
          {label: 'Marketplace Web Service API (MWS)', value: ''},
        ],
      },
    ],
  },
  'unencrypted.feedType': {
    type: 'select',
    label: 'Feed type',
    helpKey: 'import.unencrypted.feedType',
    noApi: true,
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST'],
      },
      {
        field: 'http.relativeURI',
        is: [HTTP_IMPORT_CREATE_FEED_RELATIVE_URI],
      },
    ],
    options: [
      {
        items: [
          'JSON_LISTINGS_FEED',
          'POST_PRODUCT_DATA',
          'POST_INVENTORY_AVAILABILITY_DATA',
          'POST_PRODUCT_OVERRIDES_DATA',
          'POST_PRODUCT_PRICING_DATA',
          'POST_PRODUCT_IMAGE_DATA',
          'POST_PRODUCT_RELATIONSHIP_DATA',
          'POST_FLAT_FILE_INVLOADER_DATA',
          'POST_FLAT_FILE_LISTINGS_DATA',
          'POST_FLAT_FILE_BOOKLOADER_DATA',
          'POST_FLAT_FILE_CONVERGENCE_LISTINGS_DATA',
          'POST_FLAT_FILE_LISTINGS_DATA',
          'POST_FLAT_FILE_PRICEANDQUANTITYONLY_UPDATE_DATA',
          'POST_UIEE_BOOKLOADER_DATA',
          'POST_STD_ACES_DATA',
          'POST_ORDER_ACKNOWLEDGEMENT_DATA',
          'POST_PAYMENT_ADJUSTMENT_DATA',
          'POST_ORDER_FULFILLMENT_DATA',
          'POST_INVOICE_CONFIRMATION_DATA',
          'POST_EXPECTED_SHIP_DATE_SOD',
          'POST_FLAT_FILE_ORDER_ACKNOWLEDGEMENT_DATA',
          'POST_FLAT_FILE_PAYMENT_ADJUSTMENT_DATA',
          'POST_FLAT_FILE_FULFILLMENT_DATA',
          'POST_EXPECTED_SHIP_DATE_SOD_FLAT_FILE',
          'POST_FULFILLMENT_ORDER_REQUEST_DATA',
          'POST_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA',
          'POST_FBA_INBOUND_CARTON_CONTENTS',
          'POST_FLAT_FILE_FULFILLMENT_ORDER_REQUEST_DATA',
          'POST_FLAT_FILE_FULFILLMENT_ORDER_CANCELLATION_REQUEST_DATA',
          'POST_FLAT_FILE_FBA_CREATE_INBOUND_PLAN',
          'POST_FLAT_FILE_FBA_UPDATE_INBOUND_PLAN',
          'POST_FLAT_FILE_FBA_CREATE_REMOVAL',
          'RFQ_UPLOAD_FEED',
          'POST_EASYSHIP_DOCUMENTS',
          'UPLOAD_VAT_INVOICE',
        ],
      },
    ],
  },
  'unencrypted.feedOptions': {
    type: 'editor',
    mode: 'json',
    label: 'Feed options',
    helpKey: 'import.unencrypted.feedOptions',
    noApi: true,
    validateContent: true,
    visibleWhenAll: [
      {
        field: 'http.method',
        is: ['POST'],
      },
      {
        field: 'http.relativeURI',
        is: [HTTP_IMPORT_CREATE_FEED_RELATIVE_URI],
      },
    ],
  },
};
