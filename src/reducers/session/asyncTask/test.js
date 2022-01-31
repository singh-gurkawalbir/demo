/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';
import { FORM_SAVE_STATUS } from '../../../utils/constants';

describe('asyncTask reducers', () => {
  test('should return initial state when action is not matched and key does not exist', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should return initial state when action type is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION', key: 'key'});

    expect(state).toEqual({});
  });
  test('should return initial state if action does not have key', () => {
    const state = reducer(undefined, actions.asyncTask.start());

    expect({}).toEqual(state);
  });
  test('should return state with status as loading on start action', () => {
    const state = reducer(undefined, actions.asyncTask.start('key'));

    expect({key: {status: FORM_SAVE_STATUS.LOADING}}).toEqual(state);
  });
  test('should return state with status as loading on starting async task again', () => {
    const state = reducer(undefined, actions.asyncTask.start('key'));
    const successState = reducer(state, actions.asyncTask.success('key'));
    const startState = reducer(successState, actions.asyncTask.start('key'));

    expect({key: {status: FORM_SAVE_STATUS.LOADING}}).toEqual(startState);
  });
  test('should return initial state if asyncTask with given key does not exist in state for success action', () => {
    const state = reducer(undefined, actions.asyncTask.success('key'));

    expect({}).toEqual(state);
  });
  test('should return state with status as complete on success action', () => {
    const iniState = reducer(undefined, actions.asyncTask.start('key'));
    const state = reducer(iniState, actions.asyncTask.success('key'));

    expect({key: {status: FORM_SAVE_STATUS.COMPLETE}}).toEqual(state);
  });
  test('should return initial state if asyncTask with given key does not exist in state for failed action', () => {
    const state = reducer(undefined, actions.asyncTask.failed('key'));

    expect({}).toEqual(state);
  });
  test('should return state with status as failed on failed action', () => {
    const iniState = reducer(undefined, actions.asyncTask.start('key'));
    const state = reducer(iniState, actions.asyncTask.failed('key'));

    expect({key: {status: FORM_SAVE_STATUS.FAILED}}).toEqual(state);
  });
  test('should clear the state on clear action', () => {
    const iniState = reducer(undefined, actions.asyncTask.start('key'));
    const state = reducer(iniState, actions.asyncTask.clear('key'));

    expect({}).toEqual(state);
  });
});

describe('asyncTask selectors: ', () => {
  describe('asyncTaskStatus selector', () => {
    test('should not throw error for invalid arguments', () => {
      expect(selectors.asyncTaskStatus()).toBeUndefined();
      expect(selectors.asyncTaskStatus({})).toBeUndefined();
      expect(selectors.asyncTaskStatus(undefined, 'key')).toBeUndefined();
    });
    test('should return correct status for asyncTask with given key', () => {
      const state = reducer(undefined, actions.asyncTask.start('key'));

      expect(selectors.asyncTaskStatus(state, 'key')).toEqual(FORM_SAVE_STATUS.LOADING);
    });
  });
  describe('isAsyncTaskLoading selector', () => {
    test('should not throw error for invalid arguments', () => {
      expect(selectors.isAsyncTaskLoading()).toBeFalsy();
      expect(selectors.isAsyncTaskLoading({})).toBeFalsy();
      expect(selectors.isAsyncTaskLoading(undefined, 'key')).toBeFalsy();
    });
    test('should return true if asyncTask status is loading', () => {
      const state = reducer(undefined, actions.asyncTask.start('key'));

      expect(selectors.isAsyncTaskLoading(state, 'key')).toBeTruthy();
    });
    test('should return false if asyncTask status is not loading', () => {
      const state = reducer(undefined, actions.asyncTask.start('key'));
      const successState = reducer(state, actions.asyncTask.success('key'));

      expect(selectors.isAsyncTaskLoading(successState, 'key')).toBeFalsy();
    });
  });
});
