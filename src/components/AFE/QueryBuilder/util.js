/* eslint-disable no-param-reassign */
import {
  invert,
  isBoolean,
  isNumber,
  isString,
  isArray,
  tail,
  filter,
} from 'lodash';

const operatorsMap = {
  jQueryToIOFilters: {
    is_empty: 'empty',
    is_not_empty: 'notempty',
    equal: 'equals',
    not_equal: 'notequals',

    greater: 'greaterthan',
    greater_or_equal: 'greaterthanequals',
    less: 'lessthan',
    less_or_equal: 'lessthanequals',

    begins_with: 'startswith',
    ends_with: 'endswith',
    contains: 'contains',
    not_contains: 'doesnotcontain',

    matches: 'matches',
  },
};

operatorsMap.ioFiltersToJQuery = invert(operatorsMap.jQueryToIOFilters);

export function convertIOFilterExpression(filterExpression = []) {
  const dataTypes = ['boolean', 'epochtime', 'number', 'string'];
  const transformations = ['ceiling', 'floor', 'lowercase', 'uppercase'];

  function iterate(exp) {
    const toReturn = {};
    let oneRule = {};
    let temp = {};
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
      } else if (operatorsMap.ioFiltersToJQuery[exp[0].toLowerCase()]) {
        toReturn.operator =
          operatorsMap.ioFiltersToJQuery[exp[0].toLowerCase()];
        toReturn.lhs = {};
        toReturn.rhs = {};

        for (i = 1; i < exp.length; i += 1) {
          if (i === 1) {
            temp = toReturn.lhs;
          } else {
            temp = toReturn.rhs;
          }

          if (isArray(exp[i])) {
            if (
              !dataTypes.includes(exp[i][0].toLowerCase()) &&
              !transformations.includes(exp[i][0].toLowerCase())
            ) {
              temp.type = 'expression';
              temp.expression = exp[i];
            } else {
              let dataTypeFound = false;
              let tempExp = exp[i];

              do {
                if (transformations.includes(tempExp[0].toLowerCase())) {
                  if (!temp.transformations) {
                    temp.transformations = [];
                  }

                  temp.transformations.push(tempExp[0].toLowerCase());
                  [, tempExp] = tempExp;
                } else {
                  dataTypeFound = true;
                }
              } while (!dataTypeFound);

              temp.dataType = tempExp[0].toLowerCase();
              temp.type = 'field';
              [, [, temp.field]] = tempExp;

              if (tempExp[1][0] === 'context') {
                temp.field = ['_CONTEXT', temp.field].join('.');
              }

              if (i === 1) {
                toReturn.id = temp.field;
              }
            }
          } else {
            temp.type = 'value';
            temp.value = exp[i];

            if (isBoolean(exp[i])) {
              temp.dataType = 'boolean';
            } else if (isNumber(exp[i])) {
              temp.dataType = 'number';
            } else if (isString(exp[i])) {
              temp.dataType = 'string';
            }
          }
        }
      }
    }

    return toReturn;
  }

  let tr = iterate(filterExpression);

  if (!tr.condition) {
    tr = {
      condition: 'AND',
      rules: tr,
    };
  }

  if (!isArray(tr.rules)) {
    tr.rules = [tr.rules];
  }

  return { rules: tr };
}

export function getFiltersMetadata(filters, rules) {
  function iterate(r) {
    r.rules.forEach(rr => {
      if (rr.condition) {
        iterate(rr);
      } else {
        if (!rr.id) {
          if (filters.length === 0) {
            filters.push({ id: 'sampleField', name: 'sampleField' });
          }

          rr.id = filters[0].id;
        }

        if (!filter(filters, { id: rr.id }).length) {
          filters.push({ id: rr.id });
        }
      }
    });
  }

  iterate(rules);

  return filters;
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

export function generateIOFilterExpression(rules) {
  function iterate(r) {
    let exp = [];
    let lhs;
    let rhs;

    if (r.condition) {
      exp.push(r.condition.toLowerCase());
    }

    r.rules.forEach(rr => {
      if (rr.condition) {
        exp.push(iterate(rr));
      } else {
        lhs = undefined;
        rhs = undefined;

        if (rr.data.lhs.type === 'field') {
          lhs = [rr.data.lhs.dataType, ['extract', rr.data.lhs.field]];

          if (rr.data.lhs.field.indexOf('_CONTEXT.') === 0) {
            lhs[1] = ['context', rr.data.lhs.field.replace('_CONTEXT.', '')];
          }

          if (rr.data.lhs.transformations) {
            JSON.parse(JSON.stringify(rr.data.lhs.transformations)).forEach(
              t => {
                lhs = [t, lhs];
              }
            );
          }
        } else if (rr.data.lhs.type === 'value') {
          lhs = rr.data.lhs.value;

          switch (rr.data.lhs.dataType) {
            case 'number':
              lhs = parseInt(rr.data.lhs.value, 10);
              break;
            case 'boolean':
              lhs =
                lhs &&
                lhs.toString() &&
                lhs.toString().toLowerCase() === 'true';
              break;
            default:
          }
        } else if (rr.data.lhs.type === 'expression') {
          try {
            lhs = JSON.parse(rr.data.lhs.expression);
          } catch (ex) {
            console.log(`error parsing expression : ${rr.data.lhs.expression}`);
          }
        }

        if (rr.value === null) {
          exp.push([operatorsMap.jQueryToIOFilters[rr.operator], lhs]);
        } else {
          if (rr.data.rhs.type === 'field') {
            rhs = [rr.data.rhs.dataType, ['extract', rr.data.rhs.field]];

            if (rr.data.rhs.field.indexOf('_CONTEXT.') === 0) {
              rhs[1] = ['context', rr.data.rhs.field.replace('_CONTEXT.', '')];
            }

            if (rr.data.rhs.transformations) {
              JSON.parse(JSON.stringify(rr.data.rhs.transformations)).forEach(
                t => {
                  rhs = [t, rhs];
                }
              );
            }
          } else if (rr.data.rhs.type === 'value') {
            rhs = rr.data.rhs.value;

            switch (rr.data.rhs.dataType) {
              case 'number':
                rhs = parseInt(rr.data.rhs.value, 10);
                break;
              case 'boolean':
                rhs =
                  rhs &&
                  rhs.toString() &&
                  rhs.toString().toLowerCase() === 'true';
                break;
              default:
            }
          } else if (rr.data.rhs.type === 'expression') {
            try {
              rhs = JSON.parse(rr.data.rhs.expression);
            } catch (ex) {
              console.log(
                `error parsing expression : ${rr.data.rhs.expression}`
              );
            }
          }

          if (
            rr.data.lhs.dataType === 'epochtime' ||
            rr.data.rhs.dataType === 'epochtime'
          ) {
            rr.data.lhs.dataType = 'epochtime';
            rr.data.rhs.dataType = 'epochtime';
          }

          exp.push([operatorsMap.jQueryToIOFilters[rr.operator], lhs, rhs]);
        }
      }
    });

    if (r.condition && r.rules && r.rules.length <= 1) {
      [, exp] = exp;
    }

    if (r.not && exp) {
      exp = ['not', exp];
    }

    return exp;
  }

  return iterate(rules);
}
