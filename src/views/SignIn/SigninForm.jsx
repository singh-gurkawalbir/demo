import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback} from 'react';
import { Typography} from '@material-ui/core';
import { useLocation, Link, useHistory} from 'react-router-dom';
import actions from '../../actions';
import { selectors } from '../../reducers';
import ErrorIcon from '../../components/icons/ErrorIcon';
import SecurityIcon from '../../components/icons/SecurityIcon';
import { getDomain } from '../../utils/resource';
import { AUTH_FAILURE_MESSAGE } from '../../constants';
import getRoutePath from '../../utils/routePaths';
import Spinner from '../../components/Spinner';
import { FilledButton, OutlinedButton, TextButton } from '../../components/Buttons';
import getImageUrl from '../../utils/image';

const path = getImageUrl('images/googlelogo.png');

const useStyles = makeStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
    color: theme.palette.warning.main,
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
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
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  forgotPass: {
    color: theme.palette.warning.main,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  googleBtn: {
    borderRadius: 4,
    width: '100%',
    background: `url(${path}) 15% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
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
  hidden: {
    display: 'none',
  },
  wrapper: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  label: {
    display: 'flex',
  },
}));

export default function SignIn({dialogOpen}) {
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

  const error = useSelector(state => {
    const errorMessage = selectors.authenticationErrored(state);

    if (errorMessage === AUTH_FAILURE_MESSAGE) {
      return 'Sign in failed. Please try again.';
    }
    if (window.signInError) {
      return window.signInError;
    }

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

  window.signedInWithGoogle = () => {
    reInitializeSession();
  };
  window.signedInWithSSO = () => {
    reInitializeSession();
  };

  if (isMFAAuthRequired) {
    history.push(getRoutePath('/mfa/verify'));
  }
  const attemptedRoute =
      location && location.state && location.state.attemptedRoute;

  return (
  // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <div className={classes.editableFields}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          type="email"
          variant="filled"
          placeholder="Email"
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
          type="password"
          placeholder="Password"
          className={classes.textField}
            />

        <div className={classes.forgotPass}>
          <TextButton
            data-test="forgotPassword"
            color="primary"
            className={classes.forgotPass}
            component={Link}
            to={email ? getRoutePath(`/request-reset?email=${email}`) : getRoutePath('/request-reset')}>
            Forgot password-UI?
          </TextButton>
        </div>
        { showError && error && (
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
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              value="Submit">
              Sign in (UI)
            </FilledButton>
          )}
      </form>
      { !isAuthenticating && getDomain() !== 'eu.integrator.io' && (
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
          <div className={classes.or}>
            <Typography variant="body1">or</Typography>
          </div>
          <OutlinedButton
            type="submit"
            color="secondary"
            className={classes.googleBtn}>
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
        {dialogOpen && userEmail && userProfileLinkedWithGoogle && (
        <form onSubmit={handleReSignInWithGoogle}>
          <OutlinedButton
            type="submit"
            color="secondary"
            className={classes.googleBtn}>
            Sign in with Google
          </OutlinedButton>
        </form>
        )}
      </div>
      )}
    </div>
  );
}

