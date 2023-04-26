import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useCallback, useEffect } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import { useLocation, Link, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { getDomain, isGoogleSignInAllowed } from '../../../utils/resource';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import getRoutePath from '../../../utils/routePaths';
import { FilledButton, OutlinedButton, TextButton } from '../../../components/Buttons';
import useQuery from '../../../hooks/useQuery';
import ShowContentIcon from '../../../components/icons/ShowContentIcon';
import HideContentIcon from '../../../components/icons/HideContentIcon';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(1, 0, 2, 0),
  },
  switchDomain: {
    margin: theme.spacing(5, 0, 3),
    display: 'inline-block',
  },
  textField: {
    width: '100%',
    minWidth: '100%',
    marginBottom: theme.spacing(1),
    position: 'relative',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingRight: 4,
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& >.MuiFilledInput-root': {
      '& > input': {
        border: 'none',
      },
    },
  },
  errorMsg: {
    fontSize: 16,
    marginBottom: theme.spacing(2),
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  forgotPass: {
    color: theme.palette.primary.dark,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  ssoBtn: {
    borderRadius: 4,
    width: '100%',
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    margin: theme.spacing(0, 0, 2, 0),
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'space-around',
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(16),
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: theme.spacing(2, 0),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
  },
  passwordTextField: {
    '& * >.MuiFilledInput-input': {
      letterSpacing: '2px',
      '&::placeholder': {
        letterSpacing: '1px',
      },
    },
  },
  iconPassword: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
}));

export default function SignIn({ dialogOpen, className, queryParam }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const query = useQuery();

  const handleAuthentication = useCallback((email, password) => {
    dispatch(actions.auth.request(email, password, true));
  }, [dispatch]);

  const reInitializeSession = useCallback(() => {
    dispatch(actions.auth.initSession({reload: true}));
  }, [dispatch]);

  const isAuthenticating = useSelector(state => selectors.isAuthenticating(state));

  const isMFAAuthRequired = useSelector(state => selectors.isMFAAuthRequired(state));

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

  const handleShowPassword = () => setShowPassword(showPassword => !showPassword);

  window.signedInWithGoogle = () => {
    reInitializeSession();
  };
  window.signedInWithSSO = () => {
    reInitializeSession();
  };

  useEffect(() => {
    if (isMFAAuthRequired) {
      history.push(getRoutePath('/mfa/verify'), location.state);
    }
  }, [history, isMFAAuthRequired, location.state]);
  const attemptedRoute = location && location.state && location.state.attemptedRoute;

  return (
  // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <LoginFormWrapper className={className}>
      {!isAuthenticating && !showError && query.get('msg') && (
      <Typography
        data-private
        color="error"
        component="div"
        variant="h4"
        className={classes.errorMsg}>
        {query.get('msg')}
      </Typography>
      )}
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          required
          id="email"
          type="email"
          variant="filled"
          placeholder="Email *"
          value={email}
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
          type={showPassword ? 'text' : 'password'}
          placeholder="Password *"
          className={clsx(classes.textField, classes.passwordTextField)}
          InputProps={{
            endAdornment: (true) &&
              (
                <InputAdornment position="end">
                    {showPassword ? (
                      <ShowContentIcon
                        className={classes.iconPassword}
                        onClick={handleShowPassword} />
                    )
                      : (
                        <HideContentIcon
                          className={classes.iconPassword}
                          onClick={handleShowPassword} />
                      )}
                </InputAdornment>
              ),
          }}
        />

        <div className={classes.forgotPass}>
          <TextButton
            data-test="forgotPassword"
            color="primary"
            component={Link}
            role="link"
            to={email ? getRoutePath(`/request-reset?email=${email}`) : getRoutePath('/request-reset')}>
            Forgot password?
          </TextButton>
        </div>
        {!isAuthenticating && showError && error && (
          <ShowErrorMessage error={error} />
        )}
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              role="button"
              className={classes.submit}
              submit
              value="Submit">
              Sign in
            </FilledButton>
          )}
      </form>

      {!isAuthenticating && (
      <div>
        {!dialogOpen && isGoogleSignInAllowed() && (
          <div>
            <div className={classes.or}>
              <Typography variant="body1">or</Typography>
            </div>
            <form onSubmit={handleSignInWithGoogle}>
              <TextField
                variant="standard"
                data-private
                type="hidden"
                id="attemptedRoute"
                name="attemptedRoute"
                value={attemptedRoute || getRoutePath('/')} />
              <OutlinedButton
                type="submit"
                color="secondary"
                googleBtn>
                Sign in with Google
              </OutlinedButton>
            </form>
          </div>
        )}
        {getDomain() !== 'eu.integrator.io' && <a data-test="euSignIn" className={classes.switchDomain} href={`https://eu.integrator.io/connection/shopify/oauth2callback?${queryParam}`}>Switch to EU domain</a>}
      </div>
      )}
    </LoginFormWrapper>
  );
}
