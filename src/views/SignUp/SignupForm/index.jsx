import { useDispatch, useSelector } from 'react-redux';
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SIGN_UP_SUCCESS } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import useQuery from '../../../hooks/useQuery';
import { SIGNUP_SEARCH_PARAMS } from '../../../constants/account';

const useStyles = makeStyles(theme => ({
  errorMessageSignup: {
    marginBottom: theme.spacing(1),
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
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const signupStatus = useSelector(state => selectors.signupStatus(state));
  const error = useSelector(state => selectors.signupMessage(state));
  const query = useQuery();
  const queryParams = Object.fromEntries(query);

  const validatedParam = validateQueryParam(queryParams);

  const handleSignup = useCallback(values => {
    dispatch(actions.auth.signup({...values, ...validatedParam}));
  }, [dispatch, validatedParam]);

  const handleOnSubmit = useCallback(values => {
    setSignUpInProgress(true);
    handleSignup(values);
  }, [handleSignup]);

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
