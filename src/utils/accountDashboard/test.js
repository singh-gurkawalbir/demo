/* global describe, test, expect */
import { getTimeString, getDashboardIntegrationId } from './index';

describe('Account dashboard utils test cases', () => {
  describe('getTimeString util', () => {
    test('should get correct time string from minutes', () => {
      expect(getTimeString()).toEqual('00:00:00');
      expect(getTimeString(1231221412412)).toEqual('05:56:52');
      expect(getTimeString(1232132, ',')).toEqual('00,20,32');
      expect(getTimeString(1232132, ':')).toEqual('00:20:32');
    });
  });
  describe('getDashboardIntegrationId util', () => {
    test('should get dashboard integration id', () => {
      expect(getDashboardIntegrationId('1234')).toEqual('1234');
      expect(getDashboardIntegrationId('1234', '567', true)).toEqual('store567pid1234');
      expect(getDashboardIntegrationId('1234', '567')).toEqual('567');
    });
  });
});
