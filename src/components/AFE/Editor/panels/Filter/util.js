import {
  invert,
  isBoolean,
  isNumber,
  isString,
  isArray,
  tail,
  filter,
} from 'lodash';
import { message } from '../../../../../utils/messageStore';
import { isNumber as isNumberString } from '../../../../../utils/string';

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

export function getFilterRuleId(rule) {
  return rule.id.split('_rule_')[1];
}

const dataTypes = ['boolean', 'epochtime', 'number', 'string'];
const transformations = ['ceiling', 'floor', 'lowercase', 'uppercase', 'abs'];

export function checkExpression(rule) {
  // check if expression has nested datatypes
  // this is an invalid case for the UI, but it needs to be handled
  // for ex: the expression
  // ["string",["string",["extract","myField"]]]
  if (!rule || !Array.isArray(rule)) return false;

  if (dataTypes.includes(rule[0].toLowerCase()) &&
      Array.isArray(rule[1]) &&
      dataTypes.includes(rule[1][0].toLowerCase())) {
    return true;
  }

  if (transformations.includes(rule[0].toLowerCase()) &&
      Array.isArray(rule[1]) &&
      transformations.includes(rule[1][0].toLowerCase())) {
    return true;
  }

  return !dataTypes.includes(rule[0].toLowerCase()) &&
  !transformations.includes(rule[0].toLowerCase());
}

