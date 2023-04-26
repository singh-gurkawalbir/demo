import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Typography} from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SIGN_UP_SUCCESS } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import getRoutePath from '../../../utils/routePaths';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import { OutlinedButton } from '../../../components/Buttons';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import { isGoogleSignInAllowed } from '../../../utils/resource';
import useQuery from '../../../hooks/useQuery';
import { SIGNUP_SEARCH_PARAMS } from '../../../constants/account';

const useStyles = makeStyles(theme => ({
  errorMessageSignup: {
    marginBottom: theme.spacing(1),
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

function validateQueryParam(params) {
  const validatedParam = {};

  Object.keys(params).forEach(key => {
    if (SIGNUP_SEARCH_PARAMS.includes(key)) {
      validatedParam[key] = params[key];
    }
  });

  return validatedParam;
}

const formKey = 'signupForm';
export default function SignUp() {
  const classes = useStyles();
  const [signUpInProgress, setSignUpInProgress] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const signupStatus = useSelector(state => selectors.signupStatus(state));
  const error = useSelector(state => selectors.signupMessage(state));
  const query = useQuery();
  const queryParams = Object.fromEntries(query);
  const attemptedRoute = location.state?.attemptedRoute;

  const validatedParam = validateQueryParam(queryParams);

  const handleSignup = useCallback(values => {
    dispatch(actions.auth.signup({...values, ...validatedParam}));
  }, [dispatch, validatedParam]);

  const handleOnSubmit = useCallback(values => {
    setSignUpInProgress(true);
    handleSignup(values);
  }, [handleSignup]);

  const handleSignUpWithGoogle = useCallback(e => {
    e.preventDefault();
    dispatch(actions.auth.signUpWithGoogle(e?.target?.attemptedRoute?.value || e?.target?.elements?.attemptedRoute?.value, validatedParam));
  }, [dispatch, validatedParam]);

  const fieldMeta = useMemo(() => getFieldMeta(userEmail), [userEmail]);

  useFormInitWithPermissions({formKey, fieldMeta});

  useEffect(() => {
    if (signupStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', SIGN_UP_SUCCESS));
    }
    if (signupStatus === 'failed') {
      setSignUpInProgress(false);
    }
  }, [dispatch, history, signupStatus]);

  return (
    <LoginFormWrapper>
      {signupStatus !== 'done' && (
      <div>
        {
        isGoogleSignInAllowed() && (
          <form onSubmit={handleSignUpWithGoogle}>
            <OutlinedButton
              type="submit"
              color="secondary"
              googleBtn>
              Sign up with Google
            </OutlinedButton>
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
          </form>

        )
}
      </div>
      )}
      { signupStatus === 'failed' && error && (
      <ShowErrorMessage error={error} className={classes.errorMessageSignup} />
      )}{signupStatus !== 'done' && (
        <>
          <DynaForm formKey={formKey} />
          <DynaSubmit
            fullWidth
            submit
            formKey={formKey}
            onClick={handleOnSubmit}
            ignoreFormTouchedCheck
            disabled={signUpInProgress}
        >
            Sign up
          </DynaSubmit>
        </>
      )}
    </LoginFormWrapper>
  );
}
