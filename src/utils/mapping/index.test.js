/* global describe,  expect */
import each from 'jest-each';
import util from '.';

describe('isEqual', () => {
  const testCases = [
    [true, {}, {}],
    [false, {}, null],
    [false, { a: 'b', c: 'd', e: 'f' }, { a: 'b', c: 'd' }],
    [false, { a: 'x', c: 'd', e: 'f' }, { a: 'b', c: 'd' }],
    [false, { arr: [1, 2, 3, 4] }, { arr: [2, 3, 4, 1] }],
    [true, { arr: [1, 2, 3, 4] }, { arr: [1, 2, 3, 4] }],
    [
      true,
      { extract: undefined, hardCodedValue: 'test', generate: 'test_generate' },
      { hardCodedValue: 'test', generate: 'test_generate' },
    ],
    [
      true,
      {
        basicMappings: {
          recordMappings: [
            {
              children: [
                {
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
              fieldMappings: [
                {
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
            },
          ],
        },
        variationMappings: {
          recordMappings: [],
        },
      },
      {
        basicMappings: {
          recordMappings: [
            {
              children: [
                {
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
              fieldMappings: [
                {
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
            },
          ],
        },
        variationMappings: {
          recordMappings: [],
        },
      },
    ],
    [
      true,
      { key: 'value', arr: [1, 2, 3, 4] },
      { key: 'value', arr: [1, 2, 3, 4] },
    ],
    [
      false,
      { key: 'other', arr: [1, 2, 3, 4] },
      { key: 'value', arr: [1, 2, 3, 4] },
    ],
    [
      true,
      { name: 'John', age: 30, car: null },
      { name: 'John', age: 30, car: null },
    ],
    [
      true,
      { age: 30, car: null, name: 'John' },
      { name: 'John', age: 30, car: null },
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
        cars: [
          {
            car1: 'Ford',
            car2: 'BMW',
            car3: 'Fiat',
          },
        ],
      },
      {
        name: 'John',
        age: 30,
        cars: [
          {
            car1: 'Ford',
            car2: 'BMW',
            car3: 'Fiat',
          },
        ],
      },
    ],
    [
      true,
      {
        name: 'John',
        age: 30,
        cars: [
          {
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
        cars: [
          {
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
        cars: [
          {
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
        cars: [
          {
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
