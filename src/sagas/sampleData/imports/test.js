/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { requestSampleData, _fetchAssistantSampleData, _fetchIAMetaData } from './index';
import { getNetsuiteOrSalesforceMeta, requestAssistantMetadata } from '../../resources/meta';
import { apiCallWithRetry } from '../..';

describe('sampleData imports saga', () => {
  const resourceId = '123';

  describe('requestSampleData saga', () => {
    test('should return undefined if resource does not exist', () => {
      expectSaga(requestSampleData, { resourceId })
        .returns(undefined)
        .run();

      return expectSaga(requestSampleData, {})
        .returns(undefined)
        .run();
    });

    test('should call fetchAssistantSampleData when import is of assistant type', () => {
      const merged = {
        assistant: 'shipwire',
      };

      return expectSaga(requestSampleData, { resourceId })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        ])
        .call(_fetchAssistantSampleData, {resource: merged})
        .run();
    });

    test('should call getNetsuiteOrSalesforceMeta with commMetaPath in case of NetSuite adaptor', () => {
      const merged = {
        adaptorType: 'NetSuiteImport',
        _connectionId: '456',
        netsuite: {
          recordType: 'accountParent',
        },
      };
      const expectedCommMetaPath = 'netsuite/metadata/suitescript/connections/456/recordTypes/account?parentRecordType=accountParent';

      expectSaga(requestSampleData, { resourceId, options: {recordType: 'account'}, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath, addInfo: { refreshCache: true }})
        .run();

      const merged2 = {
        adaptorType: 'NetSuiteDistributedImport',
        _connectionId: '789',
        netsuite_da: {
          recordType: 'accountParent',
        },
      };
      const expectedCommMetaPath2 = 'netsuite/metadata/suitescript/connections/789/recordTypes/accountParent';

      return expectSaga(requestSampleData, { resourceId: '111', refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', '111', 'value'), { merged: merged2 }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged2._connectionId, commMetaPath: expectedCommMetaPath2, addInfo: { refreshCache: true }})
        .run();
    });

    test('should call getNetsuiteOrSalesforceMeta with commMetaPath in case of Salesforce adaptor', () => {
      const merged = {
        adaptorType: 'SalesforceImport',
        _connectionId: '456',
        salesforce: {
          sObjectType: 'account',
        },
      };
      const expectedCommMetaPath = 'salesforce/metadata/connections/456/sObjectTypes/account';

      expectSaga(requestSampleData, { resourceId, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath, addInfo: { refreshCache: true }})
        .run();

      const expectedCommMetaPath1 = 'salesforce/metadata/connections/456/sObjectTypes/contact';
      const expectedCommMetaPath2 = 'salesforce/metadata/connections/456/sObjectTypes/opp';

      return expectSaga(requestSampleData, { resourceId, options: {sObjects: ['contact', 'opp']}, refreshCache: true })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        ])
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath1, addInfo: { refreshCache: true }})
        .call(getNetsuiteOrSalesforceMeta, {connectionId: merged._connectionId, commMetaPath: expectedCommMetaPath2, addInfo: { refreshCache: true }})

        .run();
    });

    test('should call fetchIAMetaData when resource is of IA type', () => {
      const merged = {
        _connectorId: '9999',
        _integrationId: '222',
        sampleData: {},

      };

      return expectSaga(requestSampleData, { resourceId })
        .provide([
          [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        ])
        .call(_fetchIAMetaData, {
          _importId: resourceId,
          _integrationId: merged._integrationId,
          refreshMetadata: undefined,
          sampleData: merged.sampleData,
        })
        .run();
    });
  });

  describe('fetchIAMetaData saga', () => {
    test('should call /refreshMetadata api when refreshMetadata prop is passed', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        refreshMetadata: true,
      })
        .call(apiCallWithRetry, {
          path: '/integrations/_integrationId/settings/refreshMetadata',
          opts: {
            method: 'PUT',
            body: {
              _importId,
            },
          },
          hidden: true,
        })
        .run();
    });

    test('should dispatch iaMetadataReceived action in case of success', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';
      const sampleData = {key: 'value'};

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        sampleData,
      })
        .put(actions.importSampleData.iaMetadataRequest({ _importId }))
        .put(
          actions.importSampleData.iaMetadataReceived({
            _importId,
            metadata: sampleData,
          })
        )
        .run();
    });

    test('should dispatch iaMetadataReceived action with original sample data in case of error', () => {
      const _importId = '_importId';
      const _integrationId = '_integrationId';
      const sampleData = {key: 'value'};

      return expectSaga(_fetchIAMetaData, {
        _importId,
        _integrationId,
        refreshMetadata: true,
        sampleData,
      })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError({})]])
        .put(actions.importSampleData.iaMetadataRequest({ _importId }))
        .put(
          actions.importSampleData.iaMetadataReceived({
            _importId,
            metadata: sampleData,
          })
        )
        .run();
    });
  });

  describe('fetchAssistantSampleData saga', () => {
    test('should call requestAssistantMetadata when there is no assistant data', () => {
      const resource = {
        adaptorType: 'RESTImport',
        assistant: 'shipwire',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), undefined],
        ])
        .call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .run();
    });

    test('should dispatch preview received action when import endpoint has sample data', () => {
      const resource = {
        _id: 'someId',
        createdAt: '2020-11-23T12:42:24.090Z',
        lastModified: '2020-11-23T12:42:25.542Z',
        name: 'Shipwire Assistant import',
        parsers: [],
        _connectionId: '_connectionId',
        distributed: false,
        assistant: 'shipwire',
        assistantMetadata: {
          resource: 'product',
          version: 'v3',
          operation: 'create_product',
          lookups: {},
        },
        lookups: [],
        http: {
          relativeURI: ['/v3/products'],
          method: ['POST'],
          body: [null],
          headers: [],
          batchSize: 1,
          requestMediaType: 'json',
          successMediaType: 'json',
          errorMediaType: 'json',
          requestType: [],
          strictHandlebarEvaluation: true,
          sendPostMappedData: true,
          lookups: [],
          response: {
            resourcePath: [],
            resourceIdPath: [null],
            successPath: ['resource.items'],
            successValues: [],
            failPath: [],
            failValues: [],
            allowArrayforSuccessPath: true,
          },
        },
        rest: {
          relativeURI: ['/v3/products'],
          method: ['POST'],
          body: [null],
          headers: [],
          responseIdPath: [null],
          successPath: ['resource.items'],
          successValues: [null],
          lookups: [],
        },
        adaptorType: 'RESTImport',
      };
      const assistantMetadata = {
        export: {
          labels: {
            version: 'API Version',
          },
          urlResolution: ['/v3/orders', '/v3/orders/:_id', '/v3/orders/:_id/commercialInvoice', '/v3/purchaseOrders', '/v3/purchaseOrders/:_id', '/v3/stock', '/v3/receivings', '/v3/receivings/:_id', '/v3/returns', '/v3/returns/:_id', '/v3/products', '/v3/products/:_id', '/v3/orders/:_id/items', '/v3/orders/:_id/holds', '/v3/orders/:_id/trackings', '/v3/orders/:_id/shippingLabel', '/v3/orders/:_id/packingList', '/v3/orders/:_id/splitOrders', '/v3/orders/:_id/pieces', '/v3/orders/:_id/extendedAttributes', '/v3/orders/:_id/returns', '/v3.1/vendors', '/v3/vendors/:_id', '/v3.1/containers', '/v3.1/containers/:_id'],
          versions: [{
            version: 'v3',
            paging: {
              pagingMethod: 'skipargument',
              skipArgument: 'offset',
            },
            resources: [{
              id: 'order',
              name: 'Order',
              endpoints: [{
                id: 'get_an_itemized_list_of_orders',
                url: '/v3/orders',
                name: 'Get an itemized list of orders.',
                resourcePath: 'resource.items',
                pathParameters: [],
                supportedExportTypes: ['delta', 'test'],
                delta: {
                  defaults: {
                    updatedAfter: '{{{encodeURI lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [{
                  id: 'expand',
                  name: 'expand',
                  description: 'Expand order data in the response, instead of accessing directly via a URL (comma separated list). Valid values are `holds`, `items` , `returns` and `trackings`, `splitOrders`, `pieces` or simply `all`. See resources `Holds`, `Items`, `Returns`, `Trackings`, `Split Orders` and `Pieces` for information on the data model returned by this parameter.',
                  fieldType: 'input',
                }, {
                  id: 'commerceName',
                  name: 'commerceName',
                  description: 'Filter by commerceName (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'transactionId',
                  name: 'transactionId',
                  description: 'Filter by transactionId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'orderId',
                  name: 'orderId',
                  description: 'Filter by orderId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'orderNo',
                  name: 'orderNo',
                  description: 'Filter by orderNo (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'referrer',
                  name: 'referrer',
                  description: 'Filter by referer (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  description: 'Filter by externalId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'status',
                  name: 'status',
                  description: 'Filter by status (comma separated list of: `processed`, `canceled`, `completed`, `delivered`, `returned`, `submitted`, `held`, `tracked`)',
                  fieldType: 'input',
                }, {
                  id: 'holdType',
                  name: 'holdType',
                  description: 'Filter by order hold type and status = `held` (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'holdTypeNot',
                  name: 'holdTypeNot',
                  description: 'Filter by order hold type is not and status = `held` (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'excludeInProgressHolds',
                  name: 'excludeInProgressHolds',
                  description: 'Filter on status = held ignoring holds less than 60 seconds old (can be combined with holdType or holdTypeNot)',
                  fieldType: 'input',
                }, {
                  id: 'updatedAfter',
                  name: 'updatedAfter',
                  description: "Only show resources updated after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'purchaseOrderId',
                  name: 'purchaseOrderId',
                  description: 'Filter by purchaseOrderId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'vendorId',
                  name: 'vendorId',
                  description: 'Filter by vendorId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'vendorExternalId',
                  name: 'vendorExternalId',
                  description: 'Filter by vendorExternalId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'warehouseId',
                  name: 'warehouseId',
                  description: 'Filter by warehouseId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'warehouseExternalId',
                  name: 'warehouseExternalId',
                  description: 'Filter by warehouseExternalId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'createdAfter',
                  name: 'createdAfter',
                  description: "Filter by order created after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'createdBefore',
                  name: 'createdBefore',
                  description: "Filter by order created before this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'processedAfter',
                  name: 'processedAfter',
                  description: "Filter by order processed after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'processedBefore',
                  name: 'processedBefore',
                  description: "Filter by order processed before this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'completedAfter',
                  name: 'completedAfter',
                  description: "Filter by order completed after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'completedBefore',
                  name: 'completedBefore',
                  description: "Filter by order completed before this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'shipwireAnywhere',
                  name: 'shipwireAnywhere',
                  description: 'Filter Shipwire Anywhere warehouse orders: `0` = Exclude Shipwire Anywhere, `1` = Include Only Shipwire Anywhere',
                  fieldType: 'input',
                }, {
                  id: 'sortBy',
                  name: 'sortBy',
                  description: 'Sort by field(s) (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'sortDirection',
                  name: 'sortDirection',
                  description: 'Sort direction: `ASC` or `DESC` (comma separated list)',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_order',
                url: '/v3/orders/:_id',
                name: 'Get information about this order.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_contents_of_this_order',
                url: '/v3/orders/:_id/items',
                name: 'Get the contents of this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_list_of_holds_if_any_on_an_order',
                url: '/v3/orders/:_id/holds',
                name: 'Get the list of holds, if any, on an order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_tracking_information_for_this_order',
                url: '/v3/orders/:_id/trackings',
                name: 'Get tracking information for this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_shipping_order_shipping_label_of_this_order',
                url: '/v3/orders/:_id/shippingLabel',
                name: 'Get the shipping order Shipping Label of this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_shipping_order_packing_list_of_this_order',
                url: '/v3/orders/:_id/packingList',
                name: 'Get the shipping order Packing List of this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_split_orders_information_for_this_order',
                url: '/v3/orders/:_id/splitOrders',
                name: 'Get Split Orders information for this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_shipping_pieces_of_this_order',
                url: '/v3/orders/:_id/pieces',
                name: 'Get the shipping pieces of this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_shipping_order_extended_attributes_of_this_order',
                url: '/v3/orders/:_id/extendedAttributes',
                name: 'Get the shipping order extended attributes of this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_any_returns_associated_with_this_order',
                url: '/v3/orders/:_id/returns',
                name: 'Get any returns associated with this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_any_returns_associated_with_this_order',
                url: '/v3/orders/:_id/returns',
                name: 'Get any returns associated with this order',
                doesNotSupportPaging: true,
                resourcePath: 'resource.items',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_shipping_order_commercial_invoice_of_this_order',
                url: '/v3/orders/:_id/commercialInvoice',
                name: 'Get the shipping order Commercial Invoice of this order.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'purchaseorder',
              name: 'Purchase Order',
              endpoints: [{
                id: 'get_an_itemized_list_of_purchase_orders',
                url: '/v3/purchaseOrders',
                name: 'Get an itemized list of purchase orders.',
                resourcePath: 'resource.items',
                pathParameters: [],
                queryParameters: [{
                  id: 'expand',
                  name: 'expand',
                  description: 'Expand purchase order data in the response, instead of accessing directly via a URL (comma separated list). Valid values are `holds`, `items` , and `trackings`, or simply `all`. See resources `Holds` (not implemented), `Items`, and `Trackings` for information on the data model returned by this parameter.',
                  fieldType: 'input',
                }, {
                  id: 'transactionId',
                  name: 'transactionId',
                  description: 'Filter by transactionId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'purchaseOrderId',
                  name: 'purchaseOrderId',
                  description: 'Filter by purchase order Id (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'orderNo',
                  name: 'orderNo',
                  description: 'Filter by orderNo (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'referrer',
                  name: 'referrer',
                  description: 'Filter by referer (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'updatedAfter',
                  name: 'updatedAfter',
                  description: "Only show resources updated after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_purchase_order',
                url: '/v3/purchaseOrders/:_id',
                name: 'Get information about this purchase order.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }, {
                id: 'get_the_list_of_holds_if_any_on_an_purchaseorders',
                url: '/v3/purchaseOrders/:_id/holds',
                name: 'Get the list of holds, if any, on an purchaseOrders',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Order Id or External Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'stock',
              name: 'Stock',
              endpoints: [{
                id: 'get_stock_information_for_your_products',
                url: '/v3/stock',
                name: 'Get stock information for your products.',
                resourcePath: 'resource.items',
                pathParameters: [],
                queryParameters: [{
                  id: 'parentId',
                  name: 'parentId',
                  description: 'Product ID or external ID',
                  fieldType: 'input',
                }, {
                  id: 'sku',
                  name: 'sku',
                  description: 'Filters by SKU, comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'productId',
                  name: 'productId',
                  description: 'Filters by product ID (Shipwire platform), comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'productExternalId',
                  name: 'productExternalId',
                  description: 'Filters by product ID (Client platform), comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'warehouseId',
                  name: 'warehouseId',
                  description: 'Filters by warehouse ID (Shipwire platform), comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'warehouseExternalId',
                  name: 'warehouseExternalId',
                  description: 'Filters by warehouse ID (Client platform), comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'warehouseRegion',
                  name: 'warehouseRegion',
                  description: 'Filters by warehouse Region, comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'warehouseArea',
                  name: 'warehouseArea',
                  description: 'Filters by warehouse Area (continents and countries), comma-separated list can be specified',
                  fieldType: 'input',
                }, {
                  id: 'channelName',
                  name: 'channelName',
                  description: 'Sets channelName for the request',
                  fieldType: 'input',
                }, {
                  id: 'includeEmpty',
                  name: 'includeEmpty',
                  description: "If set to '1' then empty resources will be displayed as well",
                  fieldType: 'input',
                }, {
                  id: 'vendorId',
                  name: 'vendorId',
                  description: 'Vendor ID list (comma-separated)',
                  fieldType: 'input',
                }, {
                  id: 'vendorExternalId',
                  name: 'vendorExternalId',
                  description: 'Vendor external ID list (comma-separated)',
                  fieldType: 'input',
                }, {
                  id: 'disableAutoBreakLots',
                  name: 'disableAutoBreakLots',
                  description: 'Disable Auto Break Lots',
                  fieldType: 'input',
                }, {
                  id: 'mode',
                  name: 'mode',
                  description: 'Valid values: IncludingHigherLevelQuantitiesWithLots (default if account is setup to break lots), IncludingHigherLevelQuantitiesWithoutLots, NotIncludingHigherLevelQuantitiesWithLots (default if account is not setup to break lots), NotIncludingHigherLevelQuantitiesWithoutLots',
                  fieldType: 'select',
                  options: ['IncludingHigherLevelQuantitiesWithLots', 'IncludingHigherLevelQuantitiesWithoutLots', 'NotIncludingHigherLevelQuantitiesWithLots', 'NotIncludingHigherLevelQuantitiesWithoutLots'],
                }, {
                  id: 'includeEmptyShipwireAnywhere',
                  name: 'includeEmptyShipwireAnywhere',
                  description: 'Include Empty Shipwire Anywhere',
                  fieldType: 'input',
                }],
              }],
            }, {
              id: 'receiving',
              name: 'Receiving',
              endpoints: [{
                id: 'get_an_itemized_list_of_receivings',
                url: '/v3/receivings',
                name: 'Get an itemized list of receivings.',
                resourcePath: 'resource.items',
                pathParameters: [],
                queryParameters: [{
                  id: 'expand',
                  name: 'expand',
                  description: "Expand receivings data in the response, instead of accessing directly via a URL (comma separated list). Valid values are `holds`, `instructionsRecipients`, `items` , `shipments`, `labels' and `trackings`, or simply `all`. See resources `Holds`, `Instruction Recipients`, `Items`, `Shipments`, `labels` and `Trackings` for information on the data model returned by this parameter.",
                  fieldType: 'input',
                }, {
                  id: 'commerceName',
                  name: 'commerceName',
                  description: 'Filter by commerceName (comma separated list)\t',
                  fieldType: 'input',
                }, {
                  id: 'transactionId',
                  name: 'transactionId',
                  description: 'Filter by transactionId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  description: 'externalId',
                  fieldType: 'input',
                }, {
                  id: 'orderId',
                  name: 'orderId',
                  description: 'Filter by orderId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'orderNo',
                  name: 'orderNo',
                  description: 'Filter by orderNo (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'status',
                  name: 'status',
                  description: "Filter by status (comma separated list of: 'processed', 'canceled', 'completed', 'delivered', 'returned', 'submitted', 'held', 'tracked')\t",
                  fieldType: 'input',
                }, {
                  id: 'updatedAfter',
                  name: 'updatedAfter',
                  description: "Only show resources updated after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'warehouseId',
                  name: 'warehouseId',
                  description: 'Filter by warehouseId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'warehouseExternalId',
                  name: 'warehouseExternalId',
                  description: 'Filter by warehouseExternalId (comma separated list',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_receiving',
                url: '/v3/receivings/:_id',
                name: 'Get information about this receiving.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'return',
              name: 'Return',
              endpoints: [{
                id: 'get_an_itemized_list_of_returns',
                url: '/v3/returns',
                name: 'Get an itemized list of returns.',
                resourcePath: 'resource.items',
                pathParameters: [],
                queryParameters: [{
                  id: 'expand',
                  name: 'expand',
                  description: 'Expand returns data in the response, instead of accessing directly via a URL (comma separated list). Valid values are `holds`, `items` , `labels` and `trackings`, or simply `all`. See resources `Holds`, `Items`, `labels` and `Trackings` for information on the data model returned by this parameter.',
                  fieldType: 'input',
                }, {
                  id: 'commerceName',
                  name: 'commerceName',
                  description: 'Filter by commerceName (comma separated list)\t',
                  fieldType: 'input',
                }, {
                  id: 'transactionId',
                  name: 'transactionId',
                  description: 'Filter by transactionId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  description: 'externalId',
                  fieldType: 'input',
                }, {
                  id: 'orderId',
                  name: 'orderId',
                  description: 'Filter by orderId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'status',
                  name: 'status',
                  description: "Filter by status (comma separated list of: 'processed', 'canceled', 'completed', 'delivered', 'returned', 'submitted', 'held', 'tracked')",
                  fieldType: 'input',
                }, {
                  id: 'updatedAfter',
                  name: 'updatedAfter',
                  description: "Only show resources updated after this date (ISO 8601 format, ex: '2014-05-30T13:08:29-07:00')",
                  fieldType: 'input',
                }, {
                  id: 'warehouseId',
                  name: 'warehouseId',
                  description: 'Filter by warehouseId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'warehouseExternalId',
                  name: 'warehouseExternalId',
                  description: 'Filter by warehouseExternalId (comma separated list',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_return',
                url: '/v3/returns/:_id',
                name: 'Get information about this return.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'vendors',
              name: 'Vendors',
              endpoints: [{
                id: 'get_a_collection_of_vendors_filtering_by_vendor_ids_external_ids_vendor_names_vendor_status',
                url: '/v3.1/vendors',
                name: 'Get a collection of vendors filtering by vendor ids, external ids, vendor names, vendor status',
                resourcePath: 'resource.items',
                pathParameters: [],
                queryParameters: [{
                  id: 'id',
                  name: 'ID',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  description: 'externalId',
                  fieldType: 'input',
                }, {
                  id: 'name',
                  name: 'name',
                  description: 'Filter by name (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'status',
                  name: 'status',
                  description: "Filter by status (comma separated list of: 'processed', 'canceled', 'completed', 'delivered', 'returned', 'submitted', 'held', 'tracked')",
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_vendor',
                url: '/v3/vendors/:_id',
                name: 'Get information about this vendor.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'containers',
              name: 'Containers',
              endpoints: [{
                id: 'get_a_collection_of_containers_filtering_by_isactive_warehouse_ids_warehouse_external_ids',
                url: '/v3.1/containers',
                name: 'Get a collection of containers filtering by isActive, warehouse ids, warehouse external ids',
                resourcePath: 'resource.items',
                queryParameters: [{
                  id: 'isActive',
                  name: 'IsActive',
                  fieldType: 'select',
                  options: ['0', '1'],
                }, {
                  id: 'warehouseIds',
                  name: 'warehouseIds',
                  description: 'Filter by warehouseId (comma separated list)',
                  fieldType: 'input',
                }, {
                  id: 'warehouseExternalIds',
                  name: 'warehouseExternalIds',
                  description: 'Filter by warehouseExternalId (comma separated list)',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_container',
                url: '/v3.1/containers/:_id',
                name: 'Get information about this container.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'warehouses',
              name: 'Warehouses',
              endpoints: [{
                id: 'get_a_collection_of_warehouses',
                url: '/v3.1/warehouses',
                name: 'Get a collection of warehouses',
                resourcePath: 'resource.items',
                queryParameters: [{
                  id: 'id',
                  name: 'id',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  fieldType: 'input',
                }, {
                  id: 'country',
                  name: 'country',
                  fieldType: 'input',
                }, {
                  id: 'generatesLabels',
                  name: 'generatesLabels',
                  fieldType: 'input',
                }, {
                  id: 'vendorId',
                  name: 'vendorId',
                  fieldType: 'input',
                }, {
                  id: 'vendorExternalId',
                  name: 'vendorExternalId',
                  fieldType: 'input',
                }, {
                  id: 'type',
                  name: 'type',
                  fieldType: 'input',
                }, {
                  id: 'name',
                  name: 'Name',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_this_warehouse',
                url: '/v3.1/warehouses/:_id',
                name: 'Get information about this warehouse',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }, {
              id: 'product',
              name: 'Product',
              endpoints: [{
                id: 'get_an_itemized_list_of_products',
                url: '/v3/products',
                name: 'Get an itemized list of products.',
                resourcePath: 'resource.items',
                supportedExportTypes: ['delta', 'test'],
                pathParameters: [],
                queryParameters: [{
                  id: 'expand',
                  name: 'expand',
                  description: 'Expand specific product data in the response -comma separated list. Valid values are: `all`, `alternateNames`, `alternativeDescriptions`, `masterCase`, `enqueuedDimensions`, `flags`, `dimensions`, `technicalData`, `innerPack`, `pallet`, `values`, `kitContent`, `inclusionRules`, and `virtualKitContent`.\t',
                  fieldType: 'input',
                }, {
                  id: 'description',
                  name: 'description',
                  description: "Filter products by matching their 'description' property.",
                  fieldType: 'input',
                }, {
                  id: 'sku',
                  name: 'sku',
                  description: "Filter products by matching their 'sku' property.",
                  fieldType: 'input',
                }, {
                  id: 'storageConfiguration',
                  name: 'storageConfiguration',
                  description: "Filter products by matching their 'storageConfiguration' property. Valid values are: `INDIVIDUAL_ITEM`, `INNER_PACK`, `MASTER_CASE`, `PALLET`, `KIT`.\t",
                  fieldType: 'select',
                  options: ['INDIVIDUAL_ITEM', 'INNER_PACK', 'MASTER_CASE', 'PALLET', 'KIT'],
                }, {
                  id: 'classification',
                  name: 'classification',
                  description: 'Filter products by their classification. Valid values are `baseProduct`, `kit`, `virtualKit`, `marketingInsert`.',
                  fieldType: 'select',
                  options: ['baseProduct', 'kit', 'virtualKit', 'marketingInsert'],
                }, {
                  id: 'includeArchived',
                  name: 'includeArchived',
                  description: 'Filter products by their archived status. Valid values are: `onlyArchived`, `includeArchived`, `excludeArchived`.',
                  fieldType: 'select',
                  options: ['onlyArchived', 'includeArchived', 'excludeArchived'],
                }, {
                  id: 'status',
                  name: 'status',
                  description: 'Filter products by their status -comma separated list. Valid values are `notinuse`, `instock`, `outofstock`.',
                  fieldType: 'input',
                }, {
                  id: 'flow',
                  name: 'flow',
                  description: 'Filter products by their current step in the flow. Valid values are `manage`, `kit`, `virtualKit`, `order`, `receiving`, and `quote`.\t',
                  fieldType: 'select',
                  options: ['manage', 'kit', 'virtualKit', 'order', 'receiving', 'quote'],
                }, {
                  id: 'ids',
                  name: 'ids',
                  description: 'Filter products by their ID -comma separated list.\t',
                  fieldType: 'input',
                }, {
                  id: 'externalId',
                  name: 'externalId',
                  description: 'Filters products by their externalId -comma seperated list',
                  fieldType: 'input',
                }, {
                  id: 'vendorId',
                  name: 'vendorId',
                  description: 'Filters products by vendorId -comma seperated list',
                  fieldType: 'input',
                }, {
                  id: 'vendorExternalId',
                  name: 'vendorExternalId',
                  description: 'Filters products by vendorEXternalId -comma seperated list',
                  fieldType: 'input',
                }, {
                  id: 'skus',
                  name: 'skus',
                  description: 'Filter products by their SKU -comma separated list.\t',
                  fieldType: 'input',
                }],
              }, {
                id: 'get_information_about_a_product',
                url: '/v3/products/:_id',
                name: 'Get information about a product.',
                doesNotSupportPaging: true,
                resourcePath: 'resource',
                pathParameters: [{
                  id: 'id',
                  name: 'Id',
                  fieldType: 'integer',
                }],
                queryParameters: [],
              }],
            }],
          }],
        },
        import: {
          labels: {
            version: 'API Version',
          },
          urlResolution: ['/v3/orders', '/v3/orders/:_id', '/v3/orders/:_id/trackings', '/v3/orders/:_id/cancel', '/v3/orders/:_id/holds/clear', '/v3/orders/:_id/markProcessed', '/v3/orders/:_id/markSubmitted', '/v3/orders/:_id/markComplete', '/v3/purchaseOrders', '/v3/purchaseOrders/:_id', '/v3/purchaseOrders/:_id/cancel', '/v3/purchaseOrders/:_id/hold', '/v3/purchaseOrders/:_id/hold/clear', '/v3/purchaseOrders/:_id/approve', '/v3/stock/adjust', '/v3/receivings', '/v3/receivings/:_id', '/v3/receivings/:_id/cancel', '/v3/receivings/:_id/labels/cancel', '/v3.1/receivings/:_id/markComplete', '/v3/returns', '/v3/returns/:_id/cancel', '/v3.1/returns/:_id/markComplete', '/v3/products', '/v3/products/:_id', '/v3.1/containers/:_id', '/v3.1/containers', '/v3.1/vendors/:_id', '/v3.1/vendors', '/v3.1/rate', '/v3.1/warehouses/:_id', '/v3.1/warehouses', '/v3.1/warehouses/:_id/retire'],
          versions: [{
            version: 'v3',
            resources: [{
              id: 'order',
              name: 'Order',
              sampleData: {
                orderNo: 'foobar1',
                externalId: 'rFooBar1',
                processAfterDate: '2014-06-10T16:30:00-07:00',
                vendorId: '567',
                items: [{
                  sku: 'Laura-s_Pen',
                  quantity: 4,
                  commercialInvoiceValue: 4.5,
                  commercialInvoiceValueCurrency: 'USD',
                  extendedAttributes: [{
                    name: 'model',
                    value: 'J44892',
                    type: 'string',
                  }],
                }],
                options: {
                  warehouseId: null,
                  warehouseExternalId: null,
                  warehouseRegion: 'LAX',
                  warehouseArea: null,
                  physicalWarehouseId: null,
                  serviceLevelCode: '1D',
                  carrierCode: null,
                  carrierAccountNumber: null,
                  billingType: null,
                  sameDay: 'NOT REQUESTED',
                  channelName: 'My Channel',
                  forceDuplicate: 0,
                  forceAddress: 0,
                  referrer: 'Foo Referrer',
                  localizationCode: null,
                  affiliate: null,
                  currency: 'USD',
                  canSplit: 1,
                  note: 'notes',
                  hold: 1,
                  holdReason: 'test reason',
                  discountCode: 'FREE STUFF',
                  server: 'Production',
                },
                shipFrom: {
                  company: "We Sell'em Co.",
                },
                shipTo: {
                  email: 'audrey.horne@greatnothern.com',
                  name: 'Audrey Horne',
                  company: "Audrey's Bikes",
                  address1: '6501 Railroad Avenue SE',
                  address2: 'Room 315',
                  address3: '',
                  city: 'Snoqualmie',
                  state: 'WA',
                  postalCode: '98065',
                  country: 'US',
                  phone: '4258882556',
                  isCommercial: 0,
                  isPoBox: 0,
                },
                commercialInvoice: {
                  shippingValue: 4.85,
                  insuranceValue: 6.57,
                  additionalValue: 8.29,
                  shippingValueCurrency: 'USD',
                  insuranceValueCurrency: 'USD',
                  additionalValueCurrency: 'USD',
                },
                packingList: {
                  message1: {
                    body: 'This must be where pies go when they die. Enjoy!',
                    header: 'Enjoy this product!',
                  },
                },
                extendedAttributes: [{
                  name: 'returnInstruction',
                  value: 'Mail in or store',
                  type: 'string',
                }, {
                  name: 'manufacturingId',
                  value: 2349802398,
                  type: 'int',
                }],
              },
              operations: [{
                id: 'create_order',
                name: 'Create',
                url: '/v3/orders',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'update_order',
                name: 'Update',
                url: '/v3/orders/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'create_or_update_order',
                name: 'Create or Update',
                url: ['/v3/orders/:_id', '/v3/orders'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'create_trackings',
                name: 'Create Trackings',
                url: '/v3/orders/:_id/trackings',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                sampleData: {
                  orderId: 12345,
                  pieceId: 7865,
                  orderExternalId: '',
                  carrierCode: 'FDX GDH',
                  labelCreatedDate: '2014-01-29T08:57:04-08:00',
                  trackedDate: '2014-01-29T08:57:04-08:00',
                  firstScanDate: '2014-01-29T08:57:04-08:00',
                  firstScanCity: 'San Jose',
                  firstScanRegion: 'CA',
                  firstScanPostalCode: '95129',
                  firstScanCountry: 'US',
                  deliveryRegion: 'CA',
                  deliveryPostalCode: '94089',
                  deliveryCountry: 'US',
                  createdDate: '2014-01-29T08:57:04-08:00',
                },
              }, {
                id: 'cancel_orders',
                name: 'Cancel',
                url: '/v3/orders/:_id/cancel',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'clear_hold',
                name: 'Clear Hold',
                url: '/v3/orders/:_id/holds/clear',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'mark_processed',
                name: 'Mark Processed',
                url: '/v3/orders/:_id/markProcessed',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'mark_submitted',
                name: 'Mark Submitted',
                url: '/v3/orders/:_id/markSubmitted',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }, {
                id: 'mark_complete_orders',
                name: 'Mark Complete',
                url: '/v3/orders/:_id/markComplete',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/orders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_orders',
                  },
                },
              }],
            }, {
              id: 'purchaseorder',
              name: 'Purchase Order',
              sampleData: {
                externalId: 'rFooBar1',
                purchaseOrderNo: 'foobar1',
                purchaseOrderDate: '2014-06-10T16:30:00-07:00',
                processAfterDate: '2014-06-10T16:30:00-07:00',
                requestedShipDate: '2014-06-10T16:30:00-07:00',
                channelName: 'BestBuy',
                id: 665160,
                transactionId: '1559211883-899723-1',
                status: 'onHold',
                needsReview: 0,
                hasFulfillmentHolds: 0,
                holds: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/holds?offset=0&limit=20',
                },
                trackings: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/trackings?offset=0&limit=20',
                },
                billTo: {
                  resourceLocation: null,
                  resource: {
                    email: 'audrey.horne@greatnothern.com',
                    name: 'Audrey Horne',
                    company: "Audrey's Bikes",
                    address1: '6501 RAILROAD AVE SE',
                    address2: 'ROOM 315',
                    address3: '',
                    city: 'SNOQUALMIE',
                    state: 'WA',
                    postalCode: '98065',
                    country: 'US',
                    phone: '4258882556',
                    isCommercial: 0,
                    isPoBox: 0,
                  },
                },
                shipTo: {
                  resourceLocation: null,
                  resource: {
                    email: 'audrey.horne@greatnothern.com',
                    name: 'Audrey Horne',
                    company: "Audrey's Bikes",
                    address1: '6501 RAILROAD AVE SE',
                    address2: 'ROOM 315',
                    address3: '',
                    city: 'SNOQUALMIE',
                    state: 'WA',
                    postalCode: '98065',
                    country: 'US',
                    phone: '4258882556',
                    isCommercial: 0,
                    isPoBox: 0,
                  },
                },
                shipFrom: {
                  resourceLocation: null,
                  resource: {
                    company: "We Sell'em Co.",
                  },
                },
                items: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/items?offset=0&limit=20',
                },
                orders: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/orders?offset=0&limit=0',
                  resource: {
                    offset: 0,
                    total: 0,
                    previous: null,
                    next: null,
                    items: [],
                  },
                },
                options: {
                  resourceLocation: null,
                  resource: {
                    warehouseId: null,
                    physicalWarehouseId: null,
                    billingType: null,
                    carrierAccountNumber: null,
                    warehouseExternalId: null,
                    warehouseRegion: null,
                    warehouseArea: null,
                    serviceLevelCode: '1D',
                    carrierCode: null,
                    scacCode: null,
                    sameDay: 'NOT REQUESTED',
                    forceDuplicate: 0,
                    forceAddress: 0,
                    localizationCode: 'en_US',
                    referrer: 'Foo Referrer',
                    isHeld: 1,
                    isApproved: 1,
                  },
                },
                fulfillmentOptions: {
                  resourceLocation: null,
                  resource: {
                    type: 'SHORT_SHIP',
                    requireMinimumQuantity: 1,
                    shortShipMinimumQuantity: 20,
                  },
                },
                commercialInvoice: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/commercialInvoice',
                  resource: {
                    shippingValue: 4.85,
                    insuranceValue: 6.57,
                    additionalValue: 8.29,
                    documentLocation: null,
                  },
                },
                events: {
                  resourceLocation: null,
                  resource: {
                    purchaseOrderDate: '2014-06-10T16:30:00-07:00',
                    requestedShipDate: '2014-06-10T16:30:00-07:00',
                    createdDate: '2019-08-27T23:18:34-07:00',
                    completedDate: null,
                    canceledDate: null,
                    approvalDate: null,
                    lastManualUpdate: '2019-05-30T03:24:47-0700',
                  },
                },
                routing: {
                  resourceLocation: null,
                  resource: {
                    warehouseId: null,
                    physicalWarehouseId: null,
                    warehouseExternalId: null,
                    warehouseName: null,
                    originLongitude: null,
                    originLatitude: null,
                    destinationLongitude: -121.8225,
                    destinationLatitude: 47.5293,
                  },
                },
                packingList: {
                  resourceLocation: null,
                  resource: {
                    customData: null,
                    message1: {
                      resourceLocation: null,
                      resource: {
                        header: 'Enjoy this product!',
                        body: 'This must be where pies go when they die. Enjoy!',
                      },
                    },
                    message2: {
                      resourceLocation: null,
                      resource: {
                        header: null,
                        body: null,
                      },
                    },
                    message3: {
                      resourceLocation: null,
                      resource: {
                        header: null,
                        body: null,
                      },
                    },
                    other: {
                      resourceLocation: null,
                      resource: {
                        header: null,
                        body: null,
                      },
                    },
                    customFilename: null,
                    customFileContents: null,
                  },
                },
                extendedAttributes: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/purchaseOrders/665160/extendedAttributes?offset=0&limit=20',
                  resource: {
                    offset: 0,
                    total: 1,
                    previous: null,
                    next: null,
                    items: [{
                      resourceLocation: null,
                      resource: {
                        name: 'StoreNumber',
                        value: 14256,
                        type: 'int',
                      },
                    }],
                  },
                },
                shippingWindow: {
                  resourceLocation: null,
                  resource: {
                    type: 'BETWEEN',
                    minDate: '2016-01-29T14:00:00-08:00',
                    maxDate: '2016-01-30T14:00:00-08:00',
                  },
                },
                deliveryWindow: {
                  resourceLocation: null,
                  resource: {
                    type: 'BETWEEN',
                    minDate: '2016-01-29T14:00:00-08:00',
                    maxDate: '2016-01-30T14:00:00-08:00',
                  },
                },
              },
              operations: [{
                id: 'create_purchaseorder',
                name: 'Create',
                url: '/v3/purchaseOrders',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'update_purchaseorder',
                name: 'Update',
                url: '/v3/purchaseOrders/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'create_or_update_purchaseorder',
                name: 'Create or Update',
                url: ['/v3/purchaseOrders/:_id', '/v3/purchaseOrders'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'cancel_purchaseorders',
                name: 'Cancel',
                url: '/v3/purchaseOrders/:_id/cancel',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'hold',
                name: 'Hold',
                url: '/v3/purchaseOrders/:_id/hold',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'clear_hold',
                name: 'Clear Hold',
                url: '/v3/purchaseOrders/:_id/hold/clear',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }, {
                id: 'approve',
                name: 'Approve',
                url: '/v3/purchaseOrders/:_id/approve',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/purchaseOrders',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_purchase_orders',
                  },
                },
              }],
            }, {
              id: 'stock',
              name: 'Stock',
              sampleData: {
                offset: 0,
                total: 22,
                previous: null,
                next: 'https://api.beta.shipwire.com/api/v3/stock?offset=20&limit=20',
                items: [{
                  resourceLocation: null,
                  resource: {
                    productId: 246736,
                    productExternalId: null,
                    vendorId: null,
                    vendorExternalId: null,
                    sku: 'A2735',
                    isBundle: 0,
                    isAlias: 0,
                    warehouseRegion: 'TEST 1',
                    warehouseId: 10333,
                    physicalWarehouseId: null,
                    warehouseExternalId: null,
                    pending: 0,
                    good: 82,
                    reserved: 18,
                    backordered: 0,
                    shipping: 0,
                    shipped: 0,
                    creating: 0,
                    consuming: 0,
                    consumed: 0,
                    created: 0,
                    damaged: 0,
                    returned: 0,
                    inreview: 0,
                    availableDate: null,
                    shippedLastDay: 0,
                    shippedLastWeek: 0,
                    shippedLast4Weeks: 0,
                    orderedLastDay: 0,
                    orderedLastWeek: 0,
                    orderedLast4Weeks: 0,
                  },
                }],
              },
              operations: [{
                id: 'create_stock',
                name: 'Create',
                url: '/v3/stock/adjust',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/stock',
                    extract: 'resource.items[0].resource.productId',
                    id: 'get_stock_information_for_your_products',
                  },
                },
              }],
            }, {
              id: 'receiving',
              name: 'Receiving',
              sampleData: {
                externalId: null,
                orderNo: '',
                id: 92435769,
                transactionId: '1492626375',
                expectedDate: '2017-04-20T00:00:00-07:00',
                commerceName: 'Shipwire',
                lastUpdatedDate: '2017-04-19T11:26:26-07:00',
                status: 'completed',
                vendorId: null,
                vendorExternalId: null,
                items: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/items?offset=0&limit=20',
                },
                holds: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/holds?offset=0&limit=20',
                },
                trackings: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/trackings?offset=0&limit=20',
                },
                shipments: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/shipments?offset=0&limit=20',
                },
                labels: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/labels?offset=0&limit=20',
                },
                instructionsRecipients: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/instructionsRecipients?offset=0&limit=20',
                },
                options: {
                  resourceLocation: null,
                  resource: {
                    warehouseId: 10333,
                    warehouseExternalId: null,
                    warehouseRegion: 'TEST 1',
                  },
                },
                arrangement: {
                  resourceLocation: null,
                  resource: {
                    type: 'none',
                    contact: '',
                    phone: '',
                  },
                },
                shipFrom: {
                  resourceLocation: null,
                  resource: {
                    email: '',
                    name: null,
                    address1: null,
                    address2: null,
                    address3: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    country: null,
                    phone: '',
                  },
                },
                routing: {
                  resourceLocation: null,
                  resource: {
                    warehouseId: 10333,
                    warehouseExternalId: null,
                    warehouseName: 'Test Warehouse',
                    originLongitude: 37.5516,
                    originLatitude: -122.264,
                    warehouseRegion: 'TEST 1',
                  },
                },
                events: {
                  resourceLocation: null,
                  resource: {
                    createdDate: '2017-04-19T11:26:15-07:00',
                    pickedUpDate: null,
                    submittedDate: null,
                    processedDate: '2017-04-19T11:26:26-07:00',
                    completedDate: '2017-04-19T11:26:26-07:00',
                    expectedDate: '2017-04-20T00:00:00-07:00',
                    deliveredDate: null,
                    cancelledDate: null,
                    returnedDate: null,
                    lastManualUpdateDate: null,
                  },
                },
                documents: {
                  resourceLocation: null,
                  resource: {
                    genericLabel: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/documents/genericLabel',
                    receivingGuide: 'https://dnjngsjloxeb.cloudfront.net/content/uploads/2016/08/26223422/Receiving_Guide_Final.pdf',
                  },
                },
                extendedAttributes: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3/receivings/92435769/extendedAttributes?offset=0&limit=20',
                  resource: {
                    offset: 0,
                    total: 0,
                    previous: null,
                    next: null,
                    items: [],
                  },
                },
              },
              operations: [{
                id: 'create_receiving',
                name: 'Create',
                url: '/v3/receivings',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }, {
                id: 'update_receiving',
                name: 'Update',
                url: '/v3/receivings/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }, {
                id: 'create_or_update_receiving',
                name: 'Create or Update',
                url: ['/v3/receivings/:_id', '/v3/receivings'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }, {
                id: 'cancel_receivings',
                name: 'Cancel',
                url: '/v3/receivings/:_id/cancel',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }, {
                id: 'cancel_shipping_labels',
                name: 'Cancel Shipping Labels',
                url: '/v3/receivings/:_id/labels/cancel',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }, {
                id: 'mark_complete_receivings',
                name: 'Mark Complete',
                url: '/v3.1/receivings/:_id/markComplete',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/receivings',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_receivings',
                  },
                },
              }],
            }, {
              id: 'return',
              name: 'Return',
              sampleData: {
                externalId: 'eId123',
                originalOrder: {
                  id: 92435791,
                },
                items: [{
                  sku: 'A2719',
                  quantity: 1,
                }],
                options: {
                  generatePrepaidLabel: 1,
                  emailCustomer: 1,
                  warehouseId: 11,
                  warehouseExternalId: 12,
                  warehouseRegion: 'LAX',
                },
              },
              operations: [{
                id: 'create_return',
                name: 'Create',
                url: '/v3/returns',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/returns',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_returns',
                  },
                },
              }, {
                id: 'cancel_returns',
                name: 'Cancel',
                url: '/v3/returns/:_id/cancel',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/returns',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_returns',
                  },
                },
              }, {
                id: 'mark_complete_returns',
                name: 'Mark Complete',
                url: '/v3.1/returns/:_id/markComplete',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/returns',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_returns',
                  },
                },
              }],
            }, {
              id: 'rate',
              name: 'Rate',
              sampleData: {
                options: {
                  currency: 'USD',
                  canSplit: 1,
                  warehouseArea: 'US',
                  channelName: 'My Channel',
                  expectedShipDate: '2017-012-28T10:00:00-04:00',
                  highAccuracyEstimates: 1,
                  returnAllRates: 1,
                },
                order: {
                  shipTo: {
                    address1: 'pragathinagar',
                    address2: 'jntu',
                    address3: '',
                    city: 'hyderabad',
                    postalCode: '500008',
                    state: 'ts',
                    country: 'IN',
                    isCommercial: 0,
                    isPoBox: 0,
                  },
                  items: [{
                    sku: 'Laura-s_Pen',
                    quantity: 1,
                  }, {
                    sku: 'TwinPianos',
                    quantity: 1,
                  }],
                },
              },
              operations: [{
                id: 'create_rate',
                name: 'Create',
                url: '/v3.1/rate',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
              }],
            }, {
              id: 'containers',
              name: 'Containers',
              sampleData: {
                id: 990126,
                externalId: '1011',
                name: '45.00 X 8.00 X 7.00 box',
                type: 'box',
                isActive: 1,
                warehouseId: 10355,
                basis: '5045.00',
                serviceSpecificCarrierCode: 'FDX FT',
                dimensions: {
                  length: '20.00',
                  width: '8.00',
                  height: '7.00',
                  weight: '0.48',
                  maxWeight: '40.0000',
                },
                values: {
                  costValue: '10.00',
                  retailValue: '50.00',
                },
              },
              values: {
                resourceLocation: null,
                resource: {
                  costValue: '0.00',
                  retailValue: '0.00',
                  costValueCurrency: 'USD',
                  retailValueCurrency: 'USD',
                },
              },
              operations: [{
                id: 'create_containers',
                name: 'Create',
                url: '/v3.1/containers',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/containers',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_containers_filtering_by_isactive_warehouse_ids_warehouse_external_ids',
                  },
                },
              }, {
                id: 'update_containers',
                name: 'Update',
                url: '/v3.1/containers/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/containers',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_containers_filtering_by_isactive_warehouse_ids_warehouse_external_ids',
                  },
                },
              }, {
                id: 'create_or_update_containers',
                name: 'Create or Update',
                url: ['/v3.1/containers/:_id', '/v3.1/containers'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/containers',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_containers_filtering_by_isactive_warehouse_ids_warehouse_external_ids',
                  },
                },
              }],
            }, {
              id: 'vendors',
              name: 'Vendors',
              sampleData: {
                name: 'Honest Company',
                status: 'active',
                description: 'An honest widge',
                externalId: '1035',
                address: {
                  name: 'Honest',
                  email: 'customer@widgets.com',
                  phone: '555-555-4455',
                  fax: '555-555-5556',
                  address1: '789 Indio way',
                  city: 'Sunny',
                  state: 'CA',
                  postalCode: '94085',
                  country: 'US',
                },
                extendedAttributes: [{
                  name: 'alternateEmail',
                  value: 'customersupport2@widgets.com',
                  type: 'string',
                }],
              },
              operations: [{
                id: 'create_vendors',
                name: 'Create',
                url: '/v3.1/vendors',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/vendors',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_vendors_filtering_by_vendor_ids_external_ids_vendor_names_vendor_status',
                  },
                },
              }, {
                id: 'update_vendors',
                name: 'Update',
                url: '/v3.1/vendors/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/vendors',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_vendors_filtering_by_vendor_ids_external_ids_vendor_names_vendor_status',
                  },
                },
              }, {
                id: 'create_or_update_vendors',
                name: 'Create or Update',
                url: ['/v3.1/vendors/:_id', '/v3.1/vendors'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/vendors',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_vendors_filtering_by_vendor_ids_external_ids_vendor_names_vendor_status',
                  },
                },
              }],
            }, {
              id: 'warehouses',
              name: 'Warehouses',
              sampleData: {
                id: 10333,
                externalId: '',
                name: 'Test Warehouse',
                code: 'TEST 1',
                vendorId: '',
                vendorExternalId: '',
                isActive: 1,
                address: {
                  resourceLocation: '',
                  resource: {
                    address1: '1820 Gateway Drive',
                    address2: '',
                    address3: '',
                    city: 'San Jose',
                    state: 'California',
                    postalCode: '94404',
                    country: 'US',
                    continent: 'NORTH_AMERICA',
                    name: 'Celigo Labs',
                    email: '',
                    phone: '989-898-9898',
                    fax: '',
                  },
                },
                latitude: 37.5516,
                longitude: -122.264,
                isRoutable: 0,
                generatesLabels: 1,
                type: 'SHIPWIRE ANYWHERE',
                labelFormat: '8.5x11',
                returnWarehouseId: null,
                returnWarehouseExternalId: null,
                seedWithTypicalContainers: null,
                physicalWarehouseId: null,
                containers: {
                  resourceLocation: 'https://api.beta.shipwire.com/api/v3.1/warehouses/10333/containers?offset=0&limit=20',
                },
                carriers: null,
              },
              operations: [{
                id: 'create_warehouses',
                name: 'Create',
                url: '/v3.1/warehouses',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/warehouses',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_warehouses',
                  },
                },
              }, {
                id: 'indicates_that_the_warehouse_will_not_longer_be_used',
                name: 'Indicates that the warehouse will not longer be used',
                url: '/v3.1/warehouses/:_id/retire',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/warehouses',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_warehouses',
                  },
                },
              }, {
                id: 'update_warehouses',
                name: 'Update',
                url: '/v3.1/warehouses/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/warehouses',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_warehouses',
                  },
                },
              }, {
                id: 'create_or_update_warehouses',
                name: 'Create or Update',
                url: ['/v3.1/warehouses/:_id', '/v3.1/warehouses'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3.1/warehouses',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_a_collection_of_warehouses',
                  },
                },
              }],
            }, {
              id: 'product',
              name: 'Product',
              sampleData: {
                sku: 'sportsWatch',
                externalId: 'narp',
              },
              operations: [{
                id: 'create_product',
                name: 'Create',
                url: '/v3/products',
                method: 'POST',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreExisting: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/products',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_products',
                  },
                },
              }, {
                id: 'update_product',
                name: 'Update',
                url: '/v3/products/:_id',
                method: 'PUT',
                successPath: 'resource.items',
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                supportIgnoreMissing: true,
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/products',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_products',
                  },
                },
              }, {
                id: 'create_or_update_product',
                name: 'Create or Update',
                url: ['/v3/products/:_id', '/v3/products'],
                method: ['PUT', 'POST'],
                successPath: ['resource.items', 'resource.items'],
                parameters: [{
                  id: 'id',
                  in: 'path',
                  required: true,
                  isIdentifier: true,
                }],
                howToFindIdentifier: {
                  lookup: {
                    url: '/v3/products',
                    extract: 'resource.items[0].resource.id',
                    id: 'get_an_itemized_list_of_products',
                  },
                },
              }],
            }],
          }],
        },
      };

      const expectedSampleData = {
        sku: 'sportsWatch',
        externalId: 'narp',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), assistantMetadata],
        ])
        .not.call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .put(
          actions.metadata.receivedAssistantImportPreview(
            'someId',
            expectedSampleData
          )
        )
        .run();
    });

    test('should dispatch failed preview action when there is no sample data on import', () => {
      const resource = {
        _id: 'someId',
        adaptorType: 'RESTImport',
        assistant: 'shipwire',
      };

      return expectSaga(_fetchAssistantSampleData, { resource })
        .provide([
          [select(selectors.assistantData, {
            adaptorType: 'rest',
            assistant: 'shipwire',
          }), {}],
        ])
        .not.call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'shipwire',
        })
        .not.put(
          actions.metadata.receivedAssistantImportPreview(
            'someId',
            ''
          )
        )
        .put(actions.metadata.failedAssistantImportPreview('someId'))
        .run();
    });
  });
});
