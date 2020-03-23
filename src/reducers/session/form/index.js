/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import reduceReducers from 'reduce-reducers';
import actionTypes from '../../../actions/types';
import {
  getNextStateFromFieldsUpdated,
  processFieldsUpdated,
} from '../../../utils/form';
import fields, { fieldsState } from './fields';

function form(state = {}, action) {
  const { type, formKey, ...rest } = action;
  const {
    showValidationBeforeTouched = false,
    conditionalUpdate = false,
    disabled = false,
  } = rest;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FORM.INIT:
        draft[formKey] = {
          ...rest,
          showValidationBeforeTouched,
          conditionalUpdate,
          disabled,
        };

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

export const getFormState = (state, formKey) => ({
  ...state,
  ...getNextStateFromFieldsUpdated(state && state[formKey]),
});
