/* global describe, test, expect */
import { deepClone } from 'fast-json-patch';
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';

const defaultValue = {};
const flowId = 'flowId-1234';
const resourceId = 'export-1234';
const sampleOpenErrorsNextPageURL = '/api/flows/5f0847269db9010a525ccaf3/5f0847f76da99c0abdacb623/errors?startAtErrorId=1224231279';
const sampleResolvedErrorsNextPageURL = '/api/flows/5f0847269db9010a525ccaf3/5f0847f76da99c0abdacb623/resolved?startAtErrorId=1245728763';
const openErrors = [
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924456',
  },
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924457',
  },
  {
    message: '"entry point("dfv") is not a function"',
    errorId: '986924459',
  },
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924460',
  },
];

const resolvedErrors = [
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924455',
  },
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924454',
  },
  {
    message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
    errorId: '986924458',
  },
];

const errorStateWithoutActions = {
  [flowId]: {
    [resourceId]: {
      open: {
        status: 'received',
        errors: openErrors,
        nextPageURL: sampleOpenErrorsNextPageURL,
        outdated: true,
        updated: true,
      },
      resolved: {
        status: 'received',
        errors: resolvedErrors,
        nextPageURL: sampleResolvedErrorsNextPageURL,
        outdated: true,
        updated: true,
      },
      actions: {},
    },
  },
};

const errorStateWithActions = {
  [flowId]: {
    [resourceId]: {
      open: {
        status: 'received',
        errors: openErrors,
        nextPageURL: sampleOpenErrorsNextPageURL,
        outdated: true,
        updated: true,
      },
      resolved: {
        status: 'received',
        errors: resolvedErrors,
        nextPageURL: sampleResolvedErrorsNextPageURL,
        outdated: true,
        updated: true,
      },
      actions: {
        retry: {
          status: 'received',
          count: 44,
        },
        resolve: {
          status: 'received',
          count: 50,
        },
      },
    },
  },
};

