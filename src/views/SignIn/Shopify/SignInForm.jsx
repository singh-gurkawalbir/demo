import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useCallback} from 'react';
import { Typography} from '@material-ui/core';
import { useLocation, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import ErrorIcon from '../../../components/icons/ErrorIcon';
import { getDomain } from '../../../utils/resource';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import getRoutePath from '../../../utils/routePaths';
import Spinner from '../../../components/Spinner';
import { FilledButton, OutlinedButton } from '../../../components/Buttons';
import getImageUrl from '../../../utils/image';

const path = getImageUrl('images/googlelogo.png');

const useStyles = makeStyles(theme => ({
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    margin: theme.spacing(1, 0, 2, 0),
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
  switchDomain: {
    margin: theme.spacing(5, 0, 3),
    display: 'inline-block',
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
  forgotPass: {
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
    minWidth: '240px',
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

function ForgotPassworLink({email = ''}) {
  const classes = useStyles();
  const fpLink = email ? `/request-reset?application=concur&email=${email}` : '/request-reset?application=concur';

  return (
    <p className={classes.forgotPass}>
      <a data-hook="forgot-password-link" href={fpLink}>Forgot Password?</a>
    </p>
  );
}

export default function SignIn({ dialogOpen, className, queryParam }) {
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

  window.signedInWithGoogle = () => {
    reInitializeSession();
  };
  window.signedInWithSSO = () => {
    reInitializeSession();
  };

  if (isMFAAuthRequired) {
    history.push(getRoutePath('/mfa/verify'));
  }
  const attemptedRoute = location && location.state && location.state.attemptedRoute;

  return (
  // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <div className={clsx(classes.editableFields, className)}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          required
          id="email"
          type="email"
          variant="filled"
          placeholder="Email *"
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
          placeholder="Password *"
          className={classes.textField}
        />

        <ForgotPassworLink email={email} />
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
              Sign in
            </FilledButton>
          )}
      </form>
      <div className={classes.or}>
        <Typography variant="body1">or</Typography>
      </div>
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

          <OutlinedButton
            type="submit"
            color="secondary"
            className={classes.googleBtn}>
            Sign in with Google
          </OutlinedButton>
        </form>
        )}
        {getDomain() !== 'eu.integrator.io' && <a className={classes.switchDomain} href={`https://eu.integrator.io/connection/shopify/oauth2callback?${queryParam}`}>Switch to EU domain</a>}
      </div>
      )}
    </div>
  );
}
