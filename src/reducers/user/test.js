/* global describe, test, expect */
import reducer, * as selectors from './';
import actionTypes from '../../actions/types';
import actions from '../../actions';

describe('user reducers', () => {
  describe('profile reducers', () => {
    const someTestProfile1 = { name: 'profile 1' };
    const someTestProfile2 = { name: 'profile 2' };

    test('when profile resource request is received should get resource message', () => {
      const state = reducer(
        undefined,
        actions.profile.received(someTestProfile1)
      );

      expect(state.profile).toEqual(someTestProfile1);
    });

    test('should replace existing profile with a new one.', () => {
      let state;

      state = reducer(state, actions.profile.received(someTestProfile1));
      expect(state.profile).toEqual(someTestProfile1);

      state = reducer(state, actions.profile.received(someTestProfile2));
      expect(state.profile).toEqual(someTestProfile2);
    });

    test('when delete profile action is dispatched wipe out user profile info except for the user email ', () => {
      const action = {
        type: actionTypes.RESOURCE.RECEIVED,
        resourceType: 'profile',
        resource: {
          email: 'someemail@gmail.com',
          userName: 'abcd',
        },
      };
      const initialProfileState = reducer(undefined, action);
      const state = reducer(initialProfileState, actions.profile.delete());

      expect(state.profile).toEqual({ email: action.resource.email });
    });
  });
  describe('setting theme in preferences reducer', () => {
    describe('should set the right theme using the preferences action', () => {
      test('should set the theme on first dispatch', () => {
        const themeName = 'fancy';
        const state = reducer(
          undefined,
          actions.profile.updatePreferenceStore({ themeName })
        );

        expect(state.preferences.themeName).toEqual(themeName);
      });

      test('should replace theme on subsequent dispatches', () => {
        const themeName1 = 'fancy';
        const themeName2 = 'simple';
        let state;

        state = reducer(
          state,
          actions.profile.updatePreferenceStore({ themeName: themeName1 })
        );
        expect(state.preferences.themeName).toEqual(themeName1);

        state = reducer(
          state,
          actions.profile.updatePreferenceStore({ themeName: themeName2 })
        );
        expect(state.preferences.themeName).toEqual(themeName2);
      });
    });

    describe('Update preferences ', () => {
      describe('for various user account types', () => {
        test('should update the correct set of preferences when the user is an owner', () => {
          const ownerAccountPreferences = {
            defaultAShareId: 'own',
            timeFormat: 'something',
            themeName: 'fancy',
          };
          const receivedPreferences = actions.resource.receivedCollection(
            'preferences',
            ownerAccountPreferences
          );
          const state = reducer(undefined, receivedPreferences);
          const updatePreferencePatch = actions.profile.updatePreferenceStore({
            timeFormat: 'something else',
            themeName: 'blue',
          });
          const updatedPatchState = reducer(state, updatePreferencePatch);

          expect(updatedPatchState.preferences).toEqual({
            themeName: 'blue',
            defaultAShareId: 'own',
            timeFormat: 'something else',
          });
        });

        test('should generate the correct set of preferences when the user is an owner', () => {
          const invitedUserAccountPreferences = {
            defaultAShareId: '123',
            timeFormat: 'something',
            accounts: {
              '123': {
                themeName: 'fancy',
              },
              '345': {
                themeName: 'white',
              },
            },
          };
          const receivedPreferences = actions.resource.receivedCollection(
            'preferences',
            invitedUserAccountPreferences
          );
          const state = reducer(undefined, receivedPreferences);
          const updatePreferencePatch = actions.profile.updatePreferenceStore({
            defaultAShareId: '123',
            timeFormat: 'something else',
            themeName: 'blue',
          });
          const updatedPatchState = reducer(state, updatePreferencePatch);

          expect(updatedPatchState.preferences).toEqual({
            defaultAShareId: '123',
            timeFormat: 'something else',
            accounts: {
              '123': {
                themeName: 'blue',
              },
              '345': {
                themeName: 'white',
              },
            },
          });
        });
      });

      test('should update the preference for a preferences resource type', () => {
        const regularUserAccountPreferences = {
          themeName: 'fancy',
        };
        const receivedPreferences = actions.resource.receivedCollection(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, receivedPreferences);

        expect(state.preferences).toEqual({ themeName: 'fancy' });
      });
      test('should not update preferences for any other resource type', () => {
        const regularUserAccountPreferences = {
          themeName: 'fancy',
        };
        const receivedPreferences = actions.resource.receivedCollection(
          'someOtherResouceType',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, receivedPreferences);

        expect(state.preferences).toEqual({});
      });
    });
  });
  describe(`user preferences selectors`, () => {
    test('should generate nothing for payload in the preference update action', () => {
      const regularUserAccountPreferences = {};
      const receivedPreferencesAction = actions.resource.receivedCollection(
        'preferences',
        regularUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferencesAction);

      expect(selectors.userPreferences(state)).toEqual({});
    });
    test('should generate the correct set of preferences when the user is a regular account holder without invited users and not an owner', () => {
      const regularUserAccountPreferences = {
        themeName: 'fancy',
        timeFormat: 'something',
      };
      const receivedPreferencesAction = actions.resource.receivedCollection(
        'preferences',
        regularUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferencesAction);

      expect(selectors.userPreferences(state)).toEqual({
        themeName: 'fancy',
        timeFormat: 'something',
      });
    });

    test('should generate the correct set of preferences when the user is an owner', () => {
      const ownerAccountPreferences = {
        defaultAShareId: 'own',
        timeFormat: 'something',
        themeName: 'fancy',
      };
      const receivedPreferences = actions.resource.receivedCollection(
        'preferences',
        ownerAccountPreferences
      );
      const state = reducer(undefined, receivedPreferences);

      expect(selectors.userPreferences(state)).toEqual({
        themeName: 'fancy',
        defaultAShareId: 'own',
        timeFormat: 'something',
      });
    });

    test('should generate the correct set of preferences when the user is an owner', () => {
      const invitedUserAccountPreferences = {
        defaultAShareId: '123',
        timeFormat: 'something',
        accounts: {
          '123': {
            themeName: 'fancy',
          },
        },
      };
      const receivedPreferences = actions.resource.receivedCollection(
        'preferences',
        invitedUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferences);

      expect(selectors.userPreferences(state)).toEqual({
        defaultAShareId: '123',
        timeFormat: 'something',
        themeName: 'fancy',
      });
    });
  });
  describe(`user theme selectors`, () => {
    test('should return default theme if no profile exists', () => {
      expect(selectors.userTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
    });

    test('should return correct theme when set.', () => {
      const theme = 'my theme';
      const state = reducer(
        undefined,
        actions.profile.updatePreferenceStore({ themeName: theme })
      );

      expect(selectors.userTheme(state)).toEqual(theme);
    });
  });
  describe(`avatarUrl`, () => {
    test('should return undefined if no profile exists', () => {
      expect(selectors.avatarUrl(undefined)).toBeUndefined();
      expect(selectors.avatarUrl({})).toBeUndefined();
    });

    test('should return correct url if profile exists', () => {
      const mockProfile = { emailHash: '123' };
      const state = reducer(undefined, actions.profile.received(mockProfile));

      expect(selectors.avatarUrl(state)).toEqual(
        'https://secure.gravatar.com/avatar/123?d=mm&s=55'
      );
    });
  });
  describe(`editor theme selector`, () => {
    test('should return default editor theme if no state exists', () => {
      expect(selectors.editorTheme(undefined)).toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });

    test('should return default editor theme when user theme set to unknown type.', () => {
      const themeName = 'unknown';
      const { preferences } = reducer(
        undefined,
        actions.profile.updatePreferenceStore({ themeName })
      );

      expect(selectors.editorTheme(preferences)).toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });

    test('should return correct editor theme when user theme set.', () => {
      const themeName = 'dark';
      const preferenceRecievedState = reducer(
        undefined,
        actions.profile.updatePreferenceStore({ themeName })
      );

      expect(selectors.editorTheme(preferenceRecievedState)).not.toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });
  });
});
