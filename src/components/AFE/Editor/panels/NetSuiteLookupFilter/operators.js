import { operators } from '../../../../DynaForm/fields/DynaNSSearchCriteria/SearchCriteria/operators';

const DEFAULT_FIELD_TYPES = ['boolean', 'number', 'string', 'datetime'];

// string, number, datetime, boolean are supported field types to configure query builder
const supportedOperatorsByFieldType = {
  string: ['contains', 'doesnotcontain', 'doesnotstartwith', 'equalto', 'haskeywords', 'is', 'isempty', 'isnot', 'isnotempty', 'startswith'],
  number: ['between', 'equalto', 'greaterthan', 'greaterthanorequalto', 'isempty', 'isnotempty', 'lessthan', 'lessthanorequalto', 'notbetween', 'notequalto', 'notgreaterthan', 'notgreaterthanorequalto', 'notlessthan', 'notlessthanorequalto'],
  datetime: ['after', 'before', 'isempty', 'isnotempty', 'notafter', 'notbefore', 'noton', 'notonorafter', 'notonorbefore', 'notwithin', 'on', 'onorafter', 'onorbefore', 'within'],
};

// string, integer, double, date, time, datetime and boolean are supported field types for filters passed to queryBuilder while initialization
// Below are the possible NS field types mapped to relevant queryBuilder supported field types
export const fieldTypeMap = {
  checkbox: 'string',
  text: 'string',
  date: 'datetime',
  select: 'string',
  currency: 'integer',
  multiselect: 'string',
  ccnumber: 'string',
  textarea: 'string',
  phone: 'string',
  email: 'string',
  inlinehtml: 'string',
  image: 'string',
  url: 'string',
  datetime: 'datetime',
  datetimetz: 'datetime',
  integer: 'integer',
  float: 'integer',
};

/**
 * Constructs operator labels to pass while configuring queryBuilder
 * Ex: [{ equalto: 'equal to' }]
 */
export const langOperators = operators.map(op => ({ [op.value]: op.label }));

/**
 * Constructs map with operators to its related supported field types
 * Ex: { isempty: ['number', 'datetime'] }
 */
const operatorsAppliedToFieldTypeMap = operators.reduce((operatorMap, op) => {
  const operator = op.value;

  const supportedFieldTypes = [];

  if (supportedOperatorsByFieldType.string.includes(operator)) {
    supportedFieldTypes.push('string');
  }
  if (supportedOperatorsByFieldType.number.includes(operator)) {
    supportedFieldTypes.push('number');
  }
  if (supportedOperatorsByFieldType.datetime.includes(operator)) {
    supportedFieldTypes.push('datetime');
  }

  return {...operatorMap, [operator]: supportedFieldTypes};
}, {});

/**
 * returns operator config which we pass to queryBuilder while initializing
 * It contains all possible operators and their default props to handle by queryBuilder
 * Ex: [{
        type: 'isempty',
        nb_inputs: 0,
        multiple: false,
        apply_to: appliedTo
    }]
 */
export const operatorConfig = operators.map(op => {
  const operator = op.value;
  const appliedTo = operatorsAppliedToFieldTypeMap[operator] || DEFAULT_FIELD_TYPES;

  switch (operator) {
    case 'isempty':
    case 'isnotempty': {
      return {
        type: operator,
        nb_inputs: 0,
        multiple: false,
        apply_to: appliedTo,
      };
    }
    default: {
      return {
        type: operator,
        nb_inputs: 1,
        multiple: false,
        apply_to: appliedTo,
      };
    }
  }
});
