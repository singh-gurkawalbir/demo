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
    };

    const nextState = reducer(initialState, action);

    expect(nextState.flowResponse).toEqual(response);
    expect(nextState.status).toEqual('success');
  });

  test('should handle actionTypes.FLOWTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.FLOWTRENDS.REQUEST,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('loading');
  });
});

describe('selectors', () => {
  test('should return true for selectors.flowTrend when status is "loading"', () => {
    const state = { status: 'loading' };
    const flowTrend = selectors.flowTrend(state);

    expect(flowTrend).toBe(true);
  });

  test('should return the flowResponse for selectors.flowTrendData', () => {
    const flowResponse = 'mockFlowResponse';
    const state = { flowResponse };
    const result = selectors.flowTrendData(state);

    expect(result).toEqual(flowResponse);
  });
});
