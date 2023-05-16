import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import LoginFormWrapper from '../../components/LoginScreen/LoginFormWrapper';
import { SubmitButton } from '../../components/Buttons/FilledButton';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
}));

export default function SignInSSOForm() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));
  const handleSignInWithSSO = e => {
    e.preventDefault();
    dispatch(actions.auth.reSignInWithSSO());
  };

  window.signedInWithSSO = () => {
    dispatch(actions.auth.initSession());
  };

  return (
    <LoginFormWrapper>
      <TextField
        data-test="email"
        id="email"
        type="email"
        variant="filled"
        placeholder="Email*"
        required
        value={userEmail}
        className={classes.textField}
        disabled />
      {isAuthenticating ? <Spinner /> : (
        <SubmitButton
          data-test="submit"
          type="submit"
          onClick={handleSignInWithSSO} >
          Sign in with SSO
        </SubmitButton>
      )}
    </LoginFormWrapper>
  );
}

