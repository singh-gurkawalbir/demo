/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(123, { type: 'RANDOM_ACTION' })).toEqual(123);
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
  });
});

describe('intetgrationApps installer reducer', () => {
  describe('integrationApps received oauth connection status action', () => {
    test('should find the integration with id and update connection details', () => {
      const state = reducer(
        {
          456: {
            dummy: 'data',
          },
        },
        actions.integrationApp.upgrade.installer.setOauthConnectionMode('connectionId', true, '123')
      );

      expect(state).toEqual({
        456: {
          dummy: 'data',
        },
        123: {
          connectionId: 'connectionId',
          openOauthConnection: true,
        },
      });
    });
  });
  describe('integrationApps received installer install_inProgress action', () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApp.upgrade.installer.updateStep(
          1,
          'installerFunction',
          'inProgress'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true },
      });
    });
    test('should find the integration with id and set isTriggered flag to true along with updated url if passed', () => {
      const state = reducer(
        {},
        actions.integrationApp.upgrade.installer.updateStep(
          1,
          'installerFunction',
          'inProgress',
          undefined,
          'https://newurl.com'
        )
      );

      expect(state).toEqual({
        1: { isTriggered: true, updatedUrl: 'https://newurl.com' },
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
        actions.integrationApp.upgrade.installer.updateStep(
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
        actions.integrationApp.upgrade.installer.updateStep(
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
        actions.integrationApp.upgrade.installer.updateStep(
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
        actions.integrationApp.upgrade.installer.updateStep(
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
        actions.integrationApp.upgrade.installer.updateStep(
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
        actions.integrationApp.upgrade.installer.completedStepInstall(
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
        actions.integrationApp.upgrade.installer.completedStepInstall(
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
  describe('v2integrationAppsInstaller', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.v2integrationAppsInstaller(undefined, 'dummy')).toEqual({});
      expect(selectors.v2integrationAppsInstaller({}, 'dummy')).toEqual({});
      expect(selectors.v2integrationAppsInstaller(null, 'dummy')).toEqual({});
      expect(selectors.v2integrationAppsInstaller('string', 'dummy')).toEqual({});
      expect(selectors.v2integrationAppsInstaller(123, 'dummy')).toEqual({});
      expect(selectors.v2integrationAppsInstaller({}, null)).toEqual({});
      expect(selectors.v2integrationAppsInstaller(undefined)).toEqual({});
      expect(selectors.v2integrationAppsInstaller({}, 123)).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { formMeta: undefined, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.upgrade.installer.updateStep(
          1,
          'installerFunction',
          'inProgress',
        )
      );

      expect(selectors.v2integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta.', () => {
      const expectedData = { formMeta: {a: 'a'}, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.upgrade.installer.updateStep(
          1,
          'installerFunction',
          'inProgress',
          {
            a: 'a',
          }
        )
      );

      expect(selectors.v2integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta and without installerFunction.', () => {
      const expectedData = { formMeta: {a: 'a'}, isTriggered: true };
      const newState = reducer(
        {},
        actions.integrationApp.upgrade.installer.updateStep(
          1,
          undefined,
          'inProgress',
          {
            a: 'a',
          }
        )
      );

      expect(selectors.v2integrationAppsInstaller(newState, 1)).toEqual(expectedData);
    });
  });

  describe('v2canOpenOauthConnection', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.v2canOpenOauthConnection(undefined, 'dummy')).toEqual({ openOauthConnection: false });
      expect(selectors.v2canOpenOauthConnection({}, 'dummy')).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection(null, 'dummy')).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection('string', 'dummy')).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection(123, 'dummy')).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection({}, null)).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection(undefined)).toEqual({openOauthConnection: false});
      expect(selectors.v2canOpenOauthConnection({}, 123)).toEqual({openOauthConnection: false});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = { openOauthConnection: true, connectionId: 'connectionId' };
      const newState = reducer(
        {},
        actions.integrationApp.upgrade.installer.setOauthConnectionMode(
          'connectionId',
          true,
          'integrationId',
        )
      );

      expect(selectors.v2canOpenOauthConnection(newState, 'integrationId')).toEqual(expectedData);
    });

    test('should return correct state data when a match is found with formMeta.', () => {
      const expectedData = { openOauthConnection: false, connectionId: 'connectionId' };
      const newState = reducer(
        {},
        actions.integrationApp.upgrade.installer.setOauthConnectionMode(
          'connectionId',
          false,
          'integrationId'
        )
      );

      expect(selectors.v2canOpenOauthConnection(newState, 'integrationId')).toEqual(expectedData);
    });
  });
});
