/* eslint-disable no-param-reassign */
import { isString, isArray, tail, filter } from 'lodash';

export function getFilterRuleId(rule) {
  return rule.id.split('_rule_')[1];
}

export function isComplexNetSuiteFilterExpression(expression) {
  let isComplexExpression = false;

  if (isArray(expression)) {
    expression.forEach((e, i) => {
      if (!isComplexExpression) {
        if (isArray(e)) {
          isComplexExpression = isComplexNetSuiteFilterExpression(e);
        } else if (i > 0 && ['AND', 'OR'].includes(e)) {
          isComplexExpression = true;
        }
      }
    });
  }

  return isComplexExpression;
}

export function updateNetSuiteLookupFilterExpressionForNOTs(expression) {
  for (let i = 0; i < expression.length; i += 1) {
    if (expression[i] === 'NOT') {
      expression[i] = isArray(expression[i + 1][0])
        ? [
            'NOT',
            updateNetSuiteLookupFilterExpressionForNOTs(expression[i + 1]),
          ]
        : ['NOT', expression[i + 1]];
      expression.splice(i + 1, 1);
    } else if (isArray(expression[i])) {
      expression[i] = updateNetSuiteLookupFilterExpressionForNOTs(
        expression[i]
      );
    }
  }

  return expression;
}

export function updateNetSuiteLookupFilterExpressionForConditions(expression) {
  let updatedExpression = [];
  let prevCondition;

  if (isArray(expression) && expression.length === 1) {
    return updateNetSuiteLookupFilterExpressionForConditions(expression[0]);
  }

  if (expression[0] === 'NOT') {
    if (isArray(expression[1]) && isArray(expression[1][0])) {
      updatedExpression.push('NOT');
      updatedExpression.push(
        updateNetSuiteLookupFilterExpressionForConditions(expression[1])
      );
    }
  } else {
    for (let i = 0; i < expression.length; i += 1) {
      if (expression[i] === 'AND' || expression[i] === 'OR') {
        if (prevCondition !== expression[i]) {
          prevCondition = expression[i];
          updatedExpression.push(expression[i]);
        }

        if (updatedExpression.length === 1) {
          if (isComplexNetSuiteFilterExpression(expression[i - 1])) {
            updatedExpression.push(
              updateNetSuiteLookupFilterExpressionForConditions(
                expression[i - 1]
              )
            );
          } else {
            updatedExpression.push(expression[i - 1]);
          }
        }

        if (isComplexNetSuiteFilterExpression(expression[i + 1])) {
          updatedExpression.push(
            updateNetSuiteLookupFilterExpressionForConditions(expression[i + 1])
          );
        } else {
          updatedExpression.push(expression[i + 1]);
        }

        i += 1;
      }
    }
  }

  if (updatedExpression.length === 0) {
    updatedExpression = ['AND', expression];
  }

  return updatedExpression;
}

export function convertNetSuiteLookupFilterExpressionToQueryBuilderRules(
  expression,
  data
) {
  function parseFilter(expression) {
    const rule = {
      id: expression[0],
      operator: expression[1],
      data: {
        lhs: {
          type: 'field',
          field: expression[0],
        },
      },
    };
    let field;
    let filteredFields;

    if (
      expression[0].indexOf('formuladate:') === 0 ||
      expression[0].indexOf('formulanumeric:') === 0 ||
      expression[0].indexOf('formulatext:') === 0
    ) {
      rule.data.lhs.type = 'expression';
      [rule.id] = expression[0].split(':');
      rule.data.lhs.field = rule.id;
      rule.data.lhs.expression = expression[0].replace(`${rule.id}:`, '');
    }

    rule.data.rhs = {};

    if (expression[2]) {
      if (expression[2].indexOf('{{') > -1) {
        field = expression[2]
          .replace('{{{', '')
          .replace('}}}', '')
          .replace('{{', '')
          .replace('}}', '');

        filteredFields = data.filter(f => f.id === field);

        if (filteredFields.length > 0) {
          rule.data.rhs = {
            type: 'field',
            field,
          };
        } else {
          rule.data.rhs = {
            type: 'expression',
            expression: expression[2],
          };
        }
      } else {
        rule.data.rhs = {
          type: 'value',
          value: expression[2],
        };
      }
    }

    return rule;
  }

  function iterate(expression) {
    let rules = {};
    let i = 0;

    if (!expression.length) {
      return rules;
    }

    if (isString(expression[0])) {
      if (expression[0].toUpperCase() === 'NOT') {
        rules.not = true;
        [, expression] = expression;

        if (!['AND', 'OR'].includes(expression[0].toUpperCase())) {
          expression = ['and', expression];
        }
      }

      if (['AND', 'OR'].includes(expression[0].toUpperCase())) {
        rules.condition = expression[0].toUpperCase();
        rules.rulesTemp = tail(expression, 1);
        rules.rules = [];

        for (i = 0; i < rules.rulesTemp.length; i += 1) {
          rules.rules.push(iterate(rules.rulesTemp[i]));
        }

        delete rules.rulesTemp;
      } else {
        rules = parseFilter(expression);
      }
    }

    return rules;
  }

  let qbRules = iterate(expression);

  if (!qbRules.condition) {
    qbRules = {
      condition: 'AND',
      rules: qbRules,
    };
  }

  if (!isArray(qbRules.rules)) {
    qbRules.rules = [qbRules.rules];
  }

  return qbRules;
}

export function convertNetSuiteLookupFilterExpression(
  filterExpression = [],
  data = []
) {
  let expression = updateNetSuiteLookupFilterExpressionForNOTs(
    filterExpression
  );

  expression = updateNetSuiteLookupFilterExpressionForConditions(expression);
  expression = convertNetSuiteLookupFilterExpressionToQueryBuilderRules(
    expression,
    data
  );

  return expression;
}

