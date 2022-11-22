/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import { emptyObject, MOCK_INPUT_STATUS } from '../../../../constants';

const resourceId = 'ajdhfjhjkahkldjf';
const mockData = {mockData: {id: '123'}};
const error = 'Not found';

describe('mockInput reducer test cases', () => {
  describe('actionTypes.MOCK_INPUT.REQUEST action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.mockInput.request());

      expect(state).toEqual({});
    });
    test('should set the status as requested for given resourceId', () => {
      const state = reducer(undefined, actions.mockInput.request(resourceId));

      expect(state).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.REQUESTED}});
    });
    test('should not delete user mock input', () => {
      const state = reducer(undefined, actions.mockInput.updateUserMockInput(resourceId, mockData));
      const finalState = reducer(state, actions.mockInput.request(resourceId));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.REQUESTED, userData: mockData}});
    });
    test('should clear previous data and errors', () => {
      const state = reducer(undefined, actions.mockInput.received(resourceId, mockData));
      const errorState = reducer(state, actions.mockInput.receivedError(resourceId, error));

      expect(errorState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error}});

      const finalState = reducer(state, actions.mockInput.request(resourceId));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.REQUESTED}});
    });
  });
  describe('actionTypes.MOCK_INPUT.RECEIVED action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.mockInput.received());

      expect(state).toEqual({});
    });
    test('should set the status as received and populate the mock data in the state for given resourceId', () => {
      const state = reducer(undefined, actions.mockInput.received(resourceId, mockData));

      expect(state).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.RECEIVED, data: mockData}});
    });
    test('should not delete user mock input', () => {
      const state = reducer(undefined, actions.mockInput.updateUserMockInput(resourceId, mockData));

      expect(state).toEqual({[resourceId]: { userData: mockData }});

      const finalState = reducer(state, actions.mockInput.received(resourceId, mockData));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.RECEIVED, data: mockData, userData: mockData}});
    });
    test('should clear previous errors', () => {
      const errorState = reducer(undefined, actions.mockInput.receivedError(resourceId, error));

      expect(errorState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error}});

      const state = reducer(errorState, actions.mockInput.received(resourceId, mockData));

      expect(state).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.RECEIVED, data: mockData}});
    });
  });
  describe('actionTypes.MOCK_INPUT.RECEIVED_ERROR action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.mockInput.receivedError());

      expect(state).toEqual({});
    });
    test('should set the status as error for given resourceId', () => {
      const state = reducer(undefined, actions.mockInput.receivedError(resourceId, error));

      expect(state).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error}});
    });
    test('should not delete user mock input', () => {
      const state = reducer(undefined, actions.mockInput.updateUserMockInput(resourceId, mockData));
      const finalState = reducer(state, actions.mockInput.receivedError(resourceId, error));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error, userData: mockData}});
    });
    test('should clear previous data', () => {
      const state = reducer(undefined, actions.mockInput.received(resourceId, mockData));

      expect(state).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.RECEIVED, data: mockData}});

      const errorState = reducer(state, actions.mockInput.receivedError(resourceId, error));

      expect(errorState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error}});
    });
  });
  describe('actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.mockInput.updateUserMockInput());

      expect(state).toEqual({});
    });
    test('should not change the status of the state', () => {
      const state = reducer(undefined, actions.mockInput.request(resourceId));
      const finalState = reducer(state, actions.mockInput.updateUserMockInput(resourceId, mockData));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.REQUESTED, userData: mockData}});
    });
    test('should not delete data of the state', () => {
      const state = reducer(undefined, actions.mockInput.received(resourceId, mockData));
      const finalState = reducer(state, actions.mockInput.updateUserMockInput(resourceId, mockData));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.RECEIVED, data: mockData, userData: mockData}});
    });
    test('should not delete errors of the state', () => {
      const errorState = reducer(undefined, actions.mockInput.receivedError(resourceId, error));
      const finalState = reducer(errorState, actions.mockInput.updateUserMockInput(resourceId, mockData));

      expect(finalState).toEqual({[resourceId]: {status: MOCK_INPUT_STATUS.ERROR, error, userData: mockData}});
    });
  });
  describe('actionTypes.MOCK_INPUT.CLEAR action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.mockInput.clear());

      expect(state).toEqual({});
    });
    test('should clear the status, data and errors from the state', () => {
      const requestState = reducer(undefined, actions.mockInput.request(resourceId));
      const clearStatusState = reducer(requestState, actions.mockInput.clear(resourceId));

      expect(clearStatusState).toEqual({[resourceId]: {}});

      const dataState = reducer(undefined, actions.mockInput.received(resourceId, mockData));
      const clearDataState = reducer(dataState, actions.mockInput.clear(resourceId));

      expect(clearDataState).toEqual({[resourceId]: {}});

      const errorState = reducer(undefined, actions.mockInput.receivedError(resourceId, error));
      const clearErrorState = reducer(errorState, actions.mockInput.clear(resourceId));

      expect(clearErrorState).toEqual({[resourceId]: {}});
    });
    test('should not delete user mock input', () => {
      const state = reducer(undefined, actions.mockInput.updateUserMockInput(resourceId, mockData));
      const finalState = reducer(state, actions.mockInput.clear(resourceId));

      expect(finalState).toEqual({[resourceId]: {userData: mockData}});
    });
  });
});

describe('mockInput selector test cases', () => {
  describe('selectors.mockInput test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.mockInput()).toEqual(emptyObject);
    });
    test('should return empty object if state does not exist', () => {
      expect(selectors.mockInput({}, resourceId)).toEqual(emptyObject);
    });
    test('should return empty object if resourceId does not exist', () => {
      expect(selectors.mockInput({[resourceId]: {}}, undefined)).toEqual(emptyObject);
    });
    test('should return empty object if state does not contain resourceId', () => {
      expect(selectors.mockInput({[resourceId]: {status: 'error'}}, '123')).toEqual(emptyObject);
    });
    test('should return correct state for given resourceId', () => {
      const expected = {
        status: MOCK_INPUT_STATUS.RECEIVED,
        data: mockData,
      };
      const state = {
        [resourceId]: expected,
      };

      expect(selectors.mockInput(state, resourceId)).toEqual(expected);
    });
  });
  describe('selectors.userMockInput test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.userMockInput()).toBeUndefined();
    });
    test('should return empty object if state does not exist', () => {
      expect(selectors.userMockInput({}, resourceId)).toBeUndefined();
    });
    test('should return empty object if resourceId does not exist', () => {
      expect(selectors.userMockInput({[resourceId]: {}}, undefined)).toBeUndefined();
    });
    test('should return empty object if state does not contain resourceId', () => {
      expect(selectors.userMockInput({[resourceId]: {status: 'error'}}, '123')).toBeUndefined();
    });
    test('should return correct state for given resourceId', () => {
      const expected = {
        status: MOCK_INPUT_STATUS.ERROR,
        error,
        userData: mockData,
      };
      const state = {
        [resourceId]: expected,
      };

      expect(selectors.userMockInput(state, resourceId)).toEqual(mockData);
    });
  });
});
