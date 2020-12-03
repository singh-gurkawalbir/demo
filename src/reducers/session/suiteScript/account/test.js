/* global describe, test, expect */
import each from 'jest-each';
import reducer, {selectors} from '.';
import actions from '../../../../actions/suiteScript';

const initialState = {
  ACCOUNT1: {hasIntegrations: true},
  ACCOUNT2: {hasIntegrations: false},
};

describe('account hasIntegrations reducer', () => {
  const testCases = [
    ['should return state unaltered when suitescript account id is undefined', undefined],
    ['should return state unaltered when suitescript account id is null', null],
    ['should return state unaltered when suitescript account id is empty', ''],
  ];

  each(testCases).test('%s', (name, ssLinkedAccountId) => {
    expect(reducer(initialState,
      actions.account.receivedHasIntegrations(ssLinkedAccountId))).toEqual(initialState);
  });

  test('should return correct state when valid suitescript account id is passed', () => {
    const expectedState = {
      ACCOUNT1: {hasIntegrations: true},
      ACCOUNT2: {hasIntegrations: false},
      ACCOUNT3: {hasIntegrations: true},
    };
    const ssLinkedAccountId = 'account3';

    expect(reducer(initialState,
      actions.account.receivedHasIntegrations(ssLinkedAccountId, true))).toEqual(expectedState);
  });
});
describe('netsuiteAccountHasSuiteScriptIntegrations selectors', () => {
  const ssLinkedAccountId = 'ACCOUNT4';
  const state = reducer(initialState, actions.account.receivedHasIntegrations(ssLinkedAccountId, true));

  test('should return state correctly when valid suitescript account id is sent through', () => {
    expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(state, ssLinkedAccountId)).toEqual(true);
  });

  const testCases = [
    ['should return null correctly when suitescript account id is undefined', undefined],
    ['should return null correctly when suitescript account id is null', null],
    ['should return null correctly when suitescript account id is  empty', ''],
  ];

  each(testCases).test('%s', (name, ssLinkedAccountId) => {
    expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(state, ssLinkedAccountId)).toEqual(null);
  });
});
