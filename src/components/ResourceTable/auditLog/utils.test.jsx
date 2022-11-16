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
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
  test('should return false provided old value stringified object length is greater than minimum stringified object length to show diff link, new value string length is greater than minimum stringified object length', () => {
    oldValue = dataobj;
    newValue = '';
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
  test('should return false provided old value stringified object length is less than minimum stringified object length to show diff link, new value string length is greater than minimum stringified object length', () => {
    oldValue = '2022-11-06T21:17:07.604Z';
    newValue = '';
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(false);
  });
  test('should return false provided old value string length is less than minimum string length to show diff link, new value string length is greater than minimum string length', () => {
    oldValue = '2022-11-06T21:17:07.604Z';
    newValue = '2022-11-07T20:49:58.385Z';
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(false);
  });
  test('should return true provided old value stringified object length is less than minimum stringified object length to show diff link, new value is not provided', () => {
    oldValue = dataobj;
    const result = hasLongLength(oldValue);

    expect(result).toBe(true);
  });
  test('should return true provided old value stringified object length is greater than minimum stringified object length to show diff link, new value stringified object length is greater than minimum stringified object length', () => {
    oldValue = dataobj;
    newValue = dataobj;
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
  test('should return false provided old value string length is less than minimum string length to show diff link,', () => {
    oldValue = 'Click to view';
    const result = hasLongLength(oldValue);

    expect(result).toBe(false);
  });
  test('should return false provided old value stringified object length is less than minimum stringified object length to show diff link, new value stringified object length is less than minimum stringified object length', () => {
    oldValue = {id: 1};
    newValue = {id: 2};
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(false);
  });

  test('should return true provided old value string length is greater than minimum string length to show diff link, new value object length is greater than minimum stringified object length', () => {
    oldValue = 'We believe that by automating processes across applications, we are freeing up your time to do more in your organization. We believe that reducing manual processes empowers you to focus on growing your business. We are passionate about solving integration challenges and believe that integration should be easy and simple for both technical and business users.';
    newValue = dataobj;
    const result = hasLongLength(oldValue, newValue);

    expect(result).toBe(true);
  });
});
