import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SigninForm from './SigninForm';
import { selectors } from '../../reducers';
import ConcurSignInPage from './Concur';
import useQuery from '../../hooks/useQuery';
import UserSignInPage from '../../components/UserSignInPage';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

function Signin(props) {
  const isSignupCompleted = useSelector(state => selectors.signupStatus(state) === 'done');
  const signupMessage = useSelector(state => selectors.signupMessage(state));
  const history = useHistory();
  const {authenticated, mfaRequired, mfaVerified, mfaSetupRequired} = useSelector(selectors.sessionInfo, shallowEqual) || {};
  const dispatch = useDispatch();
  const isUserAuthenticated = authenticated && (!mfaRequired || (mfaRequired && mfaVerified)) && !mfaSetupRequired;

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

  useEffect(() => {
    if (isUserAuthenticated) {
      dispatch(actions.auth.initSession());
      history.push(getRoutePath('/home'));
    }
  }, [isUserAuthenticated, history, dispatch]);

  return (

    <UserSignInPage
      pageTitle=" Sign in"
      successMessage={isSignupCompleted ? signupMessage : ''}
      footerLinkLabel=" Don't have an account?"
      footerLinkText="Sign up"
      footerLink="signup">
      <SigninForm
        {...props}
        dialogOpen={false}
          />
    </UserSignInPage>
  );
}

export default function SignInWrapper(props) {
  const query = useQuery();
  const application = query.get('application');
  let SignInPage = Signin;

  if (application) {
    switch (application) {
      case 'concur':
        SignInPage = ConcurSignInPage;
        break;
      default:
        break;
    }
  }

  return <SignInPage {...props} />;
}
