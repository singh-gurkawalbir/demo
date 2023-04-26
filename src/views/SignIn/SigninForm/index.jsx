import TextField from '@mui/material/TextField';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Typography } from '@mui/material';
import { useLocation, useHistory } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import SecurityIcon from '../../../components/icons/SecurityIcon';
import { AUTH_FAILURE_MESSAGE } from '../../../constants';
import getRoutePath from '../../../utils/routePaths';
import { OutlinedButton } from '../../../components/Buttons';
import useQuery from '../../../hooks/useQuery';
import { isGoogleSignInAllowed } from '../../../utils/resource';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  errorMsg: {
    fontSize: 16,
    marginBottom: theme.spacing(2),
  },
  submit: {
    marginBottom: theme.spacing(2),
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

}));

export default function SignIn({dialogOpen, className}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();

  const formKey = 'signinForm';
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
    /* if (window.signInError && window.signinError !== 'undefined') {
      return window.signInError;
    } */ // Commented as error messages are captured through api response!

    return errorMessage;
  });

  const formVal = useSelector(state => selectors.formValueTrimmed(state, formKey) || {}, shallowEqual);

  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const userProfileLinkedWithGoogle = useSelector(state => selectors.userProfileLinkedWithGoogle(state));
  const canUserLoginViaSSO = useSelector(state => selectors.isUserAllowedOptionalSSOSignIn(state));
  const showError = useSelector(state => selectors.showAuthError(state));

  const userHasOtherLoginOptions = (userEmail && userProfileLinkedWithGoogle) || canUserLoginViaSSO;

  const handleOnSubmit = useCallback(() => {
    handleAuthentication(formVal.email, formVal.password);
  }, [formVal.email, formVal.password, handleAuthentication]);

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
  useEffect(() => {
    if (isMFAAuthRequired) {
      history.push(getRoutePath('/mfa/verify'), location.state);
    }
  }, [history, isMFAAuthRequired, location.state]);
  const attemptedRoute = location.state?.attemptedRoute;

  const fieldMeta = useMemo(() => getFieldMeta({email: userEmail, isSessionExpired: dialogOpen}), [dialogOpen, userEmail]);

  useFormInitWithPermissions({formKey, fieldMeta});

  return (
  // user's email can be listed here ...type passwords is anyways redacted by logrocket
    <LoginFormWrapper className={className}>
      <form>
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
        <DynaForm formKey={formKey} />

        {!isAuthenticating && showError && error && (
        <ShowErrorMessage error={error} />
        )}
        {isAuthenticating ? <Spinner />
          : (
            <DynaSubmit
              id="submit"
              fullWidth
              submit
              formKey={formKey}
              className={classes.submit}
              onClick={handleOnSubmit}
              ignoreFormTouchedCheck>
              Sign in
            </DynaSubmit>
          )}
      </form>
      { !isAuthenticating && (
      <div>
        {!dialogOpen &&
        isGoogleSignInAllowed() && (
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
              googleBtn>
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

