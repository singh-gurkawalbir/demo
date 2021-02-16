/* global describe, test, expect */
import reducer from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({ });
  });
  describe('intetgrationApps settings reducer', () => {
    describe('integrationApps settings update action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { '1-2': { formSaveStatus: 'loading' } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {

          '1-2': { formSaveStatus: 'loading' },
          'integrationId-flowId': { formSaveStatus: 'loading' },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to false', () => {
        const state = reducer(
          { 'integrationId-flowId': { formSaveStatus: 'complete' } },
          actions.integrationApp.settings.update(
            'integrationId',
            'flowId',
            'storeId',
            null,
            'INCORRECT_FUNCTION_NAME'
          )
        );
        const expectedValue = {
          'integrationId-flowId': { formSaveStatus: 'loading' },
        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings submitComplete action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          { '1-2': { submitComplete: false } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {

          '1-2': { submitComplete: false },
          'integrationId-flowId': { formSaveStatus: 'complete' },

        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and set submitComplete flag to true', () => {
        const state = reducer(
          { 'integrationId-flowId': { formSaveStatus: 'loading' } },
          actions.integrationApp.settings.submitComplete({
            integrationId: 'integrationId',
            flowId: 'flowId',
          })
        );
        const expectedValue = {

          'integrationId-flowId': { formSaveStatus: 'complete' },

        };

        expect(state).toEqual(expectedValue);
      });
    });

    describe('integrationApps settings clear action', () => {
      test('should not affect the existing state when  update function  is called', () => {
        const state = reducer(
          {
            '1-2': { submitComplete: true },
            'integrationId-flowId': { submitComplete: true },
          },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {
          '1-2': { submitComplete: true },
        };

        expect(state).toEqual(expectedValue);
      });
      test('should find the key by integrationId and flowId passed and remove that key from store', () => {
        const state = reducer(
          { 'integrationId-flowId': { submitComplete: true } },
          actions.integrationApp.settings.clear('integrationId', 'flowId')
        );
        const expectedValue = {};

        expect(state).toEqual(expectedValue);
      });

      test('should not throw error if the key is not found', () => {
        const state = reducer(
          { 'integrationId-flowId': { submitComplete: true } },
          actions.integrationApp.settings.clear(
            'incorrect_integrationId',
            'flowId'
          )
        );
        const expectedValue = {
          'integrationId-flowId': { submitComplete: true },
        };

        expect(state).toEqual(expectedValue);
      });
    });
  });
});

