import React from 'react';
import SignUpForm from './SignupForm';
import UserSignInPage from '../../components/UserSignInPage';

export default function Signup(props) {
  return (
    <UserSignInPage
      pageTitle="Sign up"
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
