/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../actions/types';

const defaultState = {};

describe('sso validation reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('SSO.ORG_ID.VALIDATION_REQUEST action', () => {
    test('should update status as requested when the state is empty', () => {
      const prevState = {};
      const currState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const expectedState = {
        status: 'requested',
      };

      expect(currState).toEqual(expectedState);
    });
    test('should over ride status as requested and remove error if already the error status exists', () => {
      const prevState = {
        status: 'error',
        error: 'invalid sso org id',
      };
      const currState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const expectedState = {
        status: 'requested',
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('SSO.ORG_ID.VALIDATION_SUCCESS action', () => {
    test('should update status to success ', () => {
      const prevState = {};
      const reqState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const currState = reducer(reqState, { type: actionTypes.SSO.ORG_ID.VALIDATION_SUCCESS });

      const expectedState = {
        status: 'success',
      };

      expect(currState).toEqual(expectedState);
    });
    test('should over ride status as requested and remove error if already the error status exists', () => {
      const prevState = {
        status: 'error',
        error: 'invalid sso org id',
      };
      const currState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_SUCCESS });

      const expectedState = {
        status: 'success',
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('SSO.ORG_ID.VALIDATION_ERROR action', () => {
    test('should update status to error and update error ', () => {
      const prevState = {
        status: 'success',
      };
      const error = { message: 'invalid sso org id' };
      const reqState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const currState = reducer(reqState, { type: actionTypes.SSO.ORG_ID.VALIDATION_ERROR, error });

      const expectedState = {
        status: 'error',
        error,
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update error prop as undefined when there is no error passed', () => {
      const prevState = {
        status: 'success',
      };
      const reqState = reducer(prevState, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const currState = reducer(reqState, { type: actionTypes.SSO.ORG_ID.VALIDATION_ERROR });

      const expectedState = {
        status: 'error',
        error: undefined,
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('SSO.ORG_ID.VALIDATION_CLEAR action', () => {
    test('should clear any existing status or error properties on the state', () => {
      const reqState = reducer({}, { type: actionTypes.SSO.ORG_ID.VALIDATION_REQUEST });
      const currState = reducer(reqState, { type: actionTypes.SSO.ORG_ID.VALIDATION_ERROR, error: 'error' });
      const finalState = reducer(currState, { type: actionTypes.SSO.ORG_ID.VALIDATION_CLEAR });

      expect(finalState).toEqual({});
    });
  });
});

describe('sso validation selectors', () => {
  const errorState = {
    status: 'error',
    error: 'invalid sso org id',
  };
  const requestedState = {
    status: 'requested',
  };
  const successState = {
    status: 'success',
  };
  const errorStateWithNoError = { status: 'error'};

  describe('orgIdValidationError selector', () => {
    test('should return undefined incase of empty state or state with no error', () => {
      expect(selectors.orgIdValidationError()).toBeUndefined();
      expect(selectors.orgIdValidationError(requestedState)).toBeUndefined();
      expect(selectors.orgIdValidationError(successState)).toBeUndefined();
      expect(selectors.orgIdValidationError(errorStateWithNoError)).toBeUndefined();
    });
    test('should return the error for the error state ', () => {
      expect(selectors.orgIdValidationError(errorState)).toBe(errorState.error);
    });
  });
  describe('orgIdValidationInProgress selector', () => {
    test('should return false when state is empty or state is other than requested status', () => {
      expect(selectors.orgIdValidationInProgress()).toBeFalsy();
      expect(selectors.orgIdValidationInProgress(successState)).toBeFalsy();
      expect(selectors.orgIdValidationInProgress(errorStateWithNoError)).toBeFalsy();
    });
    test('should return true when the state is requested status', () => {
      expect(selectors.orgIdValidationInProgress(requestedState)).toBeTruthy();
    });
  });
  describe('orgIdValidationSuccess selector', () => {
    test('should return false when state is empty or state is other than success status', () => {
      expect(selectors.orgIdValidationSuccess()).toBeFalsy();
      expect(selectors.orgIdValidationSuccess(requestedState)).toBeFalsy();
      expect(selectors.orgIdValidationSuccess(errorStateWithNoError)).toBeFalsy();
    });
    test('should return true when the state is success status', () => {
      expect(selectors.orgIdValidationSuccess(successState)).toBeTruthy();
    });
  });
});

