/* eslint-disable no-param-reassign */
// A field definition is valid if a field with the same id does not already exist in
// the supplied form state.
// We are assuming that typing takes care that all required attributes are present
export const fieldDefIsValid = (field, fields) =>
  !fields.some(currentField => currentField.id === field.id);

export const fieldDefIsValidUpdated = (field, fields) =>
  !fields || !fields[field.id];

export const getFirstDefinedValue = (...values) => {
  let valueToReturn;

  values.some(value => {
    if (typeof value !== 'undefined') {
      valueToReturn = value;

      return true;
    }

    return false;
  });

  return valueToReturn;
};

export const splitDelimitedValue = (value, valueDelimiter) => {
  if (valueDelimiter) {
    if (typeof value === 'string') {
      value = value.split(valueDelimiter);
    } else if (!Array.isArray(value)) {
      value = [];
    }
  }

  return value;
};

export const shouldOptionsBeRefreshed = ({ lastFieldUpdated, field }) => {
  const { refreshOptionsOnChangesTo } = field;

  if (lastFieldUpdated && refreshOptionsOnChangesTo) {
    return refreshOptionsOnChangesTo.indexOf(lastFieldUpdated) !== -1;
  }

  return false;
};
