
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import ModalDialog from '../../../../../components/ModalDialog';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../../components/Buttons';
import ActionGroup from '../../../../../components/ActionGroup';

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

export default function ReAuthModal({ title, onClose, isQRCode }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.secretCodeError(state));
  const success = useSelector(isQRCode ? selectors.showQrCode : selectors.showSecretCode);

  const [isLoading, setIsLoading] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const handleEmailChangeClick = useCallback(
    formVal => {
      setIsLoading(true);
      dispatch(actions.mfa.requestSecretCode({ password: formVal.password, isQRCode }));
    },
    [dispatch, setIsLoading, isQRCode]
  );

  useEffect(() => {
    if (error || success) {
      setIsLoading(false);
    }
  },
  [error, success]);
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
      {title}
      <>
        Enter your account password to view your QR code. Learn more.
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
          Re-authenticate
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
