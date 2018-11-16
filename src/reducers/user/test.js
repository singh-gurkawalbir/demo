/* global describe, test, expect */
import reducer, * as selectors from './';
import actionTypes from '../../actions/types';
import actions from '../../actions';

describe('user reducers', () => {
  describe('profile reducers', () => {
    test('when profile resource request is received should get resource message', () => {
      const state = reducer(undefined, actions.profile.received('something'));

      expect(state.profile).toEqual('something');
    });

    test('should replace existing profile with a new one.', () => {
      const mockProfile1 = 'the profile!';
      const mockProfile2 = 'the other profile!';
      let state;

      state = reducer(state, actions.profile.received(mockProfile1));
      expect(state.profile).toEqual(mockProfile1);

      state = reducer(state, actions.profile.received(mockProfile2));
      expect(state.profile).toEqual(mockProfile2);
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
      const state = reducer(
        initialProfileState,
        actions.profile.deleteProfile()
      );

      expect(state.profile).toEqual({ email: action.resource.email });
    });
  });
  describe(`SET_THEME action`, () => {
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
});
