import actionTypes from '../../actions/types';
import reducer, { selectors } from './index';

describe('reducer', () => {
  test('should handle actionTypes.DASHBOARD.RECEIVED', () => {
    const initialState = {};
    const response = 'mockResponse';
    const action = {
      type: actionTypes.DASHBOARD.RECEIVED,
      response,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.dashboardResponse).toEqual(response);
    expect(nextState.status).toBe('received');
  });

  test('should handle actionTypes.DASHBOARD.REQUEST', () => {
    const initialState = {};
    const action = {
      type: actionTypes.DASHBOARD.REQUEST,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('requested');
  });

  test('should handle actionTypes.DASHBOARD.POST_PREFERENCE', () => {
    const initialState = {};
    const action = {
      type: actionTypes.DASHBOARD.POST_PREFERENCE,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.DASHBOARD.PREFERENCE_POSTED', () => {
    const initialState = {};
    const response = 'mockResponse';
    const action = {
      type: actionTypes.DASHBOARD.PREFERENCE_POSTED,
      response,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('succeeded');
    expect(nextState.dashboardResponse).toEqual(response);
    expect(nextState.error).toBeNull();
  });

  test('should handle actionTypes.DASHBOARD.PREFERENCE_POST_FAILED', () => {
    const initialState = {};
    const error = 'mockError';
    const action = {
      type: actionTypes.DASHBOARD.PREFERENCE_POST_FAILED,
      error,
    };

    const nextState = reducer(initialState, action);

    expect(nextState.status).toBe('failed');
    expect(nextState.error).toEqual(error);
  });
});

describe('selectors', () => {
  test('should return true for selectors.isAPICallComplete when status is "received"', () => {
    const state = { status: 'received' };
    const isAPICallComplete = selectors.isAPICallComplete(state);

    expect(isAPICallComplete).toBe(true);
  });

  test('should return the layoutData for selectors.layoutData', () => {
    const layoutData = 'mockLayoutData';
    const state = { dashboardResponse: [{ layouts: layoutData }] };
    const result = selectors.layoutData(state);

    expect(result).toEqual(layoutData);
  });

  test('should return the graphData for selectors.graphData', () => {
    const graphData = 'mockGraphData';
    const state = { dashboardResponse: [{ graphTypes: graphData }] };
    const result = selectors.graphData(state);

    expect(result).toEqual(graphData);
  });

  test('should return the getData for selectors.getData', () => {
    const data = 'mockData';
    const state = { dashboardResponse: [{ data }] };
    const result = selectors.getData(state);

    expect(result.data).toEqual(data);
  });

  test('should return the errorMessage for selectors.errorMessage', () => {
    const error = 'mockError';
    const state = { error };
    const result = selectors.errorMessage(state);

    expect(result).toEqual(error);
  });
});
