/* global describe, test, expect */
import {hasLongLength} from './utils';

describe('UI test cases for utils', () => {
  test('should return false when oldValue and newValue are not provided', () => {
    expect(hasLongLength()).toBe(false);
  });
  test('should return true when oldValue is of type string, newValue is of type object', () => {
    const result = hasLongLength('true',
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '634592daced7de038e18b6aa',
      },
    );

    expect(result).toBe(true);
  });
  test('should return false when oldValue is of type object, newValue is of type empty string ', () => {
    const result = hasLongLength({
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '634592daced7de038e18b6aa',
    }, '');

    expect(result).toBe(true);
  });
  test('should return false when oldValue is of type string, provided newValue as empty string', () => {
    const result = hasLongLength('2022-11-06T21:17:07.604Z', '');

    expect(result).toBe(false);
  });
  test('should return false when oldValue, newValue is of type string', () => {
    const result = hasLongLength('2022-11-06T21:17:07.604Z', '2022-11-07T20:49:58.385Z');

    expect(result).toBe(false);
  });
  test('should return false when oldValue is of type object, provided no newValue', () => {
    const result = hasLongLength({
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '634592daced7de038e18b6aa',
    });

    expect(result).toBe(true);
  });
  test('should return true when oldValue, newValue is of type object', () => {
    const result = hasLongLength({
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '634592daced7de038e18b6aa',
    }, {
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'export',
      _exportId: '634592dace645324568e18b6aa',
    });

    expect(result).toBe(true);
  });
  test('should return true when oldValue is type string and provided no newValue', () => {
    const result = hasLongLength('Click to view');

    expect(result).toBe(false);
  });
});
