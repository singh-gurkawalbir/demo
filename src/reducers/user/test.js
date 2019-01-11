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
  describe('SET_THEME reducer', () => {
    describe('SET_THEME action', () => {
      test('should set the theme on first dispatch', () => {
        const theme = 'fancy';
        const state = reducer(undefined, actions.setTheme(theme));

        expect(state.themeName).toEqual(theme);
      });

      test('should replace theme on subsequent dispatches', () => {
        const theme1 = 'fancy';
        const theme2 = 'simple';
        let state;

        state = reducer(state, actions.setTheme(theme1));
        expect(state.themeName).toEqual(theme1);

        state = reducer(state, actions.setTheme(theme2));
        expect(state.themeName).toEqual(theme2);
      });
    });

    describe('Get preferences resource should intialize the set theme', () => {
      test('should set the theme on first dispatch', () => {
        const theme = 'fancy';
        const req = actions.resource.receivedCollection('preferences', {
          themeName: theme,
        });
        const state = reducer(undefined, req);

        expect(state.themeName).toEqual(theme);
      });

      test('if the theme does not show up in the preferences switch to default theme', () => {
        const req = actions.resource.receivedCollection('preferences', {});
        const state = reducer(undefined, req);

        expect(state.themeName).toEqual(selectors.DEFAULT_THEME);
      });
    });
  });
  describe(`user theme selectors`, () => {
    test('should return default theme if no profile exists', () => {
      expect(selectors.userTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
    });

    test('should return correct theme when set.', () => {
      const theme = 'my theme';
      const state = reducer(undefined, actions.setTheme(theme));

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
      const theme = 'unknown';
      const state = reducer(undefined, actions.setTheme(theme));

      expect(selectors.editorTheme(state)).toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });

    test('should return correct editor theme when user theme set.', () => {
      const theme = 'dark';
      const state = reducer(undefined, actions.setTheme(theme));

      expect(selectors.editorTheme(state)).not.toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });
  });
});
