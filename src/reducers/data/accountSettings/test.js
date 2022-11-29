/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('session.data.accountSettings reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { 'new-1234': 'ab123' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('ACCOUNT_SETTINGS.RECEIVED action', () => {
    test('should store the data retention period and the status', () => {
      const accountSettings = {
        dataRetentionPeriod: 60,
      };
      const state = reducer(undefined, actions.accountSettings.received(accountSettings));
      const expected = {
        dataRetentionPeriod: 60,
        status: {
          accountSettings: 'received',
        },
      };

      expect(state).toEqual(expected);
    });
  });

  describe('areUserAccountSettingsLoaded selector', () => {
    test('should return false if account settings are not loaded.', () => {
      expect(selectors.areUserAccountSettingsLoaded(undefined)).toEqual(false);
    });
    test('should return true if account settings are loaded.', () => {
      const accountSettings = {
        dataRetentionPeriod: 60,
      };
      const state = reducer(undefined, actions.accountSettings.received(accountSettings));

      expect(selectors.areUserAccountSettingsLoaded(state)).toEqual(true);
    });
  });

  describe('dataRetentionPeriod selector', () => {
    test('should return undefined if account settings are not loaded.', () => {
      expect(selectors.dataRetentionPeriod(undefined)).toEqual(undefined);
    });
    test('should return dataRetentionPeriod if account settings are loaded.', () => {
      const accountSettings = {
        dataRetentionPeriod: 60,
      };
      const state = reducer(undefined, actions.accountSettings.received(accountSettings));

      expect(selectors.dataRetentionPeriod(state)).toEqual(60);
    });
  });
});
