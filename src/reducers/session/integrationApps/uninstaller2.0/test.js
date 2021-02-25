/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer(123, { type: 'RANDOM_ACTION' })).toEqual(123);
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
  });

  describe('integrationApps uninstaller2.0 reducer', () => {
    let state = {};

    describe('INIT action', () => {
      test('should create an integrationId reference inside uninstaller2 state object', () => {
        const newState = reducer(
          undefined,
          actions.integrationApp.uninstaller2.init(
            '123'
          )
        );

        expect(newState).toEqual({123: {}});
      });
      test('should not affect any other integration id state', () => {
        state = {456: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.init(
            '123'
          )
        );

        state[123] = {};
        expect(newState).toEqual(state);
      });
    });

    describe('FAILED action', () => {
      test('should save error in state object', () => {
        state = {123: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.failed(
            '123',
            'some error msg'
          )
        );

        state[123].error = 'some error msg';
        expect(newState).toEqual(state);
      });
      test('should create state first if not exists and assign error', () => {
        const newState = reducer(
          undefined,
          actions.integrationApp.uninstaller2.failed(
            '123',
            'some error msg'
          )
        );

        state = {123: {error: 'some error msg'}};
        expect(newState).toEqual(state);
      });
      test('should not affect any other integration id state', () => {
        state = {123: {}, 456: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.failed(
            '123',
            'some error msg'
          )
        );

        state[123].error = 'some error msg';
        expect(newState).toEqual(state);
      });
    });

    describe('RECEIVED_STEPS action', () => {
      const uninstallSteps = [{type: 'form'}, {type: 'url'}];

      test('should update steps in the state', () => {
        state = {123: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.receivedSteps(
            '123',
            uninstallSteps
          )
        );

        state[123].steps = uninstallSteps;
        state[123].isFetched = true;
        expect(newState).toEqual(state);
      });
      test('should create state first if not exists and assign steps', () => {
        const newState = reducer(
          undefined,
          actions.integrationApp.uninstaller2.receivedSteps(
            '123',
            uninstallSteps
          )
        );

        state = {123: {steps: uninstallSteps, isFetched: true}};
        expect(newState).toEqual(state);
      });
      test('should not affect any other state', () => {
        state = {123: {}, 456: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.receivedSteps(
            '123',
            uninstallSteps
          )
        );

        state[123].steps = uninstallSteps;
        state[123].isFetched = true;
        expect(newState).toEqual(state);
      });
    });

    describe('CLEAR_STEPS action', () => {
      test('should delete the state in question', () => {
        state = {123: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.clearSteps(
            '123'
          )
        );

        delete state[123];
        expect(newState).toEqual(state);
      });
      test('should not affect any other state', () => {
        state = {123: {key: 'some value'}, 456: {key: 'value'}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.clearSteps(
            '123'
          )
        );

        delete state[123];
        expect(newState).toEqual(state);
      });
    });

    describe('UPDATE step action', () => {
      test('should update the state with the uncompleted step status', () => {
        state = {123: {steps: [{type: 'url', completed: false}]}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.updateStep(
            '123',
            'inProgress'
          )
        );

        state[123].steps[0].isTriggered = true;
        expect(newState).toEqual(state);
      });
      test('should not modify already completed steps', () => {
        state = {123: {steps: [{type: 'form', completed: true}, {type: 'hidden', completed: true}, {type: 'hidden', completed: false}]}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.updateStep(
            '123',
            'completed'
          )
        );

        state[123].steps[2].isTriggered = false;
        state[123].steps[2].completed = true;
        expect(newState).toEqual(state);
      });
      test('should do nothing if all steps are completed', () => {
        state = {123: {steps: [{type: 'form', completed: true}, {type: 'hidden', completed: true}]}};
        const newState = reducer(
          state,
          actions.integrationApp.uninstaller2.updateStep(
            '123',
            'reset'
          )
        );

        expect(newState).toEqual(state);
      });
    });
  });
});

describe('integrationApps selectors test cases', () => {
  describe('integrationApps uninstaller2.0 selectors', () => {
    describe('uninstall2Data', () => {
      test('should return empty state when no match found.', () => {
        expect(selectors.uninstall2Data(undefined, 'dummy')).toEqual({});
        expect(selectors.uninstall2Data({}, 'dummy')).toEqual({});
        expect(selectors.uninstall2Data(null, 'dummy')).toEqual({});
        expect(selectors.uninstall2Data(123, 'dummy')).toEqual({});
        expect(selectors.uninstall2Data(undefined, null)).toEqual({});
        expect(selectors.uninstall2Data({})).toEqual({});
        expect(selectors.uninstall2Data()).toEqual({});
      });

      test('should return correct state data when a match is found.', () => {
        const expectedData = { isFetched: true, steps: [{type: 'form'}, {type: 'url'}] };
        const newState = reducer(
          undefined,
          actions.integrationApp.uninstaller2.receivedSteps(
            '123',
            [{type: 'form'}, {type: 'url'}]
          )
        );

        expect(selectors.uninstall2Data(newState, '123')).toEqual(expectedData);
      });
    });
  });
});
