/* eslint-disable jest/no-standalone-expect */
import each from 'jest-each';
import { deepClone } from 'fast-json-patch';
import util, {
  checkExtractPathFoundInSampledata,
  unwrapTextForSpecialChars,
  wrapTextForSpecialChars,
  formattedMultiFieldExpression,
  isMappingEqual,
  extractMappingFieldsFromCsv,
  MAPPING_DATA_TYPES,
} from '.';
import errorMessageStore from '../errorStore';

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

  test('should flatten Netsuite Import Mapping in case of grouped flow sample data duplicate', () => {
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
      fields: [],
      lists: [
        {
          generate: '',
          fields: [
            {
              extract: '*.[Base Price]',
              generate: 'test test',
            },
            {
              generate: 'test test2',
              useFirstRow: true,
              hardCodedValue: null,
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

  test('should consider handlebar mappings as list type for FTP import for grouped sample data', () => {
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
          extract: '{{substring *.[some field] 0 100}}',
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
      fields: [],
      lists: [
        {
          generate: '',
          fields: [
            {
              extract: '*.[Base Price]',
              generate: 'test test',
            },
            {
              generate: 'test test2',
              extract: '{{substring *.[some field] 0 100}}',
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

  test('should maintain mappings order for FTP import for grouped sample data', () => {
    const inputObj = {
      mappings: [
        {
          generate: 'header column1',
          useFirstRow: true,
          hardCodedValue: null,
        },
        {
          extract: 'Base Price',
          generate: 'List column1',
        },
        {
          generate: 'List column2',
          useFirstRow: true,
          hardCodedValue: null,
        },
        {
          generate: 'List column3',
          extract: '{{substring *.[some field] 0 100}}',
        },
        {
          generate: 'List column4',
          extract: '{{substring [some field] 0 100}}',
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
      fields: [{
        generate: 'header column1',
        hardCodedValue: null,
        useFirstRow: true,
      }],
      lists: [
        {
          generate: '',
          fields: [
            {
              extract: '*.[Base Price]',
              generate: 'List column1',
            },
            {
              generate: 'List column2',
              useFirstRow: true,
              hardCodedValue: null,
            },
            {
              generate: 'List column3',
              extract: '{{substring *.[some field] 0 100}}',
            },
            {
              generate: 'List column4',
              extract: '{{substring [some field] 0 100}}',
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
    }, false)).toBe(true);
    expect(checkExtractPathFoundInSampledata('abc[*].a', {
      abc: [{ a: 1}],
      b: 'c',
    }, false)).toBe(true);
    expect(checkExtractPathFoundInSampledata('abc[*].b', {
      abc: [{ a: 1}],
      b: 'c',
    }, false)).toBe(false);
  });
  test('isCsvOrXlsxResource util', () => {
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'FTPImport',
      file: {
        type: 'csv',
      },
    })).toBe(true);
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'S3Import',
      file: {
        type: 'xlsx',
      },
    })).toBe(true);
    expect(util.isCsvOrXlsxResource({
      adaptorType: 'S3Import',
    })).toBe(false);
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
        extract: '["abc"]',
        flowSampleData: undefined,
        result: '["abc"]',
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
        result: '[[abc]]',
      },
      {
        extract: '["abc"]',
        flowSampleData: undefined,
        result: '["abc"]',
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
  test('formattedMultiFieldExpression util', () => {
    const testCases = [
      {
        exp: 'abc',
        result: 'abc',
      },
      {
        exp: 'test',
        extract: '*.abc',
        result: 'test{{*.abc}}',
      },
      {
        exp: 'abc',
        extract: 'ext',
        result: 'abc{{ext}}',
      },
      {
        exp: 'abc',
        fun: '{{#if}}{{else}}',
        result: 'abc{{#if}}{{else}}',
      },
    ];

    testCases.forEach(({exp, fun, extract, result}) => {
      expect(formattedMultiFieldExpression(exp, fun, extract)).toEqual(result);
    });
  });
  // TODO (Sravan)
  test.todo('setCategoryMappingData util');
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
      {resource: {assistant: 'clover'}, connection: {}, appName: 'Clover'},
      {resource: {adaptorType: 'FTPImport'}, connection: {}, appName: 'FTP'},
      {resource: {adaptorType: 'S3Import'}, connection: {}, appName: 'Amazon S3'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'mysql'}}, appName: 'MySQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'mssql'}}, appName: 'Microsoft SQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'oracle'}}, appName: 'Oracle DB (SQL)'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {rdbms: {type: 'postgresql'}}, appName: 'PostgreSQL'},
      {resource: {adaptorType: 'RDBMSImport'}, connection: {}, appName: 'Snowflake'},
      {resource: {adaptorType: 'HTTPImport'}, connection: {http: {_httpConnecorId: '123'}}, appName: 'HTTP'},
      {resource: {adaptorType: 'JDBCExport'}, connection: {jdbc: {type: 'netsuitejdbc'}}, appName: 'NetSuite JDBC'},
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
          errMessage: errorMessageStore('MAPPER1_DUP_GENERATE', {fields: 'a'}),
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
          errMessage: errorMessageStore('MAPPER1_MISSING_GENERATE'),
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
          errMessage: errorMessageStore('MAPPER1_MISSING_EXTRACT', {fields: 'b'}),
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
          errMessage: errorMessageStore('MAPPER1_MISSING_EXTRACT', {fields: 'b'}),
        },
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {extract: 'a', generate: 'b'},
        ],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [
          {extract: 'a', generate: 'a'},
          {extract: 'a', generate: 'a'},
        ],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_DUP_GENERATE', {fields: 'fname'}),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            jsonPath: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            children: [{
              key: 'c1',
              extract: 'child1',
              generate: 'fname',
              jsonPath: 'lname.fname',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              extract: 'child2',
              generate: 'fname',
              jsonPath: 'lname.fname',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_DUP_GENERATE', {fields: 'lname.fname'}),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            children: [{
              key: 'c1',
              extract: 'child1',
              generate: 'fname',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          },
        ],
        result: { isSuccess: true },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_MISSING_GENERATE'),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            generateDisabled: true,
            extract: '$',
          },
        ],
        result: {isSuccess: true },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            children: [{
              key: 'c1',
              extract: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_MISSING_GENERATE'),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            isRequired: true,
            children: [
              {
                key: 'c1',
                generate: 'fname',
                dataType: MAPPING_DATA_TYPES.STRING,
                parentKey: 'key2',
                isRequired: true,
                jsonPath: 'lname[*].fname',
              },
            ],
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_MISSING_EXTRACT', {fields: 'lname,lname[*].fname'}),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            hardCodedValue: 'test',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_ONLY_JSON_PATH_SUPPORT', {fields: 'fname'}),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{record.test}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRINGARRAY,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_EXPRESSION_NOT_SUPPORTED', {fields: 'fname'}),
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            copySource: 'yes',
            extractsArrayHelper: [{
              extract: '$.siblings[*]',
              sourceDataType: MAPPING_DATA_TYPES.OBJECT,
            }],
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.NUMBERARRAY,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
          {
            key: 'key2',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.NUMBERARRAY,
            hardCodedValue: '["1", "2"]',
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            copySource: 'yes',
            extract: '$.siblings[*]',
            sourceDataType: MAPPING_DATA_TYPES.OBJECT,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            children: [{
              key: 'c1',
              generate: 'child1',
              extract: '$.child1',
              dataType: MAPPING_DATA_TYPES.STRING,
            }],
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [{name: 'lookup1'}],
        v2TreeData: [
          {
            key: 'key1',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
            lookupName: 'lookup1',
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [{name: 'lookup1', map: {}}],
        v2TreeData: [
          {
            key: 'key1',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            children: [{
              key: 'c1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.NUMBER,
              lookupName: 'lookup1',
            }],
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: true,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{rows.[0].id}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{record.id}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: true,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{record.isValid}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.BOOLEAN,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_WRONG_HANDLEBAR_FOR_ROWS'),
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{rows.[0].id}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_WRONG_HANDLEBAR_FOR_RECORD'),
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: true,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{rows.[1].record.id}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{record.rows.id}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: true,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{add rows.[0].value1 rows.[1].value2}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
          },
        ],
        result: {isSuccess: true},
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: '{{add record.value1 rows.value2}}',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_WRONG_HANDLEBAR_FOR_RECORD'),
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: 'isName',
            generate: 'fname',
            jsonPath: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
            sourceDataType: MAPPING_DATA_TYPES.BOOLEAN,
          },
        ],
        result: {
          isSuccess: true,
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            extract: 'isName',
            generate: 'fname',
            jsonPath: 'fname',
            dataType: MAPPING_DATA_TYPES.NUMBER,
            sourceDataType: MAPPING_DATA_TYPES.BOOLEAN,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: "Mapper 2.0: fname: You can't map boolean (source) to number (destination)",
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            key: 'key1',
            generate: 'sibling',
            jsonPath: 'sibling',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            copySource: 'yes',
            extract: '$.siblings[*]',
            sourceDataType: MAPPING_DATA_TYPES.NUMBERARRAY,
          },
        ],
        result: {
          isSuccess: false,
          errMessage: "Mapper 2.0: sibling: You can't map [number] (source) to object (destination)",
        },
      },
      {
        mappings: [],
        lookups: [],
        v2TreeData: [
          {
            jsonPath: 'quantity',
            generate: 'quantity',
            dataType: MAPPING_DATA_TYPES.NUMBERARRAY,
            extractsArrayHelper: [
              {
                extract: '$[*].cartonQuantity',
                conditional: {
                  when: 'extract_not_empty',
                },
                sourceDataType: MAPPING_DATA_TYPES.NUMBER,
              },
              {
                extract: '$[*].configuration',
                conditional: {
                  when: 'extract_not_empty',
                },
                sourceDataType: MAPPING_DATA_TYPES.BOOLEAN,
              },
            ],
          },
        ],
        result: {
          isSuccess: false,
          errMessage: "Mapper 2.0: quantity: You can't map boolean (source) to [number] (destination)",
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            title: '',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
            jsonPath: 'fname',
          },
          {
            key: 'key2',
            title: '',
            generate: 'mothers_side',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            jsonPath: 'mothers_side',
            isRequired: true,
            children: [
              {
                key: 'c1',
                title: '',
                extract: '$.child1',
                generate: 'child1',
                parentKey: 'key2',
                dataType: MAPPING_DATA_TYPES.STRING,
                jsonPath: 'mothers_side.child1',
                isRequired: true,
              },
              {
                key: 'c3',
                title: '',
                extract: '$.child3',
                generate: 'child3',
                parentKey: 'key2',
                dataType: MAPPING_DATA_TYPES.STRING,
                jsonPath: 'mothers_side.child3',
              },
            ],
          },
          {
            key: 'key3',
            title: '',
            extract: '$.lname',
            generate: 'lname',
            dataType: MAPPING_DATA_TYPES.STRING,
            jsonPath: 'lname',
            isRequired: true,
          },
        ],
        requiredMappingsJsonPaths: [
          'mothers_side+object',
          'mothers_side.child1+string',
          'lname+string',
        ],
        result: {
          isSuccess: true,
        },
      },
      {
        mappings: [],
        lookups: [],
        isGroupedSampleData: false,
        v2TreeData: [
          {
            key: 'key1',
            title: '',
            extract: '$.fname',
            generate: 'fname',
            dataType: MAPPING_DATA_TYPES.STRING,
            jsonPath: 'fname',
          },
          {
            key: 'key2',
            title: '',
            generate: 'mothers_side',
            dataType: MAPPING_DATA_TYPES.OBJECT,
            jsonPath: 'mothers_side',
            isRequired: true,
            children: [
              {
                key: 'c1',
                title: '',
                extract: '$.child1',
                generate: 'child1',
                parentKey: 'key2',
                dataType: MAPPING_DATA_TYPES.STRING,
                jsonPath: 'mothers_side.child1',
                isRequired: true,
              },
              {
                key: 'c3',
                title: '',
                extract: '$.child3',
                generate: 'child3',
                parentKey: 'key2',
                dataType: MAPPING_DATA_TYPES.STRING,
                jsonPath: 'mothers_side.child3',
              },
            ],
          },
        ],
        requiredMappingsJsonPaths: [
          'mothers_side+object',
          'mothers_side.child1+string',
          'lname+string',
        ],
        result: {
          isSuccess: false,
          errMessage: errorMessageStore('MAPPER2_MISSING_REQUIRED_FIELDS'),
        },
      },
    ];

    testCases.forEach(({mappings, lookups, v2TreeData, isGroupedSampleData, result, requiredMappingsJsonPaths}) => {
      expect(util.validateMappings(mappings, lookups, v2TreeData, isGroupedSampleData, requiredMappingsJsonPaths)).toEqual(result);
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
  test('extractMappingFieldsFromCsv util tests', () => {
    const testCases = [
      {
        data: null,
        output: undefined,
      },
      {
        data: '',
        output: {},
      },
      {
        data: `a,b,c
        d,e,f`,
        options: {includeHeader: false, columnDelimiter: ','},
        output: {
          Column0: 'Column0',
          Column1: 'Column1',
          Column2: 'Column2',
        },
      },
      {
        data: `a,b,c
        d,e,f`,
        output: {
          a: 'a',
          b: 'b',
          c: 'c',
        },
      },
      {
        data: `a  ,b  ,c
        d,e,f`,
        output: {
          a: 'a',
          b: 'b',
          c: 'c',
        },
      },
    ];

    testCases.forEach(({data, options, output}) => {
      expect(extractMappingFieldsFromCsv(data, options)).toEqual(output);
    });
  });
  describe('generateSubrecordMappingAndLookup and appendModifiedSubRecordToMapping util tests', () => {
    const importObj1 = {
      _id: 'i1',
      name: 'bodylevel subrecord import',
      _connectionId: 'c1',
      distributed: true,
      netsuite_da: {
        useSS2Restlets: false,
        operation: 'add',
        recordType: 'assemblybuild',
        mapping: {
          fields: [
            {
              generate: 'celigo_inventorydetail',
              subRecordMapping: {
                recordType: 'inventorydetail',
                jsonPath: '$',
                mapping: {
                  fields: [

                  ],
                  lists: [
                    {
                      generate: 'inventoryassignment',
                      fields: [
                        {
                          generate: 'quantity',
                          extract: '*.quantity',
                          internalId: false,
                        },
                        {
                          generate: 'internalid',
                          extract: '*.inventory_internal_id',
                          internalId: false,
                        },
                      ],
                    },
                  ],
                },
                lookups: [{name: 'lookup1', map: {a: 'b'}}],
              },
            },
          ],
          lists: [
          ],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };

    const importObj2 = {
      _id: 'i1',
      name: 'ns linelevel subrecord import',
      _connectionId: 'c1',
      distributed: true,
      lookups: [],
      netsuite_da: {
        useSS2Restlets: false,
        operation: 'add',
        recordType: 'salesorder',
        lookups: [],
        mapping: {
          fields: [
            {
              extract: 'Name',
              generate: 'entity',
              internalId: false,
            },
          ],
          lists: [
            {
              generate: 'item',
              fields: [
                {
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    recordType: 'inventorydetail',
                    jsonPath: '$',
                    mapping: {
                      fields: [
                        {
                          generate: 'item',
                          extract: 'item',
                          internalId: true,
                        },
                      ],
                      lists: [
                        {
                          generate: 'inventoryassignment',
                          fields: [
                            {
                              generate: 'quantity',
                              extract: '*.quantity',
                              internalId: false,
                            },
                            {
                              generate: 'internalid',
                              extract: '*.inventory_internal_id',
                              internalId: false,
                            },
                          ],
                        },
                      ],
                    },
                    lookups: [{name: 'lookup1', map: {a: 'b'}}],
                  },
                  internalId: false,
                },
              ],
            },
          ],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };

    test('should return mappings and lookups associated with subrecord for body level subrecord import', () => {
      expect(util.generateSubrecordMappingAndLookup(importObj1, 'celigo_inventorydetail', false, 'assemblybuild')).toEqual({
        lookups: [
          {
            map: {
              a: 'b',
            },
            name: 'lookup1',
          },
        ],
        mappings: [
          {
            extract: 'quantity',
            generate: 'inventoryassignment[*].quantity',
            internalId: false,
            useIterativeRow: true,
          },
          {
            extract: 'inventory_internal_id',
            generate: 'inventoryassignment[*].internalid',
            internalId: false,
            useIterativeRow: true,
          },
        ],
      });
    });
    test('should return mappings and lookups associated with subrecord for sublist\'s subrecord import', () => {
      expect(util.generateSubrecordMappingAndLookup(importObj2, 'item[*].celigo_inventorydetail', true, 'salesorder')).toEqual({
        lookups: [
          {
            map: {
              a: 'b',
            },
            name: 'lookup1',
          },
        ],
        mappings: [
          {
            extract: 'item',
            generate: 'item.internalid',
            internalId: true,
            useAsAnInitializeValue: false,
          },
          {
            extract: 'quantity',
            generate: 'inventoryassignment[*].quantity',
            internalId: false,
            useIterativeRow: true,
          },
          {
            extract: 'inventory_internal_id',
            generate: 'inventoryassignment[*].internalid',
            internalId: false,
            useIterativeRow: true,
          },
        ],
      });
    });

    test('should append provided mappings and lookups to the subrecord mapping', () => {
      const lookups = [{
        map: {
          a: 'b',
        },
        name: 'lookup1',
      }, {
        name: 'lookup2',
        expression: ['name', 'is', 'name'],
        recordType: 'account',
        resultField: 'id',
      }];

      const mappings = [{
        extract: 'quantity',
        generate: 'inventoryassignment[*].quantity',
        internalId: false,
        useIterativeRow: true,
      },
      {
        extract: 'inventory_internal_id',
        generate: 'inventoryassignment[*].internalid',
        internalId: false,
        useIterativeRow: true,
      },
      {
        generate: 'inventoryassignment[*].name',
        hardCodedValue: 'name',
      }];

      expect(util.appendModifiedSubRecordToMapping({
        resource: importObj1,
        subRecordMappingId: 'celigo_inventorydetail',
        subRecordMapping: mappings,
        subRecordLookups: lookups})).toEqual({
        fields: [
          {
            generate: 'celigo_inventorydetail',
            subRecordMapping: {
              jsonPath: '$',
              lookups: [
                {
                  map: {
                    a: 'b',
                  },
                  name: 'lookup1',
                },
                {
                  expression: [
                    'name',
                    'is',
                    'name',
                  ],
                  name: 'lookup2',
                  recordType: 'account',
                  resultField: 'id',
                },
              ],
              mapping: [
                {
                  extract: 'quantity',
                  generate: 'inventoryassignment[*].quantity',
                  internalId: false,
                  useIterativeRow: true,
                },
                {
                  extract: 'inventory_internal_id',
                  generate: 'inventoryassignment[*].internalid',
                  internalId: false,
                  useIterativeRow: true,
                },
                {
                  generate: 'inventoryassignment[*].name',
                  hardCodedValue: 'name',
                },
              ],
              recordType: 'inventorydetail',
            },
          },
        ],
        lists: [

        ],
      });
    });
  });
  describe('getFormattedGenerateData util tests', () => {
    test('should format data correctly for salesforce import', () => {
      const inputData = [
        {value: 'a', type: 't', label: 'l', picklistValues: ['a1', 'a2'], childSObject: 'something', relationshipName: 'rel'},
        {value: 'b1', type: 'b2', label: 'b3', picklistValues: [], childSObject: 'something', relationshipName: 'rel'},
      ];
      const result = [
        {id: 'a', type: 't', name: 'l', options: ['a1', 'a2'], childSObject: 'something', relationshipName: 'rel'},
        {id: 'b1', type: 'b2', name: 'b3', options: [], childSObject: 'something', relationshipName: 'rel'},
      ];

      expect(util.getFormattedGenerateData(inputData, 'salesforce'))
        .toEqual(result);
    });

    test('should format data correctly for netsuite import', () => {
      const inputData = [
        {value: 'a', type: 't', label: 'l', sublist: []},
        {value: 'b1', type: 'b2', label: 'b3', sublist: 'item'},
      ];
      const result = [
        {id: 'a', type: 't', name: 'l', sublist: []},
        {id: 'b1', type: 'b2', name: 'b3', sublist: 'item'},
        {id: 'celigo_nlobjAttachToId', name: 'Attach To Internal ID'},
        {id: 'celigo_nlobjAttachedType', name: 'Attached Record Type'},
        {id: 'celigo_nlobjAttachedId', name: 'Attached Internal ID'},
        {id: 'celigo_nlobjDetachFromId', name: 'Detach From Internal ID'},
        {id: 'celigo_nlobjDetachedType', name: 'Detached Record Type'},
        {id: 'celigo_nlobjDetachedId', name: 'Detached Internal ID'},
        {id: 'celigo_nlobjAttachDetachAttributesRole', name: 'Attribute Role'},
        {id: 'celigo_nlobjAttachDetachAttributesField', name: 'Attribute Field'},
      ];

      expect(util.getFormattedGenerateData(inputData, 'netsuite'))
        .toEqual(result);
    });

    const inputData =
        {
          something: 's',
          value: 1,
          booleanProp: true,
          arr: [{
            quantity: 5,
            id: 3,
          }],
        };
    const result =
      [
        {
          id: 'booleanProp',
          name: 'booleanProp',
          type: 'boolean',
        },
        {
          id: 'something',
          name: 'something',
          type: 'string',
        },
        {
          id: 'value',
          name: 'value',
          type: 'number',
        },
        {
          id: 'arr[*].id',
          name: 'arr[*].id',
          type: 'number',
        },
        {
          id: 'arr[*].quantity',
          name: 'arr[*].quantity',
          type: 'number',
        },
      ];

    test('should return formatted data for other import [except netsuite and salesforce]', () => {
      expect(util.getFormattedGenerateData(inputData, 'rest'))
        .toEqual(result);
    });
    test('should parse inputString and return formatted data for other import [except netsuite and salesforce]', () => {
      expect(util.getFormattedGenerateData(JSON.stringify(inputData), 'rest'))
        .toEqual(result);
    });
  });
  describe('addVariationMap util tests', () => {
    const amazonCategoryMappings = {
      uiAssistant: 'amazon',
      response: [
        {
          operation: 'mappingData',
          data: {
            mappingData: {
              basicMappings: {
                recordMappings: [
                  {
                    id: 'commonAttributes',
                    name: 'Common',
                    children: [
                      {
                        id: 'Dimensions',
                        name: 'Dimensions',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                    fieldMappings: [
                      {
                        extract: 'SKU',
                        generate: 'item_sku',
                        discardIfEmpty: true,
                      },
                    ],
                    lookups: [

                    ],
                  },
                ],
              },
              variationMappings: {
                recordMappings: [{
                  id: 'baby',
                  variation_themes: [],
                  children: [],
                }, {
                  id: 'babyproducts',
                  variation_themes: [{
                    id: 'variation_theme',
                    variation_theme: 'var1',
                  }],
                  children: [],
                }, {
                  id: 'beauty',
                  variation_themes: [],
                  children: [{
                    id: 'beautyproducts',
                    variation_themes: [],
                    children: [],
                  }, {
                    id: 'cream',
                    children: [{
                      id: 'grandchild',
                      variation_themes: [],
                    }],
                  }],
                }],
              },
            },
          },
        },
        {
          operation: 'extractsMetaData',
          data: [
            {
              id: 'hits',
              type: 'integer',
              name: '# Times Viewed',
            },
          ],
        },
        {
          operation: 'generatesMetaData',
          data: {
            categoryRelationshipData: [
              {
                id: 'baby',
                name: 'Baby',
                isLeafNode: true,
                marketplace_domain: 'US',
              },
            ],
          },
        },
      ],
    };

    test('should correctly add variation to the variation themes if category and subcategory provided are same', () => {
      const state = deepClone(amazonCategoryMappings);

      util.addVariationMap(state, 'baby', 'baby', 'high', false);

      expect(state).toEqual({
        response: [
          {
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [
                    {
                      children: [
                        {
                          children: [
                          ],
                          fieldMappings: [
                          ],
                          id: 'Dimensions',
                          name: 'Dimensions',
                        },
                      ],
                      fieldMappings: [
                        {
                          discardIfEmpty: true,
                          extract: 'SKU',
                          generate: 'item_sku',
                        },
                      ],
                      id: 'commonAttributes',
                      lookups: [

                      ],
                      name: 'Common',
                    },
                  ],
                },
                variationMappings: {
                  recordMappings: [
                    {
                      children: [],
                      id: 'baby',
                      variation_themes: [
                        {
                          fieldMappings: [
                          ],
                          id: 'variation_theme',
                          variation_theme: 'high',
                        },
                      ],
                    },
                    {
                      id: 'babyproducts',
                      variation_themes: [{
                        id: 'variation_theme',
                        variation_theme: 'var1',
                      }],
                      children: [],
                    },
                    {
                      id: 'beauty',
                      variation_themes: [],
                      children: [{
                        id: 'beautyproducts',
                        variation_themes: [],
                        children: [],
                      }, {
                        id: 'cream',
                        children: [{
                          id: 'grandchild',
                          variation_themes: [],
                        }],
                      }],
                    },
                  ],
                },
              },
            },
            operation: 'mappingData',
          },
          {
            data: [
              {
                id: 'hits',
                name: '# Times Viewed',
                type: 'integer',
              },
            ],
            operation: 'extractsMetaData',
          },
          {
            data: {
              categoryRelationshipData: [
                {
                  id: 'baby',
                  isLeafNode: true,
                  marketplace_domain: 'US',
                  name: 'Baby',
                },
              ],
            },
            operation: 'generatesMetaData',
          },
        ],
        uiAssistant: 'amazon',
      });
    });

    test('should correctly add variation to the variation themes for the subcategory of the specified category', () => {
      const state = deepClone(amazonCategoryMappings);

      util.addVariationMap(state, 'beauty', 'beautyproducts', 'medium', false);

      expect(state).toEqual({
        response: [
          {
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [
                    {
                      children: [
                        {
                          children: [
                          ],
                          fieldMappings: [
                          ],
                          id: 'Dimensions',
                          name: 'Dimensions',
                        },
                      ],
                      fieldMappings: [
                        {
                          discardIfEmpty: true,
                          extract: 'SKU',
                          generate: 'item_sku',
                        },
                      ],
                      id: 'commonAttributes',
                      lookups: [

                      ],
                      name: 'Common',
                    },
                  ],
                },
                variationMappings: {
                  recordMappings: [
                    {
                      children: [],
                      id: 'baby',
                      variation_themes: [],
                    },
                    {
                      id: 'babyproducts',
                      variation_themes: [{
                        id: 'variation_theme',
                        variation_theme: 'var1',
                      }],
                      children: [],
                    },
                    {
                      id: 'beauty',
                      variation_themes: [],
                      children: [{
                        id: 'beautyproducts',
                        children: [],
                        variation_themes: [
                          {
                            fieldMappings: [],
                            id: 'variation_theme',
                            variation_theme: 'medium',
                          },
                        ],
                      }, {
                        id: 'cream',
                        children: [{
                          id: 'grandchild',
                          variation_themes: [],
                        }],
                      }],
                    },
                  ],
                },
              },
            },
            operation: 'mappingData',
          },
          {
            data: [
              {
                id: 'hits',
                name: '# Times Viewed',
                type: 'integer',
              },
            ],
            operation: 'extractsMetaData',
          },
          {
            data: {
              categoryRelationshipData: [
                {
                  id: 'baby',
                  isLeafNode: true,
                  marketplace_domain: 'US',
                  name: 'Baby',
                },
              ],
            },
            operation: 'generatesMetaData',
          },
        ],
        uiAssistant: 'amazon',
      });
    });

    test('should correctly add variation to the variation themes for the grandchild if subcategory exists as grandchild for the specified category', () => {
      const state = deepClone(amazonCategoryMappings);

      util.addVariationMap(state, 'beauty', 'grandchild', 'small', false);

      expect(state).toEqual({
        response: [
          {
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [
                    {
                      children: [
                        {
                          children: [
                          ],
                          fieldMappings: [
                          ],
                          id: 'Dimensions',
                          name: 'Dimensions',
                        },
                      ],
                      fieldMappings: [
                        {
                          discardIfEmpty: true,
                          extract: 'SKU',
                          generate: 'item_sku',
                        },
                      ],
                      id: 'commonAttributes',
                      lookups: [

                      ],
                      name: 'Common',
                    },
                  ],
                },
                variationMappings: {
                  recordMappings: [
                    {
                      children: [],
                      id: 'baby',
                      variation_themes: [],
                    },
                    {
                      id: 'babyproducts',
                      variation_themes: [{
                        id: 'variation_theme',
                        variation_theme: 'var1',
                      }],
                      children: [],
                    },
                    {
                      id: 'beauty',
                      variation_themes: [],
                      children: [{
                        id: 'beautyproducts',
                        variation_themes: [],
                        children: [],
                      }, {
                        id: 'cream',
                        children: [{
                          id: 'grandchild',
                          variation_themes: [{
                            fieldMappings: [],
                            id: 'variation_theme',
                            variation_theme: 'small',
                          }],
                        }],
                      }],
                    },
                  ],
                },
              },
            },
            operation: 'mappingData',
          },
          {
            data: [
              {
                id: 'hits',
                name: '# Times Viewed',
                type: 'integer',
              },
            ],
            operation: 'extractsMetaData',
          },
          {
            data: {
              categoryRelationshipData: [
                {
                  id: 'baby',
                  isLeafNode: true,
                  marketplace_domain: 'US',
                  name: 'Baby',
                },
              ],
            },
            operation: 'generatesMetaData',
          },
        ],
        uiAssistant: 'amazon',
      });
    });

    test('should skip adding variation to the variation themes if theme already exists', () => {
      const state = deepClone(amazonCategoryMappings);

      util.addVariationMap(state, 'babyproducts', 'babyproducts', 'var1', false);

      expect(state).toEqual({
        response: [
          {
            data: {
              mappingData: {
                basicMappings: {
                  recordMappings: [
                    {
                      children: [
                        {
                          children: [
                          ],
                          fieldMappings: [
                          ],
                          id: 'Dimensions',
                          name: 'Dimensions',
                        },
                      ],
                      fieldMappings: [
                        {
                          discardIfEmpty: true,
                          extract: 'SKU',
                          generate: 'item_sku',
                        },
                      ],
                      id: 'commonAttributes',
                      lookups: [

                      ],
                      name: 'Common',
                    },
                  ],
                },
                variationMappings: {
                  recordMappings: [
                    {
                      children: [],
                      id: 'baby',
                      variation_themes: [],
                    },
                    {
                      id: 'babyproducts',
                      variation_themes: [{
                        id: 'variation_theme',
                        variation_theme: 'var1',
                      }],
                      children: [],
                    },
                    {
                      id: 'beauty',
                      variation_themes: [],
                      children: [{
                        id: 'beautyproducts',
                        variation_themes: [],
                        children: [],
                      }, {
                        id: 'cream',
                        children: [{
                          id: 'grandchild',
                          variation_themes: [],
                        }],
                      }],
                    },
                  ],
                },
              },
            },
            operation: 'mappingData',
          },
          {
            data: [
              {
                id: 'hits',
                name: '# Times Viewed',
                type: 'integer',
              },
            ],
            operation: 'extractsMetaData',
          },
          {
            data: {
              categoryRelationshipData: [
                {
                  id: 'baby',
                  isLeafNode: true,
                  marketplace_domain: 'US',
                  name: 'Baby',
                },
              ],
            },
            operation: 'generatesMetaData',
          },
        ],
        uiAssistant: 'amazon',
      });
    });
  });
  describe('addCategory util tests', () => {
    const amazonCategoryMappings = {
      uiAssistant: 'amazon',
      response: [
        {
          operation: 'mappingData',
          data: {
            mappingData: {
              basicMappings: {
                recordMappings: [
                  {
                    id: 'commonAttributes',
                    name: 'Common',
                    children: [
                      {
                        id: 'Dimensions',
                        name: 'Dimensions',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                    fieldMappings: [
                      {
                        extract: 'SKU',
                        generate: 'item_sku',
                        discardIfEmpty: true,
                      },
                    ],
                    lookups: [

                    ],
                  },
                ],
              },
              variationMappings: {
                recordMappings: [],
              },
            },
          },
        },
        {
          operation: 'extractsMetaData',
          data: [
            {
              id: 'hits',
              type: 'integer',
              name: '# Times Viewed',
            },
          ],
        },
        {
          operation: 'generatesMetaData',
          data: {
            categoryRelationshipData: [
              {
                id: 'baby',
                name: 'Baby',
                isLeafNode: false,
                marketplace_domain: 'US',
                children: [
                  {
                    id: 'babyproducts',
                    name: 'babyProducts',
                    children: [
                      {
                        id: 'grandchild1',
                        name: 'Grand Child 1',
                      },
                      {
                        id: 'grandchild2',
                        name: 'Grand Child 2',
                      },
                    ],
                    isLeafNode: false,
                  },
                  {
                    id: 'infanttoddlercarseat',
                    name: 'infanttoddlercarseat',
                    isLeafNode: true,
                  },
                  {
                    id: 'stroller',
                    name: 'stroller',
                    isLeafNode: true,
                  },
                ],
              },
              {
                id: 'beauty',
                name: 'Beauty',
                isLeafNode: false,
                marketplace_domain: 'US',
                children: [
                  {
                    id: 'beautymisc',
                    name: 'beautymisc',
                    isLeafNode: true,
                  },
                  {
                    id: 'bodycareproduct',
                    name: 'bodycareproduct',
                    isLeafNode: true,
                  },
                  {
                    id: 'conditioner',
                    name: 'conditioner',
                    isLeafNode: true,
                  },
                ],
              },
              {
                id: 'category 3',
                name: 'Category 3',
                isLeafNode: true,
              },
            ],
            generatesMetaData: {
              id: 'commonAttributes',
              name: 'Common',
              variation_themes: [],
              variation_attributes: [],
              fields: [
                {
                  id: 'item_sku',
                  name: 'Seller SKU',
                  description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                  filterType: 'required',
                  type: 'input',
                  options: [],
                },
              ],
              children: [],
              isLeafNode: false,
              marketplace_domain: 'US',
            },
          },
        },
      ],
    };

    const integrationId = 'i1';
    const flowId = 'f1';

    test('should correctly add category and sub category to state when category does not have children', () => {
      const state = {
        [`${flowId}-${integrationId}`]: deepClone(amazonCategoryMappings),
      };

      util.addCategory(state, integrationId, flowId, {
        category: 'category 3',
        childCategory: 'category 3 child',
      });

      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'category 3',
                        name: 'Category 3',
                        children: [
                          {
                            id: 'category 3 child',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [

                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyProducts',
                        children: [
                          {
                            id: 'grandchild1',
                            name: 'Grand Child 1',
                          },
                          {
                            id: 'grandchild2',
                            name: 'Grand Child 2',
                          },
                        ],
                        isLeafNode: false,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'category 3',
                    name: 'Category 3',
                    isLeafNode: true,
                  },
                ],
                generatesMetaData: {
                  id: 'commonAttributes',
                  name: 'Common',
                  variation_themes: [

                  ],
                  variation_attributes: [

                  ],
                  fields: [
                    {
                      id: 'item_sku',
                      name: 'Seller SKU',
                      description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                      filterType: 'required',
                      type: 'input',
                      options: [

                      ],
                    },
                  ],
                  children: [

                  ],
                  isLeafNode: false,
                  marketplace_domain: 'US',
                },
              },
            },
          ],
        },
      });
    });

    test('should correctly add category details to state when child category id passed is undefined', () => {
      const state = {
        [`${flowId}-${integrationId}`]: deepClone(amazonCategoryMappings),
      };

      util.addCategory(state, integrationId, flowId, {
        category: 'category 3',
        childCategory: undefined,
      });

      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'category 3',
                        name: 'Category 3',
                        children: [],
                        fieldMappings: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [

                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyProducts',
                        children: [
                          {
                            id: 'grandchild1',
                            name: 'Grand Child 1',
                          },
                          {
                            id: 'grandchild2',
                            name: 'Grand Child 2',
                          },
                        ],
                        isLeafNode: false,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'category 3',
                    name: 'Category 3',
                    isLeafNode: true,
                  },
                ],
                generatesMetaData: {
                  id: 'commonAttributes',
                  name: 'Common',
                  variation_themes: [

                  ],
                  variation_attributes: [

                  ],
                  fields: [
                    {
                      id: 'item_sku',
                      name: 'Seller SKU',
                      description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                      filterType: 'required',
                      type: 'input',
                      options: [

                      ],
                    },
                  ],
                  children: [

                  ],
                  isLeafNode: false,
                  marketplace_domain: 'US',
                },
              },
            },
          ],
        },
      });
    });
    test('should correctly add category details for the mapping of the parent and child category', () => {
      const state = {
        [`${flowId}-${integrationId}`]: deepClone(amazonCategoryMappings),
      };

      util.addCategory(state, integrationId, flowId, {
        category: 'baby',
        childCategory: 'babyproducts',
        grandChildCategory: undefined,
      });
      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'baby',
                        name: 'Baby',
                        children: [
                          {
                            id: 'babyproducts',
                            name: 'babyProducts',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [

                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyProducts',
                        children: [
                          {
                            id: 'grandchild1',
                            name: 'Grand Child 1',
                          },
                          {
                            id: 'grandchild2',
                            name: 'Grand Child 2',
                          },
                        ],
                        isLeafNode: false,
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'category 3',
                    name: 'Category 3',
                    isLeafNode: true,
                  },
                ],
                generatesMetaData: {
                  id: 'commonAttributes',
                  name: 'Common',
                  variation_themes: [

                  ],
                  variation_attributes: [

                  ],
                  fields: [
                    {
                      id: 'item_sku',
                      name: 'Seller SKU',
                      description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                      filterType: 'required',
                      type: 'input',
                      options: [

                      ],
                    },
                  ],
                  children: [

                  ],
                  isLeafNode: false,
                  marketplace_domain: 'US',
                },
              },
            },
          ],
        },
      });
    });

    test('should correctly add category details for the mapping of the parent, child and grandchild category', () => {
      const state = {
        [`${flowId}-${integrationId}`]: deepClone(amazonCategoryMappings),
      };

      util.addCategory(state, integrationId, flowId, {
        category: 'baby',
        childCategory: 'babyproducts',
        grandchildCategory: 'grandchild1',
      });
      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                      {
                        id: 'baby',
                        name: 'Baby',
                        children: [
                          {
                            id: 'babyproducts',
                            name: 'babyProducts',
                            children: [
                              {
                                fieldMappings: [],
                                children: [],
                                id: 'grandchild1',
                                name: 'Grand Child 1',
                              },
                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [

                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'babyproducts',
                        name: 'babyProducts',
                        isLeafNode: false,
                        children: [
                          {
                            id: 'grandchild1',
                            name: 'Grand Child 1',
                          },
                          {
                            id: 'grandchild2',
                            name: 'Grand Child 2',
                          },
                        ],
                      },
                      {
                        id: 'infanttoddlercarseat',
                        name: 'infanttoddlercarseat',
                        isLeafNode: true,
                      },
                      {
                        id: 'stroller',
                        name: 'stroller',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'beauty',
                    name: 'Beauty',
                    isLeafNode: false,
                    marketplace_domain: 'US',
                    children: [
                      {
                        id: 'beautymisc',
                        name: 'beautymisc',
                        isLeafNode: true,
                      },
                      {
                        id: 'bodycareproduct',
                        name: 'bodycareproduct',
                        isLeafNode: true,
                      },
                      {
                        id: 'conditioner',
                        name: 'conditioner',
                        isLeafNode: true,
                      },
                    ],
                  },
                  {
                    id: 'category 3',
                    name: 'Category 3',
                    isLeafNode: true,
                  },
                ],
                generatesMetaData: {
                  id: 'commonAttributes',
                  name: 'Common',
                  variation_themes: [

                  ],
                  variation_attributes: [

                  ],
                  fields: [
                    {
                      id: 'item_sku',
                      name: 'Seller SKU',
                      description: 'A unique identifier for the product, assigned by the merchant.  The SKU must be unique for each product listed.  After you have established a SKU for a product, please do not change it without first deleting the original SKU from our systems through a delete feed.',
                      filterType: 'required',
                      type: 'input',
                      options: [

                      ],
                    },
                  ],
                  children: [

                  ],
                  isLeafNode: false,
                  marketplace_domain: 'US',
                },
              },
            },
          ],
        },
      });
    });
  });
  describe('addVariation util', () => {
    const amazonCategoryMappings = {
      uiAssistant: 'amazon',
      response: [
        {
          operation: 'mappingData',
          data: {
            mappingData: {
              basicMappings: {
                recordMappings: [
                  {
                    id: 'commonAttributes',
                    name: 'Common',
                    children: [
                      {
                        id: 'Dimensions',
                        name: 'Dimensions',
                        children: [

                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                    fieldMappings: [
                      {
                        extract: 'SKU',
                        generate: 'item_sku',
                        discardIfEmpty: true,
                      },
                    ],
                    lookups: [

                    ],
                  },
                ],
              },
              variationMappings: {
                recordMappings: [],
              },
            },
          },
        },
        {
          operation: 'extractsMetaData',
          data: [
            {
              id: 'hits',
              type: 'integer',
              name: '# Times Viewed',
            },
          ],
        },
        {
          operation: 'generatesMetaData',
          data: {
            categoryRelationshipData: [
              {
                id: 'baby',
                name: 'Baby',
                isLeafNode: true,
                marketplace_domain: 'US',
              },
            ],
          },
        },
      ],
    };

    const integrationId = 'i1';
    const flowId = 'f1';

    const key = `${flowId}-${integrationId}`;

    test('should correctly add variation mappings for the provided category and subcategory', () => {
      const state = {
        [key]: deepClone(amazonCategoryMappings),
      };

      util.addVariation(state, key, {
        categoryId: 'baby',
        subCategoryId: 'babyproducts',
        isVariationAttributes: false,
      });

      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'baby',
                        children: [
                          {
                            id: 'babyproducts',
                            children: [

                            ],
                            variation_themes: [

                            ],
                          },
                        ],
                        variation_themes: [

                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                  },
                ],
              },
            },
          ],
        },
      });
    });

    test('should correctly add variation mappings for the provided category and subcategory and if isVariationAttributes is true', () => {
      const state = {
        [key]: deepClone(amazonCategoryMappings),
      };

      util.addVariation(state, key, {
        categoryId: 'baby',
        subCategoryId: 'babyproducts',
        isVariationAttributes: true,
      });

      expect(state).toEqual({
        'f1-i1': {
          uiAssistant: 'amazon',
          response: [
            {
              operation: 'mappingData',
              data: {
                mappingData: {
                  basicMappings: {
                    recordMappings: [
                      {
                        id: 'commonAttributes',
                        name: 'Common',
                        children: [
                          {
                            id: 'Dimensions',
                            name: 'Dimensions',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [
                          {
                            extract: 'SKU',
                            generate: 'item_sku',
                            discardIfEmpty: true,
                          },
                        ],
                        lookups: [

                        ],
                      },
                    ],
                  },
                  variationMappings: {
                    recordMappings: [
                      {
                        id: 'baby',
                        children: [
                          {
                            id: 'babyproducts',
                            children: [

                            ],
                            fieldMappings: [

                            ],
                          },
                        ],
                        fieldMappings: [

                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              operation: 'extractsMetaData',
              data: [
                {
                  id: 'hits',
                  type: 'integer',
                  name: '# Times Viewed',
                },
              ],
            },
            {
              operation: 'generatesMetaData',
              data: {
                categoryRelationshipData: [
                  {
                    id: 'baby',
                    name: 'Baby',
                    isLeafNode: true,
                    marketplace_domain: 'US',
                  },
                ],
              },
            },
          ],
        },
      });
    });
  });

  test('autoMapperRecordTypeForAssistant util', () => {
    const testCases = [
      {
        resource: {
          _id: 567,
          name: 'B',
          adaptorType: 'RESTImport',
          assistant: 'zendesk',
          _connectionId: 768,
          rest: {
            relativeURI: '/api/v2/organizations/{{{organizationId}}}.json',
          },
        },
        result: 'organizations',
      },
      {
        resource: {
          _id: 567,
          name: 'B',
          adaptorType: 'RESTImport',
          assistant: 'zendesk',
          _connectionId: 768,
          rest: {
            relativeURI: '/api/v2/employee.json',
          },
        },
        result: '',
      },
    ];

    testCases.forEach(({resource, result}) => {
      expect(util.autoMapperRecordTypeForAssistant(resource)).toEqual(result);
    });
  });
  test('getFormStatusFromMappingSaveStatus util', () => {
    const testCases = [
      {
        result: 'failed',
      },
      {
        saveStatus: 'requested',
        result: 'loading',
      },
      {
        saveStatus: 'completed',
        result: 'complete',
      },
      {
        saveStatus: 'failed',
        result: 'failed',
      },
    ];

    testCases.forEach(({saveStatus, result}) => {
      expect(util.getFormStatusFromMappingSaveStatus(saveStatus)).toEqual(result);
    });
  });
});
