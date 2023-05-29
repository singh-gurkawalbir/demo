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
    };

    const nextState = reducer(initialState, action);

    expect(nextState.connectionResponse).toEqual(response);
    expect(nextState.status).toEqual('received');
  });

  test('should handle actionTypes.CONNECTIONTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.CONNECTIONTRENDS.REQUEST,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('requested');
  });
});

describe('selectors', () => {
  test('should return true for selectors.isConnectionTrendComplete when status is "received"', () => {
    const state = { status: 'received' };
    const isConnectionTrendComplete = selectors.isConnectionTrendComplete(state);

    expect(isConnectionTrendComplete).toBe(true);
  });

  test('should return the connectionResponse for selectors.connectionTrends', () => {
    const connectionResponse = 'mockConnectionResponse';
    const state = { connectionResponse };
    const result = selectors.connectionTrends(state);

    expect(result).toEqual(connectionResponse);
  });
});
