/* eslint-disable no-param-reassign */
import { invert, isString, isArray, tail, filter } from 'lodash';

const operatorsMap = {
  jQueryToIOFilters: {
    is: 'is',
    equalto: 'equalto',
    on: 'on',
    anyof: 'anyof',
    isempty: 'isempty',
    isnotempty: 'isnotempty',
  },
};

operatorsMap.ioFiltersToJQuery = invert(operatorsMap.jQueryToIOFilters);

export function getFilterRuleId(rule) {
  return rule.id.split('_rule_')[1];
}

export function isComplexNSExpression(exp) {
  let toReturn = false;

  if (isArray(exp)) {
    exp.forEach((e, i) => {
      if (!toReturn) {
        if (isArray(e)) {
          toReturn = isComplexNSExpression(e);
        } else if (i > 0 && ['AND', 'OR'].includes(e)) {
          toReturn = true;
        }
      }
    });
  }

  return toReturn;
}

export function updateNetSuiteLookupFilterExpressionForNOTs(exp) {
  for (let i = 0; i < exp.length; i += 1) {
    if (exp[i] === 'NOT') {
      exp[i] = isArray(exp[i + 1][0])
        ? ['NOT', updateNetSuiteLookupFilterExpressionForNOTs(exp[i + 1])]
        : ['NOT', exp[i + 1]];
      exp.splice(i + 1, 1);
    } else if (isArray(exp[i])) {
      exp[i] = updateNetSuiteLookupFilterExpressionForNOTs(exp[i]);
    }
  }

  return exp;
}

export function updateNetSuiteLookupFilterExpressionForConditions(exp) {
  let toReturn = [];
  let prevCondition;

  if (isArray(exp) && exp.length === 1) {
    return updateNetSuiteLookupFilterExpressionForConditions(exp[0]);
  }

  if (exp[0] === 'NOT') {
    if (isArray(exp[1]) && isArray(exp[1][0])) {
      toReturn.push('NOT');
      toReturn.push(updateNetSuiteLookupFilterExpressionForConditions(exp[1]));
    }
  } else {
    for (let i = 0; i < exp.length; i += 1) {
      if (exp[i] === 'AND' || exp[i] === 'OR') {
        if (prevCondition !== exp[i]) {
          prevCondition = exp[i];
          toReturn.push(exp[i]);
        }

        if (toReturn.length === 1) {
          if (isComplexNSExpression(exp[i - 1])) {
            toReturn.push(
              updateNetSuiteLookupFilterExpressionForConditions(exp[i - 1])
            );
          } else {
            toReturn.push(exp[i - 1]);
          }
        }

        if (isComplexNSExpression(exp[i + 1])) {
          toReturn.push(
            updateNetSuiteLookupFilterExpressionForConditions(exp[i + 1])
          );
        } else {
          toReturn.push(exp[i + 1]);
        }

        i += 1;
      }
    }
  }

  if (toReturn.length === 0) {
    toReturn = ['AND', exp];
  }

  return toReturn;
}

export function convertNetSuiteLookupFilterExpressionToQueryBuilderRules(
  exp,
  data
) {
  function parseFilter(exp) {
    const rule = {
      id: exp[0],
      operator: exp[1],
      data: {
        lhs: {
          type: 'field',
          field: exp[0],
        },
      },
    };
    let field;
    let filteredFields;

    if (
      exp[0].indexOf('formuladate:') === 0 ||
      exp[0].indexOf('formulanumeric:') === 0 ||
      exp[0].indexOf('formulatext:') === 0
    ) {
      rule.data.lhs.type = 'expression';
      [rule.id] = exp[0].split(':');
      rule.data.lhs.field = rule.id;
      rule.data.lhs.expression = exp[0].replace(`${rule.id}:`, '');
    }

    rule.data.rhs = {};

    if (exp[2]) {
      if (exp[2].indexOf('{{') > -1) {
        field = exp[2]
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
            expression: exp[2],
          };
        }
      } else {
        rule.data.rhs = {
          type: 'value',
          value: exp[2],
        };
      }
    }

    return rule;
  }

  function iterate(exp) {
    let rules = {};
    let i = 0;

    if (!exp.length) {
      return rules;
    }

    if (isString(exp[0])) {
      if (exp[0].toUpperCase() === 'NOT') {
        rules.not = true;
        [, exp] = exp;

        if (!['AND', 'OR'].includes(exp[0].toUpperCase())) {
          exp = ['and', exp];
        }
      }

      if (['AND', 'OR'].includes(exp[0].toUpperCase())) {
        rules.condition = exp[0].toUpperCase();
        rules.rulesTemp = tail(exp, 1);
        rules.rules = [];

        for (i = 0; i < rules.rulesTemp.length; i += 1) {
          rules.rules.push(iterate(rules.rulesTemp[i]));
        }

        delete rules.rulesTemp;
      } else {
        rules = parseFilter(exp);
      }
    }

    return rules;
  }

  let qbRules = iterate(exp);

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
  const toReturn = {
    isValid: true,
    error: '',
  };
  let op;

  if (r.lhs.type === 'expression') {
    try {
      JSON.parse(r.lhs.expression);

      if (JSON.parse(r.lhs.expression).length < 2) {
        toReturn.isValid = false;
        toReturn.error = 'Please enter a valid expression.';
      }
    } catch (ex) {
      toReturn.isValid = false;
      toReturn.error = 'Expression should be a valid JSON.';
    }

    if (toReturn.isValid) {
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

  if (!toReturn.isValid) {
    return toReturn;
  }

  if (r.rhs.type === 'expression') {
    try {
      JSON.parse(r.rhs.expression);

      if (JSON.parse(r.rhs.expression).length < 2) {
        toReturn.isValid = false;
        toReturn.error = 'Please enter a valid expression.';
      }
    } catch (ex) {
      toReturn.isValid = false;
      toReturn.error = 'Expression should be a valid JSON.';
    }

    if (toReturn.isValid) {
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

  if (!toReturn.isValid) {
    return toReturn;
  }

  /*
    if (r.lhs.dataType === 'epochtime' || r.rhs.dataType === 'epochtime') {
      r.lhs.dataType = r.rhs.dataType = 'epochtime'
    }
    */
  if (r.lhs.dataType && r.rhs.dataType && r.lhs.dataType !== r.rhs.dataType) {
    toReturn.isValid = false;
    toReturn.error = 'Data types of both the operands should match.';
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  if (r.lhs.type && !r.lhs[r.lhs.type]) {
    toReturn.isValid = false;
    toReturn.error = 'Please select left operand.';
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  if (r.rhs.type && !r.rhs[r.rhs.type]) {
    toReturn.isValid = false;
    toReturn.error = 'Please select right operand.';
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  return toReturn;
}
