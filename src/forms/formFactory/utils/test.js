/* eslint-disable jest/no-standalone-expect */

import jsonPatch from 'fast-json-patch';
import each from 'jest-each';
import {
  getMissingPatchSet,
  sanitizePatchSet,
  getFieldById,
  getFieldByName,
  getFieldByIdFromLayout,
  isExpansionPanelErrored,
  translateDependencyProps,
  getAllFormValuesAssociatedToMeta,
  adjustingFieldRules,
  getFieldWithReferenceById,
  fieldIDsExceptClockedFields,
  isFormTouched,
  getFieldConfig,
  refGeneration,
  convertFieldsToFieldReferenceObj,
  integrationSettingsToDynaFormMetadata,
} from '.';

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
    describe('missing patches for an empty resource', () => {
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
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: { name: 'abc', rateLimit: { failValues: ['bad', 'fail'] } },
      });
    });

    test('should explicitly delete resource properties when we receive undefined replace patches', () => {
      const resource = {
        html: {
          name: 'abc',
          a: 'abcd',
          b: 'efg',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: ['bad', 'fail'],
        },
        {
          op: 'replace',
          path: '/html/a',
          value: undefined,
        },
      ];
      const sanitized = sanitizePatchSet({ patchSet, resource });
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: {
          name: 'abc',
          b: 'efg',
          rateLimit: { failValues: ['bad', 'fail'] },
        },
      });
    });
    test('should not delete resource properties when we receive undefined replace patches when skipRemovePatches set to true', () => {
      const resource = {
        html: {
          name: 'abc',
          a: 'abcd',
          b: 'efg',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: ['bad', 'fail'],
        },
        {
          op: 'replace',
          path: '/html/a',
          value: undefined,
        },
      ];
      const sanitized = sanitizePatchSet({
        patchSet,
        resource,
        skipRemovePatches: true,
      });
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: {
          name: 'abc',
          a: undefined,
          b: 'efg',
          rateLimit: { failValues: ['bad', 'fail'] },
        },
      });
    });
    test('should not generate a remove patch when we receive an undefined replace value patch and the corresponding resource property is not there', () => {
      const resource = {
        html: {
          name: 'abc',
          b: 'efg',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: ['bad', 'fail'],
        },
        {
          op: 'replace',
          path: '/html/a',
          value: undefined,
        },
      ];
      const sanitized = sanitizePatchSet({ patchSet, resource });

      expect(sanitized).not.toContainEqual({
        op: 'remove',
        path: '/html/a',
      });
    });

    test('result patch set should succeed in patching resource when there are add and replace patches not in an order', () => {
      const resource = {
        html: {
          name: 'abc',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html',
          value: {name: 'hello'},
        },
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: ['bad', 'fail'],
        },
      ];
      const sanitized = sanitizePatchSet({ patchSet, resource });

      expect(sanitized).toEqual([
        {
          op: 'replace',
          path: '/html',
          value: {
            name: 'hello',
          },
        },
        {
          path: '/html/rateLimit',
          op: 'add',
          value: {
          },
        },
        {
          path: '/html/rateLimit/failValues',
          op: 'add',
          value: {
          },
        },
        {
          op: 'replace',
          path: '/html/rateLimit/failValues',
          value: [
            'bad',
            'fail',
          ],
        },
      ]);
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: { name: 'hello', rateLimit: { failValues: ['bad', 'fail'] } },
      });
    });
    test('result patch set should succeed in patching resource when field on resource has a value but the value in the patch is empty string', () => {
      const resource = {
        html: {
          name: 'abc',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/name',
          value: '',
        },
      ];
      const fieldMeta = {
        fieldMap: {
          'html.name': {
            fieldId: 'html.name',
            defaultValue: '',
            name: '/html/name',
          },
        },
      };
      const sanitized = sanitizePatchSet({ patchSet, fieldMeta, resource });
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: { name: '' },
      });
    });
    test('result patch set should succeed in patching resource when field on resource has a value of empty string but the value in the patch is not empty string', () => {
      const resource = {
        html: {
          name: '',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/name',
          value: 'adfs',
        },
      ];
      const fieldMeta = {
        fieldMap: {
          'html.name': {
            fieldId: 'html.name',
            defaultValue: '',
            name: '/html/name',
          },
        },
      };
      const sanitized = sanitizePatchSet({ patchSet, fieldMeta, resource });
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: { name: 'adfs' },
      });
    });
    test('result patch set should succeed in patching resource when field on resource has a value of empty string but the value in the patch is empty string', () => {
      const resource = {
        html: {
          name: '',
        },
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/html/name',
          value: '',
        },
      ];
      const fieldMeta = {
        fieldMap: {
          'html.name': {
            fieldId: 'html.name',
            defaultValue: '',
            name: '/html/name',
          },
        },
      };
      const sanitized = sanitizePatchSet({ patchSet, fieldMeta, resource });
      const merged = jsonPatch.applyPatch(resource, sanitized, false, true)
        .newDocument;

      expect(merged).toEqual({
        html: { name: '' },
      });
    });
  });

  describe('search field by id through the fieldMap', () => {
    test('should return null if there is no metadata', () => {
      expect(getFieldById({meta: null})).toBeNull();
    });
    test('should correctly search for a field in the metadata', () => {
      const testMeta = {
        fieldMap: {
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

  describe('getFieldByIdFromLayout search field by name through the fieldMap', () => {
    test('should correctly search for a field in the fieldMap', () => {
      const testMeta = {
        fieldMap: {
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
  describe('search for by id through the layout and check its corresponding fieldMap value', () => {
    test('should find a field successfully when there is a field in layout and defined in the fieldMap as well', () => {
      const metadata = {
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
              fields: ['file.decompressFiles', 'someField'],
              containers: [
                {
                  fields: ['custom.Field', 'exportData'],
                },
              ],
            },
          ],
        },
      };
      const foundValue = getFieldByIdFromLayout(
        metadata.layout,
        metadata.fieldMap,
        'exportData'
      );

      expect(foundValue).toEqual({
        defaultValue: '',
        fieldId: 'exportData',
        helpKey: 'someResourceType.exportData',
        id: 'exportData',
        name: '/exportData',
        resourceId: undefined,
        resourceType: 'someResourceType',
      });
    });
    test('should not find a field when there is a field in layout and not defined in the fieldMap', () => {
      const metadata = {
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
        },
        layout: {
          type: 'collapse',
          containers: [
            {
              fields: ['file.decompressFiles', 'someField'],
              containers: [
                {
                  fields: ['custom.Field', 'exportData'],
                },
              ],
            },
          ],
        },
      };
      const foundValue = getFieldByIdFromLayout(
        metadata.layout,
        metadata.fieldMap,
        'exportData'
      );

      expect(foundValue).toBeNull();
    });

    test('should not find a field when the field does not exist in the fields and the fieldMap', () => {
      const metadata = {
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
        },
        layout: {
          type: 'collapse',
          containers: [
            {
              fields: ['file.decompressFiles', 'someField'],
              containers: [
                {
                  fields: ['custom.Field'],
                },
              ],
            },
          ],
        },
      };
      const foundValue = getFieldByIdFromLayout(
        metadata.layout,
        metadata.fieldMap,
        'exportData'
      );

      expect(foundValue).toBeNull();
    });
    test('should return null if the field layout does not not exists', () => {
      const foundValue = getFieldByIdFromLayout();

      expect(foundValue).toBeNull();
    });
  });

  describe('isExpansionPanelErrored should determine whether the expansion panel should open', () => {
    describe('default isExpansionPanelErrored should consider field isValid or discretely invalid', () => {
      test('should error specific expansion panel only when those field states and unfulfilled', () => {
        const metadata = {
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
                label: 'Some heading 1',
                fields: ['file.decompressFiles', 'someField'],
              },
              {
                label: 'Some heading 2',
                fields: ['custom.Field', 'exportData'],
              },
            ],
          },
        };
        const fieldStates = [
          { id: 'file.decompressFiles', isValid: true, isDiscretlyInvalid: false },
          { id: 'someField', isValid: true, isDiscretlyInvalid: false },
          { id: 'custom.Field', isValid: false, isDiscretlyInvalid: true },
          { id: 'exportData', isValid: false, isDiscretlyInvalid: true },
        ];
        const { layout, fieldMap } = metadata;

        expect(
          isExpansionPanelErrored(
            { layout: layout.containers[0], fieldMap },
            fieldStates
          )
        ).toBe(false);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates
          )
        ).toBe(true);
      });

      test('should error specific expansion panel only when those field states and unfulfilled for nested containers', () => {
        const metadata = {
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
                label: 'Some heading 1',
                fields: ['file.decompressFiles', 'someField'],
              },
              {
                label: 'Some heading 2',
                fields: ['custom.Field'],
                containers: [
                  {
                    label: 'Some heading 3',
                    fields: ['exportData'],
                  },
                ],
              },
            ],
          },
        };

        const fieldStates = [
          { id: 'file.decompressFiles', isValid: true, isDiscretlyInvalid: false },
          { id: 'someField', isValid: true, isDiscretlyInvalid: false },
          { id: 'custom.Field', isValid: false, isDiscretlyInvalid: true },
          { id: 'exportData', isValid: false, isDiscretlyInvalid: true },
        ];
        const { layout, fieldMap } = metadata;

        expect(
          isExpansionPanelErrored(
            { layout: layout.containers[0], fieldMap },
            fieldStates
          )
        ).toBe(false);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates
          )
        ).toBe(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1].containers[0], fieldMap },
            fieldStates
          )
        ).toBe(true);
      });
    });
    describe('default isExpansionPanelErrored should consider only field isValid', () => {
      test('should error specific expansion panel only when those field states and unfulfilled', () => {
        const metadata = {
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
                label: 'Some heading 1',
                fields: ['file.decompressFiles', 'someField'],
              },
              {
                label: 'Some heading 2',
                fields: ['custom.Field'],
                containers: [
                  {
                    label: 'Some heading 3',
                    fields: ['exportData'],
                  },
                ],
              },
            ],
          },
        };
        const fieldStates = [
          { id: 'file.decompressFiles', isValid: true, isDiscretlyInvalid: false },
          // field state to stimulate required field ....it is discretely invalid initially.
          { id: 'someField', isValid: false, isDiscretlyInvalid: true },
          { id: 'custom.Field', isValid: false, isDiscretlyInvalid: true },
          // field state to stimulate required field..meeting required condition.
          { id: 'exportData', isValid: true, isDiscretlyInvalid: false },
        ];
        const { layout, fieldMap } = metadata;

        expect(
          isExpansionPanelErrored(
            { layout: layout.containers[0], fieldMap },
            fieldStates,
            true
          ),

        ).toBe(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates,
            true
          ),
        ).toBe(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1].containers[0], fieldMap },
            fieldStates,
            true
          ),
        ).toBe(false);
      });
    });
  });
  describe('getAllFormValuesAssociatedToMeta', () => {
    test('should only gather values of form associated to its metadata', () => {
      const metadata = {
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
              fields: ['file.decompressFiles', 'someField'],
              containers: [
                {
                  fields: ['custom.Field', 'exportData'],
                },
              ],
            },
          ],
        },
      };
      const values = {
        '/custom/Field': 'a',
        '/someField': 'b',
        '/file/decompressFiles': 'c',
        '/exportData': 'd',
        '/fieldA': 'somethingA',
        '/fieldB': 'somethingB',
        '/fieldC': 'somethingC',
      };
      const resultantValues = getAllFormValuesAssociatedToMeta(
        values,
        metadata
      );

      expect(resultantValues).toEqual({
        '/custom/Field': 'a',
        '/someField': 'b',
        '/file/decompressFiles': 'c',
        '/exportData': 'd',
      });
    });
  });
  test('should return empty object if there is no metadata associated with it', () => {
    const values = {
      '/custom/Field': 'a',
      '/someField': 'b',
      '/file/decompressFiles': 'c',
      '/exportData': 'd',
      '/fieldA': 'somethingA',
      '/fieldB': 'somethingB',
      '/fieldC': 'somethingC',
    };
    const resultantValues = getAllFormValuesAssociatedToMeta(
      values
    );

    expect(resultantValues).toEqual({});
  });
});