describe(' Error details in EM 2.0 reducer ', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = {};
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual({});
  });
  test('should retain previous state when the flowId and resourceId are not supplied', () => {
    const prevState = {
      'flow-1234': {
        'export-111': {
          open: {},
          resolved: {},
          actions: {},
        },
      },
    };
    const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST});

    expect(currState).toEqual(prevState);
  });

  describe('FLOW_ERROR_DETAILS.REQUEST action', () => {
    test('should add error default state for flowId and resourceId with status as requested for open errors', () => {
      const prevState = {};
      const currStateForOpenErrors = reducer(prevState, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));
      const expectedStateForOpenErrors = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'requested',
            },
            resolved: {},
            actions: {},
          },
        },
      };

      expect(currStateForOpenErrors).toEqual(expectedStateForOpenErrors);
    });
    test('should add error default state for flowId and resourceId with status as requested for resolved errors ', () => {
      const prevState = {};
      const currStateForResolvedErrors = reducer(prevState, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
        isResolved: true,
      }));
      const expectedStateForResolvedErrors = {
        [flowId]: {
          [resourceId]: {
            open: {},
            resolved: {
              status: 'requested',
            },
            actions: {},
          },
        },
      };

      expect(currStateForResolvedErrors).toEqual(expectedStateForResolvedErrors);
    });
    test('should replace open errors existing state with status request and remove ui properties ( nextPageURL, updated, outdated ) on the state', () => {
      const prevState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              outdated: true,
              updated: true,
            },
            resolved: {},
            actions: {},
          },
        },
      };
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'requested',
              errors: openErrors,
            },
            resolved: {},
            actions: {},
          },
        },
      };
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));

      expect(currState).toEqual(expectedState);
    });
    test('should retain nextPageURL and updated property when loadMore is true for open errors', () => {
      const prevState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {},
            actions: {},
          },
        },
      };
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'requested',
              errors: openErrors,
            },
            resolved: {},
            actions: {},
          },
        },
      };
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));

      expect(currState).toEqual(expectedState);
    });
    test('should update state with requested state and update other properties incase of loadMore true for resolved errors', () => {
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'requested',
              errors: resolvedErrors,
            },
            actions: {},
          },
        },
      };
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
        isResolved: true,
      }));

      expect(currState).toEqual(expectedState);
    });
  });
  describe('FLOW_ERROR_DETAILS.RECEIVED action', () => {
    test('should update state properly without corrupting when errorDetails is undefined', () => {
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: [],
              nextPageURL: undefined,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {},
          },
        },
      };

      expect(reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails: undefined,
      }))).toEqual(expectedState);
    });
    test('should update state properly with passed open error details ', () => {
      const prevState = reducer({}, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: undefined,
            },
            resolved: {},
            actions: {},
          },
        },
      };

      expect(reducer(prevState, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails: { errors: openErrors},
      }))).toEqual(expectedState);
    });
    test('should update state properly with passed resolved error details', () => {
      const prevState = reducer({}, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
        isResolved: true,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {},
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: undefined,
            },
            actions: {},
          },
        },
      };

      expect(reducer(prevState, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        isResolved: true,
        errorDetails: { resolved: resolvedErrors},
      }))).toEqual(expectedState);
    });
    test('should add errors to existing list when loadMore is true incase of open/resolved errors', () => {
      const newNextPageURL = '/api/flows/5f0847269db9010a525ccaf3/5f0847f76da99c0abdacb623/errors?startAtErrorId=6543234567';
      const newErrors = [
        {

          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          traceKey: '12345676543',

          errorId: '65434567',
        },
      ];
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: [...openErrors, ...newErrors],
              nextPageURL: newNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {},
          },
        },
      };

      expect(reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        loadMore: true,
        errorDetails: { errors: newErrors, nextPageURL: newNextPageURL},
      }))).toEqual(expectedState);
    });
    test('should update nextPageURL to undefined when the current list does not have nextPageURL anymore', () => {
      const newErrors = [
        {

          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          errorId: '65434567',
        },
      ];
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: [...resolvedErrors, ...newErrors],
              nextPageURL: undefined,
              outdated: true,
              updated: true,
            },
            actions: {},
          },
        },
      };

      expect(reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        isResolved: true,
        loadMore: true,
        errorDetails: { resolved: newErrors },
      }))).toEqual(expectedState);
    });
  });
  describe('FLOW_ERROR_DETAILS.SELECT_ERRORS action', () => {
    test('should retain previous state when errorId list is empty/undefined', () => {
      expect(reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        checked: true,
      }))).toBe(errorStateWithoutActions);
      expect(reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        checked: true,
        isResolved: true,
      }))).toBe(errorStateWithoutActions);
    });
    test('should not effect the existing state when there are no errors but errorList is passed', () => {
      const initState = reducer({}, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));

      const prevState = reducer(initState, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails: undefined,
      }));

      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds: ['432123456', '234567654', '34567'],
      }));

      expect(currState).toBe(prevState);
    });
    test('should update selected property to checked property on the errors which have ids matching errorId list incase of both open/resovled errors', () => {
      const errorIdsToSelect = ['986924456', '986924457'];
      const checked = true;
      const expectedOpenErrors = [
        {
          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          errorId: '986924456',
          selected: checked,
        },
        {
          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          errorId: '986924457',
          selected: checked,
        },
        {
          message: '"entry point("dfv") is not a function"',
          errorId: '986924459',
        },
        {
          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          errorId: '986924460',
        },
      ];
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: expectedOpenErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: checked,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {},
          },
        },
      };
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds: errorIdsToSelect,
        checked,
      }));

      expect(currState).toEqual(expectedState);
    });
    test('should ignore ids from errorId list if they do not exist on the state for open/resolved errors', () => {
      const errorIdsToSelect = ['213444', '23456', '6543'];
      const openErrorsCurrState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds: errorIdsToSelect,
      }));
      const resolvedErrorsCurrState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.selectErrors({
        flowId,
        resourceId,
        errorIds: errorIdsToSelect,
      }));

      expect(openErrorsCurrState).toBe(errorStateWithoutActions);
      expect(resolvedErrorsCurrState).toBe(errorStateWithoutActions);
    });
  });
  describe('FLOW_ERROR_DETAILS.REMOVE action', () => {
    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: openErrors,
            nextPageURL: sampleOpenErrorsNextPageURL,
          },
          resolved: {
            status: 'received',
            errors: resolvedErrors,
            nextPageURL: sampleResolvedErrorsNextPageURL,
          },
          actions: {},
        },
      },
    };

    test('should retain previous list if there are no errorIds passed to remove and outdated property is not updated to true', () => {
      expect(reducer(sampleErrorState, actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
      }))).toBe(sampleErrorState);
    });
    test('should remove the matched ids from errorId list and update outdated to true', () => {
      const updatedErrors = [
        {
          message: '"entry point("dfv") is not a function"',
          errorId: '986924459',
        },
        {
          message: '"rules[0] has maxOccurrence: 2 but, source data has 20 repetitions at: root"',
          errorId: '986924460',
        },
      ];
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: updatedErrors,
              outdated: true,
              nextPageURL: sampleOpenErrorsNextPageURL,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
            },
            actions: {},
          },
        },
      };
      const errorIds = ['986924456', '986924457', '986924459 '];

      expect(reducer(sampleErrorState, actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        errorIds,
      }))).toEqual(expectedState);
    });
    test('should not update state if the state of error list is already empty ', () => {
      const initState = reducer({}, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));

      const prevState = reducer(initState, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails: undefined,
      }));

      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        errorIds: ['986924456', '986924457', '986924459'],
      }));

      expect(currState).toEqual(prevState);
    });
    test('should not update outdated to true if at least one of the errors is not removed', () => {
      const initState = reducer({}, actions.errorManager.flowErrorDetails.request({
        flowId,
        resourceId,
      }));

      const prevState = reducer(initState, actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails: { errors: openErrors},
      }));
      const invalidErrorIds = ['543234567', '7654345'];
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.remove({
        flowId,
        resourceId,
        errorIds: invalidErrorIds,
      }));

      expect(currState).toEqual(prevState);
    });
  });
  describe('FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST action', () => {
    test('should retain existing state when retry action state does not exist', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.retry({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toBe(errorStateWithoutActions);
    });

    test('should update status as requested for retry action ', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'requested',
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update status as requested with no other properties like count updated', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'requested',
                count: 44,
              },
              resolve: {
                status: 'received',
                count: 50,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });

  describe('FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST action', () => {
    test('should retain existing state when resolve action state does not exist', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.resolve({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toBe(errorStateWithoutActions);
    });
    test('should update status as requested for resolve action ', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              resolve: {
                status: 'requested',
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update status as requested with no other properties like count updated', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'received',
                count: 44,
              },
              resolve: {
                status: 'requested',
                count: 50,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.RECEIVED action', () => {
    test('should retain existing state when resolve action state does not exist', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.resolveReceived({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toBe(errorStateWithoutActions);
    });
    test('should update status as received for resolved action and resolved count', () => {
      const prevState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      }));
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.resolveReceived({
        flowId,
        resourceId,
        resolveCount: 10,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              resolve: {
                status: 'received',
                count: 10,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should add passed resolved count to the existing count with status received ', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.resolveReceived({
        flowId,
        resourceId,
        resolveCount: 10,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'received',
                count: 44,
              },
              resolve: {
                status: 'received',
                count: 60,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should not update count if the passed resolvedCount is not a number', () => {
      const prevState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      }));
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.resolveReceived({
        flowId,
        resourceId,
        resolveCount: 'INVALID_COUNT',
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              resolve: {
                status: 'received',
                count: undefined,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('FLOW_ERROR_DETAILS.ACTIONS.RETRY.RECEIVED action', () => {
    test('should retain existing state when retry action state does not exist', () => {
      const currState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.retryReceived({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toBe(errorStateWithoutActions);
    });
    test('should update status as received for retry action and retry count', () => {
      const prevState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      }));
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.retryReceived({
        flowId,
        resourceId,
        retryCount: 10,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'received',
                count: 10,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should add passed retry count to the existing count with status received ', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.retryReceived({
        flowId,
        resourceId,
        retryCount: 10,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'received',
                count: 54,
              },
              resolve: {
                status: 'received',
                count: 50,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should not update count if the passed retryCount is not a number', () => {
      const prevState = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      }));
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.retryReceived({
        flowId,
        resourceId,
        retryCount: 'INVALID_COUNT',
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              nextPageURL: sampleOpenErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              nextPageURL: sampleResolvedErrorsNextPageURL,
              outdated: true,
              updated: true,
            },
            actions: {
              retry: {
                status: 'received',
                count: undefined,
              },
            },
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('FLOW_ERROR_DETAILS.ACTIONS.RETRY.TRACK_RETRIED_TRACE_KEYS action', () => {
    const errorStateWithTraceKeys = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: openErrors,
            nextPageURL: sampleOpenErrorsNextPageURL,
            outdated: true,
            updated: true,
          },
          resolved: {
            status: 'received',
            errors: resolvedErrors,
            nextPageURL: sampleResolvedErrorsNextPageURL,
            outdated: true,
            updated: true,
          },
          actions: {
            retry: {
              status: 'received',
              count: 44,
              traceKeys: ['tk1234', 'tk5678'],
            },
            resolve: {
              status: 'received',
              count: 50,
            },
          },
        },
      },
    };

    test('should retain existing state when retry action state does not exist', () => {
      const currState1 = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: ['traceKey1234'],
      }));
      const currState2 = reducer(errorStateWithoutActions, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
        traceKeys: ['traceKey1234'],
      }));

      expect(currState1).toBe(errorStateWithoutActions);
      expect(currState2).toBe(errorStateWithoutActions);
    });
    test('should retain existing state when traceKeys are empty or already exist', () => {
      const currState1 = reducer(errorStateWithTraceKeys, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: [],
      }));
      const currState2 = reducer(errorStateWithTraceKeys, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: ['tk1234'],
      }));

      expect(currState1).toBe(errorStateWithTraceKeys);
      expect(currState2).toEqual(errorStateWithTraceKeys);
    });
    test('should update state with passed traceKeys', () => {
      const currState1 = reducer(errorStateWithTraceKeys, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: ['tk111'],
      }));
      const currState2 = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.trackTraceKeys({
        flowId,
        resourceId,
        traceKeys: ['tk111'],
      }));

      const updatedStateWithTraceKeys1 = deepClone(errorStateWithTraceKeys);
      const updatedStateWithTraceKeys2 = deepClone(errorStateWithTraceKeys);

      updatedStateWithTraceKeys1[flowId][resourceId].actions.retry.traceKeys = ['tk1234', 'tk5678', 'tk111'];
      updatedStateWithTraceKeys2[flowId][resourceId].actions.retry.traceKeys = ['tk111'];

      expect(currState1).toEqual(updatedStateWithTraceKeys1);
      expect(currState2).toEqual(updatedStateWithTraceKeys2);
    });
  });

  describe('FLOW_ERROR_DETAILS.NOTIFY_UPDATE action', () => {
    const errorStateBeforeNotification = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'received',
            errors: openErrors,
          },
          resolved: {
            status: 'received',
            errors: resolvedErrors,
          },
          actions: {},
        },
      },
    };

    test('should retain existing state when diff is not a number or undefined', () => {
      const currState = reducer(errorStateBeforeNotification, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId,
      }));

      expect(currState).toBe(errorStateBeforeNotification);
    });
    test('should retain existing state when corresponding state does not exist', () => {
      const currState = reducer(errorStateBeforeNotification, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toBe(errorStateBeforeNotification);
      const prevState = {};
      const currState2 = reducer(prevState, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId,
      }));

      expect(currState2).toBe(prevState);
    });
    test('should update updated property for resolved errors when error counts are reduced', () => {
      const currState = reducer(errorStateBeforeNotification, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId,
        diff: -5,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
              updated: true,
            },
            actions: {},
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update updated property for open errors when error counts are increased', () => {
      const currState = reducer(errorStateBeforeNotification, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId,
        diff: 5,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'received',
              errors: openErrors,
              updated: true,
            },
            resolved: {
              status: 'received',
              errors: resolvedErrors,
            },
            actions: {},
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should retain state when the corresponding open/resolved state is not yet received and there are no errors', () => {
      const prevState = {
        [flowId]: {
          [resourceId]: {
            open: {
              status: 'requested',
            },
            resolved: {},
            actions: {},
          },
        },
      };
      const currState = reducer(prevState, actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId,
        diff: 5,
      }));

      expect(currState).toBe(prevState);
    });
  });
  describe('FLOW_ERROR_DETAILS.CLEAR action', () => {
    test('should clear both open and resolved error details and also actions details', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.clear({
        flowId,
        resourceId,
      }));
      const expectedState = {
        [flowId]: {
          [resourceId]: {
            open: {},
            resolved: {},
            actions: currState[flowId][resourceId].actions,
          },
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should not corrupt existing state when the errorDetails state does not exist', () => {
      const currState = reducer(errorStateWithActions, actions.errorManager.flowErrorDetails.clear({
        flowId: 'INVALID_FLOWID',
        resourceId: 'INVALID_RESOURCEID',
      }));

      expect(currState).toEqual(errorStateWithActions);
    });
  });
});

