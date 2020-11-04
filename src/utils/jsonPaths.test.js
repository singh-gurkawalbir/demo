/* global describe, test, expect */
import getJSONPaths from './jsonPaths';

const {
  getUnionObject,
  getTransformPaths,
  pickFirstObject,
} = require('./jsonPaths');

describe('jsonPaths util function test', () => {
  describe('getUnionObject function test', () => {
    test('should not throw any exception for invalid inputs ', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      expect(getUnionObject(sampleArray)).toEqual({});
      expect(getUnionObject()).toEqual({});
      expect(getUnionObject(null)).toEqual({});
      expect(getUnionObject(1)).toEqual({});
      expect(getUnionObject([])).toEqual({});
      expect(getUnionObject([{}])).toEqual({});
      expect(getUnionObject([{}, {}])).toEqual({});
      expect(getUnionObject({})).toEqual({});
      expect(getUnionObject(() => {})).toEqual({});
      expect(getUnionObject(new Date())).toEqual({});
      expect(getUnionObject([null, undefined, 1, 'x'])).toEqual({});
      expect(getUnionObject([[]])).toEqual([]);
    });

    test('should return valid object for getUnionObject', () => {
      expect(getUnionObject([{a: 'a'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(getUnionObject([{a: 1}, {b: []}, {c: 'c'}])).toEqual({a: 1, b: [], c: 'c'});
      expect(getUnionObject([{a: 'a', b: 'bb'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(getUnionObject([{a: 'a', b: 'bb', c: '123'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(getUnionObject([{a: 'a', b: 'bb', c: '123'}, {b: 'b'}, {c: 'c', e: 'e'}])).toEqual({a: 'a', b: 'b', c: 'c', e: 'e'});
      expect(getUnionObject([[{a: 'a'}, {b: 'b'}, {c: 'c'}]])).toEqual([{a: 'a'}, {b: 'b'}, {c: 'c'}]);
    });
  });

  describe('getJSONPaths function test', () => {
    test('should not throw any exception for invalid inputs ', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      expect(getJSONPaths(sampleArray)).toEqual([
        {id: '0', type: 'string'},
        {id: '1', type: 'string'},
        {id: '2', type: 'string'},
        {id: '3', type: 'string'},
        {id: '4', type: 'string'},
        {id: '5', type: 'string'},
        {id: '6', type: 'string'},
        {id: '7', type: 'string'},
      ]);
      console.log(getJSONPaths([[]]));
      expect(getJSONPaths()).toEqual([]);
      expect(getJSONPaths(null)).toEqual([]);
      expect(getJSONPaths(1)).toEqual([]);
      expect(getJSONPaths([])).toEqual([]);
      expect(getJSONPaths([{}])).toEqual([]);
      expect(getJSONPaths([{}, {}])).toEqual([]);
      expect(getJSONPaths({})).toEqual([]);
      expect(getJSONPaths(() => {})).toEqual([]);
      expect(getJSONPaths(new Date())).toEqual([]);
      expect(getJSONPaths([null, undefined, 1, 'x'])).toEqual([
        {id: '0', type: 'string'},
        {id: '2', type: 'number'},
        {id: '3', type: 'string'},
      ]);
      expect(getJSONPaths([[]])).toEqual([{ id: '0', type: 'array' }]);
    });

    test('should return valid paths for getJSONPaths', () => {
      const inputArray = [
        {a: 'yes', b: 'no'},
        {
          parent: {
            child: {
              grandchild: 'value',
            },
          },
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            child: {
              grandchild: 'value',
              number: 1,
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            sublist: [{
              first: 'first',
              second: 'second',
              third: 'third',
            }],
            child: {
              grandchild: 'value',
              number: 1,
              sublist2: [{
                first: 'first',
                second: 'second',
                third: 'third',
              }],
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
      ];
      const outputArray = [
        [
          { id: 'a', type: 'string' },
          { id: 'b', type: 'string' },
        ],
        [
          { id: 'parent.child.grandchild', type: 'string' },
        ],
        [
          { id: 'parent.array', type: 'array' },
          { id: 'parent.boolean', type: 'boolean' },
          { id: 'parent.child.boolean', type: 'boolean' },
          { id: 'parent.child.grandchild', type: 'string' },
          { id: 'parent.child.number', type: 'number' },
          { id: 'parent.number', type: 'number' },
          { id: 'parent.sibling', type: 'string' },
          { id: 'sibling1', type: 'string' },
        ],
        [
          { id: 'parent.array', type: 'array' },
          { id: 'parent.boolean', type: 'boolean' },
          { id: 'parent.child.boolean', type: 'boolean' },
          { id: 'parent.child.grandchild', type: 'string' },
          { id: 'parent.child.number', type: 'number' },
          { id: 'parent.number', type: 'number' },
          { id: 'parent.sibling', type: 'string' },
          { id: 'sibling1', type: 'string' },
          { id: 'parent.child.sublist2[*].first', type: 'string' },
          { id: 'parent.child.sublist2[*].second', type: 'string' },
          { id: 'parent.child.sublist2[*].third', type: 'string' },
          { id: 'parent.sublist[*].first', type: 'string' },
          { id: 'parent.sublist[*].second', type: 'string' },
          { id: 'parent.sublist[*].third', type: 'string' },
        ],
      ];

      inputArray.forEach((test, testNo) => {
        expect(getJSONPaths(test)).toEqual(outputArray[testNo]);
      });
    });

    test('should return valid paths for getJSONPaths with options wrapSpecialChars', () => {
      const inputArray = [
        {a: 'yes', b: 'no'},
        {
          parent: {
            child: {
              grandchild: 'value',
            },
          },
        },
        {
          parent: {
            'child 1': {
              grandchild: 'value',
            },
          },
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            child: {
              grandchild: 'value',
              number: 1,
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
        {
          parent: {
            'sibling first': 'sibling',
            '[number]': 1,
            boolean: false,
            array: ['1'],
            child: {
              'grand&child': 'value',
              number: 1,
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            sublist: [{
              first: 'first',
              second: 'second',
              third: 'third',
            }],
            child: {
              grandchild: 'value',
              number: 1,
              sublist2: [{
                first: 'first',
                second: 'second',
                third: 'third',
              }],
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
      ];
      const outputArray = [
        [
          { id: 'a', type: 'string' },
          { id: 'b', type: 'string' },
        ],
        [
          { id: 'parent.child.grandchild', type: 'string' },
        ],
        [
          { id: 'parent.[child 1].grandchild', type: 'string' },
        ],
        [
          { id: 'parent.array', type: 'array' },
          { id: 'parent.boolean', type: 'boolean' },
          { id: 'parent.child.boolean', type: 'boolean' },
          { id: 'parent.child.grandchild', type: 'string' },
          { id: 'parent.child.number', type: 'number' },
          { id: 'parent.number', type: 'number' },
          { id: 'parent.sibling', type: 'string' },
          { id: 'sibling1', type: 'string' },
        ],
        [
          { id: 'parent.[[number\\]]', type: 'number' },
          { id: 'parent.[sibling first]', type: 'string' },
          { id: 'parent.array', type: 'array' },
          { id: 'parent.boolean', type: 'boolean' },
          { id: 'parent.child.[grand&child]', type: 'string' },
          { id: 'parent.child.boolean', type: 'boolean' },
          { id: 'parent.child.number', type: 'number' },
          { id: 'sibling1', type: 'string' },
        ],
        [
          { id: 'parent.array', type: 'array' },
          { id: 'parent.boolean', type: 'boolean' },
          { id: 'parent.child.boolean', type: 'boolean' },
          { id: 'parent.child.grandchild', type: 'string' },
          { id: 'parent.child.number', type: 'number' },
          { id: 'parent.number', type: 'number' },
          { id: 'parent.sibling', type: 'string' },
          { id: 'sibling1', type: 'string' },
          { id: 'parent.child.sublist2[*].first', type: 'string' },
          { id: 'parent.child.sublist2[*].second', type: 'string' },
          { id: 'parent.child.sublist2[*].third', type: 'string' },
          { id: 'parent.sublist[*].first', type: 'string' },
          { id: 'parent.sublist[*].second', type: 'string' },
          { id: 'parent.sublist[*].third', type: 'string' },
        ],
      ];

      inputArray.forEach((test, testNo) => {
        console.log(getJSONPaths(test, null, {wrapSpecialChars: true}));
        expect(getJSONPaths(test, null, {wrapSpecialChars: true})).toEqual(outputArray[testNo]);
      });
    });

    test('should return valid paths for getJSONPaths with options skipSort', () => {
      expect(getJSONPaths({
        a: 'a',
        b: 'b',
        c: [{d: 'yes'}],
      }, null, {skipSort: true})).toEqual([
        { id: 'a', type: 'string' },
        { id: 'b', type: 'string' },
        { id: 'c[*].d', type: 'string' },
      ]);
      expect(getJSONPaths({
        a: 'a',
        c: [{d: 'yes'}],
        b: 'b',
      }, null, {skipSort: true})).toEqual([
        { id: 'a', type: 'string' },
        { id: 'c[*].d', type: 'string' },
        { id: 'b', type: 'string' },
      ]);
    });

    test('should return valid paths for getJSONPaths with options isHandlebarExp', () => {
      expect(getJSONPaths({
        a: 'a',
        b: 'b',
        c: [{d: 'yes'}],
      }, null, {isHandlebarExp: true})).toEqual([
        { id: 'a', type: 'string' },
        { id: 'b', type: 'string' },
        { id: 'c.0.d', type: 'string' },
      ]);
      expect(getJSONPaths({
        a: 'a',
        c: [{d: 'yes'}],
        b: 'b',
      }, null, {isHandlebarExp: true, skipSort: true})).toEqual([
        { id: 'a', type: 'string' },
        { id: 'c.0.d', type: 'string' },
        { id: 'b', type: 'string' },
      ]);
    });
  });
  describe('getTransform Paths function test', () => {
    test('should not throw any exception for invalid inputs ', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      expect(getTransformPaths(sampleArray)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
      expect(getTransformPaths()).toEqual([]);
      expect(getTransformPaths(null)).toEqual([]);
      expect(getTransformPaths(1)).toEqual([]);
      expect(getTransformPaths([])).toEqual([]);
      expect(getTransformPaths([{}])).toEqual([]);
      expect(getTransformPaths([{}, {}])).toEqual([]);
      expect(getTransformPaths({})).toEqual([]);
      expect(getTransformPaths(() => {})).toEqual([]);
      expect(getTransformPaths(new Date())).toEqual([]);
      expect(getTransformPaths([null, undefined, 1, 'x'])).toEqual([0, 1, 2, 3]);
      expect(getTransformPaths([[]])).toEqual([0]);
    });

    test('should return valid transform paths for getTransformPaths', () => {
      const inputArray = [
        {a: 'yes', b: 'no'},
        {
          parent: {
            child: {
              grandchild: 'value',
            },
          },
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            child: {
              grandchild: 'value',
              number: 1,
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
        {
          parent: {
            sibling: 'sibling',
            number: 1,
            boolean: false,
            array: ['1'],
            sublist: [{
              first: 'first',
              second: 'second',
              third: 'third',
            }],
            child: {
              grandchild: 'value',
              number: 1,
              sublist2: [{
                first: 'first',
                second: 'second',
                third: 'third',
              }],
              boolean: false,
            },
          },
          sibling1: 'sibling1',
        },
      ];
      const outputArray = [
        [
          'a', 'b',
        ],
        [
          'parent.child.grandchild',
        ],
        [
          'parent.array',
          'parent.boolean',
          'parent.child.boolean',
          'parent.child.grandchild',
          'parent.child.number',
          'parent.number',
          'parent.sibling',
          'sibling1',
        ],
        [
          'parent.array',
          'parent.boolean',
          'parent.child.boolean',
          'parent.child.grandchild',
          'parent.child.number',
          'parent.child.sublist2[0].first',
          'parent.child.sublist2[0].second',
          'parent.child.sublist2[0].third',
          'parent.number',
          'parent.sibling',
          'parent.sublist[0].first',
          'parent.sublist[0].second',
          'parent.sublist[0].third',
          'sibling1',
        ],
      ];

      inputArray.forEach((test, testNo) => {
        console.log('testNo', testNo, getTransformPaths(test));
        expect(getTransformPaths(test)).toEqual(outputArray[testNo]);
      });
    });
  });

  describe('pickFirstObject function test', () => {
    test('should not throw any exception for invalid inputs ', () => {
      const sampleArray = ['Canada', 'USA', 'India', 'China', 'Australia', 'Swden', 'Sri Lanka', 'Germany'];

      expect(pickFirstObject(sampleArray)).toEqual({});
      expect(pickFirstObject()).toEqual();
      expect(pickFirstObject(null)).toEqual();
      expect(pickFirstObject(1)).toEqual();
      expect(pickFirstObject([])).toEqual({});
      expect(pickFirstObject([{}])).toEqual({});
      expect(pickFirstObject([{}, {}])).toEqual({});
      expect(pickFirstObject({})).toEqual({});
      expect(pickFirstObject(() => {})).toEqual();
      expect(pickFirstObject(new Date())).toEqual();
      expect(pickFirstObject([null, undefined, 1, 'x'])).toEqual({});
      expect(([[]])).toEqual([[]]);
    });

    test('should return valid object for getUnionObject', () => {
      console.log(pickFirstObject([[{a: 'a'}, {b: 'b'}, {c: 'c'}]]));
      expect(pickFirstObject([{a: 'a'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(pickFirstObject([{a: 1}, {b: []}, {c: 'c'}])).toEqual({a: 1, b: [], c: 'c'});
      expect(pickFirstObject([{a: 'a', b: 'bb'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(pickFirstObject([{a: 'a', b: 'bb', c: '123'}, {b: 'b'}, {c: 'c'}])).toEqual({a: 'a', b: 'b', c: 'c'});
      expect(pickFirstObject([{a: 'a', b: 'bb', c: '123'}, {b: 'b'}, {c: 'c', e: 'e'}])).toEqual({a: 'a', b: 'b', c: 'c', e: 'e'});
      expect(pickFirstObject([[{a: 'a'}, {b: 'b'}, {c: 'c'}]])).toEqual({a: 'a', b: 'b', c: 'c'});
    });
  });
});
