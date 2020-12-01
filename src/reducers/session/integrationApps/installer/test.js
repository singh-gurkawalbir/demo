/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
});

describe('intetgrationApps installer reducer', () => {
  describe('integrationApps received installer install_inProgress action', () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'inProgress'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {

        1: { verifying: true },
        2: { isTriggered: true },

      };
      const state = reducer(
        initialState,
        actions.integrationApp.installer.updateStep(
          integrationId,
          'installerFunction',
          'inProgress'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true, verifying: true },
        2: { isTriggered: true },
      });
    });
  });

  describe('integrationApps installer install_verify action', () => {
    test('should find the integration with id and set isTriggered and verifying flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'verify'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true, verifying: true },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        1: {},
        2: { isTriggered: true },
      };
      const state = reducer(
        initialState,
        actions.integrationApp.installer.updateStep(
          integrationId,
          'installerFunction',
          'verify'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true, verifying: true },
        2: { isTriggered: true },
      });
    });
  });

  describe('integrationApps installer install_failed action', () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {
          1: { isTriggered: true },
        },
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'failed'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: false, verifying: false },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        1: { verifying: true },
        2: { isTriggered: true },
      };
      const state = reducer(
        initialState,
        actions.integrationApp.installer.updateStep(
          integrationId,
          'installerFunction',
          'failed'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: false, verifying: false },
        2: { isTriggered: true },
      });
    });
  });

  describe('integrationApps installer install_complete action', () => {
    test('should find the integration with id and reset the value', () => {
      const state = reducer(
        {
          1: { isTriggered: true },
        },
        actions.integrationApp.installer.completedStepInstall(
          { response: 's' },
          1,
          'installerFunction'
        )
      );

      expect(state).toEqual({
        1: {},
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        1: { verifying: true },
        2: { isTriggered: true },
      };
      const state = reducer(
        initialState,
        actions.integrationApp.installer.completedStepInstall(
          {},
          integrationId
        )
      );

      expect(state).toEqual({
        1: {},
        2: { isTriggered: true },
      });
    });
  });
});

describe('integrationApps installer selectors test cases', () => {
  describe('integrationAppsInstaller', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.integrationAppsInstaller(undefined, 'dummy')).toEqual(
        {}
      );
      expect(selectors.integrationAppsInstaller({}, 'dummy')).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { formMeta: undefined, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'inProgress',
        )
      );

      expect(selectors.integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta.', () => {
      const expectedData = { formMeta: {a: 'a'}, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.installer.updateStep(
          1,
          'installerFunction',
          'inProgress',
          {
            a: 'a',
          }
        )
      );

      expect(selectors.integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta and without installerFunction.', () => {
      const expectedData = { formMeta: {a: 'a'}, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.installer.updateStep(
          1,
          undefined,
          'inProgress',
          {
            a: 'a',
          }
        )
      );

      console.log('new state', newState);
      expect(selectors.integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });
  });

  describe('canOpenOauthConnection', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.canOpenOauthConnection(undefined, 'dummy')).toEqual(
        { openOauthConnection: false }
      );
      expect(selectors.canOpenOauthConnection({}, 'dummy')).toEqual({ openOauthConnection: false });
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { openOauthConnection: true, connectionId: 'connectionId' };
      const newState = reducer(
        {},
        actions.integrationApp.installer.setOauthConnectionMode(
          'connectionId',
          true,
          'integrationId',
        )
      );

      expect(selectors.canOpenOauthConnection(newState, 'integrationId')).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta.', () => {
      const expectedData = { openOauthConnection: false, connectionId: 'connectionId' };
      const newState = reducer(
        {},
        actions.integrationApp.installer.setOauthConnectionMode(
          'connectionId',
          false,
          'integrationId'
        )
      );

      expect(selectors.canOpenOauthConnection(newState, 'integrationId')).toEqual(expectedData);
    });
  });
});
