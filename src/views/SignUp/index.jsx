import React from 'react';
import SignUp from './SignupForm';
import UserSignInPage from '../../components/UserSignInPage';

export default function Signup(props) {
  return (
    <UserSignInPage
      pageTitle="Sign up"
      footerLinkLabel="Already have an account"
      footerLinkText="Sign in"
      footerLink="signin">
      <SignUp
        {...props}
        dialogOpen={false}
          />
    </UserSignInPage>

  );
}
