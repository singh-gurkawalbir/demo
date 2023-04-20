/* eslint-disable jest/no-conditional-expect */
import {validateRecursive} from './filter';
import errorMessageStore from './errorStore';

describe('validateRecursive test cases', () => {
  test('should thro error when filter array is empty', () => {
    try {
      validateRecursive(null, null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTER_RULES_VALIDATE_NONEMPTY'));
    }
  });
  test('should throw error when empty object is passed in filter array', () => {
    try {
      validateRecursive({}, null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTER_RULES_VALIDATE_NONEMPTY'));
    }
  });
  test('should throw error when empty when first element is not string', () => {
    try {
      validateRecursive([1234], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_OPERATIONNAME', { operationName: 1234 }));
    }
  });
  test('should throw error when OPERATION_NAME is not present is not in filterOperatorsHashMap and fieldOperationsHashMap', () => {
    try {
      validateRecursive(['string', ['numbers', ['extract', 'myField']]], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_OPERATIONNAME', { operationName: 'numbers' }));
    }
  });
  test('should throw error when filtersTree length lass than 2', () => {
    try {
      validateRecursive(['extract'], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_ARGSIZE', { operationName: 'extract', argCount: 0 }));
    }
  });
  test('should throw error when filtersTree length is 2 but first element is subtree', () => {
    try {
      validateRecursive(['extract', ['wd']], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_NOTSUBTREE', { operationName: 'extract', argCount: 0 }));
    }
  });
  test('should throw error when filtersTree length is 2 but first index is not string', () => {
    try {
      validateRecursive(['extract', {}], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_STRINGARG', { operationName: 'extract', argType: 'object' }));
    }
  });
  test('should throw error when no calling operator is provided for operator', () => {
    try {
      validateRecursive(['extract', 'we'], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_TYPECONV', { operationName: 'extract', callingOperation: 'nothing' }));
    }
  });
  test('should throw error when number of argument is more than expected', () => {
    try {
      validateRecursive(['not', 'WQEF', 'qr'], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_ARGSIZE', { operationName: 'not', expectedArgCount: 'exactly 1', actualArgCount: '2' }));
    }
  });
  test('should throw error when data type mismatch is between two fields', () => {
    try {
      validateRecursive([
        'and',
        [
          'equals',
          [
            'string',
            [
              'extract',
              'myField',
            ],
          ],
          'q34',
        ],
        [
          'subtract',
          [
            'string',
            [
              'extract',
              'myField',
            ],
          ],
          'q34',
        ],
      ], null);
    } catch (e) {
      expect(e.message).toBe(errorMessageStore('FILTERSTREE_VALIDATE_EXPECTEDARGTYPES', { argNumber: '1', operationName: 'subtract', expectedArgType: 'number', actualArgType: 'string' }));
    }
  });
});
