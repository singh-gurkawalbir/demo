import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import ModalDialog from '../../../../../components/ModalDialog';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import useForm from '../../../../../components/Form';
import ActionGroup from '../../../../../components/ActionGroup';

const useStyles = makeStyles({
  container: {
    height: '100%',
    width: '100%',
    '& > div:first-child': {
      flexDirection: 'column',
    },
  },
  authModalContainer: {
    overflowY: 'visible',
  },
});

const metadata = {
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

export default function ReAuthModal({ onClose, isQRCode }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector(state => selectors.secretCodeError(state));
  const success = useSelector(isQRCode ? selectors.showQrCode : selectors.showSecretCode);

  const [isLoading, setIsLoading] = useState(false);

  const handleReAuthentication = useCallback(
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
  }, [success, onClose]);

  const formKey = useForm({ fieldMeta: metadata });

  const title = isQRCode ? 'View QR code' : 'View secret key';
  const description = isQRCode
    ? 'Enter your account password to view your QR code.'
    : 'Enter your account password to view your secret key.';

  return (
    <ModalDialog show onClose={onClose} className={classes.authModalContainer}>
      {title}
      <>
        {description}
        <div className={classes.container}>
          <DynaForm formKey={formKey} />
        </div>
      </>
      <ActionGroup>
        <DynaSubmit
          formKey={formKey}
          data-test="reAuth"
          id="reAuth"
          disabled={isLoading}
          onClick={handleReAuthentication}>
          {isQRCode ? 'View code' : 'View key'}
        </DynaSubmit>
        <TextButton
          data-test="cancelReAuth"
          onClick={onClose} >
          Cancel
        </TextButton>
      </ActionGroup>
    </ModalDialog>
  );
}
