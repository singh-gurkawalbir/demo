/* global describe, test, expect */
import each from 'jest-each';
import reducer from '.';
import actions from '../../../actions';

const initialState = {
  id1: {
    status: 'requested',
  },
  id2: {
    status: 'received',
    data: [],
  },
};

describe.only('flowMetrics status reducer', () => {
  const resourceType = 'rt1';
  const resourceId = 'id3';
  const testCases = [
    ['should return state unaltered when resource id is undefined', undefined],
    ['should return state unaltered when resource id is null', null],
    ['should return state unaltered when resource id is empty', ''],
  ];

  each(testCases).test('%s', (name, resourceId) => {
    expect(reducer(initialState,
      actions.flowMetrics.request(resourceType, resourceId))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.received(resourceType, resourceId, []))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.failed(resourceType, resourceId))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flowMetrics.clear(resourceType, resourceId))).toEqual(initialState);
  });

  test.only('should return correct state with status property set to request on request action', () => {
    const expectedState = {
      id1: {
        status: 'requested',
      },
      id2: {
        status: 'received',
        data: [],
      },
      id3: {
        status: 'requested',
      },
    };

    expect(reducer(initialState,
      actions.flowMetrics.request(resourceType, resourceId))).toEqual(expectedState);
  });

  test.only('should return correct state with status property set to received on received action', () => {
    const expectedState = {
      id1: {
        status: 'requested',
      },
      id2: {
        status: 'received',
        data: [],
      },
      id3: {
        status: 'requested',
        data: 'SOME DATA TO CHANGE',
      },
    };

    expect(reducer(initialState,
      actions.flowMetrics.request(resourceType, resourceId))).toEqual(expectedState);
  });
});
/* describe('isSuiteScriptFlowOnOffInProgress selectors', () => {
  const ssLinkedConnectionId = 'c4';
  const _id = 'f4'; // _id is flow id
  const state = reducer(initialState, actions.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId, _id}));

  test('should return state correctly when valid ids are sent through', () => {
    expect(selectors.isSuiteScriptFlowOnOffInProgress(state, {ssLinkedConnectionId, _id})).toEqual(true);
  });

  test('should return false correctly when invalid ids are sent through the selector', () => {
    expect(selectors.isSuiteScriptFlowOnOffInProgress(state, {
    })).toEqual(false);
  });
});
*/
