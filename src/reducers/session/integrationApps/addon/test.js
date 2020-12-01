/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined})).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer({}, { type: 'RANDOM_ACTION' })).toEqual({});
  });
});

describe('intetgrationApps addon reducer', () => {
  describe('integrationApps addon received install_status action', () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApp.isAddonInstallInprogress(true, 1)
      );

      expect(state).toEqual({
        1: { installInprogress: true },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const initialState = {
        3: { installInprogress: true },
        2: { installInprogress: true },
      };
      const state = reducer(
        initialState,
        actions.integrationApp.isAddonInstallInprogress(true, 1)
      );

      expect(state).toEqual({
        1: { installInprogress: true },
        2: { installInprogress: true },
        3: { installInprogress: true },
      });
    });
  });
});

describe('integrationApps addon selectors test cases', () => {
  describe('isAddOnInstallInProgress', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.isAddOnInstallInProgress(undefined, 'dummy')).toEqual(false);
      expect(selectors.isAddOnInstallInProgress(null, 'dummy')).toEqual(false);
      expect(selectors.isAddOnInstallInProgress('string', 'dummy')).toEqual(false);
      expect(selectors.isAddOnInstallInProgress()).toEqual(false);
      expect(selectors.isAddOnInstallInProgress(undefined, null)).toEqual(false);
      expect(selectors.isAddOnInstallInProgress({}, 123)).toEqual(false);
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = true;
      const state = reducer(
        {},
        actions.integrationApp.isAddonInstallInprogress(true, 1)
      );

      expect(selectors.isAddOnInstallInProgress(state, 1)).toEqual(expectedData);
    });
    test('should return correct data when a matching id is not found.', () => {
      const expectedData = false;

      expect(selectors.isAddOnInstallInProgress({1: 'dummyData'}, 1)).toEqual(expectedData);
    });
  });
});
