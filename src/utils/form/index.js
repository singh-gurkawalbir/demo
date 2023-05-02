/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import set from 'lodash/set';
import {
  isString,
  isArray,
  isNumber,

} from 'lodash';
import moment from 'moment';

import {
  fieldDefIsValidUpdated,
  getFirstDefinedValue,
  shouldOptionsBeRefreshed,
  splitDelimitedValue,
} from './field';
import { validateAllFields } from './validation';

// Because this function can be passed with the state of a component form
// it is not mutating the supplied fields array but returning a new instance
// each time, this is less efficient (when passing entire fieldDef arrays to the
// form) but safer when children of forms are registering themselves

// this is necessary to initialize the defaultRule state
const adjustDefaultVisibleRequiredValue = field => {
  if (typeof field.visible === 'boolean') {
    field.defaultVisible = field.visible;
  }
  if (typeof field.required === 'boolean') {
    field.defaultRequired = field.required;
  }
};

function and(opArguments) {
  return (opArguments[0] === true && opArguments[1] === true);
}

function or(opArguments) {
  return (opArguments[0] === true || opArguments[1] === true);
}

function empty(opArguments) {
  if (opArguments[0] !== null && opArguments[0] !== undefined && opArguments[0] !== '') return false;

  return true;
}

function not(opArguments) {
  return !opArguments[0];
}

function notEmpty(opArguments) {
  return !empty(opArguments);
}

function equals(opArguments) {
  return opArguments[0] === opArguments[1];
}

function notEquals(opArguments) {
  return opArguments[0] !== opArguments[1];
}

function greaterThan(opArguments) {
  return opArguments[0] > opArguments[1];
}

function lessThan(opArguments) {
  return opArguments[0] < opArguments[1];
}

function greaterThanEquals(opArguments) {
  return opArguments[0] >= opArguments[1];
}

function lessThanEquals(opArguments) {
  return opArguments[0] <= opArguments[1];
}

function startsWith(opArguments) {
  opArguments[0] = opArguments[0] === null ? '' : opArguments[0];
  opArguments[1] = opArguments[1] === null ? '' : opArguments[1];

  return String(opArguments[0]).startsWith(String(opArguments[1]));
}

function endsWith(opArguments) {
  opArguments[0] = opArguments[0] === null ? '' : opArguments[0];
  opArguments[1] = opArguments[1] === null ? '' : opArguments[1];

  return String(opArguments[0]).endsWith(String(opArguments[1]));
}

function matches(opArguments) {
  const re = new RegExp(opArguments[1], 'ig');

  return re.test(String(opArguments[0]));
}

// evals to true if opArguments[0] contains opArguments[1]
function contains(opArguments) {
  opArguments[0] = opArguments[0] === null ? '' : opArguments[0];
  opArguments[1] = opArguments[1] === null ? '' : opArguments[1];

  return String(opArguments[0]).indexOf(String(opArguments[1])) > -1;
}

// evals to true if opArguments[0] not contains opArguments[1]
function doesNotContain(opArguments) {
  return !contains(opArguments);
}

function replace(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;

  return opArguments[0].replace(opArguments[1], opArguments[2]);
}

function upperCase(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;

  return opArguments[0].toUpperCase();
}

function lowerCase(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;

  return opArguments[0].toLowerCase();
}

function floor(opArguments) {
  return Math.floor(opArguments[0]);
}

function ceiling(opArguments) {
  return Math.ceil(opArguments[0]);
}

function add(opArguments) {
  return opArguments[0] + opArguments[1];
}

function subtract(opArguments) {
  return opArguments[0] - opArguments[1];
}

function multiply(opArguments) {
  return opArguments[0] * opArguments[1];
}

function divide(opArguments) {
  if (opArguments[1] === 0) return NaN;

  return opArguments[0] / opArguments[1];
}

function modulo(opArguments) {
  return opArguments[0] % opArguments[1];
}

const GET_FIELD_REGEX = RegExp(/^\[\d+\]\.|^\d+\./);

