import React, { useState } from 'react';
import { Button, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import {
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
} from '../../../../utils/assistant';
import ErroredMessageComponent from '../ErroredMessageComponent';
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
    alignItems: 'flex-start'
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

  return (
    <ModalDialog show onClose={onClose}>
      <>
        <span>Search parameters</span>
      </>
      <>
        <DynaForm
          fieldMeta={{
            fieldMap,
            layout,
          }}>
          <div>
            <DynaSubmit onClick={onSaveClick}>Save</DynaSubmit>
            <Button
              data-test="cancelSearchParams"
              onClick={onClose}
              variant="text"
              color="primary">
              Cancel
            </Button>
          </div>
        </DynaForm>
      </>
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
            Configure search parameters
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
      <ErroredMessageComponent
        isValid={isValid}
        description=""
        errorMessages="Please enter required parameters"
      />
    </>
  );
}
