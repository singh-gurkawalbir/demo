/* global describe, test, expect */
import {hasLongLength} from './utils';

describe('UI test cases for utils', () => {
  let oldValue;
  let newValue;
  const dataobj = {
    responseMapping: {
      fields: [],
      lists: [],
    },
    type: 'import',
    _importId: '634592daced7de038e18b6aa',
  };

  test('should return false when oldValue and newValue are not provided', () => {
    expect(hasLongLength()).toBe(false);
  });
  test('should return true provided old value string length is less than minimum string length to show diff link, new value object length is greater than minimum stringified object length', () => {
    oldValue = 'true';
    newValue = dataobj;
    expect(oldValue.length).toBeLessThan(300);
    expect(JSON.stringify(newValue).length).toBeGreaterThan(10);
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
  test('should return false provided old value stringified object length is greater than minimum stringified object length to show diff link, new value string length is greater than minimum stringified object length', () => {
    oldValue = dataobj;
    newValue = '';
    expect(JSON.stringify(oldValue).length).toBeGreaterThan(10);
    expect(newValue.length).toBeLessThan(300);
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
  test('should return false provided old value stringified object length is less than minimum stringified object length to show diff link, new value string length is greater than minimum stringified object length', () => {
    oldValue = '2022-11-06T21:17:07.604Z';
    newValue = '';
    expect(oldValue.length).toBeLessThan(300);
    expect(newValue.length).toBeLessThan(300);
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(false);
  });
  test('should return false provided old value string length is less than minimum string length to show diff link, new value string length is greater than minimum string length', () => {
    oldValue = '2022-11-06T21:17:07.604Z';
    newValue = '2022-11-07T20:49:58.385Z';
    expect(oldValue.length).toBeLessThan(300);
    expect(newValue.length).toBeLessThan(300);
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(false);
  });
  test('should return false provided old value stringified object length is less than minimum stringified object length to show diff link, new value is not provided', () => {
    oldValue = dataobj;
    expect(JSON.stringify(oldValue).length).toBeGreaterThan(10);
    const result = hasLongLength(oldValue);

    expect(result).toBe(true);
  });
  test('should return true provided old value stringified object length is less than minimum stringified object length to show diff link, new value stringified object length is greater than minimum stringified object length', () => {
    oldValue = dataobj;
    newValue = dataobj;
    expect(JSON.stringify(oldValue).length).toBeGreaterThan(10);
    expect(JSON.stringify(newValue).length).toBeGreaterThan(10);
    const result = hasLongLength(oldValue, oldValue);

    expect(result).toBe(true);
  });
  test('should return true provided old value string length is less than minimum string length to show diff link,', () => {
    oldValue = 'Click to view';
    expect(oldValue.length).toBeLessThan(300);
    const result = hasLongLength(oldValue);

    expect(result).toBe(false);
  });
});
