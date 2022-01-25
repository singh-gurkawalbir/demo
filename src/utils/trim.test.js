/* global describe, test, expect */
import trimObj from './trim';

describe('trim util test cases', () => {
  test('should return undefined/null if invalid or empty args are supplied', () => {
    expect(trimObj()).toBeUndefined();
    expect(trimObj(null)).toEqual(null);
  });
  test('should not trim the values if input object has specific keys', () => {
    const obj = {
      columnDelimiter: '|',
      rowDelimiter: ' ',
      '/rest/authScheme': {new: '  custom   '},
    };

    const output = {
      columnDelimiter: '|',
      rowDelimiter: ' ',
      '/rest/authScheme': {new: 'custom'},
    };

    expect(trimObj(obj)).toEqual(output);
  });
  test('should trim the values if input object has other keys', () => {
    const obj = {
      '/name': '   test name   ',
      '/dummyField': {new: '  test  '},
    };
    const output = {
      '/name': 'test name',
      '/dummyField': {new: 'test'},
    };

    expect(trimObj(obj)).toEqual(output);
  });
});
