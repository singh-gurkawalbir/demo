import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import ModalDialog from '../../components/ModalDialog';
import NotificationToaster from '../../components/NotificationToaster';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 10,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
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
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleChangePasswordClick = useCallback(
    formVal => {
      const { currentPassword, newPassword } = formVal;
      const payload = {
        currentPassword,
        newPassword,
      };

      dispatch(actions.auth.changePassword(payload));
    },
    [dispatch]
  );

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

  return (
    <ModalDialog show={show} onClose={onClose}>
      <span>Change Password</span>
      {error && (
        <NotificationToaster variant="error" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
      )}

      {!success && (
        <div className={classes.container}>
          <Typography variant="body2">
            {`Please note that clicking 'Change Password' will sign you out of the
          application, and you will need to sign back in with your new password.`}
          </Typography>

          <DynaForm fieldMeta={changePasswordFieldMeta}>
            <DynaSubmit
              data-test="changePassword"
              id="changePassword"
              onClick={handleChangePasswordClick}>
              Change password
            </DynaSubmit>
          </DynaForm>
        </div>
      )}
    </ModalDialog>
  );
}
