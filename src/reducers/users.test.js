
import { selectors } from '.';
import { ACCOUNT_IDS } from '../constants';

describe('users region selector testcases', () => {
  describe('selectors.userState test cases', () => {
    const state = {
      user: {
        profile: {
          developer: true,
        },
        preferences: {
          dateFormat: 'DD/MM/YYYY',
          environment: 'production',
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userState()).toBe();
      expect(selectors.userState(null)).toBeNull();
      expect(selectors.userState({})).toBe();
    });

    test('should return correct user object', () => {
      expect(selectors.userState(state)).toBe(state.user);
    });
  });

  describe('selectors.userProfile test cases', () => {
    const state = {
      user: {
        profile: {
          developer: true,
        },
        preferences: {
          dateFormat: 'DD/MM/YYYY',
          environment: 'production',
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfile()).toBe();
      expect(selectors.userProfile(null)).toBe();
      expect(selectors.userProfile({})).toBe();
    });

    test('should return correcct profile object', () => {
      expect(selectors.userProfile(state)).toBe(state.user.profile);
    });
  });

  describe('selectors.developerMode test cases', () => {
    const state = {
      user: {
        profile: {
          developer: true,
        },
        preferences: {
          dateFormat: 'DD/MM/YYYY',
          environment: 'production',
        },
      },
    };
    const state2 = {
      user: {
        profile: {
          developer: false,
        },
        preferences: {
          dateFormat: 'DD/MM/YYYY',
          environment: 'production',
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.developerMode()).toBe();
      expect(selectors.developerMode({})).toBe();
      expect(selectors.developerMode(null)).toBeNull();
    });
    test('should return correct value for developer mode', () => {
      expect(selectors.developerMode(state)).toBe(true);
      expect(selectors.developerMode(state2)).toBe(false);
    });
  });

  describe('selectors.currentEnvironment test cases', () => {
    const state = {
      user: {
        preferences: {
          dateFormat: 'DD/MM/YYYY',
          environment: 'production',
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.currentEnvironment()).toBe();
      expect(selectors.currentEnvironment({})).toBe();
      expect(selectors.currentEnvironment(null)).toBe();
    });
    test('should return correct environment value', () => {
      expect(selectors.currentEnvironment(state)).toBe('production');
    });
  });

  describe('selectors.userOwnPreferences test cases', () => {
    const state = {
      user: {
        preferences: {
          dateFormat: 'DD/MM/YYYY',
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userOwnPreferences()).toEqual({});
      expect(selectors.userOwnPreferences(null)).toEqual({});
      expect(selectors.userOwnPreferences({})).toEqual({});
    });
    test('should return correct preferences object', () => {
      expect(selectors.userOwnPreferences(state)).toEqual({dateFormat: 'DD/MM/YYYY'});
    });
  });

  describe('selectors.userProfilePreferencesProps test cases', () => {
    const state = {
      user: {
        profile: {
          _id: 'id1',
          name: 'name',
          email: 'email@celigo.com',
          company: 'xyz',
          _ssoAccountId: '123',
          authTypeSSO: '123',
        },
        preferences: {
          environment: 'sandbox',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          colorTheme: 'light',
          showIconView: true,
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfilePreferencesProps()).toEqual({});
      expect(selectors.userProfilePreferencesProps(null)).toEqual({});
      expect(selectors.userProfilePreferencesProps({})).toEqual({});
    });
    test('should return correct value for any user', () => {
      expect(selectors.userProfilePreferencesProps(state)).toEqual({
        _id: 'id1',
        name: 'name',
        email: 'email@celigo.com',
        company: 'xyz',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        _ssoAccountId: '123',
        authTypeSSO: '123',
        colorTheme: 'light',
        showIconView: true,
      });
    });
  });

  describe('selectors.userProfileEmail test cases', () => {
    const state = {
      user: {
        profile: {
          email: 'abc@celigo.com',
          auth_type_google: {
            id: 'google_id',
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfileEmail()).toEqual();
      expect(selectors.userProfileEmail(null)).toEqual();
      expect(selectors.userProfileEmail({})).toEqual();
    });
    test('should return correct value when user profile email exists', () => {
      expect(selectors.userProfileEmail(state)).toBe('abc@celigo.com');
    });
  });

  describe('selectors.userProfileLinkedWithGoogle test cases', () => {
    const state = {
      user: {
        profile: {
          auth_type_google: {
            id: 'google_id',
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.userProfileLinkedWithGoogle()).toBe(false);
      expect(selectors.userProfileLinkedWithGoogle(null)).toBe(false);
      expect(selectors.userProfileLinkedWithGoogle({})).toBe(false);
    });
    test('should return true when user profile has google link id', () => {
      expect(selectors.userProfileLinkedWithGoogle(state)).toBe(true);
    });
  });

  describe('selectors.testConnectionCommState test cases', () => {
    const state = {
      comms: {
        ping: {
          resource1: {
            status: 'error',
            message: 'message1',
          },
          resource2: {
            status: 'error2',
            message: 'message2',
          },
          resource3: {
            status: 'success',
            message: 'message3',
          },
          resource4: {
            status: 'fail',
          },
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.testConnectionCommState()).toEqual({commState: null, message: null});
      expect(selectors.testConnectionCommState(null)).toEqual({commState: null, message: null});
      expect(selectors.testConnectionCommState({})).toEqual({commState: null, message: null});
      expect(selectors.testConnectionCommState({}, null)).toEqual({commState: null, message: null});
      expect(selectors.testConnectionCommState(null, null)).toEqual({commState: null, message: null});
    });

    test('should return correct values for valid resourceIds', () => {
      expect(selectors.testConnectionCommState(state, 'resource1')).toEqual({commState: 'error', message: 'message1'});
      expect(selectors.testConnectionCommState(state, 'resource2')).toEqual({commState: 'error2', message: 'message2'});
      expect(selectors.testConnectionCommState(state, 'resource3')).toEqual({commState: 'success', message: 'message3'});
      expect(selectors.testConnectionCommState(state, 'resource4')).toEqual({commState: 'fail', message: null});
    });
  });

  describe('selectors.hasPreferences test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasPreferences()).toBe(true);
      expect(selectors.hasPreferences(null)).toBe(true);
      expect(selectors.hasPreferences({})).toBe(true);
    });

    test('should return correct value for monitor user', () => {
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

      expect(selectors.hasPreferences(state)).toBe(true);
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

      expect(selectors.hasPreferences(state)).toBe(true);
    });
    test('should return correct value for org owner', () => {
      const state =
        {
          profile: { email: 'something@test.com', name: 'First Last', _id: 'owner' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        };

      expect(selectors.hasPreferences(state)).toBe(true);
    });
  });

  describe('selectors.hasProfile test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.hasProfile()).toBe(false);
      expect(selectors.hasProfile(null)).toBe(false);
      expect(selectors.hasProfile({})).toBe(false);
    });
    test('should return correct value for user state', () => {
      expect(selectors.hasProfile({user: {}})).toBe(false);
      expect(selectors.hasProfile({user: {profile: {}}})).toBe(true);
      expect(selectors.hasProfile({user: {profile: {name: 'User'}}})).toBe(true);
    });
  });
});

