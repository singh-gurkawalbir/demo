/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const defaultState = {
  retryStatus: {},
  retryObjects: {},
};
const flowId = 'flow-1234';
const resourceId = 'export-1234';
const retryId = 'retry-1234';

const existingState = {
  retryStatus: {
    [flowId]: {
      [resourceId]: 'retrying',
    },
    'flow-1111': {
      'export-1111': 'success',
    },
    'flow-2222': {
      'export-2222': 'retrying',
    },
  },
  retryObjects: {
    [retryId]: {
      status: 'received',
      data: {
        test: 5,
      },
    },
    'retry-2222': {
      status: 'requested',
    },
    'retry-1111': {
      status: 'received',
      data: {
        users: [{ _id: '1111', name: 'user1' }, { _id: '2222', name: 'user2' }],
      },
    },
  },
};

describe('Retry data in EM 2.0 reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('RETRY_DATA.REQUEST action', () => {
    test('should retain previous state when retryID is not passed', () => {
      const currState = reducer(defaultState, actions.errorManager.retryData.request({
        flowId,
        resourceId,
      }));

      expect(currState).toBe(defaultState);
    });

    test('should update status as requested for retryID', () => {
      const expectedState = {
        retryObjects: {
          [retryId]: {
            status: 'requested',
          },
        },
      };
      const currState = reducer(defaultState, actions.errorManager.retryData.request({
        flowId,
        resourceId,
        retryId,
      }));

      expect(currState).toMatchObject(expectedState);
    });
    test('should replace the previous state if existed with status requested for the same retryID', () => {
      const expectedState = {
        retryObjects: {
          [retryId]: {
            status: 'requested',
          },
          'retry-2222': {
            status: 'requested',
          },
          'retry-1111': {
            status: 'received',
            data: {
              users: [{ _id: '1111', name: 'user1' }, { _id: '2222', name: 'user2' }],
            },
          },
        },
      };
      const currState = reducer(existingState, actions.errorManager.retryData.request({
        flowId,
        resourceId,
        retryId,
      }));

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_DATA.RECEIVED action', () => {
    test('should retain previous state when retryID is not passed or state does not exist for the retryID', () => {
      const currState = reducer(existingState, actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryData: {
          _id: '12345',
        },
      }));

      expect(currState).toBe(existingState);
      const currState2 = reducer(existingState, actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryId: 'retry-5678',
        retryData: {
          _id: '12345',
        },
      }));

      expect(currState2).toBe(existingState);
    });
    test('should update status as received and update retry data ', () => {
      const prevState = reducer(defaultState, actions.errorManager.retryData.request({
        flowId,
        resourceId,
        retryId,
      }));
      const currState = reducer(prevState, actions.errorManager.retryData.received({
        flowId,
        resourceId,
        retryId,
        retryData: {
          _id: '12345',
        },
      }));
      const expectedState = {
        retryObjects: {
          [retryId]: {
            status: 'received',
            data: {
              _id: '12345',
            },
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_DATA.RECEIVED_ERROR action', () => {
    test('should retain previous state when retryID is not passed or state does not exist for the retryID', () => {
      const currState = reducer(existingState, actions.errorManager.retryData.receivedError({
        flowId,
        resourceId,
        error: {
          message: 'Retry data does not exist',
        },
      }));

      expect(currState).toBe(existingState);
      const currState2 = reducer(existingState, actions.errorManager.retryData.receivedError({
        flowId,
        resourceId,
        retryId: 'retry-5678',
        error: {
          message: 'Retry data does not exist',
        },
      }));

      expect(currState2).toBe(existingState);
    });
    test('should update status as error and update error ', () => {
      const prevState = reducer(defaultState, actions.errorManager.retryData.request({
        flowId,
        resourceId,
        retryId,
      }));
      const currState = reducer(prevState, actions.errorManager.retryData.receivedError({
        flowId,
        resourceId,
        retryId,
        error: {
          message: 'Retry data does not exist',
        },
      }));
      const expectedState = {
        retryObjects: {
          [retryId]: {
            status: 'error',
            error: {
              message: 'Retry data does not exist',
            },
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
    test('should update status and error but retain the data if exists in the state previously ', () => {
      const currState = reducer(existingState, actions.errorManager.retryData.receivedError({
        flowId,
        resourceId,
        retryId,
        error: {
          message: 'Retry data does not exist',
        },
      }));
      const expectedState = {
        retryObjects: {
          [retryId]: {
            status: 'error',
            error: {
              message: 'Retry data does not exist',
            },
            data: {
              test: 5,
            },
          },
          'retry-2222': {
            status: 'requested',
          },
          'retry-1111': {
            status: 'received',
            data: {
              users: [{ _id: '1111', name: 'user1' }, { _id: '2222', name: 'user2' }],
            },
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_STATUS.REQUEST action', () => {
    test('should retain previous state if flow id is not passed or the state already defined', () => {
      const currState = reducer(existingState, actions.errorManager.retryStatus.request({
        flowId,
        resourceId,
      }));

      expect(currState).toBe(existingState);
      const currState2 = reducer(existingState, actions.errorManager.retryStatus.request({
        resourceId,
      }));

      expect(currState2).toBe(existingState);
    });
    test('should create default state for the passed flowID if there is none previously ', () => {
      const currState = reducer(existingState, actions.errorManager.retryStatus.request({
        flowId: 'flow-5678',
        resourceId: 'export-5678',
      }));
      const expectedState = {
        retryStatus: {
          [flowId]: {
            [resourceId]: 'retrying',
          },
          'flow-5678': {},
          'flow-1111': {
            'export-1111': 'success',
          },
          'flow-2222': {
            'export-2222': 'retrying',
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_STATUS.RECEIVED action', () => {
    test('should retain previous state if the flowId does not exist', () => {
      const currState = reducer(existingState, actions.errorManager.retryStatus.received({
        flowId: '1111',
        resourceId,
        status: 'success',
      }));

      expect(currState).toBe(existingState);
    });
    test('should update status against the resourceId passed for the flowId state', () => {
      const prevState = reducer(existingState, actions.errorManager.retryStatus.request({
        flowId: 'flow-5678',
        resourceId: 'export-5678',
      }));
      const currState = reducer(prevState, actions.errorManager.retryStatus.received({
        flowId: 'flow-5678',
        resourceId: 'export-5678',
        status: 'success',
      }));
      const expectedState = {
        retryStatus: {
          [flowId]: {
            [resourceId]: 'retrying',
          },
          'flow-5678': {
            'export-5678': 'success',
          },
          'flow-1111': {
            'export-1111': 'success',
          },
          'flow-2222': {
            'export-2222': 'retrying',
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
  describe('RETRY_STATUS.CLEAR action', () => {
    test('should retain previous state if the passed flowId does not exist', () => {
      const currState = reducer(existingState, actions.errorManager.retryStatus.clear());
      const currState2 = reducer(existingState, actions.errorManager.retryStatus.clear('flow-5678'));

      expect(currState).toBe(existingState);
      expect(currState2).toBe(existingState);
    });
    test('should clear flowId state if already exist', () => {
      const currState = reducer(existingState, actions.errorManager.retryStatus.clear(flowId));
      const expectedState = {
        retryStatus: {
          [flowId]: {},
          'flow-1111': {
            'export-1111': 'success',
          },
          'flow-2222': {
            'export-2222': 'retrying',
          },
        },
      };

      expect(currState).toMatchObject(expectedState);
    });
  });
});

describe('retryDataContext selector', () => {
  test('should return default object incase of no state or invalid props', () => {
    expect(selectors.retryDataContext()).toEqual({});
    expect(selectors.retryDataContext(defaultState)).toEqual({});
    expect(selectors.retryDataContext(defaultState, '1234')).toEqual({});
    expect(selectors.retryDataContext(existingState, '1234')).toEqual({});
  });
  test('should return target state of the passed retryId', () => {
    const expectedState = {
      status: 'received',
      data: {
        test: 5,
      },
    };

    expect(selectors.retryDataContext(existingState, retryId)).toEqual(expectedState);
  });
});

describe('retryStatus selector', () => {
  test('should return undefined incase of no state or invalid props', () => {
    expect(selectors.retryStatus()).toBeUndefined();
    expect(selectors.retryStatus(defaultState)).toBeUndefined();
    expect(selectors.retryStatus(defaultState, '1234', '5678')).toBeUndefined();
    expect(selectors.retryStatus(existingState, '1234', '5678')).toBeUndefined();
  });
  test('should return retry status of the passed flowId and resourceId', () => {
    expect(selectors.retryStatus(existingState, flowId, resourceId)).toEqual('retrying');
  });
});

