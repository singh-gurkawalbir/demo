import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { SubmitButton } from '../../../components/Buttons/FilledButton';

export default function ForgotPassword({setShowError, email, className}) {
  const dispatch = useDispatch();
  const [userEmail, setuserEmail] = useState(email || '');
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));

  useEffect(() => {
    if (resetRequestStatus === 'success') {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [resetRequestStatus, resetRequestErrorMsg, setShowError]);

  const handleAuthentication = useCallback(userEmail => {
    dispatch(actions.auth.resetRequest(userEmail));
  }, [dispatch]);
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const email = e?.target?.email?.value || e?.target?.elements?.email?.value;

    handleAuthentication(email);
  }, [handleAuthentication]);
  const handleOnChangeEmail = useCallback(e => {
    setuserEmail(e.target.value);
  }, []);

  return (
    <LoginFormWrapper className={className}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          type="email"
          variant="filled"
          placeholder="Email*"
          value={userEmail}
          onChange={handleOnChangeEmail}
          sx={{
            width: '100%',
            background: theme => theme.palette.background.paper,
            marginBottom: '10px',
          }}
        />
        <SubmitButton
          data-test="submit"
          type="submit"
          value="Submit">
          Request password reset
        </SubmitButton>
      </form>
    </LoginFormWrapper>
  );
}

