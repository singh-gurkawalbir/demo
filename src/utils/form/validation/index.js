/* eslint-disable no-param-reassign */

import { allAreTrue, someAreTrue, noneAreTrue } from './validator';

/* eslint-disable no-restricted-globals */

export const compareSize = (value, comparedTo, type) => {
  const targetValue = parseFloat(value);
  const compareValue = parseFloat(comparedTo.value);

  if (isNaN(targetValue) || isNaN(compareValue)) {
    return false;
  } else if (type === 'BIGGER') {
    return targetValue > compareValue;
  }

  return targetValue < compareValue;
};

export const findFieldsToCompareTo = (fieldsToFind, allFields) => {
  const targetFields = [];

  typeof fieldsToFind.forEach === 'function' &&
    fieldsToFind.forEach(targetField => {
      const target = allFields.find(currField => targetField === currField.id);

      if (!target) {
        // eslint-disable-next-line no-console
        console.warn(`Could not find field ${targetField} to compare against`);
      } else if (target.visible === true) {
        // TODO: Only comparing against visible fields at the moment, but is there a case where
        //       you might want to hide a value in a hidden field?
        targetFields.push(target);
      }
    });

  return targetFields;
};

export const compareLength = (value, comparedTo, type) => {
  const valueLength = value ? value.toString().length : undefined;
  const compareLength = comparedTo.value
    ? comparedTo.value.toString().length
    : undefined;

  if (valueLength === undefined || compareLength === undefined) {
    return false;
  } else if (type === 'LONGER') {
    return valueLength > compareLength;
  }

  return valueLength < compareLength;
};

export const isBigger = (value, comparedTo) =>
  compareSize(value, comparedTo, 'BIGGER');

export const isSmaller = (value, comparedTo) =>
  compareSize(value, comparedTo, 'SMALLER');

export const isLonger = (value, comparedTo) =>
  compareLength(value, comparedTo, 'LONGER');
export const isShorter = (value, comparedTo) =>
  compareLength(value, comparedTo, 'SHORTER');

export const comparedTo = ({
  value,
  fields = [],
  allFields = [],
  is = 'BIGGER',
  message,
}) => {
  const targetFields = findFieldsToCompareTo(fields, allFields);

  switch (is) {
    case 'BIGGER': {
      return targetFields.every(targetField => isBigger(value, targetField))
        ? undefined
        : message || `Not the biggest field`;
    }

    case 'SMALLER': {
      return targetFields.every(targetField => isSmaller(value, targetField))
        ? undefined
        : message || `Not the smallest field`;
    }

    case 'LONGER': {
      return targetFields.every(targetField => isLonger(value, targetField))
        ? undefined
        : message || `Not the longer field`;
    }

    case 'SHORTER': {
      return targetFields.every(targetField => isShorter(value, targetField))
        ? undefined
        : message || `Not the shortest field`;
    }

    default:
  }
};

export const lengthIsGreaterThan = ({ value, length, message }) => {
  if (!(isNaN(length) || (value || '').length > length)) {
    return message || `Should have more than ${length} characters`;
  }
};

export const lengthIsLessThan = ({ value, length, message }) => {
  if (!(isNaN(length) || (value || '').length < length)) {
    return message || `Should have more than ${length} characters`;
  }
};

// TODO: Consider option for inverting rule...
export const matchesRegEx = ({ value, pattern = '.*', message }) => {
  const regExObj = new RegExp(pattern);

  if (!regExObj.test(value)) {
    return message || 'Invalid input provided'; // <= Terrible message!
  }
};

export const getDefaultNumericalRangeErrorMessages = (min, max) => {
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    return `Value cannot be less than ${min} or greater than ${max}`;
  } else if (typeof min !== 'undefined') {
    return `Value cannot be less than ${min}`;
  } else if (typeof max !== 'undefined') {
    return `Value cannot be greater than ${max}`;
  }
};

export const fallsWithinNumericalRange = ({ value, min, max, message }) => {
  const parsedValue = parseFloat(value);

  if (
    typeof value === 'undefined' ||
    value === null ||
    (typeof value === 'string' && !value.length)
  ) {
    return undefined;
  }

  if (isNaN(parsedValue)) {
    return message || 'Value must be a number';
  }

  if (typeof min !== 'undefined' && value < min) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }

  if (typeof max !== 'undefined' && value > max) {
    return message || getDefaultNumericalRangeErrorMessages(min, max);
  }
};

