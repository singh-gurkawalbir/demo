/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import { JOB_STATUS, JOB_TYPES } from '../../../../constants';

const defaultState = {};
const flowId = 'flow-1234';
const resourceId = 'export-1234';

const existingState = {
  [flowId]: {
    [resourceId]: {
      status: 'requested',
    },
  },
  'flow-1111': {
    'export-1111': {
      status: 'received',
      data: [],
    },
  },
  'flow-2222': {
    'export-2222': {
      status: 'received',
      data: [
        {
          _id: 'j1',
          type: JOB_TYPES.RETRY,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          triggeredBy: 'user1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.RETRY,
          status: JOB_STATUS.RETRYING,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          triggeredBy: 'user2',
        },
      ],
    },
  },
};

describe('Retry list data in EM 2.0 reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('RETRIES.REQUEST action', () => {
    test('should retain previous state if the flowId and resourceId does not exist', () => {
      const currState = reducer(defaultState, actions.errorManager.retries.request({}));

      expect(currState).toBe(defaultState);
    });

    test('should update status as requested against the resourceId passed for the flowId state', () => {
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            status: 'requested',
          },
        },
      };
      const currState = reducer(defaultState, actions.errorManager.retries.request({
        flowId,
        resourceId,
      }));

      expect(currState).toMatchObject(expectedState);
    });
    test('should replace the previous state if existed with status requested against the resourceId passed for the flowId state', () => {
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            status: 'requested',
          },
        },
        'flow-1111': {
          'export-1111': {
            status: 'received',
            data: [],
          },
        },
        'flow-2222': {
          'export-2222': {
            status: 'received',
            data: [
              {
                _id: 'j1',
                type: JOB_TYPES.RETRY,
                status: JOB_STATUS.COMPLETED,
                startedAt: '2019-08-11T10:50:00.000Z',
                numError: 1,
                numIgnore: 2,
                numPagesGenerated: 10,
                numResolved: 0,
                numSuccess: 20,
                triggeredBy: 'user1',
              },
              {
                _id: 'j2',
                type: JOB_TYPES.RETRY,
                status: JOB_STATUS.RETRYING,
                startedAt: '2019-08-11T10:50:00.000Z',
                numError: 1,
                numIgnore: 2,
                numPagesGenerated: 10,
                numResolved: 0,
                numSuccess: 20,
                triggeredBy: 'user2',
              },
            ],
          },
        },
      };
      const currState = reducer(existingState, actions.errorManager.retries.request({
        flowId,
        resourceId,
      }));

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRIES.RECEIVED action', () => {
    test('should retain previous state when flowId and resourceId is not passed or state does not exist for the that particular resource', () => {
      const currState = reducer(existingState, actions.errorManager.retries.received({}));

      expect(currState).toBe(existingState);
      const currState2 = reducer(existingState, actions.errorManager.retries.received({
        flowId: 'flow-1111',
        resourceId: 'export-1111',
        retries: [],
      }));

      expect(currState2).toBe(existingState);
    });
    test('should update status as received and update retries list ', () => {
      const prevState = reducer(defaultState, actions.errorManager.retries.request({
        flowId,
        resourceId,
      }));
      const retries = [
        {
          _id: 'j1',
          type: JOB_TYPES.RETRY,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          triggeredBy: 'user1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.RETRY,
          status: JOB_STATUS.RETRYING,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          triggeredBy: 'user2',
        },
      ];
      const currState = reducer(prevState, actions.errorManager.retries.received({
        flowId,
        resourceId,
        retries,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            status: 'received',
            data: retries,
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_STATUS.CLEAR action', () => {
    test('should retain previous state if the flowId and resourceId does not exist', () => {
      const currState = reducer(existingState, actions.errorManager.retries.clear({
        flowId: '1111',
        resourceId,
      }));

      expect(currState).toBe(existingState);
    });
    test('should update status against the resourceId passed for the flowId state', () => {
      const prevState = reducer(existingState, actions.errorManager.retries.request({
        flowId: 'flow-5678',
        resourceId: 'export-5678',
      }));
      const currState = reducer(prevState, actions.errorManager.retries.clear({
        flowId: 'flow-5678',
        resourceId: 'export-5678',
        status: 'success',
      }));
      const expectedState = {};

      expect(currState).toMatchObject(expectedState);
    });
  });
});

describe('retryListStatus selector', () => {
  test('should return undefined incase of no state or invalid props', () => {
    expect(selectors.retryListStatus()).toBeUndefined();
    expect(selectors.retryListStatus(defaultState)).toBeUndefined();
    expect(selectors.retryListStatus(defaultState, '1234', '5678')).toBeUndefined();
    expect(selectors.retryListStatus(existingState, '1234', '5678')).toBeUndefined();
  });
  test('should return retry list status of the passed flowId and resourceId', () => {
    expect(selectors.retryListStatus(existingState, flowId, resourceId)).toEqual('requested');
  });
});

describe('retryList selector', () => {
  test('should return undefined incase of no state or invalid props', () => {
    expect(selectors.retryList()).toEqual([]);
    expect(selectors.retryList(defaultState)).toEqual([]);
    expect(selectors.retryList(defaultState, '1234', '5678', {})).toEqual([]);
    expect(selectors.retryList(existingState, '1234', '5678', {})).toEqual([]);
  });
  test('should return retry list for the passed flowId and resourceId', () => {
    expect(selectors.retryList(existingState, 'flow-2222', 'export-2222')).toEqual([
      {
        _id: 'j1',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'user1',
        doneExporting: true,
        numPagesProcessed: 0,
        uiStatus: JOB_STATUS.COMPLETED,
      },
      {
        _id: 'j2',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.RETRYING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'user2',
        doneExporting: false,
        numPagesProcessed: 0,
        uiStatus: JOB_STATUS.RETRYING,
      },
    ]);
  });
  test('should return retry list for the passed flowId, resourceId and filters', () => {
    expect(selectors.retryList(existingState, 'flow-2222', 'export-2222', {
      selectedUsers: ['user1'],
    })).toEqual([
      {
        _id: 'j1',
        type: JOB_TYPES.RETRY,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        triggeredBy: 'user1',
        doneExporting: true,
        numPagesProcessed: 0,
        uiStatus: JOB_STATUS.COMPLETED,
      },
    ]);
  });
});

