/* global describe, test, expect */
import { getTimeString } from './index';

describe('Account dashboard utils test cases', () => {
  describe('getTimeString util', () => {
    test('should get correct time string from minutes', () => {
      expect(getTimeString()).toEqual('00:00:00');
      expect(getTimeString(1231221412412)).toEqual('05:56:52');
      expect(getTimeString(1232132, ',')).toEqual('00,20,32');
      expect(getTimeString(1232132, ':')).toEqual('00:20:32');
    });
  });
});
