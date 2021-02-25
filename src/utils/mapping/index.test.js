/* global describe, test,  expect */
import each from 'jest-each';
import util, {
  checkExtractPathFoundInSampledata,
  unwrapTextForSpecialChars,
  wrapTextForSpecialChars,
  isMappingEqual,
} from '.';

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
describe('Field-list mapping to UI mapping utils', () => {
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

  test('should flatten Netsuite Import Mapping in case of grouped flow sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        distributed: true,
        netsuite_da: {
          operation: 'add',
          recordType: 'account',
          mapping: {
            fields: [
              {
                generate: 'category1099misc',
                hardCodedValue: '-170',
                internalId: true,
              },
              {
                generate: 'c',
                extract: "['test test']",
                internalId: false,
              },
              {
                generate: 'celigo_initializeValues',
                hardCodedValue: 'c',
              },
            ],
            lists: [
              {
                generate: 'a',
                fields: [
                  {
                    generate: 'a1',
                    extract: "0.['test test']",
                    internalId: false,
                  },
                  {
                    generate: 'a2',
                    extract: "0.['test test']",
                    discardIfEmpty: true,
                    immutable: true,
                    internalId: false,
                  },
                  {
                    generate: 'a3',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
              {
                generate: 'b',
                fields: [
                  {
                    generate: 'b1',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
            ],
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: true,
      netsuiteRecordType: 'account',
      options: {
        recordType: 'account',
      },
      exportResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        generate: 'category1099misc.internalid',
        hardCodedValue: '-170',
        internalId: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'c',
        extract: 'test test',
        internalId: false,
        useAsAnInitializeValue: true,
      },
      {
        generate: 'a[*].a1',
        extract: 'test test',
        internalId: false,
        useFirstRow: true,
        useIterativeRow: true,
      },
      {
        generate: 'a[*].a2',
        extract: 'test test',
        discardIfEmpty: true,
        immutable: true,
        internalId: false,
        useFirstRow: true,
        useIterativeRow: true,
      },
      {
        generate: 'a[*].a3',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,
      },
      {
        generate: 'b[*].b1',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,
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
        useIterativeRow: true,

      },
      {
        extract: 'Description',
        generate: 'test field3',
        useIterativeRow: true,

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
        useIterativeRow: true,

      },
      {
        extract: 'Description',
        generate: 'test field3',
        useIterativeRow: true,

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
        useIterativeRow: true,

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
        useIterativeRow: true,

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

  test('should flatten Netsuite Import Mapping in case of grouped flow sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        distributed: true,
        netsuite_da: {
          operation: 'add',
          recordType: 'account',
          mapping: {
            fields: [
              {
                generate: 'category1099misc',
                hardCodedValue: '-170',
                internalId: true,
              },
              {
                generate: 'c',
                extract: "['test test']",
                internalId: false,
              },
              {
                generate: 'celigo_initializeValues',
                hardCodedValue: 'c',
              },
            ],
            lists: [
              {
                generate: 'a',
                fields: [
                  {
                    generate: 'a1',
                    extract: "0.['test test']",
                    internalId: false,
                  },
                  {
                    generate: 'a2',
                    extract: "0.['test test']",
                    discardIfEmpty: true,
                    immutable: true,
                    internalId: false,
                  },
                  {
                    generate: 'a3',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
              {
                generate: 'b',
                fields: [
                  {
                    generate: 'b1',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
            ],
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: true,
      netsuiteRecordType: 'account',
      options: {
        recordType: 'account',
      },
      exportResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        generate: 'category1099misc.internalid',
        hardCodedValue: '-170',
        internalId: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'c',
        extract: 'test test',
        internalId: false,
        useAsAnInitializeValue: true,
      },
      {
        generate: 'a[*].a1',
        extract: 'test test',
        internalId: false,
        useFirstRow: true,
        useIterativeRow: true,

      },
      {
        generate: 'a[*].a2',
        extract: 'test test',
        discardIfEmpty: true,
        immutable: true,
        internalId: false,
        useFirstRow: true,
        useIterativeRow: true,

      },
      {
        generate: 'a[*].a3',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,

      },
      {
        generate: 'b[*].b1',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,

      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });

  test('should flatten Netsuite Import Mapping in case of non-grouped flow sample data', () => {
    const inputObj = {
      importResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        distributed: true,
        netsuite_da: {
          operation: 'add',
          recordType: 'account',
          mapping: {
            fields: [
              {
                generate: 'category1099misc',
                hardCodedValue: '-170',
                internalId: true,
              },
              {
                generate: 'c',
                extract: "['test test']",
                internalId: false,
              },
              {
                generate: 'celigo_initializeValues',
                hardCodedValue: 'c',
              },
            ],
            lists: [
              {
                generate: 'a',
                fields: [
                  {
                    generate: 'a1',
                    extract: "0.['test test']",
                    internalId: false,
                  },
                  {
                    generate: 'a2',
                    extract: "0.['test test']",
                    discardIfEmpty: true,
                    immutable: true,
                    internalId: false,
                  },
                  {
                    generate: 'a3',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
              {
                generate: 'b',
                fields: [
                  {
                    generate: 'b1',
                    extract: "*.['test test']",
                    internalId: false,
                  },
                ],
              },
            ],
          },
        },
        adaptorType: 'NetSuiteDistributedImport',
      },
      isFieldMapping: false,
      isGroupedSampleData: false,
      netsuiteRecordType: 'account',
      options: {
        recordType: 'account',
      },
      exportResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const formattedMapping = [
      {
        generate: 'category1099misc.internalid',
        hardCodedValue: '-170',
        internalId: true,
        useAsAnInitializeValue: false,
      },
      {
        generate: 'c',
        extract: 'test test',
        internalId: false,
        useAsAnInitializeValue: true,
      },
      {
        generate: 'a[*].a1',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,

      },
      {
        generate: 'a[*].a2',
        extract: 'test test',
        discardIfEmpty: true,
        immutable: true,
        internalId: false,
        useIterativeRow: true,

      },
      {
        generate: 'a[*].a3',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,

      },
      {
        generate: 'b[*].b1',
        extract: 'test test',
        internalId: false,
        useIterativeRow: true,

      },
    ];

    expect(util.getMappingFromResource(inputObj)).toEqual(formattedMapping);
  });
});
describe('UI mapping to field-list mapping utils', () => {
  test('should convert UI Netsuite Mapping to field-list mapping in case of grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          generate: 'category1099misc.internalid',
          hardCodedValue: '-170',
          internalId: true,
          useAsAnInitializeValue: false,
        },
        {
          generate: 'c',
          extract: 'test test',
          internalId: false,
          useAsAnInitializeValue: true,
        },
        {
          generate: 'a[*].a1',
          extract: 'test test',
          internalId: false,
          useFirstRow: true,
        },
        {
          generate: 'a[*].a2',
          extract: 'test test',
          discardIfEmpty: true,
          immutable: true,
          internalId: false,
          useFirstRow: true,
        },
        {
          generate: 'a[*].a3',
          extract: 'test test',
          internalId: false,
          useFirstRow: true,
        },
        {
          generate: 'b[*].b',
          extract: 'test test',
          internalId: false,
          useFirstRow: true,
        },
      ],
      generateFields: [
        {
          id: 'category1099misc.internalid',
          name: '1099-MISC Category (InternalId)',
          type: 'select',
        },
        {
          id: 'category1099misc',
          name: '1099-MISC Category (Name)',
          type: 'select',
        },
      ],
      isGroupedSampleData: true,
      importResource: {
        adaptorType: 'NetSuiteDistributedImport',
      },
      netsuiteRecordType: 'account',
    };
    const fieldListMapping = {
      fields: [
        {
          generate: 'category1099misc',
          hardCodedValue: '-170',
          internalId: true,
          useAsAnInitializeValue: false,
        },
        {
          generate: 'c',
          extract: "['test test']",
          internalId: false,
        },
        {
          generate: 'celigo_initializeValues',
          hardCodedValue: 'c',
        },
      ],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              generate: 'a1',
              extract: "0.['test test']",
              internalId: false,
            },
            {
              generate: 'a2',
              extract: "0.['test test']",
              discardIfEmpty: true,
              immutable: true,
              internalId: false,
            },
            {
              generate: 'a3',
              extract: "0.['test test']",
              internalId: false,
            },
          ],
        },
        {
          generate: 'b',
          fields: [
            {
              generate: 'b',
              extract: "0.['test test']",
              internalId: false,
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI Netsuite Mapping to field-list mapping in case of non-grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          generate: 'category1099misc.internalid',
          hardCodedValue: '-170',
          internalId: true,
          useAsAnInitializeValue: false,
        },
        {
          generate: 'c',
          extract: 'test test',
          internalId: false,
          useAsAnInitializeValue: true,
        },
        {
          generate: 'a[*].a1',
          extract: 'test test',
          internalId: false,
        },
        {
          generate: 'a[*].a2',
          extract: 'test test',
          discardIfEmpty: true,
          immutable: true,
          internalId: false,
        },
        {
          generate: 'a[*].a3',
          extract: 'test test',
          internalId: false,
        },
        {
          generate: 'b[*].b',
          extract: 'test test',
          internalId: false,
        },
      ],
      generateFields: [
        {
          id: 'category1099misc.internalid',
          name: '1099-MISC Category (InternalId)',
          type: 'select',
        },
        {
          id: 'category1099misc',
          name: '1099-MISC Category (Name)',
          type: 'select',
        },
      ],
      isGroupedSampleData: false,
      importResource: {
        adaptorType: 'NetSuiteDistributedImport',
      },
      netsuiteRecordType: 'account',
    };
    const fieldListMapping = {
      fields: [
        {
          generate: 'category1099misc',
          hardCodedValue: '-170',
          internalId: true,
          useAsAnInitializeValue: false,
        },
        {
          generate: 'c',
          extract: "['test test']",
          internalId: false,
        },
        {
          generate: 'celigo_initializeValues',
          hardCodedValue: 'c',
        },
      ],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              generate: 'a1',
              extract: "['test test']",
              internalId: false,
            },
            {
              generate: 'a2',
              extract: "['test test']",
              discardIfEmpty: true,
              immutable: true,
              internalId: false,
            },
            {
              generate: 'a3',
              extract: "['test test']",
              internalId: false,
            },
          ],
        },
        {
          generate: 'b',
          fields: [
            {
              generate: 'b',
              extract: "['test test']",
              internalId: false,
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI IA Netsuite Mapping to field-list mapping', () => {
    const inputObj = {
      mappings: [
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
          generate: '_billing_addressbook[*].defaultbilling',
          hardCodedValue: 'true',
        },
        {
          generate: '_billing_addressbook[*].state',
          extract: 'BillingState',
          internalId: false,
          lookupName: 'billing_state_lookup',
        },
      ],
      generateFields: [
        {
          id: 'custentity_celigo_sfio_sf_id',
          name: 'Salesforce Id (IO) (2)',
          type: 'text',
        },
        {
          id: 'companyname',
          name: 'Company Name',
          type: 'text',
        },
        {
          id: 'parent.internalid',
          name: 'Child Of (InternalId)',
          type: 'select',
        },
        {
          id: '_billing_addressbook[*].state',
          name: 'Billing State',
          type: 'text',
          sublist: '_billing_addressbook',
        },
      ],
      isGroupedSampleData: false,
      importResource: {
        adaptorType: 'NetSuiteDistributedImport',
      },
      netsuiteRecordType: 'customer',
    };
    const fieldListMapping = {
      fields: [
        {
          generate: 'custentity_celigo_sfio_sf_id',
          extract: 'Id',
          isRequired: true,
          isNotEditable: true,
          useAsAnInitializeValue: false,
          internalId: false,
        },
        {
          generate: 'companyname',
          extract: 'Name',
          isRequired: true,
          useAsAnInitializeValue: false,
          internalId: false,
        },
        {
          generate: 'parent',
          extract: 'ParentId',
          internalId: true,
          lookupName: 'customer_parent_lookup',
          immutable: false,
          discardIfEmpty: false,
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
      ],
      lists: [
        {
          generate: '_billing_addressbook',
          fields: [
            {
              generate: 'defaultbilling',
              hardCodedValue: 'true',
              internalId: false,
            },
            {
              generate: 'state',
              extract: 'BillingState',
              internalId: false,
              lookupName: 'billing_state_lookup',
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI IA Salesforce Mapping to field-list mapping', () => {
    const inputObj = {
      mappings: [
        {
          extract: 'id',
          generate: 'celigo_sfnsio__NetSuite_Id__c',
          isRequired: true,
          isNotEditable: true,
        },
        {
          extract: 'trandate',
          extractDateFormat: 'MM/DD/YYYY',
          extractDateTimezone: 'America/Los_Angeles',
          generate: 'EffectiveDate',
        },
        {
          generate: 'Status',
          hardCodedValue: 'Draft',
        },
        {
          extract: 'entity.internalid',
          generate: 'AccountId',
          lookupName: 'account_lookup',
          isRequired: true,
        },
        {
          extract: 'item[*].orderItemId',
          generate: 'OrderItems[*].Id',
        },
      ],
      generateFields: [
        {
          id: 'Id',
          name: 'Order ID',
          type: 'id',
          options: [
          ],
        },
        {
          id: 'EffectiveDate',
          name: 'Order Start Date',
          type: 'date',
          options: [

          ],
        },
        {
          id: 'Status',
          name: 'Status',
          type: 'picklist',
          options: [
            {
              active: true,
              defaultValue: false,
              label: 'Draft',
              validFor: null,
              value: 'Draft',
            },
            {
              active: true,
              defaultValue: false,
              label: 'Activated',
              validFor: null,
              value: 'Activated',
            },
          ],
        },
        {
          id: 'OrderItems[*].Id',
          name: 'OrderItems: Order Product ID',
          type: 'id',
          options: [],
        },
      ],
      isGroupedSampleData: false,
      importResource: {
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        salesforce: {
          operation: 'addupdate',
          sObjectType: 'Order',
          api: 'compositerecord',
        },
        adaptorType: 'SalesforceImport',
      },
      exportResource: {
        _connectionId: '5ee0d6d73c11e4201f431566',
        _integrationId: '5ee0d6d79dd4b36c17c41927',
        _connectorId: '5b61ae4aeb538642c26bdbe6',
        type: 'distributed',
        distributed: {
        },
        netsuite: {
          type: 'distributed',
          skipGrouping: false,
          restlet: {
            criteria: [
            ],
          },
          distributed: {
            recordType: 'salesorder',
            sublists: [
              'item',
            ],
            skipExportFieldId: 'custbody_celigo_sfio_skip_export_to_sf',
          },
        },

        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          extract: 'id',
          generate: 'celigo_sfnsio__NetSuite_Id__c',
          isRequired: true,
          isNotEditable: true,
        },
        {
          extract: 'trandate',
          extractDateFormat: 'MM/DD/YYYY',
          extractDateTimezone: 'America/Los_Angeles',
          generate: 'EffectiveDate',
        },
        {
          generate: 'Status',
          hardCodedValue: 'Draft',
        },
        {
          extract: 'entity.internalid',
          generate: 'AccountId',
          lookupName: 'account_lookup',
          isRequired: true,
        },
      ],
      lists: [
        {
          generate: 'OrderItems',
          fields: [
            {
              extract: 'item[*].orderItemId',
              generate: 'Id',
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI FTP Mapping to field-list mapping in case of grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          extract: 'Base Price',
          generate: 'test test',
        },
        {
          extract: 'Description',
          generate: 'a[*].a1',
        },
        {
          generate: 'a[*].a2',
          extract: 'Type',
          useFirstRow: true,
        },
        {
          generate: 'b[*].b1',
          extract: 'Display Name',
          useFirstRow: false,
          discardIfEmpty: true,
        },
        {
          generate: 'test test2',
          useFirstRow: true,
          hardCodedValue: null,
        },
      ],
      generateFields: [],
      isGroupedSampleData: true,
      importResource: {
        _connectionId: '5f354102b2b91626b0e94d00',
        distributed: false,
        file: {
          type: 'csv',
          csv: {},
        },
        ftp: {},
        adaptorType: 'FTPImport',
      },
      exportResource: {
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          generate: 'test test2',
          useFirstRow: true,
          hardCodedValue: null,
        },
      ],
      lists: [
        {
          generate: '',
          fields: [
            {
              extract: '*.[Base Price]',
              generate: 'test test',
            },
          ],
        },
        {
          generate: 'a',
          fields: [
            {
              extract: '*.Description',
              generate: 'a1',
            },
            {
              generate: 'a2',
              extract: 'Type',
            },
          ],
        },
        {
          generate: 'b',
          fields: [
            {
              generate: 'b1',
              extract: '*.[Display Name]',
              discardIfEmpty: true,
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI FTP Mapping to field-list mapping in case of non-grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          generate: 'test test2',
          hardCodedValue: null,
        },
        {
          extract: 'Base Price',
          generate: 'test test',
        },
        {
          extract: 'Description',
          generate: 'a[*].a1',
        },
        {
          extract: 'Type',
          generate: 'a[*].a2',
        },
        {
          extract: 'Display Name',
          generate: 'b[*].b1',
          discardIfEmpty: true,
        },
      ],
      generateFields: [],
      isGroupedSampleData: false,
      importResource: {
        _connectionId: '5f354102b2b91626b0e94d00',
        distributed: false,
        file: {
          type: 'csv',
          csv: {},
        },
        ftp: {},
        adaptorType: 'FTPImport',
      },
      exportResource: {
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          generate: 'test test2',
          hardCodedValue: null,
        },
        {
          extract: '[Base Price]',
          generate: 'test test',
        },
      ],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              extract: 'Description',
              generate: 'a1',
            },
            {
              extract: 'Type',
              generate: 'a2',
            },
          ],
        },
        {
          generate: 'b',
          fields: [
            {
              extract: '[Display Name]',
              generate: 'b1',
              discardIfEmpty: true,
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI IA Mapping to field-list mapping', () => {
    const inputObj = {
      mappings: [
        {
          extract: '{{#if [First Name]}}{{[First Name]}}{{else}}{{[Company Name]}}{{/if}}',
          generate: 'customer.first_name',
          isRequired: true,
        },
        {
          extract: 'Last Name',
          generate: 'customer.last_name',
          isRequired: true,
        },
        {
          extract: 'addresses[*].[Addressee(Address)]',
          generate: 'customer.addresses[*].name',
        },
      ],
      generateFields: [
        {
          id: 'customer.first_name',
          type: 'string',
          name: 'customer.first_name',
        },
        {
          id: 'customer.last_name',
          type: 'string',
          name: 'customer.last_name',
        },
        {
          id: 'customer.addresses[*].name',
          type: 'string',
          name: 'customer.addresses[*].name',
        },
      ],
      isGroupedSampleData: false,
      importResource: {
        _integrationId: '5d91ca994a9f8b5e241b9e7b',
        _connectorId: '5656f5e3bebf89c03f5dd77e',
        externalId: 'shopify_customer_import_adaptor',
        distributed: false,
        http: {},
        rest: {},
        adaptorType: 'RESTImport',
      },
      exportResource: {
        _connectionId: '5d91ca9a4a9f8b5e241b9e7e',
        _integrationId: '5d91ca994a9f8b5e241b9e7b',
        _connectorId: '5656f5e3bebf89c03f5dd77e',
        externalId: 'shopify_netsuite_customer_export_adaptor',
        type: 'once',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          statsOnly: false,
          restlet: {
            recordType: 'customer',
            searchId: '152957',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          extract: '{{#if [First Name]}}{{[First Name]}}{{else}}{{[Company Name]}}{{/if}}',
          generate: 'customer.first_name',
          isRequired: true,
        },
        {
          extract: '[Last Name]',
          generate: 'customer.last_name',
          isRequired: true,
        },
      ],
      lists: [
        {
          generate: 'customer.addresses',
          fields: [
            {
              extract: 'addresses[*].[Addressee(Address)]',
              generate: 'name',
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI Assistant Mapping to field-list mapping in case of grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          extract: 'Base Price',
          generate: 'test',
        },
        {
          generate: 'a[*].a1',
          extract: 'test test',
        },
        {
          generate: 'a[*].a2',
          useFirstRow: true,
          discardIfEmpty: true,
          immutable: true,
          extract: 'test test',
        },
      ],
      generateFields: [],
      isGroupedSampleData: true,
      importResource: {
        _connectionId: '5c89f66f26a9676c5d71b7b6',
        distributed: false,
        apiIdentifier: 'i32e506616',
        assistant: 'zendesk',
        http: {},
        rest: {},
        adaptorType: 'RESTImport',
        assistantMetadata: {
          resource: 'apps',
          version: 'v2',
          operation: 'create_app',
          lookups: {

          },
        },
      },
      exportResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        netsuite: {
          type: 'restlet',
          skipGrouping: false,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          extract: '[Base Price]',
          generate: 'test',
        },
      ],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              generate: 'a1',
              extract: '*.[test test]',
            },
            {
              generate: 'a2',
              discardIfEmpty: true,
              immutable: true,
              extract: '[test test]',
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });

  test('should convert UI Assistant Mapping to field-list mapping in case of non-grouped flow sample data', () => {
    const inputObj = {
      mappings: [
        {
          extract: 'Base Price',
          generate: 'test',
        },
        {
          extract: 'test test',
          generate: 'a[*].a1',
        },
        {
          extract: 'test test',
          generate: 'a[*].a2',
          immutable: true,
          discardIfEmpty: true,
        },
      ],
      generateFields: [],
      isGroupedSampleData: false,
      importResource: {
        _connectionId: '5c89f66f26a9676c5d71b7b6',
        distributed: false,
        apiIdentifier: 'i32e506616',
        assistant: 'zendesk',
        http: {},
        rest: {},
        adaptorType: 'RESTImport',
        assistantMetadata: {
          resource: 'apps',
          version: 'v2',
          operation: 'create_app',
        },
      },
      exportResource: {
        _connectionId: '5f6afce137d65b2db44b7040',
        netsuite: {
          type: 'restlet',
          skipGrouping: true,
          restlet: {
            recordType: 'item',
            searchId: '12',
          },
        },
        adaptorType: 'NetSuiteExport',
      },
    };
    const fieldListMapping = {
      fields: [
        {
          extract: '[Base Price]',
          generate: 'test',
        },
      ],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              extract: '[test test]',
              generate: 'a1',
            },
            {
              extract: '[test test]',
              generate: 'a2',
              immutable: true,
              discardIfEmpty: true,
            },
          ],
        },
      ],
    };

    expect(util.generateFieldsAndListMappingForApp(inputObj)).toEqual(fieldListMapping);
  });
});

describe('mapping utils', () => {
  test('checkExtractPathFoundInSampledata util', () => {
    expect(checkExtractPathFoundInSampledata('abc.a', {
      abc: { a: 1},
      b: 'c',
    }, false)).toEqual(true);
    expect(checkExtractPathFoundInSampledata('abc[*].a', {
      abc: [{ a: 1}],
      b: 'c',
    }, false)).toEqual(true);
    expect(checkExtractPathFoundInSampledata('abc[*].b', {
      abc: [{ a: 1}],
      b: 'c',
    }, false)).toEqual(false);
  });
  test('isCsvOrXlsxResource util', () => {
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'FTPImport',
      file: {
        type: 'csv',
      },
    })).toEqual(true);
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'S3Import',
      file: {
        type: 'xlsx',
      },
    })).toEqual(true);
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'S3Import',
    })).toEqual(false);
  });
  test('unwrapTextForSpecialChars util', () => {
    const testCases = [
      {
        extract: 'abc',
        flowSampleData: undefined,
        result: 'abc',
      },
      {
        extract: '[abc]',
        flowSampleData: undefined,
        result: 'abc',
      },
      {
        extract: '[[abc]]',
        flowSampleData: undefined,
        result: '[abc]',
      },
      {
        extract: 'abc[*].ab',
        flowSampleData: {
          abc: [{ab: 1}],
        },
        result: 'abc[*].ab',
      },
    ];

    testCases.forEach(({extract, flowSampleData, result}) => {
      expect(unwrapTextForSpecialChars(extract, flowSampleData)).toEqual(result);
    });
  });
  test('wrapTextForSpecialChars util', () => {
    const testCases = [
      {
        extract: 'abc',
        flowSampleData: undefined,
        result: 'abc',
      },
      {
        extract: 'abc asdf',
        flowSampleData: undefined,
        result: '[abc asdf]',
      },
      {
        extract: '[[abc]]',
        flowSampleData: undefined,
        result: '[[[abc\\]\\]]',
      },
      {
        extract: 'abc[*].ab',
        flowSampleData: {
          abc: [{ab: 1}],
        },
        result: 'abc[*].ab',
      },
      {
        extract: 'abc-abv',
        flowSampleData: {},
        result: '[abc-abv]',
      },
    ];

    testCases.forEach(({extract, flowSampleData, result}) => {
      expect(wrapTextForSpecialChars(extract, flowSampleData)).toEqual(result);
    });
  });
  // TODO (Sravan)
  test('setCategoryMappingData util', () => {

  });
  test('getFieldMappingType util', () => {
    const testCases = [
      {input: {lookupName: 'abc'}, output: 'lookup'},
      {input: {hardCodedValue: 'abc'}, output: 'hardCoded'},
      {input: {extract: 'abc'}, output: 'standard'},
      {input: {extract: 'abc{{sum 1 2}}'}, output: 'multifield'},
    ];

    testCases.forEach(({input, output}) => {
      expect(util.getFieldMappingType(input)).toEqual(output);
    });
  });
  test('getHardCodedActionValue util', () => {
    const testCases = [
      {input: {hardCodedValue: 'abc'}, output: 'default'},
      {input: {hardCodedValue: 'test test'}, output: 'default'},
      {input: {hardCodedValue: ''}, output: 'useEmptyString'},
      {input: {hardCodedValue: null}, output: 'useNull'},
    ];

    testCases.forEach(({input, output}) => {
      expect(util.getHardCodedActionValue(input)).toEqual(output);
    });
  });
  test('getDefaultLookupActionValue util', () => {
    const testCases = [
      {input: {allowFailures: false}, output: 'disallowFailure'},
      {input: {allowFailures: false, default: ''}, output: 'disallowFailure'},
      {input: {allowFailures: true, useDefaultOnMultipleMatches: true}, output: 'useDefaultOnMultipleMatches'},
      {input: {allowFailures: true, default: 'asd'}, output: 'default'},
      {input: {allowFailures: true, default: ''}, output: 'useEmptyString'},
      {input: {allowFailures: true, default: null}, output: 'useNull'},
      {input: {allowFailures: true, default: 'null'}, output: 'default'},
    ];

    testCases.forEach(({input, output}) => {
      expect(util.getDefaultLookupActionValue(input)).toEqual(output);
    });
  });
  test('getDefaultActionValue util', () => {
    const testCases = [
      {input: {default: ''}, output: 'useEmptyString'},
      {input: {default: null}, output: 'useNull'},
      {input: {default: 'null'}, output: 'default'},
      {input: {default: 'test'}, output: 'default'},
      {input: {}, output: undefined},
    ];

    testCases.forEach(({input, output}) => {
      expect(util.getDefaultActionValue(input)).toEqual(output);
    });
  });
  test('getApplicationName util', () => {
    const testCases = [
      {resource: {assistant: 'wiser'}, connection: {}, appName: 'Wiser'},
      {resource: {adaptorType: 'FTPImport'}, connection: {}, appName: 'FTP'},
      {resource: {adaptorType: 'S3Import'}, connection: {}, appName: 'Amazon S3'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'mysql'}}, appName: 'MySQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'mssql'}}, appName: 'Microsoft SQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'oracle'}}, appName: 'Oracle DB (SQL)'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'postgresql'}}, appName: 'PostgreSQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {}, appName: 'Snowflake'},

    ];

    testCases.forEach(({resource, connection, appName}) => {
      expect(util.getApplicationName(resource, connection)).toEqual(appName);
    });
  });
  test('getSubRecordRecordTypeAndJsonPath util', () => {
    const resource = {
      distributed: true,
      netsuite_da: {
        operation: 'add',
        recordType: 'salesorder',
        mapping: {
          lists: [
            {
              generate: 'item',
              fields: [
                {
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    recordType: 'inventorydetail',
                    jsonPath: '$',
                  },
                },
              ],
            },
          ],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };
    const subRecordMappingId = 'item[*].celigo_inventorydetail';

    expect(util.getSubRecordRecordTypeAndJsonPath(resource, subRecordMappingId)).toEqual({
      recordType: 'inventorydetail',
      jsonPath: '$',
    });
  });
  test('validateMappings util', () => {
    const testCases = [
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {extract: 'a', generate: 'b'},
        ],
        lookups: [],
        result: {isSuccess: true},
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {extract: 'a', generate: 'a'},
        ],
        lookups: [],
        result: {
          isSuccess: false,
          errMessage: 'You have duplicate mappings for the field(s): a',
        },
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {extract: 'a'},
        ],
        lookups: [],
        result: {
          isSuccess: false,
          errMessage: 'One or more generate fields missing',
        },
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {generate: 'b'},
        ],
        lookups: [],
        result: {
          isSuccess: false,
          errMessage: 'Extract Fields missing for field(s): b',
        },
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {generate: 'b', lookupName: 'lookup1'},
        ],
        lookups: [{name: 'lookup1'}],
        result: {
          isSuccess: true,
        },
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {generate: 'b', lookupName: 'lookup1'},
        ],
        lookups: [{name: 'lookup1', map: {a: 'b'}}],
        result: {
          isSuccess: false,
          errMessage: 'Extract Fields missing for field(s): b',
        },
      },
    ];

    testCases.forEach(({mappings, lookups, result}) => {
      expect(util.validateMappings(mappings, lookups)).toEqual(result);
    });
  });
  test('getExtractPaths util', () => {
    const testCases = [
      {
        fields: [{
          id: 'test',
          test2: {
            a: 1,
            b: 2,
          },
        }],
        options: { jsonPath: '$'},
        result: [
          { id: 'id', type: 'string' },
          { id: 'test2.a', type: 'number' },
          { id: 'test2.b', type: 'number' },
        ],
      },
      {
        fields: [{
          id: 'test',
          test2: {
            a: 1,
            b: 2,
          },
        }],
        options: { jsonPath: 'a'},
        result: [],
      },
      {
        fields: [{
          id: 'test',
          test2: [{
            a: 1,
            b: 2,
          }],
        }],
        options: { jsonPath: 'test2'},
        result: [
          { id: 'a', type: 'number' },
          { id: 'b', type: 'number' },
        ],
      },
    ];

    testCases.forEach(({fields, options, result}) => {
      expect(util.getExtractPaths(fields, options)).toEqual(result);
    });
  });
  test('shiftSubRecordLast util', () => {
    const input = {
      fields: [],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              generate: 'x',
              subRecordMapping: {},
            },
            {
              generate: 'x',
              extract: 'y',
            },

          ],
        },
      ],
    };
    const output = {
      fields: [],
      lists: [
        {
          generate: 'a',
          fields: [
            {
              generate: 'x',
              extract: 'y',
            },
            {
              generate: 'x',
              subRecordMapping: {},
            },
          ],
        },
      ],
    };

    expect(JSON.stringify(util.shiftSubRecordLast(input))).toEqual(JSON.stringify(output));
  });
  test('isMappingEqual util', () => {
    const testCases = [
      {
        mapping1: [{extract: 'a', generate: 'a'}],
        mapping2: [{extract: 'a', generate: 'a'}],
        result: true,
      },
      {
        mapping1: [{extract: 'a', generate: 'a'}],
        mapping2: [{extract: 'a', generate: 'b'}],
        result: false,
      },
      {
        mapping1: [
          {extract: 'a', generate: 'a'},
          {extract: 'b', generate: 'b'},
        ],
        mapping2: [
          {extract: 'a', generate: 'a'},
          {extract: 'b', generate: 'b', lookupName: 'a'},
        ],
        result: false,
      },
      {
        mapping1: [
          {extract: 'a', generate: 'a'},
          {extract: 'b', generate: 'b'},
        ],
        mapping2: [
          {extract: 'a', generate: 'a', key: 'k1', isRequired: true, isNotEditable: true},
          {extract: 'b', generate: 'b', key: 'k2', isRequired: true, isNotEditable: true},
        ],
        result: true,
      },
      {
        mapping1: [
          {extract: 'a', generate: 'a'},
          {extract: 'b', generate: 'b'},
        ],
        mapping2: [
          {extract: 'a', generate: 'a', anyOtherKey: 'a'},
          {extract: 'b', generate: 'b'},
        ],
        result: false,
      },
    ];

    testCases.forEach(({mapping1, mapping2, result}) => {
      expect(isMappingEqual(mapping1, mapping2)).toEqual(result);
    });
  });
  // TODO after release branch merge to master
  test('extractMappingFieldsFromCsv util', () => {
  });
  // TODO
  test('generateSubrecordMappingAndLookup util', () => {
  });
  // TODO
  test('appendModifiedSubRecordToMapping util', () => {
  });
  test('getFormattedGenerateData util', () => {
  });
  // TODO (Sravan)
  test('addVariationMap util', () => {
  });
  // TODO (Sravan)
  test('addCategory util', () => {
  });
  // TODO (Sravan)
  test('addVariation util', () => {
  });
});