function getPathSegments(path) {
  const segments = [];
  let buffer = [];
  let inLiteral = false;
  let escaped = false;
  let wasLiteral = false;
  let i;

  if (!path) return [];

  for (i = 0; i < path.length; i++) {
    const ch = path[i];

    if (escaped) {
      escaped = false;
      if (ch === ']') {
        buffer[buffer.length - 1] = ch;
        continue;
      }
    }

    if (ch === '\\') escaped = true;
    if (!inLiteral && ch === ' ' && (buffer.length === 0 || wasLiteral)) continue;

    if (!inLiteral && ch === '[' && buffer.length === 0) {
      inLiteral = true;
      continue;
    }

    if (inLiteral && ch === ']') {
      inLiteral = false;
      wasLiteral = true;
      continue;
    }

    if (!inLiteral && (ch === '.' || ch === '[')) {
      segments.push(buffer.join(''));
      buffer = [];
      inLiteral = ch === '[';
      wasLiteral = false;
      continue;
    }

    buffer.push(ch);
  }

  // dont forget about the final segment...
  if (buffer.length) segments.push(buffer.join(''));

  // logger.info(segments)

  return segments;
}

function getValue(obj, path) {
  if (!obj) return;
  if (!path) return obj;
  if (typeof path !== 'string') return;

  if (obj.hasOwnProperty(path)) return obj[path];

  const segments = getPathSegments(path);

  let value = obj;

  for (let i = 0; i < segments.length; i++) {
    if (!value || value[segments[i]] === undefined) return;
    value = value[segments[i]];
  }

  return value;
}

function getField(fieldId, recordData) {
  let correctedFieldId = fieldId;

  if (isArray(recordData) && !GET_FIELD_REGEX.test(correctedFieldId)) {
    correctedFieldId = `[0].${correctedFieldId}`;
  }

  return getValue(recordData, correctedFieldId);
}

function getFromContext(fieldId, recordData, contextData) {
  return getValue(contextData, fieldId);
}

function getFromSettings(fieldId, recordData, contextData, settings) {
  return getValue(settings, fieldId);
}

function toString(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;

  return opArguments[0].toString();
}

function toBoolean(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;
  if (!opArguments[0]) return null;
  if (isString(opArguments[0])) {
    if (opArguments[0] === 'true') return true;
    if (opArguments[0] === 'false') return false;
  }

  return Boolean(opArguments[0]);
}

function toNumber(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;
  let strValue = opArguments[0].toString();

  strValue = strValue.replace(/[^-\d.]/g, '');
  if (!strValue) return 0;
  const parsedNum = +strValue;

  return Number.isNaN(parsedNum) ? 0 : parsedNum;
}

function toAbsoluteNumber(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;
  let strValue = opArguments[0].toString();

  strValue = strValue.replace(/[^\d.]/g, '');
  if (!strValue) return 0;
  const parsedNum = +strValue;

  return Number.isNaN(parsedNum) ? 0 : parsedNum;
}

/**
 * converts a given string to date and returns a number representing the milliseconds
 * elapsed between 1 January 1970 00:00:00 UTC and the given date.
 * @param {Array} opArguments
 * @returns number
 */
function toEpochTime(opArguments) {
  if (!opArguments || !isArray(opArguments) || opArguments.length === 0 || opArguments[0] === null || opArguments[0] === undefined) return null;
  if (opArguments[0] instanceof Date) {
    return opArguments[0].getTime();
  }
  const dateInput = opArguments[0];

  if (!isNumber(dateInput) && !isString(dateInput)) {
    throw Error('Invalid date. Date should be either string or number.');
  }
  const mmt = moment(dateInput);

  if (!mmt.isValid()) throw Error('Invalid date. Cannot convert given string or number to date time.');

  return mmt.toDate().getTime();
}

export const registerField = (field, formValue = {}) => {
  const { defaultValue, name, value, valueDelimiter } = field;
  const initialValue = getFirstDefinedValue(
    formValue[name],
    value,
    defaultValue
  );

  adjustDefaultVisibleRequiredValue(field);
  field.value = splitDelimitedValue(initialValue, valueDelimiter);
};

export const registerFields = (fieldMapToValidate, formValue = {}) =>
  Object.keys(fieldMapToValidate).reduce((fieldsState, key) => {
    const field = {...fieldMapToValidate[key]};

    if (fieldDefIsValidUpdated(field, fieldsState)) {
      const { id } = field;

      registerField(field, formValue);
      fieldsState[id] = field;
    }

    return fieldsState;
  }, {});

export const setOptionsInFieldInState = (prevState, field, options) => {
  const fieldIndex = prevState.fields.findIndex(
    prevField => prevField.id === field.id
  );

  field.options = options;
  field.pendingOptions = undefined;

  const { fields: prevFields } = prevState;

  return {
    fields: [
      ...prevFields.slice(0, fieldIndex),
      field,
      ...prevFields.slice(fieldIndex + 1),
    ],
  };
};

