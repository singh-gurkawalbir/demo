import React from 'react';
import { useSelector } from 'react-redux';
import SignUpForm from './SignupForm';
import UserSignInPage from '../../components/UserSignInPage';
import { selectors } from '../../reducers';

export default function Signup(props) {
  const isSignupCompleted = useSelector(state => selectors.signupStatus(state) === 'done');
  const signupMessage = useSelector(state => selectors.signupMessage(state));

  return (
    <UserSignInPage
      pageTitle="Sign up"
      successMessage={isSignupCompleted ? signupMessage : ''}
      footerLinkLabel="Already have an account?"
      footerLinkText="Sign in"
      footerLink="signin">
      <SignUpForm
        {...props}
        dialogOpen={false}
          />
    </UserSignInPage>

  );
}
