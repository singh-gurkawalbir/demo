/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import produce from 'immer';
import reduceReducers from 'reduce-reducers';
import { map, isEmpty, uniq, get, isEqualWith, isEqual } from 'lodash';
import actionTypes from '../../../actions/types';
import {
  getNextStateFromFields,
  registerFields,
  isVisible,
} from '../../../utils/form';
import fields from './fields';
import { isAnyFieldVisibleForMeta, isExpansionPanelRequired, isExpansionPanelErrored, isAnyFieldTouchedForMeta, getInvalidFields} from '../../../forms/formFactory/utils';
import trim from '../../../utils/trim';

function form(state = {}, action) {
  // we can have the same form key but different remount keys
  const { type, formKey, remountKey, formSpecificProps = {} } = action;
  const {
    showValidationBeforeTouched,
    conditionalUpdate,
    disabled,
  } = formSpecificProps;
  const { fieldMeta = {} } = formSpecificProps;

  // if default fields have changed then reset touched state
  return produce(state, draft => {
    switch (type) {
      case actionTypes.FORM.INIT:
        draft[formKey] = {
          ...formSpecificProps,
          remountKey,
          showValidationBeforeTouched: !!showValidationBeforeTouched,
          conditionalUpdate: !!conditionalUpdate,
          formIsDisabled: !!disabled,
          resetTouchedState: false,
        };
        draft[formKey].fields = registerFields(
          fieldMeta.fieldMap,
          draft[formKey].value
        );
        getNextStateFromFields(draft[formKey]);

        return;

      case actionTypes.FORM.UPDATE:
        if (!formKey) break;

        if (!draft[formKey]) {
          // eslint-disable-next-line no-console
          return console.warn('Form not intialized ', formKey);
        }

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

selectors.formValueTrimmed = (state, formKey) => {
  const formValue = selectors.formState(state, formKey)?.value;

  return trim(formValue);
};

selectors.formRemountKey = (state, formKey) => state?.[formKey]?.remountKey;
selectors.formParentContext = (state, formKey) => {
  const form = selectors.formState(state, formKey);

  if (!form) return null;

  return form.parentContext;
};

selectors.fieldState = (state, formKey, fieldId) => {
  const form = selectors.formState(state, formKey);

  if (!form?.fields?.[fieldId]) return null;

  return form.fields[fieldId];
};

// TODO: we can delete this code
selectors.isActionButtonVisible = (state, formKey, fieldVisibleRules) => {
  const form = selectors.formState(state, formKey);

  if (!form) return false;

  return isVisible(fieldVisibleRules, form.fields);
};

selectors.isAnyFieldVisibleForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isAnyFieldVisibleForMeta(fieldMeta, fields || []);
};

selectors.isExpansionPanelRequiredForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isExpansionPanelRequired(fieldMeta, fields || []);
};

selectors.isExpansionPanelErroredForMetaForm = (
  state,
  formKey,
  fieldMeta,
  shouldShowPurelyInvalid
) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isExpansionPanelErrored(fieldMeta, fields || [], shouldShowPurelyInvalid);
};
selectors.isFormPurelyInvalid = (state, formKey) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return getInvalidFields(fields || [], true).length !== 0;
};

selectors.isAnyFieldTouchedForMetaForm = (state, formKey, fieldMeta) => {
  const { fields } = selectors.formState(state, formKey) || {};

  return isAnyFieldTouchedForMeta(fieldMeta, fields || []);
};

const calculateAllFieldsValue = (form, key) => Object.values(form.fields).reduce((acc, field) => {
  const {name} = field;
  const val = field[key];

  if (val === undefined || val === null) acc[name] = '';
  else { acc[name] = val; }

  return acc;
}, {});

selectors.isFormDirty = (state, formKey) => {
  const form = selectors.formState(state, formKey);

  if (!form) {
    return false;
  }

  const defaultValueState = calculateAllFieldsValue(form, 'defaultValue');
  const value = calculateAllFieldsValue(form, 'value');

  return !isEqual(value, defaultValueState);
};

selectors.isActionButtonVisibleFromMeta = (state, formKey, actionButtonFieldId) => {
  const form = selectors.formState(state, formKey);

  if (!form) return false;
  const actionButtonMeta = form.fieldMeta.actions?.find?.(({id}) => id === actionButtonFieldId) || {};

  if (!actionButtonMeta) { return true; }

  return isVisible(actionButtonMeta, form.fields);
};
// #endregion
