/* eslint-disable jest/prefer-to-be */
import actionTypes from '../../actions/types';
import reducer, { selectors } from './index';

describe('reducer', () => {
  test('should handle actionTypes.USERTRENDS.RECEIVED', () => {
    const initialState = {};
    const response = 'mockResponse';
    const action = {
      type: actionTypes.USERTRENDS.RECEIVED,
      response,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.userResponse).toEqual(response);
    expect(nextState.status).toEqual('received');
  });

  test('should handle actionTypes.USERTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.USERTRENDS.REQUEST,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('requested');
  });
});

describe('selectors', () => {
  test('should return true for selectors.isUserTrendComplete when status is "received"', () => {
    const state = { status: 'received' };
    const isUserTrendComplete = selectors.isUserTrendComplete(state);

    expect(isUserTrendComplete).toBe(true);
  });

  test('should return the userResponse for selectors.userTrends', () => {
    const userResponse = 'mockUserResponse';
    const state = { userResponse };
    const result = selectors.userTrends(state);

    expect(result).toEqual(userResponse);
  });
});
