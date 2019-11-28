/* eslint-disable no-param-reassign */
import { isString, isArray, filter, invert } from 'lodash';

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

export function convertNetSuiteQualifierExpressionToQueryBuilderRules(
  qualifierExpression = []
) {
  function iterate(exp) {
    const toReturn = {};
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
        [, , ...toReturn.rulesTemp] = exp;

        if (toReturn.rulesTemp.length === 1) {
          toReturn.rules.push(iterate(toReturn.rulesTemp[0]));
        } else {
          toReturn.rules.push(iterate(toReturn.rulesTemp));
        }

        delete toReturn.rulesTemp;
      } else if (operatorsMap.ioFiltersToJQuery[exp[1].toLowerCase()]) {
        toReturn.operator =
          operatorsMap.ioFiltersToJQuery[exp[1].toLowerCase()];
        toReturn.lhs = {};
        toReturn.rhs = {};

        for (i = 0; i < exp.length; i += 2) {
          if (i === 0) {
            toReturn.lhs.type = 'field';
            toReturn.lhs.value = exp[i];
          } else {
            toReturn.rhs.type = 'value';
            toReturn.rhs.value = exp[i];
            toReturn.value = exp[i];
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

  return rulesState;
}

export function generateNetSuiteLookupFilterExpression(qbRules) {
  const nsFilterExpression = [];
  let lhs;
  let rhs;
  let filter;

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
      } else {
        filter.push(qbRules.rules[i].value);
      }

      nsFilterExpression.push(filter);
    }

    if (i < qbRules.rules.length - 1) {
      nsFilterExpression.push((qbRules.condition || 'AND').toLowerCase());
    }
  }

  return nsFilterExpression.length === 1
    ? nsFilterExpression[0]
    : nsFilterExpression;
}
