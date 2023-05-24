import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import getRoutePath from '../../../utils/routePaths';
import Spinner from '../../../components/Spinner';
import { FilledButton, OutlinedButton } from '../../../components/Buttons';
import { isGoogleSignInAllowed } from '../../../utils/resource';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(1, 0, 2, 0),
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },

  forgotPass: {
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  googleBtn: {
    minWidth: '240px',
    margin: theme.spacing(0, 0, 2, 0),
  },
  passwordTextField: {
    '& * >.MuiFilledInput-input': {
      letterSpacing: '2px',
      '&::placeholder': {
        letterSpacing: '1px',
      },
    },
  },
}));

function ForgotPassworLink({email = ''}) {
  const classes = useStyles();
  const fpLink = email ? `/request-reset?application=concur&email=${email}` : '/request-reset?application=concur';

  return (
    <p align="center">
      <a className={classes.forgotPass} data-hook="forgot-password-link" href={fpLink}>Forgot Password?</a>
    </p>
  );
}

export default function SignIn({dialogOpen, className}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const history = useHistory();
  const handleAuthentication = useCallback((email, password) => {
    dispatch(actions.auth.request(email, password, true));
  }, [dispatch]);

  const reInitializeSession = useCallback(() => {
    dispatch(actions.auth.initSession({reload: true}));
  }, [dispatch]);

  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));
  const isMFAAuthRequired = useSelector(state => selectors.isMFAAuthRequired(state));
  const isMFAAuthVerificationRequired = useSelector(selectors.isMFAVerificationRequired);

  const error = useSelector(state => {
    const errorMessage = selectors.authenticationErrored(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return message.USER_SIGN_IN.SIGNIN_FAILED;
    }
    if (window.signInError && window.signinError !== 'undefined') {
      return window.signInError;
    }

    return errorMessage;
  });
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const userProfileLinkedWithGoogle = useSelector(state => selectors.userProfileLinkedWithGoogle(state));
  const showError = useSelector(state => selectors.showAuthError(state));

  const handleOnChangeEmail = useCallback(e => {
    setEmail(e.target.value);
  }, []);

  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const email = e?.target?.email?.value || e?.target?.elements?.email?.value;
    const password = e?.target?.password?.value || e?.target?.elements?.password?.value;

    handleAuthentication(email, password);
  }, [handleAuthentication]);

  const handleSignInWithGoogle = useCallback(e => {
    e.preventDefault();
    dispatch(actions.auth.signInWithGoogle(e?.target?.attemptedRoute?.value || e?.target?.elements?.attemptedRoute?.value));
  }, [dispatch]);

  const handleReSignInWithGoogle = useCallback(e => {
    e.preventDefault();
    dispatch(actions.auth.reSignInWithGoogle(userEmail));
  }, [dispatch, userEmail]);

  window.signedInWithGoogle = () => {
    reInitializeSession();
  };
  window.signedInWithSSO = () => {
    reInitializeSession();
  };

  useEffect(() => {
    if (isMFAAuthRequired || isMFAAuthVerificationRequired) {
      history.push(getRoutePath('/mfa/verify'), location.state);
    }
  }, [history, isMFAAuthRequired, isMFAAuthVerificationRequired, location.state]);
  const attemptedRoute = location.state?.attemptedRoute;

  return (
  // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <LoginFormWrapper className={className}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          required
          id="email"
          type="email"
          variant="filled"
          placeholder="Email*"
          value={dialogOpen ? userEmail : email}
          onChange={handleOnChangeEmail}
          className={classes.textField}
          disabled={dialogOpen}
        />
        <TextField
          data-private
          data-test="password"
          id="password"
          variant="filled"
          required
          type="password"
          placeholder="Password*"
          className={clsx(classes.textField, classes.passwordTextField)}
        />

        <ForgotPassworLink email={email} />
        {!isAuthenticating && showError && error && (
        <ShowErrorMessage error={error} />
        )}
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              submit
              value="Submit">
              Sign in and connect
            </FilledButton>
          )}
      </form>
      { !isAuthenticating &&
      isGoogleSignInAllowed() && (
      <div>
        {!dialogOpen && (
        <form onSubmit={handleSignInWithGoogle}>
          <TextField
            data-private
            type="hidden"
            id="attemptedRoute"
            name="attemptedRoute"
            value={attemptedRoute || getRoutePath('/')}
          />

          <OutlinedButton
            type="submit"
            color="secondary"
            className={classes.googleBtn}
            googleBtn>
            Sign in with Google
          </OutlinedButton>
        </form>
        )}
        {dialogOpen && userEmail && userProfileLinkedWithGoogle &&
         isGoogleSignInAllowed() && (
         <form onSubmit={handleReSignInWithGoogle}>
           <OutlinedButton
             type="submit"
             color="secondary"
             className={classes.googleBtn}
             googleBtn>
             Sign in with Google
           </OutlinedButton>
         </form>
        )}
      </div>
      )}
    </LoginFormWrapper>
  );
}

