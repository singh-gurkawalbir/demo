
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ModalDialog from '../../../../../../components/ModalDialog';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../../../components/Buttons';
import ActionGroup from '../../../../../../components/ActionGroup';
import { MFA_RESET_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../../utils/constants';

const useStyles = makeStyles({
  container: {
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
});

const changeEmailFieldMeta = {
  fieldMap: {
    password: {
      id: 'password',
      name: 'password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
      isLoggable: false,
    },
  },
};

export default function ResetAuthorizationModal({ onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const success = useSelector(state => selectors.asyncTaskStatus(state, MFA_RESET_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
  const failed = useSelector(state => selectors.asyncTaskStatus(state, MFA_RESET_ASYNC_KEY) === FORM_SAVE_STATUS.FAILED);

  const [isLoading, setIsLoading] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const handleEmailChangeClick = useCallback(
    formVal => {
      setIsLoading(true);
      dispatch(actions.mfa.resetMFA({ password: formVal.password }));
    },
    [dispatch, setIsLoading]
  );

  useEffect(() => {
    if (failed || success) {
      setIsLoading(false);
    }
  },
  [failed, success]);
  useEffect(() => {
    if (success) {
      onClose();
    }
  }, [success, enqueueSnackbar, onClose]);
  const formKey = useFormInitWithPermissions({
    fieldMeta: changeEmailFieldMeta,
  });

  return (
    <ModalDialog show onClose={onClose}>
      Re-authenticate your account
      <>
        Enter your account password to confirm if you want to reset MFA. Learn more.
        <div className={classes.container}>
          <DynaForm formKey={formKey} />
        </div>
      </>
      <ActionGroup>
        <DynaSubmit
          formKey={formKey}
          data-test="changeEmail"
          id="changeEmail"
          disabled={isLoading}
          onClick={handleEmailChangeClick}>
          Reset MFA
        </DynaSubmit>
        <TextButton
          data-test="cancelOperandSettings"
          onClick={onClose} >
          Cancel
        </TextButton>
      </ActionGroup>
    </ModalDialog>
  );
}
