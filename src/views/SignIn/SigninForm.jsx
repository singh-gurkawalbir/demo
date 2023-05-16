import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useCallback, useEffect } from 'react';
import { Typography, InputAdornment} from '@mui/material';
import { useLocation, Link, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Spinner, OutlinedButton, TextButton } from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';
import ShowContentIcon from '../../components/icons/ShowContentIcon';
import HideContentIcon from '../../components/icons/HideContentIcon';
import SecurityIcon from '../../components/icons/SecurityIcon';
import { AUTH_FAILURE_MESSAGE } from '../../constants';
import getRoutePath from '../../utils/routePaths';
import getImageUrl from '../../utils/image';
import useQuery from '../../hooks/useQuery';
import { isGoogleSignInAllowed } from '../../utils/resource';
import { SubmitButton } from '../../components/Buttons/FilledButton';

const path = getImageUrl('images/googlelogo.png');

const useStyles = makeStyles(theme => ({
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
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
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(-2),
    marginBottom: 0,
    lineHeight: theme.spacing(2),
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
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

export default function SignIn({dialogOpen, className}) {
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
      return 'Sign in failed. Please try again.';
    }
    /* if (window.signInError && window.signinError !== 'undefined') {
      return window.signInError;
    } */ // Commented as error messages are captured through api response!

    return errorMessage;
  });
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const userProfileLinkedWithGoogle = useSelector(state => selectors.userProfileLinkedWithGoogle(state));
  const canUserLoginViaSSO = useSelector(state => selectors.isUserAllowedOptionalSSOSignIn(state));
  const showError = useSelector(state => selectors.showAuthError(state));

  const userHasOtherLoginOptions = (userEmail && userProfileLinkedWithGoogle) || canUserLoginViaSSO;

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

  const handleReSignInWithSSO = e => {
    e.preventDefault();
    dispatch(actions.auth.reSignInWithSSO());
  };

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
  const attemptedRoute = location.state?.attemptedRoute;

  return (
    // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <div className={clsx(classes.editableFields, className)}>
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
          id="email"
          type="email"
          variant="filled"
          placeholder="Email*"
          required
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
          type={showPassword ? 'text' : 'password'}
          required
          placeholder="Password*"
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
          <Typography
            data-private
            color="error"
            component="div"
            variant="h5"
            className={classes.alertMsg}>
            <ErrorIcon /> {error}
          </Typography>
        )}

        { isAuthenticating ? <Spinner />
          : (
            <SubmitButton
              data-test="submit"
              type="submit"
              role="button"
              value="Submit">
              Sign in
            </SubmitButton>
          )}
      </form>
      { !isAuthenticating && (
      <div>
        {!dialogOpen &&
        isGoogleSignInAllowed() && (
          <form onSubmit={handleSignInWithGoogle}>
            <TextField
              variant="standard"
              data-private
              type="hidden"
              id="attemptedRoute"
              name="attemptedRoute"
              value={attemptedRoute || getRoutePath('/')} />
            <div className={classes.or}>
              <Typography variant="body1">or</Typography>
            </div>
            <OutlinedButton
              type="submit"
              color="secondary"
              sx={{
                borderRadius: '4px',
                width: '100%',
                background: `url(${path}) 15% center no-repeat`,
                backgroundSize: '16px',
                height: 38,
                fontSize: '16px',
                backgroundColor: 'background.paper',
              }}>
              Sign in with Google
            </OutlinedButton>
          </form>
        )}
        {dialogOpen && userHasOtherLoginOptions && (
          <div className={classes.or}>
            <Typography variant="body1">or</Typography>
          </div>
        )}
        {dialogOpen && canUserLoginViaSSO && (
          <form onSubmit={handleReSignInWithSSO}>
            <OutlinedButton
              type="submit"
              className={classes.ssoBtn}
              startIcon={<SecurityIcon />}
              color="secondary">
              Sign in with SSO
            </OutlinedButton>
          </form>
        )}
        {dialogOpen && userEmail && userProfileLinkedWithGoogle &&
        isGoogleSignInAllowed() && (
        <form onSubmit={handleReSignInWithGoogle}>
          <OutlinedButton
            type="submit"
            color="secondary"
            sx={{
              borderRadius: '4px',
              width: '100%',
              background: `url(${path}) 15% center no-repeat`,
              backgroundSize: '16px',
              height: 38,
              fontSize: '16px',
              backgroundColor: 'background.paper',
            }}>
            Sign in with Google
          </OutlinedButton>
        </form>
        )}
      </div>
      )}
    </div>
  );
}

