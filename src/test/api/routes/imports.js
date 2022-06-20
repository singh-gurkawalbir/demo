import { API } from '../utils';

export default API.get('/api/imports',
  [{
    _id: '60e6f88e3499084a68917986',
    createdAt: '2021-07-08T13:07:27.001Z',
    lastModified: '2021-07-08T13:07:27.434Z',
    name: 'Post order refunds to Shopify',
    sampleData: {
      refund: {
        restock: true,
        note: 'wrong size',
        shipping: {
          full_refund: true,
          amount: 20,
        },
        refund_line_items: [
          {
            line_item_id: 518995019,
            quantity: 1,
          },
        ],
        transactions: [
          {
            parent_id: 801038806,
            amount: 199.65,
            kind: 'refund',
            gateway: 'bogus',
          },
        ],
      },
    },
    parsers: [],
    _connectionId: '5e7068331c056a75e6df19b2',
    _integrationId: '60e6f83f3499084a689178cc',
    _connectorId: '5656f5e3bebf89c03f5dd77e',
    externalId: 'shopify_refund_import_adaptor',
    distributed: false,
    apiIdentifier: 'i063b7d580',
    hooks: {
      postMap: {
        function: 'refundExportPostMapHook',
      },
    },
    lookups: [],
    mapping: {
      fields: [
        {
          extract: 'order_id',
          generate: 'refund.order_id',
        },
        {
          extract: 'Memo',
          generate: 'refund.note',
        },
        {
          extract: 'Shipping Cost',
          generate: 'refund.shipping.amount',
        },
        {
          extract: 'currency',
          generate: 'refund.currency',
          dataType: 'string',
          default: 'USD',
        },
      ],
      lists: [
        {
          fields: [
            {
              extract: 'line_items[*].Line Item Id',
              generate: 'line_item_id',
            },
            {
              extract: 'line_items[*].Quantity',
              generate: 'quantity',
            },
            {
              extract: 'line_items[*].location_id',
              generate: 'location_id',
            },
            {
              generate: 'restock_type',
              hardCodedValue: 'return',
            },
          ],
          generate: 'refund.refund_line_items',
        },
        {
          fields: [
            {
              extract: 'transactions[*].Amount',
              generate: 'amount',
            },
          ],
          generate: 'refund.transactions',
        },
      ],
    },
    http: {
      relativeURI: [
        '/admin/api/2022-04/orders/{{{encodeURI order_id}}}/refunds.json',
      ],
      method: [
        'POST',
      ],
      body: [],
      batchSize: 1,
      requestMediaType: 'json',
      successMediaType: 'json',
      errorMediaType: 'json',
      requestType: [],
      strictHandlebarEvaluation: true,
      sendPostMappedData: true,
      formType: 'http',
      response: {
        resourcePath: [],
        resourceIdPath: [],
        successPath: [],
        successValues: [],
        failPath: [],
        failValues: [],
      },
    },
    rest: {
      relativeURI: [
        '/admin/api/2022-04/orders/{{{encodeURI order_id}}}/refunds.json',
      ],
      method: [
        'POST',
      ],
      body: [],
    },
    adaptorType: 'RESTImport',
  },
  {
    _id: '5f2d839ff238932d6c7593f6',
    createdAt: '2020-08-07T16:38:55.677Z',
    lastModified: '2021-08-02T08:15:14.643Z',
    name: 'ADP Payroll To NetSuite Journal Entry Add Import',
    parsers: [],
    _connectionId: '5f2d82549b82dc2956e783e7',
    _integrationId: '5f2d8254f238932d6c7593cc',
    _connectorId: '570222ce6c99305e0beff026',
    distributed: true,
    apiIdentifier: 'if72a025ab',
    ignoreExisting: true,
    lookups: [],
    netsuite_da: {
      missingOrCorruptedDAConfig: false,
      isMigrated: true,
      operation: 'add',
      recordType: 'journalentry',
      batchSize: 123,
      internalIdLookup: {
        expression: '["custbody_celigo_adp_id","is","{{Column0}}]',
      },
      lookups: [],
      mapping: {
        fields: [
          {
            generate: 'subsidiary',
            hardCodedValue: '3',
            internalId: true,
          },
          {
            extract: 'Column0',
            generate: 'custbody_celigo_adp_id',
            internalId: false,
          },
        ],
        lists: [
          {
            generate: 'line',
            fields: [
              {
                generate: 'account',
                hardCodedValue: '7',
                internalId: true,
              },
              {
                extract: '*.Column5',
                generate: 'debit',
                internalId: false,
              },
              {
                extract: '*.Column5',
                generate: 'credit',
                internalId: false,
              },
              {
                extract: '*.Column6',
                generate: 'memo',
                internalId: false,
              },
              {
                extract: '*.Department',
                generate: 'department',
                internalId: true,
              },
            ],
          },
        ],
      },
      hooks: {
        postMap: {
          fileInternalId: null,
          function: 'adpPayrollPostMapHook',
        },
        postSubmit: {
          fileInternalId: null,
          function: 'adpPayrollPostSubmitHook',
        },
        preMap: {
          fileInternalId: null,
          function: 'adpPayrollPreMapHook',
        },
      },
    },
    adaptorType: 'NetSuiteDistributedImport',
  },
  ]);
