/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import reduceReducers from 'reduce-reducers';
import actionTypes from '../../../actions/types';
import {
  getNextStateFromFields,
  registerFields,
  isVisible,
} from '../../../utils/form';
import fields from './fields';

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

      case actionTypes.FORM.UPDATE:
        if (!formKey) break;
        draft[
          formKey
        ].showValidationBeforeTouched = !!showValidationBeforeTouched;
        draft[formKey].disabled = !!disabled;

        getNextStateFromFields(draft[formKey]);

        break;
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

export const getFormParentContext = (state, formKey) => {
  const formState = getFormState(state, formKey);

  if (!formState) return null;

  return formState.parentContext;
};

export const getFieldState = (state, formKey, fieldId) => {
  const formState = getFormState(state, formKey);

  if (!formState) return null;

  return formState.fields && formState.fields[fieldId];
};

export const isActionButtonVisible = (state, formKey, fieldVisibleRules) => {
  const formState = getFormState(state, formKey);

  if (!formState) return false;

  return isVisible(fieldVisibleRules, formState.fields);
};
