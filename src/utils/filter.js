/* eslint-disable no-param-reassign */
import { isString, isArray } from 'lodash';
import errorMessageStore from './errorStore';

const filterOperatorsHashMap = {
  and: {
    variatic: true, // takes unlimited arguments
    argSize: 2,
    argDataType: 'boolean',
    returnDataType: 'boolean',
  },
  or: {
    variatic: true, // takes unlimited arguments
    argSize: 2,
    argDataType: 'boolean',
    returnDataType: 'boolean',
  },
  empty: {
    argSize: 1,
    returnDataType: 'boolean',
  },
  notempty: {
    argSize: 1,
    returnDataType: 'boolean',
  },
  not: {
    argSize: 1,
    argDataType: 'boolean',
    returnDataType: 'boolean',
  },
  string: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'string',
  },
  boolean: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'boolean',
  },
  number: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
  },
  abs: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
  },
  epochtime: {
    dataTypeOp: true,
    argSize: 1,
    returnDataType: 'number',
  },
  equals: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  notequals: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  greaterthan: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  lessthan: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  greaterthanequals: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  lessthanequals: {
    argSize: 2,
    returnDataType: 'boolean',
  },
  startswith: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
  },
  endswith: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
  },
  matches: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
  },
  contains: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
  },
  doesnotcontain: {
    argSize: 2,
    argDataType: 'string',
    returnDataType: 'boolean',
  },
  replace: {
    argSize: 3,
    argDataType: 'string',
    returnDataType: 'string',
  },
  uppercase: {
    argSize: 1,
    argDataType: 'string',
    returnDataType: 'string',
  },
  lowercase: {
    argSize: 1,
    argDataType: 'string',
    returnDataType: 'string',
  },
  floor: {
    argSize: 1,
    argDataType: 'number',
    returnDataType: 'number',
  },
  ceiling: {
    argSize: 1,
    argDataType: 'number',
    returnDataType: 'number',
  },
  add: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
  },
  subtract: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
  },
  multiply: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
  },
  divide: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
  },
  modulo: {
    argSize: 2,
    argDataType: 'number',
    returnDataType: 'number',
  },
};

const fieldOperationsHashMap = [
  'extract',
  'context',
  'options',
  'settings',
];

function isSubTree(leaf) {
  return Array.isArray(leaf) && leaf.length;
}

export function validateRecursive(filtersTree, callingOperator) {
  if (!filtersTree || !isSubTree(filtersTree)) {
    throw new Error(errorMessageStore('FILTER_RULES_VALIDATE_NONEMPTY'));
  }

  if (!isString(filtersTree[0])) {
    throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_OPERATIONNAME', { operationName: filtersTree[0] }));
  }

  const OPERATION_NAME = filtersTree[0].toLowerCase().trim();

  if (!filterOperatorsHashMap[OPERATION_NAME] && !fieldOperationsHashMap.includes(OPERATION_NAME)) {
    throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_OPERATIONNAME', { operationName: OPERATION_NAME }));
  }

  if (fieldOperationsHashMap.includes(OPERATION_NAME)) {
    if (filtersTree.length !== 2) {
      throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_ARGSIZE', {
        operationName: OPERATION_NAME,
        argCount: (filtersTree.length - 1),
      }));
    }

    if (isSubTree(filtersTree[1])) {
      throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_NOTSUBTREE', { operationName: OPERATION_NAME }));
    }

    if (!isString(filtersTree[1]) || !filtersTree[1]) {
      throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_STRINGARG', {
        operationName: OPERATION_NAME,
        argType: String(typeof filtersTree[1]),
      }));
    }

    if (!callingOperator || !filterOperatorsHashMap[callingOperator].dataTypeOp === true) {
      throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_FIELDOP_TYPECONV', {
        operationName: OPERATION_NAME,
        callingOperation: (callingOperator || 'nothing'),
      }));
    }

    // Return internal "data type" saying this fieldOp is valid
    return 'FIELD_OP_PASSED_VALIDATION';
  }
  const FILTER_OP_META = filterOperatorsHashMap[OPERATION_NAME];

  if ((!FILTER_OP_META.variatic && FILTER_OP_META.argSize && FILTER_OP_META.argSize !== filtersTree.length - 1) ||
          (FILTER_OP_META.variatic && FILTER_OP_META.argSize && FILTER_OP_META.argSize > filtersTree.length - 1)) {
    throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_ARGSIZE', {
      operationName: OPERATION_NAME,
      expectedArgCount: ((FILTER_OP_META.variatic ? 'at least ' : 'exactly ') + FILTER_OP_META.argSize),
      actualArgCount: (filtersTree.length - 1),
    }));
  }

  let dataTypeToCheck = null;
  let prevDataType = null;

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < filtersTree.length; i++) {
    if (isArray(filtersTree[i])) {
      dataTypeToCheck = validateRecursive(filtersTree[i], OPERATION_NAME);
    } else {
      dataTypeToCheck = String(typeof filtersTree[i]);
    }
    // Field Ops can return any type, and type conversion functions take any type
    // If we just saw a fieldOp we can just return data Type here
    if (dataTypeToCheck !== 'FIELD_OP_PASSED_VALIDATION') {
      // Data Type check succeeds if:
      // 1. All args are same data type
      // 2. All args match operator's expected arg type, if set
      if (i > 1) {
        if (dataTypeToCheck !== prevDataType) {
          throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_ARGSTYPESMATCH', {
            argNumber: i,
            operationName: OPERATION_NAME,
            dataType: dataTypeToCheck,
          }));
        }
      }
      prevDataType = dataTypeToCheck;

      if (FILTER_OP_META.argDataType && dataTypeToCheck !== FILTER_OP_META.argDataType) {
        throw new Error(errorMessageStore('FILTERSTREE_VALIDATE_EXPECTEDARGTYPES', {
          argNumber: i,
          operationName: OPERATION_NAME,
          expectedArgType: FILTER_OP_META.argDataType,
          actualArgType: dataTypeToCheck,
        }));
      }
    }
  }

  return FILTER_OP_META.returnDataType;
}
