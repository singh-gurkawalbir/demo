import errorMessageStore from './errorStore';
import jsonUtil, { isJsonValue } from './json';

describe('json util function test', () => {
  describe('containsAllKeys function test', () => {
    test('should not throw any exception for empty input', () => {
      expect(jsonUtil.containsAllKeys()).toBeNull();
    });
    test('should return valid errorMsg', () => {
      expect(jsonUtil.containsAllKeys([{label: 'generate', value: 'gen'}], ['abc', 'label'])).toBe('abc field missing at position 0');
      expect(jsonUtil.containsAllKeys([{label: 'generate', value: 'gen'}], ['abc', 'def', 'label'])).toBe('abc,def field missing at position 0');
      expect(jsonUtil.containsAllKeys([{label: 'generate', value: 'gen'}, {def: 'generate', value: 'gen'}], ['abc', 'def', 'label'])).toBe('abc,def field missing at position 0\nabc,label field missing at position 1');
    });

    test('should return null if array objects contains all the keys', () => {
      expect(jsonUtil.containsAllKeys([{label: 'generate', abc: '1', value: 'gen'}], ['abc', 'label'])).toBeNull();
      expect(jsonUtil.containsAllKeys([{label: 'generate', value: 'gen'}], [])).toBeNull();
      expect(jsonUtil.containsAllKeys([], ['abc', 'def', 'label'])).toBeNull();
    });
  });

  describe('validateJsonString function test', () => {
    test('should return null for valid json string', () => {
      expect(jsonUtil.validateJsonString('{}')).toBeNull();
      expect(jsonUtil.validateJsonString('{"a":"1"}')).toBeNull();
      expect(jsonUtil.validateJsonString('{"a":[]}')).toBeNull();
      expect(jsonUtil.validateJsonString(2)).toBeNull();
      expect(jsonUtil.validateJsonString(null)).toBeNull();
    });

    test('should return valid error message for invalid json string', () => {
      expect(jsonUtil.validateJsonString('')).toBe('Unexpected end of JSON input');
      expect(jsonUtil.validateJsonString(undefined)).toBe('Unexpected token u in JSON at position 0');
      expect(jsonUtil.validateJsonString('{"a":{"b":{"c":2}}')).toBe('Unexpected end of JSON input');
      expect(jsonUtil.validateJsonString({})).toBe('Unexpected token o in JSON at position 1');
      expect(jsonUtil.validateJsonString('{')).toBe('Unexpected end of JSON input');
      expect(jsonUtil.validateJsonString('{"a":1"}')).toBe('Unexpected string in JSON at position 6');
      expect(jsonUtil.validateJsonString('{"a":[]')).toBe('Unexpected end of JSON input');
      expect(jsonUtil.validateJsonString('{"a":{"b":{"c":{}}}')).toBe('Unexpected end of JSON input');
    });
  });

  describe('maskValues function test', () => {
    test('should return input as it is, in case its not valid object', () => {
      expect(jsonUtil.maskValues('{}')).toBe('{}');
      expect(jsonUtil.maskValues(2)).toBe(2);
      expect(jsonUtil.maskValues('123')).toBe('123');
      expect(jsonUtil.maskValues(null)).toBeNull();
      expect(jsonUtil.maskValues(undefined)).toBeUndefined();
    });

    test('should return object with masked value', () => {
      expect(jsonUtil.maskValues({a: 1})).toEqual({a: '***'});
      expect(jsonUtil.maskValues({a: {b: {c: {d: 'abc'}}}})).toEqual({a: {b: {c: {d: '***'}}}});
      expect(jsonUtil.maskValues({})).toEqual({});
      expect(jsonUtil.maskValues([])).toEqual({});
      expect(jsonUtil.maskValues([1, 2, 3, 4])).toEqual({0: '***', 1: '***', 2: '***', 3: '***'});
      expect(jsonUtil.maskValues({a: [{b: 1}]})).toEqual({a: {0: {b: '***'}}});
    });
  });

  describe('objectToPatchSet function test', () => {
    test('should convert object to patch set correctly', () => {
      expect(jsonUtil.objectToPatchSet({})).toEqual([]);
      expect(jsonUtil.objectToPatchSet({a: 1})).toEqual([{op: 'replace', path: '/a', value: 1}]);
      expect(jsonUtil.objectToPatchSet({a: {b: 2}})).toEqual([{op: 'replace', path: '/a', value: {b: 2}}]);
      expect(jsonUtil.objectToPatchSet({a: 1, b: 2})).toEqual([{op: 'replace', path: '/a', value: 1}, {op: 'replace', path: '/b', value: 2}]);
      expect(jsonUtil.objectToPatchSet({a: [1, 2, 3]})).toEqual([{op: 'replace', path: '/a', value: [1, 2, 3]}]);
    });
  });

  describe('objectForPatchSet function test', () => {
    test('should convert object keys to patchSet supported object', () => {
      expect(jsonUtil.objectForPatchSet({})).toEqual({});
      expect(jsonUtil.objectForPatchSet([])).toEqual({});
      expect(jsonUtil.objectForPatchSet({a: 1})).toEqual({'/a': 1});
      expect(jsonUtil.objectForPatchSet({a: {b: 1}})).toEqual({'/a': {b: 1}});
      expect(jsonUtil.objectForPatchSet({a: 1, b: 2})).toEqual({'/a': 1, '/b': 2});
    });
  });

  describe('getObjectKeyFromValue function test', () => {
    test('should not throw error in case of invalid input', () => {
      expect(jsonUtil.getObjectKeyFromValue('a', 'b')).toBeUndefined();
      expect(jsonUtil.getObjectKeyFromValue({}, undefined)).toBeUndefined();
    });

    test('should return key from value correctly', () => {
      expect(jsonUtil.getObjectKeyFromValue({a: 'b'}, 'b')).toBe('a');
      expect(jsonUtil.getObjectKeyFromValue({}, 'a')).toBeUndefined();
      expect(jsonUtil.getObjectKeyFromValue({a: {b: 1}}, 'b')).toBeUndefined();
      expect(jsonUtil.getObjectKeyFromValue({a: 1, c: 'str'}, 'str')).toBe('c');
    });
  });

  describe('getObjectKeysFromValue function test', () => {
    test('should return array of keys matching particular value', () => {
      expect(jsonUtil.getObjectKeysFromValue({a: 'b'}, 'b')).toEqual(['a']);
      expect(jsonUtil.getObjectKeysFromValue({a: 'b', b: 'b', c: 'd', e: 'b'}, 'b')).toEqual(['a', 'b', 'e']);
      expect(jsonUtil.getObjectKeysFromValue({a: 'b', b: 'b', c: 'd', e: 'b'}, 'x')).toEqual([]);
      expect(jsonUtil.getObjectKeysFromValue({a: '1', e: 1}, 1)).toEqual(['e']);
      expect(jsonUtil.getObjectKeysFromValue({a: true, e: 1}, true)).toEqual(['a']);
      expect(jsonUtil.getObjectKeysFromValue({a: undefined, e: 1}, undefined)).toEqual(['a']);
    });
  });

  describe('isJsonValue function test', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(isJsonValue()).toBeUndefined();
    });

    test('should return undefined if value is valid json string', () => {
      expect(isJsonValue(JSON.stringify({id: '123'}))).toBeUndefined();
    });

    test('should return undefined if value is valid json object', () => {
      expect(isJsonValue({id: '123'})).toBeUndefined();
    });

    test('should return error if value is not valid json', () => {
      expect(isJsonValue('invalid json', 'Field')).toEqual(errorMessageStore('INVALID_JSON_VALUE', {label: 'Field'}));
    });
  });
});
