import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  processFieldsUpdated,
  registerFieldWithCorrectValueUpdated,
  updateFieldValue,
  getNextStateFromFieldsUpdated,
} from '../../../../utils/form';
import { getFirstDefinedValue } from '../../../../utils/form/field';

const generateFieldKey = id => `${id}-${Date.now()}`;

export default function fields(state = {}, action) {
  const { type, formKey, fieldProps = {} } = action;
  const { value, id, skipFieldTouched, defaultValue } = fieldProps;

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
          fieldKey: generateFieldKey(id),
        };

        registerFieldWithCorrectValueUpdated(fieldsRef[id]);

        getNextStateFromFieldsUpdated(draft[formKey]);
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_CHANGE:
        if (!skipFieldTouched) {
          // updated field touched state
          fieldsRef[id].touched = true;
        }

        fieldsRef[id].fieldKey = generateFieldKey(id);
        // update the last modified field id in the form state
        draft[formKey].lastFieldUpdated = id;

        updateFieldValue(fieldsRef[id], value);
        getNextStateFromFieldsUpdated(draft[formKey]);

        if (onChange) {
          onChange(formValue, isValid);
        }

        break;

      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        fieldsRef[id].touched = true;
        fieldsRef[id].fieldKey = generateFieldKey(id);
        getNextStateFromFieldsUpdated(draft[formKey]);

        break;
      default:
    }
  });
}

export const fieldsState = (state, formIsDisabled, resetTouchedState = false) =>
  processFieldsUpdated(state, formIsDisabled, resetTouchedState);
