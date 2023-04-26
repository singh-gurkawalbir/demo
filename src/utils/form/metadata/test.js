
import { deepClone } from 'fast-json-patch/lib/core';
import {
  getFieldIdsInLayoutOrder,
  layoutHasField,
  pushField,
  removeFieldFromLayout,
  fetchMetadataFieldList,
  mergeMetadata,
} from '.';

describe('getFieldIdsInLayoutOrder', () => {
  test('should return empty list incase of invalid layout', () => {
    expect(getFieldIdsInLayoutOrder()).toEqual([]);
    expect(getFieldIdsInLayoutOrder({})).toEqual([]);
    expect(getFieldIdsInLayoutOrder({ fields: [], containers: []})).toEqual([]);
  });
  test('should return fieldIds in order for the passed layout', () => {
    const layout = {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 1',
          fields: [
            'a', 'b', 'c', 'd',
          ],
        },
        {
          collapsed: true,
          label: 'label 2',
          fields: [
            'e', 'f', 'g',
          ],
        },
      ],
    };
    const expectedOrderedFieldIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    expect(getFieldIdsInLayoutOrder(layout)).toEqual(expectedOrderedFieldIds);
  });
  test('should return fieldIds in proper visible order if the layout has nested containers', () => {
    const layout = {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 1',
          fields: [
            'a', 'b', 'c', 'd',
          ],
        },
        {
          collapsed: true,
          label: 'label 2',
          fields: [
            'e', 'f', 'g',
          ],
        },
        {
          collapsed: true,
          label: 'label 3',
          fields: [
            'h', 'i', 'j',
          ],
        },
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: ['k'],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [
                    'l',
                  ],
                },
              ],
            },
            {
              fields: ['m', 'n', 'o'],
            },
          ],
        },
      ],
    };
    const expectedOrderedFieldIds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'];

    expect(getFieldIdsInLayoutOrder(layout)).toEqual(expectedOrderedFieldIds);
  });
});

