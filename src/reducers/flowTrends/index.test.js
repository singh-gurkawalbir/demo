/* eslint-disable jest/prefer-to-be */
import actionTypes from '../../actions/types';
import reducer, { selectors } from './index';

describe('reducer', () => {
  test('should handle actionTypes.FLOWTRENDS.RECEIVED', () => {
    const initialState = {};
    const response = 'mockResponse';
    const action = {
      type: actionTypes.FLOWTRENDS.RECEIVED,
      response,
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.flowResponse).toEqual(response);
    expect(nextState.status).toEqual('success');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.FLOWTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.FLOWTRENDS.REQUEST,
      error: null,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toEqual('loading');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.FLOWTRENDS.FAILED', () => {
    const initialState = {};
    const error = 'mockError';
    const action = {
      type: actionTypes.FLOWTRENDS.FAILED,
      error,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toEqual('failure');
    expect(nextState.error).toEqual(error);
  });
});

describe('selectors', () => {
  test('should return true for selectors.flowTrend when status is "loading"', () => {
    const state = { status: 'loading' };
    const flowTrend = selectors.flowStatus(state);

    expect(flowTrend).toBe(true);
  });

  test('should return the flowResponse for selectors.flowTrendData', () => {
    const flowResponse = 'mockFlowResponse';
    const state = { flowResponse };
    const result = selectors.flowTrendData(state);

    expect(result).toEqual(flowResponse);
  });

  test('should return the error for selectors.flowErrorMessage', () => {
    const error = 'mockFlowResponse';
    const state = { error };
    const result = selectors.flowErrorMessage(state);

    expect(result).toEqual(error);
  });
});
