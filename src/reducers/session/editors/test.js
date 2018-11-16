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

    expect(newState[1]).toMatchObject(
      { data: someDefaultData },
      { rules: someDefaultArrayOfRules },
      { defaultData: someDefaultData },
      { defaultRules: someDefaultArrayOfRules }
    );
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

    expect(dataChangedState[1]).toMatchObject(
      { data: 'someChange' },
      { defaultData: someDefaultData }
    );

    const editorRESET = {
      id: 1,
      type: actionTypes.EDITOR_RESET,
      rules: someDefaultArrayOfRules,
      data: 'someChange',
    };
    const resetState = reducer(dataChangedState, editorRESET);

    expect(resetState[1]).toMatchObject(
      { data: someDefaultData },
      { defaultData: someDefaultData }
    );
  });

  test('should git rid off all errors and evaluations in reset editor', () => {
    const someDefaultArrayOfRules = [{ a: 1 }, { b: 3 }];
    const someDefaultData = [{ d: 3 }, { e: 5 }];
    const editorInitialized = {
      id: 1,
      type: actionTypes.EDITOR_INIT,
      rules: someDefaultArrayOfRules,
      data: someDefaultData,
    };
    const editorIntialized = reducer(undefined, editorInitialized);
    const editorEvaluationFailure = {
      id: 1,
      type: actionTypes.EDITOR_EVALUATE_FAILURE,
      error: 'someError',
    };
    const editorFailureState = reducer(
      editorIntialized,
      editorEvaluationFailure
    );

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
      editorIntialized,
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
