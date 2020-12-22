/* global describe, expect, test */
import { selectors } from '.';

describe('aunthentication region selector testcases', () => {
  describe('selectors.isAuthenticated test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAuthenticated()).toBe(false);
    });
  });

  describe('selectors.isDefaultAccountSet test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDefaultAccountSet(false)).toBe(false);
    });
  });

  describe('selectors.isAuthInitialized test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isAuthInitialized(undefined, {})).toBe(false);
    });
  });

  describe('selectors.isUserLoggedInDifferentTab test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUserLoggedInDifferentTab()).toBe(false);
    });
  });

  describe('selectors.authenticationErrored test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.authenticationErrored(undefined, {})).toEqual();
    });
  });

  describe('selectors.isUserLoggedOut test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUserLoggedOut()).toEqual(false);
    });
  });

  describe('selectors.isDefaultAccountSetAfterAuth test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isDefaultAccountSetAfterAuth(undefined, {})).toEqual(true);
    });
  });

  describe('selectors.shouldShowAppRouting test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.shouldShowAppRouting(undefined, {})).toEqual(true);
    });
  });

  describe('selectors.isSessionExpired test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isSessionExpired(undefined, {})).toEqual(false);
    });
  });

  describe('selectors.sessionValidTimestamp test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.sessionValidTimestamp()).toEqual();
    });
  });
});