describe('allResourceErrorDetails selector ', () => {
  test('should return default object if the state does not exist on any of the props are invalid', () => {
    expect(selectors.allResourceErrorDetails(undefined, {})).toEqual(defaultValue);
    expect(selectors.allResourceErrorDetails({}, { flowId, resourceId })).toEqual(defaultValue);
    expect(selectors.allResourceErrorDetails({}, { flowId, resourceId, isResolved: true })).toEqual(defaultValue);
  });
  test('should return the state error details open&resolved error details', () => {
    const expectedOpenErrors = {
      status: 'received',
      errors: openErrors,
      nextPageURL: sampleOpenErrorsNextPageURL,
      outdated: true,
      updated: true,
    };
    const expectedResolvedErrors = {
      status: 'received',
      errors: resolvedErrors,
      nextPageURL: sampleResolvedErrorsNextPageURL,
      outdated: true,
      updated: true,
    };

    expect(selectors.allResourceErrorDetails(errorStateWithActions, { flowId, resourceId })).toEqual(expectedOpenErrors);
    expect(selectors.allResourceErrorDetails(errorStateWithActions, { flowId, resourceId, isResolved: true })).toEqual(expectedResolvedErrors);
  });
});

describe('errorActionsContext selector', () => {
  test('should return default object for error actions if the state does not exist on any of the props are invalid', () => {
    expect(selectors.errorActionsContext(undefined, {})).toEqual(defaultValue);
    expect(selectors.errorActionsContext({}, { flowId, resourceId, actionType: 'retry' })).toEqual(defaultValue);
    expect(selectors.errorActionsContext({}, { flowId, resourceId, actionType: 'resolve' })).toEqual(defaultValue);
    expect(selectors.errorActionsContext(errorStateWithActions, { flowId, resourceId, actionType: 'INVALID_ACTION_TYPE' })).toEqual(defaultValue);
  });
  test('should return the state action details', () => {
    const expectedRetryContext = {
      status: 'received',
      count: 44,
    };
    const expectedResolveContext = {
      status: 'received',
      count: 50,
    };

    expect(selectors.errorActionsContext(errorStateWithActions, { flowId, resourceId, actionType: 'retry' })).toEqual(expectedRetryContext);
    expect(selectors.errorActionsContext(errorStateWithActions, { flowId, resourceId, actionType: 'resolve' })).toEqual(expectedResolveContext);
  });
});