describe('integrationSettingsToDynaFormMetadata', () => {
  describe('translateDependencyProps', () => {
    describe('should translateDependencyProps for elements of type checkbox', () => {
      test('should append visible props correctly for fields having no visibleWhen definitions', () => {
        const inputFieldMap = {
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'checkbox',
            dependencies: {
              enabled: {
                fields: [
                  {
                    name: 'fieldB',
                    hidden: false,
                  },
                  {
                    name: 'fieldC',
                    hidden: false,
                  },
                ],
              },
            },
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        };
        const resultFieldMap = translateDependencyProps(inputFieldMap);

        expect(resultFieldMap).toEqual({
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'checkbox',
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: [true],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: [true],
              },
            ],
          },
        });
      });

      test('should correctly push visible props correctly for fields having existing visibleWhen definitions', () => {
        const inputFieldMap = {
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'checkbox',
            dependencies: {
              enabled: {
                fields: [
                  {
                    name: 'fieldB',
                    hidden: false,
                  },
                ],
              },
            },
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldC',
                is: [true],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        };
        const resultFieldMap = translateDependencyProps(inputFieldMap);

        expect(resultFieldMap).toEqual({
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'checkbox',
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldC',
                is: [true],
              },
              {
                field: 'fieldA',
                is: [true],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        });
      });
    });
    describe('should translateDependencyProps for elements of non checkbox types (could be select)', () => {
      test('should append visible props correctly for fields having no visibleWhen definitions', () => {
        const inputFieldMap = {
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
            dependencies: {
              someValue: {
                fields: [
                  {
                    name: 'fieldB',
                    hidden: false,
                  },
                  {
                    name: 'fieldC',
                    hidden: false,
                  },
                ],
              },
            },
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        };
        const resultFieldMap = translateDependencyProps(inputFieldMap);

        expect(resultFieldMap).toEqual({
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: ['someValue'],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: ['someValue'],
              },
            ],
          },
        });
      });

      test('should correctly push visible props correctly for fields having existing visibleWhen definitions', () => {
        const inputFieldMap = {
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
            dependencies: {
              someValue: {
                fields: [
                  {
                    name: 'fieldB',
                    hidden: false,
                  },
                ],
              },
            },
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldC',
                is: [true],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        };
        const resultFieldMap = translateDependencyProps(inputFieldMap);

        expect(resultFieldMap).toEqual({
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldC',
                is: [true],
              },
              {
                field: 'fieldA',
                is: ['someValue'],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        });
      });
      test('should append visible props correctly for fields having an existing matching field prop', () => {
        const inputFieldMap = {
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
            dependencies: {
              someValue: {
                fields: [
                  {
                    name: 'fieldB',
                    hidden: false,
                  },
                  {
                    name: 'fieldC',
                    hidden: false,
                  },
                ],
              },
            },
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: ['someOtherValue'],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
          },
        };
        const resultFieldMap = translateDependencyProps(inputFieldMap);

        expect(resultFieldMap).toEqual({
          fieldA: {
            id: 'fieldA',
            name: '/fieldA',
            type: 'select',
          },
          fieldB: {
            id: 'fieldB',
            name: '/fieldB',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: ['someOtherValue', 'someValue'],
              },
            ],
          },
          fieldC: {
            id: 'fieldC',
            name: '/fieldC',
            type: 'checkbox',
            visibleWhenAll: [
              {
                field: 'fieldA',
                is: ['someValue'],
              },
            ],
          },
        });
      });
      test('should be able to delete visible prop when fields having both visible and visible when all props', () => {
        const inputFieldMap = {
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          visible: false,
          visibleWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        };
        const resultFieldMap = adjustingFieldRules(inputFieldMap);

        expect(resultFieldMap).toEqual({
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          visibleWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        });
      });
      test('should be able to delete prop when having both required and requiredWhenAll props', () => {
        const inputFieldMap = {
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          required: true,
          requiredWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        };
        const resultFieldMap = adjustingFieldRules(inputFieldMap);

        expect(resultFieldMap).toEqual({
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          requiredWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        });
      });
      test('should be able to delete defaultDisabled prop when fields having both disabledWhenAll and defaultDisabled props', () => {
        const inputFieldMap = {
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          defaultDisabled: false,
          disabledWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        };
        const resultFieldMap = adjustingFieldRules(inputFieldMap);

        expect(resultFieldMap).toEqual({
          id: 'fieldA',
          name: '/fieldA',
          type: 'select',
          disabledWhenAll: [
            {
              field: 'type',
              is: ['field'],
            },
          ],
        });
      });
    });
  });
  describe('getFieldWithReferenceById', () => {
    test('should return null if metadata is null', () => {
      const res = getFieldWithReferenceById({meta: null});

      expect(res).toBeNull();
    });
    test('should get field with reference by id', () => {
      const testMeta = {
        fieldMap: {
          exportData: {
            fieldId: 'exportData',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          fields: ['exportData'],
        },
      };
      const res = getFieldWithReferenceById({meta: testMeta, id: 'exportData'});

      expect(res).toEqual({field: {fieldId: 'exportData', visibleWhenAll: [{field: 'fieldA', is: ['someValue']}]}, fieldReference: 'exportData'});
    });
  });
  describe('fieldIDsExceptClockedFields', () => {
    test('should return null if metadata is null', () => {
      const res = fieldIDsExceptClockedFields();

      expect(res).toBeNull();
    });
    test('should return null if fieldMap inside meta data is null', () => {
      const res = fieldIDsExceptClockedFields({fieldMap: null});

      expect(res).toBeNull();
    });
    test('should return all field ids except clocked fields for given resource type', () => {
      const testMeta = {
        fieldMap: {
          exportData: {
            fieldId: 'export1',
            id: 'export1',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
          pageSize: {
            fieldId: 'pageSize',
            id: 'pageSize',
            visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
          },
        },
        layout: {
          fields: ['export1', 'pageSize'],
        },
      };
      const res = fieldIDsExceptClockedFields(testMeta, 'exports');

      expect(res).toEqual(['export1']);
    });
  });
  describe('isFormTouched', () => {
    test('should return undefined when fields is null', () => {
      const res = isFormTouched();

      expect(res).toBeUndefined();
    });
    test('should return false if there are no fields at all', () => {
      const fields = [];
      const res = isFormTouched(fields);

      expect(res).toBe(false);
    });
    test('should return false if fields do not have any touched field', () => {
      const fields = [{
        fieldId: 'exportData',
        visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
      }];
      const res = isFormTouched(fields);

      expect(res).toBe(false);
    });
    test('should return true if any one of the field has a prop touched set to true', () => {
      const fields = [{
        fieldId: 'exportData',
        touched: true,
        visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
      }];
      const res = isFormTouched(fields);

      expect(res).toBe(true);
    });
  });

  describe('getFieldConfig', () => {
    const testCases = [
      [{type: 'text', value: null}, {}, {}, false],
      [{type: 'refreshabletext', supportsRefresh: true, value: null}, {supportsRefresh: true}, {}, false],
      [{type: 'text', value: null}, {type: 'input'}, {}, false],
      [{type: 'iaexpression', flowId: '1234', value: null}, {type: 'expression'}, {_id: '1234'}, false],
      [{type: 'radiogroup', value: null}, {type: 'radio'}, {}, false],
      [{type: 'uploadfile', isIAField: true, value: null}, {type: 'file'}, {}, false],
      [{type: 'matchingcriteria', value: null}, {type: 'matchingCriteria'}, {}, false],
      [{type: 'integrationapprefreshableselect', supportsRefresh: true, value: null}, {type: 'select', supportsRefresh: true}, {}, false],
      [{type: 'integrationapprefreshableselect', supportsRefresh: true, multiselect: true, value: []}, {type: 'multiselect', supportsRefresh: true}, {}, false],
      [{type: 'iaselect', multiselect: false, value: null}, {type: 'select'}, {}, false],
      [{type: 'iaselect', multiselect: true, value: []}, {type: 'multiselect'}, {}, false],
      [{type: 'suitescriptsettings', supportsRefresh: true, value: null}, {type: 'select', supportsRefresh: true}, {}, true],
      [{type: 'suitescriptsettings', multiselect: true, supportsRefresh: true, value: []}, {type: 'multiselect', supportsRefresh: true}, {}, true],
      [{type: 'iaselect', multiselect: false, value: null}, {type: 'select'}, {}, true],
      [{type: 'iaselect', multiselect: true, value: []}, {type: 'multiselect'}, {}, true],
      [{type: 'salesforcereferencedfieldsia', resource: {}, value: null}, {type: 'referencedFieldsDialog'}, {}, false],
      [{type: 'salesforcerelatedlistia', resource: {}, value: null}, {type: 'relatedListsDialog'}, {}, true],
      [{type: 'suitescripttable', value: null}, {type: 'link'}, {}, true],
      [{type: 'staticMap', value: null}, {type: 'staticMapWidget'}, {}, true],
      [{type: 'textarea', multiline: true, rowsMax: 10, value: null}, {type: 'textarea'}, {}, true],
      [{type: 'featurecheck', featureName: 'cbox', value: null, featureCheckConfig: {featureName: 'cbox'}}, {type: 'checkbox', featureCheckConfig: {featureName: 'cbox'}}, {}, true],
      [{type: 'staticMap', defaultDisabled: true, disabled: true, value: null}, {type: 'staticMapWidget', disabled: true}, {}, true],
      [{type: 'staticMap', visible: false, hidden: true, value: null}, {type: 'staticMapWidget', hidden: true}, {}, true],
      [{type: 'iaselect', multiselect: true, value: []}, {type: 'multiselect'}, {}, false],
      [{type: 'staticMap', defaultDisabled: true, disabled: true, value: null}, {type: 'staticMapWidget', disabled: true}, {}, true],
    ];

    each(testCases).test(
      'should return %o when field = %o, resource = %s and isSuiteScript = %s',
      (expected, field, resource, isSuiteScript) => {
        expect(getFieldConfig(field, resource, isSuiteScript)).toEqual(expected);
      }
    );
  });
  describe('refGeneration', () => {
    const testCases = [
      ['1234', {fieldId: '1234'}],
      ['abc', {id: 'abc'}],
      ['456', {formId: '456'}],
    ];

    each(testCases).test(
      'should return %o when field = %o',
      (expected, field) => {
        expect(refGeneration(field)).toEqual(expected);
      }
    );
  });
  describe('convertFieldsToFieldReferenceObj', () => {
    const testCases = [
      [{a: {}, 1234: {fieldId: '1234'}}, {a: {}}, {fieldId: '1234'}],
      [{b: {}, abc: {id: 'abc'}}, {b: {}}, {id: 'abc'}],
      [{c: {}, 456: {formId: '456'}}, {c: {}}, {formId: '456'}],
    ];

    each(testCases).test(
      'should return %o when acc = %o and curr = %o',
      (expected, acc, curr) => {
        expect(convertFieldsToFieldReferenceObj(acc, curr)).toEqual(expected);
      }
    );
  });
  describe('integrationSettingsToDynaFormMetadata', () => {
    test('should return null if metadata is null', () => {
      const res = integrationSettingsToDynaFormMetadata();

      expect(res).toBeNull();
    });
    test('should return null if metadata is empty object', () => {
      const res = integrationSettingsToDynaFormMetadata({});

      expect(res).toBeNull();
    });
    test('should get dyna form data from integration settings  for given metadata with fields', () => {
      const meta = {fields: [{value: 'itemid', type: 'select', name: 'general_stat'}, { name: 'abc', required: false, value: '', type: 'date'}], sections: ''};
      const res = integrationSettingsToDynaFormMetadata(meta, '1234', false);
      const expected = {actions: [{id: 'saveintegrationsettings'}], fieldMap: {abc: {_integrationId: '1234', id: 'abc', name: '/abc', options: [{items: []}], required: false, type: 'date', value: ''}, general_stat: {_integrationId: '1234', multiselect: false, id: 'general_stat', name: '/general_stat', options: [{items: []}], type: 'iaselect', value: 'itemid'}}, layout: {containers: [{containers: [{fields: ['general_stat']}, {fields: ['abc']}], label: 'Advanced'}], type: 'collapse'}};

      expect(res).toEqual(expected);
    });
    test('should get dynaformdata from integration settings  for given metadata with sections', () => {
      const meta = { sections: [{title: 'Oppurtuniry', fields: [{ value: 'itemid', type: 'select', name: 'general_state_invokeSKUFieldsAction_listNSItemMetadat'}, { name: 'abc', required: false, value: '', type: 'date'}]}]};
      const res = integrationSettingsToDynaFormMetadata(meta, '1234', false, {isSuiteScriptIntegrator: true});
      const expected = {actions: [], fieldMap: {abc: {_integrationId: '1234', id: 'abc', name: '/abc', options: [{items: []}], required: false, type: 'date', value: ''}, general_state_invokeSKUFieldsAction_listNSItemMetadat: {_integrationId: '1234', id: 'general_state_invokeSKUFieldsAction_listNSItemMetadat', multiselect: false, name: '/general_state_invokeSKUFieldsAction_listNSItemMetadat', options: [{items: []}], type: 'iaselect', value: 'itemid'}}, layout: {containers: [{containers: [{collapsed: true, containers: [{fields: ['general_state_invokeSKUFieldsAction_listNSItemMetadat']}, {fields: ['abc']}], label: 'Oppurtuniry'}], label: 'Advanced', type: 'suitScriptTabIA'}], type: 'collapse'}};

      expect(res).toEqual(expected);
    });
  });
});
