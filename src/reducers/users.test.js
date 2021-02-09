/* global describe, expect, test */
import { selectors } from '.';
import { ACCOUNT_IDS } from '../utils/constants';

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
      expect(selectors.hasPreferences(null)).toEqual(true);
      expect(selectors.hasPreferences({})).toEqual(true);
    });

    test('should correct value for monitor user', () => {
      const state = {
        profile: { email: 'something@test.com', name: 'First Last' },
        preferences: { defaultAShareId: 'ashare1' },
        org: {
          accounts: [
            {
              accessLevel: 'monitor',
              integrationAccessLevel: [{_integrationId: '123', accessLevel: 'manage'}, {_integrationId: '456', accessLevel: 'monitor'}],
              _id: 'ashare1',
              ownerUser: {
                email: 'owner@test.com',
                name: 'owner 1',
              },
            },
          ],
        },
      };

      expect(selectors.hasPreferences(state)).toEqual(true);
    });

    test('should correct value for manage user', () => {
      const state = {
        profile: { email: 'something@test.com', name: 'First Last' },
        preferences: { defaultAShareId: 'ashare1' },
        org: {
          accounts: [
            {
              accessLevel: 'manage',
              _id: 'ashare1',
              ownerUser: {
                email: 'owner@test.com',
                name: 'owner 1',
              },
            },
          ],
        },
      };

      expect(selectors.hasPreferences(state)).toEqual(true);
    });
    test('should return correct value for org owner', () => {
      const state =
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        };

      expect(selectors.hasPreferences(state)).toEqual(true);
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

