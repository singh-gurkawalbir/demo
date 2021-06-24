/* global describe, test, expect */
import { deepClone } from 'fast-json-patch';
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const defaultState = {};

const flowId = 'flow-1234';
const integrationId = 'integration-1234';
const lastErrorAt = new Date().toISOString();
const filledState = {
  [flowId]: {
    status: 'received',
    data: {
      e1: {
        _expOrImpId: 'e1',
        numError: 10,
        lastErrorAt,
      },
      e2: {
        _expOrImpId: 'e2',
        numError: 20,
      },
      i1: {
        _expOrImpId: 'i1',
        numError: 4,
        lastErrorAt,
      },
    },
  },
  'flow-5678': {
    status: 'received',
    data: {
      e3: {
        _expOrImpId: 'e3',
        numError: 10,
        lastErrorAt,
      },
      e4: {
        _expOrImpId: 'e4',
        numError: 30,
      },
      i2: {
        _expOrImpId: 'i2',
        numError: 7,
      },
    },
  },
  [integrationId]: {
    status: 'received',
    data: {
      f1: {
        flowId: 'f1',
        numError: 100,
      },
      f2: {
        flowId: 'f2',
        numError: 10,
      },
      f3: {
        flowId: 'f3',
        numError: 20,
      },
    },
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
            e1: {
              _expOrImpId: 'e1',
              numError: 10,
              lastErrorAt,
            },
            e2: {
              _expOrImpId: 'e2',
              numError: 20,
            },
            i1: {
              _expOrImpId: 'i1',
              numError: 4,
              lastErrorAt,
            },
          },
        },
        'flow-5678': {
          status: 'received',
          data: {
            e3: {
              _expOrImpId: 'e3',
              numError: 10,
              lastErrorAt,
            },
            e4: {
              _expOrImpId: 'e4',
              numError: 30,
            },
            i2: {
              _expOrImpId: 'i2',
              numError: 7,
            },
          },
        },
        [integrationId]: {
          status: 'received',
          data: {
            f1: {
              flowId: 'f1',
              numError: 100,
            },
            f2: {
              flowId: 'f2',
              numError: 10,
            },
            f3: {
              flowId: 'f3',
              numError: 20,
            },
          },
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
            e1: {
              _expOrImpId: 'e1',
              numError: 10,
            },
            e2: {
              _expOrImpId: 'e2',
              numError: 20,
            },
          },
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
            f1: {
              _flowId: 'f1',
              numError: 10,
            },
            f2: {
              _flowId: 'f2',
              numError: 20,
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
});

describe('openErrorsStatus selector', () => {
  test('should return undefined incase of invalid state or invalid resourceId passed', () => {
    expect(selectors.openErrorsStatus()).toBeUndefined();
    expect(selectors.openErrorsStatus(defaultState)).toBeUndefined();
    expect(selectors.openErrorsStatus(filledState, 'INVALID_RESOURCE_ID')).toBeUndefined();
  });
  test('should return proper status for the passed resourceId', () => {
    const requestedState = {
      [flowId]: {
        status: 'requested',
      },
    };

    expect(selectors.openErrorsStatus(filledState, flowId)).toEqual('received');
    expect(selectors.openErrorsStatus(requestedState, flowId)).toEqual('requested');
  });
});

describe('totalOpenErrors selector', () => {
  test('should return 0 incase of invalid state or invalid resourceId passed', () => {
    expect(selectors.totalOpenErrors()).toBe(0);
    expect(selectors.totalOpenErrors(defaultState)).toBe(0);
    expect(selectors.totalOpenErrors(filledState, 'INVALID_RESOURCE_ID')).toBe(0);
  });
  test('should return proper open error total for the passed resourceId', () => {
    expect(selectors.totalOpenErrors(filledState, flowId)).toBe(34);
    expect(selectors.totalOpenErrors(filledState, integrationId)).toBe(130);
  });
});

describe('openErrorsDetails selector', () => {
  test('should return undefined incase of invalid state or invalid resourceId passed', () => {
    expect(selectors.openErrorsDetails()).toBeUndefined();
    expect(selectors.openErrorsDetails(defaultState)).toBeUndefined();
    expect(selectors.openErrorsDetails(filledState, 'INVALID_RESOURCE_ID')).toBeUndefined();
  });
  test('should return proper error info for the passed resourceId', () => {
    expect(selectors.openErrorsDetails(filledState, flowId)).toBe(filledState[flowId].data);
    expect(selectors.openErrorsDetails(filledState, integrationId)).toBe(filledState[integrationId].data);
  });
});

describe('openErrorsMap selector', () => {
  test('should return default object incase of invalid state or invalid resourceId passed', () => {
    expect(selectors.openErrorsMap()).toEqual(defaultState);
    expect(selectors.openErrorsMap(defaultState)).toEqual(defaultState);
    expect(selectors.openErrorsMap(filledState, 'INVALID_RESOURCE_ID')).toEqual(defaultState);
  });
  test('should return proper error info for the passed resourceId', () => {
    const expectedFlowErrorMap = {
      e1: 10,
      e2: 20,
      i1: 4,
    };
    const expectedIntegrationErrorMap = {
      f1: 100,
      f2: 10,
      f3: 20,
    };

    expect(selectors.openErrorsMap(filledState, flowId)).toEqual(expectedFlowErrorMap);
    expect(selectors.openErrorsMap(filledState, integrationId)).toEqual(expectedIntegrationErrorMap);
  });
});
