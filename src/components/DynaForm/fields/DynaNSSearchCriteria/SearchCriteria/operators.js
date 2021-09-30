export const operators = [
  { label: 'After', value: 'after' },
  { label: 'all of', value: 'allof' },
  { label: 'any', value: 'any' },
  { label: 'any of', value: 'anyof' },
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
  { label: 'none of', value: 'noneof' },
  { label: 'not after', value: 'notafter' },
  { label: 'not all of', value: 'notallof' },
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
];
export const operatorsByFieldType = {
  checkbox: ['is'],
  text: ['contains', 'doesnotcontain', 'doesnotstartwith', 'equalto', 'haskeywords', 'is', 'isempty', 'isnot', 'isnotempty', 'startswith'],
  date: ['after', 'before', 'isempty', 'isnotempty', 'notafter', 'notbefore', 'noton', 'notonorafter', 'notonorbefore', 'notwithin', 'on', 'onorafter', 'onorbefore', 'within'],
  select: ['anyof', 'noneof'],
  currency: ['between', 'equalto', 'greaterthan', 'greaterthanorequalto', 'isempty', 'isnotempty', 'lessthan', 'lessthanorequalto', 'notbetween', 'notequalto', 'notgreaterthan', 'notgreaterthanorequalto', 'notlessthan', 'notlessthanorequalto'],
  multiselect: ['allof', 'anyof', 'noneof', 'notallof'],
};

operatorsByFieldType.ccnumber = operatorsByFieldType.checkbox;
operatorsByFieldType.textarea = operatorsByFieldType.text;
operatorsByFieldType.phone = operatorsByFieldType.text;
operatorsByFieldType.email = operatorsByFieldType.text;
operatorsByFieldType.inlinehtml = operatorsByFieldType.text;
operatorsByFieldType.image = operatorsByFieldType.text;
operatorsByFieldType.url = operatorsByFieldType.text;
operatorsByFieldType.datetime = operatorsByFieldType.date;
operatorsByFieldType.datetimetz = operatorsByFieldType.date;
operatorsByFieldType.integer = operatorsByFieldType.currency;
operatorsByFieldType.float = operatorsByFieldType.currency;
