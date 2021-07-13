/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
import set from 'lodash/set';
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

      // eslint-disable-next-line no-console
      console.error(`invalid rule properties ${rule} passed returning default result`);

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
      // eslint-disable-next-line no-console
      console.error(`invalid rule properties ${rule} passed returning default result`);

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

export const isVisible = (field, fieldsById) => {
  const { defaultVisible, visibleWhen = [], visibleWhenAll = [] } = field;

  return evaluateAnyAndAllRules({
    anyRules: visibleWhen,
    allRules: visibleWhenAll,
    fieldsById,
    defaultState: defaultVisible,
    defaultResult: true,
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
    const { touched = false, forceComputation } = field;

    field.touched = getTouchedStateForField(touched, resetTouchedState);

    if (!isValueForceComputed(forceComputation, 'visible')) { field.visible = isVisible(field, fieldsById); }

    if (!isValueForceComputed(forceComputation, 'required')) { field.required = isRequired(field, fieldsById); }

    if (!isValueForceComputed(forceComputation, 'disabled')) { field.disabled = formIsDisabled || isDisabled(field, fieldsById); }
  });
};

export const processOptions = ({
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

function getFieldIdsInOrder(layout, fields = []) {
  if (!layout) return fields;
  if (layout.fields?.length) {
    // add the fields in this layout to the list
    fields.push(...layout.fields);
  }
  if (layout.containers?.length) {
    // traverse through each container and fetch the fields
    layout.containers.forEach(container => {
      fields.push(...getFieldIdsInOrder(container));
    });
  }

  return fields;
}

export function getFirstInvalidFieldId(formState) {
  const { fields, fieldMeta } = formState || {};

  const orderedFieldIds = getFieldIdsInOrder(fieldMeta?.layout);

  return orderedFieldIds.find(fieldId => !fields[fieldId]?.isValid);
}
