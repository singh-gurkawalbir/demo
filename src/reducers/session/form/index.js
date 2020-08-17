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
import { isAnyFieldVisibleForMeta, isExpansionPanelRequired, isExpansionPanelErrored, isAnyFieldTouchedForMeta} from '../../../forms/utils';

function form(state = {}, action) {
  const { type, formKey, formSpecificProps = {} } = action;
  const {
    showValidationBeforeTouched,
    conditionalUpdate,
    disabled,
  } = formSpecificProps;
  const { fieldsMeta = {} } = formSpecificProps;

  // if default fields have changed then reset touched state
  return produce(state, draft => {
    switch (type) {
      case actionTypes.FORM.INIT:
        draft[formKey] = {
          ...formSpecificProps,
          showValidationBeforeTouched: !!showValidationBeforeTouched,
          conditionalUpdate: !!conditionalUpdate,
          formIsDisabled: !!disabled,
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

        if (showValidationBeforeTouched !== undefined) {
          draft[
            formKey
          ].showValidationBeforeTouched = showValidationBeforeTouched;
        }

        if (disabled !== undefined) draft[formKey].formIsDisabled = disabled;

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

// #region Selectors

export const selectors = {};

selectors.formState = (state, formKey) => {
  if (!state || !state[formKey]) return null;

  return state[formKey];
};

selectors.formParentContext = (state, formKey) => {
  const form = selectors.formState(state, formKey);

  if (!form) return null;

  return form.parentContext;
};

selectors.fieldState = (state, formKey, fieldId) => {
  const form = selectors.formState(state, formKey);

  if (!form) return null;

  return form.fields && form.fields[fieldId];
};

selectors.isActionButtonVisible = (state, formKey, fieldVisibleRules) => {
  const form = selectors.formState(state, formKey);

  if (!form) return false;

  return isVisible(fieldVisibleRules, form.fields);
};

selectors.isAnyFieldVisibleForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isAnyFieldVisibleForMeta(fieldMeta, fields);
};

selectors.isExpansionPanelRequiredForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isExpansionPanelRequired(fieldMeta, fields);
};

selectors.isExpansionPanelErroredForMetaForm = (
  state,
  formKey,
  fieldMeta
) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isExpansionPanelErrored(fieldMeta, fields || []);
};

selectors.isAnyFieldTouchedForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isAnyFieldTouchedForMeta(fieldMeta, fields || []);
};

// #endregion
