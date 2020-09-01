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
      "importResource": {
        "_connectionId": "5ee0d6d73c11e4201f431566",
        "_integrationId": "5ee0d6d79dd4b36c17c41927",
        "_connectorId": "5b61ae4aeb538642c26bdbe6",
        "netsuite_da": {
          "recordType": "customer",
          "mapping": {
            "lists": [
              {
                "generate": "_billing_addressbook",
                "fields": [
                  {
                    "generate": "defaultbilling",
                    "hardCodedValue": "true"
                  },
                  {
                    "generate": "addr1",
                    "extract": "BillingAddress1"
                  },
                  {
                    "generate": "addr2",
                    "extract": "{{#if BillingAddress1}} {{regexReplace BillingStreet '' BillingAddress1 g}} {{/if}}"
                  },
                  {
                    "generate": "city",
                    "extract": "BillingCity"
                  },
                  {
                    "generate": "state",
                    "extract": "BillingState",
                    "internalId": false,
                    "lookupName": "billing_state_lookup"
                  },
                  {
                    "generate": "country",
                    "extract": "BillingCountry"
                  },
                  {
                    "generate": "zip",
                    "extract": "BillingPostalCode"
                  }
                ]
              },
              {
                "generate": "_shipping_addressbook",
                "fields": [
                  {
                    "generate": "defaultshipping",
                    "hardCodedValue": "true"
                  },
                  {
                    "generate": "addr1",
                    "extract": "ShippingAddress1"
                  },
                  {
                    "generate": "addr2",
                    "extract": "{{#if ShippingAddress1}} {{regexReplace ShippingStreet '' ShippingAddress1 g}} {{/if}}"
                  },
                  {
                    "generate": "city",
                    "extract": "ShippingCity"
                  },
                  {
                    "generate": "state",
                    "extract": "ShippingState",
                    "internalId": false,
                    "lookupName": "shipping_state_lookup"
                  },
                  {
                    "generate": "country",
                    "extract": "ShippingCountry"
                  },
                  {
                    "generate": "zip",
                    "extract": "ShippingPostalCode"
                  }
                ]
              }
            ],
            "fields": [
              {
                "generate": "custentity_celigo_sfio_sf_id",
                "extract": "Id"
              },
              {
                "generate": "companyname",
                "extract": "Name"
              },
              {
                "generate": "parent",
                "extract": "ParentId",
                "internalId": true,
                "lookupName": "customer_parent_lookup",
                "immutable": false,
                "discardIfEmpty": false
              },
              {
                "generate": "isperson",
                "hardCodedValue": "false"
              },
              {
                "generate": "phone",
                "extract": "Phone"
              },
              {
                "generate": "comments",
                "extract": "Description"
              },
              {
                "generate": "fax",
                "extract": "Fax"
              },
              {
                "generate": "url",
                "extract": "{{#if Website}}{{#contains Website \"http\"}}{{Website}}{{else}}http://{{Website}}{{/contains}}{{/if}}",
                "internalId": false,
                "immutable": false,
                "discardIfEmpty": false
              },
              {
                "generate": "custentity_celigo_sfnsio_dummymapping",
                "extract": "Website",
                "internalId": false,
                "immutable": false,
                "discardIfEmpty": false
              },
              {
                "generate": "custentity_celigo_sfio_skip_export_to_sf",
                "hardCodedValue": "true",
                "discardIfEmpty": false
              }
            ]
          },
        },
        "adaptorType": "NetSuiteDistributedImport"
      },
      "getRawMappings": false,
      "isGroupedSampleData": false,
      "netsuiteRecordType": "customer",
      "options": {
        "recordType": "customer",
        "integrationApp": {
          "mappingMetadata": {
            "salesforce_account_netsuite_customer_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id",
                  "companyname",
                  "custentity_celigo_sfnsio_dummymapping",
                  "custentity_customer_channel_tier"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "salesforce_contact_to_netsuite_contact_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id",
                  "email",
                  "lastname",
                  "firstname"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_item_to_salesforce_product_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Item_Pricing_Type__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Item_Pricing_Type__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "salesforce_opportunity_to_netsuite_salesorder_import": [
              {
                "requiredGenerateFields": [
                  "entity",
                  "custbody_celigo_sfio_sf_id",
                  "custbody_celigo_sfio_sf_originated_ord",
                  "startdate",
                  "enddate",
                  "custbody_order_type",
                  "custbody_tran_term_in_months",
                  "custbody_ship_to_tier",
                  "custbody_bill_to_tier"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sfio_sf_id",
                  "custbody_celigo_sfio_sf_originated_ord"
                ]
              },
              {
                "generateList": "item",
                "requiredGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage"
                ],
                "nonEditableGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage"
                ]
              }
            ],
            "salesforce_account_id_writeback_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_contact_to_salesforce_contact_import_idwriteback": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_contact_to_salesforce_contact_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "netsuite_customer_to_salesforce_account_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c",
                  "celigo_sfnsio__Channel_Tier__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "salesforce_account_financials_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "netsuite_item_group_to_salesforce_product_import": [
              {
                "requiredGenerateFields": [
                  "ProductCode"
                ],
                "nonEditableGenerateFields": [
                  "ProductCode"
                ]
              }
            ],
            "netsuite_salesorder_to_salesforce_order_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "AccountId",
                  "OpportunityId",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              },
              {
                "generateList": "OrderItems",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "Quantity",
                  "UnitPrice"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ]
              }
            ],
            "salesforce_attachment_to_netsuite_so_fileattach": [
              {
                "requiredGenerateFields": [
                  "attachTo.internalId",
                  "attachTo.recordType",
                  "attachedRecord.internalId",
                  "attachedRecord.recordType"
                ],
                "nonEditableGenerateFields": [
                  "attachTo.internalId",
                  "attachTo.recordType",
                  "attachedRecord.internalId",
                  "attachedRecord.recordType"
                ]
              }
            ],
            "netsuite_itemfulfillment_to_salesforce_itemfulfillment_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Sync_Status__c",
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__Account_Name__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Sync_Status__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              },
              {
                "generateList": "celigo_sfnsio__Fulfillment_Lines__r",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ]
              }
            ],
            "netsuite_inventorydetail_to_salesforce_asset_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Product2Id",
                  "celigo_sfnsio__AccountId",
                  "celigo_sfnsio__Fulfillment_Line__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Fulfillment_Line__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "salesforce_itemfulfillment_id_writeback_import": [
              {
                "requiredGenerateFields": [
                  "custbody_celigo_sf_itemfulfillment_id",
                  "custbody_test_sfio_skip_export_to_sf"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sf_itemfulfillment_id",
                  "custbody_test_sfio_skip_export_to_sf"
                ]
              }
            ],
            "salesforce_order_to_netsuite_salesorder_import": [
              {
                "requiredGenerateFields": [
                  "custbody_celigo_sfio_order_id"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sfio_order_id"
                ]
              },
              {
                "generateList": "item",
                "requiredGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage",
                  "custcol_celigo_sfio_order_id"
                ],
                "nonEditableGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage",
                  "custcol_celigo_sfio_order_id"
                ]
              }
            ],
            "netsuite_salesorder_to_salesforce_opportunity_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NS_Originated_Order__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "StageName",
                  "Name",
                  "CloseDate"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__NS_Originated_Order__c"
                ]
              },
              {
                "generateList": "OpportunityLineItems",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "Quantity",
                  "UnitPrice",
                  "PricebookEntryId"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "PricebookEntryId"
                ]
              }
            ],
            "netsuite_contract_to_salesforce_contract_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NetSuite_Record_URL__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NetSuite_Record_URL__c"
                ]
              },
              {
                "generateList": "celigo_sfnsio__Contract_Items__r",
                "requiredGenerateFields": [
                  "Id",
                  "_lineAction",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "Id",
                  "_lineAction",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "netsuite_opportunity_to_salesforce_opportunity_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Opportunity_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "StageName",
                  "Name",
                  "CloseDate"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Opportunity_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode"
                ]
              },
              {
                "generateList": "OpportunityLineItems",
                "requiredGenerateFields": [
                  "Quantity",
                  "UnitPrice",
                  "PricebookEntryId"
                ],
                "nonEditableGenerateFields": [
                  "PricebookEntryId"
                ]
              }
            ],
            "salesforce_product_to_netsuite_item_import": [
              {
                "requiredGenerateFields": [
                  "internalid",
                  "itemid",
                  "custitem_celigo_sfio_sf_id",
                  "itemType"
                ],
                "nonEditableGenerateFields": [
                  "internalid",
                  "custitem_celigo_sfio_sf_id",
                  "itemType"
                ]
              }
            ],
            "netsuite_salesorder_status_to_salesforce_order_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Order_Status__c",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ]
          },
          "connectorExternalId": "salesforce_account_netsuite_customer_import"
        }
      },
      "exportResource": {
        "_id": "5ee73a1208364329e076250d",
        "createdAt": "2020-06-15T09:06:27.023Z",
        "lastModified": "2020-08-11T10:34:59.046Z",
        "name": "Get Accounts from Salesforce",
        "_connectionId": "5ee0d6d8e6f76614d0d395c3",
        "_integrationId": "5ee0d6d79dd4b36c17c41927",
        "_connectorId": "5b61ae4aeb538642c26bdbe6",
        "externalId": "salesforce_account_to_netsuite_customer_export",
        "apiIdentifier": "ea49713330",
        "asynchronous": true,
        "type": "distributed",
        "distributed": {
          "bearerToken": "******"
        },
        "salesforce": {
          "sObjectType": "Account",
          "distributed": {
            "connectorId": "sfns-io",
            "disabled": true,
            "qualifier": "celigo_sfnsio__NetSuite_Id__c != ''",
            "batchSize": 50,
            "skipExportFieldId": "celigo_sfnsio__Skip_Export_To_NetSuite__c",
            "userDefinedReferencedFields": [
              null
            ],
            "relatedLists": null
          }
        },
        "adaptorType": "SalesforceExport"
      }
    }
    const formattedMapping = [
      {
        "generate": "custentity_celigo_sfio_sf_id",
        "extract": "Id",
        "isRequired": true,
        "isNotEditable": true,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "companyname",
        "extract": "Name",
        "isRequired": true,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "parent.internalid",
        "extract": "ParentId",
        "internalId": true,
        "lookupName": "customer_parent_lookup",
        "immutable": false,
        "discardIfEmpty": false,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "isperson",
        "hardCodedValue": "false",
        "useAsAnInitializeValue": false
      },
      {
        "generate": "phone",
        "extract": "Phone",
        "useAsAnInitializeValue": false
      },
      {
        "generate": "comments",
        "extract": "Description",
        "useAsAnInitializeValue": false
      },
      {
        "generate": "fax",
        "extract": "Fax",
        "useAsAnInitializeValue": false
      },
      {
        "generate": "url",
        "extract": "{{#if Website}}{{#contains Website \"http\"}}{{Website}}{{else}}http://{{Website}}{{/contains}}{{/if}}",
        "internalId": false,
        "immutable": false,
        "discardIfEmpty": false,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "custentity_celigo_sfnsio_dummymapping",
        "extract": "Website",
        "internalId": false,
        "immutable": false,
        "discardIfEmpty": false,
        "isRequired": true,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "custentity_celigo_sfio_skip_export_to_sf",
        "hardCodedValue": "true",
        "discardIfEmpty": false,
        "isRequired": true,
        "isNotEditable": true,
        "useAsAnInitializeValue": false
      },
      {
        "generate": "_billing_addressbook[*].defaultbilling",
        "hardCodedValue": "true"
      },
      {
        "generate": "_billing_addressbook[*].addr1",
        "extract": "BillingAddress1"
      },
      {
        "generate": "_billing_addressbook[*].addr2",
        "extract": "{{#if BillingAddress1}} {{regexReplace BillingStreet '' BillingAddress1 g}} {{/if}}"
      },
      {
        "generate": "_billing_addressbook[*].city",
        "extract": "BillingCity"
      },
      {
        "generate": "_billing_addressbook[*].state",
        "extract": "BillingState",
        "internalId": false,
        "lookupName": "billing_state_lookup"
      },
      {
        "generate": "_billing_addressbook[*].country",
        "extract": "BillingCountry"
      },
      {
        "generate": "_billing_addressbook[*].zip",
        "extract": "BillingPostalCode"
      },
      {
        "generate": "_shipping_addressbook[*].defaultshipping",
        "hardCodedValue": "true"
      },
      {
        "generate": "_shipping_addressbook[*].addr1",
        "extract": "ShippingAddress1"
      },
      {
        "generate": "_shipping_addressbook[*].addr2",
        "extract": "{{#if ShippingAddress1}} {{regexReplace ShippingStreet '' ShippingAddress1 g}} {{/if}}"
      },
      {
        "generate": "_shipping_addressbook[*].city",
        "extract": "ShippingCity"
      },
      {
        "generate": "_shipping_addressbook[*].state",
        "extract": "ShippingState",
        "internalId": false,
        "lookupName": "shipping_state_lookup"
      },
      {
        "generate": "_shipping_addressbook[*].country",
        "extract": "ShippingCountry"
      },
      {
        "generate": "_shipping_addressbook[*].zip",
        "extract": "ShippingPostalCode"
      }
    ]
      expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten Salesforce IA Import Mapping', () => {
    const inputObj = {
      "importResource": {
        "_connectionId": "5ee0d6d8e6f76614d0d395c3",
        "_integrationId": "5ee0d6d79dd4b36c17c41927",
        "_connectorId": "5b61ae4aeb538642c26bdbe6",
        "mapping": {
          "fields": [
            {
              "extract": "companyname",
              "generate": "Name"
            },
            {
              "extract": "phone",
              "generate": "Phone"
            },
            {
              "extract": "url",
              "generate": "Website"
            },
            {
              "generate": "celigo_sfnsio__Skip_Export_To_NetSuite__c",
              "hardCodedValue": "true"
            },
            {
              "extract": "{{billaddr1}}\n{{billaddr2}}",
              "generate": "BillingStreet",
              "default": ""
            },
            {
              "extract": "billcity",
              "generate": "BillingCity"
            },
            {
              "extract": "billstate",
              "generate": "BillingState"
            },
            {
              "extract": "billcountry",
              "generate": "BillingCountry"
            },
            {
              "extract": "billzip",
              "generate": "BillingPostalCode"
            },
            {
              "extract": "{{shipaddr1}}\n{{shipaddr2}}",
              "generate": "ShippingStreet",
              "default": ""
            },
            {
              "extract": "shipcity",
              "generate": "ShippingCity"
            },
            {
              "extract": "shipstate",
              "generate": "ShippingState"
            },
            {
              "extract": "shipcountry",
              "generate": "ShippingCountry"
            },
            {
              "extract": "shipzip",
              "generate": "ShippingPostalCode"
            },
            {
              "extract": "comments",
              "generate": "Description"
            },
            {
              "extract": "internalid",
              "generate": "celigo_sfnsio__NetSuite_Id__c"
            }
          ]
        },
        "salesforce": {
          "sObjectType": "Account",
          },
        "adaptorType": "SalesforceImport"
      },
      "getRawMappings": false,
      "isGroupedSampleData": false,
      "options": {
        "integrationApp": {
          "mappingMetadata": {
            "salesforce_account_netsuite_customer_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id",
                  "companyname",
                  "custentity_celigo_sfnsio_dummymapping",
                  "custentity_customer_channel_tier"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "salesforce_contact_to_netsuite_contact_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id",
                  "email",
                  "lastname",
                  "firstname"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_item_to_salesforce_product_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Item_Pricing_Type__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Item_Pricing_Type__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "salesforce_opportunity_to_netsuite_salesorder_import": [
              {
                "requiredGenerateFields": [
                  "entity",
                  "custbody_celigo_sfio_sf_id",
                  "custbody_celigo_sfio_sf_originated_ord",
                  "startdate",
                  "enddate",
                  "custbody_order_type",
                  "custbody_tran_term_in_months",
                  "custbody_ship_to_tier",
                  "custbody_bill_to_tier"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sfio_sf_id",
                  "custbody_celigo_sfio_sf_originated_ord"
                ]
              },
              {
                "generateList": "item",
                "requiredGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage"
                ],
                "nonEditableGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage"
                ]
              }
            ],
            "salesforce_account_id_writeback_import": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_contact_to_salesforce_contact_import_idwriteback": [
              {
                "requiredGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ],
                "nonEditableGenerateFields": [
                  "custentity_celigo_sfio_skip_export_to_sf",
                  "custentity_celigo_sfio_sf_id"
                ]
              }
            ],
            "netsuite_contact_to_salesforce_contact_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "netsuite_customer_to_salesforce_account_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c",
                  "celigo_sfnsio__Channel_Tier__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "salesforce_account_financials_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ],
            "netsuite_item_group_to_salesforce_product_import": [
              {
                "requiredGenerateFields": [
                  "ProductCode"
                ],
                "nonEditableGenerateFields": [
                  "ProductCode"
                ]
              }
            ],
            "netsuite_salesorder_to_salesforce_order_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "AccountId",
                  "OpportunityId",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              },
              {
                "generateList": "OrderItems",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "Quantity",
                  "UnitPrice"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ]
              }
            ],
            "salesforce_attachment_to_netsuite_so_fileattach": [
              {
                "requiredGenerateFields": [
                  "attachTo.internalId",
                  "attachTo.recordType",
                  "attachedRecord.internalId",
                  "attachedRecord.recordType"
                ],
                "nonEditableGenerateFields": [
                  "attachTo.internalId",
                  "attachTo.recordType",
                  "attachedRecord.internalId",
                  "attachedRecord.recordType"
                ]
              }
            ],
            "netsuite_itemfulfillment_to_salesforce_itemfulfillment_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Sync_Status__c",
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__Account_Name__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Sync_Status__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              },
              {
                "generateList": "celigo_sfnsio__Fulfillment_Lines__r",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c"
                ]
              }
            ],
            "netsuite_inventorydetail_to_salesforce_asset_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__Product2Id",
                  "celigo_sfnsio__AccountId",
                  "celigo_sfnsio__Fulfillment_Line__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Fulfillment_Line__c",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "salesforce_itemfulfillment_id_writeback_import": [
              {
                "requiredGenerateFields": [
                  "custbody_celigo_sf_itemfulfillment_id",
                  "custbody_test_sfio_skip_export_to_sf"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sf_itemfulfillment_id",
                  "custbody_test_sfio_skip_export_to_sf"
                ]
              }
            ],
            "salesforce_order_to_netsuite_salesorder_import": [
              {
                "requiredGenerateFields": [
                  "custbody_celigo_sfio_order_id"
                ],
                "nonEditableGenerateFields": [
                  "custbody_celigo_sfio_order_id"
                ]
              },
              {
                "generateList": "item",
                "requiredGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage",
                  "custcol_celigo_sfio_order_id"
                ],
                "nonEditableGenerateFields": [
                  "celigo_item_netsuite_line_id",
                  "celigo_item_discount_percentage",
                  "custcol_celigo_sfio_order_id"
                ]
              }
            ],
            "netsuite_salesorder_to_salesforce_opportunity_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NS_Originated_Order__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "StageName",
                  "Name",
                  "CloseDate"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "celigo_sfnsio__NS_Originated_Order__c"
                ]
              },
              {
                "generateList": "OpportunityLineItems",
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "Quantity",
                  "UnitPrice",
                  "PricebookEntryId"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Line_Id__c",
                  "PricebookEntryId"
                ]
              }
            ],
            "netsuite_contract_to_salesforce_contract_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NetSuite_Record_URL__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Id__c",
                  "celigo_sfnsio__NetSuite_Record_URL__c"
                ]
              },
              {
                "generateList": "celigo_sfnsio__Contract_Items__r",
                "requiredGenerateFields": [
                  "Id",
                  "_lineAction",
                  "celigo_sfnsio__NetSuite_Id__c"
                ],
                "nonEditableGenerateFields": [
                  "Id",
                  "_lineAction",
                  "celigo_sfnsio__NetSuite_Id__c"
                ]
              }
            ],
            "netsuite_opportunity_to_salesforce_opportunity_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Opportunity_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode",
                  "StageName",
                  "Name",
                  "CloseDate"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__NetSuite_Opportunity_Id__c",
                  "Pricebook2Id",
                  "CurrencyIsoCode"
                ]
              },
              {
                "generateList": "OpportunityLineItems",
                "requiredGenerateFields": [
                  "Quantity",
                  "UnitPrice",
                  "PricebookEntryId"
                ],
                "nonEditableGenerateFields": [
                  "PricebookEntryId"
                ]
              }
            ],
            "salesforce_product_to_netsuite_item_import": [
              {
                "requiredGenerateFields": [
                  "internalid",
                  "itemid",
                  "custitem_celigo_sfio_sf_id",
                  "itemType"
                ],
                "nonEditableGenerateFields": [
                  "internalid",
                  "custitem_celigo_sfio_sf_id",
                  "itemType"
                ]
              }
            ],
            "netsuite_salesorder_status_to_salesforce_order_import": [
              {
                "requiredGenerateFields": [
                  "celigo_sfnsio__NetSuite_Order_Status__c",
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ],
                "nonEditableGenerateFields": [
                  "celigo_sfnsio__Skip_Export_To_NetSuite__c"
                ]
              }
            ]
          },
          "connectorExternalId": "netsuite_customer_to_salesforce_account_import"
        }
      },
      "exportResource": {
        "_connectionId": "5ee0d6d73c11e4201f431566",
        "_integrationId": "5ee0d6d79dd4b36c17c41927",
        "_connectorId": "5b61ae4aeb538642c26bdbe6",
        "type": "distributed",
        "netsuite": {
          "type": "distributed",
        },
        "adaptorType": "NetSuiteExport"
      }
    }
      
    const formattedMapping = [
      {
        "extract": "companyname",
        "generate": "Name"
      },
      {
        "extract": "phone",
        "generate": "Phone"
      },
      {
        "extract": "url",
        "generate": "Website"
      },
      {
        "generate": "celigo_sfnsio__Skip_Export_To_NetSuite__c",
        "hardCodedValue": "true",
        "isRequired": true,
        "isNotEditable": true
      },
      {
        "extract": "{{billaddr1}}\n{{billaddr2}}",
        "generate": "BillingStreet",
        "default": ""
      },
      {
        "extract": "billcity",
        "generate": "BillingCity"
      },
      {
        "extract": "billstate",
        "generate": "BillingState"
      },
      {
        "extract": "billcountry",
        "generate": "BillingCountry"
      },
      {
        "extract": "billzip",
        "generate": "BillingPostalCode"
      },
      {
        "extract": "{{shipaddr1}}\n{{shipaddr2}}",
        "generate": "ShippingStreet",
        "default": ""
      },
      {
        "extract": "shipcity",
        "generate": "ShippingCity"
      },
      {
        "extract": "shipstate",
        "generate": "ShippingState"
      },
      {
        "extract": "shipcountry",
        "generate": "ShippingCountry"
      },
      {
        "extract": "shipzip",
        "generate": "ShippingPostalCode"
      },
      {
        "extract": "comments",
        "generate": "Description"
      },
      {
        "extract": "internalid",
        "generate": "celigo_sfnsio__NetSuite_Id__c"
      }
    ]
    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten FTP Import Mapping correctly in case of grouped sample data', () => {
  const inputObj = {
    "importResource": {
      "_connectionId": "5f354102b2b91626b0e94d00",
      "distributed": false,
      "apiIdentifier": "i3f2df0f5e",
      "mapping": {
        "fields": [
          {
            "extract": "[Base Price]",
            "generate": "field two"
          }
        ],
        "lists": [
          {
            "fields": [
              {
                "extract": "*.Amazon Product ASIN",
                "generate": "Test"
              },
              {
                "extract": "*.Description",
                "generate": "test field3"
              }
            ],
            "generate": ""
          },
          {
            "fields": [
              {
                "extract": "Name",
                "generate": "field1"
              },
              {
                "extract": "recordType",
                "generate": "field2"
              },
              {
                "extract": "[Display Name]",
                "generate": "field3"
              }
            ],
            "generate": "abc"
          },
          {
            "fields": [
              {
                "extract": "asdfgh",
                "generate": "field1"
              }
            ],
            "generate": "abcd"
          }
        ]
      },
      "file": {
        "type": "csv",
        "csv": {}
      },
      "ftp": {
        "directoryPath": "h",
        "fileName": "h"
      },
      "adaptorType": "FTPImport"
    },
    "getRawMappings": false,
    "isGroupedSampleData": true,
    "options": {},
    "exportResource": {
      "_connectionId": "5c88a4bb26a9676c5d706324",
      "netsuite": {
        "type": "restlet",
        "skipGrouping": false,
        "statsOnly": false,
        "restlet": {
          "recordType": "item",
          "searchId": "12"
        }
      },
      "adaptorType": "NetSuiteExport"
    }
  };
  const formattedMapping = [
    {
      "extract": "Base Price",
      "generate": "field two",
      "useFirstRow": true
    },
    {
      "extract": "Amazon Product ASIN",
      "generate": "Test"
    },
    {
      "extract": "Description",
      "generate": "test field3"
    },
    {
      "extract": "Name",
      "generate": "abc[*].field1",
      "useFirstRow": true
    },
    {
      "extract": "recordType",
      "generate": "abc[*].field2",
      "useFirstRow": true
    },
    {
      "extract": "Display Name",
      "generate": "abc[*].field3",
      "useFirstRow": true
    },
    {
      "extract": "asdfgh",
      "generate": "abcd[*].field1",
      "useFirstRow": true
    }
  ]
  expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  })

  test('should flatten FTP Import Mapping correctly in case of non-grouped sample data', () => {
    const inputObj = {
      "importResource": {
        "_connectionId": "5f354102b2b91626b0e94d00",
        "mapping": {
          "fields": [
            {
              "extract": "[Base Price]",
              "generate": "field two"
            }
          ],
          "lists": [
            {
              "fields": [
                {
                  "extract": "*.Amazon Product ASIN",
                  "generate": "Test"
                },
                {
                  "extract": "*.Description",
                  "generate": "test field3"
                }
              ],
              "generate": ""
            },
            {
              "fields": [
                {
                  "extract": "Name",
                  "generate": "field1"
                },
                {
                  "extract": "recordType",
                  "generate": "field2"
                },
                {
                  "extract": "[Display Name]",
                  "generate": "field3"
                }
              ],
              "generate": "abc"
            },
            {
              "fields": [
                {
                  "extract": "asdfgh",
                  "generate": "field1"
                }
              ],
              "generate": "abcd"
            }
          ]
        },
        "file": {
          "type": "csv",
          "csv": {}
        },
        "adaptorType": "FTPImport"
      },
      "getRawMappings": false,
      "isGroupedSampleData": false,
      "options": {},
      "exportResource": {
        "_connectionId": "5c88a4bb26a9676c5d706324",
        "netsuite": {
          "type": "restlet",
          "restlet": {}
        },
        "adaptorType": "NetSuiteExport"
      }
    }
    const formattedMapping = [
      {
        "extract": "Base Price",
        "generate": "field two"
      },
      {
        "extract": "Amazon Product ASIN",
        "generate": "Test"
      },
      {
        "extract": "Description",
        "generate": "test field3"
      },
      {
        "extract": "Name",
        "generate": "abc[*].field1"
      },
      {
        "extract": "recordType",
        "generate": "abc[*].field2"
      },
      {
        "extract": "Display Name",
        "generate": "abc[*].field3"
      },
      {
        "extract": "asdfgh",
        "generate": "abcd[*].field1"
      }
    ];
    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
    })
  
});