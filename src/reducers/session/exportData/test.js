/* global describe, test, expect */
import reducer, { exportData } from '.';
import actions from '../../../actions';

describe('exportData reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  test('selector returns empty object on default store state', () => {
    expect(exportData(undefined, 'id')).toEqual({});
  });

  test('selector should convert key to string', () => {
    const state = reducer(
      undefined,
      actions.exportData.request('virtual', '42')
    );

    expect(exportData(state, 42)).toEqual({
      status: 'requested',
      data: [],
    });
  });

  test('selector returns empty object on non-existent key', () => {
    const state = reducer(
      undefined,
      actions.exportData.request('virtual', '42')
    );

    expect(exportData(state, 'id')).toEqual({});
  });

  test('should work in life cyle of one id', () => {
    const state = reducer(
      undefined,
      actions.exportData.request('virtual', '42')
    );

    expect(exportData(state, 42)).toEqual({
      status: 'requested',
      data: [],
    });
    const state2 = reducer(
      state,
      actions.exportData.receiveError('virtual', 42, 'oops')
    );

    expect(exportData(state2, 42)).toEqual({
      status: 'error',
      data: [],
      error: 'oops',
    });
    const state3 = reducer(state2, actions.exportData.request('virtual', 42));

    expect(exportData(state3, 42)).toEqual({
      status: 'requested',
      data: [],
    });
    const state4 = reducer(
      state3,
      actions.exportData.receive('virtual', 42, [1, 2, 3])
    );

    expect(exportData(state4, 42)).toEqual({
      status: 'received',
      data: [1, 2, 3],
    });
  });

  describe('request action', () => {
    test('should do basic reset', () => {
      const state = reducer(
        undefined,
        actions.exportData.request('virtual', '123')
      );

      expect(exportData(state, '123')).toEqual({
        status: 'requested',
        data: [],
      });
    });

    test('should convert id to string', () => {
      const state = reducer(
        undefined,
        actions.exportData.request('virtual', 123)
      );

      expect(exportData(state, 123)).toEqual({
        status: 'requested',
        data: [],
      });
    });
  });

  describe('receive action', () => {
    test('should update data', () => {
      const state = reducer(
        undefined,
        actions.exportData.receive('virtual', '123', [42])
      );

      expect(exportData(state, '123')).toEqual({
        status: 'received',
        data: [42],
      });
    });

    test('should convert id to string', () => {
      const state = reducer(
        undefined,
        actions.exportData.receive('virtual', 123, [42])
      );

      expect(exportData(state, '123')).toEqual({
        status: 'received',
        data: [42],
      });
      expect(exportData(state, 123)).toEqual({
        status: 'received',
        data: [42],
      });
    });
  });

  describe('receive error action', () => {
    test('should update data', () => {
      const state = reducer(
        undefined,
        actions.exportData.receiveError('virtual', '123', 'oops')
      );

      expect(exportData(state, '123')).toEqual({
        status: 'error',
        data: [],
        error: 'oops',
      });
    });

    test('should convert id to string', () => {
      const state = reducer(
        undefined,
        actions.exportData.receiveError('virtual', 123, 'oops')
      );

      expect(exportData(state, '123')).toEqual({
        status: 'error',
        data: [],
        error: 'oops',
      });
      expect(exportData(state, 123)).toEqual({
        status: 'error',
        data: [],
        error: 'oops',
      });
    });
  });
});
