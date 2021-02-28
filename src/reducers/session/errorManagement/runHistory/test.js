/* global describe, test, expect */
import reducer from '.';
// import actions from '../../../../actions';

const defaultState = {};

describe('runHistory in EM2.0 reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('RUN_HISTORY.REQUEST action', () => {
    test('should create new state if the passed flowId\'s does not exists and update status as requested', () => {

    });

    test('should update status as requested for the passed flowId state if already exists', () => {

    });
  });
  describe('RUN_HISTORY.RECEIVED action', () => {
    test('should retain previous state if the passed flowId does exist ', () => {

    });
    test('should update status to received and data as passed runHistory ', () => {

    });
    test('should update data as empty array when there is no run history passed', () => {

    });
  });
  describe('RUN_HISTORY.CLEAR action', () => {
    test('should clear the flowId\'s  state when the passed flowId\'s state exist ', () => {

    });
    test('should retain previous state when passed invalid flowId', () => {

    });
  });
});

describe('runHistory selectors', () => {
  describe('runHistoryContext selector', () => {

  });
});

