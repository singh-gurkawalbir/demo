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
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.userResponse).toEqual(response);
    expect(nextState.status).toEqual('success');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.USERTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.USERTRENDS.REQUEST,
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toEqual('loading');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.USERTRENDS.FAILED', () => {
    const initialState = {};
    const error = 'mockError';
    const action = {
      type: actionTypes.USERTRENDS.FAILED,
      error,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toEqual('failure');
    expect(nextState.error).toEqual(error);
  });
});

describe('selectors', () => {
  test('should return true for selectors.isUserTrendComplete when status is "loading"', () => {
    const state = { status: 'loading' };
    const userStatus = selectors.userStatus(state);

    expect(userStatus).toBe(true);
  });

  test('should return the userResponse for selectors.userTrends', () => {
    const userResponse = 'mockUserResponse';
    const state = { userResponse };
    const result = selectors.userTrends(state);

    expect(result).toEqual(userResponse);
  });

  test('should return the error for selectors.userErrorMessage', () => {
    const error = 'mockUserResponse';
    const state = { error };
    const result = selectors.userErrorMessage(state);

    expect(result).toEqual(error);
  });
});