export function getFilterList(jsonPaths, rules) {
  function iterate(r) {
    r.rules.forEach(rr => {
      if (rr.condition) {
        iterate(rr);
      } else {
        if (!rr.id) {
          if (jsonPaths.length === 0) {
            jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
          }

          rr.id = jsonPaths[0].id;
        }

        if (!filter(jsonPaths, { id: rr.id }).length) {
          jsonPaths.push({ id: rr.id });
        }

        if (rr.rhs && rr.rhs.type === 'field' && rr.rhs.field) {
          if (!filter(jsonPaths, { id: rr.rhs.field }).length) {
            jsonPaths.push({ id: rr.rhs.field });
          }
        }
      }
    });
  }

  if (rules.length > 0) {
    iterate(rules);
  }

  if (jsonPaths.length === 0) {
    jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
  }

  return jsonPaths;
}

export function generateRulesState(rules) {
  const rulesState = {};
  let ruleIndex = -1;

  function iterate(r) {
    r.rules.forEach(rr => {
      if (rr.condition) {
        iterate(rr);
      } else {
        ruleIndex += 1;
        rulesState[ruleIndex] = {
          data: rr.data,
        };
      }
    });
  }

  iterate(rules);

  return rulesState;
}

export function generateNetSuiteLookupFilterExpression(qbRules) {
  const nsFilterExpression = [];
  let lhs;
  let rhs;
  let filter;

  for (let i = 0; i < qbRules.rules.length; i += 1) {
    if (qbRules.rules[i].not) {
      nsFilterExpression.push('NOT');
    }

    if (qbRules.rules[i].rules && qbRules.rules[i].rules.length > 0) {
      nsFilterExpression.push(
        generateNetSuiteLookupFilterExpression(qbRules.rules[i])
      );
    } else {
      if (
        ['formuladate', 'formulanumeric', 'formulatext'].indexOf(
          qbRules.rules[i].id
        ) > -1
      ) {
        lhs = `${qbRules.rules[i].id}:${qbRules.rules[i].data.lhs.expression}`;
      } else {
        lhs = qbRules.rules[i].id;
      }

      filter = [lhs, qbRules.rules[i].operator];

      if (['isempty', 'isnotempty'].indexOf(qbRules.rules[i].operator) > -1) {
        filter.push('');
      } else if (qbRules.rules[i].data && qbRules.rules[i].data.rhs) {
        rhs =
          qbRules.rules[i].data.rhs[qbRules.rules[i].data.rhs.type || 'field'];

        if (qbRules.rules[i].data.rhs.type === 'field') {
          rhs = `{{{${rhs}}}}`;
        }

        if (rhs) {
          filter.push(rhs);
        }
      }

      nsFilterExpression.push(filter);
    }

    if (i < qbRules.rules.length - 1) {
      nsFilterExpression.push(qbRules.condition || 'AND');
    }
  }

  return nsFilterExpression.length === 1
    ? nsFilterExpression[0]
    : nsFilterExpression;
}

export function validateFilterRule(rule) {
  const arithmeticOperators = [
    'add',
    'subtract',
    'divide',
    'multiply',
    'modulo',
    'ceiling',
    'floor',
    'number',
  ];
  const r = rule.data;
  const validation = {
    isValid: true,
    error: '',
  };
  let op;

  if (r.lhs.type === 'expression') {
    try {
      JSON.parse(r.lhs.expression);

      if (JSON.parse(r.lhs.expression).length < 2) {
        validation.isValid = false;
        validation.error = 'Please enter a valid expression.';
      }
    } catch (ex) {
      validation.isValid = false;
      validation.error = 'Expression should be a valid JSON.';
    }

    if (validation.isValid) {
      [op] = JSON.parse(r.lhs.expression);

      if (arithmeticOperators.includes(op)) {
        r.lhs.dataType = 'number';
      } else if (op === 'epochtime') {
        r.lhs.dataType = 'epochtime';
      } else if (op === 'boolean') {
        r.lhs.dataType = 'boolean';
      } else {
        r.lhs.dataType = 'string';
      }
    }
  }

  if (!validation.isValid) {
    return validation;
  }

  if (r.rhs.type === 'expression') {
    try {
      JSON.parse(r.rhs.expression);

      if (JSON.parse(r.rhs.expression).length < 2) {
        validation.isValid = false;
        validation.error = 'Please enter a valid expression.';
      }
    } catch (ex) {
      validation.isValid = false;
      validation.error = 'Expression should be a valid JSON.';
    }

    if (validation.isValid) {
      [op] = JSON.parse(r.rhs.expression);

      if (arithmeticOperators.includes(op)) {
        r.rhs.dataType = 'number';
      } else if (op === 'epochtime') {
        r.rhs.dataType = 'epochtime';
      } else if (op === 'boolean') {
        r.rhs.dataType = 'boolean';
      } else {
        r.rhs.dataType = 'string';
      }
    }
  }

  if (!validation.isValid) {
    return validation;
  }

  if (r.lhs.dataType && r.rhs.dataType && r.lhs.dataType !== r.rhs.dataType) {
    validation.isValid = false;
    validation.error = 'Data types of both the operands should match.';
  }

  if (!validation.isValid) {
    return validation;
  }

  if (r.lhs.type && !r.lhs[r.lhs.type]) {
    validation.isValid = false;
    validation.error = 'Please select left operand.';
  }

  if (!validation.isValid) {
    return validation;
  }

  if (r.rhs.type && !r.rhs[r.rhs.type]) {
    validation.isValid = false;
    validation.error = 'Please select right operand.';
  }

  if (!validation.isValid) {
    return validation;
  }

  return validation;
}