export function convertIOFilterExpression(filterExpression = [], context) {
  /* eslint-disable no-param-reassign */
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
              checkExpression(exp[i])
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

                  temp.transformations.unshift(tempExp[0].toLowerCase());
                  [, tempExp] = tempExp;
                } else {
                  dataTypeFound = true;
                }
              } while (!dataTypeFound);

              if (tempExp[0].toLowerCase() === 'epochtime' && !isArray(tempExp[1])) {
                temp.type = 'value';
                [, temp.value] = tempExp;
                temp.dataType = tempExp[0].toLowerCase();
                // eslint-disable-next-line no-continue
                continue;
              }

              temp.dataType = tempExp[0].toLowerCase();
              temp.type = 'field';
              [, [, temp.field]] = tempExp;

              if (tempExp[1][0] === 'extract') {
                temp.field = `${context}.${temp.field}`;
              } else if (tempExp[1][0] === 'settings') {
                temp.field = `settings.${temp.field}`;
              } else if (tempExp[1][0] === 'context') {
                // temp.field = temp.field;
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
  /* eslint-disable no-param-reassign */

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
            jsonPaths.push({
              id: 'record.sampleField',
              name: 'record.sampleField',
            });
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

const validBooleanValues = {
  TRUE: ['true', 't', '1', 1],
  FALSE: ['false', 'f', '0', 0],
};

export const convertBoolean = value => {
  if (value === true) return true;
  if (value === false) return false;

  if (value && typeof value === 'string') {
    // if the value coming has prepended or appended spaces ex: ' false '
    value = value.trim();
    value = value.toLowerCase();
  }

  // Check values against validBooleanValues map.
  if (validBooleanValues.TRUE.indexOf(value) !== -1) {
    return true;
  } if (validBooleanValues.FALSE.indexOf(value) !== -1) {
    return false;
  }

  // invalid values: throw error
  if (isNumberString(value)) return message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_NUMBER;

  return message.FILTER_PANEL.INVALID_BOOLEAN_CONVERSION_FOR_STRING;
};

export function generateIOFilterExpression(rules, context) {
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
          if (rr.data.lhs.field?.startsWith(`${context}.`)) {
            lhs = [
              rr.data.lhs.dataType,
              ['extract', rr.data.lhs.field.replace(`${context}.`, '')],
            ];
          } else if (rr.data.lhs.field?.startsWith('settings.')) {
            lhs = [
              rr.data.lhs.dataType,
              ['settings', rr.data.lhs.field.replace('settings.', '')],
            ];
          } else {
            lhs = [rr.data.lhs.dataType, ['context', rr.data.lhs.field]];
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
              lhs = Number.isNaN(parseFloat(rr.data.lhs.value)) ? rr.data.lhs.value : parseFloat(rr.data.lhs.value);
              break;
            case 'boolean': {
              const convertedValue = convertBoolean(lhs?.toString()?.toLowerCase());

              lhs = typeof convertedValue === 'boolean' ? convertedValue : lhs;
              break;
            }
            case 'epochtime':
              lhs = ['epochtime', lhs];
              break;
            default:
          }
        } else if (rr.data.lhs.type === 'expression') {
          try {
            lhs = JSON.parse(typeof rr.data.lhs.expression === 'string' ? rr.data.lhs.expression : JSON.stringify(rr.data.lhs.expression));
          } catch (ex) {
            // error in parsing expression
          }
        }

        if (rr.value === null) {
          exp.push([operatorsMap.jQueryToIOFilters[rr.operator], lhs]);
        } else {
          if (rr.data.rhs.type === 'field') {
            if (rr.data.rhs.field.startsWith(`${context}.`)) {
              rhs = [
                rr.data.rhs.dataType,
                ['extract', rr.data.rhs.field.replace(`${context}.`, '')],
              ];
            } else if (rr.data.rhs.field.startsWith('settings.')) {
              rhs = [
                rr.data.rhs.dataType,
                ['settings', rr.data.rhs.field.replace('settings.', '')],
              ];
            } else {
              rhs = [rr.data.rhs.dataType, ['context', rr.data.rhs.field]];
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
                rhs = Number.isNaN(parseFloat(rr.data.rhs.value)) ? rr.data.rhs.value : parseFloat(rr.data.rhs.value);
                break;
              case 'boolean': {
                const convertedValue = convertBoolean(rhs?.toString()?.toLowerCase());

                rhs = typeof convertedValue === 'boolean' ? convertedValue : rhs;
                break;
              }
              case 'epochtime':
                rhs = ['epochtime', rhs];
                break;
              default:
            }
          } else if (rr.data.rhs.type === 'expression') {
            try {
              rhs = JSON.parse(rr.data.rhs.expression);
            } catch (ex) {
              // error in parsing expression
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
    'abs',
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
        toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION;
      }
    } catch (ex) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION_JSON;
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
        toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION;
      }
    } catch (ex) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION_JSON;
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

  if (r.rhs.type === 'value' || r.lhs.type === 'value') {
    const {dataType: dataTypeRhs, value: valueRhs, type: typeRhs} = r.rhs;
    const {dataType: dataTypeLhs, value: valueLhs, type: typeLhs} = r.lhs;

    // skipping check for other data types because
    // string: value will always be a string
    // datetime: we don't have validations for datetime
    if ((typeRhs === 'value' && dataTypeRhs === 'number' && !isNumber(valueRhs)) ||
        (typeLhs === 'value' && dataTypeLhs === 'number' && !isNumber(valueLhs))) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.INVALID_DATATYPE;

      return toReturn;
    }

    if (typeRhs === 'value' && dataTypeRhs === 'boolean') {
      const convertedValue = convertBoolean(valueRhs);

      if (typeof convertedValue !== 'boolean') {
        toReturn.isValid = false;
        toReturn.error = convertedValue;

        return toReturn;
      }
    }

    if (typeLhs === 'value' && dataTypeLhs === 'boolean') {
      const convertedValue = convertBoolean(valueLhs);

      if (typeof convertedValue !== 'boolean') {
        toReturn.isValid = false;
        toReturn.error = convertedValue;

        return toReturn;
      }
    }
  }
  /*
    if (r.lhs.dataType === 'epochtime' || r.rhs.dataType === 'epochtime') {
      r.lhs.dataType = r.rhs.dataType = 'epochtime'
    }
    */
  if (r.lhs.dataType && r.rhs.dataType && r.lhs.dataType !== r.rhs.dataType) {
    toReturn.isValid = false;
    toReturn.error = message.FILTER_PANEL.INVALID_DATATYPES_OPERANDS;
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  if (r.lhs.type && !r.lhs[r.lhs.type]) {
    toReturn.isValid = false;
    toReturn.error = message.FILTER_PANEL.SELECT_LEFT_OPERAND;
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  if (r.rhs.type && !r.rhs[r.rhs.type]) {
    toReturn.isValid = false;
    toReturn.error = message.FILTER_PANEL.SELECT_RIGHT_OPERAND;
  }

  if (!toReturn.isValid) {
    return toReturn;
  }

  return toReturn;
}

