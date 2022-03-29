/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps utility reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer(123, { type: 'RANDOM_ACTION' })).toEqual(123);
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
  });

  describe('integrationApps utitlity reducer', () => {
    let state = {};

    describe('RECEIVED S3 RUN KEY action', () => {
      test('should create an integrationId reference inside uninstaller2 state object', () => {
        const newState = reducer(
          undefined,
          actions.integrationApp.utility.receivedS3Key({
            integrationId: '123',
            runKey: 'runKey',
          })
        );

        expect(newState).toEqual({123: { status: 'received', runKey: 'runKey'}});
      });
      test('should not affect any other integration id state', () => {
        state = {456: 'runkey2'};
        const newState = reducer(
          state,
          actions.integrationApp.utility.receivedS3Key({
            integrationId: '123',
            runKey: 'runKey',
          })
        );

        expect(newState).toEqual({
          456: 'runkey2',
          123: { status: 'received', runKey: 'runKey'},
        });
      });
    });

    describe('CLEAR action', () => {
      test('should correctly clear the runKey based on the integrationId', () => {
        state = {123: 'runKey'};
        const newState = reducer(
          state,
          actions.integrationApp.utility.clearRunKey(
            '123',
          )
        );

        expect(newState).toEqual({});
      });

      test('should not affect any other integration id state', () => {
        state = {123: 'runKey', 456: 'runKey1'};
        const newState = reducer(
          state,
          actions.integrationApp.utility.clearRunKey(
            '123',
          )
        );

        expect(newState).toEqual({456: 'runKey1'});
      });
    });
  });
});

describe('integrationApps utility selectors', () => {
  describe('integrationAppCustomTemplateRunKey', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.integrationAppCustomTemplateRunKey(undefined, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKey({}, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKey(123, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKey(undefined, null)).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKey({})).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKey()).toEqual();
    });

    test('should return correct state data when a match is found.', () => {
      const newState = reducer(
        undefined,
        actions.integrationApp.utility.receivedS3Key(
          {
            integrationId: '123',
            runKey: 'runKey1',
          }
        )
      );

      expect(selectors.integrationAppCustomTemplateRunKey(newState, '123')).toEqual('runKey1');
    });
  });

  describe('integrationAppCustomTemplateRunKeyStatus', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.integrationAppCustomTemplateRunKeyStatus(undefined, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKeyStatus({}, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKeyStatus(123, 'dummy')).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKeyStatus(undefined, null)).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKeyStatus({})).toEqual();
      expect(selectors.integrationAppCustomTemplateRunKeyStatus()).toEqual();
    });

    test('should return correct state data when a match is found.', () => {
      const newState = reducer(
        undefined,
        actions.integrationApp.utility.receivedS3Key(
          {
            integrationId: '123',
            runKey: 'runKey1',
          }
        )
      );

      expect(selectors.integrationAppCustomTemplateRunKeyStatus(newState, '123')).toEqual('received');
    });
    test('should return correct state data when a match is found.', () => {
      const newState = reducer(
        undefined,
        actions.integrationApp.utility.requestS3Key(
          {
            integrationId: '123',
          }
        )
      );

      expect(selectors.integrationAppCustomTemplateRunKeyStatus(newState, '123')).toEqual('requested');
    });
  });
});

