
/* global describe, test, expect, fail, jest */
import getFieldsWithDefaults from '.';

jest.mock('../../definitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      subForms: {
        someSubform: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
            'custom.Field': {
              fieldId: 'custom.Field',
              someProp: 'faa',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField', 'custom.Field'],
          },
        },
        subFormFieldsWithFuncs: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              someFunc: val => val,
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
        common: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
        bunchOfFieldsWithoutfieldMap: {
          layout: {
            fields: ['bunchOfFieldsWithoutfieldMap'],
          },
        },
        bunchOfFieldsWithoutLayoutFields: {
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
        },
        bunchOffieldsWithOptionsHanlders: {
          optionsHandler: (fieldId, fields) => {
            if (fieldId === 'someField') {
              return fields.find(field => field.id === 'someField').value;
            }
          },
          fieldMap: {
            someField: {
              fieldId: 'someField',
              someProp: 'foo',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          },
          layout: {
            fields: ['someField'],
          },
        },
      },
    },
  },
}));

jest.mock('../../fieldDefinitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      someField: {},
      exportData: {},
      'file.decompressFiles': {},
      'custom.Field': {},
    },
  },
}));

describe('form factory new layout', () => {
  describe('field references filling behavior', () => {
    test('should set defaults for multiple fields references correctly ', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldMap: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
          fields: ['exportData'],
          type: 'collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData', 'file.decompressFiles'],
            },
          ],
        },
      };
      const val = getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.fieldMap).toEqual({
        exportData: {
          defaultValue: '',
          fieldId: 'exportData',
          helpKey: 'someResourceType.exportData',
          id: 'exportData',
          name: '/exportData',
          resourceId: undefined,
          resourceType: 'someResourceType',
          someProp: 'blah',
        },
        'file.decompressFiles': {
          defaultValue: '',
          fieldId: 'file.decompressFiles',
          helpKey: 'someResourceType.file.decompressFiles',
          id: 'file.decompressFiles',
          name: '/file/decompressFiles',
          resourceId: undefined,
          resourceType: 'someResourceType',
        },
      });
    });

    test('should show fields when developer mode is enabled', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldMap: {
          exportData: {
            fieldId: 'exportData',
            someProp: 'blah',
            developerModeOnly: true,
          },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
          type: 'collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData', 'file.decompressFiles'],
            },
          ],
        },
      };
      const val = getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource,
        { developerMode: true }
      );

      expect(val).toEqual({
        layout: {
          type: 'collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData', 'file.decompressFiles'],
            },
          ],
        },
        fieldMap: {
          exportData: {
            defaultValue: '',
            fieldId: 'exportData',
            helpKey: 'someResourceType.exportData',
            id: 'exportData',
            name: '/exportData',
            resourceId: undefined,
            resourceType: 'someResourceType',
            someProp: 'blah',
            developerModeOnly: true,
          },
          'file.decompressFiles': {
            defaultValue: '',
            fieldId: 'file.decompressFiles',
            helpKey: 'someResourceType.file.decompressFiles',
            id: 'file.decompressFiles',
            name: '/file/decompressFiles',
            resourceId: undefined,
            resourceType: 'someResourceType',
          },
        },
      });
    });

    test('should hide fields when developer mode is disabled', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldMap: {
          exportData: {
            fieldId: 'exportData',
            someProp: 'blah',
            developerModeOnly: true,
          },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
          type: 'collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData', 'file.decompressFiles'],
            },
          ],
        },
      };
      const val = getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val).toEqual({
        layout: {
          type: 'collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['file.decompressFiles'],
            },
          ],
        },
        fieldMap: {
          'file.decompressFiles': {
            defaultValue: '',
            fieldId: 'file.decompressFiles',
            helpKey: 'someResourceType.file.decompressFiles',
            id: 'file.decompressFiles',
            name: '/file/decompressFiles',
            resourceId: undefined,
            resourceType: 'someResourceType',
          },
        },
      });
    });
    test('should set defaults for multiple fields references located in different containers correctly ', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldMap: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
          fields: ['exportData'],
          type: 'tab||col||collapse',

          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData'],
            },
            {
              label: 'optional some label or tab name',
              fields: ['file.decompressFiles'],
            },
          ],
        },
      };
      const val = getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.fieldMap).toEqual({
        exportData: {
          defaultValue: '',
          fieldId: 'exportData',
          helpKey: 'someResourceType.exportData',
          id: 'exportData',
          name: '/exportData',
          resourceId: undefined,
          resourceType: 'someResourceType',
          someProp: 'blah',
        },
        'file.decompressFiles': {
          defaultValue: '',
          fieldId: 'file.decompressFiles',
          helpKey: 'someResourceType.file.decompressFiles',
          id: 'file.decompressFiles',
          name: '/file/decompressFiles',
          resourceId: undefined,
          resourceType: 'someResourceType',
        },
      });

      expect(val.layout).toEqual({
        fields: ['exportData'],
        type: 'tab||col||collapse',
        containers: [
          {
            label: 'optional some label or tab name',
            fields: ['exportData'],
          },
          {
            label: 'optional some label or tab name',
            fields: ['file.decompressFiles'],
          },
        ],
      });
    });
    describe('formId fields', () => {
      test('should pick up references for a formId fields correctly and cascade visibility rules', () => {
        const resourceType = 'someResourceType';
        const resource = {};
        // metadata with a form visibility rule
        const testMeta = {
          fieldMap: {
            common: {
              formId: 'common',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                label: 'optional some label or tab name',
                fields: ['common'],
                // either or containers or fields
              },
            ],
          },
        };
        const val = getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        expect(val).toEqual({
          fieldMap: {
            someField: {
              defaultValue: '',
              fieldId: 'someField',
              helpKey: 'someResourceType.someField',
              id: 'someField',
              name: '/someField',
              resourceId: undefined,
              someProp: 'foo',
              resourceType: 'someResourceType',
              visibleWhenAll: [
                { field: 'fieldA', is: ['someValue'] },
                { field: 'someOtherField', is: ['foo'] },
              ],
            },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                label: 'optional some label or tab name',
                fields: ['someField'],
              },
            ],
          },
        });
      });
      test('should pick up references for a formId fields and correctly club them with other fields', () => {
        const resourceType = 'someResourceType';
        const resource = {};
        // metadata with a form visibility rule
        const testMeta = {
          fieldMap: {
            'file.decompressFiles': { fieldId: 'file.decompressFiles' },
            someSubform: {
              formId: 'someSubform',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
            exportData: { fieldId: 'exportData' },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                fields: ['file.decompressFiles', 'someSubform', 'exportData'],
              },
            ],
          },
        };
        const val = getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        // we are checking if its flatteing in the references and layout correctly
        expect(val).toEqual({
          actions: undefined,
          fieldMap: {
            'custom.Field': {
              defaultValue: '',
              fieldId: 'custom.Field',
              helpKey: 'someResourceType.custom.Field',
              id: 'custom.Field',
              name: '/custom/Field',
              resourceId: undefined,
              resourceType: 'someResourceType',
              someProp: 'faa',
              visibleWhenAll: [
                {
                  field: 'fieldA',
                  is: ['someValue'],
                },
                {
                  field: 'someOtherField',
                  is: ['foo'],
                },
              ],
            },
            someField: {
              defaultValue: '',
              fieldId: 'someField',
              helpKey: 'someResourceType.someField',
              id: 'someField',
              name: '/someField',
              resourceId: undefined,
              someProp: 'foo',
              resourceType: 'someResourceType',
              visibleWhenAll: [
                { field: 'fieldA', is: ['someValue'] },
                { field: 'someOtherField', is: ['foo'] },
              ],
            },
            'file.decompressFiles': {
              defaultValue: '',
              fieldId: 'file.decompressFiles',
              helpKey: 'someResourceType.file.decompressFiles',
              id: 'file.decompressFiles',
              name: '/file/decompressFiles',
              resourceId: undefined,
              resourceType: 'someResourceType',
            },
            exportData: {
              defaultValue: '',
              fieldId: 'exportData',
              helpKey: 'someResourceType.exportData',
              id: 'exportData',
              name: '/exportData',
              resourceId: undefined,
              resourceType: 'someResourceType',
            },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                fields: [
                  'file.decompressFiles',
                  'someField',
                  'custom.Field',
                  'exportData',
                ],
              },
            ],
          },
        });
      });

      test('should pick up function references for a formId fields and correctly club them with other fields', () => {
        const resourceType = 'someResourceType';
        const resource = { someValue: 'something' };
        // metadata with a form visibility rule
        const testMeta = {
          fieldMap: {
            subFormFieldsWithFuncs: {
              formId: 'subFormFieldsWithFuncs',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
            exportData: { fieldId: 'exportData' },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                fields: ['subFormFieldsWithFuncs', 'exportData'],
              },
            ],
          },
        };
        const val = getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        // someFunc is a a function defined in the metadata of the subform
        // it simply returns what value passed in its argument
        // since getFieldsWithDefaults execute all functions properties against the resource object
        // we are asserting someFunc to be the resource object
        expect(val).toEqual({
          actions: undefined,
          fieldMap: {
            someField: {
              defaultValue: '',
              fieldId: 'someField',
              helpKey: 'someResourceType.someField',
              id: 'someField',
              name: '/someField',
              resourceId: undefined,
              resourceType: 'someResourceType',
              someFunc: resource,
              someProp: 'foo',
              visibleWhenAll: [
                { field: 'fieldA', is: ['someValue'] },
                {
                  field: 'someOtherField',
                  is: ['foo'],
                },
              ],
            },
            exportData: {
              defaultValue: '',
              fieldId: 'exportData',
              helpKey: 'someResourceType.exportData',
              id: 'exportData',
              name: '/exportData',
              resourceId: undefined,
              resourceType: 'someResourceType',
            },
          },
          layout: {
            type: 'collapse',
            containers: [
              {
                fields: ['someField', 'exportData'],
              },
            ],
          },
        });
      });
      test('should throw an error when fieldMap do not exist for the subform', () => {
        const resourceType = 'someResourceType';
        const resource = {};
        // metadata with a form visibility rule
        const testMeta = {
          fieldMap: {
            bunchOfFieldsWithoutfieldMap: {
              formId: 'bunchOfFieldsWithoutfieldMap',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
          },
          layout: {
            type: 'tab||col||collapse',
            containers: [
              {
                label: 'optional some label or tab name',
                fields: ['bunchOfFieldsWithoutfieldMap'],
              },
            ],
          },
        };

        try {
          getFieldsWithDefaults(testMeta, resourceType, resource);
          fail();
        } catch (e) {
          expect(e.message).toEqual(
            'could not find fieldMap for given form id bunchOfFieldsWithoutfieldMap'
          );
        }
      });
    });
  });
});
