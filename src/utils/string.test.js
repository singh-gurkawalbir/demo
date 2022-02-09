/* global describe, test, expect */
import { getTextAfterCount } from './string';

describe('getTextAfterCount util test cases', () => {
  test('should return correct string when count is zero', () => {
    expect(getTextAfterCount('value', 0)).toEqual('0 values');
  });
  test('should return correct string when count is 1', () => {
    expect(getTextAfterCount('value', 1)).toEqual('1 value');
  });
  test('should return correct string when count is greater than 1', () => {
    expect(getTextAfterCount('value', 2)).toEqual('2 values');
    expect(getTextAfterCount('value', 3)).toEqual('3 values');
    expect(getTextAfterCount('value', 4)).toEqual('4 values');
    expect(getTextAfterCount('error')).toEqual('0 errors');
  });
});
