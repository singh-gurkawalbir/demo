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
                    generate: 'state',
                    extract: 'BillingState',
                    internalId: false,
                    lookupName: 'billing_state_lookup',
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
          },
          connectorExternalId: 'salesforce_account_netsuite_customer_import',
        },
      },
      exportResource: {
        _id: '5ee73a1208364329e076250d',
        _connectionId: '5ee0d6d8e6f76614d0d395c3',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        externalId: 'salesforce_account_to_netsuite_customer_export',
        type: 'distributed',
        salesforce: {
          sObjectType: 'Account',
          distributed: {
            qualifier: "celigo_sfnsio__NetSuite_Id__c != ''",
            skipExportFieldId: 'celigo_sfnsio__Skip_Export_To_NetSuite__c',
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
        generate: '_billing_addressbook[*].state',
        extract: 'BillingState',
        internalId: false,
        lookupName: 'billing_state_lookup',
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
              extract: '{{shipaddr1}}\n{{shipaddr2}}',
              generate: 'ShippingStreet',
              default: '',
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
        extract: '{{shipaddr1}}\n{{shipaddr2}}',
        generate: 'ShippingStreet',
        default: '',
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
      },
    };
    const formattedMapping = [
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
        generate: 'addressbook[*].country.internalid',
        extract: 'ShippingAddress.Country',
        internalId: true,
        immutable: false,
      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });
});
