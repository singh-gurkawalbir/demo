/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const integrationId = 'lcm-compare-123';

describe('lcm compare reducers', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const prevState = {};
    const newState = reducer(prevState, unknownAction);

    expect(newState).toEqual(prevState);
  });
});
describe('lcm compare selectors', () => {
  describe('COMPARE.PULL_REQUEST action', () => {
    test('should add status as requested for the passed integrationId', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'requested' },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.pullRequest(integrationId))).toEqual(currentState);
    });
    test('should update status as requested and retain data but remove error prop for the passed integrationId', () => {
      const prevState = {
        [integrationId]: { status: 'error', error: 'invalid int ID' },
      };
      const currentState = {
        [integrationId]: { status: 'requested' },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.pullRequest(integrationId))).toEqual(currentState);
    });
  });
  describe('COMPARE.RECEIVED_DIFF action', () => {
    const diff = {
      numConflicts: 0,
      merged: {
        import: {},
      },
      current: {
        import: {},
      },
    };

    test('should update status to received and also cloneFamily ', () => {
      const prevState = reducer({}, actions.integrationLCM.compare.pullRequest(integrationId));
      const currentState = {
        [integrationId]: { status: 'received', diff },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.receivedDiff(integrationId, diff))).toEqual(currentState);
    });
    test('should add empty state and update the props as expected', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'received', diff },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.receivedDiff(integrationId, diff))).toEqual(currentState);
    });
  });
  describe('COMPARE.RECEIVED_DIFF_ERROR action', () => {
    const error = 'invalid intID';

    test('should update status to error and also error passed ', () => {
      const prevState = reducer({}, actions.integrationLCM.compare.pullRequest(integrationId));
      const currentState = {
        [integrationId]: { status: 'error', error },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.receivedDiffError(integrationId, error))).toEqual(currentState);
    });
    test('should add empty state and update the props as expected', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'error', error },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.receivedDiffError(integrationId, error))).toEqual(currentState);
    });
  });
  describe('COMPARE.TOGGLE_EXPAND_ALL action', () => {
    test('should add expandAll property as true if there is no existing property', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { expandAll: true },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.toggleExpandAll(integrationId))).toEqual(currentState);
    });

    test('should toggle the value of expandAll if there is an existing expandAll property for the passed integrationId', () => {
      const prevState = {
        [integrationId]: {
          status: 'received',
          diff: {},
          expandAll: true,
        },
      };
      const currentState = {
        [integrationId]: {
          status: 'received',
          diff: {},
          expandAll: false,
        },
      };

      expect(reducer(prevState, actions.integrationLCM.compare.toggleExpandAll(integrationId))).toEqual(currentState);
    });
  });
  describe('COMPARE.CLEAR action', () => {
    const prevState = {
      [integrationId]: {
        status: 'received',
        diff: {},
        expandAll: true,
      },
      'int-lcm-111': { expandAll: true },
    };
    const currentState = {
      'int-lcm-111': { expandAll: true },
    };

    expect(reducer(prevState, actions.integrationLCM.compare.clear(integrationId))).toEqual(currentState);
  });
});

