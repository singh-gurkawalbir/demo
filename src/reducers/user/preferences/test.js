/* global describe, test, expect */
import each from 'jest-each';
import reducer, { selectors } from '.';
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
            environment: 'production',
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
              123: {
                themeName: 'fancy',
              },
              345: {
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
            environment: 'production',
            defaultAShareId: '123',
            timeFormat: 'something else',
            dateFormat: 'test',
            accounts: {
              123: { themeName: 'blue' },
              345: { themeName: 'white' },
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
          environment: 'production',
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
      test('should return correct preferences object for pinnedIntegrations for account owner', () => {
        const newState = reducer(
          {
            defaultAShareId: ACCOUNT_IDS.OWN,
          },
          actions.user.preferences.pinIntegration('integration1')
        );

        expect(selectors.userOwnPreferences(newState)).toEqual(
          {dashboard: {pinnedIntegrations: ['integration1']}, defaultAShareId: 'own'}
        );
      });
      test('should return correct preferences object for pinnedIntegrations for shared account', () => {
        const newState = reducer(
          {
            defaultAShareId: '1',
            accounts: {1: {} },
          },
          actions.user.preferences.pinIntegration('integration1')
        );

        expect(selectors.userOwnPreferences(newState)).toEqual(
          {accounts: {1: {dashboard: {pinnedIntegrations: ['integration1']}}}, defaultAShareId: '1'}
        );
      });
      test('should return correct preferences object for unpinned integrations for account owner', () => {
        const newState = reducer(
          {
            defaultAShareId: ACCOUNT_IDS.OWN,
          },
          actions.user.preferences.pinIntegration('integration1')
        );
        const finalState = reducer(
          newState,
          actions.user.preferences.unpinIntegration('integration1')
        );

        expect(selectors.userOwnPreferences(finalState)).toEqual(
          {dashboard: {pinnedIntegrations: []}, defaultAShareId: 'own'}
        );
      });
      test('should return correct preferences object for unpinned integrations for shared account', () => {
        const newState = reducer(
          {
            defaultAShareId: '1',
            accounts: {1: {} },
          },
          actions.user.preferences.pinIntegration('integration1')
        );
        const finalState = reducer(
          newState,
          actions.user.preferences.unpinIntegration('integration1')
        );

        expect(selectors.userOwnPreferences(finalState)).toEqual(
          {accounts: {1: {dashboard: {pinnedIntegrations: []}}}, defaultAShareId: '1'}
        );
      });
    });
  });
  describe('user preferences selectors', () => {
    test('should generate nothing for payload in the preference update action', () => {
      const regularUserAccountPreferences = {};
      const receivedPreferencesAction = actions.resource.receivedCollection(
        'preferences',
        regularUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferencesAction);

      expect(selectors.userOwnPreferences(state)).toEqual({
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

      expect(selectors.userOwnPreferences(state)).toEqual({
        environment: 'production',
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

      expect(selectors.userOwnPreferences(state)).toEqual({
        environment: 'production',
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
          123: {
            themeName: 'fancy',
          },
        },
      };
      const receivedPreferences = actions.resource.received(
        'preferences',
        invitedUserAccountPreferences
      );
      const state = reducer(undefined, receivedPreferences);

      expect(selectors.userOwnPreferences(state)).toEqual({
        ...invitedUserAccountPreferences,
        dateFormat: defaultDateFormat,
        environment: 'production',
      });
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