export const isNotValue = ({ value, values, message }) => {
  if (values.some(currValue => currValue === value)) {
    return message || 'Unacceptable value provided';
  }
};

export const isValue = ({ value, values, message }) => {
  if (!values.some(currValue => currValue === value)) {
    return message || 'Unacceptable value provided';
  }
};

export const hasValue = value => {
  const valueIsEmptyArray = Array.isArray(value) && value.length === 0;
  const hasValue =
    (value || value === 0 || value === false) && !valueIsEmptyArray;

  return hasValue;
};

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

export const getValueFromField = field => {
  const { trimValue = false, value } = field;
  let trimmedValue = value;

  if (trimValue && trimmedValue && typeof trimmedValue.trim === 'function') {
    trimmedValue = trimmedValue.trim();
  }

  return trimmedValue;
};

// validate field  will mutate field argument...this is to leverage immer capabilities
export const validateField = (
  field,
  fieldsById,
  showValidationBeforeTouched,
  validationHandler,
  parentContext
) => {
  const { required, visible, validWhen = {}, touched = false } = field;
  let isValid = true;
  const errorMessages = [];
  const formattedErrorMessage = () => errorMessages.join('. ');

  if (visible) {
    const value = getValueFromField(field);
    const valueProvided = hasValue(value);

    if (required) {
      if (!valueProvided) {
        isValid = valueProvided;
        const { missingValueMessage = 'A value must be provided' } = field;

        errorMessages.push(missingValueMessage);
      }
    } else if (!valueProvided) {
      // do not run all validations if the field is empty

      field.isValid = true;
      field.isDiscretelyInvalid = !isValid;
      field.errorMessages = errorMessages.length ? formattedErrorMessage() : '';

      return;
    }

    isValid =
      Object.keys(validWhen).reduce((allValidatorsPass, validator) => {
        if (typeof validators[validator] === 'function') {
          const validationConfig = {
            ...validWhen[validator],
            value,

            allFields: Object.values(fieldsById),
          };
          // $FlowFixMe - covered by tests
          const message = validators[validator](validationConfig);

          if (message) {
            allValidatorsPass = false;
            errorMessages.push(message);
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('The requested validator does not exist', validator);
        }

        return allValidatorsPass;
      }, isValid) && isValid;
  }

  if (validationHandler) {
    const message = validationHandler(
      field,
      // think over this part sending the field array like this

      Object.values(fieldsById),
      parentContext
    );

    if (message) {
      isValid = false;
      errorMessages.push(message);
    }
  }

  if (!showValidationBeforeTouched && !touched) {
    field.isValid = true;
    field.isDiscretelyInvalid = !isValid;
    field.errorMessages = '';

    return;
  }

  field.isValid = isValid;
  field.isDiscretelyInvalid = !isValid;
  field.errorMessages = formattedErrorMessage();
};

export const validateAllFields = ({
  fields,
  showValidationBeforeTouched,
  validationHandler,
  parentContext,
}) => {
  Object.keys(fields).forEach(fieldKey => {
    // most of the primitives for each state are scaler values
    // so when i make changes to draft like this...immer should be smart enough to determine if that field needs to be updated
    validateField(
      fields[fieldKey],
      fields,
      showValidationBeforeTouched,
      validationHandler,
      parentContext
    );
  });
};

export const runValidator = (
  validatorKey,
  validWhen,
  valueToTest,
  allFields
) => {
  const validator = validators[validatorKey];

  if (typeof validator === 'function') {
    const validatorConfig = {
      ...validWhen[validatorKey],
      value: valueToTest,
      allFields,
    };
    const message = validator(validatorConfig);

    return message === undefined;
  }

  return false;
};

export const checkConditions = (condition, value, allFields, type) => {
  let valueToTest; // Don't initialise to current field value in case field doesn't exist

  if (condition.field) {
    const targetField = allFields.find(field => condition.field === field.id);

    if (targetField) {
      valueToTest = targetField.value;
    }
  } else {
    valueToTest = value;
  }

  const { field, ...validWhen } = condition;

  switch (type) {
    case 'some': {
      return Object.keys(validWhen).some(validatorKey =>
        runValidator(validatorKey, condition, valueToTest, allFields)
      );
    }

    default: {
      return Object.keys(validWhen).every(validatorKey =>
        runValidator(validatorKey, condition, valueToTest, allFields)
      );
    }
  }
};
