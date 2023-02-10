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

export function convertSalesforceLookupFilterExpression(expression, data = [], ssLinkedConnectionId) {
  function generateRules(expression) {
    let toReturn = {};
    let value = expression;

    // To handle nested wrapped braces
    while (value.type === 'SimpleExprParentheses') {
      [value] = value.value.value;
    }

    if (['AND', 'OR'].includes(value.operator)) {
      toReturn.condition = value.operator.toUpperCase();
      toReturn.rules = [generateRules(value.left), generateRules(value.right)];
    } else {
      let rightValue = value.right;

      // To handle nested wrapped braces
      while (rightValue.type === 'SimpleExprParentheses') {
        [rightValue] = rightValue.value.value;
      }
      toReturn = {
        id: value.left.value,
        field: value.left.value,
        operator: operatorsMap.ioFiltersToJQuery[value.operator.toLowerCase()],
        value: (typeof rightValue?.value === 'string')
          ? rightValue.value?.replace(/(^'\{{3})(.*)(\}{3}')$/g, '$2') // support double, triple braces
          ?.replace(/(^'\{{2})(.*)(\}{2}')$/g, '$2')
          ?.replace(/^\w+\s/, '')
          : '',
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

  if (!expression || typeof expression === 'object' || expression.length === 0) {
    return {
      condition: 'AND',
      rules: [],
    };
  }
  const updatedExpression = ssLinkedConnectionId ? expression.replace(/"and"/g, '"AND"').replace(/"or"/g, '"OR"').replace(/\[/g, '(').replace(/\]/g, ')')
    .replace(/"/g, '')
    .replace(/,/g, ' ')
    .replace(/[a-zA-Z.]+\)/g, '{{{$&}}}')
    .replace(/\)}}}/g, '}}})')
    .replace(/{{{/g, "'{{{")
    .replace(/}}}\)/g, "}}}')")
    : expression
      .replace(/\s+{{{/g, "'<<<") // support single, double, triple braces
      .replace(/}}}\)/g, ">>>')")
      .replace(/\s+{{/g, "'<<")
      .replace(/}}\)/g, ">>')")
      .replace(/\s+{/g, "'<")
      .replace(/}\)/g, ">')")
      .replaceAll('<', '{')
      .replaceAll('>', '}');

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

  // skipping this condition for the unit test case because it is not reachable
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
        if (qbRules.rules[i].data.rhs.type === 'field') {
          rhs = `{{{${salesforceFilterDataTypes[lhs]} ${rhs}}}}`;
        }
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

export function convertValueToSuiteScriptSupportedExpression(expression) {
  return expression.replace(/{{{[a-zA-Z]*\s/g, '')
    .replace(/}}}/g, '').replace(/\(/g, '[').replace(/\)/g, ']')
    .replace(/OR/g, ',or,')
    .replace(/AND/g, ',and,')
    .replace(/[a-zA-Z_.]+/g, '"$&"')
    .replace(/[=!<>]+/g, ',"$&",')
    .replace(/\s/g, '');
}
