import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  getNextStateFromFields,
  registerField,
  updateFieldValue,
} from '../../../../utils/form';
import { getFirstDefinedValue } from '../../../../utils/form/field';

const isBoolean = value => typeof value === 'boolean';

export default function fields(state = {}, action) {
  const { type, formKey, fieldProps = {} } = action;
  const {
    value,
    id,
    skipFieldTouched,
    defaultValue,
    visible,
    disabled,
    required,
    isValid,
    errorMessages,
  } = fieldProps;
  const fieldStateProps = { visible, required, disabled, isValid };

  return produce(state, draft => {
    if (!draft[formKey]) {
      //   'No form key present for Form'

      return;
    }

    const { value: formValue, isValid, onChange } = draft[formKey];

    if (!draft[formKey].fields) draft[formKey].fields = {};
    const fieldsRef = draft[formKey].fields;

    switch (type) {
      case actionTypes.FORM.FIELD.REGISTER:
        if (!fieldsRef[id]) fieldsRef[id] = {};
        else {
          // eslint-disable-next-line no-console
          console.warn('Field ID already in use', id);

          return;
        }

        fieldsRef[id] = {
          ...fieldProps,
          value: getFirstDefinedValue(value, defaultValue),
          touched: false,
        };

        registerField(fieldsRef[id]);

        getNextStateFromFields(draft[formKey]);
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_CHANGE:
        if (!skipFieldTouched) {
          // updated field touched state
          fieldsRef[id].touched = true;
        }

        // update the last modified field id in the form state
        draft[formKey].lastFieldUpdated = id;

        updateFieldValue(fieldsRef[id], value);

        getNextStateFromFields(draft[formKey]);

        if (onChange) {
          onChange(formValue, isValid);
        }

        break;

      case actionTypes.FORM.FIELD.FORCE_STATE:
        Object.keys(fieldStateProps)
          .filter(key => isBoolean(fieldStateProps[key]))
          .forEach(key => {
            // set values are defined and a boolean

            fieldsRef[id][key] = fieldStateProps[key];

            if (key === 'isValid' && fieldStateProps[key] === false) {
              fieldsRef[id].errorMessages = errorMessages;
            }

            if (!fieldsRef[id].forceComputation)
              fieldsRef[id].forceComputation = [];
            fieldsRef[id].forceComputation.push(key);
          });

        // no need to generate next state...
        break;

      case actionTypes.FORM.FIELD.CLEAR_FORCE_STATE:
        delete fieldsRef[id].forceComputation;
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        fieldsRef[id].touched = true;

        fieldsRef[id].touched = true;
        getNextStateFromFields(draft[formKey]);

        break;
      default:
    }
  });
}
