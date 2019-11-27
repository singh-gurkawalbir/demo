/* eslint-disable no-param-reassign */
import { isString, isArray, tail, filter, invert } from 'lodash';

const operatorsMap = {
  jQueryToIOFilters: {
    is_empty: 'empty',
    is_not_empty: 'notempty',
    equal: '=',
    not_equal: '!=',
    contains: '?',

    greater: '&gt;',
    less: '&lt;',
  },
};

operatorsMap.ioFiltersToJQuery = invert(operatorsMap.jQueryToIOFilters);

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

export function convertNetSuiteQualifierExpressionToQueryBuilderRules(
  qualifierExpression = [],
  filters = []
) {
  function iterate(exp) {
    const toReturn = {};
    let temp = {};
    let i = 0;

    if (!exp.length) {
      return toReturn;
    }

    if (isString(exp[1])) {
      if (['AND', 'OR'].includes(exp[1].toUpperCase())) {
        toReturn.condition = exp[1].toUpperCase();
        [toReturn.rulesTemp] = exp;
        toReturn.rules = [];
        toReturn.rules.push(iterate(toReturn.rulesTemp));
        [, , toReturn.rulesTemp] = exp;
        toReturn.rules.push(iterate(toReturn.rulesTemp));

        delete toReturn.rulesTemp;
      } else if (operatorsMap.ioFiltersToJQuery[exp[1].toLowerCase()]) {
        toReturn.operator =
          operatorsMap.ioFiltersToJQuery[exp[1].toLowerCase()];
        toReturn.lhs = {};
        toReturn.rhs = {};

        for (i = 0; i < exp.length; i += 2) {
          if (i === 0) {
            temp = toReturn.lhs;
            temp.type = 'field';
            temp.value = exp[i];
          } else {
            temp = toReturn.rhs;
            temp.type = 'value';
            temp.value = exp[i];
          }
        }

        if (toReturn.operator === 'is_empty' && toReturn.rhs.value === false) {
          toReturn.operator = 'is_not_empty';
        }

        toReturn.id = toReturn.lhs.value;
      }
    }

    return toReturn;
  }

  let tr = iterate(qualifierExpression);

  console.log(`tr ${JSON.stringify(tr)}`);

  if (!tr.condition) {
    tr = {
      condition: 'AND',
      rules: tr,
    };
  }

  if (!isArray(tr.rules)) {
    tr.rules = [tr.rules];
  }

  return tr;
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

  console.log(`jsonPaths2 ${JSON.stringify(jsonPaths)}`);

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
          data: {
            lhs: rr.lhs,
            rhs: rr.rhs,
          },
        };
      }
    });
  }

  iterate(rules);

  console.log(`rulesState ${JSON.stringify(rulesState)}`);

  return rulesState;
}

export function generateNetSuiteLookupFilterExpression(qbRules) {
  const nsFilterExpression = [];
  let lhs;
  let rhs;
  let filter;

  for (let i = 0; i < qbRules.rules.length; i += 1) {
    if (qbRules.rules[i].rules && qbRules.rules[i].rules.length > 0) {
      nsFilterExpression.push(
        generateNetSuiteLookupFilterExpression(qbRules.rules[i])
      );
    } else {
      lhs = qbRules.rules[i].id;

      filter = [lhs, operatorsMap.jQueryToIOFilters[qbRules.rules[i].operator]];

      if (filter[1] === 'empty') {
        filter.push(true);
      } else if (filter[1] === 'notempty') {
        filter[1] = 'empty';
        filter.push(false);
      } else if (qbRules.rules[i].data && qbRules.rules[i].data.rhs) {
        rhs =
          qbRules.rules[i].data.rhs[qbRules.rules[i].data.rhs.type || 'field'];

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
