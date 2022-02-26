/* global describe, test, expect */
import reducer, {selectors} from '.';
import actions from '../../../actions';
import {HOME_PAGE_PATH} from '../../../utils/constants';

describe('integration redirectTo action', () => {
  test('should set redirectTo prop on to the state and should not clear other data', () => {
    const state = reducer({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
    }, actions.resource.integrations.redirectTo('integrationId', '/path'));

    expect(state).toEqual({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      integrationId: {
        redirectTo: '/path',
      },
    });
  });
});
describe('Integration redirect action', () => {
  test('should clear redirectTo from the state and should not clear other data', () => {
    const state = reducer({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      integrationId: { redirectTo: '/request'},
    }, actions.resource.integrations.clearRedirect('integrationId'));

    expect(state).toEqual({
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      integrationId: { },
    });
  });
});

describe('Flow group create/update/delete failed action', () => {
  test('should create passed integration Id state if not existed and update flow group status with the error message passed', () => {
    const initialState = {
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
    };

    const state1 = reducer(initialState, actions.resource.integrations.flowGroups.createOrUpdateFailed('1-4', { message: 'Failed to create a flow group' }));

    const expectedState1 = {
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      '1-4': {
        flowGroupStatus: {
          status: 'Failed',
          message: 'Failed to create a flow group',
        },
      },
    };

    const state2 = reducer(initialState, actions.resource.integrations.flowGroups.deleteFailed('1-4', { message: 'Failed to delete a flow group' }));

    const expectedState2 = {
      '1-3': { initComplete: true},
      '1-2': { formSaveStatus: 'loading'},
      '1-4': {
        flowGroupStatus: {
          status: 'Failed',
          message: 'Failed to delete a flow group',
        },
      },
    };

    const state3 = reducer(undefined, actions.resource.integrations.flowGroups.deleteFailed('1-4', { message: 'Failed to delete a flow group' }));

    const expectedState3 = {
      '1-4': {
        flowGroupStatus: {
          status: 'Failed',
          message: 'Failed to delete a flow group',
        },
      },
    };

    expect(state1).toEqual(expectedState1);
    expect(state2).toEqual(expectedState2);
    expect(state3).toEqual(expectedState3);
  });
});

describe('shouldRedirect selector test', () => {
  test('should not throw exception for bad params', () => {
    expect(selectors.shouldRedirect()).toEqual(null);
    expect(selectors.shouldRedirect({})).toEqual(null);
    expect(selectors.shouldRedirect(null)).toEqual(null);
  });

  test('should return correct saveStatus value for valid integration and flow', () => {
    const state = {
      integration: {
        meta: {
          data: 'dummy',
        },
        redirectTo: HOME_PAGE_PATH,
      },
    };

    expect(selectors.shouldRedirect(state, 'integration')).toEqual(HOME_PAGE_PATH);
  });
});

describe('flowGroupStatus selector test', () => {
  test('should not throw exception for bad params', () => {
    expect(selectors.flowGroupStatus()).toEqual(null);
    expect(selectors.flowGroupStatus({})).toEqual(null);
    expect(selectors.flowGroupStatus(null)).toEqual(null);
  });

  test('should return flowGroupStatus for the passed integrationId', () => {
    const state = {
      i1: {
        flowGroupStatus: {
          status: 'Failed',
          message: 'Flow group failed to save',
        },
      },
    };

    expect(selectors.flowGroupStatus(state, 'i1')).toEqual(state.i1.flowGroupStatus);
  });
});
