import {
  getFilterRuleId,
  getFilterList,
  generateRulesState,
  generateNetSuiteLookupFilterExpression,
  convertNetSuiteLookupFilterExpression,
} from './util';

describe('netSuiteLooupFilter testcases', () => {
  describe('getFilterRuleId function test case', () => {
    test('getFilterRuleId function test case', () => {
      expect(getFilterRuleId({ id: 'firstText_rule_expectedText' })).toBe(
        'expectedText'
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
            data: 'somedata',
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual(
        { 0: { data: 'somedata' } }
      );
    });
    test('should call the function with rule having its own condtion', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            condition: 'OR',
            rules: [
              {
                operator: 'equal',
                data: 'somedata',
              },
            ],
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual(
        { 0: { data: 'somedata'} }
      );
    });
  });
  describe('generateNetSuiteLookupFilterExpression function test cases', () => {
    test('should generate the expression based on the provided rules', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'Id',
            field: 'Id',
            type: 'string',
            operator: 'equalto',
            value: 'Account.Id',
            data: {
              lhs: {
                type: 'field',
                field: 'Id',
              },
              rhs: {
                type: 'value',
                value: 'Account.Id',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual([['Id', 'equalto', 'Account.Id'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}']]);
    });
    test('should show the formuladate in the LHS expression', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'formuladate',
            field: 'Id',
            type: 'string',
            operator: 'equalto',
            value: 'Account.Id',
            data: {
              lhs: {
                expression: 'somexpresion',
              },
              rhs: {
                type: 'value',
                value: 'Account.Id',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(
        [['formuladate:somexpresion', 'equalto', 'Account.Id'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}']]
      );
    });
    test('should show the formulanumeric in the LHS expression', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'formulanumeric',
            field: 'Id',
            type: 'string',
            operator: 'equalto',
            value: 'Account.Id',
            data: {
              lhs: {
                expression: 'somexpresion',
              },
              rhs: {
                type: 'value',
                value: 'Account.Id',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Description: 'textarea',
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(
        [['formulanumeric:somexpresion', 'equalto', 'Account.Id'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}']]
      );
    });
    test('should show the formulatext as id in the LHS expression', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'formulatext',
            field: 'Id',
            type: 'string',
            operator: 'equalto',
            value: 'Account.Id',
            data: {
              lhs: {
                expression: 'somexpresion',
              },
              rhs: {
                type: 'value',
                value: 'Account.Id',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Description: 'textarea',
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(
        [['formulatext:somexpresion', 'equalto', 'Account.Id'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}']]
      );
    });
    test('should show the expression for only one rule', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(['Fax', 'equalto', '{{{AssistantPhone}}}']);
    });
    test('should take field as by default type when type of data is not provided', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                field: 'Fax',
              },
              rhs: {
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(['Fax', 'equalto', 'AssistantPhone']);
    });
    test('should wrap the rules in extra bracket when more than 2 rules are present', () => {
      const qbRules = {
        rules: [
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                type: 'field',
                field: 'AssistantPhone',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual([['Fax', 'equalto', '{{{AssistantPhone}}}'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}'], 'AND', ['Fax', 'equalto', '{{{AssistantPhone}}}']]);
    });
    test('should by default take type as field in rhs when nno provided', () => {
      const qbRules = {
        condition: 'AND',
        rules: [
          {
            id: 'Fax',
            field: 'Fax',
            type: 'string',
            operator: 'equalto',
            value: null,
            data: {
              lhs: {
                type: 'field',
                field: 'Fax',
              },
              rhs: {
                field: 'Fax',
              },
            },
          },
        ],
        valid: true,
      };
      const salesforceFilterDataTypes = {
        Fax: 'phone',
      };

      expect(
        generateNetSuiteLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toEqual(['Fax', 'equalto', 'Fax']);
    });
  });
  describe('convertNetSuiteLookupFilterExpression function test cases', () => {
    test('should return rules for a is condition', () => {
      expect(convertNetSuiteLookupFilterExpression(['sampleField', 'is', 'WQEF'])).toEqual(
        {
          condition: 'AND',
          rules: [{ id: 'sampleField',
            operator: 'is',
            data: {
              lhs: { type: 'field', field: 'sampleField' },
              rhs: { type: 'value', value: 'WQEF' },
            } }],
        }
      );
    });
    test('should return rules for a not condition', () => {
      expect(convertNetSuiteLookupFilterExpression([['sampleField', 'NOT', 'WQEF']])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              data: {lhs: { type: 'field', field: 'sampleField' }, rhs: {} },
              id: 'sampleField',
              operator: ['NOT', 'WQEF'],
            },
          ],
        },
      );
    });
    test('should return for the expression having multiple not operator', () => {
      expect(convertNetSuiteLookupFilterExpression(['text', 'NOT', ['sampleField', 'NOT', 'WQEF']])).toEqual(
        {
          condition: 'AND',
          rules: [
            { data: {
              lhs: { type: 'field', field: 'text' },
              rhs: {},
            },
            id: 'text',
            operator: ['NOT', ['sampleField', 'NOT', 'WQEF']],
            },

          ],
        },
      );
    });
    test('should return the rules when the first element of expression is not', () => {
      expect(convertNetSuiteLookupFilterExpression(['NOT', [['sampleField', 'NOT', 'WQEF']]])).toEqual(
        {
          condition: 'AND',
          not: true,
          rules: [
            {
              data: { lhs: { type: 'field', field: 'sampleField' }, rhs: {} },
              id: 'sampleField',
              operator: ['NOT', 'WQEF'],
            },

          ],
        },
      );
    });
    test('should return rules for and condition exression', () => {
      expect(convertNetSuiteLookupFilterExpression(['sampleField', 'AND', 'WQEF'])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 's',
              operator: 'a',
              data: {
                lhs: { type: 'field', field: 's' },
                rhs: { type: 'value', value: 'm' },
              },
            },
            {
              id: 'W',
              operator: 'Q',
              data: {
                lhs: { type: 'field', field: 'W' },
                rhs: { type: 'value', value: 'E' },
              },
            },

          ],
        },
      );
    });
    test('should return rules when first and last element of exression are complex', () => {
      expect(convertNetSuiteLookupFilterExpression([[['sampleField1', 'is', 'compare1'], 'AND', ['sampleField3', 'is', 'compare3']], 'AND', [['sampleField4', 'is', 'compare4'], 'AND', ['sampleField5', 'is', 'compare5']]])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              condition: 'AND',
              rules: [
                {
                  id: 'sampleField1',
                  operator: 'is',
                  data: {
                    lhs: {
                      type: 'field',
                      field: 'sampleField1',
                    },
                    rhs: {
                      type: 'value',
                      value: 'compare1',
                    },
                  },
                },
                {
                  id: 'sampleField3',
                  operator: 'is',
                  data: {
                    lhs: {
                      type: 'field',
                      field: 'sampleField3',
                    },
                    rhs: {
                      type: 'value',
                      value: 'compare3',
                    },
                  },
                },
              ],
            },
            {
              condition: 'AND',
              rules: [
                {
                  id: 'sampleField4',
                  operator: 'is',
                  data: {
                    lhs: {
                      type: 'field',
                      field: 'sampleField4',
                    },
                    rhs: {
                      type: 'value',
                      value: 'compare4',
                    },
                  },
                },
                {
                  id: 'sampleField5',
                  operator: 'is',
                  data: {
                    lhs: {
                      type: 'field',
                      field: 'sampleField5',
                    },
                    rhs: {
                      type: 'value',
                      value: 'compare5',
                    },
                  },
                },
              ],
            },
          ],
        }
      );
    });
    test('should formuladate return rules for a is condition', () => {
      expect(convertNetSuiteLookupFilterExpression(['formuladate:', 'is', 'WQEF'])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 'formuladate',
              operator: 'is',
              data: {
                lhs: {
                  type: 'expression',
                  field: 'formuladate',
                  expression: '',
                },
                rhs: {
                  type: 'value',
                  value: 'WQEF',
                },
              },
            },
          ],
        }
      );
    });
    test('should formuladate  and expression 2 not a string return rules for a is condition', () => {
      expect(convertNetSuiteLookupFilterExpression(['formuladate:', 'is', 3])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 'formuladate',
              operator: 'is',
              data: {
                lhs: {
                  type: 'expression',
                  field: 'formuladate',
                  expression: '',
                },
                rhs: {
                  type: 'value',
                  value: '3',
                },
              },
            },
          ],
        }
      );
    });
    test('should have formuladate as part of initial expression', () => {
      expect(convertNetSuiteLookupFilterExpression(['formuladate:', 'is', '{{{someText}}}'], [{id: 'someText'}])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 'formuladate',
              operator: 'is',
              data: {
                lhs: {
                  type: 'expression',
                  field: 'formuladate',
                  expression: '',
                },
                rhs: {
                  type: 'field',
                  field: 'someText',
                },
              },
            },
          ],
        }
      );
    });
    test('should formula date as part of expression and no data array for field is provided', () => {
      expect(convertNetSuiteLookupFilterExpression(['formuladate:', 'is', '{{{someText}}}'])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 'formuladate',
              operator: 'is',
              data: {
                lhs: {
                  type: 'expression',
                  field: 'formuladate',
                  expression: '',
                },
                rhs: {
                  type: 'expression',
                  expression: '{{{someText}}}',
                },
              },
            },
          ],
        }
      );
    });
    test('should have not as first operator and no and in the complete expression', () => {
      expect(convertNetSuiteLookupFilterExpression(['NOT', ['sampleField', 'is', 'WQEF']])).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              not: true,
              condition: 'AND',
              rules: [
                {
                  id: 'sampleField',
                  operator: 'is',
                  data: {
                    lhs: {
                      type: 'field',
                      field: 'sampleField',
                    },
                    rhs: {
                      type: 'value',
                      value: 'WQEF',
                    },
                  },
                },
              ],
            },
          ],
        }
      );
    });
    test('should return default condition and rules when no rules provided', () => {
      expect(convertNetSuiteLookupFilterExpression([])).toEqual(
        {condition: 'AND', rules: [{}]}
      );
    });
  });
});

