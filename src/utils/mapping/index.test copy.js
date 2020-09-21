/* global describe, test,  expect */
import each from 'jest-each';
import util from '.';

describe('isEqual', () => {
  const testCases = [
    [true, {}, {}],
    [false, {}, null],
    [false, {
      a: 'b',
      c: 'd',
      e: 'f',
    }, {
      a: 'b',
      c: 'd',
    }],
    [false, {
      a: 'x',
      c: 'd',
      e: 'f',
    }, {
      a: 'b',
      c: 'd',
    }],
    [false, {
      arr: [1, 2, 3, 4],
    }, {
      arr: [2, 3, 4, 1],
    }],
    [true, {
      arr: [1, 2, 3, 4],
    }, {
      arr: [1, 2, 3, 4],
    }],
    [
      true,
      {
        extract: undefined,
        hardCodedValue: 'test',
        generate: 'test_generate',
      },
      {
        hardCodedValue: 'test',
        generate: 'test_generate',
      },
    ],
    [
      true,
      {
        basicMappings: {
          recordMappings: [{
            children: [{
              children: [],
              fieldMappings: [],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
            ],
            fieldMappings: [{
              discardIfEmpty: true,
              extract: 'SKU',
              generate: 'item_sku',
            },
            {
              discardIfEmpty: true,
              extract: 'upccode',
              generate: 'UPC',
            },
            {
              discardIfEmpty: true,
              extract: 'salesdescription',
              generate: 'product_description',
            },
            {
              discardIfEmpty: true,
              extract: 'displayname',
              generate: 'item_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'brand_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'manufacturer',
            },
            {
              discardIfEmpty: true,
              extract: 'mpn',
              generate: 'part_number',
            },
            {
              dataType: 'string',
              generate: 'update_delete',
              hardCodedValue: 'Update',
            },
            ],
            id: 'commonAttributes',
            lookups: [],
            name: 'Common',
          }],
        },
        variationMappings: {
          recordMappings: [],
        },
      },
      {
        basicMappings: {
          recordMappings: [{
            children: [{
              children: [],
              fieldMappings: [],
              id: 'Dimensions',
              name: 'Dimensions',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Discovery',
              name: 'Discovery',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Images',
              name: 'Images',
            },
            {
              children: [],
              fieldMappings: [],
              id: 'Fulfillment',
              name: 'Fulfillment',
            },
            ],
            fieldMappings: [{
              discardIfEmpty: true,
              extract: 'SKU',
              generate: 'item_sku',
            },
            {
              discardIfEmpty: true,
              extract: 'upccode',
              generate: 'UPC',
            },
            {
              discardIfEmpty: true,
              extract: 'salesdescription',
              generate: 'product_description',
            },
            {
              discardIfEmpty: true,
              extract: 'displayname',
              generate: 'item_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'brand_name',
            },
            {
              discardIfEmpty: true,
              extract: 'manufacturer',
              generate: 'manufacturer',
            },
            {
              discardIfEmpty: true,
              extract: 'mpn',
              generate: 'part_number',
            },
            {
              dataType: 'string',
              generate: 'update_delete',
              hardCodedValue: 'Update',
            },
            ],
            id: 'commonAttributes',
            lookups: [],
            name: 'Common',
          }],
        },
        variationMappings: {
          recordMappings: [],
        },
      },
    ],
    [
      true,
      {
        key: 'value',
        arr: [1, 2, 3, 4],
      },
      {
        key: 'value',
        arr: [1, 2, 3, 4],
      },
    ],
    [
      false,
      {
        key: 'other',
        arr: [1, 2, 3, 4],
      },
      {
        key: 'value',
        arr: [1, 2, 3, 4],
      },
    ],
    [
      true,
      {
        name: 'John',
        age: 30,
        car: null,
      },
      {
        name: 'John',
        age: 30,
        car: null,
      },
    ],
    [
      true,
      {
        age: 30,
        car: null,
        name: 'John',
      },
      {
        name: 'John',
        age: 30,
        car: null,
      },
    ],
    [
      true,
      {
        name: 'John',
        age: 30,
        cars: {
          car1: 'Ford',
          car2: 'BMW',
          car3: 'Fiat',
        },
      },
      {
        name: 'John',
        age: 30,
        cars: {
          car2: 'BMW',
          car1: 'Ford',
          car3: 'Fiat',
        },
      },
    ],
    [
      true,
      {
        name: 'John',
        age: 30,
        cars: [{
          car1: 'Ford',
          car2: 'BMW',
          car3: 'Fiat',
        }],
      },
      {
        name: 'John',
        age: 30,
        cars: [{
          car1: 'Ford',
          car2: 'BMW',
          car3: 'Fiat',
        }],
      },
    ],
    [
      true,
      {
        name: 'John',
        age: 30,
        cars: [{
          car: 'Ford',
        },
        {
          car: 'BMW',
        },
        {
          car: 'Fiat',
        },
        ],
      },
      {
        name: 'John',
        age: 30,
        cars: [{
          car: 'Ford',
        },
        {
          car: 'BMW',
        },
        {
          car: 'Fiat',
        },
        ],
      },
    ],
    [
      false,
      {
        name: 'John',
        age: 30,
        cars: [{
          car: 'Ford',
        },
        {
          car: 'BMW',
        },
        {
          car: 'Fiat',
        },
        ],
      },
      {
        name: 'John',
        age: 30,
        cars: [{
          car: 'Ford',
        },
        {
          car: 'Fiat',
        },
        {
          car: 'BMW',
        },
        ],
      },
    ],
  ];

  each(testCases).test(
    'should return %o when object = %o and otherObjecct = %o',
    (expected, object, otherObject) => {
      expect(util.isEqual(object, otherObject)).toEqual(expected);
    }
  );
});
describe('Mapping utils', () => {
  test('should flatten IA Netsuite Import Mapping', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5ee0d6d73c11e4201f431566',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        netsuite_da: {
          recordType: 'customer',
          mapping: {
            lists: [
              {
                generate: '_billing_addressbook',
                fields: [
                  {
                    generate: 'defaultbilling',
                    hardCodedValue: 'true',
                  },
                  {
                    generate: 'addr1',
                    extract: 'BillingAddress1',
                  },
                  {
                    generate: 'addr2',
                    extract: "{{#if BillingAddress1}} {{regexReplace BillingStreet '' BillingAddress1 g}} {{/if}}",
                  },
                  {
                    generate: 'city',
                    extract: 'BillingCity',
                  },
                  {
                    generate: 'state',
                    extract: 'BillingState',
                    internalId: false,
                    lookupName: 'billing_state_lookup',
                  },
                  {
                    generate: 'country',
                    extract: 'BillingCountry',
                  },
                  {
                    generate: 'zip',
                    extract: 'BillingPostalCode',
                  },
                ],
              },
              {
                generate: '_shipping_addressbook',
                fields: [
                  {
                    generate: 'defaultshipping',
                    hardCodedValue: 'true',
                  },
                  {
                    generate: 'addr1',
                    extract: 'ShippingAddress1',
                  },
                  {
                    generate: 'addr2',
                    extract: "{{#if ShippingAddress1}} {{regexReplace ShippingStreet '' ShippingAddress1 g}} {{/if}}",
                  },
                  {
                    generate: 'city',
                    extract: 'ShippingCity',
                  },
                  {
                    generate: 'state',
                    extract: 'ShippingState',
                    internalId: false,
                    lookupName: 'shipping_state_lookup',
                  },
                  {
                    generate: 'country',
                    extract: 'ShippingCountry',
                  },
                  {
                    generate: 'zip',
                    extract: 'ShippingPostalCode',
                  },
                ],
              },
            ],
            fields: [
              {
                generate: 'custentity_celigo_sfio_sf_id',
                extract: 'Id',
              },
              {
                generate: 'companyname',
                extract: 'Name',
              },
              {
                generate: 'parent',
                extract: 'ParentId',
                internalId: true,
                lookupName: 'customer_parent_lookup',
                immutable: false,
                discardIfEmpty: false,
              },
              {
                generate: 'isperson',
                hardCodedValue: 'false',
              },
              {
                generate: 'phone',
                extract: 'Phone',
              },
              {
                generate: 'comments',
                extract: 'Description',
              },
              {
                generate: 'fax',
                extract: 'Fax',
              },
              {
                generate: 'url',
                extract: '{{#if Website}}{{#contains Website "http"}}{{Website}}{{else}}http://{{Website}}{{/contains}}{{/if}}',
                internalId: false,
                immutable: false,
                discardIfEmpty: false,
              },
              {
                generate: 'custentity_celigo_sfnsio_dummymapping',
                extract: 'Website',
                internalId: false,
                immutable: false,
                discardIfEmpty: false,
              },
              {
                generate: 'custentity_celigo_sfio_skip_export_to_sf',
                hardCodedValue: 'true',
                discardIfEmpty: false,
              },
            ],
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      netsuiteRecordType: 'customer',
      options: {
        recordType: 'customer',
        integrationApp: {
          mappingMetadata: {
            salesforce_account_netsuite_customer_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                  'companyname',
                  'custentity_celigo_sfnsio_dummymapping',
                  'custentity_customer_channel_tier',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            salesforce_contact_to_netsuite_contact_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                  'email',
                  'lastname',
                  'firstname',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_item_to_salesforce_product_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Item_Pricing_Type__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Item_Pricing_Type__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            salesforce_opportunity_to_netsuite_salesorder_import: [
              {
                requiredGenerateFields: [
                  'entity',
                  'custbody_celigo_sfio_sf_id',
                  'custbody_celigo_sfio_sf_originated_ord',
                  'startdate',
                  'enddate',
                  'custbody_order_type',
                  'custbody_tran_term_in_months',
                  'custbody_ship_to_tier',
                  'custbody_bill_to_tier',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sfio_sf_id',
                  'custbody_celigo_sfio_sf_originated_ord',
                ],
              },
              {
                generateList: 'item',
                requiredGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                ],
                nonEditableGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                ],
              },
            ],
            salesforce_account_id_writeback_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_contact_to_salesforce_contact_import_idwriteback: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_contact_to_salesforce_contact_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            netsuite_customer_to_salesforce_account_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                  'celigo_sfnsio__Channel_Tier__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            salesforce_account_financials_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            netsuite_item_group_to_salesforce_product_import: [
              {
                requiredGenerateFields: [
                  'ProductCode',
                ],
                nonEditableGenerateFields: [
                  'ProductCode',
                ],
              },
            ],
            netsuite_salesorder_to_salesforce_order_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'AccountId',
                  'OpportunityId',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
              {
                generateList: 'OrderItems',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'Quantity',
                  'UnitPrice',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
              },
            ],
            salesforce_attachment_to_netsuite_so_fileattach: [
              {
                requiredGenerateFields: [
                  'attachTo.internalId',
                  'attachTo.recordType',
                  'attachedRecord.internalId',
                  'attachedRecord.recordType',
                ],
                nonEditableGenerateFields: [
                  'attachTo.internalId',
                  'attachTo.recordType',
                  'attachedRecord.internalId',
                  'attachedRecord.recordType',
                ],
              },
            ],
            netsuite_itemfulfillment_to_salesforce_itemfulfillment_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Sync_Status__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__Account_Name__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Sync_Status__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
              {
                generateList: 'celigo_sfnsio__Fulfillment_Lines__r',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
              },
            ],
            netsuite_inventorydetail_to_salesforce_asset_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Product2Id',
                  'celigo_sfnsio__AccountId',
                  'celigo_sfnsio__Fulfillment_Line__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Fulfillment_Line__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            salesforce_itemfulfillment_id_writeback_import: [
              {
                requiredGenerateFields: [
                  'custbody_celigo_sf_itemfulfillment_id',
                  'custbody_test_sfio_skip_export_to_sf',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sf_itemfulfillment_id',
                  'custbody_test_sfio_skip_export_to_sf',
                ],
              },
            ],
            salesforce_order_to_netsuite_salesorder_import: [
              {
                requiredGenerateFields: [
                  'custbody_celigo_sfio_order_id',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sfio_order_id',
                ],
              },
              {
                generateList: 'item',
                requiredGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                  'custcol_celigo_sfio_order_id',
                ],
                nonEditableGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                  'custcol_celigo_sfio_order_id',
                ],
              },
            ],
            netsuite_salesorder_to_salesforce_opportunity_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NS_Originated_Order__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'StageName',
                  'Name',
                  'CloseDate',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__NS_Originated_Order__c',
                ],
              },
              {
                generateList: 'OpportunityLineItems',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'Quantity',
                  'UnitPrice',
                  'PricebookEntryId',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'PricebookEntryId',
                ],
              },
            ],
            netsuite_contract_to_salesforce_contract_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NetSuite_Record_URL__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NetSuite_Record_URL__c',
                ],
              },
              {
                generateList: 'celigo_sfnsio__Contract_Items__r',
                requiredGenerateFields: [
                  'Id',
                  '_lineAction',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'Id',
                  '_lineAction',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            netsuite_opportunity_to_salesforce_opportunity_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Opportunity_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'StageName',
                  'Name',
                  'CloseDate',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Opportunity_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                ],
              },
              {
                generateList: 'OpportunityLineItems',
                requiredGenerateFields: [
                  'Quantity',
                  'UnitPrice',
                  'PricebookEntryId',
                ],
                nonEditableGenerateFields: [
                  'PricebookEntryId',
                ],
              },
            ],
            salesforce_product_to_netsuite_item_import: [
              {
                requiredGenerateFields: [
                  'internalid',
                  'itemid',
                  'custitem_celigo_sfio_sf_id',
                  'itemType',
                ],
                nonEditableGenerateFields: [
                  'internalid',
                  'custitem_celigo_sfio_sf_id',
                  'itemType',
                ],
              },
            ],
            netsuite_salesorder_status_to_salesforce_order_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Order_Status__c',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
          },
          connectorExternalId: 'salesforce_account_netsuite_customer_import',
        },
      },
      exportResource: {
        _id: '5ee73a1208364329e076250d',
        createdAt: '2020-06-15T09:06:27.023Z',
        lastModified: '2020-08-11T10:34:59.046Z',
        name: 'Get Accounts from Salesforce',
        _connectionId: '5ee0d6d8e6f76614d0d395c3',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        externalId: 'salesforce_account_to_netsuite_customer_export',
        apiIdentifier: 'ea49713330',
        asynchronous: true,
        type: 'distributed',
        distributed: {
          bearerToken: '******',
        },
        salesforce: {
          sObjectType: 'Account',
          distributed: {
            connectorId: 'sfns-io',
            disabled: true,
            qualifier: "celigo_sfnsio__NetSuite_Id__c != ''",
            batchSize: 50,
            skipExportFieldId: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
            userDefinedReferencedFields: [
              null,
            ],
            relatedLists: null,
          },
        },
        adaptorType: 'SalesforceExport',
      },
    };
    const formattedMapping = [
      {
        generate: 'custentity_celigo_sfio_sf_id',
        extract: 'Id',
        isRequired: true,
        isNotEditable: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'companyname',
        extract: 'Name',
        isRequired: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'parent.internalid',
        extract: 'ParentId',
        internalId: true,
        lookupName: 'customer_parent_lookup',
        immutable: false,
        discardIfEmpty: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'isperson',
        hardCodedValue: 'false',
        useAsAnInitializeValue: false,
      },
      {
        generate: 'phone',
        extract: 'Phone',
        useAsAnInitializeValue: false,
      },
      {
        generate: 'comments',
        extract: 'Description',
        useAsAnInitializeValue: false,
      },
      {
        generate: 'fax',
        extract: 'Fax',
        useAsAnInitializeValue: false,
      },
      {
        generate: 'url',
        extract: '{{#if Website}}{{#contains Website "http"}}{{Website}}{{else}}http://{{Website}}{{/contains}}{{/if}}',
        internalId: false,
        immutable: false,
        discardIfEmpty: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'custentity_celigo_sfnsio_dummymapping',
        extract: 'Website',
        internalId: false,
        immutable: false,
        discardIfEmpty: false,
        isRequired: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'custentity_celigo_sfio_skip_export_to_sf',
        hardCodedValue: 'true',
        discardIfEmpty: false,
        isRequired: true,
        isNotEditable: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: '_billing_addressbook[*].defaultbilling',
        hardCodedValue: 'true',
      },
      {
        generate: '_billing_addressbook[*].addr1',
        extract: 'BillingAddress1',
      },
      {
        generate: '_billing_addressbook[*].addr2',
        extract: "{{#if BillingAddress1}} {{regexReplace BillingStreet '' BillingAddress1 g}} {{/if}}",
      },
      {
        generate: '_billing_addressbook[*].city',
        extract: 'BillingCity',
      },
      {
        generate: '_billing_addressbook[*].state',
        extract: 'BillingState',
        internalId: false,
        lookupName: 'billing_state_lookup',
      },
      {
        generate: '_billing_addressbook[*].country',
        extract: 'BillingCountry',
      },
      {
        generate: '_billing_addressbook[*].zip',
        extract: 'BillingPostalCode',
      },
      {
        generate: '_shipping_addressbook[*].defaultshipping',
        hardCodedValue: 'true',
      },
      {
        generate: '_shipping_addressbook[*].addr1',
        extract: 'ShippingAddress1',
      },
      {
        generate: '_shipping_addressbook[*].addr2',
        extract: "{{#if ShippingAddress1}} {{regexReplace ShippingStreet '' ShippingAddress1 g}} {{/if}}",
      },
      {
        generate: '_shipping_addressbook[*].city',
        extract: 'ShippingCity',
      },
      {
        generate: '_shipping_addressbook[*].state',
        extract: 'ShippingState',
        internalId: false,
        lookupName: 'shipping_state_lookup',
      },
      {
        generate: '_shipping_addressbook[*].country',
        extract: 'ShippingCountry',
      },
      {
        generate: '_shipping_addressbook[*].zip',
        extract: 'ShippingPostalCode',
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten Salesforce IA Import Mapping', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5ee0d6d8e6f76614d0d395c3',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        mapping: {
          fields: [
            {
              extract: 'companyname',
              generate: 'Name',
            },
            {
              extract: 'phone',
              generate: 'Phone',
            },
            {
              extract: 'url',
              generate: 'Website',
            },
            {
              generate: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
              hardCodedValue: 'true',
            },
            {
              extract: '{{billaddr1}}\n{{billaddr2}}',
              generate: 'BillingStreet',
              default: '',
            },
            {
              extract: 'billcity',
              generate: 'BillingCity',
            },
            {
              extract: 'billstate',
              generate: 'BillingState',
            },
            {
              extract: 'billcountry',
              generate: 'BillingCountry',
            },
            {
              extract: 'billzip',
              generate: 'BillingPostalCode',
            },
            {
              extract: '{{shipaddr1}}\n{{shipaddr2}}',
              generate: 'ShippingStreet',
              default: '',
            },
            {
              extract: 'shipcity',
              generate: 'ShippingCity',
            },
            {
              extract: 'shipstate',
              generate: 'ShippingState',
            },
            {
              extract: 'shipcountry',
              generate: 'ShippingCountry',
            },
            {
              extract: 'shipzip',
              generate: 'ShippingPostalCode',
            },
            {
              extract: 'comments',
              generate: 'Description',
            },
            {
              extract: 'internalid',
              generate: 'celigo_sfnsio__NetSuite_Id__c',
            },
          ],
        },
        salesforce: {
          sObjectType: 'Account',
        },
        adaptorType: 'SalesforceImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      options: {
        integrationApp: {
          mappingMetadata: {
            salesforce_account_netsuite_customer_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                  'companyname',
                  'custentity_celigo_sfnsio_dummymapping',
                  'custentity_customer_channel_tier',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            salesforce_contact_to_netsuite_contact_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                  'email',
                  'lastname',
                  'firstname',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_item_to_salesforce_product_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Item_Pricing_Type__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Item_Pricing_Type__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            salesforce_opportunity_to_netsuite_salesorder_import: [
              {
                requiredGenerateFields: [
                  'entity',
                  'custbody_celigo_sfio_sf_id',
                  'custbody_celigo_sfio_sf_originated_ord',
                  'startdate',
                  'enddate',
                  'custbody_order_type',
                  'custbody_tran_term_in_months',
                  'custbody_ship_to_tier',
                  'custbody_bill_to_tier',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sfio_sf_id',
                  'custbody_celigo_sfio_sf_originated_ord',
                ],
              },
              {
                generateList: 'item',
                requiredGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                ],
                nonEditableGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                ],
              },
            ],
            salesforce_account_id_writeback_import: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_contact_to_salesforce_contact_import_idwriteback: [
              {
                requiredGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
                nonEditableGenerateFields: [
                  'custentity_celigo_sfio_skip_export_to_sf',
                  'custentity_celigo_sfio_sf_id',
                ],
              },
            ],
            netsuite_contact_to_salesforce_contact_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            netsuite_customer_to_salesforce_account_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                  'celigo_sfnsio__Channel_Tier__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            salesforce_account_financials_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
            netsuite_item_group_to_salesforce_product_import: [
              {
                requiredGenerateFields: [
                  'ProductCode',
                ],
                nonEditableGenerateFields: [
                  'ProductCode',
                ],
              },
            ],
            netsuite_salesorder_to_salesforce_order_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'AccountId',
                  'OpportunityId',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
              {
                generateList: 'OrderItems',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'Quantity',
                  'UnitPrice',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
              },
            ],
            salesforce_attachment_to_netsuite_so_fileattach: [
              {
                requiredGenerateFields: [
                  'attachTo.internalId',
                  'attachTo.recordType',
                  'attachedRecord.internalId',
                  'attachedRecord.recordType',
                ],
                nonEditableGenerateFields: [
                  'attachTo.internalId',
                  'attachTo.recordType',
                  'attachedRecord.internalId',
                  'attachedRecord.recordType',
                ],
              },
            ],
            netsuite_itemfulfillment_to_salesforce_itemfulfillment_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Sync_Status__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__Account_Name__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Sync_Status__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
              {
                generateList: 'celigo_sfnsio__Fulfillment_Lines__r',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                ],
              },
            ],
            netsuite_inventorydetail_to_salesforce_asset_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__Product2Id',
                  'celigo_sfnsio__AccountId',
                  'celigo_sfnsio__Fulfillment_Line__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Fulfillment_Line__c',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            salesforce_itemfulfillment_id_writeback_import: [
              {
                requiredGenerateFields: [
                  'custbody_celigo_sf_itemfulfillment_id',
                  'custbody_test_sfio_skip_export_to_sf',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sf_itemfulfillment_id',
                  'custbody_test_sfio_skip_export_to_sf',
                ],
              },
            ],
            salesforce_order_to_netsuite_salesorder_import: [
              {
                requiredGenerateFields: [
                  'custbody_celigo_sfio_order_id',
                ],
                nonEditableGenerateFields: [
                  'custbody_celigo_sfio_order_id',
                ],
              },
              {
                generateList: 'item',
                requiredGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                  'custcol_celigo_sfio_order_id',
                ],
                nonEditableGenerateFields: [
                  'celigo_item_netsuite_line_id',
                  'celigo_item_discount_percentage',
                  'custcol_celigo_sfio_order_id',
                ],
              },
            ],
            netsuite_salesorder_to_salesforce_opportunity_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NS_Originated_Order__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'StageName',
                  'Name',
                  'CloseDate',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'celigo_sfnsio__NS_Originated_Order__c',
                ],
              },
              {
                generateList: 'OpportunityLineItems',
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'Quantity',
                  'UnitPrice',
                  'PricebookEntryId',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Line_Id__c',
                  'PricebookEntryId',
                ],
              },
            ],
            netsuite_contract_to_salesforce_contract_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NetSuite_Record_URL__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Id__c',
                  'celigo_sfnsio__NetSuite_Record_URL__c',
                ],
              },
              {
                generateList: 'celigo_sfnsio__Contract_Items__r',
                requiredGenerateFields: [
                  'Id',
                  '_lineAction',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
                nonEditableGenerateFields: [
                  'Id',
                  '_lineAction',
                  'celigo_sfnsio__NetSuite_Id__c',
                ],
              },
            ],
            netsuite_opportunity_to_salesforce_opportunity_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Opportunity_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                  'StageName',
                  'Name',
                  'CloseDate',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__NetSuite_Opportunity_Id__c',
                  'Pricebook2Id',
                  'CurrencyIsoCode',
                ],
              },
              {
                generateList: 'OpportunityLineItems',
                requiredGenerateFields: [
                  'Quantity',
                  'UnitPrice',
                  'PricebookEntryId',
                ],
                nonEditableGenerateFields: [
                  'PricebookEntryId',
                ],
              },
            ],
            salesforce_product_to_netsuite_item_import: [
              {
                requiredGenerateFields: [
                  'internalid',
                  'itemid',
                  'custitem_celigo_sfio_sf_id',
                  'itemType',
                ],
                nonEditableGenerateFields: [
                  'internalid',
                  'custitem_celigo_sfio_sf_id',
                  'itemType',
                ],
              },
            ],
            netsuite_salesorder_status_to_salesforce_order_import: [
              {
                requiredGenerateFields: [
                  'celigo_sfnsio__NetSuite_Order_Status__c',
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
                nonEditableGenerateFields: [
                  'celigo_sfnsio__Skip_Export_To_NetSuite__c',
                ],
              },
            ],
          },
          connectorExternalId: 'netsuite_customer_to_salesforce_account_import',
        },
      },
      exportResource: {
        _connectionId: '5ee0d6d73c11e4201f431566',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        type: 'distributed',
        netsuite: {
          type: 'distributed',
        },
        adaptorType: 'NetSuiteExport',
      },
    };

    const formattedMapping = [
      {
        extract: 'companyname',
        generate: 'Name',
      },
      {
        extract: 'phone',
        generate: 'Phone',
      },
      {
        extract: 'url',
        generate: 'Website',
      },
      {
        generate: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
        hardCodedValue: 'true',
        isRequired: true,
        isNotEditable: true,
      },
      {
        extract: '{{billaddr1}}\n{{billaddr2}}',
        generate: 'BillingStreet',
        default: '',
      },
      {
        extract: 'billcity',
        generate: 'BillingCity',
      },
      {
        extract: 'billstate',
        generate: 'BillingState',
      },
      {
        extract: 'billcountry',
        generate: 'BillingCountry',
      },
      {
        extract: 'billzip',
        generate: 'BillingPostalCode',
      },
      {
        extract: '{{shipaddr1}}\n{{shipaddr2}}',
        generate: 'ShippingStreet',
        default: '',
      },
      {
        extract: 'shipcity',
        generate: 'ShippingCity',
      },
      {
        extract: 'shipstate',
        generate: 'ShippingState',
      },
      {
        extract: 'shipcountry',
        generate: 'ShippingCountry',
      },
      {
        extract: 'shipzip',
        generate: 'ShippingPostalCode',
      },
      {
        extract: 'comments',
        generate: 'Description',
      },
      {
        extract: 'internalid',
        generate: 'celigo_sfnsio__NetSuite_Id__c',
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten FTP Import Mapping correctly in case of grouped sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5f354102b2b91626b0e94d00',
        distributed: false,
        apiIdentifier: 'i3f2df0f5e',
        mapping: {
          fields: [
            {
              extract: '[Base Price]',
              generate: 'field two',
            },
          ],
          lists: [
            {
              fields: [
                {
                  extract: '*.Amazon Product ASIN',
                  generate: 'Test',
                },
                {
                  extract: '*.Description',
                  generate: 'test field3',
                },
              ],
              generate: '',
            },
            {
              fields: [
                {
                  extract: 'Name',
                  generate: 'field1',
                },
                {
                  extract: 'recordType',
                  generate: 'field2',
                },
                {
                  extract: '[Display Name]',
                  generate: 'field3',
                },
              ],
              generate: 'abc',
            },
            {
              fields: [
                {
                  extract: 'asdfgh',
                  generate: 'field1',
                },
              ],
              generate: 'abcd',
            },
          ],
        },
        file: {
          type: 'csv',
          csv: {},
        },
        ftp: {
          directoryPath: 'h',
          fileName: 'h',
        },
        adaptorType: 'FTPImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: true,
      options: {},
      exportResource: {
        _connectionId: '5c88a4bb26a9676c5d706324',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          statsOnly: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        extract: 'Base Price',
        generate: 'field two',
        useFirstRow: true,
      },
      {
        extract: 'Amazon Product ASIN',
        generate: 'Test',
      },
      {
        extract: 'Description',
        generate: 'test field3',
      },
      {
        extract: 'Name',
        generate: 'abc[*].field1',
        useFirstRow: true,
      },
      {
        extract: 'recordType',
        generate: 'abc[*].field2',
        useFirstRow: true,
      },
      {
        extract: 'Display Name',
        generate: 'abc[*].field3',
        useFirstRow: true,
      },
      {
        extract: 'asdfgh',
        generate: 'abcd[*].field1',
        useFirstRow: true,
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten FTP Import Mapping correctly in case of non-grouped sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5f354102b2b91626b0e94d00',
        mapping: {
          fields: [
            {
              extract: '[Base Price]',
              generate: 'field two',
            },
          ],
          lists: [
            {
              fields: [
                {
                  extract: '*.Amazon Product ASIN',
                  generate: 'Test',
                },
                {
                  extract: '*.Description',
                  generate: 'test field3',
                },
              ],
              generate: '',
            },
            {
              fields: [
                {
                  extract: 'Name',
                  generate: 'field1',
                },
                {
                  extract: 'recordType',
                  generate: 'field2',
                },
                {
                  extract: '[Display Name]',
                  generate: 'field3',
                },
              ],
              generate: 'abc',
            },
            {
              fields: [
                {
                  extract: 'asdfgh',
                  generate: 'field1',
                },
              ],
              generate: 'abcd',
            },
          ],
        },
        file: {
          type: 'csv',
          csv: {},
        },
        adaptorType: 'FTPImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      options: {},
      exportResource: {
        _connectionId: '5c88a4bb26a9676c5d706324',
        netsuite: {
          type: 'restlet',
          restlet: {},
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        extract: 'Base Price',
        generate: 'field two',
      },
      {
        extract: 'Amazon Product ASIN',
        generate: 'Test',
      },
      {
        extract: 'Description',
        generate: 'test field3',
      },
      {
        extract: 'Name',
        generate: 'abc[*].field1',
      },
      {
        extract: 'recordType',
        generate: 'abc[*].field2',
      },
      {
        extract: 'Display Name',
        generate: 'abc[*].field3',
      },
      {
        extract: 'asdfgh',
        generate: 'abcd[*].field1',
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should add required mapping to Assistant in case mapping is not configured', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5e94471f3a5827019767ef1b',
        assistant: 'slack',
        assistantMetadata: {
          resource: 'chat',
          version: 'latest',
          operation: 'chat_memessage',
          lookups: {
          },
        },
        http: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
          batchSize: 1,
        },
        rest: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
        },
        adaptorType: 'RESTImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: true,
      options: {
        assistant: {
          requiredMappings: [
            'channel',
            'text',
          ],
        },
      },
      exportResource: {
        _id: '5f522cc45f0ecb1bdead2efc',
        createdAt: '2020-09-04T12:02:12.885Z',
        lastModified: '2020-09-14T19:16:04.606Z',
        name: 'item',
        _connectionId: '5f50c77d2695f415b393d0c0',
        apiIdentifier: 'ee9ba17dee',
        asynchronous: true,
        sampleData: [
          {
            id: '57',
            recordType: 'inventoryitem',
            Name: '100 Pack CD-R 80 minute 700 MB',
            'Display Name': '100 Pack CD-R 80 minute 700 MB',
            Description: '100 Pack CD-R 80 minute 700 MB',
            Type: 'Inventory Item',
            'Base Price': '12.99',
            'Amazon Product ASIN': '',
          },
        ],
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          statsOnly: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
          distributed: {
            disabled: false,
            forceReload: false,
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        extract: '',
        generate: 'channel',
        isRequired: true,
      },
      {
        extract: '',
        generate: 'text',
        isRequired: true,
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten Assistant Mapping correctly in case of grouped sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5e94471f3a5827019767ef1b',
        distributed: false,
        assistant: 'slack',
        assistantMetadata: {
          resource: 'chat',
          version: 'latest',
          operation: 'chat_memessage',
          lookups: {

          },
        },
        mapping: {
          fields: [
            {
              extract: '[Amazon Product ASIN]',
              generate: 'channel',
            },
            {
              extract: 'asdf',
              generate: 'text',
            },
            {
              extract: 'sadf',
              generate: 'sadf',
            },
          ],
          lists: [
            {
              fields: [
                {
                  extract: 'asdf',
                  generate: 'jhg',
                },
                {
                  extract: '*.werfg',
                  generate: 'iuyt',
                },
              ],
              generate: 'asd',
            },
          ],
        },
        http: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
          batchSize: 1,
          requestMediaType: 'urlencoded',
          successMediaType: 'json',
          errorMediaType: 'json',
          strictHandlebarEvaluation: true,
          sendPostMappedData: true,
          response: {
            resourceIdPath: [
              null,
            ],
            successPath: [
              'ok',
            ],
            successValues: [
              [
                'true',
              ],
            ],
          },
        },
        rest: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
        },
        filter: {
          type: 'expression',
          expression: {
            version: '1',
          },
          version: '1',
        },
        adaptorType: 'RESTImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: true,
      options: {
        assistant: {
          requiredMappings: [
            'channel',
            'text',
          ],
        },
      },
      exportResource: {
        _connectionId: '5f50c77d2695f415b393d0c0',
        sampleData: [
          {
            id: '57',
            recordType: 'inventoryitem',
            Name: '100 Pack CD-R 80 minute 700 MB',
            'Display Name': '100 Pack CD-R 80 minute 700 MB',
            Description: '100 Pack CD-R 80 minute 700 MB',
            Type: 'Inventory Item',
            'Base Price': '12.99',
            'Amazon Product ASIN': '',
          },
        ],
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          statsOnly: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
          distributed: {
            disabled: false,
            forceReload: false,
          },
        },

        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        extract: 'Amazon Product ASIN',
        generate: 'channel',
        isRequired: true,
      },
      {
        extract: 'asdf',
        generate: 'text',
        isRequired: true,
      },
      {
        extract: 'sadf',
        generate: 'sadf',
      },
      {
        extract: 'asdf',
        generate: 'asd[*].jhg',
        useFirstRow: true,
      },
      {
        extract: 'werfg',
        generate: 'asd[*].iuyt',
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten Assistant Mapping correctly in case of non-grouped sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5e94471f3a5827019767ef1b',
        distributed: false,
        assistant: 'slack',
        assistantMetadata: {
          resource: 'chat',
          version: 'latest',
          operation: 'chat_memessage',
          lookups: {

          },
        },
        mapping: {
          fields: [
            {
              extract: '[Amazon Product ASIN]',
              generate: 'channel',
            },
            {
              extract: 'asdf',
              generate: 'text',
            },
            {
              extract: 'sadf',
              generate: 'sadf',
            },
          ],
          lists: [
            {
              fields: [
                {
                  extract: 'asdf',
                  generate: 'jhg',
                },
                {
                  extract: '*.werfg',
                  generate: 'iuyt',
                },
              ],
              generate: 'asd',
            },
          ],
        },
        http: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
          batchSize: 1,
          requestMediaType: 'urlencoded',
          successMediaType: 'json',
          errorMediaType: 'json',
          strictHandlebarEvaluation: true,
          sendPostMappedData: true,
          response: {
            resourceIdPath: [
              null,
            ],
            successPath: [
              'ok',
            ],
            successValues: [
              [
                'true',
              ],
            ],
          },
        },
        rest: {
          relativeURI: [
            'chat.meMessage',
          ],
          method: [
            'POST',
          ],
          body: [
            null,
          ],
        },
        filter: {
          type: 'expression',
          expression: {
            version: '1',
          },
          version: '1',
        },
        adaptorType: 'RESTImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      options: {
        assistant: {
          requiredMappings: [
            'channel',
            'text',
          ],
        },
      },
      exportResource: {
        _connectionId: '5f50c77d2695f415b393d0c0',
        sampleData: [
          {
            id: '57',
            recordType: 'inventoryitem',
            Name: '100 Pack CD-R 80 minute 700 MB',
            'Display Name': '100 Pack CD-R 80 minute 700 MB',
            Description: '100 Pack CD-R 80 minute 700 MB',
            Type: 'Inventory Item',
            'Base Price': '12.99',
            'Amazon Product ASIN': '',
          },
        ],
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          statsOnly: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
          distributed: {
            disabled: false,
            forceReload: false,
          },
        },

        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        extract: 'Amazon Product ASIN',
        generate: 'channel',
        isRequired: true,
      },
      {
        extract: 'asdf',
        generate: 'text',
        isRequired: true,
      },
      {
        extract: 'sadf',
        generate: 'sadf',
      },
      {
        extract: 'asdf',
        generate: 'asd[*].jhg',
      },
      {
        extract: 'werfg',
        generate: 'asd[*].iuyt',
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten IA Mapping correctly', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5a6ec243e9aaa11c9bc86109',
        _integrationId: '5a6ec243e9aaa11c9bc86107',
        _connectorId: '5829bce6069ccb4460cdb34e',
        distributed: true,
        netsuite_da: {
          operation: 'addupdate',
          recordType: 'customer',
          internalIdLookup: {
            expression: '[["email","is","{{TransactionArray.Transaction.[0].Buyer.Email}}"],"AND",["custentity_celigo_etail_channel.name","is","eBay"],"AND",["isinactive","is",false]]',
          },
          mapping: {
            lists: [
              {
                generate: 'addressbook',
                fields: [
                  {
                    generate: 'defaultshipping',
                    hardCodedValue: 'true',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'defaultbilling',
                    hardCodedValue: 'true',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'addressee',
                    extract: 'fullname',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'addrphone',
                    extract: 'ShippingAddress.Phone',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'addr1',
                    extract: 'ShippingAddress.Street1',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'addr2',
                    extract: 'ShippingAddress.Street2',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'city',
                    extract: 'ShippingAddress.CityName',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'state',
                    extract: 'ShippingAddress.StateOrProvince',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'zip',
                    extract: 'ShippingAddress.PostalCode',
                    internalId: false,
                    immutable: false,
                  },
                  {
                    generate: 'country',
                    extract: 'ShippingAddress.Country',
                    internalId: true,
                    immutable: false,
                  },
                ],
              },
            ],
            fields: [
              {
                generate: 'firstname',
                extract: 'firstname',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'lastname',
                extract: 'lastname',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'email',
                extract: 'TransactionArray.Transaction[0].Buyer.Email',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'custentity_celigo_etail_channel',
                hardCodedValue: 'eBay',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'phone',
                extract: 'ShippingAddress.Phone',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'isperson',
                hardCodedValue: 'true',
                internalId: false,
                immutable: false,
              },
              {
                generate: 'subsidiary',
                extract: null,
                hardCodedValue: '3',
                internalId: true,
                immutable: false,
              },
            ],
          },
          hooks: {
            postMap: {
              configuration: null,
              fileInternalId: null,
              function: 'eBayCustomerImportPostMapHook',
            },
            postSubmit: {
              configuration: null,
              fileInternalId: null,
              function: 'eBayCustomerImportPostSubmitHook',
            },
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      netsuiteRecordType: 'customer',
      options: {
        recordType: 'customer',
        integrationApp: {
          mappingMetadata: {

          },
        },
      },
      exportResource: {
        _id: '5a6ec66de9aaa11c9bc86129',
        createdAt: '2018-01-29T06:59:58.040Z',
        lastModified: '2018-01-29T06:59:58.040Z',
        name: 'eBay Customer Export Adaptor',
        _integrationId: '5a6ec243e9aaa11c9bc86107',
        _connectorId: '5829bce6069ccb4460cdb34e',
        type: 'webhook',
        webhook: {
          provider: 'integrator-extension',
        },
        sampleData: {
          Total: '5.0',
          Subtotal: '3.0',
          ShippingServiceSelected: {
            ShippingServiceCost: '2.0',
            ShippingService: 'UPSGround',
          },
          ShippingDetails: {
            SellingManagerSalesRecordNumber: '667',
            ShippingServiceOptions: [
              {
                ShippingServicePriority: '1',
                ShippingServiceCost: '2.0',
                ShippingService: 'UPSGround',
                ExpeditedService: 'false',
              },
            ],
            SalesTax: {
              ShippingIncludedInTax: 'false',
              SalesTaxPercent: '0.0',
              SalesTaxAmount: '0.0',
            },
          },
          ShippingAddress: {
            Street2: 'Street line 3_updated',
            Street1: '230 TWIN DOLPHIN DR, SUITE A',
            StateOrProvince: 'CA',
            PostalCode: '94065',
            Phone: '202 555 0162',
            Name: 'Ravi Ram Paul',
            CountryName: 'United States',
            Country: 'US',
            CityName: 'REDWOOD CITY',
            AddressOwner: 'eBay',
            AddressID: '8928010',
          },
          ShippedTime: '2017-03-06T07:16:36.000Z',
          SellerUserID: 'testuser_celigo_seller_1',
          SellerEmail: 'paypalSeller@celigo.com',
          SellerEIASToken: 'nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhCpmKoQmdj6x9nY+seQ==',
          PaymentMethods: [
            'PayPal',
          ],
          PaymentHoldStatus: 'None',
          PaidTime: '2017-03-06T06:21:06.000Z',
          OrderStatus: 'Completed',
          OrderID: '292873010',
          MonetaryDetails: [
            {
              Payments: [
                {
                  Payment: [
                    {
                      ReferenceID: '5B6558716K4614240',
                      PaymentTime: '2017-09-20T05:36:25.000Z',
                      PaymentStatus: 'Succeeded',
                      PaymentAmount: '43.42',
                      Payer: 'testuser_celigo_qa_buyer_2',
                      Payee: 'testuser_celigo_seller_1',
                      FeeOrCreditAmount: '1.56',
                    },
                  ],
                },
              ],
            },
          ],
          IsMultiLegShipping: 'false',
          IntegratedMerchantCreditCardEnabled: 'false',
          ExternalTransaction: [
            {
              PaymentOrRefundAmount: '43.42',
              FeeOrCreditAmount: '1.56',
              ExternalTransactionTime: '2017-09-20T05:36:25.000Z',
              ExternalTransactionStatus: 'Succeeded',
              ExternalTransactionID: '5B6558716K4614240',
            },
          ],
          ExtendedOrderID: '292873010!875436000',
          EIASToken: 'nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GhCpWEqQ6dj6x9nY+seQ==',
          CreatingUserRole: 'Buyer',
          CreatedTime: '2017-03-06T06:21:05.000Z',
          ContainseBayPlusTransaction: 'false',
          CheckoutStatus: {
            Status: 'Complete',
            PaymentMethod: 'PayPal',
            LastModifiedTime: '2017-03-10T06:12:00.000Z',
            IntegratedMerchantCreditCardEnabled: 'false',
            eBayPaymentStatus: 'NoPaymentFailure',
          },
          CancelStatus: 'NotApplicable',
          BuyerUserID: 'testuser_celigo_qa_buyer_2',
          AmountSaved: '1.0',
          AmountPaid: '5.0',
          AdjustmentAmount: '0.0',
          TransactionArray: {
            Transaction: [
              {
                TransactionSiteID: 'US',
                TransactionPrice: '1.0',
                TransactionID: '28493629001',
                Status: {
                  ReturnStatus: 'NotApplicable',
                  PaymentHoldStatus: 'None',
                  InquiryStatus: 'NotApplicable',
                },
                QuantityPurchased: '2',
                OrderLineItemID: '110191052618-28493629001',
                Item: {
                  Title: 'Test Listing Do Not Buy53615',
                  SKU: 'Test Item 781',
                  Site: 'US',
                  ItemID: '110191052618',
                },
                GuaranteedShipping: 'false',
                ExtendedOrderID: '292873010!875436000',
                eBayPlusTransaction: 'false',
                CreatedDate: '2017-03-06T06:18:08.000Z',
                Buyer: {
                  UserLastName: 'User',
                  UserFirstName: 'Test',
                  Email: 'celigo_qa_buyer_2@example.com',
                },
                ActualShippingCost: '1.0',
                ActualHandlingCost: '0.0',
                ShippingServiceSelected: {
                  ShippingPackageInfo: [
                    {
                      EstimatedDeliveryTimeMin: '2017-03-08T08:00:00.000Z',
                      EstimatedDeliveryTimeMax: '2017-03-08T08:00:00.000Z',
                    },
                  ],
                },
                ShippingDetails: {
                  SellingManagerSalesRecordNumber: '665',
                },
                Taxes: {
                  TotalTaxAmount: '0.0',
                  TaxDetails: [
                    {
                      TaxOnSubtotalAmount: '0.0',
                      TaxOnShippingAmount: '0.0',
                      TaxOnHandlingAmount: '0.0',
                      TaxDescription: 'SalesTax',
                      TaxAmount: '0.0',
                      Imposition: 'SalesTax',
                    },
                    {
                      TaxDescription: 'ElectronicWasteRecyclingFee',
                      TaxAmount: '0.0',
                      Imposition: 'WasteRecyclingFee',
                    },
                  ],
                },
              },
              {
                TransactionSiteID: 'US',
                TransactionPrice: '1.0',
                TransactionID: '28493630001',
                Status: {
                  ReturnStatus: 'NotApplicable',
                  PaymentHoldStatus: 'None',
                  InquiryStatus: 'NotApplicable',
                },
                ShippingDetails: {
                  SellingManagerSalesRecordNumber: '666',
                },
                QuantityPurchased: '1',
                OrderLineItemID: '110191052804-28493630001',
                Item: {
                  Title: 'Test Listing Do Not Buy53618',
                  SKU: 'Test Item 784',
                  Site: 'US',
                  ItemID: '110191052804',
                },
                GuaranteedShipping: 'false',
                ExtendedOrderID: '292873010!875436000',
                eBayPlusTransaction: 'false',
                CreatedDate: '2017-03-06T06:19:50.000Z',
                Buyer: {
                  UserLastName: 'User',
                  UserFirstName: 'Test',
                  Email: 'celigo_qa_buyer_2@example.com',
                },
                ActualShippingCost: '1.0',
                ActualHandlingCost: '0.0',
                ShippingServiceSelected: {
                  ShippingPackageInfo: [
                    {
                      EstimatedDeliveryTimeMin: '2017-03-08T08:00:00.000Z',
                      EstimatedDeliveryTimeMax: '2017-03-08T08:00:00.000Z',
                    },
                  ],
                },
                Taxes: {
                  TotalTaxAmount: '0.0',
                  TaxDetails: [
                    {
                      TaxOnSubtotalAmount: '0.0',
                      TaxOnShippingAmount: '0.0',
                      TaxOnHandlingAmount: '0.0',
                      TaxDescription: 'SalesTax',
                      TaxAmount: '0.0',
                      Imposition: 'SalesTax',
                    },
                    {
                      TaxDescription: 'ElectronicWasteRecyclingFee',
                      TaxAmount: '0.0',
                      Imposition: 'WasteRecyclingFee',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };
    const formattedMapping = [
      {
        generate: 'firstname',
        extract: 'firstname',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'lastname',
        extract: 'lastname',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'email',
        extract: 'TransactionArray.Transaction[0].Buyer.Email',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'custentity_celigo_etail_channel',
        hardCodedValue: 'eBay',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'phone',
        extract: 'ShippingAddress.Phone',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'isperson',
        hardCodedValue: 'true',
        internalId: false,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'subsidiary.internalid',
        extract: null,
        hardCodedValue: '3',
        internalId: true,
        immutable: false,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'addressbook[*].defaultshipping',
        hardCodedValue: 'true',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].defaultbilling',
        hardCodedValue: 'true',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].addressee',
        extract: 'fullname',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].addrphone',
        extract: 'ShippingAddress.Phone',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].addr1',
        extract: 'ShippingAddress.Street1',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].addr2',
        extract: 'ShippingAddress.Street2',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].city',
        extract: 'ShippingAddress.CityName',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].state',
        extract: 'ShippingAddress.StateOrProvince',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].zip',
        extract: 'ShippingAddress.PostalCode',
        internalId: false,
        immutable: false,
      },
      {
        generate: 'addressbook[*].country.internalid',
        extract: 'ShippingAddress.Country',
        internalId: true,
        immutable: false,
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });
});
