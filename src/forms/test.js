/* global describe, test, expect, jest */

import jsonPatch from 'fast-json-patch';
import { getMissingPatchSet, sanitizePatchSet } from './utils';
import formFactory from './formFactory';

// common: { formId: 'common' },
// exportData: { fieldId: 'exportData' },
// 'file.decompressFiles': { fieldId: 'file.decompressFiles' },
// 'custom.Field': {
//   id: 'file.decompressFiles',
//   type: 'multiselect',
//   label: 'my label',
// },
// },
jest.mock('./definitions/index', () => ({
  __esModule: true,
  default: {
    someResourceType: {
      subForms: {
        common: { fields: [{ fieldId: 'someField', someProp: 'blah' }] },
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
});

describe('form factory new layout', () => {
  describe('field references filling behavior', () => {
    test('should pick up references for a single field correctly', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
        },
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['exportData'],
                containers: [],
              },
              // either or containers or fields
            ],
          },
        ],
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.containers).toEqual([
        {
          type: 'tab||col||collapse',

          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'exportData',
                  helpKey: 'someResourceType.exportData',
                  id: 'exportData',
                  name: '/exportData',
                  resourceId: undefined,
                  resourceType: 'someResourceType',
                  someProp: 'blah',
                },
              ],
              containers: [],
            },
            // either or containers or fields
          ],
        },
      ]);
    });

    test('should pick up references for a formId fields correctly', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          common: { formId: 'common' },
        },
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['common'],
                containers: [],
              },
              // either or containers or fields
            ],
          },
        ],
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.containers).toEqual([
        {
          type: 'tab||col||collapse',
          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'someField',
                  helpKey: 'someResourceType.someField',
                  id: 'someField',
                  name: '/someField',
                  resourceId: undefined,
                  someProp: 'blah',
                  resourceType: 'someResourceType',
                },
              ],
              containers: [],
            },
            // either or containers or fields
          ],
        },
      ]);
    });

    test('should pick up references for fields within other containers and setDefaults correctly', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['exportData'],
                containers: [
                  {
                    type: 'tab||col||collapse',
                    fieldSets: [
                      {
                        label: 'optional some label or tab name',
                        fields: ['file.decompressFiles'],
                        containers: [],
                      },
                      // either or containers or fields
                    ],
                  },
                ],
              },
              // either or containers or fields
            ],
          },
        ],
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.containers).toEqual([
        {
          type: 'tab||col||collapse',
          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'exportData',
                  helpKey: 'someResourceType.exportData',
                  id: 'exportData',
                  name: '/exportData',
                  resourceId: undefined,
                  someProp: 'blah',
                  resourceType: 'someResourceType',
                },
              ],
              containers: [
                {
                  type: 'tab||col||collapse',
                  fieldSets: [
                    {
                      label: 'optional some label or tab name',
                      fields: [
                        {
                          defaultValue: '',
                          fieldId: 'file.decompressFiles',
                          helpKey: 'someResourceType.file.decompressFiles',
                          id: 'file.decompressFiles',
                          name: '/file/decompressFiles',
                          resourceId: undefined,
                          resourceType: 'someResourceType',
                        },
                      ],
                      containers: [],
                    },
                  ],
                },
              ],
            },
            // either or containers or fields
          ],
        },
      ]);
    });

    test('should pick up references for fields and setDefaults for a collection of containers', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['exportData'],
              },
              // either or containers or fields
            ],
          },
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['file.decompressFiles'],
              },
              // either or containers or fields
            ],
          },
        ],
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.containers).toEqual([
        {
          type: 'tab||col||collapse',
          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'exportData',
                  helpKey: 'someResourceType.exportData',
                  id: 'exportData',
                  name: '/exportData',
                  resourceId: undefined,
                  someProp: 'blah',
                  resourceType: 'someResourceType',
                },
              ],
              containers: null,
            },
            // either or containers or fields
          ],
        },
        {
          type: 'tab||col||collapse',
          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'file.decompressFiles',
                  helpKey: 'someResourceType.file.decompressFiles',
                  id: 'file.decompressFiles',
                  name: '/file/decompressFiles',
                  resourceId: undefined,
                  resourceType: 'someResourceType',
                },
              ],
              containers: null,
            },
          ],
        },
      ]);
    });

    test('should pick up references for fields and setDefaults for allFieldSets', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['exportData'],
              },
              {
                label: 'optional some label or tab name',
                fields: ['file.decompressFiles'],
              },
              // either or containers or fields
            ],
          },
        ],
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.containers).toEqual([
        {
          type: 'tab||col||collapse',
          fieldSets: [
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'exportData',
                  helpKey: 'someResourceType.exportData',
                  id: 'exportData',
                  name: '/exportData',
                  resourceId: undefined,
                  someProp: 'blah',
                  resourceType: 'someResourceType',
                },
              ],
              containers: null,
            },
            {
              label: 'optional some label or tab name',
              fields: [
                {
                  defaultValue: '',
                  fieldId: 'file.decompressFiles',
                  helpKey: 'someResourceType.file.decompressFiles',
                  id: 'file.decompressFiles',
                  name: '/file/decompressFiles',
                  resourceId: undefined,
                  resourceType: 'someResourceType',
                },
              ],
              containers: null,
            },
          ],
        },
      ]);
    });
  });
});
