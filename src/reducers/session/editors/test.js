/* global describe, test, expect */
import reducer, * as selectors from './';
// import actions from '../../../actions';
import actionTypes from '../../../actions/types';

describe('editor reducers', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });
  test('should return the default data and rules when editor is inialized', () => {
    // {
    //   type, processor, id, rules, data, result, error;
    // }

    const someDefaultArrayOfRules = [{ a: 1 }, { b: 3 }];
    const someDefaultData = [{ d: 3 }, { e: 5 }];
    const editorInitialized = {
      id: 1,
      type: actionTypes.EDITOR_INIT,
      rules: someDefaultArrayOfRules,
      data: someDefaultData,
    };
    const newState = reducer(undefined, editorInitialized);

    expect(newState[1]).toMatchObject({
      data: someDefaultData,
      rules: someDefaultArrayOfRules,
      defaultData: someDefaultData,
      defaultRules: someDefaultArrayOfRules,
    });
  });

  test('should reset data with default values', () => {
    const someDefaultArrayOfRules = [{ a: 1 }, { b: 3 }];
    const someDefaultData = [{ d: 3 }, { e: 5 }];
    const editorInitialized = {
      id: 1,
      type: actionTypes.EDITOR_INIT,
      rules: someDefaultArrayOfRules,
      data: someDefaultData,
    };
    const editorIntialized = reducer(undefined, editorInitialized);
    const someDataChanged = {
      id: 1,
      type: actionTypes.EDITOR_DATA_CHANGE,
      rules: someDefaultArrayOfRules,
      data: 'someChange',
    };
    const dataChangedState = reducer(editorIntialized, someDataChanged);

    expect(dataChangedState[1]).toMatchObject({
      data: 'someChange',
    });

    const editorReset = {
      id: 1,
      type: actionTypes.EDITOR_RESET,
      rules: someDefaultArrayOfRules,
      data: 'someChange',
    };
    const resetState = reducer(dataChangedState, editorReset);

    expect(resetState[1]).toMatchObject({
      data: someDefaultData,
      defaultData: someDefaultData,
    });
  });

  test('should update last rule or data when the corresponding actions is dispatched', () => {
    const someDefaultArrayOfRules = [{ a: 1 }, { b: 3 }];
    const someDefaultData = [{ d: 3 }, { e: 5 }];
    const editorInitialized = {
      id: 1,
      type: actionTypes.EDITOR_INIT,
      rules: someDefaultArrayOfRules,
      data: someDefaultData,
    };
    const editorIntialized = reducer(undefined, editorInitialized);
    const someDataChanged = {
      id: 1,
      type: actionTypes.EDITOR_DATA_CHANGE,
      rules: someDefaultArrayOfRules,
      data: 'someDataChange',
    };
    const dataChangedState = reducer(editorIntialized, someDataChanged);

    expect(dataChangedState[1]).toMatchObject({ data: 'someDataChange' });

    const someRuleChanged = {
      id: 1,
      type: actionTypes.EDITOR_RULE_CHANGE,
      rules: 'someRuleChange',
      data: 'anotherDataChange',
    };
    // Data change should be ignored by the reducer only rule should be affected
    const ruleChangedState = reducer(dataChangedState, someRuleChanged);

    expect(ruleChangedState[1]).toMatchObject({
      data: 'someDataChange',
      rules: 'someRuleChange',
    });
  });

  test('should git rid off all errors and evaluations in reset editor', () => {
    const someDefaultArrayOfRules = [{ a: 1 }, { b: 3 }];
    const editorEvaluationFailure = {
      id: 1,
      type: actionTypes.EDITOR_EVALUATE_FAILURE,
      error: 'someError',
    };
    const editorFailureState = reducer(undefined, editorEvaluationFailure);

    expect(editorFailureState[1]).toMatchObject({ error: 'someError' });

    const editorRESET = {
      id: 1,
      type: actionTypes.EDITOR_RESET,
      rules: someDefaultArrayOfRules,
      data: 'someChange',
    };
    const resetState = reducer(editorFailureState, editorRESET);

    expect(resetState[1]).not.toMatchObject({ error: 'someError' });

    // similarly for evaluations

    const editorEvaluationSuccess = {
      id: 1,
      type: actionTypes.EDITOR_EVALUATE_RESPONSE,
      result: 'some result',
    };
    const editorEvaluationSuccessState = reducer(
      undefined,
      editorEvaluationSuccess
    );

    expect(editorEvaluationSuccessState[1]).toMatchObject({
      result: 'some result',
    });
    const resetStateAfterSuccessfulEvaluation = reducer(
      editorFailureState,
      editorRESET
    );

    expect(resetStateAfterSuccessfulEvaluation[1]).not.toMatchObject({
      result: 'some result',
    });
  });
});

describe('editor selectors', () => {
  describe(`editor`, () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.editor(undefined, 'key')).toEqual({});
      expect(selectors.editor({}, 'key')).toEqual({});
    });
  });
});
