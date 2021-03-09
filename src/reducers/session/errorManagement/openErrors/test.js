/* global describe, test, expect */
import { deepClone } from 'fast-json-patch';
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const defaultState = {};

const flowId = 'flow-1234';
const integrationId = 'integration-1234';
const filledState = {
  [flowId]: {
    status: 'received',
    data: {
      e1: 11,
      e2: 20,
      i1: 4,
    },
    total: 35,
  },
  'flow-5678': {
    status: 'received',
    data: {
      e3: 10,
      e4: 30,
      i2: 7,
    },
    total: 47,
  },
  [integrationId]: {
    status: 'received',
    data: {
      f1: 100,
      f2: 10,
      f3: 20,
    },
    total: 130,
  },
  'integrationId-5678': {
    status: 'requested',
  },
};

describe('Flow Open errors info reducers for EM2.0 ', () => {
  test('should retain previous state if the action is invalid', () => {
    const currState = reducer(defaultState, { type: 'INVALID_ACTION'});

    expect(currState).toBe(defaultState);
  });
  describe('FLOW_OPEN_ERRORS.REQUEST action', () => {
    test('should retain previous state if there is no flowId', () => {
      const currState = reducer(filledState, actions.errorManager.openFlowErrors.request({}));

      expect(currState).toBe(filledState);
    });
    test('should add default state if not existed previously and update status as requested ', () => {
      const currState = reducer(defaultState, actions.errorManager.openFlowErrors.request({ flowId }));
      const expectedState = {
        [flowId]: {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should retain previous state if existed with data and update only status as requested', () => {
      const currState = reducer(filledState, actions.errorManager.openFlowErrors.request({ flowId }));
      const expectedState = {
        [flowId]: {
          status: 'requested',
          data: {
            e1: 11,
            e2: 20,
            i1: 4,
          },
          total: 35,
        },
        'flow-5678': {
          status: 'received',
          data: {
            e3: 10,
            e4: 30,
            i2: 7,
          },
          total: 47,
        },
        [integrationId]: {
          status: 'received',
          data: {
            f1: 100,
            f2: 10,
            f3: 20,
          },
          total: 130,
        },
        'integrationId-5678': {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('FLOW_OPEN_ERRORS.RECEIVED action', () => {
    test('should retain previous state if there is no flowId or if there is no state for the flowId', () => {
      const currState = reducer(defaultState, actions.errorManager.openFlowErrors.received({ }));
      const currState2 = reducer(filledState, actions.errorManager.openFlowErrors.received({ flowId: '1191' }));

      expect(currState).toBe(defaultState);
      expect(currState2).toBe(filledState);
    });
    test('should update status as received and add open errors info against the passed flowId', () => {
      const prevState = reducer(defaultState, actions.errorManager.openFlowErrors.request({ flowId }));
      const currState = reducer(prevState, actions.errorManager.openFlowErrors.received({ flowId,
        openErrors: {
          flowErrors: [
            {
              _expOrImpId: 'e1',
              numError: 10,
            },
            {
              _expOrImpId: 'e2',
              numError: 20,
            },
          ],
        } }));
      const expectedState = {
        [flowId]: {
          status: 'received',
          data: {
            e1: 10,
            e2: 20,
          },
          total: 30,
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('INTEGRATION_ERRORS.REQUEST action', () => {
    test('should retain previous state if there is no integrationId', () => {
      const currState = reducer(filledState, actions.errorManager.integrationErrors.request({}));

      expect(currState).toBe(filledState);
    });
    test('should add default state if not existed previously and update status as requested ', () => {
      const currState = reducer(defaultState, actions.errorManager.integrationErrors.request({ integrationId }));
      const expectedState = {
        [integrationId]: {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should retain previous state if existed with data and update only status as requested', () => {
      const currState = reducer(filledState, actions.errorManager.integrationErrors.request({ integrationId }));
      const expectedState = deepClone(filledState);

      expectedState[integrationId].status = 'requested';

      expect(currState).toEqual(expectedState);
    });
  });
  describe('INTEGRATION_ERRORS.RECEIVED action', () => {
    test('should retain previous state if there is no integrationId or if there is no state for the integrationId', () => {
      const currState = reducer(defaultState, actions.errorManager.integrationErrors.received({ }));
      const currState2 = reducer(filledState, actions.errorManager.integrationErrors.received({ integrationId: '1191' }));

      expect(currState).toBe(defaultState);
      expect(currState2).toBe(filledState);
    });
    test('should update status as received and add open errors info against the passed integrationId', () => {
      const prevState = reducer(defaultState, actions.errorManager.integrationErrors.request({ integrationId }));
      const currState = reducer(prevState, actions.errorManager.integrationErrors.received({ integrationId,
        integrationErrors: [
          {
            _flowId: 'f1',
            numError: 10,
          },
          {
            _flowId: 'f2',
            numError: 20,
          },
        ],
      }));
      const expectedState = {
        [integrationId]: {
          status: 'received',
          data: {
            f1: 10,
            f2: 20,
          },
          total: 30,
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
});

describe('errorMap selector', () => {
  test('should return default object incase of invalid state or invalid resourceId passed', () => {
    expect(selectors.errorMap()).toEqual(defaultState);
    expect(selectors.errorMap(defaultState)).toEqual(defaultState);
    expect(selectors.errorMap(filledState, 'INVALID_RESOURCE_ID')).toEqual(defaultState);
  });
  test('should return proper error info for the passed resourceId', () => {
    const expectedFlowState = {
      status: 'received',
      data: {
        e1: 11,
        e2: 20,
        i1: 4,
      },
      total: 35,
    };
    const expectedIntegrationState = {
      status: 'received',
      data: {
        f1: 100,
        f2: 10,
        f3: 20,
      },
      total: 130,
    };

    expect(selectors.errorMap(filledState, flowId)).toEqual(expectedFlowState);
    expect(selectors.errorMap(filledState, integrationId)).toEqual(expectedIntegrationState);
  });
});