const valuesMatch = (a, b) => {
  if (a && b) {
    return a.toString() === b.toString();
  }

  return a === b;
};

export const evaluateRule = (rule = {}, targetValue) => {
  const { is = [], isNot = [] } = rule;
  let hasValidValue = is.length === 0;
  let hasInvalidValue = !!rule.isNot && rule.isNot.length > 0;

  if (hasInvalidValue) {
    hasInvalidValue = isNot.some(invalidValue => {
      if (invalidValue.hasOwnProperty('value')) {
        return valuesMatch(invalidValue.value, targetValue);
      }

      return valuesMatch(invalidValue, targetValue);
    });
  }

  if (!hasInvalidValue && !hasValidValue) {
    if (rule.is && rule.is.length) {
      hasValidValue = rule.is.some(validValue => {
        if (validValue.hasOwnProperty('value')) {
          return valuesMatch(validValue.value, targetValue);
        }

        return valuesMatch(validValue, targetValue);
      });
    }
  }

  return hasValidValue && !hasInvalidValue;
};

export const evaluateAllRules = ({
  rules = [],
  fieldsById = {},
  defaultResult = true,
}) => {
  let rulesPass = defaultResult;

  if (rules.length) {
    rulesPass = rules.every(rule => {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      }
      if (rule.OR && Array.isArray(rule.OR)) {
        // eslint-disable-next-line no-use-before-define
        return evaluateSomeRules({
          rules: rule.OR,
          fieldsById,
          defaultResult,
        });
      }
      if (rule.AND && Array.isArray(rule.AND)) {
        return evaluateAllRules({
          rules: rule.AND,
          fieldsById,
          defaultResult,
        });
      }

      return defaultResult;
    });
  }

  return rulesPass;
};

export const evaluateSomeRules = ({
  rules = [],
  fieldsById = {},
  defaultResult = true,
}) => {
  let rulesPass = defaultResult;

  if (rules.length) {
    rulesPass = rules.some(rule => {
      if (rule.field && fieldsById.hasOwnProperty(rule.field)) {
        return evaluateRule(rule, fieldsById[rule.field].value);
      }

      if (rule.OR && Array.isArray(rule.OR)) {
        return evaluateSomeRules({
          rules: rule.OR,
          fieldsById,
          defaultResult,
        });
      }
      if (rule.AND && Array.isArray(rule.AND)) {
        return evaluateAllRules({
          rules: rule.AND,
          fieldsById,
          defaultResult,
        });
      }

      return defaultResult;
    });
  }

  return rulesPass;
};

export const getTouchedStateForField = (currentState, resetState) => {
  if (resetState === true) {
    return false;
  }

  return currentState;
};

const evaluateAnyAndAllRules = ({
  anyRules,
  allRules,
  defaultState,
  fieldsById,
  defaultResult,
}) => {
  if (defaultState === false) { return false; }
  if (anyRules.length) {
    return evaluateSomeRules({
      rules: anyRules,
      fieldsById,
      defaultResult,
    });
  }

  if (allRules.length) {
    return evaluateAllRules({
      rules: allRules,
      fieldsById,
      defaultResult,
    });
  }
  if (defaultState === true) { return true; }

  return defaultResult;
};
const filterOperatorsHashMap = {
  and: {
    variatic: true, // takes unlimited arguments
    argSize: 2,
    argDataType: 'boolean',
    returnDataType: 'boolean',
    op: and,
  },
  or: {
    variatic: true, // takes unlimited arguments
    argSize: 2,
    argDataType: 'boolean',
    returnDataType: 'boolean',
    op: or,
  },
  empty: {
    argSize: 1,
    returnDataType: 'boolean',
    op: empty,
  },
  notempty: {
    argSize: 1,
    returnDataType: 'boolean',
    op: notEmpty,
  },
  not: {
    argSize: 1,
    argDataType: 'boolean',
    returnDataType: 'boolean',
    op: not,
  },
  string: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'string',
    op: toString,
  },
  boolean: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'boolean',
    op: toBoolean,
  },
  number: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
    op: toNumber,
  },
  abs: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
    op: toAbsoluteNumber,
  },
  epochtime: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
    op: toEpochTime,
  },
  equals: {
    argSize: 2,
    returnDataType: 'boolean',
    op: equals,
  },
  notequals: {
    argSize: 2,
    returnDataType: 'boolean',
    op: notEquals,
  },
  greaterthan: {
    argSize: 2,
    returnDataType: 'boolean',
    op: greaterThan,
  },
  lessthan: {
    argSize: 2,
    returnDataType: 'boolean',
    op: lessThan,
  },
  greaterthanequals: {
    argSize: 2,
    returnDataType: 'boolean',
    op: greaterThanEquals,
  },
  lessthanequals: {
    argSize: 2,
    returnDataType: 'boolean',
    op: lessThanEquals,
  },
  startswith: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
    op: startsWith,
  },
  endswith: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
    op: endsWith,
  },
  matches: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
    op: matches,
  },
  contains: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
    op: contains,
  },
  doesnotcontain: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
    op: doesNotContain,
  },
  replace: {
    argSize: 3,
    argDataType: 'string',
    returnDataType: 'string',
    op: replace,
  },
  uppercase: {
    argSize: 1,
    argDataType: 'string',
    returnDataType: 'string',
    op: upperCase,
  },
  lowercase: {
    argSize: 1,
    argDataType: 'string',
    returnDataType: 'string',
    op: lowerCase,
  },
  floor: {
    argSize: 1,
    argDataType: 'number',
    returnDataType: 'number',
    op: floor,
  },
  ceiling: {
    argSize: 1,
    argDataType: 'number',
    returnDataType: 'number',
    op: ceiling,
  },
  add: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
    op: add,
  },
  subtract: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
    op: subtract,
  },
  multiply: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
    op: multiply,
  },
  divide: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
    op: divide,
  },
  modulo: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
    op: modulo,
  },
};
export const fieldOperationsHashMap = {
  extract: getField,
  context: getFromContext,
  options: getFromContext,
  settings: getFromSettings,
};

