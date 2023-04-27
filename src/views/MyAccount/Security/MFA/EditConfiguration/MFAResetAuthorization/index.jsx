import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ModalDialog from '../../../../../../components/ModalDialog';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import useForm from '../../../../../../components/Form';
import { TextButton } from '../../../../../../components/Buttons';
import ActionGroup from '../../../../../../components/ActionGroup';
import { MFA_RESET_ASYNC_KEY, FORM_SAVE_STATUS } from '../../../../../../constants';
import { message } from '../../../../../../utils/messageStore';
import RawHtml from '../../../../../../components/RawHtml';

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

export default function ResetAuthorizationModal({ onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const success = useSelector(state => selectors.asyncTaskStatus(state, MFA_RESET_ASYNC_KEY) === FORM_SAVE_STATUS.COMPLETE);
  const failed = useSelector(state => selectors.asyncTaskStatus(state, MFA_RESET_ASYNC_KEY) === FORM_SAVE_STATUS.FAILED);

  const [isLoading, setIsLoading] = useState(false);
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const handleReAuthorization = useCallback(
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
      enqueueSnackbar({
        message: <RawHtml html={message.MFA.RESET_SUCCESS} />,
        variant: 'success',
      });
      onClose();
    }
  }, [success, enqueueSnackbar, onClose]);

  useEffect(() => () => dispatch(actions.asyncTask.clear(MFA_RESET_ASYNC_KEY)), [dispatch]);

  const formKey = useForm({ fieldMeta: metadata });

  return (
    <ModalDialog show onClose={onClose} className={classes.authModalContainer}>
      <>
        {message.MFA.REAUTHENTICATE_ACCOUNT}
        <div className={classes.container}>
          <DynaForm formKey={formKey} />
        </div>
      </>
      <ActionGroup>
        <DynaSubmit
          formKey={formKey}
          data-test="resetMFA"
          id="resetMFA"
          disabled={isLoading}
          onClick={handleReAuthorization}>
          Reset MFA
        </DynaSubmit>
        <TextButton
          data-test="cancelResetAuth"
          onClick={onClose} >
          Cancel
        </TextButton>
      </ActionGroup>
    </ModalDialog>
  );
}
