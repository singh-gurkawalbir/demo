/* global describe, test, expect */
import shouldNotRedactInLogrocket from './shouldNotRedactInLogrocket';

describe('shouldNotRedactInLogrocket function test', () => {
  test('should return false if dataPublic is false', () => {
    expect(shouldNotRedactInLogrocket('password', false)).toBeFalsy();
  });
  test('should return true if dataPublic is true and sensitive data does not include id', () => {
    expect(shouldNotRedactInLogrocket('name', true)).toBeTruthy();
  });
  test('should return false if dataPublic is false and sensitive data does not include id', () => {
    expect(shouldNotRedactInLogrocket('name', false)).toBeFalsy();
  });
  test('should return false if sensitive data includes id', () => {
    expect(shouldNotRedactInLogrocket('password', false)).toBeFalsy();
  });
});