function isSubTree(leaf) {
  return isArray(leaf) && leaf.length;
}

function getOperandFromTree(operand, recordData, contextData, settings) {
  // eslint-disable-next-line no-use-before-define
  if (isSubTree(operand)) return evaluateRecursive(operand, recordData, contextData, settings);

  return operand;
}
export const evaluateFieldOp = (OPERATION_NAME, fieldId, recordData, contextData, settings) => {
  const opFunc = fieldOperationsHashMap[OPERATION_NAME];

  return opFunc(fieldId.trim(), recordData, contextData, settings);
};

function evaluateRecursive(filtersTree, recordData, contextData, settings) {
  const OPERATION_NAME = filtersTree[0].toLowerCase().trim();

  if (OPERATION_NAME === 'extract' && filtersTree?.[2]) {
    const result = evaluateFieldOp(OPERATION_NAME, `${filtersTree[1]}.${filtersTree[2]}`, recordData, contextData, settings);

    return result;
  }

  if (fieldOperationsHashMap[OPERATION_NAME]) {
    const result = evaluateFieldOp(OPERATION_NAME, filtersTree[1], recordData, contextData, settings);

    return result;
  }

  const FILTER_OP = filterOperatorsHashMap[OPERATION_NAME].op;
  let ctr = 1;
  let argsToRun = [];

  while (ctr <= filterOperatorsHashMap[OPERATION_NAME].argSize) {
    argsToRun.push(
      getOperandFromTree(filtersTree[ctr++], recordData, contextData, settings)
    );
  }

  let result = FILTER_OP(argsToRun);

  if (filterOperatorsHashMap[OPERATION_NAME].variatic) {
    while (ctr < filtersTree.length) {
      // little optimization for and/or
      if (FILTER_OP === filterOperatorsHashMap.and.op && result !== true) {
        return false;
      }
      if (FILTER_OP === filterOperatorsHashMap.or.op && result === true) {
        return true;
      }
      argsToRun = [result, getOperandFromTree(filtersTree[ctr++], recordData, contextData, settings)];

      result = FILTER_OP(argsToRun);
    }
  }

  return result;
}
export const evaluate = (filter, recordData, contextData, settings) => {
  const objectToReturn = {
    success: false,
  };

  if (!filter.rules || (Array.isArray(filter.rules) && !filter.rules.length)) {
    objectToReturn.success = true;

    return objectToReturn;
  }

  try {
    objectToReturn.success = evaluateRecursive(filter.rules, recordData, contextData, settings);
  } catch (ex) {
    objectToReturn.error = {
      code: ex.code || 'FILTER_EVALUATION_FAILED',
      source: 'connector',
      path: 'filter',
      message: `${(ex.message || 'Unexpected Error during filter execution.')}; record=${JSON.stringify(recordData)}`,
    };
  }

  return objectToReturn;
};
export const evaluateConditionalRules = ({
  _conditionIds = [], conditions = [], fieldsById,
}) => {
  const record = {...fieldsById};

  Object.keys(fieldsById).forEach(key => {
    record[key] = fieldsById[key]?.value;
  });
  const tempConditions = conditions.filter(cond => _conditionIds.includes(cond._id));
  let returnData = true;

  tempConditions.forEach(temp => {
    const data = evaluate(temp.condition.expression, record);

    returnData = returnData && !!data?.success;
  });

  return returnData;
};
export const isVisible = (field, fieldsById) => {
  const { defaultVisible, visibleWhen = [], visibleWhenAll = [], _conditionIds = [], conditions = [] } = field;

  const isVisible = evaluateAnyAndAllRules({
    anyRules: visibleWhen,
    allRules: visibleWhenAll,
    fieldsById,
    defaultState: defaultVisible,
    defaultResult: true,
    conditions,
    _conditionIds,
  });

  if (!_conditionIds.length || !conditions.length || !isVisible) {
    return isVisible;
  }

  return evaluateConditionalRules({
    fieldsById,
    conditions,
    _conditionIds,
  });
};

