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
    expect(nextState.status).toEqual('received');
  });

  test('should handle actionTypes.FLOWTRENDS.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.FLOWTRENDS.REQUEST,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('requested');
  });
});

describe('selectors', () => {
  test('should return true for selectors.isFlowTrendComplete when status is "received"', () => {
    const state = { status: 'received' };
    const isFlowTrendComplete = selectors.isFlowTrendComplete(state);

    expect(isFlowTrendComplete).toBe(true);
  });

  test('should return the flowResponse for selectors.flowTrends', () => {
    const flowResponse = 'mockFlowResponse';
    const state = { flowResponse };
    const result = selectors.flowTrends(state);

    expect(result).toEqual(flowResponse);
  });
});