describe('lcm compare selectors ', () => {
  describe('isResourceComparisonInProgress selector', () => {
    test('should return false for all the cases where the status is not requested', () => {
      expect(selectors.isResourceComparisonInProgress()).toBeFalsy();
      expect(selectors.isResourceComparisonInProgress({})).toBeFalsy();
      expect(selectors.isResourceComparisonInProgress({}, integrationId)).toBeFalsy();
      expect(selectors.isResourceComparisonInProgress({ [integrationId]: { status: 'received', diff: {} }}, integrationId)).toBeFalsy();
      expect(selectors.isResourceComparisonInProgress({ [integrationId]: { status: 'error', error: 'invalid id' } }, integrationId)).toBeFalsy();
    });
    test('should return true when the status is requested', () => {
      expect(selectors.isResourceComparisonInProgress({ [integrationId]: { status: 'requested' } }, integrationId)).toBeTruthy();
    });
  });
  describe('hasReceivedResourceDiff selector', () => {
    test('should return false for all the cases for all the falsy use cases', () => {
      expect(selectors.hasReceivedResourceDiff()).toBeFalsy();
      expect(selectors.hasReceivedResourceDiff({})).toBeFalsy();
      expect(selectors.hasReceivedResourceDiff({}, integrationId)).toBeFalsy();
      expect(selectors.hasReceivedResourceDiff({ [integrationId]: { status: 'requested' }}, integrationId)).toBeFalsy();
      expect(selectors.hasReceivedResourceDiff({ [integrationId]: { status: 'error', error: 'invalid id' } }, integrationId)).toBeFalsy();
    });
    test('should return true if the diff is received', () => {
      expect(selectors.hasReceivedResourceDiff({ [integrationId]: { status: 'received', diff: {} } }, integrationId)).toBeTruthy();
    });
  });
  describe('revisionResourceDiff selector', () => {
    const diff = {
      numConflicts: 0,
      merged: {
        import: {},
      },
      current: {
        import: {},
      },
    };

    test('should return undefined incase of invalid params or no diff', () => {
      expect(selectors.revisionResourceDiff()).toBeUndefined();
      expect(selectors.revisionResourceDiff({})).toBeUndefined();
      expect(selectors.revisionResourceDiff({}, integrationId)).toBeUndefined();
      expect(selectors.revisionResourceDiff({ [integrationId]: { status: 'requested' }}, integrationId)).toBeUndefined();
      expect(selectors.revisionResourceDiff({ [integrationId]: { status: 'error', error: 'invalid id' } }, integrationId)).toBeUndefined();
    });
    test('should return diff from the state for the passed integrationID', () => {
      expect(selectors.revisionResourceDiff({ [integrationId]: { status: 'received', diff }}, integrationId)).toBe(diff);
    });
  });
  describe('revisionResourceDiffError selector', () => {
    test('should return undefined incase of invalid params or no diff error', () => {
      expect(selectors.revisionResourceDiffError()).toBeUndefined();
      expect(selectors.revisionResourceDiffError({})).toBeUndefined();
      expect(selectors.revisionResourceDiffError({}, integrationId)).toBeUndefined();
      expect(selectors.revisionResourceDiffError({ [integrationId]: { status: 'requested' }}, integrationId)).toBeUndefined();
      expect(selectors.revisionResourceDiffError({ [integrationId]: { status: 'received', diff: {} } }, integrationId)).toBeUndefined();
    });
    test('should return diff from the state for the passed integrationID', () => {
      const error = 'invalid ID';

      expect(selectors.revisionResourceDiffError({ [integrationId]: { status: 'error', error }}, integrationId)).toBe(error);
    });
  });
  describe('isDiffExpanded selector', () => {
    test('should return false incase of invalid params', () => {
      expect(selectors.isDiffExpanded()).toBeFalsy();
      expect(selectors.isDiffExpanded({})).toBeFalsy();
      expect(selectors.isDiffExpanded({}, integrationId)).toBeFalsy();
      expect(selectors.isDiffExpanded({ [integrationId]: { status: 'requested' }}, integrationId)).toBeFalsy();
      expect(selectors.isDiffExpanded({ [integrationId]: { status: 'received', diff: {} } }, integrationId)).toBeFalsy();
      expect(selectors.isDiffExpanded({ [integrationId]: { status: 'received', diff: {}, expandAll: false } }, integrationId)).toBeFalsy();
    });
    test('should return true incase expandAll value is true for the passed integrationID', () => {
      expect(selectors.isDiffExpanded({ [integrationId]: { status: 'received', diff: {}, expandAll: true } }, integrationId)).toBeTruthy();
    });
  });
});