export const isDisabled = (field, fieldsById) => {
  const { defaultDisabled, disabledWhen = [], disabledWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: disabledWhen,
    allRules: disabledWhenAll,
    fieldsById,
    defaultState: defaultDisabled,
    defaultResult: false,
  });
};

export const isRequired = (field, fieldsById) => {
  const { defaultRequired, requiredWhen = [], requiredWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: requiredWhen,
    allRules: requiredWhenAll,
    fieldsById,
    defaultState: defaultRequired,
    defaultResult: false,
  });
};
export const isRemove = (field, fieldsById) => {
  const { defaultRemoved, removeWhen = [], removeWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: removeWhen,
    allRules: removeWhenAll,
    fieldsById,
    defaultState: defaultRemoved,
    defaultResult: false,
  });
};

export const isDelete = (field, fieldsById) => {
  const { defaultdeleted, deleteWhen = [], deleteWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: deleteWhen,
    allRules: deleteWhenAll,
    fieldsById,
    defaultState: defaultdeleted,
    defaultResult: false,
  });
};

export const setValue = (field, fieldsById) => {
  const { _conditionIdValuesMap = [], conditions = [] } = field;

  let value;

  _conditionIdValuesMap.every(condMap => {
    const evaluateCondition = evaluateConditionalRules({
      fieldsById,
      conditions,
      _conditionIds: condMap._conditionIds,
    });

    if (evaluateCondition) {
      value = condMap.values?.[0];

      return false;
    }

    return true;
  });

  return value;
};
export const isValueForceComputed = (forceComputation, stateProp) =>
  forceComputation && forceComputation.includes(stateProp);
// const fieldHash = fieldProps => JSON.stringify(fieldProps);

// mutate as much as possible to prevent rerenders
export const processFields = (
  fieldsById,
  formIsDisabled,
  resetTouchedState = false
) => {
  Object.keys(fieldsById).forEach(key => {
    const field = fieldsById[key];
    const { defaultValue, value } = field;
    const processedValue = typeof value !== 'undefined' ? value : defaultValue;

    field.value = processedValue;
  });

  Object.keys(fieldsById).forEach(key => {
    const field = fieldsById[key];
    const { touched = false, forceComputation, _conditionIdValuesMap } = field;

    field.touched = getTouchedStateForField(touched, resetTouchedState);

    if (!isValueForceComputed(forceComputation, 'visible')) { field.visible = isVisible(field, fieldsById); }

    if (!isValueForceComputed(forceComputation, 'required')) { field.required = isRequired(field, fieldsById); }

    if (!isValueForceComputed(forceComputation, 'disabled')) { field.disabled = formIsDisabled || isDisabled(field, fieldsById); }
    if (_conditionIdValuesMap?.length && !isValueForceComputed(forceComputation, 'value')) {
      field.value = setValue(field, fieldsById);
    }
  });
};

const processOptions = ({
  fields: fieldsById,
  lastFieldUpdated,
  optionsHandler,
  parentContext,
}) =>
  Object.keys(fieldsById).forEach(key => {
    const field = fieldsById[key];
    const { id, options } = field;

    if (!options || shouldOptionsBeRefreshed({ lastFieldUpdated, field })) {
      // a fields arrayexpects
      const handlerOptions = optionsHandler(
        id,
        Object.values(fieldsById),
        parentContext
      );

      if (handlerOptions) {
        field.options = handlerOptions;
        field.pendingOptions = undefined;
      }
    }
  });

