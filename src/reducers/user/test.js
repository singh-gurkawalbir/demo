/* global describe, test, expect */
import actions from '../../actions';
import { ACCOUNT_IDS } from '../../utils/constants';
import reducer, * as selectors from '.';

describe('user selectors', () => {
  describe('accountOwner', () => {
    test('should return correct account owner info for an org owner', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
        },
        'some action'
      );

      expect(selectors.accountOwner(state)).toEqual({
        email: 'something@test.com',
        name: 'First Last',
      });
    });
    test('should return correct account owner info for an org user', () => {
      const state = reducer(
        {
          profile: { email: 'something@test.com', name: 'First Last' },
          preferences: { defaultAShareId: 'ashare1' },
          org: {
            accounts: [
              {
                _id: 'ashare1',
                ownerUser: {
                  email: 'owner@test.com',
                  name: 'owner 1',
                },
              },
            ],
          },
        },
        'some action'
      );

      expect(selectors.accountOwner(state)).toEqual({
        email: 'owner@test.com',
        name: 'owner 1',
      });
    });
  });
  describe('accountSummary', () => {
    test('should return [] if state is undefined', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.accountSummary(state)).toEqual([]);
    });
    describe('should return correct account summary for owner', () => {
      test('should return correct summary when the license has sandbox subscription', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: true,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when the license has sandbox subscription and environment is sandbox', () => {
        const state = reducer(
          {
            preferences: {
              defaultAShareId: ACCOUNT_IDS.OWN,
              environment: 'sandbox',
            },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: true,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when the license has no sandbox subscription', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: ACCOUNT_IDS.OWN },
            org: {
              accounts: [
                {
                  _id: ACCOUNT_IDS.OWN,
                  ownerUser: {
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: ACCOUNT_IDS.OWN,
            hasSandbox: false,
            selected: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
    });
    describe('should return correct account summary for org user', () => {
      test('should return correct summary when no environment set', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: 'ashare1' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    name: 'Owner Two',
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: 'ashare1',
            hasSandbox: true,
            company: 'Company One',
            canLeave: true,
            selected: true,
            hasConnectorSandbox: false,
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            canLeave: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
      test('should return correct summary when environment is sandbox', () => {
        const state = reducer(
          {
            preferences: { defaultAShareId: 'ashare2', environment: 'sandbox' },
            org: {
              accounts: [
                {
                  _id: 'ashare1',
                  accepted: true,
                  ownerUser: {
                    company: 'Company One',
                    licenses: [
                      { _id: 'license1', type: 'integrator', sandbox: true },
                    ],
                  },
                },
                {
                  _id: 'ashare2',
                  accepted: true,
                  ownerUser: {
                    name: 'Owner Two',
                    licenses: [{ _id: 'license1', type: 'integrator' }],
                  },
                },
              ],
            },
          },
          'some action'
        );

        expect(selectors.accountSummary(state)).toEqual([
          {
            id: 'ashare1',
            hasSandbox: true,
            company: 'Company One',
            canLeave: true,
            hasConnectorSandbox: false,
          },
          {
            id: 'ashare2',
            hasSandbox: false,
            selected: true,
            canLeave: true,
            hasConnectorSandbox: false,
          },
        ]);
      });
    });
  });

  describe('user theme selectors', () => {
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

  describe('editor theme selector', () => {
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
