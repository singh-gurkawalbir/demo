/* global describe, test, expect, jest, fail */

import jsonPatch from 'fast-json-patch';
import {
  getMissingPatchSet,
  sanitizePatchSet,
  getPatchPathForCustomForms,
  getFieldById,
  getFieldByName,
} from './utils';
import formFactory, { getAmalgamatedOptionsHandler } from './formFactory';

jest.mock('./definitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      subForms: {
        someSubform: {
          fieldReferences: {
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
        common: {
          fieldReferences: {
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
        bunchOfFieldsWithoutFieldReferences: {
          layout: {
            fields: ['bunchOfFieldsWithoutFieldReferences'],
          },
        },
        bunchOfFieldsWithoutLayoutFields: {
          fieldReferences: {
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
          fieldReferences: {
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

jest.mock('./fieldDefinitions/index', () => ({
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

describe('Form Utils', () => {
  describe('getMissingPatchSet', () => {
    test('should find missing node', () => {
      const resource = { a: {} };
      const paths = ['/b/c', '/a/e/f'];
      const patchResult = getMissingPatchSet(paths, resource);

      expect(patchResult).toEqual([
        { path: '/a/e', op: 'add', value: {} },
        { path: '/a/e/f', op: 'add', value: {} },
        { path: '/b', op: 'add', value: {} },
        { path: '/b/c', op: 'add', value: {} },
      ]);

      const merged = jsonPatch.applyPatch(resource, patchResult, false, true)
        .newDocument;

      expect(merged).toEqual({
        a: {
          e: {
            f: {},
          },
        },
        b: {
          c: {},
        },
      });
    });
    describe('missing patches for an empty resource ', () => {
      test('should find all missing node against empty obj where some paths share lineage', () => {
        const resource = {};
        const paths = ['/a/e/f', '/a/e/g', '/a/b', 'a/b/c'];
        const patchResult = getMissingPatchSet(paths, resource);

        expect(patchResult).toEqual([
          { path: '/a', op: 'add', value: {} },
          { path: '/a/b', op: 'add', value: {} },
          { path: '/a/e', op: 'add', value: {} },
          { path: '/a/e/f', op: 'add', value: {} },
          { path: '/a/e/g', op: 'add', value: {} },
          { path: '/b', op: 'add', value: {} },
          { path: '/b/c', op: 'add', value: {} },
        ]);

        const merged = jsonPatch.applyPatch(resource, patchResult, false, true)
          .newDocument;

        expect(merged).toEqual({
          a: { b: {}, e: { f: {}, g: {} } },
          b: { c: {} },
        });
      });

      test('should find all missing nodes against empty obj for one forward slash delimiter paths', () => {
        const resource = {};
        const paths = ['/a', '/b', '/c'];
        const patchResult = getMissingPatchSet(paths, resource);

        expect(patchResult).toEqual([
          { path: '/a', op: 'add', value: {} },
          { path: '/b', op: 'add', value: {} },
          { path: '/c', op: 'add', value: {} },
        ]);

        const merged = jsonPatch.applyPatch(resource, patchResult, false, true)
          .newDocument;

        expect(merged).toEqual({
          a: {},
          b: {},
          c: {},
        });
      });
    });

    test('should create a patch to replace the parent node with an object if it`s a string', () => {
      const resource = { a: 123, encrypted: '****' };
      const paths = ['/encrypted/apikey'];
      const patchResult = getMissingPatchSet(paths, resource);

      // console.log(patchResult);

      expect(patchResult).toEqual([
        { path: '/encrypted', op: 'add', value: {} },
        { path: '/encrypted/apikey', op: 'add', value: {} },
      ]);

      const merged = jsonPatch.applyPatch(resource, patchResult, false, true)
        .newDocument;

      // console.log(merged);

      expect(merged).toEqual({
        a: 123,
        encrypted: {
          apikey: {},
        },
      });
    });
    // Here we are trying to replace a value it could be string
    test('should not create any patch if the supplied paths does not exceed the object path', () => {
      const resource = { a: 123, encrypted: { blah: '****' } };
      const paths = ['/encrypted/blah'];
      const patchResult = getMissingPatchSet(paths, resource);

      expect(patchResult).toEqual([]);

      const merged = jsonPatch.applyPatch(resource, patchResult, false, true)
        .newDocument;

      // console.log(merged);

      expect(merged).toEqual({
        a: 123,
        encrypted: {
          blah: '****',
        },
      });
    });
  });

  describe('sanitizePatchSet', () => {
    test('result patch set should succeed in patching resource when initial patch is missing operations.', () => {
      const resource = {
        html: {
          name: 'abc',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: ['bad', 'fail'],
        },
      ];
      const sanitized = sanitizePatchSet({ patchSet, resource });
      // console.log(sanitized);
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      // console.log(merged);
      expect(merged).toEqual({
        html: { name: 'abc', rateLimit: { failValues: ['bad', 'fail'] } },
      });
    });
  });

  describe('getPatchPathFromCustomForms', () => {
    test('should return null for meta having a non-existent field ', () => {
      const testMeta = {
        fieldReferences: {
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          fields: ['exportData'],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'non-existentField', 1);

      expect(res).toEqual(null);
    });
    test('should generate field path for meta having just fields in the root ', () => {
      const testMeta = {
        fieldReferences: {
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          fields: ['exportData'],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual('/customForm/form/layout/fields/1');
    });
    test('should generate field path for meta having fields in containers ', () => {
      const testMeta = {
        fieldReferences: {
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          type: 'tab||col||collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData'],
            },
            // either or containers or fields
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual('/customForm/form/layout/containers/0/fields/1');
    });

    test('generate field path for meta having fields in containers and in the root', () => {
      const testMeta = {
        fieldReferences: {
          someField: {
            fieldId: 'someField',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          fields: ['someField'],
          type: 'tab||col||collapse',
          containers: [
            {
              label: 'optional some label or tab name',
              fields: ['exportData'],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual('/customForm/form/layout/containers/0/fields/1');
    });

    test('generate field path for meta having fields in deep containers', () => {
      const testMeta = {
        fieldReferences: {
          someField: {
            fieldId: 'someField',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          type: 'tab||col||collapse',
          containers: [
            {
              type: 'tab||col||collapse',
              containers: [
                {
                  label: 'optional some label or tab name',
                  fields: ['someField'],
                },
                {
                  label: 'optional some label or tab name',
                  fields: ['exportData'],
                },
              ],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual(
        '/customForm/form/layout/containers/0/containers/1/fields/1'
      );
    });
  });

  describe('search field by id through the layout ', () => {
    test('should correctly search for a field in the metadata', () => {
      const testMeta = {
        fieldReferences: {
          exportData: {
            fieldId: 'exportData',
            name: '/exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
          someField: {
            fieldId: 'someField',
            name: '/someField',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
      };
      const foundField = getFieldById({ meta: testMeta, id: 'someField' });

      expect(foundField).toEqual({
        fieldId: 'someField',
        name: '/someField',
        visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
      });
    });
  });

  describe('search field by name through the fieldReferences ', () => {
    test('should correctly search for a field in the fieldReferences', () => {
      const testMeta = {
        fieldReferences: {
          exportData: {
            fieldId: 'exportData',
            name: '/exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
          someField: {
            fieldId: 'someField',
            name: '/someField',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
      };
      const foundField = getFieldByName({
        fieldMeta: testMeta,
        name: '/exportData',
      });

      expect(foundField).toEqual({
        fieldId: 'exportData',
        name: '/exportData',
        visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
      });
    });
  });
});

describe('form factory new layout', () => {
  describe('field references filling behavior', () => {
    test('should set defaults for multiple fields references correctly ', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
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
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.fieldReferences).toEqual({
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
    test('should set defaults for multiple fields references located in different containers correctly ', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
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
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.fieldReferences).toEqual({
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
          fieldReferences: {
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
        const val = formFactory.getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        expect(val).toEqual({
          fieldReferences: {
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
          fieldReferences: {
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
        const val = formFactory.getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        // we are checking if its flatteing in the references and layout correctly
        expect(val).toEqual({
          actions: undefined,
          fieldReferences: {
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

      test('should throw an error when fieldReferences do not exist for the subform', () => {
        const resourceType = 'someResourceType';
        const resource = {};
        // metadata with a form visibility rule
        const testMeta = {
          fieldReferences: {
            bunchOfFieldsWithoutFieldReferences: {
              formId: 'bunchOfFieldsWithoutFieldReferences',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
          },
          layout: {
            type: 'tab||col||collapse',
            containers: [
              {
                label: 'optional some label or tab name',
                fields: ['bunchOfFieldsWithoutFieldReferences'],
              },
            ],
          },
        };

        try {
          formFactory.getFieldsWithDefaults(testMeta, resourceType, resource);
          fail();
        } catch (e) {
          expect(e.message).toEqual(
            'could not find fieldReferences for given form id bunchOfFieldsWithoutFieldReferences'
          );
        }
      });
    });
  });
});

describe('getFieldsWithoutFuncs ', () => {
  test('should apply all default fields and exclude any function props', () => {
    const resourceType = 'someResourceType';
    const resource = {};
    const testMeta = {
      fieldReferences: {
        common: {
          formId: 'common',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
        exportData: { fieldId: 'exportData', someFuncProp: a => a },
      },
      layout: {
        type: 'tab||col||collapse',
        containers: [
          {
            label: 'optional some label or tab name',
            fields: ['common', 'exportData'],
          },
        ],
      },
    };
    const val = formFactory.getFieldsWithoutFuncs(
      testMeta,
      resource,
      resourceType
    );
    const expectedFieldReferences = {
      exportData: {
        defaultValue: '',
        fieldId: 'exportData',
        helpKey: 'someResourceType.exportData',
        id: 'exportData',
        name: '/exportData',
        resourceId: undefined,
        resourceType: 'someResourceType',
      },
      someField: {
        defaultValue: '',
        fieldId: 'someField',
        helpKey: 'someResourceType.someField',
        id: 'someField',
        name: '/someField',
        resourceId: undefined,
        resourceType: 'someResourceType',
        someProp: 'foo',
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
    };

    expect(val.fieldReferences).toEqual(expectedFieldReferences);

    expect(val.extractedInitFunctions.exportData.someFuncProp('xyz')).toEqual(
      'xyz'
    );
  });
  test('should extract all function props and tie it the corresponding field reference', () => {
    const resourceType = 'someResourceType';
    const resource = {};
    const testMeta = {
      fieldReferences: {
        common: {
          formId: 'common',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
        exportData: { fieldId: 'exportData', someFuncProp: a => a },
      },
      layout: {
        type: 'tab||col||collapse',
        containers: [
          {
            label: 'optional some label or tab name',
            fields: ['common', 'exportData'],
          },
          // either or containers or fields
        ],
      },
    };
    const val = formFactory.getFieldsWithoutFuncs(
      testMeta,
      resource,
      resourceType
    );

    // TODO: is there any matcher for type function...that would be better than using anything

    expect(val.extractedInitFunctions).toEqual({
      exportData: {
        someFuncProp: expect.anything(),
      },
    });
    // trying to assert that the function works as expected
    expect(val.extractedInitFunctions.exportData.someFuncProp('xyz')).toEqual(
      'xyz'
    );
  });
});

describe('form factory options handler amalgamation getAmalgamatedOptionsHandler', () => {
  test('should club options handlers both in the root metadata as well within the containers', () => {
    const resourceType = 'someResourceType';
    // metadata with a form visibility rule
    const testMeta = {
      optionsHandler: fieldId => {
        if (fieldId === 'anotherFieldId') {
          return 'someValue';
        }
      },
      fieldReferences: {
        bunchOffieldsWithOptionsHanlders: {
          formId: 'bunchOffieldsWithOptionsHanlders',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
      },
    };
    const amalgamatedOptionsHandlers = getAmalgamatedOptionsHandler(
      testMeta,
      resourceType
    );

    // checking for the optionsHandler within the meta
    expect(amalgamatedOptionsHandlers('anotherFieldId')).toEqual('someValue');
    expect(
      amalgamatedOptionsHandlers('someField', [
        { id: 'someField', value: 'hi' },
      ])
    ).toEqual('hi');
  });
});
