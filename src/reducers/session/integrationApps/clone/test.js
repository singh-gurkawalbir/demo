/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({ });
  });
  describe('intetgrationApps clone reducer', () => {
    describe('integrationApps receivedIntegrationClonedStatus action', () => {
      test('should find the integration with id and set isTriggered flag to true', () => {
        const state = reducer(
          {},
          actions.integrationApp.clone.receivedIntegrationClonedStatus(
            1,
            'integrationId',
            'errorMessage',
            false
          )
        );

        expect(state).toEqual({

          1: {
            integrationId: 'integrationId',
            isCloned: false,
            sandbox: false,
          },

        });
      });

      test('should find the integration with id and update it but should not affect any other integration in the session', () => {
        const integrationId = 1;
        const initialState = {

          1: { integrationId: 1 },
          2: { integrationId: 2 },

        };
        const state = reducer(
          initialState,
          actions.integrationApp.clone.receivedIntegrationClonedStatus(
            1,
            integrationId,
            'errorMessage',
            false
          )
        );

        expect(state).toEqual({
          1: {
            integrationId: 1,
            isCloned: false,
            sandbox: false,
          },
          2: { integrationId: 2 },
        });
      });
    });

    describe('integrationApps clone clearIntegrationClonedStatus action', () => {
      test('should find the integration with id and set isTriggered and verifying flag to true', () => {
        const state = reducer(
          {},
          actions.integrationApp.clone.clearIntegrationClonedStatus(
            1
          )
        );

        expect(state).toEqual({

          1: {
            integrationId: undefined,
            isCloned: false,
            sandbox: undefined,
          },

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
          actions.integrationApp.clone.clearIntegrationClonedStatus(
            integrationId,
          )
        );

        expect(state).toEqual({

          1: {
            integrationId: undefined,
            isCloned: false,
            sandbox: undefined,
          },
          2: { isTriggered: true},

        });
      });
    });
  });
});

describe('integrationApps selectors test cases', () => {
  describe('integrationApps clone selectors', () => {
    describe('integrationClonedDetails', () => {
      test('should return empty state when no match found.', () => {
        expect(selectors.integrationClonedDetails(undefined, 'dummy')).toEqual(
          {isCloned: false, integrationId: undefined}
        );
        expect(selectors.integrationClonedDetails({}, 'dummy')).toEqual({isCloned: false, integrationId: undefined});
      });

      test('should return correct state data when a match is found.', () => {
        const expectedData = { integrationId: 'integrationId', isCloned: false, sandbox: false};
        const newState = reducer(
          {},
          actions.integrationApp.clone.receivedIntegrationClonedStatus(
            1,
            'integrationId',
            'errorMessage',
            false
          )
        );

        expect(selectors.integrationClonedDetails(newState, 1)).toEqual(expectedData);
      });
    });
  });
});
