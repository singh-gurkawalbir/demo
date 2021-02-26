import React, { useState } from 'react';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty, isArray, isObject } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import {
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
} from '../../../../utils/assistant';
import FieldMessage from '../FieldMessage';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import FieldHelp from '../../FieldHelp';

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
    <ModalDialog show onClose={onClose} className={classes.searchParamModalContent}>
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
        <Button
          data-test="cancelSearchParams"
          onClick={onClose}
          variant="text"
          color="primary">
          Cancel
        </Button>
      </div>

    </ModalDialog>
  );
};

export default function DynaAssistantSearchParams(props) {
  const classes = useStyles();
  let { label } = props;
  const { value, onFieldChange, id, paramMeta = {}, required } = props;
  const [showSearchParamsModal, setShowSearchParamsModal] = useState(false);
  const isValid = !required ? true : !isEmpty(value);

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
          <FormLabel className={classes.dynaAssistantFormLabel}>
            {label}
          </FormLabel>
          {/* {Todo (shiva): we need helpText for the component} */}
          <FieldHelp {...props} helpText="Configure search parameters" />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.dynaAssistantbtn}
          onClick={() => setShowSearchParamsModal(true)}>
          {'Launch'} {required && !isValid ? '*' : ''}
        </Button>
      </div>
      <FieldMessage
        isValid={isValid}
        description=""
        errorMessages="Please enter required parameters"
      />
    </>
  );
}
