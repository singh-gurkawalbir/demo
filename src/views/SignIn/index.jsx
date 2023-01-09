import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SigninForm from './SigninForm';
import { selectors } from '../../reducers';
import ConcurSignInPage from './Concur';
import useQuery from '../../hooks/useQuery';
import UserSignInPage from '../../components/UserSignInPage';
import actions from '../../actions';

function Signin(props) {
  const isSignupCompleted = useSelector(state => selectors.signupStatus(state) === 'done');
  const signupMessage = useSelector(state => selectors.signupMessage(state));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.auth.validateSession());
  }, [dispatch]);

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
