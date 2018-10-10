/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../actions';

describe('session reducers', () => {
  describe(`PROFILE.RECEIVED action`, () => {
    test('should store the new profile', () => {
      const mockProfile = 'the profile!';
      const state = reducer(undefined, actions.profile.received(mockProfile));

      expect(state.profile).toEqual(mockProfile);
    });

    test('should replace existing profile with a new one', () => {
      const mockProfile1 = 'the profile!';
      const mockProfile2 = 'the other profile!';
      let state;

      state = reducer(state, actions.profile.received(mockProfile1));
      expect(state.profile).toEqual(mockProfile1);

      state = reducer(state, actions.profile.received(mockProfile2));
      expect(state.profile).toEqual(mockProfile2);
    });
  });
});

describe('theme reducers', () => {
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
});

describe('filter reducers', () => {
  describe(`PATCH_FILTER action`, () => {
    test('should set the filter on first action', () => {
      const name = 'testFilter';
      const filter = { keyword: 'findme', take: 5 };
      const state = reducer(undefined, actions.patchFilter(name, filter));

      expect(state.filters[name]).toEqual({
        keyword: 'findme',
        take: 5,
      });
    });

    test('should override existing filter options on subsequent PATCH_FILTER actions', () => {
      const name = 'testFilter';
      let state;
      const filter = { keyword: 'findme', take: 5 };

      state = reducer(undefined, actions.patchFilter(name, filter));
      state = reducer(
        state,
        actions.patchFilter(name, { take: 5, newCriteria: true })
      );

      expect(state.filters[name]).toEqual({
        keyword: 'findme',
        take: 5,
        newCriteria: true,
      });
    });
  });

  describe(`CLEAR_FILTER action`, () => {
    test('should do nothing if filter doesnt exist', () => {
      const filter = { keyword: 'findme', take: 5 };
      let state;

      state = reducer(undefined, actions.patchFilter('someFilter', filter));
      state = reducer(state, actions.clearFilter('otherFilter'));

      expect(state.filters.someFilter).toEqual(filter);
      expect(state.filters.otherFilter).toBeUndefined();
    });

    test('should clear filter if it exist', () => {
      const filter = { keyword: 'findme', take: 5 };
      let state;

      state = reducer(undefined, actions.patchFilter('someFilter', filter));
      expect(state.filters.someFilter).toEqual(filter);

      state = reducer(state, actions.clearFilter('someFilter'));
      expect(state.filters.someFilter).toBeUndefined();
    });
  });
});

describe('session selectors', () => {
  describe(`avatarUrl`, () => {
    test('should return undefined if no profile exists', () => {
      expect(selectors.avatarUrl(undefined)).toBeUndefined();
    });

    test('should return correct url if profile exists', () => {
      const mockProfile = { emailHash: '123' };
      const state = reducer(undefined, actions.profile.received(mockProfile));

      expect(selectors.avatarUrl(state)).toEqual(
        'https://secure.gravatar.com/avatar/123?d=mm&s=55'
      );
    });
  });

  describe(`userTheme`, () => {
    test('should return default theme if no profile exists', () => {
      expect(selectors.userTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
    });

    test('should return correct theme when set.', () => {
      const theme = 'my theme';
      const state = reducer(undefined, actions.setTheme(theme));

      expect(selectors.userTheme(state)).toEqual(theme);
    });
  });

  describe(`filter`, () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.filter(undefined, 'key')).toEqual({});
      expect(selectors.filter({}, 'key')).toEqual({});
    });

    test('should return filter when match found.', () => {
      const testFilter = { key: 'abc', take: 5 };
      const state = reducer(
        undefined,
        actions.patchFilter('testFilter', testFilter)
      );

      expect(selectors.filter(state, 'testFilter')).toEqual(testFilter);
    });
  });
});
