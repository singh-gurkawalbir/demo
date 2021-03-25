/* global describe, test, expect */
import { getStaticCodesList } from './index';

describe('listenerLogs utils test cases', () => {
  describe('getStaticCodesList util', () => {
    test('should return undefined if invalid or empty args are supplied', () => {
      expect(getStaticCodesList()).toBeUndefined();
      expect(getStaticCodesList(null)).toBeUndefined();
    });
    test('should return the passed codes array if it does not contain xxx format', () => {
      const codes = ['201', '500', '304'];

      expect(getStaticCodesList(codes)).toEqual(codes);
    });
    test('should return the flattened array after adding xxx format codes', () => {
      const codes = ['101', '201', '2xx'];
      const expectedCodes = ['101', '201', '202', '203', '205', '206', '207', '208', '226'];

      expect(getStaticCodesList(codes)).toEqual(expectedCodes);
      const otherCodes = ['2xx', '5xx'];
      const otherExpectedCodes = ['202', '203', '205', '206', '207', '208', '226', '501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '598', '599'];

      expect(getStaticCodesList(otherCodes)).toEqual(otherExpectedCodes);
    });
  });
});
