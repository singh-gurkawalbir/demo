import {
  getFilterRuleId,
  convertNetSuiteQualifierExpressionToQueryBuilderRules,
  getFilterList,
  generateRulesState,
  generateNetSuiteQualifierExpression,
} from './util';

describe('netSuiteQualitificationCriteria UI test cases', () => {
  describe('getFilterRuleId function test case', () => {
    test('should call the getFilterRuleId function', () => {
      expect(getFilterRuleId({id: 'intialText_rule_someId'})).toBe('someId');
    });
    test('should call the function with invalid props', () => {
      expect(getFilterRuleId({id: 'sometext'})).toBeUndefined();
    });
  });
  describe('convertNetSuiteQualifierExpressionToQueryBuilderRules function test', () => {
    test('should call the function with no rules', () => {
      expect(convertNetSuiteQualifierExpressionToQueryBuilderRules([])).toEqual(
        {
          condition: 'AND',
          rules: [{}],
        }
      );
    });
    test('should call the function with equal sign as operator', () => {
      expect(convertNetSuiteQualifierExpressionToQueryBuilderRules([
        'sampleField',
        '=',
        'hv',
      ])).toEqual(
        {
          condition: 'AND',
          rules: [{
            operator: 'equal',
            lhs: { type: 'field', value: 'sampleField' },
            rhs: { type: 'value', value: 'hv' },
            value: 'hv',
            id: 'sampleField',
          }],
        }
      );
    });
    test('should call the function with condition as or', () => {
      expect(convertNetSuiteQualifierExpressionToQueryBuilderRules([
        ['sampleField1', '=', 'testString1'],
        'or',
        ['sampleField2', '=', 'testString2'],
      ])).toEqual(
        {
          condition: 'OR',
          rules: [{
            operator: 'equal',
            lhs: { type: 'field', value: 'sampleField1' },
            rhs: { type: 'value', value: 'testString1' },
            value: 'testString1',
            id: 'sampleField1',
          },
          {
            operator: 'equal',
            lhs: { type: 'field', value: 'sampleField2' },
            rhs: { type: 'value', value: 'testString2' },
            value: 'testString2',
            id: 'sampleField2',
          },
          ],
        }
      );
    });
    test('should call the function with condition as and', () => {
      expect(convertNetSuiteQualifierExpressionToQueryBuilderRules([
        ['sampleField1', '=', 'testString1'],
        'and',
        ['sampleField2', '=', 'testString2'],
      ])).toEqual(
        {
          condition: 'AND',
          rules: [{
            operator: 'equal',
            lhs: { type: 'field', value: 'sampleField1' },
            rhs: { type: 'value', value: 'testString1' },
            value: 'testString1',
            id: 'sampleField1',
          },
          {
            operator: 'equal',
            lhs: { type: 'field', value: 'sampleField2' },
            rhs: { type: 'value', value: 'testString2' },
            value: 'testString2',
            id: 'sampleField2',
          },
          ],
        }
      );
    });
    test('should call the function with rhs as false and operator as empty', () => {
      expect(convertNetSuiteQualifierExpressionToQueryBuilderRules([
        'sampleField',
        'empty',
        false,
      ])).toEqual(
        {
          condition: 'AND',
          rules: [{
            operator: 'is_not_empty',
            lhs: { type: 'field', value: 'sampleField' },
            rhs: { type: 'value', value: false },
            value: false,
            id: 'sampleField',
          }],
        }
      );
    });
  });
  describe('getFilterList function test', () => {
    test('should set jsonpath when not json path is provided and no id is present for rule', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'value',
              value: "'test string'",
            },
            value: "'test string'",
          },
        ],
      };

      expect(getFilterList(
        [],
        rule
      )).toEqual([{ id: 'sampleField', name: 'sampleField' }]);
    });
    test('should push rule id to jsonpath when json path when rule id is not present in jsonpath', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'value',
              value: "'test string'",
            },
            value: "'test string'",
            id: 'someruleId',
          },
        ],
      };

      expect(getFilterList(
        [],
        rule
      )).toEqual([{ id: 'someruleId'}]);
    });
    test('should push rhs field to jsonpath when json path when field is not present in jsonpath', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      getFilterList([{ id: 'sampleField' }], rule);

      expect(getFilterList(
        [{ id: 'sampleField' }],
        rule
      )).toEqual([{ id: 'sampleField' }, { id: 'somefield' }]);
    });
    test('should push path id and name as sampleField when no jsonpath is provided', () => {
      const rule = {
        condition: 'OR',
        rules: [],
      };

      expect(getFilterList(
        [],
        rule
      )).toEqual([{ id: 'sampleField', name: 'sampleField' }]);
    });
    test('should call the function when rules are having further rules and with empty jaonPath array', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            condition: 'OR',
            rules: [
              {operator: 'equal',
                lhs: {
                  type: 'field',
                  value: 'sampleField',
                  field: 'sampleField',
                },
                rhs: {
                  type: 'field',
                  value: 'somevalue',
                  field: 'somefield',
                }}],
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      expect(getFilterList(
        [],
        rule
      )).toEqual([{ id: 'sampleField', name: 'sampleField' }, { id: 'somefield' }]);
    });
  });
  describe('generateRulesState function test', () => {
    test('should call the function with condition as or', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual(
        { 0: { data: {
          lhs: {
            field: 'sampleField',
            type: 'field',
            value: 'sampleField',
          },
          rhs: {
            field: 'somefield',
            type: 'field',
            value: 'somevalue',
          },
        } } }
      );
    });
    test('should call the function with rule having its own condtion', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            condition: 'OR',
            rules: [
              {operator: 'equal',
                lhs: {
                  type: 'field',
                  value: 'sampleField',
                  field: 'sampleField',
                },
                rhs: {
                  type: 'field',
                  value: 'somevalue',
                  field: 'somefield',
                }}],
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual(
        { 0: { data: {
          lhs: {
            field: 'sampleField',
            type: 'field',
            value: 'sampleField',
          },
          rhs: {
            field: 'somefield',
            type: 'field',
            value: 'somevalue',
          },
        } } }
      );
    });
    test('should call the function with rule operator as equal', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', '=', "'test string'"]
      );
    });

    test('should call the function having exactly two rules', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
          {
            operator: 'not_equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        [
          ['sampleField', '=', "'test string'"],
          'or',
          ['sampleField', '!=', "'test string'"],
        ]
      );
    });
    test('should call the function where rules are further having rules', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
            rules: [{
              operator: 'not_equal',
              lhs: {
                type: 'field',
                value: 'sampleField',
                field: 'sampleField',
              },
              rhs: {
                type: 'field',
                value: 'somevalue',
                field: 'somefield',
              },
              value: "'test string2'",
              id: 'sampleField',
            }],
          },
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', '!=', "'test string2'"]
      );
    });
    test('should call the function with rule having is_empty as operator', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'is_empty',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', 'empty', true]
      );
    });
    test('should call the function with rule having is_not_empty as operator', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'is_not_empty',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', 'empty', false]
      );
    });
    test('should call the function with rule having equal as operator', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            id: 'sampleField',
            data: {
              rhs: {
                type: 'field',
                value: 'somevalue',
                field: 'somefield',
              },
              value: "'test string'",
            }},
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', '=', 'somefield']
      );
    });
    test('should call the function with no condition', () => {
      const rule = {
        rules: [
          {
            operator: 'equal',
            lhs: {
              value: 'sampleField',
              field: 'sampleField',
            },
            id: 'sampleField',
            data: {
              rhs: {
                value: 'somevalue',
                field: 'somefield',
              },
              value: "'test string'",
            }},
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        ['sampleField', '=', 'somefield']
      );
    });
    test('should call the function with two exactly rule and no provided condition', () => {
      const rule = {
        rules: [
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string'",
            id: 'sampleField',
          },
          {
            operator: 'not_equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string2'",
            id: 'sampleField',
          },
          {
            operator: 'equal',
            lhs: {
              type: 'field',
              value: 'sampleField',
              field: 'sampleField',
            },
            rhs: {
              type: 'field',
              value: 'somevalue',
              field: 'somefield',
            },
            value: "'test string3'",
            id: 'sampleField',
          },
        ],
      };

      generateNetSuiteQualifierExpression(rule);

      expect(generateNetSuiteQualifierExpression(rule)).toEqual(
        [
          ['sampleField', '=', "'test string'"],
          'and',
          [
            ['sampleField', '!=', "'test string2'"],
            'and',
            ['sampleField', '=', "'test string3'"],
          ],
        ]
      );
    });
  });
});
