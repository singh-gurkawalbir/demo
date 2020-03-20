import {
  allAreTrue,
  comparedTo,
  fallsWithinNumericalRange,
  isValue,
  isNotValue,
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  noneAreTrue,
  someAreTrue,
} from './validation';

const validators = {
  allAreTrue,
  comparedTo,
  fallsWithinNumericalRange,
  is: isValue,
  isNot: isNotValue,
  lengthIsGreaterThan,
  lengthIsLessThan,
  matchesRegEx,
  noneAreTrue,
  someAreTrue,
};

export default validators;
