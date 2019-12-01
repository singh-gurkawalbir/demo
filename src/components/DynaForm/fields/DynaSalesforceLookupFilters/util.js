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

export function convertSalesforceLookupFilterExpression(expression, data = []) {
  function generateRules(expression) {
    let toReturn = {};
    let value = expression;

    if (expression.type === 'SimpleExprParentheses') {
      [value] = expression.value.value;
    }

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

    return toReturn;
  }

  if (!expression) {
    return {
      condition: 'AND',
      rules: [],
    };
  }

  const updatedExpression = expression
    .replace(/{{{/g, "'{{{")
    .replace(/}}}\)/g, "}}}')");
  let whereClause;

  try {
    whereClause = parser.parse(`select * from table where ${updatedExpression}`)
      .value.where;
  } catch (ex) {
    return {
      condition: 'AND',
      rules: [],
    };
  }

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

  return salesforceFilterExpression;
}
