/* eslint-disable no-param-reassign */
import { isArray, filter, invert } from 'lodash';
import parser from 'js-sql-parser';

const operatorsMap = {
  jQueryToIOFilters: {
    equalto: '=',
    not_equal: '!=',
    less: '<',
    less_or_equal: '<=',
    greater: '>',
    greater_or_equal: '>=',
  },
};

operatorsMap.ioFiltersToJQuery = invert(operatorsMap.jQueryToIOFilters);

export function getFilterRuleId(rule) {
  return rule.id.split('_rule_')[1];
}

export function isComplexSalesforceFilterExpression(expression) {
  let isComplexExpression = false;

  if (isArray(expression)) {
    expression.forEach((e, i) => {
      if (!isComplexExpression) {
        if (isArray(e)) {
          isComplexExpression = isComplexSalesforceFilterExpression(e);
        } else if (i > 0 && ['AND', 'OR'].includes(e)) {
          isComplexExpression = true;
        }
      }
    });
  }

  return isComplexExpression;
}

export function convertSalesforceLookupFilterExpression(expression, data = []) {
  console.log(
    `convertSalesforceLookupFilterExpression expression ${expression}`
  );
  function generateRules(expression) {
    let toReturn = {};
    let value = expression;

    if (expression.type === 'SimpleExprParentheses') {
      [value] = expression.value.value;
    }

    console.log(`value ${JSON.stringify(value)}`);

    if (['AND', 'OR'].includes(value.operator)) {
      toReturn.condition = value.operator.toUpperCase();
      toReturn.rules = [generateRules(value.left), generateRules(value.right)];
    } else {
      toReturn = {
        id: value.left.value,
        field: value.left.value,
        operator: operatorsMap.ioFiltersToJQuery[value.operator.toLowerCase()],
        value: value.right.value
          .replace(/(^'\{{3})(.*)(\}{3}')$/g, '$2')
          .replace(/^\w+\s/, ''),
      };
      const isInData = data.find(f => f.id === toReturn.value);

      toReturn.data = {
        lhs: { type: 'field' },
        rhs: {
          type: isInData ? 'field' : 'value',
          [isInData ? 'field' : 'value']: toReturn.value,
        },
      };
    }

    // if (!toReturn.condition) {
    //   return {
    //     condition: 'AND',
    //     rules: [toReturn],
    //   };
    // }

    return toReturn;
  }

  if (!expression) {
    return {
      condition: 'AND',
      rules: [],
    };
  }

  let updatedExpression = expression.replace(/{{{/g, "'{{{");

  console.log(`updatedExpression1 ${updatedExpression}`);

  updatedExpression = updatedExpression.replace(/}}}\)/g, "}}}')");
  console.log(`updatedExpression2 ${updatedExpression}`);

  let whereClause;

  try {
    whereClause = parser.parse(`select * from table where ${updatedExpression}`)
      .value.where;
  } catch (ex) {
    return {};
  }

  console.log(`whereClause ${JSON.stringify(whereClause)}`);

  let qbRules = generateRules(whereClause);

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

export function generateSalesforceLookupFilterExpression(
  qbRules,
  salesforceFilterDataTypes
) {
  console.log(
    `salesforceFilterDataTypes ${JSON.stringify(salesforceFilterDataTypes)}`
  );

  let lhs;
  let rhs;
  let salesforceFilterExpression = '';

  /**
   * A and B and C is not allowed in backend.
   * So, we need to convert it to A and [B and C]
   */
  if (qbRules.rules.length > 2) {
    const [firstRule, ...otherRules] = qbRules.rules;

    qbRules.rules = [
      firstRule,
      { condition: qbRules.condition, rules: otherRules },
    ];
  }

  for (let i = 0; i < qbRules.rules.length; i += 1) {
    if (qbRules.rules[i].rules && qbRules.rules[i].rules.length > 0) {
      salesforceFilterExpression += generateSalesforceLookupFilterExpression(
        qbRules.rules[i],
        salesforceFilterDataTypes
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

      if (qbRules.rules[i].data && qbRules.rules[i].data.rhs) {
        rhs =
          qbRules.rules[i].data.rhs[qbRules.rules[i].data.rhs.type || 'field'];

        rhs = `{{{${salesforceFilterDataTypes[lhs]} ${rhs}}}}`;
      }

      salesforceFilterExpression += `(${lhs} ${
        operatorsMap.jQueryToIOFilters[qbRules.rules[i].operator]
      } ${rhs})`;
    }

    if (i < qbRules.rules.length - 1) {
      salesforceFilterExpression += ` ${qbRules.condition || 'AND'} `;
    }
  }

  if (qbRules.rules.length > 1) {
    salesforceFilterExpression = `(${salesforceFilterExpression})`;
  }

  console.log(`salesforceFilterExpression ${salesforceFilterExpression}`);

  return salesforceFilterExpression;
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
