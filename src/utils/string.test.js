/* global describe, test, expect */
import { getTextAfterCount, camelCase, isHTML } from './string';

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
  });
});

describe('camelCase util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(camelCase()).toEqual('');
    expect(camelCase('')).toEqual('');
    expect(camelCase(null)).toEqual(null);
  });
  test('should return camel cases string', () => {
    expect(camelCase('Magento store')).toEqual('magento store');
    expect(camelCase('Shopify')).toEqual('shopify');
  });
});

describe('isHTML util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(isHTML()).toEqual(false);
    expect(isHTML(null)).toEqual(false);
  });
  test('should return false if invalid html is provided', () => {
    expect(isHTML('test string')).toEqual(false);
    expect(isHTML('<xml')).toEqual(false);
  });
  test('should return true if passed string is html', () => {
    expect(isHTML('<br></br>')).toEqual(true);
  });
});