export const updateFieldValue = (field, value) => {
  const updateValue = typeof value !== 'undefined' && value;

  if (field.omitWhenHidden && !field.visible) {
    // eslint-disable-next-line no-console
    console.warn('Not updating field value for', field);
  } else {
    field.value = updateValue;
  }
};

export const joinDelimitedValue = (value, valueDelimiter) => {
  if (Array.isArray(value) && valueDelimiter) {
    value = value.join(valueDelimiter);
  }

  return value;
};

export const getMissingItems = (missingFrom, foundIn) =>
  foundIn.reduce((missingItems, item) => {
    !missingFrom.includes(item) && missingItems.push(item);

    return missingItems;
  }, []);

export const determineChangedValues = field => {
  const {
    name,
    defaultValue,
    value,
    valueDelimiter,
    addedSuffix = '_added',
    removedSuffix = '_removed',
  } = field;
  const outputValues = [];
  const initialValue = splitDelimitedValue(defaultValue, valueDelimiter);

  if (Array.isArray(initialValue) && Array.isArray(value)) {
    let added = getMissingItems(initialValue, value);
    let removed = getMissingItems(value, initialValue);

    added = joinDelimitedValue(added, valueDelimiter);
    removed = joinDelimitedValue(removed, valueDelimiter);

    outputValues.push(
      {
        name: name + (addedSuffix || '_added'),
        value: added,
      },
      {
        name: name + (removedSuffix || '_removed'),
        value: removed,
      }
    );
  }

  return outputValues;
};

export const shouldOmitFieldValue = field => {
  const { omitWhenHidden, omitWhenValueIs = [], visible, value } = field;

  return (
    (omitWhenHidden && !visible) ||
    (omitWhenValueIs.length !== 0 &&
      omitWhenValueIs.some(currValue => value === currValue))
  );
};

export const calculateFormValue = fields =>
  fields.reduce((formValue, field) => {
    const { name, value, trimValue, useChangesAsValues } = field;

    if (shouldOmitFieldValue(field)) {
      return formValue;
    } if (useChangesAsValues) {
      determineChangedValues(field).forEach(({ name, value }) =>
        set(formValue, name, value)
      );
    } else {
      let processedValue = value;

      if (
        trimValue &&
        processedValue &&
        typeof processedValue.trim === 'function'
      ) {
        processedValue = processedValue.trim();
      }

      set(formValue, name, processedValue);
    }

    return formValue;
  }, {});

// lot of mutations happening here...pay attentions to any bug
export const getNextStateFromFields = formState => {
  const {
    fields,
    lastFieldUpdated,
    showValidationBeforeTouched,
    formIsDisabled,
    resetTouchedState,
    optionsHandler,
    validationHandler,
    parentContext,
  } = formState;

  processFields(fields, !!formIsDisabled, resetTouchedState);

  if (optionsHandler) {
    processOptions({
      fields,
      lastFieldUpdated,
      optionsHandler,
      parentContext,
    });
  }

  validateAllFields({
    fields,
    showValidationBeforeTouched,
    validationHandler,
    parentContext,
  });

  const fieldsArr = Object.values(fields);

  formState.value = calculateFormValue(fieldsArr);
  const isValid = fieldsArr.every(field => field.isValid);
  const isDiscretelyInvalid = fieldsArr.some(
    field => field.isDiscretelyInvalid
  );

  formState.isValid = isValid && !isDiscretelyInvalid;
};

export function getFieldIdsInLayoutOrder(layout) {
  const fields = [];

  if (!layout) return fields;
  if (layout.fields?.length) {
    // add the fields in this layout to the list
    fields.push(...layout.fields);
  }
  if (layout.containers?.length) {
    // traverse through each container and fetch the fields
    layout.containers.forEach(container => {
      fields.push(...getFieldIdsInLayoutOrder(container));
    });
  }

  return fields;
}

export function getFirstErroredFieldId(formState) {
  const { fields, fieldMeta } = formState || {};

  const orderedFieldIds = getFieldIdsInLayoutOrder(fieldMeta?.layout);

  return orderedFieldIds.find(fieldId => fields[fieldId] && fields[fieldId].visible && !fields[fieldId].isValid);
}

export function FieldDefinitionException(message, fieldId) {
  this.message = message;
  this.fieldId = fieldId;
}
