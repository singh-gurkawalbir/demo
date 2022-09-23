const operators = [
  { label: 'After', value: 'after' },
  { label: 'any', value: 'any' },
  { label: 'before', value: 'before' },
  { label: 'between', value: 'between' },
  { label: 'contains', value: 'contains' },
  { label: 'does not contain', value: 'doesnotcontain' },
  { label: 'does not start with', value: 'doesnotstartwith' },
  { label: 'equal to', value: 'equalto' },
  { label: 'greater than', value: 'greaterthan' },
  { label: 'greater than or equal to', value: 'greaterthanorequalto' },
  { label: 'has key words', value: 'haskeywords' },
  { label: 'is', value: 'is' },
  { label: 'is empty', value: 'isempty' },
  { label: 'is not', value: 'isnot' },
  { label: 'is not empty', value: 'isnotempty' },
  { label: 'less than', value: 'lessthan' },
  { label: 'less than or equal to', value: 'lessthanorequalto' },
  { label: 'not after', value: 'notafter' },
  { label: 'not before', value: 'notbefore' },
  { label: 'not between', value: 'notbetween' },
  { label: 'not equal to', value: 'notequalto' },
  { label: 'not greater than', value: 'notgreaterthan' },
  { label: 'not greater than or equal to', value: 'notgreaterthanorequalto' },
  { label: 'not less than', value: 'notlessthan' },
  { label: 'not less than or equal to', value: 'notlessthanorequalto' },
  { label: 'not on', value: 'noton' },
  { label: 'not on or after', value: 'notonorafter' },
  { label: 'not on or before', value: 'notonorbefore' },
  { label: 'not within', value: 'notwithin' },
  { label: 'on', value: 'on' },
  { label: 'on or after', value: 'onorafter' },
  { label: 'on or before', value: 'onorbefore' },
  { label: 'starts with', value: 'startswith' },
  { label: 'within', value: 'within' },
  { label: 'all of', value: 'allof' },
  { label: 'any of', value: 'anyof' },
  { label: 'none of', value: 'noneof' },
  { label: 'not all of', value: 'notallof' },
];

const DEFAULT_FIELD_TYPES = ['boolean', 'number', 'string', 'datetime'];

// string, number, datetime, boolean are supported field types to configure query builder
const supportedOperatorsByFieldType = {
  string: ['contains', 'doesnotcontain', 'doesnotstartwith', 'equalto', 'haskeywords', 'is', 'isempty', 'isnot', 'isnotempty', 'startswith'],
  number: ['between', 'equalto', 'greaterthan', 'greaterthanorequalto', 'isempty', 'isnotempty', 'lessthan', 'lessthanorequalto', 'notbetween', 'notequalto', 'notgreaterthan', 'notgreaterthanorequalto', 'notlessthan', 'notlessthanorequalto'],
  datetime: ['after', 'before', 'isempty', 'isnotempty', 'notafter', 'notbefore', 'noton', 'notonorafter', 'notonorbefore', 'notwithin', 'on', 'onorafter', 'onorbefore', 'within'],
  // we are using boolean datatype for select/multiselect types as  qb supports these 4 data types
  boolean: ['allof', 'anyof', 'noneof', 'notallof'],
};

// string, integer, double, date, time, datetime and boolean are supported field types for filters passed to queryBuilder while initialization
// Below are the possible NS field types mapped to relevant queryBuilder supported field types
export const fieldTypeMap = {
  checkbox: 'string',
  text: 'string',
  date: 'datetime',
  select: 'boolean',
  currency: 'integer',
  multiselect: 'boolean',
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
  if (supportedOperatorsByFieldType.boolean.includes(operator)) {
    supportedFieldTypes.push('boolean');
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
