/* global describe, expect, test */
import { selectors } from '.';

describe('users region selector testcases', () => {
  describe('selectors.userState test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userState()).toBe();
    });
  });

  describe('selectors.userProfile test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfile()).toBe();
    });
  });

  describe('selectors.developerMode test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.developerMode()).toBe();
    });
  });

  describe('selectors.currentEnvironment test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.currentEnvironment()).toBe();
    });
  });

  describe('selectors.userOwnPreferences test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userOwnPreferences()).toEqual({});
    });
  });

  describe('selectors.userProfilePreferencesProps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfilePreferencesProps()).toEqual({});
    });
  });

  describe('selectors.userProfileEmail test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfileEmail()).toEqual();
    });
  });

  describe('selectors.userProfileLinkedWithGoogle test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfileLinkedWithGoogle()).toEqual(false);
    });
  });

  describe('selectors.testConnectionCommState test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.testConnectionCommState()).toEqual({commState: null, message: null});
    });
  });

  describe('selectors.hasPreferences test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasPreferences()).toEqual(true);
    });
  });

  describe('selectors.hasProfile test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasProfile()).toEqual(false);
      expect(selectors.hasProfile(null)).toEqual(false);
      expect(selectors.hasProfile({})).toEqual(false);
    });
    test('should return correct value for user state', () => {
      expect(selectors.hasProfile({user: {}})).toEqual(false);
      expect(selectors.hasProfile({user: {profile: {}}})).toEqual(true);
      expect(selectors.hasProfile({user: {profile: {name: 'User'}}})).toEqual(true);
    });
  });
});

