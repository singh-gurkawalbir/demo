/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('recycleBin reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { 'new-1234': 'ab123' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  test('should set status property to requested correctly on restore action.', () => {
    const oldState = { };
    const expectedState = {
      status: 'requested',
    };
    const newState = reducer(oldState,
      actions.recycleBin.restore()
    );

    expect(newState).toEqual(expectedState);
  });

  test('should set status property to completed and redirectTo url correctly on restoreRedirectUrl action.', () => {
    const oldState = { };
    const expectedState = {
      status: 'completed',
      redirectTo: '/url',
    };
    const newState = reducer(oldState,
      actions.recycleBin.restoreRedirectUrl('/url')
    );

    expect(newState).toEqual(expectedState);
  });

  test('should clear state on restore clear action.', () => {
    const oldState = {
      status: 'completed',
      redirectTo: '/url1',
    };
    const expectedState = { };
    const newState = reducer(oldState,
      actions.recycleBin.restoreClear()
    );

    expect(newState).toEqual(expectedState);
  });
});

describe('recycleBin selectors', () => {
  describe('recycleBinState', () => {
    test('should return empty object when state is undefined.', () => {
      expect(selectors.recycleBinState(undefined, 'tempId')).toEqual({});
    });

    test('should return correct object with status and redirectTo properties.', () => {
      const oldState = { };
      const expectedState = {
        status: 'completed',
        redirectTo: '/url',
      };
      const newState = reducer(oldState,
        actions.recycleBin.restoreRedirectUrl('/url')
      );

      expect(selectors.recycleBinState(newState)).toEqual(expectedState);
    });
  });
});
