import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { SubmitButton } from '../../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
}));

export default function ForgotPassword({setShowError, email, className}) {
  const dispatch = useDispatch();
  const classes = useStyles();
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
          className={classes.textField}
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

