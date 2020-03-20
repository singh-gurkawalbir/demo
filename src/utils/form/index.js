/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import set from 'lodash/set';
import {
  fieldDefIsValid,
  getFirstDefinedValue,
  mapFieldsById,
  splitDelimitedValue,
  shouldOptionsBeRefreshed,
} from './field';
import { validateAllFields } from './validation';

// Because this function can be passed with the state of a component form
// it is not mutating the supplied fields array but returning a new instance
// each time, this is less efficient (when passing entire fieldDef arrays to the
// form) but safer when children of forms are registering themselves
export const registerField = (field, fields) => {
  if (fieldDefIsValid(field, fields)) {
    return fields.concat(field);
  }

  return fields.slice();
};

export const registerFieldWithCorrectValueUpdated = (field, formValue) => {
  const { defaultValue, name, value, valueDelimiter } = field;
  const initialValue = getFirstDefinedValue(
    formValue[name],
    value,
    defaultValue
  );

  field.value = splitDelimitedValue(initialValue, valueDelimiter);
};

export const registerFields = (fieldsToValidate, formValue) => {
  const fields = [];

  fieldsToValidate.forEach(field => {
    if (fieldDefIsValid(field, fields)) {
      const { defaultValue, name, value, valueDelimiter } = field;
      const initialValue = getFirstDefinedValue(
        formValue[name],
        value,
        defaultValue
      );
      const fieldToRegister = {
        ...field,
        value: splitDelimitedValue(initialValue, valueDelimiter),
      };

      fields.push(fieldToRegister);
    }
  });

  return fields;
};

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

export const valuesMatch = (a, b) => {
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

export const evaluateAnyAndAllRules = ({
  anyRules,
  allRules,
  fieldsById,
  defaultResult,
}) => {
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

  return defaultResult;
};

export const isVisible = (field, fieldsById) => {
  const { visible, visibleWhen = [], visibleWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: visibleWhen,
    allRules: visibleWhenAll,
    fieldsById,
    defaultResult: visible !== false,
  });
};

export const isDisabled = (field, fieldsById) => {
  const { defaultDisabled, disabledWhen = [], disabledWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: disabledWhen,
    allRules: disabledWhenAll,
    fieldsById,
    defaultResult: !!defaultDisabled,
  });
};

export const isRequired = (field, fieldsById) => {
  const { required, requiredWhen = [], requiredWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: requiredWhen,
    allRules: requiredWhenAll,
    fieldsById,
    defaultResult: !!required,
  });
};

export const processFields = (
  fields,
  formIsDisabled,
  resetTouchedState = false
) => {
  const fieldsById = mapFieldsById(fields);
  const updatedFields = fields.map(field => {
    const { defaultValue, value, touched = false } = field;
    const processedValue = typeof value !== 'undefined' ? value : defaultValue;

    return {
      ...field,
      touched: getTouchedStateForField(touched, resetTouchedState),
      value: processedValue,
      visible: isVisible(field, fieldsById),
      required: isRequired(field, fieldsById),
      disabled: formIsDisabled || isDisabled(field, fieldsById),
    };
  });

  return updatedFields;
};

const fieldsByIdToFields = fieldsById => Object.values(fieldsById);

export const processFieldsUpdated = (
  fieldsById,
  formIsDisabled,
  resetTouchedState = false
) => {
  const updatedFields = fieldsByIdToFields(fieldsById).map(field => {
    const { defaultValue, value, touched = false } = field;
    const processedValue = typeof value !== 'undefined' ? value : defaultValue;

    return {
      ...field,
      touched: getTouchedStateForField(touched, resetTouchedState),
      value: processedValue,
      visible: isVisible(field, fieldsById),
      required: isRequired(field, fieldsById),
      disabled: formIsDisabled || isDisabled(field, fieldsById),
    };
  });

  return updatedFields;
};

export const processOptions = ({
  fields,
  lastFieldUpdated,
  optionsHandler,
  parentContext,
}) =>
  fields.map(field => {
    const { id, options } = field;

    if (!options || shouldOptionsBeRefreshed({ lastFieldUpdated, field })) {
      const handlerOptions = optionsHandler(id, fields, parentContext);

      if (handlerOptions instanceof Promise) {
        field.options = [];
        field.pendingOptions = handlerOptions;
      } else if (handlerOptions) {
        field.options = handlerOptions;
        field.pendingOptions = undefined;
      }
    }

    return field;
  });

// NOTE: Just used for test purposes...
// TODO: Move to test file...
export const createField = field => {
  const {
    id = '',
    name = '',
    type = '',
    placeholder = '',
    value = undefined,
    visible = true,
    required = false,
    disabled = false,
    visibleWhen = [],
    visibleWhenAll = [],
    requiredWhen = [],
    requiredWhenAll = [],
    disabledWhen = [],
    disabledWhenAll = [],
    validWhen = {},
    isValid = true,
    errorMessages = '',
    touched = false,
  } = field;

  return {
    id,
    name,
    type,
    placeholder,
    value,
    visible,
    required,
    disabled,
    visibleWhen,
    visibleWhenAll,
    requiredWhen,
    requiredWhenAll,
    disabledWhen,
    disabledWhenAll,
    isValid,
    validWhen,
    errorMessages,
    touched,
  };
};

export const updateFieldTouchedState = (field, touched) => {
  field.touched = touched;

  return field;
};

export const updateFieldValue = (field, value) => {
  const updateValue = typeof value !== 'undefined' && value;

  if (field.omitWhenHidden && !field.visible) {
    console.log('Not updating field value for', field);
  } else {
    field.value = updateValue;
  }

  return field;
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
    } else if (useChangesAsValues) {
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

export const getNextStateFromFields = ({
  fields,
  lastFieldUpdated,
  showValidationBeforeTouched,
  formIsDisabled,
  resetTouchedState,
  optionsHandler,
  validationHandler,
  parentContext,
}) => {
  fields = processFields(fields, !!formIsDisabled, resetTouchedState);

  if (optionsHandler) {
    fields = processOptions({
      fields,
      lastFieldUpdated,
      optionsHandler,
      parentContext,
    });
  }

  fields = validateAllFields({
    fields,
    showValidationBeforeTouched,
    validationHandler,
    parentContext,
  });

  const value = calculateFormValue(fields);
  const isValid = fields.every(field => field.isValid);
  const isDiscretelyInvalid = fields.some(field => field.isDiscretelyInvalid);
  const nextState = {
    fields,
    value,
    isValid: isValid && !isDiscretelyInvalid,
  };

  return nextState;
};

export const getNextStateFromFieldsUpdated = ({
  fields,
  lastFieldUpdated,
  showValidationBeforeTouched,
  formIsDisabled,
  resetTouchedState,
  optionsHandler,
  validationHandler,
  parentContext,
}) => {
  fields = processFieldsUpdated(fields, !!formIsDisabled, resetTouchedState);

  if (optionsHandler) {
    fields = processOptions({
      fields,
      lastFieldUpdated,
      optionsHandler,
      parentContext,
    });
  }

  fields = validateAllFields({
    fields,
    showValidationBeforeTouched,
    validationHandler,
    parentContext,
  });

  const value = calculateFormValue(fields);
  const isValid = fields.every(field => field.isValid);
  const isDiscretelyInvalid = fields.some(field => field.isDiscretelyInvalid);
  const nextState = {
    fields,
    value,
    isValid: isValid && !isDiscretelyInvalid,
  };

  return nextState;
};
