import { message } from '../../../../../utils/messageStore';
import { convertBoolean } from './util';

describe('AFE editor panel filter utils tests', () => {
  describe('convertBoolean util test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(convertBoolean()).toEqual(message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_STRING);
    });
    test('should return true if value is any of (true, t, 1)', () => {
      expect(convertBoolean('true')).toBeTruthy();
      expect(convertBoolean(true)).toBeTruthy();
      expect(convertBoolean(1)).toBeTruthy();
      expect(convertBoolean('1')).toBeTruthy();
      expect(convertBoolean('t')).toBeTruthy();
      expect(convertBoolean('T')).toBeTruthy();
    });
    test('should return false if value is any of (false, f, 0)', () => {
      expect(convertBoolean('false')).toBeFalsy();
      expect(convertBoolean(false)).toBeFalsy();
      expect(convertBoolean(0)).toBeFalsy();
      expect(convertBoolean('0')).toBeFalsy();
      expect(convertBoolean('f')).toBeFalsy();
      expect(convertBoolean('F')).toBeFalsy();
    });
    test('should return error string if value is invalid', () => {
      expect(convertBoolean('123')).toEqual(message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_NUMBER);
      expect(convertBoolean(123)).toEqual(message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_NUMBER);
      expect(convertBoolean('test')).toEqual(message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_STRING);
    });
  });
});
