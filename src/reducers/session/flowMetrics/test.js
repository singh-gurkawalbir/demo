/* global describe, test, expect */
import each from 'jest-each';
import reducer, {selectors} from '.';
import actions from '../../../actions';
import {COMM_STATES} from '../../comms/networkComms';

const initialState = {
  id1: {
    status: COMM_STATES.LOADING,
  },
  id2: {
    status: COMM_STATES.SUCCESS,
    data: [],
  },
};
const parsedResponsedata = [
  {Year: '1997', Make: 'Ford', Model: 'E350', Length: '2.34'},
  {Year: '2000', Make: 'Mercury', Model: 'Cougar', Length: '2.38'},
];
const resourceType = 'rt1';
const resourceId = 'id3';

describe('flowMetrics status reducer', () => {
  const testCases = [
    ['should return state unaltered when resource id is undefined', undefined],
    ['should return state unaltered when resource id is null', null],
    ['should return state unaltered when resource id is empty', ''],
  ];

  each(testCases).test('%s', (name, resourceId) => {
    expect(reducer(initialState,
      actions.flowMetrics.request(resourceType, resourceId))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.received(resourceId, []))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.failed(resourceId))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.clear(resourceId))).toEqual(initialState);
  });

  test('should return original state on unknown action', () => {
    const unknownAction = { type: 'unknown', resourceId: 'id1' };

    expect(reducer(initialState,
      unknownAction)).toEqual(initialState);
  });

  test('should return correct state with status property set to requested on request action', () => {
    const expectedState = {
      id1: {
        status: COMM_STATES.LOADING,
      },
      id2: {
        status: COMM_STATES.SUCCESS,
        data: [],
      },
      id3: {
        status: COMM_STATES.LOADING,
      },
    };

    expect(reducer(initialState,
      actions.flowMetrics.request(resourceType, resourceId))).toEqual(expectedState);
  });

  test('should return correct state with status property set to received on received action', () => {
    const expectedState = {
      id1: {
        status: COMM_STATES.LOADING,
      },
      id2: {
        status: COMM_STATES.SUCCESS,
        data: [],
      },
      id3: {
        status: COMM_STATES.SUCCESS,
        data: parsedResponsedata,
      },
    };

    expect(reducer(initialState,
      actions.flowMetrics.received(resourceId, parsedResponsedata))).toEqual(expectedState);
  });

  test('should return correct state with status property set to failed on failed action', () => {
    const expectedState = {
      id1: {
        status: COMM_STATES.LOADING,
      },
      id2: {
        status: COMM_STATES.SUCCESS,
        data: [],
      },
      id3: {
        status: COMM_STATES.ERROR,
      },
    };

    expect(reducer(initialState,
      actions.flowMetrics.failed(resourceId))).toEqual(expectedState);
  });
  test('should return correct state by deleting resource entry on clear action', () => {
    const state = reducer(initialState,
      actions.flowMetrics.received(resourceId, parsedResponsedata));

    expect(reducer(state,
      actions.flowMetrics.clear(resourceId))).toEqual(initialState);
  });
});
describe('flowMetricsData selectors', () => {
  test('should return state correctly when valid ids are sent through', () => {
    const state = reducer(initialState, actions.flowMetrics.received(resourceId, parsedResponsedata));
    const expectedResponse = {
      status: COMM_STATES.SUCCESS,
      data: parsedResponsedata,
    };

    expect(selectors.flowMetricsData(state, resourceId)).toEqual(expectedResponse);
    expect(selectors.flowMetricsData(state, 'id1')).toEqual({
      status: COMM_STATES.LOADING,
    });
    expect(selectors.flowMetricsData(state, 'id2')).toEqual({
      status: COMM_STATES.SUCCESS,
      data: [],
    });
  });

  test('should return null correctly when invalid id is sent through the selector', () => {
    expect(selectors.flowMetricsData(initialState, null)).toEqual(null);
  });
  test('should return null correctly when valid id not in state is sent through the selector', () => {
    expect(selectors.flowMetricsData(initialState, 'missing_id')).toEqual(null);
  });
});