describe('layoutHasField', () => {
  const layout = {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'label 1',
        fields: [
          'a', 'b', 'c', 'd',
        ],
      },
    ],
  };

  test('should return false in case of invalid layout or empty fieldId', () => {
    expect(layoutHasField()).toBeFalsy();
    expect(layoutHasField({}, 'a')).toBeFalsy();
    expect(layoutHasField(layout)).toBeFalsy();
  });
  test('should return false if the fieldId is not present', () => {
    expect(layoutHasField(layout, 'z')).toBeFalsy();
  });
  test('should return true if the fieldId is present in simple layout', () => {
    expect(layoutHasField(layout, 'a')).toBeTruthy();
    expect(layoutHasField(layout, 'd')).toBeTruthy();
  });
  test('should return true if the fieldId is present in nested layout', () => {
    const layout = {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 1',
          fields: [
            'a', 'b', 'c', 'd',
          ],
        },
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: ['k'],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [
                    'l',
                  ],
                },
              ],
            },
            {
              fields: ['m', 'n', 'o'],
            },
          ],
        },
      ],
    };

    expect(layoutHasField(layout, 'k')).toBeTruthy();
    expect(layoutHasField(layout, 'l')).toBeTruthy();
    expect(layoutHasField(layout, 'o')).toBeTruthy();
    expect(layoutHasField(layout, 'z')).toBeFalsy();
  });
});
describe('pushField', () => {
  const layout = {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'label 1',
        fields: [
          'a', 'b', 'c', 'd',
        ],
      },
    ],
  };

  test('should do nothing in case of invalid layout or empty refId or fieldId', () => {
    expect(pushField()).toBeUndefined();
    const l1 = deepClone(layout);
    const l2 = deepClone(layout);

    pushField(l1);
    pushField(l2, 'a');
    expect(l1).toEqual(layout);
    expect(l2).toEqual(layout);
  });
  test('should do nothing if the passed refId is not part of the layout', () => {
    const l1 = deepClone(layout);

    pushField(l1, 'z');
    expect(l1).toEqual(layout);
  });
  test('should push the passed fieldId beside refId in a simple layout', () => {
    const l1 = deepClone(layout);

    pushField(l1, 'a', 'newFieldId');
    expect(l1).toEqual({
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 1',
          fields: [
            'a', 'newFieldId', 'b', 'c', 'd',
          ],
        },
      ],
    });
  });
  test('should push the passed fieldId beside refId in a nested layout', () => {
    const layout = {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: ['k'],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [
                    'l',
                  ],
                },
              ],
            },
            {
              fields: ['m', 'n', 'o'],
            },
          ],
        },
      ],
    };
    const l1 = deepClone(layout);

    pushField(l1, 'l', 'newField1');
    pushField(l1, 'o', 'newField2');
    expect(l1).toEqual({
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: ['k'],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [
                    'l', 'newField1',
                  ],
                },
              ],
            },
            {
              fields: ['m', 'n', 'o', 'newField2'],
            },
          ],
        },
      ],
    });
  });
});
describe('removeFieldFromLayout', () => {
  const layout = {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'label 1',
        fields: [
          'a', 'b', 'c', 'd',
        ],
      },
    ],
  };

  test('should do nothing in case of invalid layout or empty fieldId', () => {
    expect(removeFieldFromLayout()).toBeUndefined();
    const l1 = deepClone(layout);

    removeFieldFromLayout(l1);
    expect(l1).toEqual(layout);
  });
  test('should do nothing if the passed fieldId is not part of the layout', () => {
    const l1 = deepClone(layout);

    removeFieldFromLayout(l1, 'z');
    expect(l1).toEqual(layout);
  });
  test('should remove the passed fieldId in a simple layout', () => {
    const l1 = deepClone(layout);

    removeFieldFromLayout(l1, 'a');
    expect(l1).toEqual({
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 1',
          fields: ['b', 'c', 'd'],
        },
      ],
    });
  });
  test('should remove the passed fieldId in a nested layout', () => {
    const layout = {
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: ['k'],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [
                    'l',
                  ],
                },
              ],
            },
            {
              fields: ['m', 'n', 'o'],
            },
          ],
        },
      ],
    };
    const l1 = deepClone(layout);

    removeFieldFromLayout(l1, 'l');
    removeFieldFromLayout(l1, 'k');
    removeFieldFromLayout(l1, 'o');
    expect(l1).toEqual({
      type: 'collapse',
      containers: [
        {
          collapsed: true,
          label: 'label 4',
          containers: [
            {
              fields: [],
            },
            {
              type: 'indent',
              containers: [
                {
                  fields: [],
                },
              ],
            },
            {
              fields: ['m', 'n'],
            },
          ],
        },
      ],
    });
  });
});
describe('fetchMetadataFieldList', () => {
  test('should return empty array incase of invalid or empty fieldMap in the metadata', () => {
    expect(fetchMetadataFieldList()).toEqual([]);
    expect(fetchMetadataFieldList({})).toEqual([]);
    expect(fetchMetadataFieldList({ layout: ['a'] })).toEqual([]);
  });
  test('should return expected fieldList when the metadata has only fieldMap but not layout', () => {
    const metadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
      },
    };

    expect(fetchMetadataFieldList(metadata)).toEqual(['a', 'b', 'c']);
  });
  test('should return expected fieldList when the metadata has both fieldMap and layout', () => {
    const metadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
      },
      layout: {
        containers: [{
          fields: ['a', 'b'],
        }],
      },
    };
    const nestedMetadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
      },
      layout: {
        containers: [{
          fields: ['a', 'b'],
          containers: [{
            fields: ['c'],
          }],
        }],
      },
    };

    expect(fetchMetadataFieldList(metadata)).toEqual(['a', 'b']);
    expect(fetchMetadataFieldList(nestedMetadata)).toEqual(['a', 'b', 'c']);
  });
});
describe('mergeMetadata', () => {
  const src = {
    fieldMap: {
      a: { id: 'a', name: 'a', value: 'a' },
      b: { id: 'b', name: 'b', value: 'b' },
      c: { id: 'c', name: 'c', value: 'c' },
    },
  };
  const srcWithLayout = {
    fieldMap: {
      a: { id: 'a', name: 'a', value: 'a' },
      b: { id: 'b', name: 'b', value: 'b' },
      c: { id: 'c', name: 'c', value: 'c' },
    },
    layout: {
      containers: [{
        fields: ['a', 'b', 'c'],
      }],
    },
  };

  const toMerge = {
    fieldMap: {
      d: { id: 'd', name: 'd', value: true },
      e: { id: 'e', name: 'e', value: true },
      f: { id: 'f', name: 'f', value: true },
    },
  };
  const toMergeWithLayout = {
    fieldMap: {
      d: { id: 'd', name: 'd', value: true },
      e: { id: 'e', name: 'e', value: true },
      f: { id: 'f', name: 'f', value: true },
    },
    layout: {
      containers: [{
        fields: ['d', 'e', 'f'],
      }],
    },
  };

  test('should return undefined incase of no src or toMerge metadata', () => {
    expect(mergeMetadata()).toBeUndefined();
  });
  test('should return one of the metadata objs if the other one is empty', () => {
    expect(mergeMetadata(src)).toEqual(src);
    expect(mergeMetadata(undefined, toMerge)).toEqual(toMerge);
  });
  test('should return expected merged metadata with fields from both src and toMerge merged', () => {
    const expectedMetadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
        d: { id: 'd', name: 'd', value: true },
        e: { id: 'e', name: 'e', value: true },
        f: { id: 'f', name: 'f', value: true },
      },
    };

    expect(mergeMetadata(src, toMerge)).toEqual(expectedMetadata);
  });
  test('should over ride src metadata fields with toMerge fields if both metadata has common fields', () => {
    const toMergeWithCommonField = {
      fieldMap: {
        c: { id: 'c', name: 'c', value: 'newValue' },
        d: { id: 'd', name: 'd', value: true },
        e: { id: 'e', name: 'e', value: true },
      },
    };
    const expectedMetadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'newValue' },
        d: { id: 'd', name: 'd', value: true },
        e: { id: 'e', name: 'e', value: true },
      },
    };

    expect(mergeMetadata(src, toMergeWithCommonField)).toEqual(expectedMetadata);
  });
  test('should push the new fields into the fields list for a simple layout container', () => {
    const expectedMetadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
        d: { id: 'd', name: 'd', value: true },
        e: { id: 'e', name: 'e', value: true },
        f: { id: 'f', name: 'f', value: true },
      },
      layout: {
        containers: [{
          fields: ['a', 'b', 'c', 'd', 'e', 'f'],
        }],
      },
    };

    expect(mergeMetadata(srcWithLayout, toMergeWithLayout)).toEqual(expectedMetadata);
  });
  test('should create a new container with new fields if the src metadata has  multiple containers', () => {
    const srcWithMultipleContainers = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
      },
      layout: {
        containers: [{
          fields: ['a', 'b'],
        }, {
          type: 'tab',
          fields: ['c'],
        }],
      },
    };
    const expectedMetadata = {
      fieldMap: {
        a: { id: 'a', name: 'a', value: 'a' },
        b: { id: 'b', name: 'b', value: 'b' },
        c: { id: 'c', name: 'c', value: 'c' },
        d: { id: 'd', name: 'd', value: true },
        e: { id: 'e', name: 'e', value: true },
        f: { id: 'f', name: 'f', value: true },
      },
      layout: {
        containers: [{
          fields: ['a', 'b'],
        }, {
          type: 'tab',
          fields: ['c'],
        }, {
          fields: ['d', 'e', 'f'],
        }],
      },
    };

    expect(mergeMetadata(srcWithMultipleContainers, toMerge)).toEqual(expectedMetadata);
    expect(mergeMetadata(srcWithMultipleContainers, toMergeWithLayout)).toEqual(expectedMetadata);
  });
});

