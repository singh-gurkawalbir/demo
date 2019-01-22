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

    describe('should update the preferences according correctly based on the user account type', () => {
      test('when the user is a regular account holder without invited users and not an owner', () => {
        const regularUserAccountPreferences = {
          themeName: 'fancy',
        };
        const req = actions.resource.receivedCollection(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, req);

        expect(state.preferences).toEqual({ themeName: 'fancy' });
      });

      test('when the user is an owner', () => {
        const regularUserAccountPreferences = {
          defaultAShareId: 'own',
          timeFormat: 'something',
          themeName: 'fancy',
        };
        const req = actions.resource.receivedCollection(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, req);

        expect(state.preferences).toEqual(regularUserAccountPreferences);
      });
      test('when the user is a regular account holder and an owner', () => {
        const regularUserAccountPreferences = {
          defaultAShareId: 'own',
          timeFormat: 'something',
          themeName: 'fancy',
        };
        const req = actions.resource.receivedCollection(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, req);

        expect(state.preferences).toEqual(regularUserAccountPreferences);
      });

      test('when the user is a has accepted invited users', () => {
        const regularUserAccountPreferences = {
          defaultAShareId: '123',
          timeFormat: 'something',
          accounts: {
            '123': {
              themeName: 'fancy',
            },
          },
        };
        const req = actions.resource.receivedCollection(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, req);

        expect(state.preferences).toEqual({
          timeFormat: 'something',
          defaultAShareId: '123',
          themeName: 'fancy',
        });
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

      expect(selectors.userTheme(state.preferences)).toEqual(theme);
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
      const theme = 'dark';
      const { preferences } = reducer(
        undefined,
        actions.profile.updatePreferenceStore({ theme })
      );

      expect(selectors.editorTheme(preferences)).not.toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });
  });
});
