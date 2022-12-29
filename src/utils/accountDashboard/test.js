
import { getTimeString, getDashboardIntegrationId } from './index';

describe('Account dashboard utils test cases', () => {
  describe('getTimeString util', () => {
    test('should get correct time string from minutes', () => {
      expect(getTimeString()).toBe('00:00:00');
      expect(getTimeString(1231221412412)).toBe('05:56:52');
      expect(getTimeString(1232132, ',')).toBe('00,20,32');
      expect(getTimeString(1232132, ':')).toBe('00:20:32');
    });
  });
  describe('getDashboardIntegrationId util', () => {
    test('should get dashboard integration id', () => {
      expect(getDashboardIntegrationId('1234')).toBe('1234');
      expect(getDashboardIntegrationId('1234', '567', true)).toBe('store567pid1234');
      expect(getDashboardIntegrationId('1234', '567')).toBe('567');
    });
  });
});
