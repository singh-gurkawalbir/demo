/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const integrationId = 'lcm-int-123';

describe('lcm cloneFamily reducer', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const prevState = {};
    const newState = reducer(prevState, unknownAction);

    expect(newState).toEqual(prevState);
  });

  describe('CLONE_FAMILY.REQUEST action', () => {
    test('should add status as requested for the passed integrationId', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'requested' },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.request(integrationId))).toEqual(currentState);
    });
    test('should update status as requested and retain data but remove error prop for the passed integrationId', () => {
      const prevState = {
        [integrationId]: { status: 'error', error: 'invalid int ID' },
      };
      const currentState = {
        [integrationId]: { status: 'requested' },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.request(integrationId))).toEqual(currentState);
    });
  });
  describe('CLONE_FAMILY.RECEIVED action', () => {
    const cloneFamily = [
      {_id: '62342fe4bb1d123469e83eb5', name: 'Revision test  ( PROD )', sandbox: false},
      {_id: '6234302c363e683052fdb237', name: 'Revision test (change 1)  ( DEV )', sandbox: false},
    ];

    test('should update status to received and also cloneFamily ', () => {
      const prevState = reducer({}, actions.integrationLCM.cloneFamily.request(integrationId));
      const currentState = {
        [integrationId]: { status: 'received', cloneFamily },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily))).toEqual(currentState);
    });
    test('should add empty state and update the props as expected', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'received', cloneFamily },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily))).toEqual(currentState);
    });
  });
  describe('CLONE_FAMILY.RECEIVED_ERROR action', () => {
    const error = 'invalid intID';

    test('should update status to error and also error passed ', () => {
      const prevState = reducer({}, actions.integrationLCM.cloneFamily.request(integrationId));
      const currentState = {
        [integrationId]: { status: 'error', error },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.receivedError(integrationId, error))).toEqual(currentState);
    });
    test('should add empty state and update the props as expected', () => {
      const prevState = {};
      const currentState = {
        [integrationId]: { status: 'error', error },
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.receivedError(integrationId, error))).toEqual(currentState);
    });
  });
  describe('CLONE_FAMILY.CLEAR action', () => {
    test('should remove the existing state against the passed integrationId', () => {
      const prevState = {
        [integrationId]: { status: 'error', error: 'invalid id' },
        'lcm-int-456': { status: 'received', cloneFamily: []},
      };
      const currentState = {
        'lcm-int-456': { status: 'received', cloneFamily: []},
      };

      expect(reducer(prevState, actions.integrationLCM.cloneFamily.clear(integrationId))).toEqual(currentState);
    });
  });
});

describe('lcm cloneFamily selectors', () => {
  describe('cloneFamily selector', () => {
    test('should return undefined incase of invalid params or no cloneFamily', () => {
      expect(selectors.cloneFamily()).toBeUndefined();
      expect(selectors.cloneFamily({})).toBeUndefined();
      expect(selectors.cloneFamily({}, integrationId)).toBeUndefined();
      expect(selectors.cloneFamily({ [integrationId]: { status: 'requested' }}, integrationId)).toBeUndefined();
      expect(selectors.cloneFamily({ [integrationId]: { status: 'error', error: 'invalid id' } }, integrationId)).toBeUndefined();
    });
    test('should return cloneFamily for the passed integrationId', () => {
      const cloneFamily = [
        {_id: '62342fe4bb1d123469e83eb5', name: 'Revision test  ( PROD )', sandbox: false},
        {_id: '6234302c363e683052fdb237', name: 'Revision test (change 1)  ( DEV )', sandbox: false},
      ];
      const state = {
        [integrationId]: { status: 'received', cloneFamily: []},
        'lcm-int-789': { status: 'received', cloneFamily },
      };

      expect(selectors.cloneFamily(state, 'lcm-int-789')).toBe(cloneFamily);
    });
  });
  describe('isLoadingCloneFamily selector', () => {
    test('should return false for all the cases where the status is not requested', () => {
      expect(selectors.isLoadingCloneFamily()).toBeFalsy();
      expect(selectors.isLoadingCloneFamily({})).toBeFalsy();
      expect(selectors.isLoadingCloneFamily({}, integrationId)).toBeFalsy();
      expect(selectors.isLoadingCloneFamily({ [integrationId]: { status: 'received', cloneFamily: [] }}, integrationId)).toBeFalsy();
      expect(selectors.isLoadingCloneFamily({ [integrationId]: { status: 'error', error: 'invalid id' } }, integrationId)).toBeFalsy();
    });
    test('should return true if the status is requested for the passed integrationId', () => {
      expect(selectors.isLoadingCloneFamily({ [integrationId]: { status: 'requested' }}, integrationId)).toBeTruthy();
    });
  });
  describe('cloneFamilyFetchError selector', () => {
    test('should return undefined when there is no error for passed integrationId', () => {
      expect(selectors.cloneFamilyFetchError()).toBeUndefined();
      expect(selectors.cloneFamilyFetchError({})).toBeUndefined();
      expect(selectors.cloneFamilyFetchError({}, integrationId)).toBeUndefined();
      expect(selectors.cloneFamilyFetchError({ [integrationId]: { status: 'received', cloneFamily: [] }}, integrationId)).toBeUndefined();
      expect(selectors.cloneFamilyFetchError({ [integrationId]: { status: 'requested' } }, integrationId)).toBeUndefined();
    });
    test('should return the error for the passed integrationId ', () => {
      const error = 'invalid ID';

      expect(selectors.cloneFamilyFetchError({ [integrationId]: { status: 'error', error } }, integrationId)).toBe(error);
    });
  });
});

