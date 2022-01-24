/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../../actions/types';
import { JOB_STATUS, JOB_TYPES } from '../../../../utils/constants';

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

  describe('RUN_HISTORY.RECEIVED_FAMILY action', () => {
    const jobFamilyJ2 = {
      _id: 'j2',
      _flowId: 'f2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
      startedAt: '2019-08-11T10:50:00.000Z',
      numError: 1,
      numIgnore: 2,
      numPagesGenerated: 10,
      numResolved: 0,
      numSuccess: 20,
      _integrationId: 'i1',
      children: [
        {
          type: JOB_TYPES.EXPORT,
          status: JOB_STATUS.COMPLETED,
        },
        {
          type: JOB_TYPES.IMPORT,
          status: JOB_STATUS.COMPLETED,
        },
        {
          type: JOB_TYPES.IMPORT,
          status: JOB_STATUS.RUNNING,
        },
      ],
    };

    test('should retain previous state if the passed job is null or undefined ', () => {
      const prevState = {
        [flowId]: {
          status: 'received',
          data: [],
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED_FAMILY });

      expect(currState).toBe(prevState);
    });
    test('should update job family when job family is received ', () => {
      const prevState = {
        f2: {
          status: 'received',
          data: [{
            _id: 'j2',
            _flowId: 'f2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
            startedAt: '2019-08-11T10:50:00.000Z',
            numError: 1,
            numIgnore: 2,
            numPagesGenerated: 10,
            numResolved: 0,
            numSuccess: 20,
            _integrationId: 'i1'}],
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED_FAMILY, job: jobFamilyJ2 });

      const expectedState = {f2: {data: [{
        _flowId: 'f2',
        _id: 'j2',
        _integrationId: 'i1',
        numPagesProcessed: 0,
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        startedAt: '2019-08-11T10:50:00.000Z',
        status: 'running',
        type: 'flow',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            _flowId: 'f2',
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numResolved: 0,
            numSuccess: 0,
            _integrationId: 'i1',
            numPagesProcessed: 0,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            _flowId: 'f2',
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numResolved: 0,
            numSuccess: 0,
            _integrationId: 'i1',
            numPagesProcessed: 0,

          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
            _flowId: 'f2',
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
            numResolved: 0,
            numSuccess: 0,
            _integrationId: 'i1',
          },
        ],
      }],
      status: 'received'}};

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

