import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {
  getNextStateFromFields,
  registerField,
  updateFieldValue,
} from '../../../../utils/form';
import { getFirstDefinedValue } from '../../../../utils/form/field';

const isValueBoolean = value => value && typeof value === 'boolean';

export default function fields(state = {}, action) {
  const { type, formKey, fieldProps = {} } = action;
  const {
    value,
    id,
    skipFieldTouched,
    defaultValue,
    visible,
    disable,
    required,
  } = fieldProps;

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

      case actionTypes.FORM.FIELD.FORCE_FIELD_STATE:
        break;
      case actionTypes.FORM.FIELD.ON_FIELD_BLUR:
        fieldsRef[id].touched = true;

        if (isValueBoolean(visible)) {
          fieldsRef[id].visible = visible;
        }

        if (isValueBoolean(required)) {
          fieldsRef[id].required = required;
        }

        if (isValueBoolean(disable)) {
          fieldsRef[id].disable = disable;
        }

        fieldsRef[id].touched = true;
        getNextStateFromFields(draft[formKey]);

        break;
      default:
    }
  });
}
