import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  updateFieldValue,
  updateFieldTouchedState,
  registerFieldWithCorrectValueUpdated,
  processFieldsUpdated,
} from '../../../../utils/form';

export default function fields(state = {}, action) {
  const { type, formKey, ...rest } = action;
  const { value, id, skipFieldTouched } = rest;

  return produce(state, draft => {
    if (!draft[formKey]) {
      console.warn('No form key present for Form');

      return;
    }

    let fieldsRef = draft[formKey].fields;

    if (!fieldsRef) fieldsRef = {};

    switch (type) {
      case actionTypes.FORM.FIELD.REGISTER:
        if (!fieldsRef[id]) fieldsRef[id] = {};
        else {
          // eslint-disable-next-line no-console
          console.warn('Field ID already in use', id);

          return;
        }

        fieldsRef[id] = {
          ...rest,
          touched: false,
        };
        registerFieldWithCorrectValueUpdated(fieldsRef[id]);
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_CHANGE:
        if (!skipFieldTouched) {
          updateFieldTouchedState(fieldsRef[id], true);
        }

        updateFieldValue(fieldsRef[id], value);
        break;

      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        updateFieldTouchedState(fieldsRef[id], true);

        break;
      default:
    }
  });
}

export const fieldsState = (state, formIsDisabled, resetTouchedState = false) =>
  processFieldsUpdated(state, formIsDisabled, resetTouchedState);
