/* global describe, test,  expect */
import util from './netsuite';

describe('tests for netsuite mapping util', () => {
  const nsImportResource = {
    _id: 'i1',
    netsuite_da: {
      operation: 'add',
    },
  };

  const recordType = 'salesorder';

  describe('tests for util getFieldsAndListMappings', () => {
    const nsImportResourceForAttach = {
      _id: 'i1',
      netsuite_da: {
        operation: 'attach',
      },
    };

    const nsImportResourceForDetach = {
      _id: 'i1',
      netsuite_da: {
        operation: 'detach',
      },
    };

    test('should add useAsAnInitializeValue key in the mapping if field is selected to be initialized', () => {
      const mappings = {
        fields: [
          {
            generate: 'entity',
            discardIfEmpty: false,
            immutable: false,
            hardCodedValue: '12333',
            internalId: true,
          },
          {
            generate: 'custbody_celigo_amz_orderid',
            discardIfEmpty: false,
            immutable: false,
            hardCodedValue: '123',
            internalId: false,
          },
          {
            generate: 'custbody_celigo_amz_shiplevel',
            discardIfEmpty: false,
            immutable: false,
            hardCodedValue: '12',
            internalId: false,
          },
          {
            generate: 'celigo_initializeValues',
            hardCodedValue: 'entity,custbody_celigo_amz_orderid,custbody_celigo_amz_shiplevel',
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          generate: 'entity.internalid',
          discardIfEmpty: false,
          immutable: false,
          hardCodedValue: '12333',
          internalId: true,
          useAsAnInitializeValue: true,
        },
        {
          generate: 'custbody_celigo_amz_orderid',
          discardIfEmpty: false,
          immutable: false,
          hardCodedValue: '123',
          internalId: false,
          useAsAnInitializeValue: true,
        },
        {
          generate: 'custbody_celigo_amz_shiplevel',
          discardIfEmpty: false,
          immutable: false,
          hardCodedValue: '12',
          internalId: false,
          useAsAnInitializeValue: true,
        },
      ]);
    });

    test('should format mapping for subtype field if recordType is of itemSubType', () => {
      const mappings = {
        fields: [
          {
            generate: 'subtype',
            discardIfEmpty: false,
            immutable: false,
            hardCodedValue: 'Resale',
            internalId: false,
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType: 'noninventoryitem',
        resource: nsImportResource,
      })).toEqual([{
        discardIfEmpty: false,
        generate: 'subtype.internalid',
        hardCodedValue: 'Resale',
        immutable: false,
        internalId: true,
        useAsAnInitializeValue: false,
      },
      ]);
    });

    test('should remove square braces for the extract of the mapping if starts and ends with braces', () => {
      const mappings = {
        fields: [
          {
            generate: 'custitem_celigo_amz_brand',
            discardIfEmpty: false,
            immutable: false,
            internalId: false,
            extract: "['hello']",
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          generate: 'custitem_celigo_amz_brand',
          discardIfEmpty: false,
          immutable: false,
          internalId: false,
          extract: 'hello',
          useAsAnInitializeValue: false,
        },
      ]);
    });

    test('should remove square braces for the extract of the mapping if starts and ends with braces and wrapped with special character', () => {
      const mappings = {
        fields: [
          {
            generate: 'custitem_celigo_amz_brand',
            discardIfEmpty: false,
            immutable: false,
            internalId: false,
            extract: '[*.hello]',
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          generate: 'custitem_celigo_amz_brand',
          discardIfEmpty: false,
          immutable: false,
          internalId: false,
          extract: '*.hello',
          useAsAnInitializeValue: false,
        },
      ]);
    });

    test('should format subrecord field mapping if subrecord configured at parent level', () => {
      const mappings = {
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
                    discardIfEmpty: false,
                    immutable: false,
                    hardCodedValue: '1471',
                    internalId: true,
                  },
                ],
                lists: [],
              },
              lookups: [],
            },
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          generate: 'celigo_inventorydetail',
          subRecordMapping: {
            recordType: 'inventorydetail',
            jsonPath: '$',
            mapping: {
              fields: [
                {
                  generate: 'item',
                  discardIfEmpty: false,
                  immutable: false,
                  hardCodedValue: '1471',
                  internalId: true,
                },
              ],
              lists: [

              ],
            },
            lookups: [

            ],
          },
          useAsAnInitializeValue: false,
          extract: 'Subrecord Mapping',
          isSubRecordMapping: true,
        },
      ]);
    });

    test('should add all the required mappings if selected import operation is attach', () => {
      const mappings = {
        fields: [],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResourceForAttach,
      })).toEqual([
        {
          generate: 'celigo_nlobjAttachToId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachedType',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachedId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachDetachAttributesRole',
        },
        {
          generate: 'celigo_nlobjAttachDetachAttributesField',
        },
      ]);
    });

    test('should remove detach related mappings if selected import operation is attach', () => {
      const mappings = {
        fields: [
          {
            generate: 'celigo_nlobjDetachFromId',
            isRequired: true,
          },
          {
            generate: 'celigo_nlobjDetachedType',
            isRequired: true,
          },
          {
            generate: 'celigo_nlobjDetachedId',
            isRequired: true,
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResourceForAttach,
      })).toEqual([
        {
          generate: 'celigo_nlobjAttachToId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachedType',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachedId',
          isRequired: true,
        },
      ]);
    });

    test('should add all the required mappings if selected import operation is detach', () => {
      const mappings = {
        fields: [],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResourceForDetach,
      })).toEqual([
        {
          generate: 'celigo_nlobjDetachFromId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjDetachedType',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjDetachedId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjAttachDetachAttributesRole',
        },
        {
          generate: 'celigo_nlobjAttachDetachAttributesField',
        },
      ]);
    });

    test('should remove attach related mappings if selected import operation is detach', () => {
      const mappings = {
        fields: [
          {
            generate: 'celigo_nlobjAttachToId',
            isRequired: true,
          },
          {
            generate: 'celigo_nlobjAttachedType',
            isRequired: true,
          },
          {
            generate: 'celigo_nlobjAttachedId',
            isRequired: true,
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResourceForDetach,
      })).toEqual([
        {
          generate: 'celigo_nlobjDetachFromId',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjDetachedType',
          isRequired: true,
        },
        {
          generate: 'celigo_nlobjDetachedId',
          isRequired: true,
        },
      ]);
    });

    test('should format list mapping by adding list name to the child mappings', () => {
      const mappings = {
        fields: [],
        lists: [
          {
            generate: 'item',
            fields: [
              {
                generate: 'line',
                hardCodedValue: '1',
                internalId: true,
              },
            ],
          },
        ],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([{
        generate: 'item[*].line.internalid',
        hardCodedValue: '1',
        internalId: true,
      }]);
    });

    test('should add key useIterativeRow to list mapping if preview is not succeded and extract starts with *. or 0.', () => {
      const mappings = {
        fields: [],
        lists: [
          {
            generate: 'item',
            fields: [
              {
                generate: 'item',
                hardCodedValue: '1',
                internalId: false,
                extract: '0.item',
              },
              {
                generate: 'quantity',
                hardCodedValue: '1',
                internalId: false,
                extract: '*.quantity',
              },
            ],
          },
        ],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([{
        extract: 'item',
        generate: 'item[*].item',
        hardCodedValue: '1',
        internalId: false,
        useIterativeRow: true,
      },
      {
        extract: 'quantity',
        generate: 'item[*].quantity',
        hardCodedValue: '1',
        internalId: false,
        useIterativeRow: true,
      }]);
    });

    test('should remove square braces for the extract of the list mapping if starts and ends with braces', () => {
      const mappings = {
        fields: [],
        lists: [{
          generate: 'item',
          fields: [
            {
              generate: 'itemid',
              hardCodedValue: '1',
              internalId: false,
              extract: "['item id']",
            },
          ],
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          extract: 'item id',
          generate: 'item[*].itemid',
          hardCodedValue: '1',
          internalId: false,
        },
      ]);
    });

    test('should remove square braces for the extract of the list mapping if starts and ends with braces and wrapped with special character', () => {
      const mappings = {
        fields: [],
        lists: [{
          generate: 'item',
          fields: [
            {
              generate: 'itemid',
              hardCodedValue: '1',
              internalId: false,
              extract: '[*.itemid]',
            },
          ],
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          extract: 'itemid',
          generate: 'item[*].itemid',
          hardCodedValue: '1',
          internalId: false,
        },
      ]);
    });

    test('should remove square braces, single quotes and * and 0 at the start of the extract of the list mapping if starts and ends with braces and isGroupedSampleData is true', () => {
      const mappings = {
        fields: [],
        lists: [{
          generate: 'item',
          fields: [
            {
              generate: 'itemid',
              internalId: false,
              extract: "['*.itemid']",
            },
            {
              generate: 'quantity',
              internalId: false,
              extract: "['0.quantity']",
            },
          ],
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
        isGroupedSampleData: true,
      })).toEqual([
        {
          extract: 'itemid',
          generate: 'item[*].itemid',
          internalId: false,
        },
        {
          extract: 'quantity',
          generate: 'item[*].quantity',
          internalId: false,
          useFirstRow: true,
        },
      ]);
    });

    test('should remove square braces and * and 0 at the start of the extract of the list mapping if starts and ends with braces and isGroupedSampleData is true', () => {
      const mappings = {
        fields: [],
        lists: [{
          generate: 'item',
          fields: [
            {
              generate: 'itemid',
              internalId: false,
              extract: '[*.itemid]',
            },
            {
              generate: 'quantity',
              internalId: false,
              extract: '[0.quantity]',
            },
          ],
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
        isGroupedSampleData: true,
      })).toEqual([
        {
          extract: 'itemid',
          generate: 'item[*].itemid',
          internalId: false,
        },
        {
          extract: 'quantity',
          generate: 'item[*].quantity',
          internalId: false,
          useFirstRow: true,
        },
      ]);
    });

    test('should add key useFirstRow to the mapping if extract doesn\'t contain *.', () => {
      const mappings = {
        fields: [],
        lists: [{
          generate: 'item',
          fields: [
            {
              generate: 'itemid',
              internalId: false,
              extract: 'itemid',
            },
          ],
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
        isGroupedSampleData: true,
      })).toEqual([
        {
          extract: 'itemid',
          generate: 'item[*].itemid',
          internalId: false,
          useFirstRow: true,
        },
      ]);
    });

    test('should add extract and isSubRecordMapping key for the list subrecord mapping', () => {
      const mappings = {
        fields: [],
        lists: [{
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
        }],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          extract: 'Subrecord Mapping',
          generate: 'item[*].celigo_inventorydetail',
          isSubRecordMapping: true,
          subRecordMapping: {
            jsonPath: '$',
            recordType: 'inventorydetail',
          },
        },
      ]);
    });

    test('should ignore duplicate mapping by the mapping generate if exists in the mappings', () => {
      const mappings = {
        fields: [
          {
            generate: 'custitem_celigo_amz_brand',
            discardIfEmpty: false,
            immutable: false,
            internalId: false,
            extract: 'hello',
          },
          {
            generate: 'custitem_celigo_amz_brand',
            discardIfEmpty: false,
            immutable: false,
            internalId: false,
            extract: 'heyy',
          },
        ],
        lists: [],
      };

      expect(util.getFieldsAndListMappings({
        mappings,
        recordType,
        resource: nsImportResource,
      })).toEqual([
        {
          discardIfEmpty: false,
          extract: 'hello',
          generate: 'custitem_celigo_amz_brand',
          immutable: false,
          internalId: false,
          useAsAnInitializeValue: false,
        },
      ]);
    });
  });

  describe('tests for util generateMappingFieldsAndList', () => {
    test('should correctly generate mappings in case sublists are present', () => {
      const mappings = [
        {
          generate: 'item[*].line.internalid',
          hardCodedValue: '1',
          internalId: true,
        },
        {
          generate: 'item[*].quantity',
          hardCodedValue: '10',
        },
        {
          generate: 'account',
          internalId: true,
          extract: 'Account Id',
        },
        {
          generate: 'trandate',
          hardCodedValue: '11/11/2021',
        },
      ];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: "['Account Id']",
            generate: 'account',
            internalId: false,
          },
          {
            generate: 'trandate',
            hardCodedValue: '11/11/2021',
            internalId: false,
          },
        ],
        lists: [
          {
            fields: [
              {
                generate: 'line',
                hardCodedValue: '1',
                internalId: true,
              },
              {
                generate: 'quantity',
                hardCodedValue: '10',
                internalId: false,
              },
            ],
            generate: 'item',
          },
        ],
      });
    });

    test('should convert the string to array for multiselect fields in the mapping', () => {
      const mappings = [
        {
          generate: 'color',
          hardCodedValue: 'green,red,yellow',
        },
      ];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
        generateFields: [{
          id: 'color',
          type: 'multiselect',
        }],
      })).toEqual({
        fields: [
          {
            generate: 'color',
            hardCodedValue: ['green', 'red', 'yellow'],
            internalId: false,
          },
        ],
        lists: [],
      });
    });

    test('should add square braces and quotes for the extract of the mapping', () => {
      const mappings = [
        {
          extract: 'Billing City',
          generate: 'billcity',
          internalId: false,
        }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: "['Billing City']",
            generate: 'billcity',
            internalId: false,
          },
        ],
        lists: [],
      });
    });

    test('should add square braces for the extract of the mapping for ss2 mapping', () => {
      const mappings = [
        {
          extract: 'Billing City',
          generate: 'billcity',
          internalId: false,
        }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: {
          netsuite_da: {
            useSS2Restlets: true,
          },
        },
      })).toEqual({
        fields: [
          {
            extract: '[Billing City]',
            generate: 'billcity',
            internalId: false,
          },
        ],
        lists: [],
      });
    });

    test('should add square braces for the extract of the mapping for ss2 mapping in case extract is in form of grouped data', () => {
      const mappings = [
        {
          extract: '*.Billing City',
          generate: 'billcity',
          internalId: false,
        }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: {
          netsuite_da: {
            useSS2Restlets: true,
          },
        },
      })).toEqual({
        fields: [
          {
            extract: '*.[Billing City]',
            generate: 'billcity',
            internalId: false,
          },
        ],
        lists: [],
      });
    });

    test('should not add square braces for the extract of the mapping in case extract is handlebar expression', () => {
      const mappings = [
        {
          extract: '{{add name xyz}}',
          generate: 'billcity',
          internalId: false,
        }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: '{{add name xyz}}',
            generate: 'billcity',
            internalId: false,
          },
        ],
        lists: [],
      });
    });

    test('should remove UI related key and useFirstRow special keys in the mapping', () => {
      const mappings = [
        {
          key: 'k1',
          generate: 'name',
          useFirstRow: true,
          extract: '*.name',
        },
      ];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: '0.name',
            generate: 'name',
            internalId: false,
          },
        ],
        lists: [

        ],
      });
    });

    test('should delete subrecord mapping special keys added and shift subrecord mapping to last', () => {
      const mappings = [
        {
          extract: 'Subrecord Mapping',
          generate: 'item[*].celigo_inventorydetail',
          isSubRecordMapping: true,
          subRecordMapping: {
            jsonPath: '$',
            recordType: 'inventorydetail',
          },
        },
        {
          extract: 'Full Name',
          generate: 'Name',
        },
        {
          extract: 'date',
          generate: 'trandate',
        },
      ];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: "['Full Name']",
            generate: 'Name',
            internalId: false,
          },
          {
            extract: 'date',
            generate: 'trandate',
            internalId: false,
          },
        ],
        lists: [
          {
            fields: [
              {
                generate: 'celigo_inventorydetail',
                internalId: false,
                subRecordMapping: {
                  jsonPath: '$',
                  recordType: 'inventorydetail',
                },
              },
            ],
            generate: 'item',
          },
        ],
      });
    });

    test('should remove key useAsAnInitializeValue from mapping and add extra mapping with key celigo_initializeValues', () => {
      const mappings = [{
        generate: 'Name',
        extract: 'Name',
        useAsAnInitializeValue: true,
      }, {
        generate: 'Phone',
        extract: 'phone',
        useAsAnInitializeValue: true,
      }, {
        generate: 'mail',
        extract: 'mail',
      }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: 'Name',
            generate: 'Name',
            internalId: false,
          },
          {
            extract: 'phone',
            generate: 'Phone',
            internalId: false,
          },
          {
            extract: 'mail',
            generate: 'mail',
            internalId: false,
          },
          {
            generate: 'celigo_initializeValues',
            hardCodedValue: 'Name,Phone',
          },
        ],
        lists: [],
      });
    });

    test('should ignore adding celigo_recordmode_dynamic to the mapping if value is false', () => {
      const mappings = [{
        extract: 'Name',
        generate: 'Name',
      }, {
        hardCodedValue: false,
        generate: 'celigo_recordmode_dynamic',
      }, {
        hardCodedValue: 'false',
        generate: 'celigo_recordmode_dynamic',
      }];

      expect(util.generateMappingFieldsAndList({
        mappings,
        recordType,
        importResource: nsImportResource,
      })).toEqual({
        fields: [
          {
            extract: 'Name',
            generate: 'Name',
            internalId: false,
          },
        ],
        lists: [],
      });
    });
  });
});

