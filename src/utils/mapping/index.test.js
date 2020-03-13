/* global describe,  expect */
import each from 'jest-each';
import util from './';

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
