import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';
import { selectors } from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../../components/ModalDialog';
import NotificationToaster from '../../components/NotificationToaster';
import DynaForm from '../../components/DynaForm';
import DynaSubmit from '../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';

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
    newEmail: {
      id: 'newEmail',
      name: 'newEmail',
      type: 'text',
      label: 'New email',
      required: true,
    },
    password: {
      id: 'password',
      name: 'password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      required: true,
    },
    label: {
      id: 'label',
      name: 'label',
      type: 'labeltitle',
      label:
        'Note: we require your current password again to help safeguard your integrator.io account.',
    },
  },
  layout: {
    fields: ['newEmail', 'password', 'label'],
  },
};

export default function ChangeEmail({ show, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.changeEmailFailure(state));
  const success = useSelector(state => selectors.changeEmailSuccess(state));
  const message = useSelector(state => selectors.changeEmailMsg(state));
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleEmailChangeClick = useCallback(
    formVal => {
      const payload = {
        newEmail: formVal.newEmail,
        password: formVal.password,
      };

      dispatch(actions.auth.changeEmail(payload));
    },
    [dispatch]
  );

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
  }, [success, message, enqueueSnackbar, onClose]);
  const formKey = useFormInitWithPermissions({
    fieldMeta: changeEmailFieldMeta,
  });

  return (
    <ModalDialog show={show} onClose={onClose}>
      Change email
      {error && (
        <NotificationToaster variant="error" size="large">
          <Typography variant="h6">{message}</Typography>
        </NotificationToaster>
      )}
      {!success && (
        <div className={classes.container}>
          <DynaForm
            formKey={formKey} />
          <DynaSubmit
            formKey={formKey}
            data-test="changeEmail"
            id="changeEmail"
            onClick={handleEmailChangeClick}>
            Change email
          </DynaSubmit>
        </div>
      )}
    </ModalDialog>
  );
}
