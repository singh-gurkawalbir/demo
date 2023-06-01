/* eslint-disable jest/prefer-to-be */
import actionTypes from '../../actions/types';
import reducer, { selectors } from './index';

describe('reducer', () => {
  test('should handle actionTypes.CONNECTIONTRENDS.RECEIVED', () => {
    const initialState = {};
    const response = 'mockResponse';
    const action = {
      type: actionTypes.CONNECTIONTRENDS.RECEIVED,
      response,
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.connectionResponse).toEqual(response);
    expect(nextState.status).toEqual('success');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.CONNECTIONTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.CONNECTIONTRENDS.REQUEST,
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.CONNECTIONTRENDS.FAILED', () => {
    const initialState = {};
    const error = 'mockError';
    const action = {
      type: actionTypes.CONNECTIONTRENDS.FAILED,
      error,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toEqual('failure');
    expect(nextState.error).toEqual(error);
  });
});

describe('selectors', () => {
  test('should return true for selectors.isConnectionTrendComplete when status is "loading"', () => {
    const state = { status: 'loading' };
    const connectionStatus = selectors.connectionStatus(state);

    expect(connectionStatus).toBe(true);
  });

  test('should return the connectionResponse for selectors.connectionTrends', () => {
    const connectionResponse = 'mockConnectionResponse';
    const state = { connectionResponse };
    const result = selectors.connectionTrends(state);

    expect(result).toEqual(connectionResponse);
  });

  test('should return the error for selectors.connectionErrorMessage', () => {
    const error = 'mockConectionResponse';
    const state = { error };
    const result = selectors.connectionErrorMessage(state);

    expect(result).toEqual(error);
  });
});
