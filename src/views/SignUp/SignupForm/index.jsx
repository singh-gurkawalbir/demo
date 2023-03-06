import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SIGN_UP_SUCCESS } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import getRoutePath from '../../../utils/routePaths';
import ShowErrorMessage from '../../../components/ShowErrorMessage';
import LoginFormWrapper from '../../../components/LoginScreen/LoginFormWrapper';
import useQuery from '../../../hooks/useQuery';

const formKey = 'signupForm';
export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const signupStatus = useSelector(state => selectors.signupStatus(state));
  const error = useSelector(state => selectors.signupMessage(state));
  const query = useQuery();
  const params = Object.fromEntries(query);

  const handleSignup = useCallback(values => {
    dispatch(actions.auth.signup({...values, ...params}));
  }, [dispatch, params]);

  const handleOnSubmit = useCallback(values => {
    handleSignup(values);
  }, [handleSignup]);

  const fieldMeta = useMemo(() => getFieldMeta(userEmail), [userEmail]);

  useFormInitWithPermissions({formKey, fieldMeta});

  useEffect(() => {
    if (signupStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', SIGN_UP_SUCCESS));
      history.replace(getRoutePath('/signin'));
    }
  }, [dispatch, history, signupStatus]);

  return (
    <LoginFormWrapper>
      { signupStatus === 'failed' && error && (
      <ShowErrorMessage error={error} />
      )}
      <DynaForm formKey={formKey} />
      <DynaSubmit
        fullWidth
        submit
        formKey={formKey}
        onClick={handleOnSubmit}
        ignoreFormTouchedCheck>
        Sign up
      </DynaSubmit>
    </LoginFormWrapper>
  );
}
