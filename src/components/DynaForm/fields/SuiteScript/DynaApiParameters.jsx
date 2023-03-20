import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Button, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ModalDialog from '../../../ModalDialog';
import DynaForm from '../..';
import DynaSubmit from '../../DynaSubmit';
import {
  convertToReactFormFields,
} from './util';
import FieldMessage from '../FieldMessage';
import FieldHelp from '../../FieldHelp';
import { selectors } from '../../../../reducers';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import { isMetaRequiredValuesMet } from '../../../../utils/assistant';
import actions from '../../../../actions';
import OutlinedButton from '../../../Buttons/OutlinedButton';
import IsLoggableContextProvider from '../../../IsLoggableContextProvider';

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
  dynaAssistantFormLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});
const ApiParametersModal = props => {
  const {
    apiMethodMetadata,
    onClose,
    id,
    onFieldChange,
    value,
  } = props;
  const fieldMeta = convertToReactFormFields({
    apiMethodMetadata,
    value,
  });

  function onSaveClick(formValues) {
    onFieldChange(id, formValues);
    onClose();
  }
  const formKey = useFormInitWithPermissions({
    fieldMeta,
  });

  return (
    <ModalDialog show onClose={onClose}>
      <span>API parameters</span>
      {/* lets not log these fields */}
      <IsLoggableContextProvider isLoggable={false}>
        <DynaForm formKey={formKey} />
      </IsLoggableContextProvider>
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
    </ModalDialog>
  );
};

export default function DynaApiParameters(props) {
  const classes = useStyles();
  const { value, disabled, isValid, formKey, onFieldChange, id, required, apiMethod, _connectionId, ssLinkedConnectionId } = props;
  const [showApiParametersModal, setShowApiParametersModal] = useState(false);
  const dispatch = useDispatch();
  const apiMethodMetadata = useSelector(state => {
    const connection = selectors.suiteScriptResource(state, {
      resourceType: 'connections',
      id: _connectionId,
      ssLinkedConnectionId,
    });

    return connection?.apiMethods?.find(m => m.id === apiMethod);
  }, shallowEqual);
  const isMetaValid = isMetaRequiredValuesMet(apiMethodMetadata, value);

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

  return (
    <>
      {showApiParametersModal && (
        <ApiParametersModal
          {...props}
          id={id}
          apiMethodMetadata={apiMethodMetadata}
          value={value}
          onFieldChange={onFieldChange}
          onClose={() => {
            setShowApiParametersModal(false);
          }}
        />
      )}
      <div className={classes.dynaAssSearchParamsWrapper}>
        <div className={classes.dynaAssistantFormLabelWrapper}>
          <FormLabel
            disabled={disabled}
            required={required}
            error={!isValid}
            className={classes.dynaAssistantFormLabel}>
            Define API parameters
          </FormLabel>
          <FieldHelp {...props} />
        </div>
        <OutlinedButton
          color="secondary"
          disabled={disabled}
          data-test={id}
          className={classes.dynaAssistantbtn}
          onClick={() => setShowApiParametersModal(true)}>
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
