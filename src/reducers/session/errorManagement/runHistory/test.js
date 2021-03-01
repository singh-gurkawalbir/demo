/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../../actions/types';

const defaultState = {};

const flowId = 'flow-123';

const sampleHistory = [
  {type: 'flow', _exportId: 'id1', _flowId: flowId, status: 'completed'},
  {type: 'flow', _exportId: 'id2', _flowId: flowId, status: 'failed'},
  {type: 'flow', _exportId: 'id2', _flowId: flowId, status: 'cancelled'},
];

describe('runHistory in EM2.0 reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('RUN_HISTORY.REQUEST action', () => {
    test('should create new state if the passed flowId\'s does not exists and update status as requested', () => {
      const currState = reducer(defaultState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, flowId });
      const expectedState = {
        [flowId]: {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });

    test('should update status as requested for the passed flowId state if already exists', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, flowId });
      const expectedState = {
        [flowId]: {
          status: 'requested',
          data: [],
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('RUN_HISTORY.RECEIVED action', () => {
    test('should retain previous state if the passed flowId does exist ', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED, flowId: 'FLOW-456' });

      expect(currState).toBe(prevState);
    });
    test('should update status to received and data as passed runHistory ', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
      };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, flowId: 'flow-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED, flowId: 'flow-456', runHistory: sampleHistory });

      const expectedState = {
        ...prevState,
        'flow-456': {
          status: 'received',
          data: sampleHistory,
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update data as empty array when there is no run history passed', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
      };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST, flowId: 'flow-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED, flowId: 'flow-456' });

      const expectedState = {
        ...prevState,
        'flow-456': {
          status: 'received',
          data: [],
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('RUN_HISTORY.CLEAR action', () => {
    test('should clear the flowId\'s  state when the passed flowId\'s state exist ', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
        'flow-456': {
          status: 'requested',
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.CLEAR, flowId });

      const expectedState = {
        'flow-456': {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should retain previous state when passed invalid flowId', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
        'flow-456': {
          status: 'requested',
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.CLEAR, flowId: 'INVALID-FLOWID' });

      expect(currState).toBe(prevState);
    });
  });
});

describe('runHistory selectors', () => {
  describe('runHistoryContext selector', () => {
    const sampleState = {
      [flowId]: {
        status: 'received',
        data: [],
      },
      'flow-456': {
        status: 'requested',
      },
    };

    test('should return empty object incase of invalid flowId or no state exist for the passed flowId', () => {
      expect(selectors.runHistoryContext(sampleState, 'INVALID_FLOW_ID')).toEqual(defaultState);
      expect(selectors.runHistoryContext(sampleState)).toEqual(defaultState);
      expect(selectors.runHistoryContext(sampleState, 'flow-111')).toEqual(defaultState);
    });
    test('should return flowId\'s state  if exist ', () => {
      expect(selectors.runHistoryContext(sampleState, 'flow-456')).toEqual(sampleState['flow-456']);
      expect(selectors.runHistoryContext(sampleState, flowId)).toEqual(sampleState[flowId]);
    });
  });
});

