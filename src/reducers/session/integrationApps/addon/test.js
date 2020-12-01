/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
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
      expect(selectors.isAddOnInstallInProgress(undefined, 'dummy')).toEqual({installInprogress: false});
      expect(selectors.isAddOnInstallInProgress({}, 'dummy')).toEqual({installInprogress: false});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { installInprogress: true };
      const state = reducer(
        {},
        actions.integrationApp.isAddonInstallInprogress(true, 1)
      );

      expect(selectors.isAddOnInstallInProgress(state, 1)).toEqual(expectedData);
    });
  });
});
