/* global describe, test, expect */
import each from 'jest-each';
import reducer, * as selectors from './';
import actions from '../../../actions';
import {
  ACCOUNT_IDS,
  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER,
} from '../../../utils/constants';

describe('user reducers', () => {
  const defaultDateFormat = 'MM/DD/YYYY';
  const defaultTimeFormat = 'h:mm:ss a';

  describe('setting theme in preferences reducer', () => {
    describe('should set the right theme using the preferences action', () => {
      test('should set the theme on first dispatch', () => {
        const themeName = 'fancy';
        const state = reducer(
          undefined,
          actions.user.preferences.update({ themeName })
        );

        expect(state.themeName).toEqual(themeName);
      });

      test('should replace theme on subsequent dispatches', () => {
        const themeName1 = 'fancy';
        const themeName2 = 'simple';
        let state;

        state = reducer(
          state,
          actions.user.preferences.update({ themeName: themeName1 })
        );
        expect(state.themeName).toEqual(themeName1);

        state = reducer(
          state,
          actions.user.preferences.update({ themeName: themeName2 })
        );
        expect(state.themeName).toEqual(themeName2);
      });
    });

    describe('Update preferences ', () => {
      describe('for various user account types', () => {
        test('should update the correct set of preferences when the user is an owner', () => {
          const ownerAccountPreferences = {
            defaultAShareId: ACCOUNT_IDS.OWN,
            timeFormat: 'something',
            themeName: 'fancy',
          };
          const receivedPreferences = actions.resource.received(
            'preferences',
            ownerAccountPreferences
          );
          const state = reducer(undefined, receivedPreferences);
          const updatePreferencePatch = actions.user.preferences.update({
            timeFormat: 'something else',
            themeName: 'blue',
          });
          const patchedState = reducer(state, updatePreferencePatch);

          expect(patchedState).toEqual({
            themeName: 'blue',
            defaultAShareId: ACCOUNT_IDS.OWN,
            timeFormat: 'something else',
            dateFormat: defaultDateFormat,
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
          const receivedPreferences = actions.resource.received(
            'preferences',
            invitedUserAccountPreferences
          );
          const state = reducer(undefined, receivedPreferences);
          const updatePreferencePatch = actions.user.preferences.update({
            defaultAShareId: '123',
            timeFormat: 'something else',
            dateFormat: 'test',
            themeName: 'blue',
          });
          const patchedState = reducer(state, updatePreferencePatch);

          expect(patchedState).toEqual({
            defaultAShareId: '123',
            timeFormat: 'something else',
            dateFormat: 'test',
            accounts: {
              '123': { themeName: 'blue' },
              '345': { themeName: 'white' },
            },
          });
        });
      });

      test('should update the preference for a preferences resource type', () => {
        const regularUserAccountPreferences = {
          themeName: 'fancy',
        };
        const receivedPreferences = actions.resource.received(
          'preferences',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, receivedPreferences);

        expect(state).toEqual({
          themeName: 'fancy',
          dateFormat: defaultDateFormat,
          timeFormat: defaultTimeFormat,
        });
      });

      test('should not update preferences for any other resource type', () => {
        const regularUserAccountPreferences = {
          themeName: 'fancy',
        };
        const receivedPreferences = actions.resource.received(
          'someOtherResouceType',
          regularUserAccountPreferences
        );
        const state = reducer(undefined, receivedPreferences);

        expect(state).toEqual({ environment: 'production' });
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

      expect(selectors.userPreferences(state)).toEqual({
        environment: 'production',
      });
    });

    test('should generate the correct set of preferences when the user is a regular account holder without invited users and not an owner', () => {
      const regularUserAccountPreferences = {
        themeName: 'fancy',
        timeFormat: 'something',
      };
      const receivedPreferencesAction = actions.resource.received(
        'preferences',
        regularUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferencesAction);

      expect(selectors.userPreferences(state)).toEqual({
        themeName: 'fancy',
        timeFormat: 'something',
        dateFormat: defaultDateFormat,
      });
    });

    test('should generate the correct set of preferences when the user is an owner', () => {
      const ownerAccountPreferences = {
        defaultAShareId: ACCOUNT_IDS.OWN,
        timeFormat: 'something',
        themeName: 'fancy',
      };
      const receivedPreferences = actions.resource.received(
        'preferences',
        ownerAccountPreferences
      );
      const state = reducer(undefined, receivedPreferences);

      expect(selectors.userPreferences(state)).toEqual({
        themeName: 'fancy',
        defaultAShareId: ACCOUNT_IDS.OWN,
        timeFormat: 'something',
        dateFormat: defaultDateFormat,
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
      const receivedPreferences = actions.resource.received(
        'preferences',
        invitedUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferences);

      expect(selectors.userPreferences(state)).toEqual({
        ...invitedUserAccountPreferences,
        dateFormat: defaultDateFormat,
      });
    });
  });

  describe(`user theme selectors`, () => {
    test('should return default theme if no profile exists', () => {
      expect(selectors.appTheme(undefined)).toEqual(selectors.DEFAULT_THEME);
    });

    test('should return correct theme when set.', () => {
      const theme = 'my theme';
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName: theme })
      );

      expect(selectors.appTheme(state)).toEqual(theme);
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
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName })
      );

      expect(selectors.editorTheme(state)).toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });

    test('should return correct editor theme when user theme set.', () => {
      const themeName = 'dark';
      const state = reducer(
        undefined,
        actions.user.preferences.update({ themeName })
      );

      expect(selectors.editorTheme(state)).not.toEqual(
        selectors.DEFAULT_EDITOR_THEME
      );
    });
  });
});
describe('accountShareHeader reducers', () => {
  const testCases = [];

  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER.forEach(path => {
    testCases.push([
      {},
      'account owner',
      `/${path}`,
      { defaultAShareId: ACCOUNT_IDS.OWN },
    ]);
  });
  testCases.push([
    {},
    'account owner',
    'any thing',
    { defaultAShareId: ACCOUNT_IDS.OWN },
  ]);
  PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER.forEach(path => {
    testCases.push([
      {},
      'org user',
      `/${path}`,
      { defaultAShareId: 'some thing' },
    ]);
  });

  ['/tiles', '/exports', 'any thing'].forEach(path => {
    testCases.push([
      { 'integrator-ashareid': 'some thing' },
      'org user',
      path,
      { defaultAShareId: 'some thing' },
    ]);
  });

  each(testCases).test(
    'should return %o for an %s when path is "%s"',
    (expected, userType, path, preferences) => {
      expect(selectors.accountShareHeader(preferences, path)).toEqual(expected);
    }
  );
});
