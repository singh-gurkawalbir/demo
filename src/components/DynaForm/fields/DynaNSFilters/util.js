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

export function updateNSExpressionForNOTs(exp) {
  for (let i = 0; i < exp.length; i += 1) {
    if (exp[i] === 'NOT') {
      exp[i] = isArray(exp[i + 1][0])
        ? ['NOT', updateNSExpressionForNOTs(exp[i + 1])]
        : ['NOT', exp[i + 1]];
      exp.splice(i + 1, 1);
    } else if (isArray(exp[i])) {
      exp[i] = updateNSExpressionForNOTs(exp[i]);
    }
  }

  return exp;
}

export function updateNSExpressionForConditions(exp) {
  let toReturn = [];
  let prevCondition;

  if (isArray(exp) && exp.length === 1) {
    return updateNSExpressionForConditions(exp[0]);
  }

  if (exp[0] === 'NOT') {
    if (isArray(exp[1]) && isArray(exp[1][0])) {
      toReturn.push('NOT');
      toReturn.push(updateNSExpressionForConditions(exp[1]));
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
            toReturn.push(updateNSExpressionForConditions(exp[i - 1]));
          } else {
            toReturn.push(exp[i - 1]);
          }
        }

        if (isComplexNSExpression(exp[i + 1])) {
          toReturn.push(updateNSExpressionForConditions(exp[i + 1]));
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

export function convertNSExpressionToQueryBuilderRules(exp, exportData) {
  function parseFilter(exp) {
    const toReturn = {};
    let field;
    let filteredFields;

    [toReturn.id] = exp;
    [, toReturn.operator] = exp;
    toReturn.data = {
      lhs: {
        type: 'field',
        field: exp[0],
      },
    };

    if (
      exp[0].indexOf('formuladate:') === 0 ||
      exp[0].indexOf('formulanumeric:') === 0 ||
      exp[0].indexOf('formulatext:') === 0
    ) {
      toReturn.data.lhs.type = 'expression';
      [toReturn.id] = exp[0].split(':');
      toReturn.data.lhs.field = toReturn.id;
      toReturn.data.lhs.expression = exp[0].replace(`${toReturn.id}:`, '');
    }

    toReturn.data.rhs = {};

    if (exp[2]) {
      if (exp[2].indexOf('{{') > -1) {
        field = exp[2]
          .replace('{{{', '')
          .replace('}}}', '')
          .replace('{{', '')
          .replace('}}', '');

        filteredFields = exportData.filter(f => f.id === field);

        if (filteredFields.length > 0) {
          toReturn.data.rhs = {
            type: 'field',
            field,
          };
        } else {
          toReturn.data.rhs = {
            type: 'expression',
            expression: exp[2],
          };
        }
      } else {
        toReturn.data.rhs = {
          type: 'value',
          value: exp[2],
        };
      }
    }

    return toReturn;
  }

  function iterate(exp) {
    let toReturn = {};
    let oneRule = {};
    let i = 0;

    if (!exp.length) {
      return toReturn;
    }

    if (isString(exp[0])) {
      if (exp[0].toUpperCase() === 'NOT') {
        toReturn.not = true;
        [, exp] = exp;

        if (!['AND', 'OR'].includes(exp[0].toUpperCase())) {
          exp = ['and', exp];
        }
      }

      if (['AND', 'OR'].includes(exp[0].toUpperCase())) {
        toReturn.condition = exp[0].toUpperCase();
        toReturn.rulesTemp = tail(exp, 1);
        toReturn.rules = [];

        for (i = 0; i < toReturn.rulesTemp.length; i += 1) {
          oneRule = iterate(toReturn.rulesTemp[i]);
          toReturn.rules.push(oneRule);
        }

        delete toReturn.rulesTemp;
      } else {
        toReturn = parseFilter(exp);
      }
    }

    return toReturn;
  }

  let tr = iterate(exp);

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

export function convertIOFilterExpression(filterExpression = []) {
  let e = updateNSExpressionForNOTs(filterExpression);

  e = updateNSExpressionForConditions(e);
  e = convertNSExpressionToQueryBuilderRules(e);

  return e;
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

  iterate(rules);

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

export function generateIOExpression(exp) {
  const toReturn = [];
  let lhs;
  let rhs;
  let filter;

  for (let i = 0; i < exp.rules.length; i += 1) {
    if (exp.rules[i].not) {
      toReturn.push('NOT');
    }

    if (exp.rules[i].rules && exp.rules[i].rules.length > 0) {
      toReturn.push(generateIOExpression(exp.rules[i]));
    } else {
      if (
        ['formuladate', 'formulanumeric', 'formulatext'].indexOf(
          exp.rules[i].id
        ) > -1
      ) {
        lhs = [exp.rules[i].id, exp.rules[i].data.lhs.expression].join(':');
      } else {
        lhs = exp.rules[i].id;
      }

      filter = [lhs, exp.rules[i].operator];

      if (['isempty', 'isnotempty'].indexOf(exp.rules[i].operator) > -1) {
        filter.push('');
      } else if (exp.rules[i].data && exp.rules[i].data.rhs) {
        rhs = exp.rules[i].data.rhs[exp.rules[i].data.rhs.type || 'field'];

        if (exp.rules[i].data.rhs.type === 'field') {
          rhs = `{{{${rhs}}}}`;
        }

        if (rhs) {
          filter.push(rhs);
        }
      }

      toReturn.push(filter);
    }

    if (i < exp.rules.length - 1) {
      toReturn.push(exp.condition || 'AND');
    }
  }

  return toReturn.length === 1 ? toReturn[0] : toReturn;
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
