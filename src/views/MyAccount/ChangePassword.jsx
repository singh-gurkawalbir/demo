import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ModalDialog from '../../components/ModalDialog';
import NotificationToaster from '../../components/NotificationToaster';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import {message as messageStoreMessage} from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  changePasswordInfo: {
    marginBottom: theme.spacing(2),
  },
}));
const changePasswordFieldMeta = {
  fieldMap: {
    currentPassword: {
      id: 'currentPassword',
      name: 'currentPassword',
      type: 'text',
      inputType: 'password',
      label: 'Current password',
      required: true,
    },
    newPassword: {
      id: 'newPassword',
      name: 'newPassword',
      type: 'text',
      inputType: 'password',
      label: 'New password',
      required: true,
    },
  },
  layout: {
    fields: ['currentPassword', 'newPassword'],
  },

};

export default function ChangePassword({ show, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.changePasswordFailure(state));
  const success = useSelector(state => selectors.changePasswordSuccess(state));
  const message = useSelector(state => selectors.changePasswordMsg(state));
  const [isLoading, setIsLoading] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleChangePasswordClick = useCallback(
    formVal => {
      const { currentPassword, newPassword } = formVal;
      const payload = {
        currentPassword,
        newPassword,
      };

      setIsLoading(true);

      dispatch(actions.auth.changePassword(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    if (error || success) {
      setIsLoading(false);
    }
  },
  [error, success]);

  useEffect(() => {
    // Incase password change is successful, we should close changePassword form
    // Show notification on top with success message
    if (success && message) {
      onClose();
      enqueueSnackbar({
        message,
        variant: 'success',
        persist: true,
      });
    }
  }, [success, message, enqueueSnackbar, onClose]);

  const formKey = useFormInitWithPermissions({
    fieldMeta: changePasswordFieldMeta,
    // reset the form everytime we open this modal
    remount: show,
  });

  return (
    <ModalDialog show={show} onClose={onClose}>
      <span>Change password</span>
      <>
        {error && (
        <NotificationToaster variant="error" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
        )}

        {!success && (
        <div className={classes.container}>
          <Typography variant="body2" className={classes.changePasswordInfo}>
            {messageStoreMessage.USER_SIGN_IN.CHANGE_PASSWORD_INFO}
          </Typography>

          <DynaForm formKey={formKey} />
        </div>
        )}
      </>
      {!success && (
      <DynaSubmit
        disabled={isLoading}
        formKey={formKey}
        data-test="changePassword"
        id="changePassword"
        onClick={handleChangePasswordClick}>
        {isLoading ? 'Changing Password...' : 'Change password'}
      </DynaSubmit>
      )}
    </ModalDialog>
  );
}
