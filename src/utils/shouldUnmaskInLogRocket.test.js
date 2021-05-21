/* global describe, test, expect */
import shouldUnmaskInLogRocket from './shouldUnmaskInLogRocket';

describe('shouldUnmaskInLogRocket function test', () => {
  test('should return false if dataPublic is false', () => {
    expect(shouldUnmaskInLogRocket('password', false)).toBeFalsy();
  });
  test('should return true if dataPublic is true and id does not include sensitive data', () => {
    expect(shouldUnmaskInLogRocket('name', true)).toBeTruthy();
  });
  test('should return false if sensitive data includes id', () => {
    expect(shouldUnmaskInLogRocket('password', false)).toBeFalsy();
  });
});