describe('isAllErrorsSelected selector', () => {
  const sampleOpenErrors = [
    { errorId: '1234', selected: true },
    { errorId: '1111', selected: true },
    { errorId: '2222' },
  ];
  const sampleResolvedErrors = [
    { errorId: '3333', selected: true },
    { errorId: '4444', selected: true },
    { errorId: '5555' },
  ];
  const sampleErrorState = {
    [flowId]: {
      [resourceId]: {
        open: {
          status: 'received',
          errors: sampleOpenErrors,
        },
        resolved: {
          status: 'received',
          errors: sampleResolvedErrors,
        },
      },
    },
  };

  test('should return false if the passed errorIds are undefined/empty', () => {
    expect(selectors.isAllErrorsSelected(errorStateWithActions, {})).toBeFalsy();
    expect(selectors.isAllErrorsSelected(errorStateWithActions, { flowId, resourceId })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(errorStateWithActions, { flowId, resourceId, isResolved: true })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(errorStateWithActions, { flowId, resourceId, errorIds: [] })).toBeFalsy();
  });
  test('should return false if state does not have open/resolved errors', () => {
    const sampleErrorState = {
      [flowId]: {
        [resourceId]: {
          open: {
            status: 'requested',
          },
          resolved: {
            status: 'requested',
          },
          actions: {},
        },
      },
    };

    expect(selectors.isAllErrorsSelected({}, { flowId, resourceId, isResolved: true })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(sampleErrorState, { flowId, resourceId, isResolved: true })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(sampleErrorState, { flowId, resourceId })).toBeFalsy();
  });
  test('should return false if all the passed errorIds are not selected ', () => {
    expect(selectors.isAllErrorsSelected(sampleErrorState, {
      flowId,
      resourceId,
      errorIds: ['1111', '2222'],
    })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(sampleErrorState, {
      flowId,
      resourceId,
      isResolved: true,
      errorIds: ['3333', '5555'],
    })).toBeFalsy();
    expect(selectors.isAllErrorsSelected(sampleErrorState, {
      flowId,
      resourceId,
      isResolved: true,
      errorIds: ['3333', '5555'],
    })).toBeFalsy();
  });
  test('should return true if all the errorIds in the state are selected', () => {
    expect(selectors.isAllErrorsSelected(sampleErrorState, {
      flowId,
      resourceId,
      errorIds: ['1111', '1234'],
    })).toBeTruthy();
    expect(selectors.isAllErrorsSelected(sampleErrorState, {
      flowId,
      resourceId,
      isResolved: true,
      errorIds: ['3333', '4444'],
    })).toBeTruthy();
  });
});

