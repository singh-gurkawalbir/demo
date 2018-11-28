/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

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

    const rules = [{ a: 1 }, { b: 3 }];
    const data = [{ d: 3 }, { e: 5 }];
    const id = 1;
    const processor = 'something';
    const newState = reducer(
      undefined,
      actions.editor.init(id, processor, { rules, data })
    );

    expect(newState[1]).toMatchObject({
      data,
      rules,
      defaultOptions: { rules, data },
    });
  });

  test('should reset data with default values', () => {
    const rules = [{ a: 1 }, { b: 3 }];
    const data = [{ d: 3 }, { e: 5 }];
    const id = 1;
    const processor = 'something';
    const initializedState = reducer(
      undefined,
      actions.editor.init(id, processor, { rules, data })
    );
    // intialized state
    const changedData = 'someChange';
    const dataChangedState = reducer(
      initializedState,
      actions.editor.patch(id, { data: changedData })
    );

    expect(dataChangedState[1]).toMatchObject({
      data: 'someChange',
    });

    const resetState = reducer(dataChangedState, actions.editor.reset(id));

    expect(resetState[1]).toMatchObject({
      data,
      defaultOptions: { rules, data },
    });
  });

  test('should update last rule or data when the corresponding actions is dispatched', () => {
    const rules = [{ a: 1 }, { b: 3 }];
    const data = [{ d: 3 }, { e: 5 }];
    const id = 1;
    const processor = 'something';
    const intializedState = reducer(
      undefined,
      actions.editor.init(id, processor, rules, data)
    );
    const changedData = 'someChange';
    const dataChangedState = reducer(
      intializedState,
      actions.editor.patch(id, { data: changedData })
    );

    expect(dataChangedState[1]).toMatchObject({ data: changedData });

    const someRuleChange = 'someRuleChange';
    // Data change should be ignored by the reducer only rule should be affected
    const ruleChangedState = reducer(
      dataChangedState,
      actions.editor.patch(id, { rule: someRuleChange })
    );

    expect(ruleChangedState[1]).toMatchObject({
      rule: 'someRuleChange',
    });
  });

  test('should get rid off all errors reset editor', () => {
    const id = 1;
    const failureState = reducer(
      undefined,
      actions.editor.evaluateFailure(id, 'someError')
    );

    expect(failureState[1]).toMatchObject({ error: 'someError' });

    const resetState = reducer(failureState, actions.editor.reset(id));

    expect(resetState[1]).not.toMatchObject({ error: 'someError' });
  });

  test('should get rid off all evaluations in reset editor', () => {
    const id = 1;
    const response = 'some result';
    const evaluationSuccessState = reducer(
      undefined,
      actions.editor.evaluateResponse(id, response)
    );

    expect(evaluationSuccessState[1]).toMatchObject({
      result: 'some result',
    });
    const resetStateAfterSuccessfulEvaluation = reducer(
      evaluationSuccessState,
      actions.editor.reset(id)
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

  describe(`processorRequestOptions`, () => {
    test('should return empty object when no match found.', () => {
      expect(selectors.processorRequestOptions(undefined, 'missingId')).toEqual(
        {}
      );
      expect(selectors.processorRequestOptions({}, 'missingId')).toEqual({});
    });

    const processorTestData = [
      {
        processor: 'handlebars',
        valid: {
          initOpts: { template: '{{a}}', strict: true, data: '{"a": 123}' },
          expectedRequest: {
            body: {
              data: { a: 123 },
              rules: { strict: true, template: '{{a}}' },
            },
            processor: 'handlebars',
          },
        },
        invalid: {
          initOpts: { template: '{{a}', data: '{a: xxx}' },
          expectedErrors: ['Unexpected token a in JSON at position 1'],
        },
      },
      {
        processor: 'merge',
        valid: {
          initOpts: { rule: '{"b": true}', data: '{"a": 123}' },
          expectedRequest: {
            body: {
              data: [{ a: 123 }],
              rules: { b: true },
            },
            processor: 'merge',
          },
        },
        invalid: {
          initOpts: { rule: '{a: xx}', data: '{b: t}' },
          expectedErrors: [
            'Unexpected token a in JSON at position 1',
            'Unexpected token b in JSON at position 1',
          ],
        },
      },
    ];

    processorTestData.forEach(testData => {
      describe(`${testData.processor}`, () => {
        test(`should return correct opts for valid editor.`, () => {
          const id = 1;
          const state = reducer(
            undefined,
            actions.editor.init(id, testData.processor, testData.valid.initOpts)
          );
          const requestOpts = selectors.processorRequestOptions(state, id);

          expect(requestOpts).toEqual(testData.valid.expectedRequest);
        });

        test(`should return errors for invalid editor.`, () => {
          const id = 1;
          const state = reducer(
            undefined,
            actions.editor.init(
              id,
              testData.processor,
              testData.invalid.initOpts
            )
          );
          const requestOpts = selectors.processorRequestOptions(state, id);

          expect(requestOpts.errors).toEqual(testData.invalid.expectedErrors);
        });
      });
    });
  });
});
