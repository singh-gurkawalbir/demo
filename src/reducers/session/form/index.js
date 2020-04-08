/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import reduceReducers from 'reduce-reducers';
import actionTypes from '../../../actions/types';
import { getNextStateFromFields, registerFields } from '../../../utils/form';
import fields, { fieldsState } from './fields';

function form(state = {}, action) {
  const { type, formKey, formSpecificProps = {} } = action;
  const {
    showValidationBeforeTouched = false,
    conditionalUpdate = false,
    disabled = false,
  } = formSpecificProps;
  const { fieldsMeta = {} } = formSpecificProps;

  // if default fields have changed then reset touched state
  return produce(state, draft => {
    switch (type) {
      case actionTypes.FORM.INIT:
        draft[formKey] = {
          ...formSpecificProps,
          showValidationBeforeTouched,
          conditionalUpdate,
          disabled,
          resetTouchedState: false,
        };
        draft[formKey].fields = registerFields(
          fieldsMeta.fieldMap,
          draft[formKey].value
        );
        getNextStateFromFields(draft[formKey]);

        return;
      case actionTypes.FORM.CLEAR:
        delete draft[formKey];
        break;

      default:
        break;
    }
  });
}

export default reduceReducers(form, fields);

export const getFormState = (state, formKey) => {
  if (!state || !state[formKey]) return null;

  return state[formKey];
};
