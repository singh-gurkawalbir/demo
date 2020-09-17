export const operators = [
  { name: 'After', value: 'after' },
  { name: 'all of', value: 'allof' },
  { name: 'any', value: 'any' },
  { name: 'any of', value: 'anyof' },
  { name: 'before', value: 'before' },
  { name: 'between', value: 'between' },
  { name: 'contains', value: 'contains' },
  { name: 'does not contain', value: 'doesnotcontain' },
  { name: 'does not start with', value: 'doesnotstartwith' },
  { name: 'equal to', value: 'equalto' },
  { name: 'greater than', value: 'greaterthan' },
  { name: 'greater than or equal to', value: 'greaterthanorequalto' },
  { name: 'has key words', value: 'haskeywords' },
  { name: 'is', value: 'is' },
  { name: 'is empty', value: 'isempty' },
  { name: 'is not', value: 'isnot' },
  { name: 'is not empty', value: 'isnotempty' },
  { name: 'less than', value: 'lessthan' },
  { name: 'less than or equal to', value: 'lessthanorequalto' },
  { name: 'none of', value: 'noneof' },
  { name: 'not after', value: 'notafter' },
  { name: 'not all of', value: 'notallof' },
  { name: 'not before', value: 'notbefore' },
  { name: 'not between', value: 'notbetween' },
  { name: 'not equal to', value: 'notequalto' },
  { name: 'not greater than', value: 'notgreaterthan' },
  { name: 'not greater than or equal to', value: 'notgreaterthanorequalto' },
  { name: 'not less than', value: 'notlessthan' },
  { name: 'not less than or equal to', value: 'notlessthanorequalto' },
  { name: 'not on', value: 'noton' },
  { name: 'not on or after', value: 'notonorafter' },
  { name: 'not on or before', value: 'notonorbefore' },
  { name: 'not within', value: 'notwithin' },
  { name: 'on', value: 'on' },
  { name: 'on or after', value: 'onorafter' },
  { name: 'on or before', value: 'onorbefore' },
  { name: 'starts with', value: 'startswith' },
  { name: 'within', value: 'within' },
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
