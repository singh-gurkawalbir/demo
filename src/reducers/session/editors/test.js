/* global describe, test, expect, fail */
import deepFreeze from 'deep-freeze';
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('editor reducers', () => {
  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  test('should return the default data and rules when editor is initialized', () => {
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

  // This test case is to verify we are doing a deep copy and not mutating
  // the reducer state

  describe('mutation behaviour of patch operations', () => {
    test('should initialize with all options defined in the action and subsequent mutation to an option property should not alter the state', () => {
      const id = 1;
      const options = {
        rules: [{ extract: 't', generate: 'g' }],
      };
      const initProcessorState = reducer(
        undefined,
        actions.editor.init(id, 'transformProcessor', options)
      );

      deepFreeze(initProcessorState);
      expect(initProcessorState[id].rules).toEqual(options.rules);

      try {
        options.rules.push({ extract: 'c', generate: 'd' });
      } catch (e) {
        fail('should not throw an object freeze exception');
      }
    });
    test('should not mutate the state of patch operation when the patch property is changed', () => {
      const id = 1;
      const patch = { rules: [{ extract: 'a', generate: 'b' }] };
      const patchedState = reducer(undefined, actions.editor.patch(id, patch));

      deepFreeze(patchedState);
      expect(patchedState[id].rules).toEqual(patch.rules);

      // this mutation should not throw an error
      try {
        patch.rules.push({ extract: 'c', generate: 'd' });
      } catch (e) {
        fail('should not throw an object freeze exception');
      }
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
        processor: 'csvParser',
        valid: {
          initOpts: {
            rowDelimiter: 'crlf',
            columnDelimiter: 'tab',
            hasHeaderRow: true,
            trimSpaces: true,
            data: 'a,b,c',
          },
          expectedRequest: {
            body: {
              data: 'a,b,c',
              rules: {
                rowDelimiter: '\r\n',
                columnDelimiter: '\t',
                hasHeaderRow: true,
                trimSpaces: true,
              },
            },
            processor: 'csvParser',
          },
        },
        invalid: {
          initOpts: { data: '' },
          violations: { dataError: 'Must provide some sample data.' },
        },
      },
      {
        processor: 'handlebars',
        valid: [
          {
            initOpts: { template: '{{a}}', strict: true, data: '{"a": 123}' },
            expectedRequest: {
              body: {
                data: { a: 123 },
                rules: { strict: true, template: '{{a}}' },
              },
              processor: 'handlebars',
            },
          },
          {
            initOpts: { template: 'Test', strict: true, data: '{"a": 123}' },
            expectedRequest: {
              body: {
                data: { a: 123 },
                rules: { strict: true, template: 'Test' },
              },
              processor: 'handlebars',
            },
          },
        ],
        invalid: {
          initOpts: { template: '{{a}', data: '{a: xxx}' },
          violations: { dataError: 'Unexpected token a in JSON at position 1' },
        },
      },
      {
        processor: 'sql',
        valid: [
          {
            initOpts: {
              template: 'Select * from {{id}}',
              strict: true,
              sampleData: '{"age": 33}',
              defaultData: '{"id": 99}',
            },
            expectedRequest: {
              body: {
                data: { age: 33, id: 99 },
                rules: { strict: true, template: 'Select * from {{id}}' },
              },
              processor: 'handlebars',
            },
          },
          {
            initOpts: {
              template: 'Select * from {{id}}',
              strict: true,
              sampleData: '{"id": 33}',
              defaultData: '{"id": 99}',
            },
            expectedRequest: {
              body: {
                data: { id: 33 },
                rules: { strict: true, template: 'Select * from {{id}}' },
              },
              processor: 'handlebars',
            },
          },
          {
            initOpts: {
              template: 'Select * from {{id}}',
              strict: true,
              sampleData: '{"age": 33}',
              defaultData: '{"id": 99, "age": 1}',
            },
            expectedRequest: {
              body: {
                data: { age: 33, id: 99 },
                rules: { strict: true, template: 'Select * from {{id}}' },
              },
              processor: 'handlebars',
            },
          },
          {
            initOpts: {
              template: 'Select * from {{id}}',
              strict: true,
              sampleData: '',
              defaultData: '',
            },
            expectedRequest: {
              body: {
                data: {},
                rules: { strict: true, template: 'Select * from {{id}}' },
              },
              processor: 'handlebars',
            },
          },
          {
            initOpts: {
              template: 'Select * from {{id}}',
              strict: true,
              sampleData: '{}',
              defaultData: '{}',
            },
            expectedRequest: {
              body: {
                data: {},
                rules: { strict: true, template: 'Select * from {{id}}' },
              },
              processor: 'handlebars',
            },
          },
        ],
        invalid: [
          {
            initOpts: {
              template: '{{a}}',
              sampleData: '{a: xxx}',
              defaultData: '',
            },
            violations: {
              dataError:
                'Sample Data: Unexpected token a in JSON at position 1',
            },
          },
          {
            initOpts: {
              template: '{{a}}',
              sampleData: '',
              defaultData: '{a: xxx}',
            },
            violations: {
              dataError:
                'Default Data: Unexpected token a in JSON at position 1',
            },
          },
          {
            initOpts: {
              template: '{{a}}',
              sampleData: '{"a": 1}',
              defaultData: '{a: xxx}',
            },
            violations: {
              dataError:
                'Default Data: Unexpected token a in JSON at position 1',
            },
          },
          {
            initOpts: {
              template: '{{a}}',
              sampleData: '{',
              defaultData: '{"a": "xxx"}',
            },
            violations: {
              dataError: 'Sample Data: Unexpected end of JSON input',
            },
          },
          {
            initOpts: {
              template: '{{a}}',
              sampleData: '{{',
              defaultData: '{',
            },
            violations: {
              dataError:
                'Sample Data: Unexpected token { in JSON at position 1\nDefault Data: Unexpected end of JSON input',
            },
          },
        ],
      },
      {
        processor: 'merge',
        valid: [
          {
            initOpts: { rule: '{"b": true}', data: '{"a": 123}' },
            expectedRequest: {
              body: {
                data: [{ a: 123 }],
                rules: { b: true },
              },
              processor: 'merge',
            },
          },
          {
            initOpts: { rule: '[{"a": 1}]', data: '{"a": 123}' },
            expectedRequest: {
              body: {
                data: [{ a: 123 }],
                rules: [{ a: 1 }],
              },
              processor: 'merge',
            },
          },
        ],
        invalid: {
          initOpts: { rule: '{a: xx}', data: '{"b": t}' },
          violations: {
            dataError: 'Unexpected token } in JSON at position 7',
            ruleError: 'Unexpected token a in JSON at position 1',
          },
        },
      },
      {
        processor: 'transform',
        valid: {
          initOpts: {
            rule: [{ extract: 'a', generate: 'A' }],
            data: '{"a": 123}',
          },
          expectedRequest: {
            body: {
              data: [{ a: 123 }],
              rules: {
                version: '1',
                rules: [[{ extract: 'a', generate: 'A' }]],
              },
            },
            processor: 'transform',
          },
        },
        invalid: {
          initOpts: {
            rule: [{ extract: 'a', generate: 'A' }],
            data: '{"a: 123}',
          },
          violations: {
            dataError: 'Unexpected end of JSON input',
          },
        },
      },
      {
        processor: 'xmlParser',
        valid: {
          initOpts: {
            advanced: true,
            trimSpaces: true,
            stripNewLineChars: true,
            attributePrefix: '@',
            textNodeName: '#',
            listNodes: '/doc',
            data: '<doc>empty</doc>',
          },
          expectedRequest: {
            body: {
              data: '<doc>empty</doc>',
              rules: {
                resourcePath: undefined,
                doc: {
                  parsers: [
                    {
                      type: 'xml',
                      version: 1,
                      rules: {
                        V0_json: false,
                        trimSpaces: true,
                        stripNewLineChars: true,
                        attributePrefix: '@',
                        textNodeName: '#',
                        listNodes: ['/doc'],
                      },
                    },
                  ],
                },
              },
            },
            processor: 'xmlParser',
          },
        },
        invalid: {
          initOpts: {
            advanced: true,
            data: '',
          },
          violations: {
            dataError: 'Must provide some sample data.',
          },
        },
      },
    ];

    processorTestData.forEach(testData => {
      describe(`${testData.processor}`, () => {
        test(`should return correct opts for valid editor.`, () => {
          const id = 1;
          let validCases;

          if (testData.valid instanceof Array) {
            validCases = testData.valid;
          } else validCases = [testData.valid];
          validCases.forEach(validCase => {
            const state = reducer(
              undefined,
              actions.editor.init(id, testData.processor, validCase.initOpts)
            );
            const requestOpts = selectors.processorRequestOptions(state, id);

            expect(requestOpts).toEqual(validCase.expectedRequest);
          });
        });

        test(`should return errors for invalid editor.`, () => {
          const id = 1;
          let invalidCases;

          if (testData.invalid instanceof Array) {
            invalidCases = testData.invalid;
          } else invalidCases = [testData.invalid];
          invalidCases.forEach(invalidCaseTestData => {
            const state = reducer(
              undefined,
              actions.editor.init(
                id,
                testData.processor,
                invalidCaseTestData.initOpts
              )
            );
            const requestOpts = selectors.processorRequestOptions(state, id);

            expect(requestOpts.violations).toEqual(
              invalidCaseTestData.violations
            );
          });
        });
      });
    });
  });
});
