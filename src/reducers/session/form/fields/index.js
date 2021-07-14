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
        // If field state isnt present just return
        if (!fieldsRef[id]) {
          // eslint-disable-next-line no-console
          return console.warn('Field ID not there', id);
        }
        if (!skipFieldTouched) {
          // updated field touched state
          fieldsRef[id].touched = true;
        }

        // update the last modified field id in the form state
        draft[formKey].lastFieldUpdated = id;

        updateFieldValue(fieldsRef[id], value, skipFieldTouched);

        getNextStateFromFields(draft[formKey]);

        if (onChange) {
          onChange(formValue, isValid);
        }

        break;

      case actionTypes.FORM.FIELD.FORCE_STATE:
        if (!fieldsRef[id]) {
          // eslint-disable-next-line no-console
          return console.warn('Field ID not there', id);
        }
        Object.keys(fieldStateProps)
          .filter(key => isBoolean(fieldStateProps[key]))
          .forEach(key => {
            // set values are defined and a boolean

            fieldsRef[id][key] = fieldStateProps[key];

            if (key === 'isValid' && typeof fieldStateProps[key] === 'boolean') {
              if (fieldStateProps[key]) {
                delete fieldsRef[id].forcedErrorMessages;
              } else {
                fieldsRef[id].forcedErrorMessages = errorMessages;
              }
              fieldsRef[id].forcedIsValid = fieldStateProps[key];
            }

            if (!fieldsRef[id].forceComputation) { fieldsRef[id].forceComputation = []; }
            if (!fieldsRef[id].forceComputation.includes(key)) {
              fieldsRef[id].forceComputation.push(key);
            }
          });

        // This is necessary to update other non forcestate computation..the only issue there could be the way
        // optionshandler could modify the forceState properties..but this was still a concern when subsequent actions
        // causes a generateNextState

        getNextStateFromFields(draft[formKey]);
        break;

      case actionTypes.FORM.FIELD.CLEAR_FORCE_STATE:
        if (!fieldsRef[id]) {
          // eslint-disable-next-line no-console
          return console.warn('Field ID not there', id);
        }
        delete fieldsRef[id].forceComputation;
        delete fieldsRef[id].forcedErrorMessages;
        delete fieldsRef[id].forcedIsValid;

        getNextStateFromFields(draft[formKey]);

        break;
      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        if (!fieldsRef[id]) {
          // eslint-disable-next-line no-console
          return console.warn('Field ID not there', id);
        }

        fieldsRef[id].touched = true;
        getNextStateFromFields(draft[formKey]);

        break;
      default:
    }
  });
}