describe('isAnyActionInProgress selector', () => {
  const errorDetails = {
    open: {
      status: 'received',
      errors: [
        { errorId: '9999', message: 'retry failed'},
        { errorId: '8888', message: 'invalid hook', selected: true },
        { errorId: '7777', message: 'failed javascript hook', selected: true },
      ],
    },
    resolved: {
      status: 'received',
      errors: [
        { errorId: '1234', message: 'retry failed' },
        { errorId: '1111', message: 'invalid transform', selected: true },
        { errorId: '2222', message: 'failed transform', selected: true },
      ],
    },
  };

  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.isAnyActionInProgress({}, {})).toBeFalsy();
  });
  test('should return false if the actions does not exist', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {},
        },

      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId })).toBeFalsy();
  });
  test('should return false if neither of retry/resolve actions status is requested', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {
            retry: {
              status: 'received',
              count: 44,
            },
            resolve: {
              status: 'received',
              count: 50,
            },

          },
        },
      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId })).toBeFalsy();
  });
  test('should return true if either of retry/resolve actions status is requested', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {
            retry: {
              status: 'requested',
              count: 44,
            },
            resolve: {
              status: 'received',
              count: 50,
            },
          },
        },
      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId })).toBeTruthy();
  });
  test('should return true when actionType is passed as retry if retry action status is requested', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {
            retry: {
              status: 'requested',
              count: 44,
            },
            resolve: {
              status: 'received',
              count: 50,
            },
          },
        },
      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId, actionType: 'retry' })).toBeTruthy();
  });

  test('should return false when actionType is passed as resolve if resolve action status is not requested', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {
            retry: {
              status: 'requested',
              count: 44,
            },
            resolve: {
              status: 'received',
              count: 50,
            },
          },
        },
      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId, actionType: 'resolve' })).toBeFalsy();
  });
  test('should return false when actionType passed is invalid', () => {
    const sampleState = {
      [flowId]: {
        [resourceId]: {
          ...errorDetails,
          actions: {
            retry: {
              status: 'requested',
              count: 44,
            },
            resolve: {
              status: 'received',
              count: 50,
            },
          },
        },
      },
    };

    expect(selectors.isAnyActionInProgress(sampleState, { flowId, resourceId, actionType: 'INVALID_ACTION_TYPE' })).toBeFalsy();
  });
});

describe('hasResourceErrors selector', () => {

});

describe('isTraceKeyRetried selector', () => {

});

