/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const revisionId = 'lcm-revision-123';

describe('lcm install step reducer test cases', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const prevState = {};
    const newState = reducer(prevState, unknownAction);

    expect(newState).toEqual(prevState);
  });
  describe('STEP.UPDATE action', () => {
    test('should update isTriggered true for in progress status', () => {
      const currentState = reducer(undefined, actions.integrationLCM.installSteps.updateStep(revisionId, 'inProgress'));
      const expectedState = {
        [revisionId]: {
          isTriggered: true,
        },
      };

      expect(currentState).toEqual(expectedState);
    });
    test('should update isTriggered and verifying true for verify status', () => {
      const currentState = reducer(undefined, actions.integrationLCM.installSteps.updateStep(revisionId, 'verify'));
      const expectedState = {
        [revisionId]: {
          isTriggered: true,
          verifying: true,
        },
      };

      expect(currentState).toEqual(expectedState);
    });
    test('should update isTriggered and verifying false for failed status', () => {
      const prevState = reducer(undefined, actions.integrationLCM.installSteps.updateStep(revisionId, 'verify'));
      const currentState = reducer(prevState, actions.integrationLCM.installSteps.updateStep(revisionId, 'failed'));
      const expectedState = {
        [revisionId]: {
          isTriggered: false,
          verifying: false,
        },
      };

      expect(currentState).toEqual(expectedState);
    });
  });
  describe('STEP.DONE action', () => {
    test('should remove existing step state for the passed revisionId', () => {
      const prevState = {
        'rev-12': { isTriggered: false },
        [revisionId]: {
          isTriggered: false,
          verifying: false,
        },
      };
      const expectedState = {
        'rev-12': { isTriggered: false },
      };
      const currentState = reducer(prevState, actions.integrationLCM.installSteps.completedStepInstall(revisionId));

      expect(currentState).toEqual(expectedState);
    });
  });
  describe('STEP.RECEIVED_OAUTH_CONNECTION_STATUS action', () => {
    test('should add passed openOauthConnection and connectionId to the revisionId state', () => {
      const openOauthConnection = true;
      const connectionId = 'con-123';

      expect(reducer({}, actions.integrationLCM.installSteps.setOauthConnectionMode({
        revisionId,
        connectionId,
        openOauthConnection,
      }))).toEqual({
        [revisionId]: {
          openOauthConnection,
          oAuthConnectionId: connectionId,
        },
      });
    });
  });
});

describe('lcm install step selector test cases', () => {
  describe('updatedRevisionInstallStep selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.updatedRevisionInstallStep()).toBeUndefined();
      expect(selectors.updatedRevisionInstallStep({})).toBeUndefined();
      expect(selectors.updatedRevisionInstallStep({}, revisionId)).toBeUndefined();
    });
    test('should return state against the passed revisionId', () => {
      const state = {
        'rev-12': { isTriggered: false },
        [revisionId]: {
          isTriggered: false,
          verifying: false,
        },
      };

      expect(selectors.updatedRevisionInstallStep(state, revisionId)).toBe(state[revisionId]);
      expect(selectors.updatedRevisionInstallStep(state, 'rev-12')).toBe(state['rev-12']);
    });
  });
  describe('revisionInstallStepOAuthConnectionId selector', () => {
    test('should return undefined incase of invalid or no connId', () => {
      expect(selectors.revisionInstallStepOAuthConnectionId()).toBeUndefined();
      expect(selectors.revisionInstallStepOAuthConnectionId({})).toBeUndefined();
      expect(selectors.revisionInstallStepOAuthConnectionId({}, revisionId)).toBeUndefined();
    });
    test('should return the oAuth for the revisionId passed', () => {
      const state = {
        [revisionId]: {
          openOauthConnection: true,
          oAuthConnectionId: 'con-1234',
        },
      };

      expect(selectors.revisionInstallStepOAuthConnectionId(state, revisionId)).toBe('con-1234');
    });
  });
  describe('hasOpenedOAuthRevisionInstallStep selector', () => {
    test('should return false incase of invalid or no connId', () => {
      expect(selectors.hasOpenedOAuthRevisionInstallStep()).toBeFalsy();
      expect(selectors.hasOpenedOAuthRevisionInstallStep({})).toBeFalsy();
      expect(selectors.hasOpenedOAuthRevisionInstallStep({}, revisionId)).toBeFalsy();
    });
    test('should return the oAuthConId for the revisionId passed', () => {
      const state = {
        [revisionId]: {
          openOauthConnection: true,
          oAuthConnectionId: 'con-1234',
        },
      };

      expect(selectors.hasOpenedOAuthRevisionInstallStep(state, revisionId)).toBeTruthy();
    });
  });
});

