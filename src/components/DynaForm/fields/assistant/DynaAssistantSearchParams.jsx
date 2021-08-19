import React, { useEffect, useState } from 'react';
import { FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isArray, isObject } from 'lodash';
import { useDispatch } from 'react-redux';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import {
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
  isMetaRequiredValuesMet,
} from '../../../../utils/assistant';
import FieldMessage from '../FieldMessage';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import FieldHelp from '../../FieldHelp';
import actions from '../../../../actions';
import { OutlinedButton, TextButton } from '../../../Buttons';

const useStyles = makeStyles({
  dynaAssSearchParamsWrapper: {
    width: '100%',
  },
  dynaAssistantbtn: {
    maxWidth: 100,
  },
  dynaAssistantFormLabel: {
    marginBottom: 6,
  },
  configureLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  searchParamForm: {
    overflow: 'visible !important',
    padding: '0px !important',
  },
  searchParamModalContent: {
    overflow: 'visible !important',
  },
});
const SearchParamsModal = props => {
  const {
    paramMeta,
    onClose,
    id,
    onFieldChange,
    value,
    flowId,
    resourceContext,
  } = props;
  const { fieldMap, layout, fieldDetailsMap } = convertToReactFormFields({
    paramMeta,
    value,
    flowId,
    resourceContext,
  });

  function onSaveClick(formValues) {
    const updatedValues = updateFormValues({
      formValues,
      fieldDetailsMap,
      paramLocation: paramMeta.paramLocation,
    });

    onFieldChange(id, updatedValues);
    onClose();
  }

  const validationHandler = field => {
    if (field?.id && fieldDetailsMap[field.id]) {
      if (field.value) {
        if (paramMeta.paramLocation === PARAMETER_LOCATION.BODY) {
          if (fieldDetailsMap[field.id].type === 'array') {
            if (!isArray(field.value)) {
              return 'Must be an array.';
            }
          } else if (fieldDetailsMap[field.id].type === 'json') {
            if (!isObject(field.value) || isArray(field.value)) {
              return 'Must be an object.';
            }
          }
        }
      }
    }
  };

  const formKey = useFormInitWithPermissions({
    fieldMeta: {
      fieldMap,
      layout,
    },
    validationHandler,
  });
  const classes = useStyles();

  return (
    <ModalDialog show onClose={onClose} className={classes.searchParamModalContent} minWidth="sm">
      <>
        <span>Search parameters</span>
      </>
      <div>
        <DynaForm
          formKey={formKey}
          className={classes.searchParamForm} />
      </div>
      <div>
        <DynaSubmit formKey={formKey} onClick={onSaveClick}>Save</DynaSubmit>
        <TextButton
          data-test="cancelSearchParams"
          onClick={onClose}>
          Cancel
        </TextButton>
      </div>

    </ModalDialog>
  );
};

export default function DynaAssistantSearchParams(props) {
  const classes = useStyles();
  let { label } = props;
  const { value, disabled, onFieldChange, id, paramMeta = {}, required, formKey, isValid} = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const dispatch = useDispatch();
  const isMetaValid = isMetaRequiredValuesMet(paramMeta, value);

  useEffect(() => {
    if (!required) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));

      return;
    }
    dispatch(actions.form.forceFieldState(formKey)(id, {isValid: isMetaValid}));
  }, [dispatch, formKey, id, isMetaValid, required]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  if (!label) {
    label =
      paramMeta.paramLocation === PARAMETER_LOCATION.BODY
        ? 'Configure body parameters'
        : 'Configure search parameters';
  }

  return (
    <>
      {showSearchParamsModal && (
        <SearchParamsModal
          {...props}
          id={id}
          paramMeta={paramMeta}
          value={value}
          onFieldChange={onFieldChange}
          onClose={() => {
            setShowSearchParamsModal(false);
          }}
        />
      )}
      <div className={classes.dynaAssSearchParamsWrapper}>
        <div className={classes.configureLabelWrapper}>
          <FormLabel
            disabled={disabled}
            required={required}
            error={!isValid}
            className={classes.dynaAssistantFormLabel}>
            {label}
          </FormLabel>
          {/* {Todo (shiva): we need helpText for the component} */}
          <FieldHelp {...props} helpText="Configure search parameters" />
        </div>
        <OutlinedButton
          color="secondary"
          disabled={disabled}
          data-test={id}
          className={classes.dynaAssistantbtn}
          onClick={() => setShowSearchParamsModal(true)}>
          Launch
        </OutlinedButton>
      </div>
      <FieldMessage
        isValid={isValid}
        description=""
        errorMessages="Please enter required parameters"
      />
    </>
  );
}
