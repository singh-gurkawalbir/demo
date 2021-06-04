/* global describe, test, expect */
import jsonPatch from 'fast-json-patch';
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
  });

  describe('search field by id through the fieldMap ', () => {
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

  describe('getFieldByIdFromLayout search field by name through the fieldMap ', () => {
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
    test('should find a field successfully when there is a field in layout and defined in the fieldMap as well ', () => {
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
    test('should not find a field when there is a field in layout and not defined in the fieldMap ', () => {
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

      expect(foundValue).toEqual(null);
    });

    test('should not find a field when the field does not exist in the fields and the fieldMap ', () => {
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

      expect(foundValue).toEqual(null);
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
        ).toEqual(false);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates
          )
        ).toEqual(true);
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
        ).toEqual(false);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates
          )
        ).toEqual(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1].containers[0], fieldMap },
            fieldStates
          )
        ).toEqual(true);
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

        ).toEqual(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1], fieldMap },
            fieldStates,
            true
          ),
        ).toEqual(true);

        expect(
          isExpansionPanelErrored(
            { layout: metadata.layout.containers[1].containers[0], fieldMap },
            fieldStates,
            true
          ),
        ).toEqual(false);
      });
    });
  });
  describe('getAllFormValuesAssociatedToMeta ', () => {
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
      test('should append visible props correctly for fields having an existing matching field prop ', () => {
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
});
