import {
  getFilterRuleId,
  getFilterList,
  generateRulesState,
  generateSalesforceLookupFilterExpression,
  convertValueToSuiteScriptSupportedExpression,
  convertSalesforceLookupFilterExpression,
} from './util';

describe("SalesForceLokkupFilter's util test cases", () => {
  test('getFilterRuleId function test case', () => {
    expect(getFilterRuleId({ id: 'firstText_rule_expectedText' })).toBe(
      'expectedText'
    );
  });
  describe('getFilterList function test', () => {
    test('should set jsonpath when no json path is provided and no id is present for rule', () => {
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

      expect(getFilterList([], rule)).toEqual([
        { id: 'sampleField', name: 'sampleField' },
      ]);
    });
  });
  describe('generateRulesState function test', () => {
    test('should call the function with condition as or', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            data: 'somedata',
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual({ 0: { data: 'somedata' } });
    });
    test('should call the function with rule having its own condtion', () => {
      const rule = {
        condition: 'OR',
        rules: [
          {
            condition: 'OR',
            rules: [{ data: 'somedata' }],
            value: "'test string'",
            id: 'sampleField',
          },
        ],
      };

      expect(generateRulesState(rule)).toEqual({ 0: { data: 'somedata' } });
    });
  });
  describe('generateSalesforceLookupFilterExpression function test cases', () => {
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe('((Id = Account.Id) AND (Fax = {{{phone AssistantPhone}}}))');
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe(
        '((formuladate:somexpresion = Account.Id) AND (Fax = {{{phone AssistantPhone}}}))'
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe(
        '((formulanumeric:somexpresion = Account.Id) AND (Fax = {{{phone AssistantPhone}}}))'
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe(
        '((formulatext:somexpresion = Account.Id) AND (Fax = {{{phone AssistantPhone}}}))'
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe('(Fax = {{{phone AssistantPhone}}})');
    });
    test('should take field as by default type when type of data data is not provided', () => {
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe('(Fax = AssistantPhone)');
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe('((Fax = {{{phone AssistantPhone}}}) AND ((Fax = {{{phone AssistantPhone}}}) AND (Fax = {{{phone AssistantPhone}}})))');
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
        generateSalesforceLookupFilterExpression(
          qbRules,
          salesforceFilterDataTypes
        )
      ).toBe('(Fax = Fax)');
    });
  });
  describe('convertValueToSuiteScriptSupportedExpression function test cases', () => {
    test('should convert the expression into suite script supported expression', () => {
      expect(convertValueToSuiteScriptSupportedExpression(
        '((Id = Account.Id) AND (Fax = {{{phone AssistantPhone}}}))'
      )).toBe(
        '[["Id","=","Account.Id"],"and",["Fax","=","AssistantPhone"]]'
      );
    });
    test('should remove any extra spaces from the expression', () => {
      expect(convertValueToSuiteScriptSupportedExpression(
        '((Id = Account.Id)      OR (Fax = {{{phone AssistantPhone}}}))'
      )).toBe(
        '[["Id","=","Account.Id"],"or",["Fax","=","AssistantPhone"]]'
      );
    });
    test('should return string with doubled quotes added', () => {
      expect(convertValueToSuiteScriptSupportedExpression(
        'a.sometext'
      )).toBe(
        '"a.sometext"'
      );
    });
  });
  describe('convertSalesforceLookupFilterExpression', () => {
    test('should return default when no expression provided', () => {
      expect(convertSalesforceLookupFilterExpression()).toEqual(
        {
          condition: 'AND',
          rules: [],
        }
      );
    });
    test('should return when expression of type object', () => {
      expect(convertSalesforceLookupFilterExpression({})).toEqual(
        {
          condition: 'AND',
          rules: [],
        }
      );
    });
    test('should return when expression array provided length is 0', () => {
      expect(convertSalesforceLookupFilterExpression([])).toEqual(
        {
          condition: 'AND',
          rules: [],
        }
      );
    });
    test('should return the expression when try catch block throws error', () => {
      expect(convertSalesforceLookupFilterExpression('[]')).toEqual(
        {
          condition: 'AND',
          rules: [],
        }
      );
    });
    test('should make the rules with type of value in data', () => {
      expect(convertSalesforceLookupFilterExpression('(Id = value)')).toEqual(
        {
          condition: 'AND',
          rules: [
            {
              id: 'Id',
              field: 'Id',
              operator: 'equalto',
              value: 'value',
              data: { lhs: { type: 'field' }, rhs: { type: 'value', value: 'value' } },
            },
          ],
        }
      );
    });
    test('should make the rules with type of field in data', () => {
      const data = [{id: 'id1'}, {id: 'id2'}];

      expect(convertSalesforceLookupFilterExpression('((Name = id1) OR (Description = id2))', data)).toEqual(
        {
          condition: 'OR',
          rules: [
            {
              id: 'Name',
              field: 'Name',
              operator: 'equalto',
              value: 'id1',
              data: { lhs: { type: 'field' }, rhs: { type: 'field', field: 'id1' } },
            },
            {
              id: 'Description',
              field: 'Description',
              operator: 'equalto',
              value: 'id2',
              data: { lhs: { type: 'field' }, rhs: { type: 'field', field: 'id2' } },
            },
          ],
        }
      );
    });
  });
  test('should make the rules when sslinkId is provided', () => {
    expect(convertSalesforceLookupFilterExpression('((Id = value))', [], 'sslinkId')).toEqual(
      {
        condition: 'AND',
        rules: [
          {
            id: 'Id',
            field: 'Id',
            operator: 'equalto',
            value: 'value',
            data: { lhs: { type: 'field' }, rhs: { type: 'value', value: 'value' } },
          },
        ],
      }
    );
  });
});
