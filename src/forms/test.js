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
    test('generate field path for meta having just fields in the root ', () => {
      const testMeta = {
        layout: {
          fields: [
            {
              fieldId: 'exportData',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual('/customForm/form/layout/fields/1');
    });
    test('generate field path for meta having fields in containers ', () => {
      const testMeta = {
        layout: {
          containers: [
            {
              type: 'tab||col||collapse',
              fieldSets: [
                {
                  label: 'optional some label or tab name',
                  fields: [
                    {
                      fieldId: 'exportData',
                      visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
                    },
                  ],
                },
                // either or containers or fields
              ],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual(
        '/customForm/form/layout/containers/0/fieldSets/0/fields/1'
      );
    });

    test('generate field path for meta having just fields in the root ', () => {
      const testMeta = {
        layout: {
          fields: [
            {
              fieldId: 'exportData',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual('/customForm/form/layout/fields/1');
    });
    test('generate field path for meta having fields in containers and in the root', () => {
      const testMeta = {
        layout: {
          fields: [
            {
              fieldId: 'someField',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
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
                      fieldId: 'exportData',
                      visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
                    },
                  ],
                },
                // either or containers or fields
              ],
            },
          ],
        },
      };
      const res = getPatchPathForCustomForms(testMeta, 'exportData', 1);

      expect(res).toEqual(
        '/customForm/form/layout/containers/0/fieldSets/0/fields/1'
      );
    });
  });

  describe('search field by id through the layout ', () => {
    test('should correctly search for a field in a layout where fields are there in the root as well as in the containers', () => {
      const testMeta = {
        layout: {
          fields: [
            {
              fieldId: 'someField',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
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
                      fieldId: 'exportData',
                      visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
                    },
                  ],
                },
                // either or containers or fields
              ],
            },
          ],
        },
      };
      const foundField = getFieldById({ meta: testMeta, id: 'someField' });

      expect(foundField).toEqual({
        fieldId: 'someField',
        visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
      });
    });
  });

  describe('search field by name through the layout ', () => {
    test('should correctly search for a field in a layout where fields are there in the root as well as in the containers', () => {
      const testMeta = {
        layout: {
          fields: [
            {
              fieldId: 'someField',
              name: '/someField',
              visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
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
                      fieldId: 'exportData',
                      name: '/exportData',
                      visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
                    },
                  ],
                },
              ],
            },
          ],
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
    test('should pick up references for a single field correctly', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
        },
        layout: {
          fields: ['exportData'],
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
          ],
        },
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.layout).toEqual({
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
        containers: [
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
              },
            ],
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
            containers: [
              {
                type: 'tab||col||collapse',
                fieldSets: [
                  {
                    label: 'optional some label or tab name',
                    fields: ['common'],
                  },
                  // either or containers or fields
                ],
              },
            ],
          },
        };
        const val = formFactory.getFieldsWithDefaults(
          testMeta,
          resourceType,
          resource
        );

        expect(val.layout).toEqual({
          containers: [
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
                      someProp: 'foo',
                      resourceType: 'someResourceType',
                      visibleWhenAll: [
                        { field: 'fieldA', is: ['someValue'] },
                        { field: 'someOtherField', is: ['foo'] },
                      ],
                    },
                  ],
                },
                // either or containers or fields
              ],
            },
          ],
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
            containers: [
              {
                type: 'tab||col||collapse',
                fieldSets: [
                  {
                    label: 'optional some label or tab name',
                    fields: ['bunchOfFieldsWithoutFieldReferences'],
                  },
                  // either or containers or fields
                ],
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

      test('should throw an error when the layout fields do not exist for the subform', () => {
        const resourceType = 'someResourceType';
        const resource = {};
        // metadata with a form visibility rule
        const testMeta = {
          fieldReferences: {
            bunchOfFieldsWithoutLayoutFields: {
              formId: 'bunchOfFieldsWithoutLayoutFields',
              visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
            },
          },
          layout: {
            containers: [
              {
                type: 'tab||col||collapse',
                fieldSets: [
                  {
                    label: 'optional some label or tab name',
                    fields: ['bunchOfFieldsWithoutLayoutFields'],
                  },
                  // either or containers or fields
                ],
              },
            ],
          },
        };

        try {
          formFactory.getFieldsWithDefaults(testMeta, resourceType, resource);
          fail();
        } catch (e) {
          expect(e.message).toEqual(
            'could not find fields for given form id bunchOfFieldsWithoutLayoutFields'
          );
        }
      });
    });

    test('should pick up references for fields within other containers and setDefaults correctly', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
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
        },
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.layout).toEqual({
        containers: [
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
                      },
                    ],
                  },
                ],
              },
              // either or containers or fields
            ],
          },
        ],
      });
    });

    test('should pick up references for fields and setDefaults for a collection of containers', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },

        layout: {
          fields: ['exportData'],
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
        },
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.layout).toEqual({
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
                    fieldId: 'exportData',
                    helpKey: 'someResourceType.exportData',
                    id: 'exportData',
                    name: '/exportData',
                    resourceId: undefined,
                    someProp: 'blah',
                    resourceType: 'someResourceType',
                  },
                ],
              },
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
              },
            ],
          },
        ],
      });
    });

    test('should pick up references for fields and setDefaults for allFieldSets', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
          'file.decompressFiles': { fieldId: 'file.decompressFiles' },
        },
        layout: {
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
        },
      };
      const val = formFactory.getFieldsWithDefaults(
        testMeta,
        resourceType,
        resource
      );

      expect(val.layout).toEqual({
        containers: [
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
              },
            ],
          },
        ],
      });
    });

    test('should throw an error when corresponding field reference does not exist', () => {
      const resourceType = 'someResourceType';
      const resource = {};
      const testMeta = {
        fieldReferences: {
          exportData: { fieldId: 'exportData', someProp: 'blah' },
        },
        layout: {
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
        },
      };

      try {
        formFactory.getFieldsWithDefaults(testMeta, resourceType, resource);

        fail('it should have thrown a field references not found exception');
      } catch (e) {
        expect(e.message).toEqual(
          `Could not corresponding field reference for file.decompressFiles Please check fieldReferences definitions`
        );
      }
    });
  });
});

