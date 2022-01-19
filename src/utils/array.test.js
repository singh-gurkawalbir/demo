/* global describe, test, expect */
import arrayUtil from './array';

describe('array utils tests', () => {
  describe('removeItem test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(arrayUtil.removeItem()).toBeUndefined();
    });
    test('should return original array if passed item is not found in the array', () => {
      const patches = [{
        op: 'replace',
        path: '/b',
        value: '2',
      }];
      const test = p => p.path === '/lastModified';

      expect(arrayUtil.removeItem(patches, test)).toBe(patches);
    });
    test('should remove the passed item from the array and return the new array', () => {
      const patches = [{
        op: 'replace',
        path: '/lastModified',
        value: 14,
      }, {
        op: 'replace',
        path: '/b',
        value: '2',
      }];
      const test = p => p.path === '/lastModified';
      const expectedOutput = [{
        op: 'replace',
        path: '/b',
        value: '2',
      }];

      expect(arrayUtil.removeItem(patches, test)).toEqual(expectedOutput);
    });
  });
  describe('getDuplicateValues test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(arrayUtil.getDuplicateValues()).toBeNull();
    });
    test('should return null if no duplicate keys found in the given array', () => {
      const rule = [
        {extract: 'id', generate: 'id'},
        {extract: 'name', generate: 'name'},
        {extract: 'age', generate: 'age'},
      ];

      expect(arrayUtil.getDuplicateValues(rule, 'generate')).toBeNull();
    });
    test('should return duplicate keys value found in the array', () => {
      const rule = [
        {extract: 'id', generate: 'id'},
        {extract: 'name', generate: 'name'},
        {extract: 'orderid', generate: 'id'},
        {extract: 'custname', generate: 'name'},
        {extract: 'department', generate: 'department'},
      ];

      expect(arrayUtil.getDuplicateValues(rule, 'generate')).toEqual(['id', 'name']);
    });
  });
  describe('isContinuousSubSet test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(arrayUtil.isContinuousSubSet(null)).toEqual(false);
      expect(arrayUtil.isContinuousSubSet()).toEqual(true);
    });
    test('should return false if src array length is less than target', () => {
      expect(arrayUtil.isContinuousSubSet(['responseMapping'], ['transform', 'raw'])).toEqual(false);
    });
    test('should return true if target is empty', () => {
      expect(arrayUtil.isContinuousSubSet(['responseMapping'])).toEqual(true);
    });
    test('should return false if src does not contain first index target value', () => {
      const src = [
        'responseMapping',
        'responseMappingExtract',
        'preSavePage',
        'raw',
      ];
      const target = ['transform', 'raw'];

      expect(arrayUtil.isContinuousSubSet(src, target)).toEqual(false);
    });
    test('should return false if arrays are not equal after removing target first value', () => {
      const src = ['inputFilter', 'flowInput'];
      const target = ['outputFilter', 'transform', 'raw'];

      expect(arrayUtil.isContinuousSubSet(src, target)).toEqual(false);
    });
    test('should return true if arrays are equal after removing target first value', () => {
      const src = [
        'responseMapping',
        'responseMappingExtract',
        'preSavePage',
        'transform',
        'raw',
      ];
      const target = ['transform', 'raw'];

      expect(arrayUtil.isContinuousSubSet(src, target)).toEqual(true);
    });
  });
  describe('areArraysEqual test cases', () => {
    test('should not throw error for invalid arguments', () => {
      expect(arrayUtil.areArraysEqual(null)).toEqual(false);
      expect(arrayUtil.areArraysEqual()).toEqual(false);
    });
    test('should return false if array lengths are different', () => {
      expect(arrayUtil.areArraysEqual([1, 2, 3], [1, 2])).toEqual(false);
    });
    test('should not ignore the order of array values if the same is passed in options', () => {
      expect(arrayUtil.areArraysEqual([1, 3, 2], [1, 2, 3])).toEqual(false);
      expect(arrayUtil.areArraysEqual([1, 2, 3], [1, 2, 3])).toEqual(true);
    });
    test('should return false if arrays are not equal with ignore order', () => {
      expect(arrayUtil.areArraysEqual([1, 3, 4], [1, 2, 3], {ignoreOrder: true})).toEqual(false);
    });
    test('should return true if arrays are equal with ignore order', () => {
      expect(arrayUtil.areArraysEqual([1, 3, 2], [1, 2, 3], {ignoreOrder: true})).toEqual(true);
    });
  });
});
