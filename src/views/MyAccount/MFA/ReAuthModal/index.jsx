
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import ModalDialog from '../../../../components/ModalDialog';
import NotificationToaster from '../../../../components/NotificationToaster';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../components/Buttons';
import ActionGroup from '../../../../components/ActionGroup';

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

export default function ReAuthModal({ title, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.changeEmailFailure(state));
  const success = useSelector(state => selectors.changeEmailSuccess(state));
  const message = useSelector(state => selectors.changeEmailMsg(state));
  const [isLoading, setIsLoading] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleEmailChangeClick = useCallback(
    formVal => {
      const payload = {
        newEmail: formVal.newEmail,
        password: formVal.password,
      };

      setIsLoading(true);
      dispatch(actions.auth.changeEmail(payload));
    },
    [dispatch, setIsLoading]
  );

  useEffect(() => {
    if (error || success) {
      setIsLoading(false);
    }
  },
  [error, success]);
  useEffect(() => {
    // Incase email change is successful, we should close Change Email form
    // and Show notification on top with success message
    if (success && message) {
      onClose();
      enqueueSnackbar({
        message,
        variant: 'success',
        persist: true,
      });
    }
  }, [success, message, enqueueSnackbar]);
  const formKey = useFormInitWithPermissions({
    fieldMeta: changeEmailFieldMeta,
  });

  return (
    <ModalDialog show onClose={onClose}>
      {title}
      <>
        {error && (
        <NotificationToaster variant="error" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
        )}
        Enter your account password to view your QR code. Learn more.
        {!success && (
        <div className={classes.container}>
          <DynaForm
            formKey={formKey} />
        </div>
        )}
      </>
      <ActionGroup>
        <DynaSubmit
          formKey={formKey}
          data-test="changeEmail"
          id="changeEmail"
          disabled={isLoading}
          onClick={handleEmailChangeClick}>
          {isLoading ? 'Changing email...' : 'Re-authenticate'}
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