describe('getFlattenedFieldMetaWithRules ', () => {
  test('should flatten fields with just visibility rules for a form meta with formId fields', () => {
    const resourceType = 'someResourceType';
    const testMeta = {
      fieldReferences: {
        common: {
          formId: 'common',
          visibleWhenAll: [{ field: 'someOtherField', is: ['foo'] }],
        },
        exportData: { fieldId: 'exportData' },
      },
      layout: {
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['common', 'exportData'],
              },
              // either or containers or fields
            ],
          },
        ],
      },
    };
    const val = formFactory.getFlattenedFieldMetaWithRules(
      testMeta.layout,
      resourceType,
      testMeta.fieldReferences
    );

    expect(val).toEqual({
      fieldReferences: testMeta.fieldReferences,
      layout: {
        fields: undefined,
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: [
                  {
                    fieldId: 'someField',
                    visibleWhenAll: [
                      { field: 'fieldA', is: ['someValue'] },
                      { field: 'someOtherField', is: ['foo'] },
                    ],
                  },
                  {
                    fieldId: 'exportData',
                  },
                ],
              },
              // either or containers or fields
            ],
          },
        ],
      },
    });
  });

  test('should flatten fields with just visibility rules for a form meta without formId fields', () => {
    const resourceType = 'someResourceType';
    const testMeta = {
      fieldReferences: {
        exportData: {
          fieldId: 'exportData',
          visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
        },
      },
      layout: {
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
        ],
      },
    };
    const val = formFactory.getFlattenedFieldMetaWithRules(
      testMeta.layout,
      resourceType,
      testMeta.fieldReferences
    );

    expect(val).toEqual({
      fieldReferences: testMeta.fieldReferences,
      layout: {
        fields: undefined,
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: [
                  {
                    fieldId: 'exportData',
                    visibleWhenAll: [{ field: 'fieldA', is: ['someValue'] }],
                  },
                ],
              },
              // either or containers or fields
            ],
          },
        ],
      },
    });
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
      layout: {
        containers: [
          {
            type: 'tab||col||collapse',
            fieldSets: [
              {
                label: 'optional some label or tab name',
                fields: ['bunchOffieldsWithOptionsHanlders'],
              },
              // either or containers or fields
            ],
          },
        ],
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
