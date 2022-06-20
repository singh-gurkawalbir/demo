import { API } from '../utils';

export default API.get('/api/exports',
  [
    {
      _id: '629f0db3ccb94d35de6f4367',
      createdAt: '2022-06-07T08:34:59.858Z',
      lastModified: '2022-06-07T08:35:00.020Z',
      name: 'Any',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'e1004e644e',
      asynchronous: true,
      type: 'simple',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      http: {
        relativeURI: '/test',
        method: 'GET',
        formType: 'http',
      },
      test: {
        limit: 1,
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '62a196ce1bf5be58603a5416',
      rawData: 'somethingh',
      createdAt: '2022-06-09T06:44:30.220Z',
      lastModified: '2022-06-09T06:44:30.304Z',
      name: 'Any',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'e5dc82dbb1',
      asynchronous: true,
      type: 'simple',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      http: {
        relativeURI: '/',
        method: 'GET',
        formType: 'http',
      },
      test: {
        limit: 1,
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '62a647b96e4b5b50f556057a',
      createdAt: '2022-06-12T20:08:25.708Z',
      lastModified: '2022-06-12T20:08:25.773Z',
      name: 'random',
      _connectionId: '629f0cb2d5391a2e79b99d99',
      apiIdentifier: 'e1c8c7aa8c',
      asynchronous: true,
      sandbox: false,
      parsers: [],
      sampleData: 'ISA*02',
      ftp: {
        directoryPath: '/',
      },
      file: {
        output: 'records',
        skipDelete: false,
        type: 'filedefinition',
        fileDefinition: {
          _fileDefinitionId: '62a647b86e4b5b50f5560578',
        },
      },
      adaptorType: 'FTPExport',
    },
    {
      _id: '629f0db3ccb94d35de6f4364',
      createdAt: '2022-06-07T08:34:59.858Z',
      lastModified: '2022-06-07T08:35:00.020Z',
      name: 'Any',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'e1004e644e',
      asynchronous: true,
      type: 'test',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      http: {
        relativeURI: '/test',
        method: 'GET',
        formType: 'http',
      },
      test: {
        limit: 1,
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '52a196ce1bf5be58603a5418',
      createdAt: '2022-06-09T06:44:30.220Z',
      lastModified: '2022-06-09T06:44:30.304Z',
      name: 'no integration flow',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'e5dc82dbb1',
      asynchronous: true,
      type: 'simple',
      oneToMany: false,
      sandbox: false,
      parsers: [],
      http: {
        relativeURI: '/',
        method: 'GET',
        formType: 'http',
      },
      test: {
        limit: 1,
      },
      adaptorType: 'RESTExport',
    },
    {
      _id: '52a196ce1bf5be58603a5417',
      createdAt: '2022-06-12T20:08:25.708Z',
      lastModified: '2022-06-12T20:08:25.773Z',
      name: 'random',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'e1c8c7aa8c',
      asynchronous: true,
      sandbox: false,
      parsers: [],
      sampleData: 'ISA*02',
      ftp: {
        directoryPath: '/',
      },
      file: {
        output: 'records',
        skipDelete: false,
        type: 'filedefinition',
        fileDefinition: {
          _fileDefinitionId: '62a647b86e4b5b50f5560578',
        },
        xlsx: {
          keyColumns: ['1', '2'],
        },
      },
      adaptorType: '',
    },
    {
      _id: '5c9b5d5646fc7429c2a405fa',
      createdAt: '2019-03-27T11:24:06.069Z',
      lastModified: '2021-11-15T06:17:42.689Z',
      name: 'Amazon (FBA) List Orders Export Adaptor',
      _connectionId: '5c9b5bfb46fc7429c2a40508',
      _integrationId: '5c9b5bfaccf55e2a5c140233',
      _connectorId: '58777a2b1008fb325e6c0953',
      externalId: 'amazon_fba_list_orders_export_adaptor',
      apiIdentifier: 'eef1268f7a',
      asynchronous: true,
      type: 'delta',
      pageSize: 20,
      hooks: {
        preSavePage: {
          function: 'fbaListOrdersImportPreSavePageHook',
        },
      },
      http: {
        relativeURI: '/Orders/2013-09-01?Action=ListOrders&MarketplaceId.Id.1={{connection.http.unencrypted.marketplaceId}}&LastUpdatedAfter={{{encodeURI (dateFormat "YYYY-MM-DDTHH:mm:ssZ" (dateAdd lastExportDateTime))}}}&OrderStatus.Status.1=Shipped&FulfillmentChannel.Channel.1=AFN',
        method: 'POST',
        requestMediaType: 'xml',
        formType: 'http',
        paging: {
          method: 'token',
          path: '/ListOrdersResponse/ListOrdersResult/NextToken/text()',
          relativeURI: '/Orders/2013-09-01?Action=ListOrdersByNextToken&NextToken={{{encodeURI export.http.paging.token}}}',
          pathAfterFirstRequest: '/ListOrdersByNextTokenResponse/ListOrdersByNextTokenResult/NextToken/text()',
          resourcePath: "//*[local-name() = 'Order']",
        },
        response: {
          resourcePath: "//*[local-name() = 'Order']",
        },
      },
      sampleData: {
        OrderTotal: {
          CurrencyCode: 'USD',
          Amount: '0.50',
        },
        IsISPU: 'false',
        ShippingAddress: {
          firstname: 'Tejasree',
          lastname: 'Naram',
          StateOrRegion: 'CA',
          City: 'REDWOOD CITY',
          CountryCode: 'US',
          PostalCode: '94065-1499',
          Name: 'NTejasree_Celigo_Updated',
          AddressLine1: '230 TWIN DOLPHIN DR',
          AddressLine2: 'NEAR OLD CHURCH',
          AddressLine3: 'AddressLine3',
          County: 'County',
          District: 'District',
          Phone: '9502950995',
        },
        LatestShipDate: '2017-02-25T07:59:59Z',
        OrderType: 'StandardOrder',
        PurchaseDate: '2017-02-22T10:24:42Z',
        BuyerEmail: 'l6mx1rm3q40yrxn@marketplace.amazon.com',
        AmazonOrderId: '107-7474221-2410612',
        LastUpdateDate: '2017-02-23T07:49:05Z',
        ShipServiceLevel: 'Std US D2D Dom',
        NumberOfItemsShipped: '1',
        OrderStatus: 'Shipped',
        SalesChannel: 'Amazon.com',
        ShippedByAmazonTFM: 'false',
        IsBusinessOrder: 'false',
        LatestDeliveryDate: '2017-03-04T07:59:59Z',
        NumberOfItemsUnshipped: '0',
        fullname: 'Tejasree Naram',
        firstname: 'Tejasree',
        lastname: 'Naram',
        BuyerName: 'Tejasree Naram',
        IsGlobalExpressEnabled: 'false',
        IsSoldByAB: 'false',
        EarliestDeliveryDate: '2017-02-28T08:00:00Z',
        IsPremiumOrder: 'false',
        EarliestShipDate: '2017-02-23T08:00:00Z',
        MarketplaceId: 'ATVPDKIKX0DER',
        FulfillmentChannel: 'MFN',
        PaymentMethod: 'Other',
        IsPrime: 'false',
        ShipmentServiceLevelCategory: 'Standard',
        SellerOrderId: 'SellerOrderId',
        OrderChannel: 'OrderChannel',
        PaymentMethodDetails: [
          {
            PaymentMethodDetail: [
              'CreditCard',
            ],
          },
        ],
        IsReplacementOrder: 'false',
        ReplacedOrderId: 'ReplaceOrderId',
        BuyerTaxInfo: [
          {
            TaxClassifications: [
              {
                TaxClassification: [
                  {
                    Name: [
                      'VATNumber',
                    ],
                    Value: [
                      'XXX123',
                    ],
                  },
                ],
              },
            ],
            CompanyLegalName: [
              'Company Name',
            ],
            TaxingRegion: [
              'US',
            ],
          },
        ],
        TaxRegistrationDetails: [
          {
            member: [
              {
                taxRegistrationAuthority: {
                  country: 'DE',
                },
                taxRegistrationId: 'DE123456789',
                taxRegistrationType: 'VAT',
              },
            ],
          },
        ],
        CbaDisplayableShippingLabel: 'CbaDisplayableShippingLabel',
        PurchaseOrderNumber: 'PurchaseOrderNumber',
        OrderItem: [
          {
            ShippingTax: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            PromotionDiscount: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            PromotionDiscountTax: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            GiftWrapTax: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            ShippingPrice: {
              CurrencyCode: 'USD',
              Amount: '0.49',
            },
            GiftWrapPrice: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            ItemPrice: {
              CurrencyCode: 'USD',
              Amount: '0.01',
            },
            ItemTax: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            ShippingDiscount: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            ShippingDiscountTax: {
              CurrencyCode: 'USD',
              Amount: '0.00',
            },
            PromotionIds: [
              {
                PromotionId: [
                  'US Core Free Shipping',
                ],
              },
            ],
            StoreChainStoreId: 'storechainstoreid',
            QuantityOrdered: '1',
            Title: 'AmazonSS12',
            ConditionId: 'Used',
            ASIN: 'B06XMXV2YN',
            SellerSKU: 'AmazonSS12',
            OrderItemId: '07758667199018',
            IossNumber: 'IMXXXYYYYYYZ',
            QuantityShipped: '1',
            ConditionSubtypeId: 'Good',
            BuyerCustomizedInfo: [
              {
                CustomizedURL: [
                  'https://zme-caps.amazon.com/t/bR6qHkzSOxuB/J8nbWhze0Bd3DkajkOdY-XQbWkFralegp2sr_QZiKEE/1',
                ],
              },
            ],
            GiftMessageText: 'For you!',
            GiftWrapLevel: 'Classic',
            ConditionNote: 'Example ConditionNote',
            PriceDesignation: 'BusinessPrice',
            ProductInfo: {
              NumberOfItems: '10',
            },
            IsGift: false,
            TaxCollection: {
              Model: 'MarketplaceFacilitator',
              ResponsibleParty: 'Amazon Services, Inc.',
            },
          },
        ],
      },
      delta: {
        dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
        lagOffset: 300000,
      },
      transform: {
        type: 'expression',
        expression: {
          rules: [
            [
              {
                extract: '/LatestShipDate',
                generate: 'LatestShipDate',
              },
              {
                extract: '/OrderType',
                generate: 'OrderType',
              },
              {
                extract: '/PurchaseDate',
                generate: 'PurchaseDate',
              },
              {
                extract: '/BuyerEmail',
                generate: 'BuyerEmail',
              },
              {
                extract: '/AmazonOrderId',
                generate: 'AmazonOrderId',
              },
              {
                extract: '/LastUpdateDate',
                generate: 'LastUpdateDate',
              },
              {
                extract: '/ShipServiceLevel',
                generate: 'ShipServiceLevel',
              },
              {
                extract: '/NumberOfItemsShipped',
                generate: 'NumberOfItemsShipped',
              },
              {
                extract: '/OrderStatus',
                generate: 'OrderStatus',
              },
              {
                extract: '/SalesChannel',
                generate: 'SalesChannel',
              },
              {
                extract: '/ShippedByAmazonTFM',
                generate: 'ShippedByAmazonTFM',
              },
              {
                extract: '/IsBusinessOrder',
                generate: 'IsBusinessOrder',
              },
              {
                extract: '/LatestDeliveryDate',
                generate: 'LatestDeliveryDate',
              },
              {
                extract: '/NumberOfItemsUnshipped',
                generate: 'NumberOfItemsUnshipped',
              },
              {
                extract: '/BuyerName',
                generate: 'BuyerName',
              },
              {
                extract: '/IsGlobalExpressEnabled',
                generate: 'IsGlobalExpressEnabled',
              },
              {
                extract: '/IsSoldByAB',
                generate: 'IsSoldByAB',
              },
              {
                extract: '/EarliestDeliveryDate',
                generate: 'EarliestDeliveryDate',
              },
              {
                extract: '/OrderTotal/CurrencyCode',
                generate: 'OrderTotal.CurrencyCode',
              },
              {
                extract: '/OrderTotal/Amount',
                generate: 'OrderTotal.Amount',
              },
              {
                extract: '/IsPremiumOrder',
                generate: 'IsPremiumOrder',
              },
              {
                extract: '/EarliestShipDate',
                generate: 'EarliestShipDate',
              },
              {
                extract: '/MarketplaceId',
                generate: 'MarketplaceId',
              },
              {
                extract: '/FulfillmentChannel',
                generate: 'FulfillmentChannel',
              },
              {
                extract: '/PaymentMethod',
                generate: 'PaymentMethod',
              },
              {
                extract: '/ShippingAddress/StateOrRegion',
                generate: 'ShippingAddress.StateOrRegion',
              },
              {
                extract: '/ShippingAddress/City',
                generate: 'ShippingAddress.City',
              },
              {
                extract: '/ShippingAddress/CountryCode',
                generate: 'ShippingAddress.CountryCode',
              },
              {
                extract: '/ShippingAddress/PostalCode',
                generate: 'ShippingAddress.PostalCode',
              },
              {
                extract: '/ShippingAddress/Name',
                generate: 'ShippingAddress.Name',
              },
              {
                extract: '/ShippingAddress/AddressLine1',
                generate: 'ShippingAddress.AddressLine1',
              },
              {
                extract: '/ShippingAddress/AddressLine2',
                generate: 'ShippingAddress.AddressLine2',
              },
              {
                extract: '/ShippingAddress/Phone',
                generate: 'ShippingAddress.Phone',
              },
              {
                extract: '/ShippingAddress/AddressType',
                generate: 'ShippingAddress.AddressType',
              },
              {
                extract: '/IsPrime',
                generate: 'IsPrime',
              },
              {
                extract: '/ShipmentServiceLevelCategory',
                generate: 'ShipmentServiceLevelCategory',
              },
              {
                extract: '/SellerOrderId',
                generate: 'SellerOrderId',
              },
              {
                extract: '/OrderChannel',
                generate: 'OrderChannel',
              },
              {
                extract: '/ShippingAddress/AddressLine3',
                generate: 'ShippingAddress.AddressLine3',
              },
              {
                extract: '/ShippingAddress/County',
                generate: 'ShippingAddress.County',
              },
              {
                extract: '/ShippingAddress/District',
                generate: 'ShippingAddress.District',
              },
              {
                extract: '/PaymentMethodDetails[0]/PaymentMethodDetail[*]',
                generate: 'PaymentMethodDetails[0].PaymentMethodDetail[*]',
              },
              {
                extract: '/IsReplacementOrder',
                generate: 'IsReplacementOrder',
              },
              {
                extract: '/ReplacedOrderId',
                generate: 'ReplacedOrderId',
              },
              {
                extract: '/BuyerTaxInfo[0]/CompanyLegalName',
                generate: 'BuyerTaxInfo[0].CompanyLegalName[0]',
              },
              {
                extract: '/BuyerTaxInfo[0]/TaxingRegion',
                generate: 'BuyerTaxInfo[0].TaxingRegion[0]',
              },
              {
                extract: '/BuyerTaxInfo[0]/TaxClassifications[*]/TaxClassification[*]/Name',
                generate: 'BuyerTaxInfo[0].TaxClassifications[0].TaxClassification[*].Name[0]',
              },
              {
                extract: '/BuyerTaxInfo[0]/TaxClassifications[*]/TaxClassification[*]/Value',
                generate: 'BuyerTaxInfo[0].TaxClassifications[0].TaxClassification[*].Value[0]',
              },
              {
                extract: '/CbaDisplayableShippingLabel',
                generate: 'CbaDisplayableShippingLabel',
              },
              {
                extract: '/PurchaseOrderNumber',
                generate: 'PurchaseOrderNumber',
              },
              {
                extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationId',
                generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationId',
              },
              {
                extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationAuthority/country',
                generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationAuthority.country',
              },
              {
                extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationType',
                generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationType',
              },
            ],
          ],
          version: '1',
        },
        version: '1',
        rules: [
          [
            {
              extract: '/LatestShipDate',
              generate: 'LatestShipDate',
            },
            {
              extract: '/OrderType',
              generate: 'OrderType',
            },
            {
              extract: '/PurchaseDate',
              generate: 'PurchaseDate',
            },
            {
              extract: '/BuyerEmail',
              generate: 'BuyerEmail',
            },
            {
              extract: '/AmazonOrderId',
              generate: 'AmazonOrderId',
            },
            {
              extract: '/LastUpdateDate',
              generate: 'LastUpdateDate',
            },
            {
              extract: '/ShipServiceLevel',
              generate: 'ShipServiceLevel',
            },
            {
              extract: '/NumberOfItemsShipped',
              generate: 'NumberOfItemsShipped',
            },
            {
              extract: '/OrderStatus',
              generate: 'OrderStatus',
            },
            {
              extract: '/SalesChannel',
              generate: 'SalesChannel',
            },
            {
              extract: '/ShippedByAmazonTFM',
              generate: 'ShippedByAmazonTFM',
            },
            {
              extract: '/IsBusinessOrder',
              generate: 'IsBusinessOrder',
            },
            {
              extract: '/LatestDeliveryDate',
              generate: 'LatestDeliveryDate',
            },
            {
              extract: '/NumberOfItemsUnshipped',
              generate: 'NumberOfItemsUnshipped',
            },
            {
              extract: '/BuyerName',
              generate: 'BuyerName',
            },
            {
              extract: '/IsGlobalExpressEnabled',
              generate: 'IsGlobalExpressEnabled',
            },
            {
              extract: '/IsSoldByAB',
              generate: 'IsSoldByAB',
            },
            {
              extract: '/EarliestDeliveryDate',
              generate: 'EarliestDeliveryDate',
            },
            {
              extract: '/OrderTotal/CurrencyCode',
              generate: 'OrderTotal.CurrencyCode',
            },
            {
              extract: '/OrderTotal/Amount',
              generate: 'OrderTotal.Amount',
            },
            {
              extract: '/IsPremiumOrder',
              generate: 'IsPremiumOrder',
            },
            {
              extract: '/EarliestShipDate',
              generate: 'EarliestShipDate',
            },
            {
              extract: '/MarketplaceId',
              generate: 'MarketplaceId',
            },
            {
              extract: '/FulfillmentChannel',
              generate: 'FulfillmentChannel',
            },
            {
              extract: '/PaymentMethod',
              generate: 'PaymentMethod',
            },
            {
              extract: '/ShippingAddress/StateOrRegion',
              generate: 'ShippingAddress.StateOrRegion',
            },
            {
              extract: '/ShippingAddress/City',
              generate: 'ShippingAddress.City',
            },
            {
              extract: '/ShippingAddress/CountryCode',
              generate: 'ShippingAddress.CountryCode',
            },
            {
              extract: '/ShippingAddress/PostalCode',
              generate: 'ShippingAddress.PostalCode',
            },
            {
              extract: '/ShippingAddress/Name',
              generate: 'ShippingAddress.Name',
            },
            {
              extract: '/ShippingAddress/AddressLine1',
              generate: 'ShippingAddress.AddressLine1',
            },
            {
              extract: '/ShippingAddress/AddressLine2',
              generate: 'ShippingAddress.AddressLine2',
            },
            {
              extract: '/ShippingAddress/Phone',
              generate: 'ShippingAddress.Phone',
            },
            {
              extract: '/ShippingAddress/AddressType',
              generate: 'ShippingAddress.AddressType',
            },
            {
              extract: '/IsPrime',
              generate: 'IsPrime',
            },
            {
              extract: '/ShipmentServiceLevelCategory',
              generate: 'ShipmentServiceLevelCategory',
            },
            {
              extract: '/SellerOrderId',
              generate: 'SellerOrderId',
            },
            {
              extract: '/OrderChannel',
              generate: 'OrderChannel',
            },
            {
              extract: '/ShippingAddress/AddressLine3',
              generate: 'ShippingAddress.AddressLine3',
            },
            {
              extract: '/ShippingAddress/County',
              generate: 'ShippingAddress.County',
            },
            {
              extract: '/ShippingAddress/District',
              generate: 'ShippingAddress.District',
            },
            {
              extract: '/PaymentMethodDetails[0]/PaymentMethodDetail[*]',
              generate: 'PaymentMethodDetails[0].PaymentMethodDetail[*]',
            },
            {
              extract: '/IsReplacementOrder',
              generate: 'IsReplacementOrder',
            },
            {
              extract: '/ReplacedOrderId',
              generate: 'ReplacedOrderId',
            },
            {
              extract: '/BuyerTaxInfo[0]/CompanyLegalName',
              generate: 'BuyerTaxInfo[0].CompanyLegalName[0]',
            },
            {
              extract: '/BuyerTaxInfo[0]/TaxingRegion',
              generate: 'BuyerTaxInfo[0].TaxingRegion[0]',
            },
            {
              extract: '/BuyerTaxInfo[0]/TaxClassifications[*]/TaxClassification[*]/Name',
              generate: 'BuyerTaxInfo[0].TaxClassifications[0].TaxClassification[*].Name[0]',
            },
            {
              extract: '/BuyerTaxInfo[0]/TaxClassifications[*]/TaxClassification[*]/Value',
              generate: 'BuyerTaxInfo[0].TaxClassifications[0].TaxClassification[*].Value[0]',
            },
            {
              extract: '/CbaDisplayableShippingLabel',
              generate: 'CbaDisplayableShippingLabel',
            },
            {
              extract: '/PurchaseOrderNumber',
              generate: 'PurchaseOrderNumber',
            },
            {
              extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationId',
              generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationId',
            },
            {
              extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationAuthority/country',
              generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationAuthority.country',
            },
            {
              extract: '/TaxRegistrationDetails[0]/member[*]/taxRegistrationType',
              generate: 'TaxRegistrationDetails[0].member[*].taxRegistrationType',
            },
          ],
        ],
      },
      filter: {
        type: 'expression',
        expression: {
          rules: [
            'notequals',
            [
              'string',
              [
                'extract',
                'SalesChannel',
              ],
            ],
            'Non-Amazon',
          ],
          version: '1',
        },
        version: '1',
        rules: [
          'notequals',
          [
            'string',
            [
              'extract',
              'SalesChannel',
            ],
          ],
          'Non-Amazon',
        ],
      },
      adaptorType: 'HTTPExport',
    },
    {
      _id: '5e74798ec2c20f66f05cd370',
      createdAt: '2020-03-20T08:06:38.855Z',
      lastModified: '2021-03-02T12:33:04.541Z',
      name: 'Bank File to NetSuite [BAI2 - Check - 66666] Export',
      _connectionId: '5e7068331c056a75e6df19b2',
      _connectorId: '57c8199e8489cc1a298cc6ea',
      externalId: 'bank_file_to_netsuite_bai2_check_export',
      apiIdentifier: 'e2a86ad402',
      asynchronous: true,
      type: 'simple',
      pageSize: 5000000,
      hooks: {
        preSavePage: {
          function: 'bankPreSavePageFunction',
        },
      },
      sampleData: {
        Key: null,
      },
      file: {
        encoding: 'utf8',
        skipDelete: false,
        type: 'csv',
        csv: {
          columnDelimiter: '#@&^#',
          rowDelimiter: '\r\n',
          hasHeaderRow: false,
        },
      },
      adaptorType: 'SimpleExport',
    },
  ]
);
