/* global describe, test, expect */
import reducer, {selectors} from '.';
import actions from '../../../../actions/suiteScript';

const initialState = {
  'c1-f1': true,
  'c2-f2': false,
};

describe('flow status reducer', () => {
  const ssLinkedConnectionId = 'c3';
  const _id = 'f3'; // _id is flow id

  test('should return state unaltered when invalid suitescript linked connection id or flow id are sent like null, undefined, "', () => {
    expect(reducer(initialState,
      actions.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId: null, _id: null}))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId: undefined, _id: undefined}))).toEqual(initialState);
    expect(reducer(initialState,
      actions.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId: '', _id: ''}))).toEqual(initialState);
  });

  test('should return correct state when valid suitescript connection id and flow id are passed', () => {
    const expectedState = {
      'c1-f1': true,
      'c2-f2': false,
      'c3-f3': true,
    };

    expect(reducer(initialState,
      actions.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId, _id}))).toEqual(expectedState);
  });
});
describe('isSuiteScriptFlowOnOffInProgress selectors', () => {
  const ssLinkedConnectionId = 'c4';
  const _id = 'f4'; // _id is flow id
  const state = reducer(initialState, actions.flow.isOnOffActionInprogress({onOffInProgress: true, ssLinkedConnectionId, _id}));

  test('should return state correctly when valid ids are sent through', () => {
    expect(selectors.isSuiteScriptFlowOnOffInProgress(state, {ssLinkedConnectionId, _id})).toEqual(true);
  });

  test('should return false correctly when invalid ids are sent through the selector', () => {
    expect(selectors.isSuiteScriptFlowOnOffInProgress(state, {
    })).toEqual(false);
  });
});
